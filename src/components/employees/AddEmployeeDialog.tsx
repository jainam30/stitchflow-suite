import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Employee, EmployeeFormData } from '@/types/employee';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { FileImage, Upload, Banknote, User, Shield } from 'lucide-react';
import { supabase } from "@/Config/supabaseClient";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

const formSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  employeeId: z.string().min(3, "EMP ID must be at least 3 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  permanentAddress: z.string().optional().nullable(),
  email: z.string().email("Invalid email address").optional().nullable(),
  mobileNumber: z.string().min(10, "Mobile number must be at least 10 digits"),
  emergencyNumber: z.string().min(10, "Emergency number must be at least 10 digits"),
  idProof: z.string().min(5, "ID proof must be at least 5 characters"),
  profileImage: z.any().optional().nullable(),
  idProofImage: z.instanceof(File).optional().refine(
    (file) => !file || file.size <= MAX_FILE_SIZE,
    'Max file size is 10MB'
  ).refine(
    (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
    'Only .jpg, .jpeg, and .png formats are supported'
  ).nullable().optional(),
  bankName: z.string().min(1, "Bank name is required"),
  accountHolderName: z.string().min(1, "Account holder name is required"),
  bankAccountDetail: z.string().min(5, "Bank account details must be at least 5 characters"),
  accountNumber: z.string().min(1, "Account number is required"),
  confirmAccountNumber: z.string().min(1, "Please confirm account number"),
  ifscCode: z.string().min(1, "IFSC code is required"),
  addressProofImage: z.any().optional().nullable(),
  bankImage: z.instanceof(File).optional().refine(
    (file) => !file || file.size <= MAX_FILE_SIZE,
    'Max file size is 10MB'
  ).refine(
    (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
    'Only .jpg, .jpeg, and .png formats are supported'
  ).nullable().optional(),
  salary: z.coerce.number().min(1, "Salary must be at least 1"),
  isActive: z.boolean().default(true),
}).refine((data) => data.accountNumber === data.confirmAccountNumber, {
  message: "Account numbers do not match",
  path: ["confirmAccountNumber"],
});

interface AddEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddEmployee: (employee: Employee) => void;
}

export const AddEmployeeDialog: React.FC<AddEmployeeDialogProps> = ({
  open,
  onOpenChange,
  onAddEmployee
}) => {
  const { toast } = useToast();
  const [idProofPreview, setIdProofPreview] = useState<string | null>(null);
  const [bankImagePreview, setBankImagePreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      name: "",
      employeeId: "",
      address: "",
      permanentAddress: "",
      email: "",
      profileImage: null,
      mobileNumber: "",
      emergencyNumber: "",
      idProof: "",
      idProofImage: null,
      addressProofImage: null,
      bankName: "",
      accountHolderName: "",
      bankAccountDetail: "",
      accountNumber: "",
      confirmAccountNumber: "",
      ifscCode: "",
      bankImage: null,
      salary: 0,
      isActive: true,
    }

  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      let idProofUrl = null;
      let bankUrl = null;

      // Upload ID proof image
      if (values.idProofImage instanceof File) {
        idProofUrl = await uploadToStorage(values.idProofImage, "id-proof");
      }

      // Upload bank proof image
      if (values.bankImage instanceof File) {
        bankUrl = await uploadToStorage(values.bankImage, "bank-proof");
      }

      // Insert employee into database
      const { data, error } = await supabase
        .from("employees")
        .insert([
          {
            name: values.name,
            employee_code: values.employeeId, // EMP ID
            address: values.address,           // store in `address` column
            permanent_address: values.permanentAddress,
            mobile_number: values.mobileNumber,
            emergency_number: values.emergencyNumber,
            id_proof: values.idProof,
            id_proof_image_url: idProofUrl,
            bank_account_detail: values.bankAccountDetail,
            bank_image_url: bankUrl,
            salary_amount: values.salary,
            is_active: values.isActive,
            created_at: new Date(),
          },
        ])
        .select("*")
        .single();

      if (error) throw error;

      toast({
        title: "Employee Added",
        description: `${data.name} saved successfully`,
      });

      onAddEmployee(data); // pass real DB employee
      onOpenChange(false);
      form.reset();
      setIdProofPreview(null);
      setBankImagePreview(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };


  const handleIdProofImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: "Error",
          description: "ID Proof image must be less than 10MB",
          variant: "destructive",
        });
        return;
      }

      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        toast({
          title: "Error",
          description: "Only .jpg, .jpeg, and .png formats are supported",
          variant: "destructive",
        });
        return;
      }

      form.setValue("idProofImage", file);
      setIdProofPreview(URL.createObjectURL(file));
    }
  };

  const handleBankImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: "Error",
          description: "Bank document must be less than 10MB",
          variant: "destructive",
        });
        return;
      }

      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        toast({
          title: "Error",
          description: "Only .jpg, .jpeg, and .png formats are supported",
          variant: "destructive",
        });
        return;
      }

      form.setValue("bankImage", file);
      setBankImagePreview(URL.createObjectURL(file));
    }
  };
  // Upload file to Supabase Storage
  const uploadToStorage = async (file: File, folder: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${crypto.randomUUID()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from("factory-images")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("UPLOAD ERROR", error);
      throw error;
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from("factory-images")
      .getPublicUrl(fileName);

    return publicUrlData.publicUrl;
  };



  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Employee</DialogTitle>
          <DialogDescription>
            Fill in the details to add a new employee to the system.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid grid-cols-4 mb-6">
                <TabsTrigger value="basic">
                  <User className="mr-2 h-4 w-4" />
                  Basic Info
                </TabsTrigger>
                <TabsTrigger value="address">
                  <Shield className="mr-2 h-4 w-4" />
                  Address
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

              <TabsContent value="basic" className="space-y-4">
                <div className="space-y-4 grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="profileImage"
                    render={({ field: { onChange, value, ...field } }) => (
                      <FormItem className="col-span-1">
                        <FormLabel>Profile Photo</FormLabel>
                        <FormControl>
                          <div className="flex items-center space-x-4">
                            <div className="w-24 h-24 border rounded-full flex items-center justify-center bg-muted">
                              <Upload className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                onChange(e.target.files?.[0] || null);
                              }}
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter employee name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="employee@example.com" {...field} />
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
                        <FormLabel>EMP ID</FormLabel>
                        <FormControl>
                          <Input placeholder="EMP123" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="mobileNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mobile Number *</FormLabel>
                        <FormControl>
                          <Input placeholder="9876543210" {...field} />
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
                        <FormLabel>Emergency Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Emergency contact number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Active Status</FormLabel>
                          <div className="text-sm text-muted-foreground">
                            Employee will be immediately active in the system
                          </div>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              <TabsContent value="address" className="space-y-4">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address *</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Current residential address" {...field} />
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
                        <Input placeholder="Permanent address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="addressProofImage"
                  render={({ field: { onChange, value, ...field } }) => (
                    <FormItem>
                      <FormLabel>Address Proof Document</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            onChange(e.target.files?.[0] || null);
                          }}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Upload a document as address proof (utility bill, rental agreement, etc.)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="documents" className="space-y-4">
                <FormField
                  control={form.control}
                  name="idProof"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID Proof Number *</FormLabel>
                      <FormControl>
                        <Input placeholder="Aadhar/PAN/Voter ID" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="idProofImage"
                  render={({ field: { onChange, value, ...field } }) => (
                    <FormItem>
                      <FormLabel>ID Proof Document</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            onChange(e.target.files?.[0] || null);
                            handleIdProofImageChange(e);
                          }}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="bank" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="bankName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bank Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Bank name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="accountHolderName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Holder Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Account holder name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="accountNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Number *</FormLabel>
                        <FormControl>
                          <Input placeholder="Account number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmAccountNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Account Number *</FormLabel>
                        <FormControl>
                          <Input placeholder="Confirm account number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ifscCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>IFSC Code *</FormLabel>
                        <FormControl>
                          <Input placeholder="IFSC code" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bankAccountDetail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bank Account Details</FormLabel>
                        <FormControl>
                          <Input placeholder="Account number/IFSC" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bankImage"
                    render={({ field: { onChange, value, ...field } }) => (
                      <FormItem>
                        <FormLabel>Bank Document</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              onChange(e.target.files?.[0] || null);
                              handleBankImageChange(e);
                            }}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Upload a passbook image or cancelled check
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="salary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Salary (₹)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Enter base salary" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
            </Tabs>

            <div className="grid grid-cols-2 gap-4">



            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Employee</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
