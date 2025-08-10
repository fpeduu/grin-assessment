export type Satisfaction = 'positive' | 'neutral' | 'negative';

export interface Patient {
  id: string;
  name: string;
  satisfaction: Satisfaction;
  lastCommunicationDate: string;
}

export interface Employee {
  id: string;
  name: string;
  satisfaction: Satisfaction;
  lastCommunicationDate: string;
}

export interface DashboardData {
  meetings: number;
  brushing: number;
  instructionsSent: number;
  tasks: number;
  timeSaved: number;
  patientsSatisfaction: Patient[];
  employeesSatisfaction: Employee[];
}
