import React from 'react'
import {BrowserRouter as Router,Routes,Route,NavLink} from 'react-router-dom'
import Home from './component/home';
import Login from './component/login';
import Menu from './component/menu';
import Pnf from './component/pnf';
import Register from './component/register';

import {ToastContainer,} from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"; 

function App() {
  return (
  <Router>
    <Menu/>
    <ToastContainer autoClose={2000} position={"top-right"}/>
    <Routes>
      <Route path={`/`} element={<Home/>}/>
      <Route path={`/home`} element={<Home/>}/>
      <Route path={`/login`} element={<Login/>}/>
      <Route path={`/register`} element={<Register/>}/>
      <Route path={`/*`} element={<Pnf/>}/>
      
    </Routes>
  </Router>
  
  );
}

export default App;
