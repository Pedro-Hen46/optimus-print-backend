import { Router } from 'express';
import { login, register } from '../controllers/auth/auth.controller';
import { ensureAuthenticated, ensureRole } from '../middlewares/auth.middleware';

const router = Router();

router.post('/login', login);
router.post('/register', register);


export default router;