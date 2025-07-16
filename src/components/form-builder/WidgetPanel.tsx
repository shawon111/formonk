
import React from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { Type, Mail, Phone, FileText, ChevronDown, Circle, Square } from 'lucide-react';

const widgets = [
  { id: 'text', label: 'Text Input', icon: Type, description: 'Single line text input' },
  { id: 'email', label: 'Email', icon: Mail, description: 'Email input with validation' },
  { id: 'tel', label: 'Phone', icon: Phone, description: 'Phone number input' },
  { id: 'textarea', label: 'Textarea', icon: FileText, description: 'Multi-line text input' },
  { id: 'select', label: 'Select', icon: ChevronDown, description: 'Dropdown selection' },
  { id: 'radio', label: 'Radio', icon: Circle, description: 'Single choice from options' },
  { id: 'checkbox', label: 'Checkbox', icon: Square, description: 'Multiple choice options' }
];

const WidgetPanel: React.FC = () => {
  return (
    <div className="p-4">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Form Widgets</h2>
        <p className="text-sm text-gray-600">Drag widgets to the preview area</p>
      </div>

      <Droppable droppableId="widget-panel" isDropDisabled={true}>
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
            {widgets.map((widget, index) => (
              <Draggable key={widget.id} draggableId={`widget-${widget.id}`} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`p-4 border-2 border-dashed rounded-lg cursor-grab transition-all duration-200 ${
                      snapshot.isDragging 
                        ? 'border-blue-400 bg-blue-50 shadow-lg' 
                        : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gray-100 rounded-md">
                        <widget.icon className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800">{widget.label}</h3>
                        <p className="text-xs text-gray-500">{widget.description}</p>
                      </div>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default WidgetPanel;
