import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

function createPrismaClient() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        throw new Error('❌ DATABASE_URL is not set in environment variables');
    }
    const host = connectionString.split('@')[1] || 'unknown';
    console.log('🔌 Attempting database connection to:', host);

    const adapter = new PrismaPg({ connectionString })
    const client = new PrismaClient({ adapter })

    return client
}

// prevent multiple instances during hot reload in development
let prisma: PrismaClient

if (process.env.NODE_ENV === 'production') {
    prisma = createPrismaClient()
} else {
    if (!(global as any).prisma) {
        (global as any).prisma = createPrismaClient()
    }
    prisma = (global as any).prisma
}

export default prisma
