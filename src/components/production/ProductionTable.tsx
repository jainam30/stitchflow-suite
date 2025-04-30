
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Scissors } from "lucide-react";
import { Production } from '@/types/production';

interface ProductionTableProps {
  productions: Production[];
  onEditProduction: (id: string) => void;
}

export const ProductionTable: React.FC<ProductionTableProps> = ({ 
  productions,
  onEditProduction
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Production Name</TableHead>
          <TableHead>Production ID</TableHead>
          <TableHead>P.O Number</TableHead>
          <TableHead>Color</TableHead>
          <TableHead>Total Fabric (mtr.)</TableHead>
          <TableHead>Average (P.O)</TableHead>
          <TableHead>Total Quantity</TableHead>
          <TableHead>Operations</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {productions.length === 0 ? (
          <TableRow>
            <TableCell colSpan={9} className="text-center py-6 text-muted-foreground">
              No production records found
            </TableCell>
          </TableRow>
        ) : (
          productions.map((production) => (
            <TableRow key={production.id}>
              <TableCell>{production.name}</TableCell>
              <TableCell>{production.productionId}</TableCell>
              <TableCell>{production.poNumber}</TableCell>
              <TableCell>{production.color}</TableCell>
              <TableCell>{production.totalFabric} mtr.</TableCell>
              <TableCell>{production.average}</TableCell>
              <TableCell>{production.totalQuantity} pcs</TableCell>
              <TableCell>{production.operations.length}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEditProduction(production.id)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};
