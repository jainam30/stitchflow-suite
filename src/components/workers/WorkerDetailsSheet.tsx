import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Worker } from '@/types/worker';
import { format } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface WorkerDetailsSheetProps {
  worker: Worker;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const WorkerDetailsSheet: React.FC<WorkerDetailsSheetProps> = ({
  worker,
  open,
  onOpenChange,
}) => {

  const normalizedWorker = {
    ...worker,
    profile_image_url: worker.profileImageUrl,
    id_proof_image_url: worker.idProofImageUrl,
    bank_image_url: worker.bankImageUrl,
  };

  // 🔥 FIX: Normalize keys — workerService returns camelCase
  const profileImage = worker.profileImageUrl
  const idProofImage = worker.idProofImageUrl
  const bankImage = worker.bankImageUrl
  const workerId = worker.workerId || worker.worker_code;
  const mobile = worker.mobileNumber || worker.mobileNumber;
  const emergency = worker.emergencyNumber || worker.emergencyNumber;
  const currentAddr = worker.currentAddress || worker.currentAddress;
  const permanentAddr = worker.permanentAddress || worker.permanentAddress;
  const idProofNo = worker.idProof || worker.idProof;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Worker Details</SheetTitle>
          <SheetDescription>
            Detailed information about {worker.name}
          </SheetDescription>
        </SheetHeader>

        <Tabs defaultValue="basic" className="py-4">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="basic" className="flex-1">Basic Info</TabsTrigger>
            <TabsTrigger value="address" className="flex-1">Address</TabsTrigger>
            <TabsTrigger value="documents" className="flex-1">Documents</TabsTrigger>
            <TabsTrigger value="bank" className="flex-1">Bank Details</TabsTrigger>
          </TabsList>


          {/* BASIC INFO */}
          <TabsContent value="basic" className="space-y-6">
            <div className="space-y-1">

              {/* 🔥 FIX: Correct image field */}
              {profileImage && (
                <div className="flex justify-center mb-4">
                  <img
                    src={worker.profileImageUrl}
                    alt={`${worker.name}'s profile`}
                    className="w-24 h-24 rounded-full object-cover border-2 border-primary"
                  />
                </div>
              )}

              <h4 className="text-sm font-medium text-muted-foreground">Basic Information</h4>
              <Separator className="my-2" />
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="font-medium">Name</div>
                <div>{worker.name}</div>

                <div className="font-medium">Worker ID</div>
                <div>{workerId}</div>

                <div className="font-medium">Created By</div>
                <div className="capitalize">{worker.createdBy}</div>

                <div className="font-medium">Created On</div>
                <div>{format(worker.createdAt, 'dd MMM yyyy')}</div>
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="text-sm font-medium text-muted-foreground">Contact Information</h4>
              <Separator className="my-2" />
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="font-medium">Mobile Number</div>
                <div>{mobile}</div>

                <div className="font-medium">Emergency Number</div>
                <div>{emergency || 'Not provided'}</div>
              </div>
            </div>
          </TabsContent>

          {/* ADDRESS TAB */}
          <TabsContent value="address" className="space-y-6">
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-muted-foreground">Current Address</h4>
              <Separator className="my-2" />
              <div className="text-sm">{currentAddr || 'Not provided'}</div>
            </div>

            <div className="space-y-1">
              <h4 className="text-sm font-medium text-muted-foreground">Permanent Address</h4>
              <Separator className="my-2" />
              <div className="text-sm">{permanentAddr || 'Not provided'}</div>
            </div>

            {worker.address && (
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-muted-foreground">Alternate Address</h4>
                <Separator className="my-2" />
                <div className="text-sm">{worker.address}</div>
              </div>
            )}
          </TabsContent>

          {/* DOCUMENTS TAB */}
          <TabsContent value="documents" className="space-y-6">
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-muted-foreground">ID Information</h4>
              <Separator className="my-2" />
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="font-medium">ID Proof</div>
                <div>{idProofNo}</div>
              </div>
            </div>

            {/* 🔥 FIX: Correct ID document field */}
            {idProofImage && (
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-muted-foreground">ID Document</h4>
                <Separator className="my-2" />
                <div className="flex justify-center">
                  <img
                    src={idProofImage}
                    alt="ID document"
                    className="w-64 h-auto object-contain border rounded-md"
                  />
                </div>
              </div>
            )}
          </TabsContent>

          {/* BANK TAB */}
          <TabsContent value="bank" className="space-y-6">
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-muted-foreground">Bank Information</h4>
              <Separator className="my-2" />
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="font-medium">Bank Name</div>
                <div>{worker.bankName || 'Not provided'}</div>

                <div className="font-medium">Account Number</div>
                <div>{worker.accountNumber || 'Not provided'}</div>

                <div className="font-medium">IFSC Code</div>
                <div>{worker.ifscCode || 'Not provided'}</div>

                <div className="font-medium">Account Holder</div>
                <div>{worker.accountHolderName || 'Not provided'}</div>

                {worker.bankAccountDetail && (
                  <>
                    <div className="font-medium">Other Details</div>
                    <div>{worker.bankAccountDetail}</div>
                  </>
                )}
              </div>
            </div>

            {/* 🔥 FIX: Correct Bank Image field */}
            {bankImage && (
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-muted-foreground">Bank Document</h4>
                <Separator className="my-2" />
                <div className="flex justify-center">
                  <img
                    src={bankImage}
                    alt="Bank document"
                    className="w-64 h-auto object-contain border rounded-md"
                  />
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};
