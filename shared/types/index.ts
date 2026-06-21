export type Permission = 'USER' | 'ADMIN'
export type TripStatus = 'DRAFT' | 'SUBMITTED' | 'APPROVED'
export type VehicleType = 'CAR_COMPANY' | 'CAR_PRIVATE' | 'TRAIN' | 'PLANE' | 'BUS'

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
}

export interface Vehicle {
  id: string
  userId: string
  vehicleType: VehicleType
  licensePlate: string
  isDefault: boolean
}
