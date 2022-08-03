import React, { useState } from 'react'
import PropTypes from 'prop-types'

const AddBlogForm = ({ createBlog }) => {

  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl,
      likes: 0,
      comments: []
    })
    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }
  return (
    <div>
      <h2>create new</h2>
      <div>
        <form onSubmit={addBlog} id='form' >
          <div>
            title
            <input
              id='title'
              type='text'
              value={newTitle}
              name='Title'
              onChange={({ target }) => setNewTitle(target.value)}
            />
          </div>
          <div>
            author
            <input
              id='author'
              type='text'
              value={newAuthor}
              name='Author'
              onChange={({ target }) => setNewAuthor(target.value)}
            />
          </div>
          <div>
            url
            <input
              id='url'
              type='text'
              value={newUrl}
              name='Url'
              onChange={({ target }) => setNewUrl(target.value)}
            />
          </div>
          <button id='createblog' type='submit'>create</button>
        </form>
      </div>
    </div>
  )
}

AddBlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired,
}

export default AddBlogForm
