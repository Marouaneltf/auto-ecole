import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { listMedia, uploadMedia, deleteMedia, upload } from '../controllers/MediaController';

const router = Router();

// Public list
router.get('/', listMedia);

// Protected upload/delete
router.post('/', authenticateToken, upload.single('file'), uploadMedia);
router.delete('/:id', authenticateToken, deleteMedia);

export default router;

