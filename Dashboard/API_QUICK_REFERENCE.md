# Sub-User Management API - Quick Reference

## Base URL
```
https://nicknameinfo.net/api
```

## Authentication
All requests require: `Authorization: Bearer <token>`

---

## Endpoints Summary

### Store Menu Permissions (Admin Only)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/store/menu-permissions/:storeId` | Get all permissions for a store | Admin |
| POST | `/store/menu-permissions/:storeId` | Update single permission | Admin |
| POST | `/store/menu-permissions/:storeId/bulk` | Bulk update permissions | Admin |

### Sub-User Management

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/auth/sub-users/list` | Get all sub-users | Vendor/Store |
| POST | `/auth/sub-users/create` | Create sub-user | Vendor/Store |
| POST | `/auth/sub-users/update/:id` | Update sub-user | Vendor/Store |
| POST | `/auth/sub-users/delete/:id` | Delete sub-user | Vendor/Store |
| GET | `/auth/sub-users/:id` | Get sub-user details | Vendor/Store |

### Sub-User Menu Permissions

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/auth/sub-users/:subUserId/menu-permissions` | Get permissions | Vendor/Store |
| POST | `/auth/sub-users/:subUserId/menu-permissions` | Update permission | Vendor/Store |
| POST | `/auth/sub-users/:subUserId/menu-permissions/bulk` | Bulk update | Vendor/Store |

### Admin Approval

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/auth/sub-users/pending` | Get pending sub-users | Admin |
| POST | `/auth/sub-users/approve/:id` | Approve sub-user | Admin |
| POST | `/auth/sub-users/reject/:id` | Reject sub-user | Admin |

---

## Request/Response Examples

### Get Store Menu Permissions
```bash
GET /store/menu-permissions/123
Authorization: Bearer <admin_token>
```

### Update Store Permission
```bash
POST /store/menu-permissions/123
{
  "menuKey": "Products",
  "enabled": false
}
```

### Bulk Update Store Permissions
```bash
POST /store/menu-permissions/123/bulk
{
  "permissions": {
    "Products": false,
    "Orders": true,
    "Inventory": false
  }
}
```

### Create Sub-User
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

### Update Permission
```bash
POST /auth/sub-users/1/menu-permissions
{
  "menuKey": "Products",
  "enabled": true
}
```

### Approve Sub-User
```bash
POST /auth/sub-users/approve/1
{
  "notes": "Approved"
}
```

### Reject Sub-User
```bash
POST /auth/sub-users/reject/1
{
  "reason": "Invalid information"
}
```

---

## Menu Keys
- `Vendors`, `Vendor`, `Stores`, `Categories`, `Products`, `Customer`, `Subscriptions`, `Orders`, `Inventory`, `Billing`

---

## Status Values
- `pending` - Awaiting admin approval
- `approved` - Can login and access system
- `rejected` - Cannot login

---

## Response Format
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

---

## Documentation Files

- **Sub-User Management**: `API_DOCUMENTATION_SUB_USER_MANAGEMENT.md`
- **Store Menu Permissions**: `STORE_MENU_PERMISSIONS_API_BACKEND_GUIDE.md`
- **Sub-User Menu Permissions**: `MENU_PERMISSIONS_API_BACKEND_GUIDE.md`
- **Quick References**: 
  - `STORE_MENU_PERMISSIONS_API_QUICK_REFERENCE.md`
  - `MENU_PERMISSIONS_API_QUICK_REFERENCE.md`

