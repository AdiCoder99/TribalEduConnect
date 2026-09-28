import express from 'express'
import { register, login, me } from '../controllers/auth.controller.js';
import {protect} from '../middlewares/auth.middleware.js';

const authrouter = express.Router();

authrouter.post('/register', register);
authrouter.post('/login', login);
authrouter.get('/me', protect, me);

export default authrouter;