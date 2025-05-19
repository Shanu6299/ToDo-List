const mongoose = require('mongoose');
const colors = require('colors');

const connectDB = async () => {
    try {
        // Use the connection string from environment variables
        console.log("Connecting to MongoDB using environment variable");
        await mongoose.connect(process.env.MONGO_URI, {});
        console.log(`Mongodb connected to ${mongoose.connection.host}`.bgGreen.white);
    } catch (error) {
        console.log(`Mongodb Server Issue: ${error}`.bgRed.white);
    }
};

module.exports = connectDB;
