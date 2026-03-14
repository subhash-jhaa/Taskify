import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

// PrismaClient connects directly via DATABASE_URL from environment
const prisma = new PrismaClient()

export default prisma
