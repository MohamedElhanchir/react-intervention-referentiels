import React from 'react';
import { FormControl, Form } from 'react-bootstrap';

const FieldRenderer = ({ field }) => {
  switch (field.field_type.name.toLowerCase()) {
    case 'text':
      return <FormControl type="text" value={field.value} disabled />;
    case 'number':
      return <FormControl type="number" value={field.value} disabled />;
    case 'date':
      return <FormControl type="date" value={field.value} disabled />;
    case 'radio':
      return (
        <div>
          {field.options?.map((option, index) => (
            <Form.Check
              key={index}
              type="radio"
              label={option}
              name={field.name}
              value={option}
              checked={field.value === option}
              disabled
            />
          ))}
        </div>
      );
    case 'checkbox':
      return <Form.Check type="checkbox" checked={field.value} disabled />;
    case 'datetime-local':
      return <FormControl type="datetime-local" value={field.value} disabled />;
    case 'email':
      return <FormControl type="email" value={field.value} disabled />;
    case 'password':
      return <FormControl type="password" value={field.field_type.name} disabled />;
    case 'file':
      return <FormControl type="file" disabled />;
    case 'textarea':
      return <FormControl as="textarea" value={field.value} disabled />;
    default:
      return <FormControl type="text" value={field.value} disabled />;
  }
};

export default FieldRenderer;
