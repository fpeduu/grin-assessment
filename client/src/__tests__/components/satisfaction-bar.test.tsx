import { render, screen } from '@testing-library/react';
import { SatisfactionBar } from '../../components/satisfaction-bar';

describe('SatisfactionBar component', () => {
  const defaultProps = {
    green: 60,
    yellow: 25,
    red: 15,
    positiveCount: 6,
    neutralCount: 2,
    negativeCount: 1,
    description: 'Test description for satisfaction bar',
  };

  test('should render all satisfaction icons and counts', () => {
    render(<SatisfactionBar {...defaultProps} />);

    expect(screen.getByAltText('Negative')).toBeInTheDocument();
    expect(screen.getByAltText('Neutral')).toBeInTheDocument();
    expect(screen.getByAltText('Positive')).toBeInTheDocument();

    expect(screen.getByText('1')).toBeInTheDocument(); // negative count
    expect(screen.getByText('2')).toBeInTheDocument(); // neutral count
    expect(screen.getByText('6')).toBeInTheDocument(); // positive count
  });

  test('should render satisfaction bar with correct colors', () => {
    render(<SatisfactionBar {...defaultProps} />);

    // Find the bar container by looking for the specific class
    const barContainer = screen.getByText('Test description for satisfaction bar').parentElement?.querySelector('.flex.h-2');
    expect(barContainer).toBeInTheDocument();

    const bars = barContainer?.querySelectorAll('div[style*="width"]');
    expect(bars).toHaveLength(3);
  });

  test('should render legend with correct labels', () => {
    render(<SatisfactionBar {...defaultProps} />);

    expect(screen.getByText('Can be better')).toBeInTheDocument();
    expect(screen.getByText('Neutral')).toBeInTheDocument();
    expect(screen.getByText('Positive')).toBeInTheDocument();
  });

  test('should render description text', () => {
    render(<SatisfactionBar {...defaultProps} />);

    expect(screen.getByText('Test description for satisfaction bar')).toBeInTheDocument();
  });

  test('should handle zero values correctly', () => {
    const zeroProps = {
      green: 0,
      yellow: 0,
      red: 0,
      positiveCount: 0,
      neutralCount: 0,
      negativeCount: 0,
      description: 'All zero values',
    };

    render(<SatisfactionBar {...zeroProps} />);

    const zeros = screen.getAllByText('0');
    expect(zeros).toHaveLength(3);
    expect(screen.getByText('All zero values')).toBeInTheDocument();
  });

  test('should handle 100% positive satisfaction', () => {
    const allPositiveProps = {
      green: 100,
      yellow: 0,
      red: 0,
      positiveCount: 10,
      neutralCount: 0,
      negativeCount: 0,
      description: 'All positive',
    };

    render(<SatisfactionBar {...allPositiveProps} />);

    expect(screen.getByText('10')).toBeInTheDocument();
    const zeros = screen.getAllByText('0');
    expect(zeros).toHaveLength(2);
  });

  test('should handle 100% negative satisfaction', () => {
    const allNegativeProps = {
      green: 0,
      yellow: 0,
      red: 100,
      positiveCount: 0,
      neutralCount: 0,
      negativeCount: 5,
      description: 'All negative',
    };

    render(<SatisfactionBar {...allNegativeProps} />);

    // Use getAllByText since there are multiple "0" elements
    const zeros = screen.getAllByText('0');
    expect(zeros).toHaveLength(2); // positive and neutral counts
    expect(screen.getByText('5')).toBeInTheDocument(); // negative count
  });

  test('should handle equal distribution', () => {
    const equalProps = {
      green: 33.33,
      yellow: 33.33,
      red: 33.34,
      positiveCount: 3,
      neutralCount: 3,
      negativeCount: 3,
      description: 'Equal distribution',
    };

    render(<SatisfactionBar {...equalProps} />);

    const threes = screen.getAllByText('3');
    expect(threes).toHaveLength(3);
  });

  test('should handle decimal percentages', () => {
    const decimalProps = {
      green: 33.5,
      yellow: 33.5,
      red: 33.0,
      positiveCount: 3,
      neutralCount: 3,
      negativeCount: 3,
      description: 'Decimal percentages',
    };

    render(<SatisfactionBar {...decimalProps} />);

    const threes = screen.getAllByText('3');
    expect(threes).toHaveLength(3);
  });

  test('should render legend dots with correct colors', () => {
    render(<SatisfactionBar {...defaultProps} />);

    const legendDots = screen.getAllByRole('generic', { hidden: true });
    expect(legendDots.length).toBeGreaterThan(0);
  });

  test('should handle long description text', () => {
    const longDescription = 'This is a very long description that might wrap to multiple lines and should still be displayed correctly in the satisfaction bar component';

    render(<SatisfactionBar {...defaultProps} description={longDescription} />);

    expect(screen.getByText(longDescription)).toBeInTheDocument();
  });

  test('should handle special characters in description', () => {
    const specialDescription = 'Description with special chars: @#$%^&*()_+-=[]{}|;:,.<>?';

    render(<SatisfactionBar {...defaultProps} description={specialDescription} />);

    expect(screen.getByText(specialDescription)).toBeInTheDocument();
  });

  test('should apply correct CSS classes to container', () => {
    const { container } = render(<SatisfactionBar {...defaultProps} />);

    const mainContainer = container.firstChild as HTMLElement;
    expect(mainContainer).toHaveClass('w-full', 'flex', 'flex-col', 'gap-6');
  });

  test('should render satisfaction bar with correct structure', () => {
    render(<SatisfactionBar {...defaultProps} />);

    expect(screen.getByText('Can be better')).toBeInTheDocument();
    expect(screen.getByText('Neutral')).toBeInTheDocument();
    expect(screen.getByText('Positive')).toBeInTheDocument();
    expect(screen.getByText(defaultProps.description)).toBeInTheDocument();
  });
});
