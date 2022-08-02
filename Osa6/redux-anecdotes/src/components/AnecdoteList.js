import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { vote } from '../reducers/anecdoteReducer'
import { showNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(state => state.anecdotes)
  const filter = useSelector(state => state.filter)

  const sortedAnecdotes = [...anecdotes].sort((anecdote, next) => next.likes - anecdote.likes)
  
  const anecdotesToShow = filter === ''
    ? sortedAnecdotes
    : sortedAnecdotes.filter(
        (anecdote) =>
        anecdote.content.toLowerCase().includes(filter.toLowerCase()) === true
    )
  const handleClick = (anecdote, anecdotes) => {
    dispatch(vote(anecdote, anecdotes))
    dispatch(showNotification(`voted anecdote '${anecdote.content}'`, 10))
    
  }
  return (
    <div>
      {anecdotesToShow.map(anecdote => (
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleClick(anecdote, anecdotesToShow)}>vote</button>
          </div>
        </div>
    ))}
    </div>
    )
}

export default AnecdoteList