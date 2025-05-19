const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Set JWT Secret if not in environment
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'todolistsecret123456789';
  console.log('Warning: Using default JWT secret. Set JWT_SECRET in environment for production.');
}


const app = express();

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));


const port = process.env.PORT || 9000;
// Connect to MongoDB
connectDB();

// Define Routes
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));

app.get('/', (req, res) => {
    res.send('Hello World!');
});



app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`); 
})

