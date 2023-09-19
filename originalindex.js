// const express = require('express');
// const app = express();
// const mysql = require('mysql');
// const cors = require('cors');

// app.use(cors());
// app.use(express.json());

// const db = mysql.createConnection({
//     user: 'root',
//     host: 'localhost',
//     password: 'NursEDev2023!',
//     database: 'ambassadorEarnings',
// });

// app.post('/create', (req, res) => {
//     console.log(req.body);
//     const name = req.body.name;
//     const date = req.body.date;
//     const amount = req.body.amount;
//     const paid = req.body.paid;

//     db.query('INSERT INTO `ambassadors earnings` (name, date, amount, paid) VALUES (?,?,?,?)',
//         [name, date, amount, paid],
//         (err, result) => {
//             if (err) {
//                 console.log(err);
//                 res.status(500).json({ error: 'Internal Server Error' });
//             } else {
//                 res.send("Values inserted");
//             }
//         }
//     );
// });

// app.get('/getdata', (req, res) => {
//     // Simplified query to fetch all records from the table
//     const sql = 'SELECT * FROM `ambassadors earnings`';

//     db.query(sql, (err, rows) => {
//         if (err) {
//             console.error('Error executing SQL query: ', err);
//             res.status(500).json({ error: 'Internal Server Error' });
//         } else {
//             res.json(rows);
//         }
//     });
// });

// app.listen(3001, () => {
//     console.log("Server is running on 3001");
// });


const express = require('express');
const app = express();
const cors = require('cors');
// const knex = require('knex');
const earningsRoutes = require("./routes/earningsRoute");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("hello");
  });
  
app.use("/earnings", earningsRoutes);

// Initialize Knex.js with your MySQL configuration
// const db = knex({
//   client: 'mysql2',
//   connection: {
//     user: 'root',
//     host: 'localhost',
//     password: 'NursEDev2023!',
//     database: 'ambassadorEarnings',
//   },
// });

// Define a table name constant
// const tableName = 'ambassadors_earnings';

// Create a migration and seed the table if needed
// Replace 'YOUR_MIGRATION_TABLE_NAME' with the actual table name
// You can run these commands in your terminal:
// npm run migrate:make create_ambassadors_earnings
// npm run migrate:latest
// npm run seed:make ambassadors_earnings
// npm run seed:run

// app.post('/create', async (req, res) => {
//   try {
//     const { name, date, amount, paid } = req.body;

//     await db(tableName).insert({ name, date, amount, paid });

//     res.send("Values inserted");
//   } catch (error) {
//     console.error('Error inserting data:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// app.get('/getdata', async (req, res) => {
//   try {
//     const data = await db.select('*').from(tableName);

//     res.json(data);
//   } catch (error) {
//     console.error('Error fetching data:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

app.listen(3001, () => {
  console.log("Server is running on 3001");
});
