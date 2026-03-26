# QuickMeds 💊

A full-stack pharmacy ordering platform built for fast, safe, and user-friendly medicine delivery.
QuickMeds combines prescription-aware ordering, smart cart flow, and admin operations in one demo-ready product.

## Tech Stack

### Backend (Spring Boot)
- Java 21
- Spring Boot 3
- Spring Security + JWT Authentication
- Spring Data JPA (Hibernate)
- MySQL 8
- Swagger / OpenAPI

### Frontend (React)
- React + Vite
- Tailwind CSS
- React Router
- Axios

### DevOps
- Docker + Docker Compose
- Render-ready deployment setup

## Features

- 🔐 JWT-based authentication and role access (`ROLE_USER`, `ROLE_ADMIN`)
- 💊 Medicine listing with search and category filtering
- 🧾 Prescription upload and validation workflow
- 🛒 Cart management (add, update quantity, remove)
- 📦 Order placement with prescription checks
- 📊 Inventory updates after successful order placement
- 🧑‍⚕️ Admin APIs for medicines and prescription approvals
- 🎯 Loyalty points and offers integration
- 📘 Swagger UI for API exploration

## Smart UX Logic

- 🧠 Public browsing, protected checkout: users can browse medicines without login, but cart/order actions require authentication.
- ✅ Prescription safety gate: medicines marked `requiresPrescription=true` can be ordered only with validated prescription.
- 🧪 Fresh medicine data fetch: frontend requests latest medicine data with no-cache headers.
- ⚙️ Dynamic dosage handling: card UI uses backend dosage data and supports smart fallback options.

## Project Structure

```text
QuickMeds/
├── backend/                 # Spring Boot API
│   ├── src/main/java/com/quickmeds/
│   │   ├── config/
│   │   ├── controller/
│   │   ├── dto/
│   │   ├── entity/
│   │   ├── repository/
│   │   ├── security/
│   │   └── service/
│   └── src/main/resources/
├── frontend/                # React + Vite app
│   └── src/
│       ├── api/
│       ├── components/
│       ├── contexts/
│       └── pages/
├── docker-compose.yml
└── README.md
```

## Backend Setup

### Prerequisites

- Java 21
- Maven 3.9+
- MySQL 8+

### Application Config Example (`backend/src/main/resources/application.properties`)

```properties
server.port=${SERVER_PORT:8080}
spring.datasource.url=${DB_URL:jdbc:mysql://localhost:3306/quickmeds?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true}
spring.datasource.username=${DB_USERNAME:root}
spring.datasource.password=${DB_PASSWORD:root}
spring.jpa.hibernate.ddl-auto=update

app.jwt.secret=${JWT_SECRET:change-this-secret-key-to-at-least-32-characters-long}
app.jwt.expiration-ms=${JWT_EXPIRATION_MS:86400000}
app.frontend-url=${FRONTEND_URL:http://localhost:5173}

springdoc.swagger-ui.path=/swagger-ui.html
```

### Run Backend

```bash
cd backend
mvn clean package
mvn spring-boot:run
```

Backend URL: `http://localhost:8080`
Swagger URL: `http://localhost:8080/swagger-ui.html`

## Frontend Setup

### Prerequisites

- Node.js 20+
- npm 10+

### `.env` Example (`frontend/.env`)

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

### Run Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend URL: `http://localhost:5173`

## API Endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Medicines & Categories
- `GET /api/medicines?search=&categoryId=`
- `GET /api/medicines/{id}`
- `GET /api/categories`

### Cart
- `GET /api/cart`
- `POST /api/cart/items`
- `PUT /api/cart/items/{cartItemId}`
- `DELETE /api/cart/items/{cartItemId}`

### Orders
- `POST /api/orders`
- `GET /api/orders`

### Prescriptions
- `POST /api/prescriptions/upload`
- `GET /api/prescriptions`
- `PUT /api/admin/prescriptions/{id}/validate`

### Admin Medicines
- `POST /api/admin/medicines`
- `PUT /api/admin/medicines/{id}`
- `DELETE /api/admin/medicines/{id}`

## Demo Credentials

| Role  | Email                | Password |
|-------|----------------------|----------|
| Admin | admin@quickmeds.com  | admin123 |
| User  | user@quickmeds.com   | user123  |

## Deployment

### Docker (Local)

```bash
docker compose up --build -d
```

Services:
- Frontend: `http://localhost`
- Backend: `http://localhost:8080`
- Health: `http://localhost:8080/api/health`

### Render (Brief)

- Backend: deploy as Docker Web Service (root `Dockerfile` is supported)
- Frontend: deploy as Static Site from `frontend/` (or Docker Web Service)
- Required backend env vars:

```env
DB_URL=jdbc:mysql://<host>:3306/quickmeds?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true
DB_USERNAME=<db_user>
DB_PASSWORD=<db_password>
JWT_SECRET=<min-32-char-secret>
FRONTEND_URL=https://<your-frontend-domain>
MAIL_PASSWORD=<gmail-app-password-or-empty>
```

- Render provides `PORT` automatically; backend is configured to bind using `PORT`.

## Notes

- Keep `JWT_SECRET` strong (32+ characters) in all environments.
- Do not expose mail credentials in source control.
- Set production CORS URL via `FRONTEND_URL`.
- For consistent medicine sync, ensure dosage and pricing fields are populated in database imports.

## Future Improvements

- 🔄 Automated CSV-to-database sync job with validation report
- 📱 Push notifications for order status updates
- 🧾 Digital prescription OCR + medicine match suggestions
- 💳 Payment gateway integration
- 📈 Admin analytics dashboard (sales, inventory, conversion)

## Author

Built by **Suryanshu Rai**.
Open to collaborations, feedback, and hackathon demos.
