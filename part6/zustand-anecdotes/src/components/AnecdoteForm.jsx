import { useAnecdoteControl } from './Store'

const AnecdoteForm = () => {
  const { add } = useAnecdoteControl()

  const addAnecdote = (e) => {
    e.preventDefault()
    const content = e.target.anecdote.value
    add(content)
    e.target.reset()
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div>
          <input name="anecdote"/>
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm