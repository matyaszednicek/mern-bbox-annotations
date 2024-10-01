import { apiClient } from '@/lib/api-service';
import { FullTask } from '@mbba/schema';
import { useQuery } from '@tanstack/react-query';

const getTask = async (taskId: string) => {
  const response = await apiClient.get<FullTask>(`/tasks/${taskId}`);
  return response.data;
};

export const useTaskQuery = (taskId: string) => {
  return useQuery({
    queryKey: ['tasks', taskId],
    queryFn: () => getTask(taskId),
  });
};
