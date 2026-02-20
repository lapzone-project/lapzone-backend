# 🚀 LapZone Inventory Management API Documentation

Welcome to the LapZone RBAC (Role-Based Access Control) API. This system manages inventory, staff accounts, and stock history.

## 🔑 Authentication
Most routes require a **JWT Token**. Include it in the header as:
`Authorization: Bearer <your_token>`

---

## 🔐 Auth & Staff Management

### 1. User Login
*   **URL:** `/api/auth/login`
*   **Method:** `POST`
*   **Access:** Public
*   **Body:**
    ```json
    {
      "email": "owner@lapzone.com",
      "password": "Strong@2026"
    }
    ```
*   **Response:** `_id`, `name`, `email`, `role`, `token`

### 2. Create Staff Account
*   **URL:** `/api/users/create-staff`
*   **Method:** `POST`
*   **Access:** Private (**OWNER ONLY**)
*   **Body:**
    ```json
    {
      "name": "Staff Name",
      "email": "staff@lapzone.com",
      "password": "password123"
    }
    ```

### 3. Get All Staffs
*   **URL:** `/api/users/staffs`
*   **Method:** `GET`
*   **Access:** Private (**OWNER ONLY**)

### 4. Delete Staff
*   **URL:** `/api/users/:id`
*   **Method:** `DELETE`
*   **Access:** Private (**OWNER ONLY**)

---

## 📦 Product Management (Flexible "Typable" Schema)

The Product API is designed to be highly flexible. Nested fields can accept **either** specialized objects **or** simple descriptive strings.

### 5. Get All Products
*   **URL:** `/api/products`
*   **Method:** `GET`
*   **Access:** Public

### 6. Get Single Product
*   **URL:** `/api/products/:id`
*   **Method:** `GET`
*   **Access:** Public

### 7. Add New Product
*   **URL:** `/api/products`
*   **Method:** `POST`
*   **Access:** Private (**OWNER + STAFF**)
*   **Sample Body (JSON):**
    ```json
    {
      "name": "MacBook Air M2",
      "sku": "MBA-M2-8-256-SLV",
      "slug": "macbook-air-m2-silver-2024",
      "brand": "65ce...brand_id",
      "category": "65ce...category_id",
      "specifications": {
        "processor": "Apple M2 8-Core CPU", 
        "ram": "{ size: '8GB', type: 'Unified', upgradeable: false }",
        "storage": "256GB SSD",
        "display": "13.6-inch Liquid Retina"
      },
      "pricing": {
        "originalPrice": 1099,
        "sellingPrice": 999,
        "discount": 100
      },
      "condition": "New - Factory Sealed",
      "isLapzoneCertified": true,
      "inventory": {
        "quantity": 25,
        "instock": "true"
      }
    }
    ```

### 8. Update Product
*   **URL:** `/api/products/:id`
*   **Method:** `PUT`
*   **Access:** Private (**OWNER + STAFF**)
*   **Body:** Partial updates allowed. Fields follow the same "Typable" logic.

### 9. Delete Product
*   **URL:** `/api/products/:id`
*   **Method:** `DELETE`
*   **Access:** Private (**OWNER ONLY**)

---

## 📈 Stock & Logs

### 10. Quick Stock Update
*   **URL:** `/api/products/:id/stock`
*   **Method:** `PATCH`
*   **Access:** Private (**OWNER + STAFF**)
*   **Body:**
    ```json
    {
      "quantity": 50
    }
    ```

### 11. View Stock Activity Logs
*   **URL:** `/api/stock/logs`
*   **Method:** `GET`
*   **Access:** Private (**OWNER ONLY**)

---

## 🛡️ Role Summary
| Feature | Role: OWNER | Role: STAFF |
| :--- | :---: | :---: |
| View Products | ✅ | ✅ |
| Add/Update Products | ✅ | ✅ |
| Update Stock | ✅ | ✅ |
| Manage Staff Users | ✅ | ❌ |
| Delete Products | ✅ | ❌ |
| View History Logs | ✅ | ❌ |

---

## 💡 Pro Tips for Developers
1.  **Booleans**: You can send `"true"` or `"false"` as strings; the server will convert them to Boolean types.
2.  **Flexible Typing**: If you don't have all sub-fields for `specifications.ram` (like size, type, etc.), you can just send a single string: `"16GB DDR4"`. The system will save it without error.
3.  **Images**: Use `multipart/form-data` for image uploads. The first image uploaded is automatically marked as `isPrimary: true`.
