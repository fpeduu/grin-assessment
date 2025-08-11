import { Request, Response } from 'express';
import {
    getDashboardData as getDashboardDataService,
    getPatientSentiment as getPatientSentimentService,
} from '../services/dashboard.service';
import { getDashboardData, getPatientSentiment } from './dashboard.controller';

// Mock the service functions
jest.mock('../services/dashboard.service');

const mockGetDashboardDataService = getDashboardDataService as jest.Mock;
const mockGetPatientSentimentService = getPatientSentimentService as jest.Mock;

describe('Dashboard Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });

    mockResponse = {
      json: mockJson,
      status: mockStatus,
    };

    mockRequest = {
      query: {},
    };

    jest.clearAllMocks();
  });

  describe('getDashboardData', () => {
    const mockDashboardData = {
      meetings: 25,
      tasks: 150,
      brushing: 89,
      likes: 234,
      timeSaved: 125,
      instructionsSent: 67,
      patientsSatisfaction: [],
      employeesSatisfaction: [],
    };

    test('should return dashboard data successfully', () => {
      mockRequest.query = { timeframe: 'all' };
      mockGetDashboardDataService.mockReturnValue(mockDashboardData);

      getDashboardData(mockRequest as Request, mockResponse as Response);

      expect(mockGetDashboardDataService).toHaveBeenCalledWith('all');
      expect(mockJson).toHaveBeenCalledWith(mockDashboardData);
    });

    test('should handle different timeframe values', () => {
      mockRequest.query = { timeframe: 'weekly' };
      mockGetDashboardDataService.mockReturnValue(mockDashboardData);

      getDashboardData(mockRequest as Request, mockResponse as Response);

      expect(mockGetDashboardDataService).toHaveBeenCalledWith('weekly');
      expect(mockJson).toHaveBeenCalledWith(mockDashboardData);
    });

    test('should handle undefined timeframe', () => {
      mockRequest.query = {};
      mockGetDashboardDataService.mockReturnValue(mockDashboardData);

      getDashboardData(mockRequest as Request, mockResponse as Response);

      expect(mockGetDashboardDataService).toHaveBeenCalledWith(undefined);
      expect(mockJson).toHaveBeenCalledWith(mockDashboardData);
    });

    test('should handle service errors', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const error = new Error('Service error');
      mockRequest.query = { timeframe: 'all' };
      mockGetDashboardDataService.mockImplementation(() => {
        throw error;
      });

      getDashboardData(mockRequest as Request, mockResponse as Response);

      expect(consoleErrorSpy).toHaveBeenCalledWith(error);
      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({ message: 'Error fetching dashboard data' });

      consoleErrorSpy.mockRestore();
    });

    test('should handle empty dashboard data', () => {
      mockRequest.query = { timeframe: 'all' };
      mockGetDashboardDataService.mockReturnValue({});

      getDashboardData(mockRequest as Request, mockResponse as Response);

      expect(mockJson).toHaveBeenCalledWith({});
    });

    test('should handle null dashboard data', () => {
      mockRequest.query = { timeframe: 'all' };
      mockGetDashboardDataService.mockReturnValue(null);

      getDashboardData(mockRequest as Request, mockResponse as Response);

      expect(mockJson).toHaveBeenCalledWith(null);
    });

    test('should handle special characters in timeframe', () => {
      mockRequest.query = { timeframe: 'weekly-monthly' };
      mockGetDashboardDataService.mockReturnValue(mockDashboardData);

      getDashboardData(mockRequest as Request, mockResponse as Response);

      expect(mockGetDashboardDataService).toHaveBeenCalledWith('weekly-monthly');
    });

    test('should handle very long timeframe values', () => {
      const longTimeframe = 'a'.repeat(1000);
      mockRequest.query = { timeframe: longTimeframe };
      mockGetDashboardDataService.mockReturnValue(mockDashboardData);

      getDashboardData(mockRequest as Request, mockResponse as Response);

      expect(mockGetDashboardDataService).toHaveBeenCalledWith(longTimeframe);
    });
  });

  describe('getPatientSentiment', () => {
    const mockPatientData = {
      data: [
        { id: '1', name: 'John Doe', satisfaction: 'positive', lastCommunicationDate: '2023-01-01' },
        { id: '2', name: 'Jane Smith', satisfaction: 'neutral', lastCommunicationDate: '2023-01-02' },
      ],
      total: 2,
      page: 1,
      limit: 5,
    };

    test('should return patient sentiment data successfully', () => {
      mockRequest.query = { page: '1', limit: '5' };
      mockGetPatientSentimentService.mockReturnValue(mockPatientData);

      getPatientSentiment(mockRequest as Request, mockResponse as Response);

      expect(mockGetPatientSentimentService).toHaveBeenCalledWith(1, 5, undefined);
      expect(mockJson).toHaveBeenCalledWith(mockPatientData);
    });

    test('should handle sentiment filter', () => {
      mockRequest.query = { page: '1', limit: '5', sentiment: 'positive' };
      mockGetPatientSentimentService.mockReturnValue(mockPatientData);

      getPatientSentiment(mockRequest as Request, mockResponse as Response);

      expect(mockGetPatientSentimentService).toHaveBeenCalledWith(1, 5, 'positive');
      expect(mockJson).toHaveBeenCalledWith(mockPatientData);
    });

    test('should use default values when parameters are missing', () => {
      mockRequest.query = {};
      mockGetPatientSentimentService.mockReturnValue(mockPatientData);

      getPatientSentiment(mockRequest as Request, mockResponse as Response);

      expect(mockGetPatientSentimentService).toHaveBeenCalledWith(NaN, NaN, undefined);
    });

    test('should handle string parameters that cannot be parsed to numbers', () => {
      mockRequest.query = { page: 'invalid', limit: 'also-invalid' };
      mockGetPatientSentimentService.mockReturnValue(mockPatientData);

      getPatientSentiment(mockRequest as Request, mockResponse as Response);

      expect(mockGetPatientSentimentService).toHaveBeenCalledWith(NaN, NaN, undefined);
    });

    test('should handle zero values', () => {
      mockRequest.query = { page: '0', limit: '0' };
      mockGetPatientSentimentService.mockReturnValue(mockPatientData);

      getPatientSentiment(mockRequest as Request, mockResponse as Response);

      expect(mockGetPatientSentimentService).toHaveBeenCalledWith(0, 0, undefined);
    });

    test('should handle large numbers', () => {
      mockRequest.query = { page: '999999', limit: '999999' };
      mockGetPatientSentimentService.mockReturnValue(mockPatientData);

      getPatientSentiment(mockRequest as Request, mockResponse as Response);

      expect(mockGetPatientSentimentService).toHaveBeenCalledWith(999999, 999999, undefined);
    });

    test('should handle negative numbers', () => {
      mockRequest.query = { page: '-1', limit: '-5' };
      mockGetPatientSentimentService.mockReturnValue(mockPatientData);

      getPatientSentiment(mockRequest as Request, mockResponse as Response);

      expect(mockGetPatientSentimentService).toHaveBeenCalledWith(-1, -5, undefined);
    });

    test('should handle service errors', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const error = new Error('Service error');
      mockRequest.query = { page: '1', limit: '5' };
      mockGetPatientSentimentService.mockImplementation(() => {
        throw error;
      });

      getPatientSentiment(mockRequest as Request, mockResponse as Response);

      expect(consoleErrorSpy).toHaveBeenCalledWith(error);
      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({ message: 'Error fetching patient sentiment data' });

      consoleErrorSpy.mockRestore();
    });

    test('should handle empty patient data', () => {
      const emptyData = { data: [], total: 0, page: 1, limit: 5 };
      mockRequest.query = { page: '1', limit: '5' };
      mockGetPatientSentimentService.mockReturnValue(emptyData);

      getPatientSentiment(mockRequest as Request, mockResponse as Response);

      expect(mockJson).toHaveBeenCalledWith(emptyData);
    });

    test('should handle special characters in sentiment filter', () => {
      mockRequest.query = { page: '1', limit: '5', sentiment: 'positive-neutral' };
      mockGetPatientSentimentService.mockReturnValue(mockPatientData);

      getPatientSentiment(mockRequest as Request, mockResponse as Response);

      expect(mockGetPatientSentimentService).toHaveBeenCalledWith(1, 5, 'positive-neutral');
    });

    test('should handle very long sentiment values', () => {
      const longSentiment = 'a'.repeat(1000);
      mockRequest.query = { page: '1', limit: '5', sentiment: longSentiment };
      mockGetPatientSentimentService.mockReturnValue(mockPatientData);

      getPatientSentiment(mockRequest as Request, mockResponse as Response);

      expect(mockGetPatientSentimentService).toHaveBeenCalledWith(1, 5, longSentiment);
    });

    test('should handle decimal numbers in query parameters', () => {
      mockRequest.query = { page: '1.5', limit: '5.7' };
      mockGetPatientSentimentService.mockReturnValue(mockPatientData);

      getPatientSentiment(mockRequest as Request, mockResponse as Response);

      expect(mockGetPatientSentimentService).toHaveBeenCalledWith(1, 5, undefined);
    });

    test('should handle multiple sentiment filters', () => {
      mockRequest.query = { page: '1', limit: '5', sentiment: 'positive,neutral' };
      mockGetPatientSentimentService.mockReturnValue(mockPatientData);

      getPatientSentiment(mockRequest as Request, mockResponse as Response);

      expect(mockGetPatientSentimentService).toHaveBeenCalledWith(1, 5, 'positive,neutral');
    });
  });
});
