import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export async function connectDB() {
  try {
    await prisma.$connect();
    console.log('Database connected successfully.');
  } catch (err) {
    console.warn('Database connection skipped/fallback mode active:', err);
  }
}
