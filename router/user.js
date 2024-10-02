import express from 'express';
import { signup, login, logout, refreshToken, tokenCheck } from '../controller/user.js';
import { authenticateToken } from '../middleware/auth.js';
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', authenticateToken, logout);
router.post('/refresh-token', refreshToken);
router.post('/token-check', tokenCheck)

export default router;
