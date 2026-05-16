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

  const userHash = await bcrypt.hash('user123', 10)

  const regularUser = await prisma.user.upsert({
    where: { email: 'anna.kowalska@viatiway.com' },
    update: {},
    create: {
      email: 'anna.kowalska@viatiway.com',
      name: 'Anna Kowalska',
      passwordHash: userHash,
      accessLevel: 'USER',
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

  await prisma.tripHistory.deleteMany({ where: { trip: { userId: admin.id } } })
  await prisma.trip.deleteMany({ where: { userId: admin.id } })
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

  const annaId = 'bb2789cc-6690-4da9-817c-ed34d5c97c2a'

  let annaVehicle = await prisma.vehicle.findFirst({
    where: { userId: annaId, vehicleType: 'CAR_PRIVATE' },
  })
  if (!annaVehicle) {
    annaVehicle = await prisma.vehicle.create({
      data: {
        userId: annaId,
        vehicleType: 'CAR_PRIVATE',
        licensePlate: 'KR55321',
        isDefault: true,
      },
    })
  }

  await prisma.tripHistory.deleteMany({ where: { trip: { userId: annaId } } })
  await prisma.trip.deleteMany({ where: { userId: annaId } })
  await prisma.trip.create({
    data: {
      userId: annaId,
      transportMode: 'CAR_PRIVATE',
      vehicleId: annaVehicle.id,
      destinationFrom: 'Kraków',
      destinationTo: 'Warszawa',
      distance: 295.5,
      purpose: 'Spotkanie z klientem',
      client: 'Nova Sp. z o.o.',
      breakfastCount: 0,
      lunchCount: 1,
      dinnerCount: 0,
      startDate: new Date('2026-05-10T07:00:00Z'),
      endDate: new Date('2026-05-10T18:00:00Z'),
      status: 'SUBMITTED',
    },
  })

  await prisma.trip.create({
    data: {
      userId: annaId,
      transportMode: 'CAR_PRIVATE',
      vehicleId: annaVehicle.id,
      destinationFrom: 'Kraków',
      destinationTo: 'Wrocław',
      distance: 270.0,
      purpose: 'Szkolenie wewnętrzne',
      client: 'B&A Consulting',
      breakfastCount: 1,
      lunchCount: 1,
      dinnerCount: 0,
      startDate: new Date('2026-05-05T08:00:00Z'),
      endDate: new Date('2026-05-05T19:00:00Z'),
      status: 'APPROVED',
    },
  })

  await prisma.trip.create({
    data: {
      userId: annaId,
      transportMode: 'CAR_PRIVATE',
      vehicleId: annaVehicle.id,
      destinationFrom: 'Kraków',
      destinationTo: 'Poznań',
      distance: 405.0,
      purpose: 'Wdrożenie systemu u klienta',
      client: 'PolTech S.A.',
      breakfastCount: 1,
      lunchCount: 2,
      dinnerCount: 1,
      startDate: new Date('2026-04-20T07:30:00Z'),
      endDate: new Date('2026-04-21T18:00:00Z'),
      status: 'APPROVED',
    },
  })

  await prisma.trip.create({
    data: {
      userId: annaId,
      transportMode: 'CAR_PRIVATE',
      vehicleId: annaVehicle.id,
      destinationFrom: 'Kraków',
      destinationTo: 'Katowice',
      distance: 80.0,
      purpose: 'Spotkanie handlowe',
      client: 'Silesia Group',
      breakfastCount: 0,
      lunchCount: 1,
      dinnerCount: 0,
      startDate: new Date('2026-04-28T09:00:00Z'),
      endDate: new Date('2026-04-28T17:00:00Z'),
      status: 'APPROVED',
    },
  })

  const KM_RATE = 0.89
  const DIET_RATE = 45.00
  const approvedTrips = await prisma.trip.findMany({
    where: { status: 'APPROVED', userId: { in: [admin.id, annaId] } },
  })
  for (const t of approvedTrips) {
    const km = t.distance ? Number(t.distance) : 0
    const meals = t.breakfastCount + t.lunchCount + t.dinnerCount
    const kmTotal = Number((km * KM_RATE).toFixed(2))
    const dietTotal = Number((meals * DIET_RATE).toFixed(2))
    const totalAmount = Number((kmTotal + dietTotal).toFixed(2))
    await prisma.tripHistory.create({
      data: {
        tripId: t.id,
        kmRate: KM_RATE,
        dietRate: DIET_RATE,
        kmTotal,
        dietTotal,
        totalAmount,
        settledBy: admin.id,
      },
    })
  }

  console.log('Seed zakończony!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())