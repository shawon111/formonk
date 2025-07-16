
import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { Card } from '@/components/ui/card';
import { FormField, FormStyle } from '@/hooks/useForms';
import { Trash2 } from 'lucide-react';

interface FormPreviewProps {
  formFields: FormField[];
  formStyle: FormStyle;
  formTitle: string;
  formDescription: string;
  selectedFieldId: string | null;
  onFieldClick: (fieldId: string) => void;
  onFieldRemove: (fieldId: string) => void;
  showFormTitle: boolean;
  showFormDescription: boolean;
}

const FormPreview: React.FC<FormPreviewProps> = ({
  formFields,
  formStyle,
  formTitle,
  formDescription,
  selectedFieldId,
  onFieldClick,
  onFieldRemove,
  showFormTitle,
  showFormDescription
}) => {
  const renderField = (field: FormField) => {
    const fieldStyle = {
      backgroundColor: field.style?.backgroundColor || 'transparent',
      color: field.style?.textColor || 'inherit',
      borderColor: field.style?.borderColor || '#e5e7eb',
      borderWidth: field.style?.borderWidth || '1px',
      borderRadius: field.style?.borderRadius || '0px',
      fontSize: field.style?.fontSize || 'inherit',
      fontFamily: field.style?.fontFamily || 'inherit',
      padding: field.style?.padding || '8px 12px',
      border: field.style?.borderWidth && field.style?.borderWidth !== '0px' 
        ? `${field.style.borderWidth} solid ${field.style.borderColor || '#e5e7eb'}` 
        : '1px solid #e5e7eb'
    };

    console.log("style for field ", field.label, "is= ", fieldStyle)

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            style={fieldStyle}
            placeholder={field.placeholder || field.label}
            className="w-full min-h-[80px] resize-none outline-none"
            disabled
          />
        );
      
      case 'select':
        return (
          <select style={fieldStyle} className="w-full outline-none cursor-pointer" disabled>
            <option>{field.placeholder || 'Select an option'}</option>
            {field.options?.map((option, idx) => (
              <option key={idx} value={option}>{option}</option>
            ))}
          </select>
        );
      
      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((option, idx) => (
              <label key={idx} className="flex items-center space-x-2 cursor-pointer">
                <input type="radio" name={field.id} disabled />
                <span style={{ color: field.style?.textColor || 'inherit' }}>{option}</span>
              </label>
            ))}
          </div>
        );
      
      case 'checkbox':
        return (
          <div className="space-y-2">
            {field.options?.map((option, idx) => (
              <label key={idx} className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" disabled />
                <span style={{ color: field.style?.textColor || 'inherit' }}>{option}</span>
              </label>
            ))}
          </div>
        );
      
      default:
        return (
          <input
            type={field.type}
            style={fieldStyle}
            placeholder={field.placeholder || field.label}
            className="w-full outline-none"
            disabled
          />
        );
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card 
        className="overflow-hidden border-0"
        style={{
          backgroundColor: formStyle.backgroundColor || 'transparent',
          borderColor: formStyle.borderColor || 'transparent',
          borderWidth: formStyle.borderWidth || '0px',
          borderRadius: formStyle.borderRadius || '0px',
        }}
      >
        <div style={{ padding: formStyle.padding || '24px' }}>
          {(showFormTitle || showFormDescription) && (
            <div className="mb-8 text-center">
              {showFormTitle && (
                <h1 
                  className="text-3xl font-bold mb-4"
                  style={{ 
                    color: formStyle.textColor || 'inherit',
                    fontFamily: formStyle.fontFamily || 'inherit'
                  }}
                >
                  {formTitle || 'Form Title'}
                </h1>
              )}
              {showFormDescription && formDescription && (
                <p 
                  className="text-lg"
                  style={{ 
                    color: formStyle.textColor || 'inherit',
                    fontFamily: formStyle.fontFamily || 'inherit'
                  }}
                >
                  {formDescription}
                </p>
              )}
            </div>
          )}

          <Droppable droppableId="form-preview">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`space-y-6 min-h-[400px] transition-all duration-200 ${
                  snapshot.isDraggingOver ? 'bg-blue-50/50' : ''
                }`}
              >
                {formFields.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📝</div>
                    <h3 className="text-lg font-medium text-gray-600 mb-2">No fields added yet</h3>
                    <p className="text-gray-500">Drag elements from the left panel to start building your form</p>
                  </div>
                ) : (
                  formFields.map((field, index) => (
                    <Draggable key={field.id} draggableId={field.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`group relative transition-all duration-200 cursor-pointer ${
                            selectedFieldId === field.id
                              ? 'ring-2 ring-blue-500 ring-offset-2'
                              : snapshot.isDragging
                                ? 'shadow-lg'
                                : 'hover:ring-1 hover:ring-gray-300'
                          }`}
                          onClick={() => onFieldClick(field.id)}
                        >
                          <div className="mb-2">
                            {field.showLabel !== false && (
                              <label 
                                className="block text-sm font-medium mb-1"
                                style={{ 
                                  color: field.labelStyle?.textColor || 'inherit',
                                  fontFamily: field.labelStyle?.fontFamily || 'inherit',
                                  fontSize: field.labelStyle?.fontSize || 'inherit'
                                }}
                              >
                                {field.label}
                                {field.required && <span className="text-red-500 ml-1">*</span>}
                              </label>
                            )}
                            {renderField(field)}
                          </div>
                          
                          {/* Delete button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onFieldRemove(field.id);
                            }}
                            className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transform translate-x-2 -translate-y-2"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </Draggable>
                  ))
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </Card>
    </div>
  );
};

export default FormPreview;
