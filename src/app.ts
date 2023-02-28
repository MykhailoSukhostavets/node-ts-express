import express from 'express';

// Routes
import { index } from './routes/index.js';

// Create Express server
export const app = express();

// Express configuration
app.set('port', process.env.PORT || 3000);
app.use('/api', index);
