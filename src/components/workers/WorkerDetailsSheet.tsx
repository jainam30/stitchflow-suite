
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
            <TabsTrigger value="documents" className="flex-1">Documents</TabsTrigger>
            <TabsTrigger value="bank" className="flex-1">Bank Details</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-6">
            <div className="space-y-1">
              {worker.profileImageUrl && (
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
                <div>{worker.workerId}</div>
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
                <div>{worker.mobileNumber}</div>
                <div className="font-medium">Emergency Number</div>
                <div>{worker.emergencyNumber || 'Not provided'}</div>
                <div className="font-medium">Address</div>
                <div className="col-span-2">{worker.address}</div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="documents" className="space-y-6">
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-muted-foreground">ID Information</h4>
              <Separator className="my-2" />
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="font-medium">ID Proof</div>
                <div>{worker.idProof}</div>
              </div>
            </div>
            
            {worker.idProofImageUrl && (
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-muted-foreground">ID Document</h4>
                <Separator className="my-2" />
                <div className="flex justify-center">
                  <img
                    src={worker.idProofImageUrl}
                    alt="ID document"
                    className="w-64 h-auto object-contain border rounded-md"
                  />
                </div>
              </div>
            )}
            
            {worker.addressProofImageUrl && (
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-muted-foreground">Address Proof</h4>
                <Separator className="my-2" />
                <div className="flex justify-center">
                  <img
                    src={worker.addressProofImageUrl}
                    alt="Address proof"
                    className="w-64 h-auto object-contain border rounded-md"
                  />
                </div>
              </div>
            )}
          </TabsContent>
          
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
              </div>
            </div>
            
            {worker.bankImageUrl && (
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-muted-foreground">Bank Document</h4>
                <Separator className="my-2" />
                <div className="flex justify-center">
                  <img
                    src={worker.bankImageUrl}
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
