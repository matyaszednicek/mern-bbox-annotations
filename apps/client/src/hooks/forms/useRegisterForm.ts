import { useToast } from '@/components/hooks/use-toast';
import { registerBodySchema } from '@mbba/schema';
import { z } from 'zod';
import { useRegisterMutation } from '../mutations/useRegisterMutation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { isClientError } from '@/lib/utils';

const formSchema = registerBodySchema
  .extend({
    passwordAgain: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.passwordAgain !== data.password) {
      ctx.addIssue({
        code: 'custom',
        message: 'Passwords do not match',
        path: ['passwordAgain'],
      });
    }
  });
export type RegisterFormSchema = z.infer<typeof formSchema>;

export const useRegisterForm = () => {
  const { toast } = useToast();
  const registerMutation = useRegisterMutation();

  const form = useForm<RegisterFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  const onSubmit = (values: RegisterFormSchema) => {
    if (values.password !== values.passwordAgain) {
      form.setError('passwordAgain', {
        type: 'manual',
        message: 'Passwords do not match',
      });
      return;
    }

    registerMutation.mutate(values, {
      onSuccess: () => {
        form.reset();
        toast({
          title: 'Account created',
          description: 'You can login now.',
          duration: 4000,
        });
      },
      onError: (error) => {
        if (
          error instanceof AxiosError &&
          isClientError(error.response?.status ?? 0)
        ) {
          form.setError('root', {
            type: 'manual',
            message: error.response?.data.message,
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
    disableSubmit: form.formState.isSubmitting || registerMutation.isPending,
    isSuccess: registerMutation.isSuccess,
  };
};
