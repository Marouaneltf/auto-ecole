import { Request, Response } from 'express';
import BusinessInfo from '../models/BusinessInfo';

export const getBusinessInfo = async (req: Request, res: Response) => {
  try {
    const info = await BusinessInfo.findOne();
    if (!info) {
      return res.status(404).json({ message: 'Business info not found' });
    }
    res.json(info);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching business info', error });
  }
};

export const updateBusinessInfo = async (req: Request, res: Response) => {
  try {
    const info = await BusinessInfo.findOne();
    if (!info) {
      // Create if not exists (should be seeded though)
      const newInfo = await BusinessInfo.create(req.body);
      return res.json(newInfo);
    }
    
    await info.update(req.body);
    res.json(info);
  } catch (error) {
    res.status(500).json({ message: 'Error updating business info', error });
  }
};
