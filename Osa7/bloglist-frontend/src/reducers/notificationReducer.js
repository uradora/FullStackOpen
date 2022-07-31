const notificationReducer = (state = null, action) => {
  if (action.type === 'ERASE') {
    return null
  } else if (action.type === 'SHOW') {
    return { text : action.data.text,
      isError : action.data.isError }
  }
  return state
}

export const createNotification = ({ notification }) => {
  return {
    type: 'SHOW',
    data: {
      text: notification.text,
      isError: notification.isError
    }
  }
}

export const removeNotification = () => {
  return {
    type: 'ERASE'
  }
}

export default notificationReducer