
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/components/ui/use-toast";

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
import { Worker, WorkerFormData } from '@/types/worker';

interface AddWorkerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddWorker: (worker: Worker) => void;
}

export const AddWorkerDialog: React.FC<AddWorkerDialogProps> = ({
  open,
  onOpenChange,
  onAddWorker,
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const defaultValues: WorkerFormData = {
    name: '',
    workerId: '',
    address: '',
    mobileNumber: '',
    emergencyNumber: '',
    idProof: '',
    bankAccountDetail: '',
    bankImage: null,
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<WorkerFormData>({ defaultValues });

  const onSubmit = async (data: WorkerFormData) => {
    setIsSubmitting(true);

    try {
      // In a real app, this would upload images and save data to a backend
      // For now we'll simulate it with a delay and mock urls
      await new Promise(resolve => setTimeout(resolve, 500));

      // Create a new worker object
      const newWorker: Worker = {
        id: uuidv4(),
        name: data.name,
        workerId: data.workerId,
        address: data.address,
        mobileNumber: data.mobileNumber,
        emergencyNumber: data.emergencyNumber,
        idProof: data.idProof,
        bankAccountDetail: data.bankAccountDetail,
        bankImageUrl: '/placeholder.svg', // In real app, this would be the uploaded image URL
        createdBy: user?.email || 'unknown',
        createdAt: new Date(),
      };

      // Add the new worker
      onAddWorker(newWorker);

      // Reset form and close dialog
      reset();
      onOpenChange(false);

      // Show success message
      toast({
        title: "Worker added",
        description: `Worker ${data.name} has been added successfully.`,
      });
    } catch (error) {
      console.error("Error adding worker:", error);
      toast({
        title: "Error",
        description: "Failed to add worker. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Worker</DialogTitle>
          <DialogDescription>
            Enter worker details below. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                {...register("name", { required: "Worker name is required" })}
                placeholder="Full Name"
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="workerId">Worker ID *</Label>
              <Input
                id="workerId"
                {...register("workerId", { required: "Worker ID is required" })}
                placeholder="E.g. WOR001"
                className={errors.workerId ? "border-destructive" : ""}
              />
              {errors.workerId && (
                <p className="text-sm text-destructive">{errors.workerId.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="mobileNumber">Mobile Number *</Label>
              <Input
                id="mobileNumber"
                {...register("mobileNumber", { required: "Mobile number is required" })}
                placeholder="10-digit mobile number"
                className={errors.mobileNumber ? "border-destructive" : ""}
              />
              {errors.mobileNumber && (
                <p className="text-sm text-destructive">{errors.mobileNumber.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="emergencyNumber">Emergency Contact</Label>
              <Input
                id="emergencyNumber"
                {...register("emergencyNumber")}
                placeholder="Emergency contact number"
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                {...register("address", { required: "Address is required" })}
                placeholder="Full address"
                className={errors.address ? "border-destructive" : ""}
              />
              {errors.address && (
                <p className="text-sm text-destructive">{errors.address.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="idProof">ID Proof Number *</Label>
              <Input
                id="idProof"
                {...register("idProof", { required: "ID proof is required" })}
                placeholder="Aadhar/PAN/Voter ID"
                className={errors.idProof ? "border-destructive" : ""}
              />
              {errors.idProof && (
                <p className="text-sm text-destructive">{errors.idProof.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bankAccountDetail">Bank Account Details *</Label>
              <Input
                id="bankAccountDetail"
                {...register("bankAccountDetail", { required: "Bank details required" })}
                placeholder="Account number/IFSC"
                className={errors.bankAccountDetail ? "border-destructive" : ""}
              />
              {errors.bankAccountDetail && (
                <p className="text-sm text-destructive">{errors.bankAccountDetail.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bankImage">Bank Document</Label>
              <Input
                id="bankImage"
                type="file"
                accept="image/*"
                {...register("bankImage")}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                onOpenChange(false);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Worker"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
