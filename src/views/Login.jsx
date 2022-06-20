import React, { useContext, useEffect, useState } from 'react'

import '../style.scss'
import fbLogo from "../media/fbLogo.png"
import fbWrittenLogo from "../media/facebookWrittenLogo.png"
import Fade from 'react-reveal/Fade';
import GlobalContext, {ConfigContext} from '../GlobalContext';
import {signInWithEmailAndPassword,createUserWithEmailAndPassword,getAuth} from "firebase/auth"

const LoginForm = () => {
    //Local state variables
    const [loginDisplay, setloginUpDisplay] = useState("block")
    const [signUpDisplay, setsignUpDisplay] = useState("none")

    const Globalconfig = useContext(ConfigContext)

    //Firebase Config
    const firebaseApp = Globalconfig.firebase
    const auth = getAuth(firebaseApp)
    auth.signOut()
    return(
        <>
            <div style={{display:loginDisplay}} id="loginForm">
                <img id="fbWrittenLogo" src={fbWrittenLogo}></img>
                <br></br>
                <input id="email" type="text" placeholder='Email address or phone number'></input>
                <br></br>
                <input id="password" type="password" placeholder='Password'></input>
                <br></br>
                <button id="loginBtn" onClick={() => {
                    const email = document.getElementById("email").value;
                    const password = document.getElementById("password").value;
                    // FireBase Login
                    signInWithEmailAndPassword(auth,email,password).catch(error => {
                        console.log(error)
                        Globalconfig.setAuthStatus(false)
                    })
                    auth.onAuthStateChanged(user => {
                        if(user){
                            Globalconfig.setAuthStatus(true)
                        }
                    })
                }}>Log In</button>
                <br></br>
                <a href="#">Forgotten password?</a>
                <p>Hello: {Globalconfig.authStatus.toString()}</p>
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