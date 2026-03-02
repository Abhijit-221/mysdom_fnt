import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';


export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: "10px",
            padding: "16px",
            fontSize: "14px"
          }
        }}
      />
        <AppRoutes />
      </BrowserRouter>
     </AuthProvider>
  );
}
