import fs from 'fs';
import path from 'path';

const dbPath = path.resolve(__dirname, '../../db/DataSet.json');

const readData = () => {
  const rawData = fs.readFileSync(dbPath);
  return JSON.parse(rawData.toString());
};

export const getDashboardData = (timeframe: string) => {
  const data = readData();

  const now = new Date();
  let startDate: Date;

  switch (timeframe) {
    case 'weekly':
      startDate = new Date(now.setDate(now.getDate() - 7));
      break;
    case 'monthly':
      startDate = new Date(now.setMonth(now.getMonth() - 1));
      break;
    case 'yearly':
      startDate = new Date(now.setFullYear(now.getFullYear() - 1));
      break;
    default:
      startDate = new Date(0); // all time
  }

  const filterByDate = (item: { createdAt: string }) => new Date(item.createdAt) >= startDate;


  const liveCalls = (data.liveCalls || []).filter(filterByDate);
  const communications = (data.communication || []).filter(filterByDate);
  const tasks = (data.tasks || []).filter(filterByDate);
  const patientsSatisfaction = (data.patientsSatisfaction.patientsData || []);
  const employeesSatisfaction = (data.employeesSatisfaction.employeesData || []);

  const meetings = liveCalls.length;
  const brushing = communications.filter((c: any) => c.type === 'brushing').length;
  const instructionsSent = communications.filter((c: any) => c.type === 'instructions').length;
  const timeSaved = meetings * 5;

  return {
    meetings,
    brushing,
    instructionsSent,
    tasks: tasks.length,
    timeSaved,
    patientsSatisfaction,
    employeesSatisfaction,
  };
};
