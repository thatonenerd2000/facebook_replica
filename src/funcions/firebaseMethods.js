import {ref, onValue, set, update} from "firebase/database";
import { getStorage, uploadBytes, ref as sRef, getDownloadURL } from "firebase/storage";

/*
@param uid = User ID
@param database = Firebase Database
@param stateSetter = Function to set state
@example JSON = {
    DOB: "yyyy-mm-dd"​
    UID: "UID"
    email: "example@gmail.com"
    first_name: "john"
    last_name: "doe"
    profile_picture: "url of profile picture",
    cover_picture_url: "" or "url of cover picture"
    bio: "bio"
    social: {
        instagram: {
            username: "username"
            show: true
        }
    }
    location: {
        city: "city"
        state: "state"
        country: "country"
    }
    posts: {
        count: 0
        post_array: {}
    }

Gets the user's information and stores it in stateSetter
*/
export function getUserInfo(uid, database, stateSetter){
    const storageRef = ref(database,'users/' + uid);
    let data = "";
    onValue(storageRef, (snapshot) => {
        data = snapshot.val();
        stateSetter(data);
    })
}

/*
@param database = storage initialization
@param Image = Image to be uploaded
@param uid = User ID
@param stateSetter = state variable to set state

Uploads an image to firebase storage and sets the url of the image to stateSetter
*/
export function uploadImageAndgetUrl(database, Imgfile, uid, stateSetter){
    const file = Imgfile;
    const storageRef = sRef(database,'users/' + uid + '/cover_picture/' + file.name);
    uploadBytes(storageRef,Imgfile).then(snap => {
        getDownloadURL(sRef(database, 'users/' + uid + '/cover_picture/' + file.name)).then(url => {
            stateSetter(url)
        })
    })
}

/*
@param database = Firebase database initialization
@param Refpath = path of the reference
@data = data to be set

Writes data to Refpath
*/
export function writeData(database, Refpath, data){
    set(ref(database, Refpath), data);
}

/*
@param database = Firebase database initialization
@param Refpath = path of the reference to be updated
@data = data to be updated

Updates data at Refpath
*/
export function updateData(database, Refpath, data){
    update(ref(database, Refpath),data);
}

export function makeAPost(database, data, count, uid){
    const PostCount = count
    if(data !== ""){
        writeData(database, 'users/' + uid + '/posts/post_array/'+ uid+"_"+PostCount, data);
        updateData(database, 'users/' + uid + '/posts/', {count:PostCount+1})
    }
}