import './Channel-Description.css'
// import Popover from '../../../../Popover/Popover'

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { database } from "../../../../../Services/firebase";
import { selectChannelId, selectChannelName, setChannelInfo, selectChannelAdmin } from "../../../../../features/appSlice";

// import { withStyles } from '@material-ui/core/styles';
import { Avatar, Tooltip, makeStyles } from "@material-ui/core";
import StarIcon from '@material-ui/icons/Star';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import DeleteIcon from '@material-ui/icons/Delete';
// import CloseIcon from "@material-ui/icons/Close";
// import Checkbox from '@material-ui/core/Checkbox';

const useStylesBootstrap = makeStyles((theme) => ({
    arrow: {
        color: "#18191b",
    },
    tooltip: {
        backgroundColor: "#18191b",
        fontSize: "12px",
        fontWeight: "600",
        padding: "10px",
        margin: "0",
        boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.6)"
    },
}));

function BootstrapTooltip(props) {
    const classes = useStylesBootstrap();

    return <Tooltip arrow classes={classes} {...props} />;
}

// const CustomCheckbox = withStyles({
//     root: {
//       color: 'skyblue',
//       '&$checked': {
//         color: 'skyblue',
//       },
//     },
//     checked: {},
//   })((props) => <Checkbox color="default" {...props} />);

function ChannelDescription(props) {
    let { currentUser } = props;
    const dispatch = useDispatch();
    const channelId = useSelector(selectChannelId);
    const channelName = useSelector(selectChannelName);
    const channelAdmin = useSelector(selectChannelAdmin);
    let [usersInSelectedChannel, setUsersInSelectedChannel] = useState([]); // all user's data present in selected channel
    let [allUsers, setAllUsers] = useState([]);
    // let [usersToAdd, setUsersToAdd] = useState([]);
    // let [showPopover, setShowPopover] = useState(false);

    useEffect(() => {
        if (channelId) {
            database.channels.doc(channelId).get().then((snapshot) => {
                let allUsersId = snapshot.data().users;

                let allUsers = [];
                allUsersId.map((userId) => {
                    let data = database.users.doc(userId).get();
                    allUsers.push(data);
                })

                Promise.all(allUsers).then(function (user) {
                    let allUsersData = [];
                    user.forEach(doc => {
                        allUsersData.push(doc.data())
                    });
                    setUsersInSelectedChannel(allUsersData);
                });
            });
        }
        database.users.get().then((doc) => {
            let allUsersData = doc.docs.map((userData) => userData.data())

            setAllUsers(allUsersData);
        })

    }, [channelId, usersInSelectedChannel]);

    const handleAddUser = (e) => {
        e.preventDefault();

        const userName = prompt("Enter a new user name");

        let flag = false;
        allUsers.forEach((user) => {
            if (userName === user.username) {
                flag = true;

                let allUsersId = usersInSelectedChannel.map(user => user.userId);
                let updatedChannelUsers = [...allUsersId, user.userId];

                // add new user to the selected channel database
                database.channels.doc(channelId).update({
                    users: updatedChannelUsers
                })

                let updatedChannels = [];
                if (user.channels) {
                    updatedChannels = [...user.channels, channelId]
                }
                else {
                    updatedChannels = [channelId]
                }

                // add the selected channel to the user database
                database.users.doc(user.userId).update({
                    channels: updatedChannels
                })
            }
        })

        if (!flag) {
            alert("User does not exist")
        }

        setUsersInSelectedChannel([])
    };

    const handleLeaveChannel = (removeUser) => {
        console.log(usersInSelectedChannel)
        database.users.doc(removeUser.userId).get().then(snapshot => {
            let allChannels = snapshot.data().channels;
            let selectedChannelIdx = allChannels.indexOf(channelId);
            if (selectedChannelIdx > -1) {
                allChannels.splice(selectedChannelIdx, 1);
            }

            database.users.doc(removeUser.userId).update({
                channels: allChannels
            })
        })

        database.channels.doc(channelId).get().then((snapshot) => {
            let allUsersInSelectedChannel = snapshot.data().users;
            let currentUserIdx = allUsersInSelectedChannel.indexOf(removeUser.userId);
            if (currentUserIdx > -1) {
                allUsersInSelectedChannel.splice(currentUserIdx, 1);
            }

            if (allUsersInSelectedChannel.length > 0) {
                database.channels.doc(channelId).update({
                    users: allUsersInSelectedChannel
                })
            }
            else {
                database.channels.where("channelId", '==', channelId).get().then(res => {
                    res.forEach((doc) => {
                        doc.ref.delete();
                    })
                })
            }

            if (allUsersInSelectedChannel.length === 0) {
                dispatch(
                    setChannelInfo({
                        channelId: null,
                        channelName: null,
                    })
                );
            }
        })
    }

    const handleDeleteChannel = () => {
        usersInSelectedChannel.forEach(user => {
            user.channels = user.channels.filter(channel => channel !== channelId)

            database.users.doc(user.userId).update({
                channels: user.channels
            })
        })

        database.channels.where("channelId", '==', channelId).get().then(res => {
            res.forEach((doc) => {
                doc.ref.delete();
            })
        })

        setUsersInSelectedChannel([]);
        dispatch(
            setChannelInfo({
                channelId: null,
                channelName: null,
            })
        );
    }

    return (
        <div className="channel__description">
            {channelId ? (
                <>
                    <div className="channel__title">
                        <h3>#</h3>
                        <h2>{channelName}</h2>
                        {channelAdmin === currentUser.userId && <BootstrapTooltip title="Add User" placement="top" arrow>
                            <GroupAddIcon className="channel__addUser" onClick={handleAddUser} />
                        </BootstrapTooltip>}
                    </div>
                    <div className="channel__users">
                        {usersInSelectedChannel ? (
                            usersInSelectedChannel.map((user) =>
                                <div className="user">
                                    {/* <Avatar src={'./DefaultAvatar.png'} /> */}
                                    <Avatar id='user-avatar' alt={user.username} src="/broken-image.jpg" />
                                    <span>{user.username}</span>
                                    {channelAdmin === user.userId && <StarIcon id='admin-icon' />}
                                    {(channelAdmin === currentUser.userId && channelAdmin !== user.userId) && <DeleteIcon id='delete-user' onClick={() => handleLeaveChannel(user)} />}
                                </div>
                            )
                        ) : (
                            <></>
                        )}
                    </div>
                    <div className="button-container">
                        <div className="leavebtn-container">
                            <button onClick={handleLeaveChannel}>Leave Channel</button>
                        </div>
                        {channelAdmin === currentUser.userId && <div className="deletebtn-container">
                            <button onClick={handleDeleteChannel}>Delete Channel</button>
                        </div>}
                    </div>
                </>
            ) : (
                <></>
            )}
            {/* {showPopover ?
                <div className="popover-container">
                    <div className="popover">
                        <div className="popover_heading">
                            <h2>Add Users</h2>
                            <div>Select users to add.</div>
                        </div>
                        <div className="all_users_checkbox_container">
                            <div className="all_users_checkbox">
                                {allUsers.map((user) =>
                                    <div className="user_checkbox">
                                        {user.username}
                                        <CustomCheckbox onChange={handleUsersToAdd} checked={user.channels.includes(channelId)}/>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="button_container">
                            <button id="cancel" onClick={() => setShowPopover(false)}>Cancel</button>
                            <button id="done" onClick={handleAddUser}>Add</button>
                        </div>
                        <CloseIcon id="close" onClick={() => setShowPopover(false)}/>
                    </div>
                </div> : <></>
            } */}
        </div>
    );
}

export default ChannelDescription;