import { connect } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'
import { showNotification } from '../reducers/notificationReducer'

const AnecdoteForm = (props) => {
    const addNew = async (event) => {
        event.preventDefault()
        const content = event.target.anecdote.value
        event.target.anecdote.value = ''
        props.createAnecdote(content)
        props.showNotification(`created new anecdote '${content}'`, 10)
    }

  return (
    <form onSubmit={addNew}>
        <div><input name='anecdote'/></div>
        <button type='submit'>create</button>
    </form>
  )

}

const mapDispatchToProps = {
  createAnecdote,
  showNotification
}

const ConnectedAnecdoteForm = connect(
  null,
  mapDispatchToProps
)(AnecdoteForm)

export default ConnectedAnecdoteForm

