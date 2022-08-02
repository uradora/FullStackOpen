import { connect } from 'react-redux'

const Notification = (props) => {
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1
  }
  return (
    <div>
      {props.notification === null ? null :
        <div style={style}>
          {props.notification}
        </div>
      }
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    notification: state.notification  }
}

const ConnectedNotification = connect(mapStateToProps)(Notification)

export default ConnectedNotification