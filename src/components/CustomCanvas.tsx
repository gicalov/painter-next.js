import React, { useState, useRef, useEffect } from "react";
import { debounce } from "lodash";
import { StyledDiv } from "../app/styles";

interface ICanvas {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  contextRef: React.RefObject<CanvasRenderingContext2D>;
  isErasing: boolean;
  brushSize: number;
  color: string;
}

const Canvas: React.FC<ICanvas> = ({
  canvasRef,
  contextRef,
  isErasing,
  brushSize,
  color,
}) => {
  const [divSize, setDivSize] = useState({ width: 30, height: 30 });
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadCanvasFromLocalStorage = () => {
      const canvasData = localStorage.getItem("canvasData");

      if (canvasData) {
        const img = new Image();
        img.src = canvasData;
        const context = canvasRef.current!.getContext("2d");
        img.onload = () => {
          context!.drawImage(img, 0, 0);
        };
      }
    };

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

  return (
    <StyledDiv ref={divRef}>
      <canvas
        ref={canvasRef}
        width={divSize.width}
        height={divSize.height}
        onMouseDown={startDrawing}
        onMouseUp={finishDrawing}
        onMouseMove={draw}
        onMouseLeave={() => setIsDrawing(false)}
      />
    </StyledDiv>
  );
};

export default Canvas;
