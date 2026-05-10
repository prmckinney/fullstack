import { useAnecdotes } from '../hooks/useAnecdotes'
import useNotify from '../hooks/useNotify'

const AnecdoteForm = () => {
  const { addAnecdote } = useAnecdotes()
  const { notify } = useNotify()

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.reset()
    if (content.length >= 5)
      addAnecdote(content)
    else
      notify(`too short... anecdote must be at least 5 characters long`)
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm