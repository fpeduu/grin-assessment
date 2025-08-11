import { Request, Response } from 'express';
import {
  getDashboardData as getDashboardDataService,
  getPatientSentiment as getPatientSentimentService,
} from '../services/dashboard.service';

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

export const getPatientSentiment = (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const sentiment = req.query.sentiment as string | undefined;

    const data = getPatientSentimentService(page, limit, sentiment);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching patient sentiment data' });
  }
};
