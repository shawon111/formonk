
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Link, Unlink } from 'lucide-react';

interface BorderControlProps {
  value: string;
  onChange: (value: string) => void;
}

const BorderControl: React.FC<BorderControlProps> = ({ value, onChange }) => {
  const [isLinked, setIsLinked] = useState(true);
  const [unit, setUnit] = useState('px');
  const [values, setValues] = useState({
    top: '0',
    right: '0',
    bottom: '0',
    left: '0'
  });

  useEffect(() => {
    // Parse the input value
    const parts = value.trim().split(/\s+/);
    let parsedUnit = 'px';
    
    // Extract unit from first value
    const firstValueMatch = parts[0]?.match(/^(\d*\.?\d+)(\w+)$/);
    if (firstValueMatch) {
      parsedUnit = firstValueMatch[2];
    }
    
    setUnit(parsedUnit);
    
    if (parts.length === 1) {
      // Single value - all sides same
      const numValue = parts[0].replace(/\D/g, '') || '0';
      setValues({
        top: numValue,
        right: numValue,
        bottom: numValue,
        left: numValue
      });
      setIsLinked(true);
    } else if (parts.length === 2) {
      // Two values - vertical and horizontal
      const vertical = parts[0].replace(/\D/g, '') || '0';
      const horizontal = parts[1].replace(/\D/g, '') || '0';
      setValues({
        top: vertical,
        right: horizontal,
        bottom: vertical,
        left: horizontal
      });
      setIsLinked(false);
    } else if (parts.length === 4) {
      // Four values - top right bottom left
      setValues({
        top: parts[0].replace(/\D/g, '') || '0',
        right: parts[1].replace(/\D/g, '') || '0',
        bottom: parts[2].replace(/\D/g, '') || '0',
        left: parts[3].replace(/\D/g, '') || '0'
      });
      setIsLinked(false);
    }
  }, [value]);

  const updateValue = (side: keyof typeof values, newValue: string) => {
    const newValues = { ...values };
    
    if (isLinked) {
      // Update all sides
      newValues.top = newValue;
      newValues.right = newValue;
      newValues.bottom = newValue;
      newValues.left = newValue;
    } else {
      // Update only the specific side
      newValues[side] = newValue;
    }
    
    setValues(newValues);
    
    // Generate CSS value
    if (isLinked || (newValues.top === newValues.right && newValues.right === newValues.bottom && newValues.bottom === newValues.left)) {
      onChange(`${newValues.top}${unit}`);
    } else if (newValues.top === newValues.bottom && newValues.right === newValues.left) {
      onChange(`${newValues.top}${unit} ${newValues.right}${unit}`);
    } else {
      onChange(`${newValues.top}${unit} ${newValues.right}${unit} ${newValues.bottom}${unit} ${newValues.left}${unit}`);
    }
  };

  const updateUnit = (newUnit: string) => {
    setUnit(newUnit);
    // Regenerate the value with new unit
    if (isLinked || (values.top === values.right && values.right === values.bottom && values.bottom === values.left)) {
      onChange(`${values.top}${newUnit}`);
    } else if (values.top === values.bottom && values.right === values.left) {
      onChange(`${values.top}${newUnit} ${values.right}${newUnit}`);
    } else {
      onChange(`${values.top}${newUnit} ${values.right}${newUnit} ${values.bottom}${newUnit} ${values.left}${newUnit}`);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsLinked(!isLinked)}
            className="p-1 h-8 w-8"
          >
            {isLinked ? <Link className="w-4 h-4" /> : <Unlink className="w-4 h-4" />}
          </Button>
          <span className="text-xs text-gray-500">
            {isLinked ? 'Linked' : 'Individual'}
          </span>
        </div>
        <Select value={unit} onValueChange={updateUnit}>
          <SelectTrigger className="w-20 h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="px">px</SelectItem>
            <SelectItem value="em">em</SelectItem>
            <SelectItem value="rem">rem</SelectItem>
            <SelectItem value="%">%</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLinked ? (
        <div>
          <Label className="text-xs">All Sides</Label>
          <Input
            type="number"
            value={values.top}
            onChange={(e) => updateValue('top', e.target.value)}
            className="h-8"
          />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs">Top</Label>
            <Input
              type="number"
              value={values.top}
              onChange={(e) => updateValue('top', e.target.value)}
              className="h-8"
            />
          </div>
          <div>
            <Label className="text-xs">Right</Label>
            <Input
              type="number"
              value={values.right}
              onChange={(e) => updateValue('right', e.target.value)}
              className="h-8"
            />
          </div>
          <div>
            <Label className="text-xs">Bottom</Label>
            <Input
              type="number"
              value={values.bottom}
              onChange={(e) => updateValue('bottom', e.target.value)}
              className="h-8"
            />
          </div>
          <div>
            <Label className="text-xs">Left</Label>
            <Input
              type="number"
              value={values.left}
              onChange={(e) => updateValue('left', e.target.value)}
              className="h-8"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BorderControl;
