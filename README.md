# API Testing — Restful-Booker

[![API tests](https://github.com/syrox11/api-testing-restful-booker/actions/workflows/api-tests.yml/badge.svg)](https://github.com/syrox11/api-testing-restful-booker/actions/workflows/api-tests.yml)

REST API test suite for [Restful-Booker](https://restful-booker.herokuapp.com/apidoc/index.html), a public practice API for hotel bookings. The same contract is covered in two ways, mirroring how QA teams usually work:

1. **Playwright + TypeScript**: code-first tests with a typed client, fixtures and automatic cleanup.
2. **Postman collection run with Newman**: the collection a manual or exploratory tester would use, run unattended in CI.

## Stack

- Playwright Test (`request` API) + TypeScript
- Postman + Newman, with the `htmlextra` report
- GitHub Actions: both suites run in parallel on every push, plus a nightly run on weekdays

## Coverage

| Area | Checks |
|------|--------|
| Health | `/ping` is up |
| Auth | Token issued for valid credentials; bad credentials rejected |
| CRUD | Create, read, filter by name, full update (PUT), partial update (PATCH), delete |
| Authorisation | PUT/DELETE without a token or with an invalid token return `403`, and the data is left unchanged |
| Contract | Response shape and types: TS shape assertion, JSON Schema in Postman |
| Negative | Unknown id returns `404`; invalid payload is rejected |

### Documented API quirks

Restful-Booker has a few non-standard behaviours. The tests **pin them deliberately**, so any change in behaviour shows up as a failing test instead of passing unnoticed:

- `GET /ping` and `DELETE /booking/:id` return `201`.
- Bad credentials on `/auth` return `200` with `{ "reason": "Bad credentials" }` instead of `401`.
- Creating a booking with missing required fields returns `500` instead of `400`. In a real project this would be filed as a bug.

## Project structure

```
src/
  BookingClient.ts   Typed wrapper over the endpoints
  data.ts            Test-data builder (unique names so parallel runs don't collide)
  schema.ts          Response shape assertion
  types.ts
tests/
  fixtures.ts        api / token / booking fixtures (booking is created and cleaned up per test)
  *.spec.ts
postman/
  restful-booker.postman_collection.json
  restful-booker.postman_environment.json
```

## Running locally

```bash
npm ci

npm test               # Playwright API tests
npm run test:smoke     # @smoke only
npm run test:postman   # Postman collection with Newman (HTML report in newman/)
npm run report         # open the Playwright HTML report
```

`BASE_URL`, `API_USERNAME` and `API_PASSWORD` environment variables override the defaults, so the suite can target another environment.

## Author

Artiom Syrovatskyy Kovalyov, QA Automation Engineer · [artiomsyrovatskyy.com](https://artiomsyrovatskyy.com)
