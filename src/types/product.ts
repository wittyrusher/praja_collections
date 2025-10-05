export interface IProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: string;
  images: string[];
  stock: number;
  sizes?: string[];
  colors?: string[];
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductInput {
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: string;
  images: string[];
  stock: number;
  sizes?: string[];
  colors?: string[];
  featured?: boolean;
}

export interface UpdateProductInput extends Partial<CreateProductInput> {
  _id: string;
}