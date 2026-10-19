import { expect } from '@playwright/test';
import type { Booking } from './types';

/** Lightweight contract check: asserts every field exists with the right type and format. */
export function expectBookingShape(body: unknown): asserts body is Booking {
  expect(body).toEqual(
    expect.objectContaining({
      firstname: expect.any(String),
      lastname: expect.any(String),
      totalprice: expect.any(Number),
      depositpaid: expect.any(Boolean),
      bookingdates: {
        checkin: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
        checkout: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
      },
    }),
  );
}
