import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Quote } from "../backend.d";
import { useActor } from "./useActor";

// ── Quote of the Day ──────────────────────────────────────────────────────────
export function useQuoteOfDay() {
  const { actor, isFetching } = useActor();
  return useQuery<Quote>({
    queryKey: ["quoteOfDay"],
    queryFn: async () => {
      if (!actor) throw new Error("No actor");
      return actor.getQuoteOfDay();
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

// ── All Quotes ────────────────────────────────────────────────────────────────
export function useAllQuotes() {
  const { actor, isFetching } = useActor();
  return useQuery<Quote[]>({
    queryKey: ["allQuotes"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllQuotes();
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 60 * 5,
  });
}

// ── Quotes by Category ────────────────────────────────────────────────────────
export function useQuotesByCategory(category: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Quote[]>({
    queryKey: ["quotes", category],
    queryFn: async () => {
      if (!actor) return [];
      if (category === "All") return actor.getAllQuotes();
      return actor.getQuotesByCategory(category);
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 60 * 5,
  });
}

// ── Favorites ─────────────────────────────────────────────────────────────────
export function useFavorites() {
  const { actor, isFetching } = useActor();
  return useQuery<bigint[]>({
    queryKey: ["favorites"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFavorites();
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 60,
  });
}

// ── Add Favorite ──────────────────────────────────────────────────────────────
export function useAddFavorite() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (quoteId: bigint) => {
      if (!actor) throw new Error("No actor");
      return actor.addFavorite(quoteId);
    },
    onMutate: async (quoteId) => {
      await queryClient.cancelQueries({ queryKey: ["favorites"] });
      const previous = queryClient.getQueryData<bigint[]>(["favorites"]) ?? [];
      queryClient.setQueryData<bigint[]>(["favorites"], (old) => {
        const arr = old ?? [];
        if (arr.some((id) => id === quoteId)) return arr;
        return [...arr, quoteId];
      });
      return { previous };
    },
    onError: (_err, _quoteId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["favorites"], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
}

// ── Remove Favorite ───────────────────────────────────────────────────────────
export function useRemoveFavorite() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (quoteId: bigint) => {
      if (!actor) throw new Error("No actor");
      return actor.removeFavorite(quoteId);
    },
    onMutate: async (quoteId) => {
      await queryClient.cancelQueries({ queryKey: ["favorites"] });
      const previous = queryClient.getQueryData<bigint[]>(["favorites"]) ?? [];
      queryClient.setQueryData<bigint[]>(["favorites"], (old) => {
        const arr = old ?? [];
        return arr.filter((id) => id !== quoteId);
      });
      return { previous };
    },
    onError: (_err, _quoteId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["favorites"], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
}
