import { Request, Response } from 'express';
import { getDashboardData as getDashboardDataService } from '../services/dashboard.service';

export const getDashboardData = (req: Request, res: Response) => {
  try {
    const { timeframe } = req.query;
    const data = getDashboardDataService(timeframe as string);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching dashboard data' });
  }
};
