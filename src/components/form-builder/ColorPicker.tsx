
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Palette } from 'lucide-react';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ value, onChange }) => {
  const [colorInput, setColorInput] = useState(value);
  const [isOpen, setIsOpen] = useState(false);

  const presetColors = [
    '#ffffff', '#f8f9fa', '#e9ecef', '#dee2e6', '#ced4da', '#adb5bd', '#6c757d', '#495057', '#343a40', '#212529',
    '#007bff', '#6610f2', '#6f42c1', '#e83e8c', '#dc3545', '#fd7e14', '#ffc107', '#28a745', '#20c997', '#17a2b8',
    '#f8f9fa', '#e9ecef', '#dee2e6', '#ced4da', '#adb5bd', '#6c757d', '#495057', '#343a40', '#212529', '#000000'
  ];

  const handleColorChange = (color: string) => {
    setColorInput(color);
    onChange(color);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setColorInput(newColor);
    // Validate and apply color if it's valid
    if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(newColor) || 
        /^rgba?\(\d+,\s*\d+,\s*\d+(,\s*[\d.]+)?\)$/.test(newColor) ||
        /^hsla?\(\d+,\s*\d+%,\s*\d+%(,\s*[\d.]+)?\)$/.test(newColor)) {
      onChange(newColor);
    }
  };

  const handleInputBlur = () => {
    // If the input is not a valid color, revert to the current value
    if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(colorInput) && 
        !/^rgba?\(\d+,\s*\d+,\s*\d+(,\s*[\d.]+)?\)$/.test(colorInput) &&
        !/^hsla?\(\d+,\s*\d+%,\s*\d+%(,\s*[\d.]+)?\)$/.test(colorInput)) {
      setColorInput(value);
    }
  };

  return (
    <div className="space-y-2">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start h-10 px-3"
            style={{ backgroundColor: value }}
          >
            <div 
              className="w-4 h-4 rounded border border-gray-300 mr-2" 
              style={{ backgroundColor: value }}
            />
            <span className="text-sm">{value}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-4">
          <div className="space-y-4">
            {/* Color Grid */}
            <div className="grid grid-cols-10 gap-1">
              {presetColors.map((color, index) => (
                <button
                  key={index}
                  className="w-6 h-6 rounded border border-gray-200 hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    handleColorChange(color);
                    setIsOpen(false);
                  }}
                />
              ))}
            </div>
            
            {/* Native Color Picker */}
            <div>
              <input
                type="color"
                value={value.startsWith('#') ? value : '#ffffff'}
                onChange={(e) => {
                  handleColorChange(e.target.value);
                  setIsOpen(false);
                }}
                className="w-full h-8 rounded border border-gray-300 cursor-pointer"
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
      
      {/* Manual Input */}
      <Input
        value={colorInput}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        placeholder="Enter color (hex, rgb, rgba, hsl, hsla)"
        className="text-sm"
      />
    </div>
  );
};

export default ColorPicker;
