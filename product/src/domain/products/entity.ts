export interface Product {
  id: string;
  name: string;
  sku: string;
  image: string;
  price: number;
  stock: number;
  description?: string;
}
