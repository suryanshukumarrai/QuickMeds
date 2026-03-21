# QuickMeds Backend - Postman Setup Guide

## ✅ Swagger Removed & Postman Ready!

The backend has been completely refactored for Postman testing:

### ✨ What Changed

- ✅ **Removed Swagger/OpenAPI** dependency
- ✅ **Removed OpenAPI configuration** class
- ✅ **Added proper validation** (@Valid annotations)
- ✅ **Standardized responses** with ResponseEntity
- ✅ **Global exception handling** with meaningful errors
- ✅ **CORS properly configured** for localhost:5173
- ✅ **JWT authentication** enabled and tested
- ✅ **All endpoints Postman-compatible**

---

## 📥 Import Postman Collection

### Quick Steps:

1. **Open Postman**
2. Click **Import** (top-left corner)
3. Select **Upload Files**
4. Choose: `QuickMeds_Postman_Collection.json`
5. Click **Import**

All 17 API endpoints are now organized in Postman by category!

---

## 🚀 Quick Start

### 1. Start Backend
```bash
cd /Users/suryanshurai/Desktop/QuickMeds
DB_USERNAME='root' DB_PASSWORD='Ritu222003@' mvn -f backend/pom.xml spring-boot:run
```

The API runs on: **http://localhost:8080**

### 2. Test Login in Postman

In Postman, find the **Authentication → Login** request:

```json
{
  "email": "user@quickmeds.com",
  "password": "user123"
}
```

Send the request and copy the `token` from the response.

### 3. Use Token for Protected Endpoints

For ANY protected endpoint (Cart, Orders, Prescriptions):

1. Click the request
2. Go to **Headers** tab
3. Add:
   - **Key:** `Authorization`
   - **Value:** `Bearer {paste_token_here}`

Example:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiUk9MRV9VU0VSIiwic3ViIjoidXNlckBxdWlja21lZHMuY29tIiwiaWF0IjoxNzc0MDc0MTMyLCJleHAiOjE3NzQxNjA1MzJ9.R2AO34H6n9Pxz0XR__g_KeTLc7XOuRFR35kUjYO8xj8
```

### 4. Use Collections Variables (Optional but Recommended)

For easier token management:

1. In Postman, click **Collections** → **Variables**
2. Create variable: `jwt_token`
3. Set **Initial value** to your token
4. In requests, use: `{{jwt_token}}`

---

## 📚 API Workflow Example

### Test Complete User Journey:

1. **Register New User**
   - POST `/api/auth/register`
   - Save the token

2. **View Products**
   - GET `/api/medicines`
   - GET `/api/categories`

3. **Add to Cart** (requires token)
   - POST `/api/cart/items`
   - Body:
   ```json
   {
     "medicineId": 1,
     "quantity": 2
   }
   ```

4. **View Cart** (requires token)
   - GET `/api/cart`

5. **Place Order** (requires token)
   - POST `/api/orders`
   - Body:
   ```json
   {
     "prescriptionId": null
   }
   ```

6. **View Orders** (requires token)
   - GET `/api/orders`

---

## 🔑 Test Accounts

Two pre-seeded accounts available:

### Admin Account
```
Email: admin@quickmeds.com
Password: admin123
```

- Can create/update/delete medicines
- Can validate prescriptions
- Can view all endpoints

### Regular User Account
```
Email: user@quickmeds.com
Password: user123
```

- Can browse medicines
- Can manage cart
- Can place orders
- Can upload prescriptions

---

## 📋 API Endpoints Summary

### Public Endpoints (No Auth Required)
```
GET  /api/medicines              - List all medicines
GET  /api/medicines/{id}         - Get single medicine
GET  /api/categories             - List categories
POST /api/auth/register          - Register new user
POST /api/auth/login             - Login user
```

### Protected Endpoints (Auth Required)
```
GET  /api/cart                   - Get user's cart
POST /api/cart/items             - Add item to cart
PUT  /api/cart/items/{itemId}    - Update item quantity
DEL  /api/cart/items/{itemId}    - Remove from cart

POST /api/orders                 - Place new order
GET  /api/orders                 - Get user's orders

POST /api/prescriptions/upload   - Upload prescription
GET  /api/prescriptions          - Get user's prescriptions
```

### Admin-Only Endpoints
```
POST /api/admin/medicines        - Create medicine
PUT  /api/admin/medicines/{id}   - Update medicine
DEL  /api/admin/medicines/{id}   - Delete medicine
PUT  /api/admin/prescriptions/{id}/validate - Validate prescription
```

---

## 🧪 Example Requests to Try

### 1. Get All Medicines
```
GET http://localhost:8080/api/medicines
```

### 2. Search Medicines
```
GET http://localhost:8080/api/medicines?search=Paracetamol
```

### 3. Filter by Category
```
GET http://localhost:8080/api/medicines?categoryId=1
```

### 4. Login and Get Token
```
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "email": "user@quickmeds.com",
  "password": "user123"
}
```

### 5. Add to Cart (With Token)
```
POST http://localhost:8080/api/cart/items
Authorization: Bearer <token>
Content-Type: application/json

{
  "medicineId": 1,
  "quantity": 2
}
```

### 6. Place Order
```
POST http://localhost:8080/api/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "prescriptionId": null
}
```

---

## ⚠️ Common Issues & Solutions

### Issue: "No 'Access-Control-Allow-Origin' header"
**Solution:** Ensure frontend URL matches CORS config
- Frontend must be on: `http://127.0.0.1:5173`
- CORS is already configured for this

### Issue: "Unauthorized - Invalid token"
**Solution:** 
1. Get new token via login
2. Ensure header format: `Authorization: Bearer token_here`
3. Check token hasn't expired

### Issue: "404 Not Found"
**Solution:** Verify:
- Correct resource ID exists
- Correct endpoint URL
- No typos in path

### Issue: "400 Bad Request"
**Solution:** Check:
- All required fields present in JSON body
- Correct JSON format
- Content-Type header set to `application/json`

---

## 📊 Response Examples

### Success Response (200 OK)
```json
{
  "id": 1,
  "name": "Paracetamol 500mg",
  "price": 4.99,
  "stock": 50,
  "prescriptionRequired": false
}
```

### Validation Error (400 Bad Request)
```json
{
  "timestamp": "2026-03-21T12:00:00",
  "status": 400,
  "errors": {
    "email": "must be a valid email",
    "password": "size must be between 6 and 20"
  }
}
```

### Authentication Error (401 Unauthorized)
```json
{
  "timestamp": "2026-03-21T12:00:00",
  "status": 401,
  "error": "Invalid credentials"
}
```

---

## 🔄 Complete CORS Configuration

Backend is configured to accept:
- **Origin:** `http://127.0.0.1:5173`, `http://localhost:5173`, `http://localhost:3000`, `http://127.0.0.1:3000`
- **Methods:** GET, POST, PUT, DELETE, OPTIONS
- **Headers:** All headers (*\)
- **Credentials:** true

---

## 🛠️ Troubleshooting Checklist

- [ ] Backend running on port 8080?
- [ ] MySQL running?
- [ ] Database credentials correct?
- [ ] Token included in Authorization header?
- [ ] Token format correct: `Bearer {token}`?
- [ ] Content-Type set to `application/json`?
- [ ] No typos in URLs?
- [ ] Postman collection imported?
- [ ] Using correct test account?

---

## 📖 Full Documentation

For complete API reference, see: **API_DOCUMENTATION.md**

---

## 🎯 Next Steps

1. ✅ Start the backend
2. ✅ Import Postman collection
3. ✅ Test public endpoints (medicines, categories)
4. ✅ Login to get token
5. ✅ Test protected endpoints (cart, orders)
6. ✅ Try admin endpoints

---

**API Status:** ✅ Production Ready for Postman Testing  
**Last Updated:** March 21, 2026
