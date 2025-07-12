
import { FormField, FormStyle } from '@/hooks/useForms';

export const generateFormCode = (
  fields: FormField[],
  formStyle: FormStyle,
  formTitle: string,
  formDescription: string,
  showFormTitle: boolean = true,
  showFormDescription: boolean = true,
  format: 'react' | 'html' | 'vue' = 'react'
) => {
  const generateFieldStyles = (field: FormField) => {
    const style: any = {};
    
    if (field.style?.backgroundColor && field.style.backgroundColor !== 'transparent') {
      style.backgroundColor = field.style.backgroundColor;
    }
    if (field.style?.textColor && field.style.textColor !== 'inherit') {
      style.color = field.style.textColor;
    }
    if (field.style?.borderColor && field.style.borderColor !== 'transparent') {
      style.borderColor = field.style.borderColor;
    }
    if (field.style?.borderWidth && field.style.borderWidth !== '0px') {
      style.borderWidth = field.style.borderWidth;
      style.borderStyle = 'solid';
    }
    if (field.style?.borderRadius && field.style.borderRadius !== '0px') {
      style.borderRadius = field.style.borderRadius;
    }
    if (field.style?.fontSize && field.style.fontSize !== 'inherit') {
      style.fontSize = field.style.fontSize;
    }
    if (field.style?.fontFamily && field.style.fontFamily !== 'inherit') {
      style.fontFamily = field.style.fontFamily;
    }
    if (field.style?.padding) {
      style.padding = field.style.padding;
    }
    
    return style;
  };

  const generateLabelStyles = (field: FormField) => {
    const style: any = {};
    
    if (field.labelStyle?.textColor && field.labelStyle.textColor !== 'inherit') {
      style.color = field.labelStyle.textColor;
    }
    if (field.labelStyle?.fontSize && field.labelStyle.fontSize !== 'inherit') {
      style.fontSize = field.labelStyle.fontSize;
    }
    if (field.labelStyle?.fontFamily && field.labelStyle.fontFamily !== 'inherit') {
      style.fontFamily = field.labelStyle.fontFamily;
    }
    
    return style;
  };

  const generateFormStyles = () => {
    const style: any = {};
    
    if (formStyle.backgroundColor && formStyle.backgroundColor !== 'transparent') {
      style.backgroundColor = formStyle.backgroundColor;
    }
    if (formStyle.textColor && formStyle.textColor !== 'inherit') {
      style.color = formStyle.textColor;
    }
    if (formStyle.borderColor && formStyle.borderColor !== 'transparent') {
      style.borderColor = formStyle.borderColor;
    }
    if (formStyle.borderWidth && formStyle.borderWidth !== '0px') {
      style.borderWidth = formStyle.borderWidth;
      style.borderStyle = 'solid';
    }
    if (formStyle.borderRadius && formStyle.borderRadius !== '0px') {
      style.borderRadius = formStyle.borderRadius;
    }
    if (formStyle.fontSize && formStyle.fontSize !== 'inherit') {
      style.fontSize = formStyle.fontSize;
    }
    if (formStyle.fontFamily && formStyle.fontFamily !== 'inherit') {
      style.fontFamily = formStyle.fontFamily;
    }
    if (formStyle.padding) {
      style.padding = formStyle.padding;
    }
    
    return style;
  };

  if (format === 'react') {
    return generateReactCode(fields, generateFormStyles(), generateFieldStyles, generateLabelStyles, formTitle, formDescription, showFormTitle, showFormDescription);
  } else if (format === 'html') {
    return generateHTMLCode(fields, generateFormStyles(), generateFieldStyles, generateLabelStyles, formTitle, formDescription, showFormTitle, showFormDescription);
  } else if (format === 'vue') {
    return generateVueCode(fields, generateFormStyles(), generateFieldStyles, generateLabelStyles, formTitle, formDescription, showFormTitle, showFormDescription);
  }
  
  return '';
};

const generateReactCode = (
  fields: FormField[],
  formStyles: any,
  generateFieldStyles: (field: FormField) => any,
  generateLabelStyles: (field: FormField) => any,
  formTitle: string,
  formDescription: string,
  showFormTitle: boolean,
  showFormDescription: boolean
) => {
  const styleToString = (style: any) => {
    if (Object.keys(style).length === 0) return '';
    return `style={${JSON.stringify(style)}}`;
  };

  const formStyleString = styleToString(formStyles);

  return `import React, { useState } from 'react';

const FormComponent = () => {
  const [formData, setFormData] = useState({
${fields.map(field => `    ${field.id}: ${field.type === 'checkbox' ? '[]' : "''"},`).join('\n')}
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked 
          ? [...prev[name], value]
          : prev[name].filter(item => item !== value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <form onSubmit={handleSubmit} ${formStyleString}>
        ${showFormTitle || showFormDescription ? `<div className="mb-8 text-center">
          ${showFormTitle ? `<h1 className="text-3xl font-bold mb-4">${formTitle}</h1>` : ''}
          ${showFormDescription && formDescription ? `<p className="text-lg">${formDescription}</p>` : ''}
        </div>` : ''}
        
        <div className="space-y-6">
${fields.map(field => {
  const fieldStyles = generateFieldStyles(field);
  const labelStyles = generateLabelStyles(field);
  const fieldStyleString = styleToString(fieldStyles);
  const labelStyleString = styleToString(labelStyles);

  switch (field.type) {
    case 'textarea':
      return `          <div>
            ${field.showLabel !== false ? `<label htmlFor="${field.id}" ${labelStyleString}>${field.label}${field.required ? ' *' : ''}</label>` : ''}
            <textarea
              id="${field.id}"
              name="${field.id}"
              value={formData.${field.id}}
              onChange={handleChange}
              placeholder="${field.placeholder || ''}"
              ${field.required ? 'required' : ''}
              ${fieldStyleString}
              className="w-full min-h-[80px] resize-none outline-none"
            />
          </div>`;
    
    case 'select':
      return `          <div>
            ${field.showLabel !== false ? `<label htmlFor="${field.id}" ${labelStyleString}>${field.label}${field.required ? ' *' : ''}</label>` : ''}
            <select
              id="${field.id}"
              name="${field.id}"
              value={formData.${field.id}}
              onChange={handleChange}
              ${field.required ? 'required' : ''}
              ${fieldStyleString}
              className="w-full outline-none"
            >
              <option value="">${field.placeholder || 'Select an option'}</option>
${field.options?.map(option => `              <option value="${option}">${option}</option>`).join('\n')}
            </select>
          </div>`;
    
    case 'radio':
      return `          <div>
            ${field.showLabel !== false ? `<label ${labelStyleString}>${field.label}${field.required ? ' *' : ''}</label>` : ''}
            <div className="space-y-2">
${field.options?.map(option => `              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="${field.id}"
                  value="${option}"
                  checked={formData.${field.id} === '${option}'}
                  onChange={handleChange}
                  ${field.required ? 'required' : ''}
                />
                <span>${option}</span>
              </label>`).join('\n')}
            </div>
          </div>`;
    
    case 'checkbox':
      return `          <div>
            ${field.showLabel !== false ? `<label ${labelStyleString}>${field.label}${field.required ? ' *' : ''}</label>` : ''}
            <div className="space-y-2">
${field.options?.map(option => `              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="${field.id}"
                  value="${option}"
                  checked={formData.${field.id}.includes('${option}')}
                  onChange={handleChange}
                />
                <span>${option}</span>
              </label>`).join('\n')}
            </div>
          </div>`;
    
    default:
      return `          <div>
            ${field.showLabel !== false ? `<label htmlFor="${field.id}" ${labelStyleString}>${field.label}${field.required ? ' *' : ''}</label>` : ''}
            <input
              type="${field.type}"
              id="${field.id}"
              name="${field.id}"
              value={formData.${field.id}}
              onChange={handleChange}
              placeholder="${field.placeholder || ''}"
              ${field.required ? 'required' : ''}
              ${fieldStyleString}
              className="w-full outline-none"
            />
          </div>`;
  }
}).join('\n')}
        </div>
        
        <div className="mt-8">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormComponent;`;
};

const generateHTMLCode = (
  fields: FormField[],
  formStyles: any,
  generateFieldStyles: (field: FormField) => any,
  generateLabelStyles: (field: FormField) => any,
  formTitle: string,
  formDescription: string,
  showFormTitle: boolean,
  showFormDescription: boolean
) => {
  const styleToString = (style: any) => {
    if (Object.keys(style).length === 0) return '';
    return `style="${Object.entries(style).map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`).join('; ')}"`;
  };

  const formStyleString = styleToString(formStyles);

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${formTitle}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        .form-container {
            background: white;
            padding: 32px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .form-group {
            margin-bottom: 24px;
        }
        label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
        }
        input, select, textarea {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid #e5e7eb;
            border-radius: 6px;
            font-size: 14px;
        }
        textarea {
            min-height: 80px;
            resize: vertical;
        }
        .radio-group, .checkbox-group {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        .radio-group label, .checkbox-group label {
            display: flex;
            align-items: center;
            gap: 8px;
            font-weight: normal;
        }
        .radio-group input, .checkbox-group input {
            width: auto;
        }
        .submit-btn {
            background: #2563eb;
            color: white;
            padding: 12px 24px;
            border: none;
            border-radius: 6px;
            font-size: 16px;
            cursor: pointer;
            width: 100%;
        }
        .submit-btn:hover {
            background: #1d4ed8;
        }
        .form-header {
            text-align: center;
            margin-bottom: 32px;
        }
        .form-title {
            font-size: 2rem;
            font-weight: bold;
            margin-bottom: 16px;
        }
        .form-description {
            font-size: 1.125rem;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="form-container" ${formStyleString}>
        ${showFormTitle || showFormDescription ? `<div class="form-header">
            ${showFormTitle ? `<h1 class="form-title">${formTitle}</h1>` : ''}
            ${showFormDescription && formDescription ? `<p class="form-description">${formDescription}</p>` : ''}
        </div>` : ''}
        
        <form id="dynamicForm">
${fields.map(field => {
  const fieldStyles = generateFieldStyles(field);
  const labelStyles = generateLabelStyles(field);
  const fieldStyleString = styleToString(fieldStyles);
  const labelStyleString = styleToString(labelStyles);

  switch (field.type) {
    case 'textarea':
      return `            <div class="form-group">
                ${field.showLabel !== false ? `<label for="${field.id}" ${labelStyleString}>${field.label}${field.required ? ' *' : ''}</label>` : ''}
                <textarea id="${field.id}" name="${field.id}" placeholder="${field.placeholder || ''}" ${field.required ? 'required' : ''} ${fieldStyleString}></textarea>
            </div>`;
    
    case 'select':
      return `            <div class="form-group">
                ${field.showLabel !== false ? `<label for="${field.id}" ${labelStyleString}>${field.label}${field.required ? ' *' : ''}</label>` : ''}
                <select id="${field.id}" name="${field.id}" ${field.required ? 'required' : ''} ${fieldStyleString}>
                    <option value="">${field.placeholder || 'Select an option'}</option>
${field.options?.map(option => `                    <option value="${option}">${option}</option>`).join('\n')}
                </select>
            </div>`;
    
    case 'radio':
      return `            <div class="form-group">
                ${field.showLabel !== false ? `<label ${labelStyleString}>${field.label}${field.required ? ' *' : ''}</label>` : ''}
                <div class="radio-group">
${field.options?.map(option => `                    <label>
                        <input type="radio" name="${field.id}" value="${option}" ${field.required ? 'required' : ''}>
                        <span>${option}</span>
                    </label>`).join('\n')}
                </div>
            </div>`;
    
    case 'checkbox':
      return `            <div class="form-group">
                ${field.showLabel !== false ? `<label ${labelStyleString}>${field.label}${field.required ? ' *' : ''}</label>` : ''}
                <div class="checkbox-group">
${field.options?.map(option => `                    <label>
                        <input type="checkbox" name="${field.id}" value="${option}">
                        <span>${option}</span>
                    </label>`).join('\n')}
                </div>
            </div>`;
    
    default:
      return `            <div class="form-group">
                ${field.showLabel !== false ? `<label for="${field.id}" ${labelStyleString}>${field.label}${field.required ? ' *' : ''}</label>` : ''}
                <input type="${field.type}" id="${field.id}" name="${field.id}" placeholder="${field.placeholder || ''}" ${field.required ? 'required' : ''} ${fieldStyleString}>
            </div>`;
  }
}).join('\n')}
            
            <div class="form-group">
                <button type="submit" class="submit-btn">Submit</button>
            </div>
        </form>
    </div>

    <script>
        document.getElementById('dynamicForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = {};
            
            // Handle regular form fields
            for (let [key, value] of formData.entries()) {
                if (data[key]) {
                    // Convert to array if multiple values (checkboxes)
                    if (Array.isArray(data[key])) {
                        data[key].push(value);
                    } else {
                        data[key] = [data[key], value];
                    }
                } else {
                    data[key] = value;
                }
            }
            
            console.log('Form submitted:', data);
            alert('Form submitted successfully! Check the console for details.');
        });
    </script>
</body>
</html>`;
};

const generateVueCode = (
  fields: FormField[],
  formStyles: any,
  generateFieldStyles: (field: FormField) => any,
  generateLabelStyles: (field: FormField) => any,
  formTitle: string,
  formDescription: string,
  showFormTitle: boolean,
  showFormDescription: boolean
) => {
  const styleToString = (style: any) => {
    if (Object.keys(style).length === 0) return '';
    return `:style="${JSON.stringify(style)}"`;
  };

  const formStyleString = styleToString(formStyles);

  return `<template>
  <div class="max-w-2xl mx-auto p-4">
    <form @submit.prevent="handleSubmit" ${formStyleString}>
      ${showFormTitle || showFormDescription ? `<div class="mb-8 text-center">
        ${showFormTitle ? `<h1 class="text-3xl font-bold mb-4">${formTitle}</h1>` : ''}
        ${showFormDescription && formDescription ? `<p class="text-lg">${formDescription}</p>` : ''}
      </div>` : ''}
      
      <div class="space-y-6">
${fields.map(field => {
  const fieldStyles = generateFieldStyles(field);
  const labelStyles = generateLabelStyles(field);
  const fieldStyleString = styleToString(fieldStyles);
  const labelStyleString = styleToString(labelStyles);

  switch (field.type) {
    case 'textarea':
      return `        <div>
          ${field.showLabel !== false ? `<label for="${field.id}" ${labelStyleString}>${field.label}${field.required ? ' *' : ''}</label>` : ''}
          <textarea
            id="${field.id}"
            v-model="formData.${field.id}"
            placeholder="${field.placeholder || ''}"
            ${field.required ? 'required' : ''}
            ${fieldStyleString}
            class="w-full min-h-[80px] resize-none outline-none"
          />
        </div>`;
    
    case 'select':
      return `        <div>
          ${field.showLabel !== false ? `<label for="${field.id}" ${labelStyleString}>${field.label}${field.required ? ' *' : ''}</label>` : ''}
          <select
            id="${field.id}"
            v-model="formData.${field.id}"
            ${field.required ? 'required' : ''}
            ${fieldStyleString}
            class="w-full outline-none"
          >
            <option value="">${field.placeholder || 'Select an option'}</option>
${field.options?.map(option => `            <option value="${option}">${option}</option>`).join('\n')}
          </select>
        </div>`;
    
    case 'radio':
      return `        <div>
          ${field.showLabel !== false ? `<label ${labelStyleString}>${field.label}${field.required ? ' *' : ''}</label>` : ''}
          <div class="space-y-2">
${field.options?.map(option => `            <label class="flex items-center space-x-2">
              <input
                type="radio"
                v-model="formData.${field.id}"
                value="${option}"
                ${field.required ? 'required' : ''}
              />
              <span>${option}</span>
            </label>`).join('\n')}
          </div>
        </div>`;
    
    case 'checkbox':
      return `        <div>
          ${field.showLabel !== false ? `<label ${labelStyleString}>${field.label}${field.required ? ' *' : ''}</label>` : ''}
          <div class="space-y-2">
${field.options?.map(option => `            <label class="flex items-center space-x-2">
              <input
                type="checkbox"
                v-model="formData.${field.id}"
                value="${option}"
              />
              <span>${option}</span>
            </label>`).join('\n')}
          </div>
        </div>`;
    
    default:
      return `        <div>
          ${field.showLabel !== false ? `<label for="${field.id}" ${labelStyleString}>${field.label}${field.required ? ' *' : ''}</label>` : ''}
          <input
            type="${field.type}"
            id="${field.id}"
            v-model="formData.${field.id}"
            placeholder="${field.placeholder || ''}"
            ${field.required ? 'required' : ''}
            ${fieldStyleString}
            class="w-full outline-none"
          />
        </div>`;
  }
}).join('\n')}
      </div>
      
      <div class="mt-8">
        <button
          type="submit"
          class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          Submit
        </button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'FormComponent',
  data() {
    return {
      formData: {
${fields.map(field => `        ${field.id}: ${field.type === 'checkbox' ? '[]' : "''"},`).join('\n')}
      }
    };
  },
  methods: {
    handleSubmit() {
      console.log('Form submitted:', this.formData);
    }
  }
};
</script>

<style scoped>
.max-w-2xl {
  max-width: 42rem;
}
.mx-auto {
  margin-left: auto;
  margin-right: auto;
}
.p-4 {
  padding: 1rem;
}
.mb-8 {
  margin-bottom: 2rem;
}
.text-center {
  text-align: center;
}
.text-3xl {
  font-size: 1.875rem;
}
.font-bold {
  font-weight: 700;
}
.mb-4 {
  margin-bottom: 1rem;
}
.text-lg {
  font-size: 1.125rem;
}
.space-y-6 > * + * {
  margin-top: 1.5rem;
}
.space-y-2 > * + * {
  margin-top: 0.5rem;
}
.w-full {
  width: 100%;
}
.min-h-[80px] {
  min-height: 80px;
}
.resize-none {
  resize: none;
}
.outline-none {
  outline: none;
}
.flex {
  display: flex;
}
.items-center {
  align-items: center;
}
.space-x-2 > * + * {
  margin-left: 0.5rem;
}
.mt-8 {
  margin-top: 2rem;
}
.bg-blue-600 {
  background-color: #2563eb;
}
.text-white {
  color: white;
}
.py-2 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}
.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}
.rounded-md {
  border-radius: 0.375rem;
}
.hover\\:bg-blue-700:hover {
  background-color: #1d4ed8;
}
.transition-colors {
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out;
}
</style>`;
};
