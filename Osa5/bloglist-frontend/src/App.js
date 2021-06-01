import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import './index.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [message, setMessage] = useState({ text: null, isError: false })
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null) 

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

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
        text: `login failed`,
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
          type='text'
          value={username}
          name='Username'
          onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
            <input
            type='password'
            value={password}
            name='Password'
            onChange={({ target}) => setPassword(target.value)}
            />
        </div>
        <button type='submit'>login</button>
    </form>
  )

  const handleLogout = () => {
    blogService.setToken(null)
    setUser(null)
    window.localStorage.removeItem('loggedInUser')
  }

  const addBlog = (event) => {
    event.preventDefault()
    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    }

    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setMessage({
          text: `a new blog ${blogObject.name} added`,
          isError: false,
        })
        setTimeout(() => {
          setMessage({ text: null, isError: false });
        }, 5000)
        setNewTitle('')
        setNewAuthor('')
        setNewUrl('')
      })
      .catch(exception => {
        setMessage({
          text: `add blog failed`,
          isError: true,
        })
        setTimeout(() => {
          setMessage({ text: null, isError: false })
        }, 5000)
      })
  }

  const handleTitleChange = (event) => {
    setNewTitle(event.target.value)
  } 

  const handleAuthorChange = (event) => {
    setNewAuthor(event.target.value)
  } 

  const handleUrlChange = (event) => {
    setNewUrl(event.target.value)
  } 

  const blogList = () => (
    <div>
      <h2>blogs</h2>
      <div>
        {user.username} logged in
        <button onClick={handleLogout}>logout</button>
      </div>
      <br />
      <h2>create new</h2>
      <div>
        <form onSubmit={addBlog}>
          <div>
            title
            <input
              type='text'
              value={newTitle}
              name='Title'
              onChange={handleTitleChange}
            />
          </div>
          <div>
            author
            <input
              type='text'
              value={newAuthor}
              name='Author'
              onChange={handleAuthorChange}
            />
          </div>
          <div>
            url
            <input
              type='text'
              value={newUrl}
              name='Url'
              onChange={handleUrlChange}
            />
          </div>
          <button type='submit'>create</button>
        </form>
      </div>
      <div>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </div>
    </div>
  )

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