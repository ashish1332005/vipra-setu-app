# Service Worker Backend

Express + MongoDB API for three user roles:

- `service_provider`
- `service_taker`
- `admin`

## Setup

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

Create first admin:

```bash
npm run seed
```

## Main Routes

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/providers`
- `GET /api/providers/me`
- `PUT /api/providers/me`
- `POST /api/providers/me/services`
- `GET /api/service-takers/me/requests`
- `POST /api/service-takers/me/requests`
- `GET /api/admin/dashboard`
- `GET /api/admin/users`
- `PATCH /api/admin/users/:id/status`
- `PATCH /api/admin/providers/:id/approve`
