import { test, expect } from './fixtures';

test('@smoke health check responds', async ({ request }) => {
  const res = await request.get('/ping');
  // Restful-Booker answers 201 Created on /ping; documented behaviour, not a typo.
  expect(res.status()).toBe(201);
});
