# Backend Middleware Integration - Complete Guide

**Date:** December 31, 2025  
**Backend Middleware:** `requireAuth` with JWT strategy

---

## 🔄 Backend Middleware Behavior

### Token Detection Order:
1. **Cookie:** `req.cookies['XSRF-token']` (preferred)
2. **Header:** `req.headers['authorization']` (fallback)

### Public Routes (No Auth Required):
- `/auth/register`
- `/auth/rootLogin`
- `/customer/register`
- `/customer/login`

### Protected Routes:
- **All other routes** require valid JWT token

### Response Format:
- **401 Unauthorized** if token missing/invalid
- **Message:** "Authentication required. Please provide a valid access token in cookie (XSRF-token) or Authorization header."

---

## ✅ Frontend Implementation

### 1. **Token Storage** (`Login.tsx`)

**After successful login:**
```javascript
// Sets both cookies for backend compatibility
setCookie("XSRF-token", token, expirationMinutes);  // Backend checks this first
setCookie("token", token, expirationMinutes);        // Fallback
```

**Token Extraction:**
- Checks multiple locations in response
- Logs token location for debugging
- Validates token exists before proceeding

### 2. **Token Retrieval** (`authHelper.mjs`)

**Priority Order (matches backend):**
```javascript
// 1. Check XSRF-token cookie (backend preference)
// 2. Check token cookie (fallback)
const token = getCookie("XSRF-token") || getCookie("token");
```

### 3. **Header Preparation** (`authHelper.mjs`)

**For Protected Routes:**
```javascript
// Adds Authorization header
headers.set("Authorization", `Bearer ${token}`);
```

**For Public Routes:**
```javascript
// No Authorization header added
// Backend middleware allows these without auth
```

### 4. **Public Route Detection**

**By Endpoint Name:**
- `Login` → `/auth/rootLogin` (public)
- `Register` → `/auth/register` (public)
- All others → Protected (require auth)

---

## 🔍 Verification Steps

### Step 1: Verify Token is Set After Login

**In Browser Console:**
```javascript
// Check cookies
document.cookie

// Check specific cookies
document.cookie.split(';').find(c => c.includes('XSRF-token'))
document.cookie.split(';').find(c => c.includes('token'))
```

**Expected:**
- Both `XSRF-token` and `token` cookies should exist
- Values should be JWT tokens (long strings)

### Step 2: Verify Authorization Header is Sent

**In Network Tab:**
1. Open DevTools → Network
2. Make any API call (e.g., get user data)
3. Click on the request
4. Check "Request Headers"
5. Look for: `Authorization: Bearer <token>`

**Expected:**
- Header should be present for protected routes
- Format: `Bearer <token>`
- Token should match cookie value

### Step 3: Verify Public Routes Don't Send Auth

**In Network Tab:**
1. Make login/register request
2. Check Request Headers
3. `Authorization` header should **NOT** be present

**Expected:**
- No Authorization header for Login/Register
- Request should succeed (200 OK)

---

## 🐛 Troubleshooting

### Issue: 401 Unauthorized on Protected Routes

**Possible Causes:**
1. Token not in cookies
2. Token not in Authorization header
3. Token format incorrect
4. Token expired/invalid

**Debug Steps:**
```javascript
// 1. Check if token exists
import { getAuthToken, debugAuth } from './utils/authDebug.mjs';
console.log('Token:', getAuthToken());
debugAuth();

// 2. Check Network tab
// - Look at Request Headers
// - Verify Authorization header format
// - Check Response for error details

// 3. Check Backend Logs
// - Verify middleware is receiving token
// - Check JWT validation errors
```

### Issue: Token Not Set After Login

**Check:**
1. Login response structure
2. Token location in response
3. `authenticate()` function execution
4. Cookie setting errors

**Debug:**
```javascript
// In Login.tsx, check console logs:
// - '[Login] Full response:' - shows response structure
// - '[Login] Token extraction:' - shows token location
// - '[Login] Token set in cookies' - confirms cookie setting
```

### Issue: Authorization Header Not Sent

**Check:**
1. `prepareHeaders()` is being called
2. Token exists when `prepareHeaders()` runs
3. Endpoint is not marked as public

**Debug:**
```javascript
// Add logging to prepareHeaders:
console.log('[prepareHeaders]', {
  endpoint: api?.endpoint,
  hasToken: !!token,
  tokenPreview: token ? token.substring(0, 20) + '...' : null,
});
```

---

## 📋 Integration Checklist

### Frontend:
- [x] Token stored in `XSRF-token` cookie (backend preference)
- [x] Token stored in `token` cookie (fallback)
- [x] `Authorization: Bearer <token>` header added for protected routes
- [x] No Authorization header for public routes (Login, Register)
- [x] Token retrieved from `XSRF-token` first, then `token`
- [x] Public route detection works correctly

### Backend (Verify):
- [ ] Middleware checks `XSRF-token` cookie first
- [ ] Middleware checks `Authorization` header as fallback
- [ ] JWT validation works correctly
- [ ] Public routes are properly configured
- [ ] 401 responses include helpful error messages

---

## 🔧 Manual Testing

### Test 1: Login and Verify Token
```javascript
// 1. Login through UI
// 2. Check cookies in DevTools
// 3. Verify both XSRF-token and token exist
```

### Test 2: Protected API Call
```javascript
// 1. After login, make any protected API call
// 2. Check Network tab → Request Headers
// 3. Verify Authorization: Bearer <token> is present
// 4. Verify response is 200 (not 401)
```

### Test 3: Public Route (Login)
```javascript
// 1. Logout (clear cookies)
// 2. Make login request
// 3. Check Network tab → Request Headers
// 4. Verify NO Authorization header
// 5. Verify response is 200
```

---

## 📝 Code Flow

### Login Flow:
1. User submits login form
2. `useLoginMutation()` called (no auth header - public route)
3. Backend validates credentials
4. Backend returns token in response
5. `authenticate()` extracts token
6. Token saved to `XSRF-token` and `token` cookies
7. User redirected to dashboard

### Protected API Flow:
1. Component calls API hook (e.g., `useGetUserQuery()`)
2. RTK Query calls `prepareHeaders()`
3. `prepareHeaders()` checks if route is public
4. If not public, retrieves token from cookies
5. Adds `Authorization: Bearer <token>` header
6. Request sent to backend
7. Backend middleware validates token
8. If valid, request proceeds; if invalid, returns 401

---

## ⚠️ Important Notes

1. **Cookie Names:**
   - Backend checks `XSRF-token` first (preferred)
   - Frontend sets both `XSRF-token` and `token` for compatibility

2. **Header Format:**
   - Must be: `Authorization: Bearer <token>`
   - Backend checks `req.headers['authorization']` (lowercase, but case-insensitive)

3. **Public Routes:**
   - Login and Register endpoints automatically skip auth
   - No Authorization header sent for these routes

4. **Token Validation:**
   - Backend uses `jwtStrategy` to validate tokens
   - Invalid/expired tokens return 401
   - Frontend should handle 401 by redirecting to login

---

## 🚀 Next Steps

1. **Test Login:**
   - Verify token is set in cookies
   - Check console logs for token location

2. **Test Protected APIs:**
   - Make API call after login
   - Verify Authorization header in Network tab
   - Verify response is 200 (not 401)

3. **If Still Failing:**
   - Use `debugAuth()` to check token status
   - Check backend logs for authentication errors
   - Verify backend middleware configuration

---

**Status:** ✅ Code updated to match backend middleware  
**Next:** Test and verify all APIs work correctly
