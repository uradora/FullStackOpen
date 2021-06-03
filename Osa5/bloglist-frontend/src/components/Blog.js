import React, { useState } from 'react'

const Blog = ({ blog, addLike, currentUser, removeBlog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  console.log(currentUser.id)

  const [showAll, setShowAll] = useState(false)

  const hideWhenVisible = { display : showAll ? 'none' : '' }
  const showWhenVisible = { display : showAll ? '' : 'none' }
  const showIfCorrectUser = { display : blog.user.id === currentUser.id ? '' : 'none' }
  
  return (
    <div style={blogStyle}>
      {blog.title}  {blog.author}
      <div style={hideWhenVisible}>
        <button onClick={() => setShowAll(true)}>view</button>
      </div>
      <div style={showWhenVisible}>
        <div>
          {blog.url}
        </div>
        <div>
          likes {blog.likes}
          <button onClick={() => addLike(blog)}>like</button>
        </div>
        <div>
          {blog.user.name}
        </div>
        <div style={showIfCorrectUser}>
          <button onClick={() => removeBlog(blog)}>remove</button>
        </div>
        <button onClick={() => setShowAll(false)}>hide</button>
      </div>
  </div>  
  )
}

export default Blog