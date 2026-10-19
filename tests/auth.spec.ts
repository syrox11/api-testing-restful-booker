import { test, expect } from './fixtures';
import { ADMIN } from '../src/data';

test.describe('Auth', () => {
  test('@smoke valid credentials return a token', async ({ api }) => {
    const res = await api.createToken(ADMIN.username, ADMIN.password);

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.token).toMatch(/^[a-z0-9]{10,}$/i);
  });

  test('invalid credentials do not return a token', async ({ api }) => {
    const res = await api.createToken(ADMIN.username, 'wrong-password');

    // The API returns 200 with an error body instead of 401; the test pins that contract.
    expect(res.status()).toBe(200);
    expect(await res.json()).toEqual({ reason: 'Bad credentials' });
  });
});
