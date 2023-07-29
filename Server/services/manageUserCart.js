const {db} = require('@vercel/postgres')

async function loadUserCart(userID) {
  const client = await db.connect();
  try {
    const result = await client.query(
      `SELECT products.*, carts.quantity FROM products INNER JOIN carts ON products.id = carts.product_id WHERE cart_id = $1`,
      [userID]
    );
    return result.rows;
  } catch (err) {
    console.log(err.message);
    return [];
  } finally {
    client.release();
  }
}

async function addProductToUserCart(userID, productID) {
  const client = await db.connect();
  try {
    const item = await client.query(
      `SELECT quantity FROM carts WHERE cart_id = $1 AND product_id = $2`,
      [userID, productID]
    );
    if (item.rows.length === 1) {
      await client.query(
        `UPDATE carts SET quantity = $1 WHERE cart_id = $2 AND product_id = $3`,
        [item.rows[0].quantity + 1, userID, productID]
      );
    } else {
      await client.query(
        `INSERT INTO carts(cart_id, product_id, quantity) VALUES($1, $2, $3)`,
        [userID, productID, 1]
      );
    }
    return true;
  } catch (err) {
    console.log(err.message);
    return false;
  } finally {
    client.release();
  }
}


async function updateQuantity(userID, productID, flag) {
  const client = await db.connect();
  try {
    let quantity = await client.query(
      `SELECT quantity FROM carts WHERE cart_id = $1 AND product_id = $2`,
      [userID, productID]
    );
    quantity = quantity.rows[0].quantity;

    if (quantity === 1 && !flag) {
      await client.query(
        `DELETE FROM carts WHERE cart_id = $1 AND product_id = $2`,
        [userID, productID]
      );
    } else {
      const newQuantity = flag ? quantity + 1 : quantity - 1;
      await client.query(
        `UPDATE carts SET quantity = $1 WHERE cart_id = $2 AND product_id = $3`,
        [newQuantity, userID, productID]
      );
    }
    return true;
  } catch (err) {
    console.log(err.message);
    return false;
  } finally {
    client.release();
  }
}


async function removeProduct(userID, productID) {
  const client = await db.connect();
  try {
    await client.query(
      `DELETE FROM carts WHERE cart_id = $1 AND product_id = $2`,
      [userID, productID]
    );
    return true;
  } catch (err) {
    console.log(err.message);
    return false;
  } finally {
    client.release();
  }
}


async function orderDone(userID) {
  const client = await db.connect();
  try {
    const result = await client.query(
      `SELECT * FROM carts WHERE cart_id = $1`,
      [userID]
    );
    result.rows.map(async (item) => {
      console.log(item);
      // Uncomment the following line if the INSERT INTO orders statement is correct
      // await client.query(`INSERT INTO orders(userID,productID,quantity,status) VALUES($1, $2, $3, 'Done')`, [userID, item.productID, item.itemQuantity]);
    });

    await client.query(`DELETE FROM carts WHERE cart_id = $1`, [userID]);
    return true;
  } catch (err) {
    console.log(err.message);
    return false;
  } finally {
    client.release();
  }
}

module.exports = {
  loadUserCart,
  addProductToUserCart,
  updateQuantity,
  removeProduct,
  orderDone
};
