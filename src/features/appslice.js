import { createSlice } from '@reduxjs/toolkit';

export const appSlice = createSlice({
    name: 'app',
    initialState: {
        channelId: null,
        channelName: null,
        adminId: null,
    },
    reducers: {
        setChannelInfo: (state, action) => {
            state.channelId = action.payload.channelId
            state.channelName = action.payload.channelName
            state.adminId = action.payload.adminId
        }
    },
});

export const { setChannelInfo } = appSlice.actions; //set Current Channel

export const selectChannelId = (state) => state.app.channelId; // get current channel id
export const selectChannelName = (state) => state.app.channelName; // get current channel name
export const selectChannelAdmin = (state) => state.app.adminId; // get current channel admin

export default appSlice.reducer;