import { apiClient } from '@/lib/api-service';
import { useQuery } from '@tanstack/react-query';

const getUser = async () => {
  const response = await apiClient.get('/auth/me');
  return response.data;
};

export const useUserQuery = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: getUser,
    retry: false,
  });
};
