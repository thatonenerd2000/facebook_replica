import React from 'react';
import ReactDOM from 'react-dom'


//Pages
import Login from "./views/Login.jsx"

const Main = () => {
  return(
    <>
      <Login/>
    </>
  )
}

ReactDOM.render(<Main/>, document.getElementById('root'));