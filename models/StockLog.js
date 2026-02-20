const mongoose = require('mongoose');

const stockLogSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  changedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  oldStock: {
    type: Number,
    required: true
  },
  newStock: {
    type: Number,
    required: true
  },
  action: {
    type: String,
    enum: ['CREATE', 'UPDATE', 'DELETE'],
    default: 'UPDATE'
  }
}, {
  timestamps: true
});

const StockLog = mongoose.model('StockLog', stockLogSchema);
module.exports = StockLog;
