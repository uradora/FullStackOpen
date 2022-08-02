import React from 'react'
import { useParams } from 'react-router-dom'

const SingleBlog = ({ blogs, user, addLike, removeBlog }) => {

  const id = useParams().id
  const blog = blogs.find(blog => blog.id === id)

  if (!blog) {
    return null
  }

  const showIfCorrectUser = { display : user.id === blog.user.id ? '' : 'none' }

  return (
    <div>
      <h2>{blog.title}  {blog.author}</h2>
      <div>
        {blog.url}
      </div>
      <div>
        likes {blog.likes}
        <button onClick={() => addLike(blog)}>like</button>
      </div>
      <div>
        added by {blog.user.name}
      </div>
      <div style={showIfCorrectUser}>
        <button onClick={() => removeBlog(blog, blogs)}>remove</button>
      </div>
    </div>
  )

}

export default SingleBlog