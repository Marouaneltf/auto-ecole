import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { listMedia, uploadMedia, deleteMedia, upload, getMediaById } from '../controllers/MediaController';

const router = Router();

// Public list
router.get('/', listMedia);
router.get('/:id', getMediaById);

// Protected upload/delete
router.post('/', authenticateToken, upload.single('file'), uploadMedia);
router.delete('/:id', authenticateToken, deleteMedia);

export default router;
