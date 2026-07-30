import api from "@/services/api/axios";
import type {
  Category,
  CategoriesListResponse,
  CategoryResponse,
  GetCategoriesParams,
} from "../types/category.types";
import type { CategoryFormValues } from "../schemas/category.schema";

export const getCategories = async (
  params: GetCategoriesParams = {}
): Promise<CategoriesListResponse> => {
  const response = await api.get<CategoriesListResponse>("/menus", { params });
  return response.data;
};

export const createCategory = async (
  values: CategoryFormValues
): Promise<CategoryResponse> => {
  const response = await api.post<CategoryResponse>("/menus", values);
  return response.data;
};

export const updateCategory = async (
  id: string,
  values: CategoryFormValues
): Promise<CategoryResponse> => {
  const response = await api.patch<CategoryResponse>(`/menus/${id}`, values);
  return response.data;
};

export const deleteCategory = async (id: string): Promise<void> => {
  await api.delete(`/menus/${id}`);
};

export type { Category };
