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
    <Accordion.Item eventKey={sectionKey} style={{ backgroundColor: "#f8f9fa" }}>
    <Accordion.Header 
      onDoubleClick={() => handleDoubleClick(sectionKey, sectionValue.formSection.name)}
      style={{ backgroundColor: "#e9ecef", color: "#495057" }}
    >
      {editSectionId === sectionKey && sectionValue.formSection.id ? (
       <InputGroup size="sm" style={{ maxWidth: "250px" }}>
       <FormControl
         autoFocus
         value={editSectionName}
         onChange={handleNameChange}
         onKeyPress={(e) => handleKeyPress(e, sectionValue.formSection.id)}
         onBlur={() => setEditSectionId(null)}
         onKeyDown={(e) => {
           if (e.key === 'Escape') {
             setEditSectionId(null); 
           }
         }}
         style={{ fontSize: "0.875rem" }}
       />
     </InputGroup>
      ) : (
        <span style={{ fontSize: "1rem", fontWeight: "bold", color: "#495057" }}>
          {sectionValue.formSection.name}
        </span>
      )}
    </Accordion.Header>
    <Accordion.Body style={{ backgroundColor: "#fff", padding: "10px" }}>
      <Button
        variant="primary"
        size="sm"
        onClick={() => handleAddField(sectionValue.formSection.id)}
        style={{ margin: "0 0 10px 10px", fontSize: "0.875rem" }}
      >
        Ajouter un nouveau champ
      </Button>
      {sectionValue.fields.map((field) => (
        <Form.Group as={Row} key={field.id} className="mb-2" style={{ margin: "0 -15px" }}>
          <Form.Label column sm="2" style={{ fontSize: "0.875rem", color: "#6c757d", padding: "0 15px" }}>
            {field.name}
          </Form.Label>
          <Col sm="10" style={{ padding: "0 15px" }}>
            <FieldRenderer field={field} />
          </Col>
        </Form.Group>
      ))}
    </Accordion.Body>
  </Accordion.Item>
  );
};

export default Section;
