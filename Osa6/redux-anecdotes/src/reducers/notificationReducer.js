const notificationReducer = (state = '', action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return action.data
    default:
      return state
  }
}

export const notificationChange = notification => {
  return {
    type: 'SET_NOTIFICATION',
    data: notification
  }
}

export const clearNotification = () => {
  return {
    type: 'SET_NOTIFICATION',
    data: ''
  }
}

export default notificationReducer
