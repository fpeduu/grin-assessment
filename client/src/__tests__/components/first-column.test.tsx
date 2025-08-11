import { render, screen } from '@testing-library/react';
import { FirstColumn } from '../../components/first-column';
import { DashboardData } from '../../types';

describe('FirstColumn component', () => {
  const mockData: DashboardData = {
    meetings: 25,
    tasks: 150,
    brushing: 89,
    likes: 234,
    timeSaved: 125,
    instructionsSent: 67,
    patientsSatisfaction: [],
    employeesSatisfaction: [],
  };

  test('should render all dashboard cards with data', () => {
    render(<FirstColumn data={mockData} />);

    expect(screen.getByText('Meetings Completed')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();

    expect(screen.getByText('Tasks Completed')).toBeInTheDocument();
    expect(screen.getByText('150')).toBeInTheDocument();

    expect(screen.getByText('Brushing Count')).toBeInTheDocument();
    expect(screen.getByText('89')).toBeInTheDocument();

    expect(screen.getByText('Likes')).toBeInTheDocument();
    expect(screen.getByText('234')).toBeInTheDocument();

    expect(screen.getByText('Time Saved')).toBeInTheDocument();
    expect(screen.getByText('2h 5m')).toBeInTheDocument();
  });

  test('should render loading state when data is null', () => {
    render(<FirstColumn data={null} />);

    expect(screen.getByText('Meetings Completed')).toBeInTheDocument();
    // Use getAllByText since there are multiple "..." elements
    const loadingDots = screen.getAllByText('...');
    expect(loadingDots).toHaveLength(5); // 5 cards with loading state

    expect(screen.getByText('Tasks Completed')).toBeInTheDocument();
    expect(screen.getByText('Brushing Count')).toBeInTheDocument();
    expect(screen.getByText('Likes')).toBeInTheDocument();
    expect(screen.getByText('Time Saved')).toBeInTheDocument();
  });

  test('should format time saved correctly for different values', () => {
    const dataWithDifferentTime: DashboardData = {
      ...mockData,
      timeSaved: 90, // 1h 30m
    };

    render(<FirstColumn data={dataWithDifferentTime} />);
    expect(screen.getByText('1h 30m')).toBeInTheDocument();
  });

  test('should format time saved correctly for zero minutes', () => {
    const dataWithZeroTime: DashboardData = {
      ...mockData,
      timeSaved: 0,
    };

    render(<FirstColumn data={dataWithZeroTime} />);
    expect(screen.getByText('0h 0m')).toBeInTheDocument();
  });

  test('should render all icons', () => {
    render(<FirstColumn data={mockData} />);

    expect(screen.getByAltText('Meetings')).toBeInTheDocument();
    expect(screen.getByAltText('Tasks')).toBeInTheDocument();
    expect(screen.getByAltText('Brushing')).toBeInTheDocument();
    expect(screen.getByAltText('Likes')).toBeInTheDocument();
    expect(screen.getByAltText('Time Saved')).toBeInTheDocument();
  });

  test('should handle undefined data gracefully', () => {
    const undefinedData = undefined as any;
    render(<FirstColumn data={undefinedData} />);

    expect(screen.getByText('Meetings Completed')).toBeInTheDocument();
    // Use getAllByText since there are multiple "..." elements
    const loadingDots = screen.getAllByText('...');
    expect(loadingDots).toHaveLength(5); // 5 cards with loading state
  });
});
