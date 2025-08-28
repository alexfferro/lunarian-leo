import {
  createCreditCard,
  deleteCreditCard,
  getCreditCards,
  updateCreditCard,
} from "@/services/api/cards";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const CREDIT_CARDS_QUERY_KEY = ["credit-cards"];

export function useGetCreditCards() {
  return useQuery({
    queryKey: CREDIT_CARDS_QUERY_KEY,
    queryFn: getCreditCards,
  });
}

export function useCreateCreditCard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCreditCard,
    onSuccess: () => {
      toast("Cartão de crédito criado.");
      queryClient.invalidateQueries({ queryKey: CREDIT_CARDS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: (error) => toast(error.message),
  });
}

export function useUpdateCreditCard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCreditCard,
    onSuccess: () => {
      toast("Cartão de crédito atualizado.");
      queryClient.invalidateQueries({ queryKey: CREDIT_CARDS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: (error) => toast(error.message),
  });
}

export function useDeleteCreditCard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCreditCard,
    onSuccess: () => {
      toast("Cartão de crédito deletado.");
      queryClient.invalidateQueries({ queryKey: CREDIT_CARDS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: (error) => toast(error.message),
  });
}
