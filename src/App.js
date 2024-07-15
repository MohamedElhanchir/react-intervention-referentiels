import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from 'react';
import Home from './components/Home/Home';
import Intervention from './components/Intervention/Intervention';
import FormList from './components/Form/FormList';
import EditForm from './components/Form/EditForm';
import SearchIntervention from './components/SearchIntervention/SearchIntervention';

function App() {
  const [currentRoute, setCurrentRoute] = useState()

  useEffect(() =>{
    setCurrentRoute(window.location.pathname.split('/')[1].toLocaleLowerCase())
  },[]) 
  return (
  
    <BrowserRouter>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/home">Vehicle</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link 
                onClick={() => setCurrentRoute('home')}
                className={`nav-link ${currentRoute === 'home' ? 'active' : ''}`} 
                to="/home">Home</Link>
              </li>
              <li className="nav-item">
                <Link
                onClick={() => setCurrentRoute('intervention')}
                className={`nav-link ${currentRoute === 'intervention' ? 'active' : ''}`} 
                to="/intervention">Intervention</Link>
              </li>

              <li className="nav-item">
                <Link
                onClick={() => setCurrentRoute('form')}
                className={`nav-link ${currentRoute === 'form' ? 'active' : ''}`} 
                to="/form">Form</Link>
              </li>

              <li className="nav-item">
                <Link
                onClick={() => setCurrentRoute('search-intervention')}
                className={`nav-link ${currentRoute === 'search-intervention' ? 'active' : ''}`} 
                to="/search-intervention">Search Intervention</Link>
              </li>

            </ul>
          </div>
        </div>
      </nav>
      <Routes>
        <Route path="/home" element={<Home />} /> 
        <Route path="/intervention" element={<Intervention />} />
        <Route path="/form" element={<FormList />} />
        <Route path="/edit-form/:id" element={<EditForm />} />
        <Route path="/search-intervention" element={<SearchIntervention />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;