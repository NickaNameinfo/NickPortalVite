# Quick Start - Environment Variables Setup

## 🚀 Quick Setup (5 minutes)

### Dashboard
```bash
cd Dashboard
cp .env.example .env
# Edit .env with your actual values
npm run dev
```

### Frontend
```bash
cd Frontend
cp .env.example .env
# Edit .env with your actual values
npm run dev
```

### Flutter
```bash
cd App/appv1
# Option 1: Use --dart-define
flutter run --dart-define=RAZORPAY_KEY=your_key_here

# Option 2: Update app_config.dart directly (for development only)
```

## 📝 Required Variables

### Dashboard & Frontend
- `VITE_RAZORPAY_KEY` - Your Razorpay API key
- `VITE_BASE_API` - API base URL (optional, has default)

### Flutter
- `RAZORPAY_KEY` - Your Razorpay API key (via --dart-define or app_config.dart)

## ⚠️ Important

1. **Never commit `.env` files** - They're already in `.gitignore`
2. **Only commit `.env.example`** - This is the template
3. **Use different keys for dev/prod** - Keep them separate

## 📚 Full Documentation

See `ENVIRONMENT_SETUP.md` for complete setup guide.
