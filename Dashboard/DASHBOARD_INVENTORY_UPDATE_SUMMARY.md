# Dashboard Inventory Management Update - Summary

## Quick Overview
This document outlines the specific updates needed to add inbound and outbound inventory management with vendor details to the Dashboard.

## Current Dashboard State
- Location: `/Dashboard/src/views/Dashboard/index.tsx`
- Current Metrics: Products, Customer Orders, Customize Orders, Store Orders
- Missing: Inventory tracking, vendor-based inventory metrics

## Required Updates

### 1. Dashboard Component Updates (`/Dashboard/src/views/Dashboard/index.tsx`)

#### New Metrics to Add:
```typescript
// Add to the list array:
{
  title: "Inbound Inventory",
  img: "inbound-icon", // or use appropriate icon
  price: inboundCount || 0,
  route: "/Inventory/Inbound", // navigation route
  vendorBreakdown: true // flag for vendor details
},
{
  title: "Outbound Inventory", 
  img: "outbound-icon",
  price: outboundCount || 0,
  route: "/Inventory/Outbound",
  vendorBreakdown: true
},
{
  title: "Active Vendors",
  img: "vendor-icon",
  price: activeVendorsCount || 0,
  route: "/Vendors/List"
},
{
  title: "Low Stock Alerts",
  img: "alert-icon", 
  price: lowStockCount || 0,
  route: "/Inventory/Alerts"
}
```

#### New API Queries Needed:
```typescript
// Add these imports and queries:
import { 
  useGetInventorySummaryQuery,
  useGetInboundTransactionsQuery,
  useGetOutboundTransactionsQuery 
} from "../Inventory/Service.mjs";

// In component:
const { data: inventorySummary } = useGetInventorySummaryQuery(vendorId, { 
  skip: !vendorId 
});
const { data: inboundData } = useGetInboundTransactionsQuery(vendorId, { 
  skip: !vendorId 
});
const { data: outboundData } = useGetOutboundTransactionsQuery(vendorId, { 
  skip: !vendorId 
});
```

#### Enhanced Card Component:
- Make cards clickable to navigate to detailed views
- Add vendor breakdown tooltip/modal
- Show trend indicators (up/down arrows)

### 2. New Files to Create

#### A. Inventory Service (`/Dashboard/src/views/Inventory/Service.mjs`)
```javascript
// RTK Query API service for inventory operations
- useGetInventorySummaryQuery(vendorId)
- useGetInboundTransactionsQuery(vendorId, filters)
- useGetOutboundTransactionsQuery(vendorId, filters)
- useAddInboundMutation()
- useAddOutboundMutation()
- useGetVendorInventoryStatsQuery(vendorId)
```

#### B. Inbound Management View (`/Dashboard/src/views/Inventory/Inbound/index.tsx`)
**Key Features:**
- Form to record inbound transactions
- Vendor selection with details
- Product and category selection
- Transaction list with vendor info
- Filtering by vendor, date range

#### C. Outbound Management View (`/Dashboard/src/views/Inventory/Outbound/index.tsx`)
**Key Features:**
- Form to record outbound transactions
- Vendor selection
- Order linking (optional)
- Transaction list with vendor info
- Filtering capabilities

#### D. Vendor Inventory Card Component (`/Dashboard/src/Components/Cards/VendorInventoryCard.tsx`)
**Purpose:** Reusable component to display vendor details with inventory metrics
**Props:**
- vendor: vendor object
- inboundTotal: number
- outboundTotal: number
- currentStock: number

### 3. Navigation Updates

#### Update `_nav.tsx`:
Add new menu item:
```typescript
{
  menuType: "multiple",
  name: "Inventory",
  key: "Inventory",
  link: "/",
  icons: <IconHome />,
  menuItems: [
    {
      menuType: "single",
      name: "Inbound",
      key: "Inbound",
      link: "/Inventory/Inbound",
      icons: <IconHome />,
    },
    {
      menuType: "single",
      name: "Outbound",
      key: "Outbound",
      link: "/Inventory/Outbound",
      icons: <IconHome />,
    },
    {
      menuType: "single",
      name: "Summary",
      key: "Summary",
      link: "/Inventory/Summary",
      icons: <IconHome />,
    },
  ],
}
```

#### Update `routes.tsx`:
Add new routes:
```typescript
const InboundInventory = React.lazy(() => import("../src/views/Inventory/Inbound"));
const OutboundInventory = React.lazy(() => import("../src/views/Inventory/Outbound"));
const InventorySummary = React.lazy(() => import("../src/views/Inventory/Summary"));

// In routes array:
{ path: "/Inventory/Inbound", name: "Inbound Inventory", element: InboundInventory },
{ path: "/Inventory/Outbound", name: "Outbound Inventory", element: OutboundInventory },
{ path: "/Inventory/Summary", name: "Inventory Summary", element: InventorySummary },
```

### 4. Vendor Details Integration Points

#### In Transaction Lists:
- Display vendor name, image, contact
- Clickable vendor name → navigate to vendor details
- Vendor filter dropdown

#### In Forms:
- Vendor autocomplete/selector
- Show selected vendor details
- Validate vendor selection

#### In Dashboard Cards:
- Show vendor breakdown on hover/click
- Link to vendor-specific inventory view

## Implementation Priority

### Phase 1 (Immediate - Dashboard Updates)
1. ✅ Create Inventory Service with API endpoints
2. ✅ Update Dashboard component with new metrics
3. ✅ Add navigation routes
4. ✅ Test dashboard metrics display

### Phase 2 (Core Features)
1. ✅ Create Inbound management view
2. ✅ Create Outbound management view
3. ✅ Integrate vendor selection
4. ✅ Add transaction listing

### Phase 3 (Enhancements)
1. ✅ Create Inventory Summary view
2. ✅ Add vendor inventory card component
3. ✅ Enhance filtering and search
4. ✅ Add reports and analytics

## API Endpoints Required (Backend)

**Note:** These may need to be created if they don't exist:

1. `GET /inventory/summary/:vendorId` - Get inventory summary
2. `GET /inventory/inbound/:vendorId` - Get inbound transactions
3. `GET /inventory/outbound/:vendorId` - Get outbound transactions
4. `POST /inventory/inbound` - Create inbound transaction
5. `POST /inventory/outbound` - Create outbound transaction
6. `GET /inventory/vendor-stats/:vendorId` - Get vendor-specific stats

## Data Flow

```
Dashboard
  ↓
Inventory Service (API calls)
  ↓
Backend API
  ↓
Database (inventory transactions, vendor data)
  ↓
Response with vendor details
  ↓
Display in Dashboard/Views
```

## Key Considerations

1. **Vendor Context**: All inventory operations should be vendor-aware
2. **Stock Updates**: Inbound/outbound should update product stock levels
3. **Audit Trail**: All transactions should be logged with vendor info
4. **Permissions**: Respect role-based access (vendor vs admin)
5. **Real-time Updates**: Dashboard should refresh when transactions occur

## Testing Checklist

- [ ] Dashboard displays new inventory metrics
- [ ] Cards navigate to correct views
- [ ] Vendor details display correctly
- [ ] Inbound transactions can be created
- [ ] Outbound transactions can be created
- [ ] Vendor filtering works
- [ ] Stock levels update correctly
- [ ] Navigation menu includes Inventory section
- [ ] Routes work correctly

## Next Steps

1. Review and confirm backend API availability
2. Create Inventory Service file
3. Update Dashboard component
4. Create Inbound/Outbound views
5. Add navigation and routes
6. Test end-to-end flow

