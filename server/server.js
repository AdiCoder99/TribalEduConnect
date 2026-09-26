import express from "express";
import cors from "cors";
import mongoose from 'mongoose';
import connectDB from './configs/db.js';


const app = express();


//Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to the database
connectDB();

app.get('/', (req, res) => {
    res.send('Server is running !');
})

app.use('/api/auth', authrouter);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});