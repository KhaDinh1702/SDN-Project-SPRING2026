# API Request/Response Examples & Reference

## Complete API Documentation for Mobile & Web Development

---

## Authentication

### Login Endpoint
```javascript
POST /api/auth/login

Request:
{
  "email": "admin@example.com",
  "password": "password123"
}

Response (Success 200):
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "id": "user_123",
    "email": "admin@example.com",
    "username": "admin",
    "first_name": "Admin",
    "last_name": "User",
    "role": "admin"
  }
}

Response (Error 401):
{
  "success": false,
  "message": "Invalid credentials"
}
```

**Header Required for All Requests:**
```javascript
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

---

## Categories API

### Get All Categories
```javascript
GET /api/categories

Response (200):
{
  "success": true,
  "data": [
    {
      "_id": "cat_001",
      "name": "Vegetables",
      "description": "Fresh farm vegetables",
      "createdAt": "2024-01-15T10:30:00Z"
    },
    {
      "_id": "cat_002",
      "name": "Fruits",
      "description": "Organic fruits"
    }
  ]
}
```

### Get Single Category
```javascript
GET /api/categories/cat_001

Response (200):
{
  "success": true,
  "data": {
    "_id": "cat_001",
    "name": "Vegetables",
    "description": "Fresh farm vegetables"
  }
}

Response (404):
{
  "success": false,
  "message": "Category not found"
}
```

### Create Category
```javascript
POST /api/categories
Headers: Authorization required

Request:
{
  "name": "New Category",
  "description": "Description here"
}

Response (201):
{
  "success": true,
  "data": {
    "_id": "cat_003",
    "name": "New Category",
    "description": "Description here",
    "createdAt": "2024-02-26T12:00:00Z"
  }
}

Response (400):
{
  "success": false,
  "message": "Category name already exists"
}
```

### Update Category
```javascript
PUT /api/categories/cat_001
Headers: Authorization required

Request:
{
  "name": "Updated Category Name",
  "description": "Updated description"
}

Response (200):
{
  "success": true,
  "data": {
    "_id": "cat_001",
    "name": "Updated Category Name",
    "description": "Updated description",
    "updatedAt": "2024-02-26T12:05:00Z"
  }
}
```

### Delete Category
```javascript
DELETE /api/categories/cat_001
Headers: Authorization required

Response (200):
{
  "success": true,
  "message": "Category deleted successfully"
}

Response (404):
{
  "success": false,
  "message": "Category not found"
}
```

---

## Products API

### Get All Products
```javascript
GET /api/products?categoryId=cat_001&keyword=apple

Response (200):
{
  "success": true,
  "data": [
    {
      "_id": "prod_001",
      "name": "Fresh Apple",
      "description": "Red delicious apples",
      "price": 25000,
      "stock_quantity": 100,
      "category": {
        "_id": "cat_002",
        "name": "Fruits"
      },
      "is_active": true,
      "images": [
        {
          "url": "https://example.com/image.jpg",
          "publicId": "img_001",
          "isPrimary": true
        }
      ],
      "createdAt": "2024-01-10T08:00:00Z"
    }
  ]
}
```

### Get Single Product
```javascript
GET /api/products/prod_001

Response (200):
{
  "success": true,
  "data": {
    "_id": "prod_001",
    "name": "Fresh Apple",
    "description": "Red delicious apples",
    "price": 25000,
    "stock_quantity": 100,
    "category": {
      "_id": "cat_002",
      "name": "Fruits"
    },
    "is_active": true,
    "origin": "Vietnam",
    "weight": 500,
    "unit": "gram",
    "expiry_date": "2024-03-31",
    "images": [...]
  }
}
```

### Create Product
```javascript
POST /api/products
Headers: Authorization required, Content-Type: application/json

Request:
{
  "name": "Fresh Tomato",
  "description": "Organic tomatoes",
  "price": 15000,
  "stock_quantity": 50,
  "category": "cat_001",
  "is_active": true,
  "origin": "Vietnam",
  "weight": 1000,
  "unit": "kg"
}

Response (201):
{
  "success": true,
  "data": {
    "_id": "prod_002",
    "name": "Fresh Tomato",
    "price": 15000,
    "stock_quantity": 50,
    "category": "cat_001"
  }
}
```

### Update Product
```javascript
PUT /api/products/prod_001
Headers: Authorization required

Request:
{
  "name": "Premium Fresh Apple",
  "price": 30000,
  "stock_quantity": 80,
  "is_active": true
}

Response (200):
{
  "success": true,
  "data": {
    "_id": "prod_001",
    "name": "Premium Fresh Apple",
    "price": 30000,
    "stock_quantity": 80
  }
}
```

### Delete Product
```javascript
DELETE /api/products/prod_001
Headers: Authorization required

Response (200):
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

## Users API

### Get All Users
```javascript
GET /api/users
Headers: Authorization required (admin only)

Response (200):
{
  "success": true,
  "data": [
    {
      "id": "user_001",
      "email": "john@example.com",
      "username": "john123",
      "first_name": "John",
      "last_name": "Doe",
      "role": "Admin",
      "is_active": true,
      "created_at": "2024-01-15T10:00:00Z"
    },
    {
      "id": "user_002",
      "email": "manager@example.com",
      "first_name": "Jane",
      "last_name": "Smith",
      "role": "Manager",
      "is_active": true
    }
  ]
}
```

### Get My Profile
```javascript
GET /api/users/me
Headers: Authorization required

Response (200):
{
  "success": true,
  "data": {
    "id": "user_001",
    "email": "john@example.com",
    "username": "john123",
    "first_name": "John",
    "last_name": "Doe",
    "role_id": {
      "_id": "role_001",
      "name": "Admin"
    }
  }
}
```

### Create User (Admin Only)
```javascript
POST /api/users
Headers: Authorization required (admin only)

Request:
{
  "email": "newuser@example.com",
  "password": "SecurePass123!",
  "username": "newuser",
  "first_name": "New",
  "last_name": "User",
  "role": "Staff"
}

Response (201):
{
  "success": true,
  "data": {
    "id": "user_003",
    "email": "newuser@example.com",
    "username": "newuser",
    "role": "Staff"
  }
}

Response (400):
{
  "success": false,
  "message": "Email already exists"
}
```

### Update User Profile
```javascript
PUT /api/users/user_001
Headers: Authorization required

Request:
{
  "username": "john_updated",
  "first_name": "Jonathan",
  "email": "john.new@example.com",
  "password": "NewPassword123!"  // optional
}

Response (200):
{
  "success": true,
  "data": {
    "id": "user_001",
    "email": "john.new@example.com",
    "username": "john_updated",
    "first_name": "Jonathan"
  }
}
```

### Ban User
```javascript
PATCH /api/users/user_002/ban
Headers: Authorization required (admin only)

Response (200):
{
  "success": true,
  "data": {
    "id": "user_002",
    "email": "manager@example.com",
    "is_active": false
  }
}
```

---

## Orders API

### Get All Orders
```javascript
GET /api/orders
Headers: Authorization required

Response (200):
{
  "success": true,
  "data": [
    {
      "_id": "ord_001",
      "user_id": "user_001",
      "total_amount": 150000,
      "order_status": "Delivered",
      "created_at": "2024-02-20T14:30:00Z",
      "items": [
        {
          "product": {
            "_id": "prod_001",
            "name": "Fresh Apple"
          },
          "quantity": 5,
          "unit_price": 25000,
          "total_price": 125000
        }
      ]
    }
  ]
}
```

### Get Single Order
```javascript
GET /api/orders/ord_001
Headers: Authorization required

Response (200):
{
  "success": true,
  "data": {
    "id": "ord_001",
    "user": {
      "id": "user_001",
      "email": "customer@example.com"
    },
    "type": "purchase",
    "totalPrice": 150000,
    "note": "Deliver after 5pm",
    "createdAt": "2024-02-20T14:30:00Z",
    "items": [
      {
        "productId": "prod_001",
        "productName": "Fresh Apple",
        "quantity": 5,
        "unitPrice": 25000,
        "totalPrice": 125000
      }
    ]
  }
}
```

### Create Order
```javascript
POST /api/orders
Headers: Authorization required

Request:
{
  "user_id": "user_001",
  "total_amount": 150000,
  "items": [
    {
      "product_id": "prod_001",
      "quantity": 5,
      "unit_price": 25000
    },
    {
      "product_id": "prod_002",
      "quantity": 2,
      "unit_price": 12500
    }
  ]
}

Response (201):
{
  "success": true,
  "data": {
    "_id": "ord_002",
    "user_id": "user_001",
    "total_amount": 150000,
    "order_status": "Processing",
    "items": [...]
  }
}
```

### Update Order Status
```javascript
PUT /api/orders/ord_001
Headers: Authorization required

Request:
{
  "order_status": "Shipped"
}

Response (200):
{
  "success": true,
  "data": {
    "_id": "ord_001",
    "order_status": "Shipped",
    "updated_at": "2024-02-26T15:00:00Z"
  }
}
```

---

## Stock/Inventory API

### Get Stock History
```javascript
GET /api/stock?page=1&limit=10
Headers: Authorization required

Response (200):
{
  "success": true,
  "data": [
    {
      "id": "stock_001",
      "type": "import",
      "totalPrice": 500000,
      "note": "Bulk purchase",
      "createdAt": "2024-02-15T10:00:00Z",
      "user": {
        "id": "user_001",
        "email": "admin@example.com"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50
  }
}
```

### Create Stock Transaction
```javascript
POST /api/stock
Headers: Authorization required (admin/manager only)

Request:
{
  "type": "import",  // or "export"
  "total_price": 500000,
  "note": "Monthly restocking",
  "items": [
    {
      "product_id": "prod_001",
      "quantity": 100,
      "unit_price": 25000
    },
    {
      "product_id": "prod_002",
      "quantity": 50,
      "unit_price": 15000
    }
  ]
}

Response (201):
{
  "success": true,
  "data": {
    "id": "stock_001",
    "type": "import",
    "totalPrice": 500000,
    "items": [...]
  }
}
```

---

## Error Response Codes

### Common HTTP Status Codes

```javascript
200 OK
    Successful request

201 Created
    Resource created successfully

400 Bad Request
    Invalid request body or parameters
    Example:
    {
      "success": false,
      "message": "Email already exists"
    }

401 Unauthorized
    Token missing or invalid
    Example:
    {
      "success": false,
      "message": "Unauthorized"
    }

403 Forbidden
    User doesn't have permission
    Example:
    {
      "success": false,
      "message": "Admin access required"
    }

404 Not Found
    Resource doesn't exist
    Example:
    {
      "success": false,
      "message": "Product not found"
    }

500 Internal Server Error
    Server error
    Example:
    {
      "success": false,
      "message": "Internal server error"
    }
```

---

## Request Headers Template

Use these headers for all requests:

```javascript
// For authenticated requests
{
  "Authorization": "Bearer YOUR_JWT_TOKEN",
  "Content-Type": "application/json"
}

// For file uploads (if needed)
{
  "Authorization": "Bearer YOUR_JWT_TOKEN",
  "Content-Type": "multipart/form-data"
}

// CORS headers (handled by backend)
{
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH",
  "Access-Control-Allow-Headers": "Content-Type, Authorization"
}
```

---

## JavaScript Fetch Examples

### GET Request
```javascript
const token = localStorage.getItem("token");
const response = await fetch("http://localhost:5001/api/products", {
  method: "GET",
  headers: {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json"
  }
});
const data = await response.json();
```

### POST Request
```javascript
const token = localStorage.getItem("token");
const response = await fetch("http://localhost:5001/api/products", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    name: "New Product",
    price: 25000,
    category: "cat_001"
  })
});
const data = await response.json();
```

### PUT Request
```javascript
const token = localStorage.getItem("token");
const response = await fetch("http://localhost:5001/api/products/prod_001", {
  method: "PUT",
  headers: {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    name: "Updated Product",
    price: 30000
  })
});
const data = await response.json();
```

### DELETE Request
```javascript
const token = localStorage.getItem("token");
const response = await fetch("http://localhost:5001/api/products/prod_001", {
  method: "DELETE",
  headers: {
    "Authorization": `Bearer ${token}`
  }
});
const data = await response.json();
```

---

## Axios Examples (Alternative to Fetch)

### Setup
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to all requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### GET
```javascript
const { data } = await api.get('/api/products');
```

### POST
```javascript
const { data } = await api.post('/api/products', {
  name: 'New Product',
  price: 25000
});
```

### PUT
```javascript
const { data } = await api.put('/api/products/prod_001', {
  name: 'Updated Product',
  price: 30000
});
```

### DELETE
```javascript
const { data } = await api.delete('/api/products/prod_001');
```

---

## Testing Credentials (if applicable)

```javascript
Admin User:
{
  "email": "admin@example.com",
  "password": "admin123"
}

Manager User:
{
  "email": "manager@example.com",
  "password": "manager123"
}

Staff User:
{
  "email": "staff@example.com",
  "password": "staff123"
}
```

---

## Environment Configuration

Create a `.env` file in the frontend root:
```
VITE_BACKEND_URL=http://localhost:5001
VITE_PORT=3000
```

---

**This API documentation is complete and ready for mobile & web integration!**

Use these examples as reference for developing the mobile app or extending the admin panel.

