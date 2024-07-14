import React, { useState, useEffect } from 'react';
import {  useParams } from 'react-router-dom';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';


function EditForm() {
  const { id } = useParams();
  const [fields, setFields] = useState([]);
  const [fieldTypes, setFieldTypes] = useState([]);
  const [formSection, setFormSection] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [options, setOptions] = useState([{ label: "", value: "" }]);
  const [showModal, setShowModal] = useState(false);
  const [fieldName, setFieldName] = useState('');

  const [editingField, setEditingField] = useState(null); 

const handleFieldNameChange = (event) => {
  setFieldName(event.target.value);
};


  useEffect(() => {
    const fetchFieldTypes = async () => {
      const response = await axios.get('http://localhost:8000/api/field_types');
      setFieldTypes(response.data.data);
    };
    fetchFieldTypes();
  }, []);


  useEffect(() => {
    const fetchFields = async () => {
      const response = await axios.get(`http://localhost:8000/api/forms/${id}/fields`);
      setFields(response.data);
    };
    fetchFields();
  }, [id]);


  const handleDelete = async (field) => {
    await axios.delete(`http://localhost:8000/api/fields/${field.id}`)
      .then(() => {
        setFields(fields.filter(f => f.id !== field.id));
      })
      .catch(error => {
        console.error('Failed to delete the field', error);
        alert('Failed to delete the field');
      });
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
    setOptions([{ label: "", value: "" }])
    setEditingField(null); 
  };

  const openEditModal = (field) => {
    setEditingField(field);
    setFieldName(field.name);
    setSelectedType(field.field_type.name);
    setOptions(Array.isArray(field.options) ? field.options : [{ label: "", value: "" }]);
    setShowModal(true);
  };
  


const handleSaveChanges = async () => {
  const field_type = fieldTypes.find(type => type.name === selectedType);

  if (!fieldName || !selectedType || !field_type) {
    alert('Veuillez remplir tous les champs');
    return;
  }

  let opts=options.filter(option => option.label && option.value).length > 0 ? options.filter(option => option.label && option.value) : null
  if(editingField){
    if(selectedType !== 'Select' && selectedType !== 'Radio' && selectedType !== 'Checkbox'){
      opts=null;
    }
  }
  
  const dataToSend = {
    name: fieldName,
    field_type_id: field_type.id,
    options: opts,
    form_id: id,
  };

  const url = editingField ? `http://localhost:8000/api/fields/${editingField.id}` : `http://localhost:8000/api/fields`;
  const method = editingField ? 'put' : 'post';

  await axios({ method, url, data: dataToSend })
    .then((response) => {
      setShowModal(false);
      response.data.data.field_type = field_type;
      if (editingField) {
        setFields(fields.map(f => f.id === editingField.id ? response.data.data : f));
      } else {
       
        setFields([...fields, response.data.data]);
        }
      })
      .catch(error => {
        console.error('Failed to save the field', error);
        alert('Failed to save the field');
      });
  };

  return (
    <div className="container mt-5 col-md-6">
        <div>
      <Button variant="success" onClick={toggleModal}>Ajouter un nouveau field</Button>
      
      <Modal show={showModal} onHide={toggleModal}>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter un nouveau field</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form.Group>
        <Form.Label>Nom</Form.Label>
              <Form.Control type="text" required placeholder="Entrez le nom du champ" value={fieldName} onChange={handleFieldNameChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Type</Form.Label>
              <Form.Control as="select" value={selectedType} onChange={e => setSelectedType(e.target.value)}>
                <option value="">Sélectionnez un type</option>
                {fieldTypes.map((type) => (
                  <option key={type.id} value={type.name}>{type.name}</option>
                ))}
              </Form.Control>
            </Form.Group>
            
            {selectedType === 'Checkbox' || selectedType === 'Radio' || selectedType === 'Select' ? (
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
          <Button variant="primary" onClick={handleSaveChanges}>
            Sauvegarder les changements
          </Button>
        </Modal.Footer>
      </Modal>
    </div>

      <table className="table">
        <thead className="thead-dark">
          <tr>
            <th>Valeur</th>
            <th>Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(fields) ? fields.map((field) => (
            <tr key={field.id}>
              <td>{field.name}</td>
              <td>{field.field_type.name}</td>
              <td>
                <button className="btn btn-primary mr-2"  onClick={() => openEditModal(field)}>Modifier</button>
                <button className="btn btn-danger m-1" onClick={() => handleDelete(field)}>Supprimer</button>
              </td>
            </tr>
          )) : null}
        </tbody>
      </table>
    </div>
  );
}

export default EditForm;