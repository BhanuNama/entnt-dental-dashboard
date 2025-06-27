
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Phone, Mail, Calendar, Heart, MapPin, CreditCard, FileText, Clock } from 'lucide-react';

export const Profile: React.FC = () => {
  const { currentUser, patients, incidents } = useAuth();
  
  const patient = patients.find(p => p.id === currentUser?.patientId);
  
  if (!patient) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
            <User className="h-8 w-8 text-gray-400" />
          </div>
          <div>
            <h3 className="text-lg font-poppins font-semibold text-gray-700">Profile Not Found</h3>
            <p className="text-gray-500 text-sm">Unable to load patient profile information.</p>
          </div>
        </div>
      </div>
    );
  }

  const patientIncidents = incidents.filter(i => i.patientId === patient.id);
  const completedTreatments = patientIncidents.filter(i => i.status === 'Completed');
  const upcomingAppointments = patientIncidents.filter(i => i.status === 'Scheduled');
  const totalSpent = completedTreatments.reduce((sum, i) => sum + (i.cost || 0), 0);
  
  const age = new Date().getFullYear() - new Date(patient.dob).getFullYear();

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="relative">
        <div className="dental-gradient h-32 rounded-2xl"></div>
        <div className="absolute -bottom-6 left-8">
          <div className="w-24 h-24 bg-white rounded-2xl shadow-lg flex items-center justify-center border-4 border-white">
            <User className="h-12 w-12 text-primary" />
          </div>
        </div>
        <div className="pt-8 pl-40">
          <h1 className="text-3xl font-poppins font-bold text-gray-900">{patient.name}</h1>
          <p className="text-gray-600 font-inter">Patient Profile & Health Information</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
        <Card className="card-hover border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-green-600 font-poppins">{completedTreatments.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Upcoming</p>
                <p className="text-3xl font-bold text-blue-600 font-poppins">{upcomingAppointments.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-3xl font-bold text-purple-600 font-poppins">${totalSpent}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Age</p>
                <p className="text-3xl font-bold text-orange-600 font-poppins">{age}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Personal Information */}
        <div className="lg:col-span-2">
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center font-poppins">
                <User className="h-5 w-5 mr-2 text-primary" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 font-inter">Full Name</p>
                    <p className="text-lg font-semibold text-gray-900 font-poppins">{patient.name}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                    <Mail className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 font-inter">Email Address</p>
                    <p className="text-lg font-semibold text-gray-900 font-inter">{currentUser?.email}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                    <Phone className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 font-inter">Contact Number</p>
                    <p className="text-lg font-semibold text-gray-900 font-inter">{patient.contact}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 font-inter">Date of Birth</p>
                    <p className="text-lg font-semibold text-gray-900 font-inter">
                      {new Date(patient.dob).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Health Information */}
        <div>
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center font-poppins">
                <Heart className="h-5 w-5 mr-2 text-red-500" />
                Health Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-br from-red-50 to-pink-50 p-6 rounded-xl border border-red-100">
                <p className="text-gray-700 font-inter leading-relaxed">{patient.healthInfo}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Treatments */}
      <Card className="card-hover">
        <CardHeader>
          <CardTitle className="font-poppins">Recent Treatments</CardTitle>
          <CardDescription className="font-inter">Your latest completed treatments and procedures</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {completedTreatments.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-500 font-inter">No completed treatments yet</p>
                <p className="text-sm text-gray-400 font-inter">Your treatment history will appear here</p>
              </div>
            ) : (
              completedTreatments.slice(0, 10).map(treatment => {
                const treatmentDate = new Date(treatment.appointmentDate);
                
                return (
                  <div key={treatment.id} className="group p-6 bg-gray-50 hover:bg-white border border-gray-100 hover:border-gray-200 rounded-xl transition-all duration-200 hover:shadow-md">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 font-poppins mb-1">{treatment.title}</h4>
                        <p className="text-sm text-gray-600 font-inter mb-2">{treatment.description}</p>
                        {treatment.treatment && (
                          <p className="text-xs text-gray-500 bg-white px-3 py-1 rounded-full inline-block font-inter">
                            {treatment.treatment}
                          </p>
                        )}
                      </div>
                      <div className="text-right space-y-2">
                        <p className="text-sm font-medium text-gray-900 font-inter">
                          {treatmentDate.toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                          Completed
                        </Badge>
                        {treatment.cost && (
                          <p className="text-lg font-bold text-primary font-poppins">${treatment.cost}</p>
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
