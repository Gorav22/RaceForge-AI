import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/create-checkout-session", async (req, res) => {
  try {
    const { packageId } = req.body;

    // Define your coin packages here
    const PACKAGES = {
      starter: { name: "Starter", coins: 100, price: 499 },
      popular: { name: "Popular", coins: 500, price: 1999 },
      premium: { name: "Premium", coins: 1000, price: 3499 },
      ultimate: { name: "Ultimate", coins: 2500, price: 7999 },
    };

    const pkg = PACKAGES[packageId];
    if (!pkg) return res.status(400).json({ success: false, message: "Invalid package" });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: `${pkg.name} Coin Package` },
            unit_amount: pkg.price, // in cents
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    });

    return res.json({ success: true, data: { url: session.url } });
  } catch (error) {
    console.error("Stripe Checkout Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error creating checkout session",
      error: error.message,
    });
  }
});

export default router;