import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchItem, updateItem } from '../api/list.js';
import type { ListFetchOptions, ListItem } from '../api/list.js';

interface UseItemOptions extends ListFetchOptions {
  /** When false, the item query is skipped (default: true). */
  enabled?: boolean;
}

interface UseItemResult {
  item: ListItem | undefined;
  isLoading: boolean;
  isError: boolean;
}

export function useItem(
  listKey: string,
  id: string,
  options: UseItemOptions = {},
): UseItemResult {
  const { enabled = true, ...fetchOptions } = options;
  const { data, isLoading, isError } = useQuery({
    queryKey: ['item', listKey, id, fetchOptions],
    queryFn: () => fetchItem(listKey, id, fetchOptions),
    enabled,
  });

  return {
    item: data?.item,
    isLoading,
    isError,
  };
}

interface UseItemMutationsResult {
  update: (data: Record<string, unknown>) => Promise<{ item: ListItem }>;
  isUpdating: boolean;
}

export function useItemMutations(listKey: string, id: string): UseItemMutationsResult {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: Record<string, unknown>) => updateItem(listKey, id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['item', listKey, id] });
      void queryClient.invalidateQueries({ queryKey: ['list', listKey] });
    },
  });

  return {
    update: mutation.mutateAsync,
    isUpdating: mutation.isPending,
  };
}
