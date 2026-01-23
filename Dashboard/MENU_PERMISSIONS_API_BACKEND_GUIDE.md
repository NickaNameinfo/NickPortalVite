# Menu Permissions API - Backend Implementation Guide

Complete backend implementation guide for sub-user menu permissions management.

## Table of Contents
1. [Database Model](#database-model)
2. [Controller Implementation](#controller-implementation)
3. [Route Configuration](#route-configuration)
4. [Validation](#validation)
5. [Security & Authorization](#security--authorization)
6. [Error Handling](#error-handling)
7. [Testing](#testing)

---

## Database Model

### Sequelize Model

```javascript
// models/SubUserMenuPermission.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const SubUserMenuPermission = sequelize.define('SubUserMenuPermission', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    subUserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'sub_users',
        key: 'id'
      },
      onDelete: 'CASCADE',
      comment: 'Foreign key to sub_users table'
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
      comment: 'Whether this menu item is enabled for the sub-user'
    }
  }, {
    tableName: 'sub_user_menu_permissions',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['subUserId', 'menuKey'],
        name: 'unique_subuser_menu'
      },
      {
        fields: ['subUserId'],
        name: 'idx_subuser_id'
      },
      {
        fields: ['menuKey'],
        name: 'idx_menu_key'
      }
    ]
  });

  return SubUserMenuPermission;
};
```

### Database Migration (Sequelize)

```javascript
// migrations/XXXXXX-create-sub-user-menu-permissions.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('sub_user_menu_permissions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      subUserId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'sub_users',
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
    await queryInterface.addIndex('sub_user_menu_permissions', {
      fields: ['subUserId', 'menuKey'],
      unique: true,
      name: 'unique_subuser_menu'
    });

    // Create indexes for performance
    await queryInterface.addIndex('sub_user_menu_permissions', {
      fields: ['subUserId'],
      name: 'idx_subuser_id'
    });

    await queryInterface.addIndex('sub_user_menu_permissions', {
      fields: ['menuKey'],
      name: 'idx_menu_key'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('sub_user_menu_permissions');
  }
};
```

### Valid Menu Keys

```javascript
// constants/menuKeys.js
module.exports = {
  VALID_MENU_KEYS: [
    'Vendors',
    'Vendor',
    'Stores',
    'Categories',
    'Products',
    'Customer',
    'Subscriptions',
    'Orders',
    'Inventory',
    'Billing'
  ],
  
  DEFAULT_MENU_ITEMS: [
    { key: 'Vendors', name: 'Vendors' },
    { key: 'Vendor', name: 'Vendor' },
    { key: 'Stores', name: 'Stores' },
    { key: 'Categories', name: 'Categories' },
    { key: 'Products', name: 'Products' },
    { key: 'Customer', name: 'Customer' },
    { key: 'Subscriptions', name: 'Subscriptions' },
    { key: 'Orders', name: 'Orders' },
    { key: 'Inventory', name: 'Inventory' },
    { key: 'Billing', name: 'Billing' }
  ]
};
```

---

## Controller Implementation

### Complete Controller File

```javascript
// controllers/subUserMenuPermission.controller.js
const { SubUser, SubUserMenuPermission } = require('../models');
const { VALID_MENU_KEYS } = require('../constants/menuKeys');
const { Op } = require('sequelize');

/**
 * Get all menu permissions for a sub-user
 * GET /api/subUser/:subUserId/menu-permissions
 * Alternative: GET /auth/sub-users/:subUserId/menu-permissions
 */
exports.getSubUserMenuPermissions = async (req, res) => {
  try {
    const { subUserId } = req.params;
    const userId = req.user.id;
    const role = req.user.role;
    const vendorId = req.user.vendorId;
    const storeId = req.user.storeId;

    // Find sub-user
    const subUser = await SubUser.findByPk(subUserId, {
      attributes: ['id', 'vendorId', 'storeId', 'status']
    });

    if (!subUser) {
      return res.status(404).json({
        success: false,
        message: 'Sub-user not found'
      });
    }

    // Authorization check: Only vendor/store owner can view their sub-user permissions
    if (role === '2') { // Vendor
      if (subUser.vendorId !== vendorId) {
        return res.status(403).json({
          success: false,
          message: 'Access denied: You can only view permissions for your own sub-users'
        });
      }
    } else if (role === '3') { // Store
      if (subUser.storeId !== storeId) {
        return res.status(403).json({
          success: false,
          message: 'Access denied: You can only view permissions for your own sub-users'
        });
      }
    } else {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Only vendors and stores can view sub-user permissions'
      });
    }

    // Get all permissions for this sub-user
    const permissions = await SubUserMenuPermission.findAll({
      where: { subUserId },
      attributes: ['menuKey', 'enabled']
    });

    // Convert to object format expected by frontend
    const permissionsObject = {};
    VALID_MENU_KEYS.forEach(key => {
      const permission = permissions.find(p => p.menuKey === key);
      permissionsObject[key] = permission ? permission.enabled : false;
    });

    return res.json({
      success: true,
      data: permissionsObject
    });
  } catch (error) {
    console.error('Error fetching sub-user menu permissions:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch menu permissions'
    });
  }
};

/**
 * Update a single menu permission for a sub-user
 * POST /api/subUser/:subUserId/menu-permissions
 * Alternative: POST /auth/sub-users/:subUserId/menu-permissions
 */
exports.updateSubUserMenuPermission = async (req, res) => {
  try {
    const { subUserId } = req.params;
    const { menuKey, enabled } = req.body;
    const userId = req.user.id;
    const role = req.user.role;
    const vendorId = req.user.vendorId;
    const storeId = req.user.storeId;

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

    // Find sub-user
    const subUser = await SubUser.findByPk(subUserId, {
      attributes: ['id', 'vendorId', 'storeId', 'status']
    });

    if (!subUser) {
      return res.status(404).json({
        success: false,
        message: 'Sub-user not found'
      });
    }

    // Authorization check
    if (role === '2') { // Vendor
      if (subUser.vendorId !== vendorId) {
        return res.status(403).json({
          success: false,
          message: 'Access denied: You can only update permissions for your own sub-users'
        });
      }
    } else if (role === '3') { // Store
      if (subUser.storeId !== storeId) {
        return res.status(403).json({
          success: false,
          message: 'Access denied: You can only update permissions for your own sub-users'
        });
      }
    } else {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Only vendors and stores can update sub-user permissions'
      });
    }

    // Update or create permission (upsert)
    const [permission, created] = await SubUserMenuPermission.upsert({
      subUserId,
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
    console.error('Error updating sub-user menu permission:', error);
    
    // Handle unique constraint violation
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        success: false,
        message: 'Permission already exists for this sub-user and menu key'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to update menu permission'
    });
  }
};

/**
 * Bulk update menu permissions for a sub-user
 * POST /api/subUser/:subUserId/menu-permissions/bulk
 * Alternative: POST /auth/sub-users/:subUserId/menu-permissions/bulk
 */
exports.bulkUpdateSubUserMenuPermissions = async (req, res) => {
  try {
    const { subUserId } = req.params;
    const { permissions } = req.body;
    const userId = req.user.id;
    const role = req.user.role;
    const vendorId = req.user.vendorId;
    const storeId = req.user.storeId;

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

    // Find sub-user
    const subUser = await SubUser.findByPk(subUserId, {
      attributes: ['id', 'vendorId', 'storeId', 'status']
    });

    if (!subUser) {
      return res.status(404).json({
        success: false,
        message: 'Sub-user not found'
      });
    }

    // Authorization check
    if (role === '2') { // Vendor
      if (subUser.vendorId !== vendorId) {
        return res.status(403).json({
          success: false,
          message: 'Access denied: You can only update permissions for your own sub-users'
        });
      }
    } else if (role === '3') { // Store
      if (subUser.storeId !== storeId) {
        return res.status(403).json({
          success: false,
          message: 'Access denied: You can only update permissions for your own sub-users'
        });
      }
    } else {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Only vendors and stores can update sub-user permissions'
      });
    }

    // Prepare bulk update operations
    const updatePromises = Object.entries(permissions).map(([menuKey, enabled]) => {
      return SubUserMenuPermission.upsert({
        subUserId,
        menuKey,
        enabled: Boolean(enabled)
      }, {
        returning: true
      });
    });

    // Execute all updates
    await Promise.all(updatePromises);

    // Fetch updated permissions to return
    const updatedPermissions = await SubUserMenuPermission.findAll({
      where: { subUserId },
      attributes: ['menuKey', 'enabled']
    });

    // Convert to object format
    const permissionsObject = {};
    VALID_MENU_KEYS.forEach(key => {
      const permission = updatedPermissions.find(p => p.menuKey === key);
      permissionsObject[key] = permission ? permission.enabled : false;
    });

    return res.json({
      success: true,
      message: 'Permissions updated successfully',
      data: permissionsObject
    });
  } catch (error) {
    console.error('Error bulk updating sub-user menu permissions:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update menu permissions'
    });
  }
};
```

---

## Route Configuration

### Router File

```javascript
// routes/subUser.router.js
const express = require("express");
const permissionController = require("./subUserMenuPermission.controller");
const { sanitize } = require("../../../middleware/sanitizer");
const { jwtStrategy } = require("../../../middleware/strategy");

const subUserRouter = express.Router();

// Menu permissions routes - MUST come before /:id route
subUserRouter
  .route("/:subUserId/menu-permissions")
  .get(sanitize(), jwtStrategy, permissionController.getSubUserMenuPermissions)
  .post(sanitize(), jwtStrategy, permissionController.updateSubUserMenuPermission);

subUserRouter
  .route("/:subUserId/menu-permissions/bulk")
  .post(sanitize(), jwtStrategy, permissionController.bulkUpdateSubUserMenuPermissions);

module.exports = { subUserRouter };
```

### Mounting the Router

**Option 1: Mount at `/api/subUser` (as specified)**

```javascript
// routes/index.js or app.js
const express = require('express');
const { subUserRouter } = require('./subUser.router');

const restRouter = express.Router();

// Mount at /api/subUser to match specified endpoints
restRouter.use("/api/subUser", subUserRouter);

module.exports = { restRouter };
```

**Option 2: Mount at `/auth/sub-users` (if using auth router structure)**

```javascript
// routes/index.js or app.js
const express = require('express');
const { subUserRouter } = require('./subUser.router');

const restRouter = express.Router();

// Mount at /auth/sub-users (alternative structure)
restRouter.use("/auth/sub-users", subUserRouter);

module.exports = { restRouter };
```

**Note:** Choose the mounting path that matches your frontend API calls.

---

## Validation

### Request Validation Middleware

```javascript
// middleware/validators/menuPermissionValidator.js
const { body, param } = require('express-validator');
const { VALID_MENU_KEYS } = require('../../constants/menuKeys');

exports.validateGetPermissions = [
  param('subUserId')
    .isInt({ min: 1 })
    .withMessage('Sub-user ID must be a positive integer')
];

exports.validateUpdatePermission = [
  param('subUserId')
    .isInt({ min: 1 })
    .withMessage('Sub-user ID must be a positive integer'),
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
  param('subUserId')
    .isInt({ min: 1 })
    .withMessage('Sub-user ID must be a positive integer'),
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

### Using Validation in Routes

```javascript
// routes/subUser.router.js
const { validateGetPermissions, validateUpdatePermission, validateBulkUpdate } = require('../middleware/validators/menuPermissionValidator');
const { validationResult } = require('express-validator');

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

subUserRouter
  .route("/:subUserId/menu-permissions")
  .get(
    validateGetPermissions,
    handleValidationErrors,
    sanitize(),
    jwtStrategy,
    permissionController.getSubUserMenuPermissions
  )
  .post(
    validateUpdatePermission,
    handleValidationErrors,
    sanitize(),
    jwtStrategy,
    permissionController.updateSubUserMenuPermission
  );

subUserRouter
  .route("/:subUserId/menu-permissions/bulk")
  .post(
    validateBulkUpdate,
    handleValidationErrors,
    sanitize(),
    jwtStrategy,
    permissionController.bulkUpdateSubUserMenuPermissions
  );
```

---

## Security & Authorization

### Authorization Checks

1. **Role-Based Access**: Only vendors (role "2") and stores (role "3") can manage sub-user permissions
2. **Ownership Verification**: Users can only manage permissions for their own sub-users
3. **Sub-User Status**: Consider checking if sub-user is approved before allowing permission updates

### Enhanced Authorization Middleware

```javascript
// middleware/authorizeSubUserAccess.js
const { SubUser } = require('../models');

/**
 * Middleware to verify user can access a specific sub-user
 */
const authorizeSubUserAccess = async (req, res, next) => {
  try {
    const { subUserId } = req.params;
    const { role, vendorId, storeId } = req.user;

    // Only vendors and stores can access
    if (role !== '2' && role !== '3') {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Only vendors and stores can manage sub-user permissions'
      });
    }

    // Find sub-user
    const subUser = await SubUser.findByPk(subUserId, {
      attributes: ['id', 'vendorId', 'storeId']
    });

    if (!subUser) {
      return res.status(404).json({
        success: false,
        message: 'Sub-user not found'
      });
    }

    // Verify ownership
    if (role === '2') { // Vendor
      if (subUser.vendorId !== vendorId) {
        return res.status(403).json({
          success: false,
          message: 'Access denied: You can only manage permissions for your own sub-users'
        });
      }
    } else if (role === '3') { // Store
      if (subUser.storeId !== storeId) {
        return res.status(403).json({
          success: false,
          message: 'Access denied: You can only manage permissions for your own sub-users'
        });
      }
    }

    // Attach sub-user to request for use in controllers
    req.subUser = subUser;
    next();
  } catch (error) {
    console.error('Authorization error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authorization check failed'
    });
  }
};

module.exports = { authorizeSubUserAccess };
```

### Using Authorization Middleware

```javascript
// routes/subUser.router.js
const { authorizeSubUserAccess } = require('../middleware/authorizeSubUserAccess');

subUserRouter
  .route("/:subUserId/menu-permissions")
  .get(
    sanitize(),
    jwtStrategy,
    authorizeSubUserAccess,
    permissionController.getSubUserMenuPermissions
  )
  .post(
    sanitize(),
    jwtStrategy,
    authorizeSubUserAccess,
    permissionController.updateSubUserMenuPermission
  );
```

---

## Error Handling

### Custom Error Classes

```javascript
// errors/MenuPermissionError.js
class MenuPermissionError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.name = 'MenuPermissionError';
    this.statusCode = statusCode;
  }
}

class InvalidMenuKeyError extends MenuPermissionError {
  constructor(menuKey) {
    super(`Invalid menu key: ${menuKey}`, 400);
    this.name = 'InvalidMenuKeyError';
    this.menuKey = menuKey;
  }
}

class SubUserNotFoundError extends MenuPermissionError {
  constructor(subUserId) {
    super(`Sub-user not found: ${subUserId}`, 404);
    this.name = 'SubUserNotFoundError';
    this.subUserId = subUserId;
  }
}

class UnauthorizedAccessError extends MenuPermissionError {
  constructor(message = 'Unauthorized access') {
    super(message, 403);
    this.name = 'UnauthorizedAccessError';
  }
}

module.exports = {
  MenuPermissionError,
  InvalidMenuKeyError,
  SubUserNotFoundError,
  UnauthorizedAccessError
};
```

### Error Handler Middleware

```javascript
// middleware/errorHandler.js
const { MenuPermissionError } = require('../errors/MenuPermissionError');

const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  if (err instanceof MenuPermissionError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.menuKey && { menuKey: err.menuKey }),
      ...(err.subUserId && { subUserId: err.subUserId })
    });
  }

  // Sequelize errors
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: err.errors.map(e => ({
        field: e.path,
        message: e.message
      }))
    });
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      success: false,
      message: 'Duplicate entry: This permission already exists'
    });
  }

  // Default error
  return res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
};

module.exports = errorHandler;
```

---

## Testing

### Unit Test Example

```javascript
// tests/controllers/subUserMenuPermission.test.js
const request = require('supertest');
const app = require('../../app');
const { SubUser, SubUserMenuPermission } = require('../../models');

describe('Menu Permissions API', () => {
  let vendorToken;
  let subUserId;
  let storeToken;

  beforeAll(async () => {
    // Setup test data
    // Create vendor, store, sub-user
  });

  describe('GET /api/subUser/:subUserId/menu-permissions', () => {
    it('should get menu permissions for sub-user', async () => {
      const response = await request(app)
        .get(`/api/subUser/${subUserId}/menu-permissions`)
        .set('Authorization', `Bearer ${vendorToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('Products');
      expect(typeof response.body.data.Products).toBe('boolean');
    });

    it('should return 403 for unauthorized access', async () => {
      const response = await request(app)
        .get(`/api/subUser/${subUserId}/menu-permissions`)
        .set('Authorization', `Bearer ${storeToken}`) // Different store
        .expect(403);
    });
  });

  describe('POST /api/subUser/:subUserId/menu-permissions', () => {
    it('should update a menu permission', async () => {
      const response = await request(app)
        .post(`/api/subUser/${subUserId}/menu-permissions`)
        .set('Authorization', `Bearer ${vendorToken}`)
        .send({
          menuKey: 'Products',
          enabled: true
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.enabled).toBe(true);
    });

    it('should return 400 for invalid menu key', async () => {
      const response = await request(app)
        .post(`/api/subUser/${subUserId}/menu-permissions`)
        .set('Authorization', `Bearer ${vendorToken}`)
        .send({
          menuKey: 'InvalidKey',
          enabled: true
        })
        .expect(400);
    });
  });

  describe('POST /api/subUser/:subUserId/menu-permissions/bulk', () => {
    it('should bulk update permissions', async () => {
      const response = await request(app)
        .post(`/api/subUser/${subUserId}/menu-permissions/bulk`)
        .set('Authorization', `Bearer ${vendorToken}`)
        .send({
          permissions: {
            Products: true,
            Orders: false,
            Inventory: true
          }
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.Products).toBe(true);
      expect(response.body.data.Orders).toBe(false);
    });
  });
});
```

---

## API Endpoints Summary

### Endpoints (with `/api/subUser` base path)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/subUser/:subUserId/menu-permissions` | Get all permissions | Vendor/Store |
| POST | `/api/subUser/:subUserId/menu-permissions` | Update single permission | Vendor/Store |
| POST | `/api/subUser/:subUserId/menu-permissions/bulk` | Bulk update permissions | Vendor/Store |

### Alternative Endpoints (with `/auth/sub-users` base path)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/auth/sub-users/:subUserId/menu-permissions` | Get all permissions | Vendor/Store |
| POST | `/auth/sub-users/:subUserId/menu-permissions` | Update single permission | Vendor/Store |
| POST | `/auth/sub-users/:subUserId/menu-permissions/bulk` | Bulk update permissions | Vendor/Store |

**Note:** Use the endpoint structure that matches your frontend implementation.

---

## Implementation Checklist

- [ ] Create database model and migration
- [ ] Create controller with all three methods
- [ ] Set up routes with proper ordering
- [ ] Add validation middleware
- [ ] Implement authorization checks
- [ ] Add error handling
- [ ] Write unit tests
- [ ] Test all endpoints
- [ ] Document API responses
- [ ] Add logging for debugging

---

**Last Updated**: Complete backend implementation guide
**Status**: ✅ Ready for implementation

