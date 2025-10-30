# Quick Setup Instructions

## 🚀 Getting Started

### 1. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/f1_template_db
JWT_SECRET=your_secret_here_use_random_string
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_secret_here
FRONTEND_URL=http://localhost:5173
```

Start backend:
```bash
npm run dev
```

### 2. Frontend Setup

```bash
# From root directory
npm install
```

Start frontend:
```bash
npm run dev
```

### 3. Access

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## 📋 What You Need

1. **MongoDB**: Install locally or use MongoDB Atlas (free tier works)
2. **Stripe Account**: Sign up at stripe.com (test mode is free)
3. **Node.js**: v16 or higher

## 🎯 Quick Test

1. Open http://localhost:5173
2. Click "Sign Up" in navigation
3. Create account (get 10 free coins!)
4. Go to Dashboard
5. Click "Buy Coins"
6. Use Stripe test card: `4242 4242 4242 4242`

## 📚 Full Documentation

See `INTEGRATION_GUIDE.md` for complete details.

## 🐛 Troubleshooting

**Backend won't start?**
- Check MongoDB is running
- Verify .env file exists

**Frontend errors?**
- Make sure backend is running
- Check browser console

**Payment not working?**
- Verify Stripe keys in .env
- Check backend logs

