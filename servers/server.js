const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require("cookie-parser");
const mongoose = require('mongoose');
const connectDB = require('./config/dbConnnection'); // Corrected typo in filename

app.use(express.json());
app.use(cookieParser());
app.use(cors());  
   
// Error handling middleware
app.use((err, req, res, next) => { 
    console.error(err.stack); 
    res.status(500).send('Something went wrong!');
});

require("dotenv").config();


       
// Error handling middleware   
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});     
     

 
connectDB();


app.use('/register', require('./routes/register')); 
app.use('/auth', require('./routes/auth'));

mongoose.connection.once('open', () => {
    console.log('Connected to the MongoDB');
    app.listen(process.env.PORT || 3001, () => {
        console.log(`App is running on port ${PORT}`);
    });
});  