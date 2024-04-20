import mysql from 'mysql2/promise'; // Changed the import statement to 'mysql2/promise'
import dotenv from 'dotenv'; // Added import statement for dotenv
dotenv.config()
// Creating a connection pool
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
});

export { pool as mysqlPool };

// Function to get data with a particular id
export async function getData(id) {
  const [row] = await pool.query(`SELECT * FROM daily_attendance WHERE Qalam_Id = ?`, [id]);
  return row;
}

// Function to get all data
export async function getAllData() {
  const [rows] = await pool.query("SELECT * FROM daily_attendance");
  return rows;
}

// Function to create data
export async function createData(Qalam_Id, Student_Name, Month_Number, ...days) {
  const [result] = await pool.query(`INSERT INTO daily_attendance VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [Qalam_Id, Student_Name, Month_Number, ...days]);
  return getData(Qalam_Id);
}

// Function to delete all data
export async function deleteAllData() {
  const [result] = await pool.query("DELETE FROM daily_attendance");
  return getAllData();
}

// Function to delete data with a specific id
export async function deleteData(id) {
  const [result] = await pool.query(`DELETE FROM daily_attendance WHERE Qalam_Id = ?`, [id]);
  return getAllData();
}

// Main function
async function main() {
  try {
    const id = 1; // Specify the id here
    const attendance = await getData(id);
    console.log(attendance);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Not necessary to close connection here as we're using a pool
  }
}

main();

// Function to check and create a database
export async function checkAndCreateDatabase(databaseName) {
  try {
    console.log('Connected to MySQL.');

    // Check if the database exists
    const [rows] = await pool.query(`SHOW DATABASES LIKE ?`, [databaseName]);

    if (rows.length === 0) {
      // Database does not exist, create it
      console.log(`Database ${databaseName} does not exist. Creating...`);
      await pool.query(`CREATE DATABASE ${databaseName}`);
      console.log(`Database ${databaseName} created successfully.`);

      // Corrected createTableQuery assignment
      const createTableQuery = `CREATE TABLE ${databaseName}.daily_attendance (
        Qalam_Id INT PRIMARY KEY,
        Student_Name VARCHAR(60) NOT NULL,
        Month_Number INT NOT NULL,
        Day_1 VARCHAR(2) NOT NULL,
        Day_2 VARCHAR(2) NOT NULL,
        Day_3 VARCHAR(2) NOT NULL,
        Day_4 VARCHAR(2) NOT NULL,
        Day_5 VARCHAR(2) NOT NULL,
        Day_6 VARCHAR(2) NOT NULL,
        Day_7 VARCHAR(2) NOT NULL,
        Day_8 VARCHAR(2) NOT NULL,
        Day_9 VARCHAR(2) NOT NULL,
        Day_10 VARCHAR(2) NOT NULL,
        Day_11 VARCHAR(2) NOT NULL,
        Day_12 VARCHAR(2) NOT NULL,
        Day_13 VARCHAR(2) NOT NULL,
        Day_14 VARCHAR(2) NOT NULL,
        Day_15 VARCHAR(2) NOT NULL,
        Day_16 VARCHAR(2) NOT NULL,
        Day_17 VARCHAR(2) NOT NULL,
        Day_18 VARCHAR(2) NOT NULL,
        Day_19 VARCHAR(2) NOT NULL,
        Day_20 VARCHAR(2) NOT NULL,
        Day_21 VARCHAR(2) NOT NULL,
        Day_22 VARCHAR(2) NOT NULL,
        Day_23 VARCHAR(2) NOT NULL,
        Day_24 VARCHAR(2) NOT NULL,
        Day_25 VARCHAR(2) NOT NULL,
        Day_26 VARCHAR(2) NOT NULL,
        Day_27 VARCHAR(2) NOT NULL,
        Day_28 VARCHAR(2) NOT NULL,
        Day_29 VARCHAR(2),
        Day_30 VARCHAR(2),
        Day_31 VARCHAR(2)
      )`;

      await pool.query(createTableQuery);
      console.log(`Table created successfully in ${databaseName}.`);

    } else {
      console.log(`Database ${databaseName} already exists.`);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}
