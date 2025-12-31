# Environment Variables Setup Guide

This document explains how to set up environment variables for the NickPortal application.

---

## 📋 Overview

Environment variables are used to store sensitive configuration data like API keys and service URLs. This prevents hardcoding secrets in the source code.

---

## 🎯 Dashboard (React/Vite)

### Setup Steps:

1. **Copy the example file:**
   ```bash
   cd Dashboard
   cp .env.example .env
   ```

2. **Edit `.env` file:**
   ```env
   VITE_BASE_API=https://nicknameinfo.net/api
   VITE_RAZORPAY_KEY=your_razorpay_key_here
   VITE_ENV=production
   ```

3. **Restart the development server:**
   ```bash
   npm run dev
   ```

### Available Variables:

- `VITE_BASE_API` - Base API URL
- `VITE_RAZORPAY_KEY` - Razorpay payment gateway key
- `VITE_ENV` - Environment (production/development)

### Usage in Code:

```typescript
// In configData.tsx
export const infoData = {
  baseApi: import.meta.env.VITE_BASE_API || "https://nicknameinfo.net/api",
  razorpayKey: import.meta.env.VITE_RAZORPAY_KEY || "fallback_key",
};
```

**Note:** Vite requires the `VITE_` prefix for environment variables to be exposed to the client.

---

## 🎯 Frontend (React/Vite)

### Setup Steps:

1. **Copy the example file:**
   ```bash
   cd Frontend
   cp .env.example .env
   ```

2. **Edit `.env` file:**
   ```env
   VITE_BASE_API=https://nicknameinfo.net/api
   VITE_RAZORPAY_KEY=your_razorpay_key_here
   VITE_ENV=production
   ```

3. **Restart the development server:**
   ```bash
   npm run dev
   ```

### Available Variables:

- `VITE_BASE_API` - Base API URL
- `VITE_RAZORPAY_KEY` - Razorpay payment gateway key
- `VITE_ENV` - Environment (production/development)

### Usage in Code:

```typescript
// In configData.tsx
export const infoData = {
  baseApi: import.meta.env.VITE_BASE_API || "https://nicknameinfo.net/api",
  razorpayKey: import.meta.env.VITE_RAZORPAY_KEY || "fallback_key",
};
```

---

## 🎯 Flutter (Dart)

### Option 1: Using --dart-define (Recommended for Development)

**Run with environment variables:**
```bash
cd App/appv1
flutter run --dart-define=RAZORPAY_KEY=your_key_here
```

**Build with environment variables:**
```bash
flutter build apk --dart-define=RAZORPAY_KEY=your_key_here
flutter build ios --dart-define=RAZORPAY_KEY=your_key_here
```

### Option 2: Using Secure Storage (Recommended for Production)

For production, use secure storage (Keychain/Keystore) instead of environment variables:

1. **Store key securely:**
   ```dart
   import 'package:flutter_secure_storage/flutter_secure_storage.dart';
   
   final storage = FlutterSecureStorage();
   await storage.write(key: 'razorpay_key', value: 'your_key_here');
   ```

2. **Retrieve key:**
   ```dart
   final key = await storage.read(key: 'razorpay_key');
   ```

### Option 3: Using app_config.dart (Current Implementation)

Currently, the app uses `AppConfig.razorpayKey` from `lib/constants/app_config.dart`.

**For production, update `app_config.dart`:**
```dart
class AppConfig {
  // Use environment variable or secure storage
  static const String razorpayKey = String.fromEnvironment(
    'RAZORPAY_KEY',
    defaultValue: 'rzp_live_RgPc8rKEOZbHgf', // Remove default in production
  );
}
```

### Available Variables:

- `RAZORPAY_KEY` - Razorpay payment gateway key
- `BASE_API` - Base API URL (currently hardcoded)

---

## 🔒 Security Best Practices

### ✅ DO:

1. **Never commit `.env` files to version control**
   - `.env` files are already in `.gitignore`
   - Only commit `.env.example` files

2. **Use different keys for different environments**
   - Development: Test keys
   - Production: Live keys

3. **Rotate keys regularly**
   - Change API keys periodically
   - Revoke old keys when rotating

4. **Use secure storage for mobile apps**
   - Flutter: Use `flutter_secure_storage` for sensitive data
   - Never hardcode keys in production builds

5. **Restrict access to `.env` files**
   - Set proper file permissions
   - Limit who can access production keys

### ❌ DON'T:

1. **Don't commit `.env` files**
   - They contain sensitive information
   - Use `.env.example` as a template

2. **Don't share keys in chat/email**
   - Use secure key management systems
   - Use encrypted communication channels

3. **Don't use production keys in development**
   - Use test/sandbox keys for development
   - Keep production keys separate

4. **Don't hardcode keys in source code**
   - Always use environment variables
   - Use secure storage for mobile apps

---

## 📝 Getting Your Razorpay Key

1. **Login to Razorpay Dashboard:**
   - Go to https://dashboard.razorpay.com/
   - Login with your credentials

2. **Navigate to Settings:**
   - Click on "Settings" in the sidebar
   - Select "API Keys"

3. **Get Your Key:**
   - Copy your "Key ID" (starts with `rzp_live_` or `rzp_test_`)
   - Use test keys for development
   - Use live keys for production

4. **Keep Keys Secure:**
   - Never share keys publicly
   - Rotate keys if compromised
   - Use different keys for different environments

---

## 🚀 Deployment

### For Production:

1. **Set environment variables on your hosting platform:**
   - Vercel: Project Settings → Environment Variables
   - Netlify: Site Settings → Environment Variables
   - AWS: Use Parameter Store or Secrets Manager
   - Heroku: `heroku config:set KEY=value`

2. **For Flutter builds:**
   - Use CI/CD to inject keys during build
   - Or use secure storage to fetch keys from backend

3. **Verify:**
   - Check that `.env` files are not in production builds
   - Verify keys are loaded from environment variables
   - Test that payment gateway works correctly

---

## 🔍 Troubleshooting

### Issue: Environment variables not loading

**Solution:**
- Restart the development server after changing `.env` files
- Check that variable names start with `VITE_` (for Vite projects)
- Verify `.env` file is in the correct directory (root of project)

### Issue: Keys not working

**Solution:**
- Verify you're using the correct key (test vs live)
- Check that keys are correctly set in `.env` file
- Ensure no extra spaces or quotes in `.env` values

### Issue: Flutter build fails

**Solution:**
- Ensure `--dart-define` flags are correctly formatted
- Check that `app_config.dart` handles missing keys gracefully
- Verify secure storage is properly configured

---

## 📚 Additional Resources

- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Flutter Environment Variables](https://docs.flutter.dev/deployment/environment-variables)
- [Razorpay API Keys](https://razorpay.com/docs/payments/server-integration/payment-gateway/build-integration/)
- [Secure Storage Best Practices](https://owasp.org/www-community/vulnerabilities/Insecure_Storage)

---

**Last Updated:** December 31, 2025
