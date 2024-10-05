import { Models } from "mongoose";

export interface Center extends Models {
  name: string;
  users: string[]; // Assuming ObjectId is represented as a string
}

export interface User extends Models {
  id: string;
  email: string;
  name: string;
  surname: string;
  username: string;
  department?: string; // Assuming ObjectId is represented as a string
  center?: string; // Assuming ObjectId is represented as a string
  isAdmin: boolean;
  isVerified: boolean;
  verificationHash?: string;
  verificationTs?: number;
  resetPasswordHash?: string;
  resetPasswordTs?: number;
}
