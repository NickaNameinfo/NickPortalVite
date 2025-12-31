# Security Fix Development Plan

**Project:** NickPortal Security Hardening  
**Timeline:** 8-12 weeks  
**Priority:** Critical Security Issues

---

## 📅 PHASE 1: CRITICAL FIXES (Weeks 1-2)

### 1.1 Move Razorpay API Keys to Environment Variables
**Priority:** CRITICAL  
**Effort:** 2 days  
**Files to Update:**
- `Dashboard/src/Components/Cards/PriceingCard.tsx`
- `App/appv1/lib/views/main/customer/checkout_screen.dart`
- `Frontend/src/Components/Card/BuyCard.tsx`
- `App/appv1/lib/components/subscription_card.dart`

**Implementation Steps:**
1. Create environment configuration files:
   - `Dashboard/.env`
   - `Frontend/.env`
   - `App/appv1/.env` (or use Flutter's environment variables)

2. Add to `.env` files:
   ```env
   REACT_APP_RAZORPAY_KEY=rzp_live_RgPc8rKEOZbHgf
   ```

3. Update code to use environment variables:
   ```typescript
   // Dashboard/Frontend
   const razorpayKey = process.env.REACT_APP_RAZORPAY_KEY;
   ```

   ```dart
   // Flutter
   const razorpayKey = String.fromEnvironment('RAZORPAY_KEY');
   ```

4. Add `.env` to `.gitignore`
5. Document environment setup in README

**Deliverables:**
- Environment variable configuration
- Updated code files
- Documentation

---

### 1.2 Implement Secure Cookie Handling
**Priority:** CRITICAL  
**Effort:** 1 day  
**Files to Update:**
- `Dashboard/src/JsFiles/CommonFunction.mjs`

**Implementation Steps:**
1. Update `setCookie` function:
   ```javascript
   export function setCookie(name, value, minute, options = {}) {
     var expires = "";
     if (minute) {
       var date = new Date();
       expires = "; expires=" + 
         new Date(date.setMinutes(date.getMinutes() + minute)).toUTCString();
     }
     
     const secure = window.location.protocol === 'https:' ? '; Secure' : '';
     const httpOnly = options.httpOnly ? '; HttpOnly' : '';
     const sameSite = options.sameSite || 'Strict';
     
     document.cookie = `${name}=${value || ""}${expires}; path=/; ${secure}; SameSite=${sameSite}`;
   }
   ```

2. For authentication cookies, use:
   ```javascript
   setCookie('token', token, 60 * 24 * 7, { 
     httpOnly: true, 
     sameSite: 'Strict' 
   });
   ```

**Deliverables:**
- Updated cookie utility functions
- Secure cookie implementation

---

### 1.3 Add Authentication Headers to All API Calls
**Priority:** CRITICAL  
**Effort:** 3 days  
**Files to Update:**
- `Dashboard/src/Service.mjs`
- `Frontend/src/Service.mjs`
- `Frontend/src/views/pages/login/Service.mjs`
- All Flutter HTTP calls

**Implementation Steps:**

**For React/TypeScript (Dashboard/Frontend):**
1. Create authentication interceptor:
   ```typescript
   // utils/authInterceptor.ts
   import { getCookie } from './CommonFunction';
   
   export const authInterceptor = (config: any) => {
     const token = getCookie('token');
     if (token) {
       config.headers = {
         ...config.headers,
         'Authorization': `Bearer ${token}`
       };
     }
     return config;
   };
   ```

2. Update all service files to use interceptor:
   ```typescript
   const axiosBaseQuery = fetchBaseQuery({
     baseUrl: infoData.baseApi,
     prepareHeaders: (headers) => {
       const token = getCookie("token");
       if (token) {
         headers.set("Authorization", `Bearer ${token}`);
       }
       return headers;
     },
   });
   ```

**For Flutter:**
1. Create HTTP client wrapper:
   ```dart
   // helpers/http_client.dart
   class SecureHttpClient {
     static Future<http.Response> get(String url) async {
       final prefs = await SharedPreferences.getInstance();
       final token = prefs.getString('token');
       
       final headers = <String, String>{
         'Content-Type': 'application/json',
       };
       
       if (token != null) {
         headers['Authorization'] = 'Bearer $token';
       }
       
       return await http.get(Uri.parse(url), headers: headers);
     }
     
     static Future<http.Response> post(String url, {Map<String, dynamic>? body}) async {
       final prefs = await SharedPreferences.getInstance();
       final token = prefs.getString('token');
       
       final headers = <String, String>{
         'Content-Type': 'application/json',
       };
       
       if (token != null) {
         headers['Authorization'] = 'Bearer $token';
       }
       
       return await http.post(
         Uri.parse(url),
         headers: headers,
         body: body != null ? json.encode(body) : null,
       );
     }
   }
   ```

2. Replace all `http.get`/`http.post` calls with `SecureHttpClient.get`/`SecureHttpClient.post`

**Deliverables:**
- Authentication interceptor/middleware
- Updated all API service files
- Secure HTTP client for Flutter

---

### 1.4 Encrypt Sensitive Data in Local Storage
**Priority:** CRITICAL  
**Effort:** 2 days  
**Files to Update:**
- All Flutter files using SharedPreferences
- Frontend files using localStorage

**Implementation Steps:**

**For Flutter:**
1. Install encryption package: `flutter_secure_storage`
2. Create secure storage wrapper:
   ```dart
   // helpers/secure_storage.dart
   import 'package:flutter_secure_storage/flutter_secure_storage.dart';
   
   class SecureStorage {
     static const _storage = FlutterSecureStorage();
     
     static Future<void> setString(String key, String value) async {
       await _storage.write(key: key, value: value);
     }
     
     static Future<String?> getString(String key) async {
       return await _storage.read(key: key);
     }
     
     static Future<void> delete(String key) async {
       await _storage.delete(key: key);
     }
   }
   ```

3. Replace SharedPreferences for sensitive data:
   - `token` → Use SecureStorage
   - `userId` → Can use SharedPreferences (less sensitive)
   - `email`, `phone` → Use SecureStorage

**For Frontend:**
1. Use encrypted localStorage wrapper:
   ```typescript
   // utils/secureStorage.ts
   import CryptoJS from 'crypto-js';
   
   const SECRET_KEY = process.env.REACT_APP_ENCRYPTION_KEY || 'default-key-change-me';
   
   export const secureStorage = {
     setItem: (key: string, value: string) => {
       const encrypted = CryptoJS.AES.encrypt(value, SECRET_KEY).toString();
       localStorage.setItem(key, encrypted);
     },
     
     getItem: (key: string): string | null => {
       const encrypted = localStorage.getItem(key);
       if (!encrypted) return null;
       
       try {
         const decrypted = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
         return decrypted.toString(CryptoJS.enc.Utf8);
       } catch {
         return null;
       }
     },
     
     removeItem: (key: string) => {
       localStorage.removeItem(key);
     }
   };
   ```

**Deliverables:**
- Secure storage implementation
- Updated all storage calls
- Encryption key management

---

## 📅 PHASE 2: HIGH PRIORITY FIXES (Weeks 3-4)

### 2.1 Implement Input Validation
**Priority:** HIGH  
**Effort:** 4 days

**Implementation Steps:**
1. Create validation utilities:
   ```typescript
   // utils/validation.ts
   export const validators = {
     email: (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
     phone: (phone: string) => /^[0-9]{10}$/.test(phone),
     price: (price: string) => /^\d+(\.\d{1,2})?$/.test(price),
     sanitize: (input: string) => input.replace(/[<>]/g, ''),
   };
   ```

2. Add validation to all forms:
   - Product forms
   - User registration/login
   - Search inputs

**Deliverables:**
- Validation utility functions
- Form validation implementation

---

### 2.2 Secure File Upload
**Priority:** HIGH  
**Effort:** 2 days

**Implementation Steps:**
1. Add file type validation:
   ```typescript
   const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
   const MAX_SIZE = 500 * 1024; // 500KB
   
   function validateFile(file: File): boolean {
     if (!ALLOWED_TYPES.includes(file.type)) {
       throw new Error('Invalid file type');
     }
     if (file.size > MAX_SIZE) {
       throw new Error('File too large');
     }
     return true;
   }
   ```

2. Add MIME type checking (not just extension)
3. Implement server-side validation

**Deliverables:**
- File validation functions
- Updated upload handlers

---

### 2.3 Implement Rate Limiting (Client-Side)
**Priority:** HIGH  
**Effort:** 2 days

**Implementation Steps:**
1. Create rate limiter:
   ```typescript
   // utils/rateLimiter.ts
   class RateLimiter {
     private attempts: Map<string, number[]> = new Map();
     
     canProceed(key: string, maxAttempts: number, windowMs: number): boolean {
       const now = Date.now();
       const attempts = this.attempts.get(key) || [];
       const recent = attempts.filter(time => now - time < windowMs);
       
       if (recent.length >= maxAttempts) {
         return false;
       }
       
       recent.push(now);
       this.attempts.set(key, recent);
       return true;
     }
   }
   ```

2. Apply to login, registration, API calls

**Deliverables:**
- Rate limiting implementation
- Applied to critical endpoints

---

### 2.4 Add CSRF Protection
**Priority:** HIGH  
**Effort:** 3 days

**Implementation Steps:**
1. Generate CSRF tokens on login
2. Include in all POST/PUT/DELETE requests
3. Validate on server

**Deliverables:**
- CSRF token generation
- Token validation middleware

---

## 📅 PHASE 3: MEDIUM PRIORITY FIXES (Weeks 5-6)

### 3.1 Remove Debug Information
**Priority:** MEDIUM  
**Effort:** 1 day

**Implementation Steps:**
1. Remove all `debugPrint`, `console.log` from production code
2. Use environment-based logging:
   ```dart
   void log(String message) {
     if (kDebugMode) {
       debugPrint(message);
     }
   }
   ```

**Deliverables:**
- Cleaned codebase
- Production logging framework

---

### 3.2 Standardize Authentication
**Priority:** MEDIUM  
**Effort:** 2 days

**Implementation Steps:**
1. Create shared authentication service
2. Update all services to use it
3. Document authentication flow

**Deliverables:**
- Standardized authentication
- Documentation

---

### 3.3 Add Request Timeouts
**Priority:** MEDIUM  
**Effort:** 1 day

**Implementation Steps:**
1. Add timeout to all HTTP requests:
   ```dart
   http.get(url).timeout(Duration(seconds: 10))
   ```

**Deliverables:**
- Timeout configuration
- Updated HTTP calls

---

## 📅 PHASE 4: TESTING & VALIDATION (Weeks 7-8)

### 4.1 Security Testing
- Penetration testing
- Vulnerability scanning
- Code review

### 4.2 Documentation
- Security guidelines
- Developer documentation
- Incident response plan

---

## 🛠️ IMPLEMENTATION CHECKLIST

### Week 1-2: Critical Fixes
- [ ] Move Razorpay keys to environment variables
- [ ] Implement secure cookies
- [ ] Add authentication headers
- [ ] Encrypt sensitive data storage

### Week 3-4: High Priority
- [ ] Input validation
- [ ] Secure file uploads
- [ ] Rate limiting
- [ ] CSRF protection

### Week 5-6: Medium Priority
- [ ] Remove debug info
- [ ] Standardize authentication
- [ ] Add request timeouts
- [ ] Security headers

### Week 7-8: Testing
- [ ] Security testing
- [ ] Documentation
- [ ] Code review

---

## 📝 NOTES

- Backend security measures should be implemented separately
- Some fixes require backend API changes
- Coordinate with backend team for API security
- Regular security audits recommended

---

**Estimated Total Effort:** 8-12 weeks  
**Team Size:** 2-3 developers  
**Priority Order:** Critical → High → Medium
