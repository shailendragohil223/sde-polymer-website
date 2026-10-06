// Imports product images & new products from seedData into an existing database.
// - Adds missing categories (by code)
// - Inserts products whose slug is not yet in the table
// - Sets image_url / gallery_images on existing products that have no image yet
// Usage: npm run import:images
const { initializeDatabase, getPool, isMock } = require('../config/db');
const initialData = require('./seedData');

async function run() {
  await initializeDatabase();
  if (isMock()) {
    console.error('❌ MySQL is not reachable — check backend/.env and try again.');
    process.exit(1);
  }
  const pool = getPool();

  for (const c of initialData.categories) {
    await pool.query(
      'INSERT IGNORE INTO categories (code, name, description, order_index) VALUES (?, ?, ?, ?)',
      [c.code, c.name, c.description, c.order_index]
    );
  }

  const [allCats] = await pool.query('SELECT id, code FROM categories');
  const catMap = {};
  allCats.forEach(c => { catMap[c.code] = c.id; });

  let inserted = 0;
  let updated = 0;

  for (const p of initialData.products) {
    if (!p.image_url) continue;
    const gallery = p.gallery_images ? JSON.stringify(p.gallery_images) : null;

    const [rows] = await pool.query('SELECT id, image_url FROM products WHERE slug = ?', [p.slug]);
    if (rows.length > 0) {
      if (!rows[0].image_url) {
        await pool.query(
          'UPDATE products SET image_url = ?, gallery_images = ? WHERE id = ?',
          [p.image_url, gallery, rows[0].id]
        );
        updated++;
        console.log(`🖼️  Image set: ${p.name}`);
      }
      continue;
    }

    await pool.query(
      `INSERT INTO products
      (category_id, name, slug, subtitle, short_desc, full_desc, material_grades, shore_hardness, temp_rating, applications, features, image_url, gallery_images, is_featured, order_index)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        catMap[p.category_code] || null,
        p.name,
        p.slug,
        p.subtitle || null,
        p.short_desc || null,
        p.full_desc || null,
        p.material_grades || null,
        p.shore_hardness || null,
        p.temp_rating || null,
        p.applications || null,
        p.features || null,
        p.image_url,
        gallery,
        p.is_featured ? 1 : 0,
        p.order_index || 0
      ]
    );
    inserted++;
    console.log(`➕ Inserted: ${p.name}`);
  }

  console.log(`✅ Done — ${inserted} products inserted, ${updated} existing products given images.`);
  await pool.end();
}

run().catch(err => {
  console.error('❌ Import failed:', err);
  process.exit(1);
});
