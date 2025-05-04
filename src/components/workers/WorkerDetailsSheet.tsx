
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
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Worker Details</SheetTitle>
          <SheetDescription>
            Detailed information about {worker.name}
          </SheetDescription>
        </SheetHeader>
        
        <div className="py-6 space-y-6">
          <div className="space-y-1">
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
          
          <div className="space-y-1">
            <h4 className="text-sm font-medium text-muted-foreground">Financial & ID Information</h4>
            <Separator className="my-2" />
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="font-medium">ID Proof</div>
              <div>{worker.idProof}</div>
              <div className="font-medium">Bank Account</div>
              <div>{worker.bankAccountDetail}</div>
            </div>
          </div>
          
          <div className="space-y-1">
            <h4 className="text-sm font-medium text-muted-foreground">Bank Document</h4>
            <Separator className="my-2" />
            <div className="flex justify-center">
              <img
                src={worker.bankImageUrl || '/placeholder.svg'}
                alt="Bank document"
                className="w-64 h-auto object-contain border rounded-md"
              />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
