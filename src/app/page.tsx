"use client";

import React, { useState, useRef, useEffect } from "react";
import { HexColorPicker } from "react-colorful";
import { debounce } from "lodash";

interface DrawingCanvasProps {}

const DrawingCanvas: React.FC<DrawingCanvasProps> = () => {
  const [color, setColor] = useState<string>("#000000");
  const [brushSize, setBrushSize] = useState<number>(5);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [isErasing, setIsErasing] = useState(false);
  const [divSize, setDivSize] = useState({ width: 30, height: 30 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const divRef = useRef<HTMLDivElement>(null);

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

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { offsetX, offsetY } = e.nativeEvent;

    if (contextRef.current) {
      contextRef.current.beginPath();
      contextRef.current.moveTo(offsetX, offsetY);
      contextRef.current.lineWidth = brushSize;
      if (isErasing) {
        contextRef.current.strokeStyle = "white";
      } else {
        contextRef.current.strokeStyle = color;
      }
      setIsDrawing(true);
    }
  };

  const saveCanvasToLocalStorage = () => {
    const canvasData = canvasRef.current!.toDataURL();

    localStorage.setItem("canvasData", canvasData);
  };

  const finishDrawing = () => {
    if (contextRef.current) {
      contextRef.current.closePath();
      setIsDrawing(false);

      saveCanvasToLocalStorage();
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !contextRef.current) return;

    const { offsetX, offsetY } = e.nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };

  const clearCanvas = () => {
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

  const loadCanvasFromLocalStorage = () => {
    const canvasData = localStorage.getItem("canvasData");

    if (canvasData) {
      const img = new Image();
      img.src = canvasData;
      const context = canvasRef.current!.getContext("2d");
      img.onload = () => {
        context!.drawImage(img, 0, 0);
      };
      console.log(context);
    }
  };

  useEffect(() => {
    const handleResize = debounce(() => {
      if (divRef.current) {
        setDivSize({
          width: window.innerWidth - 200,
          height: divRef.current.offsetHeight,
        });
      }
      loadCanvasFromLocalStorage();
    }, 200);
    handleResize();
    loadCanvasFromLocalStorage();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      style={{
        display: "flex",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <div ref={divRef} style={{ width: "100%", height: "100%" }}>
        <canvas
          ref={canvasRef}
          width={divSize.width}
          height={divSize.height}
          style={{
            border: "1px solid #000",
          }}
          onMouseDown={startDrawing}
          onMouseUp={finishDrawing}
          onMouseMove={draw}
          onMouseLeave={() => setIsDrawing(false)}
        />
      </div>
      <div>
        <label htmlFor="color">Цвет кисти:</label>
        <HexColorPicker color={color} onChange={handleColorChange} />
        <label htmlFor="brushSize">Толщина кисти:</label>
        <input
          type="range"
          id="brushSize"
          min="1"
          max="50"
          value={brushSize}
          onChange={handleBrushSizeChange}
        />
        <button onClick={clearCanvas}>Очистить холст</button>
        <button onClick={() => setIsErasing((prevState) => !prevState)}>
          {isErasing ? "ластик" : "кисть"}
        </button>
      </div>
    </div>
  );
};

export default DrawingCanvas;
