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

        // If cover photo was uploaded, update the user's info
        if(coverUrl !== ''){
            update(ref(getDatabase(),'users/' + Globalconfig.userData.UID), {cover_picture_url: coverUrl})
            Globalconfig.setUserData({...Globalconfig.userData, cover_picture_url: coverUrl})
        }
    },[Globalconfig.userData])
    

    if(isReady){
        return(
            <div id="ProPicAndCoverContainer">  
                <Container>
                    <input type="file" id="coverPhoto" hidden onChange={() => {
                        const file = document.getElementById("coverPhoto").files[0]
                        uploadImageAndgetUrl(getStorage(), file, Globalconfig.userProfile, setCoverUrl)
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
    
                    {/*Edit Profile Bio*/}
                    <p id="bioEdit" style={{display: Globalconfig.userData.bio === "" ? "block" : "none"}} onClick={() => {
                        document.getElementById("bioEdit").style.display = "none"
                        document.getElementById("bioInput").style.display = "block"
                        document.getElementById("bioSubmit").style.display = "block"
                        document.getElementById("bioInput").focus()
                    }}>Click to add a bio <AiOutlineEdit/></p>
                    <input id="bioInput" type="text" placeholder='Add a bio' style={{display:'none'}}></input>
                    <Button id="bioSubmit" variant="success" style={{display:'none'}} onClick={() => {
                        // Push the bio to the database and update the user's info
                        update(ref(getDatabase(),'users/' + Globalconfig.userData.UID), {bio: document.getElementById("bioInput").value})
                        document.getElementById("bioInput").style.display = "none"
                        document.getElementById("bioSubmit").style.display = "none"
                        Globalconfig.setUserData({...Globalconfig.userData, bio: document.getElementById("bioInput").value})
                    }}>Save</Button>
    
                    {/* User's bio */}
                    <p id="bio" style={{display: Globalconfig.userData.bio === "" ? "none" : "block"}}>"{Globalconfig.userData.bio}"</p>
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
                            <p id="instaAdd" style={{display: Globalconfig.userData.social.instagram.username === "" ? "block" : "none"}} onClick={() => {
                                document.getElementById("instaInput").style.display = "block"
                                document.getElementById("instaSubmit").style.display = "block"
                                document.getElementById("instaAdd").style.display = "none"
                                document.getElementById("instaInput").focus()
                            }}><AiOutlineInstagram style={{color:"#fccc63"}}/> Click to add instagram profile</p>

                            <input type="text" id="instaInput" placeholder="Add instagram profile" style={{display:"none"}}></input>
                            <Button id="instaSubmit" variant="success" style={{display: "none"}} onClick={() => {
                                // Push the instagram to the database and update the user's info
                                update(ref(getDatabase(),'users/' + Globalconfig.userData.UID + "/social/instagram/"), {username: document.getElementById("instaInput").value})
                                document.getElementById("instaInput").style.display = "none"
                                document.getElementById("instaSubmit").style.display = "none"
                            }
                            }>Save</Button>
                            <p id="insta" style={{display: Globalconfig.userData.social.instagram.username === "" ? "none" : "block"}}><AiOutlineInstagram/> {Globalconfig.userData.social.instagram.username}</p>

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

