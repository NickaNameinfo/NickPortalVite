# Menu Permissions API - Quick Reference

## Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/subUser/:subUserId/menu-permissions` | Get all permissions | Vendor/Store |
| POST | `/api/subUser/:subUserId/menu-permissions` | Update single permission | Vendor/Store |
| POST | `/api/subUser/:subUserId/menu-permissions/bulk` | Bulk update permissions | Vendor/Store |

---

## 1. Get Menu Permissions

**GET** `/api/subUser/:subUserId/menu-permissions`

### Headers
```
Authorization: Bearer <token>
```

### URL Parameters
- `subUserId` (integer): Sub-user ID

### Response
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

### Example Request
```bash
curl -X GET "http://localhost:8000/api/subUser/123/menu-permissions" \
  -H "Authorization: Bearer <token>"
```

---

## 2. Update Single Permission

**POST** `/api/subUser/:subUserId/menu-permissions`

### Headers
```
Authorization: Bearer <token>
Content-Type: application/json
```

### URL Parameters
- `subUserId` (integer): Sub-user ID

### Request Body
```json
{
  "menuKey": "Products",
  "enabled": true
}
```

### Response
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

### Valid Menu Keys
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

### Example Request
```bash
curl -X POST "http://localhost:8000/api/subUser/123/menu-permissions" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "menuKey": "Products",
    "enabled": true
  }'
```

---

## 3. Bulk Update Permissions

**POST** `/api/subUser/:subUserId/menu-permissions/bulk`

### Headers
```
Authorization: Bearer <token>
Content-Type: application/json
```

### URL Parameters
- `subUserId` (integer): Sub-user ID

### Request Body
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

### Response
```json
{
  "success": true,
  "message": "Permissions updated successfully",
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

### Example Request
```bash
curl -X POST "http://localhost:8000/api/subUser/123/menu-permissions/bulk" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "permissions": {
      "Products": true,
      "Orders": false,
      "Inventory": true
    }
  }'
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Invalid request: menuKey and enabled (boolean) are required"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Access denied: You can only manage permissions for your own sub-users"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Sub-user not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Failed to update menu permission"
}
```

---

## Router Mounting

To use these endpoints, mount the router at `/api/subUser`:

```javascript
// routes/index.js or app.js
const { subUserRouter } = require('./subUser.router');

restRouter.use("/api/subUser", subUserRouter);
```

---

## Access Control

- **Vendor (role "2")**: Can manage permissions for sub-users belonging to their vendor
- **Store (role "3")**: Can manage permissions for sub-users belonging to their store
- **Admin (role "0")**: Cannot directly manage sub-user permissions (uses store-level permissions)
- **Other roles**: No access

---

## Implementation Notes

1. All endpoints require authentication via JWT token
2. Users can only manage permissions for their own sub-users
3. Menu keys are case-sensitive
4. Permissions default to `false` if not explicitly set
5. Bulk update uses upsert (creates or updates existing permissions)

---

**Last Updated**: Quick reference for `/api/subUser` endpoints


