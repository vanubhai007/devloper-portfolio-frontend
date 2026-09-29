import { Router } from 'express';
import { createContact } from '../controllers/contactController.js';
import { contactLimiter } from '../middleware/rateLimiters.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validateContact } from '../utils/validators.js';

const router = Router();

/** Flags submissions that filled the hidden honeypot field. */
const honeypot = (req, res, next) => {
  req.honeypotTriggered = typeof req.body?.website === 'string' && req.body.website.trim() !== '';
  next();
};

router.post('/', contactLimiter, honeypot, validate(validateContact), asyncHandler(createContact));

export default router;
