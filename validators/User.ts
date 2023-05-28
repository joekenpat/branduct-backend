import { boolean, object, string, } from "zod";

export const UserValidator = object({
  fullName: string().min(3).max(255),
  email: string().email().max(255),
  password: string().min(8).max(18),
  state: string().nonempty(),
  lga: string().nonempty(),
  address: string().nonempty(),
  phone: string().nonempty(),
  isActive: boolean(),
  isAdmin: boolean(),
});

export const CreateUserValidator = UserValidator.pick({
  email: true,
  password: true,
  fullName: true,
});

export const LoginUserValidator = UserValidator.omit({
  fullName: true,
});
