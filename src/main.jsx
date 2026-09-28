import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App.jsx';
import '../tokens.css';
import './styles.css';

const root = document.getElementById('root');
const app = <App page={document.body.dataset.page} />;

if (root.hasChildNodes()) hydrateRoot(root, app);
else createRoot(root).render(app);
