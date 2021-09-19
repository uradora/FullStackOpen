import loginService from '../services/login'
import blogService from '../services/blogs'

const userReducer = (state = [], action) => {
  if (action.type === 'LOGIN') {
    return action.data
  } else if (action.type === 'INIT_USER') {
    return action.data
  } else if (action.type === 'LOGOUT') {
    return null
  }
  return state
}

export const loginUser = ({ username, password }) => {
  return async dispatch => {
    const user = await loginService.login({
      username, password,
    })
    blogService.setToken(user.token)
    dispatch({
      type: 'LOGIN',
      data: {
        username: user.username,
        password: user.password
      }
    })
  }
}

export const logoutUser = () => {
  return async dispatch => {
    blogService.setToken(null)
    dispatch({
      type: 'LOGOUT',
    })
  }
}

export const initializeUser = ({ user }) => {
  return async dispatch => {
    blogService.setToken(user)
    dispatch({
      type: 'INIT_USER',
      data: {
        username: user.username,
        password: user.password
      }
    })
  }
}


export default userReducer