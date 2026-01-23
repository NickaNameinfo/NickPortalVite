# Invoice Formats API Documentation

## Overview
This document describes the API endpoints for managing invoice formats, assigning them to stores/vendors, and using them during billing.

## Base URL
```
/api/invoice-formats
```

## Authentication
All endpoints require authentication. Include the authentication token in the request headers:
```
Authorization: <token>
```

---

## 1. Invoice Format Management

### 1.1 Get All Invoice Formats
**GET** `/api/invoice-formats/list`

Get a list of all invoice formats.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Standard Invoice",
      "description": "Standard invoice format with company header",
      "headerTemplate": "<div>Company Header</div>",
      "template": "<div>Invoice Body</div>",
      "footerTemplate": "<div>Footer</div>",
      "isDefault": true,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

### 1.2 Get Invoice Format by ID
**GET** `/api/invoice-formats/:id`

Get a specific invoice format by ID.

**Parameters:**
- `id` (path parameter) - Invoice format ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Standard Invoice",
    "description": "Standard invoice format with company header",
    "headerTemplate": "<div>Company Header</div>",
    "template": "<div>Invoice Body</div>",
    "footerTemplate": "<div>Footer</div>",
    "isDefault": true,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

---

### 1.3 Create Invoice Format
**POST** `/api/invoice-formats/create`

Create a new invoice format.

**Request Body:**
```json
{
  "name": "Custom Invoice Format",
  "description": "Custom format for special invoices",
  "headerTemplate": "<div class='header'><h1>Invoice</h1></div>",
  "template": "<div class='body'><table>...</table></div>",
  "footerTemplate": "<div class='footer'><p>Thank you!</p></div>",
  "isDefault": false
}
```

**Fields:**
- `name` (string, required) - Format name
- `description` (string, optional) - Format description
- `headerTemplate` (string, optional) - HTML template for header
- `template` (string, optional) - HTML template for body
- `footerTemplate` (string, optional) - HTML template for footer
- `isDefault` (boolean, optional) - Whether this is the default format

**Response:**
```json
{
  "success": true,
  "message": "Invoice format created successfully",
  "data": {
    "id": 2,
    "name": "Custom Invoice Format",
    "description": "Custom format for special invoices",
    "headerTemplate": "<div class='header'><h1>Invoice</h1></div>",
    "template": "<div class='body'><table>...</table></div>",
    "footerTemplate": "<div class='footer'><p>Thank you!</p></div>",
    "isDefault": false,
    "createdAt": "2024-01-15T11:00:00Z",
    "updatedAt": "2024-01-15T11:00:00Z"
  }
}
```

---

### 1.4 Update Invoice Format
**POST** `/api/invoice-formats/update/:id`

Update an existing invoice format.

**Parameters:**
- `id` (path parameter) - Invoice format ID

**Request Body:**
```json
{
  "name": "Updated Invoice Format",
  "description": "Updated description",
  "headerTemplate": "<div>Updated Header</div>",
  "template": "<div>Updated Body</div>",
  "footerTemplate": "<div>Updated Footer</div>",
  "isDefault": false
}
```

**Response:**
```json
{
  "success": true,
  "message": "Invoice format updated successfully",
  "data": {
    "id": 2,
    "name": "Updated Invoice Format",
    "description": "Updated description",
    "headerTemplate": "<div>Updated Header</div>",
    "template": "<div>Updated Body</div>",
    "footerTemplate": "<div>Updated Footer</div>",
    "isDefault": false,
    "createdAt": "2024-01-15T11:00:00Z",
    "updatedAt": "2024-01-15T12:00:00Z"
  }
}
```

---

### 1.5 Delete Invoice Format
**POST** `/api/invoice-formats/delete/:id`

Delete an invoice format.

**Parameters:**
- `id` (path parameter) - Invoice format ID

**Response:**
```json
{
  "success": true,
  "message": "Invoice format deleted successfully"
}
```

**Note:** Cannot delete a format if it's assigned to any store or vendor, or if it's the default format.

---

## 2. Store Invoice Format Assignment

### 2.1 Get Store Invoice Format
**GET** `/api/invoice-formats/store/:storeId`

Get the invoice format assigned to a specific store.

**Parameters:**
- `storeId` (path parameter) - Store ID

**Response:**
```json
{
  "success": true,
  "data": {
    "storeId": 1,
    "formatId": 2,
    "format": {
      "id": 2,
      "name": "Custom Invoice Format",
      "description": "Custom format for special invoices",
      "headerTemplate": "<div>Header</div>",
      "template": "<div>Body</div>",
      "footerTemplate": "<div>Footer</div>",
      "isDefault": false
    }
  }
}
```

**If no format assigned:**
```json
{
  "success": true,
  "data": null
}
```

---

### 2.2 Assign Invoice Format to Store
**POST** `/api/invoice-formats/store/:storeId/assign`

Assign an invoice format to a store.

**Parameters:**
- `storeId` (path parameter) - Store ID

**Request Body:**
```json
{
  "formatId": 2
}
```

**Fields:**
- `formatId` (integer, required) - Invoice format ID to assign

**Response:**
```json
{
  "success": true,
  "message": "Invoice format assigned to store successfully",
  "data": {
    "storeId": 1,
    "formatId": 2
  }
}
```

---

### 2.3 Get All Invoice Format Assignments (Admin Only)
**GET** `/api/invoice-formats/assignments`

Get all invoice format assignments for stores and vendors.

**Response:**
```json
{
  "success": true,
  "data": {
    "stores": [
      {
        "storeId": 1,
        "storeName": "Store Name",
        "formatId": 2,
        "formatName": "Custom Invoice Format",
        "assignedAt": "2024-01-15T10:30:00Z"
      }
    ],
    "vendors": [
      {
        "vendorId": 1,
        "vendorName": "Vendor Name",
        "formatId": 1,
        "formatName": "Default Invoice Format",
        "assignedAt": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

---

## 3. Vendor Invoice Format Assignment

### 3.1 Get Vendor Invoice Format
**GET** `/api/invoice-formats/vendor/:vendorId`

Get the invoice format assigned to a specific vendor.

**Parameters:**
- `vendorId` (path parameter) - Vendor ID

**Response:**
```json
{
  "success": true,
  "data": {
    "vendorId": 1,
    "formatId": 2,
    "format": {
      "id": 2,
      "name": "Custom Invoice Format",
      "description": "Custom format for special invoices",
      "headerTemplate": "<div>Header</div>",
      "template": "<div>Body</div>",
      "footerTemplate": "<div>Footer</div>",
      "isDefault": false
    }
  }
}
```

**If no format assigned:**
```json
{
  "success": true,
  "data": null
}
```

---

### 3.2 Assign Invoice Format to Vendor
**POST** `/api/invoice-formats/vendor/:vendorId/assign`

Assign an invoice format to a vendor.

**Parameters:**
- `vendorId` (path parameter) - Vendor ID

**Request Body:**
```json
{
  "formatId": 2
}
```

**Fields:**
- `formatId` (integer, required) - Invoice format ID to assign

**Response:**
```json
{
  "success": true,
  "message": "Invoice format assigned to vendor successfully",
  "data": {
    "vendorId": 1,
    "formatId": 2
  }
}
```

---

## 4. Billing Integration

### 4.1 Create Bill with Invoice Format
**POST** `/api/billing/add`

When creating a bill, include the `invoiceFormatId` field.

**Request Body:**
```json
{
  "storeId": 1,
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "customerPhone": "+1234567890",
  "invoiceFormatId": 2,
  "products": [
    {
      "quantity": 2,
      "price": 100.00,
      "total": 200.00,
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
  "notes": "Customer notes"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Bill created successfully",
  "data": {
    "id": 1,
    "storeId": 1,
    "customerName": "John Doe",
    "customerEmail": "john@example.com",
    "customerPhone": "+1234567890",
    "invoiceFormatId": 2,
    "products": "[{...}]",
    "subtotal": "200.00",
    "discount": "10.00",
    "discountPercent": "5.00",
    "tax": "19.00",
    "taxPercent": "10.00",
    "total": "209.00",
    "notes": "Customer notes",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

---

### 4.2 Get Bill with Invoice Format
**GET** `/api/billing/getById/:id`

Get bill details including the invoice format.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "storeId": 1,
    "customerName": "John Doe",
    "customerEmail": "john@example.com",
    "customerPhone": "+1234567890",
    "invoiceFormatId": 2,
    "invoiceFormat": {
      "id": 2,
      "name": "Custom Invoice Format",
      "headerTemplate": "<div>Header</div>",
      "template": "<div>Body</div>",
      "footerTemplate": "<div>Footer</div>"
    },
    "products": "[{...}]",
    "subtotal": "200.00",
    "discount": "10.00",
    "tax": "19.00",
    "total": "209.00",
    "notes": "Customer notes",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

---

## 5. Template Variables

When rendering invoice templates, the following variables should be replaced:

### Available Variables:

#### Basic Variables:
- `{{billId}}` - Bill ID
- `{{billNumber}}` - Bill number
- `{{invoiceDate}}` - Invoice date
- `{{billDate}}` - Bill creation date
- `{{storeName}}` - Store name
- `{{storeAddress}}` - Store address
- `{{storePhone}}` - Store phone
- `{{storeEmail}}` - Store email
- `{{storeWebsite}}` - Store website
- `{{customerName}}` - Customer name
- `{{customerEmail}}` - Customer email
- `{{customerPhone}}` - Customer phone
- `{{subtotal}}` - Subtotal amount
- `{{discount}}` - Discount amount
- `{{discountPercent}}` - Discount percentage
- `{{tax}}` - Tax amount
- `{{taxPercent}}` - Tax percentage
- `{{total}}` - Total amount
- `{{notes}}` - Bill notes
- `{{status}}` - Invoice status (Paid/Unpaid)
- `{{products}}` - Products list (HTML table)

#### GST Tax Invoice Variables:
- `{{storeGSTIN}}` - Store GSTIN number
- `{{storePAN}}` - Store PAN number
- `{{lutRefNo}}` - LUT Reference Number
- `{{lutDate}}` - LUT Date
- `{{billingCompanyName}}` - Billing company name
- `{{billingAddress}}` - Billing address
- `{{billingPhone}}` - Billing phone
- `{{billingGSTIN}}` - Billing GSTIN
- `{{shippingCompanyName}}` - Shipping company name
- `{{shippingAddress}}` - Shipping address
- `{{poNumber}}` - Purchase Order number
- `{{poDate}}` - Purchase Order date
- `{{invoiceMonth}}` - Invoice month (e.g., DEC-25)
- `{{totalCGST}}` - Total CGST amount
- `{{totalSGST}}` - Total SGST amount
- `{{totalIGST}}` - Total IGST amount
- `{{totalTax}}` - Total tax amount
- `{{taxableAmount}}` - Taxable amount
- `{{amountInWords}}` - Total amount in words
- `{{bankAccountName}}` - Bank account name
- `{{bankAccountNumber}}` - Bank account number
- `{{bankIFSC}}` - Bank IFSC code
- `{{bankName}}` - Bank name and branch
- `{{jurisdiction}}` - Legal jurisdiction
- `{{gst0Sales}}`, `{{gst0CGST}}`, `{{gst0SGST}}`, `{{gst0Total}}` - GST 0% breakdown
- `{{gst5Sales}}`, `{{gst5CGST}}`, `{{gst5SGST}}`, `{{gst5Total}}` - GST 5% breakdown
- `{{gst12Sales}}`, `{{gst12CGST}}`, `{{gst12SGST}}`, `{{gst12Total}}` - GST 12% breakdown
- `{{gst18Sales}}`, `{{gst18CGST}}`, `{{gst18SGST}}`, `{{gst18Total}}` - GST 18% breakdown
- `{{gst28Sales}}`, `{{gst28CGST}}`, `{{gst28SGST}}`, `{{gst28Total}}` - GST 28% breakdown

#### Product Variables (for each product in the loop):
- `{{name}}` - Product name
- `{{size}}` - Product size
- `{{quantity}}` - Quantity
- `{{price}}` - Unit price
- `{{total}}` - Line total
- `{{hsnSac}}` - HSN/SAC code (for GST invoices)
- `{{uom}}` - Unit of measurement
- `{{cgstPercent}}` - CGST percentage
- `{{cgst}}` - CGST amount
- `{{sgstPercent}}` - SGST percentage
- `{{sgst}}` - SGST amount
- `{{net}}` - Net amount after tax

### Default Invoice Format Template

The default invoice format matches the standard invoice design with the following structure:

**Header Template:**
```html
<div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; padding: 20px; background-color: #f8f9fa; border-radius: 8px;">
  <div style="flex: 1;">
    <div style="font-size: 12px; color: #666; margin-bottom: 5px;">{{billDate}}</div>
    <div style="font-size: 24px; font-weight: bold; color: #2563eb; margin-bottom: 10px;">INVOICE</div>
  </div>
  <div style="text-align: right; flex: 1;">
    <div style="font-size: 18px; font-weight: bold; margin-bottom: 5px;">{{storeName}}</div>
    <div style="font-size: 12px; color: #666;">Invoice #{{billNumber}}</div>
    <div style="font-size: 12px; color: #666;">Date: {{invoiceDate}}</div>
  </div>
</div>
```

**Body Template:**
```html
<div style="max-width: 800px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
  <!-- Company Information -->
  <div style="margin-bottom: 30px;">
    <div style="font-size: 16px; font-weight: bold; margin-bottom: 10px;">{{storeName}}</div>
    <div style="font-size: 12px; color: #666; line-height: 1.6;">
      <div>{{storeAddress}}</div>
      <div>Phone: {{storePhone}}</div>
      <div>Email: {{storeEmail}}</div>
      <div>Website: {{storeWebsite}}</div>
    </div>
  </div>

  <!-- Bill To Section -->
  <div style="margin-bottom: 30px;">
    <div style="font-size: 14px; font-weight: bold; margin-bottom: 10px; color: #333;">Bill To:</div>
    <div style="font-size: 12px; color: #666;">
      <div>{{customerName}}</div>
      <div>{{customerEmail}}</div>
      <div>{{customerPhone}}</div>
    </div>
  </div>

  <!-- Invoice Details -->
  <div style="display: flex; justify-content: space-between; margin-bottom: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 5px;">
    <div>
      <div style="font-size: 12px; color: #666; margin-bottom: 5px;">Invoice Number</div>
      <div style="font-size: 14px; font-weight: bold;">{{billNumber}}</div>
    </div>
    <div>
      <div style="font-size: 12px; color: #666; margin-bottom: 5px;">Invoice Date</div>
      <div style="font-size: 14px; font-weight: bold;">{{invoiceDate}}</div>
    </div>
    <div>
      <div style="font-size: 12px; color: #666; margin-bottom: 5px;">Status</div>
      <div style="font-size: 14px; font-weight: bold; color: #10b981;">{{status}}</div>
    </div>
  </div>

  <!-- Products Table -->
  <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
    <thead>
      <tr style="background-color: #2563eb; color: white;">
        <th style="padding: 12px; text-align: left; font-size: 12px; font-weight: bold;">ITEM</th>
        <th style="padding: 12px; text-align: left; font-size: 12px; font-weight: bold;">SIZE</th>
        <th style="padding: 12px; text-align: center; font-size: 12px; font-weight: bold;">QUANTITY</th>
        <th style="padding: 12px; text-align: right; font-size: 12px; font-weight: bold;">UNIT PRICE</th>
        <th style="padding: 12px; text-align: right; font-size: 12px; font-weight: bold;">TOTAL</th>
      </tr>
    </thead>
    <tbody>
      {{products}}
    </tbody>
  </table>

  <!-- Summary Section -->
  <div style="margin-top: 30px; padding: 20px; background-color: #f8f9fa; border-radius: 5px;">
    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
      <span style="font-size: 14px; color: #666;">Subtotal:</span>
      <span style="font-size: 14px; font-weight: bold;">₹{{subtotal}}</span>
    </div>
    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
      <span style="font-size: 14px; color: #666;">Discount ({{discountPercent}}%):</span>
      <span style="font-size: 14px; color: #ef4444;">-₹{{discount}}</span>
    </div>
    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
      <span style="font-size: 14px; color: #666;">Tax ({{taxPercent}}%):</span>
      <span style="font-size: 14px; font-weight: bold;">₹{{tax}}</span>
    </div>
    <div style="border-top: 2px solid #2563eb; padding-top: 10px; margin-top: 10px; display: flex; justify-content: space-between;">
      <span style="font-size: 18px; font-weight: bold; color: #2563eb;">Total:</span>
      <span style="font-size: 18px; font-weight: bold; color: #2563eb;">₹{{total}}</span>
    </div>
  </div>
</div>
```

**Footer Template:**
```html
<div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
  <div style="font-size: 14px; font-weight: bold; margin-bottom: 10px; color: #333;">Thank you for your business!</div>
  <div style="font-size: 12px; color: #666;">This is a computer-generated invoice and does not require a signature.</div>
  <div style="margin-top: 15px; padding: 10px; background-color: #f8f9fa; border-radius: 5px; font-size: 12px; color: #666;">
    <strong>Notes:</strong> {{notes}}
  </div>
</div>
```

### Products Table Rendering

The `{{products}}` variable should be replaced with a rendered HTML table. Backend should generate:

```html
{{#each products}}
<tr style="border-bottom: 1px solid #e5e7eb;">
  <td style="padding: 12px; font-size: 12px;">
    <div style="display: flex; align-items: center; gap: 8px;">
      {{#if photo}}
      <img src="{{photo}}" alt="{{name}}" style="width: 30px; height: 30px; object-fit: cover; border-radius: 4px;">
      {{else}}
      <span style="font-size: 16px;">📄</span>
      {{/if}}
      <span>{{name}}</span>
    </div>
  </td>
  <td style="padding: 12px; font-size: 12px; color: #666;">{{size}}</td>
  <td style="padding: 12px; font-size: 12px; text-align: center;">{{quantity}}</td>
  <td style="padding: 12px; font-size: 12px; text-align: right;">₹{{price}}</td>
  <td style="padding: 12px; font-size: 12px; text-align: right; font-weight: bold;">₹{{total}}</td>
</tr>
{{/each}}
```

Or if using simple variable replacement:
```html
<tr>
  <td>{{name}}</td>
  <td>{{size}}</td>
  <td>{{quantity}}</td>
  <td>₹{{price}}</td>
  <td>₹{{total}}</td>
</tr>
```

---

## 6. Database Schema

### Invoice Formats Table
```sql
CREATE TABLE invoice_formats (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  headerTemplate TEXT,
  template TEXT NOT NULL,
  footerTemplate TEXT,
  isDefault BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Store Invoice Format Assignment Table
```sql
CREATE TABLE store_invoice_formats (
  id INT PRIMARY KEY AUTO_INCREMENT,
  storeId INT NOT NULL,
  formatId INT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (storeId) REFERENCES stores(id) ON DELETE CASCADE,
  FOREIGN KEY (formatId) REFERENCES invoice_formats(id) ON DELETE CASCADE,
  UNIQUE KEY unique_store_format (storeId)
);
```

### Vendor Invoice Format Assignment Table
```sql
CREATE TABLE vendor_invoice_formats (
  id INT PRIMARY KEY AUTO_INCREMENT,
  vendorId INT NOT NULL,
  formatId INT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (vendorId) REFERENCES vendors(id) ON DELETE CASCADE,
  FOREIGN KEY (formatId) REFERENCES invoice_formats(id) ON DELETE CASCADE,
  UNIQUE KEY unique_vendor_format (vendorId)
);
```

### Update Bills Table
Add `invoiceFormatId` column to the bills table:
```sql
ALTER TABLE bills ADD COLUMN invoiceFormatId INT;
ALTER TABLE bills ADD FOREIGN KEY (invoiceFormatId) REFERENCES invoice_formats(id) ON DELETE SET NULL;
```

---

## 7. Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "name",
      "message": "Name is required"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Unauthorized. Please login."
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "You don't have permission to perform this action"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Invoice format not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## 8. Business Logic

### Default Format
- Only one format can be marked as `isDefault = true`
- When assigning a format to a store/vendor, if no format is assigned, the default format should be used
- When creating a bill, if no format is specified and no format is assigned to the store/vendor, use the default format

### Format Assignment Priority
1. Format selected during bill creation (`invoiceFormatId` in bill)
2. Format assigned to store/vendor
3. Default format
4. If no default format exists, use a basic template

### Format Deletion Rules
- Cannot delete a format if it's assigned to any store or vendor
- Cannot delete the default format
- If a format is deleted, bills using that format should still display (store format ID in bill)

---

## 9. Example Implementation (Node.js/Express)

### Controller Example
```javascript
// Get all invoice formats
exports.getAllFormats = async (req, res) => {
  try {
    const formats = await InvoiceFormat.findAll({
      order: [['isDefault', 'DESC'], ['createdAt', 'DESC']]
    });
    res.json({ success: true, data: formats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create invoice format
exports.createFormat = async (req, res) => {
  try {
    const { name, description, headerTemplate, template, footerTemplate, isDefault } = req.body;
    
    // If setting as default, unset other defaults
    if (isDefault) {
      await InvoiceFormat.update({ isDefault: false }, { where: {} });
    }
    
    const format = await InvoiceFormat.create({
      name,
      description,
      headerTemplate,
      template,
      footerTemplate,
      isDefault: isDefault || false
    });
    
    res.json({ success: true, message: 'Invoice format created successfully', data: format });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Assign format to store
exports.assignStoreFormat = async (req, res) => {
  try {
    const { storeId } = req.params;
    const { formatId } = req.body;
    
    // Check if format exists
    const format = await InvoiceFormat.findByPk(formatId);
    if (!format) {
      return res.status(404).json({ success: false, message: 'Invoice format not found' });
    }
    
    // Check if store exists
    const store = await Store.findByPk(storeId);
    if (!store) {
      return res.status(404).json({ success: false, message: 'Store not found' });
    }
    
    // Create or update assignment
    await StoreInvoiceFormat.upsert({
      storeId,
      formatId
    });
    
    res.json({ success: true, message: 'Invoice format assigned to store successfully', data: { storeId, formatId } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
```

---

## 10. Testing

### Test Cases

1. **Create Invoice Format**
   - Create format with all fields
   - Create format with minimal fields
   - Create format with isDefault = true
   - Verify only one default exists

2. **Update Invoice Format**
   - Update format name
   - Update template
   - Change default status

3. **Delete Invoice Format**
   - Delete format not assigned to any store/vendor
   - Try to delete assigned format (should fail)
   - Try to delete default format (should fail)

4. **Assign Format to Store**
   - Assign format to store
   - Update assignment
   - Get store format

5. **Assign Format to Vendor**
   - Assign format to vendor
   - Update assignment
   - Get vendor format

6. **Bill Creation**
   - Create bill with format ID
   - Create bill without format ID (should use assigned/default)
   - Verify format is stored with bill

---

## 11. Security Considerations

1. **Authentication**: All endpoints require valid authentication token
2. **Authorization**: 
   - Only admin can assign formats to stores/vendors
   - All users can view formats
   - All users can create bills with format selection
3. **Input Validation**: 
   - Validate HTML templates to prevent XSS attacks
   - Sanitize template variables before rendering
4. **SQL Injection**: Use parameterized queries
5. **Rate Limiting**: Implement rate limiting on create/update/delete operations

---

## 12. Notes

- Template rendering should be done server-side for security
- Consider caching frequently used formats
- Log format assignment changes for audit purposes
- Consider versioning for templates to track changes
- Provide preview functionality for templates before saving

