import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

// To prevent hot reloading from creating new instances of PrismaClient
// https://www.prisma.io/docs/guides/performance-and-optimization/connection-management#prevent-hot-reloading-from-creating-new-instances-of-prismaclient
export const db = globalForPrisma.prisma || new PrismaClient({})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
