const API_BASE_URL = 'http://localhost:3001';

// Storage keys - MUST match shared-auth.js
const USER_KEY = 'tbc_user';
const TOKEN_KEY = 'tbc_token';

let currentUser = null;

// Initialize on load - restore session
(function initAuth() {
    const storedUser = localStorage.getItem(USER_KEY);
    const storedToken = localStorage.getItem(TOKEN_KEY);
    
    if (storedUser) {
        try {
            currentUser = JSON.parse(storedUser);
            window.isLoggedIn = true;
            window.currentUser = currentUser;
        } catch (e) {
            console.error('Failed to parse stored user:', e);
            localStorage.removeItem(USER_KEY);
            localStorage.removeItem(TOKEN_KEY);
        }
    }
})();

async function login(email, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password }),
            credentials: 'include'
        });

        const data = await response.json();

        if (response.ok) {
            currentUser = data.user;
            // Use same keys as shared-auth.js
            localStorage.setItem(USER_KEY, JSON.stringify(data.user));
            localStorage.setItem(TOKEN_KEY, data.session?.access_token || '');
            window.currentUser = currentUser;
            window.isLoggedIn = true;
            return { success: true, user: data.user };
        } else {
            return { success: false, error: data.error || 'Login failed' };
        }
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, error: 'Network error. Please try again.' };
    }
}

async function register(email, password, full_name) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password, full_name }),
            credentials: 'include'
        });

        const data = await response.json();

        if (response.ok) {
            currentUser = data.user;
            localStorage.setItem(USER_KEY, JSON.stringify(data.user));
            localStorage.setItem(TOKEN_KEY, data.session?.access_token || '');
            window.currentUser = currentUser;
            window.isLoggedIn = true;
            return { success: true, user: data.user };
        } else {
            return { success: false, error: data.error || 'Registration failed' };
        }
    } catch (error) {
        console.error('Register error:', error);
        return { success: false, error: 'Network error. Please try again.' };
    }
}

async function logout() {
    try {
        const token = localStorage.getItem(TOKEN_KEY);
        
        await fetch(`${API_BASE_URL}/api/auth/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            credentials: 'include'
        });
    } catch (error) {
        console.error('Logout error:', error);
    } finally {
        currentUser = null;
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(TOKEN_KEY);
        window.currentUser = null;
        window.isLoggedIn = false;
    }
}

async function checkAuth() {
    const token = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);

    // If no token but have stored user, try to use stored user
    if (!token && storedUser) {
        currentUser = JSON.parse(storedUser);
        window.currentUser = currentUser;
        window.isLoggedIn = true;
        return true;
    }

    if (!token && !storedUser) {
        return false;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            credentials: 'include'
        });

        if (response.ok) {
            const data = await response.json();
            currentUser = data.user;
            localStorage.setItem(USER_KEY, JSON.stringify(data.user));
            window.currentUser = currentUser;
            return true;
        } else {
            if (storedUser) {
                currentUser = JSON.parse(storedUser);
                window.currentUser = currentUser;
                window.isLoggedIn = true;
                return true;
            }
            currentUser = null;
            localStorage.removeItem(USER_KEY);
            localStorage.removeItem(TOKEN_KEY);
            window.currentUser = null;
            window.isLoggedIn = false;
            return false;
        }
    } catch (error) {
        console.error('Check auth error:', error);
        if (storedUser) {
            currentUser = JSON.parse(storedUser);
            window.currentUser = currentUser;
            window.isLoggedIn = true;
            return true;
        }
        return false;
    }
}

function isLoggedIn() {
    return !!currentUser || !!localStorage.getItem(USER_KEY);
}

function getCurrentUser() {
    if (currentUser) return currentUser;
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
}

async function loginWithGoogle() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/google`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        
        if (data.url) {
            window.location.href = data.url;
        } else {
            return { success: false, error: 'Google login not configured' };
        }
    } catch (error) {
        console.error('Google login error:', error);
        return { success: false, error: 'Google login failed' };
    }
}

async function loginWithFacebook() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/facebook`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        
        if (data.url) {
            window.location.href = data.url;
        } else {
            return { success: false, error: 'Facebook login not configured' };
        }
    } catch (error) {
        console.error('Facebook login error:', error);
        return { success: false, error: 'Facebook login failed' };
    }
}

async function updateProfile(updates) {
    try {
        const token = localStorage.getItem(TOKEN_KEY);
        
        const response = await fetch(`${API_BASE_URL}/api/users/me`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updates),
            credentials: 'include'
        });

        const data = await response.json();

        if (response.ok) {
            currentUser = data.user;
            localStorage.setItem(USER_KEY, JSON.stringify(data.user));
            return { success: true, user: data.user };
        } else {
            return { success: false, error: data.error || 'Update failed' };
        }
    } catch (error) {
        console.error('Update profile error:', error);
        return { success: false, error: 'Network error. Please try again.' };
    }
}

async function changePassword(currentPassword, newPassword) {
    try {
        const token = localStorage.getItem(TOKEN_KEY);
        
        const response = await fetch(`${API_BASE_URL}/api/users/me/password`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                current_password: currentPassword,
                new_password: newPassword
            }),
            credentials: 'include'
        });

        const data = await response.json();

        if (response.ok) {
            return { success: true };
        } else {
            return { success: false, error: data.error || 'Password change failed' };
        }
    } catch (error) {
        console.error('Change password error:', error);
        return { success: false, error: 'Network error. Please try again.' };
    }
}

async function updateAvatar(avatarUrl) {
    try {
        const token = localStorage.getItem(TOKEN_KEY);
        
        const response = await fetch(`${API_BASE_URL}/api/users/avatar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ avatar_url: avatarUrl }),
            credentials: 'include'
        });

        const data = await response.json();

        if (response.ok) {
            if (currentUser) {
                currentUser.avatar_url = avatarUrl;
                localStorage.setItem(USER_KEY, JSON.stringify(currentUser));
            }
            return { success: true };
        } else {
            return { success: false, error: data.error || 'Avatar update failed' };
        }
    } catch (error) {
        console.error('Update avatar error:', error);
        return { success: false, error: 'Network error. Please try again.' };
    }
}

async function upgradeMembership(tier) {
    try {
        const token = localStorage.getItem(TOKEN_KEY);
        
        const response = await fetch(`${API_BASE_URL}/api/users/me/upgrade`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ tier }),
            credentials: 'include'
        });

        const data = await response.json();

        if (response.ok) {
            currentUser = data.user;
            localStorage.setItem(USER_KEY, JSON.stringify(data.user));
            return { success: true, user: data.user };
        } else {
            return { success: false, error: data.error || 'Upgrade failed' };
        }
    } catch (error) {
        console.error('Upgrade membership error:', error);
        return { success: false, error: 'Network error. Please try again.' };
    }
}

async function getUserLibrary() {
    try {
        const token = localStorage.getItem(TOKEN_KEY);
        
        const response = await fetch(`${API_BASE_URL}/api/library`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        return { success: true, library: data.library || [] };
    } catch (error) {
        console.error('Get library error:', error);
        return { success: false, error: 'Failed to get library' };
    }
}

async function getLibraryDashboard() {
    try {
        const token = localStorage.getItem(TOKEN_KEY);
        
        const response = await fetch(`${API_BASE_URL}/api/library/dashboard`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        console.error('Get dashboard error:', error);
        return { success: false, error: 'Failed to get dashboard data' };
    }
}

async function addToLibrary(bookId) {
    try {
        const token = localStorage.getItem(TOKEN_KEY);
        
        const response = await fetch(`${API_BASE_URL}/api/library`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ book_id: bookId })
        });

        const data = await response.json();
        return { success: response.ok, message: data.message, error: data.error };
    } catch (error) {
        console.error('Add to library error:', error);
        return { success: false, error: 'Failed to add to library' };
    }
}

async function removeFromLibrary(bookId) {
    try {
        const token = localStorage.getItem(TOKEN_KEY);
        
        const response = await fetch(`${API_BASE_URL}/api/library/${bookId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        return { success: response.ok };
    } catch (error) {
        console.error('Remove from library error:', error);
        return { success: false, error: 'Failed to remove from library' };
    }
}

async function getNotifications(unreadOnly = false) {
    try {
        const token = localStorage.getItem(TOKEN_KEY);
        
        const response = await fetch(`${API_BASE_URL}/api/notifications?unread_only=${unreadOnly}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        return { success: true, notifications: data.notifications || [], unreadCount: data.unread_count || 0 };
    } catch (error) {
        console.error('Get notifications error:', error);
        return { success: false, error: 'Failed to get notifications' };
    }
}

async function markNotificationRead(notificationId) {
    try {
        const token = localStorage.getItem(TOKEN_KEY);
        
        const response = await fetch(`${API_BASE_URL}/api/notifications/${notificationId}/read`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        return { success: response.ok };
    } catch (error) {
        console.error('Mark notification read error:', error);
        return { success: false };
    }
}

async function markAllNotificationsRead() {
    try {
        const token = localStorage.getItem(TOKEN_KEY);
        
        const response = await fetch(`${API_BASE_URL}/api/notifications/read-all`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        return { success: response.ok };
    } catch (error) {
        console.error('Mark all read error:', error);
        return { success: false };
    }
}

async function getEvents(upcoming = true) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/events?upcoming=${upcoming}`);
        const data = await response.json();
        return { success: true, events: data.events || [] };
    } catch (error) {
        console.error('Get events error:', error);
        return { success: false, error: 'Failed to get events' };
    }
}

async function registerForEvent(eventId) {
    try {
        const token = localStorage.getItem(TOKEN_KEY);
        
        const response = await fetch(`${API_BASE_URL}/api/events/${eventId}/register`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        return { success: response.ok, message: data.message, error: data.error };
    } catch (error) {
        console.error('Register for event error:', error);
        return { success: false, error: 'Failed to register for event' };
    }
}

async function getArticles(category = null) {
    try {
        let url = `${API_BASE_URL}/api/articles`;
        if (category) url += `?category=${encodeURIComponent(category)}`;
        
        const response = await fetch(url);
        const data = await response.json();
        return { success: true, articles: data.articles || [], pagination: data.pagination };
    } catch (error) {
        console.error('Get articles error:', error);
        return { success: false, error: 'Failed to get articles' };
    }
}

async function getArticleById(articleId) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/articles/${articleId}`);
        const data = await response.json();
        return { success: response.ok, article: data.article, comments: data.comments || [] };
    } catch (error) {
        console.error('Get article error:', error);
        return { success: false, error: 'Failed to get article' };
    }
}

async function createArticle(articleData) {
    try {
        const token = localStorage.getItem(TOKEN_KEY);
        
        const response = await fetch(`${API_BASE_URL}/api/articles`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(articleData)
        });

        const data = await response.json();
        return { success: response.ok, article: data.article, message: data.message, error: data.error };
    } catch (error) {
        console.error('Create article error:', error);
        return { success: false, error: 'Failed to create article' };
    }
}

async function getMyArticles() {
    try {
        const token = localStorage.getItem(TOKEN_KEY);
        
        const response = await fetch(`${API_BASE_URL}/api/articles/my-articles`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        return { success: true, articles: data.articles || [] };
    } catch (error) {
        console.error('Get my articles error:', error);
        return { success: false, error: 'Failed to get articles' };
    }
}

async function createEvent(eventData) {
    try {
        const token = localStorage.getItem(TOKEN_KEY);
        
        const response = await fetch(`${API_BASE_URL}/api/events`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(eventData)
        });

        const data = await response.json();
        return { success: response.ok, event: data.event, message: data.message, error: data.error };
    } catch (error) {
        console.error('Create event error:', error);
        return { success: false, error: 'Failed to create event' };
    }
}

function isPremium() {
    const user = getCurrentUser();
    return user?.membership_tier === 'premium' || user?.membership_tier === 'author';
}

function isAuthor() {
    const user = getCurrentUser();
    return user?.membership_tier === 'author';
}
