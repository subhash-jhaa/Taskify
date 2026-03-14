import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

// Simple PrismaClient - relying on DATABASE_URL in environment
console.log('🔌 DATABASE_URL prefix:', process.env.DATABASE_URL?.substring(0, 15));

const prisma = new PrismaClient();

export default prisma
