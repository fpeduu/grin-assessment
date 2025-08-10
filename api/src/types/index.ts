export interface LiveCall {
  id: string;
  entityType: 'liveCall';
  createdAt: string;
}

export interface Communication {
  id: string;
  entityType: 'communication';
  type: 'brushing' | 'instructions';
  createdAt: string;
}

export interface Task {
  id: string;
  entityType: 'task';
  createdAt: string;
}

export type Satisfaction = 'positive' | 'neutral' | 'negative';

export interface Patient {
  id: string;
  lastCommunicationDate: string;
  satisfaction: Satisfaction;
  name: string;
}

export interface Employee {
  id: string;
  lastCommunicationDate: string;
  satisfaction: Satisfaction;
  name: string;
}

export interface DataSet {
  liveCalls: LiveCall[];
  tasks: Task[];
  communication: Communication[];
  patientsSatisfaction: {
    summary: Record<Satisfaction, number>;
    patientsData: Patient[];
  };
  employeesSatisfaction: {
    summary: Record<Satisfaction, number>;
    employeesData: Employee[];
  };
}

export enum Timeframe {
  Weekly = 'weekly',
  Monthly = 'monthly',
  Yearly = 'yearly',
  All = 'all',
}
