import React, { useState } from 'react'
import Blog from './Blog'
import AddBlogForm from './AddBlogForm'
import { Link } from 'react-router-dom'

const Blogs = ({ blogs, user, addBlog, addLike, removeBlog } ) => {
  const [addBlogFormVisible, setAddBlogFormVisible] = useState(false)

  const hideWhenVisible = { display : addBlogFormVisible ? 'none' : '' }
  const showWhenVisible = { display : addBlogFormVisible ? '' : 'none' }

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
          <Link key={blog.id} to={`/blogs/${blog.id}`}>
            <Blog key={blog.id}
              blogs={blogs}
              blog={blog}
              addLike={addLike}
              removeBlog={removeBlog}
              user={user}
            />
          </Link>
        )}
      </div>
    </div>
  )

}

export default Blogs