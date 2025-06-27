
import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Header: React.FC = () => {
  const { currentUser, incidents, patients } = useAuth();
  
  const upcomingAppointments = incidents.filter(incident => {
    const appointmentDate = new Date(incident.appointmentDate);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return appointmentDate >= today && appointmentDate <= tomorrow && incident.status === 'Scheduled';
  });

  return (
    <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <SidebarTrigger className="text-gray-600 hover:text-gray-900" />
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            {currentUser?.role === 'Admin' ? 'Dental Center Dashboard' : 'Patient Portal'}
          </h1>
          <p className="text-sm text-gray-500">
            Welcome back, {currentUser?.role === 'Admin' ? 'Doctor' : 'Patient'}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {currentUser?.role === 'Admin' && (
          <div className="relative">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5 text-gray-600" />
              {upcomingAppointments.length > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {upcomingAppointments.length}
                </span>
              )}
            </Button>
          </div>
        )}
        
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900">{currentUser?.email}</p>
          <p className="text-xs text-gray-500">{currentUser?.role}</p>
        </div>
      </div>
    </header>
  );
};
