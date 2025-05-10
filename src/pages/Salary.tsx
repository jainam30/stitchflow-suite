
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmployeeSalaryTable } from '@/components/salary/EmployeeSalaryTable';
import { WorkerSalaryTable } from '@/components/salary/WorkerSalaryTable';
import { AddEmployeeSalaryDialog } from '@/components/salary/AddEmployeeSalaryDialog';
import { AddWorkerSalaryDialog } from '@/components/salary/AddWorkerSalaryDialog';
import { Button } from '@/components/ui/button';
import { PlusCircle, Calculator } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { WorkerSalary } from '@/types/salary';

// Mock data for worker salaries
const initialWorkerSalaries: WorkerSalary[] = [
  {
    id: '1',
    workerId: 'WOR001',
    productId: 'P001',
    date: new Date('2023-04-15'),
    operationId: 'OP001',
    piecesDone: 45,
    amountPerPiece: 5,
    totalAmount: 45 * 5,
    paid: true,
    paidDate: new Date('2023-04-16'),
    paidBy: 'supervisor'
  },
  {
    id: '2',
    workerId: 'WOR002',
    productId: 'P002',
    date: new Date('2023-04-16'),
    operationId: 'OP002',
    piecesDone: 30,
    amountPerPiece: 10,
    totalAmount: 30 * 10,
    paid: true,
    paidDate: new Date('2023-04-17'),
    paidBy: 'admin'
  },
  {
    id: '3',
    workerId: 'WOR001',
    productId: 'P003',
    date: new Date('2023-04-17'),
    operationId: 'OP003',
    piecesDone: 25,
    amountPerPiece: 15,
    totalAmount: 25 * 15,
    paid: false
  }
];

const Salary: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const isAdmin = user?.role === 'admin';
  const [activeTab, setActiveTab] = useState<string>("workers");
  const [isAddEmployeeSalaryOpen, setIsAddEmployeeSalaryOpen] = useState(false);
  const [isAddWorkerSalaryOpen, setIsAddWorkerSalaryOpen] = useState(false);
  const [workerSalaries, setWorkerSalaries] = useState<WorkerSalary[]>(initialWorkerSalaries);
  
  // Function to add a new worker salary record
  const addWorkerSalary = (newSalary: WorkerSalary) => {
    setWorkerSalaries(prev => [...prev, newSalary]);
    toast({
      title: "Success",
      description: "Worker salary record has been added successfully.",
    });
  };
  
  // Function to calculate all worker salaries based on their monthly operations
  const calculateAllWorkerSalaries = () => {
    // In a real app, this would fetch from the database and calculate
    // For now, we'll just show a toast message
    toast({
      title: "Salaries Calculated",
      description: "All worker salaries have been calculated based on their monthly operations.",
    });
  };
  
  // Ensure only admin and supervisor can access this page
  if (user?.role !== 'admin' && user?.role !== 'supervisor') {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Salary Management</h1>
        
        {activeTab === "workers" && (
          <Button 
            variant="outline" 
            onClick={calculateAllWorkerSalaries}
            className="mr-2"
          >
            <Calculator className="mr-2 h-4 w-4" /> Calculate All Salaries
          </Button>
        )}
      </div>

      <Tabs defaultValue="workers" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="workers">Workers Salary</TabsTrigger>
            {isAdmin && <TabsTrigger value="employees">Employees Salary</TabsTrigger>}
          </TabsList>
          
          {activeTab === "workers" && (
            <Button onClick={() => setIsAddWorkerSalaryOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Worker Salary
            </Button>
          )}
          
          {activeTab === "employees" && isAdmin && (
            <Button onClick={() => setIsAddEmployeeSalaryOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Employee Salary
            </Button>
          )}
        </div>

        <TabsContent value="workers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Workers Salary Records</CardTitle>
              <CardDescription>
                Monthly salary payments to production workers based on operations and piece rates.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <WorkerSalaryTable salaries={workerSalaries} setSalaries={setWorkerSalaries} />
            </CardContent>
          </Card>
        </TabsContent>

        {isAdmin && (
          <TabsContent value="employees" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Employees Salary Records</CardTitle>
                <CardDescription>
                  Manage monthly salary payments to permanent employees.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EmployeeSalaryTable />
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      <AddWorkerSalaryDialog 
        open={isAddWorkerSalaryOpen} 
        onOpenChange={setIsAddWorkerSalaryOpen} 
        onAddSalary={addWorkerSalary}
      />

      {isAdmin && (
        <AddEmployeeSalaryDialog 
          open={isAddEmployeeSalaryOpen} 
          onOpenChange={setIsAddEmployeeSalaryOpen} 
        />
      )}
    </div>
  );
};

export default Salary;
