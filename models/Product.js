const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  sku: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  brand: {
    type: mongoose.Schema.Types.Mixed // 100% Typable - no ref
  },
  category: {
    type: mongoose.Schema.Types.Mixed // 100% Typable - no ref
  },
  specifications: { type: mongoose.Schema.Types.Mixed },
  pricing: { type: mongoose.Schema.Types.Mixed },
  condition: { type: mongoose.Schema.Types.Mixed },
  warranty: { type: mongoose.Schema.Types.Mixed },
  isLapzoneCertified: {
    type: Boolean,
    default: false
  },
  images: { type: mongoose.Schema.Types.Mixed }, // Fully flexible images
  inventory: {
    instock: {
      type: Boolean,
      default: true
    },
    quantity: {
      type: Number,
      default: 0
    },
    reserved: {
      type: Number,
      default: 0
    }
  },
  ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  analytics: {
    views: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    purchased: { type: Number, default: 0 }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  strict: false,
  toJSON: {
    transform: function (doc, ret) {
      delete ret.__v;
      return ret;
    }
  }
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
