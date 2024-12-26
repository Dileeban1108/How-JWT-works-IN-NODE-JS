const mongoose = require('mongoose');
require("dotenv").config();


const connectDB = async () => {
    try {
        if (!process.env.DATABASE_URI) {
            throw new Error('DATABASE_URI is not defined in the environment variables.');
        }
        await mongoose.connect(process.env.DATABASE_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Error connecting to the database:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
