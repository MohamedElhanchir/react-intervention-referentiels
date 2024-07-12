import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FormList = () => {
  const [forms, setForms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newFormName, setNewFormName] = useState('');


  const navigate=useNavigate();

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/api/forms');
      setForms(response.data.data);
      setError(null); 
    } catch (err) {
      setError('Failed to fetch forms');
    } finally {
      setIsLoading(false);
    }
  };


 const handleAdd = async () => {
  if (!newFormName) {
    alert('Please enter a name for the new form.');
    return;
  }
  try {
    const response = await axios.post('http://localhost:8000/api/forms', {
      name: newFormName,
    });
    setForms(currentForms => [...currentForms, response.data.data]);
    setNewFormName('');
  } catch (error) {
    console.error('Failed to add the form', error);
    alert('Failed to add the form');
  }
};

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mt-5 col-md-6">
      <h1>Forms</h1>
      
      <div className='d-flex align-items-center'> 
        <input className="form-control me-2" type="text" value={newFormName}
         onChange={(e) => setNewFormName(e.target.value)}
          placeholder="Entrer le nom du formulaire" /> 
          <button className="btn btn-success" onClick={handleAdd}>Ajouter</button> 
          </div>


      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {forms.map(form => (
            <tr key={form.id}>
              <td>{form.id}</td>
              <td>{form.name}</td>
              <td>
                <button className="btn btn-primary mr-2" onClick={()=>navigate(`/edit-form/${form.id}`)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FormList;

/*
form section
react-select
field style

*/