
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Users, Scissors, Clock, BarChart, TrendingUp, Calendar, Clipboard } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  // Mock data for dashboard
  const productionStats = [
    { id: 'P001', name: 'Summer Shirt 2025', progress: 65, color: 'from-blue-500 to-cyan-500' },
    { id: 'P002', name: 'Formal Trousers', progress: 42, color: 'from-amber-500 to-orange-500' },
    { id: 'P003', name: 'Winter Jacket', progress: 89, color: 'from-green-500 to-emerald-500' },
  ];

  // Mock data for worker operations
  const recentWorkerOperations = [
    { 
      id: 1, 
      workerName: 'Ramesh Kumar', 
      product: 'Summer Shirt 2025', 
      operation: 'Cutting', 
      pieces: 30, 
      earnings: 150, 
      date: new Date().toLocaleDateString() 
    },
    { 
      id: 2, 
      workerName: 'Suresh Singh', 
      product: 'Formal Trousers', 
      operation: 'Stitching', 
      pieces: 25, 
      earnings: 250, 
      date: new Date().toLocaleDateString() 
    },
    { 
      id: 3, 
      workerName: 'Anil Patel', 
      product: 'Winter Jacket', 
      operation: 'Weaving', 
      pieces: 15, 
      earnings: 225, 
      date: new Date().toLocaleDateString() 
    },
    { 
      id: 4, 
      workerName: 'Manoj Kumar', 
      product: 'Summer Shirt 2025', 
      operation: 'Cutting', 
      pieces: 20, 
      earnings: 100, 
      date: new Date().toLocaleDateString() 
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 rounded-lg mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Welcome back, {user?.name}</h1>
        <p className="text-muted-foreground">Here's an overview of your production and operations.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="dashboard-card border-t-4 border-t-primary shadow-md hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isAdmin ? 'Total Workers' : 'Active Workers'}
            </CardTitle>
            <div className="bg-primary/10 p-2 rounded-full text-primary">
              <Users size={18} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isAdmin ? 48 : 36}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              +3 in the last month
            </p>
          </CardContent>
        </Card>
        
        <Card className="dashboard-card border-t-4 border-t-secondary shadow-md hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Products</CardTitle>
            <div className="bg-secondary/10 p-2 rounded-full text-secondary">
              <Scissors size={18} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              3 pending completion
            </p>
          </CardContent>
        </Card>
        
        <Card className="dashboard-card border-t-4 border-t-accent shadow-md hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Production</CardTitle>
            <div className="bg-accent/10 p-2 rounded-full text-accent">
              <Clock size={18} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">243 pcs</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              +18% from yesterday
            </p>
          </CardContent>
        </Card>
        
        <Card className="dashboard-card border-t-4 border-t-red-500 shadow-md hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isAdmin ? 'Payments Pending' : 'Today\'s Operations'}
            </CardTitle>
            <div className="bg-red-100 p-2 rounded-full text-red-500">
              <BarChart size={18} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isAdmin ? '₹45,231' : '8'}</div>
            <p className="text-xs text-muted-foreground">
              {isAdmin ? 'For this month' : 'Across 3 products'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1 dashboard-card shadow-md hover:shadow-lg transition-all overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
            <CardTitle>Production Progress</CardTitle>
            <CardDescription>
              Current status of active production orders
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              {productionStats.map((product) => (
                <div key={product.id} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">{product.name}</span>
                    <span className="text-sm text-gray-500">{product.progress}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${product.color}`} 
                      style={{ width: `${product.progress}%`, transition: 'width 1s ease-in-out' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1 dashboard-card shadow-md hover:shadow-lg transition-all overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
            <CardTitle>Recent Worker Operations</CardTitle>
            <CardDescription>
              Recent work completed by workers and their earnings
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {recentWorkerOperations.map((op) => (
                <div key={op.id} className="flex items-center p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center mr-3">
                    <Clipboard size={16} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium">{op.workerName}</p>
                      <p className="text-xs font-semibold text-primary">₹{op.earnings}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-xs text-gray-500">
                        {op.operation} - {op.product} ({op.pieces} pcs)
                      </p>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar size={12} />
                        {op.date}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
