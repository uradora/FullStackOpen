import React, { useState } from 'react'

const Blog = ({ blog, blogs, addLike, removeBlog, user }) => {

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const [showAll, setShowAll] = useState(false)

  const hideWhenVisible = { display : showAll ? 'none' : '' }
  const showWhenVisible = { display : showAll ? '' : 'none' }
  const showIfCorrectUser = { display : user.id === blog.user.id ? '' : 'none' }

  return (
    <div className='basicInfo' style={blogStyle}>
      {blog.title}  {blog.author}
      <div style={hideWhenVisible}>
        <button onClick={() => setShowAll(true)}>view</button>
      </div>
      <div className='moreInfo' style={showWhenVisible}>
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
          <button onClick={() => removeBlog(blog, blogs)}>remove</button>
        </div>
        <button onClick={() => setShowAll(false)}>hide</button>
      </div>
    </div>
  )
}

export default Blog