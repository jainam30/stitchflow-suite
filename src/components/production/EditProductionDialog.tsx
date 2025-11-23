import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Production } from "@/types/production";

// ------------------
// ✅ NEW FORM SCHEMA
// ------------------
const formSchema = z.object({
  productionId: z.string().min(1, "Production ID is required"),
  poNumber: z.string().min(1, "PO Number is required"),
  color: z.string().min(1, "Color is required"),
  totalFabric: z.coerce.number().min(0),
  average: z.coerce.number().min(0),
  totalQuantity: z.coerce.number().min(1),
});

interface EditProductionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateProduction: (production: any) => void;
  production: Production | null;
}

export const EditProductionDialog: React.FC<EditProductionDialogProps> = ({
  open,
  onOpenChange,
  onUpdateProduction,
  production,
}) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productionId: "",
      poNumber: "",
      color: "",
      totalFabric: 0,
      average: 0,
      totalQuantity: 0,
    },
  });

  // ----------------------
  // ✅ Load existing values
  // ----------------------
  useEffect(() => {
    if (production) {
      form.reset({
        productionId: production.production_code || "",
        poNumber: production.po_number || "",
        color: production.color || "",
        totalFabric: production.total_fabric || 0,
        average: production.average || 0,
        totalQuantity: production.total_quantity || 0,
      });
    }
  }, [production]);

  const onSubmit = (values: any) => {
    if (!production) return;
    // Build updates using snake_case keys expected by the DB/service
    const updated = {
      id: production.id,
      production_code: values.productionId,
      po_number: values.poNumber,
      color: values.color,
      total_fabric: values.totalFabric,
      average: values.average,
      total_quantity: values.totalQuantity,
    };

    onUpdateProduction(updated);
    onOpenChange(false);
  };

  if (!production) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Production</DialogTitle>
          <DialogDescription>Update production details.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

            {/* Production ID */}
            <FormField
              control={form.control}
              name="productionId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Production ID</FormLabel>
                  <FormControl>
                    <Input placeholder="PROD-001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* PO Number */}
            <FormField
              control={form.control}
              name="poNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PO Number</FormLabel>
                  <FormControl>
                    <Input placeholder="PO-12345" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Color */}
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

            {/* 3 Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              {/* Fabric */}
              <FormField
                control={form.control}
                name="totalFabric"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Fabric (mtr)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Average */}
              <FormField
                control={form.control}
                name="average"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Average</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Total Quantity */}
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

            </div>

            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Update Production</Button>
            </DialogFooter>

          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
