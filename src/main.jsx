// frontend/src/main.jsx
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { SocketProvider } from './context/SocketContext';
import router from './router/router';
import './index.css';

const GOOGLE_CLIENT_ID = "466789411088-7mhqp8kuqknci97ime2rs6vf752bmfa4.apps.googleusercontent.com";

ReactDOM.createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <AuthProvider>
      <SocketProvider>
        <DataProvider>
          <RouterProvider router={router} />
        </DataProvider>
      </SocketProvider>
    </AuthProvider>
  </GoogleOAuthProvider>
);