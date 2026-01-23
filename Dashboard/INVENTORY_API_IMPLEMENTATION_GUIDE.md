# Inventory Management System - Backend Implementation Guide

## Overview

This document provides a complete implementation guide for the Inventory Management System backend APIs based on the actual routes and frontend requirements.

**Key Implementation Points:**
1. All endpoints extract `vendorId`/`storeId` from JWT token (`req.user`)
2. No `vendorId` should be passed in URLs or request bodies from frontend
3. All database queries must filter by `vendorId` for security
4. Stock is automatically updated on inbound (increase) and outbound (decrease) transactions
5. File uploads require `storeName` in FormData to create directory structure

---

## Backend Routes Structure

```javascript
const express = require("express");
const inventoryController = require("./inventory.controller");
const { sanitize } = require("../../../middleware/sanitizer");
const { jwtStrategy } = require("../../../middleware/strategy");

const inventoryRouter = express.Router();

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

module.exports = { inventoryRouter };
```

---

## Controller Implementation Guide

### 1. Get Inventory Summary

**Route:** `GET /inventory/summary`

**Controller Method:** `getInventorySummary`

**Implementation:**

```javascript
exports.getInventorySummary = async (req, res) => {
  try {
    // Extract vendor/store ID from authenticated user's session
    const vendorId = req.user.vendorId || req.user.storeId;
    
    if (!vendorId) {
      return res.status(403).json({
        success: false,
        message: "Vendor/Store ID not found in user session"
      });
    }

    // Calculate summary statistics
    const totalInbound = await InboundTransaction.count({
      where: { vendorId }
    });

    const currentStock = await Product.sum('unitSize', {
      where: { 
        vendorId,
        createdType: 'Client' // or based on your product model
      }
    }) || 0;

    // Get low stock products (unitSize < threshold, e.g., 10)
    const lowStockAlerts = await Product.count({
      where: {
        vendorId,
        unitSize: { [Op.lt]: 10 } // Less than 10
      }
    });

    return res.status(200).json({
      success: true,
      data: {
        totalInbound,
        currentStock,
        lowStockAlerts
      }
    });
  } catch (error) {
    console.error("Error fetching inventory summary:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch inventory summary",
      error: error.message
    });
  }
};
```

---

### 2. Get Inbound Transactions

**Route:** `GET /inventory/inbound`

**Controller Method:** `getInboundTransactions`

**Query Parameters:**
- `startDate` (optional) - Filter start date (YYYY-MM-DD)
- `endDate` (optional) - Filter end date (YYYY-MM-DD)
- `productId` (optional) - Filter by product ID
- `clientId` (optional) - Filter by client ID

**Implementation:**

```javascript
exports.getInboundTransactions = async (req, res) => {
  try {
    const vendorId = req.user.vendorId || req.user.storeId;
    
    if (!vendorId) {
      return res.status(403).json({
        success: false,
        message: "Vendor/Store ID not found in user session"
      });
    }

    const { startDate, endDate, productId, clientId } = req.query;

    // Build where clause
    const whereClause = { vendorId };

    if (startDate || endDate) {
      whereClause.date = {};
      if (startDate) whereClause.date[Op.gte] = startDate;
      if (endDate) whereClause.date[Op.lte] = endDate;
    }

    if (productId) {
      whereClause.productId = productId;
    }

    if (clientId) {
      whereClause.clientId = clientId;
    }

    // Fetch transactions with related data
    const transactions = await InboundTransaction.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'client',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone']
        },
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'photo']
        },
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name']
        }
      ],
      order: [['date', 'DESC'], ['createdAt', 'DESC']]
    });

    return res.status(200).json({
      success: true,
      data: transactions
    });
  } catch (error) {
    console.error("Error fetching inbound transactions:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch inbound transactions",
      error: error.message
    });
  }
};
```

---

### 3. Add Inbound Transaction

**Route:** `POST /inventory/inbound`

**Controller Method:** `addInboundTransaction`

**Request Body:**
```json
{
  "clientId": 456,
  "productId": 789,
  "quantity": 50,
  "invoiceNumber": "INV-2024-001",
  "invoice": "uploads/invoices/inv-2024-001.pdf",
  "date": "2024-01-15",
  "referenceNumber": "REF-001",
  "notes": "Initial stock purchase"
}
```

**Implementation:**

```javascript
exports.addInboundTransaction = async (req, res) => {
  try {
    const vendorId = req.user.vendorId || req.user.storeId;
    
    if (!vendorId) {
      return res.status(403).json({
        success: false,
        message: "Vendor/Store ID not found in user session"
      });
    }

    const {
      clientId,
      productId,
      quantity,
      invoiceNumber,
      invoice,
      date,
      referenceNumber,
      notes
    } = req.body;

    // Validation
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required"
      });
    }

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1"
      });
    }

    if (!invoiceNumber || invoiceNumber.length < 3) {
      return res.status(400).json({
        success: false,
        message: "Invoice number is required and must be at least 3 characters"
      });
    }

    if (!invoice) {
      return res.status(400).json({
        success: false,
        message: "Invoice file is required"
      });
    }

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Date is required"
      });
    }

    // Validate date (not in future, not before 2000)
    const transactionDate = new Date(date);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    const minDate = new Date("2000-01-01");

    if (transactionDate > today) {
      return res.status(400).json({
        success: false,
        message: "Date cannot be in the future"
      });
    }

    if (transactionDate < minDate) {
      return res.status(400).json({
        success: false,
        message: "Date cannot be before year 2000"
      });
    }

    // Verify product exists and belongs to vendor
    const product = await Product.findOne({
      where: { id: productId, vendorId }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found or does not belong to your store"
      });
    }

    // Verify client exists if provided
    if (clientId) {
      const client = await User.findOne({
        where: { id: clientId }
      });

      if (!client) {
        return res.status(404).json({
          success: false,
          message: "Client not found"
        });
      }
    }

    // Create transaction
    const transaction = await InboundTransaction.create({
      vendorId,
      clientId: clientId || null,
      productId,
      quantity,
      invoiceNumber,
      invoice,
      date,
      referenceNumber: referenceNumber || null,
      notes: notes || null
    });

    // Update product stock
    await Product.increment('unitSize', {
      by: quantity,
      where: { id: productId }
    });

    return res.status(201).json({
      success: true,
      message: "Inbound transaction added successfully",
      data: transaction
    });
  } catch (error) {
    console.error("Error adding inbound transaction:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add inbound transaction",
      error: error.message
    });
  }
};
```

---

### 4. Update Inbound Transaction

**Route:** `POST /inventory/inbound/update`

**Controller Method:** `updateInboundTransaction`

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

**Implementation:**

```javascript
exports.updateInboundTransaction = async (req, res) => {
  try {
    const vendorId = req.user.vendorId || req.user.storeId;
    
    if (!vendorId) {
      return res.status(403).json({
        success: false,
        message: "Vendor/Store ID not found in user session"
      });
    }

    const { id, ...updateData } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Transaction ID is required"
      });
    }

    // Find transaction and verify ownership
    const transaction = await InboundTransaction.findOne({
      where: { id, vendorId }
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found or does not belong to your store"
      });
    }

    // Calculate quantity difference for stock update
    const quantityDiff = updateData.quantity 
      ? updateData.quantity - transaction.quantity 
      : 0;

    // Update transaction
    await transaction.update(updateData);

    // Update product stock if quantity changed
    if (quantityDiff !== 0) {
      await Product.increment('unitSize', {
        by: quantityDiff,
        where: { id: transaction.productId }
      });
    }

    return res.status(200).json({
      success: true,
      message: "Inbound transaction updated successfully",
      data: transaction
    });
  } catch (error) {
    console.error("Error updating inbound transaction:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update inbound transaction",
      error: error.message
    });
  }
};
```

---

### 5. Delete Inbound Transaction

**Route:** `DELETE /inventory/inbound/:id`

**Controller Method:** `deleteInboundTransaction`

**Implementation:**

```javascript
exports.deleteInboundTransaction = async (req, res) => {
  try {
    const vendorId = req.user.vendorId || req.user.storeId;
    const { id } = req.params;

    if (!vendorId) {
      return res.status(403).json({
        success: false,
        message: "Vendor/Store ID not found in user session"
      });
    }

    // Find transaction and verify ownership
    const transaction = await InboundTransaction.findOne({
      where: { id, vendorId }
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found or does not belong to your store"
      });
    }

    // Decrease product stock
    await Product.decrement('unitSize', {
      by: transaction.quantity,
      where: { id: transaction.productId }
    });

    // Delete transaction
    await transaction.destroy();

    return res.status(200).json({
      success: true,
      message: "Transaction deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting inbound transaction:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete transaction",
      error: error.message
    });
  }
};
```

---

### 6. Get Outbound Transactions

**Route:** `GET /inventory/outbound`

**Controller Method:** `getOutboundTransactions`

**Query Parameters:**
- `startDate` (optional) - Filter start date (YYYY-MM-DD)
- `endDate` (optional) - Filter end date (YYYY-MM-DD)
- `productId` (optional) - Filter by product ID
- `orderId` (optional) - Filter by order ID

**Implementation:**

```javascript
exports.getOutboundTransactions = async (req, res) => {
  try {
    const vendorId = req.user.vendorId || req.user.storeId;
    
    if (!vendorId) {
      return res.status(403).json({
        success: false,
        message: "Vendor/Store ID not found in user session"
      });
    }

    const { startDate, endDate, productId, orderId } = req.query;

    const whereClause = { vendorId };

    if (startDate || endDate) {
      whereClause.date = {};
      if (startDate) whereClause.date[Op.gte] = startDate;
      if (endDate) whereClause.date[Op.lte] = endDate;
    }

    if (productId) whereClause.productId = productId;
    if (orderId) whereClause.orderId = orderId;

    const transactions = await OutboundTransaction.findAll({
      where: whereClause,
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'photo']
        }
      ],
      order: [['date', 'DESC'], ['createdAt', 'DESC']]
    });

    return res.status(200).json({
      success: true,
      data: transactions
    });
  } catch (error) {
    console.error("Error fetching outbound transactions:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch outbound transactions",
      error: error.message
    });
  }
};
```

---

### 7. Add Outbound Transaction

**Route:** `POST /inventory/outbound`

**Controller Method:** `addOutboundTransaction`

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

**Implementation:**

```javascript
exports.addOutboundTransaction = async (req, res) => {
  try {
    const vendorId = req.user.vendorId || req.user.storeId;
    
    if (!vendorId) {
      return res.status(403).json({
        success: false,
        message: "Vendor/Store ID not found in user session"
      });
    }

    const { productId, quantity, orderId, date, notes } = req.body;

    // Validation
    if (!productId || !quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Product ID and valid quantity are required"
      });
    }

    // Verify product exists and belongs to vendor
    const product = await Product.findOne({
      where: { id: productId, vendorId }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found or does not belong to your store"
      });
    }

    // Check stock availability
    if (product.unitSize < quantity) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock. Available: ${product.unitSize}, Requested: ${quantity}`
      });
    }

    // Create transaction
    const transaction = await OutboundTransaction.create({
      vendorId,
      productId,
      quantity,
      orderId: orderId || null,
      date: date || new Date().toISOString().split('T')[0],
      notes: notes || null
    });

    // Decrease product stock
    await Product.decrement('unitSize', {
      by: quantity,
      where: { id: productId }
    });

    return res.status(201).json({
      success: true,
      message: "Outbound transaction added successfully",
      data: transaction
    });
  } catch (error) {
    console.error("Error adding outbound transaction:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add outbound transaction",
      error: error.message
    });
  }
};
```

---

### 8. Update Outbound Transaction

**Route:** `POST /inventory/outbound/update`

**Controller Method:** `updateOutboundTransaction`

**Implementation:**

```javascript
exports.updateOutboundTransaction = async (req, res) => {
  try {
    const vendorId = req.user.vendorId || req.user.storeId;
    const { id, ...updateData } = req.body;

    if (!vendorId) {
      return res.status(403).json({
        success: false,
        message: "Vendor/Store ID not found in user session"
      });
    }

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Transaction ID is required"
      });
    }

    const transaction = await OutboundTransaction.findOne({
      where: { id, vendorId }
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found or does not belong to your store"
      });
    }

    // Calculate quantity difference
    const quantityDiff = updateData.quantity 
      ? updateData.quantity - transaction.quantity 
      : 0;

    // Check stock if increasing quantity
    if (quantityDiff > 0) {
      const product = await Product.findOne({
        where: { id: transaction.productId }
      });

      if (product.unitSize < quantityDiff) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock. Available: ${product.unitSize}, Additional needed: ${quantityDiff}`
        });
      }
    }

    await transaction.update(updateData);

    // Update stock
    if (quantityDiff !== 0) {
      await Product.increment('unitSize', {
        by: -quantityDiff, // Negative because outbound decreases stock
        where: { id: transaction.productId }
      });
    }

    return res.status(200).json({
      success: true,
      message: "Outbound transaction updated successfully",
      data: transaction
    });
  } catch (error) {
    console.error("Error updating outbound transaction:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update outbound transaction",
      error: error.message
    });
  }
};
```

---

### 9. Delete Outbound Transaction

**Route:** `DELETE /inventory/outbound/:id`

**Controller Method:** `deleteOutboundTransaction`

**Implementation:**

```javascript
exports.deleteOutboundTransaction = async (req, res) => {
  try {
    const vendorId = req.user.vendorId || req.user.storeId;
    const { id } = req.params;

    if (!vendorId) {
      return res.status(403).json({
        success: false,
        message: "Vendor/Store ID not found in user session"
      });
    }

    const transaction = await OutboundTransaction.findOne({
      where: { id, vendorId }
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found or does not belong to your store"
      });
    }

    // Restore product stock
    await Product.increment('unitSize', {
      by: transaction.quantity,
      where: { id: transaction.productId }
    });

    await transaction.destroy();

    return res.status(200).json({
      success: true,
      message: "Outbound transaction deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting outbound transaction:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete transaction",
      error: error.message
    });
  }
};
```

---

### 10. Get Vendor Inventory Statistics

**Route:** `GET /inventory/vendor-stats`

**Controller Method:** `getVendorInventoryStats`

**Implementation:**

```javascript
exports.getVendorInventoryStats = async (req, res) => {
  try {
    const vendorId = req.user.vendorId || req.user.storeId;
    
    if (!vendorId) {
      return res.status(403).json({
        success: false,
        message: "Vendor/Store ID not found in user session"
      });
    }

    // Get total products
    const totalProducts = await Product.count({
      where: { vendorId }
    });

    // Get total inbound transactions
    const totalInbound = await InboundTransaction.sum('quantity', {
      where: { vendorId }
    }) || 0;

    // Get total outbound transactions
    const totalOutbound = await OutboundTransaction.sum('quantity', {
      where: { vendorId }
    }) || 0;

    // Get current stock
    const currentStock = await Product.sum('unitSize', {
      where: { vendorId }
    }) || 0;

    // Get low stock products
    const lowStockProducts = await Product.findAll({
      where: {
        vendorId,
        unitSize: { [Op.lt]: 10 }
      },
      attributes: ['id', 'name', 'unitSize'],
      limit: 20
    });

    return res.status(200).json({
      success: true,
      data: {
        vendorId,
        totalProducts,
        totalInbound,
        totalOutbound,
        currentStock,
        lowStockProducts: lowStockProducts.map(p => ({
          productId: p.id,
          productName: p.name,
          currentStock: p.unitSize,
          minThreshold: 10
        }))
      }
    });
  } catch (error) {
    console.error("Error fetching vendor stats:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch vendor statistics",
      error: error.message
    });
  }
};
```

---

## Database Models

### InboundTransaction Model

```javascript
{
  id: INTEGER (Primary Key, Auto Increment),
  vendorId: INTEGER (Foreign Key to User/Vendor),
  clientId: INTEGER (Foreign Key to User, nullable),
  productId: INTEGER (Foreign Key to Product),
  categoryId: INTEGER (Foreign Key to Category, nullable, deprecated),
  quantity: INTEGER (Required, min: 1),
  invoiceNumber: STRING(50) (Required, unique per vendor),
  invoice: STRING (File path/URL),
  date: DATE (Required),
  referenceNumber: STRING(100) (Nullable),
  notes: TEXT (Nullable),
  createdAt: TIMESTAMP,
  updatedAt: TIMESTAMP
}
```

### OutboundTransaction Model

```javascript
{
  id: INTEGER (Primary Key, Auto Increment),
  vendorId: INTEGER (Foreign Key to User/Vendor),
  productId: INTEGER (Foreign Key to Product),
  quantity: INTEGER (Required, min: 1),
  orderId: INTEGER (Foreign Key to Order, nullable),
  date: DATE (Required),
  notes: TEXT (Nullable),
  createdAt: TIMESTAMP,
  updatedAt: TIMESTAMP
}
```

---

## Security Considerations

1. **Always verify vendor/store ownership:**
   - Check `req.user.vendorId` or `req.user.storeId` from JWT token
   - Filter all queries by vendorId
   - Verify transaction/product ownership before updates/deletes

2. **Input Validation:**
   - Validate all required fields
   - Validate data types and ranges
   - Sanitize user inputs
   - Validate date ranges

3. **Stock Management:**
   - Check stock availability before outbound transactions
   - Update stock atomically (use transactions)
   - Handle concurrent updates properly

4. **Error Handling:**
   - Return appropriate HTTP status codes
   - Don't expose sensitive error details
   - Log errors for debugging

---

## Additional APIs Used by Frontend

### Client Management (Uses existing User APIs)

The frontend uses these existing endpoints for client management:

- `GET /auth/user/getAllUserList` - Get all clients
- `GET /auth/user/:id` - Get client by ID
- `POST /auth/user/update` - Create/Update client

**Note:** These endpoints should be updated to:
- Automatically extract vendorId from session
- Filter clients by vendorId
- Set vendorId automatically when creating clients

### Product Management (Uses existing Product APIs)

- `GET /product/getAllproductList` - Get all products
- `GET /product/getProductById/:id` - Get product by ID
- `POST /product/add` - Add product
- `POST /product/update` - Update product

**Note:** These should filter by vendorId automatically.

### File Upload

- `POST /auth/upload-file` - Upload files (invoices, logos, product photos)

**Required FormData fields:**
- `file` (required) - The file to upload
- `storeName` (required) - Store name for directory structure
  - Frontend extracts from: `currentUserData?.data?.storename || currentUserData?.data?.storeName || vendorId || storeId || "STORE"`
  - Backend uses this to create directory: `uploads/{storeName}/invoices/` or `uploads/{storeName}/products/` etc.
- `invoiceNumber` (optional) - For invoice uploads
- `productName` (optional) - For product photo uploads
- `clientName` (optional) - For client logo uploads (deprecated, backend should use storeName)

**Backend File Upload Handler:**
```javascript
// In upload-file controller
exports.uploadFile = async (req, res) => {
  try {
    const storeName = req.body.storeName || req.user.storename || req.user.storeName;
    
    if (!storeName) {
      return res.status(400).json({
        success: false,
        message: "Store name is missing. Cannot create file directory."
      });
    }

    // Create directory structure: uploads/{storeName}/{type}/
    const uploadDir = path.join(__dirname, '../../uploads', storeName, fileType);
    // ... rest of upload logic
  }
};
```

---

## Testing Checklist

- [ ] All endpoints require authentication
- [ ] Vendor/Store ID is extracted from session correctly
- [ ] Users can only access their own data
- [ ] Stock is updated correctly on inbound/outbound transactions
- [ ] Stock validation works for outbound transactions
- [ ] Date validations work correctly
- [ ] File uploads work with storeName
- [ ] All error cases are handled properly
- [ ] Concurrent transactions are handled safely

---

## Database Indexes

For optimal performance, add these indexes:

```sql
-- InboundTransaction table
CREATE INDEX idx_inbound_vendor_date ON InboundTransaction(vendorId, date);
CREATE INDEX idx_inbound_vendor_product ON InboundTransaction(vendorId, productId);
CREATE INDEX idx_inbound_vendor_client ON InboundTransaction(vendorId, clientId);
CREATE INDEX idx_inbound_invoice_number ON InboundTransaction(vendorId, invoiceNumber);

-- OutboundTransaction table
CREATE INDEX idx_outbound_vendor_date ON OutboundTransaction(vendorId, date);
CREATE INDEX idx_outbound_vendor_product ON OutboundTransaction(vendorId, productId);
CREATE INDEX idx_outbound_vendor_order ON OutboundTransaction(vendorId, orderId);

-- Product table (for inventory queries)
CREATE INDEX idx_product_vendor_stock ON Product(vendorId, unitSize);
```

## Next Steps

1. ✅ **Routes defined** - Backend routes are set up
2. ⏳ **Implement controllers** - Use the code examples above
3. ⏳ **Create/Update database models** - Use the model specifications above
4. ⏳ **Add database indexes** - See indexes section above
5. ⏳ **Add database transactions** - For atomic stock updates
6. ⏳ **Implement proper error logging** - Use winston or similar
7. ⏳ **Add API rate limiting** - Prevent abuse
8. ⏳ **Write unit tests** - Test all endpoints
9. ⏳ **Update User/Product APIs** - Add vendorId filtering
10. ⏳ **Create Client Management APIs** - Dedicated endpoints (optional)

