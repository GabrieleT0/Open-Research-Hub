# Open Research Hub

A hub to manage and browse research information. This repository contains:

- **Backend** – Strapi v4 CMS/API: [neolaia-hub](neolaia-hub)
- **Frontend** – React (Create React App): [front-end/neolaia-hub](front-end/neolaia-hub)

Keeping both parts together simplifies local development and deployment.

---

## Stack

| Layer    | Tech |
|----------|------|
| Backend  | Strapi v4 (Node.js), PostgreSQL / SQLite |
| Frontend | React 18 (CRA), Bootstrap, Axios |
| Email    | Nodemailer (OTP delivery) |

---

## Repository Structure

```
NEOLAiA-HUB/
├── neolaia-hub/          # Strapi backend
│   ├── config/           # Server, DB, plugins, cron, email config
│   ├── src/              # APIs, controllers, content-types
│   └── .env.example      # Environment variable template
└── front-end/
    └── neolaia-hub/      # React frontend
        ├── src/          # Components, pages, API config
        └── public/
```

---

## Prerequisites

- Node.js 18–20 and npm
- PostgreSQL 13+ (recommended) **or** SQLite (quick local dev)
- SMTP credentials if you plan to use OTP email functionality

Tested on macOS/Linux; Windows works with equivalent tooling.

---

## Quick Start (Development)

### 1. Backend (Strapi)

```bash
cd neolaia-hub
npm install
cp .env.example .env   # then edit .env with your values
npm run develop
```

Strapi listens on `http://localhost:1337` by default.  
Admin panel: `http://localhost:1337/admin`

### 2. Frontend (React)

```bash
cd front-end/neolaia-hub
npm install
npm start
```

Dev server runs at `http://localhost:3000`.

> **Note:** The frontend's API base URL is set in [front-end/neolaia-hub/src/api.js](front-end/neolaia-hub/src/api.js). Adjust it to match your backend port if needed.

---

## Environment Variables (Backend)

Copy [neolaia-hub/.env.example](neolaia-hub/.env.example) to `.env` and fill in the values.

### Application & Security Keys

| Variable | Description |
|----------|-------------|
| `APP_KEYS` | Strapi app keys (comma-separated) |
| `API_TOKEN_SALT` | Salt for API tokens |
| `ADMIN_JWT_SECRET` | Admin JWT secret |
| `TRANSFER_TOKEN_SALT` | Transfer token salt |
| `JWT_SECRET` | General JWT secret |
| `JWT_SECRET_CUSTOM_AUTH` | Custom OTP auth secret |
| `JWT_EXPIRES_CUSTOM_AUTH_IN` | OTP token expiry (e.g. `1h`) |

### Server

| Variable | Default |
|----------|---------|
| `HOST` | `0.0.0.0` |
| `PORT` | `1337` |

### Database

| Variable | Example |
|----------|---------|
| `DATABASE_CLIENT` | `postgres` or `sqlite` |
| `DATABASE_HOST` | `127.0.0.1` |
| `DATABASE_PORT` | `5432` |
| `DATABASE_NAME` | `neolaia_hub` |
| `DATABASE_USERNAME` | `neolaia` |
| `DATABASE_PASSWORD` | `yourpassword` |
| `DATABASE_SSL` | `false` |

Or use `DATABASE_URL` as a connection string.

### SMTP (OTP Emails)

| Variable | Description |
|----------|-------------|
| `HOST_MAIL` | SMTP host (e.g. `smtp.gmail.com`) |
| `USER_MAIL` | Sender email |
| `PASS_MAIL` | Email password / app password |

---

## Database Setup (PostgreSQL)

```sql
CREATE DATABASE neolaia_hub;
CREATE USER neolaia WITH ENCRYPTED PASSWORD 'strong-password';
GRANT ALL PRIVILEGES ON DATABASE neolaia_hub TO neolaia;
```

Update `.env` accordingly.

---

## Available Scripts

### Backend (`neolaia-hub/`)

| Command | Description |
|---------|-------------|
| `npm run develop` | Start Strapi with auto-reload |
| `npm run start` | Start Strapi (production) |
| `npm run build` | Build admin panel |

### Frontend (`front-end/neolaia-hub/`)

| Command | Description |
|---------|-------------|
| `npm start` | Start dev server |
| `npm run build` | Production build to `build/` |
| `npm test` | Run tests |

---

## Build & Deploy

### Backend

```bash
cd neolaia-hub
npm install
npm run build
npm run start
```

### Frontend

```bash
cd front-end/neolaia-hub
npm install
npm run build
```

Output: `front-end/neolaia-hub/build/`

> The frontend `package.json` sets `homepage` to `/research-hub`. If deploying at the domain root, update this field.

---

## API Overview

The frontend consumes custom Strapi endpoints:

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/research-info-surveys/check_if_compiled/` | Check survey status |
| POST | `/api/research-info-surveys/search_researchers/` | Search researchers |
| GET | `/api/research-info-surveys/:id` | Get researcher details |
| POST | `/api/research-info-surveys/delete_submission/` | Delete submission |
| POST | `/api/research-info-surveys/find-by-user/` | Find by user |
| POST | `/api/neolaia-usr/create` | Send OTP |
| POST | `/api/neolaia-usr/active` | Validate OTP |

For full details, see controllers under `neolaia-hub/src/api/`.

---

## Contributing

Contributions are welcome! Please open an issue or pull request describing the problem or proposal.

---

## License

MIT
