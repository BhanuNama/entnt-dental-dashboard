
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Calendar, FileText, Upload, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';

export const Appointments: React.FC = () => {
  const { patients, incidents, addIncident, updateIncident, deleteIncident } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIncident, setEditingIncident] = useState<any>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    patientId: '',
    title: '',
    description: '',
    comments: '',
    appointmentDate: '',
    cost: '',
    treatment: '',
    status: 'Scheduled' as const,
    nextDate: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Process file uploads
    const files = await Promise.all(
      selectedFiles.map(async (file) => ({
        name: file.name,
        type: file.type,
        url: await fileToBase64(file)
      }))
    );

    const incidentData = {
      ...formData,
      cost: formData.cost ? parseFloat(formData.cost) : undefined,
      files: editingIncident ? [...(editingIncident.files || []), ...files] : files
    };

    if (editingIncident) {
      updateIncident(editingIncident.id, incidentData);
      toast({
        title: "Appointment Updated",
        description: "Appointment has been updated successfully.",
      });
    } else {
      addIncident(incidentData);
      toast({
        title: "Appointment Scheduled",
        description: "New appointment has been scheduled successfully.",
      });
    }
    
    setIsDialogOpen(false);
    setEditingIncident(null);
    setSelectedFiles([]);
    setFormData({
      patientId: '',
      title: '',
      description: '',
      comments: '',
      appointmentDate: '',
      cost: '',
      treatment: '',
      status: 'Scheduled',
      nextDate: ''
    });
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleEdit = (incident: any) => {
    setEditingIncident(incident);
    setFormData({
      patientId: incident.patientId,
      title: incident.title,
      description: incident.description,
      comments: incident.comments,
      appointmentDate: incident.appointmentDate,
      cost: incident.cost ? incident.cost.toString() : '',
      treatment: incident.treatment || '',
      status: incident.status,
      nextDate: incident.nextDate || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (incidentId: string) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      deleteIncident(incidentId);
      toast({
        title: "Appointment Deleted",
        description: "Appointment has been deleted successfully.",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Scheduled': return 'bg-blue-100 text-blue-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Appointment Management</h1>
          <p className="text-gray-600">Manage patient appointments and treatments</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Schedule Appointment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingIncident ? 'Edit Appointment' : 'Schedule New Appointment'}</DialogTitle>
              <DialogDescription>
                {editingIncident ? 'Update appointment details below.' : 'Enter appointment details below.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="patientId">Patient</Label>
                  <Select value={formData.patientId} onValueChange={(value) => setFormData({ ...formData, patientId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a patient" />
                    </SelectTrigger>
                    <SelectContent>
                      {patients.map((patient) => (
                        <SelectItem key={patient.id} value={patient.id}>
                          {patient.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Routine Cleaning"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Detailed description of the treatment"
                    rows={2}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="appointmentDate">Appointment Date & Time</Label>
                  <Input
                    id="appointmentDate"
                    type="datetime-local"
                    value={formData.appointmentDate}
                    onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Scheduled">Scheduled</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {formData.status === 'Completed' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="cost">Cost ($)</Label>
                      <Input
                        id="cost"
                        type="number"
                        step="0.01"
                        value={formData.cost}
                        onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                        placeholder="0.00"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="treatment">Treatment Details</Label>
                      <Textarea
                        id="treatment"
                        value={formData.treatment}
                        onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                        placeholder="Details of the treatment provided"
                        rows={2}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="nextDate">Next Appointment (Optional)</Label>
                      <Input
                        id="nextDate"
                        type="datetime-local"
                        value={formData.nextDate}
                        onChange={(e) => setFormData({ ...formData, nextDate: e.target.value })}
                      />
                    </div>
                  </>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="comments">Comments</Label>
                  <Textarea
                    id="comments"
                    value={formData.comments}
                    onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                    placeholder="Additional comments or notes"
                    rows={2}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="files">Upload Files (Optional)</Label>
                  <Input
                    id="files"
                    type="file"
                    multiple
                    accept="image/*,.pdf,.doc,.docx"
                    onChange={(e) => setSelectedFiles(Array.from(e.target.files || []))}
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-gray-500">Upload invoices, X-rays, or other treatment files</p>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  {editingIncident ? 'Update Appointment' : 'Schedule Appointment'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Appointments</CardTitle>
          <CardDescription>Overview of all scheduled and completed appointments</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Treatment</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Files</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {incidents.map((incident) => {
                const patient = patients.find(p => p.id === incident.patientId);
                const appointmentDate = new Date(incident.appointmentDate);
                
                return (
                  <TableRow key={incident.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{patient?.name}</p>
                        <p className="text-sm text-gray-500">{patient?.contact}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{incident.title}</p>
                        <p className="text-sm text-gray-500">{incident.description}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{appointmentDate.toLocaleDateString()}</p>
                        <p className="text-sm text-gray-500">{appointmentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(incident.status)}>
                        {incident.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {incident.cost ? `$${incident.cost}` : '-'}
                    </TableCell>
                    <TableCell>
                      {incident.files && incident.files.length > 0 ? (
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-1" />
                          <span className="text-sm">{incident.files.length} file(s)</span>
                        </div>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(incident)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(incident.id)}
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
