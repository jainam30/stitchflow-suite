
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Calendar, Calendar as CalendarIcon } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { EmployeeSalary } from "@/types/salary";
import { format } from 'date-fns';

// Mock data for employee salaries
const mockEmployeeSalaries: EmployeeSalary[] = [
  {
    id: '1',
    employeeId: '1001',
    month: new Date('2023-04-01'),
    salary: 30000,
    advance: 5000,
    netSalary: 25000,
    paid: true,
    paidDate: new Date('2023-04-30'),
    paidBy: 'admin'
  },
  {
    id: '2',
    employeeId: '1002',
    month: new Date('2023-04-01'),
    salary: 25000,
    advance: 0,
    netSalary: 25000,
    paid: true,
    paidDate: new Date('2023-04-30'),
    paidBy: 'admin'
  },
  {
    id: '3',
    employeeId: '1003',
    month: new Date('2023-04-01'),
    salary: 35000,
    advance: 10000,
    netSalary: 25000,
    paid: false
  },
];

export const EmployeeSalaryTable: React.FC = () => {
  const [salaries, setSalaries] = useState<EmployeeSalary[]>(mockEmployeeSalaries);
  const [year, setYear] = useState<string>(new Date().getFullYear().toString());
  const [month, setMonth] = useState<string>(new Date().getMonth().toString());

  const markAsPaid = (id: string) => {
    setSalaries(prevSalaries => prevSalaries.map(salary => 
      salary.id === id ? { 
        ...salary, 
        paid: true,
        paidDate: new Date(),
        paidBy: 'admin' 
      } : salary
    ));
  };

  const handleDeleteSalary = (id: string) => {
    setSalaries(prevSalaries => prevSalaries.filter(salary => salary.id !== id));
  };

  const months = [
    { value: '0', label: 'January' },
    { value: '1', label: 'February' },
    { value: '2', label: 'March' },
    { value: '3', label: 'April' },
    { value: '4', label: 'May' },
    { value: '5', label: 'June' },
    { value: '6', label: 'July' },
    { value: '7', label: 'August' },
    { value: '8', label: 'September' },
    { value: '9', label: 'October' },
    { value: '10', label: 'November' },
    { value: '11', label: 'December' },
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => (currentYear - 2 + i).toString());

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-4 w-4 opacity-50" />
          <Select value={month} onValueChange={setMonth}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              {months.map(m => (
                <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Select value={year} onValueChange={setYear}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Select year" />
          </SelectTrigger>
          <SelectContent>
            {years.map(y => (
              <SelectItem key={y} value={y}>{y}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee ID</TableHead>
              <TableHead>Month</TableHead>
              <TableHead className="text-right">Base Salary (₹)</TableHead>
              <TableHead className="text-right">Advance (₹)</TableHead>
              <TableHead className="text-right">Net Salary (₹)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {salaries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No salary records found
                </TableCell>
              </TableRow>
            ) : (
              salaries.map((salary) => (
                <TableRow key={salary.id}>
                  <TableCell>{salary.employeeId}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {format(salary.month, 'MMM yyyy')}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">₹{salary.salary.toLocaleString()}</TableCell>
                  <TableCell className="text-right">₹{salary.advance.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-medium">₹{salary.netSalary.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={salary.paid ? "success" : "outline"} className={salary.paid ? "bg-green-100 text-green-800" : ""}>
                      {salary.paid ? 'Paid' : 'Pending'}
                    </Badge>
                  </TableCell>
                  <TableCell>{salary.paidDate ? format(salary.paidDate, 'dd/MM/yyyy') : '-'}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => {}}
                          className="cursor-pointer"
                        >
                          View Details
                        </DropdownMenuItem>
                        {!salary.paid && (
                          <DropdownMenuItem
                            onClick={() => markAsPaid(salary.id)}
                            className="cursor-pointer"
                          >
                            Mark as Paid
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => {}}
                          className="cursor-pointer"
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteSalary(salary.id)}
                          className="cursor-pointer text-destructive"
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
