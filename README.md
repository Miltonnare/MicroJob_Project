# MicroJob Kenya - Digital Marketplace Monorepo

[![MicroJob CI Pipeline](https://github.com/Miltonnare/MicroJob_Project/actions/workflows/ci.yml/badge.svg)](https://github.com/Miltonnare/MicroJob_Project/actions)

An enterprise-grade, scalable digital marketplace built specifically for Kenya's informal workforce ("fundis", casual workers, masons, carpenters, plumbers, cleaners, mechanics, and artisans).

---

## 📁 Professional Monorepo Structure

```
MicroJob_Project/
├── frontend/             # Modern React 19 + TypeScript + Vite + TailwindCSS app
│   ├── src/              # Components, pages, stores, services, interactive maps
│   ├── public/           # Static PWA assets
│   └── Dockerfile        # Multi-stage production Nginx static container
│
├── backend/              # NestJS + TypeScript + Prisma ORM + PostgreSQL API
│   ├── src/              # Auth, Jobs, Workers, Applications, Escrow, Chat, Moderation
│   ├── prisma/           # Schema & seed data (47 Kenyan Counties & Trade Skills)
│   ├── test/             # Supertest E2E integration test suite
│   └── Dockerfile        # Multi-stage production NestJS container
│
├── docs/                 # Architectural, API & Database Schema documentation
│   ├── architecture.md
│   ├── api-docs.md
│   └── database-schema.md
│
├── infrastructure/       # Nginx reverse proxy configuration
│   └── nginx.conf
│
├── docker/               # PostgreSQL & Redis docker configs
│   └── init-db.sql
│
├── .github/              # GitHub Actions CI Workflows
│   └── workflows/
│       └── ci.yml
│
├── docker-compose.yml    # Full multi-container orchestration
├── README.md             # Platform documentation
└── .env.example          # Environment variables template
```

---

## ⚡ Core Features

- **Kenya Location Hierarchy**: Support for all **47 Counties**, Sub-Counties, and Wards.
- **Informal Trade Skills System**: Masons, Plumbers, Electricians, Carpenters, Welders, House Cleaners, Nannies, Boda Riders, Solar Technicians, etc.
- **Intelligent Proximity Matching**: AI recommendation algorithm weighting skill match %, Haversine GPS distance, Trust Score, and daily rate fit.
- **M-Pesa Escrow Payout Engine**: Hold payments on hiring via M-Pesa STK push and release funds to fundi upon job completion.
- **Real-Time Communication**: Socket.io WebSocket Gateway for text, photo, and voice message dispatch.
- **Interactive Proximity Map**: Leaflet map displaying nearby fundis and travel radii.

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- Node.js `v20+` & npm `10+`
- Docker & Docker Desktop

### 2. Environment Setup
Copy [.env.example](file:///c:/Users/user/OneDrive/Documents/MicroJob/MicroJob_Project/.env.example) to `.env`:
```bash
cp .env.example .env
```

### 3. Start Database & Services
```bash
docker-compose up -d postgres redis
```

### 4. Run Backend API
```bash
cd backend
npm install
npx prisma db push
npx prisma db seed
npm run start:dev
```
- Interactive OpenAPI Swagger Docs: `http://localhost:5000/api/docs`

### 5. Run Frontend Web App
```bash
cd frontend
npm install
npm run dev
```
- Web App UI: `http://localhost:5173`

---

## 🧪 Testing & Quality Assurance

### Run Backend Compilation & E2E Tests
```bash
cd backend
npm run build
npm run test:e2e
```

### Run Frontend Unit Tests & Production Build
```bash
cd frontend
npm run test
npm run build
```

---

## 🐳 Full Containerized Stack Deployment

To run the full stack (PostgreSQL, Redis, NestJS Backend, React Frontend) in production containers:
```bash
docker-compose up --build -d
```
- Web Application: `http://localhost:80`
- Backend API: `http://localhost:5000`
