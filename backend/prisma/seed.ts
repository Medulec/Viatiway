import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
// wymagany klient z biblioteka pg zeby sie laczylo z postgres
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import bcrypt from 'bcrypt'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

// uzycie adaptera 
const prisma = new PrismaClient({
  adapter: new PrismaPg(pool),
})

async function main() {
  const hash = await bcrypt.hash('admin123', 10)

  await prisma.user.upsert({
    where: { email: 'admin@viatiway.com' },
    update: {},
    create: {
      email: 'admin@viatiway.com',
      name: 'Admin',
      passwordHash: hash,
      accessLevel: 'ADMIN',
    }
  })

  console.log('Seed zakończony!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())