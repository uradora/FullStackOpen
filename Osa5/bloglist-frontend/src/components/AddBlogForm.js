import React, { useState } from 'react'

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
    })
    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }
  return (
    <div>
    <h2>create new</h2>
      <div>
        <form onSubmit={addBlog}>
          <div>
            title
            <input
              type='text'
              value={newTitle}
              name='Title'
              onChange={({ target }) => setNewTitle(target.value)}
            />
          </div>
          <div>
            author
            <input
              type='text'
              value={newAuthor}
              name='Author'
              onChange={({ target }) => setNewAuthor(target.value)}
            />
          </div>
          <div>
            url
            <input
              type='text'
              value={newUrl}
              name='Url'
              onChange={({ target }) => setNewUrl(target.value)}
            />
          </div>
          <button type='submit'>create</button>
        </form>
      </div>
    </div>
  )
}

export default AddBlogForm
