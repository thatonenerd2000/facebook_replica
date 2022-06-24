import React , {useState,useEffect} from 'react';
import { initializeApp } from 'firebase/app';

export const ConfigContext = React.createContext()

const GlobalContext = (props) => {
    //Initialize Firebase
    const firebaseConfig = {
        apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
        authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
        storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.REACT_APP_FIREBASE_APP_ID,
        measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
    };

    const FirebaseApp = initializeApp(firebaseConfig);

    //Global State Variables
    const [authenticatedStatus, setAuthStatus] = useState(false)
    const [firebaseApp, setFirebaseApp] = useState(FirebaseApp)
    const [userID, setUserID] = useState("")
    const [userDataRet, setUserData] = useState('')

    return(
        <ConfigContext.Provider value = {{
            authStatus: authenticatedStatus, 
            setAuthStatus,
            firebase:firebaseApp,
            UID:userID,
            setUserID,
            userData:userDataRet,
            setUserData
        }}>
            {props.children}
        </ConfigContext.Provider>
    )
}

export default GlobalContext