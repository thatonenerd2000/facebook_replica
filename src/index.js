import React, { useEffect,useContext } from 'react';
import ReactDOM from 'react-dom'
import GlobalContext from './GlobalContext.jsx';
import {ConfigContext} from './GlobalContext';
import { createRoot } from 'react-dom/client';
import { getDatabase } from "firebase/database";

import {
  BrowserRouter,
  Routes,
  Route,
  Link
} from "react-router-dom";

//Pages
import Login from "./views/Login.jsx"
import UserProfile from './views/UserProfile.jsx';


const Main = () => {
  return(
    <>
      <GlobalContext>
        <BrowserRouter>
          <Routes>
            <Route exact path="/" element={<Login/>}/>
            <Route exact path="/userprofile" element={<UserProfile />}/>
          </Routes>
        </BrowserRouter>
      </GlobalContext>
    </>
  )
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<Main/>);