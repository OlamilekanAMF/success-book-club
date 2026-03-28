/**
 * Google Books API Cache Middleware
 * Implements intelligent caching with different TTLs for different query types
 */

const cache = new Map();

const CACHE_TTL = {
    TRENDING: 30 * 60 * 1000,    // 30 minutes for trending/new releases
    NEW_RELEASES: 30 * 60 * 1000, // 30 minutes for new releases
    SEARCH: 15 * 60 * 1000,      // 15 minutes for search results
    CATEGORY: 60 * 60 * 1000,     // 1 hour for category searches
    AUTHOR: 60 * 60 * 1000,       // 1 hour for author searches
    DEFAULT: 15 * 60 * 1000       // 15 minutes default
};

function generateCacheKey(query, params = {}) {
    return `${query}:${JSON.stringify(params)}`;
}

function determineTTL(query) {
    const q = query.toLowerCase();
    
    if (q.includes('bestseller') || q.includes('trending') || q.includes('popular')) {
        return CACHE_TTL.TRENDING;
    }
    if (q.includes('newest') || q.includes('new release')) {
        return CACHE_TTL.NEW_RELEASES;
    }
    if (q.includes('subject:')) {
        return CACHE_TTL.CATEGORY;
    }
    if (q.includes('inauthor:')) {
        return CACHE_TTL.AUTHOR;
    }
    return CACHE_TTL.SEARCH;
}

function getCachedData(key) {
    const cached = cache.get(key);
    if (!cached) return null;
    
    if (Date.now() > cached.expiresAt) {
        cache.delete(key);
        return null;
    }
    
    return cached.data;
}

function setCacheData(key, data, ttl) {
    cache.set(key, {
        data,
        expiresAt: Date.now() + ttl
    });
}

function clearCache() {
    cache.clear();
}

function getCacheStats() {
    let validEntries = 0;
    cache.forEach((value) => {
        if (Date.now() < value.expiresAt) {
            validEntries++;
        }
    });
    
    return {
        totalEntries: cache.size,
        validEntries,
        expiredEntries: cache.size - validEntries
    };
}

const cacheMiddleware = (ttl = CACHE_TTL.DEFAULT) => {
    return (req, res, next) => {
        const cacheKey = generateCacheKey(req.originalUrl, req.query);
        const cached = getCachedData(cacheKey);
        
        if (cached) {
            res.locals.fromCache = true;
            res.locals.cachedData = cached;
        }
        
        const effectiveTTL = ttl || determineTTL(req.query.q || '');
        res.locals.cacheTTL = effectiveTTL;
        res.locals.cacheKey = cacheKey;
        
        next();
    };
};

const cacheResponse = (req, res, data) => {
    const cacheKey = res.locals.cacheKey;
    if (cacheKey && data) {
        setCacheData(cacheKey, data, res.locals.cacheTTL);
    }
};

module.exports = {
    CACHE_TTL,
    cacheMiddleware,
    cacheResponse,
    getCachedData,
    setCacheData,
    clearCache,
    getCacheStats,
    generateCacheKey
};
