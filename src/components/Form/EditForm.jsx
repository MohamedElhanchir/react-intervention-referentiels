import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Form, Col, Row, FormControl, Accordion, InputGroup } from 'react-bootstrap';

function EditForm() {
  const { id } = useParams();
  const [formSection, setFormSection] = useState({});
  const [editSectionId, setEditSectionId] = useState(null);
  const [editSectionName, setEditSectionName] = useState('');


  useEffect(() => {
    const fetchFields = async () => {
      const response = await axios.get(`http://localhost:8000/api/forms/${id}/fields/formSection`);
      setFormSection(response.data);
     // console.log(response.data);
    };
    fetchFields();
  }, [id]);
  

  const handleDoubleClick = (sectionId, sectionName) => {
    setEditSectionId(sectionId);
    setEditSectionName(sectionName);
  };

  const handleNameChange = (e) => {
    setEditSectionName(e.target.value);
  };

  const handleKeyPress = (e, sectionId) => {
    if (e.key === 'Enter') {
     axios.put(`http://localhost:8000/api/form_sections/${sectionId}`, {
        id: sectionId,
        form_id: id,
        name: editSectionName,

      })
      .then(() => {
        const updatedSections = { ...formSection };
        updatedSections[sectionId].formSection.name = editSectionName;
        setFormSection(updatedSections);
        setEditSectionId(null); 
      })
      .catch(error => console.error('There was an error updating the section name:', error));
    }
  };

  const renderField = (field) => {
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
        return <FormControl type="password" value={field.value} disabled />;
      case 'file':
        return <FormControl type="file" disabled />;
      case 'textarea':
        return <FormControl as="textarea" value={field.value} disabled />;
      default:
        return <FormControl type="text" value={field.value} disabled />;
    }
  };

  return (
    <Container className="mt-5">
      <Accordion defaultActiveKey="0">
    
        {Object.entries(formSection).map(([sectionKey, sectionValue], index) => (
          <Accordion.Item eventKey={String(index)} key={sectionKey}>
              <Accordion.Header
              onDoubleClick={() => handleDoubleClick(sectionKey, sectionValue.formSection.name)}
            >
              {editSectionId === sectionKey && sectionValue.formSection.id ? (
                <InputGroup>
                  <FormControl
                    autoFocus
                    value={editSectionName}
                    onChange={handleNameChange}
                    onKeyPress={(e) => handleKeyPress(e, sectionKey)}
                  />
                </InputGroup>
              ) : (
                sectionValue.formSection.name
              )}
            </Accordion.Header>
            <Accordion.Body>
              {sectionValue.fields.map((field) => (
                <Form.Group as={Row} key={field.id} className="mb-3">
                  <Form.Label column sm="2">
                    {field.name}
                  </Form.Label>
                  <Col sm="10">
                    {renderField(field)}
                  </Col>
                </Form.Group>
              ))}
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </Container>
  );
}

export default EditForm;