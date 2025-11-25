import { Router } from 'express';

const router = Router();

// Auth routes
router.post('/auth/login', (req, res) => { res.json({ message: 'Login' }); });
router.post('/auth/register', (req, res) => { res.json({ message: 'Register' }); });

// Machine routes
router.get('/machines', (req, res) => { res.json({ message: 'List machines' }); });
router.post('/machines', (req, res) => { res.json({ message: 'Create machine' }); });
router.put('/machines/:id', (req, res) => { res.json({ message: 'Update machine' }); });
router.delete('/machines/:id', (req, res) => { res.json({ message: 'Delete machine' }); });

// Favorites
router.post('/favorites/:machineId', (req, res) => { res.json({ message: 'Toggle favorite' }); });

// Activity Logs
router.get('/activity-logs', (req, res) => { res.json({ message: 'List logs' }); });

export default router;
