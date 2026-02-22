# Weather Travel Backend API

Production-ready backend server for the Weather Travel application.

## Features

- **Authentication**: User registration and login with JWT
- **Weather Data**: Proxy API for OpenWeather with caching
- **Trip Management**: Create, read, and delete travel plans
- **Email Notifications**: Trip reminders via Nodemailer
- **Security**: Helmet, CORS, rate limiting, and JWT authentication
- **Caching**: In-memory caching for weather data
- **Error Handling**: Centralized error handling middleware

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: bcrypt + JWT
- **Email**: Nodemailer
- **Caching**: node-cache

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Required environment variables:

- `PORT` - Server port (default: 5000)
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `WEATHER_API_KEY` - OpenWeatherMap API key
- `EMAIL_USER` - Gmail address for sending emails
- `EMAIL_PASS` - Gmail app-specific password

### 3. Get OpenWeatherMap API Key

1. Sign up at https://openweathermap.org/api
2. Create a free API key
3. Add it to your `.env` file

### 4. Setup MongoDB

**Option A: MongoDB Atlas (Cloud - Recommended)**

1. Create free account at https://cloud.mongodb.com
2. Create a new cluster
3. Create a database user
4. Whitelist your IP address (or use 0.0.0.0/0 for all IPs in development)
5. Get connection string and add to `.env`

**Option B: Local MongoDB**

1. Install MongoDB locally
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/weathertravel`

### 5. Setup Gmail for Email Notifications

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Select "Mail" and generate password
3. Add email and app password to `.env`

### 6. Run the Server

**Development mode (with auto-reload):**

```bash
npm run dev
```

**Production mode:**

```bash
npm start
```

Server will start on `http://localhost:5000`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Weather

- `GET /api/weather/:city` - Get weather data for a city (cached)

### Trips

- `POST /api/trips` - Create new trip (requires auth)
- `GET /api/trips` - Get user's trips (requires auth)
- `DELETE /api/trips/:id` - Delete trip (requires auth)

### Health Check

- `GET /health` - Server health status

## Authentication

Protected routes require JWT token in the Authorization header:

```javascript
headers: {
  'Authorization': 'your_jwt_token_here'
}
```

## Project Structure

```
server/
├── config/
│   └── db.js                 # MongoDB connection
├── controllers/
│   ├── authController.js     # Auth logic
│   ├── weatherController.js  # Weather logic
│   └── tripController.js     # Trip logic
├── middleware/
│   ├── auth.js               # JWT verification
│   ├── errorHandler.js       # Global error handler
│   └── rateLimiter.js        # Rate limiting
├── models/
│   ├── User.js               # User schema
│   ├── Trip.js               # Trip schema
│   └── Favorite.js           # Favorite schema
├── routes/
│   ├── authRoutes.js         # Auth endpoints
│   ├── weatherRoutes.js      # Weather endpoints
│   └── tripRoutes.js         # Trip endpoints
├── services/
│   ├── emailService.js       # Email functionality
│   ├── cacheService.js       # Caching service
│   └── recommendationService.js # Travel recommendations
├── .env                      # Environment variables (create from .env.example)
├── .env.example              # Environment template
├── .gitignore               # Git ignore rules
├── index.js                  # Server entry point
└── package.json              # Dependencies
```

## Security Features

- ✅ Helmet for HTTP headers security
- ✅ CORS configuration
- ✅ Rate limiting (100 requests per 15 minutes)
- ✅ Password hashing with bcrypt
- ✅ JWT with expiration
- ✅ Environment variables for secrets
- ✅ Input validation

## Troubleshooting

**MongoDB Connection Error:**
- Verify your connection string in `.env`
- Check if your IP is whitelisted in MongoDB Atlas
- Ensure database user has correct permissions

**Weather API Not Working:**
- Verify API key in `.env`
- Check if you've exceeded free tier limits
- Ensure city name is spelled correctly

**Email Not Sending:**
- Verify Gmail credentials in `.env`
- Ensure you're using App Password, not regular password
- Check if 2FA is enabled on Gmail account

**Port Already in Use:**
- Change `PORT` in `.env` to a different number
- Or kill the process using port 5000

## Development

Run with nodemon for auto-reload:

```bash
npm run dev
```

## Production Deployment

1. Set `NODE_ENV=production` in environment
2. Use strong `JWT_SECRET`
3. Enable HTTPS
4. Set up proper MongoDB security
5. Configure CORS for your frontend domain
6. Consider using PM2 for process management

## License

MIT
