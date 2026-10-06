const { getPool, isMock, getMockDb } = require('../config/db');

// gallery_images is stored as a JSON array string; accept an array or an existing string
const toGalleryJson = (gallery) => {
  if (!gallery) return null;
  return Array.isArray(gallery) ? JSON.stringify(gallery) : gallery;
};

exports.getCategories = async (req, res) => {
  try {
    if (isMock()) {
      const mock = getMockDb();
      return res.json({ success: true, data: mock.categories });
    }

    const pool = getPool();
    const [categories] = await pool.query(`
      SELECT c.*, COUNT(p.id) as product_count 
      FROM categories c 
      LEFT JOIN products p ON c.id = p.category_id 
      GROUP BY c.id 
      ORDER BY c.order_index ASC
    `);

    res.json({ success: true, data: categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch categories' });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const { category_id, category_code, featured, search } = req.query;

    if (isMock()) {
      let mock = getMockDb().products;
      if (featured === 'true' || featured === '1') {
        mock = mock.filter(p => p.is_featured);
      }
      if (category_code) {
        mock = mock.filter(p => p.category_code === category_code);
      }
      if (search) {
        const q = search.toLowerCase();
        mock = mock.filter(p => 
          p.name.toLowerCase().includes(q) || 
          (p.short_desc && p.short_desc.toLowerCase().includes(q)) ||
          (p.material_grades && p.material_grades.toLowerCase().includes(q))
        );
      }
      return res.json({ success: true, data: mock });
    }

    const pool = getPool();
    let query = `
      SELECT p.*, c.name as category_name, c.code as category_code 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE 1=1
    `;
    const params = [];

    if (category_id) {
      query += ' AND p.category_id = ?';
      params.push(category_id);
    }
    if (category_code) {
      query += ' AND c.code = ?';
      params.push(category_code);
    }
    if (featured === 'true' || featured === '1') {
      query += ' AND p.is_featured = 1';
    }
    if (search) {
      query += ' AND (p.name LIKE ? OR p.short_desc LIKE ? OR p.material_grades LIKE ? OR p.applications LIKE ?)';
      const s = `%${search}%`;
      params.push(s, s, s, s);
    }

    query += ' ORDER BY p.order_index ASC, p.id ASC';

    const [products] = await pool.query(query, params);
    res.json({ success: true, count: products.length, data: products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch products' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (isMock()) {
      const mock = getMockDb().products;
      const product = mock.find(p => p.id == id || p.slug === id);
      if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
      return res.json({ success: true, data: product });
    }

    const pool = getPool();
    const [products] = await pool.query(`
      SELECT p.*, c.name as category_name, c.code as category_code 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.id = ? OR p.slug = ?
    `, [id, id]);

    if (products.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, data: products[0] });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch product' });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const {
      category_id, name, slug, subtitle, short_desc, full_desc,
      material_grades, shore_hardness, temp_rating, applications,
      features, image_url, gallery_images, is_featured, order_index
    } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Product name is required' });
    }

    const generatedSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    if (isMock()) {
      const mock = getMockDb();
      const newProd = {
        id: Date.now(),
        category_id: category_id || null,
        name,
        slug: generatedSlug,
        subtitle: subtitle || '',
        short_desc: short_desc || '',
        full_desc: full_desc || '',
        material_grades: material_grades || '',
        shore_hardness: shore_hardness || '',
        temp_rating: temp_rating || '',
        applications: applications || '',
        features: features || '',
        image_url: image_url || '',
        gallery_images: gallery_images || [],
        is_featured: is_featured || false,
        order_index: order_index || 0
      };
      mock.products.push(newProd);
      return res.status(201).json({ success: true, message: 'Product created (in-memory)', data: newProd });
    }

    const pool = getPool();
    const [result] = await pool.query(`
      INSERT INTO products 
      (category_id, name, slug, subtitle, short_desc, full_desc, material_grades, shore_hardness, temp_rating, applications, features, image_url, gallery_images, is_featured, order_index)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      category_id || null,
      name,
      generatedSlug,
      subtitle || null,
      short_desc || null,
      full_desc || null,
      material_grades || null,
      shore_hardness || null,
      temp_rating || null,
      applications || null,
      features || null,
      image_url || null,
      toGalleryJson(gallery_images),
      is_featured ? 1 : 0,
      order_index || 0
    ]);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: { id: result.insertId, name, slug: generatedSlug }
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ success: false, message: 'Failed to create product' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      category_id, name, slug, subtitle, short_desc, full_desc,
      material_grades, shore_hardness, temp_rating, applications,
      features, image_url, gallery_images, is_featured, order_index
    } = req.body;

    if (isMock()) {
      const mock = getMockDb().products;
      const index = mock.findIndex(p => p.id == id);
      if (index === -1) return res.status(404).json({ success: false, message: 'Product not found' });
      mock[index] = { ...mock[index], ...req.body };
      return res.json({ success: true, message: 'Product updated (in-memory)' });
    }

    const pool = getPool();
    await pool.query(`
      UPDATE products SET
        category_id = ?,
        name = ?,
        slug = ?,
        subtitle = ?,
        short_desc = ?,
        full_desc = ?,
        material_grades = ?,
        shore_hardness = ?,
        temp_rating = ?,
        applications = ?,
        features = ?,
        image_url = COALESCE(?, image_url),
        gallery_images = COALESCE(?, gallery_images),
        is_featured = ?,
        order_index = ?
      WHERE id = ?
    `, [
      category_id || null,
      name,
      slug,
      subtitle || null,
      short_desc || null,
      full_desc || null,
      material_grades || null,
      shore_hardness || null,
      temp_rating || null,
      applications || null,
      features || null,
      image_url === undefined ? null : image_url,
      gallery_images === undefined ? null : (toGalleryJson(gallery_images) || ''),
      is_featured ? 1 : 0,
      order_index || 0,
      id
    ]);

    res.json({ success: true, message: 'Product updated successfully' });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ success: false, message: 'Failed to update product' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (isMock()) {
      const mock = getMockDb();
      mock.products = mock.products.filter(p => p.id != id);
      return res.json({ success: true, message: 'Product deleted (in-memory)' });
    }

    const pool = getPool();
    await pool.query('DELETE FROM products WHERE id = ?', [id]);
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ success: false, message: 'Failed to delete product' });
  }
};
