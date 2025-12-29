# Auto-École CAR 18 ème

A professional driving school website built with Angular (Frontend) and Express.js (Backend).

## Project Structure

- `frontend/`: Angular 17+ application
- `backend/`: Express.js API with MySQL database

## Prerequisites

- Node.js (v18+)
- MySQL Server

## Setup Instructions

### 1. Database Setup

Ensure your MySQL server is running. Create a database named `auto_ecole_db` or configure it in `.env`.

### 2. Backend Setup

Navigate to the backend directory:
```bash
cd backend
```

Install dependencies:
```bash
npm install
```

Create a `.env` file (copy from `.env.example` if available, or use the one created):
```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=auto_ecole_db
JWT_SECRET=your_jwt_secret
```

Initialize Database (Create Tables & Seed Data):
```bash
# Create database (if using root with no password, otherwise create manually)
npm run db:create

# Seed initial data
npm run seed
```

Start the Server:
```bash
# Development
npm run dev

# Production
npm run build
npm start
```

### 3. Frontend Setup

Navigate to the frontend directory:
```bash
cd frontend
```

Install dependencies:
```bash
npm install
```

Start the Development Server:
```bash
npm start
```
Access the application at `http://localhost:4200`.

## Features

- **Public Website**: Home, Services, Contact pages with dynamic content.
- **Admin Dashboard**: Manage business info, services, and content (Login: admin@autoecole18.fr / admin123).
- **API**: RESTful API with JWT authentication.

## Technologies

- **Frontend**: Angular 17, Angular Material, RxJS
- **Backend**: Express.js, TypeScript, Sequelize, MySQL
