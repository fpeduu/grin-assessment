import fs from 'fs';
import { Timeframe } from '../types';
import { getDashboardData, getPatientSentiment } from './dashboard.service';

jest.mock('fs');

const mockFs = fs as jest.Mocked<typeof fs>;

describe('Dashboard Service', () => {
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

  describe('getDashboardData', () => {
    test('should return dashboard data for all timeframe', () => {
      const result = getDashboardData('all');

      expect(result).toEqual({
        meetings: 3,
        brushing: 2,
        instructionsSent: 2,
        tasks: 2,
        timeSaved: 15,
        patientsSatisfaction: mockDataSet.patientsSatisfaction.patientsData,
        employeesSatisfaction: mockDataSet.employeesSatisfaction.employeesData,
        likes: 3,
      });
    });

    test('should filter data for yearly timeframe', () => {
      // Mock current date to be 2023-12-20
      const originalDate = global.Date;
      global.Date = class extends Date {
        constructor() {
          super('2023-12-20T10:00:00Z');
        }
      } as any;

      const result = getDashboardData(Timeframe.Yearly);

      expect(result.meetings).toBe(3);
      expect(result.brushing).toBe(2);
      expect(result.instructionsSent).toBe(2);
      expect(result.tasks).toBe(2);
      expect(result.likes).toBe(3);

      global.Date = originalDate;
    });

    test('should handle empty data arrays', () => {
      const emptyDataSet = {
        liveCalls: [],
        communication: [],
        tasks: [],
        likes: [],
        patientsSatisfaction: { patientsData: [] },
        employeesSatisfaction: { employeesData: [] },
      };

      mockFs.readFileSync.mockReturnValue(Buffer.from(JSON.stringify(emptyDataSet)));

      const result = getDashboardData('all');

      expect(result).toEqual({
        meetings: 0,
        brushing: 0,
        instructionsSent: 0,
        tasks: 0,
        timeSaved: 0,
        patientsSatisfaction: [],
        employeesSatisfaction: [],
        likes: 0,
      });
    });

    test('should handle missing data properties', () => {
      const incompleteDataSet = {
        liveCalls: [],
      };

      mockFs.readFileSync.mockReturnValue(Buffer.from(JSON.stringify(incompleteDataSet)));

      const result = getDashboardData('all');

      expect(result).toEqual({
        meetings: 0,
        brushing: 0,
        instructionsSent: 0,
        tasks: 0,
        timeSaved: 0,
        patientsSatisfaction: [],
        employeesSatisfaction: [],
        likes: 0,
      });
    });

    test('should handle invalid JSON data', () => {
      mockFs.readFileSync.mockReturnValue(Buffer.from('invalid json'));

      expect(() => getDashboardData('all')).toThrow();
    });

    test('should handle file read errors', () => {
      mockFs.readFileSync.mockImplementation(() => {
        throw new Error('File not found');
      });

      expect(() => getDashboardData('all')).toThrow('File not found');
    });

    test('should calculate time saved correctly', () => {
      const result = getDashboardData('all');

      expect(result.timeSaved).toBe(15);
    });

    test('should handle unknown timeframe', () => {
      const result = getDashboardData('unknown');

      // Should default to all time (no filtering)
      expect(result.meetings).toBe(3);
      expect(result.brushing).toBe(2);
      expect(result.instructionsSent).toBe(2);
    });

    test('should handle null timeframe', () => {
      const result = getDashboardData(null as any);

      expect(result.meetings).toBe(3);
      expect(result.brushing).toBe(2);
      expect(result.instructionsSent).toBe(2);
    });

    test('should handle undefined timeframe', () => {
      const result = getDashboardData(undefined as any);

      expect(result.meetings).toBe(3);
      expect(result.brushing).toBe(2);
      expect(result.instructionsSent).toBe(2);
    });
  });

  describe('getPatientSentiment', () => {
    test('should return paginated patient data', () => {
      const result = getPatientSentiment(1, 2);

      expect(result).toEqual({
        data: [
          { id: '1', name: 'John Doe', satisfaction: 'positive', lastCommunicationDate: '2023-01-01' },
          { id: '2', name: 'Jane Smith', satisfaction: 'neutral', lastCommunicationDate: '2023-01-02' },
        ],
        total: 3,
        page: 1,
        limit: 2,
      });
    });

    test('should filter by sentiment', () => {
      const result = getPatientSentiment(1, 10, 'positive');

      expect(result).toEqual({
        data: [
          { id: '1', name: 'John Doe', satisfaction: 'positive', lastCommunicationDate: '2023-01-01' },
        ],
        total: 1,
        page: 1,
        limit: 10,
      });
    });

    test('should handle second page', () => {
      const result = getPatientSentiment(2, 2);

      expect(result).toEqual({
        data: [
          { id: '3', name: 'Bob Johnson', satisfaction: 'negative', lastCommunicationDate: '2023-01-03' },
        ],
        total: 3,
        page: 2,
        limit: 2,
      });
    });

    test('should handle empty patient data', () => {
      const emptyDataSet = {
        ...mockDataSet,
        patientsSatisfaction: { patientsData: [] },
      };

      mockFs.readFileSync.mockReturnValue(Buffer.from(JSON.stringify(emptyDataSet)));

      const result = getPatientSentiment(1, 5);

      expect(result).toEqual({
        data: [],
        total: 0,
        page: 1,
        limit: 5,
      });
    });

    test('should handle missing patientsSatisfaction property', () => {
      const incompleteDataSet = {
        liveCalls: [],
        communication: [],
        tasks: [],
        likes: [],
        employeesSatisfaction: { employeesData: [] },
        // Missing patientsSatisfaction
      };

      mockFs.readFileSync.mockReturnValue(Buffer.from(JSON.stringify(incompleteDataSet)));

      const result = getPatientSentiment(1, 5);

      expect(result).toEqual({
        data: [],
        total: 0,
        page: 1,
        limit: 5,
      });
    });

    test('should handle page beyond available data', () => {
      const result = getPatientSentiment(10, 5);

      expect(result).toEqual({
        data: [],
        total: 3,
        page: 10,
        limit: 5,
      });
    });

    test('should handle zero limit', () => {
      const result = getPatientSentiment(1, 0);

      expect(result).toEqual({
        data: [],
        total: 3,
        page: 1,
        limit: 0,
      });
    });

    test('should handle negative page and limit', () => {
      const result = getPatientSentiment(-1, -5);

      expect(result).toEqual({
        data: [],
        total: 3,
        page: -1,
        limit: -5,
      });
    });

    test('should handle large page and limit values', () => {
      const result = getPatientSentiment(999999, 999999);

      expect(result).toEqual({
        data: [],
        total: 3,
        page: 999999,
        limit: 999999,
      });
    });

    test('should handle non-existent sentiment filter', () => {
      const result = getPatientSentiment(1, 10, 'non-existent');

      expect(result).toEqual({
        data: [],
        total: 0,
        page: 1,
        limit: 10,
      });
    });

    test('should handle case-sensitive sentiment filter', () => {
      const result = getPatientSentiment(1, 10, 'Positive'); // Capital P

      expect(result).toEqual({
        data: [],
        total: 0,
        page: 1,
        limit: 10,
      });
    });

    test('should handle special characters in sentiment filter', () => {
      const result = getPatientSentiment(1, 10, 'positive-neutral');

      expect(result).toEqual({
        data: [],
        total: 0,
        page: 1,
        limit: 10,
      });
    });

    test('should handle empty sentiment filter', () => {
      const result = getPatientSentiment(1, 10, '');

      expect(result).toEqual({
        data: [
          { id: '1', name: 'John Doe', satisfaction: 'positive', lastCommunicationDate: '2023-01-01' },
          { id: '2', name: 'Jane Smith', satisfaction: 'neutral', lastCommunicationDate: '2023-01-02' },
          { id: '3', name: 'Bob Johnson', satisfaction: 'negative', lastCommunicationDate: '2023-01-03' },
        ],
        total: 3,
        page: 1,
        limit: 10,
      });
    });

    test('should handle undefined sentiment filter', () => {
      const result = getPatientSentiment(1, 10, undefined);

      expect(result).toEqual({
        data: [
          { id: '1', name: 'John Doe', satisfaction: 'positive', lastCommunicationDate: '2023-01-01' },
          { id: '2', name: 'Jane Smith', satisfaction: 'neutral', lastCommunicationDate: '2023-01-02' },
          { id: '3', name: 'Bob Johnson', satisfaction: 'negative', lastCommunicationDate: '2023-01-03' },
        ],
        total: 3,
        page: 1,
        limit: 10,
      });
    });
  });
});
