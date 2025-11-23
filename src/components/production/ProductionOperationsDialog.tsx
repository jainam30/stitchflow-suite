// src/components/production/ProductionOperationsDialog.tsx
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Worker } from "@/types/worker";
import { Production } from "@/types/production";
import { getOperationsByProductionId, assignWorkerToOperation, insertProductionOperation } from "@/Services/productionService";
import { getOperationsByProduct } from "@/Services/operationService";
import { getWorkers } from "@/Services/workerService";
import { useToast } from "@/hooks/use-toast";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  production: Production | null;
  availableWorkers: Worker[];
  onAssignWorker?: (productionId: string, operationRecordId: string, workerId: string, pieces: number) => void;
}

const ProductionOperationsDialog: React.FC<Props> = ({ open, onOpenChange, production, availableWorkers, onAssignWorker }) => {
  const { toast } = useToast();
  const [ops, setOps] = useState<any[]>([]);
  const [opMasters, setOpMasters] = useState<any[]>([]);
  const [fetchedWorkers, setFetchedWorkers] = useState<any[]>([]);
  const [selectedOpId, setSelectedOpId] = useState<string | null>(null); // id of production_operation row OR `master:<id>` when choosing from master
  const [selectedWorkerId, setSelectedWorkerId] = useState<string | null>(null);
  const [pieces, setPieces] = useState<number>(0);

  useEffect(() => {
    if (!production) {
      setOps([]);
      setOpMasters([]);
      return;
    }
    (async () => {
      try {
        const data = await getOperationsByProductionId(production.id);
        setOps(data || []);
        // fetch operation masters for this product
        const prodId = (production as any).productId ?? (production as any).product_id;
        if (prodId) {
          const masters = await getOperationsByProduct(prodId);
          setOpMasters(masters || []);
        } else {
          setOpMasters([]);
        }
        // fetch workers
        const workers = await getWorkers();
        setFetchedWorkers(workers || []);
      } catch (err) {
        console.error(err);
        toast({ title: "Error", description: "Failed to load operations", variant: "destructive" });
      }
    })();
  }, [production]);

  const handleAdd = async () => {
    if (!production) {
      toast({ title: "Production missing", variant: "destructive" });
      return;
    }

    try {
      // If a master operation was selected (value starts with `master:`), insert a new production_operation
      if (selectedOpId && selectedOpId.startsWith("master:")) {
        const masterId = selectedOpId.split(":")[1];
        const master = opMasters.find(m => m.id === masterId);
        const workerList = (availableWorkers && availableWorkers.length > 0) ? availableWorkers : fetchedWorkers;
        const worker = workerList.find((w: any) => w.id === selectedWorkerId);
        const workerName = worker ? worker.name : null;

        const payload = {
          production_cutting_id: null,
          operation_id: masterId,
          worker_id: selectedWorkerId || null,
          worker_name: workerName || null,
          pieces_done: pieces || 0,
          earnings: master?.amount_per_piece ? (pieces || 0) * (master.amount_per_piece || 0) : 0,
          date: new Date().toISOString().split("T")[0],
          supervisor_employee_id: null,
          production_id: production.id,
          created_at: new Date().toISOString(),
        };

        await insertProductionOperation(payload);
        toast({ title: "Added", description: "Operation record created" });

        const refreshed = await getOperationsByProductionId(production.id);
        setOps(refreshed || []);

        // clear form
        setSelectedOpId(null);
        setSelectedWorkerId(null);
        setPieces(0);
        return;
      }

      // Otherwise update existing production_operation
      if (!selectedOpId) {
        toast({ title: "Select operation", variant: "destructive" });
        return;
      }

      const workerList = (availableWorkers && availableWorkers.length > 0) ? availableWorkers : fetchedWorkers;
      const worker = workerList.find((w: any) => w.id === selectedWorkerId);
      const workerName = worker ? worker.name : null;

      const res = await assignWorkerToOperation(production.id, selectedOpId, selectedWorkerId || null, pieces || 0, workerName || null);
      toast({ title: "Assigned", description: "Worker and quantity saved" });

      const refreshed = await getOperationsByProductionId(production.id);
      setOps(refreshed || []);

      onAssignWorker && onAssignWorker(production.id, selectedOpId, selectedWorkerId || "", pieces || 0);
      setSelectedOpId(null);
      setSelectedWorkerId(null);
      setPieces(0);
    } catch (err: any) {
      console.error(err);
      toast({ title: "Error", description: err?.message || "Failed to assign", variant: "destructive" });
    }
  };

  if (!production) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle>Assign Worker / Record Pieces</DialogTitle>
      </DialogHeader>
      <DialogContent>
        <div className="space-y-4">
          

          <div>
            <label className="block text-sm font-medium mb-1">Select Operation</label>
            <Select value={selectedOpId ?? ""} onValueChange={(v) => setSelectedOpId(v || null)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose operation (production operation record)" />
              </SelectTrigger>
              <SelectContent>
                {/* no empty string SelectItem: empty value is reserved for clearing selection */}
                {/* First show existing production_operation records (choose to update) */}
                {ops.map(op => (
                  <SelectItem key={op.id} value={op.id}>
                    {op.operations?.name ?? op.operation_id ?? "Operation"} — Pieces done: {op.pieces_done}
                  </SelectItem>
                ))}
                {/* Then show operation masters so user can create a new production_operation */}
                {opMasters.map(m => (
                  <SelectItem key={`master-${m.id}`} value={`master:${m.id}`}>{m.name} — ₹{m.amount_per_piece}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Select Worker</label>
            <Select value={selectedWorkerId ?? ""} onValueChange={(v) => setSelectedWorkerId(v === "__none" ? null : (v || null))}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select worker" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none">none</SelectItem>
                {(availableWorkers && availableWorkers.length > 0 ? availableWorkers : fetchedWorkers).map((w: any) => (
                  <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Quantity (pieces)</label>
            <input
              type="number"
              value={pieces}
              onChange={(e) => setPieces(Number(e.target.value))}
              className="w-full border rounded px-2 py-2"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
            <Button onClick={handleAdd}>Add / Save</Button>
          </div>

          <div className="mt-4">
            <h4 className="font-medium">Existing Operation Records</h4>
            <div className="mt-2 space-y-2">
              {ops.map(o => (
                <div key={o.id} className="border rounded p-2">
                  <div className="text-sm font-medium">{o.operations?.name ?? o.operation_id}</div>
                  <div className="text-xs text-muted-foreground">
                    Worker: {o.worker_name ?? "none"} · Pieces: {o.pieces_done} · Date: {o.date}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
      <DialogFooter>
        <Button onClick={() => onOpenChange(false)}>Close</Button>
      </DialogFooter>
    </Dialog>
  );
};

export default ProductionOperationsDialog;
