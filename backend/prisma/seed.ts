import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
// wymagany klient z biblioteka pg zeby sie laczylo z postgres
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import bcrypt from 'bcrypt'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

const prisma = new PrismaClient({
  adapter: new PrismaPg(pool),
})

async function main() {
  const hash = await bcrypt.hash('admin123', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@viatiway.com' },
    update: {},
    create: {
      email: 'admin@viatiway.com',
      name: 'Admin',
      passwordHash: hash,
      accessLevel: 'ADMIN',
    }
  })

  const ratesCount = await prisma.rate.count()
  if (ratesCount === 0) {
    await prisma.rate.createMany({
      data: [
        {
          type: 'KM_RATE_SMALL',
          value: 0.89,
          validFrom: new Date('2023-01-01'),
        },
        {
          type: 'KM_RATE_LARGE',
          value: 1.15,
          validFrom: new Date('2023-01-01'),
        },
        {
          type: 'DIET_RATE',
          value: 45.00,
          validFrom: new Date('2023-01-01'),
        },
      ],
    })
  }

  let privateVehicle = await prisma.vehicle.findFirst({
    where: { userId: admin.id, vehicleType: 'CAR_PRIVATE' },
  })
  if (!privateVehicle) {
    privateVehicle = await prisma.vehicle.create({
      data: {
        userId: admin.id,
        vehicleType: 'CAR_PRIVATE',
        licensePlate: 'WA12345',
        isDefault: true,
      },
    })
  }

  let companyVehicle = await prisma.vehicle.findFirst({
    where: { userId: admin.id, vehicleType: 'CAR_COMPANY' },
  })
  if (!companyVehicle) {
    companyVehicle = await prisma.vehicle.create({
      data: {
        userId: admin.id,
        vehicleType: 'CAR_COMPANY',
        licensePlate: 'WA98765',
        isDefault: false,
      },
    })
  }

  const tripsCount = await prisma.trip.count()
  if (tripsCount === 0) {
    await prisma.trip.create({
      data: {
        userId: admin.id,
        transportMode: 'CAR_PRIVATE',
        vehicleId: privateVehicle.id,
        destinationFrom: 'Warszawa',
        destinationTo: 'Kraków',
        distance: 295.5,
        purpose: 'Spotkanie z klientem',
        client: 'Acme Corp',
        breakfastCount: 1,
        lunchCount: 2,
        dinnerCount: 1,
        startDate: new Date('2026-04-15T08:00:00Z'),
        endDate: new Date('2026-04-17T18:00:00Z'),
        status: 'SUBMITTED',
      },
    })

    await prisma.trip.create({
      data: {
        userId: admin.id,
        transportMode: 'CAR_COMPANY',
        vehicleId: companyVehicle.id,
        destinationFrom: 'Warszawa',
        destinationTo: 'Gdańsk',
        distance: 340.0,
        purpose: 'Audyt u klienta',
        client: 'Baltic Logistics',
        breakfastCount: 0,
        lunchCount: 1,
        dinnerCount: 1,
        startDate: new Date('2026-05-06T07:00:00Z'),
        endDate: new Date('2026-05-07T19:00:00Z'),
        status: 'DRAFT',
      },
    })
  }

  console.log('Seed zakończony!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())