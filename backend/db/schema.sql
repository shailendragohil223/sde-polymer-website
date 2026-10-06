-- Create database if not exists
CREATE DATABASE IF NOT EXISTS sde_polymer_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sde_polymer_db;

-- Site Settings Table
CREATE TABLE IF NOT EXISTS site_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT NOT NULL,
  setting_group VARCHAR(50) DEFAULT 'general',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Hero Stats Table
CREATE TABLE IF NOT EXISTS hero_stats (
  id INT AUTO_INCREMENT PRIMARY KEY,
  num VARCHAR(50) NOT NULL,
  lbl VARCHAR(100) NOT NULL,
  order_index INT DEFAULT 0
);

-- Specifications Ticker Table
CREATE TABLE IF NOT EXISTS specs_ticker (
  id INT AUTO_INCREMENT PRIMARY KEY,
  material VARCHAR(100) NOT NULL,
  details VARCHAR(255) NOT NULL,
  order_index INT DEFAULT 0
);

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  order_index INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
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
);

-- Industries Table
CREATE TABLE IF NOT EXISTS industries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  icon VARCHAR(50) DEFAULT 'Layers',
  description VARCHAR(255),
  order_index INT DEFAULT 0
);

-- Why Choose Us Table
CREATE TABLE IF NOT EXISTS why_choose (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  icon VARCHAR(50) DEFAULT 'CheckCircle',
  order_index INT DEFAULT 0
);

-- Process Steps Table
CREATE TABLE IF NOT EXISTS process_steps (
  id INT AUTO_INCREMENT PRIMARY KEY,
  step_number VARCHAR(10) NOT NULL,
  title VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  order_index INT DEFAULT 0
);

-- Applications Table
CREATE TABLE IF NOT EXISTS applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  description VARCHAR(255) NOT NULL,
  category_tag VARCHAR(100) DEFAULT 'Industrial',
  order_index INT DEFAULT 0
);

-- Trust Highlights Table
CREATE TABLE IF NOT EXISTS trust_points (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  description VARCHAR(255) NOT NULL,
  order_index INT DEFAULT 0
);

-- Quote Requests (Dynamic RFQ)
CREATE TABLE IF NOT EXISTS quote_requests (
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
);

-- Contact Inquiries Table
CREATE TABLE IF NOT EXISTS contact_inquiries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL,
  phone VARCHAR(50),
  subject VARCHAR(200),
  message TEXT NOT NULL,
  status ENUM('new', 'read', 'replied') DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
