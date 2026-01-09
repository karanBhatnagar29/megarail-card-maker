export interface CardFormData {
  employeeName: string;
  fatherName: string;
  designation: string;
  adharCardNumber: string;
  hirer: string;
  bloodGroup: string;
  policeVerification: string;
  dateOfIssue: string;
  validTill: string;
  mobileNumber: string;
  address: string;
  cardNo: string;
  divisionName: string;
  profileName: string;
  description?: string;
}

export interface CardFiles {
  photo?: File | null;
  seal?: File | null;
  sign?: File | null;
}

export interface CardDataComplete extends CardFormData {
  _id?: string;
  photo?: string;
  seal?: string;
  sign?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const;

export const DIVISIONS = [
  'NWR BKN',
  'NWR JP',
  'NWR JU',
  'NWR AII',
  'CR',
  'ER',
  'ECR',
  'NR',
  'NCR',
  'NER',
  'NFR',
  'SR',
  'SCR',
  'SER',
  'SECR',
  'SWR',
  'WR',
  'WCR',
] as const;

export const initialFormData: CardFormData = {
  employeeName: '',
  fatherName: '',
  designation: '',
  adharCardNumber: '',
  hirer: '',
  bloodGroup: '',
  policeVerification: '',
  dateOfIssue: '',
  validTill: '',
  mobileNumber: '',
  address: '',
  cardNo: '',
  divisionName: '',
  profileName: '',
  description: '',
};
