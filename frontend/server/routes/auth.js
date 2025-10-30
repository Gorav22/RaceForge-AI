import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import db from "../db.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";
const TOKEN_COOKIE = "auth_token";
const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

const authRouter = Router();

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1).max(120).optional().default("")
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

function setAuthCookie(res, payload) {
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_TTL_SECONDS });
  res.cookie(TOKEN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    maxAge: TOKEN_TTL_SECONDS * 1000
  });
}

function requireUser(req, res, next) {
  const token = req.cookies?.[TOKEN_COOKIE];
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (_e) {
    return res.status(401).json({ error: "Unauthorized" });
  }
}

function creditFreeCoinsIfFirstTime(userId) {
  const wallet = db.helpers.getWallet(userId);
  if (!wallet) {
    db.helpers.setWallet(userId, 100);
    db.helpers.addTransaction(userId, "free", 100, null);
    return 100;
  }
  return 0;
}

authRouter.post("/signup", (req, res) => {
  const parse = signupSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: "Invalid input" });
  const { email, password, name } = parse.data;

  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
  if (existing) return res.status(409).json({ error: "Email already in use" });

  const passwordHash = bcrypt.hashSync(password, 10);
  const insert = db.prepare("INSERT INTO users (email, name, password_hash) VALUES (?, ?, ?)");
  const result = insert.run(email, name || "", passwordHash);

  const user = { id: result.lastInsertRowid, email, name };
  // free coins on first creation
  creditFreeCoinsIfFirstTime(user.id);
  setAuthCookie(res, { id: user.id, email: user.email });
  return res.status(201).json({ user });
});

authRouter.post("/login", (req, res) => {
  const parse = loginSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: "Invalid input" });
  const { email, password } = parse.data;

  const row = db.prepare("SELECT id, email, name, password_hash FROM users WHERE email = ?").get(email);
  if (!row) return res.status(401).json({ error: "Invalid credentials" });
  const valid = bcrypt.compareSync(password, row.password_hash);
  if (!valid) return res.status(401).json({ error: "Invalid credentials" });

  // free coins if first login (no wallet yet)
  creditFreeCoinsIfFirstTime(row.id);
  setAuthCookie(res, { id: row.id, email: row.email });
  return res.json({ user: { id: row.id, email: row.email, name: row.name } });
});

authRouter.get("/me", requireUser, (req, res) => {
  const row = db.prepare("SELECT id, email, name FROM users WHERE id = ?").get(req.user.id);
  if (!row) return res.status(401).json({ error: "Unauthorized" });
  return res.json({ user: row });
});

authRouter.post("/logout", (_req, res) => {
  res.clearCookie(TOKEN_COOKIE, { httpOnly: true, sameSite: "lax", secure: false });
  return res.json({ ok: true });
});

export default authRouter;



