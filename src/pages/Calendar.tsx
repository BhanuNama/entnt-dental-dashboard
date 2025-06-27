
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Clock, User } from 'lucide-react';

export const Calendar: React.FC = () => {
  const { incidents, patients } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    for (let i = 0; i < 42; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const getAppointmentsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return incidents.filter(incident => {
      const appointmentDate = new Date(incident.appointmentDate);
      return appointmentDate.toISOString().split('T')[0] === dateString && incident.status === 'Scheduled';
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const days = getDaysInMonth(currentDate);
  const monthYear = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Calendar View</h1>
        <p className="text-gray-600">View scheduled appointments by date</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">{monthYear}</CardTitle>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                Today
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <CardDescription>Click on any day to view scheduled treatments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-2 text-center font-medium text-gray-500 text-sm">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              const isCurrentMonth = day.getMonth() === currentDate.getMonth();
              const isToday = day.toDateString() === new Date().toDateString();
              const appointments = getAppointmentsForDate(day);
              
              return (
                <div
                  key={index}
                  className={`
                    min-h-[100px] p-2 border border-gray-200 rounded-lg
                    ${isCurrentMonth ? 'bg-white' : 'bg-gray-50'}
                    ${isToday ? 'ring-2 ring-blue-500' : ''}
                    hover:bg-gray-50 transition-colors cursor-pointer
                  `}
                >
                  <div className={`
                    text-sm font-medium mb-1
                    ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
                    ${isToday ? 'text-blue-600' : ''}
                  `}>
                    {day.getDate()}
                  </div>
                  
                  <div className="space-y-1">
                    {appointments.slice(0, 2).map(appointment => {
                      const patient = patients.find(p => p.id === appointment.patientId);
                      const time = new Date(appointment.appointmentDate).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      });
                      
                      return (
                        <div
                          key={appointment.id}
                          className="p-1 bg-blue-100 rounded text-xs text-blue-800 truncate"
                          title={`${time} - ${patient?.name}: ${appointment.title}`}
                        >
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span className="font-medium">{time}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <User className="h-3 w-3" />
                            <span className="truncate">{patient?.name}</span>
                          </div>
                        </div>
                      );
                    })}
                    {appointments.length > 2 && (
                      <div className="text-xs text-gray-500 text-center">
                        +{appointments.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Today's Appointments */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Appointments</CardTitle>
          <CardDescription>Scheduled treatments for today</CardDescription>
        </CardHeader>
        <CardContent>
          {(() => {
            const todayAppointments = getAppointmentsForDate(new Date());
            
            if (todayAppointments.length === 0) {
              return (
                <p className="text-gray-500 text-center py-4">No appointments scheduled for today</p>
              );
            }
            
            return (
              <div className="space-y-4">
                {todayAppointments.map(appointment => {
                  const patient = patients.find(p => p.id === appointment.patientId);
                  const appointmentTime = new Date(appointment.appointmentDate);
                  
                  return (
                    <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{patient?.name}</p>
                          <p className="text-sm text-gray-600">{appointment.title}</p>
                          <p className="text-xs text-gray-500">{appointment.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{appointmentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        <Badge variant="outline">{appointment.status}</Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </CardContent>
      </Card>
    </div>
  );
};
