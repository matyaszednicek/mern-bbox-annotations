import { apiClient } from '@/lib/api-service';
import { useMutation } from '@tanstack/react-query';
import type { UpsertAnnotationsBody } from '@mbba/schema';

const postTaskImageUpsert = async (
  taskId: string,
  imageId: string,
  data: UpsertAnnotationsBody
) => {
  const response = await apiClient.post(
    `/tasks/${taskId}/images/${imageId}/annotations/upsert`,
    data
  );
  return response.data;
};

export const useUpsertAnnotationsMutation = (
  taskId: string,
  imageId: string
) => {
  return useMutation({
    mutationKey: ['annotations', taskId, imageId],
    mutationFn: (data: UpsertAnnotationsBody) =>
      postTaskImageUpsert(taskId, imageId, data),
  });
};
