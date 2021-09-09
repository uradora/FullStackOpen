import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import { createNotification, removeNotification } from './reducers/notificationReducer'
import { createBlog, likeBlog, deleteBlog, initializeBlogs } from './reducers/blogReducer'
import blogService from './services/blogs'
import loginService from './services/login'
import AddBlogForm from './components/AddBlogForm'
import { useSelector, useDispatch } from 'react-redux'
import './index.css'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [addBlogFormVisible, setAddBlogFormVisible] = useState(false)

  const dispatch = useDispatch()
  const notification = useSelector(state => state.notification)
  const blogs = useSelector(state => state.blogs)

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [blogs])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedInUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

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

  const addBlog = (blogObject) => {
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        dispatch(createBlog({ returnedBlog }))
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
    console.log(user)
    console.log(blogToUpdate.user.id)
    blogService
      .update(blogToUpdate)
      .then((updatedBlog) => {
        dispatch(likeBlog({ updatedBlog }))
        const notification = { text: `like added for ${updatedBlog.title}`, isError: false }
        dispatch(createNotification({ notification }))
        setTimeout(() => {
          dispatch(removeNotification())
        }, 5000)
      })
      .catch(() => {
        const notification = { text: 'adding like failed', isError: true }
        dispatch(createNotification({ notification }))
        setTimeout(() => {
          dispatch(removeNotification())
        }, 5000)
      })
  }

  const removeBlog = (blogToRemove) => {
    console.log(blogToRemove.user)
    console.log(user.id)
    blogService
      .remove(blogToRemove.id)
      .then(() => {
        dispatch(deleteBlog({ blogToRemove }))
        const notification = { text: `${blogToRemove.title} removed`, isError: false }
        dispatch(createNotification({ notification }))
        setTimeout(() => {
          dispatch(removeNotification())
        }, 5000)
      })
      .catch((exception) => {
        console.log(exception)
        const notification = { text: 'remove failed', isError: true }
        dispatch(createNotification({ notification }))
        setTimeout(() => {
          dispatch(removeNotification())
        }, 5000)
      })
  }

  const blogList = () => {
    const hideWhenVisible = { display : addBlogFormVisible ? 'none' : '' }
    const showWhenVisible = { display : addBlogFormVisible ? '' : 'none' }

    return (
      <div>
        <h2>blogs</h2>
        <div>
          {user.username} logged in
          <button onClick={handleLogout}>logout</button>
        </div>
        <br />
        <div style={hideWhenVisible}>
          <button onClick={() => setAddBlogFormVisible(true)}>create new blog</button>
        </div>
        <div style={showWhenVisible}>
          <AddBlogForm
            createBlog={addBlog}
          />
          <button onClick={() => setAddBlogFormVisible(false)}>cancel</button>
        </div>
        <div>
          {blogs.map(blog =>
            <Blog key={blog.id}
              blog={blog}
              addLike={addLike}
              removeBlog={removeBlog}
              user={user}
            />
          )}
        </div>
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