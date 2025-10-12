
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FormField, FormStyle } from '@/hooks/useForms';
import WidgetPanel from './WidgetPanel';
import FormPreview from './FormPreview';
import FieldSettings from './FieldSettings';
import FormSettings from './FormSettings';
import FormExportModal from './FormExportModal';
import { Settings, Eye, Download, Grid3X3, LayoutGrid } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { Link } from 'react-router-dom';

interface MainFormBuilderProps {
  formFields: FormField[];
  onFieldsChange: (fields: FormField[]) => void;
  formId?: string;
  formTitle: string;
  formDescription: string;
  formStyle: FormStyle;
  onFormStyleChange: (style: FormStyle) => void;
  onFormTitleChange: (title: string) => void;
  onFormDescriptionChange: (description: string) => void;
  onFormTitleShowChange: (show:boolean)=> void;
  onFormDescriptionShowChange: (show:boolean)=> void;
  onSave: () => void;
  onViewForm: () => void;
}

const MainFormBuilder: React.FC<MainFormBuilderProps> = ({
  formFields,
  onFieldsChange,
  formId,
  formTitle,
  formDescription,
  formStyle,
  onFormStyleChange,
  onFormTitleChange,
  onFormDescriptionChange,
  onFormTitleShowChange,
  onFormDescriptionShowChange,
  onSave,
  onViewForm
}) => {
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [leftPanelView, setLeftPanelView] = useState<'widgets' | 'form-settings' | 'field-settings'>('widgets');
  const [showExportModal, setShowExportModal] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showFormTitle, setShowFormTitle] = useState(true);
  const [showFormDescription, setShowFormDescription] = useState(true);

  const selectedField = formFields.find(field => field.id === selectedFieldId);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    // Handle drag from widget panel to preview
    if (result.source.droppableId === 'widget-panel' && result.destination.droppableId === 'form-preview') {
      const widgetType = result.draggableId.replace('widget-', '');
      const newField: FormField = {
        id: Date.now().toString(),
        label: `New ${widgetType} field`,
        type: widgetType,
        required: false,
        placeholder: '',
        step: 1,
        showLabel: true,
        style: {},
        labelStyle: {},
        ...(widgetType === 'select' || widgetType === 'radio' || widgetType === 'checkbox'
          ? { options: ['Option 1', 'Option 2'] } : {})
      };

      const newFields = [...formFields];
      newFields.splice(result.destination.index, 0, newField);
      onFieldsChange(newFields);
      setSelectedFieldId(newField.id);
      setLeftPanelView('field-settings');
      setHasChanges(true);
      return;
    }

    // Handle reordering within preview
    if (result.source.droppableId === 'form-preview' && result.destination.droppableId === 'form-preview') {
      const items = Array.from(formFields);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
      onFieldsChange(items);
      setHasChanges(true);
    }
  };

  const updateField = (fieldId: string, updates: Partial<FormField>) => {
    onFieldsChange(
      formFields.map(field =>
        field.id === fieldId ? { ...field, ...updates } : field
      )
    );
    setHasChanges(true);
  };

  const removeField = (fieldId: string) => {
    onFieldsChange(formFields.filter(field => field.id !== fieldId));
    if (selectedFieldId === fieldId) {
      setSelectedFieldId(null);
      setLeftPanelView('widgets');
    }
    setHasChanges(true);
  };

  const handleFieldClick = (fieldId: string) => {
    setSelectedFieldId(fieldId);
    setLeftPanelView('field-settings');
  };

  const handleSave = () => {
    onSave();
    setHasChanges(false);
  };

  const handleViewForm = () => {
    if (formId) {
      window.open(`/f/${formId}`, '_blank');
    }
  };

  const handleFormStyleChange = (style: FormStyle) => {
    onFormStyleChange(style);
    setHasChanges(true);
  };

  const handleFormTitleChange = (title: string) => {
    onFormTitleChange(title);
    setHasChanges(true);
  };

  const handleFormDescriptionChange = (description: string) => {
    onFormDescriptionChange(description);
    setHasChanges(true);
  };

  const handleShowFormTitleChange = () => {
    setShowFormTitle(prev => {
      onFormTitleShowChange(!prev)
      setHasChanges(true);
      return !prev;
    });
  }

  const handleShowFormDescriptionChange = () => {
    setShowFormDescription(prev => {
      onFormDescriptionShowChange(!prev)
      setHasChanges(true);
      return !prev;
    });
  }

  const renderLeftPanel = () => {
    switch (leftPanelView) {
      case 'form-settings':
        return (
          <FormSettings
            formStyle={formStyle}
            onFormStyleChange={handleFormStyleChange}
            formTitle={formTitle}
            formDescription={formDescription}
            onFormTitleChange={handleFormTitleChange}
            onFormDescriptionChange={handleFormDescriptionChange}
            showFormTitle={showFormTitle}
            showFormDescription={showFormDescription}
            onShowFormTitleChange={handleShowFormTitleChange}
            onShowFormDescriptionChange={handleShowFormDescriptionChange}
            hasChanges={hasChanges}
            onSave={handleSave}
          />
        );
      case 'field-settings':
        return selectedField ? (
          <FieldSettings
            field={selectedField}
            onFieldUpdate={updateField}
            onFieldRemove={removeField}
          />
        ) : (
          <WidgetPanel />
        );
      default:
        return <WidgetPanel />;
    }
  };

  return (
    <div className="h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 w-[15%] justify-between">
            <Link to='/'>
              <div className="flex items-center space-x-1">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                  <img src="/formonk-logo.png" alt="formonk logo" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Formonk
                </h1>
              </div>
            </Link>
            <div className="flex items-center space-x-2">
              <Tooltip>
                <TooltipTrigger>
                  <LayoutGrid
                    onClick={() => {
                      setLeftPanelView('widgets');
                      setSelectedFieldId(null);
                    }}
                    className='cursor-pointer px-1 py-1 rounded border border-gray-300 hover:bg-gray-200 transition'
                    size={30} />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add Widget</p>
                </TooltipContent>
              </Tooltip>

            </div>
          </div>
          <div className="flex items-center justify-end space-x-3 w-[85%]">
            <Button
              variant={leftPanelView === 'form-settings' ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setLeftPanelView('form-settings');
                setSelectedFieldId(null);
              }}
              className="flex items-center space-x-2"
            >
              <Settings className="w-4 h-4" />
              <span>Form Settings</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleViewForm}
              className="flex items-center space-x-2"
            >
              <Eye className="w-4 h-4" />
              <span>View Form</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowExportModal(true)}
              disabled={!formId}
              className="flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export Code</span>
            </Button>
            <Button
              onClick={handleSave}
              disabled={!hasChanges}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Update Form
            </Button>
          </div>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex h-full">
          {/* Left Column - Widgets & Settings */}
          <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
            {renderLeftPanel()}
          </div>

          {/* Right Column - Preview */}
          <div className="flex-1 p-6 overflow-y-auto">
            <FormPreview
              formFields={formFields}
              formStyle={formStyle}
              formTitle={formTitle}
              formDescription={formDescription}
              selectedFieldId={selectedFieldId}
              onFieldClick={handleFieldClick}
              onFieldRemove={removeField}
              showFormTitle={showFormTitle}
              showFormDescription={showFormDescription}
            />
          </div>
        </div>
      </DragDropContext>

      {/* Export Modal */}
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

export default MainFormBuilder;
