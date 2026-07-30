export type FoodStation =
  | "Bakery"
  | "Beverages"
  | "Breakfast"
  | "Fryer"
  | "Grill"
  | "Legumes & Pots"
  | "Pepper Soup"
  | "Protein Prep"
  | "Rice & Grains"
  | "Swallow & Soup";

export interface FoodMenuRef {
  _id: string;
  categoryName: string;
}

export interface Food {
  _id: string;
  name: string;
  description: string;
  ingredients: string[];
  price: number;
  image: string;
  availability: boolean;
  preparationTime: number;
  station: FoodStation;
  menu: FoodMenuRef | string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  count: number;
  page: number;
  limit: number;
  totalRecords: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface FoodsListResponse {
  success: boolean;
  message: string;
  data: Food[];
  meta: PaginationMeta;
}

export interface FoodResponse {
  success: boolean;
  message: string;
  data: Food;
}

export interface GetFoodsParams {
  page?: number;
  limit?: number;
  name?: string;
  menu?: string;
}
