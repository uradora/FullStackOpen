import React from 'react'

const Notification = ({ text, isError }) => {
  if (text === null) {
    return null
  } else if (isError) {
    return <div className='error'>{text}</div>
  } else {
    return <div className='success'>{text}</div>
  }
}

export default Notification
