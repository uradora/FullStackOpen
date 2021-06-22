import anecdoteService from '../services/anecdotes'

const anecdoteReducer = (state = [], action) => {
  switch (action.type) {
    case 'VOTE':
      const votedAnecdote = action.data.votedAnecdote
      return state.map(anecdote =>
        anecdote.id !== votedAnecdote.id ? anecdote : votedAnecdote).sort((anecdote, next) => {
          return next.votes - anecdote.votes
        })
    case 'NEW_ANECDOTE':
      return state.concat(action.data)
    case 'INIT_ANECDOTES':
      return action.data
    default:
      return state
  }
}

export const addVote = anecdote => {
  return async dispatch => {
    const votedAnecdote = {
      ...anecdote,
      votes: anecdote.votes + 1
    }
    await anecdoteService.updateAnecdote(votedAnecdote)
    dispatch({
      type: 'VOTE',
      data: { votedAnecdote }
    })
  }
}

export const addAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch({ 
      type: 'NEW_ANECDOTE', 
      data: { 
        content: newAnecdote.content,
        id: newAnecdote.id,
        votes: 0 
      }
    })
  }
}

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch({
      type: 'INIT_ANECDOTES',
      data: anecdotes
    })
  }
}

export default anecdoteReducer
