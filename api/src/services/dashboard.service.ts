import fs from 'fs';
import path from 'path';
import { Communication, DataSet, Timeframe } from '../types';

const dbPath = path.resolve(__dirname, '../../db/DataSet.json');

const readData = (): DataSet => {
  const rawData = fs.readFileSync(dbPath);
  return JSON.parse(rawData.toString());
};

const getStartDate = (timeframe: string): Date => {
  const now = new Date();
  switch (timeframe) {
    case Timeframe.Weekly:
      return new Date(now.setDate(now.getDate() - 7));
    case Timeframe.Monthly:
      return new Date(now.setMonth(now.getMonth() - 1));
    case Timeframe.Yearly:
      return new Date(now.setFullYear(now.getFullYear() - 1));
    default:
      return new Date(0); // all time
  }
};

export const getDashboardData = (timeframe: string) => {
  const data = readData();
  const startDate = getStartDate(timeframe);

  const filterByDate = (item: { createdAt: string }) => new Date(item.createdAt) >= startDate;

  const liveCalls = (data.liveCalls || []).filter(filterByDate);
  const communications = (data.communication || []).filter(filterByDate);
  const tasks = (data.tasks || []).filter(filterByDate);
  const likes = (data.likes || []).filter(filterByDate);

  const meetings = liveCalls.length;
  const brushing = communications.filter((c: Communication) => c.type === 'brushing').length;
  const instructionsSent = communications.filter((c: Communication) => c.type === 'instructions').length;
  const timeSaved = meetings * 5;

  return {
    meetings,
    brushing,
    instructionsSent,
    tasks: tasks.length,
    timeSaved,
    patientsSatisfaction: data.patientsSatisfaction?.patientsData || [],
    employeesSatisfaction: data.employeesSatisfaction?.employeesData || [],
    likes: likes.length,
  };
};
