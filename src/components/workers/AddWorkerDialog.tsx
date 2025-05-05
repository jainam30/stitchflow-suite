
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/components/ui/use-toast";
import { FileImage, Upload, BankNote, User } from "lucide-react";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
    idProofImage: null,
    bankAccountDetail: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    accountHolderName: '',
    bankImage: null,
    profileImage: null,
    addressProofImage: null,
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
        idProofImageUrl: data.idProofImage ? '/placeholder.svg' : undefined,
        bankAccountDetail: data.bankAccountDetail,
        bankName: data.bankName,
        accountNumber: data.accountNumber,
        ifscCode: data.ifscCode,
        accountHolderName: data.accountHolderName,
        bankImageUrl: data.bankImage ? '/placeholder.svg' : '/placeholder.svg',
        profileImageUrl: data.profileImage ? '/placeholder.svg' : undefined,
        addressProofImageUrl: data.addressProofImage ? '/placeholder.svg' : undefined,
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
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Worker</DialogTitle>
          <DialogDescription>
            Enter worker details below. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="basic">
                <User className="mr-2 h-4 w-4" />
                Basic Info
              </TabsTrigger>
              <TabsTrigger value="documents">
                <FileImage className="mr-2 h-4 w-4" />
                Documents
              </TabsTrigger>
              <TabsTrigger value="bank">
                <BankNote className="mr-2 h-4 w-4" />
                Bank Details
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="profileImage">Profile Photo</Label>
                <div className="flex items-center space-x-4">
                  <div className="w-24 h-24 border rounded-full flex items-center justify-center bg-muted">
                    <Upload className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <Input
                    id="profileImage"
                    type="file"
                    accept="image/*"
                    {...register("profileImage")}
                  />
                </div>
              </div>
              
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
              </div>
            </TabsContent>
            
            <TabsContent value="documents" className="space-y-6">
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
                <Label htmlFor="idProofImage">ID Proof Document</Label>
                <Input
                  id="idProofImage"
                  type="file"
                  accept="image/*"
                  {...register("idProofImage")}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="addressProofImage">Address Proof Document</Label>
                <Input
                  id="addressProofImage"
                  type="file"
                  accept="image/*"
                  {...register("addressProofImage")}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="bank" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bankName">Bank Name *</Label>
                  <Input
                    id="bankName"
                    {...register("bankName", { required: "Bank name is required" })}
                    placeholder="Bank name"
                    className={errors.bankName ? "border-destructive" : ""}
                  />
                  {errors.bankName && (
                    <p className="text-sm text-destructive">{errors.bankName.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Account Number *</Label>
                  <Input
                    id="accountNumber"
                    {...register("accountNumber", { required: "Account number is required" })}
                    placeholder="Account number"
                    className={errors.accountNumber ? "border-destructive" : ""}
                  />
                  {errors.accountNumber && (
                    <p className="text-sm text-destructive">{errors.accountNumber.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="ifscCode">IFSC Code *</Label>
                  <Input
                    id="ifscCode"
                    {...register("ifscCode", { required: "IFSC code is required" })}
                    placeholder="IFSC code"
                    className={errors.ifscCode ? "border-destructive" : ""}
                  />
                  {errors.ifscCode && (
                    <p className="text-sm text-destructive">{errors.ifscCode.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="accountHolderName">Account Holder Name *</Label>
                  <Input
                    id="accountHolderName"
                    {...register("accountHolderName", { required: "Account holder name is required" })}
                    placeholder="Account holder name"
                    className={errors.accountHolderName ? "border-destructive" : ""}
                  />
                  {errors.accountHolderName && (
                    <p className="text-sm text-destructive">{errors.accountHolderName.message}</p>
                  )}
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="bankAccountDetail">Other Bank Details</Label>
                  <Input
                    id="bankAccountDetail"
                    {...register("bankAccountDetail")}
                    placeholder="Any other bank details"
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="bankImage">Bank Document</Label>
                  <Input
                    id="bankImage"
                    type="file"
                    accept="image/*"
                    {...register("bankImage")}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
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
