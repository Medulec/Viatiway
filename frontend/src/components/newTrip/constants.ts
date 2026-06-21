import type { Currency, VehicleType } from '../../types'
import { NPIcon } from './icons'

export type TransportId = 'CAR' | 'TRAIN' | 'BUS' | 'PLANE'
export type CategoryId = 'transport' | 'stay' | 'food' | 'fun' | 'shop' | 'other'

export interface TransportOption {
  id: TransportId
  label: string
  icon: typeof NPIcon.carP
  vehicleType: VehicleType
}

export interface CategoryOption {
  id: CategoryId
  label: string
  icon: typeof NPIcon.fuel
  helper: string
  tone: 'moss' | 'clay'
}

export const NP_TRANSPORT: TransportOption[] = [
  { id: 'CAR', label: 'Auto', icon: NPIcon.carP, vehicleType: 'CAR_PRIVATE' },
  { id: 'TRAIN', label: 'Pociąg', icon: NPIcon.train, vehicleType: 'TRAIN' },
  { id: 'BUS', label: 'Autobus', icon: NPIcon.bus, vehicleType: 'BUS' },
  { id: 'PLANE', label: 'Samolot', icon: NPIcon.plane, vehicleType: 'PLANE' },
]

export const NP_CATS: CategoryOption[] = [
  { id: 'transport', label: 'Transport', icon: NPIcon.fuel, helper: 'Paliwo, bilety, przejazdy', tone: 'moss' },
  { id: 'stay', label: 'Nocleg', icon: NPIcon.bed, helper: 'Hotel, apartament', tone: 'clay' },
  { id: 'food', label: 'Jedzenie', icon: NPIcon.food, helper: 'Restauracje, zakupy', tone: 'moss' },
  { id: 'fun', label: 'Atrakcje', icon: NPIcon.ticket, helper: 'Bilety, wycieczki', tone: 'clay' },
  { id: 'shop', label: 'Zakupy', icon: NPIcon.bag, helper: 'Pamiątki, drobne', tone: 'moss' },
  { id: 'other', label: 'Inne', icon: NPIcon.dots, helper: 'Pozostałe wydatki', tone: 'clay' },
]

export const NP_CUR: Record<Currency, string> = { PLN: 'zł', EUR: '€', USD: '$' }

export const npFmt = (n: number) =>
  n.toLocaleString('pl-PL', { minimumFractionDigits: 0, maximumFractionDigits: 0 })

export const npNum = (v: string) => parseFloat(String(v).replace(',', '.')) || 0

export const sanitizeNum = (v: string) => v.replace(/[^0-9.,]/g, '')
