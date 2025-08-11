import { render, screen } from '@testing-library/react';
import { DashboardCard } from '../../components/dashboard-card';

describe('DashboardCard component', () => {
  const mockIcon = <div data-testid="mock-icon">Icon</div>;

  test('should render with title, value, and icon', () => {
    render(
      <DashboardCard
        title="Test Title"
        value="123"
        icon={mockIcon}
      />
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('123')).toBeInTheDocument();
    expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
  });

  test('should render with different title and value', () => {
    render(
      <DashboardCard
        title="Another Title"
        value="456"
        icon={mockIcon}
      />
    );

    expect(screen.getByText('Another Title')).toBeInTheDocument();
    expect(screen.getByText('456')).toBeInTheDocument();
  });

  test('should render with zero value', () => {
    render(
      <DashboardCard
        title="Zero Value"
        value="0"
        icon={mockIcon}
      />
    );

    expect(screen.getByText('Zero Value')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  test('should render with empty string value', () => {
    render(
      <DashboardCard
        title="Empty Value"
        value=""
        icon={mockIcon}
      />
    );

    expect(screen.getByText('Empty Value')).toBeInTheDocument();
    // For empty string, we should check that the element exists but has no text content
    const valueElement = screen.getByText('Empty Value').parentElement?.querySelector('.text-2xl');
    expect(valueElement).toBeInTheDocument();
    expect(valueElement?.textContent).toBe('');
  });

  test('should render with long title', () => {
    const longTitle = 'This is a very long title that might wrap to multiple lines';
    render(
      <DashboardCard
        title={longTitle}
        value="123"
        icon={mockIcon}
      />
    );

    expect(screen.getByText(longTitle)).toBeInTheDocument();
  });

  test('should render with large number value', () => {
    render(
      <DashboardCard
        title="Large Number"
        value="999999"
        icon={mockIcon}
      />
    );

    expect(screen.getByText('999999')).toBeInTheDocument();
  });

  test('should render with special characters in title', () => {
    render(
      <DashboardCard
        title="Special @#$%^&*() Characters"
        value="123"
        icon={mockIcon}
      />
    );

    expect(screen.getByText('Special @#$%^&*() Characters')).toBeInTheDocument();
  });

  test('should render with different icon types', () => {
    const imageIcon = <img src="test.jpg" alt="Test" data-testid="image-icon" />;

    render(
      <DashboardCard
        title="Image Icon"
        value="123"
        icon={imageIcon}
      />
    );

    expect(screen.getByTestId('image-icon')).toBeInTheDocument();
  });

  test('should apply correct CSS classes', () => {
    const { container } = render(
      <DashboardCard
        title="Test Title"
        value="123"
        icon={mockIcon}
      />
    );

    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('flex-grow', 'bg-white', 'border-none', 'shadow-sm');
  });

  test('should render title with correct styling class', () => {
    render(
      <DashboardCard
        title="Test Title"
        value="123"
        icon={mockIcon}
      />
    );

    const titleElement = screen.getByText('Test Title');
    expect(titleElement).toHaveClass('text-sm', 'font-medium', 'text-muted-foreground');
  });

  test('should render value with correct styling class', () => {
    render(
      <DashboardCard
        title="Test Title"
        value="123"
        icon={mockIcon}
      />
    );

    const valueElement = screen.getByText('123');
    expect(valueElement).toHaveClass('text-2xl', 'font-bold');
  });

  test('should handle multiple cards in the same container', () => {
    render(
      <div>
        <DashboardCard
          title="First Card"
          value="123"
          icon={mockIcon}
        />
        <DashboardCard
          title="Second Card"
          value="456"
          icon={mockIcon}
        />
      </div>
    );

    expect(screen.getByText('First Card')).toBeInTheDocument();
    expect(screen.getByText('123')).toBeInTheDocument();
    expect(screen.getByText('Second Card')).toBeInTheDocument();
    expect(screen.getByText('456')).toBeInTheDocument();
  });
});
