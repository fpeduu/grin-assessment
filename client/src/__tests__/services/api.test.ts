import { getDashboardData, getPatientSentiment } from '../../services/api';

global.fetch = jest.fn();

const mockFetch = fetch as jest.Mock;

describe('API Service', () => {
  beforeEach(() => {
    mockFetch.mockClear();
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

    test('should fetch dashboard data successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockDashboardData,
      });

      const result = await getDashboardData('all');

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/api/dashboard?timeframe=all');
      expect(result).toEqual(mockDashboardData);
    });

    test('should fetch dashboard data with different timeframe', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockDashboardData,
      });

      await getDashboardData('weekly');

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/api/dashboard?timeframe=weekly');
    });

    test('should throw error when response is not ok', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(getDashboardData('all')).rejects.toThrow('Failed to fetch dashboard data');
    });

    test('should throw error when fetch fails', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(getDashboardData('all')).rejects.toThrow('Network error');
    });



    test('should handle empty response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      const result = await getDashboardData('all');

      expect(result).toEqual({});
    });

    test('should handle malformed JSON response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new Error('Invalid JSON');
        },
      });

      await expect(getDashboardData('all')).rejects.toThrow('Invalid JSON');
    });
  });

  describe('getPatientSentiment', () => {
    const mockPatientData = {
      data: [
        { id: '1', name: 'John Doe', satisfaction: 'positive', lastCommunicationDate: '2023-01-01' },
        { id: '2', name: 'Jane Smith', satisfaction: 'neutral', lastCommunicationDate: '2023-01-02' },
      ],
      total: 2,
    };

    test('should fetch patient sentiment data successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPatientData,
      });

      const result = await getPatientSentiment(1, 5);

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/api/dashboard/sentiment/patients?page=1&limit=5');
      expect(result).toEqual(mockPatientData);
    });

    test('should fetch patient sentiment data with sentiment filter', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPatientData,
      });

      await getPatientSentiment(1, 5, 'positive');

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/api/dashboard/sentiment/patients?page=1&limit=5&sentiment=positive');
    });

    test('should use default parameters when not provided', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPatientData,
      });

      await getPatientSentiment();

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/api/dashboard/sentiment/patients?page=1&limit=10');
    });

    test('should throw error when response is not ok', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      await expect(getPatientSentiment(1, 5)).rejects.toThrow('Failed to fetch patient sentiment');
    });

    test('should throw error when fetch fails', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(getPatientSentiment(1, 5)).rejects.toThrow('Network error');
    });

    test('should handle empty patient data', async () => {
      const emptyData = { data: [], total: 0 };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => emptyData,
      });

      const result = await getPatientSentiment(1, 5);

      expect(result).toEqual(emptyData);
    });

    test('should handle large page numbers', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPatientData,
      });

      await getPatientSentiment(100, 5);

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/api/dashboard/sentiment/patients?page=100&limit=5');
    });

    test('should handle large limit values', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPatientData,
      });

      await getPatientSentiment(1, 1000);

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/api/dashboard/sentiment/patients?page=1&limit=1000');
    });

    test('should handle special characters in sentiment filter', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPatientData,
      });

      await getPatientSentiment(1, 5, 'positive-neutral');

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/api/dashboard/sentiment/patients?page=1&limit=5&sentiment=positive-neutral');
    });

    test('should handle zero page and limit values', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPatientData,
      });

      await getPatientSentiment(0, 0);

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/api/dashboard/sentiment/patients?page=0&limit=0');
    });

    test('should handle malformed JSON response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new Error('Invalid JSON');
        },
      });

      await expect(getPatientSentiment(1, 5)).rejects.toThrow('Invalid JSON');
    });

    test('should handle response with missing properties', async () => {
      const incompleteData = { data: [] };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => incompleteData,
      });

      const result = await getPatientSentiment(1, 5);

      expect(result).toEqual(incompleteData);
    });
  });

  describe('Error handling', () => {
    test('should handle timeout errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Request timeout'));

      await expect(getDashboardData('all')).rejects.toThrow('Request timeout');
    });

    test('should handle CORS errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('CORS error'));

      await expect(getDashboardData('all')).rejects.toThrow('CORS error');
    });

    test('should handle 401 unauthorized errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
      });

      await expect(getDashboardData('all')).rejects.toThrow('Failed to fetch dashboard data');
    });

    test('should handle 403 forbidden errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
      });

      await expect(getDashboardData('all')).rejects.toThrow('Failed to fetch dashboard data');
    });

    test('should handle 404 not found errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      await expect(getDashboardData('all')).rejects.toThrow('Failed to fetch dashboard data');
    });
  });
});
