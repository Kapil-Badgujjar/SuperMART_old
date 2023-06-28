// const sql = require('mssql');

const {db} = require('@vercel/postgres')

// const configuration = require('./DatabaseConfiguration');
async function getUser(email,password){
  // const pool = await sql.connect(configuration);
  const client = await db.connect();
  const result = await client.sql`SELECT * FROM users WHERE emailID = ${email} AND password = ${password}`;
  // const result = await pool.request().query(`SELECT * FROM AuthenticationTable WHERE emailID = '${email}' AND password = '${password}'`);
  // await pool.close();
  console.log(result);
  return result.rows;
}
module.exports = getUser;