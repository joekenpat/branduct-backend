import { Document } from "mongoose";

export interface IUserDTO {
  fullName: string
  email: string,
  phone: string,
  password: string,
  state: string,
  lga: string,
  address: string,
  isActive: boolean,
  isAdmin: boolean
};

export type ICreateUserDTO = Pick<IUserDTO, "email" | "password" | "fullName">;

export type ILoginUserDTO = Omit<ICreateUserDTO, "fullName">;

export type IUpdateUserDTO = Partial<IUserDTO>;

export type IUserDocument = Document & IUserDTO;
