import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdoteService'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  },
})

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const vote = (anecdote, anecdotes) => {
  return async dispatch => {
      const id = anecdote.id
      const anecdoteToVote = anecdotes.find(a => a.id === id)
      const votedAnecdote = await anecdoteService.vote(anecdoteToVote)
      const updatedAnecdotes = anecdotes.map(anecdote =>
        anecdote.id !== id ? anecdote : votedAnecdote
      )
      dispatch(setAnecdotes(updatedAnecdotes)) 
  }
}

export const { appendAnecdote, setAnecdotes } = anecdoteSlice.actions
export default anecdoteSlice.reducer
