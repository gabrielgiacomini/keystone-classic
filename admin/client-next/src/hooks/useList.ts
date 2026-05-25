import { useQuery } from '@tanstack/react-query';
import { fetchAdminMeta, fetchList } from '../api/list.js';
import type { ListItem } from '../api/list.js';

interface UseListOptions {
  page?: number;
  pageSize?: number;
  search?: string;
  sort?: string;
  filters?: Record<string, unknown>;
  fields?: string[];
  expandRelationshipFields?: boolean;
  enabled?: boolean;
}

interface UseListResult {
  items: ListItem[];
  count: number;
  isLoading: boolean;
  isError: boolean;
}

export function useList(listKey: string, options: UseListOptions = {}): UseListResult {
  const {
    page = 1,
    pageSize = 50,
    search = '',
    sort = '',
    filters = {},
    fields,
    expandRelationshipFields,
    enabled = true,
  } = options;
  const skip = (page - 1) * pageSize;

  const params: Record<string, string> = {
    limit: String(pageSize),
    skip: String(skip),
  };
  if (search) params['search'] = search;
  if (sort) params['sort'] = sort;
  if (Object.keys(filters).length > 0) params['filters'] = JSON.stringify(filters);

  const { data, isLoading, isError } = useQuery({
    queryKey: [
      'list',
      listKey,
      { page, pageSize, search, sort, filters, fields, expandRelationshipFields },
    ],
    queryFn: () => fetchList(listKey, params, { fields, expandRelationshipFields }),
    enabled,
  });

  return {
    items: data?.results ?? [],
    count: data?.count ?? 0,
    isLoading,
    isError,
  };
}

export function useAdminMeta() {
  return useQuery({
    queryKey: ['admin-meta'],
    queryFn: fetchAdminMeta,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}
