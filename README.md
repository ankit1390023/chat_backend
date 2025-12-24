# Chat Backend

Real-time chat backend built with Node.js, Express, Socket.IO, and MongoDB.

## Setup

### Prerequisites
- Node.js 14+
- MongoDB (local or Atlas)

### Installation

```bash
cd chat_backend
npm install
```

### Environment Variables

Create a `.env` file:

```
MONGODB_URI=mongodb://localhost:27017/chat_app
JWT_SECRET=your-secret-key-here
PORT=3000
```

### Run

```bash
npm start
# or for development
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)
- `GET /api/auth/users` - Get all users (requires auth)

### Chat
- `GET /api/chat/history/:userId` - Get chat history with a user
- `PUT /api/chat/read/:userId` - Mark messages as read
- `GET /api/chat/unread/count` - Get unread message count

## Socket.IO Events

**Client → Server:**
- `send_message` - Send a message
- `typing` - Send typing indicator
- `message_read` - Mark message as read

**Server → Client:**
- `connect` - Connection established
- `online_users` - List of online users
- `user_status` - User status change
- `receive_message` - New message received
- `message_sent` - Message sent confirmation
- `user_typing` - Typing indicator
- `message_read_receipt` - Read receipt confirmation
- `error` - Error occurred

## Deployment on Render

1. Push code to GitHub
2. Create new Web Service on Render
3. Connect your GitHub repo
4. Set environment variables:
   - `MONGODB_URI` - Your MongoDB Atlas connection string
   - `JWT_SECRET` - Random secret key
   - `NODE_ENV` - Set to `production`
5. Build command: `npm install`
6. Start command: `npm start`

Note: Render free tier spins down after 15 minutes of inactivity. First request may take 30-60 seconds.

## Testing

1. Register a user via `POST /api/auth/register`
2. Login via `POST /api/auth/login` to get JWT token
3. Use the token to connect via Socket.IO
4. Test messaging between users

Frontend client is available in `chat_frontend_testing` folder.
