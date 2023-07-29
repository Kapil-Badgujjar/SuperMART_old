const { db } = require('@vercel/postgres');
const bcrypt = require('bcrypt');

async function getUser(email, password) {
  const client = await db.connect();

  try {
    // Fetch the user by email from the database
    const result = await client.query('SELECT * FROM users WHERE emailID = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      // If no user found with the given email, return null
      return null;
    }
    
    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      // If passwords match, return the user object
      return user;
    } else {
      // If passwords do not match, return null
      return null;
    }
  } catch (error) {
    console.log(error.message);
    throw error; // Re-throw the error to be caught by the caller if needed.
  } finally {
    client.release(); // Release the database client connection after the query is executed.
  }
}

module.exports = getUser;
