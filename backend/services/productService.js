const db = require('../config/db');

// get all products
exports.getAllProducts = async ({ categoryId, keyword }) => {
   let sql = `
      SELECT p.id, p.name, p.price, p.origin, p.expiry_date,
             c.name AS categoryName
      FROM products p
      JOIN categories c ON p.category_id = c.id
      WHERE 1 = 1
   `;
   const params = [];

   if (categoryId) {
      sql += ' AND p.category_id = ?';
      params.push(categoryId);
   }

   if (keyword) {
      sql += ' AND p.name LIKE ?';
      params.push(`%${keyword}%`);
   }

   const [rows] = await db.query(sql, params);
   return rows;
};

// get product by id
exports.getProductById = async (id) => {
   const [rows] = await db.query(
      `
      SELECT p.*, c.name AS categoryName
      FROM products p
      JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
      `,
      [id]
   );
   return rows[0];
};

// get categories
exports.getCategories = async () => {
   const [rows] = await db.query(
      'SELECT id, name FROM categories'
   );
   return rows;
};
