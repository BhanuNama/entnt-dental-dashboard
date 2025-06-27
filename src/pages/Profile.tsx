
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Phone, Mail, Calendar, Heart } from 'lucide-react';

export const Profile: React.FC = () => {
  const { currentUser, patients, incidents } = useAuth();
  
  const patient = patients.find(p => p.id === currentUser?.patientId);
  
  if (!patient) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Patient profile not found.</p>
      </div>
    );
  }

  const patientIncidents = incidents.filter(i => i.patientId === patient.id);
  const completedTreatments = patientIncidents.filter(i => i.status === 'Completed');
  const upcomingAppointments = patientIncidents.filter(i => i.status === 'Scheduled');
  const totalSpent = completedTreatments.reduce((sum, i) => sum + (i.cost || 0), 0);
  
  const age = new Date().getFullYear() - new Date(patient.dob).getFullYear();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600">View your personal information and treatment history</p>
      </div>

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="h-5 w-5 mr-2" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-medium">{patient.name}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Mail className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email Address</p>
                  <p className="font-medium">{currentUser?.email}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Phone className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Contact Number</p>
                  <p className="font-medium">{patient.contact}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Age</p>
                  <p className="font-medium">{age} years old</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Health Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Heart className="h-5 w-5 mr-2" />
            Health Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700">{patient.healthInfo}</p>
          </div>
        </CardContent>
      </Card>

      {/* Treatment Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Completed Treatments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedTreatments.length}</div>
            <p className="text-xs text-gray-500">Successfully completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{upcomingAppointments.length}</div>
            <p className="text-xs text-gray-500">Scheduled visits</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">${totalSpent}</div>
            <p className="text-xs text-gray-500">On dental treatments</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Treatments */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Treatments</CardTitle>
          <CardDescription>Your latest completed treatments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {completedTreatments.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No completed treatments yet</p>
            ) : (
              completedTreatments.slice(0, 5).map(treatment => {
                const treatmentDate = new Date(treatment.appointmentDate);
                
                return (
                  <div key={treatment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{treatment.title}</p>
                      <p className="text-sm text-gray-600">{treatment.description}</p>
                      {treatment.treatment && (
                        <p className="text-xs text-gray-500 mt-1">{treatment.treatment}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{treatmentDate.toLocaleDateString()}</p>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Completed
                      </Badge>
                      {treatment.cost && (
                        <p className="text-sm text-gray-600 mt-1">${treatment.cost}</p>
                      )}
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
