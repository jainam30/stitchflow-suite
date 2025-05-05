
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
import { useToast } from "@/components/ui/use-toast";
import { WorkerSalary } from '@/types/salary';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { v4 as uuidv4 } from 'uuid';

interface AddWorkerSalaryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mock data for workers, products and operations
const mockWorkers = [
  { id: 'WOR001', name: 'Ramesh Kumar' },
  { id: 'WOR002', name: 'Suresh Singh' },
  { id: 'WOR003', name: 'Manoj Verma' },
];

const mockProducts = [
  { id: 'P001', name: 'Summer Shirt 2025' },
  { id: 'P002', name: 'Formal Trousers' },
  { id: 'P003', name: 'Winter Jacket' },
];

const mockOperations = [
  { id: 'OP001', name: 'Cutting', rate: 5 },
  { id: 'OP002', name: 'Stitching', rate: 10 },
  { id: 'OP003', name: 'Weaving', rate: 15 },
];

export const AddWorkerSalaryDialog: React.FC<AddWorkerSalaryDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    workerId: '',
    productId: '',
    operationId: '',
    piecesDone: 0,
    amountPerPiece: 0,
    totalAmount: 0,
  });
  
  const [selectedOperation, setSelectedOperation] = useState<typeof mockOperations[0] | null>(null);
  
  const handleWorkerChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      workerId: value,
    }));
  };
  
  const handleProductChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      productId: value,
    }));
  };
  
  const handleOperationChange = (value: string) => {
    const operation = mockOperations.find(op => op.id === value);
    
    if (operation) {
      setSelectedOperation(operation);
      setFormData(prev => ({
        ...prev,
        operationId: value,
        amountPerPiece: operation.rate,
        totalAmount: prev.piecesDone * operation.rate
      }));
    }
  };
  
  const handlePiecesDoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pieces = parseInt(e.target.value) || 0;
    
    setFormData(prev => ({
      ...prev,
      piecesDone: pieces,
      totalAmount: pieces * prev.amountPerPiece,
    }));
  };

  const handleAmountPerPieceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = parseFloat(e.target.value) || 0;
    
    setFormData(prev => ({
      ...prev,
      amountPerPiece: amount,
      totalAmount: prev.piecesDone * amount,
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.workerId || !formData.productId || !formData.operationId || formData.piecesDone <= 0) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields with valid values.",
        variant: "destructive",
      });
      return;
    }
    
    // Create new worker salary record
    const newSalary: WorkerSalary = {
      id: uuidv4(),
      workerId: formData.workerId,
      productId: formData.productId,
      date: new Date(),
      operationId: formData.operationId,
      piecesDone: formData.piecesDone,
      amountPerPiece: formData.amountPerPiece,
      totalAmount: formData.totalAmount,
      paid: false,
    };
    
    // In a real app, you would save this to a database
    console.log('New worker salary record:', newSalary);
    
    toast({
      title: "Success",
      description: "Worker salary record has been added successfully.",
    });
    
    // Reset form and close dialog
    setFormData({
      workerId: '',
      productId: '',
      operationId: '',
      piecesDone: 0,
      amountPerPiece: 0,
      totalAmount: 0,
    });
    setSelectedOperation(null);
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Worker Salary</DialogTitle>
          <DialogDescription>
            Create a new salary record for work completed by a worker.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="worker">Worker</Label>
              <Select
                value={formData.workerId}
                onValueChange={handleWorkerChange}
              >
                <SelectTrigger id="worker">
                  <SelectValue placeholder="Select worker" />
                </SelectTrigger>
                <SelectContent>
                  {mockWorkers.map((worker) => (
                    <SelectItem key={worker.id} value={worker.id}>
                      {worker.name} ({worker.id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="product">Product</Label>
              <Select
                value={formData.productId}
                onValueChange={handleProductChange}
              >
                <SelectTrigger id="product">
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  {mockProducts.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="operation">Operation</Label>
              <Select
                value={formData.operationId}
                onValueChange={handleOperationChange}
              >
                <SelectTrigger id="operation">
                  <SelectValue placeholder="Select operation" />
                </SelectTrigger>
                <SelectContent>
                  {mockOperations.map((operation) => (
                    <SelectItem key={operation.id} value={operation.id}>
                      {operation.name} (₹{operation.rate}/piece)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="piecesDone">Pieces Completed</Label>
              <Input
                id="piecesDone"
                type="number"
                min="1"
                placeholder="Enter number of pieces"
                value={formData.piecesDone || ''}
                onChange={handlePiecesDoneChange}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amountPerPiece">Rate per Piece (₹)</Label>
              <Input
                id="amountPerPiece"
                type="number"
                step="0.01"
                min="0"
                placeholder="Enter rate per piece"
                value={formData.amountPerPiece || ''}
                onChange={handleAmountPerPieceChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="totalAmount">Total Amount (₹)</Label>
              <Input
                id="totalAmount"
                type="number"
                readOnly
                value={formData.totalAmount || 0}
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
