
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, User, Trash2, Calendar } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';

export const Patients: React.FC = () => {
  const { patients, incidents, addPatient, updatePatient, deletePatient } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    contact: '',
    healthInfo: '',
    email: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingPatient) {
      updatePatient(editingPatient.id, formData);
      toast({
        title: "Patient Updated",
        description: "Patient information has been updated successfully.",
      });
    } else {
      addPatient(formData);
      toast({
        title: "Patient Added",
        description: "New patient has been added successfully.",
      });
    }
    
    setIsDialogOpen(false);
    setEditingPatient(null);
    setFormData({ name: '', dob: '', contact: '', healthInfo: '', email: '' });
  };

  const handleEdit = (patient: any) => {
    setEditingPatient(patient);
    setFormData({
      name: patient.name,
      dob: patient.dob,
      contact: patient.contact,
      healthInfo: patient.healthInfo,
      email: patient.email || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (patientId: string) => {
    if (window.confirm('Are you sure you want to delete this patient? This will also delete all their appointments.')) {
      deletePatient(patientId);
      toast({
        title: "Patient Deleted",
        description: "Patient and all associated appointments have been deleted.",
      });
    }
  };

  const getPatientStats = (patientId: string) => {
    const patientIncidents = incidents.filter(i => i.patientId === patientId);
    const completed = patientIncidents.filter(i => i.status === 'Completed').length;
    const upcoming = patientIncidents.filter(i => i.status === 'Scheduled').length;
    const totalSpent = patientIncidents
      .filter(i => i.cost)
      .reduce((sum, i) => sum + (i.cost || 0), 0);
    
    return { completed, upcoming, totalSpent };
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Patient Management</h1>
          <p className="text-gray-600">Manage patient records and information</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Patient
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingPatient ? 'Edit Patient' : 'Add New Patient'}</DialogTitle>
              <DialogDescription>
                {editingPatient ? 'Update patient information below.' : 'Enter patient information below.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter patient's full name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter email address"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input
                    id="dob"
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact">Contact Number</Label>
                  <Input
                    id="contact"
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    placeholder="Enter contact number"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="healthInfo">Health Information</Label>
                  <Textarea
                    id="healthInfo"
                    value={formData.healthInfo}
                    onChange={(e) => setFormData({ ...formData, healthInfo: e.target.value })}
                    placeholder="Enter health information, allergies, etc."
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  {editingPatient ? 'Update Patient' : 'Add Patient'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Patient Records</CardTitle>
          <CardDescription>Overview of all registered patients</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Appointments</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.map((patient) => {
                const stats = getPatientStats(patient.id);
                const age = new Date().getFullYear() - new Date(patient.dob).getFullYear();
                
                return (
                  <TableRow key={patient.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{patient.name}</p>
                          <p className="text-sm text-gray-500">{patient.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{patient.contact}</TableCell>
                    <TableCell>{age} years</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Badge variant="secondary">{stats.completed} Completed</Badge>
                        <Badge variant="outline">{stats.upcoming} Upcoming</Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">${stats.totalSpent}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(patient)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(patient.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
