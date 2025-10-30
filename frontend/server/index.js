import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.js";
import walletRouter from "./routes/wallet.js";
import transactionsRouter from "./routes/transactions.js";
import paymentRouter from "./routes/payment.js";
import webhookRouter from "./routes/webhook.js";

const app = express();
const PORT = process.env.PORT || 3001;
const ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.use(cors({ origin: ORIGIN, credentials: true }));
// Stripe webhook must read raw body; mount webhook BEFORE json parser
app.use("/api/payment", webhookRouter);
app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/auth", authRouter);
app.use("/api/wallet", walletRouter);
app.use("/api/transactions", transactionsRouter);
app.use("/api/payment", paymentRouter);

app.listen(PORT, () => {
  console.log(`Auth server listening on http://localhost:${PORT}`);
});



