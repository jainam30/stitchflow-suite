
export interface ProductionCutting {
  id: string;
  productId: string;
  totalPieces: number;
  cutDate: Date;
  createdBy: string;
}

export interface ProductionOperation {
  id: string;
  productionId: string;
  operationId: string;
  workerId: string;
  piecesDone: number;
  date: Date;
  createdBy: string;
}

export interface ProductionProgress {
  operationName: string;
  totalPieces: number;
  completedPieces: number;
  percentage: number;
}

export interface ProductionStatus {
  productId: string;
  productName: string;
  totalPieces: number;
  completedPieces: number;
  percentage: number;
  operationsProgress: ProductionProgress[];
}

export interface WorkerProductionEntry {
  productId: string;
  workerId: string;
  operationId: string;
  piecesDone: number;
}

export interface Production {
  id: string;
  name: string;
  productionId: string;
  poNumber: string;
  color: string;
  totalFabric: number;
  average: number;
  totalQuantity: number;
  operations: ProductionOperationDetail[];
  createdBy: string;
  createdAt: Date;
}

export interface ProductionOperationDetail {
  id: string;
  name: string;
  ratePerPiece: number;
  isCompleted: boolean;
  productionId: string;
}

export interface ProductionFormData {
  name: string;
  productionId: string;
  poNumber: string;
  color: string;
  totalFabric: number;
  average: number;
  totalQuantity: number;
  operations: {
    name: string;
    ratePerPiece: number;
  }[];
}
