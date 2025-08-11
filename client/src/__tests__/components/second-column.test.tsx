import { render, screen } from '@testing-library/react';
import { SecondColumn } from '../../components/second-column';
import { DashboardData, Employee, Patient } from '../../types';

describe('SecondColumn component', () => {
  const mockPatients: Patient[] = [
    { id: '1', name: 'John Doe', satisfaction: 'positive', lastCommunicationDate: '2023-01-01' },
    { id: '2', name: 'Jane Smith', satisfaction: 'neutral', lastCommunicationDate: '2023-01-02' },
    { id: '3', name: 'Bob Johnson', satisfaction: 'negative', lastCommunicationDate: '2023-01-03' },
  ];

  const mockEmployees: Employee[] = [
    { id: '1', name: 'Alice Brown', satisfaction: 'positive', lastCommunicationDate: '2023-01-01' },
    { id: '2', name: 'Charlie Wilson', satisfaction: 'positive', lastCommunicationDate: '2023-01-02' },
    { id: '3', name: 'Diana Davis', satisfaction: 'neutral', lastCommunicationDate: '2023-01-03' },
    { id: '4', name: 'Eve Miller', satisfaction: 'negative', lastCommunicationDate: '2023-01-04' },
  ];

  const mockData: DashboardData = {
    meetings: 25,
    tasks: 150,
    brushing: 89,
    likes: 234,
    timeSaved: 125,
    instructionsSent: 67,
    patientsSatisfaction: mockPatients,
    employeesSatisfaction: mockEmployees,
  };

  test('should render instructions sent card with data', () => {
    render(<SecondColumn data={mockData} />);

    expect(screen.getByText('Instructions Sent')).toBeInTheDocument();
    expect(screen.getByText('67')).toBeInTheDocument();
  });

  test('should handle empty satisfaction data', () => {
    const emptyData: DashboardData = {
      ...mockData,
      patientsSatisfaction: [],
      employeesSatisfaction: [],
    };

    render(<SecondColumn data={emptyData} />);

    expect(screen.getByText('Overall Employees Satisfaction')).toBeInTheDocument();
    expect(screen.getByText('Overall Patients Satisfaction')).toBeInTheDocument();
  });

  test('should handle null data gracefully', () => {
    render(<SecondColumn data={null} />);

    expect(screen.getByText('Instructions Sent')).toBeInTheDocument();
    expect(screen.getByText('...')).toBeInTheDocument();
    expect(screen.getByText('Overall Employees Satisfaction')).toBeInTheDocument();
    expect(screen.getByText('Overall Patients Satisfaction')).toBeInTheDocument();
  });

  test('should render satisfaction bar legends', () => {
    render(<SecondColumn data={mockData} />);

    const canBeBetterElements = screen.getAllByText('Can be better');
    const neutralElements = screen.getAllByText('Neutral');
    const positiveElements = screen.getAllByText('Positive');

    expect(canBeBetterElements.length).toBeGreaterThan(0);
    expect(neutralElements.length).toBeGreaterThan(0);
    expect(positiveElements.length).toBeGreaterThan(0);
  });

  test('should render satisfaction icons', () => {
    render(<SecondColumn data={mockData} />);

    expect(screen.getAllByAltText('Negative').length).toBeGreaterThan(0);
    expect(screen.getAllByAltText('Neutral').length).toBeGreaterThan(0);
    expect(screen.getAllByAltText('Positive').length).toBeGreaterThan(0);
  });

  test('should handle all positive satisfaction data', () => {
    const allPositiveData: DashboardData = {
      ...mockData,
      patientsSatisfaction: [
        { id: '1', name: 'John Doe', satisfaction: 'positive', lastCommunicationDate: '2023-01-01' },
        { id: '2', name: 'Jane Smith', satisfaction: 'positive', lastCommunicationDate: '2023-01-02' },
      ],
    };

    render(<SecondColumn data={allPositiveData} />);

    const twos = screen.getAllByText('2');
    const zeros = screen.getAllByText('0');

    expect(twos.length).toBeGreaterThan(0);
    expect(zeros.length).toBeGreaterThan(0);
  });

  test('should handle all negative satisfaction data', () => {
    const allNegativeData: DashboardData = {
      ...mockData,
      employeesSatisfaction: [
        { id: '1', name: 'Alice Brown', satisfaction: 'negative', lastCommunicationDate: '2023-01-01' },
        { id: '2', name: 'Charlie Wilson', satisfaction: 'negative', lastCommunicationDate: '2023-01-02' },
      ],
    };

    render(<SecondColumn data={allNegativeData} />);

    const zeros = screen.getAllByText('0');
    const twos = screen.getAllByText('2');

    expect(zeros.length).toBeGreaterThan(0);
    expect(twos.length).toBeGreaterThan(0);
  });
});
