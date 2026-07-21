# System Architecture - MicroJob Kenya

MicroJob is an enterprise-grade digital marketplace for Kenya's informal workforce ("fundis", casual workers, masons, cleaners, mechanics, and artisans).

## High-Level Monorepo Architecture

```
                                  ┌─────────────────────────────────────────┐
                                  │           frontend/ (React 19)          │
                                  │       Vite + TailwindCSS + Leaflet      │
                                  └────────────────────┬────────────────────┘
                                                       │ REST API / WebSockets
                                                       ▼
                                  ┌─────────────────────────────────────────┐
                                  │            backend/ (NestJS)            │
                                  │     Passport JWT Auth + RBAC Guards     │
                                  │    Socket.io Gateway + BullMQ Queues   │
                                  └────────────────────┬────────────────────┘
                                                       │
                      ┌────────────────────────────────┴────────────────────────────────┐
                      ▼                                                                 ▼
          ┌───────────────────────┐                                         ┌───────────────────────┐
          │   PostgreSQL Database │                                         │      Redis Cache      │
          │     (Prisma ORM)      │                                         │   WebSockets & Queues │
          └───────────────────────┘                                         └───────────────────────┘
```

## Key Domain Services

1. **Intelligent Proximity & Skill Matching**:
   - Calculates real-time Match Score (0–100%) by weighting skill overlap (40%), travel radius proximity via Haversine distance formula (30%), Trust Score & Ratings (20%), and daily rate fit (10%).

2. **M-Pesa Escrow Payment Engine**:
   - Holds job payments in escrow via Daraja API / STK push simulation upon job hiring.
   - Payout funds are only released to the worker's M-Pesa account once the employer verifies job completion.

3. **Location Hierarchy (Kenya 47 Counties)**:
   - Full spatial hierarchy mapping County → Sub-County → Ward across all 47 counties in Kenya.

4. **Real-Time Communication**:
   - WebSocket Gateway (`Socket.io`) handling real-time chat, typing events, read receipts, and photo/voice note attachments.
