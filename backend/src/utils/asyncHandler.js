// Express 5 forwards rejected promises to the error handler automatically.
// This wrapper keeps that behaviour explicit and works if you downgrade to Express 4.
export const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
