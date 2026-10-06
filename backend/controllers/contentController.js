const { getPool, isMock, getMockDb } = require('../config/db');

exports.getSiteInfo = async (req, res) => {
  try {
    if (isMock()) {
      const mock = getMockDb();
      const settingsMap = {};
      mock.siteSettings.forEach(s => { settingsMap[s.setting_key] = s.setting_value; });

      return res.json({
        success: true,
        source: 'in-memory-fallback',
        data: {
          settings: settingsMap,
          heroStats: mock.heroStats,
          specsTicker: mock.specsTicker,
          industries: mock.industries,
          whyChoose: mock.whyChoose,
          processSteps: mock.processSteps,
          applications: mock.applications,
          trustPoints: mock.trustPoints
        }
      });
    }

    const pool = getPool();
    const [settings] = await pool.query('SELECT setting_key, setting_value, setting_group FROM site_settings');
    const [heroStats] = await pool.query('SELECT num, lbl FROM hero_stats ORDER BY order_index ASC');
    const [specsTicker] = await pool.query('SELECT material, details FROM specs_ticker ORDER BY order_index ASC');
    const [industries] = await pool.query('SELECT id, name, icon, description FROM industries ORDER BY order_index ASC');
    const [whyChoose] = await pool.query('SELECT id, title, description, icon FROM why_choose ORDER BY order_index ASC');
    const [processSteps] = await pool.query('SELECT id, step_number, title, description FROM process_steps ORDER BY order_index ASC');
    const [applications] = await pool.query('SELECT id, title, description, category_tag FROM applications ORDER BY order_index ASC');
    const [trustPoints] = await pool.query('SELECT id, title, description FROM trust_points ORDER BY order_index ASC');

    const settingsMap = {};
    settings.forEach(s => { settingsMap[s.setting_key] = s.setting_value; });

    res.json({
      success: true,
      source: 'mysql',
      data: {
        settings: settingsMap,
        heroStats,
        specsTicker,
        industries,
        whyChoose,
        processSteps,
        applications,
        trustPoints
      }
    });
  } catch (error) {
    console.error('Error fetching site info:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving site data' });
  }
};

exports.updateSetting = async (req, res) => {
  const { setting_key, setting_value } = req.body;
  if (!setting_key) {
    return res.status(400).json({ success: false, message: 'setting_key is required' });
  }

  try {
    if (isMock()) {
      const mock = getMockDb();
      const item = mock.siteSettings.find(s => s.setting_key === setting_key);
      if (item) item.setting_value = setting_value;
      else mock.siteSettings.push({ setting_key, setting_value, setting_group: 'custom' });
      return res.json({ success: true, message: 'Setting updated (in-memory)' });
    }

    const pool = getPool();
    await pool.query(
      `INSERT INTO site_settings (setting_key, setting_value) 
       VALUES (?, ?) 
       ON DUPLICATE KEY UPDATE setting_value = ?`,
      [setting_key, setting_value, setting_value]
    );

    res.json({ success: true, message: 'Setting updated successfully' });
  } catch (error) {
    console.error('Error updating setting:', error);
    res.status(500).json({ success: false, message: 'Failed to update setting' });
  }
};
