export type Permission = 'USER' | 'ADMIN'
export type TripStatus = 'DRAFT' | 'SUBMITTED' | 'APPROVED'
export type VehicleType = 'CAR_COMPANY' | 'CAR_PRIVATE' | 'TRAIN' | 'PLANE' | 'BUS'
export type Currency = 'PLN' | 'EUR' | 'USD'

export interface User {
  id: string
  name: string
  email: string
  accessLevel: Permission
}

export interface Trip {
  id: string
  userId: string
  transportMode: VehicleType
  vehicleId: string | null
  ticketCost: number | null
  destinationFrom: string | null
  destinationTo: string | null
  distance: number | null
  purpose: string | null
  client: string | null
  breakfastCount: number
  lunchCount: number
  dinnerCount: number
  startDate: string | null
  endDate: string | null
  createdAt: string
  status: TripStatus
  totalAmount: number | null
  name: string | null
  destinationToAddress: string | null
  budget: number | null
  currency: Currency
  travelersCount: number
  splitEqually: boolean
  budgetTransport: number | null
  budgetStay: number | null
  budgetFood: number | null
  budgetFun: number | null
  budgetShop: number | null
  budgetOther: number | null
}

export interface Vehicle {
  id: string
  userId: string
  vehicleType: VehicleType
  licensePlate: string
  engineCapacity: number | null
  name: string | null
  fuelConsumption: number | null
  isDefault: boolean
}

export interface CreateTripPayload {
  name?: string
  destinationFrom?: string
  destinationTo?: string
  destinationToAddress?: string
  startDate?: string
  endDate?: string
  transportMode: VehicleType
  travelersCount?: number
  splitEqually?: boolean
  currency?: Currency
  budget?: number
  budgetTransport?: number
  budgetStay?: number
  budgetFood?: number
  budgetFun?: number
  budgetShop?: number
  budgetOther?: number
}
