import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import Select from 'react-select';


function SearchIntervention() {
const [forms, setForms] = useState([]);
  const [users, setUsers] = useState([]);
  const [flags, setFlags] = useState([]);
  const [valeurReferentiels, setValeurReferentiels] = useState([]);

  
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedForm, setSelectedForm] = useState(null);
  const [selectedFlag, setSelectedFlag] = useState(null);
  const [selectedValeurReferentiel, setSelectedValeurReferentiel] = useState(null);
  const [searchResults, setSearchResults] = useState([]);

   const [date, setDate] = useState('');
   const [time, setTime] = useState('');
   const [withAppointment, setWithAppointment] = useState('');
   const [status, setStatus] = useState('');
   const [typeInt, setTypeInt] = useState('');
   const [unit, setUnit] = useState('');
   const [afterDate, setAfterDate] = useState('');
   const [beforeDate, setBeforeDate] = useState('');
   const [downloadedAt, setDownloadedAt] = useState('');
   const [soldAt, setSoldAt] = useState('');
   const [startedAt, setStartedAt] = useState('');

  const columns = [
    {
      name: 'ID',
      selector: row => row.id,
      sortable: true,
    },
    {
      name: 'User ID',
      selector: row => row.user_id,
      sortable: true,
    },
    {
      name: 'Form ID',
      selector: row => row.form_id,
      sortable: true,
    },
    {name: 'Date',
        selector: row => row.date,
        sortable: true,
      },
      {
        name: 'Time',
        selector: row => row.time,
        sortable: true,
      },
      {
        name: 'With Appointment',
        selector: row => row.withAppointment ? 'Yes' : 'No',
        sortable: true,
      },
      {
        name: 'Status',
        selector: row => row.status,
        sortable: true,
      },
      {
        name: 'Flag ID',
        selector: row => row.flag_id,
        sortable: true, 
    },
        {
          name: 'Valeur Référentiels ID',
          selector: row => row.valeur_referentiels_id,
          sortable: true,
        }
      ];

  useEffect(() => {
    fetch('http://localhost:8000/api/forms')
      .then(response => response.json())
      .then(data => setForms(data.data.map(form => ({ value: form.id, label: form.name }))));
    
    fetch('http://localhost:8000/api/users')
      .then(response => response.json())
      .then(data => setUsers(data.map(user => ({ value: user.id, label: user.name }))));
    
    fetch('http://localhost:8000/api/flags')
      .then(response => response.json())
      .then(data => setFlags(data.map(flag => ({ value: flag.id, label: flag.name }))));
    
    fetch('http://localhost:8000/api/valeur_referentiels')
      .then(response => response.json())
      .then(data => setValeurReferentiels(data.map(valeur => ({ value: valeur.id, label: valeur.valeur }))));
  }, []);

   const handleSearch = () => {
    const queryParams = new URLSearchParams();

    if (status) {
        queryParams.append('status', status);
      }
      if (soldAt) {
        queryParams.append('sold_at', soldAt);
      }
      if (startedAt) {
        queryParams.append('started_at', startedAt);
      }
      if (beforeDate) {
        queryParams.append('beforeDate', beforeDate);
      }
      if (downloadedAt) {
        queryParams.append('downloaded_at', downloadedAt);
      }
      if (unit) {
        queryParams.append('unit', unit);
      }
      if (afterDate) {
        queryParams.append('afterDate', afterDate);
      }
      if (withAppointment) {
        queryParams.append('withAppointment', withAppointment ? "Yes" : "No");
      }
      if (date) {
        queryParams.append('date', date);
      }
      if (time) {
        queryParams.append('time', time);
      }
      if (typeInt) {
        queryParams.append('typeInt', typeInt);
      }

    if (selectedUser?.value) {
      queryParams.append('user', selectedUser.value);
    }
    if (selectedForm?.value) {
      queryParams.append('form', selectedForm.value);
    }
    if (selectedFlag?.value) {
      queryParams.append('flag', selectedFlag.value);
    }
    if (selectedValeurReferentiel?.value) {
      queryParams.append('valeur_referentiel', selectedValeurReferentiel.value);
    }
    
    const queryString = queryParams.toString();

    console.log(queryString);
    fetch(`http://localhost:8000/api/searchIntervention?${queryString}`)
    .then(response => response.json()) // Convertir la réponse en JSON
    .then(data => {
      console.log(data.data); // Assurez-vous que cette structure correspond à ce que l'API renvoie
      setSearchResults(data.data); // Utilisez data.data ici si l'API renvoie un objet avec une propriété data
    })
      .catch(error => console.error('Error fetching search results:', error));
  };

    return (
      <Container className="search-intervention">
        <Row>
<Col className="general-info">
  <Form.Group>
    <Form.Label>Date:</Form.Label>
    <Form.Control type="date" value={date} onChange={(e) => setDate(e.target.value)} />
  </Form.Group>
  <Form.Group>
    <Form.Label>Time:</Form.Label>
    <Form.Control type="time" value={time} onChange={(e) => setTime(e.target.value)} isC />
  </Form.Group>
  <Form.Group>
    <Form.Label>With Appointment:</Form.Label>
    <Select
      value={withAppointment === "true" ? { value: "true", label: "Yes" } : { value: "false", label: "No" }}
      onChange={(selectedOption) => setWithAppointment(selectedOption.value)}
      options={[
        { value: "true", label: "Yes" },
        { value: "false", label: "No" }
      ]}
    />
  </Form.Group>
  <Form.Group>
    <Form.Label>Type:</Form.Label>
    <Form.Control type="text" value={typeInt} onChange={(e) => setTypeInt(e.target.value)} />
  </Form.Group>
  <Form.Group>
    <Form.Label>Unit:</Form.Label>
    <Form.Control type="text" value={unit} onChange={(e) => setUnit(e.target.value)} />
  </Form.Group>
  <Form.Group>
    <Form.Label>After Date:</Form.Label>
    <Form.Control type="date" value={afterDate} onChange={(e) => setAfterDate(e.target.value)} />
  </Form.Group>
  <Form.Group>
    <Form.Label>Before Date:</Form.Label>
    <Form.Control type="date" value={beforeDate} onChange={(e) => setBeforeDate(e.target.value)} />
  </Form.Group>
  <Form.Group>
    <Form.Label>Downloaded At:</Form.Label>
    <Form.Control type="date" value={downloadedAt} onChange={(e) => setDownloadedAt(e.target.value)} />
  </Form.Group>
  <Form.Group>
    <Form.Label>Sold At:</Form.Label>
    <Form.Control type="date" value={soldAt} onChange={(e) => setSoldAt(e.target.value)} />
  </Form.Group>
  <Form.Group>
    <Form.Label>Started At:</Form.Label>
    <Form.Control type="date" value={startedAt} onChange={(e) => setStartedAt(e.target.value)} />
  </Form.Group>
  <Form.Group>
    <Form.Label>Status:</Form.Label>
    <Select
      value={{ value: status, label: status.charAt(0).toUpperCase() + status.slice(1) }}
      onChange={(selectedOption) => setStatus(selectedOption.value)}
      options={[
        { value: "pending", label: "Pending" },
        { value: "completed", label: "Completed" },
        { value: "cancelled", label: "Cancelled" }
      ]}
    />
  </Form.Group>
</Col>
       
       
          <Col className="referential">
        <div>User ID: 
          <Select options={users} isClearable onChange={(selectedOption) => setSelectedUser(selectedOption)} />
        </div>
        <div>Form ID: 
          <Select options={forms} isClearable onChange={(selectedOption) => setSelectedForm(selectedOption)}/>
        </div>
        <div>Flag ID: 
          <Select options={flags} isClearable onChange={(selectedOption) => setSelectedFlag(selectedOption)}/>
        </div>
        <div>Valeur Référentiels ID: 
          <Select options={valeurReferentiels} isClearable onChange={(selectedOption) => setSelectedValeurReferentiel(selectedOption)}/>
        </div>
      </Col>
        </Row>

        <Row>
      <Col>
          <button className="btn btn-primary" type="button" onClick={handleSearch}>Search</button>
        </Col>
      </Row>

      <Row>
      <DataTable
        title="Search Results"
        columns={columns}
        data={searchResults}
        defaultSortFieldId={1}
        pagination
      />
        </Row>


      </Container>
    );
  }

export default SearchIntervention;