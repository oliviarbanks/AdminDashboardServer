const express = require ('express');
const app = express();
const mysql = require('mysql')
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




app.listen(3001, () => 
{console.log ("server is running on 3001")}

);