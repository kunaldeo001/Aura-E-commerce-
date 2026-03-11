# Aura | Premium E-Commerce Platform

Aura is a sophisticated, full-stack e-commerce application designed with a focus on premium aesthetics and a seamless user experience. It features a modern, responsive interface with dynamic interactive elements and a robust backend.

## ✨ Key Features

- **🛍️ Product Discovery**: Advanced filtering by category, search functionality, price range selection, and multiple sorting options.
- **🔐 Secure Authentication**: User registration and login system powered by JWT (JSON Web Tokens) and bcrypt password hashing.
- **⭐ Interactive Reviews**: Users can rate products (1-5 stars) and leave detailed comments.
- **🛒 Shopping Experience**: Fully functional shopping cart with persistent storage and a secure checkout process.
- **❤️ Wishlist**: Keep track of favorite items with a dedicated wishlist sidebar.
- **📦 Order History**: Logged-in users can view their past orders and track status.
- **📧 Newsletter**: Integrated subscription system for marketing updates.
- **💎 Premium UI/UX**: 
  - Custom interactive cursor
  - 3D tilt effects on product cards
  - Magnetic button interactions
  - Smooth HSL-based dark mode aesthetics
  - Responsive layout for all devices

## 🛠️ Technology Stack

### Frontend
- **Framework**: [Vite](https://vitejs.dev/) (Vanilla JS)
- **Styling**: Custom Modern CSS (Glassmorphism, Gradients, Micro-animations)
- **Icons**: [Ionicons](https://ionicons.com/)
- **Typography**: Outfit (Google Fonts)

### Backend
- **Server**: [Express.js](https://expressjs.com/)
- **Database**: [SQLite](https://sqlite.org/) (via `sqlite` and `sqlite3` packages)
- **Authentication**: `jsonwebtoken` (JWT)
- **Security**: `bcryptjs` for password hashing
- **CORS**: Enabled for cross-origin requests

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v14 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

This project requires both the backend and frontend to be running.

1. **Start the Backend Server**:
   ```bash
   node server.js
   ```
   The server will run on `http://localhost:3000`. It will automatically initialize the `database.sqlite` file and seed it with initial products if it doesn't exist.

2. **Start the Frontend (Development Mode)**:
   ```bash
   npm run dev
   ```
   The Vite dev server will run (usually on `http://localhost:5173`).

### Environment & Configuration
- **JWT Secret**: Managed in `server.js` (default provided for development).
- **Backend Port**: 3000 (configurable in `server.js`).

## 📁 Project Structure

```text
├── src/
│   ├── main.js        # Core frontend logic & UI rendering
│   ├── products.js    # Product data fetching & management
│   ├── cart.js        # Shopping cart state & logic
│   ├── counter.js     # Counter utility
│   └── style.css      # Core design system & styles
├── public/            # Static assets
├── db.js              # Database initialization & seeding
├── server.js          # Express API server & Auth routes
├── index.html         # Application entry point
├── package.json       # Dependencies & scripts
└── database.sqlite    # SQLite database (generated on start)
```

### 📜 License

This project is licensed under the MIT License.
