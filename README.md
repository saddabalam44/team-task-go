

# **TeamTaskGo — Intelligent Team Task Manager (MERN Stack)**

TeamTaskGo is a modern, full-stack task management platform crafted for teams that want simplicity without sacrificing power. Designed with a clean mint-green aesthetic and fluid micro-interactions, it delivers a fast, intuitive experience for managing projects, tracking tasks, and coordinating teams.

---

## ✨ **Key Features**

### 🔐 **Authentication & Access Control**

* Secure **JWT-based authentication** system.
* Role-based authorization with distinct **Admin** and **Member** experiences.
* Protected routes ensuring safe access to workspace resources.

---

### 📊 **Smart Workspace Dashboard**

* **Personalized Task View**: Members see only their assigned work.
* **Deadline Tracking**: Stay ahead with clear due dates and task states.
* **Minimal, Focused UI**: No clutter—just actionable insights.

---

### 📋 **Project & Task Management**

* **Project Creation (Admin Only)**: Organize work into structured projects.
* **Task Lifecycle Tracking**:

  * Pending
  * In Progress
  * Completed
* **Assignment System**: Allocate tasks to specific team members.
* **Deadline Control**: Set and monitor timelines efficiently.

---

### 👥 **Team Collaboration & Roles**

* **Admin Role**:

  * Full control over projects, users, and notices.
  * Can add or permanently remove members.
* **Member Role**:

  * View and update assigned tasks.
  * Track personal productivity within projects.

---

### 📢 **Notice Board System**

* Centralized **workspace announcement board**.
* Admins can:

  * Publish important updates.
  * Instantly communicate with the entire team.
  * Use **“Clear Board”** to reset announcements when needed.

---

### ✉️ **Automated Onboarding**

* Seamless member addition via Admin dashboard.
* Automatic account creation with:

  * Secure credentials
  * Email delivery using **Nodemailer**
* Reduces manual setup and onboarding friction.

---

### 🎨 **Modern UI/UX**

* **Mint-green premium theme** for a fresh, clean feel.
* Smooth animations powered by **Framer Motion**.
* Responsive, rounded components built with **Tailwind CSS v4**.
* Subtle hover effects and transitions for a polished experience.

---

## 🛠️ **Tech Stack**

### **Frontend**

* React 19 (with Vite)
* Tailwind CSS v4
* Framer Motion
* React Router
* Lucide React Icons

### **Backend**

* Node.js
* Express.js
* MongoDB (Mongoose)
* JWT Authentication
* Nodemailer (Email automation)

---

## 📐 **Database Schema & Structure**

The application uses a flexible **MongoDB document-based schema**:

* **User**

  * Stores authentication details and role (Admin/Member)

* **Project**

  * Represents a collection of tasks managed by Admins

* **Task**

  * Linked to a project and assigned to users
  * Includes status, deadline, and progress tracking

* **Notice**

  * Stores workspace-wide announcements

---

## ⚙️ **Local Development Setup**

This project is divided into two modules:

* `backend`
* `frontend`

Both must run simultaneously.

---

### 🔧 **1. Backend Setup**

```bash
cd backend
npm install
```

Create a `.env` file:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=3000
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password
```

#### 🌱 Seed Database (Recommended)

```bash
node seedAdmin.js
```

**Default Admin Credentials:**

* Email: `admin@gmail.com`
* Password: `Admin@123`

Start backend:

```bash
npm run dev
```

---

### 💻 **2. Frontend Setup**

```bash
cd frontend
npm install
npm run dev
```

Open:

```
http://localhost:5173
```

---

## 🔄 **Authentication Flow**

### 👑 **Admins**

* Full access to:

  * Projects
  * Tasks
  * Users
  * Notice board
* Can onboard members via automated email system.

### 👤 **Members**

* Access only assigned tasks.
* Can update task status and track progress.

### 📢 **Notice Board**

* Updates visible to all users (refresh-based sync).

---

## 🚀 **Deployment Notes**

* Configure all environment variables in production.
* Ensure email credentials are properly set for onboarding.
* Build frontend before deployment:

```bash
npm run build
```

* Deploy backend and frontend separately (or via unified hosting).

---

## 🧠 **Development Philosophy**

* **User-Centric Design**: Clean UI with purposeful interactions.
* **Efficiency First**: Minimal clicks to complete actions.
* **Scalable Architecture**: Modular backend and reusable frontend components.
* **Automation**: Reduce manual processes with smart onboarding.
* **Consistency**: Unified design language across the app.

* Or design a **pitch deck version** of TeamTaskGo
