const { db } = require('@vercel/postgres');

async function getProducts(all, x, id) {
  const client = await db.connect();
  let result = undefined;
  try {
    if (all) {
      result = await client.query('SELECT * FROM products');
    } else if (x === undefined) {
      result = await client.query('SELECT * FROM products WHERE id = $1', [id]);
    } else {
      const offset = x * 5;
      result = await client.query('SELECT * FROM products ORDER BY id OFFSET $1 ROWS FETCH NEXT 5 ROWS ONLY', [offset]);
    }
    console.log(result.rows);
    return result.rows;
  } catch (error) {
    console.log(error.message);
    throw error; // Re-throw the error to be caught by the caller if needed.
  } finally {
    client.release(); // Release the database client connection after the query is executed.
  }
}

module.exports = getProducts;
