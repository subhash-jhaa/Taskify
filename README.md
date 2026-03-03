# Taskify - Task Management Application

Taskify is a modern, full-stack task management application designed to help users organize their work efficiently. It features a sleek interface, secure authentication, and robust task tracking capabilities.

## 🚀 Features

- **User Authentication**: Secure signup and login with JWT and cookie-based sessions.
- **Task Management**: Create, update, delete, and track your tasks.
- **Modern UI**: A responsive and beautiful interface built with Next.js and Tailwind CSS.
- **Smooth Animations**: Interactive experience powered by Framer Motion.
- **Email Notifications**: Integrated email services for important updates.
- **Data Integrity**: Reliable data management with Prisma and PostgreSQL.

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **State Management**: [React Query (TanStack Query)](https://tanstack.com/query/latest)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **Authentication**: JWT & Cookie-parser
- **Notifications**: Nodemailer

## 📦 Project Structure

```text
Task-Management/
├── client/           # Frontend Next.js application
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── app/
│   └── ...
├── server/           # Backend Express application
│   ├── controllers/
│   ├── routes/
│   ├── config/
│   ├── prisma/
│   └── ...
└── README.md         # Root documentation
```

## 🏁 Getting Started

### Prerequisites
- Node.js (v18 or later)
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd Task-Management
   ```

2. **Setup Server:**
   ```bash
   cd server
   npm install
   # Create a .env file with DATABASE_URL and other secrets
   npx prisma generate
   npm run dev
   ```

3. **Setup Client:**
   ```bash
   cd ../client
   npm install
   npm run dev
   ```

## 📜 License
This project is licensed under the ISC License.
