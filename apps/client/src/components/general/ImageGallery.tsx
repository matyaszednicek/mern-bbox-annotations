import React from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import ImageGalleryItem from './ImageGalleryItem';

type ImageGalleryProps = {
  images: string[];
};

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  const [lightboxOpen, setLightboxOpen] = React.useState(false);
  const [lightboxIndex, setLightboxIndex] = React.useState(0);
  const openImage = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };
  const slides = React.useMemo(
    () => images.map((image) => ({ src: image })),
    [images]
  );

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {images.map((image, index) => (
          <ImageGalleryItem
            key={index}
            image={image}
            index={index}
            onClick={openImage}
          />
        ))}
      </div>
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={slides}
      />
    </>
  );
};
