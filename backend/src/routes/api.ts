import { Router } from 'express';
import {
  submitRequirement,
  healthCheck,
} from '../controllers/requirementController';

const router = Router();

router.get('/health', healthCheck);
router.post('/requirements', submitRequirement);

export default router;
