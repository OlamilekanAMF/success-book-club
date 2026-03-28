const express = require('express');
const router = express.Router();
const { cacheMiddleware, cacheResponse, CACHE_TTL } = require('../middleware/googleBooksCache');
const { rateLimitMiddleware } = require('../middleware/googleBooksRateLimit');

const apiKey = process.env.GOOGLE_BOOKS_API_KEY;

// Featured authors with real images from Open Library/Wikipedia
const FEATURED_AUTHORS = [
    {
        id: '1',
        name: 'Chimamanda Ngozi Adichie',
        searchName: 'Chimamanda Ngozi Adichie',
        nationality: 'Nigerian',
        bio: 'Award-winning novelist known for her powerful storytelling and exploration of Nigerian and African experiences. Her works have been translated into over 30 languages.',
        awards: ['Orange Prize for Fiction', 'National Book Critics Circle Award'],
        // Real image from Wikipedia
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Chimamanda_Ngozi_Adichie_2012_Shine_Portrait.jpg/440px-Chimamanda_Ngozi_Adichie_2012_Shine_Portrait.jpg'
    },
    {
        id: '2',
        name: 'James Clear',
        searchName: 'James Clear',
        nationality: 'American',
        bio: 'Author and speaker focused on habits, decision-making, and continuous improvement. His evidence-based approach has helped millions build better habits.',
        awards: ['New York Times Bestselling Author'],
        // Real author image
        image: 'https://images-na.ssl-images-amazon.com/images/I/71ZEOVJ44mL._AC_SL150_.jpg'
    },
    {
        id: '3',
        name: 'Colleen Hoover',
        searchName: 'Colleen Hoover',
        nationality: 'American',
        bio: 'Prolific romance and thriller author who has sold millions of copies worldwide. Known for emotionally intense stories that resonate with readers globally.',
        awards: ['Goodreads Choice Awards Winner'],
        // Real author image
        image: 'https://images-na.ssl-images-amazon.com/images/I/81XvDvuw%2BcL._AC_SL1500_.jpg'
    },
    {
        id: '4',
        name: 'Taylor Jenkins Reid',
        searchName: 'Taylor Jenkins Reid',
        nationality: 'American',
        bio: 'Contemporary fiction author known for her deeply emotional novels exploring family, relationships, and personal journeys.',
        awards: ['Goodreads Choice Awards Finalist'],
        // Real author image from Goodreads
        image: 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/authors/1391707224l/6981122.jpg'
    },
    {
        id: '5',
        name: 'Emily Henry',
        searchName: 'Emily Henry author',
        nationality: 'American',
        bio: 'Romance author known for witty, heartwarming stories that have become instant New York Times bestsellers.',
        awards: ['NPR Best Books of the Year'],
        // Real author image from Goodreads
        image: 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/authors/1612834264l/18630212.jpg'
    },
    {
        id: '6',
        name: 'Matt Haig',
        searchName: 'Matt Haig author',
        nationality: 'British',
        bio: 'Versatile author writing across fiction, non-fiction, and children\'s books. Known for his candid discussions about mental health and human resilience.',
        awards: ['The Book of the Year Award'],
        // Real author image
        image: 'https://images-na.ssl-images-amazon.com/images/I/81H6P2B2g2L._AC_SL1500_.jpg'
    }
];

async function fetchAuthorBooksFromAPI(authorName, maxResults = 4) {
    try {
        const url = `https://www.googleapis.com/books/v1/volumes?q=inauthor:${encodeURIComponent(authorName)}&maxResults=${maxResults}&orderBy=relevance${apiKey ? `&key=${apiKey}` : ''}`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (!data.items) return [];
        
        return data.items.map(item => ({
            id: item.id,
            title: item.volumeInfo?.title || 'Untitled',
            authors: item.volumeInfo?.authors || [],
            thumbnail: item.volumeInfo?.imageLinks?.thumbnail || item.volumeInfo?.imageLinks?.smallThumbnail,
            previewLink: item.volumeInfo?.previewLink,
            averageRating: item.volumeInfo?.averageRating || null,
            pageCount: item.volumeInfo?.pageCount || null
        }));
    } catch (error) {
        console.error('Error fetching author books:', error);
        return [];
    }
}

/**
 * @route   GET /api/authors/featured
 * @desc    Get featured authors with their books
 * @access  Public
 */
router.get('/featured', rateLimitMiddleware, cacheMiddleware(CACHE_TTL.AUTHOR), async (req, res) => {
    try {
        const { maxResults = 4 } = req.query;
        
        // Check cache first
        if (res.locals.cachedData) {
            return res.json({
                ...res.locals.cachedData,
                fromCache: true
            });
        }

        // Fetch books for each author
        const authorsWithBooks = await Promise.all(
            FEATURED_AUTHORS.map(async (author) => {
                const books = await fetchAuthorBooksFromAPI(author.searchName, parseInt(maxResults));
                return {
                    ...author,
                    books_count: books.length,
                    books: books.map(book => ({
                        id: book.id,
                        title: book.title,
                        authors: book.authors,
                        thumbnail: book.thumbnail,
                        previewLink: book.previewLink,
                        rating: book.averageRating,
                        pageCount: book.pageCount
                    }))
                };
            })
        );

        const result = {
            success: true,
            data: authorsWithBooks,
            total: authorsWithBooks.length,
            fromCache: false
        };

        // Cache the response
        cacheResponse(req, res, result);

        res.json(result);
    } catch (error) {
        console.error('Featured Authors Error:', error);
        res.status(500).json({ 
            success: false,
            error: { code: 'AUTHORS_ERROR', message: 'Failed to fetch featured authors' } 
        });
    }
});

/**
 * @route   GET /api/authors/search
 * @desc    Search for authors by name
 * @access  Public
 */
router.get('/search', rateLimitMiddleware, async (req, res) => {
    try {
        const { q } = req.query;
        
        if (!q) {
            return res.status(400).json({ 
                success: false, 
                error: { code: 'MISSING_QUERY', message: 'Search query is required' } 
            });
        }

        const url = `https://www.googleapis.com/books/v1/volumes?q=inauthor:${encodeURIComponent(q)}&maxResults=10&orderBy=relevance${apiKey ? `&key=${apiKey}` : ''}`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (!data.items) {
            return res.json({
                success: true,
                data: []
            });
        }

        // Extract unique authors from results
        const authorsMap = new Map();
        data.items.forEach(item => {
            if (item.volumeInfo?.authors) {
                item.volumeInfo.authors.forEach(authorName => {
                    if (!authorsMap.has(authorName)) {
                        authorsMap.set(authorName, {
                            name: authorName,
                            searchName: authorName,
                            nationality: 'Unknown',
                            bio: 'Popular author with multiple published works.',
                            awards: [],
                            image: null,
                            books_count: 0,
                            books: []
                        });
                    }
                    const author = authorsMap.get(authorName);
                    author.books_count++;
                    if (author.books.length < 3) {
                        author.books.push({
                            id: item.id,
                            title: item.volumeInfo.title,
                            thumbnail: item.volumeInfo.imageLinks?.thumbnail,
                            previewLink: item.volumeInfo.previewLink
                        });
                    }
                });
            }
        });

        res.json({
            success: true,
            data: Array.from(authorsMap.values())
        });
    } catch (error) {
        console.error('Author Search Error:', error);
        res.status(500).json({ 
            success: false,
            error: { code: 'SEARCH_ERROR', message: 'Failed to search authors' } 
        });
    }
});

module.exports = router;
