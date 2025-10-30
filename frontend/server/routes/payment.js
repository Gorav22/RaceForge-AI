import { Router } from "express";
import jwt from "jsonwebtoken";
import Stripe from "stripe";
import db from "../db.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";
const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET || "";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const stripe = STRIPE_SECRET ? new Stripe(STRIPE_SECRET, { apiVersion: "2024-06-20" }) : null;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "";

// Fixed packages (server authority)
const PACKAGES = {
  starter: { coins: 100, priceCents: 499, label: "Starter" },
  popular: { coins: 500, priceCents: 1999, label: "Popular" },
  premium: { coins: 1000, priceCents: 3499, label: "Premium" },
  ultimate: { coins: 2500, priceCents: 7999, label: "Ultimate" },
};

function requireUser(req, res, next) {
  const token = req.cookies?.["auth_token"];
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (_e) {
    return res.status(401).json({ error: "Unauthorized" });
  }
}

const paymentRouter = Router();

// Create a Stripe Checkout Session
paymentRouter.post("/create-checkout-session", requireUser, async (req, res) => {
  const { amount, packageKey } = req.body || {};
  if (!stripe) return res.status(500).json({ error: "Stripe not configured" });
  try {
    let coins = 0;
    let unit_amount = 0;
    if (packageKey && PACKAGES[packageKey]) {
      coins = PACKAGES[packageKey].coins;
      unit_amount = PACKAGES[packageKey].priceCents;
    } else {
      if (!amount || amount <= 0) return res.status(400).json({ error: "Invalid amount" });
      coins = Math.round(Number(amount));
      unit_amount = Math.round(coins * 100);
    }
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: `${coins} Coins` },
            unit_amount,
          },
          quantity: 1,
        },
      ],
      success_url: `${FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${FRONTEND_URL}/dashboard`,
      metadata: { userId: String(req.user.id), coins: String(coins) },
    });
    return res.json({ id: session.id, url: session.url });
  } catch (_e) {
    return res.status(500).json({ error: "Failed to create checkout session" });
  }
});

// Success callback after Checkout redirect (server-side verification)
paymentRouter.get("/success", requireUser, async (req, res) => {
  const sessionId = req.query.session_id;
  if (!sessionId || typeof sessionId !== "string") return res.status(400).json({ error: "Missing session_id" });
  if (!stripe) return res.status(500).json({ error: "Stripe not configured" });
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid") {
      return res.status(400).json({ error: "Payment not completed" });
    }
    // Idempotency: do not process a session twice
    if (db.helpers.transactionExists(session.id)) {
      const w = db.helpers.getWallet(req.user.id) || { user_id: req.user.id, balance: 0 };
      return res.json({ ok: true, balance: w.balance, transactionId: session.id });
    }
    const coins = Number(session.metadata?.coins) || Math.round((session.amount_total || 0) / 100);
    const wallet = db.helpers.getWallet(req.user.id) || { user_id: req.user.id, balance: 0 };
    const newBalance = (wallet.balance || 0) + coins;
    db.helpers.setWallet(req.user.id, newBalance);
    db.helpers.addTransactionWithId(session.id, req.user.id, "purchase", coins, "stripe");
    return res.json({ ok: true, balance: newBalance, transactionId: session.id });
  } catch (_e) {
    return res.status(500).json({ error: "Failed to verify session" });
  }
});

// Create a payment intent (legacy fallback)
paymentRouter.post("/create-intent", requireUser, async (req, res) => {
  const { amount } = req.body || {};
  if (!amount || amount <= 0) return res.status(400).json({ error: "Invalid amount" });
  if (!stripe) return res.status(500).json({ error: "Stripe not configured" });
  try {
    const intent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "usd",
      metadata: { userId: String(req.user.id) },
      automatic_payment_methods: { enabled: true },
    });
    res.json({ clientSecret: intent.client_secret });
  } catch (e) {
    res.status(500).json({ error: "Failed to create payment intent" });
  }
});

// Record a successful payment (legacy fallback for manual confirmation)
paymentRouter.post("/record", requireUser, (req, res) => {
  const { amount, method } = req.body || {};
  if (!amount || amount <= 0) return res.status(400).json({ error: "Invalid amount" });
  const wallet = db.helpers.getWallet(req.user.id) || { user_id: req.user.id, balance: 0 };
  const newBalance = (wallet.balance || 0) + amount;
  db.helpers.setWallet(req.user.id, newBalance);
  const txId = db.helpers.addTransaction(req.user.id, "purchase", amount, method || "stripe");
  res.json({ ok: true, balance: newBalance, transactionId: txId });
});

export default paymentRouter;


