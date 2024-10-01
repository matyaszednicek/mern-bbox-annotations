import { apiClient } from '@/lib/api-service';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const postLogout = async () => {
  const response = await apiClient.post('/auth/logout');
  return response.data;
};

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['logout'],
    mutationFn: postLogout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};
