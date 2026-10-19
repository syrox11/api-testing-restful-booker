import { test as base, expect } from '@playwright/test';
import { BookingClient } from '../src/BookingClient';
import { ADMIN, buildBooking } from '../src/data';
import type { CreatedBooking } from '../src/types';

type Fixtures = {
  api: BookingClient;
  token: string;
  /** A fresh booking created before the test and deleted afterwards. */
  booking: CreatedBooking;
};

export const test = base.extend<Fixtures>({
  api: async ({ request }, use) => {
    await use(new BookingClient(request));
  },

  token: async ({ api }, use) => {
    const res = await api.createToken(ADMIN.username, ADMIN.password);
    expect(res.ok()).toBeTruthy();
    const { token } = await res.json();
    await use(token);
  },

  booking: async ({ api, token }, use) => {
    const res = await api.create(buildBooking());
    expect(res.ok()).toBeTruthy();
    const created: CreatedBooking = await res.json();
    await use(created);
    // Teardown: best-effort cleanup (the test may have already deleted it).
    await api.delete(created.bookingid, token);
  },
});

export { expect };
