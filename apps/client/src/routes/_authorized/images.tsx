import React from 'react';
import { ImageDropzone } from '@/components/Dropzone';
import { useUploadImageMutation } from '@/hooks/mutations/useUploadImageMutation';
import { useImagesQuery } from '@/hooks/queries/useImagesQuery';
import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { ImageGallery } from '@/components/general/ImageGallery';

export const Route = createFileRoute('/_authorized/images')({
  component: ImagesPage,
});

function ImagesPage() {
  const [uploadError, setUploadError] = React.useState<string | null>(null);
  const { data, isLoading } = useImagesQuery();
  const uploadImageMutation = useUploadImageMutation();
  const queryClient = useQueryClient();

  const imageUris = React.useMemo(() => {
    return data
      ? data
          .slice()
          .reverse()
          .map((item) => item.uri)
      : [];
  }, [data]);

  const onDrop = React.useCallback<
    <T extends File>(acceptedFiles: T[]) => void
  >(
    (acceptedFiles) => {
      setUploadError(null);
      uploadImageMutation.mutate(acceptedFiles[0], {
        onSuccess: () =>
          queryClient.invalidateQueries({ queryKey: ['images'] }),
        onError: (error) => {
          setUploadError('Failed to upload image');
        },
      });
    },
    [uploadImageMutation, queryClient]
  );

  return (
    <div className="container">
      <h1 className="mb-8 text-3xl font-bold text-center">Image Gallery</h1>
      <div className="mx-auto mb-8 w-96">
        <ImageDropzone onDrop={onDrop} />
        {uploadError && <p className="text-red-500">{uploadError}</p>}
      </div>
      {isLoading ? (
        <p className="text-center text-gray-500">Loading images...</p>
      ) : imageUris.length === 0 ? (
        <p className="text-center text-gray-500">No images uploaded yet.</p>
      ) : (
        <ImageGallery images={imageUris} />
      )}
    </div>
  );
}
