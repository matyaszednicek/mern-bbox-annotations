import { apiClient } from '@/lib/api-service';
import { useMutation } from '@tanstack/react-query';
import type { RegisterFormSchema } from '@/hooks/forms/useRegisterForm';

const postRegister = async (data: RegisterFormSchema) => {
  const response = await apiClient.post('/auth/register', data);
  return response.data;
};

export const useRegisterMutation = () => {
  return useMutation({
    mutationKey: ['register'],
    mutationFn: postRegister,
  });
};
