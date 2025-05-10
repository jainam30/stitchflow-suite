
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Production, ProductionOperation, ProductionProgress } from '@/types/production';
import { useToast } from '@/hooks/use-toast';

interface ProductionOperationsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  production: Production | null;
  onUpdateProduction: (production: Production) => void;
}

export const ProductionOperationsDialog: React.FC<ProductionOperationsDialogProps> = ({
  open,
  onOpenChange,
  production,
  onUpdateProduction,
}) => {
  const [piecesDone, setPiecesDone] = useState<{ [key: string]: number }>({});
  const [progressData, setProgressData] = useState<ProductionProgress[]>([]);
  const { toast } = useToast();

  // Calculate progress whenever the dialog opens with a production
  React.useEffect(() => {
    if (production) {
      const newProgressData: ProductionProgress[] = production.operations.map(op => {
        // Mock data for now, in a real app this would come from a database
        const completedPieces = Math.floor(Math.random() * production.totalQuantity);
        return {
          operationName: op.name,
          totalPieces: production.totalQuantity,
          completedPieces: completedPieces,
          percentage: Math.round((completedPieces / production.totalQuantity) * 100)
        };
      });
      
      setProgressData(newProgressData);
      
      // Initialize piecesDone state
      const initialPiecesDone: { [key: string]: number } = {};
      production.operations.forEach(op => {
        initialPiecesDone[op.id] = 0;
      });
      setPiecesDone(initialPiecesDone);
    }
  }, [production]);

  const handlePiecesDoneChange = (operationId: string, value: string) => {
    const numValue = parseInt(value) || 0;
    setPiecesDone({
      ...piecesDone,
      [operationId]: numValue
    });
  };

  const handleAddProgress = (operationId: string) => {
    if (!production) return;
    
    // Find the operation
    const operation = production.operations.find(op => op.id === operationId);
    if (!operation) return;
    
    // Find the progress for this operation
    const progress = progressData.find(p => p.operationName === operation.name);
    if (!progress) return;
    
    // Add the pieces done to the progress
    const piecesToAdd = piecesDone[operationId];
    if (piecesToAdd <= 0) {
      toast({
        title: "Invalid input",
        description: "Please enter a positive number of pieces.",
      });
      return;
    }

    // Check if adding these pieces would exceed the total
    if (progress.completedPieces + piecesToAdd > progress.totalPieces) {
      toast({
        title: "Exceeded total",
        description: `You can't add more than ${progress.totalPieces - progress.completedPieces} pieces.`,
      });
      return;
    }

    // Update the progress
    const newProgressData = progressData.map(p => {
      if (p.operationName === operation.name) {
        const newCompletedPieces = p.completedPieces + piecesToAdd;
        return {
          ...p,
          completedPieces: newCompletedPieces,
          percentage: Math.round((newCompletedPieces / p.totalPieces) * 100)
        };
      }
      return p;
    });
    
    setProgressData(newProgressData);
    
    // Reset the input
    setPiecesDone({
      ...piecesDone,
      [operationId]: 0
    });
    
    toast({
      title: "Progress updated",
      description: `Added ${piecesToAdd} pieces to ${operation.name}.`,
    });

    // In a real app, we would update the backend here
  };

  if (!production) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Operations for {production.name}</DialogTitle>
          <DialogDescription>
            Production ID: {production.productionId} | Total Quantity: {production.totalQuantity} pieces
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4">
          <h3 className="text-lg font-medium mb-4">Production Progress</h3>
          
          <div className="space-y-4">
            {progressData.map((progress) => (
              <div key={progress.operationName} className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">{progress.operationName}</span>
                  <span>{progress.percentage}% ({progress.completedPieces}/{progress.totalPieces})</span>
                </div>
                <Progress value={progress.percentage} className="h-2" />
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-4">Add Progress</h3>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Operation</TableHead>
                <TableHead>Rate (per piece)</TableHead>
                <TableHead>Pieces Done</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {production.operations.map((operation) => (
                <TableRow key={operation.id}>
                  <TableCell>{operation.name}</TableCell>
                  <TableCell>₹{operation.ratePerPiece}</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="0"
                      value={piecesDone[operation.id] || 0}
                      onChange={(e) => handlePiecesDoneChange(operation.id, e.target.value)}
                      className="w-28"
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      size="sm" 
                      onClick={() => handleAddProgress(operation.id)}
                    >
                      Add
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
