import { apiClient } from '@/lib/api-service';
import { useMutation } from '@tanstack/react-query';

const postImagesUpload = async (file: File) => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await apiClient.post('/images/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const useUploadImageMutation = () => {
  return useMutation({
    mutationKey: ['uploadImage'],
    mutationFn: postImagesUpload,
  });
};
