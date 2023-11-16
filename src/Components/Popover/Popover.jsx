import "./Popover.css";

import React, { useContext, useState } from "react";

import { database } from "../../Services/firebase";
import { AuthContext } from "../../Services/AuthProvider";
import firebase from "firebase";

import CloseIcon from "@material-ui/icons/Close";

function Popover({ title, user, setPopover }) {
    let [username, setUsername] = useState(user.username);
    let [email, setEmail] = useState(user.email);
    let [password, setPassword] = useState("");
    let [newPassword, setNewPassword] = useState("");
    let { currentUser } = useContext(AuthContext);

    const handleChanges = () => {
        let credential = firebase.auth.EmailAuthProvider.credential(user.email, password);

        let errorField = document.querySelector(
            ".popover > .input_field_container > .input_field > .password_field"
        );

        let popover = document.querySelector(".popover_container");

        currentUser
            .reauthenticateWithCredential(credential)
            .then(function () {
                console.log("user reauthenticated");

                errorField.classList.remove("error");
                errorField.children[0].style.display = "none";

                if (title === "username") {
                    database.users.doc(currentUser.uid).update({
                        username: username,
                    });
                } else if (title === "email") {
                    currentUser.updateEmail(email).then(function () {
                        console.log("email updated");

                        database.users.doc(currentUser.uid).update({
                            email: email,
                        });
                    })
                        .catch(function (err) {
                            console.log("An error occurred while changing the email", err);
                        })
                } else if (title === "password") {
                    currentUser.updatePassword(newPassword).then(function () {
                        console.log("password changed");
                    })
                        .catch(function (err) {
                            console.log("An error occured while changing the password", err);
                        })
                }

                popover.style.display = 'none';
            })
            .catch(function () {
                console.log("invalid username");

                errorField.classList.add("error");
                errorField.children[0].style.display = "inline";
            });
    };

    const handleAvatar = (e) => {
        let selectedAvatar = document.querySelector(".popover_container > .popover > .avatar_container > .avatars > .avatar.selected");
        let previewContainer = document.querySelector(".popover_container > .popover > .avatar_container > .avatar_preview_container > img")
        let avatarSrc = e.target.getAttribute("src");

        previewContainer.setAttribute("src", avatarSrc);

        if (selectedAvatar) {
            selectedAvatar.classList.remove("selected");
        }

        e.currentTarget.classList.add("selected");

    }

    return user ? (
        <div className="popover_container">
            {title === "username" && (
                <div className="popover">
                    <div className="popover_heading">
                        <h2>Change your username</h2>
                        <div>Enter a new username and your existing password.</div>
                    </div>
                    <div className="input_field_container">
                        <div className="input_field">
                            <h5>USERNAME</h5>
                            <input
                                type="text"
                                value={username}
                                onChange={function (e) {
                                    setUsername(e.target.value);
                                }}
                            />
                        </div>
                        <div className="input_field">
                            <h5 className="password_field">
                                CURRENT PASSWORD
                                <span className="errorMessage"> - Password does not match</span>
                            </h5>
                            <input
                                type="password"
                                value={password}
                                onChange={function (e) {
                                    setPassword(e.target.value);
                                }}
                            />
                        </div>
                    </div>
                    <div className="button_container">
                        <button id="cancel" onClick={() => setPopover("")}>Cancel</button>
                        <button id="done" onClick={handleChanges}>
                            Done
                        </button>
                    </div>
                </div>
            )}
            {title === "email" && (
                <div className="popover">
                    <div className="popover_heading">
                        <h2>Enter an email address</h2>
                        <div>Enter a new email address and your existing password.</div>
                    </div>
                    <div className="input_field_container">
                        <div className="input_field">
                            <h5>EMAIL</h5>
                            <input
                                type="text"
                                value={email}
                                onChange={function (e) {
                                    setEmail(e.target.value);
                                }}
                            />
                        </div>
                        <div className="input_field">
                            <h5 className="password_field">
                                CURRENT PASSWORD
                                <span className="errorMessage"> - Password does not match</span>
                            </h5>
                            <input
                                type="password"
                                value={password}
                                onChange={function (e) {
                                    setPassword(e.target.value);
                                }}
                            />
                        </div>
                    </div>
                    <div className="button_container">
                        <button id="cancel" onClick={() => setPopover("")}>Cancel</button>
                        <button id="done" onClick={handleChanges}>
                            Done
                        </button>
                    </div>
                </div>
            )}
            {title === "password" && (
                <div className="popover">
                    <div className="popover_heading">
                        <h2>Change your password</h2>
                        <div>Enter your current password and a new password.</div>
                    </div>
                    <div className="input_field_container">
                        <div className="input_field">
                            <h5 className="password_field">
                                CURRENT PASSWORD
                                <span className="errorMessage"> - Password does not match</span>
                            </h5>
                            <input
                                type="password"
                                value={password}
                                onChange={function (e) {
                                    setPassword(e.target.value);
                                }}
                            />
                        </div>
                        <div className="input_field">
                            <h5>NEW PASSWORD</h5>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={function (e) {
                                    setNewPassword(e.target.value);
                                }}
                            />
                        </div>
                    </div>
                    <div className="button_container">
                        <button id="cancel" onClick={() => setPopover("")}>Cancel</button>
                        <button id="done" onClick={handleChanges}>
                            Done
                        </button>
                    </div>
                </div>
            )}
            {title === "avatar" && (
                <div className="popover">
                    <div className="popover_heading">
                        <h2>Change avatar</h2>
                    </div>
                    <div className="avatar_container">
                        <div className="avatars">
                            <div className="avatar selected" onClick={handleAvatar}>
                                <img src="/Avatars/default.png" alt="" />
                            </div>
                            <div className="avatar" onClick={handleAvatar}>
                                <img src="/Avatars/Avatar_1.png" alt="" />
                            </div>
                            <div className="avatar" onClick={handleAvatar}>
                                <img src="/Avatars/Avatar_2.png" alt="" />
                            </div>
                            <div className="avatar" onClick={handleAvatar}>
                                <img src="/Avatars/Avatar_3.png" alt="" />
                            </div>
                            <div className="avatar" onClick={handleAvatar}>
                                <img src="/Avatars/Avatar_4.png" alt="" />
                            </div>
                            <div className="avatar" onClick={handleAvatar}>
                                <img src="/Avatars/Avatar_5.png" alt="" />
                            </div>
                            <div className="avatar" onClick={handleAvatar}>
                                <img src="/Avatars/Avatar_6.png" alt="" />
                            </div>
                            <div className="avatar" onClick={handleAvatar}>
                                <img src="/Avatars/Avatar_7.png" alt="" />
                            </div>
                            <div className="avatar" onClick={handleAvatar}>
                                <img src="/Avatars/Avatar_8.png" alt="" />
                            </div>
                            <div className="avatar" onClick={handleAvatar}>
                                <img src="/Avatars/Avatar_9.png" alt="" />
                            </div>
                            <div className="avatar" onClick={handleAvatar}>
                                <img src="/Avatars/Avatar_10.png" alt="" />
                            </div>
                            <div className="avatar" onClick={handleAvatar}>
                                <img src="/Avatars/Avatar_11.png" alt="" />
                            </div>
                        </div>
                        <div className="avatar_preview_container">
                            <img src="/Avatars/default.png" alt="Avatar" />
                        </div>
                    </div>
                    <div className="button_container">
                        <button id="cancel" onClick={() => setPopover("")}>Cancel</button>
                        <button id="done" onClick={handleChanges}>
                            Done
                        </button>
                    </div>
                </div>
            )}
        </div>
    ) : (
        <></>
    );
}

export default Popover;