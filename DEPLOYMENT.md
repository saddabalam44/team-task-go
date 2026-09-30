# 🚀 Deployment Guide — TeamTaskGo

This guide outlines the steps to deploy **TeamTaskGo** to cloud platforms such as **Render**, **Railway**, or **Vercel + Render**.

---

## 🛠️ **Option 1: Unified Single-Service Deployment (Recommended on Render / Railway)**

In this setup, Express serves both the REST API and the production React frontend build from a single server.

### 📋 **Render Setup Steps**

1. **Push your project to GitHub / GitLab**.
2. Log in to [Render.com](https://render.com) and click **New +** → **Web Service**.
3. Connect your repository.
4. Set the following settings:
   - **Name**: `team-task-go`
   - **Environment**: `Node`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
5. Add the following **Environment Variables** in Render:
   - `MONGODB_URI`: Your MongoDB connection string (e.g. MongoDB Atlas URI)
   - `JWT_SECRET`: A strong secret string
   - `EMAIL_USER`: `saddabalam71@gmail.com`
   - `EMAIL_PASS`: Your Gmail App Password
   - `NODE_ENV`: `production`
6. Click **Create Web Service**. Render will automatically build the frontend, start Express, and host your app on `https://<your-app>.onrender.com`.

---

## ⚡ **Option 2: Separated Deployment (Vercel Frontend + Render Backend)**

### **1. Backend (Render Web Service)**
- **Root Directory**: `backend`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- Environment Variables: `MONGODB_URI`, `JWT_SECRET`, `EMAIL_USER`, `EMAIL_PASS`, `CLIENT_URL=https://your-frontend.vercel.app`

### **2. Frontend (Vercel)**
- **Root Directory**: `frontend`
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- Environment Variables: `VITE_API_URL=https://your-backend.onrender.com/api`

---

## 🔐 **Environment Variables Reference**

| Variable | Purpose | Example |
| :--- | :--- | :--- |
| `MONGODB_URI` | Database Connection | `mongodb+srv://user:pass@cluster.mongodb.net/dbname` |
| `JWT_SECRET` | Token Signing Key | `super_secret_jwt_key` |
| `EMAIL_USER` | Admin Sender Email | `saddabalam71@gmail.com` |
| `EMAIL_PASS` | Gmail App Password | `xxxx yyyy zzzz wwww` |
| `PORT` | Server Port | `3000` (auto-assigned by cloud hosts) |
| `CLIENT_URL` | Allowed CORS Origin | `https://yourdomain.com` |
