# Screenshot Service

Standalone Express.js microservice for capturing website screenshots using Playwright.

## Why Separate Service?

- ✅ **No timeout limits** - Runs as long as needed
- ✅ **Better performance** - Dedicated resources
- ✅ **Can be scaled independently** - Deploy on any platform
- ✅ **Reusable** - Can be used by multiple apps

## Setup

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Install Playwright Browsers

```bash
npx playwright install chromium
```

### 3. Create .env file

```bash
cp env.example .env
```

Edit `.env` and set your configuration.

### 4. Start the Service

**Development** (with auto-reload):
```bash
npm run dev
```

**Production**:
```bash
npm start
```

The service will run on `http://localhost:3001` by default.

## API Endpoints

### POST /screenshot

Captures a screenshot of a website.

**Request**:
```json
{
  "url": "https://example.com",
  "viewport": {
    "width": 1920,
    "height": 1080
  }
}
```

**Response** (Success):
```json
{
  "screenshot": "base64_encoded_png...",
  "url": "https://example.com",
  "strategy": "networkidle",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Response** (Error):
```json
{
  "error": "Error message here"
}
```

### GET /health

Health check endpoint.

**Response**:
```json
{
  "status": "ok",
  "service": "screenshot-service",
  "version": "1.0.0"
}
```

## Rate Limiting

- 20 requests per minute per IP
- Returns 429 status when exceeded
- Automatic cleanup of old rate limit records

## Deployment Options

### Option 1: Railway

1. Push to GitHub
2. Connect to Railway
3. Deploy from `server` directory
4. Railway will auto-detect and deploy

### Option 2: Fly.io

1. Install flyctl
2. Run `fly launch` in server directory
3. Deploy with `fly deploy`

### Option 3: DigitalOcean App Platform

1. Connect GitHub repo
2. Select `server` directory
3. Deploy as Node.js app

### Option 4: Self-hosted (VPS)

```bash
# On your server
git clone your-repo
cd server
npm install
npx playwright install chromium --with-deps
npm start

# Use PM2 for process management
npm install -g pm2
pm2 start index.js --name screenshot-service
pm2 save
```

## Environment Variables

- `SCREENSHOT_SERVICE_PORT` - Port number (default: 3001)
- `SERVICE_SECRET_KEY` - Optional API key for authentication

## Testing

```bash
# Test health endpoint
curl http://localhost:3001/health

# Test screenshot capture
curl -X POST http://localhost:3001/screenshot \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'
```

## Performance

- Average capture time: 5-10 seconds
- Memory usage: ~200-300MB per request
- Concurrent requests: Handled automatically

## Troubleshooting

### "Failed to launch browser"

Install system dependencies:
```bash
npx playwright install-deps chromium
```

### High memory usage

Reduce concurrent requests or increase server memory.

### Slow screenshots

Check your network connection and target website speed.

