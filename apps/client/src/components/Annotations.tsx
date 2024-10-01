import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Rect, Image as KonvaImage, Transformer } from 'react-konva';
import useImage from 'use-image';
import { KonvaEventObject } from 'konva/lib/Node';

// Define a type for a rectangle (bounding box) with a label
interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  id: string;
}

const AnnotationApp: React.FC = () => {
  const [image] = useImage('https://images.surferseo.art/e0582e70-0ae8-4fc9-9187-20d9963ba3c0.jpeg'); // Replace with your image URL
  const [rectangles, setRectangles] = useState<Rectangle[]>([]);
  const [newRectangle, setNewRectangle] = useState<Rectangle | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [label, setLabel] = useState<string>('cat'); // Default label
  const stageRef = useRef<any>(null);
  const transformerRef = useRef<any>(null);

  const imageWidth = 800; // Adjust as per your image size
  const imageHeight = 600; // Adjust as per your image size

  // Update Transformer when a new rectangle is selected
  useEffect(() => {
    if (selectedId && transformerRef.current) {
      const selectedNode = stageRef.current.findOne(`#${selectedId}`);
      transformerRef.current.nodes([selectedNode]);
      transformerRef.current.getLayer().batchDraw();
    } else {
      transformerRef.current.detach();
      transformerRef.current.getLayer().batchDraw();
    }
  }, [selectedId]);

  // Add event listener for Esc key to deselect
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedId(null); // Deselect on Esc
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown); // Cleanup on unmount
    };
  }, []);

  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    const clickedOnEmptyArea = e.target === e.target.getStage();

    if (clickedOnEmptyArea) {
      setSelectedId(null); // Deselect any rectangle
    }

    // Only allow drawing a new rectangle if none is selected
    if (isDrawing || selectedId) return;

    const stage = stageRef.current;
    const { x, y } = stage.getPointerPosition();
    setNewRectangle({ x, y, width: 0, height: 0, label, id: `${Date.now()}` });
    setIsDrawing(true);
  };

  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    if (!isDrawing || !newRectangle) return;

    const stage = stageRef.current;
    const { x, y } = stage.getPointerPosition();
    const updatedRect: Rectangle = {
      ...newRectangle,
      width: x - newRectangle.x,
      height: y - newRectangle.y,
      label,
    };
    setNewRectangle(updatedRect);
  };

  const handleMouseUp = () => {
    if (newRectangle && newRectangle.width !== 0 && newRectangle.height !== 0) {
      setRectangles([...rectangles, newRectangle]);
    }
    setNewRectangle(null);
    setIsDrawing(false);
  };

  const handleLabelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLabel(e.target.value);
  };

  const handleSelect = (id: string) => {
    setSelectedId(id);
  };

  const handleDelete = () => {
    setRectangles(rectangles.filter((rect) => rect.id !== selectedId));
    setSelectedId(null);
  };

  const handleDragMove = (e: any, index: number) => {
    const updatedRectangles = rectangles.map((rect, i) => {
      if (i === index) {
        return {
          ...rect,
          x: e.target.x(),
          y: e.target.y(),
        };
      }
      return rect;
    });
    setRectangles(updatedRectangles);
  };

  const handleTransform = (e: any, index: number) => {
    const node = e.target;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    const updatedRectangles = rectangles.map((rect, i) => {
      if (i === index) {
        return {
          ...rect,
          x: node.x(),
          y: node.y(),
          width: Math.max(5, node.width() * scaleX),
          height: Math.max(5, node.height() * scaleY),
        };
      }
      return rect;
    });

    node.scaleX(1); // Reset scaling
    node.scaleY(1);
    setRectangles(updatedRectangles);
  };

  const getColorForLabel = (label: string) => {
    switch (label) {
      case 'cat':
        return 'red';
      case 'dog':
        return 'blue';
      default:
        return 'green';
    }
  };

  const normalizedRectangles = rectangles.map((rect) => ({
    ...rect,
    x: rect.x / imageWidth,
    y: rect.y / imageHeight,
    width: rect.width / imageWidth,
    height: rect.height / imageHeight,
  }));

  const selectedRectangle = rectangles.find((rect) => rect.id === selectedId);

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Image Annotation</h1>

      <div>
        <label htmlFor="label-select">Choose a label: </label>
        <select id="label-select" value={label} onChange={handleLabelChange}>
          <option value="cat">Cat</option>
          <option value="dog">Dog</option>
        </select>
      </div>

      <Stage
        width={imageWidth}
        height={imageHeight}
        onMouseDown={handleMouseDown} // Deselect or start drawing
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        ref={stageRef}
      >
        <Layer>
          <KonvaImage image={image} width={imageWidth} height={imageHeight} />

          {rectangles.map((rect, i) => (
            <Rect
              key={rect.id}
              id={rect.id}
              x={rect.x}
              y={rect.y}
              width={rect.width}
              height={rect.height}
              stroke={getColorForLabel(rect.label)}
              strokeWidth={2}
              draggable
              onClick={() => handleSelect(rect.id)} // Select rect
              onDragMove={(e) => handleDragMove(e, i)}
              onTransformEnd={(e) => handleTransform(e, i)}
            />
          ))}

          {newRectangle && (
            <Rect
              x={newRectangle.x}
              y={newRectangle.y}
              width={newRectangle.width}
              height={newRectangle.height}
              stroke={getColorForLabel(newRectangle.label)}
              strokeWidth={2}
              dash={[4, 4]}
            />
          )}
        </Layer>

        <Layer>
          <Transformer ref={transformerRef} rotateEnabled={false} keepRatio={false} />
        </Layer>
      </Stage>

      {selectedRectangle && (
        <div style={{ marginTop: '20px', border: '1px solid black', padding: '10px', display: 'inline-block' }}>
          <h3>Selected Rectangle</h3>
          <p>ID: {selectedRectangle.id}</p>
          <p>X: {selectedRectangle.x.toFixed(2)}</p>
          <p>Y: {selectedRectangle.y.toFixed(2)}</p>
          <p>Width: {selectedRectangle.width.toFixed(2)}</p>
          <p>Height: {selectedRectangle.height.toFixed(2)}</p>
          <button onClick={handleDelete}>Delete</button>
        </div>
      )}

      <h2>Normalized Annotations</h2>
      <pre style={{ textAlign: 'left' }}>{JSON.stringify(normalizedRectangles, null, 2)}</pre>
    </div>
  );
};

export default AnnotationApp;
