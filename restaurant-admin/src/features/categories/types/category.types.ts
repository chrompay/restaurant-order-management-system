export type CategoryStatus = "Active" | "Draft";

export interface Category {
  _id: string;
  categoryName: string;
  description: string;
  icon: string;
  status: CategoryStatus;
  itemCount: number;
  revenue: number;
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

export interface CategoriesListResponse {
  success: boolean;
  message: string;
  data: Category[];
  meta: PaginationMeta;
}

export interface CategoryResponse {
  success: boolean;
  message: string;
  data: Category;
}

export interface GetCategoriesParams {
  page?: number;
  limit?: number;
}
