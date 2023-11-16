import firebase from 'firebase'

const firebaseConfig = {
    apiKey: "AIzaSyDcZOov6y3oBSbTK-1tzY9Xoz8o_bfpeOM",
    authDomain: "discord-chat-app-97c9b.firebaseapp.com",
    projectId: "discord-chat-app-97c9b",
    storageBucket: "discord-chat-app-97c9b.appspot.com",
    messagingSenderId: "170161618795",
    appId: "1:170161618795:web:9a9e52d4a8c579e4e0d62e"
};

firebase.initializeApp(firebaseConfig)
const firestore = firebase.firestore();
export const storage = firebase.storage();

export const database = {
    users: firestore.collection('users'),
    channels: firestore.collection('channels')
}

export default firebase;