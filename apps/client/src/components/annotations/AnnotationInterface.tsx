import {
  Stage,
  Layer,
  Rect,
  Image as KonvaImage,
  Transformer,
} from 'react-konva';
import useImage from 'use-image';
import { Annotation } from '@mbba/schema';
import { Badge } from '../ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Button } from '../ui/button';
import useAnnotations from '@/hooks/useAnnotations';
import React from 'react';

type AnnotationInterfaceProps = {
  imageUri: string;
  labels: string[];
  annotations: Annotation[];
  onSave: (annotations: Annotation[]) => void;
  taskId: string;
  imageId: string;
  userId: string;
};

const AnnotationInterface: React.FC<AnnotationInterfaceProps> = ({
  imageUri,
  labels,
  annotations,
  onSave,
  taskId,
  imageId,
  userId,
}) => {
  const [image] = useImage(imageUri);
  const wrapperWidth = 800;
  const wrapperHeight = 600;
  const imageWidth = image ? image.width : 1;
  const imageHeight = image ? image.height : 1;
  const aspectRatio = imageWidth / imageHeight;

  let stageWidth = wrapperWidth;
  let stageHeight = wrapperHeight;

  if (aspectRatio > 1) {
    stageHeight = wrapperWidth / aspectRatio;
  } else {
    stageWidth = wrapperHeight * aspectRatio;
  }

  const {
    rectangles,
    newRectangle,
    label,
    selectedId,
    stageRef,
    transformerRef,
    setLabel,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleSelect,
    handleDelete,
    handleDragMove,
    handleTransform,
  } = useAnnotations({
    initialAnnotations: annotations,
    labels,
    stageWidth,
    stageHeight,
    taskId,
    imageId,
    userId,
  });

  const getColorForLabel = (index: number) => {
    const colors = ['red', 'blue', 'green', 'yellow', 'magenta'];
    return colors[index % colors.length];
  };

  const denormalizedRectangles = React.useMemo(
    () =>
      rectangles.map((rect) => ({
        ...rect,
        x: rect.x * stageWidth,
        y: rect.y * stageHeight,
        width: rect.width * stageWidth,
        height: rect.height * stageHeight,
      })),
    [rectangles, stageWidth, stageHeight]
  );

  const selectedRectangle = rectangles.find((rect) => rect._id === selectedId);

  return (
    <div className="text-center">
      <h1 className="mb-8 text-3xl font-bold text-center">Image Annotation</h1>
      <div className="flex">
        <div className="mx-auto mb-4 space-x-2">
          {labels.map((item) => (
            <Badge
              key={item}
              variant={label === item ? 'default' : 'secondary'}
              onClick={() => setLabel(item)}
              className="h-8 cursor-pointer"
            >
              {item}
            </Badge>
          ))}
        </div>
      </div>
      <div className="flex w-full">
        <div
          style={{ width: `${wrapperWidth}px`, height: `${wrapperHeight}px` }}
          className="relative mx-auto border shadow rounded-xl bg-card text-card-foreground"
        >
          <Stage
            width={stageWidth}
            height={stageHeight}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            ref={stageRef}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <Layer>
              <KonvaImage
                image={image}
                width={stageWidth}
                height={stageHeight}
              />
              {denormalizedRectangles.map((rect, i) => (
                <Rect
                  key={rect._id}
                  id={rect._id}
                  x={rect.x}
                  y={rect.y}
                  width={rect.width}
                  height={rect.height}
                  stroke={getColorForLabel(labels.indexOf(rect.label))}
                  strokeWidth={2}
                  draggable
                  onClick={() => handleSelect(rect._id)}
                  onDragMove={(e) => handleDragMove(e, i)}
                  onTransformEnd={(e) => handleTransform(e, i)}
                />
              ))}
              {newRectangle && (
                <Rect
                  x={newRectangle.x * stageWidth}
                  y={newRectangle.y * stageHeight}
                  width={newRectangle.width * stageWidth}
                  height={newRectangle.height * stageHeight}
                  stroke={getColorForLabel(labels.indexOf(newRectangle.label))}
                  strokeWidth={2}
                  dash={[4, 4]}
                />
              )}
            </Layer>
            <Layer>
              <Transformer
                ref={transformerRef}
                rotateEnabled={false}
                keepRatio={false}
              />
            </Layer>
          </Stage>
        </div>
        <div className="flex flex-col justify-between w-1/3 ml-4">
          <SelectedAnnotation
            onDelete={handleDelete}
            selectedRectangle={selectedRectangle}
          />
          <div className="flex flex-col w-full space-y-2">
            <Button variant="outline">Revert Annotations</Button>
            <Button onClick={() => onSave(rectangles)}>Save Annotations</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnotationInterface;

const SelectedAnnotation: React.FC<{
  selectedRectangle?: Annotation;
  onDelete: () => void;
}> = ({ selectedRectangle, onDelete }) => {
  return (
    <Card className="w-full h-fit">
      <CardHeader>
        <CardTitle className="text-xl">Selected Annotation</CardTitle>
        <CardDescription>
          To unselect, press ESC on your keyboard.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableHead className="w-1/2 h-0"></TableHead>
            <TableHead className="w-1/2 h-0"></TableHead>
          </TableHeader>

          <TableBody>
            <TableRow>
              <TableCell className="text-lg font-semibold">Label</TableCell>
              <TableCell className="text-lg">
                {selectedRectangle?.label ?? '--'}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-lg font-semibold">X</TableCell>
              <TableCell className="text-lg">
                {selectedRectangle?.x.toFixed(3) ?? '--'}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-lg font-semibold">Y</TableCell>
              <TableCell className="text-lg">
                {selectedRectangle?.y.toFixed(3) ?? '--'}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-lg font-semibold">Width</TableCell>
              <TableCell className="text-lg">
                {selectedRectangle?.width.toFixed(3) ?? '--'}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-lg font-semibold">Height</TableCell>
              <TableCell className="text-lg">
                {selectedRectangle?.height.toFixed(3) ?? '--'}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <Button
          variant="destructive"
          onClick={onDelete}
          disabled={!selectedRectangle}
          className="w-full"
        >
          Delete Annotation
        </Button>
      </CardFooter>
    </Card>
  );
};
