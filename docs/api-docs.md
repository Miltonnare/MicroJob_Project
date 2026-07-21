# API Documentation - MicroJob Kenya

The MicroJob Backend API is built using NestJS and exposed as a RESTful versioned API under `/api/v1`.
Live interactive OpenAPI Swagger documentation is served at `http://localhost:5000/api/docs`.

## Endpoint Summary

### Authentication (`/api/v1/auth`)
- `POST /api/v1/auth/register` - Register a new user account (Worker, Employer, Contractor).
- `POST /api/v1/auth/login` - Authenticate with email/phone & password. Returns JWT access & refresh tokens.
- `POST /api/v1/auth/refresh` - Refresh access token.
- `GET /api/v1/auth/me` - Get current authenticated user profile.

### Workers (`/api/v1/workers`)
- `GET /api/v1/workers` - Search fundis by County, Skill, Emergency availability, and Daily rate.
- `GET /api/v1/workers/profile/me` - Get worker profile.
- `PUT /api/v1/workers/profile/me` - Update worker rates, location, travel radius, and emergency toggle.
- `POST /api/v1/workers/profile/me/skills` - Add/update worker trade skill.

### Jobs & Matching (`/api/v1/jobs`)
- `POST /api/v1/jobs` - Post a new informal job opportunity.
- `GET /api/v1/jobs` - Search and filter jobs.
- `GET /api/v1/jobs/match/recommendations` - Get AI matching recommendations for authenticated worker.
- `GET /api/v1/jobs/:id` - Get job details and applicants.

### Escrow Payments (`/api/v1/payments`)
- `POST /api/v1/payments/mpesa/deposit` - Initiate M-Pesa STK Push deposit into Escrow.
- `POST /api/v1/payments/escrow/release/:contractId` - Release held escrow funds to fundi upon job completion.
- `GET /api/v1/payments/earnings/dashboard` - Get worker earnings and transaction history.
