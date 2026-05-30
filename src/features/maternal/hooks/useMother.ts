"use client";

import { useMutation } from "@tanstack/react-query";
import { registerMother } from "../api/mothers.api";
import type { MotherRegistrationRequest, MotherRegistrationResponse } from "../types";

export function useMother() {
  const mutation = useMutation<
    MotherRegistrationResponse,
    Error,
    MotherRegistrationRequest
  >({
    mutationFn: registerMother,
  });

  return {
    mutate: mutation.mutate,
    isPending: mutation.isPending,
    data: mutation.data,
    error: mutation.error,
    reset: mutation.reset,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
  };
}
