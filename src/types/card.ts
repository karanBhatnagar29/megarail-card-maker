export type CardFormData = {
  cardNo: string;
  dateOfIssue?: string;

  employeeName: string;
  fatherName: string;

  designation: string;

  hirer: string; // Designation of issuing authority
  divisionName: string; // Issuing authority name
  profileName: string;

  adharCardNumber: string;
  validTill: string;

  mobileNumber: string;
  address: string;

  bloodGroup: string;
  policeVerification?: string;
  description?: string;
};

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

export const BLOOD_GROUPS = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
] as const;

export const DIVISIONS = [
  "NWR BKN",
  "NWR JP",
  "NWR JU",
  "NWR AII",
  "CR",
  "ER",
  "ECR",
  "NR",
  "NCR",
  "NER",
  "NFR",
  "SR",
  "SCR",
  "SER",
  "SECR",
  "SWR",
  "WR",
  "WCR",
] as const;

export const initialFormData: CardFormData = {
  cardNo: "",
  dateOfIssue: "",

  employeeName: "",
  fatherName: "",

  designation: "",

  hirer: "",
  divisionName: "",
  profileName: "M/s. Megarail Power Projects LLP",

  adharCardNumber: "",
  validTill: "",

  mobileNumber: "",
  address: "",

  bloodGroup: "O+",
  policeVerification: "",
};
