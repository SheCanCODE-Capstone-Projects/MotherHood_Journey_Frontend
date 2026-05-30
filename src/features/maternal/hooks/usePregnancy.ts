import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as pregnanciesApi from "@/features/maternal/api/pregnancies.api";
import type {
  BackendPregnancy,
  CreatePregnancyRequest,
  UpdatePregnancyRequest,
} from "@/features/maternal/types";

export function usePregnanciesByMother(motherId: string) {
  return useQuery<BackendPregnancy[]>({
    queryKey: ["pregnancies", "mother", motherId],
    queryFn: () => pregnanciesApi.getPregnanciesByMother(motherId),
    enabled: !!motherId,
  });
}

export function usePregnancy(id: string) {
  return useQuery<BackendPregnancy>({
    queryKey: ["pregnancies", id],
    queryFn: () => pregnanciesApi.getPregnancyById(id),
    enabled: !!id,
  });
}

export function useCreatePregnancy() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePregnancyRequest) =>
      pregnanciesApi.createPregnancy(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["pregnancies", "mother", data.motherId],
      });
    },
  });
}

export function useUpdatePregnancy() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdatePregnancyRequest;
    }) => pregnanciesApi.updatePregnancy(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["pregnancies", data.motherId],
      });
      queryClient.invalidateQueries({
        queryKey: ["pregnancies", data.id],
      });
    },
  });
}
