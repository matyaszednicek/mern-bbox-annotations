import React from 'react';
import { Link } from '@tanstack/react-router';
import { Image } from '@mbba/schema';
import ImageGalleryItem from '../general/ImageGalleryItem';

type RedirectImageGalleryProps = {
  images: Image[];
  taskId: string;
};

export const RedirectImageGallery: React.FC<RedirectImageGalleryProps> = ({
  images,
  taskId,
}) => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {images.map((image, index) => (
        <Link
          to="/tasks/$taskId/images/$imageId"
          params={{ taskId, imageId: image._id }}
        >
          <ImageGalleryItem key={image._id} image={image.uri} index={index} />
        </Link>
      ))}
    </div>
  );
};
