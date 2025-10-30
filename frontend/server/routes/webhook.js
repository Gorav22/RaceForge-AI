import { Router } from "express";
import express from "express";
import Stripe from "stripe";
import db from "../db.js";

const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET || "";
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "";
const stripe = STRIPE_SECRET ? new Stripe(STRIPE_SECRET, { apiVersion: "2024-06-20" }) : null;

const webhookRouter = Router();

// Mount raw body parser only for this route
webhookRouter.post("/webhook", express.raw({ type: "application/json" }), (req, res) => {
  if (!stripe) return res.status(500).send("Stripe not configured");
  const sig = req.headers["stripe-signature"];
  if (!sig || !STRIPE_WEBHOOK_SECRET) return res.status(400).send("Missing signature");
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, STRIPE_WEBHOOK_SECRET);
  } catch (_err) {
    return res.status(400).send("Invalid signature");
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const sessionId = session.id;
    const userId = Number(session.metadata?.userId || 0);
    const coins = Number(session.metadata?.coins || 0);
    if (userId && coins > 0 && !db.helpers.transactionExists(sessionId)) {
      const wallet = db.helpers.getWallet(userId) || { user_id: userId, balance: 0 };
      const newBalance = (wallet.balance || 0) + coins;
      db.helpers.setWallet(userId, newBalance);
      db.helpers.addTransactionWithId(sessionId, userId, "purchase", coins, "stripe");
    }
  }

  res.json({ received: true });
});

export default webhookRouter;


