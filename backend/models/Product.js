const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Product title is required'],
    trim: true
  },
  brand: {
    type: String,
    required: [true, 'Brand is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  mrp: {
    type: Number,
    required: [true, 'MRP is required'],
    min: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  ratingCount: {
    type: Number,
    default: 0,
    min: 0
  },
  discountPercent: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  tags: [{
    type: String,
    trim: true
  }],
  imageUrl: {
    type: String,
    required: [true, 'Image URL is required']
  },
  deliveryInfo: {
    type: String,
    default: 'FREE delivery by Tomorrow 10pm'
  },
  description: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  inStock: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for text search
productSchema.index({ title: 'text', brand: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
