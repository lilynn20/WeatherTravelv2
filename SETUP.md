# Weather Travel - Full Stack Setup Guide

## Quick Start

This guide will help you get both the backend and frontend running.

## Prerequisites

- Node.js (v16 or higher)
- MongoDB account (free at https://cloud.mongodb.com)
- OpenWeatherMap API key (free at https://openweathermap.org/api)
- Gmail account with 2FA enabled (for email features)

## Step 1: Backend Setup

### 1.1 Navigate to server folder
```bash
cd server
```

### 1.2 Install dependencies (already done)
```bash
npm install
```

### 1.3 Create environment file
```bash
cp .env.example .env
```

### 1.4 Configure your .env file

Open `server/.env` and add:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key_here
WEATHER_API_KEY=your_openweather_api_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
```

**Getting MongoDB URI:**
1. Go to https://cloud.mongodb.com
2. Create free cluster
3. Create database user
4. Whitelist IP (0.0.0.0/0 for development)
5. Click "Connect" → "Connect your application"
6. Copy connection string and replace `<password>` with your database user password

**Getting OpenWeather API Key:**
1. Sign up at https://openweathermap.org/api
2. Go to API keys section
3. Copy your default API key

**Getting Gmail App Password:**
1. Enable 2FA on your Gmail account
2. Go to https://myaccount.google.com/security
3. Search "App passwords"
4. Create new app password for "Mail"
5. Copy the 16-character password

### 1.5 Start the backend server
```bash
npm run dev
```

Server will run on http://localhost:5000

## Step 2: Frontend Setup

### 2.1 Open a new terminal and navigate to client folder
```bash
cd client
```

### 2.2 Install dependencies
```bash
npm install
```

### 2.3 Update API configuration

The frontend needs to point to your backend. Check if there's an API configuration file (usually in `src/utils/` or `src/config/`) and update the base URL to:

```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

### 2.4 Start the frontend
```bash
npm run dev
```

Frontend will run on http://localhost:5173 (or similar)

## Step 3: Verify Everything Works

### Test Backend
Open http://localhost:5000/health - You should see:
```json
{"status":"OK","message":"Server is running"}
```

### Test Frontend
Open your browser to the frontend URL and try:
1. Register a new account
2. Login
3. Search for a city's weather
4. Save a trip

## Project Structure

```
weathertravel/
├── client/              # React frontend
│   ├── src/
│   ├── public/
│   └── package.json
│
└── server/              # Express backend
    ├── config/          # Database configuration
    ├── controllers/     # Business logic
    ├── middleware/      # Auth, error handling
    ├── models/          # Database schemas
    ├── routes/          # API endpoints
    ├── services/        # Email, cache, recommendations
    ├── .env            # Environment variables (create this!)
    └── index.js         # Server entry point
```

## Available API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Weather
- `GET /api/weather/:city` - Get weather data

### Trips
- `GET /api/trips` - Get all trips (auth required)
- `POST /api/trips` - Create trip (auth required)
- `DELETE /api/trips/:id` - Delete trip (auth required)

### Favorites
- `GET /api/favorites` - Get all favorites (auth required)
- `POST /api/favorites` - Add favorite (auth required)
- `DELETE /api/favorites/:id` - Remove favorite (auth required)

## Connecting Frontend to Backend

In your frontend API calls, use these base URLs:

**Before (direct API call):**
```javascript
axios.get('https://api.openweathermap.org/data/2.5/weather?q=London&appid=...')
```

**After (through your backend):**
```javascript
axios.get('http://localhost:5000/api/weather/London')
```

**For authenticated routes:**
```javascript
axios.get('http://localhost:5000/api/trips', {
  headers: {
    'Authorization': token  // Token from login response
  }
})
```

## Troubleshooting

### Backend won't start
- Check if port 5000 is available
- Verify MongoDB connection string in `.env`
- Make sure all dependencies are installed

### Frontend can't connect to backend
- Verify backend is running on port 5000
- Check CORS settings in `server/index.js`
- Update API base URL in frontend code

### Weather API not working
- Verify API key in `server/.env`
- Check API key is active (can take a few minutes after creation)
- Test the endpoint: http://localhost:5000/api/weather/London

### Can't login/register
- Verify MongoDB is connected (check server console)
- Check JWT_SECRET is set in `.env`
- Verify request body format matches controller expectations

## Next Steps

1. ✅ Backend is running
2. ✅ Frontend is running
3. 🔄 Update frontend API calls to use backend
4. 🔄 Test all features
5. 🚀 Deploy to production

## Production Deployment Tips

### Backend
- Use environment variables on your hosting platform
- Set `NODE_ENV=production`
- Use a process manager like PM2
- Enable HTTPS
- Whitelist specific IPs in MongoDB

### Frontend
- Build the production version: `npm run build`
- Deploy to Vercel, Netlify, or similar
- Update API URLs to production backend URL
- Enable HTTPS

## Support

For detailed backend documentation, see `server/README.md`

## Common Commands

```bash
# Start backend (development)
cd server && npm run dev

# Start frontend (development)
cd client && npm run dev

# Install backend dependencies
cd server && npm install

# Install frontend dependencies
cd client && npm install

# Build frontend for production
cd client && npm run build
```

---

🎉 You're all set! Happy coding!
