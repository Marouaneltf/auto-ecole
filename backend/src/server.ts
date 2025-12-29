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
import './models/CmsPage';
import './models/CmsComponent';
import './models/CmsComponentField';

import authRoutes from './routes/auth.routes';
import businessInfoRoutes from './routes/businessInfo.routes';
import serviceRoutes from './routes/service.routes';
import contactRoutes from './routes/contact.routes';
import contentRoutes from './routes/content.routes';
import mediaRoutes from './routes/media.routes';
import cmsRoutes from './routes/cms.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors());
app.use(express.json());

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/business-info', businessInfoRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/cms', cmsRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Auto-École API is running' });
});

// Sync Database
sequelize.sync({ alter: true }).then(() => {
  console.log('Database synced');
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('Unable to connect to the database:', err);
});
