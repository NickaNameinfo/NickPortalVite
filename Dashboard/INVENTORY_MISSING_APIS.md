# Missing Backend APIs for Inventory Management System

## Overview

This document lists all missing backend APIs required by the Inventory Management System frontend. All APIs should automatically extract `vendorId`/`storeId` from the authenticated user's JWT token/session.

---

## ✅ Already Implemented (In Backend Routes)

The following APIs are already defined in the backend routes:

1. ✅ `GET /inventory/summary` - Get inventory summary
2. ✅ `GET /inventory/inbound` - Get inbound transactions
3. ✅ `POST /inventory/inbound` - Add inbound transaction
4. ✅ `POST /inventory/inbound/update` - Update inbound transaction
5. ✅ `DELETE /inventory/inbound/:id` - Delete inbound transaction
6. ✅ `GET /inventory/outbound` - Get outbound transactions
7. ✅ `POST /inventory/outbound` - Add outbound transaction
8. ✅ `POST /inventory/outbound/update` - Update outbound transaction
9. ✅ `DELETE /inventory/outbound/:id` - Delete outbound transaction
10. ✅ `GET /inventory/vendor-stats` - Get vendor inventory statistics

---

## ❌ Missing APIs

### 1. Client Management APIs

**Current Status:** Frontend uses `POST /auth/user/update` and `GET /auth/user/getAllUserList`, but these need vendorId filtering.

**Required New Endpoints:**

#### 1.1. Get All Clients (Filtered by Vendor)

**Endpoint:** `GET /inventory/clients`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `search` (string, optional) - Search by name, email, or phone
- `page` (number, optional) - Page number for pagination
- `limit` (number, optional) - Items per page

**Implementation:**
```javascript
// Backend Route
inventoryRouter
  .route("/clients")
  .get(sanitize(), jwtStrategy, inventoryController.getClients);

// Controller
exports.getClients = async (req, res) => {
  try {
    const vendorId = req.user.vendorId || req.user.storeId;
    
    if (!vendorId) {
      return res.status(403).json({
        success: false,
        message: "Vendor/Store ID not found in user session"
      });
    }

    const { search, page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = { vendorId }; // Filter by vendorId

    if (search) {
      whereClause[Op.or] = [
        { firstName: { [Op.like]: `%${search}%` } },
        { lastName: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { phone: { [Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows } = await User.findAndCountAll({
      where: whereClause,
      attributes: [
        'id', 'firstName', 'lastName', 'email', 'phone', 
        'address', 'city', 'gstNumber', 'logo', 'branches',
        'createdAt', 'updatedAt'
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching clients:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch clients",
      error: error.message
    });
  }
};
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
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 50,
    "totalPages": 2
  }
}
```

---

#### 1.2. Get Client by ID

**Endpoint:** `GET /inventory/clients/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Implementation:**
```javascript
// Backend Route
inventoryRouter
  .route("/clients/:id")
  .get(sanitize(), jwtStrategy, inventoryController.getClientById);

// Controller
exports.getClientById = async (req, res) => {
  try {
    const vendorId = req.user.vendorId || req.user.storeId;
    const { id } = req.params;

    if (!vendorId) {
      return res.status(403).json({
        success: false,
        message: "Vendor/Store ID not found in user session"
      });
    }

    const client = await User.findOne({
      where: { id, vendorId }, // Verify ownership
      attributes: [
        'id', 'firstName', 'lastName', 'email', 'phone', 
        'address', 'city', 'gstNumber', 'logo', 'branches',
        'createdAt', 'updatedAt'
      ]
    });

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found or does not belong to your store"
      });
    }

    return res.status(200).json({
      success: true,
      data: client
    });
  } catch (error) {
    console.error("Error fetching client:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch client",
      error: error.message
    });
  }
};
```

---

#### 1.3. Create Client

**Endpoint:** `POST /inventory/clients`

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
  "email": "john@example.com",
  "phone": "9876543210",
  "address": "123 Main St",
  "city": "Mumbai",
  "gstNumber": "22AAAAA0000A1Z5",
  "logo": "uploads/clients/logo-456.jpg",
  "branches": "[{\"name\":\"Branch 1\",\"address\":\"Address 1\",\"phone\":\"9876543211\",\"city\":\"Mumbai\"}]"
}
```

**Implementation:**
```javascript
// Backend Route
inventoryRouter
  .route("/clients")
  .post(sanitize(), jwtStrategy, inventoryController.createClient);

// Controller
exports.createClient = async (req, res) => {
  try {
    const vendorId = req.user.vendorId || req.user.storeId;
    
    if (!vendorId) {
      return res.status(403).json({
        success: false,
        message: "Vendor/Store ID not found in user session"
      });
    }

    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      gstNumber,
      logo,
      branches
    } = req.body;

    // Validation
    if (!firstName || firstName.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "First name is required and must be at least 2 characters"
      });
    }

    if (!email || !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Valid email is required"
      });
    }

    if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "Valid 10-digit phone number is required"
      });
    }

    // Check if email already exists for this vendor
    const existingClient = await User.findOne({
      where: { email, vendorId }
    });

    if (existingClient) {
      return res.status(400).json({
        success: false,
        message: "Client with this email already exists"
      });
    }

    // Validate branches JSON
    let branchesData = [];
    if (branches) {
      try {
        branchesData = typeof branches === 'string' ? JSON.parse(branches) : branches;
        if (!Array.isArray(branchesData)) {
          return res.status(400).json({
            success: false,
            message: "Branches must be a valid JSON array"
          });
        }
      } catch (e) {
        return res.status(400).json({
          success: false,
          message: "Invalid branches JSON format"
        });
      }
    }

    // Create client
    const client = await User.create({
      firstName,
      lastName: lastName || null,
      email,
      phone,
      address: address || null,
      city: city || null,
      gstNumber: gstNumber || null,
      logo: logo || null,
      branches: JSON.stringify(branchesData),
      vendorId, // Automatically set from session
      role: 'client' // or appropriate role
    });

    return res.status(201).json({
      success: true,
      message: "Client created successfully",
      data: client
    });
  } catch (error) {
    console.error("Error creating client:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create client",
      error: error.message
    });
  }
};
```

---

#### 1.4. Update Client

**Endpoint:** `PUT /inventory/clients/:id` or `POST /inventory/clients/update`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "id": 456,
  "firstName": "John Updated",
  "lastName": "Doe",
  "email": "john.updated@example.com",
  "phone": "9876543210",
  "address": "123 Main St Updated",
  "city": "Mumbai",
  "gstNumber": "22AAAAA0000A1Z5",
  "logo": "uploads/clients/logo-456-updated.jpg",
  "branches": "[{\"name\":\"Branch 1 Updated\",\"address\":\"Address 1\",\"phone\":\"9876543211\",\"city\":\"Mumbai\"}]"
}
```

**Implementation:**
```javascript
// Backend Route
inventoryRouter
  .route("/clients/:id")
  .put(sanitize(), jwtStrategy, inventoryController.updateClient);

// Or use POST /inventory/clients/update
inventoryRouter
  .route("/clients/update")
  .post(sanitize(), jwtStrategy, inventoryController.updateClient);

// Controller
exports.updateClient = async (req, res) => {
  try {
    const vendorId = req.user.vendorId || req.user.storeId;
    const clientId = req.params.id || req.body.id;

    if (!vendorId) {
      return res.status(403).json({
        success: false,
        message: "Vendor/Store ID not found in user session"
      });
    }

    if (!clientId) {
      return res.status(400).json({
        success: false,
        message: "Client ID is required"
      });
    }

    // Find and verify ownership
    const client = await User.findOne({
      where: { id: clientId, vendorId }
    });

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found or does not belong to your store"
      });
    }

    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      gstNumber,
      logo,
      branches
    } = req.body;

    // Validate email if changed
    if (email && email !== client.email) {
      const existingClient = await User.findOne({
        where: { email, vendorId, id: { [Op.ne]: clientId } }
      });

      if (existingClient) {
        return res.status(400).json({
          success: false,
          message: "Email already exists for another client"
        });
      }
    }

    // Validate branches if provided
    if (branches) {
      try {
        const branchesData = typeof branches === 'string' ? JSON.parse(branches) : branches;
        if (!Array.isArray(branchesData)) {
          return res.status(400).json({
            success: false,
            message: "Branches must be a valid JSON array"
          });
        }
        req.body.branches = JSON.stringify(branchesData);
      } catch (e) {
        return res.status(400).json({
          success: false,
          message: "Invalid branches JSON format"
        });
      }
    }

    // Update client
    await client.update(req.body);

    return res.status(200).json({
      success: true,
      message: "Client updated successfully",
      data: client
    });
  } catch (error) {
    console.error("Error updating client:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update client",
      error: error.message
    });
  }
};
```

---

#### 1.5. Delete Client

**Endpoint:** `DELETE /inventory/clients/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Implementation:**
```javascript
// Backend Route
inventoryRouter
  .route("/clients/:id")
  .delete(sanitize(), jwtStrategy, inventoryController.deleteClient);

// Controller
exports.deleteClient = async (req, res) => {
  try {
    const vendorId = req.user.vendorId || req.user.storeId;
    const { id } = req.params;

    if (!vendorId) {
      return res.status(403).json({
        success: false,
        message: "Vendor/Store ID not found in user session"
      });
    }

    // Find and verify ownership
    const client = await User.findOne({
      where: { id, vendorId }
    });

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found or does not belong to your store"
      });
    }

    // Check if client has associated transactions/products
    const hasTransactions = await InboundTransaction.count({
      where: { clientId: id, vendorId }
    });

    if (hasTransactions > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete client with associated transactions. Please remove transactions first."
      });
    }

    // Delete client
    await client.destroy();

    return res.status(200).json({
      success: true,
      message: "Client deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting client:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete client",
      error: error.message
    });
  }
};
```

---

### 2. Product APIs (Need VendorId Filtering)

**Current Status:** Product APIs exist but need to be updated to filter by vendorId automatically.

**Required Updates:**

#### 2.1. Get All Products

**Current Endpoint:** `GET /product/getAllproductList`

**Required Changes:**
- Automatically filter by `vendorId` from session
- Support filtering by `clientId` (for client products)
- Support filtering by `createdType` (e.g., "Client")

**Updated Implementation:**
```javascript
// In product controller
exports.getAllProducts = async (req, res) => {
  try {
    const vendorId = req.user.vendorId || req.user.storeId;
    
    if (!vendorId) {
      return res.status(403).json({
        success: false,
        message: "Vendor/Store ID not found in user session"
      });
    }

    const { clientId, createdType, categoryId } = req.query;

    const whereClause = { vendorId }; // Auto-filter by vendorId

    if (clientId) {
      whereClause.clientId = clientId;
    }

    if (createdType) {
      whereClause.createdType = createdType;
    }

    if (categoryId) {
      whereClause.categoryId = categoryId;
    }

    const products = await Product.findAll({
      where: whereClause,
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name']
        },
        {
          model: User,
          as: 'client',
          attributes: ['id', 'firstName', 'lastName', 'email', 'logo'],
          where: clientId ? { id: clientId } : undefined,
          required: false
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message
    });
  }
};
```

---

#### 2.2. Get Product by ID

**Current Endpoint:** `GET /product/getProductById/:id`

**Required Changes:**
- Verify product belongs to vendorId from session

**Updated Implementation:**
```javascript
exports.getProductById = async (req, res) => {
  try {
    const vendorId = req.user.vendorId || req.user.storeId;
    const { id } = req.params;

    if (!vendorId) {
      return res.status(403).json({
        success: false,
        message: "Vendor/Store ID not found in user session"
      });
    }

    const product = await Product.findOne({
      where: { id, vendorId }, // Verify ownership
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name']
        },
        {
          model: User,
          as: 'client',
          attributes: ['id', 'firstName', 'lastName', 'email', 'logo'],
          required: false
        }
      ]
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found or does not belong to your store"
      });
    }

    return res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch product",
      error: error.message
    });
  }
};
```

---

#### 2.3. Add Product

**Current Endpoint:** `POST /product/add`

**Required Changes:**
- Automatically set `vendorId` from session
- Automatically set `createdId` from session

**Updated Implementation:**
```javascript
exports.addProduct = async (req, res) => {
  try {
    const vendorId = req.user.vendorId || req.user.storeId;
    const userId = req.user.id;
    
    if (!vendorId) {
      return res.status(403).json({
        success: false,
        message: "Vendor/Store ID not found in user session"
      });
    }

    const {
      name,
      sortDesc,
      total,
      unitSize,
      categoryId,
      photo,
      createdType,
      clientId,
      // ... other fields
    } = req.body;

    // Validation
    if (!name || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Product name is required and must be at least 2 characters"
      });
    }

    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: "Category is required"
      });
    }

    if (total === undefined || total < 0) {
      return res.status(400).json({
        success: false,
        message: "Valid price is required"
      });
    }

    if (unitSize === undefined || unitSize < 1) {
      return res.status(400).json({
        success: false,
        message: "Valid unit size (stock) is required"
      });
    }

    // Create product
    const product = await Product.create({
      name,
      sortDesc: sortDesc || null,
      total,
      unitSize,
      categoryId,
      photo: photo || null,
      createdType: createdType || "Client",
      createdId: vendorId, // Auto-set from session
      vendorId, // Auto-set from session
      clientId: clientId || null,
      subCategoryId: 3,
      childCategoryId: 3,
      slug: `${new Date().getTime()}`,
      isEnableEcommerce: "0",
      isEnableCustomize: "0",
      paymentMode: "",
      serviceType: "Product"
    });

    return res.status(201).json({
      success: true,
      message: "Product added successfully",
      data: product
    });
  } catch (error) {
    console.error("Error adding product:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add product",
      error: error.message
    });
  }
};
```

---

#### 2.4. Update Product

**Current Endpoint:** `POST /product/update`

**Required Changes:**
- Verify product belongs to vendorId from session

**Updated Implementation:**
```javascript
exports.updateProduct = async (req, res) => {
  try {
    const vendorId = req.user.vendorId || req.user.storeId;
    const { id } = req.body;

    if (!vendorId) {
      return res.status(403).json({
        success: false,
        message: "Vendor/Store ID not found in user session"
      });
    }

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required"
      });
    }

    // Find and verify ownership
    const product = await Product.findOne({
      where: { id, vendorId }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found or does not belong to your store"
      });
    }

    // Update product
    await product.update(req.body);

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product
    });
  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update product",
      error: error.message
    });
  }
};
```

---

### 3. User/Client List API (Needs VendorId Filtering)

**Current Endpoint:** `GET /auth/user/getAllUserList`

**Required Changes:**
- Filter by `vendorId` automatically
- Only return clients/users associated with the authenticated vendor

**Updated Implementation:**
```javascript
// In user controller
exports.getAllUserList = async (req, res) => {
  try {
    const vendorId = req.user.vendorId || req.user.storeId;
    
    if (!vendorId) {
      return res.status(403).json({
        success: false,
        message: "Vendor/Store ID not found in user session"
      });
    }

    // Filter users by vendorId (clients associated with this vendor)
    const users = await User.findAll({
      where: { vendorId },
      attributes: [
        'id', 'firstName', 'lastName', 'email', 'phone',
        'address', 'city', 'gstNumber', 'logo', 'branches',
        'createdAt', 'updatedAt'
      ],
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message
    });
  }
};
```

---

### 4. File Upload API (Needs storeName Fix)

**Current Endpoint:** `POST /auth/upload-file`

**Required Changes:**
- Accept `storeName` in FormData (currently missing, causing error)
- Create directory structure: `uploads/{storeName}/{fileType}/`

**Updated Implementation:**
```javascript
// In upload controller
exports.uploadFile = async (req, res) => {
  try {
    // Get storeName from FormData or user session
    const storeName = req.body.storeName || 
                     req.user.storename || 
                     req.user.storeName ||
                     req.user.vendorId ||
                     req.user.storeId;

    if (!storeName) {
      return res.status(400).json({
        success: false,
        message: "Store name is missing. Cannot create file directory.",
        debug: {
          bodyKeys: Object.keys(req.body),
          body: req.body,
          query: req.query,
          hasFile: !!req.file
        }
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded"
      });
    }

    // Determine file type from request
    let fileType = 'general';
    if (req.body.invoiceNumber) fileType = 'invoices';
    else if (req.body.productName) fileType = 'products';
    else if (req.body.clientName) fileType = 'clients';
    else fileType = 'general';

    // Create directory structure
    const uploadDir = path.join(
      __dirname, 
      '../../uploads', 
      String(storeName), 
      fileType
    );

    // Ensure directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Generate unique filename
    const fileExt = path.extname(req.file.originalname);
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}${fileExt}`;
    const filePath = path.join(uploadDir, fileName);

    // Move file
    fs.renameSync(req.file.path, filePath);

    // Return relative path
    const relativePath = `uploads/${storeName}/${fileType}/${fileName}`;

    return res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      fileUrl: relativePath,
      data: {
        filename: fileName,
        path: relativePath,
        size: req.file.size,
        mimetype: req.file.mimetype
      }
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to upload file",
      error: error.message
    });
  }
};
```

---

## Complete Backend Routes File

Here's the complete routes file with all missing endpoints:

```javascript
const express = require("express");
const inventoryController = require("./inventory.controller");
const { sanitize } = require("../../../middleware/sanitizer");
const { jwtStrategy } = require("../../../middleware/strategy");

const inventoryRouter = express.Router();

// ========== EXISTING ROUTES ==========

// Inventory Summary
inventoryRouter
  .route("/summary")
  .get(sanitize(), jwtStrategy, inventoryController.getInventorySummary);

// Inbound Transactions
inventoryRouter
  .route("/inbound")
  .get(sanitize(), jwtStrategy, inventoryController.getInboundTransactions)
  .post(sanitize(), jwtStrategy, inventoryController.addInboundTransaction);

inventoryRouter
  .route("/inbound/update")
  .post(sanitize(), jwtStrategy, inventoryController.updateInboundTransaction);

inventoryRouter
  .route("/inbound/:id")
  .delete(sanitize(), jwtStrategy, inventoryController.deleteInboundTransaction);

// Outbound Transactions
inventoryRouter
  .route("/outbound")
  .get(sanitize(), jwtStrategy, inventoryController.getOutboundTransactions)
  .post(sanitize(), jwtStrategy, inventoryController.addOutboundTransaction);

inventoryRouter
  .route("/outbound/update")
  .post(sanitize(), jwtStrategy, inventoryController.updateOutboundTransaction);

inventoryRouter
  .route("/outbound/:id")
  .delete(sanitize(), jwtStrategy, inventoryController.deleteOutboundTransaction);

// Vendor Inventory Statistics
inventoryRouter
  .route("/vendor-stats")
  .get(sanitize(), jwtStrategy, inventoryController.getVendorInventoryStats);

// ========== NEW ROUTES (MISSING) ==========

// Client Management
inventoryRouter
  .route("/clients")
  .get(sanitize(), jwtStrategy, inventoryController.getClients)
  .post(sanitize(), jwtStrategy, inventoryController.createClient);

inventoryRouter
  .route("/clients/update")
  .post(sanitize(), jwtStrategy, inventoryController.updateClient);

inventoryRouter
  .route("/clients/:id")
  .get(sanitize(), jwtStrategy, inventoryController.getClientById)
  .put(sanitize(), jwtStrategy, inventoryController.updateClient)
  .delete(sanitize(), jwtStrategy, inventoryController.deleteClient);

module.exports = { inventoryRouter };
```

---

## Summary of Missing APIs

| # | Endpoint | Method | Status | Priority |
|---|----------|--------|--------|----------|
| 1 | `/inventory/clients` | GET | ❌ Missing | High |
| 2 | `/inventory/clients` | POST | ❌ Missing | High |
| 3 | `/inventory/clients/:id` | GET | ❌ Missing | High |
| 4 | `/inventory/clients/:id` | PUT | ❌ Missing | High |
| 5 | `/inventory/clients/:id` | DELETE | ❌ Missing | Medium |
| 6 | `/product/getAllproductList` | GET | ⚠️ Needs Update | High |
| 7 | `/product/getProductById/:id` | GET | ⚠️ Needs Update | High |
| 8 | `/product/add` | POST | ⚠️ Needs Update | High |
| 9 | `/product/update` | POST | ⚠️ Needs Update | High |
| 10 | `/auth/user/getAllUserList` | GET | ⚠️ Needs Update | High |
| 11 | `/auth/upload-file` | POST | ⚠️ Needs Fix | Critical |

---

## Implementation Priority

### Critical (Fix Immediately)
1. **File Upload API** - Currently broken, needs `storeName` handling
2. **Client Create API** - Frontend shows alert, needs implementation

### High Priority
3. **Get Clients API** - Used by ClientList page
4. **Get Client by ID** - Used by AddClient edit mode
5. **Update Client API** - Used by AddClient edit mode
6. **Product APIs with vendorId filtering** - Security issue

### Medium Priority
7. **Delete Client API** - Nice to have
8. **User List API with vendorId filtering** - Security improvement

---

## Database Schema Requirements

### User/Client Table
Ensure the following fields exist:
- `vendorId` (INTEGER, Foreign Key) - Links client to vendor
- `branches` (TEXT/JSON) - Stores branches as JSON string
- `gstNumber` (STRING(15)) - GST number
- `logo` (STRING) - Logo file path

### Product Table
Ensure the following fields exist:
- `vendorId` (INTEGER, Foreign Key) - Links product to vendor
- `clientId` (INTEGER, Foreign Key, nullable) - Links to client
- `createdType` (STRING) - "Client" or "Vendor"
- `createdId` (INTEGER) - Vendor/Store ID who created it

### Indexes Required
```sql
-- User/Client table
CREATE INDEX idx_user_vendor ON User(vendorId);
CREATE INDEX idx_user_email_vendor ON User(email, vendorId);

-- Product table
CREATE INDEX idx_product_vendor ON Product(vendorId);
CREATE INDEX idx_product_client ON Product(clientId);
CREATE INDEX idx_product_vendor_type ON Product(vendorId, createdType);
```

---

## Testing Requirements

For each new/updated API, test:
1. ✅ Authentication required
2. ✅ VendorId extracted from session correctly
3. ✅ Users can only access their own data
4. ✅ Validation works correctly
5. ✅ Error handling is proper
6. ✅ File uploads work with storeName
7. ✅ Pagination works (if implemented)
8. ✅ Filtering works correctly

---

## Notes

1. **All APIs must extract vendorId from `req.user`** (set by JWT middleware)
2. **No vendorId should be passed from frontend** in URLs or request bodies
3. **File uploads require `storeName`** in FormData (frontend now sends this)
4. **Client management can use existing User model** but needs vendorId filtering
5. **Product APIs need updates** to filter by vendorId automatically

---

## Next Steps

1. Implement missing Client Management APIs (5 endpoints)
2. Update Product APIs to filter by vendorId (4 endpoints)
3. Update User List API to filter by vendorId (1 endpoint)
4. Fix File Upload API to handle storeName (1 endpoint)
5. Add database indexes for performance
6. Test all endpoints thoroughly
7. Update frontend to use new client endpoints (optional, can keep using user endpoints with filtering)

