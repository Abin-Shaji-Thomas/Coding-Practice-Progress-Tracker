# Coding Practice Progress Tracker

A role-based MERN web application for tracking coding practice. An **Admin** adds coding problems ("practice records"), assigns them to users and keeps their status up to date. A **User** logs in to view the problems assigned to them, search and filter them, and see a summary of their progress.

## Live Demo

- **Frontend:** https://coding-tracker-two.vercel.app
- **Backend API:** https://coding-tracker-api.vercel.app

## Tech Stack

| Layer    | Technology                                    |
| -------- | --------------------------------------------- |
| Frontend | React (Vite), React Router, Bootstrap 5, Axios |
| Backend  | Node.js, Express.js                           |
| Database | MongoDB Atlas with Mongoose                   |
| Auth     | JSON Web Tokens (jsonwebtoken), bcryptjs       |
| Hosting  | Vercel (frontend and backend)                 |

## Features

**Authentication (all users)**
- Sign up with validation: required fields, valid email, strong password (min 8 characters with uppercase, lowercase, number and special character), confirm password and role selection
- JWT-based login with redirect by role (Admin → `/admin`, User → `/dashboard`)
- Logout
- Change password (old password required, same strength rule)

**Admin**
- Home page with a short description and counts of total users, total records and solved records
- Operations page: table of all records with Add, Edit and Delete
- User Management page: view, add, update (name, email, role) and remove users
- An admin cannot delete their own account

**User (view only)**
- Dashboard showing only the records assigned to them
- Search by title, filter by platform, status and difficulty
- Summary counts: total, solved, attempted and todo

**Technical**
- Role-based routing on the frontend (`ProtectedRoute`) and role-based middleware on the backend (`auth` + `adminOnly`)
- Input validation on both frontend forms and backend routes
- Passwords are hashed with bcrypt and never returned by the API
- Responsive Bootstrap layout

## Folder Structure

```
├── README.md
├── backend
│   ├── server.js            # Express app, CORS, routes
│   ├── vercel.json          # Vercel config for the API
│   ├── config/db.js         # MongoDB connection (cached)
│   ├── models/              # User.js, Record.js
│   ├── middleware/          # auth.js (JWT), role.js (adminOnly)
│   ├── routes/              # authRoutes, userRoutes, recordRoutes, statsRoutes
│   ├── utils/validate.js    # email and password checks
│   └── .env.example
└── frontend
    ├── vercel.json          # SPA rewrite so refresh works on any page
    ├── index.html
    ├── .env.example
    └── src
        ├── main.jsx, App.jsx, api.js
        ├── context/AuthContext.jsx
        ├── utils/validate.js
        ├── components/      # Navbar, ProtectedRoute, RecordForm, UserForm
        └── pages
            ├── Signup.jsx, Login.jsx, ChangePassword.jsx
            ├── admin/       # AdminHome, Operations, UserManagement
            └── user/        # Dashboard
```

## Getting Started

### Prerequisites
- Node.js 18 or newer
- A MongoDB Atlas cluster (free tier is fine)

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env     # then fill in your own values
npm start                # runs on http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev              # runs on http://localhost:5173
```

## Environment Variables

**backend/.env**

| Name         | Description                                   |
| ------------ | --------------------------------------------- |
| `PORT`       | Port for the local server (e.g. 5000)          |
| `MONGO_URI`  | MongoDB Atlas connection string               |
| `JWT_SECRET` | Long random string used to sign tokens        |
| `CLIENT_URL` | Frontend URL allowed by CORS                  |

**frontend/.env**

| Name           | Description                          |
| -------------- | ------------------------------------ |
| `VITE_API_URL` | Backend API base URL ending in `/api` |

## API Endpoints

| Method | Endpoint                    | Access      | Description               |
| ------ | --------------------------- | ----------- | ------------------------- |
| POST   | `/api/auth/signup`          | Public      | Create an account         |
| POST   | `/api/auth/login`           | Public      | Log in and get a token    |
| PUT    | `/api/auth/change-password` | Logged in   | Change own password       |
| GET    | `/api/users`                | Admin       | List all users            |
| POST   | `/api/users`                | Admin       | Add a user                |
| PUT    | `/api/users/:id`            | Admin       | Update a user             |
| DELETE | `/api/users/:id`            | Admin       | Remove a user             |
| GET    | `/api/records`              | Admin       | List all records          |
| POST   | `/api/records`              | Admin       | Add a record              |
| PUT    | `/api/records/:id`          | Admin       | Update a record           |
| DELETE | `/api/records/:id`          | Admin       | Delete a record           |
| GET    | `/api/records/mine`         | Logged in   | Records assigned to me    |
| GET    | `/api/stats`                | Admin       | Counts for the admin home |
| GET    | `/api/health`               | Public      | API and database check    |
