import fs from 'fs';
import request from 'supertest';
import app from './index';

jest.mock('fs');

const mockFs = fs as jest.Mocked<typeof fs>;

describe('API Integration Tests', () => {
  const mockDataSet = {
    liveCalls: [
      { createdAt: '2023-12-01T10:00:00Z' },
      { createdAt: '2023-12-15T10:00:00Z' },
      { createdAt: '2023-11-01T10:00:00Z' },
    ],
    communication: [
      { type: 'brushing', createdAt: '2023-12-01T10:00:00Z' },
      { type: 'instructions', createdAt: '2023-12-15T10:00:00Z' },
      { type: 'brushing', createdAt: '2023-11-01T10:00:00Z' },
      { type: 'instructions', createdAt: '2023-11-15T10:00:00Z' },
    ],
    tasks: [
      { createdAt: '2023-12-01T10:00:00Z' },
      { createdAt: '2023-12-15T10:00:00Z' },
    ],
    likes: [
      { createdAt: '2023-12-01T10:00:00Z' },
      { createdAt: '2023-12-15T10:00:00Z' },
      { createdAt: '2023-11-01T10:00:00Z' },
    ],
    patientsSatisfaction: {
      patientsData: [
        { id: '1', name: 'John Doe', satisfaction: 'positive', lastCommunicationDate: '2023-01-01' },
        { id: '2', name: 'Jane Smith', satisfaction: 'neutral', lastCommunicationDate: '2023-01-02' },
        { id: '3', name: 'Bob Johnson', satisfaction: 'negative', lastCommunicationDate: '2023-01-03' },
        { id: '4', name: 'Alice Brown', satisfaction: 'positive', lastCommunicationDate: '2023-01-04' },
        { id: '5', name: 'Charlie Wilson', satisfaction: 'neutral', lastCommunicationDate: '2023-01-05' },
      ],
    },
    employeesSatisfaction: {
      employeesData: [
        { id: '1', name: 'Alice Brown', satisfaction: 'positive', lastCommunicationDate: '2023-01-01' },
        { id: '2', name: 'Charlie Wilson', satisfaction: 'positive', lastCommunicationDate: '2023-01-02' },
        { id: '3', name: 'Diana Davis', satisfaction: 'neutral', lastCommunicationDate: '2023-01-03' },
      ],
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockFs.readFileSync.mockReturnValue(Buffer.from(JSON.stringify(mockDataSet)));
  });

  describe('GET /api/dashboard', () => {
    test('should return complete dashboard data', async () => {
      const response = await request(app)
        .get('/api/dashboard')
        .query({ timeframe: 'all' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('meetings');
      expect(response.body).toHaveProperty('tasks');
      expect(response.body).toHaveProperty('brushing');
      expect(response.body).toHaveProperty('likes');
      expect(response.body).toHaveProperty('timeSaved');
      expect(response.body).toHaveProperty('instructionsSent');
      expect(response.body).toHaveProperty('patientsSatisfaction');
      expect(response.body).toHaveProperty('employeesSatisfaction');

      expect(response.body.meetings).toBe(3);
      expect(response.body.tasks).toBe(2);
      expect(response.body.brushing).toBe(2);
      expect(response.body.likes).toBe(3);
      expect(response.body.timeSaved).toBe(15);
      expect(response.body.instructionsSent).toBe(2);
      expect(response.body.patientsSatisfaction).toHaveLength(5);
      expect(response.body.employeesSatisfaction).toHaveLength(3);
    });

    test('should handle missing timeframe parameter', async () => {
      const response = await request(app)
        .get('/api/dashboard');

      expect(response.status).toBe(200);
      expect(response.body.meetings).toBe(3);
    });

    test('should handle invalid timeframe parameter', async () => {
      const response = await request(app)
        .get('/api/dashboard')
        .query({ timeframe: 'invalid' });

      expect(response.status).toBe(200);
      expect(response.body.meetings).toBe(3);
    });

    test('should handle file read errors gracefully', async () => {
      mockFs.readFileSync.mockImplementation(() => {
        throw new Error('File not found');
      });

      const response = await request(app)
        .get('/api/dashboard');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('message');
    });

    test('should handle invalid JSON data gracefully', async () => {
      mockFs.readFileSync.mockReturnValue(Buffer.from('invalid json'));

      const response = await request(app)
        .get('/api/dashboard');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('GET /api/dashboard/sentiment/patients', () => {
    test('should return paginated patient data', async () => {
      const response = await request(app)
        .get('/api/dashboard/sentiment/patients')
        .query({ page: '1', limit: '3' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('total');
      expect(response.body).toHaveProperty('page');
      expect(response.body).toHaveProperty('limit');

      expect(response.body.data).toHaveLength(3);
      expect(response.body.total).toBe(5);
      expect(response.body.page).toBe(1);
      expect(response.body.limit).toBe(3);
    });

    test('should filter by positive sentiment', async () => {
      const response = await request(app)
        .get('/api/dashboard/sentiment/patients')
        .query({ sentiment: 'positive' });

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.total).toBe(2);

      response.body.data.forEach((patient: any) => {
        expect(patient.satisfaction).toBe('positive');
      });
    });

    test('should filter by neutral sentiment', async () => {
      const response = await request(app)
        .get('/api/dashboard/sentiment/patients')
        .query({ sentiment: 'neutral' });

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.total).toBe(2);

      response.body.data.forEach((patient: any) => {
        expect(patient.satisfaction).toBe('neutral');
      });
    });

    test('should filter by negative sentiment', async () => {
      const response = await request(app)
        .get('/api/dashboard/sentiment/patients')
        .query({ sentiment: 'negative' });

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.total).toBe(1);

      response.body.data.forEach((patient: any) => {
        expect(patient.satisfaction).toBe('negative');
      });
    });

    test('should handle second page', async () => {
      const response = await request(app)
        .get('/api/dashboard/sentiment/patients')
        .query({ page: '2', limit: '2' });

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.total).toBe(5);
      expect(response.body.page).toBe(2);
      expect(response.body.limit).toBe(2);
    });

    test('should handle page beyond available data', async () => {
      const response = await request(app)
        .get('/api/dashboard/sentiment/patients')
        .query({ page: '10', limit: '5' });

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(0);
      expect(response.body.total).toBe(5);
      expect(response.body.page).toBe(10);
    });

    test('should use default pagination when parameters are missing', async () => {
      const response = await request(app)
        .get('/api/dashboard/sentiment/patients');

      expect(response.status).toBe(200);
      expect(response.body.page).toBe(1);
      expect(response.body.limit).toBe(10);
    });

    test('should handle non-existent sentiment filter', async () => {
      const response = await request(app)
        .get('/api/dashboard/sentiment/patients')
        .query({ sentiment: 'non-existent' });

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(0);
      expect(response.body.total).toBe(0);
    });

    test('should handle case-sensitive sentiment filter', async () => {
      const response = await request(app)
        .get('/api/dashboard/sentiment/patients')
        .query({ sentiment: 'Positive' });

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(0);
      expect(response.body.total).toBe(0);
    });

    test('should handle empty sentiment filter', async () => {
      const response = await request(app)
        .get('/api/dashboard/sentiment/patients')
        .query({ sentiment: '' });

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(5);
      expect(response.body.total).toBe(5);
    });
  });

  describe('Error handling', () => {
    test('should return 404 for non-existent routes', async () => {
      const response = await request(app)
        .get('/api/non-existent');

      expect(response.status).toBe(404);
    });

    test('should return 404 for non-existent dashboard routes', async () => {
      const response = await request(app)
        .get('/api/dashboard/non-existent');

      expect(response.status).toBe(404);
    });

    test('should handle CORS preflight requests', async () => {
      const response = await request(app)
        .options('/api/dashboard')
        .set('Origin', 'http://localhost:3000')
        .set('Access-Control-Request-Method', 'GET');

      expect(response.status).toBe(204);
    });

    test('should handle malformed JSON in request body', async () => {
      const response = await request(app)
        .post('/api/dashboard')
        .set('Content-Type', 'application/json')
        .send('invalid json');

      expect(response.status).toBe(400);
    });
  });

  describe('Data consistency', () => {
    test('should maintain data consistency across multiple requests', async () => {
      const response1 = await request(app)
        .get('/api/dashboard')
        .query({ timeframe: 'all' });

      const response2 = await request(app)
        .get('/api/dashboard')
        .query({ timeframe: 'all' });

      expect(response1.body).toEqual(response2.body);
    });

    test('should return consistent patient data across pages', async () => {
      const response1 = await request(app)
        .get('/api/dashboard/sentiment/patients')
        .query({ page: '1', limit: '2' });

      const response2 = await request(app)
        .get('/api/dashboard/sentiment/patients')
        .query({ page: '2', limit: '2' });

      const response3 = await request(app)
        .get('/api/dashboard/sentiment/patients')
        .query({ page: '3', limit: '2' });

      expect(response1.body.total).toBe(5);
      expect(response2.body.total).toBe(5);
      expect(response3.body.total).toBe(5);

      const allPatients = [
        ...response1.body.data,
        ...response2.body.data,
        ...response3.body.data,
      ];
      const uniquePatients = new Set(allPatients.map((p: any) => p.id));
      expect(uniquePatients.size).toBe(5);
    });
  });
});
