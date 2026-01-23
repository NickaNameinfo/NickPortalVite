# Inventory Management System - API Documentation

## Table of Contents
1. [Base Configuration](#base-configuration)
2. [Authentication](#authentication)
3. [Inventory Management APIs](#inventory-management-apis)
4. [Client Management APIs](#client-management-apis)
5. [Product Management APIs](#product-management-apis)
6. [Category Management APIs](#category-management-apis)
7. [File Upload APIs](#file-upload-apis)
8. [User Management APIs](#user-management-apis)
9. [Error Handling](#error-handling)

---

## Base Configuration

**Base URL:**
- Production: `https://nicknameinfo.net/api`
- Development: `http://localhost:8000/api` (if applicable)

**Content-Type:**
- JSON: `application/json`
- Form Data: `multipart/form-data` (for file uploads)

---

## Authentication

All API endpoints (except login/register) require authentication via Bearer token.

**Header Format:**
```
Authorization: Bearer <token>
```

**Token Source:**
- Dashboard: Cookies (`XSRF-token` or `token`)
- Frontend: localStorage or Cookies

**Token Retrieval:**
- Token is automatically added via `baseQuery` → `prepareHeaders`
- Token is extracted from cookies or localStorage

**Important:** The backend automatically extracts the **vendor/store ID** from the authenticated user's session. The frontend should **NOT** pass `vendorId` or `storeId` in URLs or request bodies. All inventory operations are automatically scoped to the logged-in user's store/vendor.

### Backend Implementation Notes

**How to Extract Vendor/Store ID:**

1. **From JWT Token (Recommended):**
   - Decode the JWT token from the `Authorization` header
   - Extract `vendorId` or `storeId` from the token payload
   - Example token payload:
     ```json
     {
       "id": 123,
       "email": "vendor@example.com",
       "role": "vendor",
       "vendorId": 456,
       "storeId": 789
     }
     ```

2. **From User Session:**
   - After authentication, retrieve the user record from the database
   - Extract `vendorId` or `storeId` from the user record
   - Store in session/memory for the request lifecycle

3. **Priority:**
   - If user has both `vendorId` and `storeId`, use `vendorId` first (or based on user role)
   - For vendors: use `vendorId`
   - For stores: use `storeId`

**Security Requirements:**
- Always verify that the authenticated user has permission to access the requested vendor/store
- Filter all queries by the authenticated user's vendor/store ID
- Prevent users from accessing or modifying data belonging to other vendors/stores
- Return 403 Forbidden if user tries to access data outside their scope

---

## Inventory Management APIs

### 1. Get Inventory Summary

Get overall inventory statistics for the authenticated user's store/vendor.

**Endpoint:** `GET /inventory/summary`

**Headers:**
```
Authorization: Bearer <token>
```

**Note:** The backend automatically uses the vendor/store ID from the authenticated user's session. No need to pass vendorId in the URL.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalInbound": 150,
    "currentStock": 1200,
    "lowStockAlerts": 5
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Failed to fetch inventory summary"
}
```

---

### 2. Get Inbound Transactions

Get list of inbound (purchase) transactions with optional filters for the authenticated user's store/vendor.

**Endpoint:** `GET /inventory/inbound`

**Headers:**
```
Authorization: Bearer <token>
```

**Note:** The backend automatically uses the vendor/store ID from the authenticated user's session. No need to pass vendorId in the URL.

**Query Parameters:**
- `startDate` (string, optional) - Filter start date (YYYY-MM-DD)
- `endDate` (string, optional) - Filter end date (YYYY-MM-DD)
- `productId` (number, optional) - Filter by product ID
- `clientId` (number, optional) - Filter by client ID

**Example Request:**
```
GET /inventory/inbound?startDate=2024-01-01&endDate=2024-12-31&clientId=456
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "vendorId": 123,
      "clientId": 456,
      "productId": 789,
      "categoryId": 10,
      "quantity": 50,
      "invoiceNumber": "INV-2024-001",
      "invoice": "uploads/invoices/inv-2024-001.pdf",
      "date": "2024-01-15",
      "referenceNumber": "REF-001",
      "notes": "Initial stock",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z",
      "client": {
        "id": 456,
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com",
        "phone": "9876543210"
      },
      "product": {
        "id": 789,
        "name": "Product Name",
        "photo": "uploads/products/product.jpg"
      },
      "category": {
        "id": 10,
        "name": "Category Name"
      }
    }
  ]
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Failed to fetch inbound transactions"
}
```

---

### 3. Add Inbound Transaction

Create a new inbound (purchase) transaction.

**Endpoint:** `POST /inventory/inbound`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "clientId": 456,
  "productId": 789,
  "categoryId": 10,
  "quantity": 50,
  "invoiceNumber": "INV-2024-001",
  "invoice": "uploads/invoices/inv-2024-001.pdf",
  "date": "2024-01-15",
  "referenceNumber": "REF-001",
  "notes": "Initial stock purchase"
}
```

**Field Validations:**
- `vendorId` (number, **NOT REQUIRED**) - Vendor ID is automatically extracted from authenticated user's session
- `clientId` (number, optional) - Client ID
- `productId` (number, required) - Product ID
- `categoryId` (number, optional) - Category ID (deprecated, can be removed)
- `quantity` (number, required, min: 1, max: 999999) - Quantity purchased
- `invoiceNumber` (string, required, min: 3, max: 50) - Invoice number (alphanumeric, hyphens, underscores, slashes)
- `invoice` (string, required) - Invoice file URL (uploaded via file upload API first)
- `date` (string, required, format: YYYY-MM-DD) - Transaction date (cannot be future date, cannot be before 2000)
- `referenceNumber` (string, optional, max: 100) - Reference number
- `notes` (string, optional, max: 500) - Additional notes

**Response:**
```json
{
  "success": true,
  "message": "Inbound transaction added successfully",
  "data": {
    "id": 1,
    "vendorId": 123,
    "clientId": 456,
    "productId": 789,
    "quantity": 50,
    "invoiceNumber": "INV-2024-001",
    "invoice": "uploads/invoices/inv-2024-001.pdf",
    "date": "2024-01-15",
    "referenceNumber": "REF-001",
    "notes": "Initial stock purchase",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

**Note:** The `vendorId` in the response is automatically set by the backend from the authenticated user's session.

**Error Response:**
```json
{
  "success": false,
  "message": "Failed to add inbound transaction",
  "errors": {
    "productId": "Product ID is required",
    "quantity": "Quantity must be at least 1",
    "invoiceNumber": "Invoice number is required"
  }
}
```

---

### 4. Update Inbound Transaction

Update an existing inbound transaction.

**Endpoint:** `POST /inventory/inbound/update`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "id": 1,
  "clientId": 456,
  "productId": 789,
  "quantity": 75,
  "invoiceNumber": "INV-2024-001-UPDATED",
  "invoice": "uploads/invoices/inv-2024-001-updated.pdf",
  "date": "2024-01-15",
  "referenceNumber": "REF-001-UPDATED",
  "notes": "Updated stock purchase"
}
```

**Note:** `vendorId` is automatically extracted from the authenticated user's session. The backend will verify that the transaction belongs to the authenticated user's store/vendor.

**Response:**
```json
{
  "success": true,
  "message": "Inbound transaction updated successfully",
  "data": {
    "id": 1,
    "vendorId": 123,
    "clientId": 456,
    "productId": 789,
    "quantity": 75,
    "invoiceNumber": "INV-2024-001-UPDATED",
    "invoice": "uploads/invoices/inv-2024-001-updated.pdf",
    "date": "2024-01-15",
    "updatedAt": "2024-01-16T10:30:00Z"
  }
}
```

---

### 5. Delete Inbound Transaction

Delete an inbound transaction.

**Endpoint:** `DELETE /inventory/inbound/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Path Parameters:**
- `id` (number, required) - Transaction ID

**Response:**
```json
{
  "success": true,
  "message": "Transaction deleted successfully"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Failed to delete transaction"
}
```

---

### 6. Get Outbound Transactions

Get list of outbound (sales) transactions with optional filters for the authenticated user's store/vendor.

**Endpoint:** `GET /inventory/outbound`

**Headers:**
```
Authorization: Bearer <token>
```

**Note:** The backend automatically uses the vendor/store ID from the authenticated user's session. No need to pass vendorId in the URL.

**Query Parameters:**
- `startDate` (string, optional) - Filter start date (YYYY-MM-DD)
- `endDate` (string, optional) - Filter end date (YYYY-MM-DD)
- `productId` (number, optional) - Filter by product ID
- `orderId` (number, optional) - Filter by order ID

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "vendorId": 123,
      "productId": 789,
      "quantity": 10,
      "orderId": 1001,
      "date": "2024-01-20",
      "notes": "Order fulfillment",
      "createdAt": "2024-01-20T14:30:00Z"
    }
  ]
}
```

---

### 7. Add Outbound Transaction

Create a new outbound (sales) transaction.

**Endpoint:** `POST /inventory/outbound`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "productId": 789,
  "quantity": 10,
  "orderId": 1001,
  "date": "2024-01-20",
  "notes": "Order fulfillment"
}
```

**Note:** `vendorId` is automatically extracted from the authenticated user's session.

**Response:**
```json
{
  "success": true,
  "message": "Outbound transaction added successfully",
  "data": {
    "id": 1,
    "vendorId": 123,
    "productId": 789,
    "quantity": 10,
    "orderId": 1001,
    "date": "2024-01-20",
    "createdAt": "2024-01-20T14:30:00Z"
  }
}
```

---

### 8. Update Outbound Transaction

Update an existing outbound transaction.

**Endpoint:** `POST /inventory/outbound/update`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "id": 1,
  "productId": 789,
  "quantity": 15,
  "orderId": 1001,
  "date": "2024-01-20",
  "notes": "Updated order fulfillment"
}
```

**Note:** `vendorId` is automatically extracted from the authenticated user's session. The backend will verify that the transaction belongs to the authenticated user's store/vendor.

**Response:**
```json
{
  "success": true,
  "message": "Outbound transaction updated successfully",
  "data": {
    "id": 1,
    "quantity": 15,
    "updatedAt": "2024-01-21T10:30:00Z"
  }
}
```

---

### 9. Delete Outbound Transaction

Delete an outbound transaction.

**Endpoint:** `DELETE /inventory/outbound/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Path Parameters:**
- `id` (number, required) - Transaction ID

**Response:**
```json
{
  "success": true,
  "message": "Outbound transaction deleted successfully"
}
```

---

### 10. Get Vendor Inventory Statistics

Get detailed inventory statistics for the authenticated user's store/vendor.

**Endpoint:** `GET /inventory/vendor-stats`

**Headers:**
```
Authorization: Bearer <token>
```

**Note:** The backend automatically uses the vendor/store ID from the authenticated user's session. No need to pass vendorId in the URL.

**Response:**
```json
{
  "success": true,
  "data": {
    "vendorId": 123,
    "totalProducts": 50,
    "totalInbound": 150,
    "totalOutbound": 30,
    "currentStock": 1200,
    "lowStockProducts": [
      {
        "productId": 789,
        "productName": "Product Name",
        "currentStock": 5,
        "minThreshold": 10
      }
    ]
  }
}
```

---

## Client Management APIs

### 1. Get All Clients

Get list of all clients/users.

**Endpoint:** `GET /auth/user/getAllUserList`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 456,
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "9876543210",
      "address": "123 Main St",
      "city": "Mumbai",
      "gstNumber": "22AAAAA0000A1Z5",
      "logo": "uploads/clients/logo-456.jpg",
      "branches": "[{\"name\":\"Branch 1\",\"address\":\"Address 1\",\"phone\":\"9876543211\",\"city\":\"Mumbai\"}]",
      "createdAt": "2024-01-01T10:00:00Z",
      "updatedAt": "2024-01-15T10:00:00Z"
    }
  ]
}
```

**Note:** `branches` is stored as a JSON string and needs to be parsed on the frontend.

---

### 2. Get Client by ID

Get a specific client/user by ID.

**Endpoint:** `GET /auth/user/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Path Parameters:**
- `id` (number, required) - Client/User ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 456,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "address": "123 Main St",
    "city": "Mumbai",
    "gstNumber": "22AAAAA0000A1Z5",
    "logo": "uploads/clients/logo-456.jpg",
    "branches": "[{\"name\":\"Branch 1\",\"address\":\"Address 1\",\"phone\":\"9876543211\",\"city\":\"Mumbai\"}]"
  }
}
```

---

### 3. Create/Update Client

Create a new client or update an existing client.

**Endpoint:** `POST /auth/user/update`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "id": 456,
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "address": "123 Main St",
  "city": "Mumbai",
  "gstNumber": "22AAAAA0000A1Z5",
  "logo": "uploads/clients/logo-456.jpg",
  "branches": "[{\"name\":\"Branch 1\",\"address\":\"Address 1\",\"phone\":\"9876543211\",\"city\":\"Mumbai\"}]"
}
```

**Field Validations:**
- `firstName` (string, required, min: 2, max: 50) - First name (letters and spaces only)
- `lastName` (string, optional, max: 50) - Last name (letters and spaces only)
- `email` (string, required) - Valid email address
- `phone` (string, required) - 10-digit phone number starting with 6-9
- `address` (string, optional, max: 200) - Address
- `city` (string, optional, max: 50) - City name (letters and spaces only)
- `gstNumber` (string, optional, max: 15) - GST number format: `22AAAAA0000A1Z5`
- `logo` (string, optional) - Logo file URL (uploaded via file upload API first)
- `vendorId` (number, **NOT REQUIRED**) - Vendor ID is automatically extracted from authenticated user's session
- `branches` (string, required) - JSON stringified array of branch objects

**Branch Object Structure:**
```json
{
  "name": "Branch Name",
  "address": "Branch Address",
  "phone": "9876543211",
  "city": "Branch City"
}
```

**Response (Create):**
```json
{
  "success": true,
  "message": "Client created successfully",
  "data": {
    "id": 456,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "createdAt": "2024-01-15T10:00:00Z"
  }
}
```

**Response (Update):**
```json
{
  "success": true,
  "message": "Client updated successfully",
  "data": {
    "id": 456,
    "firstName": "John",
    "lastName": "Doe",
    "updatedAt": "2024-01-16T10:00:00Z"
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Failed to create/update client",
  "errors": {
    "firstName": "First name is required",
    "email": "Invalid email address",
    "phone": "Invalid phone number format"
  }
}
```

---

## Product Management APIs

### 1. Get All Products

Get list of all products.

**Endpoint:** `GET /product/getAllproductList`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 789,
      "name": "Product Name",
      "sortDesc": "Product description",
      "total": 999.99,
      "unitSize": 100,
      "categoryId": 10,
      "photo": "uploads/products/product-789.jpg",
      "clientId": 456,
      "createdType": "Client",
      "createdAt": "2024-01-10T10:00:00Z"
    }
  ]
}
```

---

### 2. Get Product by ID

Get a specific product by ID.

**Endpoint:** `GET /product/getProductById/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Path Parameters:**
- `id` (number, required) - Product ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 789,
    "name": "Product Name",
    "sortDesc": "Product description",
    "total": 999.99,
    "unitSize": 100,
    "categoryId": 10,
    "photo": "uploads/products/product-789.jpg",
    "clientId": 456,
    "createdType": "Client",
    "category": {
      "id": 10,
      "name": "Category Name"
    }
  }
}
```

---

### 3. Add Product

Create a new product.

**Endpoint:** `POST /product/add`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Product Name",
  "sortDesc": "Product description",
  "total": 999.99,
  "unitSize": 100,
  "categoryId": 10,
  "photo": "uploads/products/product-789.jpg",
  "subCategoryId": 3,
  "childCategoryId": 3,
  "slug": "1234567890",
  "createdType": "Client",
  "isEnableEcommerce": "0",
  "isEnableCustomize": "0",
  "paymentMode": "",
  "serviceType": "Product"
}
```

**Field Validations:**
- `name` (string, required, min: 2, max: 100) - Product name
- `categoryId` (number, required) - Category ID (must be valid category)
- `total` (number, required, min: 0, max: 99999999) - Price
- `unitSize` (number, required, min: 1, max: 999999) - Stock quantity (must be whole number)
- `sortDesc` (string, optional, max: 500) - Product description
- `photo` (string, optional) - Product photo URL (uploaded via file upload API first)
- `createdId` (number, **NOT REQUIRED**) - Vendor/Client ID is automatically extracted from authenticated user's session
- `createdType` (string, required) - "Client" or "Vendor"

**Response:**
```json
{
  "success": true,
  "message": "Product added successfully",
  "data": {
    "id": 789,
    "name": "Product Name",
    "total": 999.99,
    "unitSize": 100,
    "createdAt": "2024-01-15T10:00:00Z"
  }
}
```

---

### 4. Update Product

Update an existing product.

**Endpoint:** `POST /product/update`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "id": 789,
  "name": "Updated Product Name",
  "sortDesc": "Updated description",
  "total": 1299.99,
  "unitSize": 150,
  "categoryId": 10,
  "photo": "uploads/products/product-789-updated.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": {
    "id": 789,
    "name": "Updated Product Name",
    "updatedAt": "2024-01-16T10:00:00Z"
  }
}
```

---

## Category Management APIs

### 1. Get All Categories

Get list of all categories.

**Endpoint:** `GET /category/getAllCategory`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 10,
      "name": "Category Name",
      "description": "Category description",
      "createdAt": "2024-01-01T10:00:00Z"
    }
  ]
}
```

---

### 2. Create Category

Create a new category.

**Endpoint:** `POST /category/create`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Category Name",
  "description": "Category description"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Category created successfully",
  "data": {
    "id": 10,
    "name": "Category Name",
    "createdAt": "2024-01-15T10:00:00Z"
  }
}
```

---

## File Upload APIs

### 1. Upload File

Upload a file (image, PDF, etc.) to the server.

**Endpoint:** `POST /auth/upload-file`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
- `file` (File, required) - The file to upload
- `storeName` (string, **REQUIRED**) - Store name for directory structure (extracted from authenticated user's session on backend, but frontend should pass it)
- `invoiceNumber` (string, optional) - For invoice uploads
- `productName` (string, optional) - For product photo uploads
- `clientName` (string, optional) - For client logo uploads (deprecated, use storeName instead)

**File Validations:**
- **Invoice Files:**
  - Allowed types: `image/jpeg`, `image/jpg`, `image/png`, `image/gif`, `image/webp`, `application/pdf`
  - Max size: 5MB
- **Product Photos:**
  - Allowed types: `image/jpeg`, `image/jpg`, `image/png`, `image/gif`, `image/webp`
  - Max size: 2MB
- **Client Logos:**
  - Allowed types: `image/jpeg`, `image/jpg`, `image/png`, `image/gif`, `image/webp`
  - Max size: 2MB

**Response:**
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "fileUrl": "uploads/invoices/inv-2024-001.pdf",
  "data": {
    "filename": "inv-2024-001.pdf",
    "path": "uploads/invoices/inv-2024-001.pdf",
    "size": 245760,
    "mimetype": "application/pdf"
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "File upload failed",
  "error": "File size exceeds maximum allowed size"
}
```

---

## User Management APIs

### 1. Get User by ID

Get user details by ID.

**Endpoint:** `GET /auth/user/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Path Parameters:**
- `id` (number, required) - User ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 123,
    "firstName": "Vendor",
    "lastName": "Name",
    "email": "vendor@example.com",
    "phone": "9876543210",
    "role": "vendor",
    "createdAt": "2024-01-01T10:00:00Z"
  }
}
```

---

### 2. Update User

Update user information.

**Endpoint:** `POST /auth/user/update`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "id": 123,
  "firstName": "Updated",
  "lastName": "Name",
  "email": "updated@example.com",
  "phone": "9876543210"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": 123,
    "firstName": "Updated",
    "updatedAt": "2024-01-16T10:00:00Z"
  }
}
```

---

## Error Handling

### Standard Error Response Format

All API endpoints return errors in the following format:

```json
{
  "success": false,
  "message": "Error message describing what went wrong",
  "errors": {
    "fieldName": "Field-specific error message"
  }
}
```

### HTTP Status Codes

- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Authentication required or invalid token
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `422 Unprocessable Entity` - Validation errors
- `500 Internal Server Error` - Server error

### Common Error Messages

| Error Code | Message | Description |
|------------|---------|-------------|
| `AUTH_REQUIRED` | "Authentication required" | Missing or invalid token |
| `VALIDATION_ERROR` | "Validation failed" | Request data validation failed |
| `NOT_FOUND` | "Resource not found" | Requested resource doesn't exist |
| `DUPLICATE_ENTRY` | "Duplicate entry" | Resource already exists |
| `FILE_TOO_LARGE` | "File size exceeds maximum" | Uploaded file is too large |
| `INVALID_FILE_TYPE` | "Invalid file type" | File type not allowed |

---

## Rate Limiting

**Note:** Rate limiting should be implemented on the backend to prevent abuse.

**Recommended Limits:**
- General API calls: 100 requests per minute per user
- File uploads: 10 requests per minute per user
- Authentication endpoints: 5 requests per minute per IP

---

## Testing

### Example cURL Commands

**Get Inventory Summary:**
```bash
curl -X GET "https://nicknameinfo.net/api/inventory/summary" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Add Inbound Transaction:**
```bash
curl -X POST "https://nicknameinfo.net/api/inventory/inbound" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": 789,
    "quantity": 50,
    "invoiceNumber": "INV-2024-001",
    "invoice": "uploads/invoices/inv-2024-001.pdf",
    "date": "2024-01-15"
  }'
```

**Upload File:**
```bash
curl -X POST "https://nicknameinfo.net/api/auth/upload-file" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@/path/to/invoice.pdf" \
  -F "storeName=STORE_NAME" \
  -F "invoiceNumber=INV-2024-001"
```

**Note:** The `storeName` field is required by the backend to create the proper directory structure for file uploads. The frontend extracts it from the current user's data or uses a fallback value.

---

## Notes

1. **Date Format:** All dates should be in ISO 8601 format (YYYY-MM-DD) or ISO 8601 with time (YYYY-MM-DDTHH:mm:ssZ)

2. **File Uploads:** Files must be uploaded first using the file upload API, then the returned URL should be used in subsequent API calls.

3. **Branches Field:** The `branches` field in client data is stored as a JSON string and must be stringified before sending and parsed after receiving.

4. **Vendor/Store ID:** 
   - **IMPORTANT:** The backend automatically extracts the vendor/store ID from the authenticated user's session/token
   - The frontend should **NOT** pass `vendorId` or `storeId` in URLs or request bodies
   - All inventory operations are automatically scoped to the logged-in user's store/vendor
   - The backend should verify that users can only access/modify data belonging to their own store/vendor

5. **Pagination:** Currently, pagination is not implemented. If needed, add `page` and `limit` query parameters.

6. **Filtering:** Date range filters use inclusive dates (startDate <= date <= endDate).

7. **Security:** The backend must ensure that:
   - Users can only access inventory data for their own store/vendor
   - Users cannot modify transactions belonging to other stores/vendors
   - All operations are automatically filtered by the authenticated user's store/vendor ID

---

## Version History

- **v1.2.0** (2024-01-16) - Complete backend implementation guide
  - Created comprehensive backend implementation guide (`INVENTORY_API_IMPLEMENTATION_GUIDE.md`)
  - Added complete controller implementation examples
  - Added database model specifications
  - Added security considerations and testing checklist
  - Updated all frontend services to remove vendorId from URLs

- **v1.1.0** (2024-01-16) - Updated for session-based vendor/store ID
  - Removed `vendorId` from URL paths and request bodies
  - All endpoints now automatically use authenticated user's vendor/store ID
  - Added backend implementation notes for extracting vendor/store ID from session
  - Enhanced security requirements documentation

- **v1.0.0** (2024-01-15) - Initial API documentation
  - Inventory management endpoints
  - Client management endpoints
  - Product management endpoints
  - File upload endpoints

---

## Related Documentation

For complete backend implementation details, see:
- **`INVENTORY_API_IMPLEMENTATION_GUIDE.md`** - Complete backend controller implementation guide with code examples

---

## Support

For API support or questions, please contact the development team or refer to the main project documentation.

