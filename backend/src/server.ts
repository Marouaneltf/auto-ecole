import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
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

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/business-info', businessInfoRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/content', contentRoutes);

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
