export interface Service {
  id: number;
  name: string;
  description?: string;
  price: number;
  duration: number;
  otherCategory?: string | null;
  categoryId?: number | null;
  isFeatured: boolean;
  category?: {
    id: number;
    title: string;
  };
}
