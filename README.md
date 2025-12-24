# 🚀 Real-Time Chat Application

A full-stack real-time chat application built with Node.js, Express, Socket.IO, MongoDB, and vanilla JavaScript.

## 📋 Features

- ✅ User Authentication (Register/Login with JWT)
- ✅ Real-time messaging via Socket.IO
- ✅ Online/Offline user status
- ✅ Typing indicators
- ✅ Message read receipts
- ✅ Online users list
- ✅ Beautiful, responsive UI

## 🏗️ Project Structure

```
chat/
├── chat_backend/          # Backend server
│   ├── config/           # Database configuration
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Auth middleware
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── socket/          # Socket.IO handlers
│   ├── server.js        # Main server file
│   └── package.json     # Backend dependencies
├── index.html           # Frontend client
├── style.css            # Frontend styles
└── render.yaml          # Render deployment config
```

## 🚀 Quick Start (Local Development)

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd chat_backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```bash
   cp ../env.example .env
   ```

4. **Configure environment variables in `.env`:**
   ```env
   MONGODB_URI=mongodb://localhost:27017/chat_app
   JWT_SECRET=your-super-secret-jwt-key-change-this
   PORT=3000
   ```

5. **Start the server:**
   ```bash
   npm start
   # or for development with auto-reload:
   npm run dev
   ```

### Frontend Setup

1. **Open `index.html` in a browser** or use a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js http-server
   npx http-server -p 8000
   ```

2. **Access the client:**
   - Open `http://localhost:8000` in your browser

## 🌐 Deployment on Render

### Step 1: Prepare MongoDB

1. Create a free MongoDB Atlas account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string (MONGODB_URI)
4. Whitelist all IPs (0.0.0.0/0) for Render deployment

### Step 2: Deploy Backend on Render

1. **Push your code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Go to Render Dashboard:**
   - Visit [render.com](https://render.com)
   - Sign up/Login with GitHub

3. **Create New Web Service:**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository

4. **Configure the service:**
   - **Name:** `chat-backend`
   - **Environment:** `Node`
   - **Build Command:** `cd chat_backend && npm install`
   - **Start Command:** `cd chat_backend && npm start`
   - **Root Directory:** Leave empty (or use `chat_backend` if deploying from subdirectory)

5. **Add Environment Variables:**
   - `NODE_ENV` = `production`
   - `MONGODB_URI` = `your-mongodb-atlas-connection-string`
   - `JWT_SECRET` = `generate-a-strong-random-string`
   - `PORT` = Leave empty (Render sets this automatically)

6. **Deploy:**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Copy your service URL (e.g., `https://chat-backend.onrender.com`)

### Step 3: Update Frontend for Production

1. **Update `index.html`:**
   - Open `index.html`
   - In the "Server URL" field, enter your Render backend URL
   - Or leave it empty to auto-detect (if frontend is on same domain)

2. **Deploy Frontend (Optional):**
   - You can deploy the frontend on:
     - **Netlify:** Drag & drop the `index.html` and `style.css` files
     - **Vercel:** Connect GitHub repo and deploy
     - **GitHub Pages:** Push to `gh-pages` branch
     - Or simply share the files with the interviewer

## 🧪 Testing the Application

### For Interviewer/Testing:

1. **Access the Frontend:**
   - Open `index.html` in a browser
   - Or use the deployed frontend URL

2. **Register a New User:**
   - Use Postman or any API client
   - `POST` to `https://your-backend-url.onrender.com/api/auth/register`
   - Body (JSON):
     ```json
     {
       "username": "testuser",
       "email": "test@example.com",
       "password": "password123"
     }
     ```
   - Copy the `token` from response

3. **Login (Alternative):**
   - `POST` to `https://your-backend-url.onrender.com/api/auth/login`
   - Body (JSON):
     ```json
     {
       "email": "test@example.com",
       "password": "password123"
     }
     ```
   - Copy the `token` from response

4. **Connect in Frontend:**
   - Paste the backend URL (if not auto-detected)
   - Paste the JWT token
   - Click "Connect"

5. **Test Features:**
   - Send messages to other users
   - Check online users list
   - Test typing indicators
   - Verify message read receipts

## 📡 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)
- `GET /api/auth/users` - Get all users (requires auth)

### Chat

- `GET /api/chat/messages/:userId` - Get messages with a user (requires auth)
- `POST /api/chat/messages` - Send a message (requires auth)

### Socket.IO Events

**Client → Server:**
- `send_message` - Send a message
- `typing` - Send typing indicator
- `message_read` - Mark message as read

**Server → Client:**
- `connect` - Connection established
- `disconnect` - Connection lost
- `online_users` - List of online users
- `user_status` - User status change
- `receive_message` - New message received
- `message_sent` - Message sent confirmation
- `user_typing` - Typing indicator
- `message_read_receipt` - Read receipt confirmation
- `error` - Error occurred

## 🔧 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret key for JWT tokens | Yes |
| `PORT` | Server port (default: 3000) | No |
| `NODE_ENV` | Environment (production/development) | No |

## 🛠️ Tech Stack

**Backend:**
- Node.js
- Express.js
- Socket.IO
- MongoDB (Mongoose)
- JWT (jsonwebtoken)
- bcryptjs

**Frontend:**
- Vanilla JavaScript
- Socket.IO Client
- HTML5/CSS3

## 📝 Notes for Deployment

- **Render Free Tier:** Services spin down after 15 minutes of inactivity. First request may take 30-60 seconds to wake up.
- **MongoDB Atlas:** Free tier provides 512MB storage, perfect for testing.
- **CORS:** Currently set to allow all origins (`*`). For production, restrict to your frontend domain.
- **JWT Secret:** Use a strong, random string in production. Generate with: `openssl rand -base64 32`

## 🐛 Troubleshooting

**Connection Issues:**
- Check if backend URL is correct
- Verify JWT token is valid
- Ensure backend service is running on Render

**MongoDB Connection Errors:**
- Verify MONGODB_URI is correct
- Check MongoDB Atlas IP whitelist
- Ensure database user has proper permissions

**Socket.IO Connection Fails:**
- Check CORS settings
- Verify WebSocket support on Render
- Check browser console for errors

## 📄 License

ISC

## 👤 Author

Ankit Srivastav

---

**Ready for Interview Testing! 🎯**

For interviewers: The backend is deployed on Render. Simply:
1. Get the backend URL from the candidate
2. Register/Login via API to get a JWT token
3. Use the frontend client to test all features

