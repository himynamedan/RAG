import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Landing from './components/landing';
import Login from './components/auth/login';
import SignUp from './components/auth/signup';
import Chat from './components/chat';
import Navbar from './components/navbar';
import Admin from './components/admin';
import Credentials from './components/credentials';

import Uploadpdf from './components/uploadpdf';

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/credentials" element={<Credentials />} />

        <Route path="/uploadpdf" element={<Uploadpdf />} />
      </Routes>
    </div>
  );
}

export default App;
