import api from "@/services/api/axios";
import type {
  Food,
  FoodResponse,
  FoodsListResponse,
  GetFoodsParams,
} from "../types/food.types";
import type { FoodFormValues } from "../schemas/food.schema";

export const getFoods = async (
  params: GetFoodsParams = {}
): Promise<FoodsListResponse> => {
  const response = await api.get<FoodsListResponse>("/foods", { params });
  return response.data;
};

const buildFoodFormData = (values: FoodFormValues): FormData => {
  const formData = new FormData();

  formData.append("name", values.name);
  formData.append("description", values.description);
  formData.append("price", String(values.price));
  formData.append("preparationTime", String(values.preparationTime));
  formData.append("menu", values.menu);
  formData.append("station", values.station);
  formData.append("availability", String(values.availability));

  const ingredients = values.ingredientsText
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  formData.append("ingredients", JSON.stringify(ingredients));

  if (values.image) {
    formData.append("image", values.image);
  }

  return formData;
};

// The shared axios instance defaults to Content-Type: application/json.
// Left as-is, axios silently JSON-stringifies FormData bodies instead of
// sending them as multipart (losing any attached file) — this must be
// unset per-request so the browser can set the correct multipart boundary.
const multipartConfig = {
  headers: { "Content-Type": undefined },
};

export const createFood = async (
  values: FoodFormValues
): Promise<FoodResponse> => {
  const response = await api.post<FoodResponse>(
    "/foods",
    buildFoodFormData(values),
    multipartConfig
  );
  return response.data;
};

export const updateFood = async (
  id: string,
  values: FoodFormValues
): Promise<FoodResponse> => {
  const response = await api.patch<FoodResponse>(
    `/foods/${id}`,
    buildFoodFormData(values),
    multipartConfig
  );
  return response.data;
};

export const updateFoodAvailability = async (
  id: string,
  availability: boolean
): Promise<FoodResponse> => {
  const response = await api.patch<FoodResponse>(`/foods/${id}`, {
    availability,
  });
  return response.data;
};

export const deleteFood = async (id: string): Promise<void> => {
  await api.delete(`/foods/${id}`);
};

export type { Food };
