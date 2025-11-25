import { Router, Response } from 'express';
import { prisma } from '../server';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth.middleware';
import { z } from 'zod';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Validation schema
const updateUserSchema = z.object({
    role: z.enum(['ADMIN', 'USER']).optional(),
});

/**
 * GET /api/users
 * List all users (admin only)
 */
router.get('/', requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        res.json(users);
    } catch (error) {
        console.error('List users error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * PATCH /api/users/:id
 * Update user role (admin only)
 */
router.patch('/:id', requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const userId = parseInt(req.params.id);
        const { role } = updateUserSchema.parse(req.body);

        if (!role) {
            return res.status(400).json({ error: 'No updates provided' });
        }

        // Prevent self-demotion
        if (userId === req.userId && role === 'USER') {
            return res.status(400).json({ error: 'Cannot demote yourself' });
        }

        const user = await prisma.user.update({
            where: { id: userId },
            data: { role },
            select: {
                id: true,
                email: true,
                role: true,
                updatedAt: true,
            },
        });

        res.json(user);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        console.error('Update user error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * DELETE /api/users/:id
 * Delete user (admin only)
 */
router.delete('/:id', requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const userId = parseInt(req.params.id);

        // Prevent self-deletion
        if (userId === req.userId) {
            return res.status(400).json({ error: 'Cannot delete yourself' });
        }

        await prisma.user.delete({
            where: { id: userId },
        });

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
