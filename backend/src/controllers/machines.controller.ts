import { Router, Response } from 'express';
import { prisma } from '../server';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';
import { z } from 'zod';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Validation schemas
const createMachineSchema = z.object({
    name: z.string().min(1),
    host: z.string().min(1),
    port: z.number().int().min(1).max(65535).default(5900),
    password: z.string().optional(),
    isShared: z.boolean().optional(), // Only admins can create shared machines
});

const updateMachineSchema = z.object({
    name: z.string().min(1).optional(),
    host: z.string().min(1).optional(),
    port: z.number().int().min(1).max(65535).optional(),
    password: z.string().optional().nullable(),
});

/**
 * GET /api/vnc-machines
 * List all machines accessible to current user (shared + own)
 */
router.get('/', async (req: AuthRequest, res: Response) => {
    try {
        const machines = await prisma.vncMachine.findMany({
            where: {
                OR: [
                    { ownerId: null }, // Shared machines
                    { ownerId: req.userId }, // User's own machines
                ],
            },
            include: {
                owner: {
                    select: {
                        id: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        res.json(machines);
    } catch (error) {
        console.error('List machines error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * GET /api/vnc-machines/:id
 * Get machine details
 */
router.get('/:id', async (req: AuthRequest, res: Response) => {
    try {
        const machineId = parseInt(req.params.id);

        const machine = await prisma.vncMachine.findUnique({
            where: { id: machineId },
            include: {
                owner: {
                    select: {
                        id: true,
                        email: true,
                    },
                },
            },
        });

        if (!machine) {
            return res.status(404).json({ error: 'Machine not found' });
        }

        // Check access: shared machines or own machines
        if (machine.ownerId !== null && machine.ownerId !== req.userId) {
            return res.status(403).json({ error: 'Access denied' });
        }

        res.json(machine);
    } catch (error) {
        console.error('Get machine error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * POST /api/vnc-machines
 * Create new VNC machine
 * - Admins can create shared machines (ownerId = null)
 * - Users can only create personal machines (ownerId = their id)
 */
router.post('/', async (req: AuthRequest, res: Response) => {
    try {
        const data = createMachineSchema.parse(req.body);

        // Determine ownerId based on user role and isShared flag
        let ownerId: number | null = req.userId!;

        if (data.isShared) {
            // Only admins can create shared machines
            if (req.userRole !== 'ADMIN') {
                return res.status(403).json({ error: 'Only admins can create shared machines' });
            }
            ownerId = null;
        }

        const machine = await prisma.vncMachine.create({
            data: {
                name: data.name,
                host: data.host,
                port: data.port,
                password: data.password,
                ownerId,
            },
            include: {
                owner: {
                    select: {
                        id: true,
                        email: true,
                    },
                },
            },
        });

        res.status(201).json(machine);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        console.error('Create machine error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * PATCH /api/vnc-machines/:id
 * Update VNC machine
 * - Users can only update their own machines
 * - Admins can update any machine
 */
router.patch('/:id', async (req: AuthRequest, res: Response) => {
    try {
        const machineId = parseInt(req.params.id);
        const updates = updateMachineSchema.parse(req.body);

        // Find machine
        const machine = await prisma.vncMachine.findUnique({
            where: { id: machineId },
        });

        if (!machine) {
            return res.status(404).json({ error: 'Machine not found' });
        }

        // Check permissions
        const isOwner = machine.ownerId === req.userId;
        const isAdmin = req.userRole === 'ADMIN';

        if (!isOwner && !isAdmin) {
            return res.status(403).json({ error: 'Access denied' });
        }

        // Update machine
        const updated = await prisma.vncMachine.update({
            where: { id: machineId },
            data: updates,
            include: {
                owner: {
                    select: {
                        id: true,
                        email: true,
                    },
                },
            },
        });

        res.json(updated);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        console.error('Update machine error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * DELETE /api/vnc-machines/:id
 * Delete VNC machine
 * - Users can only delete their own machines
 * - Admins can delete any machine
 */
router.delete('/:id', async (req: AuthRequest, res: Response) => {
    try {
        const machineId = parseInt(req.params.id);

        // Find machine
        const machine = await prisma.vncMachine.findUnique({
            where: { id: machineId },
        });

        if (!machine) {
            return res.status(404).json({ error: 'Machine not found' });
        }

        // Check permissions
        const isOwner = machine.ownerId === req.userId;
        const isAdmin = req.userRole === 'ADMIN';

        if (!isOwner && !isAdmin) {
            return res.status(403).json({ error: 'Access denied' });
        }

        await prisma.vncMachine.delete({
            where: { id: machineId },
        });

        res.json({ message: 'Machine deleted successfully' });
    } catch (error) {
        console.error('Delete machine error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
