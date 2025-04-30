
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AddEmployeeDialog } from "@/components/employees/AddEmployeeDialog";
import { EmployeeTable } from "@/components/employees/EmployeeTable";
import { Employee } from '@/types/employee';

// Mock data for initial development
const mockEmployees: Employee[] = [
  {
    id: '1',
    name: 'John Doe',
    employeeId: 'EMP001',
    address: '123 Main St, City',
    permanentAddress: '123 Main St, City',
    currentAddress: '123 Main St, City',
    mobileNumber: '9876543210',
    emergencyNumber: '1234567890',
    idProof: 'AADHAR1234567890',
    idProofImageUrl: '/placeholder.svg',
    bankAccountDetail: 'BANK1234567890',
    bankImageUrl: '/placeholder.svg',
    salary: 25000,
    isActive: true,
    createdBy: 'admin',
    createdAt: new Date('2023-01-15')
  },
  {
    id: '2',
    name: 'Jane Smith',
    employeeId: 'EMP002',
    address: '456 Oak St, Town',
    permanentAddress: '456 Oak St, Town',
    currentAddress: '789 Pine St, Village',
    mobileNumber: '8765432109',
    emergencyNumber: '2345678901',
    idProof: 'AADHAR0987654321',
    idProofImageUrl: '/placeholder.svg',
    bankAccountDetail: 'BANK0987654321',
    bankImageUrl: '/placeholder.svg',
    salary: 30000,
    isActive: false,
    createdBy: 'admin',
    createdAt: new Date('2023-03-10')
  }
];

const Employees: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleAddEmployee = (newEmployee: Employee) => {
    setEmployees([...employees, newEmployee]);
  };

  const handleToggleStatus = (id: string) => {
    setEmployees(employees.map(employee => 
      employee.id === id ? { ...employee, isActive: !employee.isActive } : employee
    ));
  };

  const handleUpdateEmployee = (id: string, updatedEmployee: Partial<Employee>) => {
    setEmployees(employees.map(employee => 
      employee.id === id ? { ...employee, ...updatedEmployee } : employee
    ));
  };

  const filteredEmployees = employees.filter(employee => 
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Employee
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Employee Management</CardTitle>
          <CardDescription>
            View, add, and manage all your company employees here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search employees by name or ID..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <EmployeeTable 
            employees={filteredEmployees} 
            onToggleStatus={handleToggleStatus}
            onUpdateEmployee={handleUpdateEmployee}
          />
        </CardContent>
      </Card>

      <AddEmployeeDialog 
        open={isAddDialogOpen} 
        onOpenChange={setIsAddDialogOpen}
        onAddEmployee={handleAddEmployee}
      />
    </div>
  );
};

export default Employees;
