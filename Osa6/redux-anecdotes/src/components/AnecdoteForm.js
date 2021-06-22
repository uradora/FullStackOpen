import React from 'react'
import { useDispatch } from 'react-redux'
import { addAnecdote } from '../reducers/anecdoteReducer'
import { notificationChange, clearNotification } from '../reducers/notificationReducer'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const newAnecdote = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    dispatch(addAnecdote(content))
    dispatch(notificationChange(`you created ${content}`))
    setTimeout(() => {
      dispatch(clearNotification())
    }, 5000)
  }

  return (
      <form onSubmit={newAnecdote}>
        <input name='anecdote' />
        <button type='submit'>create</button>
      </form>
  )
}

export default AnecdoteForm