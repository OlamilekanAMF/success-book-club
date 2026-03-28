// Enhanced Book Discovery System for Triumphant Book Club
document.addEventListener('DOMContentLoaded', function() {
    
    // Book Database
    const booksDatabase = [
        {
            id: 'rising-from-ashes',
            title: 'Rising from Ashes',
            author: 'Michael Torres',
            category: 'fiction',
            month: "January '24",
            rating: 4.2,
            reviewCount: 1247,
            pages: 342,
            audioDuration: '8h 45m',
            published: 'January 2024',
            description: 'A powerful story of transformation and resilience. When Phoenix Martinez loses everything in a devastating fire, she must find the strength to rebuild her life from the ashes. This compelling narrative explores the journey of overcoming trauma and discovering the unbreakable human spirit.',
            formats: ['ebook', 'audio', 'pdf'],
            featured: true,
            cover: 'https://picsum.photos/seed/book1/300/450'
        },
        {
            id: 'against-all-odds',
            title: 'Against All Odds',
            author: 'Jennifer Liu',
            category: 'biography',
            month: "December '23",
            rating: 4.8,
            reviewCount: 2341,
            pages: 428,
            audioDuration: '10h 20m',
            published: 'December 2023',
            description: 'Against insurmountable odds and facing discrimination in post-war America, Jennifer Liu broke barriers in medical school and became a pioneering neurosurgeon. Her journey from poverty to prominence is a testament to determination, intelligence, and the power of dreams.',
            formats: ['ebook', 'audio', 'pdf'],
            featured: true,
            cover: 'https://picsum.photos/seed/book2/300/450'
        },
        {
            id: 'the-power-within',
            title: 'The Power Within',
            author: 'Dr. Robert Chen',
            category: 'self-help',
            month: "November '23",
            rating: 4.1,
            reviewCount: 987,
            pages: 367,
            audioDuration: '6h 30m',
            published: 'November 2023',
            description: 'Dr. Robert Chen reveals the science behind resilience and personal transformation. Through cutting-edge research and compelling stories, he demonstrates how anyone can tap into their inner strength and overcome life\'s greatest challenges.',
            formats: ['ebook', 'audio', 'pdf'],
            popular: true,
            cover: 'https://picsum.photos/seed/book3/300/450'
        },
        {
            id: 'unbroken-legacy',
            title: 'Unbroken Legacy',
            author: 'Maria Rodriguez',
            category: 'historical',
            month: "October '23",
            rating: 4.6,
            reviewCount: 1892,
            pages: 512,
            audioDuration: '12h 15m',
            published: 'October 2023',
            description: 'A sweeping historical epic following three generations of women fighting for justice and equality in early 20th century America. Maria Rodriguez masterfully weaves together stories of courage, sacrifice, and the enduring power of family bonds.',
            formats: ['ebook', 'audio', 'pdf'],
            cover: 'https://picsum.photos/seed/book4/300/450'
        },
        {
            id: 'journey-home',
            title: 'Journey Home',
            author: 'David Thompson',
            category: 'memoir',
            month: "September '23",
            rating: 4.3,
            reviewCount: 756,
            pages: 389,
            audioDuration: '9h 10m',
            published: 'September 2023',
            description: 'A heartfelt memoir about finding one\'s way back to oneself after years of lost identity. David Thompson\'s journey of self-discovery, family reconciliation, and healing offers profound insights into the meaning of home and belonging.',
            formats: ['ebook', 'audio', 'pdf'],
            new: true,
            cover: 'https://picsum.photos/seed/book5/300/450'
        },
        {
            id: 'breaking-barriers',
            title: 'Breaking Barriers',
            author: 'Amanda Foster',
            category: 'memoir',
            month: "September '23",
            rating: 4.7,
            reviewCount: 623,
            pages: 298,
            audioDuration: '7h 30m',
            published: 'September 2023',
            description: 'Amanda Foster chronicles her groundbreaking journey as the first woman in her field, overcoming systemic barriers and paving the way for future generations. Her story is one of resilience, determination, and the power of breaking through limitations.',
            formats: ['ebook', 'audio', 'pdf'],
            cover: 'https://picsum.photos/seed/breaking-barriers/300/450'
        },
        {
            id: 'the-last-mile',
            title: 'The Last Mile',
            author: 'James Washington',
            category: 'fiction',
            month: "August '23",
            rating: 4.5,
            reviewCount: 892,
            pages: 412,
            audioDuration: '9h 45m',
            published: 'August 2023',
            description: 'In this gripping thriller, marathon runner Jake Martinez must complete the ultimate race - not just for glory, but to save his family. As each mile passes, he uncovers a conspiracy that threatens everything he holds dear.',
            formats: ['ebook', 'audio', 'pdf'],
            cover: 'https://picsum.photos/seed/the-last-mile/300/450'
        },
        {
            id: 'courage-under-fire',
            title: 'Courage Under Fire',
            author: 'Patricia Kumar',
            category: 'biography',
            month: "July '23",
            rating: 4.8,
            reviewCount: 1103,
            pages: 367,
            audioDuration: '8h 20m',
            published: 'July 2023',
            description: 'Firefighter Patricia Kumar shares harrowing stories from the front lines of disaster response, revealing the true meaning of courage and the sacrifices made by first responders. A powerful testament to human bravery and compassion.',
            formats: ['ebook', 'audio', 'pdf'],
            featured: true,
            cover: 'https://picsum.photos/seed/courage-under-fire/300/450'
        },
        {
            id: 'rising-together',
            title: 'Rising Together',
            author: 'The Community Collective',
            category: 'self-help',
            month: "June '23",
            rating: 4.4,
            reviewCount: 543,
            pages: 289,
            audioDuration: '6h 15m',
            published: 'June 2023',
            description: 'A collaborative work featuring stories from diverse communities coming together to overcome adversity. This practical guide offers actionable strategies for building resilience through unity and collective action.',
            formats: ['ebook', 'audio', 'pdf'],
            cover: 'https://picsum.photos/seed/rising-together/300/450'
        },
        {
            id: 'the-phoenix-principle',
            title: 'The Phoenix Principle',
            author: 'Sophie Martin',
            category: 'historical',
            month: "May '23",
            rating: 4.6,
            reviewCount: 767,
            pages: 445,
            audioDuration: '10h 30m',
            published: 'May 2023',
            description: 'Set during the Great Depression, this historical novel follows a community that rebuilds itself from devastation after a catastrophic fire. Based on true events, it showcases the indomitable spirit of ordinary people facing extraordinary challenges.',
            formats: ['ebook', 'audio', 'pdf'],
            cover: 'https://picsum.photos/seed/the-phoenix-principle/300/450'
        },
        {
            id: 'beyond-the-breaking-point',
            title: 'Beyond the Breaking Point',
            author: 'David Chen',
            category: 'memoir',
            month: "April '23",
            rating: 4.7,
            reviewCount: 891,
            pages: 334,
            audioDuration: '7h 50m',
            published: 'April 2023',
            description: 'Elite athlete David Chen shares his journey through career-ending injury and subsequent reinvention. His story demonstrates how hitting rock bottom can become the foundation for building a stronger, more purposeful life.',
            formats: ['ebook', 'audio', 'pdf'],
            popular: true,
            cover: 'https://picsum.photos/seed/beyond-the-breaking-point/300/450'
        },
        {
            id: 'the-summit-within',
            title: 'The Summit Within',
            author: 'Lisa Thompson',
            category: 'fiction',
            month: "March '23",
            rating: 4.5,
            reviewCount: 723,
            pages: 378,
            audioDuration: '8h 40m',
            published: 'March 2023',
            description: 'After conquering Everest, mountaineer Sarah Jenkins faces her greatest challenge: learning to live with purpose beyond the peaks. This novel explores themes of achievement, identity, and finding meaning in ordinary life.',
            formats: ['ebook', 'audio', 'pdf'],
            cover: 'https://picsum.photos/seed/the-summit-within/300/450'
        },
        {
            id: 'unstoppable-force',
            title: 'Unstoppable Force',
            author: 'Robert Johnson',
            category: 'biography',
            month: "February '23",
            rating: 4.6,
            reviewCount: 956,
            pages: 401,
            audioDuration: '9h 20m',
            published: 'February 2023',
            description: 'Paralympic champion Robert Johnson shares his remarkable journey from accident to athletic glory. His story redefines disability and demonstrates how limitations can become catalysts for extraordinary achievement.',
            formats: ['ebook', 'audio', 'pdf'],
            featured: true,
            cover: 'https://picsum.photos/seed/unstoppable-force/300/450'
        },
        {
            id: 'the-courage-blueprint',
            title: 'The Courage Blueprint',
            author: 'Dr. Emily White',
            category: 'self-help',
            month: "January '23",
            rating: 4.4,
            reviewCount: 634,
            pages: 312,
            audioDuration: '7h 15m',
            published: 'January 2023',
            description: 'Drawing from neuroscience and psychology, Dr. Emily White presents a practical framework for developing courage. Through exercises and real-world examples, she shows how anyone can build their bravery muscle and face life\'s challenges with confidence.',
            formats: ['ebook', 'audio', 'pdf'],
            cover: 'https://picsum.photos/seed/the-courage-blueprint/300/450'
        },
        {
            id: 'the-unbreakable-spirit',
            title: 'The Unbreakable Spirit',
            author: 'Sarah Mitchell',
            category: 'memoir',
            month: "February '24",
            rating: 4.9,
            reviewCount: 2341,
            pages: 376,
            audioDuration: '8h 30m',
            published: 'February 2024',
            description: 'A powerful memoir of overcoming impossible odds, Sarah Mitchell shares her journey from devastating loss to finding hope and purpose. This inspiring true story demonstrates the extraordinary capacity of the human heart to heal and triumph over adversity.',
            formats: ['ebook', 'audio', 'pdf'],
            featured: true,
            cover: 'https://picsum.photos/seed/triumphant-featured/400/600'
        }
    ];

    // State Management
    let currentFilter = 'all';
    let currentSort = 'newest';
    let currentPage = 1;
    const booksPerPage = 6;
    let filteredBooks = []; // Will be populated from API
    let searchTerm = '';
    let totalBooks = 0;

    /**
     * Load books from API
     */
    async function loadBooks() {
        showLoadingSkeleton();
        
        try {
            const params = {
                page: currentPage,
                limit: booksPerPage,
                category: currentFilter,
                sort: currentSort,
                q: searchTerm
            };
            
            const response = await BlogAPI.fetchBooks(params);
            
            if (response.success) {
                filteredBooks = response.data;
                totalBooks = response.pagination.total;
                updateBookCount();
                renderBooks(false); // Already showing skeleton/loading
                updatePagination(response.pagination);
            }
        } catch (error) {
            console.error('Error loading books:', error);
            // Fallback to mock if API fails
            filteredBooks = booksDatabase.slice(0, booksPerPage);
            renderBooks(false);
        }
    }

    /**
     * Load Spotlight book from API
     */
    async function loadSpotlight() {
        try {
            const response = await BlogAPI.fetchBookSpotlight();
            if (response.success && response.data) {
                renderSpotlight(response.data);
            }
        } catch (error) {
            console.error('Error loading spotlight:', error);
        }
    }

    /**
     * Render Spotlight section
     */
    function renderSpotlight(book) {
        const spotlightSection = document.querySelector('.hero-spotlight');
        if (!spotlightSection) return;

        const titleEl = spotlightSection.querySelector('.spotlight-title');
        const authorEl = spotlightSection.querySelector('.spotlight-author span');
        const avatarEl = spotlightSection.querySelector('.author-avatar');
        const descEl = spotlightSection.querySelector('.spotlight-description');
        const ratingEl = spotlightSection.querySelector('.rating-text');
        const pagesEl = spotlightSection.querySelector('.meta-item:nth-child(3) .meta-value');
        
        if (titleEl) titleEl.textContent = book.title;
        if (authorEl) authorEl.textContent = `by ${book.author}`;
        if (descEl) descEl.textContent = book.description;
        if (ratingEl) ratingEl.textContent = book.rating;
        if (pagesEl) pagesEl.textContent = `${book.page_count || book.pages} pages`;
        if (book.cover_image || book.cover) {
            // Update hero image if exists
            const heroImg = document.querySelector('.hero-image .book-1'); // Example
            if (heroImg) heroImg.style.backgroundImage = `url(${book.cover_image || book.cover})`;
        }
    }

    // DOM Elements
    const booksGrid = document.getElementById('booksGrid');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const bookSearch = document.getElementById('bookSearch');
    const searchBtn = document.getElementById('searchBtn');
    const sortOptions = document.getElementById('sortOptions');
    const activeFilterSpan = document.getElementById('active-filter');
    const bookCountSpan = document.getElementById('bookCount');
    const pagination = document.getElementById('pagination');
    const loadingSkeleton = document.getElementById('loadingSkeleton');
    const addMoreBooksBtn = document.getElementById('addMoreBooks');
    const featuredReadMoreBtn = document.querySelector('.featured-read-more');
    const featuredGetBookBtn = document.querySelector('.featured-get-book');

    // Category Filter Functionality
    function setupCategoryFilters() {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const category = this.dataset.category;
                setActiveFilter(category);
                filterBooks();
            });
        });
    }

    function getCategoryDisplayName(category) {
        const categoryMap = {
            'all': 'All Books',
            'memoir': 'Memoir',
            'fiction': 'Fiction',
            'biography': 'Biography',
            'self-help': 'Self-Help',
            'historical': 'Historical'
        };
        return categoryMap[category] || category;
    }

    function setActiveFilter(category) {
        filterBtns.forEach(btn => btn.classList.remove('active'));
        const activeBtn = document.querySelector(`[data-category="${category}"]`);
        if (activeBtn) activeBtn.classList.add('active');
        currentFilter = category;
        
        // Update filter display
        const filterText = getCategoryDisplayName(category);
        activeFilterSpan.textContent = filterText;
    }

    // Search Functionality
    function setupSearch() {
        const searchHandler = debounce(function() {
            searchTerm = bookSearch.value.toLowerCase();
            filterBooks();
        }, 300);

        bookSearch.addEventListener('input', searchHandler);
        searchBtn.addEventListener('click', searchHandler);
    }

    // Sort Functionality
    function setupSort() {
        sortOptions.addEventListener('change', function() {
            currentSort = this.value;
            sortBooks();
            renderBooks();
        });
    }

    // Filter and Sort Logic
    function filterBooks() {
        currentPage = 1;
        loadBooks();
    }

    function sortBooks() {
        // Sort is handled by API
        loadBooks();
    }

    // Render Books
    function renderBooks(showLoader = true) {
        if (showLoader) {
            showLoadingSkeleton();
        }

        const booksToShow = filteredBooks;

        if (booksToShow.length === 0) {
            booksGrid.innerHTML = '<div class="no-results">No books found matching your criteria.</div>';
        } else {
            booksGrid.innerHTML = booksToShow.map(book => createBookCard(book)).join('');
        }
        
        setupBookCardInteractions();
        if (showLoader) hideLoadingSkeleton();
    }

    function getBookBadge(book) {
        if (book.is_featured || book.featured) return '<div class="book-badge">Featured</div>';
        if (book.popular) return '<div class="book-badge popular">Popular</div>';
        if (book.new) return '<div class="book-badge new">New</div>';
        return '';
    }

    function createBookCard(book) {
        const rating = book.rating || 0;
        const stars = '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
        const badge = getBookBadge(book);
        const cover = book.cover_image || book.cover || 'https://via.placeholder.com/300x450?text=No+Cover';
        const reviews = book.reviewCount || 0;

        return `
            <article class="book-card enhanced" data-category="${book.category}" data-book-id="${book.id}">
                <div class="book-cover">
                    <img src="${cover}" alt="${book.title}" loading="lazy">
                    <div class="book-overlay">
                        <button class="quick-actions" aria-label="Quick Actions">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                <circle cx="10" cy="10" r="2"/>
                                <circle cx="5" cy="10" r="1"/>
                                <circle cx="15" cy="10" r="1"/>
                            </svg>
                        </button>
                        <button class="btn btn-small view-details" data-book="${book.id}">View Details</button>
                        <button class="btn btn-small wishlist" data-book="${book.id}" aria-label="Add to Wishlist">
                            <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M12 2L15.09 8.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18-1.87L5 9.27 8.09 8.26L12 2z"/>
                            </svg>
                        </button>
                    </div>
                    ${badge}
                </div>
                <div class="book-info">
                    <span class="book-month">${book.month || ''}</span>
                    <h3 class="book-title">${book.title}</h3>
                    <p class="book-author">${book.author}</p>
                    <div class="book-meta">
                        <span class="book-category-tag">${book.category}</span>
                        <span class="book-pages">${book.page_count || book.pages || 0} pages</span>
                        <span class="book-duration">${book.audioDuration || ''}</span>
                    </div>
                    <div class="book-rating">
                        <span class="stars">${stars}</span>
                        <span class="rating-count">(${reviews.toLocaleString()} reviews)</span>
                    </div>
                    <div class="book-actions">
                        <button class="btn btn-primary preview" data-book="${book.id}">Preview</button>
                        <button class="btn btn-outline download" data-book="${book.id}">Download</button>
                    </div>
                </div>
            </article>
        `;
    }

    // Book Card Interactions
    function setupBookCardInteractions() {
        // View Details
        document.querySelectorAll('.view-details').forEach(btn => {
            btn.addEventListener('click', function() {
                const bookId = this.dataset.book;
                openBookModal(bookId);
            });
        });

        // Preview
        document.querySelectorAll('.preview').forEach(btn => {
            btn.addEventListener('click', function() {
                const bookId = this.dataset.book;
                showPreview(bookId);
            });
        });

        // Download
        document.querySelectorAll('.download').forEach(btn => {
            btn.addEventListener('click', function() {
                const bookId = this.dataset.book;
                showDownloadModal(bookId);
            });
        });

        // Wishlist
        document.querySelectorAll('.wishlist').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const bookId = this.dataset.book;
                toggleWishlist(bookId, this);
            });
        });

        // Quick Actions Menu
        document.querySelectorAll('.quick-actions').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const bookId = this.closest('.book-card').dataset.book;
                showQuickActions(e.target, bookId);
            });
        });
    }

    // Loading Skeleton
    function showLoadingSkeleton() {
        loadingSkeleton.style.display = 'block';
        booksGrid.style.display = 'none';
    }

    function hideLoadingSkeleton() {
        loadingSkeleton.style.display = 'none';
        booksGrid.style.display = 'grid';
    }

    // Book Detail Modal
    function openBookModal(bookId) {
        const book = booksDatabase.find(b => b.id === bookId);
        if (!book) return;

        const modal = document.getElementById('bookModal');
        document.getElementById('modalTitle').textContent = book.title;
        document.getElementById('modalBookCover').src = book.cover;
        document.getElementById('modalAuthor').textContent = book.author;
        document.getElementById('modalCategory').textContent = book.category;
        document.getElementById('modalPages').textContent = book.pages;
        document.getElementById('modalDuration').textContent = book.audioDuration;
        document.getElementById('modalPublished').textContent = book.published;
        document.getElementById('modalDescription').textContent = book.description;
        document.getElementById('modalRating').innerHTML = getStarRating(book.rating);
        document.getElementById('modalRatingCount').textContent = `(${book.reviewCount.toLocaleString()} reviews)`;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Setup modal interactions
        setupModalInteractions(book);
    }

    function setupModalInteractions(book) {
        const closeModal = document.getElementById('closeModal');
        const confirmDownload = document.getElementById('confirmDownload');
        const addToLibrary = document.getElementById('addToLibrary');
        const shareBook = document.getElementById('shareBook');
        const downloadOptions = document.querySelectorAll('.download-option');

        // Close modal
        closeModal.addEventListener('click', closeBookModal);

        // Download options
        downloadOptions.forEach(btn => {
            btn.addEventListener('click', function() {
                const format = this.dataset.format;
                downloadBook(book, format);
            });
        });

        // Add to library
        addToLibrary.addEventListener('click', function() {
            addToUserLibrary(book);
            showNotification('Book added to your library!');
        });

        // Share
        shareBook.addEventListener('click', function() {
            shareBookDetails(book);
        });

        // Confirm download
        confirmDownload.addEventListener('click', function() {
            closeBookModal();
            showDownloadProgress();
        });
    }

    function closeBookModal() {
        const modal = document.getElementById('bookModal');
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Audio Player functionality removed (unused)
    // If audio player functionality is needed in the future, it can be re-implemented

    // Utility Functions
    function getStarRating(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        let stars = '★'.repeat(fullStars);
        if (hasHalfStar) stars += '½';
        stars += '☆'.repeat(emptyStars);
        
        return `<span class="stars">${stars}</span>`;
    }

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = function() {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Simulated Functions (would connect to backend in real implementation)
    function showPreview(bookId) {
        showNotification(`Preview: ${booksDatabase.find(b => b.id === bookId).title}`);
    }

    function showDownloadModal(bookId) {
        openBookModal(bookId);
    }

    function downloadBook(book, format) {
        showNotification(`Downloading ${book.title} (${format.toUpperCase()})...`);
        // Simulate download progress
        setTimeout(() => {
            showNotification(`Download complete: ${book.title}`);
        }, 2000);
    }

    function toggleWishlist(bookId, button) {
        const isInWishlist = localStorage.getItem(`wishlist_${bookId}`) === 'true';
        if (isInWishlist) {
            localStorage.removeItem(`wishlist_${bookId}`);
            button.classList.remove('active');
            showNotification('Removed from wishlist');
        } else {
            localStorage.setItem(`wishlist_${bookId}`, 'true');
            button.classList.add('active');
            showNotification('Added to wishlist');
        }
    }

    function addToUserLibrary(book) {
        const library = JSON.parse(localStorage.getItem('userLibrary') || '[]');
        if (!library.some(b => b.id === book.id)) {
            library.push(book);
            localStorage.setItem('userLibrary', JSON.stringify(library));
        }
    }

    function shareBookDetails(book) {
        if (navigator.share) {
            navigator.share({
                title: book.title,
                text: `Check out "${book.title}" by ${book.author}`,
                url: globalThis.location.href
            });
        } else {
            navigator.clipboard.writeText(`Check out "${book.title}" by ${book.author}`);
            showNotification('Link copied to clipboard!');
        }
    }

    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification-toast';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--primary-blue);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    function showDownloadProgress() {
        const progressInfo = document.getElementById('downloadProgress');
        let progress = 0;
        
        const interval = setInterval(() => {
            progress += Math.random() * 20;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                setTimeout(() => {
                    progressInfo.textContent = 'Download complete!';
                }, 1000);
            }
            
            progressInfo.textContent = `Downloading... ${Math.round(progress)}%`;
        }, 200);
    }

    // Pagination
    function setupPagination() {
        pagination.addEventListener('click', function(e) {
            if (e.target.classList.contains('page-btn') && !e.target.disabled) {
                const page = Number.parseInt(e.target.dataset.page, 10);
                currentPage = page;
                renderBooks();
                updatePagination();
            }
        });
    }

    function updatePagination(paginationData) {
        if (!paginationData) return;
        
        const totalPages = paginationData.totalPages;
        const pageNumbers = pagination.querySelector('.page-numbers');
        if (!pageNumbers) return;
        
        // Update page numbers
        let paginationHTML = '';
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        if (startPage > 1) {
            paginationHTML += `<button class="page-btn" data-page="1">1</button>`;
            if (startPage > 2) paginationHTML += '<span class="page-dots">...</span>';
        }

        for (let i = startPage; i <= endPage; i++) {
            paginationHTML += `<button class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
        }
        
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) paginationHTML += '<span class="page-dots">...</span>';
            paginationHTML += `<button class="page-btn" data-page="${totalPages}">${totalPages}</button>`;
        }
        
        pageNumbers.innerHTML = paginationHTML;
        
        // Update prev/next buttons
        const prevBtn = pagination.querySelector('.prev');
        const nextBtn = pagination.querySelector('.next');
        
        if (prevBtn) prevBtn.disabled = currentPage === 1;
        if (nextBtn) nextBtn.disabled = currentPage === totalPages || totalPages === 0;
    }

    // Add More Books Functionality
    function setupAddMoreBooks() {
        if (addMoreBooksBtn) {
            addMoreBooksBtn.addEventListener('click', function() {
                loadMoreBooks();
            });
        }
    }

    function loadMoreBooks() {
        // Show loading state
        addMoreBooksBtn.innerHTML = '<span class="loading-spinner"></span> Loading...';
        addMoreBooksBtn.disabled = true;

        // Simulate loading more books from API
        setTimeout(() => {
            // Add some more books to the database
            const additionalBooks = [
                {
                    id: 'resilience-redefined',
                    title: 'Resilience Redefined',
                    author: 'Dr. Marcus Williams',
                    category: 'self-help',
                    month: "December '22",
                    rating: 4.5,
                    reviewCount: 445,
                    pages: 287,
                    audioDuration: '6h 45m',
                    published: 'December 2022',
                    description: 'Dr. Marcus Williams challenges traditional notions of resilience, offering a fresh perspective on bouncing back from adversity through embracing vulnerability and authentic connection.',
                    formats: ['ebook', 'audio', 'pdf'],
                    new: true,
                    cover: 'https://picsum.photos/seed/resilience-redefined/300/450'
                },
                {
                    id: 'echoes-of-hope',
                    title: 'Echoes of Hope',
                    author: 'Elena Rodriguez',
                    category: 'fiction',
                    month: "November '22",
                    rating: 4.3,
                    reviewCount: 612,
                    pages: 398,
                    audioDuration: '9h 10m',
                    published: 'November 2022',
                    description: 'In this touching novel, a small town\'s residents come together to save their community from destruction, discovering that hope can flourish even in the darkest of times.',
                    formats: ['ebook', 'audio', 'pdf'],
                    cover: 'https://picsum.photos/seed/echoes-of-hope/300/450'
                },
                {
                    id: 'warriors-spirit',
                    title: 'Warrior\'s Spirit',
                    author: 'Colonel James Mitchell',
                    category: 'biography',
                    month: "October '22",
                    rating: 4.8,
                    reviewCount: 889,
                    pages: 445,
                    audioDuration: '10h 30m',
                    published: 'October 2022',
                    description: 'Retired Army Colonel James Mitchell shares lessons from his military career and subsequent humanitarian work, demonstrating how warrior principles can be applied to civilian life for personal and community transformation.',
                    formats: ['ebook', 'audio', 'pdf'],
                    featured: true,
                    cover: 'https://picsum.photos/seed/warriors-spirit/300/450'
                }
            ];

            // Add new books to the database
            booksDatabase.push(...additionalBooks);
            
            // Re-filter and re-render
            filterBooks();
            updateBookCount();
            
            // Reset button
            addMoreBooksBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <circle cx="10" cy="10" r="10" fill="none" stroke="currentColor" stroke-width="2"/>
                    <line x1="10" y1="4" x2="10" y2="16" stroke="currentColor" stroke-width="2"/>
                    <line x1="4" y1="10" x2="16" y2="10" stroke="currentColor" stroke-width="2"/>
                </svg>
                Load More Books
            `;
            addMoreBooksBtn.disabled = false;
            
            showNotification('3 new books added to the collection!');
        }, 1500);
    }

    // Update book count
    function updateBookCount() {
        bookCountSpan.textContent = `${filteredBooks.length} Books`;
    }

    // Featured Book Button Handlers
    function setupFeaturedBookButtons() {
        if (featuredReadMoreBtn) {
            featuredReadMoreBtn.addEventListener('click', function() {
                const bookId = this.dataset.book;
                openBookModal(bookId);
            });
        }
        
        if (featuredGetBookBtn) {
            featuredGetBookBtn.addEventListener('click', function() {
                const bookId = this.dataset.book;
                showDownloadModal(bookId);
            });
        }
    }

    // Initialize everything
    async function init() {
        setupCategoryFilters();
        setupSearch();
        setupSort();
        setupPagination();
        setupAddMoreBooks();
        setupFeaturedBookButtons();
        
        // Initial load
        if (typeof BlogAPI !== 'undefined') {
            await loadBooks();
            await loadSpotlight();
        } else {
            console.warn('BlogAPI not found, falling back to static data');
            filteredBooks = [...booksDatabase];
            renderBooks(true);
            updateBookCount();
        }
        
        // Load wishlist states
        document.querySelectorAll('.wishlist').forEach(btn => {
            const bookId = btn.dataset.book;
            if (localStorage.getItem(`wishlist_${bookId}`) === 'true') {
                btn.classList.add('active');
            }
        });
    }

    // Add CSS animation for notifications
    const style = document.createElement('style');
    style.textContent = `
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
        
        .notification-toast {
            animation: slideInRight 0.3s ease;
        }
        
        .wishlist.active {
            background: var(--accent-coral);
            color: var(--white);
        }
    `;
    document.head.appendChild(style);

    // Start the application
    init();
});