# 💬 Real-Time Chat Application

A production-ready full-stack chat app built with React, Node.js, Socket.io, and MongoDB.

**Live Demo:** [https://chattr-odl6.onrender.com](https://chattr-odl6.onrender.com)

---

## 🗂️ Project Structure

```
Real Time ChatBot/
├── backend/
│   ├── config/         # DB connection
│   ├── controllers/    # Route handlers
│   ├── middleware/     # JWT auth guard
│   ├── models/         # Mongoose schemas
│   ├── routes/         # Express routers
│   ├── sockets/        # Socket.io logic
│   ├── .env            # Environment variables
│   └── server.js       # Entry point
└── frontend/
    └── src/
        ├── components/ # Sidebar, ChatWindow, MessageList, MessageInput
        ├── context/    # AuthContext, SocketContext
        ├── hooks/      # useChat
        ├── pages/      # AuthPage, ChatPage
        └── utils/      # Axios instance
```

---

## ⚙️ Setup Instructions

### 1. MongoDB Atlas

1. Go to https://cloud.mongodb.com and create a free cluster
2. Create a database user (username + password)
3. Whitelist your IP (or use `0.0.0.0/0` for dev)
4. Copy the connection string — it looks like:
   `mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/chatapp`

### 2. Backend Setup

```bash
cd backend
# Edit .env — paste your MongoDB URI and set a strong JWT_SECRET
npm install
npm run dev        # starts on http://localhost:5000
```

**`.env` values to fill in:**
```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/chatapp
JWT_SECRET=change_this_to_a_long_random_string
CLIENT_URL=http://localhost:3000
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm start          # starts on http://localhost:3000
```

---

## 🚀 Running Locally

Open **two terminals**:

```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend
cd frontend && npm start
```

Then open http://localhost:3000 in your browser.  
Register two accounts in different tabs to test real-time messaging.

---

## 📡 API Endpoints

| Method | Endpoint                  | Auth | Description              |
|--------|---------------------------|------|--------------------------|
| POST   | /api/auth/register        | ✗    | Register new user        |
| POST   | /api/auth/login           | ✗    | Login, returns JWT       |
| GET    | /api/users                | ✓    | Get all users except self|
| GET    | /api/users/me             | ✓    | Get current user profile |
| GET    | /api/messages/:userId     | ✓    | Get conversation history |

---

## 🔌 Socket.io Event Flow

### Client → Server
| Event         | Payload                          | Description              |
|---------------|----------------------------------|--------------------------|
| `sendMessage` | `{ receiverId, message }`        | Send a chat message      |
| `typing`      | `{ receiverId }`                 | Notify typing started    |
| `stopTyping`  | `{ receiverId }`                 | Notify typing stopped    |

### Server → Client
| Event           | Payload                                      | Description                  |
|-----------------|----------------------------------------------|------------------------------|
| `receiveMessage`| `{ _id, senderId, receiverId, message, ... }`| Deliver message to receiver  |
| `messageSent`   | same as above                                | Confirm delivery to sender   |
| `onlineUsers`   | `[userId, userId, ...]`                      | Updated online users list    |
| `userTyping`    | `{ senderId }`                               | Someone is typing            |
| `userStopTyping`| `{ senderId }`                               | Someone stopped typing       |

---

## 🌐 Deployment Guide

### Backend → Render

1. Push your code to GitHub
2. Go to https://render.com → New Web Service
3. Connect your repo, set root directory to `backend`
4. Build command: `npm install`  
   Start command: `node server.js`
5. Add environment variables (same as `.env`)
6. Update `CLIENT_URL` to your Vercel frontend URL

### Frontend → Vercel

1. Go to https://vercel.com → New Project
2. Connect your repo, set root directory to `frontend`
3. Add environment variable:
   - `REACT_APP_API_URL` = `https://your-render-app.onrender.com/api`
   - `REACT_APP_SOCKET_URL` = `https://your-render-app.onrender.com`
4. Deploy

---

## ✨ Features

- ✅ JWT authentication (register / login)
- ✅ Real-time messaging via Socket.io
- ✅ Typing indicators with auto-stop
- ✅ Online / offline presence tracking
- ✅ Message history loaded on conversation open
- ✅ Read receipts (✓ / ✓✓)
- ✅ Dark mode UI
- ✅ Responsive (mobile-friendly sidebar collapse)
- ✅ Input validation (frontend + backend)
- ✅ Secure password hashing (bcrypt, 12 rounds)
- ✅ Protected REST routes + authenticated sockets
