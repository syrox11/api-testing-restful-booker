import { test, expect } from './fixtures';
import { buildBooking } from '../src/data';
import { expectBookingShape } from '../src/schema';

test.describe('Booking CRUD', () => {
  test('@smoke create a booking', async ({ api, token }) => {
    const payload = buildBooking();

    const res = await api.create(payload);

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.bookingid).toEqual(expect.any(Number));
    expect(body.booking).toEqual(payload);

    await api.delete(body.bookingid, token);
  });

  test('get a booking by id', async ({ api, booking }) => {
    const res = await api.get(booking.bookingid);

    expect(res.status()).toBe(200);
    const body = await res.json();
    expectBookingShape(body);
    expect(body).toEqual(booking.booking);
  });

  test('filter bookings by name', async ({ api, booking }) => {
    const res = await api.list({
      firstname: booking.booking.firstname,
      lastname: booking.booking.lastname,
    });

    expect(res.status()).toBe(200);
    const ids = (await res.json()).map((b: { bookingid: number }) => b.bookingid);
    expect(ids).toContain(booking.bookingid);
  });

  test('full update with PUT', async ({ api, token, booking }) => {
    const updated = buildBooking({ firstname: 'Updated', totalprice: 999, depositpaid: false });

    const res = await api.update(booking.bookingid, updated, token);

    expect(res.status()).toBe(200);
    expect(await res.json()).toEqual(updated);
    expect(await (await api.get(booking.bookingid)).json()).toEqual(updated);
  });

  test('partial update with PATCH only changes the given fields', async ({ api, token, booking }) => {
    const res = await api.patch(booking.bookingid, { additionalneeds: 'Late checkout' }, token);

    expect(res.status()).toBe(200);
    expect(await res.json()).toEqual({ ...booking.booking, additionalneeds: 'Late checkout' });
  });

  test('delete a booking', async ({ api, token, booking }) => {
    const res = await api.delete(booking.bookingid, token);

    // Restful-Booker answers 201 on delete; the follow-up GET is the real assertion.
    expect(res.status()).toBe(201);
    expect((await api.get(booking.bookingid)).status()).toBe(404);
  });
});

test.describe('Booking authorisation', () => {
  test('update without a token is rejected', async ({ api, booking }) => {
    const res = await api.update(booking.bookingid, buildBooking());
    expect(res.status()).toBe(403);
  });

  test('delete without a token is rejected', async ({ api, booking }) => {
    const res = await api.delete(booking.bookingid);
    expect(res.status()).toBe(403);
    expect((await api.get(booking.bookingid)).status()).toBe(200);
  });

  test('delete with an invalid token is rejected', async ({ api, booking }) => {
    const res = await api.delete(booking.bookingid, 'not-a-real-token');
    expect(res.status()).toBe(403);
  });
});

test.describe('Booking negative cases', () => {
  test('unknown booking id returns 404', async ({ api }) => {
    const res = await api.get(999_999_999);
    expect(res.status()).toBe(404);
  });

  test('create with missing required fields is rejected', async ({ request }) => {
    const res = await request.post('/booking', { data: { firstname: 'Only' } });
    // The API answers 500 instead of 400 here, a known defect pinned so a fix shows up as a change.
    expect(res.status()).toBe(500);
  });
});
