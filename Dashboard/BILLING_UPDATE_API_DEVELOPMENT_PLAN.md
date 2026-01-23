# Billing Update API Development Plan

## Overview

This document provides a comprehensive development plan for implementing the `POST /api/billing/update` endpoint to support updating invoice/bill data from the frontend.

**Frontend Status:** ✅ **COMPLETE**
- `ViewBill.tsx` sends update requests with all invoice fields
- All editable fields are mapped to API format
- Error handling and loading states implemented

**Backend Status:** ⚠️ **REQUIRES IMPLEMENTATION**

---

## 1. API Endpoint Specification

### Endpoint Details

**Route:** `POST /api/billing/update`

**Method:** `POST`

**Authentication:** Required (JWT token)

**Authorization:** 
- Store users (role 3) can update bills for their store
- Vendor users (role 2) can update bills for their stores
- Admin users (role 0) can update any bill

---

## 2. Request Body Structure

### Expected Request Body

```json
{
  "id": 1,                          // Required: Bill ID to update
  "storeId": 1,                     // Optional: Store ID (extracted from token if not provided)
  
  // Customer/Billing Information
  "customerName": "John Doe",       // Optional: Updated customer name
  "customerEmail": "john@example.com", // Optional: Customer email
  "customerPhone": "+1234567890",   // Optional: Customer phone
  "billingAddress": "123 Main St", // Optional: Billing address
  "billingGSTIN": "29ABCDE1234F1Z5", // Optional: Billing GSTIN
  
  // Shipping Information
  "shippingCompanyName": "ABC Corp", // Optional: Shipping company name
  "shippingAddress": "456 Ship St",  // Optional: Shipping address
  
  // Invoice Information
  "invoiceType": "Invoice",         // Optional: "DC", "Invoice", or "Quotation"
  "invoiceFormatId": 2,              // Optional: Invoice format ID
  "invoiceNumber": "INV-001",       // Optional: Invoice number
  "invoiceDate": "2024-01-15T10:30:00Z", // Optional: Invoice date (ISO format)
  "poNumber": "PO-12345",           // Optional: Purchase order number
  "poDate": "2024-01-10T00:00:00Z", // Optional: PO date (ISO format)
  
  // Products
  "products": [                     // Optional: Array of product objects
    {
      "quantity": 2,
      "price": 100.00,
      "total": 200.00,
      "size": "Large",
      "weight": "500g",
      "name": "Product Name",
      "photo": "product.jpg"
    }
  ],
  
  // Financial Information
  "subtotal": "200.00",             // Optional: Subtotal amount (string)
  "discount": "10.00",              // Optional: Discount amount (string)
  "discountPercent": "5.00",        // Optional: Discount percentage (string)
  "tax": "19.00",                   // Optional: Tax amount (string)
  "taxPercent": "10.00",            // Optional: Tax percentage (string)
  "total": "209.00",                // Optional: Total amount (string)
  "totalCGST": "9.50",              // Optional: Total CGST (string)
  "totalSGST": "9.50",              // Optional: Total SGST (string)
  
  // Notes
  "notes": "Customer notes"         // Optional: Additional notes
}
```

### Field Validation Rules

| Field | Type | Required | Validation |
|-------|------|----------|-------------|
| `id` | Integer | ✅ Yes | Must be valid bill ID |
| `storeId` | Integer | ❌ No | Extracted from token if not provided |
| `customerName` | String | ❌ No | Max 255 characters |
| `customerEmail` | String | ❌ No | Valid email format |
| `customerPhone` | String | ❌ No | Max 50 characters |
| `invoiceType` | String | ❌ No | Must be one of: "DC", "Invoice", "Quotation" |
| `invoiceFormatId` | Integer | ❌ No | Must exist in invoice_formats table |
| `products` | Array | ❌ No | Array of product objects |
| `subtotal` | String | ❌ No | Numeric string, >= 0 |
| `discount` | String | ❌ No | Numeric string, >= 0 |
| `tax` | String | ❌ No | Numeric string, >= 0 |
| `total` | String | ❌ No | Numeric string, >= 0 |

---

## 3. Database Schema

### Bills Table Structure

Ensure the `bills` table includes all necessary columns:

```sql
CREATE TABLE IF NOT EXISTS bills (
  id INT PRIMARY KEY AUTO_INCREMENT,
  storeId INT NOT NULL,
  
  -- Customer Information
  customerName VARCHAR(255),
  customerEmail VARCHAR(255),
  customerPhone VARCHAR(50),
  billingAddress TEXT,
  billingGSTIN VARCHAR(50),
  
  -- Shipping Information
  shippingCompanyName VARCHAR(255),
  shippingAddress TEXT,
  
  -- Invoice Information
  invoiceType VARCHAR(20) DEFAULT 'Invoice',
  invoiceFormatId INT,
  invoiceNumber VARCHAR(100),
  invoiceDate DATETIME,
  poNumber VARCHAR(100),
  poDate DATETIME,
  
  -- Products (stored as JSON string)
  products TEXT,
  
  -- Financial Information
  subtotal DECIMAL(10, 2) DEFAULT 0,
  discount DECIMAL(10, 2) DEFAULT 0,
  discountPercent DECIMAL(5, 2) DEFAULT 0,
  tax DECIMAL(10, 2) DEFAULT 0,
  taxPercent DECIMAL(5, 2) DEFAULT 0,
  total DECIMAL(10, 2) DEFAULT 0,
  totalCGST DECIMAL(10, 2) DEFAULT 0,
  totalSGST DECIMAL(10, 2) DEFAULT 0,
  
  -- Notes
  notes TEXT,
  
  -- Timestamps
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (storeId) REFERENCES stores(id),
  FOREIGN KEY (invoiceFormatId) REFERENCES invoice_formats(id),
  
  INDEX idx_storeId (storeId),
  INDEX idx_invoiceFormatId (invoiceFormatId),
  INDEX idx_invoiceDate (invoiceDate)
);
```

### Migration Script (if needed)

```sql
-- Add missing columns if they don't exist
ALTER TABLE bills 
ADD COLUMN IF NOT EXISTS billingAddress TEXT,
ADD COLUMN IF NOT EXISTS billingGSTIN VARCHAR(50),
ADD COLUMN IF NOT EXISTS shippingCompanyName VARCHAR(255),
ADD COLUMN IF NOT EXISTS shippingAddress TEXT,
ADD COLUMN IF NOT EXISTS invoiceNumber VARCHAR(100),
ADD COLUMN IF NOT EXISTS invoiceDate DATETIME,
ADD COLUMN IF NOT EXISTS poNumber VARCHAR(100),
ADD COLUMN IF NOT EXISTS poDate DATETIME,
ADD COLUMN IF NOT EXISTS totalCGST DECIMAL(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS totalSGST DECIMAL(10, 2) DEFAULT 0;

-- Ensure invoiceType exists with default
ALTER TABLE bills 
MODIFY COLUMN invoiceType VARCHAR(20) DEFAULT 'Invoice' 
CHECK (invoiceType IN ('DC', 'Invoice', 'Quotation'));
```

---

## 4. Controller Implementation

### Controller Method Structure

```javascript
// controllers/billingController.js

/**
 * Update Bill
 * POST /api/billing/update
 */
exports.updateBill = async (req, res) => {
  try {
    const { id, ...updateFields } = req.body;
    const userId = req.user.id;
    const role = req.user.role;
    const userStoreId = req.user.storeId;
    const userVendorId = req.user.vendorId;

    // 1. Validate required fields
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Bill ID is required'
      });
    }

    // 2. Find the bill
    const bill = await Bill.findByPk(id, {
      include: [
        {
          model: Store,
          as: 'store',
          attributes: ['id', 'storename', 'vendorId']
        }
      ]
    });

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: 'Bill not found'
      });
    }

    // 3. Authorization check
    const billStoreId = bill.storeId;
    const billVendorId = bill.store?.vendorId;

    // Admin can update any bill
    if (role !== '0') {
      // Store users can only update bills for their store
      if (role === '3' && userStoreId !== billStoreId) {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to update this bill'
        });
      }

      // Vendor users can only update bills for their stores
      if (role === '2' && userVendorId !== billVendorId) {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to update this bill'
        });
      }
    }

    // 4. Validate invoiceType if provided
    if (updateFields.invoiceType) {
      const validTypes = ['DC', 'Invoice', 'Quotation'];
      if (!validTypes.includes(updateFields.invoiceType)) {
        return res.status(400).json({
          success: false,
          message: `invoiceType must be one of: ${validTypes.join(', ')}`
        });
      }
    }

    // 5. Validate invoiceFormatId if provided
    if (updateFields.invoiceFormatId) {
      const format = await InvoiceFormat.findByPk(updateFields.invoiceFormatId);
      if (!format) {
        return res.status(400).json({
          success: false,
          message: 'Invalid invoiceFormatId'
        });
      }
    }

    // 6. Convert products array to JSON string if provided
    if (updateFields.products && Array.isArray(updateFields.products)) {
      updateFields.products = JSON.stringify(updateFields.products);
    }

    // 7. Convert string amounts to decimals
    const decimalFields = ['subtotal', 'discount', 'tax', 'total', 'totalCGST', 'totalSGST'];
    decimalFields.forEach(field => {
      if (updateFields[field] !== undefined) {
        updateFields[field] = parseFloat(updateFields[field]) || 0;
      }
    });

    // 8. Convert string percentages to decimals
    const percentFields = ['discountPercent', 'taxPercent'];
    percentFields.forEach(field => {
      if (updateFields[field] !== undefined) {
        updateFields[field] = parseFloat(updateFields[field]) || 0;
      }
    });

    // 9. Parse date strings to Date objects
    if (updateFields.invoiceDate) {
      updateFields.invoiceDate = new Date(updateFields.invoiceDate);
    }
    if (updateFields.poDate) {
      updateFields.poDate = new Date(updateFields.poDate);
    }

    // 10. Remove storeId from updateFields (should not be changed)
    delete updateFields.storeId;

    // 11. Update the bill
    await bill.update(updateFields);

    // 12. Reload bill with associations
    await bill.reload({
      include: [
        {
          model: InvoiceFormat,
          as: 'invoiceFormat',
          attributes: ['id', 'name', 'headerTemplate', 'template', 'footerTemplate']
        },
        {
          model: Store,
          as: 'store',
          attributes: ['id', 'storename', 'storeaddress', 'phone', 'gstin']
        }
      ]
    });

    // 13. Parse products JSON string for response
    const billData = bill.toJSON();
    if (billData.products && typeof billData.products === 'string') {
      try {
        billData.products = JSON.parse(billData.products);
      } catch (e) {
        billData.products = [];
      }
    }

    return res.json({
      success: true,
      message: 'Bill updated successfully',
      data: billData
    });

  } catch (error) {
    console.error('Error updating bill:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update bill',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
```

---

## 5. Route Configuration

### Route Setup

```javascript
// routes/billing.router.js
const express = require("express");
const billingController = require("./billing.controller");
const { sanitize } = require("../../../middleware/sanitizer");
const { jwtStrategy } = require("../../../middleware/strategy");

const billingRouter = express.Router();

// Update bill route
billingRouter
  .route("/update")
  .post(sanitize(), jwtStrategy, billingController.updateBill);

// Other billing routes...
billingRouter
  .route("/add")
  .post(sanitize(), jwtStrategy, billingController.addBill);

billingRouter
  .route("/getById/:id")
  .get(sanitize(), jwtStrategy, billingController.getBillById);

billingRouter
  .route("/getByStoreId/:id")
  .get(sanitize(), jwtStrategy, billingController.getBillsByStoreId);

module.exports = { billingRouter };
```

### Router Mounting

```javascript
// routes/index.js or app.js
const express = require('express');
const { billingRouter } = require('./billing.router');

const restRouter = express.Router();

// Mount billing router
restRouter.use("/billing", billingRouter);

module.exports = { restRouter };
```

---

## 6. Model Definition (Sequelize)

### Bill Model

```javascript
// models/Bill.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Bill = sequelize.define('Bill', {
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
      }
    },
    customerName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    customerEmail: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        isEmail: true
      }
    },
    customerPhone: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    billingAddress: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    billingGSTIN: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    shippingCompanyName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    shippingAddress: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    invoiceType: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'Invoice',
      validate: {
        isIn: [['DC', 'Invoice', 'Quotation']]
      }
    },
    invoiceFormatId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'invoice_formats',
        key: 'id'
      }
    },
    invoiceNumber: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    invoiceDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    poNumber: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    poDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    products: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const value = this.getDataValue('products');
        if (!value) return [];
        try {
          return JSON.parse(value);
        } catch (e) {
          return [];
        }
      },
      set(value) {
        this.setDataValue('products', JSON.stringify(value));
      }
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },
    discount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },
    discountPercent: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0
    },
    tax: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },
    taxPercent: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },
    totalCGST: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },
    totalSGST: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'bills',
    timestamps: true,
    underscored: false
  });

  // Associations
  Bill.associate = (models) => {
    Bill.belongsTo(models.Store, {
      foreignKey: 'storeId',
      as: 'store'
    });
    Bill.belongsTo(models.InvoiceFormat, {
      foreignKey: 'invoiceFormatId',
      as: 'invoiceFormat'
    });
  };

  return Bill;
};
```

---

## 7. Validation Middleware

### Input Validation

```javascript
// middleware/validators/billingValidator.js
const { body, validationResult } = require('express-validator');

const updateBillValidation = [
  body('id')
    .notEmpty()
    .withMessage('Bill ID is required')
    .isInt()
    .withMessage('Bill ID must be an integer'),
  
  body('customerName')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Customer name must be less than 255 characters'),
  
  body('customerEmail')
    .optional()
    .isEmail()
    .withMessage('Invalid email format'),
  
  body('customerPhone')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Phone number must be less than 50 characters'),
  
  body('invoiceType')
    .optional()
    .isIn(['DC', 'Invoice', 'Quotation'])
    .withMessage('invoiceType must be one of: DC, Invoice, Quotation'),
  
  body('invoiceFormatId')
    .optional()
    .isInt()
    .withMessage('invoiceFormatId must be an integer'),
  
  body('products')
    .optional()
    .isArray()
    .withMessage('Products must be an array'),
  
  body('subtotal')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Subtotal must be a positive number'),
  
  body('discount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Discount must be a positive number'),
  
  body('tax')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Tax must be a positive number'),
  
  body('total')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Total must be a positive number'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    next();
  }
];

module.exports = {
  updateBillValidation
};
```

### Updated Route with Validation

```javascript
// routes/billing.router.js
const { updateBillValidation } = require('../middleware/validators/billingValidator');

billingRouter
  .route("/update")
  .post(
    sanitize(), 
    jwtStrategy, 
    updateBillValidation,
    billingController.updateBill
  );
```

---

## 8. Security Considerations

### 1. Authentication & Authorization
- ✅ All requests must include valid JWT token
- ✅ Users can only update bills for their own store/vendor
- ✅ Admin users can update any bill

### 2. Input Sanitization
- ✅ Use `sanitize()` middleware to prevent XSS
- ✅ Validate all input fields
- ✅ Use parameterized queries (Sequelize handles this)

### 3. Data Validation
- ✅ Validate invoiceType enum values
- ✅ Validate invoiceFormatId exists
- ✅ Validate numeric fields are positive
- ✅ Validate email format if provided

### 4. SQL Injection Prevention
- ✅ Use Sequelize ORM (parameterized queries)
- ✅ Never use string concatenation for SQL

### 5. Rate Limiting
- ✅ Implement rate limiting on update endpoint
- ✅ Suggested: 10 requests per minute per user

---

## 9. Error Handling

### Error Response Format

```javascript
// Success Response
{
  "success": true,
  "message": "Bill updated successfully",
  "data": { ... }
}

// Error Responses
{
  "success": false,
  "message": "Error message here",
  "errors": [ ... ] // Optional: validation errors
}
```

### Common Error Scenarios

| Status Code | Scenario | Message |
|-------------|----------|---------|
| 400 | Missing bill ID | "Bill ID is required" |
| 400 | Invalid invoiceType | "invoiceType must be one of: DC, Invoice, Quotation" |
| 400 | Invalid invoiceFormatId | "Invalid invoiceFormatId" |
| 400 | Validation errors | "Validation failed" |
| 403 | Unauthorized access | "You do not have permission to update this bill" |
| 404 | Bill not found | "Bill not found" |
| 500 | Server error | "Failed to update bill" |

---

## 10. Testing Checklist

### Unit Tests

- [ ] Test successful bill update with all fields
- [ ] Test bill update with partial fields
- [ ] Test authorization (store user can only update own bills)
- [ ] Test authorization (vendor user can only update own store bills)
- [ ] Test authorization (admin can update any bill)
- [ ] Test validation (invalid invoiceType)
- [ ] Test validation (invalid invoiceFormatId)
- [ ] Test validation (invalid numeric fields)
- [ ] Test validation (invalid email format)
- [ ] Test error handling (bill not found)
- [ ] Test error handling (missing bill ID)

### Integration Tests

- [ ] Test update with database transaction
- [ ] Test products JSON serialization/deserialization
- [ ] Test date parsing and storage
- [ ] Test decimal conversion from strings
- [ ] Test response includes all updated fields
- [ ] Test response includes invoice format association

### Manual Testing

- [ ] Update bill from frontend (ViewBill.tsx)
- [ ] Verify all fields are saved correctly
- [ ] Verify authorization works correctly
- [ ] Verify error messages are user-friendly
- [ ] Test with different user roles (admin, vendor, store)

---

## 11. Implementation Steps

### Step 1: Database Migration
1. Review current `bills` table structure
2. Add missing columns if needed
3. Run migration script
4. Verify schema matches requirements

### Step 2: Model Updates
1. Update Bill model with all fields
2. Add associations (Store, InvoiceFormat)
3. Add getters/setters for products JSON
4. Add validations

### Step 3: Controller Implementation
1. Create `updateBill` controller method
2. Implement authorization logic
3. Implement validation logic
4. Implement update logic
5. Add error handling

### Step 4: Route Configuration
1. Add update route to billing router
2. Add validation middleware
3. Add authentication middleware
4. Test route registration

### Step 5: Validation Middleware
1. Create billing validator
2. Add field validations
3. Test validation rules

### Step 6: Testing
1. Write unit tests
2. Write integration tests
3. Manual testing from frontend
4. Fix any issues found

### Step 7: Documentation
1. Update API documentation
2. Add endpoint to API reference
3. Document request/response examples

---

## 12. Response Format

### Success Response

```json
{
  "success": true,
  "message": "Bill updated successfully",
  "data": {
    "id": 1,
    "storeId": 1,
    "customerName": "John Doe",
    "customerEmail": "john@example.com",
    "customerPhone": "+1234567890",
    "billingAddress": "123 Main St",
    "billingGSTIN": "29ABCDE1234F1Z5",
    "shippingCompanyName": "ABC Corp",
    "shippingAddress": "456 Ship St",
    "invoiceType": "Invoice",
    "invoiceFormatId": 2,
    "invoiceFormat": {
      "id": 2,
      "name": "Custom Invoice Format",
      "headerTemplate": "<div>Header</div>",
      "template": "<div>Body</div>",
      "footerTemplate": "<div>Footer</div>"
    },
    "invoiceNumber": "INV-001",
    "invoiceDate": "2024-01-15T10:30:00.000Z",
    "poNumber": "PO-12345",
    "poDate": "2024-01-10T00:00:00.000Z",
    "products": [
      {
        "quantity": 2,
        "price": 100.00,
        "total": 200.00,
        "size": "Large",
        "weight": "500g",
        "name": "Product Name",
        "photo": "product.jpg"
      }
    ],
    "subtotal": "200.00",
    "discount": "10.00",
    "discountPercent": "5.00",
    "tax": "19.00",
    "taxPercent": "10.00",
    "total": "209.00",
    "totalCGST": "9.50",
    "totalSGST": "9.50",
    "notes": "Customer notes",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-16T14:20:00.000Z"
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "You do not have permission to update this bill"
}
```

---

## 13. Additional Considerations

### 1. Audit Logging
Consider logging all bill updates for audit purposes:
- Who updated the bill
- When it was updated
- What fields were changed

### 2. Version History
Consider implementing version history to track changes:
- Store previous versions of bills
- Allow viewing change history
- Allow reverting to previous versions

### 3. Notification System
Consider sending notifications when bills are updated:
- Notify store owner
- Notify customer (if email provided)
- Notify admin (for significant changes)

### 4. Business Rules
Consider implementing business rules:
- Prevent updating bills older than X days
- Require approval for certain changes
- Validate financial calculations match

---

## 14. Dependencies

### Required Packages

```json
{
  "express": "^4.18.0",
  "sequelize": "^6.0.0",
  "express-validator": "^6.14.0",
  "jsonwebtoken": "^9.0.0",
  "bcrypt": "^5.0.0"
}
```

---

## 15. Timeline Estimate

| Task | Estimated Time |
|------|----------------|
| Database migration | 1 hour |
| Model updates | 2 hours |
| Controller implementation | 4 hours |
| Route configuration | 1 hour |
| Validation middleware | 2 hours |
| Testing | 4 hours |
| Documentation | 1 hour |
| **Total** | **15 hours** |

---

## 16. Notes

- The frontend sends all fields as strings for financial values, so conversion to decimals is required
- Products are sent as an array but stored as JSON string in database
- Date fields are sent as ISO strings and need to be converted to Date objects
- The `storeId` should not be updatable (security concern)
- All updates should preserve the original `createdAt` timestamp
- The `updatedAt` timestamp is automatically updated by the database

---

## 17. Support & Questions

For questions or issues during implementation:
1. Review existing billing controller methods for patterns
2. Check database schema documentation
3. Review authentication/authorization middleware
4. Test with Postman/Thunder Client before frontend integration

---

**Last Updated:** 2024-01-16
**Status:** Ready for Implementation
**Priority:** High
