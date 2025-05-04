
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';

interface WorkerOperation {
  id: string;
  productName: string;
  operationName: string;
  date: Date;
  piecesDone: number;
  ratePerPiece: number;
  totalEarning: number;
}

// Mock data for worker operations
const generateMockOperations = (workerId: string): WorkerOperation[] => [
  {
    id: '1',
    productName: 'Summer Shirt 2025',
    operationName: 'Cutting',
    date: new Date('2023-04-15'),
    piecesDone: 45,
    ratePerPiece: 5,
    totalEarning: 45 * 5
  },
  {
    id: '2',
    productName: 'Formal Trousers',
    operationName: 'Stitching',
    date: new Date('2023-04-16'),
    piecesDone: 30,
    ratePerPiece: 10,
    totalEarning: 30 * 10
  },
  {
    id: '3',
    productName: 'Winter Jacket',
    operationName: 'Weaving',
    date: new Date('2023-04-17'),
    piecesDone: 25,
    ratePerPiece: 15,
    totalEarning: 25 * 15
  },
];

interface WorkerOperationsDialogProps {
  workerId: string;
  workerName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const WorkerOperationsDialog: React.FC<WorkerOperationsDialogProps> = ({
  workerId,
  workerName,
  open,
  onOpenChange,
}) => {
  // In a real app, fetch worker operations based on the worker ID
  const [operations] = useState<WorkerOperation[]>(generateMockOperations(workerId));
  
  // Calculate total earnings
  const totalEarnings = operations.reduce((sum, op) => sum + op.totalEarning, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Worker Operations History</DialogTitle>
          <DialogDescription>
            Viewing operations performed by {workerName}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm text-muted-foreground">
                Total operations: <span className="font-semibold">{operations.length}</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm">
                Total earnings: <span className="font-bold text-primary">₹{totalEarnings}</span>
              </p>
            </div>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Operation</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Pieces</TableHead>
                  <TableHead className="text-right">Rate</TableHead>
                  <TableHead className="text-right">Earning</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {operations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      No operations found for this worker
                    </TableCell>
                  </TableRow>
                ) : (
                  operations.map((op) => (
                    <TableRow key={op.id}>
                      <TableCell>{op.productName}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {op.operationName}
                        </Badge>
                      </TableCell>
                      <TableCell>{format(op.date, 'dd/MM/yyyy')}</TableCell>
                      <TableCell className="text-right">{op.piecesDone}</TableCell>
                      <TableCell className="text-right">₹{op.ratePerPiece}</TableCell>
                      <TableCell className="text-right font-semibold">₹{op.totalEarning}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
