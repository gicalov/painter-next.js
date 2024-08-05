import { HexColorPicker } from "react-colorful";

interface ICanvasToolbar {
  color: string;
  handleColorChange: (color: string) => void;
  brushSize: number;
  handleBrushSizeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleClearCanvas: () => void;
  isErasing: boolean;
  handleChangeMode: () => void;
}

const CanvasToolbar: React.FC<ICanvasToolbar> = ({
  color,
  handleColorChange,
  brushSize,
  handleBrushSizeChange,
  handleClearCanvas,
  isErasing,
  handleChangeMode,
}) => (
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
    <button onClick={handleClearCanvas}>Очистить холст</button>
    <button onClick={handleChangeMode}>{isErasing ? "ластик" : "кисть"}</button>
  </div>
);

export default CanvasToolbar;
