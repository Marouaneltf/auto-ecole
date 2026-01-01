import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import sequelize from './config/database';

// Import models to ensure they are initialized
import './models/User';
import './models/BusinessInfo';
import './models/ServiceCategory';
import './models/Service';
import './models/Content';
import './models/Media';
import './models/ContactMessage';

import authRoutes from './routes/auth.routes';
import businessInfoRoutes from './routes/businessInfo.routes';
import serviceRoutes from './routes/service.routes';
import contactRoutes from './routes/contact.routes';
import contentRoutes from './routes/content.routes';
import mediaRoutes from './routes/media.routes';

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(
  '/uploads',
  (_req, res, next) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
  },
  express.static(path.join(__dirname, '..', '..', 'uploads'))
);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/business-info', businessInfoRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/media', mediaRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Auto-École API is running' });
});

// For Vercel, we export the app
export default app;
