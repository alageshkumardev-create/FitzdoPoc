const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET /api/products - List products with search, filter, sort, pagination
router.get('/', async (req, res) => {
  try {
    const {
      q = '',           // search query
      page = 1,         // page number
      limit = 12,       // items per page
      sort = '-createdAt', // sort field
      category = '',    // category filter
      minPrice = 0,     // minimum price
      maxPrice = 999999, // maximum price
      minRating = 0,    // minimum rating
      sponsored = ''    // filter for sponsored products
    } = req.query;

    // Build query
    const query = {};

    // Text search
    if (q) {
      query.$text = { $search: q };
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // Price range
    query.price = { $gte: parseFloat(minPrice), $lte: parseFloat(maxPrice) };

    // Rating filter
    if (parseFloat(minRating) > 0) {
      query.rating = { $gte: parseFloat(minRating) };
    }

    // Sponsored filter
    if (sponsored === 'true') {
      query.tags = 'Fitzdo Sponsored';
    }

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Execute query
    const products = await Product.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    // Get total count for pagination
    const total = await Product.countDocuments(query);

    res.json({
      items: products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Server error fetching products' });
  }
});

// GET /api/products/:id - Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);

    if (error.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(500).json({ error: 'Server error fetching product' });
  }
});

module.exports = router;
