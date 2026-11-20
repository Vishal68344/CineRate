# CineRate 🎬
Full-stack movie discovery, rating and review app built with React, Vite, Tailwind, Express and PostgreSQL.

## 🌐 Live Demo

**CineRate is deployed on AWS EC2 using Docker and Docker Compose.**

🎬 **Live Website:** [http://15.206.186.136:8081](http://15.206.186.136:8081)

**Tech Stack:** React, Vite, Node.js, Express, PostgreSQL, Docker, AWS EC2.

> Note: The live demo is available while the AWS EC2 instance is running.

## Requirements
Node.js 22+, npm, PostgreSQL 15+, a [TMDB API key](https://www.themoviedb.org/settings/api).

## Database
Create a local PostgreSQL user `cinerate`, database `cinerate`, and grant the user privileges to create tables in its public schema. For example, as a PostgreSQL administrator:

```sql
CREATE USER cinerate WITH PASSWORD 'cinerate';
CREATE DATABASE cinerate OWNER cinerate;
```

Then apply `database/init.sql` with `psql -h localhost -U cinerate -d cinerate -f database/init.sql`.

## Backend
```powershell
cd backend
Copy-Item .env.example .env
npm install
npm test
npm run dev
```
Edit `backend/.env` to set `TMDB_API_KEY`, `DATABASE_URL`, and a secure random `JWT_SECRET` of 32+ characters. Never commit `.env`.

## Frontend (separate terminal)
```powershell
cd frontend
Copy-Item .env.example .env
npm install
npm run dev
```
Open http://localhost:5173. The API runs at http://localhost:4000/api and health endpoint at http://localhost:4000/api/health.

## Build
```powershell
cd frontend
npm run build
```

## API
- POST `/api/auth/register`, POST `/api/auth/login`, GET `/api/auth/me`
- GET `/api/movies/trending`, `/popular`, `/search?query=...`, `/:id`, `/:id/reviews`
- POST `/api/movies/:id/reviews`, PUT/DELETE `/api/reviews/:id`
- GET `/api/users/me/reviews`, GET `/api/health`

## Deployment notes
This repository contains application code only. Docker, CI/CD, Terraform, ECR and AWS deployment will be added separately. In production serve frontend through Nginx, proxy `/api` to backend, and use `VITE_API_URL=/api` at frontend build time. Keep secrets out of source control. This starter stores JWT in localStorage for simplicity; for stronger production security, migrate to secure HttpOnly cookies and CSRF protection.
