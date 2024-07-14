import React, { useState } from 'react';
import { Accordion, InputGroup, FormControl, Button, Form, Row, Col } from 'react-bootstrap';
import FieldRenderer from './FieldRenderer';
import axios from 'axios';


const Section = ({ sectionKey, sectionValue, formSection,setFormSection,id,setFieldSectionId,toggleModal }) => {

  const [editSectionId, setEditSectionId] = useState(null);
  const [editSectionName, setEditSectionName] = useState('');

  const handleDoubleClick = (sectionId, sectionName) => {
    setEditSectionId(sectionId);
    setEditSectionName(sectionName);
  };

  const handleAddField = async (sectionId) => {
    toggleModal();
    setFieldSectionId(sectionId);
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

  return (
    <Accordion.Item eventKey={sectionKey}>
      <Accordion.Header onDoubleClick={() => handleDoubleClick(sectionKey, sectionValue.formSection.name)}>
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
        <Button
          variant="success"
          size="sm"
          onClick={() => handleAddField(sectionValue.formSection.id)}
          style={{ marginLeft: '10px' }}
        >
          Ajouter un nouveau champ
        </Button>
        {sectionValue.fields.map((field) => (
          <Form.Group as={Row} key={field.id} className="mb-3">
            <Form.Label column sm="2">
              {field.name}
            </Form.Label>
            <Col sm="10">
              <FieldRenderer field={field} />
            </Col>
          </Form.Group>
        ))}
      </Accordion.Body>
    </Accordion.Item>
  );
};

export default Section;
