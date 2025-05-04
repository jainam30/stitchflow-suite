
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AddWorkerDialog } from "@/components/workers/AddWorkerDialog";
import { WorkerTable } from "@/components/workers/WorkerTable";
import { Worker } from '@/types/worker';

// Mock data for initial development
const mockWorkers: Worker[] = [
  {
    id: '1',
    name: 'Ramesh Kumar',
    workerId: 'WOR001',
    address: '123 Worker Colony, City',
    mobileNumber: '8765432109',
    emergencyNumber: '9876543210',
    idProof: 'AADHAR1122334455',
    bankAccountDetail: 'BANK9988776655',
    bankImageUrl: '/placeholder.svg',
    createdBy: 'supervisor',
    createdAt: new Date('2023-01-10')
  },
  {
    id: '2',
    name: 'Suresh Singh',
    workerId: 'WOR002',
    address: '456 Worker Housing, Town',
    mobileNumber: '7654321098',
    emergencyNumber: '8765432109',
    idProof: 'AADHAR5566778899',
    bankAccountDetail: 'BANK1122334455',
    bankImageUrl: '/placeholder.svg',
    createdBy: 'admin',
    createdAt: new Date('2023-02-15')
  }
];

const Workers: React.FC = () => {
  const [workers, setWorkers] = useState<Worker[]>(mockWorkers);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleAddWorker = (newWorker: Worker) => {
    setWorkers([...workers, newWorker]);
  };

  const handleUpdateWorker = (id: string, updatedWorker: Partial<Worker>) => {
    setWorkers(workers.map(worker => 
      worker.id === id ? { ...worker, ...updatedWorker } : worker
    ));
  };

  const filteredWorkers = workers.filter(worker => 
    worker.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    worker.workerId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Workers</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Worker
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Worker Management</CardTitle>
          <CardDescription>
            View, add, and manage all your production workers here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search workers by name or ID..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <WorkerTable 
            workers={filteredWorkers} 
            onUpdateWorker={handleUpdateWorker}
          />
        </CardContent>
      </Card>

      <AddWorkerDialog 
        open={isAddDialogOpen} 
        onOpenChange={setIsAddDialogOpen}
        onAddWorker={handleAddWorker}
      />
    </div>
  );
};

export default Workers;
