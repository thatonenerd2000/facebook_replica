import {ref, onValue} from "firebase/database";

/*
@param input = User ID, Database, stateSetter <= function to set state
@return User information in JSON format
@example return = {
    DOB: "yyyy-mm-dd"​
    UID: "UID"
    email: "example@gmail.com"
    first_name: "john"
    last_name: "doe"
    profile_picture: "url of profile picture"
*/
export function getUserInfo(uid, database, stateSetter){
    const storageRef = ref(database,'users/' + uid);
    let data = "";
    onValue(storageRef, (snapshot) => {
        data = snapshot.val();
        stateSetter(data);
    })
}
