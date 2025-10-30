# Troubleshooting Sign Up Issue

## ✅ FIXED: Port Mismatch Issue

**Problem**: Frontend running on port 8080, but backend CORS configured for port 5173

**Solution**: Updated `backend/.env` to set:
```env
FRONTEND_URL=http://localhost:8080
```

The backend will automatically restart and accept requests from the correct port.

## How to Test Registration Now

1. **Make sure backend is running**: Check terminal for "✅ MongoDB connected successfully"
2. **Open browser**: Go to http://localhost:8080
3. **Click Sign Up** button
4. **Fill in the form**:
   - Username: neharika
   - Email: Neharika@gmail.com
   - Password: (your choice, at least 6 characters)
   - Confirm Password: (same as password)
5. **Click SIGN UP button**

## Common Issues

### Backend Not Running
```bash
cd backend
npm run dev
```

Look for: "✅ MongoDB connected successfully"

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /F /PID <process_id>

# Or change port in backend/.env
PORT=5001
```

### MongoDB Not Connected
**Option 1: Install MongoDB Locally**
- Download: https://www.mongodb.com/try/download/community
- Install and start MongoDB service

**Option 2: Use MongoDB Atlas (Free)**
1. Sign up at https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string
4. Update `backend/.env`:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/f1_template_db
   ```

### CORS Errors
Make sure `FRONTEND_URL` in `backend/.env` matches your frontend port (8080)

## Still Having Issues?

1. Check browser console (F12) for specific errors
2. Check backend terminal for error messages
3. Verify MongoDB is running and connected
4. Make sure both frontend and backend are running

