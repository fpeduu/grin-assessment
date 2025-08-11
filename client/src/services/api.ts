import { DashboardData, Patient } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export const getDashboardData = async (
  timeframe: string,
): Promise<DashboardData> => {
  const response = await fetch(
    `${API_URL}/api/dashboard?timeframe=${timeframe}`,
  );
  if (!response.ok) {
    throw new Error('Failed to fetch dashboard data');
  }
  return response.json();
};

export const getPatientSentiment = async (
  page: number = 1,
  limit: number = 10,
  sentiment?: string,
): Promise<{ data: Patient[]; total: number }> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  if (sentiment) {
    params.append('sentiment', sentiment);
  }
  const response = await fetch(
    `${API_URL}/api/dashboard/sentiment/patients?${params.toString()}`,
  );
  if (!response.ok) {
    throw new Error('Failed to fetch patient sentiment');
  }
  return response.json();
};
