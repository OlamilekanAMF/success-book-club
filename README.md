# 📚 Success Book Club

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D%2018.0.0-brightgreen)](https://nodejs.org/)
[![Framework: Express](https://img.shields.io/badge/Framework-Express-blue)](https://expressjs.com/)
[![Database: Supabase](https://img.shields.io/badge/Database-Supabase-green)](https://supabase.com/)

**Success Book Club** is a comprehensive, full-stack digital ecosystem designed for readers, authors, and community builders. It offers a seamless blend of book discovery, interactive community features, and multimedia content delivery.

---

## 🌟 Key Features

- **🔐 Advanced Authentication:** Secure user access via JWT-based local authentication and social logins (Google & Facebook) powered by Passport.js.
- **📖 Digital Library & Discovery:** Explore a vast collection of curated book picks with personalized recommendation engines.
- **🎙️ Multimedia Hub:** Integrated podcast player for literary discussions and author interviews.
- **📅 Event Management:** Stay updated with upcoming book launches, webinars, and community meetups.
- **💬 Community Engagement:** Interactive forums, real-time polls, and user commenting systems.
- **🔔 Notification System:** Real-time updates for new book releases, community interactions, and events.
- **🛠️ Admin Dashboard:** Robust administrative tools for content management, user moderation, and platform analytics.
- **🎬 Media Utility:** Background video processing and downloader utility powered by Python/Flask and `yt-dlp`.

---

## 🏗️ Architecture

The project follows a modular, decoupled architecture:

- **Frontend:** A responsive, high-performance UI built with semantic HTML5, modern CSS3, and modular JavaScript.
- **Backend API:** A scalable Node.js/Express server implementing the Controller-Service-Repository pattern.
- **Data Layer:** Hybrid storage strategy utilizing **Supabase (PostgreSQL)** for relational data and **MySQL** for specific legacy support.
- **Utility Service:** A lightweight Python/Flask service handling specialized media tasks.

---

## 🛠️ Tech Stack

### **Frontend**
- **Core:** HTML5, CSS3, ES6+ JavaScript
- **Styling:** Custom CSS with modern layouts (Grid/Flexbox)
- **State Management:** Localized JS state handlers

### **Backend (Node.js)**
- **Framework:** Express.js
- **Auth:** Passport.js (Local, Google, Facebook), JWT
- **Database:** Supabase (PostgreSQL), MySQL2
- **Security:** Helmet, Express-Rate-Limit, BcryptJS
- **Email:** Nodemailer

### **Utility (Python)**
- **Framework:** Flask
- **Processing:** yt-dlp

---

## 🚀 Getting Started

### **Prerequisites**
- Node.js (v18+)
- Python (3.9+)
- Supabase Account & Database

### **Installation**

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/success-book-club.git
   cd success-book-club
   ```

2. **Setup Backend:**
   ```bash
   cd backend
   npm install
   cp .env.example .env # Fill in your Supabase & OAuth credentials
   npm run dev
   ```

3. **Setup Utility Service (Optional):**
   ```bash
   # In root directory
   pip install flask flask-cors yt-dlp
   python app.py
   ```

4. **Run Frontend:**
   ```bash
   # In root directory
   npm install
   npm run dev
   ```

---

## 📂 Project Structure

```text
├── api/                # Client-side API services
├── assets/             # Images, styles, and static assets
├── backend/            # Express.js Server
│   ├── src/
│   │   ├── config/     # Auth, Database, Passport configs
│   │   ├── controllers/# Business logic
│   │   ├── middleware/ # Auth & Validation
│   │   └── routes/     # API endpoints
│   └── supabase/       # SQL schemas and setup scripts
├── frontend/           # Shared frontend logic
└── root/               # HTML entry points (index, library, etc.)
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git origin push feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

**Developed with ❤️ for the Global Reading Community.**
