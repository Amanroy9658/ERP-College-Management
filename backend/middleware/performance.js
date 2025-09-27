const morgan = require('morgan');
const compression = require('compression');

// Custom morgan token for response time
morgan.token('response-time', (req, res) => {
  if (!req._startTime || !res._startTime) {
    return '';
  }
  const ms = res._startTime - req._startTime;
  return ms.toFixed(3);
});

// Custom morgan format
const morganFormat = ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time ms';

// Performance monitoring middleware
const performanceMiddleware = (app) => {
  // Request logging
  app.use(morgan(morganFormat, {
    skip: (req, res) => {
      // Skip logging for health checks and static files
      return req.url === '/api/health' || req.url.startsWith('/uploads/');
    }
  }));

  // Compression middleware
  app.use(compression({
    level: 6,
    threshold: 1024, // Only compress responses larger than 1KB
    filter: (req, res) => {
      if (req.headers['x-no-compression']) {
        return false;
      }
      return compression.filter(req, res);
    }
  }));

  // Response time tracking
  app.use((req, res, next) => {
    req._startTime = Date.now();
    res._startTime = Date.now();
    next();
  });

  // Memory usage monitoring
  app.use((req, res, next) => {
    const memUsage = process.memoryUsage();
    res.set('X-Memory-Usage', JSON.stringify({
      rss: Math.round(memUsage.rss / 1024 / 1024) + ' MB',
      heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024) + ' MB',
      heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024) + ' MB',
      external: Math.round(memUsage.external / 1024 / 1024) + ' MB'
    }));
    next();
  });
};

// Performance metrics collection
class PerformanceMetrics {
  constructor() {
    this.metrics = {
      requests: 0,
      errors: 0,
      responseTimes: [],
      memoryUsage: [],
      startTime: Date.now()
    };
  }

  recordRequest(responseTime) {
    this.metrics.requests++;
    this.metrics.responseTimes.push(responseTime);
    
    // Keep only last 1000 response times
    if (this.metrics.responseTimes.length > 1000) {
      this.metrics.responseTimes.shift();
    }
  }

  recordError() {
    this.metrics.errors++;
  }

  recordMemoryUsage() {
    const memUsage = process.memoryUsage();
    this.metrics.memoryUsage.push({
      timestamp: Date.now(),
      rss: memUsage.rss,
      heapTotal: memUsage.heapTotal,
      heapUsed: memUsage.heapUsed,
      external: memUsage.external
    });

    // Keep only last 100 memory readings
    if (this.metrics.memoryUsage.length > 100) {
      this.metrics.memoryUsage.shift();
    }
  }

  getMetrics() {
    const avgResponseTime = this.metrics.responseTimes.length > 0
      ? this.metrics.responseTimes.reduce((a, b) => a + b, 0) / this.metrics.responseTimes.length
      : 0;

    const uptime = Date.now() - this.metrics.startTime;

    return {
      ...this.metrics,
      averageResponseTime: Math.round(avgResponseTime * 100) / 100,
      uptime: Math.round(uptime / 1000), // in seconds
      errorRate: this.metrics.requests > 0 
        ? Math.round((this.metrics.errors / this.metrics.requests) * 100 * 100) / 100
        : 0
    };
  }

  reset() {
    this.metrics = {
      requests: 0,
      errors: 0,
      responseTimes: [],
      memoryUsage: [],
      startTime: Date.now()
    };
  }
}

// Global metrics instance
const performanceMetrics = new PerformanceMetrics();

// Record metrics middleware
const recordMetrics = (req, res, next) => {
  const startTime = Date.now();
  
  res.on('finish', () => {
    const responseTime = Date.now() - startTime;
    performanceMetrics.recordRequest(responseTime);
    
    if (res.statusCode >= 400) {
      performanceMetrics.recordError();
    }
  });

  next();
};

// Memory usage recording (every 30 seconds)
setInterval(() => {
  performanceMetrics.recordMemoryUsage();
}, 30000);

module.exports = {
  performanceMiddleware,
  performanceMetrics,
  recordMetrics
};
