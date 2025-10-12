
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { FormField, FormFieldStyle } from '@/hooks/useForms';
import ColorPicker from './ColorPicker';
import SpacingControl from './SpacingControl';
import BorderControl from './BorderControl';
import { Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FieldSettingsProps {
  field: FormField;
  onFieldUpdate: (fieldId: string, updates: Partial<FormField>) => void;
  onFieldRemove: (fieldId: string) => void;
}

const FieldSettings: React.FC<FieldSettingsProps> = ({ field, onFieldUpdate, onFieldRemove }) => {
  const [fieldStyle, setFieldStyle] = useState<FormFieldStyle>(field.style || {});

  const updateField = (updates: Partial<FormField>) => {
    onFieldUpdate(field.id, updates);
  };

  const updateFieldStyle = (property: keyof FormFieldStyle, value: string) => {
    const newStyle = { ...fieldStyle, [property]: value };
    setFieldStyle(newStyle);
    updateField({ style: newStyle });
  };

  const updateLabelStyle = (property: keyof FormFieldStyle, value: string) => {
    const newLabelStyle = { ...field.labelStyle, [property]: value };
    updateField({ labelStyle: newLabelStyle });
  };

  return (
    <div className="p-4 flex flex-col h-full">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Field Settings</h2>
        <p className="text-sm text-gray-600">Customize your field appearance and behavior</p>
      </div>

      <div className="flex-1 overflow-y-auto mb-16">
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="w-full flex flex-wrap justify-start gap-1 h-auto p-1">
            <TabsTrigger value="general" className="flex-shrink-0">General</TabsTrigger>
            <TabsTrigger value="style" className="flex-shrink-0">Style</TabsTrigger>
            <TabsTrigger value="label-style" className="flex-shrink-0">Label Style</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">General Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="fieldLabel">Label</Label>
                  <Input
                    id="fieldLabel"
                    value={field.label}
                    onChange={(e) => updateField({ label: e.target.value })}
                    placeholder="Enter field label"
                  />
                </div>

                <div>
                  <Label htmlFor="fieldPlaceholder">Placeholder</Label>
                  <Input
                    id="fieldPlaceholder"
                    value={field.placeholder || ''}
                    onChange={(e) => updateField({ placeholder: e.target.value })}
                    placeholder="Enter placeholder text"
                  />
                </div>

                <div className='flex items-center'>
                  <Input
                    type="checkbox"
                    id="fieldRequired"
                    checked={field.required}
                    className='w-4 h-4 mr-2'
                    onChange={(e) => updateField({ required: e.target.checked })}
                  />
                  <Label htmlFor="fieldRequired">Required</Label>
                </div>

                <div className='flex items-center'>
                  <Input
                    type="checkbox"
                    id="fieldShowLabel"
                    checked={field.showLabel !== false}
                    className='w-4 h-4 mr-2'
                    onChange={(e) => updateField({ showLabel: e.target.checked })}
                  />
                  <Label htmlFor="fieldShowLabel">Show Label</Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="style" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Field Colors</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Background Color</Label>
                  <ColorPicker
                    value={fieldStyle.backgroundColor || '#ffffff'}
                    onChange={(color) => updateFieldStyle('backgroundColor', color)}
                  />
                </div>

                <div>
                  <Label>Text Color</Label>
                  <ColorPicker
                    value={fieldStyle.textColor || '#000000'}
                    onChange={(color) => updateFieldStyle('textColor', color)}
                  />
                </div>

                <div>
                  <Label>Border Color</Label>
                  <ColorPicker
                    value={fieldStyle.borderColor || '#e5e7eb'}
                    onChange={(color) => updateFieldStyle('borderColor', color)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Field Typography</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="field-font">Font Family</Label>
                  <Select value={fieldStyle.fontFamily || 'Inter'} onValueChange={(value) => updateFieldStyle('fontFamily', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inter">Inter</SelectItem>
                      <SelectItem value="Arial">Arial</SelectItem>
                      <SelectItem value="Helvetica">Helvetica</SelectItem>
                      <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                      <SelectItem value="Georgia">Georgia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="field-font-size">Font Size</Label>
                  <Input
                    id="field-font-size"
                    value={fieldStyle.fontSize || '16px'}
                    onChange={(e) => updateFieldStyle('fontSize', e.target.value)}
                    placeholder="16px"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Field Layout</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Padding</Label>
                  <SpacingControl
                    value={fieldStyle.padding || '8px 12px'}
                    onChange={(value) => updateFieldStyle('padding', value)}
                  />
                </div>

                <div>
                  <Label>Margin</Label>
                  <SpacingControl
                    value={fieldStyle.margin || '0px'}
                    onChange={(value) => updateFieldStyle('margin', value)}
                  />
                </div>

                <div>
                  <Label>Border Width</Label>
                  <BorderControl
                    value={fieldStyle.borderWidth || '0px'}
                    onChange={(value) => updateFieldStyle('borderWidth', value)}
                  />
                </div>

                <div>
                  <Label>Border Radius</Label>
                  <BorderControl
                    value={fieldStyle.borderRadius || '0px'}
                    onChange={(value) => updateFieldStyle('borderRadius', value)}
                  />
                </div>

                <div>
                  <Label htmlFor="field-box-shadow">Box Shadow</Label>
                  <Textarea
                    id="field-box-shadow"
                    value={fieldStyle.boxShadow || '0px 0px 0px rgba(0, 0, 0, 0)'}
                    onChange={(e) => updateFieldStyle('boxShadow', e.target.value)}
                    placeholder="0px 0px 0px rgba(0, 0, 0, 0)"
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="label-style" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Label Style</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Text Color</Label>
                  <ColorPicker
                    value={field.labelStyle?.textColor || '#000000'}
                    onChange={(color) => updateLabelStyle('textColor', color)}
                  />
                </div>

                <div>
                  <Label htmlFor="label-font-family">Font Family</Label>
                  <Select value={field.labelStyle?.fontFamily || 'Inter'} onValueChange={(value) => updateLabelStyle('fontFamily', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inter">Inter</SelectItem>
                      <SelectItem value="Arial">Arial</SelectItem>
                      <SelectItem value="Helvetica">Helvetica</SelectItem>
                      <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                      <SelectItem value="Georgia">Georgia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="label-font-size">Font Size</Label>
                  <Input
                    id="label-font-size"
                    value={field.labelStyle?.fontSize || '14px'}
                    onChange={(e) => updateLabelStyle('fontSize', e.target.value)}
                    placeholder="14px"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Button
        variant="destructive"
        onClick={() => onFieldRemove(field.id)}
        className="absolute bottom-4 left-4 bg-red-500 hover:bg-red-700 text-white"
      >
        <Trash2 className="w-4 h-4 mr-2" />
        Remove Field
      </Button>
    </div>
  );
};

export default FieldSettings;
