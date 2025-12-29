import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { listContent, getContentByPageSection, upsertContent, deleteContent } from '../controllers/ContentController';

const router = Router();

router.get('/', listContent);
router.get('/:page/:section', getContentByPageSection);
router.post('/', authenticateToken, upsertContent);
router.put('/', authenticateToken, upsertContent);
router.delete('/:id', authenticateToken, deleteContent);

export default router;

