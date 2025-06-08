const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

// Validation middleware for product creation and update
function validateProduct(req, res, next) {
  const { name, description, price, category, inStock } = req.body;
  if (
    typeof name !== 'string' ||
    typeof description !== 'string' ||
    typeof price !== 'number' ||
    typeof category !== 'string' ||
    typeof inStock !== 'boolean'
  ) {
    return res.status(400).json({ error: 'Validation error: Invalid product data' });
  }
  next();
}

// GET /api/products - List all products with filtering, pagination, and search
router.get('/', async (req, res, next) => {
  try {
    const { category, search, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (category) {
      filter.category = new RegExp(`^${category}$`, 'i'); // case-insensitive exact match
    }
    if (search) {
      filter.name = new RegExp(search, 'i'); // case-insensitive partial match
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter).skip(skip).limit(parseInt(limit));

    res.json({
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      products
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/products/:id - Get a specific product by ID
router.get('/:id', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    next(err);
  }
});

// POST /api/products - Create a new product
router.post('/', validateProduct, async (req, res, next) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    next(err);
  }
});

// PUT /api/products/:id - Update an existing product
router.put('/:id', validateProduct, async (req, res, next) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(updatedProduct);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/products/:id - Delete a product
router.delete('/:id', async (req, res, next) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

// GET /api/products/stats/category-count - Product statistics route
router.get('/stats/category-count', async (req, res, next) => {
  try {
    const counts = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);
    const result = {};
    counts.forEach(c => {
      result[c._id] = c.count;
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
