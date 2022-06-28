import {ref, onValue, set, update} from "firebase/database";
import { getStorage, uploadBytes, ref as sRef, getDownloadURL } from "firebase/storage";

import {ConfigContext} from '../GlobalContext';

import React, { useContext, useEffect, useState } from 'react'

import {getUserInfo, uploadImageAndgetUrl, writeData, updateData, makeAPost} from '../funcions/firebaseMethods.js'


// Bootstrap and Icons
import Button from 'react-bootstrap/Button';
import {AiOutlineFileImage, AiOutlineSmile} from 'react-icons/ai'
import {GoLocation} from 'react-icons/go'

const MakeAPost = (props) => {
    const Globalconfig = useContext(ConfigContext)
    const [isReady, setIsReady] = useState(false)
    const [img, setImg] = useState('')

    const db = Globalconfig.db
    const storage = Globalconfig.storage

    useEffect(() => {
        // Wait for data to load
        if(Globalconfig.userData !== ""){
            setIsReady(true)
        }

        if(Globalconfig.postBox === true){
                window.scrollTo(0, 0);
                document.getElementsByTagName('html')[0].style.overflow = "hidden"
        }

        if(Globalconfig.postBox === false){
            document.getElementsByTagName('html')[0].style.overflow = "auto"
        }
    },[Globalconfig.userData,Globalconfig.postBox])

    if(isReady && Globalconfig.postBox){
        return (
            <>
                <div id="postOverlay" onClick={()=>{
                    document.getElementById("postOverlay").style.display = "none"
                    Globalconfig.setMakeAPost(false)
                }}></div>
                <div id="makeAPost">
                    <img className="statusProPic" src={Globalconfig.userData.profile_picture}></img> <h5 style={{color:"white", display:"inline"}}>{Globalconfig.userData.first_name} {Globalconfig.userData.last_name}</h5>
                    <br></br>
                    <textarea rows={4} id="postInput" type="text" placeholder="What's on your mind?" style={{resize:"none"}}></textarea>
                    <input type="file" id="postImageInput" style={{display:"none"}} onChange={()=>{
                        const file = document.getElementById("postImageInput").files[0]
                        document.getElementById("postImagePreview").src = URL.createObjectURL(file)
                        document.getElementById("postImagePreview").style.display = "block"
                        document.getElementById("postImage").style.display = "none"
                        uploadImageAndgetUrl(Globalconfig.storage, file, Globalconfig.UID, 'users/' + Globalconfig.UID + '/posts/', Globalconfig.UID+"_"+Globalconfig.userData.posts.count, setImg)

                    }}></input>
                    <img id="postImagePreview" style={{display:"none"}}></img>
                    <div id="postImage" style={{display:"none"}} onClick={()=>{
                        document.getElementById("postImageInput").click()
                    }}>
                        <AiOutlineFileImage style={{color:"#36e622", fontSize:"5vh"}}/>
                        <p style={{color:"white"}}>Selct an Image to Upload</p>
                    </div>
                    <br></br>
                    <div style={{border:"1px solid #3E4042", padding:"10px", borderRadius:"10px"}}>
                        <p style={{color:"white", display:"inline"}}>Add to your post: </p>
                        <Button className="status_types" style={{backgroundColor:"transparent", border:"0px"}} onClick={()=>{
                            document.getElementById("postImage").style.display = "block"
                        }}><AiOutlineFileImage style={{color:"#36e622"}}/> Photo</Button>
                        <Button className="status_types" style={{backgroundColor:"transparent", border:"0px"}}><GoLocation style={{color:"#4DB7D9"}}/> Location</Button>
                        <Button className="status_types" style={{backgroundColor:"transparent", border:"0px"}}><AiOutlineSmile style={{color:"#F8C03E"}}/> Feeling</Button>
                    </div>
                    <br></br>
                    <Button variant='Primary' id="statusSubmit" style={{width:"100%",margin:"0"}} onClick={()=>{
                        const postCount = Globalconfig.userData.posts.count
                        let post = {
                            caption: document.getElementById("postInput").value,
                            image: img,
                            location: "",
                            date: new Date().toUTCString(),
                        }
                        if(document.getElementById("postInput").value !== "" || img !== ""){
                            makeAPost(Globalconfig.db, post, postCount, Globalconfig.UID)
                            getUserInfo(Globalconfig.UID, Globalconfig.db, Globalconfig.setUserData)
                            document.getElementById("postInput").value = ""
                            document.getElementsByTagName('html')[0].style.overflow = "visible"
                        }
                        Globalconfig.setMakeAPost(false)
                    }}>Post</Button>
                </div>
            </>
        )
    }

    else{
        return(
            null
        )
    }
}

export default MakeAPost;