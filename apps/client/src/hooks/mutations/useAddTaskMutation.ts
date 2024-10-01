import { apiClient } from '@/lib/api-service';
import { useMutation } from '@tanstack/react-query';
import { CreateTaskBody } from '@mbba/schema';

const postTasks = async (data: CreateTaskBody) => {
  const response = await apiClient.post('/tasks', data);
  return response.data;
};

export const useAddTaskMutation = () => {
  return useMutation({
    mutationKey: ['addTask'],
    mutationFn: postTasks,
  });
};
