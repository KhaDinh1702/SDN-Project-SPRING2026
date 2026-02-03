# FreshMart Backend API Documentation

> **Backend URL**: `http://localhost:5001`  
> **Last Updated**: 2026-02-03

---

##  Authentication APIs

### Register
```
POST /api/auth/register
Content-Type: application/json

Body:
{
  "first_name": "Nguyen",
  "last_name": "Van A",
  "email": "user@example.com",
  "password": "password123",
  "username": "nguyenvana",
  "phone": "0123456789"
}
```

### Login
```
POST /api/auth/login
Content-Type: application/json

Body:
{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "id": "...", "email": "..." }
}
```

### Google OAuth
```
POST /api/auth/google
Content-Type: application/json

Body:
{
  "credential": "google_oauth_token"
}
```

### Forgot Password
```
POST /api/auth/forgot-password
Content-Type: application/json

Body:
{
  "email": "user@example.com"
}
```

---

## 🛍️ Product APIs

### Get All Products
```
GET /api/products

Response:
{
  "success": true,
  "products": [
    {
      "_id": "...",
      "name": "Apple",
      "price": 25000,
      "description": "Fresh red apple",
      "stock_quantity": 100,
      "category_id": "...",
      "is_active": true
    }
  ]
}
```

### Get Product by ID
```
GET /api/products/:id
```

---

## 📂 Category APIs

### Get All Categories
```
GET /api/categories

Response:
{
  "success": true,
  "categories": [
    {
      "_id": "...",
      "name": "Fruits",
      "description": "Fresh fruits"
    }
  ]
}
```

---

## 📦 Order APIs

### Create Order
```
POST /api/orders
Content-Type: application/json

Body:
{
  "user_id": "user_id_here",
  "total_amount": 250000,
  "items": [
    {
      "product_id": "product_id_here",
      "quantity": 2,
      "price": 125000
    }
  ]
}
```

### Get All Orders
```
GET /api/orders
```

### Get Orders by User ID
```
GET /api/orders/user/:userId
```

### Update Order Status
```
PATCH /api/orders/:orderId/status
Content-Type: application/json

Body:
{
  "order_status": "Processing"
}
```

---

## 💳 Payment APIs (VNPay)

### 1. Create Payment URL
```
POST /api/payment/vnpay/create
Content-Type: application/json

Body:
{
  "orderId": "697efb58ef8e54f34ea4d0f1",
  "amount": 500000,
  "orderInfo": "Thanh toan don hang #123",
  "bankCode": "NCB"  // Optional
}

Response:
{
  "success": true,
  "message": "Payment URL created successfully",
  "paymentUrl": "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=...",
  "transactionCode": "697efb58ef8e54f34ea4d0f1_1770090670361"
}
```

**Flow:**
1. Frontend call API này để lấy `paymentUrl`
2. Redirect user đến `paymentUrl` 
3. User thanh toán trên VNPay
4. VNPay redirect về callback

---

### 2. Payment Callback (VNPay tự động gọi)
```
GET /api/payment/vnpay/callback?vnp_ResponseCode=00&vnp_TxnRef=...
```

**Backend sẽ redirect về Frontend:**
- **Success**: `http://localhost:3000/payment/success?orderId=...&transactionCode=...`
- **Failure**: `http://localhost:3000/payment/failure?orderId=...&message=...`

**Frontend cần tạo 2 routes:**
- `/payment/success` - Hiển thị thanh toán thành công
- `/payment/failure` - Hiển thị thanh toán thất bại

---

### 3. Check Payment Status
```
GET /api/payment/:orderId/status

Response:
{
  "success": true,
  "payment": {
    "transactionCode": "697efb58ef8e54f34ea4d0f1_1770090670361",
    "method": "VNPay",
    "amount": 500000,
    "status": "Success",  // Pending | Success | Failed
    "createdAt": "2026-02-03T10:51:10.000Z",
    "order": {
      "_id": "697efb58ef8e54f34ea4d0f1",
      "payment_status": "Paid",  // Unpaid | Paid
      "order_status": "Processing"
    }
  }
}
```

---

### 4. IPN Endpoint (VNPay server gọi - không cần frontend handle)
```
POST /api/payment/vnpay/ipn
```

---

## 🔄 Payment Flow

```
1. Frontend → POST /api/payment/vnpay/create
              ↓
2. Backend → Trả về paymentUrl
              ↓
3. Frontend → Redirect user to paymentUrl
              ↓
4. User → Thanh toán trên VNPay
              ↓
5. VNPay → GET /api/payment/vnpay/callback
              ↓
6. Backend → Update database
              ↓
7. Backend → Redirect về /payment/success hoặc /payment/failure
              ↓
8. Frontend → GET /api/payment/:orderId/status để verify
```

---

## 📦 Stock APIs

### Get Stock History
```
GET /api/stock/history
```

---

## 🧪 VNPay Test Card (Sandbox)

- **Ngân hàng**: NCB
- **Số thẻ**: `9704198526191432198`
- **Tên chủ thẻ**: `NGUYEN VAN A`
- **Ngày phát hành**: `07/15`
- **Mã OTP**: `123456`

---

## 📌 Payment Status Values

### Order Status
- `Pending` - Đơn hàng mới tạo
- `Processing` - Đang xử lý (sau khi thanh toán thành công)
- `Completed` - Hoàn thành
- `Cancelled` - Đã hủy

### Payment Status
- `Unpaid` - Chưa thanh toán
- `Paid` - Đã thanh toán

### Transaction Status
- `Pending` - Đang chờ thanh toán
- `Success` - Thanh toán thành công
- `Failed` - Thanh toán thất bại

---

## ⚙️ CORS Configuration

Backend đã enable CORS cho tất cả origins trong development.

---

## � Notes

- Base URL: `http://localhost:5001`
- Tất cả endpoints trả về JSON
- Payment callback cần frontend có routes `/payment/success` và `/payment/failure`
- VNPay đang dùng **sandbox environment** (test mode)
