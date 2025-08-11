import { fireEvent, render, screen } from '@testing-library/react';
import { TimeframeSwitch } from '../../components/timeframe-switch';

describe('TimeframeSwitch component', () => {
  const mockSetTimeframe = jest.fn();

  beforeEach(() => {
    mockSetTimeframe.mockClear();
  });

  test('should render all timeframe options', () => {
    render(
      <TimeframeSwitch
        timeframe="all"
        setTimeframe={mockSetTimeframe}
      />
    );

    expect(screen.getByText('7D')).toBeInTheDocument();
    expect(screen.getByText('30D')).toBeInTheDocument();
    expect(screen.getByText('All')).toBeInTheDocument();
  });

  test('should call setTimeframe when weekly is clicked', () => {
    render(
      <TimeframeSwitch
        timeframe="all"
        setTimeframe={mockSetTimeframe}
      />
    );

    fireEvent.click(screen.getByText('7D'));
    expect(mockSetTimeframe).toHaveBeenCalledWith('weekly');
  });

  test('should call setTimeframe when monthly is clicked', () => {
    render(
      <TimeframeSwitch
        timeframe="all"
        setTimeframe={mockSetTimeframe}
      />
    );

    fireEvent.click(screen.getByText('30D'));
    expect(mockSetTimeframe).toHaveBeenCalledWith('monthly');
  });

  test('should call setTimeframe when all is clicked', () => {
    render(
      <TimeframeSwitch
        timeframe="weekly"
        setTimeframe={mockSetTimeframe}
      />
    );

    fireEvent.click(screen.getByText('All'));
    expect(mockSetTimeframe).toHaveBeenCalledWith('all');
  });

  test('should highlight the currently selected timeframe', () => {
    render(
      <TimeframeSwitch
        timeframe="weekly"
        setTimeframe={mockSetTimeframe}
      />
    );

    const weeklyButton = screen.getByText('7D').closest('button');
    expect(weeklyButton).toHaveAttribute('data-state', 'on');
  });

  test('should not call setTimeframe when clicking the already selected option', () => {
    render(
      <TimeframeSwitch
        timeframe="weekly"
        setTimeframe={mockSetTimeframe}
      />
    );

    fireEvent.click(screen.getByText('7D'));
    expect(mockSetTimeframe).not.toHaveBeenCalled();
  });

  test('should handle switching between different timeframes', () => {
    render(
      <TimeframeSwitch
        timeframe="weekly"
        setTimeframe={mockSetTimeframe}
      />
    );

    // Click monthly
    fireEvent.click(screen.getByText('30D'));
    expect(mockSetTimeframe).toHaveBeenCalledWith('monthly');

    // Click all
    fireEvent.click(screen.getByText('All'));
    expect(mockSetTimeframe).toHaveBeenCalledWith('all');
  });

  test('should apply correct CSS classes to toggle group', () => {
    const { container } = render(
      <TimeframeSwitch
        timeframe="all"
        setTimeframe={mockSetTimeframe}
      />
    );

    const toggleGroup = container.firstChild as HTMLElement;
    expect(toggleGroup).toHaveClass('inline-flex', 'items-center', 'rounded-lg', 'bg-white', 'p-1', 'shadow-sm');
  });

  test('should apply correct CSS classes to toggle items', () => {
    render(
      <TimeframeSwitch
        timeframe="all"
        setTimeframe={mockSetTimeframe}
      />
    );

    const allButton = screen.getByText('All').closest('button');
    expect(allButton).toHaveClass(
      'text-sm',
      'text-gray-500',
      'data-[state=on]:bg-indigo-50',
      'data-[state=on]:text-indigo-600',
      'data-[state=on]:font-semibold',
      'rounded-md',
      'data-[state=on]:shadow-sm'
    );
  });

  test('should render with different initial timeframe', () => {
    render(
      <TimeframeSwitch
        timeframe="monthly"
        setTimeframe={mockSetTimeframe}
      />
    );

    const monthlyButton = screen.getByText('30D').closest('button');
    expect(monthlyButton).toHaveAttribute('data-state', 'on');
  });
});
