# Weather Travel - Quick Reference Guide

## 🚀 Quick Commands

### Development
```bash
# Start backend (development)
cd server && npm run dev

# Start frontend (development)
cd client && npm run dev

# Run both with Docker
docker-compose up -d
```

### Docker
```bash
# Build and start all services
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Production deployment
docker-compose -f docker-compose.prod.yml up -d --build
```

### Database
```bash
# Backup MongoDB
docker-compose exec mongodb mongodump --out /data/backup

# Restore MongoDB
docker-compose exec mongodb mongorestore /data/backup

# Access MongoDB shell
docker-compose exec mongodb mongosh
```

---

## 📡 API Quick Reference

### Base URLs
- Development: `http://localhost:5000/api`
- Production: `https://your-domain.com/api`

### Authentication
```bash
# Register
POST /api/auth/register
Body: { email, password, name }

# Login
POST /api/auth/login
Body: { email, password }
Response: { token, user }
```

### Weather & Analytics
```bash
# Get weather
GET /api/weather/:city

# AI recommendations
GET /api/analytics/recommendations?climate=warm&activities=beach,hiking

# Detailed analysis
GET /api/analytics/city/:city

# Compare cities
GET /api/analytics/compare?cities=Paris,London,Rome

# 5-day forecast
GET /api/analytics/forecast/:city

# Packing list
GET /api/analytics/packing/:city?duration=7&activities=beach
```

### Trips (Auth Required)
```bash
# Create trip
POST /api/trips
Headers: { Authorization: token }
Body: { city, startDate, endDate, notes }

# Get trips
GET /api/trips
Headers: { Authorization: token }

# Delete trip
DELETE /api/trips/:id
Headers: { Authorization: token }
```

---

## 🔑 Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/weathertravel
JWT_SECRET=your_jwt_secret_key
WEATHER_API_KEY=your_openweather_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
```

### Docker (.env)
```env
MONGO_ROOT_USER=admin
MONGO_ROOT_PASSWORD=secure_password
JWT_SECRET=your_jwt_secret
WEATHER_API_KEY=your_api_key
EMAIL_USER=your_email
EMAIL_PASS=your_password
REDIS_PASSWORD=redis_password
```

---

## 📁 Important Files

### Configuration
- `server/.env` - Backend environment variables
- `server/config/db.js` - Database configuration
- `docker-compose.yml` - Docker services (development)
- `docker-compose.prod.yml` - Docker services (production)

### Core Services
- `server/services/recommendationService.js` - AI recommendations
- `server/services/packingService.js` - Smart packing generator
- `server/services/cacheService.js` - Caching layer
- `server/services/emailService.js` - Email notifications

### Routes
- `server/routes/authRoutes.js` - Authentication endpoints
- `server/routes/weatherRoutes.js` - Weather endpoints
- `server/routes/analyticsRoutes.js` - AI analytics endpoints
- `server/routes/tripRoutes.js` - Trip management
- `server/routes/favoriteRoutes.js` - Favorites management

### Controllers
- `server/controllers/authController.js` - Auth logic
- `server/controllers/analyticsController.js` - Analytics logic

---

## 🧪 Testing

### Backend
```bash
cd server
npm test                  # Run all tests
npm run test:watch        # Watch mode
npm run test:coverage     # Coverage report
```

### Frontend
```bash
cd client
npm test                  # Run all tests
npm run test:ui          # UI mode
npm run test:coverage    # Coverage report
```

---

## 🐛 Troubleshooting

### Common Issues

**Port Already in Use**
```bash
# Find and kill process
lsof -ti:5000 | xargs kill -9  # Mac/Linux
netstat -ano | findstr :5000   # Windows
```

**MongoDB Connection Error**
```bash
# Check if MongoDB is running
docker-compose ps
# Restart MongoDB
docker-compose restart mongodb
```

**Docker Build Fails**
```bash
# Clean build
docker-compose down -v
docker system prune -af
docker-compose up -d --build
```

**JWT Token Invalid**
- Check if JWT_SECRET is set in .env
- Ensure token hasn't expired (7 days)
- Verify token format in Authorization header

---

## 📊 Scoring Algorithm

### Travel Score Components
- **Temperature** (35%): Compared to user preferences
- **Humidity** (20%): Lower is better
- **Wind Speed** (15%): Calmer is better
- **Cloudiness** (15%): Less clouds is better
- **Precipitation** (15%): No rain is best

### Score Ranges
- **9-10**: Perfect conditions
- **8-9**: Excellent conditions
- **7-8**: Very good conditions
- **6-7**: Good conditions
- **5-6**: Acceptable conditions
- **< 5**: Below average conditions

---

## 🎒 Packing Categories

### Temperature-Based Clothing
- **Hot** (30°C+): Light summer wear
- **Warm** (20-30°C): Casual comfortable
- **Mild** (10-20°C): Layers and light jacket
- **Cool** (0-10°C): Warm clothes
- **Cold** (<0°C): Winter gear

### Activity-Based Gear
- **Beach**: Swimwear, sunscreen, towels
- **Hiking**: Boots, backpack, first aid
- **Business**: Formal wear, laptop
- **Adventure**: Sturdy gear, quick-dry
- **Culture**: Walking shoes, camera

---

## 🔐 Security Best Practices

### Do's ✅
- Use strong JWT_SECRET (32+ characters)
- Store tokens in httpOnly cookies
- Use HTTPS in production
- Enable rate limiting
- Validate all inputs
- Use environment variables for secrets
- Regular security updates
- Implement proper CORS

### Don'ts ❌
- Don't commit .env files
- Don't use weak passwords
- Don't expose API keys in frontend
- Don't skip input validation
- Don't ignore security warnings
- Don't use default credentials

---

## 📈 Performance Tips

### Backend Optimization
- Enable caching for repeated requests
- Use database indexing
- Implement pagination for large datasets
- Use connection pooling
- Compress responses with gzip
- Monitor with APM tools

### Frontend Optimization
- Code splitting and lazy loading
- Image optimization
- Debounce API calls
- Use React.memo for expensive components
- Implement virtual scrolling for lists
- Bundle size optimization

---

## 🚢 Deployment Checklist

Before deploying to production:

- [ ] Update all dependencies
- [ ] Run security audit (`npm audit`)
- [ ] Test all API endpoints
- [ ] Verify environment variables
- [ ] Enable HTTPS/SSL
- [ ] Configure proper CORS
- [ ] Set up monitoring
- [ ] Configure backups
- [ ] Test error handling
- [ ] Load testing
- [ ] Review logs and alerts
- [ ] Update documentation

---

## 📞 Support Resources

- **Documentation**: `/SETUP.md`, `/API_DOCUMENTATION.md`, `/DEPLOYMENT.md`
- **Issues**: GitHub Issues
- **API Health**: `/health` endpoint
- **Logs**: `docker-compose logs -f`

---

## 💡 Pro Tips

1. **Use cached data**: Weather data is cached for 10 minutes
2. **Batch requests**: Use compare endpoint instead of multiple calls
3. **Proper error handling**: Always check response status
4. **Rate limiting**: Implement exponential backoff
5. **Token refresh**: Refresh JWT before expiration
6. **Monitor performance**: Use health checks regularly
7. **Backup regularly**: Automated database backups
8. **Version control**: Tag releases properly

---

## 📅 Maintenance Schedule

### Daily
- Monitor error logs
- Check server health
- Review rate limit hits

### Weekly
- Database backup verification
- Security updates check
- Performance metrics review

### Monthly
- Full security audit
- Dependency updates
- Load testing
- Documentation review

---

**Last Updated**: February 22, 2026

**Version**: 1.0.0
