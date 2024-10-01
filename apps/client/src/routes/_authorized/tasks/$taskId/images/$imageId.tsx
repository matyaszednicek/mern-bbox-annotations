import AnnotationInterface from '@/components/annotations/AnnotationInterface';
import { useUpsertAnnotationsMutation } from '@/hooks/mutations/useUpsertAnnotationsMutation';
import { useAnnotationsQuery } from '@/hooks/queries/useAnnotationsQuery';
import { useTask } from '@/providers/useTask';
import { Annotation } from '@mbba/schema';
import { createFileRoute } from '@tanstack/react-router';
import React from 'react';

export const Route = createFileRoute(
  '/_authorized/tasks/$taskId/images/$imageId'
)({
  component: AnnotationPage,
});

function AnnotationPage() {
  const { taskId, imageId } = Route.useParams();
  const { images, labels, user: userId } = useTask();
  const { data: annotations } = useAnnotationsQuery(taskId, imageId);
  const image = React.useMemo(
    () => images.find((image) => image._id === imageId),
    [images, imageId]
  );

  const upsertAnnotationsMutation = useUpsertAnnotationsMutation(
    taskId,
    imageId
  );

  const handleSave = React.useCallback(
    (updatedAnnotations: Annotation[]) => {
      const data = updatedAnnotations.map((annotation) => {
        const existingAnnotation = annotations?.find(
          (a) => a._id === annotation._id
        );
        return {
          ...annotation,
          _id: existingAnnotation ? annotation._id : undefined,
        };
      });

      upsertAnnotationsMutation.mutate(data);
    },
    [annotations, upsertAnnotationsMutation]
  );

  return (
    <div className="container">
      {annotations && (
        <AnnotationInterface
          annotations={annotations}
          imageUri={image?.uri ?? ''}
          labels={labels}
          taskId={taskId}
          imageId={imageId}
          userId={userId}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
