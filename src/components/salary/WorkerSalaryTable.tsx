
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
import { MoreHorizontal, CalendarDays } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { WorkerSalary } from "@/types/salary";
import { format } from 'date-fns';

// Mock data for worker salaries
const mockWorkerSalaries: WorkerSalary[] = [
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

export const WorkerSalaryTable: React.FC = () => {
  const [salaries, setSalaries] = useState<WorkerSalary[]>(mockWorkerSalaries);
  const [month, setMonth] = useState<string>(new Date().getMonth().toString());
  const [year, setYear] = useState<string>(new Date().getFullYear().toString());
  
  const markAsPaid = (id: string) => {
    setSalaries(prevSalaries => prevSalaries.map(salary => 
      salary.id === id ? { 
        ...salary, 
        paid: true,
        paidDate: new Date(),
        paidBy: 'admin' // or use the current user's role
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

  // Filter salaries based on selected month and year
  const filteredSalaries = salaries.filter(salary => {
    const salaryDate = new Date(salary.date);
    return (
      salaryDate.getMonth() === parseInt(month) &&
      salaryDate.getFullYear() === parseInt(year)
    );
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 opacity-50" />
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
              <TableHead>Worker ID</TableHead>
              <TableHead>Product ID</TableHead>
              <TableHead>Operation</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Pieces</TableHead>
              <TableHead className="text-right">Rate (₹)</TableHead>
              <TableHead className="text-right">Total (₹)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSalaries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  No salary records found for the selected period
                </TableCell>
              </TableRow>
            ) : (
              filteredSalaries.map((salary) => (
                <TableRow key={salary.id}>
                  <TableCell>{salary.workerId}</TableCell>
                  <TableCell>{salary.productId}</TableCell>
                  <TableCell>{salary.operationId}</TableCell>
                  <TableCell>{format(salary.date, 'dd/MM/yyyy')}</TableCell>
                  <TableCell className="text-right">{salary.piecesDone}</TableCell>
                  <TableCell className="text-right">₹{salary.amountPerPiece}</TableCell>
                  <TableCell className="text-right font-medium">₹{salary.totalAmount}</TableCell>
                  <TableCell>
                    <Badge variant={salary.paid ? "success" : "outline"} className={salary.paid ? "bg-green-100 text-green-800" : ""}>
                      {salary.paid ? 'Paid' : 'Pending'}
                    </Badge>
                  </TableCell>
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
