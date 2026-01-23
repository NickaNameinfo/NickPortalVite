# API Update Required: Invoice Type Field

## Overview
The frontend now includes an `invoiceType` field when creating bills. The backend API needs to be updated to accept, store, and return this field.

## Required Backend Updates

### 1. POST `/api/billing/add` - Create Bill

**Current Request Body (from documentation):**
```json
{
  "storeId": 1,
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "customerPhone": "+1234567890",
  "invoiceFormatId": 2,
  "products": [...],
  "subtotal": "200.00",
  "discount": "10.00",
  "discountPercent": "5.00",
  "tax": "19.00",
  "taxPercent": "10.00",
  "total": "209.00",
  "notes": "Customer notes"
}
```

**Updated Request Body (add `invoiceType`):**
```json
{
  "storeId": 1,
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "customerPhone": "+1234567890",
  "invoiceType": "Invoice",  // NEW FIELD: "DC", "Invoice", or "Quotation"
  "invoiceFormatId": 2,
  "products": [...],
  "subtotal": "200.00",
  "discount": "10.00",
  "discountPercent": "5.00",
  "tax": "19.00",
  "taxPercent": "10.00",
  "total": "209.00",
  "notes": "Customer notes"
}
```

**Field Details:**
- `invoiceType` (string, optional, default: "Invoice")
  - Valid values: `"DC"`, `"Invoice"`, `"Quotation"`
  - Default: `"Invoice"` if not provided
  - Description: Type of document being created

### 2. Database Schema Update

Add `invoiceType` column to the bills table:

```sql
ALTER TABLE bills 
ADD COLUMN invoiceType VARCHAR(20) DEFAULT 'Invoice' 
CHECK (invoiceType IN ('DC', 'Invoice', 'Quotation'));
```

Or if using Sequelize/ORM:
```javascript
invoiceType: {
  type: DataTypes.STRING(20),
  allowNull: false,
  defaultValue: 'Invoice',
  validate: {
    isIn: [['DC', 'Invoice', 'Quotation']]
  }
}
```

### 3. GET `/api/billing/getById/:id` - Get Bill

**Updated Response (include `invoiceType`):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "storeId": 1,
    "customerName": "John Doe",
    "customerEmail": "john@example.com",
    "customerPhone": "+1234567890",
    "invoiceType": "Invoice",  // NEW FIELD
    "invoiceFormatId": 2,
    "invoiceFormat": {...},
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

### 4. GET `/api/billing/getByStoreId/:id` - Get All Bills

**Updated Response (include `invoiceType` in each bill):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "storeId": 1,
      "customerName": "John Doe",
      "invoiceType": "Invoice",  // NEW FIELD
      ...
    },
    {
      "id": 2,
      "storeId": 1,
      "customerName": "Jane Smith",
      "invoiceType": "DC",  // NEW FIELD
      ...
    }
  ]
}
```

### 5. POST `/api/billing/update` - Update Bill

**Updated Request Body (add `invoiceType`):**
```json
{
  "id": 1,
  "invoiceType": "Quotation",  // NEW FIELD - can be updated
  "customerName": "Updated Name",
  ...
}
```

## Backend Implementation Checklist

- [ ] Add `invoiceType` field to bills model/schema
- [ ] Update `POST /api/billing/add` to accept and save `invoiceType`
- [ ] Update `GET /api/billing/getById/:id` to return `invoiceType`
- [ ] Update `GET /api/billing/getByStoreId/:id` to return `invoiceType` in each bill
- [ ] Update `POST /api/billing/update` to allow updating `invoiceType`
- [ ] Add validation to ensure `invoiceType` is one of: "DC", "Invoice", "Quotation"
- [ ] Set default value to "Invoice" if not provided
- [ ] Update database migration script
- [ ] Test all endpoints with the new field

## Frontend Status

✅ **Frontend is already updated:**
- `AddBill.tsx` sends `invoiceType` in the request body
- Default value is "Invoice" if not selected
- Field is required in the form

## Notes

- The `invoiceType` field can be used to:
  - Display different document titles (e.g., "Delivery Challan" vs "Tax Invoice")
  - Filter bills by type
  - Apply different business logic based on document type
  - Generate different document numbers/prefixes

