import "dotenv/config";
import express from "express";
import compression from "compression";
import type { Request, Response, NextFunction } from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerStripeWebhook } from "../stripeRouter";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Cache headers middleware for static assets (CDN-optimized)
  app.use((req: Request, res: Response, next: NextFunction) => {
    // Vary header for proper CDN caching with compression
    res.set('Vary', 'Accept-Encoding');

    // Cache versioned assets (with hash in filename) for 1 year
    if (req.path.match(/\.(js|css|woff2?|ttf|eot|svg|png|jpg|jpeg|gif|webp|ico)$/i)) {
      if (req.path.match(/\.[a-f0-9]{8,}\./i)) {
        // Versioned assets: 1 year browser + CDN cache (immutable)
        res.set('Cache-Control', 'public, max-age=31536000, immutable');
        res.set('Surrogate-Control', 'max-age=31536000'); // CDN edge cache
      } else {
        // Non-versioned static assets: 1 day browser + CDN cache
        res.set('Cache-Control', 'public, max-age=86400, stale-while-revalidate=3600');
        res.set('Surrogate-Control', 'max-age=86400');
      }
    }
    // Cache sitemap and robots.txt for 1 day
    else if (req.path.match(/\.(xml|txt)$/i)) {
      res.set('Cache-Control', 'public, max-age=86400');
      res.set('Surrogate-Control', 'max-age=86400');
    }
    // Cache HTML for 5 minutes on CDN, 1 hour in browser (stale-while-revalidate for instant loads)
    else if (req.path.endsWith('.html') || !req.path.includes('.')) {
      res.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=3600, stale-if-error=86400');
      res.set('Surrogate-Control', 'max-age=300'); // CDN refreshes every 5 min
    }
    // Don't cache API responses
    else if (req.path.startsWith('/api/')) {
      res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.set('Pragma', 'no-cache');
      res.set('Expires', '0');
    }
    next();
  });
  
  // Enable Gzip compression for all responses
  app.use(compression({
    level: 6, // Balance between compression ratio and CPU usage (0-9, default 6)
    threshold: 1024, // Only compress responses larger than 1KB
    filter: (req: any, res: any) => {
      // Don't compress if client doesn't support it
      if (req.headers['x-no-compression']) {
        return false;
      }
      // Use compression filter function
      return compression.filter(req, res);
    }
  }));
  // Register Stripe webhook BEFORE json body parser (needs raw body)
  registerStripeWebhook(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);
  // tRPC API with compression
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  
  // Log compression and caching status
  console.log("[Compression] Gzip compression enabled for responses > 1KB");
  console.log("[Caching] Browser cache headers configured for static assets");

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`[Server] Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
    console.log(`[Server] Compression middleware active | Gzip enabled for responses > 1KB`);
    console.log(`[Server] Browser caching enabled | Versioned assets: 1 year | HTML: 1 hour | API: no-cache`);
  });
}

startServer().catch((error) => {
  console.error("[Server] Failed to start:", error);
  process.exit(1);
});

// Cache header strategy:
// - Versioned assets (hash in filename): 1 year (immutable)
// - Non-versioned assets: 1 day
// - HTML: 1 hour (allows updates)
// - API responses: no-cache (always fresh)
