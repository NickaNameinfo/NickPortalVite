# Store Menu Permissions API - Quick Reference

## Endpoints (Admin Only)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/store/menu-permissions/:storeId` | Get all permissions for a store | Admin only |
| POST | `/store/menu-permissions/:storeId` | Update single permission | Admin only |
| POST | `/store/menu-permissions/:storeId/bulk` | Bulk update permissions | Admin only |

---

## 1. Get Store Menu Permissions

**GET** `/store/menu-permissions/:storeId`

### Headers
```
Authorization: Bearer <admin_token>
```

### URL Parameters
- `storeId` (integer): Store ID

### Response
```json
{
  "success": true,
  "data": {
    "Vendors": true,
    "Vendor": true,
    "Stores": true,
    "Categories": true,
    "Products": true,
    "Customer": true,
    "Subscriptions": true,
    "Orders": true,
    "Inventory": true,
    "Billing": true
  }
}
```

### Example Request
```bash
curl -X GET "http://localhost:8000/store/menu-permissions/123" \
  -H "Authorization: Bearer <admin_token>"
```

---

## 2. Update Single Permission

**POST** `/store/menu-permissions/:storeId`

### Headers
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

### URL Parameters
- `storeId` (integer): Store ID

### Request Body
```json
{
  "menuKey": "Products",
  "enabled": false
}
```

### Response
```json
{
  "success": true,
  "message": "Permission updated successfully",
  "data": {
    "menuKey": "Products",
    "enabled": false
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
curl -X POST "http://localhost:8000/store/menu-permissions/123" \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "menuKey": "Products",
    "enabled": false
  }'
```

---

## 3. Bulk Update Permissions

**POST** `/store/menu-permissions/:storeId/bulk`

### Headers
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

### URL Parameters
- `storeId` (integer): Store ID

### Request Body
```json
{
  "permissions": {
    "Products": false,
    "Orders": true,
    "Inventory": false
  }
}
```

### Response
```json
{
  "success": true,
  "message": "Store permissions updated successfully",
  "data": {
    "Vendors": true,
    "Vendor": true,
    "Stores": true,
    "Categories": true,
    "Products": false,
    "Customer": true,
    "Subscriptions": true,
    "Orders": true,
    "Inventory": false,
    "Billing": true
  }
}
```

### Example Request
```bash
curl -X POST "http://localhost:8000/store/menu-permissions/123/bulk" \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "permissions": {
      "Products": false,
      "Orders": true,
      "Inventory": false
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
  "message": "Access denied: Admin access required"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Store not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Failed to update store menu permission"
}
```

---

## Access Control

- **Admin (role "0")**: Full access to manage store menu permissions
- **Vendor (role "2")**: No access
- **Store (role "3")**: No access
- **Other roles**: No access

---

## Implementation Notes

1. All endpoints require admin authentication via JWT token
2. Store must exist before permissions can be managed
3. Menu keys are case-sensitive
4. Permissions default to `true` if not explicitly set
5. Bulk update uses upsert (creates or updates existing permissions)
6. These permissions control what menu items are available to the entire store

---

**Last Updated**: Quick reference for Store Menu Permissions API


