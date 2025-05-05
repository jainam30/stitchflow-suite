
export interface WorkerSalary {
  id: string;
  workerId: string;
  productId: string;
  date: Date;
  operationId: string;
  piecesDone: number;
  amountPerPiece: number;
  totalAmount: number;
  paid: boolean;
  paidDate?: Date;
  paidBy?: string;
}

export interface EmployeeSalary {
  id: string;
  employeeId: string;
  month: Date;
  salary: number;
  advance: number;
  netSalary: number;
  paid: boolean;
  paidDate?: Date;
  paidBy?: string;
}

export interface EmployeeAdvance {
  id: string;
  employeeId: string;
  date: Date;
  amount: number;
  createdBy: string;
}

export interface WorkerSalaryFormData {
  workerId: string;
  productId: string;
  operationId: string;
  piecesDone: number;
  amountPerPiece: number;
  totalAmount: number;
}

export interface EmployeeSalaryFormData {
  employeeId: string;
  month: Date;
  salary: number;
  advance: number;
  netSalary: number;
}
