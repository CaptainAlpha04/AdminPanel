import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

// Importing necessary modules

// Configuring dotenv
dotenv.config()

// Creating a connection pool
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
})

// Exporting the pool
export { pool as mysqlPool }

// Function to get data with a particular id
export async function getData(id) {
  const [row] = await pool.query(`SELECT * FROM daily_attendance WHERE Qalam_Id = ?`, [id])
  return row
}

// Function to get all data
export async function getAllData() {
  const [rows] = await pool.query("SELECT * FROM daily_attendance")
  return rows
}

// Function to create data
// Function to create data
export async function createData(Qalam_Id, Student_Name, Month_Number, days) {
    // Convert the days object into an array of its values
    let daysArray = Object.values(days)

    // Concatenate the non-day values and the days array into a single array
    let values = [Qalam_Id, Student_Name, Month_Number, ...daysArray]

    // Generate the SQL query
    const [result] = await pool.query(`INSERT INTO daily_attendance VALUES 
    (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
    ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, values)
    return getData(Qalam_Id)
}

// Function to delete all data
export async function deleteAllData() {
  const [result] = await pool.query("DELETE FROM daily_attendance")
  return getAllData()
}

// Function to delete data with a specific id
export async function deleteData(id) {
  const [result] = await pool.query(`DELETE FROM daily_attendance WHERE Qalam_Id = ?`, [id])
  return getAllData()
}

// Main function
async function main() {
  try {
    const id = 1 // Specify the id here
    const attendance = await getData(id)
    console.log(attendance)
  } catch (error) {
    console.error('Error:', error)
  }
}

// Function to check and create database if not exists
export async function checkAndCreateDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
  });

  await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.MYSQL_DATABASE}`);
  await connection.end();

  // Check if the table exists
  await checkIfTableExists(process.env.MYSQL_DATABASE);

}

// Function to check and create a table
async function checkIfTableExists(databaseName) {
  const [tables] = await pool.query(`SHOW TABLES LIKE 'daily_attendance'`);

  if (tables.length === 0) {
    // Table does not exist, create it
    console.log(`Table daily_attendance does not exist in ${databaseName}. Creating...`);
    await createTable();
    console.log(`Table daily_attendance created successfully in ${databaseName}.`);
  } else {
    console.log(`Table daily_attendance already exists in ${databaseName}.`);
  }
}

// Function to create a table
async function createTable() {
  const createTableQuery = `CREATE TABLE daily_attendance (
    Qalam_Id INT PRIMARY KEY,
    Student_Name VARCHAR(60),
    Month_Number INT,
    Day_1 VARCHAR(2),
    Day_2 VARCHAR(2),
    Day_3 VARCHAR(2),
    Day_4 VARCHAR(2),
    Day_5 VARCHAR(2),
    Day_6 VARCHAR(2),
    Day_7 VARCHAR(2),
    Day_8 VARCHAR(2),
    Day_9 VARCHAR(2),
    Day_10 VARCHAR(2),
    Day_11 VARCHAR(2),
    Day_12 VARCHAR(2),
    Day_13 VARCHAR(2),
    Day_14 VARCHAR(2),
    Day_15 VARCHAR(2),
    Day_16 VARCHAR(2),
    Day_17 VARCHAR(2),
    Day_18 VARCHAR(2),
    Day_19 VARCHAR(2),
    Day_20 VARCHAR(2),
    Day_21 VARCHAR(2),
    Day_22 VARCHAR(2),
    Day_23 VARCHAR(2),
    Day_24 VARCHAR(2),
    Day_25 VARCHAR(2),
    Day_26 VARCHAR(2),
    Day_27 VARCHAR(2),
    Day_28 VARCHAR(2),
    Day_29 VARCHAR(2),
    Day_30 VARCHAR(2),
    Day_31 VARCHAR(2)
  )`;

  await pool.query(createTableQuery)
}


// function to update attendance daily

export async function markAttendance(databaseName, status, Qalam_Id) {
  try{

    // update the table after every attendance
    const updatedTable = `UPDATE ${databaseName}.daily_attendance 
    SET Day_${new Date().getDate()} = ${status}
    WHERE Qalam_Id = ${Qalam_Id}`

    await pool.query(updatedTable)
    console.log("Student's attendance has been marked.")
    return getData(Qalam_Id)

  }
  catch(error){
    console.error('Error:', error)
  }

}

export async function attendaceAlreadyMarked(database, QalamID) {
  try {
    const isPresent = `SELECT DAY_${new Date().getDate()} 
    FROM ${database}.daily_attendance 
    WHERE Qalam_Id = ${QalamID}`
    const [rows] = await pool.query(isPresent)

    if (rows[0][`DAY_${new Date().getDate()}`] === 'P') {
      console.log("Attendance already marked")
      return true;
    } else {
      return false;
    }
    
  } catch (err) {
    console.log(err)
  }
}