import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  sku: {
    type: String,
    required: true,
    // unique: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    // unique: true,
    lowercase: true,
    trim: true
  },
  brand: {
    type: mongoose.Schema.Types.Mixed // 100% Typable - no ref
  },
  category: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  specifications: { type: mongoose.Schema.Types.Mixed },
  pricing: { type: mongoose.Schema.Types.Mixed },
  condition: { type: mongoose.Schema.Types.Mixed },
  isLapzoneCertified: {
    type: Boolean,
    default: false
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  currStock: {
    type: Boolean,
    default: true
  },
  images: { type: mongoose.Schema.Types.Mixed },
  inventory: {
    instock: {
      type: Boolean,
      default: true
    },
    quantity: {
      type: Number,
      default: 0
    }
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
export default Product;
