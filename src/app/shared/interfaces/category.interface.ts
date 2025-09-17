export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  icon?: string;
  blogCount?: number;
  createdAt: Date;
  updatedAt: Date;
}
