const {db} = require('@vercel/postgres')

// const customQuery = require('./customQuery');
// const sql = require('mssql');
// const configuration = require('./DatabaseConfiguration');

async function createNewUser(obj){
  const client = await db.connect();
  console.log(obj.username)
  try {
    // const users = await client.sql`SELECT * FROM users;`;
    // console.log(users)
    await client.sql`INSERT INTO users(userName,emailID,password,isVerified,passwordResetRequest,mailToken,role) values(${obj.username},${obj.email},${obj.password},false,false,${obj.mailToken},'User');`
    return true
  } catch (error) {
    console.log(error);
    return false
  }

}
async function activateChangeRequest(token){
  // const pool = await sql.connect(configuration);
  const client = await db.connect();

  try {
    // const users = await client.sql`SELECT * FROM users;`;
    // console.log(users)
    await client.sql`UPDATE users SET passwordResetRequest = true WHERE mailToken = ${token}`;
    setTimeout(async()=>{await client.sql`UPDATE AuthenticationTable SET passwordResetRequest = 0 WHERE mailToken = ${token}`},60000);
    return true
  } catch (error) {
    console.log(error);
    return false
  }

  // try{
  //   await pool.request().query(`UPDATE AuthenticationTable SET passwordResetRequest = 1 WHERE mailToken = ${token}`);
  //   setTimeout(()=>{customQuery(`UPDATE AuthenticationTable SET passwordResetRequest = 0 WHERE mailToken = ${token}`)},60000);
  //   await pool.close();
  //   return true;
  // }
  // catch(err){
  //   console.log(err.message);
  //   await pool.close();
  //   return false;
  // }
}

async function changePassword(newPassword,token){
  // const pool = await sql.connect(configuration);
  const client = await db.connect();
  try{
    await client.sql`UPDATE users SET password = ${newPassword} WHERE mailToken = ${token}`; //added this line
    // await pool.request().query(`UPDATE AuthenticationTable SET password = '${newPassword}' WHERE mailToken = ${token}`);
    // await pool.close();
    return true;
  }
  catch(err){
    console.log(err.message);
    // await pool.close();
    return false;
  }
}

async function updatePassword(userID,newPassword){
  // const pool = await sql.connect(configuration);
  const client = await db.connect();
  try{
    await client.sql`UPDATE users SET password = ${newPassword} WHERE userID = ${userID}`;
    // await pool.request().query(`UPDATE AuthenticationTable SET password = '${newPassword}' WHERE userID = ${userID}`);
    // await pool.close();
    return true;
  }
  catch(err){
    console.log(err.message);
    // await pool.close();
    return false;
  }
}
module.exports = { createNewUser, activateChangeRequest, changePassword, updatePassword };