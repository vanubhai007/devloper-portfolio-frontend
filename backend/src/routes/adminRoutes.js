import { Router } from 'express';
import {
  deleteMessage,
  getMessage,
  listMessages,
  login,
  me,
  setReadStatus,
  stats,
} from '../controllers/adminController.js';
import { protect } from '../middleware/auth.js';
import { loginLimiter } from '../middleware/rateLimiters.js';
import { validate, validateObjectId } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validateLogin, validateReadToggle } from '../utils/validators.js';

const router = Router();

router.post('/login', loginLimiter, validate(validateLogin), asyncHandler(login));

// Everything below requires a valid admin token.
router.use(asyncHandler(protect));

router.get('/me', me);
router.get('/stats', asyncHandler(stats));
router.get('/messages', asyncHandler(listMessages));
router.get('/messages/:id', validateObjectId(), asyncHandler(getMessage));
router.patch('/messages/:id/read', validateObjectId(), validate(validateReadToggle), asyncHandler(setReadStatus));
router.delete('/messages/:id', validateObjectId(), asyncHandler(deleteMessage));

export default router;
