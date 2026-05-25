import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './fields/index.js';
import { registerRuntimeCustomFieldComponents } from '../../shared/fields/customFields.js';
import App from './App.js';

registerRuntimeCustomFieldComponents();

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('Root element not found');

createRoot(rootEl).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
