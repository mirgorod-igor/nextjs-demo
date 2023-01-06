import { Prisma, PrismaClient } from '@prisma/client'

const conf: Prisma.PrismaClientOptions = {
    log: ['query', 'info', 'warn', 'error']
}

let prisma: PrismaClient

if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient(conf)
} else {
    if (!global.prisma) {
        global.prisma = new PrismaClient(conf)
    }
    prisma = global.prisma
}
export default prisma