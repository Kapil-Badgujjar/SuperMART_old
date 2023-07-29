const { db } = require('@vercel/postgres');

async function customQuery(query) {
  try {
    const client = await db.connect();
    const result = await client.query(query);
    return result.rows;
  } catch (error) {
    console.log(error.message);
    throw error; // Re-throw the error to be caught by the caller if needed.
  } finally {
    client.release(); // Release the database client connection after the query is executed.
  }
}

module.exports = customQuery;
