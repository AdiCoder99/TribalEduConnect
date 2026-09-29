import express from "express";
import cors from "cors";
import mongoose from 'mongoose';
import connectDB from './configs/db.js';
import dotenv from 'dotenv';
import path from 'path';
import authrouter from './routes/auth.routes.js';
import applicationRoutes from './routes/application.Routes.js';
import schemeRoutes from './routes/scheme.routes.js';


const app = express();


//Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

dotenv.config();
// Connect to the database
connectDB();

app.get('/', (req, res) => {
    res.send('Server is running !');
})

// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/auth', authrouter);
app.use('/api/applications', applicationRoutes);
app.use('/api/schemes', schemeRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});