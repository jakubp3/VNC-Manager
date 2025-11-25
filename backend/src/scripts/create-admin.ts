#!/usr/bin/env ts-node
/**
 * Script to create an admin user
 * Usage: npm run create-admin
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import readline from 'readline';

const prisma = new PrismaClient();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function question(query: string): Promise<string> {
    return new Promise((resolve) => {
        rl.question(query, resolve);
    });
}

async function main() {
    console.log('=== Create Admin User ===\n');

    const email = await question('Email: ');
    const password = await question('Password: ');

    if (!email || !password) {
        console.error('Email and password are required');
        process.exit(1);
    }

    // Check if user exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
        console.error('User with this email already exists');
        process.exit(1);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin user
    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            role: 'ADMIN',
        },
    });

    console.log(`\n✓ Admin user created successfully!`);
    console.log(`  ID: ${user.id}`);
    console.log(`  Email: ${user.email}`);
    console.log(`  Role: ${user.role}`);

    rl.close();
    await prisma.$disconnect();
}

main().catch((error) => {
    console.error('Error creating admin user:', error);
    process.exit(1);
});
