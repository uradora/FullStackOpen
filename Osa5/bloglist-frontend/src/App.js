import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import AddBlogForm from './components/AddBlogForm'
import './index.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState({ text: null, isError: false })
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [addBlogFormVisible, setAddBlogFormVisible] = useState(false)

  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    const blogs = await blogService.getAll()
    blogs.sort((blog, next) => {
      return next.likes - blog.likes
    })
    setBlogs( blogs )
  }

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
      setMessage({ text: `'${user.username}' logged in`, isError: false })
      setTimeout(() => {
        setMessage({ text: null, isError: false })
      }, 5000)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setMessage({
        text: 'login failed',
        isError: true,
      })
      setTimeout(() => {
        setMessage({ text: null, isError: false })
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
        setBlogs(blogs.concat(returnedBlog))
        setMessage({
          text: `a new blog ${blogObject.title} added`,
          isError: false,
        })
        setTimeout(() => {
          setMessage({ text: null, isError: false })
        }, 5000)
      })
      .catch(() => {
        setMessage({
          text: 'add blog failed',
          isError: true,
        })
        setTimeout(() => {
          setMessage({ text: null, isError: false })
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

    blogService
      .update(blogToUpdate)
      .then((updatedBlog) => {
        setBlogs(blogs.map((blog) =>
          blog.id !== blogToUpdate.id ? blog : updatedBlog)
        )
        setMessage({
          text: `like added for ${blogToUpdate.title}`,
          isError: false,
        })
        setTimeout(() => {
          setMessage({ text: null, isError: false })
        }, 5000)
      })
      .catch(() => {
        setMessage({
          text: 'adding like failed',
          isError: true,
        })
        setTimeout(() => {
          setMessage({ text: null, isError: false })
        }, 5000)
      })
  }

  const removeBlog = (blogToRemove) => {
    console.log(blogToRemove.user.id)
    console.log(user.id)
    blogService
      .remove(blogToRemove.id)
      .then(() => {
        setBlogs(blogs.filter((blog) =>
          blog.id !== blogToRemove.id)
        )
        setMessage({
          text: `${blogToRemove.title} removed`,
          isError: false,
        })
        setTimeout(() => {
          setMessage({ text: null, isError: false })
        }, 5000)
      })
      .catch(() => {
        setMessage({
          text: 'remove failed',
          isError: true,
        })
        setTimeout(() => {
          setMessage({ text: null, isError: false })
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
            />
          )}
        </div>
      </div>
    )
  }

  return (
    <div>
      <Notification text={message.text} isError={message.isError} />
      {user === null ?
        loginForm() :
        blogList()
      }
    </div>
  )
}

export default App