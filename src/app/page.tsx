"use client";
import React, { useState, useRef, useEffect } from "react";
import CustomCanvas from "../components/CustomCanvas";
import CanvasToolbar from "../components/CanvasToolbar";
import { StyledContainer } from "./styles";

const DrawingCanvas: React.FC = () => {
  const [color, setColor] = useState<string>("#000000");
  const [brushSize, setBrushSize] = useState<number>(5);
  const [isErasing, setIsErasing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas) {
      const context = canvas.getContext("2d");

      if (context) {
        context.lineCap = "round";
        context.strokeStyle = color;
        context.lineWidth = brushSize;
        contextRef.current = context;
      }
    }
  }, [color, brushSize]);

  const handleClearCanvas = () => {
    const canvas = canvasRef.current;

    if (canvas) {
      const context = canvas.getContext("2d");

      if (context) {
        context.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    setIsErasing(false);
  };

  const handleColorChange = (color: string) => {
    setColor(color);
  };

  const handleBrushSizeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setBrushSize(Number(event.target.value));
  };

  const handleChangeMode = () => {
    setIsErasing((prevState) => !prevState);
  };

  return (
    <StyledContainer>
      <CustomCanvas
        canvasRef={canvasRef}
        contextRef={contextRef}
        isErasing={isErasing}
        brushSize={brushSize}
        color={color}
      />
      <CanvasToolbar
        color={color}
        handleColorChange={handleColorChange}
        brushSize={brushSize}
        handleBrushSizeChange={handleBrushSizeChange}
        handleClearCanvas={handleClearCanvas}
        isErasing={isErasing}
        handleChangeMode={handleChangeMode}
      />
    </StyledContainer>
  );
};

export default DrawingCanvas;
