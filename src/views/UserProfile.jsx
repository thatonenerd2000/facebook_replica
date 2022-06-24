import React, { useContext, useEffect, useState } from 'react'
import { getDatabase, ref, onValue, get, update} from "firebase/database";
import { getStorage } from "firebase/storage";

// CSS and Bootstraps
import '../style.scss'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';

// Icons
import {FaUpload} from 'react-icons/fa'
import {AiOutlineEdit} from 'react-icons/ai'
import {ConfigContext} from '../GlobalContext';

import {getUserInfo, uploadImageAndgetUrl, writeData} from '../funcions/firebaseMethods.js'


const ProPicAndCover = () => {
    const Globalconfig = useContext(ConfigContext)
    const [userInfo, setUserInfo] = useState({}) 
    const [coverUrl, setCoverUrl] = useState('')
    
    useEffect(() => {
        getUserInfo(Globalconfig.userProfile, getDatabase(), setUserInfo);

        // If cover photo was uploaded, update the user's info
        if(coverUrl !== ''){
            update(ref(getDatabase(),'users/' + userInfo.UID), {cover_picture_url: coverUrl})
            setUserInfo({...userInfo, cover_picture_url: coverUrl})
        }

        //If bio was updated, update the user's info
        if(userInfo.bio !== ''){
            setUserInfo({...userInfo, bio: userInfo.bio})
        }

    },[coverUrl])
    

    return(
        <>  
            <Container>
                <input type="file" id="coverPhoto" hidden onChange={() => {
                    const file = document.getElementById("coverPhoto").files[0]
                    uploadImageAndgetUrl(getStorage(), file, Globalconfig.userProfile, setCoverUrl)
                }}></input>
                
                {/* Code block to display if the user doo't have a cover photo */}
                <div id="coverPic" style={{display: userInfo.cover_picture_url === '' ? 'block' : 'none'}}>
                    <div id="coverText" onClick={() => {
                        document.getElementById("coverPhoto").click()
                    }}>
                        <h2>Selct a cover photo</h2>
                        <FaUpload/>
                    </div>
                </div>

                {/* Code block to display if the user have a cover photo */}
                <img src={userInfo.cover_picture_url} id="coverPic" style={{display: userInfo.cover_picture_url === '' ? 'none' : 'block'}}></img>

                {/*Profile Picture*/}
                <img src={userInfo.profile_picture} id="userProfilePicture"></img>
                <h2 id="username">{userInfo.first_name} {userInfo.last_name}</h2>

                {/*Edit Profile Bio*/}
                <p id="bioEdit" style={{display: userInfo.bio === "" ? "block" : "none"}} onClick={() => {
                    document.getElementById("bioEdit").style.display = "none"
                    document.getElementById("bioInput").style.display = "block"
                    document.getElementById("bioSubmit").style.display = "block"
                    document.getElementById("bioInput").focus()
                }}>Click to add a bio <AiOutlineEdit/></p>
                <input id="bioInput" type="text" placeholder='Add a bio' style={{display:'none'}}></input>
                <Button id="bioSubmit" variant="success" style={{display:'none'}} onClick={() => {
                    // Push the bio to the database and update the user's info
                    update(ref(getDatabase(),'users/' + userInfo.UID), {bio: document.getElementById("bioInput").value})
                    document.getElementById("bioInput").style.display = "none"
                    document.getElementById("bioSubmit").style.display = "none"
                }}>Save</Button>

                {/* User's bio */}
                <p id="bio" style={{display: userInfo.bio === "" ? "none" : "block"}}>"{userInfo.bio}"</p>
            </Container>
        </>
    )
    
}

const UserProfile = () => {
    return(
        <>
            <ProPicAndCover/>
        </>
    )
}

export default UserProfile

