import { randomUUID } from 'node:crypto';
import type { Booking } from './types';

/** Builds a valid booking with a unique last name, so parallel tests never collide. */
export function buildBooking(overrides: Partial<Booking> = {}): Booking {
  return {
    firstname: 'Artiom',
    lastname: `QA-${randomUUID().slice(0, 8)}`,
    totalprice: 240,
    depositpaid: true,
    bookingdates: { checkin: '2026-11-02', checkout: '2026-11-05' },
    additionalneeds: 'Breakfast',
    ...overrides,
  };
}

// Default admin credentials published in the Restful-Booker docs.
export const ADMIN = {
  username: process.env.API_USERNAME ?? 'admin',
  password: process.env.API_PASSWORD ?? 'password123',
};
