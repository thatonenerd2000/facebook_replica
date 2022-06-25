import React, { useContext, useEffect, useState } from 'react'
import { getDatabase, ref, onValue, get, update} from "firebase/database";
import { getStorage } from "firebase/storage";

// CSS and Bootstraps
import '../style.scss'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';

// Icons
import {FaUpload} from 'react-icons/fa'
import {AiOutlineEdit, AiOutlineInstagram} from 'react-icons/ai'
import {ConfigContext} from '../GlobalContext';

// Components
import InputEditFirebase from '../components/InputEditFirebase';


import {getUserInfo, uploadImageAndgetUrl, writeData} from '../funcions/firebaseMethods.js'


const ProPicAndCover = () => {
    const Globalconfig = useContext(ConfigContext)
    const [coverUrl, setCoverUrl] = useState('')
    const [isReady, setIsReady] = useState(false)
    
    useEffect(() => {
        // Wait for data to load
        if(Globalconfig.userData !== ""){
            setIsReady(true)
        }

        if(coverUrl !== ""){
            update(ref(getDatabase(),'users/' + Globalconfig.userData.UID), {cover_picture_url: coverUrl})
            getUserInfo(Globalconfig.UID, getDatabase(), Globalconfig.setUserData)
        }

    },[Globalconfig.userData])
    

    if(isReady){
        return(
            <div id="ProPicAndCoverContainer">  
                <Container>
                    <input type="file" id="coverPhoto" hidden onChange={() => {
                        const file = document.getElementById("coverPhoto").files[0]
                        uploadImageAndgetUrl(getStorage(), file, Globalconfig.UID, setCoverUrl)
                        console.log(coverUrl)
                    }}></input>
                    
                    {/* Code block to display if the user doo't have a cover photo */}
                    <div id="coverPic" style={{display: Globalconfig.userData.cover_picture_url === '' ? 'block' : 'none'}}>
                        <div id="coverText" onClick={() => {
                            document.getElementById("coverPhoto").click()
                        }}>
                            <h2>Selct a cover photo</h2>
                            <FaUpload/>
                        </div>
                    </div>
    
                    {/* Code block to display if the user have a cover photo */}
                    <img src={Globalconfig.userData.cover_picture_url} id="coverPic" style={{display: Globalconfig.userData.cover_picture_url === '' ? 'none' : 'block'}}></img>
    
                    {/*Profile Picture*/}
                    <img src={Globalconfig.userData.profile_picture} id="userProfilePicture"></img>
                    <h2 id="username">{Globalconfig.userData.first_name} {Globalconfig.userData.last_name}</h2>
                    
                    {/* User Bio */}
                    <InputEditFirebase editIcon={<AiOutlineEdit/>} fireBaseObjKey="bio" fireBasePathToUpdate={"users/"+Globalconfig.userData.UID} id="bio" textValue={Globalconfig.userData.bio} inputText={"Click to add bio"} uid={Globalconfig.userData.UID}>"{Globalconfig.userData.bio}"</InputEditFirebase>
                </Container>
            </div>
        )
    }

    else{
        return(
            <div className="loader">
                <div className="lds-circle"><div></div></div>
            </div>
        )
    }
    
}

const UserFeed = () => {
    const Globalconfig = useContext(ConfigContext)
    const [isReady, setIsReady] = useState(false)

    useEffect(() => {
        // Wait for data to load
        if(Globalconfig.userData !== ""){
            setIsReady(true)
        }
    },[Globalconfig.userData])

    if(isReady){
        return (
            <>
                <Container id="userFeedContainer">
                    <Row id="userFeedCol">
                        <Col xs={{span: 3}} id="userFeedUserInfo">
                            <h4>About You</h4>
                            <hr></hr>
                            <p>Birthday: {new Date(Globalconfig.userData.DOB).toUTCString().slice(4,16)}</p>

                            {/*Instagram*/}
                            <InputEditFirebase editIcon={<AiOutlineInstagram/>} fireBaseObjKey="username" fireBasePathToUpdate={"users/"+Globalconfig.userData.UID+"/social/instagram"} id="instaBio" textValue={Globalconfig.userData.social.instagram.username} inputText={"Click to add instagram profile"} uid={Globalconfig.userData.UID}><AiOutlineInstagram/> {Globalconfig.userData.social.instagram.username}</InputEditFirebase>


                            {/*From*/}
                            <p id="fromAdd" style={{display: Globalconfig.userData.from === "" ? "block" : "none"}} onClick={() => {
                                document.getElementById("fromInput").style.display = "block"
                                document.getElementById("fromSubmit").style.display = "block"
                                document.getElementById("fromAdd").style.display = "none"
                                document.getElementById("fromInput").focus()
                            }
                            }>Click to add your from</p>
                            <input type="text" id="fromInput" placeholder="Add your from" style={{display:"none"}}></input>
                            <Button id="fromSubmit" variant="success" style={{display: "none"}} onClick={() => {
                                // Push the from to the database and update the user's info
                                update(ref(getDatabase(),'users/' + Globalconfig.userData.UID + "/from/"), {from: document.getElementById("fromInput").value})
                                document.getElementById("fromInput").style.display = "none"
                                document.getElementById("fromSubmit").style.display = "none"
                            }
                            }>Save</Button>
                            <p id="from" style={{display: Globalconfig.userData.from === "" ? "none" : "block"}}>From: {Globalconfig.userData.from}</p>
                        </Col>
                        <Col xs={{span:8, offset:1}} id="userFeedInfo">
                            hi
                        </Col>
                    </Row>
                </Container> 
            </>
        )
    }

    else{
        return(
            <div className="loader">
                <div className="lds-circle"><div></div></div>
            </div>
        )
    }
}

const UserProfile = () => {
    return(
        <div id="userProfileContainer">
            <ProPicAndCover/>
            <UserFeed/>
        </div>
    )
}

export default UserProfile

