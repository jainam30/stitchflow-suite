import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { addWorkerAdvance } from "@/Services/salaryService";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    workerId: string;
    onSaved?: (record?: any) => void;
}

export const AddWorkerAdvanceDialog: React.FC<Props> = ({ open, onOpenChange, workerId, onSaved }) => {
    const { toast } = useToast();
    const [amount, setAmount] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [note, setNote] = useState("");
    const [loading, setLoading] = useState(false);

    const save = async () => {
        if (!workerId || !amount || !date) {
            toast({ title: "Incomplete", description: "Please enter amount and date", variant: "destructive" });
            return;
        }

        setLoading(true);
        try {
            const res = await addWorkerAdvance({
                workerId,
                amount: Number(amount),
                date: new Date(date),
                note
            });

            if (res.error) throw res.error;

            toast({ title: "Advance Added", description: "Worker advance recorded." });
            setAmount("");
            setNote("");
            setDate(new Date().toISOString().split("T")[0]);
            onOpenChange(false);

            // Pass the new record (handle array return from supbase insert)
            const newRecord = Array.isArray(res.data) ? res.data[0] : res.data;
            onSaved?.(newRecord);
        } catch (err: any) {
            toast({ title: "Error", description: err.message || "Failed to save", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Worker Advance</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 pt-2">
                    <div>
                        <Label>Date</Label>
                        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                    </div>
                    <div>
                        <Label>Amount (₹)</Label>
                        <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
                    </div>
                    <div>
                        <Label>Note</Label>
                        <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Reason (optional)" />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={save} disabled={loading}>{loading ? "Saving..." : "Save"}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
