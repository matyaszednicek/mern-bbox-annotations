import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Image } from '@mbba/schema';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../ui/carousel';
import { Card, CardContent } from '../ui/card';

type ConnectImagesDrawerProps = {
  images: Image[];
  taskImages: Image[];
  onConnect: (imageIds: string[]) => void;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

const ConnectImagesDrawer: React.FC<ConnectImagesDrawerProps> = ({
  images,
  taskImages,
  onConnect,
  isOpen,
  onOpenChange,
}) => {
  const [selectedImageIds, setSelectedImageIds] = useState<string[]>(
    taskImages.map((image) => image._id)
  );

  const handleImageClick = (imageId: string) => {
    setSelectedImageIds((prevSelectedImageIds) =>
      prevSelectedImageIds.includes(imageId)
        ? prevSelectedImageIds.filter((id) => id !== imageId)
        : [...prevSelectedImageIds, imageId]
    );
  };

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>
        <Button className="mx-auto mb-8 w-fit">Connect Images</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="w-full max-w-xl mx-auto">
          <DrawerHeader>
            <DrawerTitle>Connect Images</DrawerTitle>
            <DrawerDescription>
              Select images you want to connect to the task.
            </DrawerDescription>
          </DrawerHeader>
          <Carousel
            opts={{
              align: 'start',
            }}
            className="w-full max-w-xl"
          >
            <CarouselContent>
              {images.map((image, index) => (
                <CarouselItem
                  key={index}
                  className="md:basis-1/3 lg:basis-1/4"
                  onClick={() => handleImageClick(image._id)}
                >
                  <div className="p-1">
                    <Card
                      style={{
                        border: selectedImageIds.includes(image._id)
                          ? '2px solid black'
                          : '2px solid transparent',
                      }}
                    >
                      <CardContent className="flex items-center justify-center p-2 aspect-square">
                        <img
                          src={image.uri}
                          alt={image._id}
                          className="object-cover w-36 h-36"
                        />
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>

          <DrawerFooter>
            <Button onClick={() => onConnect(selectedImageIds)}>Connect</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default ConnectImagesDrawer;
