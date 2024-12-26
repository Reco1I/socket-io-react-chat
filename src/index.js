import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// Importamos nuestro componente Chat para usarlo en nuestra página principal (index.js)
import Chat from "./Chat";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <Chat />
  </React.StrictMode>
);
