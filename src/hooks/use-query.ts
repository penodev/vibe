import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

type TRPC = ReturnType<typeof useTRPC>;

export const useTRPCQuery = <
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends readonly unknown[] = readonly unknown[]
>(
  getQueryOptions: (
    trpc: TRPC
  ) => UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>
): UseQueryResult<TData, TError> => {
  const trpc = useTRPC();
  const queryOptions = getQueryOptions(trpc);
  return useQuery(queryOptions);
};
