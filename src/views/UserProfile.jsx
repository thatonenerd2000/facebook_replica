import React, { useContext, useEffect, useState } from 'react'
import { getDatabase, ref, onValue, get } from "firebase/database";

import '../style.scss'
import {ConfigContext} from '../GlobalContext';

import {getUserInfo} from '../funcions/firebaseMethods.js'

const ProPicAndCover = () => {
    const Globalconfig = useContext(ConfigContext)
    const [userInfo, setUserInfo] = useState({}) 
    useEffect(() => {
        // const storageRef = ref(getDatabase(),'users/' + Globalconfig.userProfile);
        //  let data = "";
        //  onValue(storageRef, (snapshot) => {
        //      data = snapshot.val();
        //      setUserInfo(data)
        //      console.log(userInfo)
        //  }) 
        getUserInfo(Globalconfig.userProfile,getDatabase(),setUserInfo)
    },[])

    return(
        <>
            <button onClick={()=>{}}>Test It</button>
            <h1>{userInfo.email}</h1>
        </>
    )
}

// class UserProfile extends React.Component {
//     constructor() {
//         super()
//         this.state = {
//             user: {},
//         }
//     }
    
//     static contextType = ConfigContext

//     componentDidMount() {
//         const GlobalContext = this.context

//         const storageRef = ref(getDatabase(),'users/' + GlobalContext.userProfile);
//         let data = "";
//         onValue(storageRef, (snapshot) => {
//             data = snapshot.val();
//         })

//         this.setState({
//             user: data
//         })

//         console.log(this.state.user)
//     }
    
//     render() {

//         return(
//             <>
//                 {/* <h1>{this.state.user}</h1>
//                 <button onClick={()=>{console.log(this.state.user.email)}}>Test Itt</button> */}
//             </>
//         )
//     }
// }


export default ProPicAndCover

