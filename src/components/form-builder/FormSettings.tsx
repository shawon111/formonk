
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormStyle } from '@/hooks/useForms';
import ColorPicker from './ColorPicker';
import SpacingControl from './SpacingControl';
import BorderControl from './BorderControl';

interface FormSettingsProps {
  formStyle: FormStyle;
  onFormStyleChange: (style: FormStyle) => void;
  formTitle: string;
  formDescription: string;
  onFormTitleChange: (title: string) => void;
  onFormDescriptionChange: (description: string) => void;
  showFormTitle: boolean;
  showFormDescription: boolean;
  onShowFormTitleChange: (show: boolean) => void;
  onShowFormDescriptionChange: (show: boolean) => void;
  hasChanges: boolean;
  onSave: () => void;
}

const FormSettings: React.FC<FormSettingsProps> = ({ 
  formStyle, 
  onFormStyleChange, 
  formTitle, 
  formDescription,
  onFormTitleChange,
  onFormDescriptionChange,
  showFormTitle,
  showFormDescription,
  onShowFormTitleChange,
  onShowFormDescriptionChange,
  hasChanges,
  onSave
}) => {
  const updateFormStyle = (property: keyof FormStyle, value: string | object) => {
    onFormStyleChange({ ...formStyle, [property]: value });
  };

  const updateTitleStyle = (property: string, value: string) => {
    const titleStyle = formStyle.titleStyle || {};
    updateFormStyle('titleStyle', { ...titleStyle, [property]: value });
  };

  const updateDescriptionStyle = (property: string, value: string) => {
    const descriptionStyle = formStyle.descriptionStyle || {};
    updateFormStyle('descriptionStyle', { ...descriptionStyle, [property]: value });
  };

  const updateButtonStyle = (property: string, value: string) => {
    const buttonStyle = formStyle.buttonStyle || {};
    updateFormStyle('buttonStyle', { ...buttonStyle, [property]: value });
  };

  const parseStyleValue = (value: string) => {
    const match = value.match(/^(\d*\.?\d+)(\w+)$/);
    if (match) {
      return { value: match[1], unit: match[2] };
    }
    return { value: value.replace(/\D/g, ''), unit: 'px' };
  };

  const formatStyleValue = (value: string, unit: string) => {
    return `${value}${unit}`;
  };

  return (
    <div className="p-4 flex flex-col h-full">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Form Settings</h2>
        <p className="text-sm text-gray-600">Configure your form appearance and behavior</p>
      </div>

      <div className="flex-1 overflow-y-auto mb-16">
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="w-full flex flex-wrap justify-start gap-1 h-auto p-1">
            <TabsTrigger value="general" className="flex-shrink-0">General</TabsTrigger>
            <TabsTrigger value="form-style" className="flex-shrink-0">Form Style</TabsTrigger>
            <TabsTrigger value="content-style" className="flex-shrink-0">Content Style</TabsTrigger>
            <TabsTrigger value="button-style" className="flex-shrink-0">Button Style</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Form Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="formTitle">Form Title</Label>
                  <Input
                    id="formTitle"
                    value={formTitle}
                    onChange={(e) => onFormTitleChange(e.target.value)}
                    placeholder="Enter form title"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="showTitle"
                    checked={showFormTitle}
                    onCheckedChange={onShowFormTitleChange}
                  />
                  <Label htmlFor="showTitle">Show form title</Label>
                </div>

                <div>
                  <Label htmlFor="formDescription">Form Description</Label>
                  <Textarea
                    id="formDescription"
                    value={formDescription}
                    onChange={(e) => onFormDescriptionChange(e.target.value)}
                    placeholder="Enter form description"
                    rows={3}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="showDescription"
                    checked={showFormDescription}
                    onCheckedChange={onShowFormDescriptionChange}
                  />
                  <Label htmlFor="showDescription">Show form description</Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="form-style" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Form Colors</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Form Background Color</Label>
                  <ColorPicker
                    value={formStyle.backgroundColor || '#ffffff'}
                    onChange={(color) => updateFormStyle('backgroundColor', color)}
                  />
                </div>

                <div>
                  <Label>Form Text Color</Label>
                  <ColorPicker
                    value={formStyle.textColor || '#000000'}
                    onChange={(color) => updateFormStyle('textColor', color)}
                  />
                </div>

                <div>
                  <Label>Form Border Color</Label>
                  <ColorPicker
                    value={formStyle.borderColor || '#e5e7eb'}
                    onChange={(color) => updateFormStyle('borderColor', color)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Form Typography</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="form-font">Font Family</Label>
                  <Select value={formStyle.fontFamily || 'Inter'} onValueChange={(value) => updateFormStyle('fontFamily', value)}>
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
                  <Label htmlFor="form-font-size">Font Size</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="form-font-size"
                      type="number"
                      value={parseStyleValue(formStyle.fontSize || '16px').value}
                      onChange={(e) => updateFormStyle('fontSize', formatStyleValue(e.target.value, parseStyleValue(formStyle.fontSize || '16px').unit))}
                      className="flex-1"
                    />
                    <Select value={parseStyleValue(formStyle.fontSize || '16px').unit} onValueChange={(unit) => updateFormStyle('fontSize', formatStyleValue(parseStyleValue(formStyle.fontSize || '16px').value, unit))}>
                      <SelectTrigger className="w-20">
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
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Form Layout</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Form Padding</Label>
                  <SpacingControl
                    value={formStyle.padding || '24px'}
                    onChange={(value) => updateFormStyle('padding', value)}
                  />
                </div>

                <div>
                  <Label>Border Width</Label>
                  <BorderControl
                    value={formStyle.borderWidth || '1px'}
                    onChange={(value) => updateFormStyle('borderWidth', value)}
                  />
                </div>

                <div>
                  <Label>Border Radius</Label>
                  <BorderControl
                    value={formStyle.borderRadius || '0px'}
                    onChange={(value) => updateFormStyle('borderRadius', value)}
                  />
                </div>

                <div>
                  <Label htmlFor="form-box-shadow">Box Shadow</Label>
                  <Textarea
                    id="form-box-shadow"
                    value={formStyle.boxShadow || '0px 0px 0px rgba(0, 0, 0, 0.1)'}
                    onChange={(e) => updateFormStyle('boxShadow', e.target.value)}
                    placeholder="0px 0px 0px rgba(0, 0, 0, 0.1)"
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content-style" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Form Title Style</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Title Text Color</Label>
                  <ColorPicker
                    value={formStyle.titleStyle?.textColor || '#000000'}
                    onChange={(color) => updateTitleStyle('textColor', color)}
                  />
                </div>

                <div>
                  <Label htmlFor="title-font-family">Title Font Family</Label>
                  <Select value={formStyle.titleStyle?.fontFamily || 'Inter'} onValueChange={(value) => updateTitleStyle('fontFamily', value)}>
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
                  <Label htmlFor="title-font-size">Title Font Size</Label>
                  <Input
                    id="title-font-size"
                    value={formStyle.titleStyle?.fontSize || '24px'}
                    onChange={(e) => updateTitleStyle('fontSize', e.target.value)}
                    placeholder="24px"
                  />
                </div>

                <div>
                  <Label>Title Margin</Label>
                  <SpacingControl
                    value={formStyle.titleStyle?.margin || '0px'}
                    onChange={(value) => updateTitleStyle('margin', value)}
                  />
                </div>

                <div>
                  <Label>Title Padding</Label>
                  <SpacingControl
                    value={formStyle.titleStyle?.padding || '0px'}
                    onChange={(value) => updateTitleStyle('padding', value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Form Description Style</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Description Text Color</Label>
                  <ColorPicker
                    value={formStyle.descriptionStyle?.textColor || '#666666'}
                    onChange={(color) => updateDescriptionStyle('textColor', color)}
                  />
                </div>

                <div>
                  <Label htmlFor="desc-font-family">Description Font Family</Label>
                  <Select value={formStyle.descriptionStyle?.fontFamily || 'Inter'} onValueChange={(value) => updateDescriptionStyle('fontFamily', value)}>
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
                  <Label htmlFor="desc-font-size">Description Font Size</Label>
                  <Input
                    id="desc-font-size"
                    value={formStyle.descriptionStyle?.fontSize || '16px'}
                    onChange={(e) => updateDescriptionStyle('fontSize', e.target.value)}
                    placeholder="16px"
                  />
                </div>

                <div>
                  <Label>Description Margin</Label>
                  <SpacingControl
                    value={formStyle.descriptionStyle?.margin || '0px'}
                    onChange={(value) => updateDescriptionStyle('margin', value)}
                  />
                </div>

                <div>
                  <Label>Description Padding</Label>
                  <SpacingControl
                    value={formStyle.descriptionStyle?.padding || '0px'}
                    onChange={(value) => updateDescriptionStyle('padding', value)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="button-style" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Submit Button Style</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Button Background Color</Label>
                  <ColorPicker
                    value={formStyle.buttonStyle?.backgroundColor || '#3b82f6'}
                    onChange={(color) => updateButtonStyle('backgroundColor', color)}
                  />
                </div>

                <div>
                  <Label>Button Text Color</Label>
                  <ColorPicker
                    value={formStyle.buttonStyle?.textColor || '#ffffff'}
                    onChange={(color) => updateButtonStyle('textColor', color)}
                  />
                </div>

                <div>
                  <Label>Button Border Color</Label>
                  <ColorPicker
                    value={formStyle.buttonStyle?.borderColor || '#3b82f6'}
                    onChange={(color) => updateButtonStyle('borderColor', color)}
                  />
                </div>

                <div>
                  <Label htmlFor="button-font-family">Button Font Family</Label>
                  <Select value={formStyle.buttonStyle?.fontFamily || 'Inter'} onValueChange={(value) => updateButtonStyle('fontFamily', value)}>
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
                  <Label htmlFor="button-font-size">Button Font Size</Label>
                  <Input
                    id="button-font-size"
                    value={formStyle.buttonStyle?.fontSize || '16px'}
                    onChange={(e) => updateButtonStyle('fontSize', e.target.value)}
                    placeholder="16px"
                  />
                </div>

                <div>
                  <Label>Button Padding</Label>
                  <SpacingControl
                    value={formStyle.buttonStyle?.padding || '12px 24px'}
                    onChange={(value) => updateButtonStyle('padding', value)}
                  />
                </div>

                <div>
                  <Label>Button Margin</Label>
                  <SpacingControl
                    value={formStyle.buttonStyle?.margin || '0px'}
                    onChange={(value) => updateButtonStyle('margin', value)}
                  />
                </div>

                <div>
                  <Label>Button Border Width</Label>
                  <BorderControl
                    value={formStyle.buttonStyle?.borderWidth || '1px'}
                    onChange={(value) => updateButtonStyle('borderWidth', value)}
                  />
                </div>

                <div>
                  <Label>Button Border Radius</Label>
                  <BorderControl
                    value={formStyle.buttonStyle?.borderRadius || '0px'}
                    onChange={(value) => updateButtonStyle('borderRadius', value)}
                  />
                </div>

                <div>
                  <Label htmlFor="button-box-shadow">Button Box Shadow</Label>
                  <Textarea
                    id="button-box-shadow"
                    value={formStyle.buttonStyle?.boxShadow || '0px 0px 0px rgba(0, 0, 0, 0)'}
                    onChange={(e) => updateButtonStyle('boxShadow', e.target.value)}
                    placeholder="0px 0px 0px rgba(0, 0, 0, 0)"
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FormSettings;
