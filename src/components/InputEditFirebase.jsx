import { getDatabase, ref, onValue, get, update} from "firebase/database";
import React, { useContext, useEffect, useState } from 'react'

import {getUserInfo} from '../funcions/firebaseMethods.js'

// CSS and Bootstraps
import '../style.scss'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import {AiOutlineEdit} from 'react-icons/ai'

import {ConfigContext} from '../GlobalContext';

const InputEditFirebase = (props) => {
    const Globalconfig = useContext(ConfigContext)

    useEffect(() => {
    },[props.textValue])

    if(props.textValue === ""){
        return(
            <>
                <div id={props.id}>
                    <p className="hoverUnderline" id={props.id+"textEdit"} style={{display: props.textValue === "" ? "block" : "none",}} onClick={() => {
                        document.getElementById(props.id+"textEdit").style.display = "none"
                        document.getElementById(props.id+"textInput").style.display = "block"
                        document.getElementById(props.id+"textSubmit").style.display = "block"
                        document.getElementById(props.id+"textInput").focus()
                    }}>{props.editIcon} {props.inputText}</p>
                    <input id={props.id+"textInput"} type="text" placeholder='Add a bio' style={{display:'none'}}></input>
                    <Button id={props.id+"textSubmit"} variant="success" style={{display:'none'}} onClick={() => {
                        let obj = {}
                        // Push the bio to the database and update the user's info
                        obj[props.fireBaseObjKey] = document.getElementById(props.id+"textInput").value
                        update(ref(getDatabase(),props. fireBasePathToUpdate), obj)
                        getUserInfo(Globalconfig.UID, getDatabase(), Globalconfig.setUserData)
                        // document.getElementById(props.id+"textEdit").remove()
                        // document.getElementById(props.id+"textInput").remove()
                        // document.getElementById(props.id+"textSubmit").remove()
                    }}>Save</Button>
                </div>
            </>
        )
    }
    else{
        return(
            <div id={props.id}>
                <p>{props.children}</p>
            </div>
        )
    }
}

export default InputEditFirebase
