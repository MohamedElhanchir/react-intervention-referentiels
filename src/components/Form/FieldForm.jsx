import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Form, Button, Modal, Spinner } from 'react-bootstrap';

const FieldForm = ({
  toggleModal, fieldName, handleFieldNameChange, selectedType, setSelectedType, options,
  setOptions,fieldSectionId, formSection,setFormSection, id,setShowModal,showModal}) => {

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [fieldTypes, setFieldTypes] = useState([]);


  useEffect(() => {
    const fetchFieldTypes = async () => {
      const response = await axios.get('http://localhost:8000/api/field_types');
      setFieldTypes(response.data.data);
    };
    fetchFieldTypes();
  }, []);

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

  const validateForm = () => {
    let newErrors = {};
    if (!fieldName.trim()) {
      newErrors.fieldName = 'Le nom du champ est requis.';
    }
    if (!selectedType) {
      newErrors.selectedType = 'Le type de champ est requis.';
    }
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
    const opts = options.filter(option => option.label && option.value).length > 0 ? options.filter(option => option.label && option.value) : null;

    const dataToSend = {
      name: fieldName,
      field_type_id: field_type.id,
      form_section_id: fieldSectionId,
      options: opts,
      form_id: parseInt(id),
    };

    const url = `http://localhost:8000/api/fields`;
    const method = 'post';
    await axios({ method, url, data: dataToSend })
      .then((response) => {
        setShowModal(false);
        response.data.data.field_type = field_type;
        if (response.data.data.options && typeof response.data.data.options === 'string') {
          response.data.data.options = JSON.parse(response.data.data.options);
        }
        const updatedSections = { ...formSection };
        const targetIndex = fieldSectionId ? fieldSectionId : 'Non classé';
    if (!updatedSections[targetIndex]) {
      updatedSections[targetIndex] = {
        formSection: { id: null, name: 'Non classé' }, 
        fields: []
      };}
        updatedSections[targetIndex].fields.push(response.data.data);
        setFormSection(updatedSections);
      })
      .catch(error => {
        console.error('Failed to save the field', error);
        alert('Failed to save the field');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Modal show={showModal} onHide={toggleModal}>
      <Modal.Header closeButton>
        <Modal.Title>Ajouter un nouveau champ</Modal.Title>
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
        {(selectedType === 'checkbox' || selectedType === 'radio' || selectedType === 'select') && (
          <Form.Group>
            <Form.Label className="m-2">Options</Form.Label>
            {Array.isArray(options) && options.map((option, index) => (
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
            ))}
            <Button onClick={addOption} className="mt-2">Ajouter une option</Button>
          </Form.Group>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={toggleModal}>
          Fermer
        </Button>
        <Button variant="primary" onClick={handleSaveChanges} disabled={isLoading}>
          {isLoading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : "Sauvegarder les changements"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FieldForm;
