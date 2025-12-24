# Testing Guide

Quick guide for testing the chat application.

## Backend URL

Backend deployed at: `https://chat-backend-3zsn.onrender.com`

Note: First request may take 30-60 seconds if the service is spinning up.

## Get JWT Token

Use Postman or curl to register/login:

**Register:**
```
curl --location 'https://chat-backend-3zsn.onrender.com/api/auth/register' \
--header 'Content-Type: application/json' \
--data-raw '{
  "username": "ankit",
  "email": "ankit@gmail.com",
  "password": "123456789"
}'

```

**Login:**
```
curl --location 'https://chat-backend-3zsn.onrender.com/api/auth/login' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email":"ankit@gmail.com",
    "password":"123456789"
}'

```

**Response after login**
{
    "message": "Login successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTRjMzM3YWIyNTkyOWVmZGI2M2ZjZjAiLCJpYXQiOjE3NjY2MDQ5MzEsImV4cCI6MTc2NzIwOTczMX0.rU4ttUGIATmhxyyJC0P3q7q7EHGjWHVSRzRlkZ-yGlA",
    "user": {
        "id": "694c337ab25929efdb63fcf0",
        "username": "ankit",
        "email": "ankit@gmail.com"
    }
}

Copy the `token` from the response.

## Test Frontend

1. Open the frontend (get `index.html` from candidate or use their deployed URL)
2. Enter the backend URL
3. Paste the JWT token
4. Click Connect

## What to Test

- **Connection:** Should show "Connected" status
- **Online Users:** List should appear when multiple users connect
- **Messaging:** Send messages between users
- **Typing Indicators:** Check/uncheck typing checkbox
- **Read Receipts:** Messages show ✓✓ when read

## Test Scenarios

1. **Two users messaging:** Register 2 users, connect both, send messages back and forth
2. **Online status:** Connect/disconnect users, verify they appear/disappear from online list
3. **Typing indicators:** One user types, other should see indicator
4. **Multiple users:** Connect 3+ users simultaneously

## Common Issues

- **Connection fails:** Check backend URL and JWT token validity
- **No online users:** Need at least 2 users connected
- **Messages not sending:** Verify receiver ID is correct

## Evaluation Points

- Authentication works correctly
- Real-time messaging functions properly
- Online status tracking works
- Typing indicators function
- Read receipts appear
- Code structure and error handling
- Successful deployment
