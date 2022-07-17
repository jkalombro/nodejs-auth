import express from 'express';
import auth from '../middleware/auth.js';
import { signin, signup, updateUser } from '../controllers/user.controller.js';

const router = express.Router();

router.post('/signin', signin);
router.post('/signup', signup);
router.patch('/update/:id', auth, updateUser);

export default router;
