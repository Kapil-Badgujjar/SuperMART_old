const { db } = require('@vercel/postgres');

async function addProduct(product) {
  const client = await db.connect();
  try {
    await client.query(
      `INSERT INTO products(name,displayName,imageSource,price,color,description,sellerid,availableStocks) VALUES($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        product.name,
        product.displayName,
        product.imageSource,
        product.price,
        product.color,
        product.description,
        1, // Assuming sellerid is fixed for now
        product.availableStocks,
      ]
    );
    return true;
  } catch (err) {
    console.log(err.message);
    throw err; // Re-throw the error to be caught by the caller if needed.
  } finally {
    client.release();
  }
}

async function updateProduct(product) {
  console.log(product);
  const client = await db.connect();
  try {
    // if (imageSource) {
    //   await client.query(
    //     `UPDATE products SET name = $1, displayname = $2, imagesource = $3, price = $4, color = $5, description = $6, sellerid = $7, availableStocks = $8 WHERE id = $9`,
    //     [
    //       product.name,
    //       product.displayName,
    //       imageSource,
    //       parseInt(product.price),
    //       product.color,
    //       product.description,
    //       1, // Assuming sellerid is fixed for now
    //       parseInt(product.availableStocks),
    //       parseInt(product.productID),
    //     ]
    //   );
    // } else {
      await client.query(
        `UPDATE products SET name = $1, displayname = $2, price = $3, color = $4, description = $5, sellerid = $6, availableStocks = $7 WHERE id = $8`,
        [
          product.name,
          product.displayName,
          parseInt(product.price),
          product.color,
          product.description,
          1, // Assuming sellerid is fixed for now
          parseInt(product.availableStocks),
          parseInt(product.productID),
        ]
      );
    // }
    return true;
  } catch (err) {
    console.log(err.message);
    throw err; // Re-throw the error to be caught by the caller if needed.
  } finally {
    client.release();
  }
}

async function deleteProduct(productID) {
  const client = await db.connect();
  try {
    // Use a transaction to ensure both queries are executed atomically
    await client.query('BEGIN');
    await client.query(`DELETE FROM products WHERE id = $1`, [productID]);
    await client.query(`DELETE FROM carts WHERE product_id = $1`, [productID]);
    await client.query('COMMIT'); // Commit the transaction
    return true;
  } catch (err) {
    // Rollback the transaction if an error occurs
    await client.query('ROLLBACK');
    console.log(err.message);
    throw err; // Re-throw the error to be caught by the caller if needed.
  } finally {
    client.release();
  }
}

module.exports = { addProduct, updateProduct, deleteProduct };
