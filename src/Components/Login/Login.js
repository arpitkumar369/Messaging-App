import "./Login.css";
import Loader from "../Loader/Loader";

import React, { useState, useContext, useEffect } from "react";
import { useDispatch } from 'react-redux'
import { NavLink, useNavigate } from "react-router-dom";

import { AuthContext } from "../../Services/AuthProvider";
import { setChannelInfo } from '../../features/appSlice'

import { Button } from "@material-ui/core";
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';


const Login = () => {
    let [email, setEmail] = useState("");
    let [password, setPassword] = useState("");
    let [loginLoader, setLoginLoader] = useState(false);
    let [passwordShown, setPasswordShown] = useState(false);
    let history = useNavigate();
    const dispatch = useDispatch();

    let { genericlogin, currentUser } = useContext(AuthContext);

    const loginFn = async () => {
        try {
            setLoginLoader(true);
            await genericlogin(email, password);
            setLoginLoader(false);
            dispatch(setChannelInfo({
                channelId: null,
                channelName: null,
                adminId: null,
            }));
            history("/feed");
        } catch (err) {
            setLoginLoader(false);
            setEmail("");
            setPassword("");
            setTimeout(() => { }, 2000);
        }
    };

    useEffect(() => {
        if (currentUser) {
            history('/feed');
        }
        return;
    })

    return loginLoader ? (
        <Loader></Loader>
    ) : (
        <div className="login__container">
            <div className="login active">
                <div className="login__header">
                    <h2>Welcome Back!</h2>
                    <div>We're so excited to see you again</div>
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
                        <h5>PASSWORD</h5>
                        <input
                            type={passwordShown ? "text" : "password"}
                            value={password}
                            onChange={function (e) {
                                setPassword(e.target.value);
                            }}
                        />
                        {passwordShown ?
                            <VisibilityOffIcon className="password-visibility" onClick={() => setPasswordShown(false)} /> :
                            <VisibilityIcon className="password-visibility" onClick={() => setPasswordShown(true)} />
                        }
                    </div>


                </div>
                <div className="button__container">
                    <Button id="logIn" onClick={loginFn}>
                        LogIn
                    </Button>
                </div>
                <div>
                    Need an account? <NavLink to="/signup">Register</NavLink>
                </div>
            </div>
        </div>
    );
};

export default Login;