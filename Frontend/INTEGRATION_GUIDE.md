# Complete Integration Guide - F1 Template with Authentication & Coin System

## What's Been Added

Your F1 Template landing page now includes a complete user authentication and virtual coin economy system with Stripe payment integration.

## Features Added

### Backend (Node.js + Express + MongoDB + Stripe)
- ✅ User registration and login with JWT authentication
- ✅ Password hashing with bcrypt
- ✅ MongoDB models for User and Transaction
- ✅ Stripe payment integration
- ✅ Webhook handler for automatic coin crediting
- ✅ Transaction history tracking
- ✅ Welcome bonus: 10 free coins for new users

### Frontend (React + TypeScript)
- ✅ Updated Navigation with auth UI
  - Shows Login/Sign Up when logged out
  - Shows coin balance, Buy Coins button, and user menu when logged in
- ✅ Login and Register modals
- ✅ User Dashboard showing coin balance
- ✅ Buy Coins page with 4 package options
- ✅ Transaction History page
- ✅ Payment Success/Cancel pages
- ✅ Coins Preview section on landing page
- ✅ Protected routes
- ✅ AuthContext for global state management

## Setup Instructions

### 1. Backend Setup

```bash
cd f1-template-forge-main/backend
npm install
cp env.example .env
# Edit .env with your credentials
npm run dev
```

Backend will run on `http://localhost:5000`

### 2. Frontend Setup

```bash
cd f1-template-forge-main
npm install
npm run dev
```

Frontend will run on `http://localhost:5173`

### 3. Environment Variables

#### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/f1_template_db
JWT_SECRET=your_super_secret_jwt_key
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_secret
FRONTEND_URL=http://localhost:5173
```

#### Frontend (optional - create .env)
```env
VITE_API_URL=http://localhost:5000/api
```

## Coin Packages

| Package | Coins | Price | Features |
|---------|-------|-------|----------|
| Starter | 100 | $4.99 | Basic Access |
| Popular ⭐ | 500 | $19.99 | Full Access, Best Value |
| Premium | 1000 | $34.99 | Premium Features |
| Ultimate | 2500 | $79.99 | All Features, VIP |

## User Flow

1. **Landing Page**: User sees coin packages, clicks "Sign Up" or "Login"
2. **Registration**: User creates account (gets 10 free coins welcome bonus)
3. **Dashboard**: User sees coin balance, can buy more coins
4. **Buy Coins**: User selects package, redirected to Stripe checkout
5. **Payment**: Stripe processes payment
6. **Success**: Webhook credits coins, user redirected to success page
7. **Transactions**: User can view purchase history

## API Routes

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Payments
- `POST /api/payment/create-checkout-session` - Create Stripe session
- `POST /api/payment/webhook` - Stripe webhook handler
- `GET /api/payment/transactions` - Get transactions

## New Components

### Auth Components
- `src/components/Auth/LoginModal.tsx` - Login modal
- `src/components/Auth/RegisterModal.tsx` - Register modal

### Pricing Components
- `src/components/Pricing/CoinPackages.tsx` - Coin packages preview

### Pages
- `src/pages/Dashboard.tsx` - User dashboard
- `src/pages/BuyCoins.tsx` - Purchase coins page
- `src/pages/Transactions.tsx` - Transaction history
- `src/pages/PaymentSuccess.tsx` - Payment success
- `src/pages/PaymentCancel.tsx` - Payment cancelled

### Services
- `src/services/api.ts` - API client with axios
- `src/context/AuthContext.tsx` - Authentication context

## Updated Components

- `src/components/Navigation.tsx` - Added auth UI
- `src/pages/Index.tsx` - Added CoinPackages section
- `src/App.tsx` - Added routes and AuthProvider

## Stripe Webhook Setup

### For Development:
```bash
stripe listen --forward-to localhost:5000/api/payment/webhook
```

### For Production:
1. Deploy backend
2. Create webhook in Stripe Dashboard
3. Add endpoint URL: `https://your-domain.com/api/payment/webhook`
4. Listen to: `checkout.session.completed`
5. Copy webhook secret to `.env`

## Testing

### Stripe Test Cards:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`

Use any future expiry date and any CVC.

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Protected API routes
- Stripe webhook signature verification
- Input validation
- CORS configuration
- Error handling

## Next Steps

1. **Install MongoDB**: Set up local MongoDB or use MongoDB Atlas
2. **Create Stripe Account**: Get API keys from Stripe Dashboard
3. **Configure Environment**: Update .env files
4. **Start Backend**: Run `npm run dev` in backend folder
5. **Start Frontend**: Run `npm run dev` in main folder
6. **Test Flow**: Register, login, purchase coins

## Customization

### Change Coin Packages
Edit `src/components/Pricing/CoinPackages.tsx` and `backend/controllers/paymentController.js`

### Change Welcome Bonus
Edit `backend/controllers/authController.js` line 62

### Styling
All components use Tailwind CSS and match your F1 theme. Customize as needed.

## Troubleshooting

### Backend won't start
- Check MongoDB is running
- Verify .env file exists and has correct values
- Check port 5000 is not in use

### Login doesn't work
- Verify backend is running
- Check browser console for errors
- Verify API URL in `src/services/api.ts`

### Payment not working
- Check Stripe keys in .env
- Verify webhook is set up correctly
- Check Stripe Dashboard for logs

## Support

For issues or questions, refer to the README files in each directory.

