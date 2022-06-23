import React, { useContext, useEffect, useState } from 'react'
import { getDatabase, ref, onValue, get } from "firebase/database";

import '../style.scss'
import {ConfigContext} from '../GlobalContext';

import {getUserInfo} from '../funcions/firebaseMethods.js'

const ProPicAndCover = () => {
    const Globalconfig = useContext(ConfigContext)
    const [userInfo, setUserInfo] = useState({}) 
    useEffect(() => {
        getUserInfo(Globalconfig.userProfile,getDatabase(),setUserInfo)
        console.log(userInfo)
    },[])

    return(
        <>
            <button onClick={()=>{}}>Test It</button>
            <h1>{userInfo.first_name} {userInfo.last_name}'s profile page</h1>
            <img id="userProfilePicture" src={userInfo.profile_picture}></img>
        </>
    )
}

export default ProPicAndCover

