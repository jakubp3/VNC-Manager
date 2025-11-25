import { Router, Request, Response } from 'express';
import { prisma } from '../server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

// Validation schemas
const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

/**
 * POST /api/auth/register
 * Create a new user account
 */
router.post('/register', async (req: Request, res: Response) => {
    try {
        const { email, password } = registerSchema.parse(req.body);

        // Check if user already exists
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role: 'USER', // Default role
            },
        });

        // Generate token
        const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
            expiresIn: '7d',
        });

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        console.error('Register error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * POST /api/auth/login
 * Authenticate user and return JWT token
 */
router.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = loginSchema.parse(req.body);

        // Find user
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Verify password
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate token
        const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
            expiresIn: '7d',
        });

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * GET /api/auth/me
 * Get current user info
 */
router.get('/me', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.userId },
            select: {
                id: true,
                email: true,
                role: true,
                createdAt: true,
            },
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
