import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/database.js';
import authRoutes from './routes/auth.js';
import paymentRoutes from './routes/payment.js';
import raceRoutes from './routes/race.js';
import Stripe from "stripe";
import webhookRoutes from './routes/webhook.js';
import multer from 'multer';

// Load environment variables
dotenv.config();
const app = express();
const upload = multer();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


const API_KEY = process.env.API_KEY || "vibecoding";
// Connect to database
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/f1_template_db';
connectDB(MONGODB_URI);

// Initialize Express app

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  credentials: true
}));

// app.use('/api/payment', webhookRoutes);
// Body parser (JSON) - for all routes except webhook
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/races', raceRoutes);
app.post("/generate-text", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Text prompt is required" });
    }

    const formData = new FormData();
    formData.append("prompt", prompt);

    // Request to Hyper3D (Rodin) API
    const response = await fetch("https://hyperhuman.deemos.com/api/v2/rodin", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ error: errText });
    }

    const data = await response.json();
    res.json(data); // returns subscription_key, etc.
  } catch (error) {
    console.error("Error generating 3D model from text:", error);
    res.status(500).json({ error: "Failed to generate model" });
  }
});

// POST /status - check model generation status
app.post("/status", async (req, res) => {
  try {
    const { subscription_key } = req.body;

    if (!subscription_key) {
      return res.status(400).json({ error: "Missing subscription_key" });
    }

    const response = await fetch("https://hyperhuman.deemos.com/api/v2/status", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ subscription_key }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ error: errText });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error checking status:", error);
    res.status(500).json({ error: "Failed to check status" });
  }
});


app.post("/api/payment/create-checkout-session", async (req, res) => {
  try {
    const { packageKey } = req.body;
    const packages = {
      starter: { name: "Starter", amount: 499 },
      popular: { name: "Popular", amount: 1999 },
      premium: { name: "Premium", amount: 3499 },
      ultimate: { name: "Ultimate", amount: 7999 },
    };

    const pkg = packages[packageKey];
    if (!pkg) return res.status(400).json({ success: false, message: "Invalid package" });



    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "Premium Access" },
            unit_amount: 2000, // $20
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:5173/success",
      cancel_url: "http://localhost:5173/cancel",
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Stripe error:", error.message);
    res.status(500).json({
      success: false,
      message: "Error creating checkout session",
      error: error.message,
    });
  }
});


// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'F1 Template Backend API',
    version: '1.0.0'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
});

