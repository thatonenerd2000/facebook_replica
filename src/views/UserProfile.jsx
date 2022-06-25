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
import {AiOutlineEdit, AiOutlineInstagram, AiOutlineHome} from 'react-icons/ai'

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
    },[Globalconfig.userData])
    

    if(isReady){
        return(
            <div id="ProPicAndCoverContainer">  
                <Container>
                    {/* Code block to display if the user don't have a cover photo */}
                    <input type="file" id="coverPhoto" hidden onChange={() => {
                        const file = document.getElementById("coverPhoto").files[0]
                        uploadImageAndgetUrl(getStorage(), file, Globalconfig.UID, setCoverUrl)
                        document.getElementById("coverSelectText").innerHTML = file.name
                        document.getElementById("coverSubmit").style.display = "block"
                    }}></input>
                    
                    <div id="coverPicUpload" style={{display: Globalconfig.userData.cover_picture_url === '' ? 'block' : 'none'}}>
                        <div id="coverText" onClick={() => {
                            document.getElementById("coverPhoto").click()
                        }}>
                            <h2 id="coverSelectText">Selct a cover photo</h2>
                            <FaUpload/>
                            <br></br>
                        </div>
                        <Button id="coverSubmit" variant='success' style={{display:"none"}} onClick={() => {
                            update(ref(getDatabase(),'users/' + Globalconfig.userData.UID), {cover_picture_url: coverUrl})
                            getUserInfo(Globalconfig.UID, getDatabase(), Globalconfig.setUserData)
                            document.getElementById("coverPicUpload").remove()
                        }}>Upload</Button>
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
                            <InputEditFirebase editIcon={<AiOutlineHome/>} fireBaseObjKey="location" fireBasePathToUpdate={"users/"+Globalconfig.userData.UID} id="location" textValue={Globalconfig.userData.location} inputText={"Click to add where you are from"} uid={Globalconfig.userData.UID}><AiOutlineHome/> {Globalconfig.userData.location}</InputEditFirebase>
                        </Col>
                        <Col xs={{span:8, offset:1}} id="userFeedInfo">
                            <div id="status">
                                <img id="statusProPic" src={Globalconfig.userData.profile_picture}></img><input type="text" placeholder="What's on your mind?" id="statusInput"></input>
                            </div>
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

