const express = require('express');
const router = express.Router();
const { cacheMiddleware, cacheResponse, getCachedData } = require('../middleware/googleBooksCache');
const { rateLimitMiddleware } = require('../middleware/googleBooksRateLimit');

const apiKey = process.env.GOOGLE_BOOKS_API_KEY;

function transformBook(item) {
    return {
        id: item.id,
        title: item.volumeInfo?.title || 'Untitled',
        authors: item.volumeInfo?.authors || [],
        description: item.volumeInfo?.description,
        categories: item.volumeInfo?.categories || [],
        pageCount: item.volumeInfo?.pageCount,
        publishedDate: item.volumeInfo?.publishedDate,
        averageRating: item.volumeInfo?.averageRating,
        ratingsCount: item.volumeInfo?.ratingsCount,
        thumbnail: item.volumeInfo?.imageLinks?.thumbnail || item.volumeInfo?.imageLinks?.smallThumbnail,
        previewLink: item.volumeInfo?.previewLink,
        infoLink: item.volumeInfo?.infoLink,
        isbn: item.volumeInfo?.industryIdentifiers?.find(id => id.type === 'ISBN_13')?.identifier,
        language: item.volumeInfo?.language
    };
}

async function callGoogleBooks(url) {
    const response = await fetch(url);
    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.error?.message || 'Google Books API error');
    }
    
    return data;
}

/**
 * @route   GET /api/external-books/search
 * @desc    Search for books via Google Books API
 * @access  Public
 */
router.get('/search', rateLimitMiddleware, cacheMiddleware(), async (req, res) => {
    try {
        const { q, maxResults = 12, startIndex = 0 } = req.query;
        
        if (!q) {
            return res.status(400).json({ 
                success: false, 
                error: { code: 'MISSING_QUERY', message: 'Search query is required' } 
            });
        }

        // Check cache first
        if (res.locals.cachedData) {
            return res.json({
                ...res.locals.cachedData,
                fromCache: true
            });
        }

        const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}&maxResults=${maxResults}&startIndex=${startIndex}${apiKey ? `&key=${apiKey}` : ''}`;

        const data = await callGoogleBooks(url);
        
        const books = (data.items || []).map(transformBook);
        
        const result = {
            success: true,
            data: books,
            totalItems: data.totalItems,
            fromCache: false
        };
        
        // Cache the response
        cacheResponse(req, res, result);
        
        res.json(result);
    } catch (error) {
        console.error('Google Books Search Error:', error);
        res.status(500).json({ 
            success: false,
            error: { code: 'SEARCH_ERROR', message: 'Failed to search external books' } 
        });
    }
});

/**
 * @route   GET /api/external-books/trending
 * @desc    Get trending/bestseller books
 * @access  Public
 */
router.get('/trending', rateLimitMiddleware, cacheMiddleware(), async (req, res) => {
    try {
        const { maxResults = 12 } = req.query;
        
        // Check cache first
        if (res.locals.cachedData) {
            return res.json({
                ...res.locals.cachedData,
                fromCache: true
            });
        }

        const url = `https://www.googleapis.com/books/v1/volumes?q=bestseller+fiction&maxResults=${maxResults}&orderBy=relevance${apiKey ? `&key=${apiKey}` : ''}`;

        const data = await callGoogleBooks(url);
        
        const books = (data.items || []).map(transformBook);
        
        const result = {
            success: true,
            data: books,
            totalItems: data.totalItems,
            type: 'trending',
            fromCache: false
        };
        
        cacheResponse(req, res, result);
        
        res.json(result);
    } catch (error) {
        console.error('Google Books Trending Error:', error);
        res.status(500).json({ 
            success: false,
            error: { code: 'TRENDING_ERROR', message: 'Failed to fetch trending books' } 
        });
    }
});

/**
 * @route   GET /api/external-books/new-releases
 * @desc    Get newest releases
 * @access  Public
 */
router.get('/new-releases', rateLimitMiddleware, cacheMiddleware(), async (req, res) => {
    try {
        const { maxResults = 12 } = req.query;
        
        // Check cache first
        if (res.locals.cachedData) {
            return res.json({
                ...res.locals.cachedData,
                fromCache: true
            });
        }

        const url = `https://www.googleapis.com/books/v1/volumes?q=subject:fiction&maxResults=${maxResults}&orderBy=newest${apiKey ? `&key=${apiKey}` : ''}`;

        const data = await callGoogleBooks(url);
        
        const books = (data.items || []).map(transformBook);
        
        const result = {
            success: true,
            data: books,
            totalItems: data.totalItems,
            type: 'new-releases',
            fromCache: false
        };
        
        cacheResponse(req, res, result);
        
        res.json(result);
    } catch (error) {
        console.error('Google Books New Releases Error:', error);
        res.status(500).json({ 
            success: false,
            error: { code: 'NEW_RELEASES_ERROR', message: 'Failed to fetch new releases' } 
        });
    }
});

/**
 * @route   GET /api/external-books/category/:category
 * @desc    Get books by category
 * @access  Public
 */
router.get('/category/:category', rateLimitMiddleware, cacheMiddleware(), async (req, res) => {
    try {
        const { category } = req.params;
        const { maxResults = 12, startIndex = 0 } = req.query;
        
        // Check cache first
        if (res.locals.cachedData) {
            return res.json({
                ...res.locals.cachedData,
                fromCache: true
            });
        }

        const url = `https://www.googleapis.com/books/v1/volumes?q=subject:${encodeURIComponent(category)}&maxResults=${maxResults}&startIndex=${startIndex}${apiKey ? `&key=${apiKey}` : ''}`;

        const data = await callGoogleBooks(url);
        
        const books = (data.items || []).map(transformBook);
        
        const result = {
            success: true,
            data: books,
            totalItems: data.totalItems,
            category,
            type: 'category',
            fromCache: false
        };
        
        cacheResponse(req, res, result);
        
        res.json(result);
    } catch (error) {
        console.error('Google Books Category Error:', error);
        res.status(500).json({ 
            success: false,
            error: { code: 'CATEGORY_ERROR', message: 'Failed to fetch category books' } 
        });
    }
});

/**
 * @route   GET /api/external-books/author/:name
 * @desc    Get books by author
 * @access  Public
 */
router.get('/author/:name', rateLimitMiddleware, cacheMiddleware(), async (req, res) => {
    try {
        const { name } = req.params;
        const { maxResults = 12 } = req.query;
        
        // Check cache first
        if (res.locals.cachedData) {
            return res.json({
                ...res.locals.cachedData,
                fromCache: true
            });
        }

        const url = `https://www.googleapis.com/books/v1/volumes?q=inauthor:${encodeURIComponent(name)}&maxResults=${maxResults}${apiKey ? `&key=${apiKey}` : ''}`;

        const data = await callGoogleBooks(url);
        
        const books = (data.items || []).map(transformBook);
        
        const result = {
            success: true,
            data: books,
            totalItems: data.totalItems,
            author: name,
            type: 'author',
            fromCache: false
        };
        
        cacheResponse(req, res, result);
        
        res.json(result);
    } catch (error) {
        console.error('Google Books Author Error:', error);
        res.status(500).json({ 
            success: false,
            error: { code: 'AUTHOR_ERROR', message: 'Failed to fetch author books' } 
        });
    }
});

/**
 * @route   GET /api/external-books/recommended
 * @desc    Get recommended books based on seed
 * @access  Public
 */
router.get('/recommended', rateLimitMiddleware, cacheMiddleware(), async (req, res) => {
    try {
        const { seed = 'fiction bestseller', maxResults = 12 } = req.query;
        
        // Check cache first
        if (res.locals.cachedData) {
            return res.json({
                ...res.locals.cachedData,
                fromCache: true
            });
        }

        const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(seed)}&maxResults=${maxResults}${apiKey ? `&key=${apiKey}` : ''}`;

        const data = await callGoogleBooks(url);
        
        const books = (data.items || []).map(transformBook);
        
        const result = {
            success: true,
            data: books,
            totalItems: data.totalItems,
            type: 'recommended',
            fromCache: false
        };
        
        cacheResponse(req, res, result);
        
        res.json(result);
    } catch (error) {
        console.error('Google Books Recommended Error:', error);
        res.status(500).json({ 
            success: false,
            error: { code: 'RECOMMENDED_ERROR', message: 'Failed to fetch recommended books' } 
        });
    }
});

/**
 * @route   GET /api/external-books/:id
 * @desc    Get details for a specific book from Google Books
 * @access  Public
 */
router.get('/:id', rateLimitMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        
        const url = `https://www.googleapis.com/books/v1/volumes/${id}${apiKey ? `?key=${apiKey}` : ''}`;

        const data = await callGoogleBooks(url);
        
        const book = transformBook(data);
        
        res.json({ 
            success: true, 
            data: book 
        });
    } catch (error) {
        console.error('Google Books Detail Error:', error);
        res.status(500).json({ 
            success: false,
            error: { code: 'DETAIL_ERROR', message: 'Failed to fetch book details' } 
        });
    }
});

module.exports = router;
