import './ChatBody.css'
import Messages from './Messages/Messages'
import ChannelDescription from './Channel-Description/ChannelDescription'

import React from 'react'


function ChatBody(props) {
    return (
        <div className='chat__body'>
            <Messages user={props.user} channelId={props.channelId} channelName={props.channelName} />
            <ChannelDescription currentUser={props.user} />
        </div>
    )
}

export default ChatBody