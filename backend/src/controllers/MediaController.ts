import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import Media from '../models/Media';

const uploadsDir = path.join(__dirname, '..', '..', 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const timestamp = Date.now();
    const safeOrig = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, `${timestamp}-${safeOrig}`);
  }
});

const fileFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type'));
  }
};

export const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 }, fileFilter });

export const listMedia = async (_req: Request, res: Response) => {
  try {
    const items = await Media.findAll({ order: [['created_at', 'DESC']] });
    const withUrl = items.map((m: any) => ({
      id: m.id,
      filename: m.filename,
      original_name: m.original_name,
      mime_type: m.mime_type,
      file_size: m.file_size,
      path: m.path,
      alt_text: m.alt_text,
      created_at: m.created_at,
      updated_at: m.updated_at,
      url: `/uploads/${path.basename(m.path)}`,
    }));
    res.json(withUrl);
  } catch (error) {
    res.status(500).json({ message: 'Error listing media', error });
  }
};

export const uploadMedia = async (req: Request, res: Response) => {
  try {
    const file = (req as any).file as Express.Multer.File;
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const record = await Media.create({
      filename: file.filename,
      original_name: file.originalname,
      mime_type: file.mimetype,
      file_size: file.size,
      path: path.join(uploadsDir, file.filename),
      alt_text: (req.body && req.body.alt_text) || null,
    });

    res.status(201).json({
      id: record.id,
      filename: record.filename,
      mime_type: record.mime_type,
      file_size: record.file_size,
      alt_text: record.alt_text,
      url: `/uploads/${file.filename}`,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading media', error });
  }
};

export const deleteMedia = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const item = await Media.findByPk(id);
    if (!item) {
      return res.status(404).json({ message: 'Media not found' });
    }
    const filePath = item.path;
    await item.destroy();
    try {
      if (filePath && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch {
      // Swallow file deletion errors to avoid blocking API
    }
    res.json({ message: 'Media deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting media', error });
  }
};

