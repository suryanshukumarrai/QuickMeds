# QuickMeds Render Deployment Guide

This project is ready for both local Docker Compose and Render deployment.

## 1) Local Run with Docker Compose

From project root:

```bash
docker-compose up --build
```

Services:
- Frontend: http://localhost
- Backend: http://localhost:8080
- Health check: http://localhost:8080/api/health
- MySQL: localhost:3306

## 2) Render Deployment Strategy

Recommended setup:
- Backend: **Web Service** using Docker from `backend/Dockerfile`
- Frontend: **Static Site** from `frontend` (recommended on Render)
- Database: Use Render-managed PostgreSQL in production if possible, or external MySQL service.

If you must keep MySQL on Render, run MySQL as a separate private Docker service and persist data with a disk.

## 3) Backend on Render (Docker)

1. Create a new **Web Service** in Render.
2. Connect your repository.
3. Set Root Directory to `backend`.
4. Environment: `Docker`.
5. Exposed port: `8080`.
6. Add environment variables in Render dashboard:

- `DB_URL` (example: `jdbc:mysql://<mysql-host>:3306/quickmeds?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true`)
- `DB_USERNAME`
- `DB_PASSWORD`
- `JWT_SECRET`
- `MAIL_PASSWORD`
- `FRONTEND_URL` (example: `https://quickmeds-frontend.onrender.com`)
- `JPA_SHOW_SQL=false`
- `LOG_LEVEL_ROOT=INFO`
- `LOG_LEVEL_SPRING=INFO`

7. Deploy and verify:
- `https://<backend-service>.onrender.com/api/health` should return `OK`.

## 4) Frontend on Render (Static Site)

1. Create a **Static Site** in Render.
2. Connect your repository.
3. Set Root Directory to `frontend`.
4. Build Command:

```bash
npm install && npm run build
```

5. Publish Directory: `dist`
6. Add environment variable:
- `VITE_API_BASE_URL=https://<backend-service>.onrender.com/api`

7. Deploy frontend.

## 5) Alternative Frontend Deployment (Docker)

You can also deploy frontend as Docker Web Service from `frontend/Dockerfile`.

For Docker frontend builds, set build arg:
- `VITE_API_BASE_URL=https://<backend-service>.onrender.com/api`

## 6) Required Build Commands

Backend:
```bash
mvn clean package
```

Frontend:
```bash
npm install && npm run build
```
