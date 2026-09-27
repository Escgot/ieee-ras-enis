import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from 'next-themes'
import '@fontsource/syne/700.css';
import '@fontsource/syne/800.css';
import '@fontsource/syne';
import '@fontsource/manrope/400.css';
import '@fontsource/manrope/500.css';
import '@fontsource/manrope/600.css';
import '@fontsource/manrope/700.css';
import '@fontsource/manrope';
import '@fontsource/jetbrains-mono';
import './index.css'
import App from './App.tsx'

// Suppress the React 19 + next-themes warning
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  const orig = console.error;
  console.error = (...args) => {
    if (typeof args[0] === 'string' && args[0].includes('Encountered a script tag')) {
      return;
    }
    orig.apply(console, args);
  };
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <App />
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
