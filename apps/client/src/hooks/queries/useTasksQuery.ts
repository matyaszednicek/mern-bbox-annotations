import { apiClient } from '@/lib/api-service';
import { Task } from '@mbba/schema';
import { useQuery } from '@tanstack/react-query';

const getTasks = async () => {
  const response = await apiClient.get<Task[]>('/tasks');
  return response.data;
};

export const useTasksQuery = () => {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: getTasks,
  });
};
