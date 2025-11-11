import express from 'express';
import cors from 'cors';
import { chromium } from 'playwright';
import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const app = express();
const PORT = process.env.PORT || process.env.SCREENSHOT_SERVICE_PORT || 3001;

app.use(cors());
app.use(express.json());

const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 20;

const ScreenshotRequestSchema = z.object({
  url: z.string().url('Invalid URL format').refine(
    (url) => {
      try {
        const parsed = new URL(url);
        return ['http:', 'https:'].includes(parsed.protocol);
      } catch {
        return false;
      }
    },
    { message: 'URL must use http or https protocol' }
  ),
  viewport: z.object({
    width: z.number().int().min(320).max(3840).optional(),
    height: z.number().int().min(240).max(2160).optional(),
  }).optional(),
  timeout: z.number().int().min(5000).max(60000).optional(),
  fullPage: z.boolean().optional(),
});

function checkRateLimit(ip) {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetAt) {
    const resetAt = now + RATE_LIMIT_WINDOW_MS;
    rateLimitMap.set(ip, { count: 1, resetAt });
    return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - 1, resetAt };
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return { allowed: false, remaining: 0, resetAt: record.resetAt };
  }

  record.count++;
  return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - record.count, resetAt: record.resetAt };
}

setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitMap.entries()) {
    if (now > value.resetAt) {
      rateLimitMap.delete(key);
    }
  }
}, RATE_LIMIT_WINDOW_MS);

async function captureScreenshot(url, options = {}) {
  const {
    timeout = 30000,
    viewport = { width: 1920, height: 1080 },
    fullPage = false,
  } = options;

  let browser = null;

  try {
    browser = await chromium.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--disable-software-rasterizer',
        '--disable-extensions',
        '--disable-background-networking',
        '--disable-default-apps',
        '--disable-sync',
        '--disable-translate',
        '--hide-scrollbars',
        '--metrics-recording-only',
        '--mute-audio',
      ]
    });

    const context = await browser.newContext({
      viewport,
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      extraHTTPHeaders: {
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      },
      bypassCSP: true,
      ignoreHTTPSErrors: true,
    });

    const page = await context.newPage();
    page.setDefaultNavigationTimeout(timeout);
    page.setDefaultTimeout(timeout);

    const strategies = [
      { waitUntil: 'networkidle', timeout: Math.min(15000, timeout) },
      { waitUntil: 'load', timeout: Math.min(20000, timeout) },
      { waitUntil: 'domcontentloaded', timeout: Math.min(10000, timeout) },
    ];

    let navigationSuccess = false;
    let usedStrategy = null;

    for (const strategy of strategies) {
      try {
        await page.goto(url, strategy);
        navigationSuccess = true;
        usedStrategy = strategy.waitUntil;
        break;
      } catch (navError) {
        console.warn(`Navigation with ${strategy.waitUntil} failed, trying next...`);
        continue;
      }
    }

    if (!navigationSuccess) {
      throw new Error('All navigation strategies failed');
    }

    await page.waitForTimeout(2000);

    if (!fullPage) {
      await page.evaluate(() => {
        window.scrollTo(0, 0);
      });
    }

    const screenshotBuffer = await page.screenshot({
      type: 'png',
      fullPage,
    });

    const base64Screenshot = screenshotBuffer.toString('base64');

    return {
      screenshot: base64Screenshot,
      strategy: usedStrategy,
      size: {
        width: viewport.width,
        height: viewport.height,
      },
    };
  } finally {
    if (browser) {
      await browser.close().catch(console.error);
    }
  }
}

app.get('/', (req, res) => {
  res.json({ 
    service: 'screenshot-service',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/health',
      screenshot: 'POST /screenshot',
    }
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'screenshot-service', 
    version: '1.0.0',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  });
});

app.post('/screenshot', async (req, res) => {
  try {
    const ip = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.ip || 'unknown';
    const rateLimit = checkRateLimit(ip);

    if (!rateLimit.allowed) {
      return res.status(429).json({
        error: 'Rate limit exceeded. Please try again later.',
        retryAfter: Math.ceil((rateLimit.resetAt - Date.now()) / 1000),
        resetAt: rateLimit.resetAt,
      });
    }

    const validationResult = ScreenshotRequestSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      
      return res.status(400).json({
        error: 'Invalid request data',
        details: errors,
      });
    }

    const { url, viewport, timeout, fullPage } = validationResult.data;

    const startTime = Date.now();
    const result = await captureScreenshot(url, { viewport, timeout, fullPage });
    const duration = Date.now() - startTime;

    res.json({
      success: true,
      screenshot: result.screenshot,
      url: url,
      strategy: result.strategy,
      size: result.size,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Screenshot error:', error);

    if (error.message.includes('timeout') || error.message.includes('Timeout')) {
      return res.status(408).json({
        error: 'Website took too long to load. Please try again or try a different URL.',
        type: 'timeout',
      });
    }

    if (error.message.includes('net::ERR_NAME_NOT_RESOLVED') ||
        error.message.includes('net::ERR_CONNECTION_REFUSED') ||
        error.message.includes('net::ERR_CONNECTION_TIMED_OUT') ||
        error.message.includes('NS_ERROR_UNKNOWN_HOST')) {
      return res.status(400).json({
        error: 'Could not connect to the website. Please check the URL and try again.',
        type: 'connection_error',
      });
    }

    if (error.message.includes('SSL') ||
        error.message.includes('certificate') ||
        error.message.includes('ERR_CERT')) {
      return res.status(400).json({
        error: 'Website has SSL certificate issues.',
        type: 'ssl_error',
      });
    }

    if (error.message.includes('Navigation')) {
      return res.status(400).json({
        error: 'Failed to navigate to the website. The site may be down or blocking automated access.',
        type: 'navigation_error',
      });
    }

    res.status(500).json({
      error: 'Failed to capture screenshot. Please try again or contact support if the issue persists.',
      type: 'server_error',
    });
  }
});

app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    available: {
      health: 'GET /health',
      screenshot: 'POST /screenshot',
    }
  });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

app.listen(PORT, () => {
  console.log(`Screenshot service running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;

