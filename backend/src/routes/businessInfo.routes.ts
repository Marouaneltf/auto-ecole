import { Router } from 'express';
import { getBusinessInfo, updateBusinessInfo } from '../controllers/BusinessInfoController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', getBusinessInfo);
router.put('/', authenticateToken, updateBusinessInfo);

export default router;
