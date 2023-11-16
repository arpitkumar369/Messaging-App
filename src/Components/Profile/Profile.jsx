import "./Profile.css";
import Loader from "../Loader/Loader";
import Popover from "../Popover/Popover"

import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { database } from "../../Services/firebase";
import { AuthContext } from "../../Services/AuthProvider";

import { Avatar } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

function Profile() {
    let [user, setUser] = useState(null);
    let [popoverTitle, setPopoverTitle] = useState("");
    let { currentUser } = useContext(AuthContext);
    let history = useNavigate();

    useEffect(() => {
        database.users.doc(currentUser.uid).onSnapshot((doc) => {
            setUser(doc.data());
        });
    }, [currentUser]);

    return user ? (
        <div className="user_profile">
            <div className="profile_container">
                <h2>My Account</h2>
                <div className="user_profile_card">
                    <div className="banner"></div>
                    <div className="user_info">
                        <Avatar
                            id="user_display_image"
                            alt={user.username}
                            src="/broken-image.jpg"
                        />
                        <h2 id="username">{user.username}</h2>
                        <button onClick={() => setPopoverTitle("avatar")}>Edit Avatar</button>
                    </div>
                    <div className="change_info_controls">
                        <div className="control_field">
                            <div>
                                <h5>USERNAME</h5>
                                <div>{user.username}</div>
                            </div>
                            <button onClick={() => setPopoverTitle("username")}>Edit</button>
                        </div>
                        <div className="control_field">
                            <div>
                                <h5>EMAIL</h5>
                                <div>{user.email}</div>
                            </div>
                            <button onClick={() => setPopoverTitle("email")}>Edit</button>
                        </div>
                        <div className="control_field">
                            <div>
                                <h5>PASSWORD</h5>
                                <div>*********</div>
                            </div>
                            <button onClick={() => setPopoverTitle("password")}>Edit</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="close_container">
                <CloseIcon id="close" onClick={() => history("/feed")} />
            </div>
            {popoverTitle ? <Popover user={user} title={popoverTitle} setPopover={setPopoverTitle} /> : <></>}
        </div>
    ) : (
        <Loader />
    );
}

export default Profile;