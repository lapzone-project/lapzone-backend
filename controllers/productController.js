const Product = require('../models/Product');
const StockLog = require('../models/StockLog');
const Brand = require('../models/Brand');
const Category = require('../models/Category');

// Helper to handle "Typable" fields and Boolean conversion
const parseValue = (val) => {
  if (val === 'true') return true;
  if (val === 'false') return false;
  if (typeof val === 'string') {
    try {
      // If it looks like JSON but uses single quotes, fix it
      let sanitized = val.trim();
      if (sanitized.startsWith('{') || sanitized.startsWith('[')) {
        // Simple regex to replace single quotes with double quotes for JSON parsing
        // This is a basic fix for human-typed "JSON"
        sanitized = sanitized.replace(/'/g, '"');
        return JSON.parse(sanitized);
      }
    } catch (e) {
      return val; // Allow it to stay as a string (Typable)
    }
  }
  return val;
};

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ msg: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Staff/Owner
const createProduct = async (req, res) => {
  try {
    const body = req.body;
    
    // Process all fields through the parseValue helper
    const processedData = {};
    for (const key in body) {
      processedData[key] = parseValue(body[key]);
    }

    const uploadedImages = req.files ? req.files.map((file, index) => ({
      url: file.path,
      isPrimary: index === 0 && (!processedData.images || processedData.images.length === 0)
    })) : [];

    // Merge uploaded images with any provided in the JSON body
    const finalImages = [
      ...(Array.isArray(processedData.images) ? processedData.images : (processedData.images ? [processedData.images] : [])),
      ...uploadedImages
    ];

    const product = new Product({
      ...processedData,
      images: finalImages,
      createdBy: req.user._id
    });

    const createdProduct = await product.save();

    // Log the initial stock creation
    await StockLog.create({
      productId: createdProduct._id,
      changedBy: req.user._id,
      oldStock: 0,
      newStock: product.inventory?.quantity || 0,
      action: 'CREATE'
    });

    res.status(201).json(createdProduct);
  } catch (error) {
    console.error('Create Error:', error);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Staff/Owner
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      const body = req.body;
      const oldStock = product.inventory?.quantity || 0;

      // Update fields with parsing logic
      for (const key in body) {
        product[key] = parseValue(body[key]);
      }

      if (req.files && req.files.length > 0) {
        const uploadedImages = req.files.map(file => ({
          url: file.path,
          isPrimary: false
        }));
        // Merge with existing images (which might have been updated from body just above)
        product.images = [...(product.images || []), ...uploadedImages];
      }

      product.updatedBy = req.user._id;
      const updatedProduct = await product.save();

      // Log stock change
      const newStock = updatedProduct.inventory?.quantity || 0;
      if (newStock !== oldStock) {
        await StockLog.create({
          productId: updatedProduct._id,
          changedBy: req.user._id,
          oldStock,
          newStock,
          action: 'UPDATE'
        });
      }

      res.json(updatedProduct);
    } else {
      res.status(404).json({ msg: 'Product not found' });
    }
  } catch (error) {
    console.error('Update Error:', error);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Owner
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await StockLog.create({
        productId: product._id,
        changedBy: req.user._id,
        oldStock: product.inventory?.quantity || 0,
        newStock: 0,
        action: 'DELETE'
      });

      await Product.findByIdAndDelete(req.params.id);
      res.json({ msg: 'Product removed' });
    } else {
      res.status(404).json({ msg: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

// @desc    Update stock only
// @route   PATCH /api/products/:id/stock
// @access  Private/Staff/Owner
const updateStock = async (req, res) => {
  try {
    const { quantity } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      const oldStock = product.inventory?.quantity || 0;
      
      // Ensure inventory object exists
      if (!product.inventory) product.inventory = {};
      
      product.inventory.quantity = Number(quantity);
      product.inventory.instock = Number(quantity) > 0;
      product.updatedBy = req.user._id;

      const updatedProduct = await product.save();

      await StockLog.create({
        productId: updatedProduct._id,
        changedBy: req.user._id,
        oldStock,
        newStock: Number(quantity),
        action: 'UPDATE'
      });

      res.json(updatedProduct);
    } else {
      res.status(404).json({ msg: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

// @desc    Get stock logs
// @route   GET /api/stock/logs
// @access  Private/Owner
const getStockLogs = async (req, res) => {
  try {
    const logs = await StockLog.find({})
      .populate('productId', 'name sku')
      .populate('changedBy', 'name email role')
      .sort({ createdAt: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock,
  getStockLogs
};
