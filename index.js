const express = require('express');
const app = express();
const cors = require('cors');
const earningsRoutes = require("./routes/earningsRoute");
const csvUploadRoutes = require("./routes/csvUploadRoute");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require('cookie-parser');

app.use(cors());


app.use(express.json());
app.use(cookieParser());



app.get("/", (req, res) => {
    res.send("hello");
  });
  
app.use("/earnings", earningsRoutes);
app.use("/upload", csvUploadRoutes); 

app.use("/auth", authRoutes);

app.listen(3001, () => {
  console.log("Server is running on 3001");
});
