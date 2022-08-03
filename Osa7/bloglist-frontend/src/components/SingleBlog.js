import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Container, Button } from '@mui/material'

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
    <Container>
      <h2>{blog.title}  {blog.author}</h2>
      <div>
        {blog.url}
      </div>
      <div>
        likes {blog.likes}
        <Button variant='outlined' onClick={() => addLike(blog)}>like</Button>
      </div>
      <div>
        added by {blog.user.name}
      </div>
      <div style={showIfCorrectUser}>
        <Button variant='outlined' onClick={() => removeBlog(blog, blogs)}>remove</Button>
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
          <Button variant='outlined' id='addcomment' type='submit'>comment</Button>
        </form>
      </div>
      <div>
        comments: {(blog.comments ?? []).map(comment =>
          <li key={comment}>
            {comment}
          </li>)}
      </div>
    </Container>
  )

}

export default SingleBlog