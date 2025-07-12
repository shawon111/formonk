import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Download, Code, FileText } from 'lucide-react';
import { FormField, FormStyle } from '@/hooks/useForms';
import { toast } from '@/hooks/use-toast';
import { generateFormCode } from '@/utils/formCodeGenerator';

interface FormExportModalProps {
  formId: string;
  formTitle: string;
  formDescription: string;
  formFields: FormField[];
  formStyle: FormStyle;
  isOpen: boolean;
  onClose: () => void;
}

const exportTypes = [
  { value: 'html', label: 'Plain HTML + CSS', icon: '🌐', description: 'Standalone HTML file with embedded CSS' },
  { value: 'tailwind', label: 'Tailwind HTML', icon: '🎨', description: 'HTML with Tailwind CSS classes' },
  { value: 'bootstrap', label: 'Bootstrap HTML', icon: '🅱️', description: 'HTML with Bootstrap framework' },
  { value: 'jsx-tailwind', label: 'JSX with Tailwind', icon: '⚛️', description: 'React component with Tailwind CSS' },
  { value: 'jsx-bootstrap', label: 'JSX with Bootstrap', icon: '🔧', description: 'React component with Bootstrap' },
  { value: 'jsx-css', label: 'JSX with CSS', icon: '📄', description: 'React component with plain CSS' }
];

const FormExportModal: React.FC<FormExportModalProps> = ({
  formId,
  formTitle,
  formDescription,
  formFields,
  formStyle,
  isOpen,
  onClose
}) => {
  const [selectedType, setSelectedType] = useState('html');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const code = generateFormCode(
        formFields,
        formStyle,
        formTitle,
        formDescription,
        true, // showFormTitle
        true, // showFormDescription
        selectedType.includes('jsx') ? 'react' : 'html'
      );
      setGeneratedCode(code);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate form code",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);
      toast({
        title: "Copied!",
        description: "Form code copied to clipboard",
        className: "bg-green-50 border-green-200 text-green-800"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy code",
        variant: "destructive"
      });
    }
  };

  const handleDownload = () => {
    const fileExtension = selectedType.includes('jsx') ? 'jsx' : 'html';
    const fileName = `${formTitle.toLowerCase().replace(/\s+/g, '-')}-form.${fileExtension}`;
    
    const blob = new Blob([generatedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: `Form code saved as ${fileName}`,
      className: "bg-green-50 border-green-200 text-green-800"
    });
  };

  const selectedExportType = exportTypes.find(type => type.value === selectedType);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-white border-2 border-gray-200 rounded-xl">
        <DialogHeader className="border-b-2 border-gray-200 pb-4 mb-6">
          <DialogTitle className="text-2xl font-bold text-gray-800 flex items-center">
            <Code className="w-6 h-6 mr-3 text-blue-600" />
            Export Form Code
          </DialogTitle>
          <p className="text-gray-600 mt-2">Generate production-ready code for your form in various formats</p>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border-2 border-blue-200">
            <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-600" />
              Export Configuration
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Export Format</label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg h-12 bg-white">
                    <SelectValue placeholder="Select export type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-2 border-gray-200 rounded-lg shadow-lg">
                    {exportTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value} className="py-3 hover:bg-blue-50">
                        <div className="flex items-start space-x-3">
                          <span className="text-lg mt-0.5">{type.icon}</span>
                          <div>
                            <div className="font-medium">{type.label}</div>
                            <div className="text-xs text-gray-500">{type.description}</div>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button 
                onClick={handleGenerate} 
                disabled={isGenerating}
                className="h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isGenerating ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Generating...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Code className="w-4 h-4 mr-2" />
                    Generate Code
                  </div>
                )}
              </Button>
            </div>
            
            {selectedExportType && (
              <div className="mt-4 p-4 bg-white rounded-lg border border-blue-200">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-xl">{selectedExportType.icon}</span>
                  <span className="font-semibold text-gray-800">{selectedExportType.label}</span>
                </div>
                <p className="text-sm text-gray-600">{selectedExportType.description}</p>
              </div>
            )}
          </div>

          {generatedCode && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold text-gray-800 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-green-600" />
                  Generated Code
                </h4>
                <div className="flex space-x-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleCopy}
                    className="border-2 border-gray-200 hover:border-green-300 hover:bg-green-50 text-green-600 font-medium px-4 py-2 rounded-lg"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Code
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleDownload}
                    className="border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-blue-600 font-medium px-4 py-2 rounded-lg"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download File
                  </Button>
                </div>
              </div>
              
              <div className="relative">
                <Textarea
                  value={generatedCode}
                  className="min-h-[500px] font-mono text-sm bg-gray-900 text-green-400 border-2 border-gray-700 rounded-lg p-4 focus:border-green-500 focus:ring-2 focus:ring-green-200"
                  readOnly
                  style={{ 
                    fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                    lineHeight: '1.5',
                    tabSize: '2'
                  }}
                />
                <div className="absolute top-2 right-2 bg-gray-800 text-gray-300 px-2 py-1 rounded text-xs font-medium">
                  {selectedExportType?.label}
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FormExportModal;
