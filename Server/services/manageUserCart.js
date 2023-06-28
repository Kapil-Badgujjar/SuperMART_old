// const sql = require("mssql");
const {db} = require('@vercel/postgres')
// const customQuery = require("./customQuery");
// const configuration = require('./DatabaseConfiguration');

async function loadUserCart(userID, productID) {
  // const pool = await sql.connect(configuration);
  const client = await db.connect();
  try {
    const result = await client.sql
        `SELECT products.*, cart.itemQuantity FROM products INNER JOIN cart ON products.productID = cart.productID WHERE userCartID = ${userID}`;
    // const result = await pool
    //   .request()
    //   .query(
    //     `SELECT productsTable.*, usersCartsTable.itemQuantity FROM productsTable INNER JOIN usersCartsTable ON productsTable.productID = usersCartsTable.productID WHERE userCartID = ${userID}`
    //   );
    // await pool.close();
    return result.rows;
  } catch (err) {
    // await pool.close();
    console.log(err.message);
    return [];
  }
}

async function addProductToUserCart(userID, productID) {
  const client = db.connect();
  let item = await client.sql`SELECT itemQuantity FROM cart WHERE userCartID = ${userID} AND productID = ${productID}`;
  // let item = await customQuery(
  //   `SELECT itemQuantity FROM usersCartsTable WHERE userCartID = ${userID} AND productID = ${productID}`
  // );
  // const pool = await sql.connect(configuration);
  try {
    if (item.length == 1) {
      client.sql`UPDATE cart SET itemQuantity = ${item[0].itemQuantity+1} WHERE userCartID = ${userID} AND productID = ${productID}`
      // await pool
      //   .request()
      //   .query(
      //     ` UPDATE usersCartsTable SET itemQuantity = ${
      //       item[0].itemQuantity + 1
      //     } WHERE userCartID = ${userID} AND productID = ${productID}`
      //   );
    } else {
      await client.sql`INSERT INTO cart(userCartID, productID, itemQuantity) VALUES(${userID}, ${productID}, ${1})`;
      // await pool
      //   .request()
      //   .query(
      //     `INSERT INTO usersCartsTable(userCartID,productID,itemQuantity) VALUES('${userID}','${productID}',${1})`
      //   );
    }
    // await pool.close();
    return true;
  } catch (err) {
    await pool.close();
    console.log(err.message);
    return false;
  }
}

async function updateQuantity(userID, productID, flag) {
  const client = await db.connect();
  // const pool = await sql.connect(configuration);
  try {
    let quantity = await client.sql`SELECT itemQuantity FROM cart WHERE userCartID = ${userID} AND productID = ${productID}`;
    // let quantity = await pool
    //   .request()
    //   .query(
    //     `SELECT itemQuantity FROM usersCartsTable WHERE userCartID = ${userID} AND productID = ${productID}`
    //   );
      quantity = quantity.recordset;
    //   console.log(quantity);
    if ((quantity[0].itemQuantity == 1) & (flag == false)) {
      await client.sql`DELETE cart WHERE userCartID = ${userID} AND productID = ${productID}`;
      // await pool
      //   .request()
      //   .query(
      //     `DELETE usersCartsTable WHERE userCartID = ${userID} AND productID = ${productID}`
      //   );
      // await pool.close();
      return true;
    }
    if (flag) {
      await client.sql`UPDATE cart SET itemQuantity = ${quantity[0].itemQuantity - 1} WHERE userCartID = ${userID} AND productID = ${productID}`;
      // await pool
      //   .request()
      //   .query(
      //     `UPDATE usersCartsTable SET itemQuantity = ${quantity[0].itemQuantity + 1} WHERE userCartID = ${userID} AND productID = ${productID}`
      //   );
    } else {
      await client.sql`UPDATE cart SET itemQuantity = ${quantity[0].itemQuantity - 1} WHERE userCartID = ${userID} AND productID = ${productID}`;
      // await pool
      //   .request()
      //   .query(
      //     `UPDATE usersCartsTable SET itemQuantity = ${quantity[0].itemQuantity - 1} WHERE userCartID = ${userID} AND productID = ${productID}`
      //   );
    }
    // await pool.close();
    return true;
  } catch (err) {
    // await pool.close();
    console.log(err.message);
    return false;
  }
}

async function removeProduct(userID, productID) {
  // const pool = await sql.connect(configuration);
  const client = await db.connect();
  try {
    await client.sql`DELETE cart WHERE userCartID = ${userID} AND productID = ${productID}`
    // await pool
    //   .request()
    //   .query(
    //     `DELETE usersCartsTable WHERE userCartID = ${userID} AND productID = ${productID}`
    //   );
    // await pool.close();
    return true;
  } catch (err) {
    // await pool.close();
    console.log(err.message);
    return false;
  }
}

async function orderDone(userID){
  // const pool = await sql.connect(configuration);
  const client = await db.connect();
  try{
    const result =  await client.sql`SELECT * FROM cart WHERE userCartID = ${userID}`
    // const result = await pool.request().query(`SELECT * FROM usersCartsTable WHERE userCartID = ${userID}`);
    result.recordset.map(async item =>{
      console.log(item);
      await client.sql`INSERT INTO orders(userID,productID,quantity,status) VALUES(${userID}, ${item.productID}, ${item.itemQuantity},'Done')`
      // await pool.request().query(`INSERT INTO Orders(userID,productID,quantity,status) VALUES(${userID}, ${item.productID}, ${item.itemQuantity},'Done')`);
    })
    await client.sql`DELETE FROM cart WHERE userCartID = ${userID}`;
    // await pool.request().query(`DELETE usersCartsTable WHERE userCartID = ${userID}`);
    return true;
  }
  catch(err){
    console.log(err.message);
    return false;
  }
}
module.exports = {
  loadUserCart,
  addProductToUserCart,
  updateQuantity,
  removeProduct,
  orderDone
};
