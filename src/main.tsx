
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './components/map/mapStyles.css'
import { TooltipProvider } from '@radix-ui/react-tooltip'

createRoot(document.getElementById("root")!).render(
  <TooltipProvider>
    <App />
  </TooltipProvider>
);
