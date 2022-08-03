import React, { useState, useEffect } from 'react'
import Blogs from './components/Blogs'
import User from './components/User'
import SingleBlog from './components/SingleBlog'
import {
  BrowserRouter as Router,
  Routes, Route, Link
} from 'react-router-dom'
import { createBlog, like, remove, commentBlog } from './reducers/blogReducer'
import { createNotification, removeNotification } from './reducers/notificationReducer'
import { initializeBlogs } from './reducers/blogReducer'
import blogService from './services/blogs'
import loginService from './services/login'
import { initializeUsers } from './reducers/userReducer'
import { useSelector, useDispatch } from 'react-redux'
import Users from './components/Users'
import './index.css'
import AddBlogForm from './components/AddBlogForm'
import { Container, Button, TextField, Alert, Box, AppBar, Toolbar } from '@mui/material'

const App = () => {
/*
  const padding = {
    padding: 5
  }*/

  const dispatch = useDispatch()
  const notification = useSelector(state => state.notification)
  const blogs = useSelector(state => state.blogs)
  const users = useSelector(state => state.users)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [addBlogFormVisible, setAddBlogFormVisible] = useState(false)

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
    try {
      console.log('blog to be created: ' + blogObject)
      blogs.map(blog => console.log(blog))
      dispatch(createBlog(blogObject))
      blogs.map(blog => console.log(blog))
      const notification = { text: `a new blog ${blogObject.title} added`, isError: false }
      dispatch(createNotification({ notification }))
      setTimeout(() => {
        dispatch(removeNotification())
      }, 5000)
    } catch {
      const notification = { text: 'add blog failed', isError: true }
      dispatch(createNotification({ notification }))
      setTimeout(() => {
        dispatch(removeNotification())
      }, 5000)
    }
  }

  const addComment = (blogToUpdate, comment) => {
    console.log(blogToUpdate)
    blogToUpdate = {
      id: blogToUpdate.id,
      user: blogToUpdate.user,
      likes: blogToUpdate.likes,
      author: blogToUpdate.author,
      title: blogToUpdate.title,
      url: blogToUpdate.url,
      comments: blogToUpdate.comments?.concat(comment) ?? [comment]    }
    console.log(blogToUpdate.comments)
    dispatch(commentBlog(blogToUpdate, comment))
    console.log(blogToUpdate.comments)
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

    dispatch(like(blogToUpdate))
    const notification = { text: `like added for ${blogToUpdate.title}`, isError: false }
    dispatch(createNotification({ notification }))
    setTimeout(() => {
      dispatch(removeNotification())
    }, 5000)
  }

  const removeBlog = (blogToRemove) => {
    dispatch(remove(blogToRemove.id))
    blogs.map(blog => console.log(blog))
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
        <Box m={2} pt={3}>
          <TextField label ='username'
            size='small'
            id='username'
            type='text'
            value={username}
            name='Username'
            onChange={({ target }) => setUsername(target.value)}
          />
        </Box>
      </div>
      <div>
        password
        <Box m={2} pt={3}>
          <TextField label ='password'
            size='small'
            id='password'
            type='password'
            value={password}
            name='Password'
            onChange={({ target }) => setPassword(target.value)}
          />
        </Box>
      </div>
      <Box m={2} pt={3}>
        <Button variant='outlined' id='login-button' type='submit'>login</Button>
      </Box>
    </form>
  )

  const handleLogout = () => {
    blogService.setToken(null)
    setUser(null)
    window.localStorage.removeItem('loggedInUser')
  }


  const blogList = () => {
    const hideWhenVisible = { display : addBlogFormVisible ? 'none' : '' }
    const showWhenVisible = { display : addBlogFormVisible ? '' : 'none' }

    return (
      <div>
        <Router>
          <AppBar position='static'>
            <Toolbar>
              <Button color="inherit" component={Link} to="/">home</Button>
              <Button color="inherit" component={Link} to="/users">users</Button>
              <em>{user.username} logged in</em>
              <Button variant='outlined' color='inherit' onClick={handleLogout}>logout</Button>
            </Toolbar>
          </AppBar>
          <div className='flex-container'>
            <Box m={2} pt={3}>
              <div style={hideWhenVisible}>
                <Button variant='outlined' onClick={() => setAddBlogFormVisible(true)}>create new blog</Button>
              </div>
            </Box>
            <Box m={2} pt={3}>
              <div style={showWhenVisible}>
                <AddBlogForm createBlog={addBlog} />
                <Button variant='outlined' onClick={() => setAddBlogFormVisible(false)}>cancel</Button>
              </div>
            </Box>
            <Routes>
              <Route path="/users" element={<Users users={users} />} />
              <Route path="/" element={<Blogs blogs={blogs} user={user}
                addBlog={addBlog} addLike={addLike} removeBlog={removeBlog} />} />
              <Route path="/users/:id" element={<User users={users} />} />
              <Route path="/blogs/:id" element={<SingleBlog blogs={blogs} user={user}
                addLike={addLike} removeBlog={removeBlog} addComment={addComment} />} />
            </Routes>
          </div>
        </Router>
      </div>
    )
  }

  return (
    <Container>
      <div>
        <div>
          {(notification !== null) &&
            (notification.isError ? <Alert severity='error'>{notification.text}</Alert>
              : <Alert severity='success'>{notification.text}</Alert>)
          }
        </div>
        <div>
          {user === null ?
            loginForm() :
            blogList()
          }
        </div>
      </div>
    </Container>
  )
}

export default App