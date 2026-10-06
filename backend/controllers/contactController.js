const { getPool, isMock, getMockDb } = require('../config/db');

exports.createInquiry = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, and message are required' });
    }

    if (isMock()) {
      const mock = getMockDb();
      const newInquiry = {
        id: Date.now(),
        name,
        email,
        phone: phone || '',
        subject: subject || '',
        message,
        status: 'new',
        created_at: new Date().toISOString()
      };
      mock.contactInquiries.unshift(newInquiry);
      return res.status(201).json({
        success: true,
        message: 'Your message has been sent successfully (in-memory). We will contact you soon.',
        data: newInquiry
      });
    }

    const pool = getPool();
    const [result] = await pool.query(`
      INSERT INTO contact_inquiries (name, email, phone, subject, message)
      VALUES (?, ?, ?, ?, ?)
    `, [name, email, phone || null, subject || null, message]);

    res.status(201).json({
      success: true,
      message: 'Your inquiry has been received! Our team will respond shortly.',
      inquiryId: result.insertId
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ success: false, message: 'Failed to send message' });
  }
};

exports.getInquiries = async (req, res) => {
  try {
    if (isMock()) {
      const mock = getMockDb();
      return res.json({ success: true, data: mock.contactInquiries || [] });
    }

    const pool = getPool();
    const [inquiries] = await pool.query('SELECT * FROM contact_inquiries ORDER BY created_at DESC');
    res.json({ success: true, count: inquiries.length, data: inquiries });
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch contact inquiries' });
  }
};

exports.updateInquiryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['new', 'read', 'replied'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    if (isMock()) {
      const mock = getMockDb();
      const item = (mock.contactInquiries || []).find(i => i.id == id);
      if (item) item.status = status;
      return res.json({ success: true, message: 'Inquiry status updated (in-memory)' });
    }

    const pool = getPool();
    await pool.query('UPDATE contact_inquiries SET status = ? WHERE id = ?', [status, id]);
    res.json({ success: true, message: 'Inquiry status updated successfully' });
  } catch (error) {
    console.error('Error updating inquiry status:', error);
    res.status(500).json({ success: false, message: 'Failed to update inquiry status' });
  }
};
