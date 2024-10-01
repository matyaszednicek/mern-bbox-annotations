import { useTask } from '@/providers/useTask';
import React from 'react';
import { RedirectImageGallery } from './RedirectImageGallery';
import ConnectImagesDrawer from './ConnectImagesDrwaer';
import { useImagesQuery } from '@/hooks/queries/useImagesQuery';
import { useConnectTaskImagesMutation } from '@/hooks/mutations/useConnectTaskImagesMutation';
import { useQueryClient } from '@tanstack/react-query';

const TaskImagesDashboard: React.FC = () => {
  const queryClient = useQueryClient();
  const { images: taskImages, _id: taskId } = useTask();
  const { data: images } = useImagesQuery();
  const connectTaskImagesMutation = useConnectTaskImagesMutation(taskId);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  const handleConnect = (imageIds: string[]) => {
    connectTaskImagesMutation.mutate(
      { images: imageIds },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['images', taskId] });
          setIsDrawerOpen(false);
        },
        onError: (error) => {
          console.log('Error connecting images', error);
        },
      }
    );
  };

  return (
    <div className="flex flex-col ">
      {images && (
        <ConnectImagesDrawer
          images={images}
          taskImages={taskImages}
          onConnect={handleConnect}
          isOpen={isDrawerOpen}
          onOpenChange={setIsDrawerOpen}
        />
      )}
      <RedirectImageGallery images={taskImages} taskId={taskId} />
    </div>
  );
};

export default TaskImagesDashboard;
