import React, { useState } from 'react'
import Blog from './Blog'
import AddBlogForm from './AddBlogForm'
import { createBlog, like, remove } from '../reducers/blogReducer'
import { createNotification, removeNotification } from '../reducers/notificationReducer'
import blogService from '../services/blogs'
import { useDispatch } from 'react-redux'

const Blogs = ({ blogs, user } ) => {

  console.log('blogs in here ' + blogs)
  const dispatch = useDispatch()
  const [addBlogFormVisible, setAddBlogFormVisible] = useState(false)

  const hideWhenVisible = { display : addBlogFormVisible ? 'none' : '' }
  const showWhenVisible = { display : addBlogFormVisible ? '' : 'none' }

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
    console.log('blogs in blogs.js ' + blogs)
    dispatch(remove(blogToRemove, blogs))
    const notification = { text: `${blogToRemove.title} removed`, isError: false }
    dispatch(createNotification({ notification }))
    setTimeout(() => {
      dispatch(removeNotification())
    }, 5000)
  }

  return (
    <div>
      <h2>blogs</h2>
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
            blogs={blogs}
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

export default Blogs