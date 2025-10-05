export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  role: 'user' | 'admin';
  phone?: string;
  address?: IAddress;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAddress {
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface RegisterUserInput {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface LoginUserInput {
  email: string;
  password: string;
}