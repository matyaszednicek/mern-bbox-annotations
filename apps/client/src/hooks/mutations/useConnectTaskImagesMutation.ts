import { apiClient } from '@/lib/api-service';
import { AddImagesToTaskBody } from '@mbba/schema';
import { useMutation } from '@tanstack/react-query';

const postTaskImages = async (taskId: string, data: AddImagesToTaskBody) => {
  const response = await apiClient.post(`/tasks/${taskId}/images`, data);
  return response.data;
};

export const useConnectTaskImagesMutation = (taskId: string) => {
  return useMutation({
    mutationKey: ['images', taskId],
    mutationFn: (data: AddImagesToTaskBody) => postTaskImages(taskId, data),
  });
};
