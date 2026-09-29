import { Router } from 'express';
import { listProjects } from '../controllers/projectController.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.get('/', asyncHandler(listProjects));

export default router;
