import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seed() {
    console.log('Starting database seed...');

    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
        where: { email: 'admin@vnc-manager.local' },
    });

    if (existingAdmin) {
        console.log('Admin user already exists, skipping seed.');
        return;
    }

    // Create default admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const admin = await prisma.user.create({
        data: {
            email: 'admin@vnc-manager.local',
            password: hashedPassword,
            role: 'ADMIN',
        },
    });

    console.log('✓ Created default admin user:');
    console.log('  Email: admin@vnc-manager.local');
    console.log('  Password: admin123');
    console.log('  Role: ADMIN');
    console.log('\n⚠️  IMPORTANT: Change this password after first login!');
}

seed()
    .catch((error) => {
        console.error('Error seeding database:', error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
