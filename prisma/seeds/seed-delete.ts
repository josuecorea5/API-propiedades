import { prisma } from '../../src/config/db';
import { exit } from 'node:process';

async function main() {
  try {
    await Promise.all([prisma.category.deleteMany({where: {}}), prisma.price.deleteMany({where: {}})])
    await Promise.all([prisma.$executeRaw`TRUNCATE TABLE Category`, prisma.$executeRaw`TRUNCATE TABLE Price`])
    exit()
  } catch (error) {
    console.error(error);
    exit(1);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
    exit()
  })
  .catch(async(e) => {
    console.error(e)
    exit(1)
  })
  