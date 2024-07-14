import axios from 'axios';
import React, { useState } from 'react';
import { Form, Button, Spinner, Row, Col } from 'react-bootstrap';


const SectionFormAdd = ({id,formSection,setFormSection}) => {
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [newSectionError, setNewSectionError] = useState('');


  const validateNewSection = () => {
    if (!newSectionName.trim()) {
      setNewSectionError('Le nom de la section est requis.');
      return false;
    }
    setNewSectionError('');
    return true;
  };
  
  const [newSectionName, setNewSectionName] = useState('');
  const handleNewSectionNameChange = (e) => {
    setNewSectionName(e.target.value);
  };


  const handleAddNewSection = async (event) => {
    event.preventDefault();
    if (!validateNewSection()) return;
    setIsAddingSection(true);
    try {
      const response = await axios.post('http://localhost:8000/api/form_sections', {
        name: newSectionName,
        form_id: parseInt(id),
      });
      const newSection = response.data.data;
      const updatedFormSections = {
        ...formSection,
        [newSection.id]: { formSection: newSection, fields: [] },
      };
      setFormSection(updatedFormSections);
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la section', error);
    } finally {
      setIsAddingSection(false);
      setNewSectionName('');
    }
  };

  return (
    <Form className="m-2">
    <Row>
      <Col xs={5}>
        <Form.Group controlId="formSectionName">
          <Form.Label>Nom de la section</Form.Label>
          <Form.Control type="text" placeholder="Entrez le nom de la section" value={newSectionName} onChange={handleNewSectionNameChange} />
        </Form.Group>
      </Col>
      <Col xs={3} className="d-flex align-items-end">
        <Button variant="primary" onClick={handleAddNewSection} disabled={isAddingSection} className="w-100">
          {isAddingSection ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : "Ajouter la section"}
        </Button>
      </Col>
    </Row>
    <Row>
      <Col xs={5}>
        {newSectionError && <div style={{ color: 'red' }}>{newSectionError}</div>}
      </Col>
      </Row>
  </Form>
  );
};

export default SectionFormAdd;
