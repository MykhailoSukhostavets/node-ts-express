import { Router } from 'express';
import getEarliestSunrise from '../controllers/index.js';

export const index = Router();

index.get('/earliest', async (req, res) => {
  const earliestSunrise = await getEarliestSunrise();
  res.json(earliestSunrise);
});
