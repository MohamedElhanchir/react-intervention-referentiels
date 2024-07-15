import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Accordion } from 'react-bootstrap';
import FieldForm from './FieldForm';
import Section from './SectionForm';
import SectionFormAdd from './SectionFormAdd ';

function EditForm() {
  const { id } = useParams();
  const [formSection, setFormSection] = useState({});

  const [fieldSectionId, setFieldSectionId] = useState(null);
  const [selectedType, setSelectedType] = useState('');
  const [fieldName, setFieldName] = useState('');

  const [options, setOptions] = useState([{ label: "", value: "" }]);
  const [showModal, setShowModal] = useState(false);
  

  const handleFieldNameChange = (event) => {
    setFieldName(event.target.value);
  };

  const toggleModal = () => {
    setShowModal(!showModal);
    setFieldName('');
    setSelectedType('');
    setFieldSectionId(null);
    setOptions([{ label: "", value: "" }]);
  };

  useEffect(() => {
    const fetchFields = async () => {
      const response = await axios.get(`http://localhost:8000/api/forms/${id}/fields/formSection`);
      const structuredData = response.data.reduce((acc, item) => {
        const sectionId = item.formSection.id ? item.formSection.id : 'Non classé';
        if (!acc[sectionId]) {
          acc[sectionId] = {
            formSection: item.formSection,
            fields: [],
          };
        }
        acc[sectionId].fields.push(...item.fields);
        return acc;
      }, {});
      setFormSection(structuredData);
    };
    fetchFields();
  }, [id]);

  return (
    <Container className="mt-5">

      <SectionFormAdd   id={id} formSection={formSection} setFormSection={setFormSection}/>

{!Object.keys(formSection).includes("Non classé")?
  <button onClick={() => {toggleModal()}} className="btn btn-primary mb-3">
        Ajouter un champ
        </button>:null}
      

      <Accordion defaultActiveKey="0">
        {Object.entries(formSection).map(([sectionKey, sectionValue], index) => (
          <Section
            key={sectionKey}
            sectionKey={String(index)}
            sectionValue={sectionValue}
            formSection={formSection}
            setFormSection={setFormSection}
            id={id}
            setFieldSectionId={setFieldSectionId}
            toggleModal={toggleModal}
          />
        ))}
      </Accordion>

      <FieldForm
        toggleModal={toggleModal}
        fieldName={fieldName}
        handleFieldNameChange={handleFieldNameChange}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        options={options}
        setOptions={setOptions}
        fieldSectionId={fieldSectionId}
        formSection={formSection}
        setFormSection={setFormSection}
        id={id}
        setShowModal={setShowModal}
        showModal={showModal}
      />
    </Container>
  );
}

export default EditForm;
