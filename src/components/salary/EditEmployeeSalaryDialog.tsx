import React, { useEffect, useState } from "react";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { EmployeeSalary } from "@/types/salary";
import { cn } from "@/lib/utils";
import { getEmployees, updateEmployeeSalary } from "@/Services/salaryService";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  salary?: EmployeeSalary | null;
  onUpdated?: (updated: EmployeeSalary) => void;
};

export const EditEmployeeSalaryDialog: React.FC<Props> = ({ open, onOpenChange, salary, onUpdated }) => {
  const { toast } = useToast();
  const [employees, setEmployees] = useState<any[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    id: "",
    employeeId: "",
    month: new Date(),
    salary: 0,
    advance: 0,
    netSalary: 0,
    employeeName: undefined as string | null | undefined,
  });

  useEffect(() => {
    const loadEmployees = async () => {
      setLoadingEmployees(true);
      try {
        const rows = await getEmployees();
        setEmployees(rows || []);
      } catch (e) {
        // silent
      } finally {
        setLoadingEmployees(false);
      }
    };
    loadEmployees();
  }, []);

  useEffect(() => {
    if (salary) {
      setForm({
        id: salary.id,
        employeeId: salary.employeeId,
        month: salary.month instanceof Date ? salary.month : new Date(salary.month),
        salary: Number(salary.salary || 0),
        advance: Number(salary.advance || 0),
        netSalary: Number(salary.netSalary || 0),
        employeeName: salary.employeeName ?? undefined,
      });
    } else {
      setForm({
        id: "",
        employeeId: "",
        month: new Date(),
        salary: 0,
        advance: 0,
        netSalary: 0,
        employeeName: undefined,
      });
    }
  }, [salary, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.id) return;
    setLoading(true);
    try {
      const res = await updateEmployeeSalary(form.id, {
        salaryMonth: form.month,
        grossSalary: form.salary,
        advance: form.advance,
        netSalary: form.netSalary,
        employeeName: form.employeeName ?? null,
      });
      if (res?.error) {
        toast({ title: "Update failed", description: res.error.message ?? "Failed to update", variant: "destructive" });
        return;
      }

      const updated: EmployeeSalary = {
        id: form.id,
        employeeId: form.employeeId,
        employeeName: form.employeeName ?? null,
        month: form.month,
        salary: form.salary,
        advance: form.advance,
        netSalary: form.netSalary,
        paid: salary?.paid ?? false,
        paidDate: salary?.paidDate,
      };

      toast({ title: "Success", description: "Salary updated." });
      onUpdated?.(updated);
      onOpenChange(false);
    } catch (err: any) {
      console.error(err);
      toast({ title: "Error", description: err?.message ?? "Failed to update", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Edit Employee Salary</DialogTitle>
          <DialogDescription>Modify monthly salary record.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Employee</Label>
              <Input readOnly value={form.employeeName ?? form.employeeId} />
            </div>

            <div className="space-y-2">
              <Label>Month</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(form.month, "MMMM yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={form.month} onSelect={(d) => d && setForm(prev => ({ ...prev, month: d }))} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Base Salary (₹)</Label>
              <Input
                type="number"
                value={form.salary}
                onChange={(e) => {
                  const s = parseFloat(e.target.value) || 0;
                  setForm(prev => ({ ...prev, salary: s, netSalary: s - prev.advance }));
                }}
                min="0"
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <Label>Advance (₹)</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={form.advance}
                onChange={(e) => {
                  const advance = parseFloat(e.target.value) || 0;
                  setForm(prev => ({ ...prev, advance, netSalary: prev.salary - advance }));
                }}
              />
            </div>

            <div className="space-y-2">
              <Label>Net Salary (₹)</Label>
              <Input readOnly value={form.netSalary} className="bg-muted font-medium" />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditEmployeeSalaryDialog;
