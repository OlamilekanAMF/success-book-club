/**
 * Rate Limiting Middleware for Google Books API
 * Implements token bucket algorithm with different limits for anonymous vs logged-in users
 */

const requestCounts = new Map();
const RATE_LIMIT_ANONYMOUS = 100;  // requests per minute for anonymous users
const RATE_LIMIT_AUTHENTICATED = 200; // requests per minute for logged-in users
const RATE_WINDOW = 60 * 1000; // 1 minute window

function getClientIdentifier(req) {
    // Use Supabase auth ID if available (logged-in user)
    const authId = req.user?.id || req.headers['x-user-id'];
    if (authId) {
        return `auth:${authId}`;
    }
    
    // Fall back to IP address for anonymous users
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 
                req.connection?.remoteAddress || 
                req.ip ||
                'unknown';
    return `ip:${ip}`;
}

function cleanupOldEntries() {
    const now = Date.now();
    for (const [key, data] of requestCounts.entries()) {
        if (now - data.windowStart > RATE_WINDOW * 2) {
            requestCounts.delete(key);
        }
    }
}

function getRateLimitInfo(req) {
    const identifier = getClientIdentifier(req);
    const now = Date.now();
    const isAuthenticated = identifier.startsWith('auth:');
    
    const limit = isAuthenticated ? RATE_LIMIT_AUTHENTICATED : RATE_LIMIT_ANONYMOUS;
    
    let clientData = requestCounts.get(identifier);
    
    // Reset window if expired
    if (!clientData || now - clientData.windowStart > RATE_WINDOW) {
        clientData = {
            windowStart: now,
            count: 0
        };
        requestCounts.set(identifier, clientData);
    }
    
    const remaining = Math.max(0, limit - clientData.count);
    const resetTime = clientData.windowStart + RATE_WINDOW;
    const retryAfter = Math.ceil((resetTime - now) / 1000);
    
    return {
        limit,
        remaining,
        reset: Math.ceil(resetTime / 1000),
        retryAfter,
        isAuthenticated
    };
}

function rateLimitMiddleware(req, res, next) {
    // Cleanup old entries periodically (10% chance on each request)
    if (Math.random() < 0.1) {
        cleanupOldEntries();
    }
    
    const identifier = getClientIdentifier(req);
    const now = Date.now();
    
    let clientData = requestCounts.get(identifier);
    
    // Initialize or reset window
    if (!clientData || now - clientData.windowStart > RATE_WINDOW) {
        clientData = {
            windowStart: now,
            count: 0
        };
        requestCounts.set(identifier, clientData);
    }
    
    const isAuthenticated = identifier.startsWith('auth:');
    const limit = isAuthenticated ? RATE_LIMIT_AUTHENTICATED : RATE_LIMIT_ANONYMOUS;
    
    // Check if limit exceeded
    if (clientData.count >= limit) {
        const resetTime = clientData.windowStart + RATE_WINDOW;
        const retryAfter = Math.ceil((resetTime - now) / 1000);
        
        res.set({
            'X-RateLimit-Limit': limit,
            'X-RateLimit-Remaining': 0,
            'X-RateLimit-Reset': Math.ceil(resetTime / 1000),
            'Retry-After': retryAfter
        });
        
        return res.status(429).json({
            success: false,
            error: {
                code: 'RATE_LIMITED',
                message: 'Too many requests. Please try again later.',
                retryAfter
            }
        });
    }
    
    // Increment counter
    clientData.count++;
    
    // Set rate limit headers
    const remaining = limit - clientData.count;
    const resetTime = clientData.windowStart + RATE_WINDOW;
    
    res.set({
        'X-RateLimit-Limit': limit,
        'X-RateLimit-Remaining': remaining,
        'X-RateLimit-Reset': Math.ceil(resetTime / 1000)
    });
    
    next();
}

function getRateLimitStats() {
    cleanupOldEntries();
    let anonymousCount = 0;
    let authenticatedCount = 0;
    
    requestCounts.forEach((_, key) => {
        if (key.startsWith('auth:')) {
            authenticatedCount++;
        } else {
            anonymousCount++;
        }
    });
    
    return {
        totalClients: requestCounts.size,
        anonymousClients: anonymousCount,
        authenticatedClients: authenticatedCount,
        anonymousLimit: RATE_LIMIT_ANONYMOUS,
        authenticatedLimit: RATE_LIMIT_AUTHENTICATED
    };
}

function resetRateLimit(identifier = null) {
    if (identifier) {
        requestCounts.delete(identifier);
    } else {
        requestCounts.clear();
    }
}

module.exports = {
    rateLimitMiddleware,
    getRateLimitInfo,
    getRateLimitStats,
    resetRateLimit,
    RATE_LIMIT_ANONYMOUS,
    RATE_LIMIT_AUTHENTICATED,
    RATE_WINDOW
};
