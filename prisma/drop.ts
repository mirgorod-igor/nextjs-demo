import prisma from '../lib/prisma'

const main = async () => {
    await prisma.$executeRaw`drop table if exists products cascade`;
    await prisma.$executeRaw`drop table if exists prices cascade`;
    await prisma.$executeRaw`drop table if exists specializations cascade`;
    await prisma.$executeRaw`drop table if exists product_attrs cascade`;
    await prisma.$executeRaw`drop table if exists product_groups cascade`;
    await prisma.$executeRaw`drop table if exists product_categories cascade`;
    await prisma.$executeRaw`drop table if exists orgs cascade`;
    await prisma.$executeRaw`drop table if exists regions cascade`;
    await prisma.$executeRaw`drop table if exists societies cascade`;
    await prisma.$executeRaw`drop table if exists org_services cascade`;
}


main()
