import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js"; // create if not exists

dotenv.config();
const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Stripe Webhook Endpoint
router.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("⚠️ Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle successful payments
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const { userId, packageId } = session.metadata;

    const PACKAGES = {
      starter: { coins: 100, price: 4.99 },
      popular: { coins: 500, price: 19.99 },
      premium: { coins: 1000, price: 34.99 },
      ultimate: { coins: 2500, price: 79.99 },
    };
    const pkg = PACKAGES[packageId];

    if (pkg && userId && userId !== "guest") {
      try {
        // 1️⃣ Update user coin balance
        await User.findByIdAndUpdate(userId, { $inc: { coinBalance: pkg.coins } });

        // 2️⃣ Add transaction record
        await Transaction.create({
          userId,
          packageId,
          amount: pkg.price,
          coins: pkg.coins,
          paymentIntent: session.payment_intent,
          status: "completed",
        });

        console.log(`💰 Added ${pkg.coins} coins to user ${userId}`);
      } catch (dbError) {
        console.error("Database update failed:", dbError.message);
      }
    }
  }

  res.json({ received: true });
});

export default router;