import { LoginBody, loginBodySchema } from '@mbba/schema';
import { useLoginMutation } from '../mutations/useLoginMutation';
import { useForm } from 'react-hook-form';
import { AxiosError } from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';

export const useLoginForm = () => {
  const loginMutation = useLoginMutation();
  const queryClient = useQueryClient();

  const form = useForm<LoginBody>({
    resolver: zodResolver(loginBodySchema),
    defaultValues: {},
  });

  const onSubmit = (values: LoginBody) => {
    loginMutation.mutate(values, {
      onSuccess: () => {
        form.reset();
        queryClient.invalidateQueries({ queryKey: ['user'] });
      },
      onError: (error) => {
        if (error instanceof AxiosError && error.response?.status === 401) {
          form.setError('root', {
            type: 'manual',
            message: 'Invalid email or password',
          });
          return;
        }

        form.setError('root', {
          type: 'manual',
          message: 'Something went wrong. Please try again later.',
        });
      },
    });
  };

  return {
    form,
    onSubmit,
    disableSubmit: form.formState.isSubmitting || loginMutation.isPending,
    isSuccess: loginMutation.isSuccess,
  };
};
