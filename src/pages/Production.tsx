
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search, Scissors } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductionTable } from "@/components/production/ProductionTable";
import { AddProductionDialog } from "@/components/production/AddProductionDialog";
import { EditProductionDialog } from "@/components/production/EditProductionDialog";
import { Production } from '@/types/production';
import { useToast } from '@/hooks/use-toast';

// Mock data for initial development
const mockProductions: Production[] = [
  {
    id: '1',
    name: 'Summer T-Shirt Collection',
    productionId: 'PRD-2023-001',
    poNumber: 'PO-12345',
    color: 'Blue',
    totalFabric: 500,
    average: 0.5,
    totalQuantity: 1000,
    operations: [
      {
        id: '1-1',
        name: 'Cutting',
        ratePerPiece: 5,
        isCompleted: false,
        productionId: '1'
      },
      {
        id: '1-2',
        name: 'Stitching',
        ratePerPiece: 15,
        isCompleted: false,
        productionId: '1'
      }
    ],
    createdBy: 'admin',
    createdAt: new Date('2023-01-20')
  },
  {
    id: '2',
    name: 'Winter Jacket Production',
    productionId: 'PRD-2023-002',
    poNumber: 'PO-67890',
    color: 'Black',
    totalFabric: 1200,
    average: 2.4,
    totalQuantity: 500,
    operations: [
      {
        id: '2-1',
        name: 'Cutting',
        ratePerPiece: 8,
        isCompleted: false,
        productionId: '2'
      },
      {
        id: '2-2',
        name: 'Stitching',
        ratePerPiece: 25,
        isCompleted: false,
        productionId: '2'
      },
      {
        id: '2-3',
        name: 'Washing',
        ratePerPiece: 12,
        isCompleted: false,
        productionId: '2'
      }
    ],
    createdBy: 'admin',
    createdAt: new Date('2023-02-15')
  }
];

const ProductionPage: React.FC = () => {
  const [productions, setProductions] = useState<Production[]>(mockProductions);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProduction, setSelectedProduction] = useState<Production | null>(null);
  const { toast } = useToast();

  const handleAddProduction = (newProduction: Production) => {
    setProductions([...productions, newProduction]);
    toast({
      title: "Production added",
      description: `${newProduction.name} has been added successfully.`,
    });
  };

  const handleUpdateProduction = (updatedProduction: Production) => {
    setProductions(productions.map(production => 
      production.id === updatedProduction.id ? updatedProduction : production
    ));
    toast({
      title: "Production updated",
      description: `${updatedProduction.name} has been updated successfully.`,
    });
  };

  const handleEditProduction = (id: string) => {
    const production = productions.find(p => p.id === id);
    if (production) {
      setSelectedProduction(production);
      setIsEditDialogOpen(true);
    }
  };

  const filteredProductions = productions.filter(production => 
    production.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    production.productionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    production.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    production.color.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Production Management</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Production
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Production Records</CardTitle>
          <CardDescription>
            View, add, and manage all your production records here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search productions by name, ID, P.O number, or color..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <ProductionTable 
            productions={filteredProductions} 
            onEditProduction={handleEditProduction}
          />
        </CardContent>
      </Card>

      <AddProductionDialog 
        open={isAddDialogOpen} 
        onOpenChange={setIsAddDialogOpen}
        onAddProduction={handleAddProduction}
      />

      <EditProductionDialog 
        open={isEditDialogOpen} 
        onOpenChange={setIsEditDialogOpen}
        onUpdateProduction={handleUpdateProduction}
        production={selectedProduction}
      />
    </div>
  );
};

export default ProductionPage;
