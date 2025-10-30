import { Router } from "express";
import db from "../db.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";

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

const walletRouter = Router();

walletRouter.get("/", requireUser, (req, res) => {
  const w = db.helpers.getWallet(req.user.id) || { user_id: req.user.id, balance: 0 };
  res.json({ balance: w.balance });
});

export default walletRouter;



