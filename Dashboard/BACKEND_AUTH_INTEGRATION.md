# Backend Authentication Middleware Integration

**Date:** December 31, 2025  
**Purpose:** Updated Dashboard API calls to work with backend authentication middleware

---

## ✅ Changes Made

### 1. **Updated Authentication Helper** (`Dashboard/src/utils/authHelper.mjs`)

#### Changes:
- ✅ Added support for `XSRF-token` cookie (backend checks this first)
- ✅ Still supports `token` cookie as fallback
- ✅ Added public route detection
- ✅ Updated `prepareHeaders` to skip auth for public routes

#### Public Routes (No Authentication Required):
- `/auth/register`
- `/auth/rootLogin`
- `/customer/register`
- `/customer/login`

#### Token Detection:
```javascript
// Backend middleware checks for:
// 1. Cookie: 'XSRF-token' (preferred)
// 2. Cookie: 'token' (fallback)
// 3. Header: 'Authorization: Bearer <token>'
```

### 2. **Updated Login Component** (`Dashboard/src/views/pages/login/Login.tsx`)

#### Changes:
- ✅ Now sets both `XSRF-token` and `token` cookies on login
- ✅ Ensures compatibility with backend middleware expectations

```javascript
// Sets both cookies for backend compatibility
setCookie("XSRF-token", user.token, expirationMinutes);
setCookie("token", user.token, expirationMinutes);
```

### 3. **Updated All Service Files**

#### Changes:
- ✅ Updated all 11 service files to use new `prepareHeaders` signature
- ✅ Public routes (Login, Register) automatically skip authentication
- ✅ All other routes include `Authorization: Bearer <token>` header

#### Updated Files:
- `Service.mjs` (Global API)
- `views/pages/Service.mjs` (Auth API)
- `views/Products/Service.mjs`
- `views/Store/Service.mjs`
- `views/Categories/Service.mjs`
- `views/Billing/Service.mjs`
- `views/vendors/Service.mjs`
- `views/Subscriptions/Service.mjs`
- `views/VendorProducts/Service.mjs`
- `views/vendors/Stock/Service.mjs`

---

## 🔒 How It Works

### Authentication Flow:

1. **Public Routes (Login/Register):**
   - No `Authorization` header sent
   - Backend middleware allows request through
   - User receives token in response

2. **Protected Routes (All Others):**
   - `Authorization: Bearer <token>` header sent
   - Token retrieved from `XSRF-token` or `token` cookie
   - Backend middleware validates token
   - Request proceeds if token is valid

### Backend Middleware Behavior:

```javascript
// Backend checks:
1. Is route public? → Allow without auth
2. Has token in cookie (XSRF-token or token)? → Validate
3. Has token in Authorization header? → Validate
4. Token valid? → Allow request
5. Token invalid/missing? → Return 401 Unauthorized
```

---

## 📋 API Call Examples

### Public Route (Login):
```javascript
// No Authorization header sent
POST /api/auth/rootLogin
Body: { email, password }
```

### Protected Route (Get User):
```javascript
// Authorization header automatically added
GET /api/auth/user/123
Headers: {
  Authorization: "Bearer <token>",
  Content-Type: "application/json"
}
```

---

## ✅ Verification Checklist

- [x] Login/Register endpoints don't send auth headers
- [x] All other endpoints send `Authorization: Bearer <token>` header
- [x] Token retrieved from `XSRF-token` cookie (preferred) or `token` cookie
- [x] Both cookies set on successful login
- [x] Public route detection works correctly
- [x] All 11 service files updated

---

## 🔧 Configuration

### Cookie Names:
- Primary: `XSRF-token` (backend checks this first)
- Fallback: `token` (for compatibility)

### Header Format:
- `Authorization: Bearer <token>`

### Public Endpoints:
- Automatically detected by endpoint name: `Login`, `Register`
- Or by URL path: `/auth/register`, `/auth/rootLogin`, etc.

---

## ⚠️ Important Notes

1. **Backend Must Set XSRF-token Cookie:**
   - Backend should set `XSRF-token` cookie on successful login
   - Cookie should have `HttpOnly` flag (set by backend)
   - Frontend also sets it for compatibility

2. **Token Validation:**
   - Backend middleware validates tokens
   - Returns `401 Unauthorized` for invalid/missing tokens
   - Frontend should handle 401 responses (redirect to login)

3. **Public Routes:**
   - Login and Register endpoints are automatically excluded from auth
   - No changes needed in component code

---

## 🐛 Troubleshooting

### Issue: 401 Unauthorized on protected routes

**Check:**
1. Is token being set on login? (Check cookies in browser)
2. Is `XSRF-token` or `token` cookie present?
3. Is `Authorization` header being sent? (Check Network tab)
4. Is token valid? (Check backend logs)

### Issue: Login/Register failing

**Check:**
1. Are these routes marked as public in backend?
2. Is no `Authorization` header being sent? (Should be empty for public routes)
3. Check backend middleware configuration

### Issue: Token not found

**Check:**
1. Is login successful? (Check response)
2. Are cookies being set? (Check browser DevTools → Application → Cookies)
3. Is cookie domain/path correct?

---

## 📚 Related Files

- `Dashboard/src/utils/authHelper.mjs` - Authentication utilities
- `Dashboard/src/views/pages/login/Login.tsx` - Login component
- `Dashboard/src/JsFiles/CommonFunction.mjs` - Cookie utilities
- All `Service.mjs` files - API service definitions

---

**Status:** ✅ **Complete - All Dashboard API calls updated for backend authentication middleware**
