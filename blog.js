/**
 * Blog JavaScript - Dynamic Loading with API Integration
 * This file handles fetching and rendering articles from the API.
 */

// Blog State
const blogState = {
    currentPage: 1,
    articlesPerPage: 12,
    currentCategory: null,
    totalPages: 1,
    isLoading: false
};

// DOM Elements
const elements = {
    featuredContainer: document.getElementById('featured'),
    articlesContainer: document.getElementById('articlesContainer'),
    articlesLoading: document.getElementById('articlesLoading'),
    pagination: document.getElementById('pagination'),
    categoryLinks: document.querySelectorAll('.categories-list a'),
    searchForm: document.querySelector('.search-widget .search-form'),
    newsletterForms: document.querySelectorAll('.newsletter-form')
};

/**
 * Initialize Blog
 */
async function initBlog() {
    showLoadingState();
    
    try {
        // Load featured article
        await loadFeaturedArticle();
        
        // Load articles for first page
        await loadArticles(1);
        
        // Load categories
        await loadCategories();

        // Load external books (Google Books API)
        await loadExternalBooks();
        
        // Setup event listeners
        setupEventListeners();
    } catch (error) {
        console.error('Error initializing blog:', error);
        showError('Failed to load articles. Please refresh the page.');
    }
}

/**
 * Load External Books from Google Books API
 */
async function loadExternalBooks() {
    const container = document.getElementById('externalBooksContainer');
    if (!container) return;

    try {
        // Search for books related to authors, writing, and triumph
        const response = await BlogAPI.searchExternalBooks('subject:authors+writing+inspiration', 5);
        
        if (response.success && response.data) {
            renderExternalBooks(response.data);
        } else {
            container.innerHTML = '<p class="error-msg">Failed to load book recommendations.</p>';
        }
    } catch (error) {
        console.error('Error loading external books:', error);
        container.innerHTML = '<p class="error-msg">Failed to load book recommendations.</p>';
    }
}

/**
 * Render External Books in Sidebar
 */
function renderExternalBooks(books) {
    const container = document.getElementById('externalBooksContainer');
    if (!container) return;

    if (!books || books.length === 0) {
        container.innerHTML = '<p>No recommendations available.</p>';
        return;
    }

    const booksHTML = books.map(book => `
        <div class="external-book-item">
            <div class="external-book-thumb">
                <img src="${book.thumbnail || 'https://via.placeholder.com/60x90?text=No+Cover'}" alt="${book.title}">
            </div>
            <div class="external-book-info">
                <h5 class="external-book-title">${book.title}</h5>
                <p class="external-book-author">by ${book.authors.join(', ')}</p>
                <a href="${book.infoLink}" target="_blank" class="external-book-link">View Details</a>
            </div>
        </div>
    `).join('');

    container.innerHTML = booksHTML;
}

/**
 * Load Featured Article
 */
async function loadFeaturedArticle() {
    try {
        const response = await BlogAPI.fetchFeaturedArticle();
        
        if (response.success && response.data && response.data.length > 0) {
            const article = response.data[0];
            renderFeaturedArticle(article);
        } else if (elements.featuredContainer) {
            // Hide featured section if no featured article
            elements.featuredContainer.style.display = 'none';
        }
    } catch (error) {
        console.error('Error loading featured article:', error);
    }
}

/**
 * Render Featured Article
 */
function renderFeaturedArticle(article) {
    if (!elements.featuredContainer) return;
    
    const featuredHTML = `
        <article class="featured-card" data-article-id="${article.id}">
            <div class="featured-card-image">
                <img src="${article.image}" alt="${article.imageAlt || article.title}">
            </div>
            <div class="featured-card-content">
                <span class="article-category">${article.category}</span>
                <h2 class="article-title">
                    <a href="article.html?id=${article.id}">${article.title}</a>
                </h2>
                <div class="article-meta">
                    <span>By <span class="article-author-name">${article.author}</span></span>
                    <span>•</span>
                    <span>${article.dateFormatted}</span>
                    <span>•</span>
                    <span>${article.readTime}</span>
                </div>
                <p class="article-excerpt">${article.excerpt}</p>
                <a href="article.html?id=${article.id}" class="btn btn-primary">Read Full Article</a>
            </div>
        </article>
    `;
    
    elements.featuredContainer.innerHTML = featuredHTML;
}

/**
 * Load Articles
 */
async function loadArticles(page = 1, category = null) {
    if (blogState.isLoading) return;
    
    blogState.isLoading = true;
    blogState.currentPage = page;
    blogState.currentCategory = category;
    
    // Show loading state
    showArticlesLoading();
    
    try {
        const response = await BlogAPI.fetchArticles(page, blogState.articlesPerPage, category);
        
        if (response.success) {
            renderArticles(response.data);
            renderPagination(response.pagination);
            blogState.totalPages = response.pagination.totalPages;
        } else {
            showError('Failed to load articles.');
        }
    } catch (error) {
        console.error('Error loading articles:', error);
        showError('Failed to load articles. Please try again.');
    } finally {
        blogState.isLoading = false;
        hideArticlesLoading();
    }
}

/**
 * Render Articles Grid
 */
function renderArticles(articles) {
    if (!elements.articlesContainer) return;
    
    if (!articles || articles.length === 0) {
        elements.articlesContainer.innerHTML = `
            <div class="no-articles">
                <p>No articles found.</p>
            </div>
        `;
        return;
    }
    
    const articlesHTML = articles.map(article => `
        <article class="blog-card-new" data-article-id="${article.id}">
            <div class="blog-card-image">
                <img src="${article.image}" alt="${article.imageAlt || article.title}">
                <span class="blog-card-category">${article.category}</span>
            </div>
            <div class="blog-card-content">
                <h3 class="blog-card-title">
                    <a href="article.html?id=${article.id}">${article.title}</a>
                </h3>
                <div class="blog-card-meta">
                    <img src="${article.authorImg}" alt="${article.author}" class="blog-card-author-img">
                    <span>${article.author}</span>
                    <span>•</span>
                    <span>${formatDate(article.date)}</span>
                </div>
                <p class="blog-card-excerpt">${article.excerpt}</p>
                <div class="blog-card-footer">
                    <a href="article.html?id=${article.id}" class="read-more-link">Read More →</a>
                    <span class="read-time">${article.readTime}</span>
                </div>
            </div>
        </article>
    `).join('');
    
    elements.articlesContainer.innerHTML = articlesHTML;
}

/**
 * Render Pagination
 */
function renderPagination(pagination) {
    if (!elements.pagination) return;
    
    const { page, totalPages, hasMore } = pagination;
    
    if (totalPages <= 1) {
        elements.pagination.innerHTML = '';
        return;
    }
    
    let paginationHTML = '';
    
    // Previous button
    if (page > 1) {
        paginationHTML += `<a href="#" class="pagination-btn" data-page="${page - 1}">← Previous</a>`;
    }
    
    // Page numbers
    const maxVisiblePages = 5;
    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    if (startPage > 1) {
        paginationHTML += `<a href="#" class="pagination-btn" data-page="1">1</a>`;
        if (startPage > 2) {
            paginationHTML += `<span class="pagination-ellipsis">...</span>`;
        }
    }
    
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `<a href="#" class="pagination-btn ${i === page ? 'active' : ''}" data-page="${i}">${i}</a>`;
    }
    
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            paginationHTML += `<span class="pagination-ellipsis">...</span>`;
        }
        paginationHTML += `<a href="#" class="pagination-btn" data-page="${totalPages}">${totalPages}</a>`;
    }
    
    // Next button
    if (hasMore || page < totalPages) {
        paginationHTML += `<a href="#" class="pagination-btn" data-page="${page + 1}">Next →</a>`;
    }
    
    elements.pagination.innerHTML = paginationHTML;
    
    // Add click handlers
    elements.pagination.querySelectorAll('.pagination-btn[data-page]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const newPage = Number.parseInt(btn.dataset.page, 10);
            loadArticles(newPage, blogState.currentCategory);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
}

/**
 * Load Categories
 */
async function loadCategories() {
    try {
        const response = await BlogAPI.fetchCategories();
        
        if (response.success) {
            updateCategoryCounts(response.data);
        }
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

/**
 * Update Category Counts in Sidebar
 */
function updateCategoryCounts(categories) {
    const categoryLinks = document.querySelectorAll('.categories-list a');
    
    categoryLinks.forEach(link => {
        const categoryName = link.textContent.replace(/\s*\d+$/, '').trim();
        const category = categories.find(c => c.name === categoryName);
        
        if (category) {
            const countSpan = link.querySelector('.category-count');
            if (countSpan) {
                countSpan.textContent = category.count;
            } else {
                const newCount = document.createElement('span');
                newCount.className = 'category-count';
                newCount.textContent = category.count;
                link.appendChild(newCount);
            }
        }
    });
}

/**
 * Setup Event Listeners
 */
function setupEventListeners() {
    // Category filter clicks
    elements.categoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = link.dataset.category || link.getAttribute('href');
            const categorySlug = category.replace('#', '').replace('/', '');
            
            // Update active state
            elements.categoryLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Load articles for category
            loadArticles(1, categorySlug);
        });
    });
    
    // Search form
    elements.searchForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const input = elements.searchForm.querySelector('input');
        const query = input.value.trim();
        
        if (query) {
            try {
                await performSearch(query);
            } catch (error) {
                console.error('Search error:', error);
            }
        }
    });
    
    // Newsletter forms
    elements.newsletterForms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = form.querySelector('input[type="email"]').value;
            
            if (email) {
                await subscribeToNewsletter(email, form);
            }
        });
    });
}

/**
 * Perform Search
 */
async function performSearch(query) {
    showArticlesLoading();
    
    try {
        const response = await BlogAPI.searchArticles(query);
        
        if (response.success) {
            renderArticles(response.data);
            elements.pagination.innerHTML = '';
            
            if (response.data.length === 0) {
                elements.articlesContainer.innerHTML = `
                    <div class="no-articles">
                        <p>No articles found for "${query}"</p>
                        <button class="btn btn-primary" onclick="loadArticles(1)">View All Articles</button>
                    </div>
                `;
            }
        }
    } catch (error) {
        console.error('Search error:', error);
        showError('Search failed. Please try again.');
    } finally {
        hideArticlesLoading();
    }
}

/**
 * Subscribe to Newsletter
 */
async function subscribeToNewsletter(email, form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Subscribing...';
    submitBtn.disabled = true;
    
    try {
        const response = await BlogAPI.subscribeNewsletter(email);
        
        if (response.success) {
            showNotification('Successfully subscribed to newsletter!');
            form.reset();
        } else {
            showNotification(response.error || 'Failed to subscribe.');
        }
    } catch (error) {
        console.error('Newsletter subscription error:', error);
        showNotification('Failed to subscribe. Please try again.');
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

/**
 * Show Loading State
 */
function showLoadingState() {
    // Featured skeleton is already in HTML
}

/**
 * Show Articles Loading
 */
function showArticlesLoading() {
    if (elements.articlesLoading) {
        elements.articlesLoading.style.display = 'block';
    }
    if (elements.articlesContainer) {
        elements.articlesContainer.style.opacity = '0.5';
    }
}

/**
 * Hide Articles Loading
 */
function hideArticlesLoading() {
    if (elements.articlesLoading) {
        elements.articlesLoading.style.display = 'none';
    }
    if (elements.articlesContainer) {
        elements.articlesContainer.style.opacity = '1';
    }
}

/**
 * Show Error
 */
function showError(message) {
    if (elements.articlesContainer) {
        elements.articlesContainer.innerHTML = `
            <div class="error-message">
                <p>${message}</p>
                <button class="btn btn-primary" onclick="loadArticles(1)">Try Again</button>
            </div>
        `;
    }
    hideArticlesLoading();
}

/**
 * Format Date
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

/**
 * Show Notification Toast
 */
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification-toast';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--primary-color);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Add animation styles
const blogStyles = document.createElement('style');
blogStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .no-articles {
        grid-column: 1 / -1;
        text-align: center;
        padding: 4rem 2rem;
        color: var(--text-light);
    }
    
    .error-message {
        grid-column: 1 / -1;
        text-align: center;
        padding: 4rem 2rem;
        color: var(--text-light);
    }
    
    .error-message button {
        margin-top: 1rem;
    }
    
    .pagination-ellipsis {
        padding: 0.5rem;
        color: var(--text-light);
    }
    
    /* Loading Skeleton Styles */
    .skeleton-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: var(--space-6);
    }
    
    .skeleton-card {
        background: var(--bg-card);
        border-radius: var(--radius-lg);
        overflow: hidden;
        height: 380px;
    }
    
    .skeleton-image {
        height: 220px;
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite;
    }
    
    .featured-skeleton .featured-card {
        display: grid;
        grid-template-columns: 1fr 1fr;
        background: var(--bg-card);
        border-radius: var(--radius-lg);
        overflow: hidden;
    }
    
    .featured-skeleton .skeleton-image {
        min-height: 400px;
        height: 100%;
    }
    
    .featured-skeleton .skeleton-tag {
        width: 100px;
        height: 24px;
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite;
        border-radius: var(--radius-full);
        margin-bottom: var(--space-3);
    }
    
    .featured-skeleton .skeleton-title {
        width: 80%;
        height: 32px;
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite;
        border-radius: var(--radius-md);
        margin-bottom: var(--space-3);
    }
    
    .featured-skeleton .skeleton-meta {
        width: 60%;
        height: 20px;
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite;
        border-radius: var(--radius-md);
        margin-bottom: var(--space-4);
    }
    
    .featured-skeleton .skeleton-text {
        width: 100%;
        height: 16px;
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite;
        border-radius: var(--radius-md);
        margin-bottom: var(--space-2);
    }
    
    .featured-skeleton .skeleton-text.short {
        width: 70%;
    }
    
    .featured-skeleton .skeleton-button {
        width: 160px;
        height: 44px;
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite;
        border-radius: var(--radius-md);
        margin-top: var(--space-4);
    }
    
    @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
    }
    
    @media (max-width: 1024px) {
        .skeleton-grid {
            grid-template-columns: 1fr;
        }
        
        .featured-skeleton .featured-card {
            grid-template-columns: 1fr;
        }
        
        .featured-skeleton .skeleton-image {
            min-height: 300px;
        }
    }
`;
document.head.appendChild(blogStyles);

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initBlog);

// Make functions globally available
globalThis.loadArticles = loadArticles;
