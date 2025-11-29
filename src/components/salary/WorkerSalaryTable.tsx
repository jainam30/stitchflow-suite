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
import { WorkerSalary, ProductionOperation } from "@/types/salary";
import { format } from 'date-fns';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { markWorkerSalariesPaid } from '@/Services/salaryService';
import { Production } from '@/types/production';

import WorkerOperationDetailDialog, { OperationDetail } from "@/components/salary/WorkerOPerationDetailDialog";
import { getWorkerOperations } from "@/Services/salaryService";
// Rely on DB-backed `salaries` and optional `workerName` provided on each salary row

interface WorkerSalaryTableProps {
  salaries: WorkerSalary[];
  setSalaries: React.Dispatch<React.SetStateAction<WorkerSalary[]>>;
  productions?: Production[];
}


export const WorkerSalaryTable: React.FC<WorkerSalaryTableProps> = ({
  salaries,
  setSalaries,
  productions = []
}) => {
  const [month, setMonth] = useState<string>(new Date().getMonth().toString());
  const [year, setYear] = useState<string>(new Date().getFullYear().toString());
  const [aggregatedSalaries, setAggregatedSalaries] = useState<any[]>([]);
  const isMobile = useIsMobile();

  useEffect(() => {
    console.log("Debug salaries:", salaries);
  }, [salaries]);

  // No automatic/mock salary generation here — rely on DB-backed `salaries` prop

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
        workerSalaryMap.set(salary.workerId, {
          workerId: salary.workerId,
          workerName: salary.workerName || 'Unknown Worker',
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

      const prodName = productions.find(p => p.id === salary.productId)?.productName || 'Unknown Product';
      const opName = salary.operationName || 'Unknown Operation';

      workerData.operations.push({
        productId: salary.productId,
        productName: prodName,
        operationId: salary.operationId,
        operationName: opName,
        piecesDone: salary.piecesDone,
        amount: salary.totalAmount
      });
    });

    setAggregatedSalaries(Array.from(workerSalaryMap.values()));
  }, [month, year, salaries, productions]);

  const { toast } = useToast();
  const { user } = useAuth();

  const markAsPaid = async (workerId: string) => {
    try {
      const selectedMonth = parseInt(month);
      const selectedYear = parseInt(year);

      // UUID checker
      const isUuid = (v: string) =>
        /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/.test(v);

      // FIRST define idsToMark (your error was using it BEFORE this line)
      const idsToMark = salaries
        .filter((s) => s.workerId === workerId)
        .filter((s) => {
          const d = new Date(s.date);
          return (
            d.getMonth() === selectedMonth &&
            d.getFullYear() === selectedYear &&
            !s.paid
          );
        })
        .map((s) => s.id);

      console.log("DEBUG → idsToMark:", idsToMark);

      if (idsToMark.length === 0) {
        toast({
          title: "Nothing to mark",
          description: "No unpaid salaries found for this worker.",
        });
        return;
      }

      const validIds = idsToMark.filter((id) => isUuid(id));

      console.log("DEBUG → validIds:", validIds);

      if (validIds.length === 0) {
        toast({
          title: "UUID Error",
          description: "No valid salary UUIDs found.",
          variant: "destructive",
        });
        return;
      }

      const result = await markWorkerSalariesPaid(validIds);

      if (result.error) {
        toast({
          title: "Update Failed",
          description: result.error.message,
          variant: "destructive",
        });
        return;
      }

      // Update UI
      setSalaries((prev) =>
        prev.map((s) =>
          validIds.includes(s.id)
            ? { ...s, paid: true, paidDate: new Date() }
            : s
        )
      );

      toast({
        title: "Success",
        description: `${validIds.length} salary records marked as paid.`,
      });
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Error",
        description: err.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };


  const [detailOpen, setDetailOpen] = useState(false);
    const [detailLoading, setDetailLoading] = useState(false);
    const [detailError, setDetailError] = useState<string | null>(null);
    const [detailOperations, setDetailOperations] = useState<OperationDetail[]>([]);
    const [detailWorkerName, setDetailWorkerName] = useState<string | undefined>();
  
    const openDetails = async (employeeId: string) => {
      setDetailError(null);
      setDetailOperations([]);
      setDetailLoading(true);
  
      try {
        // pass currently selected month/year to fetch scoped operations
        const monthNum = Number(month);
        const yearNum = Number(year);
        const ops = await getWorkerOperations(employeeId, monthNum, yearNum);
        setDetailOperations(ops);
        setDetailWorkerName(employeeId);
        setDetailOpen(true);
      } catch (err: any) {
        console.error("Failed to load operations:", err);
        setDetailError(err?.message ?? "Failed to load operations");
        // show dialog even on error so user sees message (optional)
        setDetailWorkerName(employeeId);
        setDetailOpen(true);
      } finally {
        setDetailLoading(false);
      }
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
      <div className={`flex ${isMobile ? "flex-col" : "items-center"} gap-2`}>
        <div className={`flex items-center gap-2 ${isMobile ? "w-full" : ""}`}>
          <CalendarDays className="h-4 w-4 opacity-50 flex-shrink-0" />
          <Select value={month} onValueChange={setMonth}>
            <SelectTrigger className={`${isMobile ? "w-full" : "w-[150px]"}`}>
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
          <SelectTrigger className={`${isMobile ? "w-full" : "w-[100px]"}`}>
            <SelectValue placeholder="Select year" />
          </SelectTrigger>
          <SelectContent>
            {years.map(y => (
              <SelectItem key={y} value={y}>{y}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Worker</TableHead>
              <TableHead className={`${isMobile ? "" : "text-right"}`}>Pieces</TableHead>
              <TableHead className="text-right">Amount (₹)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {aggregatedSalaries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No salary records found for the selected period
                </TableCell>
              </TableRow>
            ) : (
              aggregatedSalaries.map((workerSalary) => (
                <TableRow key={workerSalary.workerId}>
                  <TableCell className="font-medium">{workerSalary.workerName}</TableCell>
                  <TableCell className={`${isMobile ? "" : "text-right"}`}>{workerSalary.totalPieces}</TableCell>
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
                          onClick={() => openDetails(workerSalary.workerId)}
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
      <WorkerOperationDetailDialog
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        operations={detailOperations}
        workerName={detailWorkerName}
      />
    </div>
  );
};
