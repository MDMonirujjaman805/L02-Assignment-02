# 🚗 Vehicle Management API

**Live URL:** https://github.com/MDMonirujjaman805/L02-Assignment-02

A clean and modular REST API built using **Express**, **TypeScript**, and **PostgreSQL** to manage vehicles, users, and authentication. The project follows a well-structured architecture with proper separation of concerns.

---

## ✨ Features

### 🔐 Authentication

- User registration and login
- Secure password hashing (bcrypt)
- JWT-based authentication system

### 🚘 Vehicle Management

- Add new vehicles
- Fetch all vehicles
- Get vehicle by ID
- Update vehicle details
- Delete vehicles
- Track availability status

### 🧩 Project Architecture

- Feature-based modular structure
- Routes → Controllers → Services → Database
- Central configuration handling using dotenv

### 🗄️ PostgreSQL Integration

- NeonDB connection
- Safe database queries using `pg`
- Relational data management

---

## 🛠️ Technology Stack

| Category         | Tools                |
| ---------------- | -------------------- |
| Runtime          | Node.js              |
| Framework        | Express.js           |
| Language         | TypeScript           |
| Database         | PostgreSQL           |
| Database Library | node-postgres (pg)   |
| Authentication   | bcrypt, jsonwebtoken |
| Dev Tools        | tsx, dotenv          |

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository

```bash
git clone https://github.com/MDMonirujjaman805/L02-Assignment-02
cd L02-Assignment-02
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Create a `.env` File

### 4️⃣ Run the Project

**Development Mode:**

```bash
npm run dev
```

**Production Build:**

```bash
npm run build
```

---

## 🚀 API Endpoints

### Authentication

- `POST /api/v1/auth/signup`
- `POST /api/v1/auth/signin`

### Vehicles

- `POST /api/v1/vehicles`
- `GET /api/v1/vehicles`
- `GET /api/v1/vehicles/:id`
- `PATCH /api/v1/vehicles/:id`
- `DELETE /api/v1/vehicles/:id`

---

## 🧑‍💻 Author

**MD-Monirujjaman**
