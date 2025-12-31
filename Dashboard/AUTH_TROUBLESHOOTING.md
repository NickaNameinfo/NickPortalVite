# Authentication Troubleshooting Guide

## 🔍 Issue: Only Login API Working, Other APIs Not Working

### Symptoms:
- ✅ Login API works (returns 200)
- ❌ Other APIs return 401 Unauthorized
- ❌ Protected routes fail

---

## 🔧 Step-by-Step Debugging

### Step 1: Check if Token is Set After Login

1. **Open Browser DevTools** (F12)
2. **Go to Application/Storage → Cookies**
3. **After logging in, check for:**
   - `XSRF-token` cookie (should exist)
   - `token` cookie (should exist)
   - `id` cookie (should exist)

**If cookies are missing:**
- Check login response structure
- Verify `authenticate()` function is called
- Check browser console for errors

### Step 2: Check Token in Network Requests

1. **Open Network tab** in DevTools
2. **Make a request** (e.g., get user data)
3. **Click on the request** → Headers tab
4. **Check Request Headers:**
   - Should see: `Authorization: Bearer <token>`
   - If missing: Token not being added to headers

### Step 3: Verify Token Format

**In Browser Console, run:**
```javascript
// Check cookies
document.cookie

// Check specific cookies
document.cookie.split(';').find(c => c.includes('XSRF-token'))
document.cookie.split(';').find(c => c.includes('token'))
```

**Expected:**
- Cookies should have values
- Values should be JWT tokens (long strings)

### Step 4: Check Login Response Structure

**In Browser Console, after login:**
```javascript
// The login response should have token in one of these locations:
// - result.data.data.token
// - result.data.token
// - result.token
```

**Check Login.tsx:**
- Verify `authenticate(result?.data, ...)` is called
- Verify token is extracted correctly
- Verify cookies are set with correct expiration

---

## 🐛 Common Issues & Fixes

### Issue 1: Token Not in Login Response

**Problem:** Backend not returning token in expected format

**Check:**
```javascript
// In Login.tsx, add logging:
const onSubmit = async (data: any) => {
  const result = await login(data);
  console.log('Login Response:', result);
  console.log('Token location:', {
    'result.data.token': result?.data?.token,
    'result.data.data.token': result?.data?.data?.token,
    'result.token': result?.token,
  });
  // ...
};
```

**Fix:** Update `authenticate()` function to check all possible token locations

---

### Issue 2: Cookies Not Being Set

**Problem:** `setCookie()` function not working

**Check:**
- Browser console for errors
- Cookie domain/path restrictions
- Secure flag issues (if not on HTTPS)

**Fix:**
```javascript
// Test cookie setting manually:
import { setCookie, getCookie } from './JsFiles/CommonFunction.mjs';
setCookie('test', 'value', 60);
console.log('Test cookie:', getCookie('test')); // Should log 'value'
```

---

### Issue 3: Token Not Added to Headers

**Problem:** `prepareHeaders()` not adding Authorization header

**Check:**
1. Open Network tab
2. Check request headers
3. Look for `Authorization` header

**Debug:**
```javascript
// In authHelper.mjs, add logging:
export const prepareHeaders = (headers, api) => {
  const token = getAuthTokenInternal();
  console.log('[prepareHeaders]', {
    endpoint: api?.endpoint,
    hasToken: !!token,
    tokenPreview: token ? token.substring(0, 20) + '...' : null,
  });
  // ...
};
```

---

### Issue 4: Backend Not Accepting Token

**Problem:** Backend middleware not recognizing token format

**Check:**
- Token format: Should be `Bearer <token>`
- Header name: Should be `Authorization` (case-sensitive)
- Token value: Should match cookie value

**Verify in Network Tab:**
```
Request Headers:
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🧪 Testing Steps

### Test 1: Manual Token Check
```javascript
// In browser console:
import { getAuthToken, isAuthenticated } from './utils/authHelper.mjs';
console.log('Token:', getAuthToken());
console.log('Authenticated:', isAuthenticated());
```

### Test 2: Manual API Call
```javascript
// In browser console:
const token = getCookie('XSRF-token') || getCookie('token');
fetch('https://nicknameinfo.net/api/auth/user/123', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  }
})
.then(r => r.json())
.then(console.log)
.catch(console.error);
```

### Test 3: Check prepareHeaders
```javascript
// Add to authHelper.mjs temporarily:
export const prepareHeaders = (headers, api) => {
  console.log('[prepareHeaders] Called for:', api?.endpoint);
  const token = getAuthTokenInternal();
  console.log('[prepareHeaders] Token found:', !!token);
  // ... rest of function
};
```

---

## ✅ Quick Fixes

### Fix 1: Ensure Token is Set Correctly

Update `Login.tsx` authenticate function:
```javascript
const token = user?.data?.token || user?.token || user?.data?.accessToken;
if (!token) {
  console.error('Token not found in:', user);
  return; // Don't proceed without token
}
setCookie("XSRF-token", token, 24 * 60);
setCookie("token", token, 24 * 60);
```

### Fix 2: Verify prepareHeaders is Called

Check that all service files use:
```javascript
prepareHeaders: (headers, api) => {
  return prepareHeaders(headers, api);
}
```

### Fix 3: Check Cookie Reading

Verify `getCookie()` works:
```javascript
// Test in console:
import { getCookie } from './JsFiles/CommonFunction.mjs';
console.log('XSRF-token:', getCookie('XSRF-token'));
console.log('token:', getCookie('token'));
```

---

## 📋 Checklist

- [ ] Token exists in cookies after login
- [ ] `XSRF-token` cookie is set
- [ ] `token` cookie is set
- [ ] `Authorization` header is present in network requests
- [ ] Token format is `Bearer <token>`
- [ ] Backend middleware is configured correctly
- [ ] No CORS issues blocking headers
- [ ] Cookies are not blocked by browser settings

---

## 🚨 Emergency Debug

**Add this to App.tsx temporarily:**
```javascript
import { debugAuth } from "./utils/authDebug.mjs";

// In component:
React.useEffect(() => {
  debugAuth(); // Logs all auth info
}, []);
```

**Check Network Tab:**
1. Filter by "Fetch/XHR"
2. Click on failed request
3. Check:
   - Request Headers (should have Authorization)
   - Response (should show 401 error details)
   - Preview/Response tab (error message)

---

## 📞 Next Steps

If issues persist:
1. Check backend logs for authentication errors
2. Verify backend middleware is working
3. Test with Postman/curl to isolate frontend vs backend issue
4. Check browser console for CORS or other errors

---

**Last Updated:** December 31, 2025
