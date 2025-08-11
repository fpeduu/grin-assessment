import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThirdColumn } from './third-column';
import { getPatientSentiment } from '../services/api';
import { Patient } from '../types';

// Mock the API service
jest.mock('../services/api');

const mockGetPatientSentiment = getPatientSentiment as jest.Mock;

// Mock IntersectionObserver for infinite scroll testing
beforeAll(() => {
  class MockIntersectionObserver implements IntersectionObserver {
    root: Element | null = null;
    rootMargin: string = '';
    thresholds: readonly number[] = [];
    observe = jest.fn();
    unobserve = jest.fn();
    disconnect = jest.fn();
    takeRecords = jest.fn();
  }

  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: MockIntersectionObserver,
  });
});

describe('ThirdColumn component', () => {
  beforeEach(() => {
    mockGetPatientSentiment.mockClear();
  });

  test('should display loading state initially and then render patients', async () => {
    const mockPatients: Patient[] = [
      { id: '1', name: 'John Doe', satisfaction: 'positive', lastCommunicationDate: '2023-01-01' },
      { id: '2', name: 'Jane Doe', satisfaction: 'neutral', lastCommunicationDate: '2023-01-02' },
    ];
    mockGetPatientSentiment.mockResolvedValue({ data: mockPatients, total: 2 });

    render(<ThirdColumn />);

    await screen.findByText('Loading...');

    expect(await screen.findByText('John Doe')).toBeInTheDocument();
    expect(await screen.findByText('Jane Doe')).toBeInTheDocument();

    expect(getPatientSentiment).toHaveBeenCalledWith(1, 5, '');
  });

  test('should display "No results found" message when no patients are returned', async () => {
    mockGetPatientSentiment.mockResolvedValue({ data: [], total: 0 });

    render(<ThirdColumn />);

    await waitFor(() => {
      expect(screen.getByText('No results found.')).toBeInTheDocument();
    });
  });

  test('should call API with filter when a sentiment is selected', async () => {
    mockGetPatientSentiment.mockResolvedValue({ data: [], total: 0 });

    render(<ThirdColumn />);

    fireEvent.click(screen.getByText('Positive'));

    await waitFor(() => {
      expect(getPatientSentiment).toHaveBeenCalledWith(1, 5, 'positive');
    });
  });

  test('should handle API errors gracefully', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockGetPatientSentiment.mockRejectedValue(new Error('API Error'));

    render(<ThirdColumn />);

    await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to fetch patients', expect.any(Error));
    });
    
    consoleErrorSpy.mockRestore();
  });
});
