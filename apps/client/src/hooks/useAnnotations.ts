import React from 'react';
import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { Annotation } from '@mbba/schema';

type UseAnnotationsProps = {
  initialAnnotations: Annotation[];
  labels: string[];
  stageWidth: number;
  stageHeight: number;
  taskId: string;
  imageId: string;
  userId: string;
};

const useAnnotations = ({
  initialAnnotations,
  labels,
  stageWidth,
  stageHeight,
  taskId,
  imageId,
  userId,
}: UseAnnotationsProps) => {
  const [rectangles, setRectangles] =
    React.useState<Annotation[]>(initialAnnotations);
  const [newRectangle, setNewRectangle] = React.useState<Annotation | null>(
    null
  );
  const [isDrawing, setIsDrawing] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [label, setLabel] = React.useState<string>(labels[0]);
  const stageRef = React.useRef<Konva.Stage>(null);
  const transformerRef = React.useRef<Konva.Transformer>(null);

  React.useEffect(() => {
    if (selectedId && transformerRef.current) {
      const selectedNode = stageRef.current?.findOne(`#${selectedId}`);
      if (selectedNode) {
        transformerRef.current.nodes([selectedNode]);
        transformerRef.current.getLayer()?.batchDraw();
      }
    } else {
      transformerRef.current?.detach();
      transformerRef.current?.getLayer()?.batchDraw();
    }
  }, [selectedId]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedId(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const getPointerPosition = () => {
    const stage = stageRef.current;
    return stage?.getPointerPosition() ?? { x: 0, y: 0 };
  };

  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    const clickedOnEmptyArea = e.target === e.target.getStage();
    if (clickedOnEmptyArea) {
      setSelectedId(null);
    }
    if (isDrawing || selectedId) return;

    const { x, y } = getPointerPosition();
    setNewRectangle({
      x: x / stageWidth,
      y: y / stageHeight,
      width: 0,
      height: 0,
      label,
      _id: `${Date.now()}`,
      user: userId,
      task: taskId,
      image: imageId,
    });
    setIsDrawing(true);
  };

  const handleMouseMove = () => {
    if (!isDrawing || !newRectangle) return;
    const { x, y } = getPointerPosition();
    const updatedRect: Annotation = {
      ...newRectangle,
      width: (x - newRectangle.x * stageWidth) / stageWidth,
      height: (y - newRectangle.y * stageHeight) / stageHeight,
      label,
    };
    setNewRectangle(updatedRect);
  };

  const handleMouseUp = () => {
    if (newRectangle && newRectangle.width !== 0 && newRectangle.height !== 0) {
      setRectangles((prev) => [...prev, newRectangle]);
    }
    setNewRectangle(null);
    setIsDrawing(false);
  };

  const handleSelect = (id: string) => {
    setSelectedId(id);
  };

  const handleDelete = () => {
    setRectangles((prev) => prev.filter((rect) => rect._id !== selectedId));
    setSelectedId(null);
  };

  const handleDragMove = (e: Konva.KonvaEventObject<Event>, index: number) => {
    const newX = e.target.x();
    const newY = e.target.y();
    const boundedX = Math.max(0, Math.min(newX, stageWidth - e.target.width()));
    const boundedY = Math.max(
      0,
      Math.min(newY, stageHeight - e.target.height())
    );

    const updatedRectangles = rectangles.map((rect, i) => {
      if (i === index) {
        return {
          ...rect,
          x: boundedX / stageWidth,
          y: boundedY / stageHeight,
        };
      }
      return rect;
    });

    e.target.x(boundedX);
    e.target.y(boundedY);
    setRectangles(updatedRectangles);
  };

  const handleTransform = (e: Konva.KonvaEventObject<Event>, index: number) => {
    const node = e.target;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    const updatedRectangles = rectangles.map((rect, i) => {
      if (i === index) {
        return {
          ...rect,
          x: node.x() / stageWidth,
          y: node.y() / stageHeight,
          width: Math.max(5, node.width() * scaleX) / stageWidth,
          height: Math.max(5, node.height() * scaleY) / stageHeight,
        };
      }
      return rect;
    });

    node.scaleX(1);
    node.scaleY(1);
    setRectangles(updatedRectangles);
  };

  return {
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
  };
};

export default useAnnotations;
