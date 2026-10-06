const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const initialData = require('../db/seedData');

dotenv.config();

let pool = null;
let isMockMode = false;
let mockDb = JSON.parse(JSON.stringify(initialData));

// Add storage for quotes & inquiries in mock store
mockDb.quoteRequests = [];
mockDb.contactInquiries = [];

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  database: process.env.DB_NAME || 'sde_polymer_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

async function initializeDatabase() {
  try {
    console.log(`Connecting to MySQL at ${dbConfig.host}:${dbConfig.port} as '${dbConfig.user}'...`);
    
    // Connect without selecting database to ensure database exists
    const rootConnection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
      port: dbConfig.port
    });

    await rootConnection.query(
      `CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
    );
    await rootConnection.end();

    // Create pool with target database
    pool = mysql.createPool(dbConfig);

    // Test connection
    const testConn = await pool.getConnection();
    console.log(`Successfully connected to MySQL database: ${dbConfig.database}`);
    testConn.release();

    // Create tables
    await createTables();

    // Seed tables if empty
    await seedTablesIfEmpty();

    isMockMode = false;
    return true;
  } catch (error) {
    console.warn('⚠️  MySQL Database connection failed:', error.message);
    console.warn('⚡ Running in In-Memory / Resilient Fallback Mode. Please check DB_USER / DB_PASSWORD in backend/.env to connect to live MySQL.');
    isMockMode = true;
    return false;
  }
}

async function createTables() {
  const queries = [
    `CREATE TABLE IF NOT EXISTS site_settings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      setting_key VARCHAR(100) UNIQUE NOT NULL,
      setting_value TEXT NOT NULL,
      setting_group VARCHAR(50) DEFAULT 'general',
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );`,
    `CREATE TABLE IF NOT EXISTS hero_stats (
      id INT AUTO_INCREMENT PRIMARY KEY,
      num VARCHAR(50) NOT NULL,
      lbl VARCHAR(100) NOT NULL,
      order_index INT DEFAULT 0
    );`,
    `CREATE TABLE IF NOT EXISTS specs_ticker (
      id INT AUTO_INCREMENT PRIMARY KEY,
      material VARCHAR(100) NOT NULL,
      details VARCHAR(255) NOT NULL,
      order_index INT DEFAULT 0
    );`,
    `CREATE TABLE IF NOT EXISTS categories (
      id INT AUTO_INCREMENT PRIMARY KEY,
      code VARCHAR(50) UNIQUE NOT NULL,
      name VARCHAR(150) NOT NULL,
      description TEXT,
      order_index INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`,
    `CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      category_id INT,
      name VARCHAR(200) NOT NULL,
      slug VARCHAR(200) UNIQUE,
      subtitle VARCHAR(255),
      short_desc TEXT,
      full_desc TEXT,
      material_grades VARCHAR(255),
      shore_hardness VARCHAR(100),
      temp_rating VARCHAR(100),
      applications TEXT,
      features TEXT,
      image_url VARCHAR(255),
      gallery_images TEXT,
      is_featured BOOLEAN DEFAULT FALSE,
      order_index INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
    );`,
    `CREATE TABLE IF NOT EXISTS industries (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      icon VARCHAR(50) DEFAULT 'Layers',
      description VARCHAR(255),
      order_index INT DEFAULT 0
    );`,
    `CREATE TABLE IF NOT EXISTS why_choose (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(150) NOT NULL,
      description TEXT NOT NULL,
      icon VARCHAR(50) DEFAULT 'CheckCircle',
      order_index INT DEFAULT 0
    );`,
    `CREATE TABLE IF NOT EXISTS process_steps (
      id INT AUTO_INCREMENT PRIMARY KEY,
      step_number VARCHAR(10) NOT NULL,
      title VARCHAR(150) NOT NULL,
      description TEXT NOT NULL,
      order_index INT DEFAULT 0
    );`,
    `CREATE TABLE IF NOT EXISTS applications (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(150) NOT NULL,
      description VARCHAR(255) NOT NULL,
      category_tag VARCHAR(100) DEFAULT 'Industrial',
      order_index INT DEFAULT 0
    );`,
    `CREATE TABLE IF NOT EXISTS trust_points (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(150) NOT NULL,
      description VARCHAR(255) NOT NULL,
      order_index INT DEFAULT 0
    );`,
    `CREATE TABLE IF NOT EXISTS quote_requests (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(150) NOT NULL,
      email VARCHAR(150) NOT NULL,
      phone VARCHAR(50) NOT NULL,
      company VARCHAR(150),
      material VARCHAR(100),
      shore_hardness VARCHAR(50),
      quantity VARCHAR(50),
      application_details TEXT,
      drawing_notes TEXT,
      estimated_cost VARCHAR(50),
      status ENUM('pending', 'in_review', 'contacted', 'closed') DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`,
    `CREATE TABLE IF NOT EXISTS contact_inquiries (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(150) NOT NULL,
      email VARCHAR(150) NOT NULL,
      phone VARCHAR(50),
      subject VARCHAR(200),
      message TEXT NOT NULL,
      status ENUM('new', 'read', 'replied') DEFAULT 'new',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`,
    `CREATE TABLE IF NOT EXISTS admin_users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(100) UNIQUE NOT NULL,
      email VARCHAR(150) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      name VARCHAR(150) DEFAULT 'Administrator',
      role VARCHAR(50) DEFAULT 'superadmin',
      last_login TIMESTAMP NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`
  ];

  for (const q of queries) {
    await pool.query(q);
  }

  // Add image columns to products tables created before images were supported
  const [cols] = await pool.query(
    `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'products'`,
    [dbConfig.database]
  );
  const existing = cols.map(c => c.COLUMN_NAME);
  if (!existing.includes('image_url')) {
    await pool.query('ALTER TABLE products ADD COLUMN image_url VARCHAR(255) AFTER features');
  }
  if (!existing.includes('gallery_images')) {
    await pool.query('ALTER TABLE products ADD COLUMN gallery_images TEXT AFTER image_url');
  }
}

async function seedTablesIfEmpty() {
  // Check categories
  const [catRows] = await pool.query('SELECT COUNT(*) as count FROM categories');
  if (catRows[0].count === 0) {
    console.log('🌱 Seeding categories...');
    for (const c of initialData.categories) {
      await pool.query(
        'INSERT INTO categories (code, name, description, order_index) VALUES (?, ?, ?, ?)',
        [c.code, c.name, c.description, c.order_index]
      );
    }
  }

  // Check site settings
  const [settingRows] = await pool.query('SELECT COUNT(*) as count FROM site_settings');
  if (settingRows[0].count === 0) {
    console.log('🌱 Seeding site settings...');
    for (const s of initialData.siteSettings) {
      await pool.query(
        'INSERT INTO site_settings (setting_key, setting_value, setting_group) VALUES (?, ?, ?)',
        [s.setting_key, s.setting_value, s.setting_group]
      );
    }
  }

  // Check hero stats
  const [statRows] = await pool.query('SELECT COUNT(*) as count FROM hero_stats');
  if (statRows[0].count === 0) {
    console.log('🌱 Seeding hero stats...');
    for (const h of initialData.heroStats) {
      await pool.query(
        'INSERT INTO hero_stats (num, lbl, order_index) VALUES (?, ?, ?)',
        [h.num, h.lbl, h.order_index]
      );
    }
  }

  // Check specs ticker
  const [tickerRows] = await pool.query('SELECT COUNT(*) as count FROM specs_ticker');
  if (tickerRows[0].count === 0) {
    console.log('🌱 Seeding specs ticker...');
    for (const t of initialData.specsTicker) {
      await pool.query(
        'INSERT INTO specs_ticker (material, details, order_index) VALUES (?, ?, ?)',
        [t.material, t.details, t.order_index]
      );
    }
  }

  // Check products
  const [prodRows] = await pool.query('SELECT COUNT(*) as count FROM products');
  if (prodRows[0].count === 0) {
    console.log('🌱 Seeding products...');
    const [allCats] = await pool.query('SELECT id, code FROM categories');
    const catMap = {};
    allCats.forEach(c => { catMap[c.code] = c.id; });

    for (const p of initialData.products) {
      const catId = catMap[p.category_code] || null;
      await pool.query(
        `INSERT INTO products 
        (category_id, name, slug, subtitle, short_desc, full_desc, material_grades, shore_hardness, temp_rating, applications, features, image_url, gallery_images, is_featured, order_index) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          catId,
          p.name,
          p.slug,
          p.subtitle,
          p.short_desc,
          p.full_desc,
          p.material_grades,
          p.shore_hardness,
          p.temp_rating,
          p.applications,
          p.features,
          p.image_url || null,
          p.gallery_images ? JSON.stringify(p.gallery_images) : null,
          p.is_featured ? 1 : 0,
          p.order_index
        ]
      );
    }
  }

  // Check industries
  const [indRows] = await pool.query('SELECT COUNT(*) as count FROM industries');
  if (indRows[0].count === 0) {
    console.log('🌱 Seeding industries...');
    for (const ind of initialData.industries) {
      await pool.query(
        'INSERT INTO industries (name, icon, description, order_index) VALUES (?, ?, ?, ?)',
        [ind.name, ind.icon, ind.description, ind.order_index]
      );
    }
  }

  // Check why choose
  const [whyRows] = await pool.query('SELECT COUNT(*) as count FROM why_choose');
  if (whyRows[0].count === 0) {
    console.log('🌱 Seeding why_choose...');
    for (const w of initialData.whyChoose) {
      await pool.query(
        'INSERT INTO why_choose (title, description, icon, order_index) VALUES (?, ?, ?, ?)',
        [w.title, w.description, w.icon, w.order_index]
      );
    }
  }

  // Check process steps
  const [procRows] = await pool.query('SELECT COUNT(*) as count FROM process_steps');
  if (procRows[0].count === 0) {
    console.log('🌱 Seeding process steps...');
    for (const pr of initialData.processSteps) {
      await pool.query(
        'INSERT INTO process_steps (step_number, title, description, order_index) VALUES (?, ?, ?, ?)',
        [pr.step_number, pr.title, pr.description, pr.order_index]
      );
    }
  }

  // Check applications
  const [appRows] = await pool.query('SELECT COUNT(*) as count FROM applications');
  if (appRows[0].count === 0) {
    console.log('🌱 Seeding applications...');
    for (const a of initialData.applications) {
      await pool.query(
        'INSERT INTO applications (title, description, category_tag, order_index) VALUES (?, ?, ?, ?)',
        [a.title, a.description, a.category_tag, a.order_index]
      );
    }
  }

  // Check admin users
  const [adminRows] = await pool.query('SELECT COUNT(*) as count FROM admin_users');
  if (adminRows[0].count === 0) {
    console.log('🌱 Seeding default admin user...');
    const bcrypt = require('bcryptjs');
    const defaultUser = process.env.ADMIN_USERNAME || 'admin';
    const defaultEmail = process.env.ADMIN_EMAIL || 'admin@sdepolymer.com';
    const defaultPass = process.env.ADMIN_PASSWORD || 'admin123';
    const hash = await bcrypt.hash(defaultPass, 10);
    await pool.query(
      'INSERT INTO admin_users (username, email, password_hash, name, role) VALUES (?, ?, ?, ?, ?)',
      [defaultUser, defaultEmail, hash, 'System Administrator', 'superadmin']
    );
  }

  console.log('✅ Database initialization & seeding completed.');
}

function getPool() {
  return pool;
}

function getMockDb() {
  return mockDb;
}

function isMock() {
  return isMockMode || !pool;
}

module.exports = {
  initializeDatabase,
  getPool,
  getMockDb,
  isMock
};
