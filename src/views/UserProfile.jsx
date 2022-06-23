import React, { useContext, useEffect, useState } from 'react'
import { getDatabase, ref, onValue, get, update} from "firebase/database";
import { getStorage } from "firebase/storage";

import '../style.scss'
import Container from 'react-bootstrap/Container';
import {FaUpload} from 'react-icons/fa'
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

    },[coverUrl])
    

    return(
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

            <img src={userInfo.profile_picture} id="userProfilePicture"></img>
        </Container>
    )
    
}

export default ProPicAndCover

