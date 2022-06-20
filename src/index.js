import React, { useEffect } from 'react';
import ReactDOM from 'react-dom'
import GlobalContext from './GlobalContext.jsx';
import { createRoot } from 'react-dom/client';

//Pages
import Login from "./views/Login.jsx"

const Main = () => {
  return(
    <>
      <GlobalContext>
        <Login/>
      </GlobalContext>
    </>
  )
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<Main/>);