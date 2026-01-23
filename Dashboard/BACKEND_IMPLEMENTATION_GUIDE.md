# Backend Implementation Guide - Sub-User Management

This guide provides example implementation patterns for the sub-user management system.

## Table of Contents
1. [Database Models](#database-models)
2. [Middleware](#middleware)
3. [Controller Examples](#controller-examples)
4. [Validation](#validation)
5. [Security Considerations](#security-considerations)

---

## Database Models

### Example: Node.js/Express with Sequelize

```javascript
// models/SubUser.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const SubUser = sequelize.define('SubUser', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    firstName: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    phone: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending'
    },
    vendorId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'vendors',
        key: 'id'
      }
    },
    storeId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'stores',
        key: 'id'
      }
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    approvedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    rejectedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    rejectionReason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    approvedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    rejectedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'sub_users',
    timestamps: true
  });

  return SubUser;
};
```

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
      }
    },
    menuKey: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'sub_user_menu_permissions',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['subUserId', 'menuKey']
      }
    ]
  });

  return SubUserMenuPermission;
};
```

---

## Middleware

### Authentication & Authorization Middleware

```javascript
// middleware/auth.js
const jwt = require('jsonwebtoken');

// Verify token
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '') || 
                req.cookies['XSRF-token'] || 
                req.cookies.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

// Check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== '0') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
  next();
};

// Check if user is vendor or store
const isVendorOrStore = (req, res, next) => {
  if (req.user.role !== '2' && req.user.role !== '3') {
    return res.status(403).json({
      success: false,
      message: 'Vendor or Store access required'
    });
  }
  next();
};

// Check if sub-user is approved
const isApprovedSubUser = (req, res, next) => {
  if (req.user.isSubUser && req.user.status !== 'approved') {
    return res.status(403).json({
      success: false,
      message: 'Your account is pending approval'
    });
  }
  next();
};

module.exports = {
  authenticate,
  isAdmin,
  isVendorOrStore,
  isApprovedSubUser
};
```

---

## Controller Examples

### Sub-User Controller

```javascript
// controllers/subUserController.js
const { SubUser, SubUserMenuPermission, User, Vendor, Store } = require('../models');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');

// Get all sub-users for current vendor/store
exports.getSubUsers = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;
    const vendorId = req.user.vendorId;
    const storeId = req.user.storeId;

    const where = {};
    if (role === '2') {
      where.vendorId = vendorId;
    } else if (role === '3') {
      where.storeId = storeId;
    }

    const subUsers = await SubUser.findAll({
      where,
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });

    return res.json({
      success: true,
      data: subUsers,
      count: subUsers.length
    });
  } catch (error) {
    console.error('Error fetching sub-users:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch sub-users'
    });
  }
};

// Create sub-user
exports.createSubUser = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body;
    const userId = req.user.id;
    const role = req.user.role;
    const vendorId = req.user.vendorId || null;
    const storeId = req.user.storeId || null;

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Check if email already exists
    const existingUser = await SubUser.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create sub-user
    const subUser = await SubUser.create({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      status: 'pending',
      vendorId: role === '2' ? vendorId : null,
      storeId: role === '3' ? storeId : null,
      createdBy: userId
    });

    // Create default permissions (all enabled)
    const menuKeys = ['Vendors', 'Vendor', 'Stores', 'Categories', 'Products', 
                      'Customer', 'Subscriptions', 'Orders', 'Inventory', 'Billing'];
    
    const permissions = menuKeys.map(menuKey => ({
      subUserId: subUser.id,
      menuKey,
      enabled: true
    }));

    await SubUserMenuPermission.bulkCreate(permissions);

    // Remove password from response
    const subUserData = subUser.toJSON();
    delete subUserData.password;

    return res.json({
      success: true,
      message: 'Sub-user created successfully. Waiting for admin approval.',
      data: subUserData
    });
  } catch (error) {
    console.error('Error creating sub-user:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create sub-user'
    });
  }
};

// Approve sub-user (Admin only)
exports.approveSubUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;
    const adminId = req.user.id;

    const subUser = await SubUser.findByPk(id);
    if (!subUser) {
      return res.status(404).json({
        success: false,
        message: 'Sub-user not found'
      });
    }

    if (subUser.status === 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Sub-user is already approved'
      });
    }

    if (subUser.status === 'rejected') {
      return res.status(400).json({
        success: false,
        message: 'Cannot approve a rejected sub-user'
      });
    }

    subUser.status = 'approved';
    subUser.approvedBy = adminId;
    subUser.approvedAt = new Date();
    await subUser.save();

    return res.json({
      success: true,
      message: 'Sub-user approved successfully',
      data: {
        id: subUser.id,
        status: subUser.status,
        approvedAt: subUser.approvedAt,
        approvedBy: {
          id: req.user.id,
          name: req.user.name,
          email: req.user.email
        }
      }
    });
  } catch (error) {
    console.error('Error approving sub-user:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to approve sub-user'
    });
  }
};

// Reject sub-user (Admin only)
exports.rejectSubUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const adminId = req.user.id;

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required'
      });
    }

    const subUser = await SubUser.findByPk(id);
    if (!subUser) {
      return res.status(404).json({
        success: false,
        message: 'Sub-user not found'
      });
    }

    if (subUser.status === 'rejected') {
      return res.status(400).json({
        success: false,
        message: 'Sub-user is already rejected'
      });
    }

    subUser.status = 'rejected';
    subUser.rejectedBy = adminId;
    subUser.rejectionReason = reason;
    subUser.rejectedAt = new Date();
    await subUser.save();

    return res.json({
      success: true,
      message: 'Sub-user rejected',
      data: {
        id: subUser.id,
        status: subUser.status,
        rejectedAt: subUser.rejectedAt,
        rejectionReason: subUser.rejectionReason,
        rejectedBy: {
          id: req.user.id,
          name: req.user.name,
          email: req.user.email
        }
      }
    });
  } catch (error) {
    console.error('Error rejecting sub-user:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to reject sub-user'
    });
  }
};

// Get pending sub-users (Admin only)
exports.getPendingSubUsers = async (req, res) => {
  try {
    const pendingUsers = await SubUser.findAll({
      where: { status: 'pending' },
      attributes: { exclude: ['password'] },
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Vendor,
          as: 'vendor',
          attributes: ['id', 'name'],
          required: false
        },
        {
          model: Store,
          as: 'store',
          attributes: ['id', 'storename'],
          required: false
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    const formattedData = pendingUsers.map(user => {
      const userData = user.toJSON();
      userData.vendorName = userData.vendor?.name || null;
      userData.storeName = userData.store?.storename || null;
      return userData;
    });

    return res.json({
      success: true,
      data: formattedData,
      count: formattedData.length
    });
  } catch (error) {
    console.error('Error fetching pending sub-users:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch pending sub-users'
    });
  }
};
```

### Menu Permissions Controller

```javascript
// controllers/subUserMenuPermissionController.js
const { SubUserMenuPermission, SubUser } = require('../models');

// Get menu permissions for sub-user
exports.getSubUserMenuPermissions = async (req, res) => {
  try {
    const { subUserId } = req.params;
    const userId = req.user.id;
    const role = req.user.role;

    // Verify ownership
    const subUser = await SubUser.findByPk(subUserId);
    if (!subUser) {
      return res.status(404).json({
        success: false,
        message: 'Sub-user not found'
      });
    }

    // Check if user owns this sub-user
    if (role === '2' && subUser.vendorId !== req.user.vendorId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    if (role === '3' && subUser.storeId !== req.user.storeId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const permissions = await SubUserMenuPermission.findAll({
      where: { subUserId },
      attributes: ['menuKey', 'enabled']
    });

    // Convert to object format
    const permissionsObj = {};
    permissions.forEach(perm => {
      permissionsObj[perm.menuKey] = perm.enabled;
    });

    return res.json({
      success: true,
      data: permissionsObj
    });
  } catch (error) {
    console.error('Error fetching permissions:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch permissions'
    });
  }
};

// Update menu permission
exports.updateSubUserMenuPermission = async (req, res) => {
  try {
    const { subUserId } = req.params;
    const { menuKey, enabled } = req.body;

    if (!menuKey || typeof enabled !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'Invalid request data'
      });
    }

    // Verify ownership (same as above)
    const subUser = await SubUser.findByPk(subUserId);
    if (!subUser) {
      return res.status(404).json({
        success: false,
        message: 'Sub-user not found'
      });
    }

    // Update or create permission
    await SubUserMenuPermission.upsert({
      subUserId,
      menuKey,
      enabled
    });

    return res.json({
      success: true,
      message: 'Permission updated successfully',
      data: { menuKey, enabled }
    });
  } catch (error) {
    console.error('Error updating permission:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update permission'
    });
  }
};

// Bulk update permissions
exports.bulkUpdateSubUserMenuPermissions = async (req, res) => {
  try {
    const { subUserId } = req.params;
    const { permissions } = req.body;

    if (!permissions || typeof permissions !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Invalid permissions object'
      });
    }

    // Verify ownership
    const subUser = await SubUser.findByPk(subUserId);
    if (!subUser) {
      return res.status(404).json({
        success: false,
        message: 'Sub-user not found'
      });
    }

    // Update all permissions
    const updates = Object.entries(permissions).map(([menuKey, enabled]) => ({
      subUserId,
      menuKey,
      enabled: Boolean(enabled)
    }));

    await Promise.all(
      updates.map(update =>
        SubUserMenuPermission.upsert(update)
      )
    );

    return res.json({
      success: true,
      message: 'Permissions updated successfully',
      data: permissions
    });
  } catch (error) {
    console.error('Error bulk updating permissions:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update permissions'
    });
  }
};
```

---

## Updated Login Controller

```javascript
// controllers/authController.js (updated login method)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check regular users first
    let user = await User.findOne({ where: { email } });
    let isSubUser = false;

    // If not found, check sub-users
    if (!user) {
      user = await SubUser.findOne({ where: { email } });
      isSubUser = true;
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // For sub-users, check status
    if (isSubUser) {
      if (user.status === 'pending') {
        return res.status(403).json({
          success: false,
          message: 'Your account is pending admin approval. Please wait for approval.'
        });
      }
      if (user.status === 'rejected') {
        return res.status(403).json({
          success: false,
          message: 'Your account has been rejected. Please contact your administrator.'
        });
      }
    }

    // Get menu permissions for sub-users
    let menuPermissions = {};
    if (isSubUser && user.status === 'approved') {
      const permissions = await SubUserMenuPermission.findAll({
        where: { subUserId: user.id }
      });
      permissions.forEach(perm => {
        menuPermissions[perm.menuKey] = perm.enabled;
      });
    }

    // Generate token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role || (isSubUser ? (user.vendorId ? '2' : '3') : null),
        vendorId: user.vendorId,
        storeId: user.storeId,
        isSubUser,
        status: isSubUser ? user.status : 'approved'
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.json({
      success: true,
      data: {
        token,
        id: user.id,
        role: user.role || (isSubUser ? (user.vendorId ? '2' : '3') : null),
        vendorId: user.vendorId,
        storeId: user.storeId,
        isSubUser,
        menuPermissions: isSubUser ? menuPermissions : undefined,
        status: isSubUser ? user.status : 'approved',
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
};
```

---

## Routes

**⚠️ CRITICAL: Route Ordering Matters!**

In Express, routes are matched in the order they're defined. More specific routes MUST come before generic routes like `/:id`. Otherwise, routes like `/pending` or `/123/menu-permissions` will be incorrectly matched by `/:id`.

```javascript
// routes/subUser.router.js
const express = require("express");
const subUserController = require("./subUser.controller");
const permissionController = require("./subUserMenuPermission.controller");
const { sanitize } = require("../../../middleware/sanitizer");
const { jwtStrategy } = require("../../../middleware/strategy");
const { requireAdmin } = require("../../../middleware/requireAuth");

const subUserRouter = express.Router();

// ============================================
// IMPORTANT: Route Ordering Rules
// ============================================
// 1. Specific routes (like /list, /create, /pending) come FIRST
// 2. Parameterized routes with paths (like /:subUserId/menu-permissions) come NEXT
// 3. Generic parameter routes (like /:id) come LAST
// ============================================

// Sub-user management routes (Vendor/Store only) - Specific routes first
subUserRouter
  .route("/list")
  .get(sanitize(), jwtStrategy, subUserController.getSubUsers);

subUserRouter
  .route("/create")
  .post(sanitize(), jwtStrategy, subUserController.createSubUser);

subUserRouter
  .route("/update/:id")
  .post(sanitize(), jwtStrategy, subUserController.updateSubUser);

subUserRouter
  .route("/delete/:id")
  .post(sanitize(), jwtStrategy, subUserController.deleteSubUser);

// Admin approval routes - MUST come before /:id route
// Otherwise /pending will match /:id with id="pending"
subUserRouter
  .route("/pending")
  .get(sanitize(), jwtStrategy, requireAdmin, subUserController.getPendingSubUsers);

subUserRouter
  .route("/approve/:id")
  .post(sanitize(), jwtStrategy, requireAdmin, subUserController.approveSubUser);

subUserRouter
  .route("/reject/:id")
  .post(sanitize(), jwtStrategy, requireAdmin, subUserController.rejectSubUser);

// Menu permissions routes - MUST come before /:id route
// Otherwise /123/menu-permissions will match /:id first
subUserRouter
  .route("/:subUserId/menu-permissions")
  .get(sanitize(), jwtStrategy, permissionController.getSubUserMenuPermissions)
  .post(sanitize(), jwtStrategy, permissionController.updateSubUserMenuPermission);

subUserRouter
  .route("/:subUserId/menu-permissions/bulk")
  .post(sanitize(), jwtStrategy, permissionController.bulkUpdateSubUserMenuPermissions);

// Generic /:id route - MUST be last to avoid catching other routes
subUserRouter
  .route("/:id")
  .get(sanitize(), jwtStrategy, subUserController.getSubUserById);

module.exports = { subUserRouter };
```

### Router Mounting

Mount the router in your main routes file:

```javascript
// routes/index.js or app.js
const express = require('express');
const { subUserRouter } = require('./subUser.router');

const restRouter = express.Router();

// Mount sub-user router at /auth/sub-users to match frontend expectations
// Frontend calls: /auth/sub-users/create, /auth/sub-users/list, etc.
restRouter.use("/auth/sub-users", subUserRouter);

// Or if you have a separate auth router:
// authRouter.use("/sub-users", subUserRouter);

module.exports = { restRouter };
```

### Route Matching Examples

With the correct ordering:
- ✅ `GET /auth/sub-users/list` → Matches `/list`
- ✅ `GET /auth/sub-users/pending` → Matches `/pending` (not `/:id`)
- ✅ `GET /auth/sub-users/123/menu-permissions` → Matches `/:subUserId/menu-permissions` (not `/:id`)
- ✅ `GET /auth/sub-users/123` → Matches `/:id` (only when no other route matches)

---

## Security Considerations

1. **Password Hashing:** Always use bcrypt with salt rounds >= 10
2. **Token Expiration:** Set appropriate expiration times
3. **Input Validation:** Validate all inputs using libraries like Joi or express-validator
4. **SQL Injection:** Use parameterized queries (Sequelize handles this)
5. **XSS Protection:** Sanitize user inputs
6. **Rate Limiting:** Implement rate limiting on login endpoints
7. **Audit Logging:** Log all admin actions (approve/reject)

---

## Testing

Example test cases:

```javascript
// tests/subUser.test.js
describe('Sub-User Management', () => {
  it('should create sub-user with pending status', async () => {
    // Test implementation
  });

  it('should prevent login for pending sub-user', async () => {
    // Test implementation
  });

  it('should allow login for approved sub-user', async () => {
    // Test implementation
  });

  it('should filter menu based on permissions', async () => {
    // Test implementation
  });
});
```

---

This guide provides a foundation for implementing the sub-user management system. Adapt the code to your specific framework and requirements.

