import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, GripVertical, Download } from 'lucide-react';
import { FormField, FormStyle } from '@/hooks/useForms';
import FormExportModal from './FormExportModal';

interface DragDropFormBuilderProps {
  formFields: FormField[];
  onFieldsChange: (fields: FormField[]) => void;
  formId?: string;
  formTitle: string;
  formDescription: string;
  formStyle: FormStyle;
}

const fieldTypes = [
  { value: 'text', label: 'Text Input', icon: '📝' },
  { value: 'email', label: 'Email', icon: '📧' },
  { value: 'tel', label: 'Phone', icon: '📞' },
  { value: 'textarea', label: 'Long Text', icon: '📄' },
  { value: 'select', label: 'Dropdown', icon: '📋' },
  { value: 'radio', label: 'Multiple Choice', icon: '🔘' },
  { value: 'checkbox', label: 'Checkboxes', icon: '☑️' }
];

const DragDropFormBuilder: React.FC<DragDropFormBuilderProps> = ({
  formFields,
  onFieldsChange,
  formId,
  formTitle,
  formDescription,
  formStyle
}) => {
  const [showExportModal, setShowExportModal] = useState(false);

  const addField = (type: string) => {
    const newField: FormField = {
      id: Date.now().toString(),
      label: `New ${type} field`,
      type,
      required: false,
      placeholder: '',
      step: 1,
      ...(type === 'select' || type === 'radio' || type === 'checkbox'
        ? {
          options: [
            { label: 'Option 1', value: 'option-1' },
            { label: 'Option 2', value: 'option-2' }
          ]
        }
        : {})
    };
    onFieldsChange([...formFields, newField]);
  };

  const updateField = (fieldId: string, updates: Partial<FormField>) => {
    onFieldsChange(
      formFields.map(field =>
        field.id === fieldId ? { ...field, ...updates } : field
      )
    );
  };

  const removeField = (fieldId: string) => {
    onFieldsChange(formFields.filter(field => field.id !== fieldId));
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(formFields);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onFieldsChange(items);
  };

  const updateOption = (fieldId: string, optionIndex: number, value: string) => {
    const field = formFields.find(f => f.id === fieldId);
    if (field?.options) {
      updateField(fieldId, {
        options: field.options.map((opt, idx) =>
          idx === optionIndex
            ? { ...opt, label: value, value: value.toLowerCase().replace(/\s+/g, '-') }
            : opt
        )
      });
    }
  };

  const addOption = (fieldId: string) => {
    const field = formFields.find(f => f.id === fieldId);
    if (field?.options) {
      updateField(fieldId, {
        options: [
          ...field.options,
          { label: `Option ${field.options.length + 1}`, value: `option-${field.options.length + 1}` }
        ]
      });
    }
  };

  const removeOption = (fieldId: string, optionIndex: number) => {
    const field = formFields.find(f => f.id === fieldId);
    if (field?.options && field.options.length > 1) {
      updateField(fieldId, {
        options: field.options.filter((_, idx) => idx !== optionIndex)
      });
    }
  };

  const renderFieldEditor = (field: FormField, index: number) => (
    <Draggable key={field.id} draggableId={field.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`border-2 rounded-xl p-6 bg-white mb-6 transition-all duration-200 ${snapshot.isDragging ? 'shadow-2xl border-blue-300 rotate-1' : 'shadow-md border-gray-200 hover:shadow-lg hover:border-gray-300'
            }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div {...provided.dragHandleProps} className="cursor-grab hover:cursor-grabbing p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <GripVertical className="w-5 h-5 text-gray-500" />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                {fieldTypes.find(t => t.value === field.type)?.label}
              </span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => removeField(field.id)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-semibold text-gray-700 mb-2 block">Field Label</Label>
                <Input
                  value={field.label}
                  onChange={(e) => updateField(field.id, { label: e.target.value })}
                  placeholder="Enter field label"
                  className="border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg h-11"
                />
              </div>
              <div>
                <Label className="text-sm font-semibold text-gray-700 mb-2 block">Field Type</Label>
                <Select
                  value={field.type}
                  onValueChange={(value) => updateField(field.id, { type: value })}
                >
                  <SelectTrigger className="border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-2 border-gray-200 rounded-lg shadow-lg">
                    {fieldTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value} className="py-3 hover:bg-blue-50">
                        <span className="flex items-center space-x-2">
                          <span>{type.icon}</span>
                          <span>{type.label}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-sm font-semibold text-gray-700 mb-2 block">Placeholder Text</Label>
              <Input
                value={field.placeholder || ''}
                onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                placeholder="Enter placeholder text"
                className="border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg h-11"
              />
            </div>

            {(field.type === 'select' || field.type === 'radio' || field.type === 'checkbox') && (
              <div>
                <Label className="text-sm font-semibold text-gray-700 mb-3 block">Options</Label>
                <div className="space-y-3">
                  {field.options?.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex space-x-3">
                      <Input
                        value={option.label}
                        onChange={(e) => updateOption(field.id, optionIndex, e.target.value)}
                        placeholder={`Option ${optionIndex + 1}`}
                        className="flex-1 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg h-11"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeOption(field.id, optionIndex)}
                        disabled={field.options!.length <= 1}
                        className="border-2 border-gray-200 hover:border-red-300 hover:bg-red-50 text-red-600 px-3 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => addOption(field.id)}
                    className="border-2 border-blue-200 hover:border-blue-300 hover:bg-blue-50 text-blue-600 font-medium px-4 py-2 rounded-lg"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Option
                  </Button>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Switch
                id={`required-${field.id}`}
                checked={field.required}
                onCheckedChange={(checked) => updateField(field.id, { required: checked })}
              />
              <Label htmlFor={`required-${field.id}`} className="text-sm font-medium text-gray-700">
                Required field
              </Label>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-800">Form Fields</h3>
        <Button
          onClick={() => setShowExportModal(true)}
          variant="outline"
          disabled={!formId}
          className="border-2 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 font-semibold px-6 py-2 rounded-lg"
        >
          <Download className="w-4 h-4 mr-2" />
          Export Code
        </Button>
      </div>

      <Card className="border-2 border-gray-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b-2 border-gray-200">
          <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
            <Plus className="w-5 h-5 mr-2 text-blue-600" />
            Add Form Fields
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {fieldTypes.map((type) => (
              <Button
                key={type.value}
                variant="outline"
                size="sm"
                onClick={() => addField(type.value)}
                className="border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-700 hover:text-blue-700 font-medium px-4 py-3 rounded-lg transition-all duration-200 h-auto"
              >
                <div className="flex flex-col items-center space-y-1">
                  <span className="text-lg">{type.icon}</span>
                  <span className="text-xs">{type.label}</span>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="form-fields">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={`min-h-[300px] p-6 rounded-xl border-2 border-dashed transition-all duration-200 ${snapshot.isDraggingOver
                ? 'border-blue-400 bg-blue-50'
                : 'border-gray-300 bg-gray-50'
                }`}
            >
              {formFields.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📝</div>
                  <h4 className="text-lg font-semibold text-gray-600 mb-2">No fields added yet</h4>
                  <p className="text-gray-500">Drag fields here or click the "Add" buttons above to start building your form</p>
                </div>
              ) : (
                formFields.map((field, index) => renderFieldEditor(field, index))
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {showExportModal && formId && (
        <FormExportModal
          formId={formId}
          formTitle={formTitle}
          formDescription={formDescription}
          formFields={formFields}
          formStyle={formStyle}
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
        />
      )}
    </div>
  );
};

export default DragDropFormBuilder;
