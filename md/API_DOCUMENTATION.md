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
*   **Content-Type:** `multipart/form-data`
*   **Body:**
    ```
    name: "Staff Name"
    email: "staff@lapzone.com"
    password: "password123"
    image: <File Upload>
    ```
*   **Response:** `_id`, `name`, `email`, `role`, `image`

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
      "name": "Dell Latitude 7400",
      "sku": "DELL-LAT-7400-I7-16-512-2",
      "slug": "dell-latitude-7400-i7-8th-gen-16gb-512gb-2",
      "brand": "Dell",
      "category": "laptop",  // Must be one of: [ laptop, desktop, accessories, electrical gadgets ]
      "specifications": {
        "processor": "Intel Core i7 8th Gen", 
        "ram": "16GB DDR4",
        "storage": "512GB NVMe SSD",
        "display": "14\" FHD",
        "graphics": "Intel UHD 620",
        "os": "Windows 11 Pro"
      },
      "pricing": {
        "originalPrice": 48999,
        "sellingPrice": 38999,
        "discount": 10000
      },
      "condition": "Certified Refurbished",
      "isLapzoneCertified": true,
      "isVerified": true,
      "currStock": true,
      "inventory": {
        "quantity": 10,
        "instock": "true"
      },
      "images": [
        { "url": "https://res.cloudinary.com/lapzone/image/upload/v1/dell_front.jpg", "isPrimary": true },
        { "url": "https://res.cloudinary.com/lapzone/image/upload/v1/dell_side.jpg", "isPrimary": false },
        { "url": "https://res.cloudinary.com/lapzone/image/upload/v1/dell_back.jpg", "isPrimary": false },
        { "url": "https://res.cloudinary.com/lapzone/image/upload/v1/dell_keyboard.jpg", "isPrimary": false }
      ]
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

### 10. 📸 Image Upload & Handling
The API uses **Multer** and **Cloudinary** for secure image management.

*   **Content-Type**: Must be `multipart/form-data`.
*   **Key**: `images` (supports multiple uploads).
*   **Logic**:
    - The first image uploaded is automatically set as `isPrimary: true`.
    - Images are stored as an array of objects: `[{ url: String, isPrimary: Boolean }]`.
    - For `PUT` requests, you can merge new uploads with existing image arrays.

---

## 📈 Stock & Logs

### 11. Quick Stock Update
*   **URL:** `/api/products/:id/stock`
*   **Method:** `PATCH`
*   **Access:** Private (**OWNER + STAFF**)
*   **Body:**
    ```json
    { 
      "quantity": 50
    }
    ```

### 12. View Stock Activity Logs
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
1.  **Booleans**: You can send `"true"` or `"false"` as strings; the server will convert them to Boolean types (applies to `inventory.instock`, `isLapzoneCertified`, `isVerified`, and `currStock`).
2.  **Flexible Typing**: If you don't have all sub-fields for `specifications.ram` (like size, type, etc.), you can just send a single string: `"16GB DDR4"`. The system will save it without error.
3.  **Images**: Use `multipart/form-data` for image uploads. The first image uploaded is automatically marked as `isPrimary: true`.
4.  **Certification & Verification**: 
    - Set `isLapzoneCertified: true` for the "LapZone Certified" badge.
    - Set `isVerified: true` for the "Verified" badge seen in the top-left of the image.
5.  **Status (`currStock`)**: 
    - The `currStock` field indicates if the item is in active stock. It is visible in the `GET /api/products` response for all items. Default is `true`.

