import { createSlice } from '@reduxjs/toolkit'

const initialState = null

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotification(state, action) {
        return state = action.payload
    }
  }
})

export const showNotification = (notification, time) => {
    return async dispatch => {
        clearTimeout()
        dispatch(setNotification(notification))
        setTimeout(() => {
            dispatch(setNotification(null))
          }, time * 500 )
        }
    
    }

export const { setNotification } = notificationSlice.actions
export default notificationSlice.reducer
