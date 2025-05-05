
export interface Worker {
  id: string;
  name: string;
  workerId: string;
  address: string;
  permanentAddress: string;
  currentAddress: string;
  mobileNumber: string;
  emergencyNumber: string;
  idProof: string;
  idProofImageUrl?: string;
  bankAccountDetail: string;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  accountHolderName?: string;
  bankImageUrl: string;
  profileImageUrl?: string;
  addressProofImageUrl?: string;
  createdBy: string;
  createdAt: Date;
}

export interface WorkerFormData {
  name: string;
  workerId: string;
  address: string;
  permanentAddress: string;
  currentAddress: string;
  mobileNumber: string;
  emergencyNumber: string;
  idProof: string;
  idProofImage: File | null;
  bankAccountDetail: string;
  bankName: string;
  accountNumber: string;
  confirmAccountNumber: string;
  ifscCode: string;
  accountHolderName: string;
  bankImage: File | null;
  profileImage: File | null;
  addressProofImage: File | null;
}
