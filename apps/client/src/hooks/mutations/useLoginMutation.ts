import { apiClient } from '@/lib/api-service';
import { LoginBody } from '@mbba/schema';
import { useMutation } from '@tanstack/react-query';

const postLogin = async (data: LoginBody) => {
  const response = await apiClient.post('/auth/login', data);
  return response.data;
};

export const useLoginMutation = () => {
  return useMutation({
    mutationKey: ['login'],
    mutationFn: postLogin,
  });
};
