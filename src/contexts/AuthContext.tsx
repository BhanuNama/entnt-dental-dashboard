
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  role: 'Admin' | 'Patient';
  email: string;
  password: string;
  patientId?: string;
}

export interface Patient {
  id: string;
  name: string;
  dob: string;
  contact: string;
  healthInfo: string;
  email?: string;
}

export interface Incident {
  id: string;
  patientId: string;
  title: string;
  description: string;
  comments: string;
  appointmentDate: string;
  cost?: number;
  treatment?: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'Pending';
  nextDate?: string;
  files?: { name: string; url: string; type: string }[];
}

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  patients: Patient[];
  incidents: Incident[];
  addPatient: (patient: Omit<Patient, 'id'>) => void;
  updatePatient: (id: string, patient: Partial<Patient>) => void;
  deletePatient: (id: string) => void;
  addIncident: (incident: Omit<Incident, 'id'>) => void;
  updateIncident: (id: string, incident: Partial<Incident>) => void;
  deleteIncident: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockData = {
  users: [
    { id: "1", role: "Admin" as const, email: "admin@entnt.in", password: "admin123" },
    { id: "2", role: "Patient" as const, email: "john@entnt.in", password: "patient123", patientId: "p1" },
    { id: "3", role: "Patient" as const, email: "jane@entnt.in", password: "patient123", patientId: "p2" }
  ],
  patients: [
    {
      id: "p1",
      name: "John Doe",
      dob: "1990-05-10",
      contact: "1234567890",
      healthInfo: "No allergies",
      email: "john@entnt.in"
    },
    {
      id: "p2",
      name: "Jane Smith",
      dob: "1985-03-22",
      contact: "0987654321",
      healthInfo: "Allergic to penicillin",
      email: "jane@entnt.in"
    }
  ],
  incidents: [
    {
      id: "i1",
      patientId: "p1",
      title: "Toothache",
      description: "Upper molar pain",
      comments: "Sensitive to cold",
      appointmentDate: "2025-01-15T10:00:00",
      cost: 80,
      treatment: "Root canal treatment",
      status: "Completed" as const,
      files: []
    },
    {
      id: "i2",
      patientId: "p1",
      title: "Routine Cleaning",
      description: "Regular dental cleaning",
      comments: "Good oral hygiene",
      appointmentDate: "2025-01-30T14:00:00",
      status: "Scheduled" as const,
      files: []
    },
    {
      id: "i3",
      patientId: "p2",
      title: "Cavity Filling",
      description: "Small cavity in lower molar",
      comments: "Pain when chewing",
      appointmentDate: "2025-01-20T11:00:00",
      cost: 120,
      treatment: "Composite filling",
      status: "Completed" as const,
      files: []
    }
  ]
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);

  useEffect(() => {
    // Initialize data from localStorage or use mock data
    const storedUser = localStorage.getItem('currentUser');
    const storedPatients = localStorage.getItem('patients');
    const storedIncidents = localStorage.getItem('incidents');

    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }

    if (storedPatients) {
      setPatients(JSON.parse(storedPatients));
    } else {
      setPatients(mockData.patients);
      localStorage.setItem('patients', JSON.stringify(mockData.patients));
    }

    if (storedIncidents) {
      setIncidents(JSON.parse(storedIncidents));
    } else {
      setIncidents(mockData.incidents);
      localStorage.setItem('incidents', JSON.stringify(mockData.incidents));
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    const user = mockData.users.find(u => u.email === email && u.password === password);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const addPatient = (patient: Omit<Patient, 'id'>) => {
    const newPatient = { ...patient, id: `p${Date.now()}` };
    const updatedPatients = [...patients, newPatient];
    setPatients(updatedPatients);
    localStorage.setItem('patients', JSON.stringify(updatedPatients));
  };

  const updatePatient = (id: string, patient: Partial<Patient>) => {
    const updatedPatients = patients.map(p => p.id === id ? { ...p, ...patient } : p);
    setPatients(updatedPatients);
    localStorage.setItem('patients', JSON.stringify(updatedPatients));
  };

  const deletePatient = (id: string) => {
    const updatedPatients = patients.filter(p => p.id !== id);
    setPatients(updatedPatients);
    localStorage.setItem('patients', JSON.stringify(updatedPatients));
    
    // Also delete associated incidents
    const updatedIncidents = incidents.filter(i => i.patientId !== id);
    setIncidents(updatedIncidents);
    localStorage.setItem('incidents', JSON.stringify(updatedIncidents));
  };

  const addIncident = (incident: Omit<Incident, 'id'>) => {
    const newIncident = { ...incident, id: `i${Date.now()}` };
    const updatedIncidents = [...incidents, newIncident];
    setIncidents(updatedIncidents);
    localStorage.setItem('incidents', JSON.stringify(updatedIncidents));
  };

  const updateIncident = (id: string, incident: Partial<Incident>) => {
    const updatedIncidents = incidents.map(i => i.id === id ? { ...i, ...incident } : i);
    setIncidents(updatedIncidents);
    localStorage.setItem('incidents', JSON.stringify(updatedIncidents));
  };

  const deleteIncident = (id: string) => {
    const updatedIncidents = incidents.filter(i => i.id !== id);
    setIncidents(updatedIncidents);
    localStorage.setItem('incidents', JSON.stringify(updatedIncidents));
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      login,
      logout,
      patients,
      incidents,
      addPatient,
      updatePatient,
      deletePatient,
      addIncident,
      updateIncident,
      deleteIncident
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
