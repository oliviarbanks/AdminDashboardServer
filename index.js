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


app.listen(3001, () => {
  console.log("Server is running on 3001");
});
