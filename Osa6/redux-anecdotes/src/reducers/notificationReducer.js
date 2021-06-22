const notificationReducer = (state = '', action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return action.data
    default:
      return state
  }
}

let clearNotification

export const notificationChange = (notification, timeout) => {
  return async dispatch => {
    window.clearTimeout(clearNotification)
    dispatch ({
      type: 'SET_NOTIFICATION',
      data: notification
    })

    clearNotification = setTimeout(() => {
      dispatch({
        type: 'SET_NOTIFICATION',
        data: ''
      })
    }, timeout)
  }
}

export default notificationReducer
