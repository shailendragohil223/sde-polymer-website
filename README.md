# Shree Dipeshwari Engineering - Full Stack Dynamic Web Application

A full-stack, dynamic Single Page Application (SPA) for **Shree Dipeshwari Engineering (Complete Polymer Solution)**, built using **React.js + Vite**, **Node.js**, **Express.js**, and **MySQL**.

---

## 🚀 Tech Stack

- **Frontend**: React.js 18, React Router v6, Vite, Lucide React, Axios, Custom Industrial CSS Design System
- **Backend**: Node.js, Express.js, JWT Authentication, bcryptjs, RESTful Architecture, CORS, Morgan
- **Database**: MySQL 8.4 (with `mysql2/promise` connection pooling, automatic database & table migration, and resilient fallback mode)
- **Orchestration**: Concurrently (run both frontend and backend concurrently with one command)

---

## 🔒 Separate Admin Panel & Authentication

The public website header contains **no admin links**. The admin panel is managed via a dedicated, secure URL route:

- **Public Website URL**: `http://localhost:3000/`
- **Admin Portal URL**: `http://localhost:3000/admin` (or `http://localhost:3000/admin/login`)
- **Default Admin Credentials**:
  - **Username**: `admin` (or `admin@sdepolymer.com`)
  - **Password**: `admin123`

### Security Features:
1. **JWT & Session Protection**: All admin endpoints (`/api/admin/stats`, `/api/quotes`, `/api/contact`, and product CRUD) are secured with Bearer token authentication.
2. **Dedicated Login Screen**: Unauthenticated visitors attempting to access `/admin` or `/admin/dashboard` are redirected to the login interface.
3. **Session Persistence & Sign Out**: Secure token storage in `localStorage` with a single-click Sign Out option.

---

## 📁 Project Architecture

```
website/
├── backend/
│   ├── config/
│   │   └── db.js                 # MySQL pool connection, auto-migration & seed logic
│   ├── controllers/
│   │   ├── authController.js     # Admin login, token generation & verification
│   │   ├── contentController.js  # Site metadata, settings, hero stats
│   │   ├── productController.js  # Product catalog & categories CRUD
│   │   ├── quoteController.js    # RFQ Quote calculator & submission
│   │   ├── contactController.js  # Contact form inquiries
│   │   └── adminController.js    # Admin KPI metrics & dashboard
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT Bearer token authentication middleware
│   ├── db/
│   │   ├── schema.sql            # Full MySQL relational schema
│   │   └── seedData.js           # Initial dataset (10 categories, 9 products, 12 industries, etc.)
│   ├── routes/
│   │   └── apiRoutes.js          # REST API endpoints mapping (Public + Protected)
│   ├── .env.example
│   ├── .env                      # Database, Server & Admin credentials configuration
│   ├── package.json
│   └── server.js                 # Express server bootstrap (:5000)
├── frontend/
│   ├── src/
│   │   ├── components/           # Public section components (Header, Hero, Catalog, etc.)
│   │   ├── pages/
│   │   │   ├── HomePage.jsx          # Public Single Page Website
│   │   │   ├── AdminLoginPage.jsx    # Dedicated Admin Login Portal
│   │   │   └── AdminDashboardPage.jsx# Standalone Full-Screen Admin Console
│   │   ├── services/
│   │   │   └── api.js                # Axios API client with automatic JWT token interceptor
│   │   ├── App.jsx                   # React Router master setup
│   │   ├── main.jsx                  # Vite entry point
│   │   └── index.css                 # Premium design tokens & industrial styling
│   ├── index.html
│   ├── vite.config.js                # API proxy configuration (:3000 -> :5000)
│   └── package.json
├── package.json                      # Root scripts
└── README.md
```

---

## 🛠️ Quick Start Guide

### 1. Install All Dependencies
From the workspace root directory:
```bash
npm run install:all
```

### 2. Configure MySQL Database & Admin Credentials
Edit `backend/.env`:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=sde_polymer_db
JWT_SECRET=your_secret_jwt_key
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
ADMIN_EMAIL=admin@sdepolymer.com
NODE_ENV=development
```

### 3. Start the Full-Stack Application
Run both backend and frontend concurrently:
```bash
npm run dev
```

- **Frontend Public Website**: `http://localhost:3000`
- **Admin Portal**: `http://localhost:3000/admin`
- **Backend REST API**: `http://localhost:5000/api`
