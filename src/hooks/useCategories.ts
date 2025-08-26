import {
  createCategories,
  deleteCategory,
  getCategories,
  updateCategory,
} from "@/services/api/categories";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const CATEGORIES_QUERY_KEY = ["categories"];

export function useGetCategories() {
  return useQuery({
    queryKey: CATEGORIES_QUERY_KEY,
    queryFn: getCategories,
  });
}

export function useCreateCategories() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCategories,
    onSuccess: () => {
      toast("Categoria criada.");
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: (error) => toast(error.message),
  });
}

export function useUpdateCategories() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      toast("Categoria atualizada.");
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: (error) => toast(error.message),
  });
}

export function useDeleteCategories() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      toast("Categoria deletada.");
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: (error) => toast(error.message),
  });
}
