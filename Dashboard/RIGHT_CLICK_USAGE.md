# Right-Click Implementation Guide

## Overview
Right-click functionality has been implemented in the Dashboard with two main features:
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
      label: 'Edit',
      onClick: () => {
        console.log('Edit clicked');
        // Your edit logic
      },
    },
    {
      divider: true, // Adds a divider line
    },
    {
      label: 'Delete',
      onClick: () => {
        console.log('Delete clicked');
        // Your delete logic
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

### Advanced Usage with Icons
```tsx
import { ContextMenu, ContextMenuItem } from '../Components';
import { IconEdit, IconDelete, IconCopy } from '../Components/Common/Icons/icon';

function ProductCard({ product }) {
  const menuItems: ContextMenuItem[] = [
    {
      label: 'Copy Product',
      icon: <IconCopy />,
      onClick: () => {
        navigator.clipboard.writeText(product.name);
      },
    },
    {
      label: 'Edit Product',
      icon: <IconEdit />,
      onClick: () => {
        navigate(`/products/edit/${product.id}`);
      },
    },
    {
      divider: true,
    },
    {
      label: 'Delete Product',
      icon: <IconDelete />,
      onClick: () => {
        handleDelete(product.id);
      },
      disabled: !canDelete, // Conditional disable
      className: 'text-red-500', // Custom styling
    },
  ];

  return (
    <ContextMenu items={menuItems}>
      <div className="product-card">
        <h3>{product.name}</h3>
        <p>{product.description}</p>
      </div>
    </ContextMenu>
  );
}
```

### Usage in Tables/Lists
```tsx
import { ContextMenu, ContextMenuItem } from '../Components';

function ProductsList() {
  const handleView = (id) => {
    navigate(`/products/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/products/edit/${id}`);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure?')) {
      deleteProduct(id);
    }
  };

  return (
    <div>
      {products.map((product) => (
        <ContextMenu
          key={product.id}
          items={[
            { label: 'View', onClick: () => handleView(product.id) },
            { label: 'Edit', onClick: () => handleEdit(product.id) },
            { divider: true },
            { label: 'Delete', onClick: () => handleDelete(product.id) },
          ]}
        >
          <div className="product-item">
            {product.name}
          </div>
        </ContextMenu>
      ))}
    </div>
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
