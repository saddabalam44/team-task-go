# TeamTaskGo — Backend Service

Node.js & Express.js REST API with MongoDB for TeamTaskGo task manager.

## ⚙️ Setup & Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Environment Variables:
   Configure `.env` using `.env.example` as a guide:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://127.0.0.1:27017/teamtaskgo
   JWT_SECRET=your_jwt_secret_key
   EMAIL_USER=your_gmail_address
   EMAIL_PASS=your_gmail_app_password
   CLIENT_URL=http://localhost:5173
   ```

3. Seed Admin User (Recommended):
   ```bash
   node seedAdmin.js
   ```

4. Run Development Server:
   ```bash
   npm run dev
   ```

5. Production Start:
   ```bash
   npm start
   ```
