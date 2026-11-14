import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/global.css';
import './styles/animations.css';
import './styles/ui.css';
import './styles/hero.css';
import './styles/sections.css';
import './styles/birthday.css';
import './styles/polish.css';
import './styles/vault.css';
import './styles/premium.css';
import './styles/extras.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);