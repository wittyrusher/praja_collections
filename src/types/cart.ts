export interface ICartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size?: string;
  color?: string;
  stock: number;
}

export interface ICart {
  items: ICartItem[];
  totalItems: number;
  totalPrice: number;
}