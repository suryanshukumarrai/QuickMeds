# QuickMeds API Documentation

## Overview

QuickMeds is a comprehensive pharmacy ordering REST API built with Spring Boot. This API is fully designed for Postman testing and provides JWT-based authentication for secure access.

## 🚀 Quick Setup

### Prerequisites
- MySQL 8.0+
- Java 21+
- Maven 3.8+
- Postman

### Environment Configuration

Set environment variables before running the application:

```bash
export DB_USERNAME=root
export DB_PASSWORD=Ritu222003@
export DB_URL=jdbc:mysql://localhost:3306/quickmeds?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
export JWT_SECRET=your-secret-key-at-least-32-characters-long
```

### Running the Backend

```bash
cd backend
mvn spring-boot:run
```

The API will be available at: `http://localhost:8080`

## 📋 API Endpoints

### Base URL
```
http://localhost:8080/api
```

### Response Format

All successful responses follow this format:
```json
{
  "id": 1,
  "name": "Product Name",
  "description": "Description",
  "price": 9.99,
  "stock": 100
}
```

Error responses follow this format:
```json
{
  "timestamp": "2026-03-21T12:00:00",
  "status": 400,
  "error": "Error message"
}
```

---

## 🔐 Authentication

### 1. Register User
**POST** `/auth/register`

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "email": "john@example.com",
  "fullName": "John Doe",
  "role": "ROLE_USER"
}
```

**Status Codes:**
- `200 OK` - Registration successful
- `400 Bad Request` - Invalid input
- `409 Conflict` - Email already exists

---

### 2. Login
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "email": "john@example.com",
  "fullName": "John Doe",
  "role": "ROLE_USER"
}
```

**Status Codes:**
- `200 OK` - Login successful
- `401 Unauthorized` - Invalid credentials
- `400 Bad Request` - Missing fields

**How to Use the Token:**
Save the `token` value and add it to all subsequent authenticated requests:
```
Header: Authorization
Value: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🛍️ Products API

### 3. Get All Medicines
**GET** `/medicines`

**Query Parameters:**
- `search` (optional): Search by medicine name
- `categoryId` (optional): Filter by category ID

**Example Requests:**
```
/medicines                                    // Get all medicines
/medicines?search=Paracetamol                 // Search by name
/medicines?categoryId=1                       // Filter by category
/medicines?search=Aspirin&categoryId=2        // Both filters
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Paracetamol 500mg",
    "description": "Fever and mild pain relief",
    "price": 4.99,
    "stock": 50,
    "prescriptionRequired": false,
    "categoryId": 1,
    "categoryName": "Pain Relief",
    "imageUrl": "https://example.com/paracetamol.jpg"
  }
]
```

**Status Codes:**
- `200 OK` - Success

---

### 4. Get Medicine by ID
**GET** `/medicines/{id}`

**Path Parameters:**
- `id` (required): Medicine ID

**Example:**
```
GET /medicines/1
```

**Response:**
```json
{
  "id": 1,
  "name": "Paracetamol 500mg",
  "description": "Fever and mild pain relief",
  "price": 4.99,
  "stock": 50,
  "prescriptionRequired": false,
  "categoryId": 1,
  "categoryName": "Pain Relief",
  "imageUrl": "https://example.com/paracetamol.jpg"
}
```

**Status Codes:**
- `200 OK` - Success
- `404 Not Found` - Medicine doesn't exist

---

### 5. Get Categories
**GET** `/categories`

**Response:**
```json
[
  {
    "id": 1,
    "name": "Pain Relief",
    "description": "Pain relief medications"
  },
  {
    "id": 2,
    "name": "Cold & Flu",
    "description": "Cold and flu treatment"
  }
]
```

**Status Codes:**
- `200 OK` - Success

---

## 🛒 Shopping Cart API

**All cart endpoints require JWT authentication!**

### 6. Get Cart
**GET** `/cart`

**Headers Required:**
```
Authorization: Bearer {jwt_token}
```

**Response:**
```json
{
  "id": 1,
  "userId": 1,
  "items": [
    {
      "id": 1,
      "medicineId": 1,
      "medicineName": "Paracetamol 500mg",
      "quantity": 2,
      "price": 4.99
    }
  ],
  "total": 9.98
}
```

**Status Codes:**
- `200 OK` - Success
- `401 Unauthorized` - Missing or invalid token

---

### 7. Add Item to Cart
**POST** `/cart/items`

**Headers Required:**
```
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "medicineId": 1,
  "quantity": 2
}
```

**Response:**
Same as Get Cart (returns updated cart)

**Status Codes:**
- `200 OK` - Item added successfully
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Missing token
- `404 Not Found` - Medicine doesn't exist

---

### 8. Update Cart Item Quantity
**PUT** `/cart/items/{itemId}`

**Headers Required:**
```
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

**Path Parameters:**
- `itemId` (required): Cart item ID

**Request Body:**
```json
{
  "quantity": 5
}
```

**Response:**
Same as Get Cart

**Status Codes:**
- `200 OK` - Updated successfully
- `400 Bad Request` - Invalid quantity
- `401 Unauthorized` - Missing token
- `404 Not Found` - Item not found

---

### 9. Remove Item from Cart
**DELETE** `/cart/items/{itemId}`

**Headers Required:**
```
Authorization: Bearer {jwt_token}
```

**Path Parameters:**
- `itemId` (required): Cart item ID

**Response:**
Same as Get Cart (returns updated cart)

**Status Codes:**
- `200 OK` - Removed successfully
- `401 Unauthorized` - Missing token
- `404 Not Found` - Item not found

---

## 📦 Orders API

**All order endpoints require JWT authentication!**

### 10. Place Order
**POST** `/orders`

**Headers Required:**
```
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "prescriptionId": null
}
```

**Notes:**
- `prescriptionId`: Optional. Include for prescription-required medicines.
- All items from cart will be copied to the order
- Cart will be cleared after order placement

**Response:**
```json
{
  "id": 1,
  "userId": 1,
  "items": [
    {
      "id": 1,
      "medicineId": 1,
      "medicineName": "Paracetamol 500mg",
      "quantity": 2,
      "pricePaid": 4.99
    }
  ],
  "totalAmount": 9.98,
  "status": "PLACED"
}
```

**Status Codes:**
- `200 OK` - Order placed successfully
- `400 Bad Request` - Cart is empty or invalid prescription
- `401 Unauthorized` - Missing token

---

### 11. Get My Orders
**GET** `/orders`

**Headers Required:**
```
Authorization: Bearer {jwt_token}
```

**Response:**
```json
[
  {
    "id": 1,
    "userId": 1,
    "items": [...],
    "totalAmount": 9.98,
    "status": "PLACED"
  }
]
```

**Status Codes:**
- `200 OK` - Success
- `401 Unauthorized` - Missing token

---

## 📄 Prescriptions API

**All prescription endpoints require JWT authentication!**

### 12. Upload Prescription
**POST** `/prescriptions/upload`

**Headers Required:**
```
Authorization: Bearer {jwt_token}
```

**Content Type:** `multipart/form-data`

**Form Data:**
- `file` (required): PDF or image file of the prescription

**Response:**
```json
{
  "id": 1,
  "fileName": "prescription_1234.pdf",
  "uploadedAt": "2026-03-21T12:00:00",
  "validated": false
}
```

**Status Codes:**
- `200 OK` - File uploaded successfully
- `400 Bad Request` - Invalid file or missing
- `401 Unauthorized` - Missing token

---

### 13. Get My Prescriptions
**GET** `/prescriptions`

**Headers Required:**
```
Authorization: Bearer {jwt_token}
```

**Response:**
```json
[
  {
    "id": 1,
    "fileName": "prescription_1234.pdf",
    "uploadedAt": "2026-03-21T12:00:00",
    "validated": true
  }
]
```

**Status Codes:**
- `200 OK` - Success
- `401 Unauthorized` - Missing token

---

## 👨‍💼 Admin API

**All admin endpoints require ADMIN role JWT authentication!**

### 14. Create Medicine (Admin Only)
**POST** `/admin/medicines`

**Headers Required:**
```
Authorization: Bearer {admin_jwt_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Aspirin 500mg",
  "description": "Pain relief and fever treatment",
  "price": 3.50,
  "stock": 100,
  "prescriptionRequired": false,
  "categoryId": 1,
  "imageUrl": "https://example.com/aspirin.jpg"
}
```

**Response:**
```json
{
  "id": 7,
  "name": "Aspirin 500mg",
  "description": "Pain relief and fever treatment",
  "price": 3.50,
  "stock": 100,
  "prescriptionRequired": false,
  "categoryId": 1,
  "categoryName": "Pain Relief",
  "imageUrl": "https://example.com/aspirin.jpg"
}
```

**Status Codes:**
- `200 OK` - Medicine created
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Missing token
- `403 Forbidden` - Not an admin

---

### 15. Update Medicine (Admin Only)
**PUT** `/admin/medicines/{id}`

**Headers Required:**
```
Authorization: Bearer {admin_jwt_token}
Content-Type: application/json
```

**Path Parameters:**
- `id` (required): Medicine ID

**Request Body:**
Same as Create Medicine

**Status Codes:**
- `200 OK` - Medicine updated
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Missing token
- `403 Forbidden` - Not an admin
- `404 Not Found` - Medicine doesn't exist

---

### 16. Delete Medicine (Admin Only)
**DELETE** `/admin/medicines/{id}`

**Headers Required:**
```
Authorization: Bearer {admin_jwt_token}
```

**Path Parameters:**
- `id` (required): Medicine ID

**Response:**
```json
{
  "message": "Medicine deleted"
}
```

**Status Codes:**
- `200 OK` - Medicine deleted
- `401 Unauthorized` - Missing token
- `403 Forbidden` - Not an admin
- `404 Not Found` - Medicine doesn't exist

---

### 17. Validate Prescription (Admin Only)
**PUT** `/admin/prescriptions/{id}/validate`

**Headers Required:**
```
Authorization: Bearer {admin_jwt_token}
Content-Type: application/json
```

**Path Parameters:**
- `id` (required): Prescription ID

**Request Body:**
```json
{
  "validated": true
}
```

**Response:**
```json
{
  "id": 1,
  "fileName": "prescription_1234.pdf",
  "uploadedAt": "2026-03-21T12:00:00",
  "validated": true
}
```

**Status Codes:**
- `200 OK` - Prescription validated
- `401 Unauthorized` - Missing token
- `403 Forbidden` - Not an admin
- `404 Not Found` - Prescription doesn't exist

---

## 📥 Importing Postman Collection

1. Open **Postman**
2. Click **Import** button (top-left)
3. Choose **Upload Files**
4. Select `QuickMeds_Postman_Collection.json`
5. Click **Import**

All endpoints will be available in Postman organized by category!

## 🔑 Using JWT Token in Postman

### Automatic Token Management

1. After login, copy the received `token` value
2. In Postman, go to **Variables** tab
3. Set `jwt_token` variable with the token value
4. In request headers, use: `Authorization: Bearer {{jwt_token}}`

### Manual Token Usage

For each authenticated request:
1. Go to **Headers** tab
2. Add header:
   - **Key:** `Authorization`
   - **Value:** `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 📊 Example Workflow

1. **Register** - Create a new account
2. **Login** - Get JWT token
3. **Get Categories** - Browse categories
4. **Get Medicines** - Browse available medicines
5. **Add to Cart** - Add items to shopping cart
6. **Get Cart** - View cart contents
7. **Place Order** - Create an order from cart items
8. **Get Orders** - View order history

## ⚠️ Error Handling

All errors follow this standard format with HTTP status codes:

```json
{
  "timestamp": "2026-03-21T12:00:00",
  "status": 400,
  "error": "Descriptive error message"
}
```

### Common Status Codes
- **200 OK** - Request successful
- **400 Bad Request** - Invalid input/validation error
- **401 Unauthorized** - Missing or invalid JWT token
- **403 Forbidden** - Insufficient permissions (not admin)
- **404 Not Found** - Resource doesn't exist
- **500 Internal Server Error** - Server error

## 🧪 Test Accounts

Pre-seeded accounts for testing:

**Admin Account:**
- Email: `admin@quickmeds.com`
- Password: `admin123`

**User Account:**
- Email: `user@quickmeds.com`
- Password: `user123`

## 🔄 CORS Configuration

The API is configured to accept requests from:
- `http://127.0.0.1:5173`
- `http://localhost:5173`
- `http://localhost:3000`
- `http://127.0.0.1:3000`

## 📝 Database Schema

### Core Entities
- **User** - User accounts with authentication
- **Role** - User roles (USER, ADMIN)
- **Medicine** - Product catalog
- **Category** - Medicine categories
- **Cart** - Shopping cart (1 per user)
- **CartItem** - Items in cart
- **Order** - User orders
- **OrderItem** - Items in order
- **Prescription** - Uploaded prescription files

## 🛠️ Technology Stack

- **Framework:** Spring Boot 3.4.4
- **Language:** Java 21
- **Database:** MySQL 8.0+
- **Authentication:** JWT (JJWT)
- **Build Tool:** Maven
- **Security:** Spring Security 6.x
- **ORM:** Hibernate/JPA
- **Validation:** Jakarta Bean Validation

## 📞 Support

For issues or questions:
1. Check API response error messages
2. Verify JWT token validity
3. Ensure all required headers are present
4. Check database connectivity

---

**Version:** 1.0.0  
**Last Updated:** March 21, 2026
