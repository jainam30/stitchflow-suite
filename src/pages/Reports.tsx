import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import {
  fetchProductions,
  fetchProductionOperations,
  fetchWorkerSalaries,
  calculateProductionReport,
  calculateOperationsChartData,
  calculateWorkerPerformance,
  fetchProductCost,
} from "@/Services/reportService";

const ReportPage: React.FC = () => {
  const [productions, setProductions] = useState<any[]>([]);
  const [selectedProductionId, setSelectedProductionId] = useState<string | null>(null);
  const [operations, setOperations] = useState<any[]>([]);
  const [salaries, setSalaries] = useState<any[]>([]);
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly" | "yearly">("monthly");
  const [costPerPiece, setCostPerPiece] = useState(0);

  useEffect(() => {
    Promise.all([fetchProductions(), fetchWorkerSalaries()])
      .then(([prods, sal]) => {
        setProductions(prods || []);
        setSalaries(sal || []);
        if (prods && prods.length > 0) setSelectedProductionId(prods[0].id);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
  if (!selectedProductionId) return;

  // get selected production row
  const prod = productions.find(p => p.id === selectedProductionId);
  if (!prod?.product_id) return;

  // fetch product cost from service
  fetchProductCost(prod.product_id)
    .then(({ costPerPiece }) => setCostPerPiece(costPerPiece))
    .catch(() => setCostPerPiece(0));
}, [selectedProductionId, productions]);

  useEffect(() => {
    if (!selectedProductionId) return;
    fetchProductionOperations(selectedProductionId)
      .then((ops) => setOperations(ops || []))
      .catch((err) => console.error(err));
  }, [selectedProductionId]);

const report = useMemo(
  () => calculateProductionReport(operations, period, costPerPiece),
  [operations, period, costPerPiece]
);
  const operationsChart = useMemo(() => calculateOperationsChartData(operations, period), [operations, period]);
  const employeePerformance = useMemo(() => calculateWorkerPerformance(salaries, period), [salaries, period]);

  const chartData = [{
    name: "Production Cost Breakdown",
    "Operation Expense": report.operationExpense,
    "Raw Material Cost": report.rawMaterialCost,
    "Total Expense": report.totalExpense,
  }];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports Dashboard</h1>
        <p className="text-muted-foreground mt-2">View detailed reports on production performance and employee productivity</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Select Production</CardTitle>
            <CardDescription>Choose a production to view its reports</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-84">
              {productions.map((production) => (
                <div
                  key={production.id}
                  className={`p-3 mb-2 rounded-md cursor-pointer ${selectedProductionId === production.id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                  onClick={() => setSelectedProductionId(production.id)}
                >
                  <div className="font-medium">{production.productName}</div>
                  <div className="text-sm">ID: {production.production_code}</div>
                  <div className="text-sm">Color: {production.color} | Quantity: {production.total_quantity ?? 0}</div>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle>Production Overview</CardTitle>
              <Select value={period} onValueChange={(v) => setPeriod(v as any)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <CardDescription>{productions.find(p => p.id === selectedProductionId)?.name ?? 'Select a production to view details'}</CardDescription>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-muted p-3 rounded-lg">
                <div className="text-muted-foreground text-sm mb-1">Production</div>
                <div className="text-2xl font-bold">{report.productionQuantity || 0} pcs</div>
              </div>

              <div className="bg-muted p-3 rounded-lg">
                <div className="text-muted-foreground text-sm mb-1">Expense</div>
                <div className="text-2xl font-bold">₹{(report.totalExpense || 0).toLocaleString()}</div>
              </div>

              <div className="bg-muted p-3 rounded-lg">
                <div className="text-muted-foreground text-sm mb-1">Raw Material</div>
                <div className="text-2xl font-bold">₹{(report.rawMaterialCost || 0).toLocaleString()}</div>
              </div>

              <div className="bg-muted p-3 rounded-lg">
                <div className="text-muted-foreground text-sm mb-1">Efficiency</div>
                <div className="text-2xl font-bold">{report.efficiency || 0}%</div>
              </div>
            </div>

            <div className="h-64 mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Operation Expense" fill="#4F46E5" />
                  <Bar dataKey="Raw Material Cost" fill="#10b981"/>
                  <Bar dataKey="Total Expense" fill="#F59E0B"/>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={operationsChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="cost" name="Cost per Operation" fill = "#eb6923ff" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card>
          <CardHeader>
            <CardTitle>Worker Performance</CardTitle>
            <CardDescription>Productivity metrics for worker working on production operations</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>WORKER</TableHead>
                  <TableHead>Total Pieces</TableHead>
                  <TableHead>Operations</TableHead>
                  <TableHead>Efficiency</TableHead>
                  <TableHead>Earnings</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employeePerformance.map(emp => (
                  <TableRow key={emp.employeeId}>
                    <TableCell>{emp.employeeName}</TableCell>
                    <TableCell>{emp.totalPiecesCompleted}</TableCell>
                    <TableCell>{emp.totalOperations}</TableCell>
                    <TableCell>{emp.efficiency}%</TableCell>
                    <TableCell>₹{emp.earnings}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportPage;
