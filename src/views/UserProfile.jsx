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
import {AiOutlineEdit, AiOutlineInstagram, AiOutlineHome, AiOutlineFileImage} from 'react-icons/ai'
import {GoLocation} from 'react-icons/go'

import {ConfigContext} from '../GlobalContext';

// Components
import InputEditFirebase from '../components/InputEditFirebase';
import MakeAPost from '../components/MakeAPost';
import Post from '../components/Post';

import {getUserInfo, uploadImageAndgetUrl, writeData, updateData, makeAPost} from '../funcions/firebaseMethods.js'


const ProPicAndCover = () => {
    const Globalconfig = useContext(ConfigContext)
    const [coverUrl, setCoverUrl] = useState('')
    const [isReady, setIsReady] = useState(false)

    const db = Globalconfig.db
    const storage = Globalconfig.storage
    
    useEffect(() => {
        // Wait for data to load
        if(Globalconfig.userData !== ""){
            setIsReady(true)
        }

        if(coverUrl !== "" && Globalconfig.userData.cover_picture_url === ""){
            document.getElementById("coverSubmit").style.display = "block"
        }
    },[Globalconfig.userData,coverUrl])

    const handleDataChange = () => {getUserInfo(Globalconfig.UID, db, Globalconfig.setUserData)}    

    if(isReady){
        return(
            <div id="ProPicAndCoverContainer">  
                <Container>
                    {/* Code block to display if the user don't have a cover photo */}
                    <input type="file" id="coverPhoto" hidden onChange={() => {
                        const file = document.getElementById("coverPhoto").files[0]
                        uploadImageAndgetUrl(storage, file, Globalconfig.UID, 'users/' + Globalconfig.UID + '/cover_picture/', file.name, setCoverUrl)
                        document.getElementById("coverSelectText").innerHTML = file.name
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
                            update(ref(db,'users/' + Globalconfig.userData.UID), {cover_picture_url: coverUrl})
                            getUserInfo(Globalconfig.UID, db, Globalconfig.setUserData)
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

    const db = Globalconfig.db
    const storage = Globalconfig.storage

    const posts = Globalconfig.userData.posts
    const [postKeys, setPostKeys] = useState([])

    useEffect(() => {
        // Wait for data to load
        if(Globalconfig.userData !== ""){
            setIsReady(true)
            if(posts !== ""){
                setPostKeys(Object.keys(posts.post_array))
            }
        }
    },[Globalconfig.userData])

    if(isReady){
        return (
            <>
            <MakeAPost/>
                <Container id="userFeedContainer">
                    <Row id="userFeedCol">
                        <Col style={{height:"fit-content"}} xs={{span: 3}} id="userFeedUserInfo">
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
                                <img className="statusProPic" src={Globalconfig.userData.profile_picture}></img><input type="text" placeholder="What's on your mind?" id="statusInput" onFocus={()=>{
                                    Globalconfig.setMakeAPost(true)
                                }}></input>
                                <hr></hr>
                                <Button className="status_types" style={{backgroundColor:"transparent", border:"0px"}}><AiOutlineFileImage style={{color:"#36e622"}}/> Photo</Button>
                                <Button className="status_types" style={{backgroundColor:"transparent", border:"0px"}}><GoLocation style={{color:"#4DB7D9"}}/> Location</Button>
                            </div>
                                <br></br>
                            {/*User posts*/}
                            <div id="userPostsLabel">
                                <h5>Posts</h5>
                            </div>
                            <br></br>
                            <div id="userPosts">
                                {postKeys.map((key) => {
                                    return(
                                        <Post postKey={key} key={key}/>
                                    )
                                })}
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

