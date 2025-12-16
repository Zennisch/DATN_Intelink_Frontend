const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Add a simple proxy for web to forward /api to backend to avoid CORS in dev
config.server = config.server || {};
const originalEnhanceMiddleware = config.server.enhanceMiddleware;
config.server.enhanceMiddleware = (middleware, server) => {
	const enhanced = (req, res, next) => {
		// Only proxy API requests in web dev
		if (req.url.startsWith('/api')) {
			const target = process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:8080';
			console.log(`[Proxy] Forwarding ${req.url} to ${target}`);
			const url = new URL(req.url, target);

			// Rebuild request to target backend
			const http = require('http');
			const options = {
				method: req.method,
				headers: {
					...req.headers,
					host: new URL(target).host,
					origin: target,
				},
			};

			const proxyReq = http.request(url, options, (proxyRes) => {
				// Copy status and headers, include CORS headers for browser
				res.statusCode = proxyRes.statusCode || 500;
				Object.entries(proxyRes.headers).forEach(([k, v]) => {
					if (v !== undefined) res.setHeader(k, v);
				});
				res.setHeader('Access-Control-Allow-Origin', '*');
				res.setHeader('Access-Control-Allow-Credentials', 'true');
				res.setHeader('Access-Control-Allow-Headers', req.headers['access-control-request-headers'] || '*');
				res.setHeader('Access-Control-Allow-Methods', req.headers['access-control-request-method'] || 'GET,POST,PUT,PATCH,DELETE,OPTIONS');

				proxyRes.pipe(res);
			});

			proxyReq.on('error', (err) => {
				res.statusCode = 502;
				res.end(`Proxy error: ${err.message}`);
			});

			// Pipe body if present
			if (req.method !== 'GET' && req.method !== 'HEAD' && req.method !== 'OPTIONS') {
				req.pipe(proxyReq);
			} else {
				proxyReq.end();
			}

			return;
		}

		// Handle CORS preflight for API
		if (req.method === 'OPTIONS' && req.headers['access-control-request-method']) {
			res.setHeader('Access-Control-Allow-Origin', '*');
			res.setHeader('Access-Control-Allow-Credentials', 'true');
			res.setHeader('Access-Control-Allow-Headers', req.headers['access-control-request-headers'] || '*');
			res.setHeader('Access-Control-Allow-Methods', req.headers['access-control-request-method'] || 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
			res.statusCode = 204;
			res.end();
			return;
		}

		return (originalEnhanceMiddleware ? originalEnhanceMiddleware(middleware, server) : middleware)(req, res, next);
	};
	return enhanced;
};

module.exports = withNativeWind(config, { 
	input: './global.css',
	inlineRem: false,
});