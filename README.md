# 🚀 Taskify - Modern Task Management

Taskify is a high-performance, full-stack task management ecosystem built with **Next.js 16**, **Express**, and **Prisma**. It delivers a premium user experience with a focus on speed, security, and elegant design.

![Taskify Dashboard](https://github.com/user-attachments/assets/...) <!-- Placeholder for actual screenshot -->

## 🔗 Live Links
- **Application**: [https://taskify-by-subhash.vercel.app/](https://taskify-by-subhash.vercel.app/)
- **Backend API**: [https://taskify-2zoy.onrender.com/api](https://taskify-2zoy.onrender.com/api)

## ✨ Key Features

- **🔐 Advanced Authentication**: Secure session management using JWT and HTTP-only cookies.
- **📧 OTP-Based Communication**: Robust password reset and account verification via email (SMTP).
- **🌓 Light/Dark Mode**: Seamless theme switching with system detection and persistence.
- **📋 Smart Task Tracking**: Create, categorize, and track tasks with a dynamic Kanban-style interface.
- **🎨 Premium UI/UX**: Crafted with **Shadcn UI** and **Tailwind CSS 4** for a sleek, responsive experience.
- **⚡ Real-time Updates**: Optimized data fetching and synchronization with **TanStack Query**.
- **📱 Universal Compatibility**: Fully responsive design optimized for mobile, tablet, and desktop.

## 🛠️ Technology Ecosystem

### **Frontend (The Experience)**
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router & Turbopack)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/) & [Radix UI](https://www.radix-ui.com/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Form Engine**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)

### **Backend (The Engine)**
- **Runtime**: [Node.js](https://nodejs.org/) & [TypeScript](https://www.typescriptlang.org/)
- **Server**: [Express.js](https://expressjs.com/)
- **Database Architecture**: [Prisma ORM](https://www.prisma.io/) with [PostgreSQL](https://www.postgresql.org/)
- **Mailing**: [Nodemailer](https://nodemailer.com/) with SMTP Relay (Brevo)

---

## 🏗️ Architecture Overview

```text
Task-Management/
├── client/           # Next.js Frontend (Vercel)
│   ├── src/components/ # Reusable Shadcn UI & Custom Components
│   ├── src/app/        # App Router Pages & Layouts
│   └── src/lib/        # API Clients & Utilities
├── server/           # Express Backend (Render/Railway)
│   ├── controllers/    # Business Logic & Auth Handling
│   ├── prisma/         # Schema & Migrations
│   ├── config/         # Nodemailer & Database Config
│   └── routes/         # API Endpoint Definitions
└── README.md         # Global Documentation
```

---

## 🚦 Getting Started

### **Prerequisites**
- Node.js v18+
- PostgreSQL Instance (Local or Supabase)
- SMTP Credentials (Brevo/Gmail)

### **1. Clone & Install**
```bash
git clone https://github.com/subhash-jhaa/Taskify.git
cd Task-Management
```

### **2. Configure Backend**
Navigate to `/server` and create a `.env` file:
```env
DATABASE_URL="your_postgresql_url"
JWT_ACCESS_SECRET="your_secret"
SMTP_USER="your_smtp_user"
SMTP_PASS="your_smtp_password"
SENDER_EMAIL="your_verified_sender"
```
```bash
npm install
npx prisma generate
npm run dev
```

### **3. Configure Frontend**
Navigate to `/client` and create a `.env.local` file:
```env
NEXT_PUBLIC_API_URL="http://localhost:4000/api"
```
```bash
npm install
npm run dev
```

---

## 🚀 API Documentation

### Authentication
This API uses cookie-based JWT authentication. Upon successful login, an HTTP-only `token` cookie is set in the browser. This cookie must be included in the headers of all subsequent requests to protected endpoints to maintain the session.

---

### Auth Endpoints

#### `POST /auth/register`
Register a new user account.
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "name": "Subhash Jha",
    "email": "subhash@example.com",
    "password": "securePassword123"
  }
  ```
- **Success Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "User registered successfully"
  }
  ```
- **Error Response (400 Bad Request)**:
  ```json
  {
    "success": false,
    "message": "Email already exists"
  }
  ```

#### `POST /auth/login`
Authenticate user and set session cookie.
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "email": "subhash@example.com",
    "password": "securePassword123"
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Logged in successfully",
    "user": {
      "id": "user_67890",
      "name": "Subhash Jha",
      "email": "subhash@example.com"
    }
  }
  ```
- **Error Response (401 Unauthorized)**:
  ```json
  {
    "success": false,
    "message": "Invalid email or password"
  }
  ```

#### `POST /auth/logout`
Clear the authentication session cookie.
- **Headers**: `Cookie: token={jwt_token}`
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Logged out successfully"
  }
  ```

---

### Task Endpoints

#### `GET /tasks`
Retrieve a filtered and paginated list of tasks for the authenticated user.
- **Headers**: `Cookie: token={jwt_token}`
- **Query Parameters**:

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `page` | `number` | `1` | The page number to retrieve (min: 1) |
| `limit` | `number` | `10` | Number of tasks per page (min: 1, max: 50) |
| `status` | `string` | - | Filter by `TODO`, `IN_PROGRESS`, or `COMPLETED` |
| `search` | `string` | - | Case-insensitive search on task titles |

- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "task_12345",
        "title": "Implement AES Encryption",
        "description": "Add CBC mode encryption for task payloads",
        "status": "COMPLETED",
        "createdAt": "2024-03-14T10:00:00Z"
      }
    ],
    "meta": {
      "total": 45,
      "page": 1,
      "limit": 10,
      "totalPages": 5
    }
  }
  ```
- **Error Response (400 Bad Request)**:
  ```json
  {
    "success": false,
    "message": "Invalid limit. Must be a number between 1 and 50."
  }
  ```

#### `POST /tasks`
Create a new task for the authenticated user.
- **Headers**: `Cookie: token={jwt_token}`, `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "title": "Refactor Middleware",
    "description": "Clean up error handling in encryption middleware",
    "status": "TODO"
  }
  ```
- **Success Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "Task created successfully",
    "task": {
      "id": "task_12346",
      "title": "Refactor Middleware",
      "status": "TODO"
    }
  }
  ```

#### `PUT /tasks/:id`
Update an existing task's details or status.
- **Headers**: `Cookie: token={jwt_token}`, `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "title": "Refactor Middleware",
    "status": "IN_PROGRESS"
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Task updated successfully",
    "task": {
      "id": "task_12346",
      "status": "IN_PROGRESS"
    }
  }
  ```
- **Error Response (404 Not Found)**:
  ```json
  {
    "success": false,
    "message": "Task not found"
  }
  ```

#### `DELETE /tasks/:id`
Permanently delete a specific task.
- **Headers**: `Cookie: token={jwt_token}`
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Task deleted successfully"
  }
  ```

---

## 📜 License & Acknowledgements
Built by [Subhash Jha](https://github.com/subhash-jhaa). Licensed under the ISC License. Special thanks to the open-source community for the amazing tools that made this possible.
