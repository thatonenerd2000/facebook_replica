import React, { useState } from 'react'

import '../style.scss'
import fbLogo from "../media/fbLogo.png"
import fbWrittenLogo from "../media/facebookWrittenLogo.png"
import Fade from 'react-reveal/Fade';


const LoginForm = () => {
    const [loginDisplay, setloginUpDisplay] = useState("block")
    const [signUpDisplay, setsignUpDisplay] = useState("none")
    return(
        <>
            <div style={{display:loginDisplay}} id="loginForm">
                <img id="fbWrittenLogo" src={fbWrittenLogo}></img>
                <br></br>
                <input type="text" placeholder='Email address or phone number'></input>
                <br></br>
                <input type="password" placeholder='Password'></input>
                <br></br>
                <button id="loginBtn">Log In</button>
                <br></br>
                <a href="#">Forgotten password?</a>
                <hr></hr>
                <br></br>
                <button id="createAcc" onClick={() => {setloginUpDisplay("none"); setsignUpDisplay("block")}}>Create New Account</button>
            </div>

            <div style={{display:signUpDisplay}} id="signupform">
                <img id="fbWrittenLogo" src={fbWrittenLogo}></img>
                <br></br>
                <input type="text" placeholder='First Name'></input>
                <input type="text" placeholder='Last Name'></input>
                <br></br>
                <input style={{width:'423px'}} type="text" placeholder='Email address'></input>
                <br></br>
                <input style={{width:'423px'}} type="password" placeholder='Password'></input>
                <br></br>
                <input style={{width:'423px'}} type="text" placeholder="Birthday: MM/DD/YYYY" onFocus={e => (e.target.type = "date")} onBlur={e => (e.target.type = "text")}></input>
                <br></br>
                <button id="SignUp">Sign Up</button>
                <button id="loginBtnBack" onClick={() => {setloginUpDisplay("block"); setsignUpDisplay("none")}}>Back to Login</button>
            </div>
        </>
    )
}

const LoginHolder = () => {
    return(
        <>
            <img id="fbLogo" src={fbLogo}></img>
            <Fade>
                <LoginForm/>
            </Fade>
        </>
    )
}

export default function Login(){
    return(
        <div id="Login">
            <LoginHolder/>
        </div>
    )
}