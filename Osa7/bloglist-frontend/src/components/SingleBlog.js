import React, { useState } from 'react'
import { useParams } from 'react-router-dom'

const SingleBlog = ({ blogs, user, addLike, removeBlog, addComment }) => {

  const id = useParams().id
  const blog = blogs.find(blog => blog.id === id)

  const [newComment, setNewComment] = useState('')

  if (!blog) {
    return null
  }

  const showIfCorrectUser = { display : user.id === blog.user.id ? '' : 'none' }

  const comment = (event) => {
    event.preventDefault()
    console.log(newComment)
    addComment(blog, newComment)
    setNewComment('')
  }

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
      <div>
        <form onSubmit={comment} id='form' >
          <input
            id='comment'
            type='text'
            value={newComment}
            name='comment'
            onChange={({ target }) => setNewComment(target.value)}
          />
          <button id='addcomment' type='submit'>comment</button>
        </form>
      </div>
      <div>
        comments: {(blog.comments ?? []).map(comment =>
          <li key='comment'>
            {comment}
          </li>)}
      </div>
    </div>
  )

}

export default SingleBlog