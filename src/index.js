import React, { useEffect } from 'react';
import ReactDOM from 'react-dom'
import GlobalContext from './GlobalContext.jsx';

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

ReactDOM.render(<Main/>, document.getElementById('root'));