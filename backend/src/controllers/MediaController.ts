import { Request, Response } from 'express';
import Media from '../models/Media';
import fs from 'fs';
import path from 'path';

class MediaController {
  async upload(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const { filename, originalname, mimetype, size, path: filePath } = req.file;

      const media = await Media.create({
        filename: filename,
        original_name: originalname,
        mime_type: mimetype,
        file_size: size,
        path: filePath, // Storing relative path usually better, but keeping simple
        alt_text: req.body.alt_text || '',
      });

      // Construct public URL
      const mediaJson = media.toJSON();
      const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
      
      // Assuming 'uploads' is served statically at /uploads
      // Note: req.file.path uses backslashes on Windows, we need forward slashes for URL
      const relativePath = filePath.split(path.sep).pop(); 
      const url = `${baseUrl}/uploads/${relativePath}`;

      res.status(201).json({ ...mediaJson, url });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ message: 'Error uploading file', error });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const mediaItems = await Media.findAll({
        order: [['created_at', 'DESC']],
      });

      const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
      
      const mediaWithUrls = mediaItems.map(item => {
        const itemJson = item.toJSON();
        // Assuming filename is enough since we serve /uploads folder
        const url = `${baseUrl}/uploads/${item.filename}`;
        return { ...itemJson, url };
      });

      res.json(mediaWithUrls);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching media', error });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const media = await Media.findByPk(id);

      if (!media) {
        return res.status(404).json({ message: 'Media not found' });
      }

      // Delete file from filesystem
      const filePath = media.path;
      // Resolve absolute path if stored relatively or strictly use what's in DB if it works
      // Since multer stores the path where it saved it (likely relative to cwd or absolute), 
      // we try to delete it directly.
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      await media.destroy();

      res.json({ message: 'Media deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting media', error });
    }
  }
}

export default new MediaController();
