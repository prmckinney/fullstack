import { useAnecdoteControl, useNotificationControl } from './Store'

const AnecdoteForm = () => {
  const { add } = useAnecdoteControl()
  const { setNotification } = useNotificationControl()

  const addAnecdote = async (e) => {
    e.preventDefault()
    add(e.target.anecdote.value)
    setNotification(`You added ${e.target.anecdote.value}`)
    setTimeout(() => {
      setNotification(null)
    }, 5000)

    e.target.reset()
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div>
          <input name="anecdote" />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm