// src/components/production/AddProductionDialog.tsx
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/types/product";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { createProduction } from "@/Services/productionService";
import { v4 as uuidv4 } from "uuid";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  products: Product[];
  onAddProduction: (row: any) => void;
}

interface FormValues {
  productId: string;
  productionId: string;
  poNumber: string;
  color: string;
  totalFabric: number;
  average: number;
  totalQuantity: number;
}

export const AddProductionDialog: React.FC<Props> = ({ open, onOpenChange, products, onAddProduction }) => {
  const { toast } = useToast();
  const form = useForm<FormValues>({
    defaultValues: {
      productId: "",
      productionId: "",
      poNumber: "",
      color: "",
      totalFabric: 0,
      average: 0,
      totalQuantity: 0,
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const row = {
        product_id: values.productId,
        production_code: values.productionId,
        po_number: values.poNumber,
        color: values.color,
        total_fabric: values.totalFabric,
        average: values.average,
        total_quantity: values.totalQuantity,
        created_by: "admin",
        created_at: new Date().toISOString(),
      };

      // Pass the prepared row to the parent to perform the insertion.
      // This avoids calling createProduction twice (once here and once in the parent).
      onAddProduction(row);
      // Parent will close the dialog and handle resetting; keep local reset for safety
      form.reset();
    } catch (err: any) {
      console.error("prepare production error", err);
      toast({ title: "Error", description: err?.message || String(err), variant: "destructive" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Production</DialogTitle>
          <DialogDescription>Choose product and fill production details.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="productId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product</FormLabel>
                    <FormControl>
                      <select {...field} className="w-full border rounded px-2 py-2">
                        <option value="">Select product</option>
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} ({p.product_code})
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="productionId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Production Code</FormLabel>
                    <FormControl>
                      <Input placeholder="PRD-001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <FormField
                control={form.control}
                name="poNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>P.O Number</FormLabel>
                    <FormControl>
                      <Input placeholder="PO-123" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <FormControl>
                      <Input placeholder="Blue" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="totalQuantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Quantity</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="totalFabric"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Fabric (mtr.)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="average"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Average (P.O)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Production</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
