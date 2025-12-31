# Right-Click Implementation Guide

## Overview
Right-click functionality has been implemented in the Frontend with two main features:
1. **Disable Right-Click** - Security feature to prevent context menu
2. **Custom Context Menu** - Customizable right-click menu component

## 1. Disable Right-Click (Security Feature)

### Automatic Implementation
Right-click is automatically disabled in `DefaultLayout.tsx` for security purposes.

### Configuration
You can control this via environment variable:
```env
VITE_DISABLE_RIGHT_CLICK=false  # Set to 'false' to enable right-click
```

### Manual Usage
```tsx
import { useDisableRightClick, DisableRightClick } from '../utils/rightClickHandler';

// Using hook
function MyComponent() {
  useDisableRightClick(true, false); // enabled, showMessage
  return <div>Content</div>;
}

// Using component wrapper
function MyComponent() {
  return (
    <DisableRightClick enabled={true} showMessage={false}>
      <div>Content</div>
    </DisableRightClick>
  );
}
```

## 2. Custom Context Menu

### Basic Usage
```tsx
import { ContextMenu, ContextMenuItem } from '../Components';

function MyComponent() {
  const menuItems: ContextMenuItem[] = [
    {
      label: 'Copy',
      onClick: () => {
        console.log('Copy clicked');
        // Your copy logic
      },
    },
    {
      label: 'Share',
      onClick: () => {
        console.log('Share clicked');
        // Your share logic
      },
    },
    {
      divider: true, // Adds a divider line
    },
    {
      label: 'Report',
      onClick: () => {
        console.log('Report clicked');
        // Your report logic
      },
      disabled: false, // Can disable items
    },
  ];

  return (
    <ContextMenu items={menuItems}>
      <div className="p-4 border">
        Right-click me to see the context menu!
      </div>
    </ContextMenu>
  );
}
```

### Usage with Product Cards
```tsx
import { ContextMenu, ContextMenuItem } from '../Components';

function ProductCard({ product }) {
  const menuItems: ContextMenuItem[] = [
    {
      label: 'Add to Cart',
      onClick: () => {
        addToCart(product);
      },
    },
    {
      label: 'Add to Wishlist',
      onClick: () => {
        addToWishlist(product);
      },
    },
    {
      divider: true,
    },
    {
      label: 'Share Product',
      onClick: () => {
        shareProduct(product);
      },
    },
    {
      label: 'Report Product',
      onClick: () => {
        reportProduct(product);
      },
    },
  ];

  return (
    <ContextMenu items={menuItems}>
      <div className="product-card">
        <img src={product.image} alt={product.name} />
        <h3>{product.name}</h3>
        <p>${product.price}</p>
      </div>
    </ContextMenu>
  );
}
```

### Usage in Store Listings
```tsx
import { ContextMenu, ContextMenuItem } from '../Components';

function StoreCard({ store }) {
  const menuItems: ContextMenuItem[] = [
    {
      label: 'View Store',
      onClick: () => {
        navigate(`/store/${store.id}`);
      },
    },
    {
      label: 'Get Directions',
      onClick: () => {
        openMap(store.location);
      },
    },
    {
      divider: true,
    },
    {
      label: 'Call Store',
      onClick: () => {
        window.location.href = `tel:${store.phone}`;
      },
    },
    {
      label: 'WhatsApp',
      onClick: () => {
        window.open(`https://wa.me/${store.phone}`);
      },
    },
  ];

  return (
    <ContextMenu items={menuItems}>
      <div className="store-card">
        <h3>{store.name}</h3>
        <p>{store.address}</p>
      </div>
    </ContextMenu>
  );
}
```

## Features

### Context Menu Features:
- ✅ Automatic positioning (adjusts if goes off-screen)
- ✅ Click outside to close
- ✅ ESC key to close
- ✅ Disabled items support
- ✅ Dividers between items
- ✅ Custom icons
- ✅ Custom styling via className
- ✅ Dark mode support

### Disable Right-Click Features:
- ✅ Prevents context menu
- ✅ Disables F12 (Developer Tools)
- ✅ Disables Ctrl+Shift+I (DevTools)
- ✅ Disables Ctrl+Shift+J (Console)
- ✅ Disables Ctrl+U (View Source)
- ✅ Disables Ctrl+S (Save Page)
- ✅ Optional text selection disable

## Notes

1. **Security**: Right-click is disabled by default for security. You can enable it per component if needed.

2. **Performance**: Context menus are lightweight and only render when opened.

3. **Accessibility**: Context menus support keyboard navigation (ESC to close).

4. **Customization**: All styling can be customized via className props.
