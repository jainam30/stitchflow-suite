
import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Employee, EmployeeFormData } from "@/types/employee";
import { useToast } from "@/hooks/use-toast";
import { Check, X, Upload, FileImage, FileText } from "lucide-react";

interface EmployeeDetailsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee | null;
  onUpdateEmployee: (id: string, updatedEmployee: Partial<Employee>) => void;
}

export const EmployeeDetailsSheet: React.FC<EmployeeDetailsSheetProps> = ({
  open,
  onOpenChange,
  employee,
  onUpdateEmployee
}) => {
  const { toast } = useToast();
  const [idProofPreview, setIdProofPreview] = useState<string | null>(null);
  const [bankImagePreview, setBankImagePreview] = useState<string | null>(null);
  
  const form = useForm<EmployeeFormData>({
    defaultValues: {
      name: '',
      employeeId: '',
      address: '',
      permanentAddress: '',
      currentAddress: '',
      mobileNumber: '',
      emergencyNumber: '',
      idProof: '',
      idProofImage: null,
      bankAccountDetail: '',
      bankImage: null,
      salary: 0,
      isActive: true
    }
  });

  useEffect(() => {
    if (employee) {
      form.reset({
        name: employee.name,
        employeeId: employee.employeeId,
        address: employee.address,
        permanentAddress: employee.permanentAddress || '',
        currentAddress: employee.currentAddress || '',
        mobileNumber: employee.mobileNumber,
        emergencyNumber: employee.emergencyNumber,
        idProof: employee.idProof,
        bankAccountDetail: employee.bankAccountDetail,
        salary: employee.salary,
        isActive: employee.isActive
      });

      // Set image previews if available
      if (employee.idProofImageUrl) {
        setIdProofPreview(employee.idProofImageUrl);
      }
      
      if (employee.bankImageUrl) {
        setBankImagePreview(employee.bankImageUrl);
      }
    }
  }, [employee, form]);

  const onSubmit = async (data: EmployeeFormData) => {
    if (!employee) return;

    // In a real app, you would upload files to a server here
    // For now, we'll simulate that the upload was successful
    
    const updatedEmployee: Partial<Employee> = {
      name: data.name,
      employeeId: data.employeeId,
      address: data.address,
      permanentAddress: data.permanentAddress,
      currentAddress: data.currentAddress,
      mobileNumber: data.mobileNumber,
      emergencyNumber: data.emergencyNumber,
      idProof: data.idProof,
      bankAccountDetail: data.bankAccountDetail,
      salary: data.salary,
      isActive: data.isActive
    };

    // Simulate file upload for idProofImage
    if (data.idProofImage) {
      // In a real app, this would be a URL returned from your file upload service
      updatedEmployee.idProofImageUrl = URL.createObjectURL(data.idProofImage);
    }

    // Simulate file upload for bankImage
    if (data.bankImage) {
      // In a real app, this would be a URL returned from your file upload service
      updatedEmployee.bankImageUrl = URL.createObjectURL(data.bankImage);
    }

    onUpdateEmployee(employee.id, updatedEmployee);
    
    toast({
      title: "Employee updated",
      description: `${data.name}'s information has been updated.`,
    });
    
    onOpenChange(false);
  };

  const handleIdProofImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("idProofImage", file);
      setIdProofPreview(URL.createObjectURL(file));
    }
  };

  const handleBankImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("bankImage", file);
      setBankImagePreview(URL.createObjectURL(file));
    }
  };

  if (!employee) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md md:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Edit Employee: {employee.name}</SheetTitle>
          <SheetDescription>
            View and update employee information. Click save when you're done.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
            <div className="space-y-4">
              {/* Basic Information */}
              <div className="border rounded-md p-4">
                <h3 className="text-sm font-medium mb-3">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="employeeId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Employee ID</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="border rounded-md p-4">
                <h3 className="text-sm font-medium mb-3">Contact Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="mobileNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mobile Number</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="emergencyNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Emergency Contact</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Address Information */}
              <div className="border rounded-md p-4">
                <h3 className="text-sm font-medium mb-3">Address Information</h3>
                <div className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="permanentAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Permanent Address</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="currentAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Address</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* ID Proof */}
              <div className="border rounded-md p-4">
                <h3 className="text-sm font-medium mb-3">ID Proof</h3>
                <FormField
                  control={form.control}
                  name="idProof"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID Number</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="mt-4">
                  <Label htmlFor="id-proof-image">ID Proof Image</Label>
                  <div className="mt-1 flex items-center">
                    <Label 
                      htmlFor="id-proof-image" 
                      className="cursor-pointer flex items-center justify-center border border-dashed rounded-md p-4 w-full"
                    >
                      {idProofPreview ? (
                        <div className="w-full">
                          <img 
                            src={idProofPreview} 
                            alt="ID Proof" 
                            className="h-32 object-contain mx-auto"
                          />
                          <p className="text-xs text-center mt-2">Click to change</p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <FileImage className="mx-auto h-12 w-12 text-gray-400" />
                          <p className="mt-1 text-sm text-gray-500">Upload ID proof</p>
                        </div>
                      )}
                    </Label>
                    <Input 
                      id="id-proof-image" 
                      type="file" 
                      className="hidden" 
                      onChange={handleIdProofImageChange}
                    />
                  </div>
                </div>
              </div>

              {/* Bank Details */}
              <div className="border rounded-md p-4">
                <h3 className="text-sm font-medium mb-3">Bank Details</h3>
                <FormField
                  control={form.control}
                  name="bankAccountDetail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bank Account Details</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="mt-4">
                  <Label htmlFor="bank-image">Bank Passbook/Cheque</Label>
                  <div className="mt-1 flex items-center">
                    <Label 
                      htmlFor="bank-image" 
                      className="cursor-pointer flex items-center justify-center border border-dashed rounded-md p-4 w-full"
                    >
                      {bankImagePreview ? (
                        <div className="w-full">
                          <img 
                            src={bankImagePreview} 
                            alt="Bank Document" 
                            className="h-32 object-contain mx-auto"
                          />
                          <p className="text-xs text-center mt-2">Click to change</p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <FileText className="mx-auto h-12 w-12 text-gray-400" />
                          <p className="mt-1 text-sm text-gray-500">Upload bank document</p>
                        </div>
                      )}
                    </Label>
                    <Input 
                      id="bank-image" 
                      type="file" 
                      className="hidden" 
                      onChange={handleBankImageChange}
                    />
                  </div>
                </div>
              </div>

              {/* Salary & Status */}
              <div className="border rounded-md p-4">
                <h3 className="text-sm font-medium mb-3">Salary & Status</h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="salary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Salary (₹)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            onChange={e => field.onChange(Number(e.target.value))} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-end space-x-2">
                        <FormControl>
                          <input 
                            type="checkbox" 
                            checked={field.value} 
                            onChange={field.onChange}
                            className="h-4 w-4"
                          />
                        </FormControl>
                        <FormLabel>Active Status</FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <SheetFooter className="mt-6 flex justify-between sm:justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                <X className="mr-1 h-4 w-4" />
                Cancel
              </Button>
              <Button type="submit">
                <Check className="mr-1 h-4 w-4" />
                Save Changes
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};
