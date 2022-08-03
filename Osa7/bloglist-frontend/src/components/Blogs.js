import React from 'react'
import { Link } from 'react-router-dom'

const Blogs = ({ blogs }) => {

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  return (
    <div className='basicInfo' style={blogStyle}>
      {blogs.map(blog =>
        <li key={blog.id}>
          <Link to={`/blogs/${blog.id}`}>
            {blog.title}
          </Link>
        </li>)}
    </div>
  )
}

export default Blogs