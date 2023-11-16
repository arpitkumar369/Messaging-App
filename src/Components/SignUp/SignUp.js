import "./SignUp.css";
import Loader from "../Loader/Loader";

import React, { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux'

import { AuthContext } from "../../Services/AuthProvider";
import { storage, database } from "../../Services/firebase";
import { setChannelInfo } from '../../features/appSlice'

import { Button } from "@material-ui/core";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";

function SignUp() {
    let [email, setEmail] = useState("");
    let [password, setPassword] = useState("");
    let [username, setUsername] = useState("");
    let [region, setRegion] = useState("");
    let [loader, setLoader] = useState(false);
    let [passwordShown, setPasswordShown] = useState(false);
    let [file, setFile] = useState(null);
    let history = useNavigate();
    const dispatch = useDispatch();

    let { genericSignup } = useContext(AuthContext);

    const signupFn = async () => {
        try {
            setLoader(true);
            let userCredential = await genericSignup(email, password);
            let uid = userCredential.user.uid;
            dispatch(setChannelInfo({
                channelId: null,
                channelName: null,
                adminId: null,
            }));

            database.users.doc(uid).set({
                userId: uid,
                email: email,
                username: username,
                region: region,
            });

            history("/feed");
        } catch (err) {
            setLoader(false);
            setEmail("");
            setUsername("");
            setPassword("");
            setRegion("");
        }
    };

    return loader ? (
        <Loader></Loader>
    ) : (
        <div className="signup__container">
            <div className="signup">
                <div className="signup__header">
                    <h2>Create an Account</h2>
                </div>
                <div className="input__container">
                    <div className="input__field">
                        <h5>EMAIL</h5>
                        <input
                            type="email"
                            value={email}
                            onChange={function (e) {
                                setEmail(e.target.value);
                            }}
                        />
                    </div>
                    <div className="input__field">
                        <h5>FULL NAME</h5>
                        <input
                            type="text"
                            value={username}
                            onChange={function (e) {
                                setUsername(e.target.value);
                            }}
                        />
                    </div>
                    <div className="input__field">
                        <h5>PASSWORD</h5>
                        <input
                            type={passwordShown ? "text" : "password"}
                            value={password}
                            onChange={function (e) {
                                setPassword(e.target.value);
                            }}
                        />
                        {passwordShown ? (
                            <VisibilityOffIcon
                                className="password-visibility"
                                onClick={() => setPasswordShown(false)}
                            />
                        ) : (
                            <VisibilityIcon
                                className="password-visibility"
                                onClick={() => setPasswordShown(true)}
                            />
                        )}
                    </div>

                    <div className="input__field">
                        <h5>REGION</h5>
                        <input
                            type="text"
                            value={region}
                            onChange={function (e) {
                                setRegion(e.target.value);
                            }}
                        />
                    </div>
                    <div className="button__container">
                        <Button id="logIn" onClick={signupFn}>
                            SignUp
                        </Button>
                    </div>
                </div>
                {/* <input
                    id="default_avatar"
                    type="hidden"
                    name="myvalue"
                    src="/Avatars/default.png"
                    alt=""
                /> */}
                {/* <input
                    id="default_avatar"
                    type="file"
                    accept="image/*"
                    onChange={function (e) {
                        let file = e.target.files[0];
                        if (file != null) setFile(file);
                    }}
                /> */}
                <div>
                    <NavLink to="/login">Already have an account?</NavLink>
                </div>
            </div>
        </div>
    );
}

export default SignUp;