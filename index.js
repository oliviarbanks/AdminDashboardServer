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

  
app.use("/earnings", earningsRoutes);
app.use("/upload", csvUploadRoutes); 

app.use("/auth", authRoutes);

app.listen(3001, () => {
  console.log("Server is running on 3001");
});


// i have 3 routes. In the earnigns I have a GET end point that gets all the earnings information the name, amount, date, and if its paid. 
// I also have a post end point in the earnings if you want to manually add ambassador information using a form 
// in my upload I have a post endpoint where you can upload a file from computer and i am using csv-parser to parse the file when its uploading
// I also have an authentication route. I have two GET end points where you can get one user and all users and I also have two POST end points to register and login a user 
