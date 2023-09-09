import { exit } from 'node:process';
import { prisma } from '../../src/config/db'

async function main() {
  const categories = prisma.category.createMany({
    data: [
      { name: 'Casa'},
      { name: 'Departamento'},
      { name: 'Bodega'},
      { name: 'Terreno'},
      { name: 'Cabaña'},
    ]
  })

  const prices = prisma.price.createMany({
    data: [
      {
        name: '0 - $10,000 USD',
      },
      {
        name: '$10,000 - $30,000 USD',
      },
      {
        name: '$30,000 - $50,000 USD',
      },
      {
        name: '$50,000 - $75,000 USD',
      },
      {
        name: '$75,000 - $100,000 USD',
      },
      {
        name: '$100,000 - $150,000 USD',
      },
      {
        name: '$150,000 - $200,000 USD',
      },
      {
        name: '$200,000 - $300,000 USD',
      },
      {
        name: '$300,000 - $500,000 USD',
      },
      {
        name: '+ $500,000 USD',
      }
    ]
  })

  await Promise.all([categories, prices])
}

main()
  .then(async() => {
    await prisma.$disconnect()
    exit()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    exit(1)
  })
