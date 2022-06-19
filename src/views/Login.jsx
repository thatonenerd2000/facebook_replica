import React from 'react'

import '../style.scss'
import fbLogo from "../media/fbLogo.png"
import fbWrittenLogo from "../media/facebookWrittenLogo.png"

const LoginForm = () => {
    return(
        <>
            <div id="loginForm">
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
                <button id="createAcc">Create New Account</button>
            </div>
        </>
    )
}

const LoginHolder = () => {
    return(
        <>
            <img id="fbLogo" src={fbLogo}></img>
            <LoginForm/>
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