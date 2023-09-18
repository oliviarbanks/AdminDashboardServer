const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    user: 'root',
    host: 'localhost',
    password: 'NursEDev2023!',
    database: 'ambassadorEarnings',
});

app.post('/create', (req, res) => {
    console.log(req.body);
    const name = req.body.name;
    const date = req.body.date;
    const amount = req.body.amount;
    const paid = req.body.paid;

    db.query('INSERT INTO `ambassadors earnings` (name, date, amount, paid) VALUES (?,?,?,?)',
        [name, date, amount, paid],
        (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).json({ error: 'Internal Server Error' });
            } else {
                res.send("Values inserted");
            }
        }
    );
});

app.get('/getdata', (req, res) => {
    // Simplified query to fetch all records from the table
    const sql = 'SELECT * FROM `ambassadors earnings`';

    db.query(sql, (err, rows) => {
        if (err) {
            console.error('Error executing SQL query: ', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.json(rows);
        }
    });
});

app.listen(3001, () => {
    console.log("Server is running on 3001");
});
