
import React, { useState, useEffect } from 'react';
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
import { useToast } from "@/hooks/use-toast";
import { WorkerSalary, WorkerSalaryFormData } from '@/types/salary';
import { getWorkers } from '@/Services/workerService';
import { useAuth } from '@/contexts/AuthContext';
import { v4 as uuidv4 } from 'uuid';
import { Production } from '@/types/production';

interface AddWorkerSalaryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddSalary: (salary: WorkerSalary) => void;
  productions?: Production[];
}


export const AddWorkerSalaryDialog: React.FC<AddWorkerSalaryDialogProps> = ({
  open,
  onOpenChange,
  onAddSalary,
  productions = []
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState<WorkerSalaryFormData>({
    workerId: '',
    productId: '',
    operationId: '',
    piecesDone: 0,
    amountPerPiece: 0,
    totalAmount: 0,
  });
  
  const [workers, setWorkers] = useState<any[]>([]);
  const [selectedWorker, setSelectedWorker] = useState<any | null>(null);
  const [selectedOperation, setSelectedOperation] = useState<any | null>(null);
  const [selectedProduction, setSelectedProduction] = useState<Production | null>(null);
  const [availableOperations, setAvailableOperations] = useState<any[]>([]);
  
  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      setFormData({
        workerId: '',
        productId: '',
        operationId: '',
        piecesDone: 0,
        amountPerPiece: 0,
        totalAmount: 0,
      });
      setSelectedWorker(null);
      setSelectedOperation(null);
      setSelectedProduction(null);
    }
  }, [open]);

  // fetch workers on mount
  useEffect(() => {
    (async () => {
      try {
        const w = await getWorkers();
        setWorkers(w || []);
      } catch (err) {
        console.error('Failed to load workers', err);
      }
    })();
  }, []);
  
  const handleWorkerChange = (value: string) => {
    const worker = workers.find(w => w.id === value);

    if (worker) {
      setSelectedWorker(worker);
      setFormData(prev => ({
        ...prev,
        workerId: value,
      }));
    }
  };
  
  const handleProductionChange = (value: string) => {
    const production = productions.find(p => p.id === value);
    
    if (production) {
      setSelectedProduction(production);
      setAvailableOperations(production.operations);
      
      setFormData(prev => ({
        ...prev,
        productId: value,
        operationId: '',
        amountPerPiece: 0,
        piecesDone: 0,
        totalAmount: 0,
      }));
    }
  };
  
  const handleOperationChange = (value: string) => {
    const operation = availableOperations.find(op => op.id === value);
    
    if (operation) {
      setSelectedOperation(operation);
      
      setFormData(prev => ({
        ...prev,
        operationId: value,
        amountPerPiece: operation.ratePerPiece,
        totalAmount: prev.piecesDone * operation.ratePerPiece
      }));
      
      // If operation has an assigned worker, select that worker
      if (operation.assignedWorkerId) {
        handleWorkerChange(operation.assignedWorkerId);
      }
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
      workerName: selectedWorker?.name,
      productId: formData.productId,
      productName: selectedProduction?.name,
      date: new Date(),
      operationId: formData.operationId,
      operationName: selectedOperation?.name,
      piecesDone: formData.piecesDone,
      amountPerPiece: formData.amountPerPiece,
      totalAmount: formData.totalAmount,
      paid: false,
    };
    
    // Pass the new salary to the parent component
    onAddSalary(newSalary);
    console.log('New worker salary record:', newSalary);
    
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
    setSelectedWorker(null);
    setSelectedProduction(null);
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Worker Salary</DialogTitle>
          <DialogDescription>
            Create a new salary record for work completed by a worker.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  {workers.map((worker) => (
                    <SelectItem key={worker.id} value={worker.id}>
                      {worker.name} ({worker.id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="production">Production</Label>
              <Select
                value={formData.productId}
                onValueChange={handleProductionChange}
              >
                <SelectTrigger id="production">
                  <SelectValue placeholder="Select production" />
                </SelectTrigger>
                <SelectContent>
                  {productions.map((production) => (
                    <SelectItem key={production.id} value={production.id}>
                      {production.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="operation">Operation</Label>
              <Select
                value={formData.operationId}
                onValueChange={handleOperationChange}
                disabled={!selectedProduction}
              >
                <SelectTrigger id="operation">
                  <SelectValue placeholder="Select operation" />
                </SelectTrigger>
                <SelectContent>
                  {availableOperations.map((operation) => (
                    <SelectItem key={operation.id} value={operation.id}>
                      {operation.name} (₹{operation.ratePerPiece}/piece)
                      {operation.assignedWorkerName && ` - ${operation.assignedWorkerName}`}
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
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                readOnly={!!selectedOperation}
                className={selectedOperation ? "bg-muted" : ""}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="totalAmount">Total Amount (₹)</Label>
              <Input
                id="totalAmount"
                type="number"
                readOnly
                value={formData.totalAmount || 0}
                className="bg-muted"
              />
            </div>
          </div>
          
          {selectedProduction && (
            <div className="text-sm text-muted-foreground">
              <p>Selected Production: {selectedProduction.name} ({selectedProduction.productId})</p>
              {selectedOperation && (
                <p>Operation Rate: ₹{selectedOperation.ratePerPiece} per piece</p>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button type="submit">Add Salary Record</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
