// const cookieParser = require ('cookie-parser');
// const bcrypt = require ('bcrypt');
// const jwt = require ('jsonwebtoken')
const express = require ('express');
const app = express();
const mysql = require('mysql')
const cors = require('cors');

app.use(cors());
app.use(express.json());
// app.use(cookieParser());


const db = mysql.createConnection({
    user: 'root',
    host: 'localhost',
    password: 'NursEDev2023!',
    database: 'ambassadorEarnings',
});

app.post('/create', (req, res) => {
    console.log(req.body);
    const name = req.body.name
    const date = req.body.date
    const amount = req.body.amount
    const paid = req.body.paid

    db.query('INSERT INTO `ambassadors earnings` (name, date, amount, paid) VALUES (?,?,?,?)',
    [name, date, amount, paid], 
    (err, result) => {
        if (err) {
            console.log(err)
        }
        else {
            res.send("values inserted")
        }
    }
    )

})


// app.post('/login', (req, res) => {
//     console.log(req.body);
//     const email = req.body.email
//     const password = req.body.password

//     db.query('INSERT INTO `users` (email, password) VALUES (?,?)',
//     [email, password], 
//     (err, result) => {
//         if (err) {
//             console.log(err)
//         }
//         else {
//             res.send("values inserted")
//         }
//     }
//     )

// })




// app.post('/login', (req, res) => {
//     const sql = "SELECT * FROM users Where email = ? AND password =?";
//     db.query(sql, [req.body.email, req.body.password], (err, result) => {
//         if (err) return res.json({Status: "Error", Error: "Error in running query"});
//         if(result.length >0) {
//             return res.json({Status: "Success"})
//         } else {
//             return res.json({Status: "Error", Error: "Wrong Email or Password"})
//         }
//     })
//     console.log(req.body);
//     const email = req.body.email
//     const password = req.body.password

//     db.query('INSERT INTO `users` (email, password) VALUES (?,?)',
//     [email, password], 
//     (err, result) => {
//         if (err) {
//             console.log(err)
//         }
//         else {
//             res.send("values inserted")
//         }
//     }
//     )

// }




app.listen(3001, () => 
{console.log ("server is running on 3001")}

);