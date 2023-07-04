// const sql = require('mssql');
// const configuration = require('./DatabaseConfiguration');
// async function customQuery(query){
//   const pool = await sql.connect(configuration);
//   const result = await pool.request().query(query);
//   await pool.close();
//   return result.recordset;
// }
// module.exports = customQuery;
// const sql = require('@vercel/postgres')
const {db} = require('@vercel/postgres')

async function customQuery(query){
  const client = await db.connect();
  const result = await client.sql`${query}`;
  return result.rows;
}
module.exports = customQuery;
