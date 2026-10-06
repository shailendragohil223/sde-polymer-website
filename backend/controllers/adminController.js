const { getPool, isMock, getMockDb } = require('../config/db');

exports.getDashboardStats = async (req, res) => {
  try {
    if (isMock()) {
      const mock = getMockDb();
      const totalProducts = mock.products ? mock.products.length : 0;
      const totalCategories = mock.categories ? mock.categories.length : 0;
      const totalQuotes = mock.quoteRequests ? mock.quoteRequests.length : 0;
      const pendingQuotes = mock.quoteRequests ? mock.quoteRequests.filter(q => q.status === 'pending').length : 0;
      const totalInquiries = mock.contactInquiries ? mock.contactInquiries.length : 0;
      const newInquiries = mock.contactInquiries ? mock.contactInquiries.filter(i => i.status === 'new').length : 0;

      return res.json({
        success: true,
        data: {
          totalProducts,
          totalCategories,
          totalQuotes,
          pendingQuotes,
          totalInquiries,
          newInquiries,
          dbMode: 'in-memory-fallback'
        }
      });
    }

    const pool = getPool();
    const [[{ totalProducts }]] = await pool.query('SELECT COUNT(*) as totalProducts FROM products');
    const [[{ totalCategories }]] = await pool.query('SELECT COUNT(*) as totalCategories FROM categories');
    const [[{ totalQuotes }]] = await pool.query('SELECT COUNT(*) as totalQuotes FROM quote_requests');
    const [[{ pendingQuotes }]] = await pool.query("SELECT COUNT(*) as pendingQuotes FROM quote_requests WHERE status = 'pending'");
    const [[{ totalInquiries }]] = await pool.query('SELECT COUNT(*) as totalInquiries FROM contact_inquiries');
    const [[{ newInquiries }]] = await pool.query("SELECT COUNT(*) as newInquiries FROM contact_inquiries WHERE status = 'new'");

    res.json({
      success: true,
      data: {
        totalProducts,
        totalCategories,
        totalQuotes,
        pendingQuotes,
        totalInquiries,
        newInquiries,
        dbMode: 'mysql'
      }
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch admin stats' });
  }
};
