import express from 'express';
import request from 'supertest';
import { getDashboardData, getPatientSentiment } from '../controllers/dashboard.controller';
import dashboardRoutes from './dashboard.routes';

// Mock the controller functions
jest.mock('../controllers/dashboard.controller');

const mockGetDashboardData = getDashboardData as jest.Mock;
const mockGetPatientSentiment = getPatientSentiment as jest.Mock;

describe('Dashboard Routes', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use('/api/dashboard', dashboardRoutes);
    jest.clearAllMocks();
  });

  describe('GET /', () => {
    test('should call getDashboardData controller', async () => {
      const mockData = {
        meetings: 25,
        tasks: 150,
        brushing: 89,
        likes: 234,
        timeSaved: 125,
        instructionsSent: 67,
        patientsSatisfaction: [],
        employeesSatisfaction: [],
      };

      mockGetDashboardData.mockImplementation((req, res) => {
        res.json(mockData);
      });

      const response = await request(app)
        .get('/api/dashboard')
        .query({ timeframe: 'all' });

      expect(mockGetDashboardData).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockData);
    });

    test('should pass timeframe query parameter', async () => {
      mockGetDashboardData.mockImplementation((req, res) => {
        res.json({ timeframe: req.query.timeframe });
      });

      const response = await request(app)
        .get('/api/dashboard')
        .query({ timeframe: 'weekly' });

      expect(response.body.timeframe).toBe('weekly');
    });

    test('should handle missing timeframe parameter', async () => {
      mockGetDashboardData.mockImplementation((req, res) => {
        res.json({ timeframe: req.query.timeframe });
      });

      const response = await request(app)
        .get('/api/dashboard');

      expect(response.body.timeframe).toBeUndefined();
    });

    test('should handle multiple query parameters', async () => {
      mockGetDashboardData.mockImplementation((req, res) => {
        res.json({ query: req.query });
      });

      const response = await request(app)
        .get('/api/dashboard')
        .query({ timeframe: 'all', other: 'param' });

      expect(response.body.query).toEqual({
        timeframe: 'all',
        other: 'param',
      });
    });

    test('should handle controller errors', async () => {
      mockGetDashboardData.mockImplementation((req, res) => {
        res.status(500).json({ error: 'Internal server error' });
      });

      const response = await request(app)
        .get('/api/dashboard');

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Internal server error');
    });

    test('should handle empty response', async () => {
      mockGetDashboardData.mockImplementation((req, res) => {
        res.json({});
      });

      const response = await request(app)
        .get('/api/dashboard');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({});
    });

    test('should handle null response', async () => {
      mockGetDashboardData.mockImplementation((req, res) => {
        res.json(null);
      });

      const response = await request(app)
        .get('/api/dashboard');

      expect(response.status).toBe(200);
      expect(response.body).toBeNull();
    });

    test('should handle special characters in timeframe', async () => {
      mockGetDashboardData.mockImplementation((req, res) => {
        res.json({ timeframe: req.query.timeframe });
      });

      const response = await request(app)
        .get('/api/dashboard')
        .query({ timeframe: 'weekly-monthly' });

      expect(response.body.timeframe).toBe('weekly-monthly');
    });

    test('should handle very long timeframe values', async () => {
      const longTimeframe = 'a'.repeat(1000);
      mockGetDashboardData.mockImplementation((req, res) => {
        res.json({ timeframe: req.query.timeframe });
      });

      const response = await request(app)
        .get('/api/dashboard')
        .query({ timeframe: longTimeframe });

      expect(response.body.timeframe).toBe(longTimeframe);
    });
  });

  describe('GET /sentiment/patients', () => {
    test('should call getPatientSentiment controller', async () => {
      const mockData = {
        data: [
          { id: '1', name: 'John Doe', satisfaction: 'positive', lastCommunicationDate: '2023-01-01' },
        ],
        total: 1,
        page: 1,
        limit: 5,
      };

      mockGetPatientSentiment.mockImplementation((req, res) => {
        res.json(mockData);
      });

      const response = await request(app)
        .get('/api/dashboard/sentiment/patients')
        .query({ page: '1', limit: '5' });

      expect(mockGetPatientSentiment).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockData);
    });

    test('should pass page and limit parameters', async () => {
      mockGetPatientSentiment.mockImplementation((req, res) => {
        res.json({
          page: req.query.page,
          limit: req.query.limit,
        });
      });

      const response = await request(app)
        .get('/api/dashboard/sentiment/patients')
        .query({ page: '2', limit: '10' });

      expect(response.body.page).toBe('2');
      expect(response.body.limit).toBe('10');
    });

    test('should pass sentiment filter parameter', async () => {
      mockGetPatientSentiment.mockImplementation((req, res) => {
        res.json({ sentiment: req.query.sentiment });
      });

      const response = await request(app)
        .get('/api/dashboard/sentiment/patients')
        .query({ sentiment: 'positive' });

      expect(response.body.sentiment).toBe('positive');
    });

    test('should handle missing parameters', async () => {
      mockGetPatientSentiment.mockImplementation((req, res) => {
        res.json({
          page: req.query.page,
          limit: req.query.limit,
          sentiment: req.query.sentiment,
        });
      });

      const response = await request(app)
        .get('/api/dashboard/sentiment/patients');

      expect(response.body.page).toBeUndefined();
      expect(response.body.limit).toBeUndefined();
      expect(response.body.sentiment).toBeUndefined();
    });

    test('should handle invalid page and limit values', async () => {
      mockGetPatientSentiment.mockImplementation((req, res) => {
        res.json({
          page: req.query.page,
          limit: req.query.limit,
        });
      });

      const response = await request(app)
        .get('/api/dashboard/sentiment/patients')
        .query({ page: 'invalid', limit: 'also-invalid' });

      expect(response.body.page).toBe('invalid');
      expect(response.body.limit).toBe('also-invalid');
    });

    test('should handle zero values', async () => {
      mockGetPatientSentiment.mockImplementation((req, res) => {
        res.json({
          page: req.query.page,
          limit: req.query.limit,
        });
      });

      const response = await request(app)
        .get('/api/dashboard/sentiment/patients')
        .query({ page: '0', limit: '0' });

      expect(response.body.page).toBe('0');
      expect(response.body.limit).toBe('0');
    });

    test('should handle negative values', async () => {
      mockGetPatientSentiment.mockImplementation((req, res) => {
        res.json({
          page: req.query.page,
          limit: req.query.limit,
        });
      });

      const response = await request(app)
        .get('/api/dashboard/sentiment/patients')
        .query({ page: '-1', limit: '-5' });

      expect(response.body.page).toBe('-1');
      expect(response.body.limit).toBe('-5');
    });

    test('should handle large numbers', async () => {
      mockGetPatientSentiment.mockImplementation((req, res) => {
        res.json({
          page: req.query.page,
          limit: req.query.limit,
        });
      });

      const response = await request(app)
        .get('/api/dashboard/sentiment/patients')
        .query({ page: '999999', limit: '999999' });

      expect(response.body.page).toBe('999999');
      expect(response.body.limit).toBe('999999');
    });

    test('should handle special characters in sentiment filter', async () => {
      mockGetPatientSentiment.mockImplementation((req, res) => {
        res.json({ sentiment: req.query.sentiment });
      });

      const response = await request(app)
        .get('/api/dashboard/sentiment/patients')
        .query({ sentiment: 'positive-neutral' });

      expect(response.body.sentiment).toBe('positive-neutral');
    });

    test('should handle very long sentiment values', async () => {
      const longSentiment = 'a'.repeat(1000);
      mockGetPatientSentiment.mockImplementation((req, res) => {
        res.json({ sentiment: req.query.sentiment });
      });

      const response = await request(app)
        .get('/api/dashboard/sentiment/patients')
        .query({ sentiment: longSentiment });

      expect(response.body.sentiment).toBe(longSentiment);
    });

    test('should handle controller errors', async () => {
      mockGetPatientSentiment.mockImplementation((req, res) => {
        res.status(500).json({ error: 'Internal server error' });
      });

      const response = await request(app)
        .get('/api/dashboard/sentiment/patients');

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Internal server error');
    });

    test('should handle empty response', async () => {
      mockGetPatientSentiment.mockImplementation((req, res) => {
        res.json({ data: [], total: 0 });
      });

      const response = await request(app)
        .get('/api/dashboard/sentiment/patients');

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual([]);
      expect(response.body.total).toBe(0);
    });

    test('should handle multiple sentiment filters', async () => {
      mockGetPatientSentiment.mockImplementation((req, res) => {
        res.json({ sentiment: req.query.sentiment });
      });

      const response = await request(app)
        .get('/api/dashboard/sentiment/patients')
        .query({ sentiment: 'positive,neutral' });

      expect(response.body.sentiment).toBe('positive,neutral');
    });

    test('should handle decimal numbers in query parameters', async () => {
      mockGetPatientSentiment.mockImplementation((req, res) => {
        res.json({
          page: req.query.page,
          limit: req.query.limit,
        });
      });

      const response = await request(app)
        .get('/api/dashboard/sentiment/patients')
        .query({ page: '1.5', limit: '5.7' });

      expect(response.body.page).toBe('1.5');
      expect(response.body.limit).toBe('5.7');
    });
  });

  describe('Route not found', () => {
    test('should return 404 for non-existent routes', async () => {
      const response = await request(app)
        .get('/api/dashboard/non-existent');

      expect(response.status).toBe(404);
    });

    test('should return 404 for POST requests to GET routes', async () => {
      const response = await request(app)
        .post('/api/dashboard');

      expect(response.status).toBe(404);
    });

    test('should return 404 for PUT requests to GET routes', async () => {
      const response = await request(app)
        .put('/api/dashboard');

      expect(response.status).toBe(404);
    });

    test('should return 404 for DELETE requests to GET routes', async () => {
      const response = await request(app)
        .delete('/api/dashboard');

      expect(response.status).toBe(404);
    });
  });
});
