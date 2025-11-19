// src/components/workers/AddWorkerDialog.tsx

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { FileImage, Upload, Banknote, User } from "lucide-react";

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

import { WorkerFormData } from "@/types/worker";
import { uploadWorkerImage, insertWorker } from "@/Services/workerService";

interface AddWorkerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddWorker: () => Promise<void>;
}

export const AddWorkerDialog: React.FC<AddWorkerDialogProps> = ({
  open,
  onOpenChange,
  onAddWorker,
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,       // ✅ FIX: get setValue from react-hook-form
  } = useForm<WorkerFormData>({
    defaultValues: {
      name: "",
      workerId: "",
      address: "",
      permanentAddress: "",
      currentAddress: "",
      mobileNumber: "",
      emergencyNumber: "",
      idProof: "",
      profile_image_url: null,
      id_proof_image_url: null,
      bank_image_url: null,
      bankAccountDetail: "",
      bankName: "",
      accountNumber: "",
      confirmAccountNumber: "",
      ifscCode: "",
      accountHolderName: "",
    },
  });

  const accountNumber = watch("accountNumber");

  const onSubmit = async (data: WorkerFormData) => {
    if (data.accountNumber !== data.confirmAccountNumber) {
      toast({
        title: "Error",
        description: "Account numbers do not match",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // ✅ SAFE FILE EXTRACTION
      const profileFile = data.profile_image_url?.[0] ?? null;
      const idProofFile = data.id_proof_image_url?.[0] ?? null;
      const bankFile = data.bank_image_url?.[0] ?? null;

      // ✅ Upload to Supabase
      const profileUrl = await uploadWorkerImage("workers/profile", profileFile);
      const idProofUrl = await uploadWorkerImage("workers/id-proof", idProofFile);
      const bankUrl = await uploadWorkerImage("workers/bank", bankFile);

      // Worker code
      const workerCode = `WOR-${Date.now()}`;

      const row = {
        name: data.name,
        worker_code: workerCode,
        mobile_number: data.mobileNumber,
        emergency_number: data.emergencyNumber,
        address: data.address,
        permanent_address: data.permanentAddress,
        current_address: data.currentAddress,
        id_proof: data.idProof,
        id_proof_image_url: idProofUrl,
        bank_account_detail: data.bankAccountDetail,
        bank_name: data.bankName,
        account_number: data.accountNumber,
        ifsc_code: data.ifscCode,
        account_holder_name: data.accountHolderName,
        bank_image_url: bankUrl,
        profile_image_url: profileUrl,
        joining_date: null,
        skill_type: null,
        supervisor_employee_id: null,
        salary_id: null,
        created_at: new Date().toISOString(),
      };

      await insertWorker(row);

      toast({
        title: "Worker added",
        description: `${data.name} added successfully.`,
      });

      reset();
      onOpenChange(false);
      await onAddWorker();
    } catch (err: any) {
      console.error("Error adding worker:", err);
      toast({
        title: "Error",
        description: err?.message ?? "Failed to add worker",
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
          <Tabs defaultValue="basic">
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
                <Banknote className="mr-2 h-4 w-4" />
                Bank Details
              </TabsTrigger>
            </TabsList>

            {/* BASIC INFO */}
            <TabsContent value="basic" className="space-y-4">
              <div className="space-y-2">
                <Label>Profile Photo</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setValue("profile_image_url", e.target.files)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Full Name *</Label>
                  <Input placeholder="Ex: Ramesh Patel"{...register("name", { required: true })} />
                  <p className="text-xs text-muted-foreground mt-1">Enter worker's full legal name</p>

                </div>

                <div>
                  <Label>Mobile Number *</Label>
                  <Input placeholder="9876543210" {...register("mobileNumber", { required: true })} />
                  <p className="text-xs text-muted-foreground mt-1">10-digit phone number</p>
                </div>

                <div className="md:col-span-2">
                  <Label>Current Address *</Label>
                  <Input placeholder="Full current living address"{...register("currentAddress", { required: true })} />

                </div>

                <div className="md:col-span-2">
                  <Label>Permanent Address *</Label>
                  <Input placeholder="Permanent home address"{...register("permanentAddress", { required: true })} />
                </div>

                <div className="md:col-span-2">
                  <Label>Alternate Address</Label>
                  <Input placeholder="Optional"{...register("address")} />
                </div>
              </div>
            </TabsContent>

            {/* DOCUMENTS */}
            <TabsContent value="documents" className="space-y-6">
              <div>
                <Label>ID Proof Number *</Label>
                <Input placeholder="Aadhar / PAN / Voter ID Number"{...register("idProof", { required: true })} />
              </div>

              <div>
                <Label>ID Proof Document</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setValue("id_proof_image_url", e.target.files)
                  }
                />
              </div>
            </TabsContent>

            {/* BANK DETAILS */}
            <TabsContent value="bank" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Bank Name *</Label>
                  <Input placeholder="Ex: SBI, HDFC"{...register("bankName", { required: true })} />
                </div>

                <div>
                  <Label>Account Number *</Label>
                  <Input placeholder="Bank account number"{...register("accountNumber", { required: true })} />
                </div>

                <div>
                  <Label>Confirm Account Number *</Label>
                  <Input placeholder="Re-enter account number"
                    {...register("confirmAccountNumber", { required: true })}
                  />
                </div>

                <div>
                  <Label>IFSC Code *</Label>
                  <Input placeholder="Ex: SBIN0001234"{...register("ifscCode", { required: true })} />
                </div>

                <div>
                  <Label>Account Holder Name *</Label>
                  <Input placeholder="Name as per bank account"
                    {...register("accountHolderName", { required: true })}
                  />
                </div>

                <div className="md:col-span-2">
                  <Label>Other Bank Details</Label>
                  <Input placeholder="(Optional) Branch, notes, etc" {...register("bankAccountDetail")} />
                </div>

                <div className="md:col-span-2">
                  <Label>Bank Document</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setValue("bank_image_url", e.target.files)
                    }
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

