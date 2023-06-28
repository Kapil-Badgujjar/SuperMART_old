// const sql = require('mssql');
// const configuration = require('./DatabaseConfiguration');
const {db} = require('@vercel/postgres')
async function getProducts(all,x,productID){
  // const pool = await sql.connect(configuration);
  const client = await db.connect();
  let result = undefined;
  if(all){
    result = await client.sql`SELECT * FROM products`;
    // result = await pool.request().query(`SELECT * FROM productsTable`);
  }else if(x==undefined){
    result = await client.sql`SELECT * FROM products WHERE productID = ${productID}`;
    // result = await pool.request().query(`SELECT * FROM productsTable WHERE productID = '${productID}'`);
  }else{
    result = await client.sql`SELECT * FROM products ORDER BY productID OFFSET ${x*5} ROWS FETCH NEXT 5 ROWS ONLY`;
    // result = await pool.request().query(`SELECT * FROM productsTable ORDER BY productID OFFSET ${x*5} ROWS FETCH NEXT 5 ROWS ONLY`);
  }
  // await pool.close();
  // return result.recordset;
  return result.rows;
}
module.exports = getProducts;