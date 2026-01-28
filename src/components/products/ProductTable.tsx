// src/components/products/ProductTable.tsx
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import { EditProductSheet } from './EditProductSheet';

interface ProductTableProps {
  products: Product[];
  onUpdateProduct: (id: string, product: Partial<Product>, operations: any[]) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({ products, onUpdateProduct }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setIsEditSheetOpen(true);
  };

  return (
    <>
      <div className="rounded-md border w-full overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product Name</TableHead>
              <TableHead>Product Code</TableHead>
              <TableHead>Design No.</TableHead>
              <TableHead>Color</TableHead>
              <TableHead>Total Cost</TableHead>
              <TableHead>Operations</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">No products found.</TableCell>
              </TableRow>
            ) : (
              products.map((product) => {
                const totalCost = Number(product.material_cost || 0) + Number(product.thread_cost || 0) + Number(product.other_costs || 0);
                return (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.product_code}</TableCell>
                    <TableCell>{product.design_no}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full border" style={{ backgroundColor: product.color.toLowerCase() }} />
                        {product.color}
                      </div>
                    </TableCell>
                    <TableCell>₹{totalCost.toFixed(2)}</TableCell>
                    <TableCell>{product.operations?.length || 0}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleEditClick(product)}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <EditProductSheet
        open={isEditSheetOpen}
        onOpenChange={setIsEditSheetOpen}
        product={selectedProduct}
        onUpdateProduct={onUpdateProduct}
      />
    </>
  );
};
