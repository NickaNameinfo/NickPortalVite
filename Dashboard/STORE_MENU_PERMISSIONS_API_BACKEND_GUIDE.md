# Store Menu Permissions API - Backend Implementation Guide

Complete backend implementation guide for store-level menu permissions management (Admin only).

## Table of Contents
1. [Database Model](#database-model)
2. [Controller Implementation](#controller-implementation)
3. [Route Configuration](#route-configuration)
4. [Validation](#validation)
5. [Security & Authorization](#security--authorization)
6. [Error Handling](#error-handling)

---

## Database Model

### Sequelize Model

```javascript
// models/StoreMenuPermission.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const StoreMenuPermission = sequelize.define('StoreMenuPermission', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    storeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'stores',
        key: 'id'
      },
      onDelete: 'CASCADE',
      comment: 'Foreign key to stores table'
    },
    menuKey: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: 'Menu item key (e.g., "Products", "Orders")'
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
      comment: 'Whether this menu item is enabled for the store'
    }
  }, {
    tableName: 'store_menu_permissions',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['storeId', 'menuKey'],
        name: 'unique_store_menu'
      },
      {
        fields: ['storeId'],
        name: 'idx_store_id'
      },
      {
        fields: ['menuKey'],
        name: 'idx_menu_key'
      }
    ]
  });

  return StoreMenuPermission;
};
```

### Database Migration

```javascript
// migrations/XXXXXX-create-store-menu-permissions.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('store_menu_permissions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      storeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'stores',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      menuKey: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      enabled: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Create unique constraint
    await queryInterface.addIndex('store_menu_permissions', {
      fields: ['storeId', 'menuKey'],
      unique: true,
      name: 'unique_store_menu'
    });

    // Create indexes for performance
    await queryInterface.addIndex('store_menu_permissions', {
      fields: ['storeId'],
      name: 'idx_store_id'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('store_menu_permissions');
  }
};
```

---

## Controller Implementation

### Complete Controller File

```javascript
// controllers/storeMenuPermission.controller.js
const { Store, StoreMenuPermission } = require('../models');
const { VALID_MENU_KEYS } = require('../constants/menuKeys');

/**
 * Get all menu permissions for a store
 * GET /store/menu-permissions/:storeId
 */
exports.getStoreMenuPermissions = async (req, res) => {
  try {
    const { storeId } = req.params;
    const role = req.user.role;

    // Authorization: Only admin can view store permissions
    if (role !== '0') {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Admin access required'
      });
    }

    // Verify store exists
    const store = await Store.findByPk(storeId, {
      attributes: ['id', 'storename', 'name']
    });

    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    // Get all permissions for this store
    const permissions = await StoreMenuPermission.findAll({
      where: { storeId },
      attributes: ['menuKey', 'enabled']
    });

    // Convert to object format expected by frontend
    const permissionsObject = {};
    VALID_MENU_KEYS.forEach(key => {
      const permission = permissions.find(p => p.menuKey === key);
      permissionsObject[key] = permission ? permission.enabled : true; // Default to true for stores
    });

    return res.json({
      success: true,
      data: permissionsObject
    });
  } catch (error) {
    console.error('Error fetching store menu permissions:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch store menu permissions'
    });
  }
};

/**
 * Update a single menu permission for a store
 * POST /store/menu-permissions/:storeId
 */
exports.updateStoreMenuPermission = async (req, res) => {
  try {
    const { storeId } = req.params;
    const { menuKey, enabled } = req.body;
    const role = req.user.role;

    // Authorization: Only admin can update store permissions
    if (role !== '0') {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Admin access required'
      });
    }

    // Validation
    if (!menuKey || typeof enabled !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'Invalid request: menuKey and enabled (boolean) are required'
      });
    }

    // Validate menu key
    if (!VALID_MENU_KEYS.includes(menuKey)) {
      return res.status(400).json({
        success: false,
        message: `Invalid menu key. Valid keys are: ${VALID_MENU_KEYS.join(', ')}`
      });
    }

    // Verify store exists
    const store = await Store.findByPk(storeId, {
      attributes: ['id', 'storename', 'name']
    });

    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    // Update or create permission (upsert)
    const [permission, created] = await StoreMenuPermission.upsert({
      storeId,
      menuKey,
      enabled: Boolean(enabled)
    }, {
      returning: true
    });

    return res.json({
      success: true,
      message: created ? 'Permission created successfully' : 'Permission updated successfully',
      data: {
        menuKey: permission.menuKey,
        enabled: permission.enabled
      }
    });
  } catch (error) {
    console.error('Error updating store menu permission:', error);
    
    // Handle unique constraint violation
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        success: false,
        message: 'Permission already exists for this store and menu key'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to update store menu permission'
    });
  }
};

/**
 * Bulk update menu permissions for a store
 * POST /store/menu-permissions/:storeId/bulk
 */
exports.bulkUpdateStoreMenuPermissions = async (req, res) => {
  try {
    const { storeId } = req.params;
    const { permissions } = req.body;
    const role = req.user.role;

    // Authorization: Only admin can bulk update store permissions
    if (role !== '0') {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Admin access required'
      });
    }

    // Validation
    if (!permissions || typeof permissions !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Invalid request: permissions object is required'
      });
    }

    // Validate all menu keys
    const invalidKeys = Object.keys(permissions).filter(
      key => !VALID_MENU_KEYS.includes(key)
    );

    if (invalidKeys.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Invalid menu keys: ${invalidKeys.join(', ')}. Valid keys are: ${VALID_MENU_KEYS.join(', ')}`
      });
    }

    // Verify store exists
    const store = await Store.findByPk(storeId, {
      attributes: ['id', 'storename', 'name']
    });

    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    // Prepare bulk update operations
    const updatePromises = Object.entries(permissions).map(([menuKey, enabled]) => {
      return StoreMenuPermission.upsert({
        storeId,
        menuKey,
        enabled: Boolean(enabled)
      }, {
        returning: true
      });
    });

    // Execute all updates
    await Promise.all(updatePromises);

    // Fetch updated permissions to return
    const updatedPermissions = await StoreMenuPermission.findAll({
      where: { storeId },
      attributes: ['menuKey', 'enabled']
    });

    // Convert to object format
    const permissionsObject = {};
    VALID_MENU_KEYS.forEach(key => {
      const permission = updatedPermissions.find(p => p.menuKey === key);
      permissionsObject[key] = permission ? permission.enabled : true; // Default to true
    });

    return res.json({
      success: true,
      message: 'Store permissions updated successfully',
      data: permissionsObject
    });
  } catch (error) {
    console.error('Error bulk updating store menu permissions:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update store menu permissions'
    });
  }
};
```

---

## Route Configuration

### Router File

```javascript
// routes/store.router.js
const express = require("express");
const storeMenuPermissionController = require("./storeMenuPermission.controller");
const { sanitize } = require("../../../middleware/sanitizer");
const { jwtStrategy } = require("../../../middleware/strategy");
const { requireAdmin } = require("../../../middleware/requireAuth");

const storeRouter = express.Router();

// Store menu permissions routes (Admin only)
storeRouter
  .route("/menu-permissions/:storeId")
  .get(sanitize(), jwtStrategy, requireAdmin, storeMenuPermissionController.getStoreMenuPermissions)
  .post(sanitize(), jwtStrategy, requireAdmin, storeMenuPermissionController.updateStoreMenuPermission);

storeRouter
  .route("/menu-permissions/:storeId/bulk")
  .post(sanitize(), jwtStrategy, requireAdmin, storeMenuPermissionController.bulkUpdateStoreMenuPermissions);

module.exports = { storeRouter };
```

### Mounting the Router

```javascript
// routes/index.js or app.js
const express = require('express');
const { storeRouter } = require('./store.router');

const restRouter = express.Router();

// Mount at /store to match frontend expectations
restRouter.use("/store", storeRouter);

module.exports = { restRouter };
```

---

## Validation

### Request Validation Middleware

```javascript
// middleware/validators/storeMenuPermissionValidator.js
const { body, param } = require('express-validator');
const { VALID_MENU_KEYS } = require('../../constants/menuKeys');

exports.validateGetPermissions = [
  param('storeId')
    .isInt({ min: 1 })
    .withMessage('Store ID must be a positive integer')
];

exports.validateUpdatePermission = [
  param('storeId')
    .isInt({ min: 1 })
    .withMessage('Store ID must be a positive integer'),
  body('menuKey')
    .notEmpty()
    .withMessage('Menu key is required')
    .isIn(VALID_MENU_KEYS)
    .withMessage(`Menu key must be one of: ${VALID_MENU_KEYS.join(', ')}`),
  body('enabled')
    .isBoolean()
    .withMessage('Enabled must be a boolean value')
];

exports.validateBulkUpdate = [
  param('storeId')
    .isInt({ min: 1 })
    .withMessage('Store ID must be a positive integer'),
  body('permissions')
    .isObject()
    .withMessage('Permissions must be an object')
    .custom((permissions) => {
      const keys = Object.keys(permissions);
      const invalidKeys = keys.filter(key => !VALID_MENU_KEYS.includes(key));
      if (invalidKeys.length > 0) {
        throw new Error(`Invalid menu keys: ${invalidKeys.join(', ')}`);
      }
      return true;
    }),
  body('permissions.*')
    .isBoolean()
    .withMessage('All permission values must be boolean')
];
```

---

## Security & Authorization

### Authorization Requirements

1. **Admin Only**: All store menu permission endpoints require admin role (role "0")
2. **Store Verification**: Verify store exists before allowing permission updates
3. **Input Validation**: Validate all menu keys and data types

### Enhanced Authorization Middleware

```javascript
// middleware/requireAdmin.js (if not already exists)
const requireAdmin = (req, res, next) => {
  if (req.user.role !== '0') {
    return res.status(403).json({
      success: false,
      message: 'Access denied: Admin access required'
    });
  }
  next();
};

module.exports = { requireAdmin };
```

---

## API Endpoints Summary

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/store/menu-permissions/:storeId` | Get all permissions for a store | Admin only |
| POST | `/store/menu-permissions/:storeId` | Update single permission | Admin only |
| POST | `/store/menu-permissions/:storeId/bulk` | Bulk update permissions | Admin only |

---

## Request/Response Examples

### Get Store Menu Permissions

**Request:**
```bash
GET /store/menu-permissions/123
Authorization: Bearer <admin_token>
```

**Response:**
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

### Update Single Permission

**Request:**
```bash
POST /store/menu-permissions/123
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "menuKey": "Products",
  "enabled": false
}
```

**Response:**
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

### Bulk Update Permissions

**Request:**
```bash
POST /store/menu-permissions/123/bulk
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "permissions": {
    "Products": false,
    "Orders": true,
    "Inventory": false
  }
}
```

**Response:**
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

### 409 Conflict
```json
{
  "success": false,
  "message": "Permission already exists for this store and menu key"
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

## Implementation Checklist

- [ ] Create database model and migration
- [ ] Create controller with all three methods
- [ ] Set up routes with admin authorization
- [ ] Add validation middleware
- [ ] Implement admin authorization checks
- [ ] Add error handling
- [ ] Write unit tests
- [ ] Test all endpoints
- [ ] Document API responses
- [ ] Add logging for debugging

---

**Last Updated**: Complete backend implementation guide for Store Menu Permissions
**Status**: ✅ Ready for implementation


