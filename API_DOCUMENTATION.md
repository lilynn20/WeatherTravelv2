# Weather Travel API Documentation

## Base URL

```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

## Authentication

Protected endpoints require JWT token in the Authorization header:

```http
Authorization: your_jwt_token_here
```

---

## 🔐 Authentication Endpoints

### Register User

```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "name": "John Doe"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### Login

```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

---

## 🌤️ Weather Endpoints

### Get Weather Data

```http
GET /api/weather/:city
```

**Example:**
```http
GET /api/weather/London
```

**Response (200):**
```json
{
  "coord": { "lon": -0.1257, "lat": 51.5085 },
  "weather": [
    {
      "id": 800,
      "main": "Clear",
      "description": "clear sky",
      "icon": "01d"
    }
  ],
  "main": {
    "temp": 22.5,
    "feels_like": 21.8,
    "humidity": 60,
    "pressure": 1013
  },
  "wind": { "speed": 3.5 },
  "clouds": { "all": 10 },
  "cached": false
}
```

---

## ✈️ Trip Management (Protected)

### Create Trip

```http
POST /api/trips
Authorization: required
```

**Request Body:**
```json
{
  "city": "Paris",
  "startDate": "2026-06-15",
  "endDate": "2026-06-22",
  "notes": "Honeymoon trip"
}
```

**Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "userId": "507f191e810c19729de860ea",
  "city": "Paris",
  "startDate": "2026-06-15T00:00:00.000Z",
  "endDate": "2026-06-22T00:00:00.000Z",
  "notes": "Honeymoon trip"
}
```

### Get All Trips

```http
GET /api/trips
Authorization: required
```

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "city": "Paris",
    "startDate": "2026-06-15T00:00:00.000Z",
    "endDate": "2026-06-22T00:00:00.000Z",
    "notes": "Honeymoon trip"
  }
]
```

### Delete Trip

```http
DELETE /api/trips/:id
Authorization: required
```

**Response (200):**
```json
{
  "message": "Trip deleted successfully"
}
```

---

## ⭐ Favorites (Protected)

### Get Favorites

```http
GET /api/favorites
Authorization: required
```

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "userId": "507f191e810c19729de860ea",
    "city": "Barcelona",
    "addedAt": "2026-02-20T10:30:00.000Z"
  }
]
```

### Add Favorite

```http
POST /api/favorites
Authorization: required
```

**Request Body:**
```json
{
  "city": "Tokyo"
}
```

**Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "userId": "507f191e810c19729de860ea",
  "city": "Tokyo",
  "addedAt": "2026-02-22T14:20:00.000Z"
}
```

### Remove Favorite

```http
DELETE /api/favorites/:id
Authorization: required
```

---

## 🤖 AI Analytics & Recommendations

### Get Smart Recommendations

```http
GET /api/analytics/recommendations
```

**Query Parameters:**
- `climate` (optional): warm, cold, mild, tropical
- `activities` (optional): beach,hiking,culture (comma-separated)
- `tempMin` (optional): minimum temperature preference (default: 18)
- `tempMax` (optional): maximum temperature preference (default: 28)
- `month` (optional): preferred travel month (1-12)
- `budget` (optional): low, medium, high

**Example:**
```http
GET /api/analytics/recommendations?climate=warm&activities=beach,culture&tempMin=20&tempMax=30
```

**Response (200):**
```json
{
  "success": true,
  "count": 8,
  "recommendations": [
    {
      "city": "Barcelona",
      "country": "Spain",
      "climate": "mediterranean",
      "optimalTemp": { "min": 18, "max": 28 },
      "activities": ["beach", "culture", "food"],
      "bestMonths": [5, 6, 9, 10],
      "tags": ["warm", "sunny", "coastal"],
      "currentWeather": {
        "temp": 24,
        "description": "clear sky",
        "humidity": 65
      },
      "travelScore": 9.2,
      "recommendation": "Perfect conditions! Ideal time to visit."
    }
  ]
}
```

### Get Detailed City Analysis

```http
GET /api/analytics/city/:city
```

**Query Parameters:**
- `tempMin` (optional): preferred minimum temperature
- `tempMax` (optional): preferred maximum temperature

**Example:**
```http
GET /api/analytics/city/London?tempMin=15&tempMax=25
```

**Response (200):**
```json
{
  "city": "London",
  "currentWeather": {
    "temp": 18.5,
    "feelsLike": 17.2,
    "humidity": 75,
    "pressure": 1015,
    "windSpeed": 4.2,
    "cloudiness": 40,
    "description": "scattered clouds",
    "icon": "03d"
  },
  "travelScore": {
    "scores": {
      "temperature": 8,
      "humidity": 5,
      "windSpeed": 9,
      "cloudiness": 7,
      "precipitation": 10,
      "overall": 7.85
    },
    "rating": 7.9,
    "recommendation": "Very good weather conditions."
  },
  "analysis": {
    "score": 7.9,
    "recommendation": "Very good weather conditions.",
    "details": { /* scoring breakdown */ },
    "bestFor": ["hiking", "cycling", "photography", "outdoor activities"],
    "warnings": []
  },
  "timestamp": "2026-02-22T14:30:00.000Z",
  "cached": false
}
```

### Compare Destinations

```http
GET /api/analytics/compare
```

**Query Parameters:**
- `cities` (required): comma-separated list of cities (2-5 cities)

**Example:**
```http
GET /api/analytics/compare?cities=Paris,London,Rome,Barcelona
```

**Response (200):**
```json
{
  "success": true,
  "comparison": [
    {
      "city": "Barcelona",
      "score": 9.2,
      "temp": 24,
      "conditions": "clear sky",
      "recommendation": "Perfect conditions! Ideal time to visit."
    },
    {
      "city": "Rome",
      "score": 8.8,
      "temp": 22,
      "conditions": "few clouds",
      "recommendation": "Excellent conditions for travel."
    }
  ],
  "winner": {
    "city": "Barcelona",
    "score": 9.2,
    "temp": 24,
    "conditions": "clear sky",
    "recommendation": "Perfect conditions! Ideal time to visit."
  }
}
```

### Get 5-Day Forecast with Scoring

```http
GET /api/analytics/forecast/:city
```

**Example:**
```http
GET /api/analytics/forecast/Paris
```

**Response (200):**
```json
{
  "success": true,
  "city": "Paris",
  "country": "FR",
  "dailyForecasts": [
    {
      "date": "2026-02-22",
      "avgTemp": 16.5,
      "avgTravelScore": 7.8,
      "conditions": "partly cloudy",
      "hourlyData": [/* detailed hourly forecasts */]
    }
  ],
  "bestDay": {
    "date": "2026-02-25",
    "avgTemp": 19.2,
    "avgTravelScore": 8.9,
    "conditions": "clear sky"
  }
}
```

---

## 🎒 Smart Packing Lists

### Generate Full Packing List

```http
GET /api/analytics/packing/:city
```

**Query Parameters:**
- `duration` (optional): trip duration in days (default: 7)
- `activities` (optional): planned activities (comma-separated)
- `style` (optional): packing style - casual, business, adventure

**Example:**
```http
GET /api/analytics/packing/Tokyo?duration=10&activities=culture,food,hiking&style=casual
```

**Response (200):**
```json
{
  "success": true,
  "city": "Tokyo",
  "tripDetails": {
    "duration": 10,
    "activities": ["culture", "food", "hiking"],
    "style": "casual"
  },
  "packingList": {
    "clothing": [
      "Long-sleeve shirts",
      "Jeans/pants",
      "Light sweater",
      "Comfortable shoes",
      "Light jacket"
    ],
    "weatherGear": [
      "Umbrella",
      "Waterproof jacket/raincoat"
    ],
    "activityGear": [
      {
        "activity": "culture",
        "items": [
          "Comfortable walking shoes",
          "Day backpack",
          "Camera",
          "Guidebook/maps"
        ]
      },
      {
        "activity": "hiking",
        "items": [
          "Hiking boots",
          "Backpack",
          "Water bottle",
          "First aid kit"
        ]
      }
    ],
    "essentials": {
      "documents": ["Passport/ID", "Travel insurance"],
      "toiletries": ["Toothbrush", "Shampoo"],
      "electronics": ["Phone and charger", "Power bank"],
      "miscellaneous": ["Water bottle", "Travel pillow"]
    },
    "quantities": {
      "underwear": 10,
      "socks": 8,
      "tops": 6,
      "bottoms": 4,
      "outerwear": 1
    },
    "tips": [
      "Extended trip - definitely plan for laundry",
      "Rain is expected - pack waterproof items",
      "Roll clothes to save space"
    ]
  }
}
```

### Generate Minimal Packing List (Carry-On)

```http
GET /api/analytics/packing/:city/minimal
```

**Query Parameters:**
- `duration` (optional): trip duration (default: 3)

**Example:**
```http
GET /api/analytics/packing/Berlin/minimal?duration=4
```

**Response (200):**
```json
{
  "success": true,
  "city": "Berlin",
  "duration": 4,
  "packingList": {
    "clothing": [
      "Long-sleeve shirts",
      "Jeans/pants",
      "Light sweater",
      "Comfortable shoes",
      "Light jacket"
    ],
    "essentials": {
      "documents": ["Passport/ID", "Travel insurance"],
      "toiletries": ["Travel-size toiletries", "Medications"],
      "electronics": ["Phone + charger", "Power bank"]
    },
    "tips": [
      "Carry-on only - pack light!",
      "Wear bulkiest items on plane",
      "Plan to do laundry"
    ],
    "quantities": {
      "tops": 3,
      "bottoms": 2,
      "underwear": 4,
      "socks": 3,
      "outerwear": 1
    }
  },
  "note": "Carry-on only packing list"
}
```

### Get Interactive Packing Checklist

```http
GET /api/analytics/packing/:city/checklist
```

**Query Parameters:**
- `duration` (optional): trip duration
- `activities` (optional): planned activities

**Response (200):**
```json
{
  "success": true,
  "city": "Amsterdam",
  "checklist": [
    {
      "category": "Clothing",
      "items": [
        { "name": "T-shirts/casual tops", "checked": false },
        { "name": "Light pants/jeans", "checked": false }
      ]
    },
    {
      "category": "Weather Gear",
      "items": [
        { "name": "Waterproof jacket/raincoat", "checked": false },
        { "name": "Umbrella", "checked": false }
      ]
    }
  ]
}
```

---

## 🏥 Health Check

### Server Health

```http
GET /health
```

**Response (200):**
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

---

## 📊 Response Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 429 | Too Many Requests (Rate Limited) |
| 500 | Internal Server Error |

---

## 🔒 Rate Limiting

- **Limit**: 100 requests per 15 minutes per IP
- **Headers**: 
  - `X-RateLimit-Limit`: Request limit
  - `X-RateLimit-Remaining`: Requests remaining
  - `X-RateLimit-Reset`: Time when limit resets

---

## 💡 Pro Tips

### Caching
- Weather data is cached for 10 minutes
- Use cached data when available to reduce API calls

### Best Practices
- Store JWT token securely (httpOnly cookie recommended)
- Refresh JWT token before expiration (7 days)
- Handle rate limits gracefully with exponential backoff
- Use travel score to compare destinations objectively

### Performance
- Batch requests when possible
- Use compare endpoint instead of multiple city requests
- Request only needed data with query parameters

---

## 🐛 Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": "Error message here",
  "stack": "Stack trace (development only)"
}
```

---

## 📝 Example Usage

### Complete Trip Planning Flow

```javascript
// 1. User logs in
const loginResponse = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});
const { token } = await loginResponse.json();

// 2. Get recommendations
const recommendations = await fetch(
  '/api/analytics/recommendations?climate=warm&activities=beach'
);

// 3. Compare top cities
const comparison = await fetch(
  '/api/analytics/compare?cities=Miami,Barcelona,Dubai'
);

// 4. Get detailed analysis
const analysis = await fetch('/api/analytics/city/Barcelona');

// 5. Generate packing list
const packing = await fetch(
  '/api/analytics/packing/Barcelona?duration=7&activities=beach,culture'
);

// 6. Create trip
const trip = await fetch('/api/trips', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': token
  },
  body: JSON.stringify({
    city: 'Barcelona',
    startDate: '2026-07-01',
    endDate: '2026-07-08'
  })
});
```

---

## 🚀 SDK / Client Libraries

Coming soon:
- JavaScript/TypeScript SDK
- Python SDK
- React Hooks Library

---

## 📞 Support

- Documentation: [GitHub Wiki](https://github.com/yourusername/weathertravel/wiki)
- Issues: [GitHub Issues](https://github.com/yourusername/weathertravel/issues)
- Email: support@weathertravel.com

---

## 📜 License

MIT License - see LICENSE file
