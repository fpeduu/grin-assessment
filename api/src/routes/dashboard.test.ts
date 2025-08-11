import request from 'supertest';
import app from '../index';

describe('Dashboard API', () => {
  describe('GET /api/dashboard', () => {
    it('should return dashboard data with a 200 status code', async () => {
      const res = await request(app).get('/api/dashboard?timeframe=all');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('meetings');
      expect(res.body).toHaveProperty('brushing');
      expect(res.body).toHaveProperty('instructionsSent');
      expect(res.body).toHaveProperty('tasks');
      expect(res.body).toHaveProperty('timeSaved');
      expect(res.body).toHaveProperty('patientsSatisfaction');
      expect(res.body).toHaveProperty('employeesSatisfaction');
      expect(res.body).toHaveProperty('likes');
    });
  });

  describe('GET /api/dashboard/sentiment/patients', () => {
    it('should return paginated patient sentiment data', async () => {
      const res = await request(app).get('/api/dashboard/sentiment/patients?page=1&limit=5');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('data');
      expect(res.body).toHaveProperty('total');
      expect(res.body).toHaveProperty('page', 1);
      expect(res.body).toHaveProperty('limit', 5);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should filter patient sentiment data', async () => {
      const res = await request(app).get('/api/dashboard/sentiment/patients?sentiment=positive');
      expect(res.statusCode).toEqual(200);
      res.body.data.forEach((patient: { satisfaction: string }) => {
        expect(patient.satisfaction).toEqual('positive');
      });
    });
  });
});
