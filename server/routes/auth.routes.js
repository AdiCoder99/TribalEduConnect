import express from 'express'
import { register, login, me } from '../controllers/auth.controller.js';

const authrouter = express.Router();

authrouter.post('/register', register);
authrouter.post('/login', login);
authrouter.get('/me', protect, me);