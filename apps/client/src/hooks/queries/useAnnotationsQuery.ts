import { apiClient } from '@/lib/api-service';
import { Annotation } from '@mbba/schema';
import { useQuery } from '@tanstack/react-query';

const getTaskImageAnnotations = async (taskId: string, imageId: string) => {
  const response = await apiClient.get<Annotation[]>(
    `/tasks/${taskId}/images/${imageId}/annotations`
  );
  return response.data;
};

export const useAnnotationsQuery = (taskId: string, imageId: string) => {
  return useQuery({
    queryKey: ['annotations', taskId, imageId],
    queryFn: () => getTaskImageAnnotations(taskId, imageId),
  });
};
