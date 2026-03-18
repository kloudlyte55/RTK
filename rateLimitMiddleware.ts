// rateLimitMiddleware.ts

import rateLimit from 'express-rate-limit';

// Rate limiting middleware for password reset endpoints
const rateLimitMiddleware = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: 'Too many requests, please try again later.',
});

export default rateLimitMiddleware;
