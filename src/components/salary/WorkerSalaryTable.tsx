
import React, { useState, useEffect } from 'react';
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

// Mock data for workers
const mockWorkers = [
  { id: 'WOR001', name: 'Ramesh Kumar' },
  { id: 'WOR002', name: 'Suresh Singh' },
  { id: 'WOR003', name: 'Manoj Verma' },
];

interface WorkerSalaryTableProps {
  salaries: WorkerSalary[];
  setSalaries: React.Dispatch<React.SetStateAction<WorkerSalary[]>>;
}

export const WorkerSalaryTable: React.FC<WorkerSalaryTableProps> = ({ salaries, setSalaries }) => {
  const [month, setMonth] = useState<string>(new Date().getMonth().toString());
  const [year, setYear] = useState<string>(new Date().getFullYear().toString());
  const [aggregatedSalaries, setAggregatedSalaries] = useState<any[]>([]);
  
  // Calculate aggregated salaries by worker when month, year, or salaries change
  useEffect(() => {
    const selectedMonth = parseInt(month);
    const selectedYear = parseInt(year);
    
    // Filter salaries for selected month and year
    const filteredSalaries = salaries.filter(salary => {
      const salaryDate = new Date(salary.date);
      return (
        salaryDate.getMonth() === selectedMonth &&
        salaryDate.getFullYear() === selectedYear
      );
    });
    
    // Aggregate by worker
    const workerSalaryMap = new Map();
    
    filteredSalaries.forEach(salary => {
      if (!workerSalaryMap.has(salary.workerId)) {
        const worker = mockWorkers.find(w => w.id === salary.workerId);
        workerSalaryMap.set(salary.workerId, {
          workerId: salary.workerId,
          workerName: worker ? worker.name : 'Unknown Worker',
          totalPieces: 0,
          totalAmount: 0,
          operations: [],
          paid: true
        });
      }
      
      const workerData = workerSalaryMap.get(salary.workerId);
      workerData.totalPieces += salary.piecesDone;
      workerData.totalAmount += salary.totalAmount;
      workerData.paid = workerData.paid && salary.paid;
      workerData.operations.push({
        productId: salary.productId,
        operationId: salary.operationId,
        piecesDone: salary.piecesDone,
        amount: salary.totalAmount
      });
    });
    
    setAggregatedSalaries(Array.from(workerSalaryMap.values()));
  }, [month, year, salaries]);
  
  const markAsPaid = (workerId: string) => {
    setSalaries(prevSalaries => prevSalaries.map(salary => 
      salary.workerId === workerId && !salary.paid ? { 
        ...salary, 
        paid: true,
        paidDate: new Date(),
        paidBy: 'admin' // or use the current user's role
      } : salary
    ));
  };

  const handleDeleteSalary = (workerId: string) => {
    setSalaries(prevSalaries => prevSalaries.filter(salary => salary.workerId !== workerId));
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
              <TableHead>Worker Name</TableHead>
              <TableHead className="text-right">Total Pieces</TableHead>
              <TableHead className="text-right">Total Amount (₹)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {aggregatedSalaries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No salary records found for the selected period
                </TableCell>
              </TableRow>
            ) : (
              aggregatedSalaries.map((workerSalary) => (
                <TableRow key={workerSalary.workerId}>
                  <TableCell>{workerSalary.workerId}</TableCell>
                  <TableCell>{workerSalary.workerName}</TableCell>
                  <TableCell className="text-right">{workerSalary.totalPieces}</TableCell>
                  <TableCell className="text-right font-medium">₹{workerSalary.totalAmount}</TableCell>
                  <TableCell>
                    <Badge variant={workerSalary.paid ? "success" : "outline"} className={workerSalary.paid ? "bg-green-100 text-green-800" : ""}>
                      {workerSalary.paid ? 'Paid' : 'Pending'}
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
                        {!workerSalary.paid && (
                          <DropdownMenuItem
                            onClick={() => markAsPaid(workerSalary.workerId)}
                            className="cursor-pointer"
                          >
                            Mark as Paid
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => handleDeleteSalary(workerSalary.workerId)}
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
