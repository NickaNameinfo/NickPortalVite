# WebSocket Barcode Scanner - Development Guide

## 🎯 Overview

This guide explains how to set up and use the WebSocket-based barcode scanning system for the Billing page. The system allows real-time barcode scanning from mobile/tablet devices that automatically fills product information on the laptop billing page.

**Architecture:**
```
Mobile Scanner → WebSocket Server → Laptop Billing Page
   (HTML5)         (Port 3001)        (Auto-fill)
```

---

## 📋 Prerequisites

### 1. WebSocket Server (Backend)

You need a WebSocket server running. Use the provided `websocket-server.js` in the root directory:

```bash
# Install dependencies (in root directory)
npm install express socket.io cors

# Start server
node websocket-server.js
```

Server will run on **port 3001** by default.

### 2. Frontend Dependencies

The Dashboard already includes `socket.io-client` in `package.json`. Install if needed:

```bash
cd Dashboard
npm install
```

---

## 🚀 Quick Start

### Step 1: Start WebSocket Server

```bash
# In root directory
node websocket-server.js
```

You should see:
```
Barcode backend running on port 3001
```

### Step 2: Configure Environment (Optional)

Create or update `Dashboard/.env`:

```env
VITE_WS_URL=http://localhost:3001
```

For production or network use:
```env
VITE_WS_URL=http://YOUR-LAPTOP-IP:3001
```

### Step 3: Start Dashboard

```bash
cd Dashboard
npm run dev
```

### Step 4: Use Barcode Scanner

1. **On Laptop:**
   - Navigate to **Billing → Add New Bill**
   - Click **"Open Scanner"** button
   - Status should show "Scanner Connected"

2. **On Mobile/Tablet:**
   - Open browser
   - Go to: `http://YOUR-LAPTOP-IP:5173/scan-product.html`
   - Click **"Start Scanner"**
   - **Permission dialog will appear** - Click "Allow Camera"
   - Allow camera permissions when browser prompts
   - Point camera at product barcode
   - Barcode automatically sent to laptop

---

## 📁 File Structure

```
Dashboard/
├── public/
│   └── scan-product.html          # Mobile scanner page (with permission dialog)
├── src/
│   ├── utils/
│   │   └── websocketClient.ts    # WebSocket client utility
│   └── views/
│       └── Billing/
│           └── AddBill.tsx        # Billing page with WebSocket integration
└── package.json                   # Includes socket.io-client
```

---

## 🔧 How It Works

### 1. WebSocket Client (`websocketClient.ts`)

**Location:** `Dashboard/src/utils/websocketClient.ts`

**Purpose:** Centralized WebSocket connection management

**Usage:**
```typescript
import { websocketClient } from "../../utils/websocketClient";

// Connect with callbacks
websocketClient.connect({
  onConnected: () => console.log('Connected'),
  onBarcodeReceived: (barcode) => {
    // Handle barcode
    console.log('Barcode:', barcode);
  },
  onDisconnected: () => console.log('Disconnected'),
  onError: (error) => console.error('Error:', error)
});

// Disconnect
websocketClient.disconnect();

// Check connection status
if (websocketClient.connected) {
  // Connected
}
```

### 2. Scanner Page (`scan-product.html`)

**Location:** `Dashboard/public/scan-product.html`

**Features:**
- ✅ **Permission Dialog** - Asks for camera permission before starting
- HTML5 QR/Barcode scanner using `html5-qrcode` library
- Socket.IO client for WebSocket communication
- Real-time connection status
- Last scanned barcode display
- Start/Stop scanner controls
- Error handling for camera issues

**Permission Flow:**
1. User clicks "Start Scanner"
2. System checks camera permission
3. If denied → Shows permission dialog
4. User clicks "Allow Camera"
5. Browser prompts for permission
6. If granted → Scanner starts
7. If denied → Shows instructions to enable in browser settings

**Access:**
- Development: `http://localhost:5173/scan-product.html`
- Network: `http://YOUR-LAPTOP-IP:5173/scan-product.html`

### 3. Billing Page Integration (`AddBill.tsx`)

**Location:** `Dashboard/src/views/Billing/AddBill.tsx`

**Features:**
- Auto-connects to WebSocket on component mount
- Listens for `product-barcode` events
- Auto-fills product when barcode received
- Shows connection status
- "Open Scanner" button to launch scanner page

**Key Code:**
```typescript
// WebSocket connection
React.useEffect(() => {
  websocketClient.connect({
    onBarcodeReceived: (barcode) => {
      handleBarcodeScanned(barcode);
    }
  });
  return () => websocketClient.disconnect();
}, []);

// Handle barcode
const handleBarcodeScanned = (barcode: string) => {
  // Find product and add to bill
  const product = products.find(p => p.id === barcode);
  if (product) {
    setSelectedProductId(product.id);
    handleAddProduct();
  }
};
```

---

## 📱 Camera Permission Handling

### Permission Dialog

When user clicks "Start Scanner", the system:

1. **Checks browser support** - Verifies `navigator.mediaDevices` exists
2. **Checks current permission** - Tests if camera access is already granted
3. **Shows dialog if needed** - Displays permission request dialog
4. **Requests permission** - Calls `getUserMedia()` when user clicks "Allow Camera"
5. **Handles errors** - Shows specific error messages for different failure types

### Error Handling

The scanner handles various camera errors:

- **NotAllowedError** - Permission denied
  - Shows dialog with instructions to enable in browser settings
  
- **NotFoundError** - No camera found
  - Shows message to connect a camera device
  
- **NotReadableError** - Camera in use
  - Shows message that camera is used by another app
  
- **OverconstrainedError** - Camera doesn't support settings
  - Tries alternative camera settings automatically

### Browser Settings

If permission is denied, users need to:

1. **Chrome/Edge:**
   - Click camera icon in address bar
   - Select "Allow" for camera
   - Refresh page

2. **Safari (iOS):**
   - Go to Settings → Safari → Camera
   - Allow camera access
   - Refresh page

3. **Firefox:**
   - Click camera icon in address bar
   - Select "Allow" for camera
   - Refresh page

---

## 🌐 Network Configuration

### Finding Your Laptop IP Address

**Windows:**
```cmd
ipconfig
```
Look for `IPv4 Address` (e.g., `192.168.1.100`)

**Mac/Linux:**
```bash
ifconfig
# or
ip addr
```

### Network Requirements

✅ **Both devices must be on the same Wi-Fi network**

✅ **Firewall must allow:**
- Port 3001 (WebSocket server)
- Port 5173 (Dashboard dev server)

### Testing Connection

1. **Check WebSocket server:**
   ```bash
   curl http://localhost:3001/health
   ```

2. **Check from mobile:**
   - Open browser on mobile
   - Go to: `http://YOUR-LAPTOP-IP:3001/health`
   - Should return JSON with status

---

## 🔍 Troubleshooting

### Camera Permission Issues

**Problem:** Permission dialog not showing or camera not working

**Solutions:**
1. **Check browser permissions:**
   - Open browser settings
   - Find site permissions
   - Ensure camera is allowed

2. **Try different browser:**
   - Chrome/Edge work best
   - Safari on iOS may have limitations

3. **Check HTTPS requirement:**
   - Some browsers require HTTPS for camera
   - Use `https://` URL if available

4. **Clear browser cache:**
   - Clear site data
   - Refresh page
   - Try again

### Scanner Not Connecting?

**Check 1: WebSocket Server Running**
```bash
# Check if server is running
curl http://localhost:3001/health

# Should return: {"status":"ok","lastBarcode":"","timestamp":...}
```

**Check 2: Browser Console**
- Open DevTools (F12)
- Check Console for connection errors
- Look for `[WebSocket]` messages

**Check 3: Network**
- Verify both devices on same Wi-Fi
- Check firewall settings
- Try pinging laptop IP from mobile

### Barcode Not Auto-Filling?

**Check 1: Connection Status**
- Billing page should show "Scanner Connected"
- If not, check WebSocket server is running

**Check 2: Barcode Format**
- Barcode must match product ID in database
- Check browser console for "Barcode received" message

**Check 3: Product Exists**
- Product must exist in your store's product list
- Check console for "Product not found" messages

---

## 📱 Mobile Access

### Development (Same Device)

If testing on same device:
```
http://localhost:5173/scan-product.html
```

### Network Access (Different Device)

1. Find laptop IP (e.g., `192.168.1.100`)
2. On mobile, open:
   ```
   http://192.168.1.100:5173/scan-product.html
   ```

### Production Setup

For production, you'll need:

1. **Update scanner page server URL:**
   - Edit `scan-product.html`
   - Change `serverUrl` variable to production WebSocket server

2. **Configure Nginx (if using):**
   ```nginx
   # WebSocket proxy
   location /socket.io/ {
       proxy_pass http://localhost:3001;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection "upgrade";
   }
   ```

3. **Use HTTPS/WSS:**
   - WebSocket requires `wss://` for HTTPS sites
   - Update server URL accordingly

---

## 🧪 Testing Checklist

- [ ] WebSocket server starts without errors
- [ ] Dashboard connects to WebSocket (check console)
- [ ] Scanner page opens and connects
- [ ] Permission dialog appears when clicking "Start Scanner"
- [ ] Camera permission granted
- [ ] Barcode scanning works
- [ ] Barcode appears in browser console
- [ ] Barcode received on billing page
- [ ] Product auto-fills correctly
- [ ] Works on same Wi-Fi network
- [ ] Reconnection works after disconnect
- [ ] Error messages show correctly for permission denied

---

## 🔒 Security Notes

### Current Setup
- ⚠️ WebSocket server allows all origins (`origin: "*"`)
- ⚠️ No authentication required

### Production Recommendations

1. **Restrict Origins:**
   ```javascript
   // In websocket-server.js
   cors: {
     origin: ["https://yourdomain.com"],
     methods: ["GET", "POST"]
   }
   ```

2. **Add Authentication:**
   - Verify token on connection
   - Check user permissions

3. **Use HTTPS/WSS:**
   - Required for production
   - Prevents man-in-the-middle attacks

---

## 📊 Event Flow

```
1. Mobile Scanner Page Opens
   ↓
2. Connects to WebSocket Server (port 3001)
   ↓
3. User clicks "Start Scanner"
   ↓
4. Permission dialog appears (if needed)
   ↓
5. User clicks "Allow Camera"
   ↓
6. Browser prompts for camera permission
   ↓
7. Camera starts, scans barcode
   ↓
8. Emits "scan-product" event with barcode
   ↓
9. WebSocket Server broadcasts "product-barcode" event
   ↓
10. Laptop Billing Page receives event
   ↓
11. Finds product by ID
   ↓
12. Auto-fills product in billing form
```

---

## 🛠️ Development Tips

### Debugging

1. **Enable Console Logging:**
   - All WebSocket events are logged to console
   - Look for `[WebSocket]` prefix

2. **Test WebSocket Connection:**
   ```javascript
   // In browser console
   const socket = io('http://localhost:3001');
   socket.on('connect', () => console.log('Connected!'));
   socket.emit('scan-product', 'TEST123');
   ```

3. **Check Network Tab:**
   - Open DevTools → Network
   - Filter by "WS" (WebSocket)
   - See connection status

### Customization

**Change Scanner Size:**
Edit `scan-product.html`:
```javascript
qrbox: { width: 300, height: 300 } // Increase size
```

**Change Server URL:**
Edit `websocketClient.ts`:
```typescript
const wsUrl = "http://your-server:3001";
```

**Add Manual Barcode Input:**
Add input field in scanner page:
```html
<input type="text" id="manualBarcode" placeholder="Enter barcode">
<button onclick="sendManualBarcode()">Send</button>
```

---

## 📚 API Reference

### WebSocket Events

**Client → Server:**
- `scan-product` - Send barcode from scanner

**Server → Client:**
- `product-barcode` - Receive barcode on billing page

### WebSocket Client Methods

```typescript
// Connect
websocketClient.connect(callbacks);

// Disconnect
websocketClient.disconnect();

// Check connection
websocketClient.connected; // boolean

// Update callbacks
websocketClient.setCallbacks(newCallbacks);
```

### Camera Permission API

```javascript
// Check permission
const hasPermission = await checkCameraPermission();

// Request permission
await requestCameraPermission();

// Show dialog
showPermissionDialog();
```

---

## 🎯 Next Steps

1. **Test locally** with same device
2. **Test on network** with mobile device
3. **Test permission dialog** - deny and allow
4. **Configure production** server URL
5. **Add authentication** if needed
6. **Customize scanner** UI if desired

---

## 📞 Support

If you encounter issues:

1. Check browser console for errors
2. Verify WebSocket server is running
3. Check network connectivity
4. Review permission settings in browser
5. Review this guide's troubleshooting section

---

**Last Updated:** December 31, 2025  
**Status:** ✅ Ready for development  
**Permission Dialog:** ✅ Implemented
