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

## 📜 License & Acknowledgements
Built by [Subhash Jha](https://github.com/subhash-jhaa). Licensed under the ISC License. Special thanks to the open-source community for the amazing tools that made this possible.
