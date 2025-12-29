import { Request, Response } from 'express';
import ContactMessage from '../models/ContactMessage';

export const submitContact = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, message } = req.body;
    
    // Basic validation
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email and message are required' });
    }

    const newMessage = await ContactMessage.create({
      name,
      email,
      phone,
      message
    });

    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Contact error:', error);
    res.status(500).json({ message: 'Error submitting message', error });
  }
};
