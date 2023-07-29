const { db } = require('@vercel/postgres');
const bcrypt = require('bcrypt');

async function createNewUser(obj) {
  const client = await db.connect();
  try {
    const hashedPassword = await bcrypt.hash(obj.password, 10);

    await client.query(
      'INSERT INTO users(userName,emailID,password,isVerified,passwordResetRequest,mailToken,role) VALUES($1, $2, $3, false, false, $4, $5)',
      [obj.username, obj.email, hashedPassword, obj.mailToken, 'User']
    );

    return true;
  } catch (error) {
    console.log(error);
    return false;
  } finally {
    client.release();
  }
}

async function activateChangeRequest(token) {
  const client = await db.connect();
  try {
    await client.query('UPDATE users SET passwordResetRequest = true WHERE mailToken = $1', [token]);
    setTimeout(async () => {
      await client.query('UPDATE users SET passwordResetRequest = false WHERE mailToken = $1', [token]);
    }, 60000);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  } finally {
    client.release();
  }
}

async function changePassword(newPassword, token) {
  const client = await db.connect();
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await client.query('UPDATE users SET password = $1 WHERE mailToken = $2', [hashedPassword, token]);

    return true;
  } catch (error) {
    console.log(error.message);
    return false;
  } finally {
    client.release();
  }
}

async function updatePassword(userID, newPassword) {
  const client = await db.connect();
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await client.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, userID]);

    return true;
  } catch (error) {
    console.log(error.message);
    return false;
  } finally {
    client.release();
  }
}

async function verifyEmail(token) {
  const client = await db.connect();
  try {
    // Use a parameterized query to avoid SQL injection
    const queryResult = await client.query('SELECT * FROM users WHERE mailToken = $1', [token]);
    const user = queryResult.rows;

    if (user.length === 1) {
      await client.query('UPDATE users SET isVerified = true WHERE mailToken = $1', [token]);
      return true;
    }
    return false;
  } catch (err) {
    console.log(err.message);
    return false;
  } finally {
    client.release();
  }
}

module.exports = { createNewUser, activateChangeRequest, changePassword, updatePassword, verifyEmail };
