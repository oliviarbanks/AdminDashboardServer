const express = require('express');
const app = express();
const cors = require('cors');
const earningsRoutes = require("./routes/earningsRoute");
const csvUploadRoutes = require("./routes/csvUploadRoute");
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

app.use(cors(

  {origin: ['http://localhost:3000'],
  methods: ['GET', 'POST','DELETE' ],
  credentials: true}
));


app.use(express.json());
app.use(cookieParser());

const authRoutes = require('./routes/authenticationRoute');
app.use('/register', authRoutes);

app.get("/", (req, res) => {
    res.send("hello");
  });
  
app.use("/earnings", earningsRoutes);
app.use("/upload", csvUploadRoutes); 


app.listen(3001, () => {
  console.log("Server is running on 3001");
});
