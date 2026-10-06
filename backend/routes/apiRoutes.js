const express = require('express');
const router = express.Router();

const contentController = require('../controllers/contentController');
const productController = require('../controllers/productController');
const quoteController = require('../controllers/quoteController');
const contactController = require('../controllers/contactController');
const adminController = require('../controllers/adminController');
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware');

// ================= PUBLIC ROUTES =================

// Authentication Routes
router.post('/auth/login', authController.login);
router.get('/auth/verify', authMiddleware, authController.verify);

// Content & Site Metadata Routes
router.get('/site-info', contentController.getSiteInfo);

// Category & Product Catalog Public Routes
router.get('/categories', productController.getCategories);
router.get('/products', productController.getProducts);
router.get('/products/:id', productController.getProductById);

// Public Submissions
router.post('/quotes', quoteController.createQuote);
router.post('/contact', contactController.createInquiry);


// ================= PROTECTED ADMIN ROUTES =================

// Admin Site Settings Update
router.post('/site-settings', authMiddleware, contentController.updateSetting);

// Admin Product Catalog Management (CRUD)
router.post('/products', authMiddleware, productController.createProduct);
router.put('/products/:id', authMiddleware, productController.updateProduct);
router.delete('/products/:id', authMiddleware, productController.deleteProduct);

// Admin RFQ Quotes Inquiries Management
router.get('/quotes', authMiddleware, quoteController.getQuotes);
router.patch('/quotes/:id/status', authMiddleware, quoteController.updateQuoteStatus);

// Admin Contact Inquiries Management
router.get('/contact', authMiddleware, contactController.getInquiries);
router.patch('/contact/:id/status', authMiddleware, contactController.updateInquiryStatus);

// Admin Dashboard KPI Stats
router.get('/admin/stats', authMiddleware, adminController.getDashboardStats);

module.exports = router;
