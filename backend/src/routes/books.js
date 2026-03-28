const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { auth } = require('../middleware/auth');

/**
 * @route   GET /api/books
 * @desc    Get all books with filtering and pagination
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const { 
      category, 
      featured, 
      q, 
      sort = 'newest',
      page = 1,
      limit = 12
    } = req.query;

    let query = supabase
      .from('books')
      .select('*', { count: 'exact' });

    // Filtering
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    if (featured === 'true') {
      query = query.eq('is_featured', true);
    }

    if (q) {
      query = query.or(`title.ilike.%${q}%,author.ilike.%${q}%,description.ilike.%${q}%`);
    }

    // Sorting
    switch (sort) {
      case 'oldest':
        query = query.order('created_at', { ascending: true });
        break;
      case 'rating':
        query = query.order('rating', { ascending: false });
        break;
      case 'title':
        query = query.order('title', { ascending: true });
        break;
      case 'newest':
      default:
        query = query.order('created_at', { ascending: false });
    }

    // Pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data: books, error, count } = await query;

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({
      success: true,
      data: books || [],
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        totalPages: Math.ceil(count / limit),
        hasMore: from + (books ? books.length : 0) < count
      }
    });
  } catch (error) {
    console.error('Get books error:', error);
    res.status(500).json({ error: 'Failed to fetch books.' });
  }
});

/**
 * @route   GET /api/books/spotlight
 * @desc    Get the current book spotlight (featured)
 * @access  Public
 */
router.get('/spotlight', async (req, res) => {
  try {
    const { data: book, error } = await supabase
      .from('books')
      .select('*')
      .eq('category', 'spotlight')
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      return res.status(400).json({ error: error.message });
    }

    if (!book) {
      // Fallback to any featured book if no spotlight is set
      const { data: featuredBook } = await supabase
        .from('books')
        .select('*')
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      return res.json({ success: true, data: featuredBook || null });
    }

    res.json({ success: true, data: book });
  } catch (error) {
    console.error('Get spotlight error:', error);
    res.status(500).json({ error: 'Failed to fetch spotlight book.' });
  }
});

/**
 * @route   GET /api/books/:id
 * @desc    Get book by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const { data: book, error } = await supabase
      .from('books')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Book not found.' });
      }
      return res.status(400).json({ error: error.message });
    }

    res.json({ success: true, data: book });
  } catch (error) {
    console.error('Get book error:', error);
    res.status(500).json({ error: 'Failed to fetch book details.' });
  }
});

module.exports = router;
