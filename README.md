# QuickMeds Pharmacy Ordering Web Application

Full-stack pharmacy ordering app with Spring Boot 3 + Java 21 backend and React + Vite + Tailwind frontend.

## Project Structure

- `backend/` - Spring Boot API with JWT auth, MySQL, Swagger
- `frontend/` - React app with routing, auth, cart, and order UI

## Features Implemented

- JWT authentication (`register`, `login`)
- Role model (`ROLE_USER`, `ROLE_ADMIN`)
- Medicine browsing with search and category filtering
- Product details page
- Cart add/update/remove
- Order placement with prescription validation check
- Prescription file upload and admin validation API
- Inventory auto-update after order placement
- Admin medicine management APIs
- Swagger/OpenAPI docs
- Global exception handling
- DTO-based API contracts
- Seeded dummy data

## Backend Setup

### Prerequisites

- Java 21
- Maven 3.9+
- MySQL 8+

### Configuration

Copy values from `backend/.env.example` into your environment.

### Run

```bash
cd backend
mvn spring-boot:run
```

### Swagger

- URL: `http://localhost:8080/swagger-ui.html`

### Seeded Users

- Admin: `admin@quickmeds.com` / `admin123`
- User: `user@quickmeds.com` / `user123`

## Frontend Setup

### Prerequisites

- Node.js 20+
- npm 10+

### Configuration

Create `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

### Run

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173` by default.

## Important API Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/medicines?search=&categoryId=`
- `GET /api/medicines/{id}`
- `GET /api/categories`
- `GET /api/cart`
- `POST /api/cart/items`
- `PUT /api/cart/items/{cartItemId}`
- `DELETE /api/cart/items/{cartItemId}`
- `POST /api/orders`
- `GET /api/orders`
- `POST /api/prescriptions/upload`
- `GET /api/prescriptions`
- `POST /api/admin/medicines`
- `PUT /api/admin/medicines/{id}`
- `DELETE /api/admin/medicines/{id}`
- `PUT /api/admin/prescriptions/{id}/validate`

## Notes

- Cart and order routes require authentication on frontend.
- Medicines are visible without login.
- Selecting cart without login redirects to login.
- Prescription-required medicines can only be ordered with an admin-validated prescription.
