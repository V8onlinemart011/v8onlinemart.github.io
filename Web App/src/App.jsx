import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import { AppRoutes } from './routes/AppRoutes';

export function App() {
  return (
    <StoreProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <AppRoutes />
      </BrowserRouter>
    </StoreProvider>
  );
}

export default App;
