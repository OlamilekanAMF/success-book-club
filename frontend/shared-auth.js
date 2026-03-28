/**
 * Shared Auth Script - Include this on all pages that need authentication
 * Add before closing </body> tag: <script src="frontend/shared-auth.js"></script>
 * 
 * This script handles:
 * - Auth modal open/close
 * - Login/Signup form submissions
 * - Social login buttons
 * - User profile display
 * - Logout functionality
 */

(function() {
    'use strict';

    // Don't initialize twice
    if (window._sharedAuthInitialized) return;
    window._sharedAuthInitialized = true;

    const API_BASE_URL = 'http://localhost:3001';

    // Storage keys
    const USER_KEY = 'tbc_user';
    const TOKEN_KEY = 'tbc_token';

    // Initialize on page load
    function init() {
        restoreSession();
        setupAuthModal();
        setupForms();
    }

    // Restore session from localStorage
    function restoreSession() {
        const storedUser = localStorage.getItem(USER_KEY);
        const storedToken = localStorage.getItem(TOKEN_KEY);
        
        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                window.currentUser = user;
                window.isLoggedIn = true;
                updateUserProfile(user);
                console.log('Session restored for:', user.email || user.full_name);
            } catch (e) {
                console.error('Failed to parse stored user:', e);
                localStorage.removeItem(USER_KEY);
                localStorage.removeItem(TOKEN_KEY);
            }
        }
    }

    // Setup auth modal functionality
    function setupAuthModal() {
        const authModal = document.getElementById('authModal');
        if (!authModal) return;

        const loginFormContainer = document.getElementById('loginForm');
        const signupFormContainer = document.getElementById('signupForm');
        const userProfileContainer = document.getElementById('userProfile');
        const authModalClose = document.querySelector('.auth-modal-close');
        const authModalBackdrop = document.querySelector('.auth-modal-backdrop');

        function getScrollbarWidth() {
            return window.innerWidth - document.documentElement.clientWidth;
        }

        // Open auth modal
        window.openAuthModal = function(tab = 'login') {
            // If already logged in, show profile instead
            if (isLoggedIn()) {
                showUserProfile();
                return;
            }
            
            const scrollbarWidth = getScrollbarWidth();
            document.documentElement.style.setProperty('--scrollbar-width', scrollbarWidth + 'px');
            authModal.style.display = '';
            authModal.classList.add('active');
            document.body.classList.add('modal-open');
            
            if (tab === 'signup') {
                showSignup(new Event('click'));
            } else {
                showLogin(new Event('click'));
            }
        };

        // Close modal
        function closeAuthModal() {
            authModal.classList.remove('active');
            document.body.classList.remove('modal-open');
            setTimeout(() => {
                if (!authModal.classList.contains('active')) {
                    authModal.style.display = '';
                }
            }, 350);
        }

        authModalClose?.addEventListener('click', closeAuthModal);
        authModalBackdrop?.addEventListener('click', closeAuthModal);

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && authModal.classList.contains('active')) {
                closeAuthModal();
            }
        });

        // Toggle between login and signup
        window.showSignup = function(e) {
            if (e) e.preventDefault();
            if (loginFormContainer) loginFormContainer.style.display = 'none';
            if (signupFormContainer) signupFormContainer.style.display = 'block';
            if (userProfileContainer) userProfileContainer.style.display = 'none';
            const titleEl = document.getElementById('authModalTitle');
            if (titleEl) titleEl.textContent = 'Create Account';
        };

        window.showLogin = function(e) {
            if (e) e.preventDefault();
            if (loginFormContainer) loginFormContainer.style.display = 'block';
            if (signupFormContainer) signupFormContainer.style.display = 'none';
            if (userProfileContainer) userProfileContainer.style.display = 'none';
            const titleEl = document.getElementById('authModalTitle');
            if (titleEl) titleEl.textContent = 'Welcome Back';
        };

        window.showForgotPassword = function(e) {
            if (e) e.preventDefault();
            showToast('Password reset coming soon!', 'info');
        };

        window.openProfileEditor = function() {
            showToast('Profile editor coming soon!', 'info');
        };

        window.showUserProfile = function() {
            const user = getCurrentUser();
            if (!user) return;
            
            if (loginFormContainer) loginFormContainer.style.display = 'none';
            if (signupFormContainer) signupFormContainer.style.display = 'none';
            if (userProfileContainer) userProfileContainer.style.display = 'block';
            
            const titleEl = document.getElementById('authModalTitle');
            if (titleEl) titleEl.textContent = 'My Account';
            
            const scrollbarWidth = getScrollbarWidth();
            document.documentElement.style.setProperty('--scrollbar-width', scrollbarWidth + 'px');
            authModal.style.display = '';
            authModal.classList.add('active');
            document.body.classList.add('modal-open');
            
            updateUserProfile(user);
        };
    }

    // Setup form submissions
    function setupForms() {
        // Login form
        const loginForm = document.getElementById('loginFormElement');
        if (loginForm) {
            loginForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                const email = document.getElementById('loginEmail')?.value;
                const password = document.getElementById('loginPassword')?.value;
                const submitBtn = this.querySelector('button[type="submit"]');
                
                if (!email || !password) {
                    showToast('Please fill in all fields', 'error');
                    return;
                }
                
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Signing in...';
                submitBtn.disabled = true;
                
                const result = await performLogin(email, password);
                
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                
                if (result.success) {
                    showToast('Welcome back!', 'success');
                    closeAuthModalFunction();
                    // Dispatch event for other scripts to listen
                    window.dispatchEvent(new CustomEvent('userLoggedIn', { detail: result.user }));
                    // Don't reload - just close modal
                } else {
                    showToast(result.error || 'Login failed', 'error');
                }
            });
        }

        // Signup form
        const signupForm = document.getElementById('signupFormElement');
        if (signupForm) {
            signupForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                const fullName = document.getElementById('signupName')?.value;
                const email = document.getElementById('signupEmail')?.value;
                const password = document.getElementById('signupPassword')?.value;
                const submitBtn = this.querySelector('button[type="submit"]');
                
                if (!fullName || !email || !password) {
                    showToast('Please fill in all fields', 'error');
                    return;
                }
                
                if (password.length < 8) {
                    showToast('Password must be at least 8 characters', 'error');
                    return;
                }
                
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Creating account...';
                submitBtn.disabled = true;
                
                const result = await performRegister(email, password, fullName);
                
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                
                if (result.success) {
                    showToast('Account created! Welcome!', 'success');
                    closeAuthModalFunction();
                    window.dispatchEvent(new CustomEvent('userLoggedIn', { detail: result.user }));
                } else {
                    showToast(result.error || 'Registration failed', 'error');
                }
            });
        }
    }

    function closeAuthModalFunction() {
        const authModal = document.getElementById('authModal');
        if (authModal) {
            authModal.classList.remove('active');
            document.body.classList.remove('modal-open');
        }
    }

    // Update user profile display
    function updateUserProfile(user) {
        if (!user) return;
        
        const profileAvatar = document.getElementById('profileAvatar');
        const profileName = document.getElementById('profileName');
        const profileEmail = document.getElementById('profileEmail');
        const profileTier = document.getElementById('profileTier');
        
        if (profileName) profileName.textContent = user.full_name || user.email || 'User';
        if (profileEmail) profileEmail.textContent = user.email || '';
        if (profileTier) profileTier.textContent = formatMembershipTier(user.membership_tier);
        
        if (profileAvatar) {
            profileAvatar.src = user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name || 'U')}&background=8B5CF6&color=fff`;
        }
    }

    function formatMembershipTier(tier) {
        const tiers = {
            'free': 'Free Member',
            'premium': 'Premium Member',
            'author': 'Author',
            'admin': 'Administrator'
        };
        return tiers[tier] || 'Free Member';
    }

    // Login function
    async function performLogin(email, password) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
                credentials: 'include'
            });

            const data = await response.json();

            if (response.ok) {
                // Store in localStorage with prefixed keys
                localStorage.setItem(USER_KEY, JSON.stringify(data.user));
                localStorage.setItem(TOKEN_KEY, data.session?.access_token || '');
                window.currentUser = data.user;
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

    // Register function
    async function performRegister(email, password, full_name) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, full_name }),
                credentials: 'include'
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem(USER_KEY, JSON.stringify(data.user));
                localStorage.setItem(TOKEN_KEY, data.session?.access_token || '');
                window.currentUser = data.user;
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

    // Expose functions globally
    window.login = performLogin;
    window.register = performRegister;
    window.logout = async function() {
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
            localStorage.removeItem(USER_KEY);
            localStorage.removeItem(TOKEN_KEY);
            window.currentUser = null;
            window.isLoggedIn = false;
            showToast('Signed out successfully', 'success');
            window.dispatchEvent(new CustomEvent('userLoggedOut'));
            setTimeout(() => location.reload(), 500);
        }
    };

    window.getCurrentUser = function() {
        if (window.currentUser) return window.currentUser;
        const stored = localStorage.getItem(USER_KEY);
        return stored ? JSON.parse(stored) : null;
    };

    window.isLoggedIn = function() {
        return !!localStorage.getItem(USER_KEY);
    };

    // Social login placeholders
    window.loginWithGoogle = function() {
        showToast('Google login coming soon!', 'info');
    };

    window.loginWithFacebook = function() {
        showToast('Facebook login coming soon!', 'info');
    };

    // Toast notification
    window.showToast = function(message, type = 'info') {
        // Remove existing toasts
        document.querySelectorAll('.auth-toast').forEach(t => t.remove());
        
        const toast = document.createElement('div');
        toast.className = 'auth-toast';
        const bgColor = type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#8B5CF6';
        toast.style.cssText = `
            position: fixed; bottom: 20px; right: 20px; padding: 12px 24px;
            border-radius: 8px; color: white; font-weight: 500; z-index: 10001;
            transform: translateX(100%); transition: transform 0.3s ease;
            max-width: 300px; background: ${bgColor}; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.style.transform = 'translateX(0)', 100);
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    };

    // Check if DOM is already ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
