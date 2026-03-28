# Triumphant Book Club Backend

## Setup Instructions

### 1. Prerequisites
- Node.js (v14+)
- XAMPP with MySQL running

### 2. Database Setup
1. Start XAMPP and ensure MySQL is running
2. Open phpMyAdmin: http://localhost/phpmyadmin/
3. Create database: `triumphant_bookclub`
4. Import `database.sql` into the database

### 3. Install Dependencies
```bash
cd backend
npm install
```

### 4. Configure Environment
Edit `.env` file and add your credentials:
- Google OAuth: Get from Google Cloud Console
- Facebook OAuth: Get from Facebook Developer Portal
- Stripe: Get from Stripe Dashboard (for payments)
- Email: Use Gmail app password or SMTP

### 5. Start Server
```bash
# Development
npm run dev

# Production
npm start
```

Server runs on: http://localhost:3000

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login user |
| POST | /api/auth/logout | Logout user |
| POST | /api/auth/refresh | Refresh token |
| GET | /api/auth/me | Get current user |
| GET | /api/auth/google | Google OAuth |
| GET | /api/auth/facebook | Facebook OAuth |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/users | Search users |
| GET | /api/users/:id | Get user profile |
| PUT | /api/users/me | Update profile |
| POST | /api/users/avatar | Update avatar |

### Forum
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/forum/posts | Get all posts |
| GET | /api/forum/posts/:id | Get post with replies |
| POST | /api/forum/posts | Create post |
| PUT | /api/forum/posts/:id | Update post |
| DELETE | /api/forum/posts/:id | Delete post |
| POST | /api/forum/posts/:id/reply | Add reply |

### Polls
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/polls | Get all polls |
| POST | /api/polls/:id/vote | Vote in poll |

### Chat
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/chat/:room | Get room messages |
| POST | /api/chat | Send message |

### Library
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/library | Get user's library |
| POST | /api/library | Add book |
| DELETE | /api/library/:bookId | Remove book |

### Recommendations
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/recommendations | Get all recommendations |
| POST | /api/recommendations | Add recommendation |
| POST | /api/recommendations/:id/vote | Vote |

## Features

- **Authentication**: Email/password, Google OAuth, Facebook OAuth
- **JWT Tokens**: Secure access with refresh tokens
- **Rate Limiting**: Prevents abuse
- **Input Validation**: Express-validator
- **Email Notifications**: Nodemailer integration
- **Premium Membership**: Stripe integration ready
- **Security**: Helmet, CORS, bcrypt

## Folder Structure
```
backend/
├── server.js           # Entry point
├── package.json        # Dependencies
├── .env               # Environment variables
├── database.sql       # Database schema
└── src/
    ├── config/
    │   ├── auth.js        # Auth config
    │   ├── database.js    # MySQL connection
    │   └── passport.js    # OAuth strategies
    ├── middleware/
    │   ├── auth.js        # JWT verification
    │   ├── premium.js    # Premium access
    │   └── validation.js # Input validation
    ├── routes/
    │   ├── auth.js        # Auth routes
    │   ├── users.js      # User routes
    │   ├── forum.js      # Forum routes
    │   ├── polls.js      # Poll routes
    │   ├── chat.js       # Chat routes
    │   ├── library.js    # Library routes
    │   └── recommendations.js
    └── utils/
        └── email.js       # Email utility
```

## Next Steps

1. Configure OAuth credentials (Google, Facebook)
2. Set up Stripe for payments
3. Configure email SMTP
4. Deploy to production
