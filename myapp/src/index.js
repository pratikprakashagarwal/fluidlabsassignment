import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './auth/login/Login';
import CreateProduct from './portal/home/createProduct';
import Auth from './auth/Auth';
import App from './App';
import ProtectedRoute from './util/ProtectedRoute';
import Home from './portal/home/Home';
import Register from './register';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
<BrowserRouter basename={'/'}>
    <Routes>
        <Route path='/auth' element={<Auth />}>
            <Route path='login' element={<Login />} />
        </Route>
        <Route path='/auth' element={<Auth />}>
        <Route path='register' element={<Register />}>
        </Route>
        
        </Route>
        <Route path="/" element={<App />}>
            <Route path='' element={
                <ProtectedRoute>
                    <Home />
                </ProtectedRoute>
            } />
            <Route path='createproduct' element={
                <ProtectedRoute>
                    <CreateProduct />
                </ProtectedRoute>
            } />
        </Route>
    </Routes>
</BrowserRouter>
  
);