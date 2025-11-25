import { Router } from 'express';
import authController from '../controllers/auth.controller';
import usersController from '../controllers/users.controller';
import machinesController from '../controllers/machines.controller';

const router = Router();

// Auth routes (public)
router.use('/auth', authController);

// User management routes (protected, admin only)
router.use('/users', usersController);

// VNC machine routes (protected)
router.use('/vnc-machines', machinesController);

export default router;
