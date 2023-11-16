import "./SidebarChannel.css";

import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import { database } from "../../../../Services/firebase";
import { setChannelInfo } from "../../../../features/appSlice";

const SidebarChannel = ({ id }) => {
    const dispatch = useDispatch();
    let [channelData, setChannelData] = useState(null);

    useEffect(() => {
        database.channels.doc(id).onSnapshot((doc) => {
            setChannelData(doc.data());
        });
        return
    }, [id]);

    const handlSidebarChannel = (e) => {
        dispatch(
            setChannelInfo({
                channelId: id,
                channelName: channelData.channelName,
                adminId: channelData.adminId,
            })
        );

        let selectedChannel = document.querySelector(".sidebarChannel.selected");
        if (selectedChannel) {
            selectedChannel.classList.remove("selected");
        }
        e.currentTarget.classList.add("selected");
    };

    return channelData ? (
        <div className="sidebarChannel_container">
            <div className="sidebarChannel" onClick={handlSidebarChannel}>
                <div>
                    <h1>#</h1>
                    {channelData.channelName}
                </div>
            </div>
        </div>
    ) : (
        <></>
    );
};

export default SidebarChannel;