import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; 

function Home() {
  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-header">
          Bienvenue
        </div>
        <div className="card-body">
          <h5 className="card-title">Page d'accueil</h5>
          <p className="card-text">Gestion d'intervention</p>
        </div>
      </div>
    </div>
  )
}

export default Home;