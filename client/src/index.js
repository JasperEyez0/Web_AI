import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from 'react-router-dom';
import Home from './page/Home';
import Login from './page/Login';
import Profile from './page/Profile';

import { Provider } from "react-redux"
import { createStore } from "redux"
import rootReducer from './reducer/combineReduxer';

const store = createStore(rootReducer)

const router = createBrowserRouter(createRoutesFromElements(
  <Route element = {<App/>}>
    <Route path='/' element ={<Home/>}/>
    <Route path='/login' element ={<Login/>}/>
    <Route path='/profile' element ={<Profile/>}/>
  </Route>
  ))

  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <Provider store = { store } >
        <RouterProvider router = { router }/>
    </Provider>
  );

reportWebVitals();
