type ImageGalleryItemProps = {
  image: string;
  index: number;
  onClick?: (index: number) => void;
};

const ImageGalleryItem: React.FC<ImageGalleryItemProps> = ({
  image,
  index,
  onClick,
}) => (
  <div
    className="overflow-hidden border rounded-lg"
    onClick={() => onClick?.(index)}
  >
    <img
      src={image}
      alt={`Uploaded ${index}`}
      className="object-cover w-full h-40"
    />
  </div>
);

export default ImageGalleryItem;
