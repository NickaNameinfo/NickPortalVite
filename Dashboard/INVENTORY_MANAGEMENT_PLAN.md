# Inventory Management with Vendor Details - Implementation Plan

## Overview
This plan outlines the implementation of inbound and outbound inventory management with vendor details integration in the Dashboard.

## Current State Analysis

### Existing Components
1. **Dashboard** (`/Dashboard/src/views/Dashboard/index.tsx`)
   - Currently displays basic stats: Products, Customer Orders, Customize Orders, Store Orders
   - No inventory tracking metrics

2. **Stock Management** (`/Dashboard/src/views/vendors/Stock/AddStock.tsx`)
   - Basic stock addition by category
   - No distinction between inbound/outbound
   - Limited vendor information display

3. **Vendor APIs** (`/Dashboard/src/views/vendors/Service.mjs`)
   - `getVendors` - Get all vendors
   - `getVendorsByID` - Get vendor by ID
   - `addVendors`, `updateVendors`, `deleteVendors`

4. **Stock APIs** (`/Dashboard/src/views/vendors/Stock/Service.mjs`)
   - `addStock` - Add stock
   - `getStock` - Get stock by vendor ID
   - `deleteStock` - Delete stock

## Implementation Plan

### Phase 1: Backend API Extensions (Assumed)
**Note:** These endpoints may need to be created on the backend if they don't exist.

#### 1.1 Inventory Transaction APIs
- `POST /inventory/inbound` - Record inbound inventory
  - Body: `{ vendorId, productId, quantity, categoryId, date, notes, referenceNumber }`
- `POST /inventory/outbound` - Record outbound inventory
  - Body: `{ vendorId, productId, quantity, orderId, date, notes, referenceNumber }`
- `GET /inventory/inbound/:vendorId` - Get inbound transactions
- `GET /inventory/outbound/:vendorId` - Get outbound transactions
- `GET /inventory/summary/:vendorId` - Get inventory summary with vendor details

### Phase 2: Frontend Service Layer

#### 2.1 Create Inventory Service (`/Dashboard/src/views/Inventory/Service.mjs`)
```javascript
- useAddInboundMutation
- useAddOutboundMutation
- useGetInboundQuery
- useGetOutboundQuery
- useGetInventorySummaryQuery
```

### Phase 3: Dashboard Updates

#### 3.1 Update Dashboard Component (`/Dashboard/src/views/Dashboard/index.tsx`)
**New Metrics to Add:**
1. **Inbound Inventory**
   - Total inbound quantity (today/week/month)
   - Pending inbound orders
   - Recent inbound transactions count

2. **Outbound Inventory**
   - Total outbound quantity (today/week/month)
   - Pending outbound orders
   - Recent outbound transactions count

3. **Vendor Inventory Summary**
   - Active vendors count
   - Top vendors by inventory movement
   - Low stock alerts by vendor

**New Dashboard Cards:**
- Inbound Inventory (with vendor breakdown)
- Outbound Inventory (with vendor breakdown)
- Vendor Performance
- Inventory Alerts

### Phase 4: Inventory Management Views

#### 4.1 Inbound Inventory Management (`/Dashboard/src/views/Inventory/Inbound/index.tsx`)
**Features:**
- Form to record inbound inventory
  - Vendor selection (with vendor details display)
  - Product selection
  - Quantity input
  - Category selection
  - Date picker
  - Reference number
  - Notes
- List view of inbound transactions
  - Filter by vendor
  - Filter by date range
  - Sort by date, vendor, product
  - Display vendor details (name, contact, image)
- Vendor details modal/sidebar
  - Vendor name, image, contact info
  - Total inbound from this vendor
  - Recent transactions

#### 4.2 Outbound Inventory Management (`/Dashboard/src/views/Inventory/Outbound/index.tsx`)
**Features:**
- Form to record outbound inventory
  - Vendor selection (for vendor-to-store transfers)
  - Product selection
  - Quantity input
  - Order ID (if linked to order)
  - Date picker
  - Reference number
  - Notes
- List view of outbound transactions
  - Filter by vendor
  - Filter by date range
  - Link to orders
  - Display vendor details
- Vendor details integration
  - Total outbound to/from vendor
  - Stock levels per vendor

#### 4.3 Inventory Summary View (`/Dashboard/src/views/Inventory/Summary/index.tsx`)
**Features:**
- Overall inventory dashboard
- Vendor-wise breakdown
  - Current stock per vendor
  - Inbound/outbound totals
  - Vendor performance metrics
- Charts and graphs
  - Inbound vs Outbound trends
  - Top vendors by movement
  - Stock levels by vendor

### Phase 5: Enhanced Stock Management

#### 5.1 Update AddStock Component
**Enhancements:**
- Add vendor details display
  - Show vendor name, image, contact
  - Link to vendor profile
- Add transaction type (inbound/outbound)
- Add reference tracking
- Add date tracking
- Link to inventory transactions

### Phase 6: Vendor Details Integration

#### 6.1 Vendor Details Component (`/Dashboard/src/Components/Cards/VendorInventoryCard.tsx`)
**New Component:**
- Display vendor information
- Show inventory metrics for vendor
- Quick actions (view transactions, add stock)

#### 6.2 Vendor Selection Component (`/Dashboard/src/Components/Common/VendorSelector.tsx`)
**New Component:**
- Dropdown/autocomplete for vendor selection
- Display vendor details when selected
- Search functionality

## File Structure

```
Dashboard/src/
├── views/
│   ├── Dashboard/
│   │   └── index.tsx (UPDATE - add inventory metrics)
│   ├── Inventory/
│   │   ├── Service.mjs (NEW - inventory APIs)
│   │   ├── Inbound/
│   │   │   └── index.tsx (NEW - inbound management)
│   │   ├── Outbound/
│   │   │   └── index.tsx (NEW - outbound management)
│   │   └── Summary/
│   │       └── index.tsx (NEW - inventory summary)
│   └── vendors/
│       └── Stock/
│           └── AddStock.tsx (UPDATE - enhance with vendor details)
├── Components/
│   ├── Cards/
│   │   └── VendorInventoryCard.tsx (NEW)
│   └── Common/
│       └── VendorSelector.tsx (NEW)
```

## Implementation Steps

### Step 1: Create Inventory Service
1. Create `Service.mjs` with RTK Query endpoints
2. Add mutations for inbound/outbound
3. Add queries for fetching transactions

### Step 2: Create Inbound Management View
1. Create form component for recording inbound
2. Create list/table component for viewing transactions
3. Integrate vendor selection and details
4. Add filtering and sorting

### Step 3: Create Outbound Management View
1. Create form component for recording outbound
2. Create list/table component for viewing transactions
3. Integrate vendor selection and details
4. Link to orders if applicable

### Step 4: Update Dashboard
1. Add new API queries for inventory metrics
2. Create new dashboard cards
3. Add navigation to inventory views
4. Display vendor-related inventory stats

### Step 5: Create Supporting Components
1. VendorInventoryCard component
2. VendorSelector component
3. Inventory metrics cards

### Step 6: Update Navigation
1. Add Inventory menu item to `_nav.tsx`
2. Add routes for inventory views
3. Update routing configuration

## Data Model (Expected)

### Inbound Transaction
```typescript
{
  id: number;
  vendorId: number;
  vendor: {
    id: number;
    storename: string;
    vendorImage: string;
    email: string;
    phone: string;
  };
  productId: number;
  product: {
    id: number;
    name: string;
  };
  categoryId: number;
  category: {
    id: number;
    name: string;
  };
  quantity: number;
  date: string;
  referenceNumber: string;
  notes: string;
  createdAt: string;
}
```

### Outbound Transaction
```typescript
{
  id: number;
  vendorId: number;
  vendor: {
    id: number;
    storename: string;
    vendorImage: string;
  };
  productId: number;
  product: {
    id: number;
    name: string;
  };
  quantity: number;
  orderId?: number;
  date: string;
  referenceNumber: string;
  notes: string;
  createdAt: string;
}
```

## UI/UX Considerations

1. **Vendor Details Display**
   - Show vendor image, name, contact in transaction lists
   - Clickable vendor cards to view full details
   - Quick vendor info tooltips

2. **Dashboard Cards**
   - Use icons for inbound (arrow down) and outbound (arrow up)
   - Color coding: green for inbound, red for outbound
   - Clickable cards to navigate to detailed views

3. **Forms**
   - Vendor autocomplete with search
   - Real-time stock validation
   - Clear visual feedback

4. **Tables/Lists**
   - Sortable columns
   - Filterable by vendor, date range
   - Pagination for large datasets
   - Export functionality (future)

## Testing Checklist

- [ ] Inbound transactions can be created
- [ ] Outbound transactions can be created
- [ ] Vendor details display correctly
- [ ] Dashboard metrics update correctly
- [ ] Filtering and sorting work
- [ ] Stock levels update after transactions
- [ ] Vendor selection works correctly
- [ ] Navigation between views works

## Future Enhancements

1. **Reports**
   - Vendor performance reports
   - Inventory movement reports
   - Low stock alerts by vendor

2. **Notifications**
   - Low stock alerts
   - Inbound/outbound notifications

3. **Bulk Operations**
   - Bulk inbound/outbound entry
   - Import from CSV

4. **Analytics**
   - Inventory turnover by vendor
   - Vendor reliability metrics
   - Forecasting

## Notes

- Ensure all API calls use authentication (via baseQuery)
- Handle loading and error states
- Implement proper form validation
- Add confirmation dialogs for critical actions
- Consider mobile responsiveness

