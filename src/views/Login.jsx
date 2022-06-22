import React, { useContext, useEffect, useState } from 'react'

import '../style.scss'
import fbLogo from "../media/fbLogo.png"
import fbWrittenLogo from "../media/facebookWrittenLogo.png"
import ppic from "../media/ppic.png"

import Fade from 'react-reveal/Fade';
import {ConfigContext} from '../GlobalContext';
import {signInWithEmailAndPassword,createUserWithEmailAndPassword,getAuth} from "firebase/auth"
import { getDatabase, ref, set } from "firebase/database";
import { getStorage, uploadBytes, getDownloadURL } from "firebase/storage";
import {ref as sRef} from "firebase/storage"
import { useNavigate } from "react-router-dom";

import Toastify from 'toastify-js'
import "toastify-js/src/toastify.css"

const LoginForm = () => {
    //Local state variables
    // CSS
    const [loginDisplay, setloginUpDisplay] = useState("block")
    const [signUpDisplay, setsignUpDisplay] = useState("none")
    const [proPicRadius, setProPicRadius] = useState(0)
    
    const [proPic, setProPic] = useState(ppic)
    const Globalconfig = useContext(ConfigContext)

    //Firebase Config
    const firebaseApp = Globalconfig.firebase
    const auth = getAuth(firebaseApp)
    const db = getDatabase ()

    //React Router
    const navigate = useNavigate()
    auth.signOut()

    useEffect(() => {
        if(Globalconfig.authStatus === true){
            navigate("/userprofile")
        }
    },[Globalconfig.authStatus,Globalconfig.userId])

    return(
        <>
            <img id="fbLogo" src={fbLogo}></img>
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
                        Globalconfig.setAuthStatus(false)
                        Toastify({
                            text: "Login failed, Please check your credentials",
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
                            Globalconfig.setUserID(user.uid)
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
                            }).showToast()
                        }
                    })
                }}>Log In</button>
                <br></br>
                <a href="#">Forgotten password?</a>
                <hr></hr>
                <br></br>
                <button id="createAcc" onClick={() => {setloginUpDisplay("none"); setsignUpDisplay("block");}}>Create New Account</button>
            </div>

            <div style={{display:signUpDisplay}} id="signupform">
                <img id="proPic" src={proPic} style={{borderRadius:proPicRadius, border:"5px solid black"}}></img>
                <br></br>
                <br></br>
                <label style={{margin:"10px"}} htmlFor="proPic">Select a profile pictture</label>
                <br></br>
                <input type="file" style={{height:"inherit"}} name="proPic" id="proUpload" onChange={(img)=>{
                    if (!img.target.files || img.target.files.length === 0) {
                        setProPic("")
                    }
                    else{
                        setProPic(URL.createObjectURL(img.target.files[0]))
                    }

                    setProPicRadius('100%')

                }}></input>
                <br></br>
                <input type="text" id="fName" placeholder='First Name'></input>
                <input type="text" id="lName" placeholder='Last Name'></input>
                <br></br>
                <input id="emailSignUp" style={{width:'31.3vw'}} type="text" placeholder='Email address'></input>
                <br></br>
                <input id="passwordSignUp" style={{width:'31.3vw'}} type="password" placeholder='Password'></input>
                <br></br>
                <input id="dob" style={{width:'31.3vw'}} type="text" placeholder="Birthday: MM/DD/YYYY" onFocus={e => (e.target.type = "date")} onBlur={e => (e.target.type = "text")}></input>
                <br></br>
                <button id="SignUp" onClick={()=>{
                    const fName = document.getElementById("fName").value.toLowerCase()
                    const lName = document.getElementById("lName").value.toLowerCase()
                    const email = document.getElementById("emailSignUp").value
                    const password = document.getElementById("passwordSignUp").value
                    const dob = document.getElementById("dob").value
                    let proPic = document.getElementById("proUpload").files[0]
                    let uid = ""

                    // Firebase Sign Up
                    createUserWithEmailAndPassword(auth,email,password).then(userInfo => {
                        uid = userInfo.user.uid

                        // Profile Picture upload to fireStore
                        const storage = getStorage(firebaseApp);
                        const imgRef = sRef(storage, 'users/'+uid+"/profile_pictures/"+document.getElementById("proUpload").files[0].name)
                        uploadBytes(imgRef,proPic).then(snap => {
                            getDownloadURL(sRef(getStorage(),'users/'+uid+"/profile_pictures/"+document.getElementById("proUpload").files[0].name)).then(url => {
                                proPic = url.toString();
                                console.log(proPic)
                                let user = {
                                    UID: userInfo.user.uid,
                                    first_name: fName,
                                    last_name: lName,
                                    email: email,
                                    DOB: dob,
                                    profile_picture: proPic,
                                }

                                // Push the data to firebase database
                                set(ref(db, 'users/'+userInfo.user.uid),user)

                                //Toast Success
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
                                Globalconfig.setUserID(uid)
                                Globalconfig.setAuthStatus(true)
                            })
                        })
                    })
                }}>Sign Up</button>
                <button id="loginBtnBack" onClick={() => {setloginUpDisplay("block"); setsignUpDisplay("none");}}>Back to Login</button>
            </div>
        </>
    )
}

const LoginHolder = () => {
    return(
        <>
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