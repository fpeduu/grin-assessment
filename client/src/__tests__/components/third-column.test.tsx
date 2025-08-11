import { render, screen, waitFor } from '@testing-library/react';
import { ThirdColumn } from '../../components/third-column';
import { getPatientSentiment } from '../../services/api';

jest.mock('../../services/api');

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

const mockGetPatientSentiment = getPatientSentiment as jest.Mock;

describe('ThirdColumn component', () => {
  const mockSentimentCounts = {
    positive: 5,
    neutral: 3,
    negative: 2,
  };

  beforeEach(() => {
    mockGetPatientSentiment.mockClear();
  });

  test('should render sentiment counts correctly', () => {
    render(<ThirdColumn sentimentCounts={mockSentimentCounts} />);

    expect(screen.getByText('5')).toBeInTheDocument(); // positive count
    expect(screen.getByText('3')).toBeInTheDocument(); // neutral count
    expect(screen.getByText('2')).toBeInTheDocument(); // negative count
  });

  test('should render sentiment labels', () => {
    render(<ThirdColumn sentimentCounts={mockSentimentCounts} />);

    expect(screen.getByText('Positive')).toBeInTheDocument();
    expect(screen.getByText('Neutral')).toBeInTheDocument();
    expect(screen.getByText('Can Be Better')).toBeInTheDocument();
  });

  test('should render patient sentiment section', () => {
    render(<ThirdColumn sentimentCounts={mockSentimentCounts} />);

    expect(screen.getByText('Overall Patients Sentiment')).toBeInTheDocument();
  });

  test('should fetch patient data on mount', async () => {
    const mockPatientData = {
      data: [
        { id: '1', name: 'John Doe', satisfaction: 'positive', lastCommunicationDate: '2023-01-01' },
        { id: '2', name: 'Jane Smith', satisfaction: 'neutral', lastCommunicationDate: '2023-01-02' },
      ],
      total: 2,
    };

    mockGetPatientSentiment.mockResolvedValue(mockPatientData);

    render(<ThirdColumn sentimentCounts={mockSentimentCounts} />);

    await waitFor(() => {
      expect(mockGetPatientSentiment).toHaveBeenCalledWith(1, 5, '');
    });
  });

  test('should handle API errors gracefully', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockGetPatientSentiment.mockRejectedValue(new Error('API Error'));

    render(<ThirdColumn sentimentCounts={mockSentimentCounts} />);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to fetch patients', expect.any(Error));
    });

    consoleErrorSpy.mockRestore();
  });

  test('should handle empty sentiment counts', () => {
    const emptyCounts = {
      positive: 0,
      neutral: 0,
      negative: 0,
    };

    render(<ThirdColumn sentimentCounts={emptyCounts} />);

    const zeros = screen.getAllByText('0');
    expect(zeros).toHaveLength(3);
  });

  test('should handle large sentiment counts', () => {
    const largeCounts = {
      positive: 999,
      neutral: 888,
      negative: 777,
    };

    render(<ThirdColumn sentimentCounts={largeCounts} />);

    expect(screen.getByText('999')).toBeInTheDocument(); // positive count
    expect(screen.getByText('888')).toBeInTheDocument(); // neutral count
    expect(screen.getByText('777')).toBeInTheDocument(); // negative count
  });

  test('should render sentiment icons', () => {
    render(<ThirdColumn sentimentCounts={mockSentimentCounts} />);

    expect(screen.getByAltText('Positive')).toBeInTheDocument();
    expect(screen.getByAltText('Neutral')).toBeInTheDocument();
    expect(screen.getByAltText('Negative')).toBeInTheDocument();
  });

  test('should apply correct CSS classes', () => {
    const { container } = render(<ThirdColumn sentimentCounts={mockSentimentCounts} />);

    const mainContainer = container.firstChild as HTMLElement;
    expect(mainContainer).toHaveClass('text-card-foreground', 'gap-6', 'rounded-xl', 'border', 'py-6', 'h-full', 'flex', 'flex-col', 'bg-white', 'border-none', 'shadow-sm');
  });

  test('should handle undefined sentiment counts', () => {
    const undefinedCounts = undefined as any;
    render(<ThirdColumn sentimentCounts={undefinedCounts} />);

    expect(screen.getByText('Overall Patients Sentiment')).toBeInTheDocument();
  });
});
