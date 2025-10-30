import { readFileSync, writeFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DB_FILE = join(__dirname, "db.json");

function readDB() {
  if (!existsSync(DB_FILE)) {
    return { users: [], nextUserId: 1, wallets: [], transactions: [], nextTxId: 1 };
  }
  try {
    const content = readFileSync(DB_FILE, "utf-8");
    return JSON.parse(content);
  } catch {
    return { users: [], nextUserId: 1, wallets: [], transactions: [], nextTxId: 1 };
  }
}

function writeDB(data) {
  writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
}

// Initialize database
const db = readDB();
writeDB(db);

// Create a simple database interface that mimics better-sqlite3 API
const dbWrapper = {
  prepare(query) {
    return {
      get(...params) {
        const data = readDB();
        if (query.includes("SELECT id FROM users WHERE email = ?")) {
          return data.users.find((u) => u.email === params[0]) || null;
        }
        if (query.includes("SELECT id, email, name, password_hash FROM users WHERE email = ?")) {
          return data.users.find((u) => u.email === params[0]) || null;
        }
        if (query.includes("SELECT id, email, name FROM users WHERE id = ?")) {
          return data.users.find((u) => u.id === params[0]) || null;
        }
        if (query.includes("SELECT balance FROM wallets WHERE user_id = ?")) {
          const w = data.wallets.find((w) => w.user_id === params[0]);
          return w ? { balance: w.balance } : null;
        }
        if (query.includes("SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC")) {
          const rows = data.transactions
            .filter((t) => t.user_id === params[0])
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
          return { rows };
        }
        return null;
      },
      run(...params) {
        const data = readDB();
        if (query.includes("INSERT INTO users")) {
          const [email, name, passwordHash] = params;
          const newUser = {
            id: data.nextUserId++,
            email,
            name: name || "",
            password_hash: passwordHash,
            created_at: new Date().toISOString(),
          };
          data.users.push(newUser);
          writeDB(data);
          return { lastInsertRowid: newUser.id };
        }
        if (query.includes("INSERT INTO wallets")) {
          const [userId, balance] = params;
          const existing = data.wallets.find((w) => w.user_id === userId);
          if (!existing) {
            data.wallets.push({ user_id: userId, balance });
            writeDB(data);
          }
          return { changes: 1 };
        }
        if (query.includes("UPDATE wallets SET balance = ? WHERE user_id = ?")) {
          const [balance, userId] = params;
          const w = data.wallets.find((w) => w.user_id === userId);
          if (w) {
            w.balance = balance;
            writeDB(data);
            return { changes: 1 };
          }
          return { changes: 0 };
        }
        if (query.includes("INSERT INTO transactions")) {
          const [userId, txId, type, amount, method] = params;
          data.transactions.push({
            id: txId,
            user_id: userId,
            type,
            amount,
            method: method || null,
            created_at: new Date().toISOString(),
          });
          writeDB(data);
          return { changes: 1 };
        }
        return { lastInsertRowid: null };
      },
    };
  },
  helpers: {
    getWallet(userId) {
      const data = readDB();
      return data.wallets.find((w) => w.user_id === userId) || null;
    },
    setWallet(userId, balance) {
      const data = readDB();
      const w = data.wallets.find((w) => w.user_id === userId);
      if (w) {
        w.balance = balance;
      } else {
        data.wallets.push({ user_id: userId, balance });
      }
      writeDB(data);
    },
    addTransaction(userId, type, amount, method) {
      const data = readDB();
      const txId = `tx_${data.nextTxId++}`;
      data.transactions.push({
        id: txId,
        user_id: userId,
        type,
        amount,
        method: method || null,
        created_at: new Date().toISOString(),
      });
      writeDB(data);
      return txId;
    },
    addTransactionWithId(txId, userId, type, amount, method) {
      const data = readDB();
      const exists = data.transactions.some((t) => t.id === txId);
      if (exists) return false;
      data.transactions.push({
        id: txId,
        user_id: userId,
        type,
        amount,
        method: method || null,
        created_at: new Date().toISOString(),
      });
      writeDB(data);
      return true;
    },
    transactionExists(txId) {
      const data = readDB();
      return data.transactions.some((t) => t.id === txId);
    },
    listTransactions(userId) {
      const data = readDB();
      return data.transactions
        .filter((t) => t.user_id === userId)
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
  }
};

export default dbWrapper;



