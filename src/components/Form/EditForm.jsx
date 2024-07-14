import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Form, Col, Row, FormControl, Accordion, InputGroup, Button, Modal, Spinner } from 'react-bootstrap';

function EditForm() {
  const { id } = useParams();
  const [formSection, setFormSection] = useState({});
  const [editSectionId, setEditSectionId] = useState(null);
  const [editSectionName, setEditSectionName] = useState('');
  const [errors, setErrors] = useState({}); 




  const [fieldTypes, setFieldTypes] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [fieldSectionId, setFieldSectionId] = useState(null); 
  const [fieldName, setFieldName] = useState('');
  const [options, setOptions] = useState([{ label: "", value: "" }]);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchFieldTypes = async () => {
      const response = await axios.get('http://localhost:8000/api/field_types');
      setFieldTypes(response.data.data);
    };
    fetchFieldTypes();
  }, []);



  const handleFieldNameChange = (event) => {
    setFieldName(event.target.value);
  };

  const handleOptionChange = (index, event) => {
    const newOptions = [...options];
    newOptions[index][event.target.name] = event.target.value;
    setOptions(newOptions);
  };


  const addOption = () => {
    setOptions([...options, { label: "", value: "" }]);
  };


  const removeOption = (index) => {
    const newOptions = [...options];
    newOptions.splice(index, 1);
    setOptions(newOptions);
  };


  const toggleModal = () => {
    setShowModal(!showModal);
    setFieldName('');
    setSelectedType('');
    setFieldSectionId(null);
    setOptions([{ label: "", value: "" }])
  };




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
        return <FormControl type="password" value={field.field_type.name} disabled />;
      case 'file':
        return <FormControl type="file" disabled />;
      case 'textarea':
        return <FormControl as="textarea" value={field.value} disabled />;
      default:
        return <FormControl type="text" value={field.value} disabled />;
    }
  };

  const handleAddField = async (sectionId) => {
    toggleModal(); 
    setFieldSectionId(sectionId);
    console.log(sectionId);
  };


  const validateForm = () => {
    let newErrors = {};
    if (!fieldName.trim()) {
      newErrors.fieldName = 'Le nom du champ est requis.';
    }
    if (!selectedType) {
      newErrors.selectedType = 'Le type de champ est requis.';
    }
    // Ajoutez d'autres validations selon vos besoins
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };



  const handleSaveChanges = async () => {
    setIsLoading(true);
    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    
    const field_type = fieldTypes.find(type => type.name === selectedType);


  
    let opts=options.filter(option => option.label && option.value).length > 0 ? options.filter(option => option.label && option.value) : null
   /* if(editingField){
      if(selectedType !== 'select' && selectedType !== 'radio' && selectedType !== 'checkbox'){
        opts=null;
      }
  }
        */
    

    const dataToSend = {
      name: fieldName,
      field_type_id: field_type.id,
      form_section_id: fieldSectionId,
      options: opts,
      form_id: parseInt(id),
    };

    console.log(dataToSend);
  
   

    const url = `http://localhost:8000/api/fields`;
    const method =  'post';
    await axios({ method, url, data: dataToSend })
    .then((response) => {
      setShowModal(false);
      response.data.data.field_type = field_type;
      const updatedSections = { ...formSection };
      const targetIndex=fieldSectionId?fieldSectionId:'Non classé'
      if (updatedSections[targetIndex] && updatedSections[targetIndex].fields) {
        updatedSections[targetIndex].fields.push(response.data.data);
      } else {
        console.error('Section not found or does not have a fields array');
      }
      
      setFormSection(updatedSections); 
      })
      .catch(error => {
        console.error('Failed to save the field', error);
        alert('Failed to save the field');
      })
      .finally(() => {
        setIsLoading(false); 
      });
    
      
      
  }

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
                    {renderField(field)}
                  </Col>
                </Form.Group>
              ))}
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
      <div>
      
      <Modal show={showModal} onHide={toggleModal}>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter un nouveau field</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form.Group>
        <Form.Label>Nom</Form.Label>
              <Form.Control type="text" required placeholder="Entrez le nom du champ" value={fieldName} onChange={handleFieldNameChange} />
              {errors.fieldName && <span style={{ color: 'red' }}>{errors.fieldName}</span>}
            </Form.Group>
            <Form.Group>
              <Form.Label>Type</Form.Label>
              <Form.Control as="select" value={selectedType} onChange={e => setSelectedType(e.target.value)}>
                <option value="">Sélectionnez un type</option>
                {fieldTypes.map((type) => (
                  <option key={type.id} value={type.name}>{type.name}</option>
                ))}
              </Form.Control>
              {errors.selectedType && <span style={{ color: 'red' }}>{errors.selectedType}</span>}
            </Form.Group>
            
            {selectedType === 'checkbox' || selectedType === 'radio' || selectedType === 'select' ? (
            <Form.Group>
              <Form.Label className="m-2">Options</Form.Label>
              {Array.isArray(options) ?  options.map((option, index) => (
                <div key={index} className="d-flex align-items-center">
                  <Form.Control
                    type="text"
                    placeholder="Label"
                    name="label"
                    value={option.label}
                    onChange={(e) => handleOptionChange(index, e)}
                    className="m-2"
                  />
                  <Form.Control
                    type="text"
                    placeholder="Valeur"
                    name="value"
                    value={option.value}
                    onChange={(e) => handleOptionChange(index, e)}
                    className="m-2"
                  />
        <Button variant="danger" onClick={() => removeOption(index)}>Supprimer</Button>
                </div>
              )): null}
              <Button onClick={addOption} className="mt-2">Ajouter une option</Button>
            </Form.Group>
  ) : null}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={toggleModal}>
            Fermer
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}  disabled={isLoading}>
          {isLoading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : "Sauvegarder les changements"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
    </Container>
  );
}

export default EditForm;