import { apiClient } from '@/lib/api-service';
import { Image } from '@mbba/schema';
import { useQuery } from '@tanstack/react-query';

const getImages = async () => {
  const response = await apiClient.get<Image[]>('/images');
  return response.data;
};

export const useImagesQuery = () => {
  return useQuery({
    queryKey: ['images'],
    queryFn: getImages,
  });
};
