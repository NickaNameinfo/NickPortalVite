# Complete API Summary - Settings & Permissions

Complete list of all APIs for Settings, Sub-User Management, and Menu Permissions.

---

## 📋 Store Menu Permissions APIs (Admin Only)

| Method | Endpoint | Description | Access | Documentation |
|--------|----------|-------------|--------|---------------|
| GET | `/store/menu-permissions/:storeId` | Get all permissions for a store | Admin | `STORE_MENU_PERMISSIONS_API_BACKEND_GUIDE.md` |
| POST | `/store/menu-permissions/:storeId` | Update single permission | Admin | `STORE_MENU_PERMISSIONS_API_BACKEND_GUIDE.md` |
| POST | `/store/menu-permissions/:storeId/bulk` | Bulk update permissions | Admin | `STORE_MENU_PERMISSIONS_API_BACKEND_GUIDE.md` |

**Quick Reference**: `STORE_MENU_PERMISSIONS_API_QUICK_REFERENCE.md`

---

## 👥 Sub-User Management APIs (Vendor/Store)

| Method | Endpoint | Description | Access | Documentation |
|--------|----------|-------------|--------|---------------|
| GET | `/auth/sub-users/list` | Get all sub-users | Vendor/Store | `API_DOCUMENTATION_SUB_USER_MANAGEMENT.md` |
| POST | `/auth/sub-users/create` | Create sub-user | Vendor/Store | `API_DOCUMENTATION_SUB_USER_MANAGEMENT.md` |
| POST | `/auth/sub-users/update/:id` | Update sub-user | Vendor/Store | `API_DOCUMENTATION_SUB_USER_MANAGEMENT.md` |
| POST | `/auth/sub-users/delete/:id` | Delete sub-user | Vendor/Store | `API_DOCUMENTATION_SUB_USER_MANAGEMENT.md` |
| GET | `/auth/sub-users/:id` | Get sub-user details | Vendor/Store | `API_DOCUMENTATION_SUB_USER_MANAGEMENT.md` |

**Quick Reference**: `API_QUICK_REFERENCE.md`

---

## 🔐 Sub-User Menu Permissions APIs (Vendor/Store)

| Method | Endpoint | Description | Access | Documentation |
|--------|----------|-------------|--------|---------------|
| GET | `/auth/sub-users/:subUserId/menu-permissions` | Get permissions | Vendor/Store | `MENU_PERMISSIONS_API_BACKEND_GUIDE.md` |
| POST | `/auth/sub-users/:subUserId/menu-permissions` | Update permission | Vendor/Store | `MENU_PERMISSIONS_API_BACKEND_GUIDE.md` |
| POST | `/auth/sub-users/:subUserId/menu-permissions/bulk` | Bulk update | Vendor/Store | `MENU_PERMISSIONS_API_BACKEND_GUIDE.md` |

**Alternative Endpoints** (if using `/api/subUser` base path):
- GET `/api/subUser/:subUserId/menu-permissions`
- POST `/api/subUser/:subUserId/menu-permissions`
- POST `/api/subUser/:subUserId/menu-permissions/bulk`

**Quick Reference**: `MENU_PERMISSIONS_API_QUICK_REFERENCE.md`

---

## ✅ Admin Approval APIs (Admin Only)

| Method | Endpoint | Description | Access | Documentation |
|--------|----------|-------------|--------|---------------|
| GET | `/auth/sub-users/pending` | Get pending sub-users | Admin | `API_DOCUMENTATION_SUB_USER_MANAGEMENT.md` |
| POST | `/auth/sub-users/approve/:id` | Approve sub-user | Admin | `API_DOCUMENTATION_SUB_USER_MANAGEMENT.md` |
| POST | `/auth/sub-users/reject/:id` | Reject sub-user | Admin | `API_DOCUMENTATION_SUB_USER_MANAGEMENT.md` |

**Quick Reference**: `API_QUICK_REFERENCE.md`

---

## 📚 Documentation Files

### Complete Implementation Guides
1. **`STORE_MENU_PERMISSIONS_API_BACKEND_GUIDE.md`**
   - Database models
   - Controller implementation
   - Routes configuration
   - Validation & security
   - Error handling

2. **`MENU_PERMISSIONS_API_BACKEND_GUIDE.md`**
   - Sub-user menu permissions
   - Complete backend implementation
   - Security & authorization

3. **`BACKEND_IMPLEMENTATION_GUIDE.md`**
   - Sub-user management
   - Complete backend patterns
   - Route ordering (critical!)

4. **`API_DOCUMENTATION_SUB_USER_MANAGEMENT.md`**
   - Complete API documentation
   - Request/response examples
   - Error handling

### Quick Reference Guides
1. **`API_QUICK_REFERENCE.md`** - Main quick reference
2. **`STORE_MENU_PERMISSIONS_API_QUICK_REFERENCE.md`** - Store permissions quick ref
3. **`MENU_PERMISSIONS_API_QUICK_REFERENCE.md`** - Sub-user permissions quick ref

### Implementation Helpers
1. **`SUB_USER_ROUTER_FIX.md`** - Route ordering fix guide
2. **`ROUTER_MOUNTING_EXAMPLE.js`** - Router mounting examples

---

## 🔑 Valid Menu Keys

All menu permission APIs use these keys:
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

---

## 🔒 Access Control Summary

| Role | Store Permissions | Sub-User Management | Sub-User Permissions | Admin Approval |
|------|------------------|---------------------|---------------------|----------------|
| **Admin (0)** | ✅ Full Access | ❌ No Access | ❌ No Access | ✅ Full Access |
| **Vendor (2)** | ❌ No Access | ✅ Own Sub-Users | ✅ Own Sub-Users | ❌ No Access |
| **Store (3)** | ❌ No Access | ✅ Own Sub-Users | ✅ Own Sub-Users | ❌ No Access |

---

## 🚀 Implementation Status

### ✅ Documented APIs
- [x] Store Menu Permissions (3 endpoints)
- [x] Sub-User Management (5 endpoints)
- [x] Sub-User Menu Permissions (3 endpoints)
- [x] Admin Approval (3 endpoints)

### 📝 Total Endpoints: 14

---

## 📖 Quick Links

- **Main Quick Reference**: `API_QUICK_REFERENCE.md`
- **Store Permissions**: `STORE_MENU_PERMISSIONS_API_QUICK_REFERENCE.md`
- **Sub-User Permissions**: `MENU_PERMISSIONS_API_QUICK_REFERENCE.md`
- **Backend Guides**: See Documentation Files section above

---

**Last Updated**: Complete API summary
**Status**: ✅ All APIs documented


