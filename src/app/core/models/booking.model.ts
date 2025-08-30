export type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  userId: string;
  providerId: string;
  serviceId: string;
  service?: ServiceItem;
  provider?: Provider;
  startsAt: string;
  endsAt: string;
  status: BookingStatus;
  total: number;
  notes?: string;
  address: BookingAddress;
  paymentMethod?: PaymentMethod;
  createdAt: string;
  updatedAt: string;
}

export interface BookingAddress {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface PaymentMethod {
  type: 'credit_card' | 'debit_card' | 'pix' | 'cash';
  last4?: string;
  brand?: string;
}

export interface TimeSlot {
  date: string;
  time: string;
  available: boolean;
}

export interface ProviderAvailability {
  providerId: string;
  date: string;
  slots: string[];
}

import { ServiceItem, Provider } from './service.model';