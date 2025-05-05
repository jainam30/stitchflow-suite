
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { EmployeeSalary } from '@/types/salary';
import { v4 as uuidv4 } from 'uuid';
import { cn } from "@/lib/utils";

interface AddEmployeeSalaryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mock employees data
const mockEmployees = [
  { id: '1001', name: 'John Doe', salary: 30000 },
  { id: '1002', name: 'Jane Smith', salary: 25000 },
  { id: '1003', name: 'Bob Johnson', salary: 35000 },
];

export const AddEmployeeSalaryDialog: React.FC<AddEmployeeSalaryDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    employeeId: '',
    month: new Date(),
    salary: 0,
    advance: 0,
    netSalary: 0,
  });
  
  const [selectedEmployee, setSelectedEmployee] = useState<typeof mockEmployees[0] | null>(null);
  
  const handleEmployeeChange = (value: string) => {
    const employee = mockEmployees.find(emp => emp.id === value);
    
    if (employee) {
      setSelectedEmployee(employee);
      setFormData(prev => ({
        ...prev,
        employeeId: value,
        salary: employee.salary,
        netSalary: employee.salary - prev.advance,
      }));
    }
  };
  
  const handleMonthChange = (date: Date | undefined) => {
    if (date) {
      setFormData(prev => ({
        ...prev,
        month: date,
      }));
    }
  };
  
  const handleAdvanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const advance = parseFloat(e.target.value) || 0;
    
    setFormData(prev => ({
      ...prev,
      advance,
      netSalary: prev.salary - advance,
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.employeeId || formData.salary <= 0) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields with valid values.",
        variant: "destructive",
      });
      return;
    }
    
    // Create new employee salary record
    const newSalary: EmployeeSalary = {
      id: uuidv4(),
      employeeId: formData.employeeId,
      month: formData.month,
      salary: formData.salary,
      advance: formData.advance,
      netSalary: formData.netSalary,
      paid: false,
    };
    
    // In a real app, you would save this to a database
    console.log('New employee salary record:', newSalary);
    
    toast({
      title: "Success",
      description: "Employee salary record has been added successfully.",
    });
    
    // Reset form and close dialog
    setFormData({
      employeeId: '',
      month: new Date(),
      salary: 0,
      advance: 0,
      netSalary: 0,
    });
    setSelectedEmployee(null);
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Employee Salary</DialogTitle>
          <DialogDescription>
            Create a monthly salary record for an employee.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="employee">Employee</Label>
              <Select
                value={formData.employeeId}
                onValueChange={handleEmployeeChange}
              >
                <SelectTrigger id="employee">
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  {mockEmployees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.name} ({employee.id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="month">Month</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="month"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.month && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.month ? format(formData.month, "MMMM yyyy") : <span>Select month</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.month}
                    onSelect={handleMonthChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="salary">Base Salary (₹)</Label>
              <Input
                id="salary"
                type="number"
                readOnly
                value={formData.salary || ''}
                className="bg-muted"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="advance">Advance Payment (₹)</Label>
              <Input
                id="advance"
                type="number"
                min="0"
                step="0.01"
                placeholder="Enter advance amount"
                value={formData.advance || ''}
                onChange={handleAdvanceChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="netSalary">Net Salary (₹)</Label>
              <Input
                id="netSalary"
                type="number"
                readOnly
                value={formData.netSalary || 0}
                className="bg-muted font-medium"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="submit">Add Salary Record</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
