import React, { useContext, useEffect, useState } from 'react'

import '../style.scss'
import fbLogo from "../media/fbLogo.png"
import fbWrittenLogo from "../media/facebookWrittenLogo.png"
import Fade from 'react-reveal/Fade';
import GlobalContext, {ConfigContext} from '../GlobalContext';
import {signInWithEmailAndPassword,createUserWithEmailAndPassword,getAuth} from "firebase/auth"
import { getDatabase, ref, set } from "firebase/database";
import Toastify from 'toastify-js'
import "toastify-js/src/toastify.css"

const LoginForm = () => {
    //Local state variables
    const [loginDisplay, setloginUpDisplay] = useState("block")
    const [signUpDisplay, setsignUpDisplay] = useState("none")

    const Globalconfig = useContext(ConfigContext)

    //Firebase Config
    const firebaseApp = Globalconfig.firebase
    const auth = getAuth(firebaseApp)
    const db = getDatabase ()

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
                        Toastify({
                            text: "Something went wrong, Please check your credentials",
                            duration: 5000,
                            close: true,
                            gravity: "top", // `top` or `bottom`
                            position: "center", // `left`, `center` or `right`
                            stopOnFocus: true, // Prevents dismissing of toast on hover
                            style: {
                              background: "linear-gradient(to right, #880808, #EE4B2B)",
                            },
                        }).showToast();
                    })
                    auth.onAuthStateChanged(user => {
                        if(user){
                            Globalconfig.setAuthStatus(true)
                            Toastify({
                                text: "Log in Success!",
                                duration: 5000,
                                close: true,
                                gravity: "top", // `top` or `bottom`
                                position: "center", // `left`, `center` or `right`
                                stopOnFocus: true, // Prevents dismissing of toast on hover
                                style: {
                                  background: "linear-gradient(to right, #00b09b, #96c93d)",
                                },
                            }).showToast();
                        }
                    })
                }}>Log In</button>
                <br></br>
                <a href="#">Forgotten password?</a>
                <hr></hr>
                <br></br>
                <button id="createAcc" onClick={() => {setloginUpDisplay("none"); setsignUpDisplay("block")}}>Create New Account</button>
            </div>

            <div style={{display:signUpDisplay}} id="signupform">
                <img id="fbWrittenLogo" src={fbWrittenLogo}></img>
                <br></br>
                <input type="text" id="fName" placeholder='First Name'></input>
                <input type="text" id="lName" placeholder='Last Name'></input>
                <br></br>
                <input id="emailSignUp" style={{width:'423px'}} type="text" placeholder='Email address'></input>
                <br></br>
                <input id="passwordSignUp" style={{width:'423px'}} type="password" placeholder='Password'></input>
                <br></br>
                <input id="dob" style={{width:'423px'}} type="text" placeholder="Birthday: MM/DD/YYYY" onFocus={e => (e.target.type = "date")} onBlur={e => (e.target.type = "text")}></input>
                <br></br>
                <button id="SignUp" onClick={()=>{
                    const fName = document.getElementById("fName").value
                    const lName = document.getElementById("lName").value
                    const email = document.getElementById("emailSignUp").value
                    const password = document.getElementById("passwordSignUp").value
                    const dob = document.getElementById("dob").value
                    // Firebase Sign Up
                    createUserWithEmailAndPassword(auth,email,password).then(userInfo => {
                        let user = {
                            UID: userInfo.user.uid,
                            first_name: fName,
                            last_name: lName,
                            email: email,
                            DOB: dob,
                            profile_picture: ""
                        }
                        set(ref(db,'users/' + email.substring(0,email.lastIndexOf('@'))+dob),user)
                        Toastify({
                            text: "Sign up Success!",
                            duration: 5000,
                            close: true,
                            gravity: "top", // `top` or `bottom`
                            position: "center", // `left`, `center` or `right`
                            stopOnFocus: true, // Prevents dismissing of toast on hover
                            style: {
                              background: "linear-gradient(to right, #1877f2, ##95bcf0)",
                            },
                        }).showToast();
                    })
                }}>Sign Up</button>
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