import React from 'react';
import { FormControl, Form } from 'react-bootstrap';
import Select from 'react-select';

const FieldRenderer = ({ field }) => {
  const placeholder = "Entrez votre valeur ici"; 

  switch (field.field_type.name.toLowerCase()) {
    case 'text':
      return <FormControl type="text" value={field.value} placeholder={placeholder} disabled />;
    case 'number':
      return <FormControl type="number" value={field.value} placeholder={placeholder} disabled />;
    case 'date':
      return <FormControl type="date" value={field.value} placeholder={placeholder} disabled />;
      case 'radio':
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
      {Array.isArray(field.options) && field.options.map((option, index) => (
        <Form.Check
          key={index}
          type="radio"
          label={option.value}
          name={field.name}
          disabled
          style={{ marginRight: '10px' }} 
        />
      ))}
    </div>
  );
        case 'checkbox':
          return (
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
              {Array.isArray(field.options) && field.options.map((option, index) => (
                <Form.Check
                  key={index}
                  type="checkbox"
                  label={option.value}
                  name={field.name}
                  disabled
                  style={{ marginRight: '10px' }} 
                />
              ))}
            </div>
          );
      case 'select':
        const options = field.options.map((option, index) => ({
          value: option.label, 
          label: option.value 
        }));
      
        return (
          <Select
            placeholder="Selectionnez une option"
            options={options}
          />
        );
    case 'datetime-local':
      return <FormControl type="datetime-local"  placeholder={placeholder} disabled />;
    case 'email':
      return <FormControl type="email" placeholder="exemple@domaine.com" disabled />;
    case 'password':
      return <FormControl type="password" value={field.name} placeholder="Mot de passe" disabled />;
    case 'file':
      return <FormControl type="file" disabled />;
    case 'textarea':
      return <FormControl as="textarea"  placeholder={placeholder} disabled />;
    default:
      return;
  }
};

export default FieldRenderer;