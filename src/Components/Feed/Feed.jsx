import './feed.css'
import Chat from './Chat/Chat';
import SideBar from "./SideBar/Sidebar"
import Loader from "../Loader/Loader"

import React, { useState, useEffect, useContext } from 'react'

import { database } from "../../Services/firebase";
import { AuthContext } from '../../Services/AuthProvider';

function Feed() {
    let [user, setUser] = useState(null);
    let { currentUser } = useContext(AuthContext);

    useEffect(() => {
        database.users.doc(currentUser.uid).onSnapshot((doc) => {
            setUser(doc.data());
        })
    }, [currentUser])
    return (
        user ?
            <div className='feed'>
                <SideBar user={user} />
                <Chat user={user} />
            </div> :
            <Loader />
    )
}

export default Feed