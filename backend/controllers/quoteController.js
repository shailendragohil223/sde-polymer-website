const { getPool, isMock, getMockDb } = require('../config/db');

exports.createQuote = async (req, res) => {
  try {
    const {
      name, email, phone, company, material,
      shore_hardness, quantity, application_details,
      drawing_notes, estimated_cost
    } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ success: false, message: 'Name, email, and phone are required' });
    }

    if (isMock()) {
      const mock = getMockDb();
      const newQuote = {
        id: Date.now(),
        name,
        email,
        phone,
        company: company || '',
        material: material || '',
        shore_hardness: shore_hardness || '',
        quantity: quantity || '1',
        application_details: application_details || '',
        drawing_notes: drawing_notes || '',
        estimated_cost: estimated_cost || '',
        status: 'pending',
        created_at: new Date().toISOString()
      };
      mock.quoteRequests.unshift(newQuote);
      return res.status(201).json({
        success: true,
        message: 'Quote request submitted successfully (in-memory)',
        data: newQuote
      });
    }

    const pool = getPool();
    const [result] = await pool.query(`
      INSERT INTO quote_requests
      (name, email, phone, company, material, shore_hardness, quantity, application_details, drawing_notes, estimated_cost)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      name,
      email,
      phone,
      company || null,
      material || null,
      shore_hardness || null,
      quantity || '1',
      application_details || null,
      drawing_notes || null,
      estimated_cost || null
    ]);

    res.status(201).json({
      success: true,
      message: 'Quote request submitted successfully! Our engineering team will review and contact you within 24 hours.',
      quoteId: result.insertId
    });
  } catch (error) {
    console.error('Error submitting quote:', error);
    res.status(500).json({ success: false, message: 'Failed to submit quote request' });
  }
};

exports.getQuotes = async (req, res) => {
  try {
    if (isMock()) {
      const mock = getMockDb();
      return res.json({ success: true, data: mock.quoteRequests || [] });
    }

    const pool = getPool();
    const [quotes] = await pool.query('SELECT * FROM quote_requests ORDER BY created_at DESC');
    res.json({ success: true, count: quotes.length, data: quotes });
  } catch (error) {
    console.error('Error fetching quotes:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch quote requests' });
  }
};

exports.updateQuoteStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'in_review', 'contacted', 'closed'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    if (isMock()) {
      const mock = getMockDb();
      const quote = (mock.quoteRequests || []).find(q => q.id == id);
      if (quote) quote.status = status;
      return res.json({ success: true, message: 'Status updated (in-memory)' });
    }

    const pool = getPool();
    await pool.query('UPDATE quote_requests SET status = ? WHERE id = ?', [status, id]);
    res.json({ success: true, message: 'Quote status updated successfully' });
  } catch (error) {
    console.error('Error updating quote status:', error);
    res.status(500).json({ success: false, message: 'Failed to update quote status' });
  }
};
