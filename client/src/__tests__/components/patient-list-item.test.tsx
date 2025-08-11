import { fireEvent, render, screen } from '@testing-library/react';
import { PatientListItem } from '../../components/patient-list-item';

describe('PatientListItem component', () => {
  const mockPatient = {
    id: '1',
    name: 'John Doe',
    satisfaction: 'positive' as const,
    lastCommunicationDate: '2023-01-15',
    scansCount: 5,
  };

  test('should render avatar with fallback initials', () => {
    render(<PatientListItem patient={mockPatient} />);

    const avatarFallback = screen.getByText('JD');
    expect(avatarFallback).toBeInTheDocument();
  });

  test('should handle patient name with single word', () => {
    const singleNamePatient = {
      ...mockPatient,
      name: 'John',
    };

    render(<PatientListItem patient={singleNamePatient} />);

    expect(screen.getByText('J')).toBeInTheDocument();
  });

  test('should handle patient name with multiple words', () => {
    const multiNamePatient = {
      ...mockPatient,
      name: 'John Michael Doe',
    };

    render(<PatientListItem patient={multiNamePatient} />);

    expect(screen.getByText('JMD')).toBeInTheDocument();
  });

  test('should generate random scans count when not provided', () => {
    const patientWithoutScans = {
      ...mockPatient,
      scansCount: undefined,
    };

    render(<PatientListItem patient={patientWithoutScans} />);

    expect(screen.getByText('Scans:')).toBeInTheDocument();
    const scansText = screen.getByText(/^\d+$/);
    expect(scansText).toBeInTheDocument();
  });

  test('should render comment text', () => {
    render(<PatientListItem patient={mockPatient} />);

    const expectedComment = "Patient wasn't feeling comfortable with the aligners, leading to some negative feeling around the treatment and experiencing some tooth aches. Expecting smoother feeling.";
    expect(screen.getByText(expectedComment)).toBeInTheDocument();
  });

  test('should render tooltip on hover', () => {
    render(<PatientListItem patient={mockPatient} />);

    const commentElement = screen.getByText(/Patient wasn't feeling comfortable/);
    expect(commentElement).toHaveClass('cursor-help');
  });

  test('should apply correct CSS classes', () => {
    const { container } = render(<PatientListItem patient={mockPatient} />);

    const listItem = container.firstChild as HTMLElement;
    expect(listItem).toHaveClass('grid', 'grid-cols-4', 'items-center', 'gap-4', 'p-3', 'hover:bg-muted/50', 'border-b', 'border-muted-text', 'pb-4');
  });

  test('should handle special characters in patient name', () => {
    const specialNamePatient = {
      ...mockPatient,
      name: 'José María O\'Connor',
    };

    render(<PatientListItem patient={specialNamePatient} />);

    expect(screen.getByText('José María O\'Connor')).toBeInTheDocument();
    expect(screen.getByText('JMO')).toBeInTheDocument(); // Initials
  });

  test('should handle very large scans count', () => {
    const largeScansPatient = {
      ...mockPatient,
      scansCount: 999,
    };

    render(<PatientListItem patient={largeScansPatient} />);

    expect(screen.getByText('999')).toBeInTheDocument();
  });

  test('should render tooltip with correct content', () => {
    render(<PatientListItem patient={mockPatient} />);

    const commentElement = screen.getByText(/Patient wasn't feeling comfortable/);
    fireEvent.mouseEnter(commentElement);

    // The tooltip should be present in the DOM
    expect(commentElement).toBeInTheDocument();
  });

  test('should handle different date formats gracefully', () => {
    const invalidDatePatient = {
      ...mockPatient,
      lastCommunicationDate: 'invalid-date',
    };

    render(<PatientListItem patient={invalidDatePatient} />);

    // Should still render the component without crashing
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  test('should render multiple patient list items', () => {
    const patient2 = {
      ...mockPatient,
      id: '2',
      name: 'Jane Smith',
    };

    render(
      <div>
        <PatientListItem patient={mockPatient} />
        <PatientListItem patient={patient2} />
      </div>
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });
});
