import { useAnecdotes, useAnecdoteControl, useNotificationControl } from './Store'

const AnecdoteList = () => {
  const anecdotes = useAnecdotes()
  const { vote, remove } = useAnecdoteControl()
  const { setNotification } = useNotificationControl()

  const sortedAnecdotes = anecdotes.toSorted((a, b) => b.votes - a.votes);

  return (
    <div>
      <h2>Anecdotes</h2>
      {sortedAnecdotes.map(anecdote => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => {
              setNotification(`You voted for ${anecdote.content}`)
              setTimeout(() => {
                setNotification(null)
              }, 5000)
              vote(anecdote.id)
            }}>vote</button>
            {
              (anecdote.votes === 0) ?
                <button onClick={() => {
                  setNotification(`Deleted ${anecdote.content}`)
                  setTimeout(() => {
                    setNotification(null)
                  }, 5000)
                  remove(anecdote.id)
                }}>delete</button>
                : null
            }
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList