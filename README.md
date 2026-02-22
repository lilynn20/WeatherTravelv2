# WeatherTravel

A weather-based travel planning application. Search weather conditions for cities worldwide, save favorites, plan trips, and share itineraries.

## Features

- **Weather Search** - Get current weather and 5-day forecasts for any city
- **Geolocation** - Find weather for your current location
- **Favorites** - Save cities for quick access with weather stats
- **Trip Planning** - Create multi-city itineraries with travel dates
- **Trip Sharing** - Generate shareable links for your trips
- **Email Reminders** - Receive weather updates and packing suggestions before travel
- **Weather Alerts** - View active weather warnings for destinations
- **Dark Mode** - Toggle between light and dark themes

## Getting Started

### Requirements

- Node.js 16+
- MongoDB
- OpenWeatherMap API key

### Installation

```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

### Configuration

Create a `.env` file in the server folder:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
WEATHER_API_KEY=your_openweathermap_api_key
CLIENT_URL=http://localhost:5174
```

### Running

```bash
# Start server (from server folder)
npm run dev

# Start client (from client folder)
npm run dev
```

- Client: http://localhost:5174
- Server: http://localhost:5000

## Usage

1. **Search** - Enter a city name or use geolocation
2. **Save** - Pin cities to favorites for quick access
3. **Plan** - Create trips with dates and multiple destinations
4. **Share** - Generate a link to share your itinerary with others

## Account Features

Create an account to:
- Sync favorites across devices
- Save and manage trip itineraries
- Generate shareable trip links
- Set preferences (units, language, home city)

## License

MIT
