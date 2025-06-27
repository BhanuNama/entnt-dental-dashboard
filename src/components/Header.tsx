
import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const Header: React.FC = () => {
  const { currentUser, incidents, patients } = useAuth();
  
  const upcomingAppointments = incidents.filter(incident => {
    const appointmentDate = new Date(incident.appointmentDate);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return appointmentDate >= today && appointmentDate <= tomorrow && incident.status === 'Scheduled';
  });

  const currentPatient = currentUser?.role === 'Patient' 
    ? patients.find(p => p.id === currentUser.patientId)
    : null;

  return (
    <header className="h-16 border-b border-gray-200 bg-white/80 backdrop-blur-sm flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center space-x-4">
        <SidebarTrigger className="text-gray-600 hover:text-gray-900 transition-colors" />
        <div>
          <h1 className="text-xl font-semibold text-gray-900 font-poppins">
            {currentUser?.role === 'Admin' ? 'Dental Center Dashboard' : 'Patient Portal'}
          </h1>
          <p className="text-sm text-gray-500 font-inter">
            Welcome back, {currentUser?.role === 'Admin' ? 'Doctor' : currentPatient?.name || 'Patient'}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {currentUser?.role === 'Admin' && (
          <div className="relative">
            <Button variant="ghost" size="sm" className="relative hover:bg-gray-100 transition-colors">
              <Bell className="h-5 w-5 text-gray-600" />
              {upcomingAppointments.length > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs rounded-full border-2 border-white">
                  {upcomingAppointments.length}
                </Badge>
              )}
            </Button>
          </div>
        )}
        
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-gray-600" />
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900 font-poppins">{currentUser?.email}</p>
            <p className="text-xs text-gray-500 font-inter">{currentUser?.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
};
