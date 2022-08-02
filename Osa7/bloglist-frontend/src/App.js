import React, { useState, useEffect } from 'react'
import Blogs from './components/Blogs'
import User from './components/User'
import SingleBlog from './components/SingleBlog'
import {
  BrowserRouter as Router,
  Routes, Route, Link
} from 'react-router-dom'
import { createBlog, like, remove } from './reducers/blogReducer'
import { createNotification, removeNotification } from './reducers/notificationReducer'
import { initializeBlogs } from './reducers/blogReducer'
import blogService from './services/blogs'
import loginService from './services/login'
import { initializeUsers } from './reducers/userReducer'
import { useSelector, useDispatch } from 'react-redux'
import Users from './components/Users'
import './index.css'

const App = () => {

  const padding = {
    padding: 5
  }

  const dispatch = useDispatch()
  const notification = useSelector(state => state.notification)
  const blogs = useSelector(state => state.blogs)
  const users = useSelector(state => state.users)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    dispatch(initializeBlogs())
    dispatch(initializeUsers())
  }, [dispatch])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedInUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const addBlog = (blogObject) => {
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        console.log(returnedBlog)
        dispatch(createBlog(returnedBlog))
        const notification = { text: `a new blog ${blogObject.title} added`, isError: false }
        dispatch(createNotification({ notification }))
        setTimeout(() => {
          dispatch(removeNotification())
        }, 5000)
      })
      .catch(() => {
        const notification = { text: 'add blog failed', isError: true }
        dispatch(createNotification({ notification }))
        setTimeout(() => {
          dispatch(removeNotification())
        }, 5000)
      })
  }

  const addLike = (blogToUpdate) => {
    blogToUpdate = {
      id: blogToUpdate.id,
      user: blogToUpdate.user,
      likes: blogToUpdate.likes + 1,
      author: blogToUpdate.author,
      title: blogToUpdate.title,
      url: blogToUpdate.url,
    }

    dispatch(like(blogToUpdate, blogs))
    const notification = { text: `like added for ${blogToUpdate.title}`, isError: false }
    dispatch(createNotification({ notification }))
    setTimeout(() => {
      dispatch(removeNotification())
    }, 5000)
  }

  const removeBlog = (blogToRemove, blogs) => {
    blogService
      .remove(blogToRemove)
    dispatch(remove(blogToRemove, blogs))
    const notification = { text: `${blogToRemove.title} removed`, isError: false }
    dispatch(createNotification({ notification }))
    setTimeout(() => {
      dispatch(removeNotification())
    }, 5000)
  }


  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedInUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      const notification = { text: `'${user.username}' logged in`, isError: false }
      dispatch(createNotification({ notification }))
      setTimeout(() => {
        dispatch(removeNotification())
      }, 5000)
      setUsername('')
      setPassword('')
    } catch (exception) {
      console.log(exception)
      const notification = { text: 'login failed', isError: true }
      dispatch(createNotification({ notification }))
      setTimeout(() => {
        dispatch(removeNotification())
      }, 5000)
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          id='username'
          type='text'
          value={username}
          name='Username'
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          id='password'
          type='password'
          value={password}
          name='Password'
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button id='login-button' type='submit'>login</button>
    </form>
  )

  const handleLogout = () => {
    blogService.setToken(null)
    setUser(null)
    window.localStorage.removeItem('loggedInUser')
  }


  const blogList = () => {

    return (
      <div>
        <Router>
          <div>
            <Link style={padding} to="/">home</Link>
            <Link style={padding} to="/users">users</Link>
          </div>

          <div>
            {user.username} logged in
            <button onClick={handleLogout}>logout</button>
          </div>

          <Routes>
            <Route path="/users" element={<Users users={users} />} />
            <Route path="/" element={<Blogs blogs={blogs} user={user}
              addBlog={addBlog} addLike={addLike} removeBlog={removeBlog} />} />
            <Route path="/users/:id" element={<User users={users} />} />
            <Route path="/blogs/:id" element={<SingleBlog blogs={blogs} user={user}
              addLike={addLike} removeBlog={removeBlog} />} />

          </Routes>
        </Router>
      </div>
    )
  }

  return (
    <div>
      <div>
        {(notification !== null) &&
          (notification.isError ? <div className='error'>{notification.text}</div>
            : <div className='success'>{notification.text}</div>)
        }
      </div>
      <div>
        {user === null ?
          loginForm() :
          blogList()
        }
      </div>
    </div>
  )
}

export default App