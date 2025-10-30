# Backend Setup Guide

## Overview
This is a Node.js + Express + MongoDB + Stripe backend for the F1 Template application with user authentication and virtual coin system.

## Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- Stripe account

## Installation

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `env.example`):
```bash
cp env.example .env
```

4. Edit `.env` file with your credentials:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/f1_template_db
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
FRONTEND_URL=http://localhost:5173
```

## MongoDB Setup

### Local MongoDB
Make sure MongoDB is running locally on port 27017

### MongoDB Atlas (Cloud)
1. Create an account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`

## Stripe Setup

1. Create account at [Stripe](https://stripe.com)
2. Get your test API keys from Dashboard
3. Add keys to `.env`:
   - `STRIPE_SECRET_KEY`: Your secret key (starts with `sk_test_`)
   - `STRIPE_WEBHOOK_SECRET`: Webhook signing secret (see below)

### Stripe Webhook Setup (for production)

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Forward webhooks to local:
```bash
stripe listen --forward-to localhost:5000/api/payment/webhook
```
3. Copy the webhook secret from the output
4. Add it to `.env` as `STRIPE_WEBHOOK_SECRET`

Or for production, create webhook in Stripe Dashboard:
- Endpoint URL: `https://your-domain.com/api/payment/webhook`
- Events: `checkout.session.completed`

## Running the Server

### Development (with auto-restart):
```bash
npm run dev
```

### Production:
```bash
npm start
```

Server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Payments
- `POST /api/payment/create-checkout-session` - Create Stripe checkout (protected)
- `POST /api/payment/webhook` - Stripe webhook handler
- `GET /api/payment/transactions` - Get user transactions (protected)

## Coin Packages
- Starter: 100 coins - $4.99
- Popular: 500 coins - $19.99 (Best Value)
- Premium: 1000 coins - $34.99
- Ultimate: 2500 coins - $79.99

## Features
- User registration and login with JWT
- Password hashing with bcrypt
- Stripe payment integration
- Automatic coin crediting via webhook
- Transaction history tracking
- Welcome bonus: 10 free coins for new users

## Testing

Test with Stripe test cards:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`

## Security Notes
- Change JWT_SECRET to a strong random string in production
- Use HTTPS in production
- Implement rate limiting
- Use environment variables for all secrets
- Validate all inputs
- Sanitize user data

