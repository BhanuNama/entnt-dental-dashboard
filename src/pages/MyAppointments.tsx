
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, FileText, Download } from 'lucide-react';

export const MyAppointments: React.FC = () => {
  const { currentUser, incidents } = useAuth();
  
  const myIncidents = incidents.filter(i => i.patientId === currentUser?.patientId);
  const upcomingAppointments = myIncidents.filter(i => i.status === 'Scheduled');
  const pastAppointments = myIncidents.filter(i => i.status === 'Completed');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Scheduled': return 'bg-blue-100 text-blue-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const downloadFile = (file: { name: string; url: string }) => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
        <p className="text-gray-600">View your upcoming and past dental appointments</p>
      </div>

      {/* Upcoming Appointments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Upcoming Appointments
          </CardTitle>
          <CardDescription>Your scheduled dental visits</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingAppointments.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No upcoming appointments</p>
            ) : (
              upcomingAppointments.map(appointment => {
                const appointmentDate = new Date(appointment.appointmentDate);
                
                return (
                  <div key={appointment.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-lg">{appointment.title}</h3>
                          <Badge className={getStatusColor(appointment.status)}>
                            {appointment.status}
                          </Badge>
                        </div>
                        
                        <p className="text-gray-600 mb-2">{appointment.description}</p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {appointmentDate.toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {appointmentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                        
                        {appointment.comments && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-700">
                              <strong>Notes:</strong> {appointment.comments}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Past Appointments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Treatment History
          </CardTitle>
          <CardDescription>Your completed dental treatments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pastAppointments.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No completed treatments yet</p>
            ) : (
              pastAppointments.map(appointment => {
                const appointmentDate = new Date(appointment.appointmentDate);
                
                return (
                  <div key={appointment.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-lg">{appointment.title}</h3>
                          <Badge className={getStatusColor(appointment.status)}>
                            {appointment.status}
                          </Badge>
                        </div>
                        
                        <p className="text-gray-600 mb-2">{appointment.description}</p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {appointmentDate.toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {appointmentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          {appointment.cost && (
                            <div className="font-medium text-green-600">
                              Cost: ${appointment.cost}
                            </div>
                          )}
                        </div>
                        
                        {appointment.treatment && (
                          <div className="mb-3 p-3 bg-green-50 rounded-lg">
                            <p className="text-sm text-green-800">
                              <strong>Treatment:</strong> {appointment.treatment}
                            </p>
                          </div>
                        )}
                        
                        {appointment.comments && (
                          <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-700">
                              <strong>Notes:</strong> {appointment.comments}
                            </p>
                          </div>
                        )}
                        
                        {appointment.files && appointment.files.length > 0 && (
                          <div className="mb-3">
                            <p className="text-sm font-medium text-gray-700 mb-2">Attached Files:</p>
                            <div className="flex flex-wrap gap-2">
                              {appointment.files.map((file, index) => (
                                <Button
                                  key={index}
                                  variant="outline"
                                  size="sm"
                                  onClick={() => downloadFile(file)}
                                  className="text-blue-600 hover:text-blue-700"
                                >
                                  <Download className="h-4 w-4 mr-1" />
                                  {file.name}
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {appointment.nextDate && (
                          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-800">
                              <strong>Next Appointment:</strong> {new Date(appointment.nextDate).toLocaleDateString()} at {new Date(appointment.nextDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
