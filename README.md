# TeamTaskGo — Intelligent Team Task Manager (MERN Stack)

TeamTaskGo is a modern, full-stack task management platform crafted for teams that want simplicity without sacrificing power. Designed with a clean mint-green aesthetic and fluid micro-interactions, it delivers a fast, intuitive experience for managing projects, tracking tasks, and coordinating teams.

---

## 📁 Repository Structure

This repository is organized into two primary folders:

```
TeamTaskGo/
├── backend/          # Node.js + Express.js API Server
│   ├── middleware/   # Authentication & Authorization middleware
│   ├── models/       # MongoDB Mongoose Schemas (User, Project, Task, Notice)
│   ├── routes/       # API Route Endpoints
│   ├── utils/        # Helper utilities (Nodemailer email service)
│   ├── .env.example  # Backend Environment Variables Template
│   ├── seedAdmin.js  # Database seeding script
│   └── server.js     # Express server entry point
│
└── frontend/         # React 19 + Vite Web Application
    ├── src/          # React components, pages, context, and styles
    ├── .env.example  # Frontend Environment Variables Template
    └── index.html    # Application HTML template
```

---

## ✨ Key Features

### 🔐 Authentication & Access Control
* Secure **JWT-based authentication** system.
* Role-based authorization with distinct **Admin** and **Member** experiences.
* Protected routes ensuring safe access to workspace resources.

### 📊 Smart Workspace Dashboard
* **Personalized Task View**: Members see only their assigned work.
* **Deadline Tracking**: Stay ahead with clear due dates and task states.
* **Minimal, Focused UI**: Actionable insights with no clutter.

### 📋 Project & Task Management
* **Project Creation (Admin Only)**: Organize work into structured projects.
* **Task Lifecycle Tracking**: Pending, In Progress, Completed.
* **Assignment System**: Allocate tasks to specific team members.
* **Deadline Control**: Set and monitor timelines efficiently.

### 👥 Team Collaboration & Roles
* **Admin Role**: Full control over projects, users, notice board, and member removal.
* **Member Role**: View and update assigned tasks and track personal productivity.

### 📢 Notice Board System
* Centralized workspace announcement board for real-time team updates.

### ✉️ Automated Onboarding
* Seamless member addition via Admin dashboard with automated email credential delivery via **Nodemailer**.

---

## 🛠️ Tech Stack

* **Frontend**: React 19, Vite, Tailwind CSS v4, Framer Motion, React Router, Lucide React
* **Backend**: Node.js, Express.js, MongoDB (Mongoose), JWT, Nodemailer

---

## ⚙️ Local Setup Guide

### 1️⃣ Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory (refer to `.env.example`):

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/teamtaskgo
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
CLIENT_URL=http://localhost:5173
```

Seed the default admin user:
```bash
node seedAdmin.js
```

Start the backend server:
```bash
npm run dev
```

### 2️⃣ Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory (refer to `.env.example`):

```env
VITE_API_URL=/api
```

Start the frontend app:
```bash
npm run dev
```

Access the app at: `http://localhost:5173`

---

## 📄 License

This project is licensed under the ISC License.
