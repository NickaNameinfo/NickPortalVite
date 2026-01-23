# Sub-User Management API Documentation

## Overview
This document describes the API endpoints required for the multi-user access control system. The system allows Vendors and Stores to create sub-users with controlled menu access, with admin approval required before sub-users can access the system.

## Base URL
```
https://nicknameinfo.net/api
```

## Authentication
All endpoints require authentication via Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

The token is obtained from the login endpoint and stored in cookies (`XSRF-token` or `token`).

---

## 1. Sub-User Management Endpoints

### 1.1 Get All Sub-Users
Get all sub-users for the current vendor/store.

**Endpoint:** `GET /auth/sub-users/list`

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
      "id": 1,
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "phone": "+1234567890",
      "status": "approved", // "pending", "approved", "rejected"
      "vendorId": 5, // null if store user
      "storeId": null, // null if vendor user
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "count": 1
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Unauthorized access"
}
```

---

### 1.2 Create Sub-User
Create a new sub-user for the current vendor/store.

**Endpoint:** `POST /auth/sub-users/create`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "password": "securePassword123",
  "vendorId": 5, // Optional: auto-set from token if vendor
  "storeId": null // Optional: auto-set from token if store
}
```

**Response:**
```json
{
  "success": true,
  "message": "Sub-user created successfully. Waiting for admin approval.",
  "data": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "status": "pending",
    "vendorId": 5,
    "storeId": null,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

**Error Responses:**
```json
// Email already exists
{
  "success": false,
  "message": "Email already registered"
}

// Validation error
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": "Invalid email format",
    "password": "Password must be at least 6 characters"
  }
}
```

**Validation Rules:**
- `firstName`: Required, string, min 2 characters
- `lastName`: Required, string, min 2 characters
- `email`: Required, valid email format, unique
- `phone`: Required, string
- `password`: Required, string, min 6 characters

---

### 1.3 Update Sub-User
Update an existing sub-user.

**Endpoint:** `POST /auth/sub-users/update/:id`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**URL Parameters:**
- `id` (integer): Sub-user ID

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe Updated",
  "phone": "+1234567890",
  "password": "newPassword123" // Optional: only if updating password
}
```

**Response:**
```json
{
  "success": true,
  "message": "Sub-user updated successfully",
  "data": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe Updated",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "status": "approved",
    "updatedAt": "2024-01-15T11:00:00Z"
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Sub-user not found or access denied"
}
```

**Note:** 
- Only the vendor/store owner can update their sub-users
- Email cannot be changed after creation
- Status cannot be changed via this endpoint (use approve/reject)

---

### 1.4 Delete Sub-User
Delete a sub-user.

**Endpoint:** `POST /auth/sub-users/delete/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `id` (integer): Sub-user ID

**Response:**
```json
{
  "success": true,
  "message": "Sub-user deleted successfully"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Sub-user not found or access denied"
}
```

**Note:** Only the vendor/store owner can delete their sub-users.

---

### 1.5 Get Sub-User by ID
Get details of a specific sub-user.

**Endpoint:** `GET /auth/sub-users/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `id` (integer): Sub-user ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "status": "approved",
    "vendorId": 5,
    "storeId": null,
    "menuPermissions": {
      "Vendors": true,
      "Stores": false,
      "Categories": true,
      "Products": true,
      "Customer": false,
      "Subscriptions": true,
      "Orders": true,
      "Inventory": true,
      "Billing": false
    },
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

---

## 2. Sub-User Menu Permissions Endpoints

### 2.1 Get Sub-User Menu Permissions
Get menu permissions for a specific sub-user.

**Endpoint:** `GET /auth/sub-users/:subUserId/menu-permissions`

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `subUserId` (integer): Sub-user ID

**Response:**
```json
{
  "success": true,
  "data": {
    "Vendors": true,
    "Vendor": true,
    "Stores": false,
    "Categories": true,
    "Products": true,
    "Customer": false,
    "Subscriptions": true,
    "Orders": true,
    "Inventory": true,
    "Billing": false
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Sub-user not found or access denied"
}
```

---

### 2.2 Update Sub-User Menu Permission
Update a single menu permission for a sub-user.

**Endpoint:** `POST /auth/sub-users/:subUserId/menu-permissions`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**URL Parameters:**
- `subUserId` (integer): Sub-user ID

**Request Body:**
```json
{
  "menuKey": "Products",
  "enabled": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Permission updated successfully",
  "data": {
    "menuKey": "Products",
    "enabled": true
  }
}
```

**Valid Menu Keys:**
- `Vendors`
- `Vendor`
- `Stores`
- `Categories`
- `Products`
- `Customer`
- `Subscriptions`
- `Orders`
- `Inventory`
- `Billing`

**Error Response:**
```json
{
  "success": false,
  "message": "Invalid menu key or sub-user not found"
}
```

---

### 2.3 Bulk Update Sub-User Menu Permissions
Update multiple menu permissions at once.

**Endpoint:** `POST /auth/sub-users/:subUserId/menu-permissions/bulk`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**URL Parameters:**
- `subUserId` (integer): Sub-user ID

**Request Body:**
```json
{
  "permissions": {
    "Vendors": true,
    "Stores": false,
    "Categories": true,
    "Products": true,
    "Customer": false,
    "Subscriptions": true,
    "Orders": true,
    "Inventory": true,
    "Billing": false
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Permissions updated successfully",
  "data": {
    "Vendors": true,
    "Stores": false,
    "Categories": true,
    "Products": true,
    "Customer": false,
    "Subscriptions": true,
    "Orders": true,
    "Inventory": true,
    "Billing": false
  }
}
```

---

## 3. Admin Approval Endpoints

### 3.1 Get Pending Sub-Users
Get all sub-users pending admin approval.

**Endpoint:** `GET /auth/sub-users/pending`

**Headers:**
```
Authorization: Bearer <token>
```

**Access:** Admin only (role "0")

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "phone": "+1234567890",
      "status": "pending",
      "vendorId": 5,
      "storeId": null,
      "vendorName": "ABC Vendor", // Optional: populated if vendorId exists
      "storeName": null, // Optional: populated if storeId exists
      "createdAt": "2024-01-15T10:30:00Z",
      "createdBy": {
        "id": 10,
        "name": "Vendor Owner Name",
        "email": "owner@vendor.com"
      }
    }
  ],
  "count": 1
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Unauthorized: Admin access required"
}
```

---

### 3.2 Approve Sub-User
Approve a pending sub-user.

**Endpoint:** `POST /auth/sub-users/approve/:id`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**URL Parameters:**
- `id` (integer): Sub-user ID

**Request Body (Optional):**
```json
{
  "notes": "Approved after verification" // Optional admin notes
}
```

**Response:**
```json
{
  "success": true,
  "message": "Sub-user approved successfully",
  "data": {
    "id": 1,
    "status": "approved",
    "approvedAt": "2024-01-15T12:00:00Z",
    "approvedBy": {
      "id": 1,
      "name": "Admin User",
      "email": "admin@example.com"
    }
  }
}
```

**Error Responses:**
```json
// Not found
{
  "success": false,
  "message": "Sub-user not found"
}

// Already approved
{
  "success": false,
  "message": "Sub-user is already approved"
}

// Unauthorized
{
  "success": false,
  "message": "Unauthorized: Admin access required"
}
```

**Side Effects:**
- Status changes to "approved"
- Sub-user can now login
- Notification email sent to sub-user (optional)

---

### 3.3 Reject Sub-User
Reject a pending sub-user.

**Endpoint:** `POST /auth/sub-users/reject/:id`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**URL Parameters:**
- `id` (integer): Sub-user ID

**Request Body:**
```json
{
  "reason": "Invalid credentials or incomplete information"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Sub-user rejected",
  "data": {
    "id": 1,
    "status": "rejected",
    "rejectedAt": "2024-01-15T12:00:00Z",
    "rejectionReason": "Invalid credentials or incomplete information",
    "rejectedBy": {
      "id": 1,
      "name": "Admin User",
      "email": "admin@example.com"
    }
  }
}
```

**Error Responses:**
```json
// Not found
{
  "success": false,
  "message": "Sub-user not found"
}

// Already processed
{
  "success": false,
  "message": "Sub-user is already processed"
}

// Missing reason
{
  "success": false,
  "message": "Rejection reason is required"
}
```

**Side Effects:**
- Status changes to "rejected"
- Sub-user cannot login
- Notification email sent to vendor/store owner (optional)

---

## 4. Login Endpoint (Updated)

### 4.1 Sub-User Login
Sub-users login with their credentials. The response should include menu permissions.

**Endpoint:** `POST /auth/rootLogin` (or your existing login endpoint)

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

**Response (for sub-user):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "id": 1,
    "role": "2", // or "3" for store
    "vendorId": 5, // or null
    "storeId": null, // or store ID
    "isSubUser": true, // Important: indicates this is a sub-user
    "menuPermissions": {
      "Vendors": true,
      "Stores": false,
      "Categories": true,
      "Products": true,
      "Customer": false,
      "Subscriptions": true,
      "Orders": true,
      "Inventory": true,
      "Billing": false
    },
    "status": "approved", // Must be "approved" to login
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com"
  }
}
```

**Error Responses:**
```json
// Pending approval
{
  "success": false,
  "message": "Your account is pending admin approval. Please wait for approval."
}

// Rejected
{
  "success": false,
  "message": "Your account has been rejected. Please contact your administrator."
}

// Invalid credentials
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

## 5. Database Schema Suggestions

### 5.1 Sub-Users Table
```sql
CREATE TABLE sub_users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  firstName VARCHAR(255) NOT NULL,
  lastName VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(50),
  password VARCHAR(255) NOT NULL, -- Hashed password
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  vendorId INT NULL, -- Foreign key to vendors table
  storeId INT NULL, -- Foreign key to stores table
  createdBy INT NOT NULL, -- User ID who created this sub-user
  approvedBy INT NULL, -- Admin user ID who approved
  rejectedBy INT NULL, -- Admin user ID who rejected
  rejectionReason TEXT NULL,
  approvedAt DATETIME NULL,
  rejectedAt DATETIME NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (vendorId) REFERENCES vendors(id) ON DELETE CASCADE,
  FOREIGN KEY (storeId) REFERENCES stores(id) ON DELETE CASCADE,
  FOREIGN KEY (createdBy) REFERENCES users(id),
  FOREIGN KEY (approvedBy) REFERENCES users(id),
  FOREIGN KEY (rejectedBy) REFERENCES users(id),
  INDEX idx_vendor (vendorId),
  INDEX idx_store (storeId),
  INDEX idx_status (status),
  INDEX idx_email (email)
);
```

### 5.2 Sub-User Menu Permissions Table
```sql
CREATE TABLE sub_user_menu_permissions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  subUserId INT NOT NULL,
  menuKey VARCHAR(100) NOT NULL,
  enabled BOOLEAN DEFAULT true,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (subUserId) REFERENCES sub_users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_subuser_menu (subUserId, menuKey),
  INDEX idx_subuser (subUserId)
);
```

---

## 6. Implementation Notes

### 6.1 Access Control Rules
1. **Vendor/Store Owners:**
   - Can create, view, update, delete their own sub-users
   - Can manage menu permissions for their sub-users
   - Cannot approve/reject sub-users (admin only)

2. **Admin:**
   - Can view all pending sub-users
   - Can approve/reject any sub-user
   - Can view all sub-users across all vendors/stores

3. **Sub-Users:**
   - Can only login if status is "approved"
   - Menu access is filtered based on permissions
   - Cannot create other sub-users

### 6.2 Security Considerations
1. **Password Hashing:** Always hash passwords using bcrypt or similar
2. **Token Validation:** Verify token and check user status on every request
3. **Permission Checks:** Verify ownership before allowing sub-user operations
4. **Email Uniqueness:** Ensure email is unique across all users (regular + sub-users)
5. **Status Validation:** Only allow login for "approved" sub-users

### 6.3 Default Permissions
When a sub-user is created, you may want to:
- Set all permissions to `true` by default, OR
- Set all permissions to `false` by default (more secure)

The frontend currently defaults to `true`, but backend should handle this consistently.

### 6.4 Menu Keys Reference
The following menu keys are used in the system:
- `Vendors` - Vendors menu
- `Vendor` - Vendor menu (alternative)
- `Stores` - Stores menu
- `Categories` - Categories menu
- `Products` - Products menu
- `Customer` - Customers menu
- `Subscriptions` - Subscriptions menu
- `Orders` - Orders menu
- `Inventory` - Inventory menu
- `Billing` - Billing menu

---

## 7. Example API Flow

### Flow 1: Creating and Approving a Sub-User

1. **Vendor creates sub-user:**
   ```bash
   POST /auth/sub-users/create
   {
     "firstName": "John",
     "lastName": "Doe",
     "email": "john@example.com",
     "phone": "+1234567890",
     "password": "password123"
   }
   ```
   Response: Status = "pending"

2. **Admin views pending:**
   ```bash
   GET /auth/sub-users/pending
   ```
   Response: List of pending sub-users

3. **Admin approves:**
   ```bash
   POST /auth/sub-users/approve/1
   {
     "notes": "Approved after verification"
   }
   ```
   Response: Status = "approved"

4. **Sub-user logs in:**
   ```bash
   POST /auth/rootLogin
   {
     "email": "john@example.com",
     "password": "password123"
   }
   ```
   Response: Token + menu permissions

5. **Vendor sets permissions:**
   ```bash
   POST /auth/sub-users/1/menu-permissions
   {
     "menuKey": "Products",
     "enabled": true
   }
   ```

---

## 8. Error Codes

| HTTP Status | Description |
|------------|-------------|
| 200 | Success |
| 400 | Bad Request (validation errors) |
| 401 | Unauthorized (invalid/missing token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found |
| 409 | Conflict (e.g., email already exists) |
| 500 | Internal Server Error |

---

## 9. Testing Checklist

- [ ] Create sub-user as vendor
- [ ] Create sub-user as store
- [ ] View pending sub-users as admin
- [ ] Approve sub-user as admin
- [ ] Reject sub-user as admin
- [ ] Login as approved sub-user
- [ ] Login as pending sub-user (should fail)
- [ ] Login as rejected sub-user (should fail)
- [ ] Update sub-user permissions
- [ ] Bulk update permissions
- [ ] Delete sub-user
- [ ] Verify menu filtering works for sub-users
- [ ] Test access control (vendor can't see other vendor's sub-users)

---

## 10. Support

For questions or issues, contact the development team or refer to the main API documentation.

**Last Updated:** January 2024

