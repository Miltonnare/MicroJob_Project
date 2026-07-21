# Database Schema - MicroJob Kenya

MicroJob uses PostgreSQL managed via Prisma ORM (`backend/prisma/schema.prisma`).

## Primary Models

- `User`: Base authentication account (WORKER, EMPLOYER, CONTRACTOR, ADMIN, MODERATOR).
- `County`, `SubCounty`, `Ward`: Spatial locations mapping Kenya's 47 counties.
- `WorkerProfile`: Fundi profile (national ID verification, rates, travel radius, emergency availability toggle, trust score).
- `EmployerProfile` & `ContractorProfile`: Organization details and site management.
- `Category` & `Skill`: Informal sector trades (Masonry, Plumbing, Electrical, Domestic Cleaning, Boda Delivery, Solar Tech, etc.).
- `Job` & `JobApplication`: Job listings, daily budgets, GPS coordinates, and applicant proposals.
- `Contract` & `EscrowAccount`: Active job contracts and M-Pesa escrow funds status (HELD, RELEASED, REFUNDED, DISPUTED).
- `PaymentTransaction`: Audit trail for all M-Pesa deposits, releases, and withdrawals.
- `Conversation` & `Message`: Real-time chat history.
- `Review`, `Badge`, `WorkerBadge`: User reputation, rating breakdown (punctuality, quality, communication), and trust badges.
