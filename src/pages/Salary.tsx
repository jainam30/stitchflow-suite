
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmployeeSalaryTable } from '@/components/salary/EmployeeSalaryTable';
import { WorkerSalaryTable } from '@/components/salary/WorkerSalaryTable';
import { AddEmployeeSalaryDialog } from '@/components/salary/AddEmployeeSalaryDialog';
import { AddWorkerSalaryDialog } from '@/components/salary/AddWorkerSalaryDialog';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { format } from 'date-fns';

const Salary: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [activeTab, setActiveTab] = useState<string>("workers");
  const [isAddEmployeeSalaryOpen, setIsAddEmployeeSalaryOpen] = useState(false);
  const [isAddWorkerSalaryOpen, setIsAddWorkerSalaryOpen] = useState(false);
  
  // Ensure only admin and supervisor can access this page
  if (user?.role !== 'admin' && user?.role !== 'supervisor') {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Salary Management</h1>
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
                Manage and track salary payments to production workers based on operations and daily work.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <WorkerSalaryTable />
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
