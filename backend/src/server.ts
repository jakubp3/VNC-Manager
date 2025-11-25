import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { PrismaClient } from '@prisma/client';
import routes from './routes';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api', routes);

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Initialize database and seed on startup
async function initializeDatabase() {
    try {
        console.log('Pushing database schema...');
        await execAsync('npx prisma db push --accept-data-loss');
        console.log('✓ Database schema pushed');

        console.log('Seeding database...');
        await execAsync('npm run prisma:seed');
        console.log('✓ Database seeded');
    } catch (error) {
        console.error('Database initialization error:', error);
        // Don't exit - the app can still run
    }
}

initializeDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});

export { prisma };
