import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { TextField, Button, Box } from '@mui/material'

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
          <Box m={2} pt={3}>
            <TextField label ='title'
              id='author'
              type='text'
              value={newAuthor}
              name='Author'
              onChange={({ target }) => setNewTitle(target.value)}
            />
          </Box>
          <Box m={2} pt={3}>
            <TextField label ='author'
              id='author'
              type='text'
              value={newAuthor}
              name='Author'
              onChange={({ target }) => setNewAuthor(target.value)}
            />
          </Box>
          <Box m={2} pt={3}>
            <TextField label ='url'
              id='url'
              type='text'
              value={newUrl}
              name='Url'
              onChange={({ target }) => setNewUrl(target.value)}
            />
          </Box>
          <Box m={2} pt={3}>
            <Button variant='outlined' type='submit'>create</Button>
          </Box>
        </form>
      </div>
    </div>
  )
}

AddBlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired,
}

export default AddBlogForm
