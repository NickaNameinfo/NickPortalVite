# API Security Fix Development Plan

**Focus:** API-related security issues only  
**Timeline:** 4-6 weeks  
**Priority:** Critical API Security

---

## 🔴 CRITICAL API SECURITY ISSUES

### Issue 1: Missing Authentication Headers in API Calls
**Severity:** CRITICAL  
**Impact:** Unauthorized access, data manipulation, session hijacking

### Issue 2: User IDs Exposed in URLs
**Severity:** HIGH  
**Impact:** User enumeration, unauthorized access, privacy violations

### Issue 3: No Rate Limiting
**Severity:** HIGH  
**Impact:** Brute force attacks, DDoS, resource exhaustion

### Issue 4: Missing CSRF Protection
**Severity:** HIGH  
**Impact:** Cross-site request forgery attacks

### Issue 5: No Request Timeout Configuration
**Severity:** MEDIUM  
**Impact:** Resource exhaustion, hanging requests

---

## 📅 WEEK 1: Authentication & Authorization

### Day 1-2: Implement Authentication Headers (Dashboard)

**Files to Update:**
- `Dashboard/src/Service.mjs`
- `Dashboard/src/views/Products/Service.mjs`
- `Dashboard/src/views/Store/Service.mjs`
- `Dashboard/src/views/Categories/Service.mjs`
- `Dashboard/src/views/Billing/Service.mjs`
- `Dashboard/src/views/vendors/Service.mjs`
- `Dashboard/src/views/Subscriptions/Service.mjs`
- `Dashboard/src/views/VendorProducts/Service.mjs`

**Implementation:**

1. **Create Authentication Utility:**
```javascript
// Dashboard/src/utils/authHelper.mjs
import { getCookie } from "../JsFiles/CommonFunction.mjs";

export const getAuthHeaders = () => {
  const token = getCookie("token");
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

export const prepareHeaders = (headers) => {
  const token = getCookie("token");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  return headers;
};
```

2. **Update All Service Files:**
```javascript
// Example: Dashboard/src/Service.mjs
import { prepareHeaders } from "../utils/authHelper.mjs";

const axiosBaseQuery = fetchBaseQuery({
  baseUrl: infoData.baseApi,
  prepareHeaders: (headers, { getState }) => {
    return prepareHeaders(headers);
  },
});
```

**Checklist:**
- [ ] Create `authHelper.mjs` utility
- [ ] Update `Dashboard/src/Service.mjs`
- [ ] Update `Dashboard/src/views/Products/Service.mjs`
- [ ] Update `Dashboard/src/views/Store/Service.mjs`
- [ ] Update `Dashboard/src/views/Categories/Service.mjs`
- [ ] Update `Dashboard/src/views/Billing/Service.mjs`
- [ ] Update `Dashboard/src/views/vendors/Service.mjs`
- [ ] Update `Dashboard/src/views/Subscriptions/Service.mjs`
- [ ] Update `Dashboard/src/views/VendorProducts/Service.mjs`
- [ ] Test all API calls with authentication

---

### Day 3-4: Implement Authentication Headers (Frontend)

**Files to Update:**
- `Frontend/src/Service.mjs`
- `Frontend/src/views/pages/login/Service.mjs`
- `Frontend/src/views/pages/Store/Service.mjs`
- `Frontend/src/views/pages/Product/Service.mjs`
- `Frontend/src/views/pages/Vendor/Service.mjs`
- `Frontend/src/views/pages/Service.mjs`

**Implementation:**

1. **Create Authentication Utility:**
```javascript
// Frontend/src/utils/authHelper.mjs
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token') || getCookie('token');
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

export const prepareHeaders = (headers) => {
  const token = localStorage.getItem('token') || getCookie('token');
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  return headers;
};
```

2. **Update All Service Files:**
```javascript
// Example: Frontend/src/Service.mjs
import { prepareHeaders } from "../utils/authHelper.mjs";

const axiosBaseQuery = fetchBaseQuery({
  baseUrl: infoData.baseApi,
  prepareHeaders: (headers) => {
    return prepareHeaders(headers);
  },
});
```

**Checklist:**
- [ ] Create `authHelper.mjs` utility
- [ ] Update `Frontend/src/Service.mjs`
- [ ] Update `Frontend/src/views/pages/login/Service.mjs`
- [ ] Update `Frontend/src/views/pages/Store/Service.mjs`
- [ ] Update `Frontend/src/views/pages/Product/Service.mjs`
- [ ] Update `Frontend/src/views/pages/Vendor/Service.mjs`
- [ ] Update `Frontend/src/views/pages/Service.mjs`
- [ ] Test all API calls with authentication

---

### Day 5: Implement Authentication Headers (Flutter)

**Files to Update:**
- `App/appv1/lib/helpers/subscription_service.dart`
- `App/appv1/lib/views/main/seller/dashboard_screens/edit_product.dart`
- `App/appv1/lib/views/main/seller/dashboard_screens/subscription_screen.dart`
- `App/appv1/lib/views/main/seller/dashboard.dart`
- `App/appv1/lib/views/auth/auth.dart`
- `App/appv1/lib/views/main/customer/profile.dart`
- All other files making HTTP calls

**Implementation:**

1. **Create Secure HTTP Client:**
```dart
// App/appv1/lib/helpers/secure_http_client.dart
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class SecureHttpClient {
  static Future<Map<String, String>> _getHeaders() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');
    
    final headers = <String, String>{
      'Content-Type': 'application/json',
    };
    
    if (token != null && token.isNotEmpty) {
      headers['Authorization'] = 'Bearer $token';
    }
    
    return headers;
  }
  
  static Future<http.Response> get(
    String url, {
    Duration timeout = const Duration(seconds: 10),
  }) async {
    final headers = await _getHeaders();
    return await http.get(
      Uri.parse(url),
      headers: headers,
    ).timeout(timeout);
  }
  
  static Future<http.Response> post(
    String url, {
    Map<String, dynamic>? body,
    Duration timeout = const Duration(seconds: 10),
  }) async {
    final headers = await _getHeaders();
    return await http.post(
      Uri.parse(url),
      headers: headers,
      body: body != null ? json.encode(body) : null,
    ).timeout(timeout);
  }
  
  static Future<http.Response> put(
    String url, {
    Map<String, dynamic>? body,
    Duration timeout = const Duration(seconds: 10),
  }) async {
    final headers = await _getHeaders();
    return await http.put(
      Uri.parse(url),
      headers: headers,
      body: body != null ? json.encode(body) : null,
    ).timeout(timeout);
  }
  
  static Future<http.Response> delete(
    String url, {
    Duration timeout = const Duration(seconds: 10),
  }) async {
    final headers = await _getHeaders();
    return await http.delete(
      Uri.parse(url),
      headers: headers,
    ).timeout(timeout);
  }
}
```

2. **Replace All HTTP Calls:**
```dart
// Before:
final response = await http.get(Uri.parse(url));

// After:
final response = await SecureHttpClient.get(url);
```

**Checklist:**
- [ ] Create `secure_http_client.dart`
- [ ] Update `subscription_service.dart`
- [ ] Update `edit_product.dart`
- [ ] Update `subscription_screen.dart`
- [ ] Update `dashboard.dart`
- [ ] Update `auth.dart`
- [ ] Update all other HTTP calls
- [ ] Test all API calls with authentication

---

## 📅 WEEK 2: URL Security & Input Validation

### Day 1-2: Fix User ID Exposure in URLs

**Problem:** User IDs directly in URLs enable enumeration attacks.

**Solution Options:**

**Option A: Use Session-Based Identification (Recommended)**
- Backend should identify user from token, not URL parameter
- Change: `/api/auth/user/{userId}` → `/api/auth/user/me`
- Change: `/api/cart/list/{userId}` → `/api/cart/list` (user from token)

**Option B: Use UUIDs Instead of Sequential IDs**
- Replace sequential IDs with UUIDs
- Makes enumeration much harder

**Implementation (Frontend/Dashboard):**

1. **Update API Calls to Use Session:**
```javascript
// Before:
url: `/auth/user/${userId}`

// After:
url: `/auth/user/me`  // Backend extracts user from token
```

2. **Update All User-Specific Endpoints:**
- `/api/auth/user/{userId}` → `/api/auth/user/me`
- `/api/cart/list/{userId}` → `/api/cart/list`
- `/api/order/list/{userId}` → `/api/order/list`
- `/api/address/list/{userId}` → `/api/address/list`

**Checklist:**
- [ ] Update Dashboard API calls
- [ ] Update Frontend API calls
- [ ] Update Flutter API calls
- [ ] Coordinate with backend team for endpoint changes
- [ ] Test all user-specific endpoints

---

### Day 3-4: Implement Input Validation

**Files to Update:**
- All forms accepting user input
- All API service files

**Implementation:**

1. **Create Validation Utilities:**
```javascript
// Dashboard/src/utils/validation.mjs
export const validators = {
  // Email validation
  email: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },
  
  // Phone validation (10 digits)
  phone: (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
  },
  
  // Price validation
  price: (price) => {
    const priceRegex = /^\d+(\.\d{1,2})?$/;
    return priceRegex.test(price);
  },
  
  // Sanitize HTML
  sanitize: (input) => {
    if (typeof input !== 'string') return input;
    return input
      .replace(/[<>]/g, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+=/gi, '');
  },
  
  // Validate product name
  productName: (name) => {
    if (!name || name.trim().length < 2) return false;
    if (name.length > 200) return false;
    return /^[a-zA-Z0-9\s\-_&.,()]+$/.test(name);
  },
  
  // Validate description
  description: (desc) => {
    if (!desc) return true; // Optional
    if (desc.length > 5000) return false;
    return true;
  },
  
  // Validate ID (must be numeric)
  id: (id) => {
    return /^\d+$/.test(String(id));
  },
};

export const validateProductData = (data) => {
  const errors = {};
  
  if (!validators.productName(data.name)) {
    errors.name = 'Invalid product name';
  }
  
  if (!validators.price(data.price)) {
    errors.price = 'Invalid price format';
  }
  
  if (data.description && !validators.description(data.description)) {
    errors.description = 'Description too long';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
```

2. **Apply Validation Before API Calls:**
```javascript
// Example in AddProducts.tsx
const onSubmit = async (data) => {
  // Validate input
  const validation = validateProductData(data);
  if (!validation.isValid) {
    // Show errors
    return;
  }
  
  // Sanitize data
  const sanitizedData = {
    ...data,
    name: validators.sanitize(data.name),
    description: validators.sanitize(data.description),
  };
  
  // Make API call
  await addProducts(sanitizedData);
};
```

**Checklist:**
- [ ] Create validation utilities
- [ ] Add validation to product forms
- [ ] Add validation to user registration/login
- [ ] Add validation to search inputs
- [ ] Add validation to all API payloads
- [ ] Test validation on all forms

---

### Day 5: API Request Sanitization

**Implementation:**

1. **Create Sanitization Middleware:**
```javascript
// Dashboard/src/utils/sanitizeApiData.mjs
export const sanitizeApiData = (data) => {
  if (typeof data === 'string') {
    return data
      .replace(/[<>]/g, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+=/gi, '')
      .trim();
  }
  
  if (Array.isArray(data)) {
    return data.map(item => sanitizeApiData(item));
  }
  
  if (data && typeof data === 'object') {
    const sanitized = {};
    for (const key in data) {
      sanitized[key] = sanitizeApiData(data[key]);
    }
    return sanitized;
  }
  
  return data;
};
```

2. **Apply to All API Calls:**
```javascript
// In service files
query: (body) => ({
  url: `/product/add`,
  method: "POST",
  body: sanitizeApiData(body), // Sanitize before sending
}),
```

**Checklist:**
- [ ] Create sanitization utility
- [ ] Apply to all POST/PUT requests
- [ ] Test sanitization

---

## 📅 WEEK 3: Rate Limiting & CSRF Protection

### Day 1-2: Implement Client-Side Rate Limiting

**Implementation:**

1. **Create Rate Limiter:**
```javascript
// Dashboard/src/utils/rateLimiter.mjs
class RateLimiter {
  constructor() {
    this.attempts = new Map();
  }
  
  canProceed(key, maxAttempts, windowMs) {
    const now = Date.now();
    const keyAttempts = this.attempts.get(key) || [];
    
    // Remove old attempts outside the window
    const recentAttempts = keyAttempts.filter(
      time => now - time < windowMs
    );
    
    if (recentAttempts.length >= maxAttempts) {
      const oldestAttempt = recentAttempts[0];
      const waitTime = Math.ceil((oldestAttempt + windowMs - now) / 1000);
      return {
        allowed: false,
        waitTime: waitTime,
        message: `Too many requests. Please wait ${waitTime} seconds.`
      };
    }
    
    // Add current attempt
    recentAttempts.push(now);
    this.attempts.set(key, recentAttempts);
    
    return { allowed: true };
  }
  
  reset(key) {
    this.attempts.delete(key);
  }
}

export const rateLimiter = new RateLimiter();

// Rate limit configurations
export const RATE_LIMITS = {
  LOGIN: { maxAttempts: 5, windowMs: 15 * 60 * 1000 }, // 5 attempts per 15 minutes
  API_CALL: { maxAttempts: 100, windowMs: 60 * 1000 }, // 100 calls per minute
  FILE_UPLOAD: { maxAttempts: 10, windowMs: 60 * 1000 }, // 10 uploads per minute
  REGISTRATION: { maxAttempts: 3, windowMs: 60 * 60 * 1000 }, // 3 per hour
};
```

2. **Apply to Login:**
```javascript
// Dashboard/src/views/pages/login/Login.tsx
const handleLogin = async (credentials) => {
  const ip = await getClientIP(); // Or use user ID
  const check = rateLimiter.canProceed(
    `login_${ip}`,
    RATE_LIMITS.LOGIN.maxAttempts,
    RATE_LIMITS.LOGIN.windowMs
  );
  
  if (!check.allowed) {
    alert(check.message);
    return;
  }
  
  try {
    await login(credentials);
    rateLimiter.reset(`login_${ip}`);
  } catch (error) {
    // Don't reset on failure
  }
};
```

3. **Apply to API Calls:**
```javascript
// Create API interceptor with rate limiting
const apiCallWithRateLimit = async (apiCall, limitKey) => {
  const check = rateLimiter.canProceed(
    limitKey,
    RATE_LIMITS.API_CALL.maxAttempts,
    RATE_LIMITS.API_CALL.windowMs
  );
  
  if (!check.allowed) {
    throw new Error(check.message);
  }
  
  return await apiCall();
};
```

**Checklist:**
- [ ] Create rate limiter utility
- [ ] Apply to login endpoint
- [ ] Apply to registration endpoint
- [ ] Apply to file upload endpoints
- [ ] Apply to general API calls
- [ ] Test rate limiting

---

### Day 3-4: Implement CSRF Protection

**Implementation:**

1. **Generate CSRF Token:**
```javascript
// Dashboard/src/utils/csrf.mjs
export const generateCSRFToken = () => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

export const getCSRFToken = () => {
  let token = sessionStorage.getItem('csrf_token');
  if (!token) {
    token = generateCSRFToken();
    sessionStorage.setItem('csrf_token', token);
  }
  return token;
};
```

2. **Add CSRF Token to Requests:**
```javascript
// Update prepareHeaders
export const prepareHeaders = (headers) => {
  const token = getCookie("token");
  const csrfToken = getCSRFToken();
  
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  
  // Add CSRF token for state-changing operations
  headers.set("X-CSRF-Token", csrfToken);
  
  return headers;
};
```

3. **Update Backend Integration:**
- Backend should validate CSRF token
- Token should be sent from backend on initial load
- Token should be validated on all POST/PUT/DELETE requests

**Checklist:**
- [ ] Create CSRF token utility
- [ ] Add CSRF token to all POST/PUT/DELETE requests
- [ ] Coordinate with backend for validation
- [ ] Test CSRF protection

---

### Day 5: Add Request Timeouts

**Implementation:**

1. **Update All HTTP Calls with Timeouts:**

**Dashboard/Frontend:**
```javascript
const axiosBaseQuery = fetchBaseQuery({
  baseUrl: infoData.baseApi,
  prepareHeaders: (headers) => {
    return prepareHeaders(headers);
  },
  timeout: 10000, // 10 seconds
});
```

**Flutter:**
```dart
// Already implemented in SecureHttpClient with timeout parameter
SecureHttpClient.get(url, timeout: Duration(seconds: 10));
```

**Checklist:**
- [ ] Add timeout to all Dashboard API calls
- [ ] Add timeout to all Frontend API calls
- [ ] Verify Flutter timeouts are set
- [ ] Test timeout handling

---

## 📅 WEEK 4: API Endpoint Security Review

### Day 1-2: Review and Secure All API Endpoints

**Create API Security Checklist:**

```markdown
## API Endpoint Security Checklist

For each endpoint, verify:
- [ ] Authentication required
- [ ] Authorization check (user can only access their data)
- [ ] Input validation
- [ ] Rate limiting
- [ ] CSRF protection (for state-changing operations)
- [ ] Request timeout
- [ ] Error handling (no sensitive info in errors)
- [ ] HTTPS only
```

**Endpoints to Review:**

1. **Authentication Endpoints:**
   - `/api/auth/rootLogin` - ✅ HTTPS, ⚠️ Add rate limiting
   - `/api/auth/register` - ✅ HTTPS, ⚠️ Add rate limiting
   - `/api/auth/user/{userId}` - ⚠️ Change to `/api/auth/user/me`
   - `/api/auth/upload-file` - ⚠️ Add file validation

2. **Product Endpoints:**
   - `/api/product/add` - ⚠️ Add auth, validation
   - `/api/product/update` - ⚠️ Add auth, authorization
   - `/api/product/getProductById/{id}` - ⚠️ Add rate limiting

3. **Store Endpoints:**
   - `/api/store/list/{storeId}` - ⚠️ Add auth, change to session-based
   - `/api/store/product/getAllProductById/{storeId}` - ⚠️ Add auth

4. **Cart/Order Endpoints:**
   - `/api/cart/list/{userId}` - ⚠️ Change to session-based
   - `/api/cart/create` - ⚠️ Add CSRF, validation
   - `/api/order/create` - ⚠️ Add CSRF, validation

5. **Subscription Endpoints:**
   - `/api/subscription/create` - ⚠️ Add auth, CSRF
   - `/api/subscription/{customerId}` - ⚠️ Change to session-based

**Checklist:**
- [ ] Review all authentication endpoints
- [ ] Review all product endpoints
- [ ] Review all store endpoints
- [ ] Review all cart/order endpoints
- [ ] Review all subscription endpoints
- [ ] Document security requirements for each endpoint
- [ ] Coordinate with backend team for implementation

---

### Day 3-4: Implement API Error Handling

**Implementation:**

1. **Create Error Handler:**
```javascript
// Dashboard/src/utils/apiErrorHandler.mjs
export const handleApiError = (error) => {
  // Don't expose sensitive information
  if (error.status === 401) {
    return 'Authentication required. Please login again.';
  }
  
  if (error.status === 403) {
    return 'You do not have permission to perform this action.';
  }
  
  if (error.status === 429) {
    return 'Too many requests. Please try again later.';
  }
  
  if (error.status >= 500) {
    return 'Server error. Please try again later.';
  }
  
  // Generic error message
  return error.data?.message || 'An error occurred. Please try again.';
};
```

2. **Apply to All API Calls:**
```javascript
try {
  const result = await apiCall();
} catch (error) {
  const message = handleApiError(error);
  // Show user-friendly message
}
```

**Checklist:**
- [ ] Create error handler utility
- [ ] Update all API error handling
- [ ] Test error scenarios
- [ ] Ensure no sensitive info leaked

---

### Day 5: API Security Testing

**Testing Checklist:**
- [ ] Test authentication on all endpoints
- [ ] Test authorization (user can't access other users' data)
- [ ] Test rate limiting
- [ ] Test CSRF protection
- [ ] Test input validation
- [ ] Test error handling
- [ ] Test timeout handling
- [ ] Penetration testing on critical endpoints

---

## 📋 IMPLEMENTATION SUMMARY

### Week 1: Authentication
- ✅ Add auth headers to Dashboard
- ✅ Add auth headers to Frontend
- ✅ Add auth headers to Flutter
- ✅ Create secure HTTP client

### Week 2: URL Security & Validation
- ✅ Fix user ID exposure
- ✅ Implement input validation
- ✅ Add data sanitization

### Week 3: Rate Limiting & CSRF
- ✅ Implement rate limiting
- ✅ Add CSRF protection
- ✅ Add request timeouts

### Week 4: Review & Testing
- ✅ Review all endpoints
- ✅ Implement error handling
- ✅ Security testing

---

## 🔧 FILES TO CREATE

1. `Dashboard/src/utils/authHelper.mjs`
2. `Dashboard/src/utils/validation.mjs`
3. `Dashboard/src/utils/sanitizeApiData.mjs`
4. `Dashboard/src/utils/rateLimiter.mjs`
5. `Dashboard/src/utils/csrf.mjs`
6. `Dashboard/src/utils/apiErrorHandler.mjs`
7. `Frontend/src/utils/authHelper.mjs`
8. `Frontend/src/utils/validation.mjs`
9. `App/appv1/lib/helpers/secure_http_client.dart`

---

## 📝 BACKEND COORDINATION REQUIRED

The following require backend API changes:

1. **Session-Based Endpoints:**
   - Change `/api/auth/user/{userId}` → `/api/auth/user/me`
   - Change `/api/cart/list/{userId}` → `/api/cart/list`
   - Change `/api/order/list/{userId}` → `/api/order/list`
   - Backend should extract user from JWT token

2. **CSRF Token Validation:**
   - Backend should validate `X-CSRF-Token` header
   - Backend should generate and send CSRF token on login

3. **Rate Limiting:**
   - Backend should implement server-side rate limiting
   - Backend should return 429 status on rate limit exceeded

4. **Input Validation:**
   - Backend should validate all inputs
   - Backend should sanitize data before processing

---

## ✅ SUCCESS CRITERIA

- [ ] All API calls include authentication headers
- [ ] No user IDs exposed in URLs
- [ ] All inputs validated and sanitized
- [ ] Rate limiting implemented
- [ ] CSRF protection active
- [ ] All requests have timeouts
- [ ] Error handling doesn't leak sensitive info
- [ ] Security testing passed

---

**Estimated Effort:** 4-6 weeks  
**Team:** 2-3 developers  
**Backend Coordination:** Required for some fixes
