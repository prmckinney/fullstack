import { useAnecdotes } from './hooks/useAnecdotes'
import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import useNotify from './hooks/useNotify'

const App = () => {
  const { anecdotes, isPending, isError, vote } = useAnecdotes()
  const { notify } = useNotify()
  console.log("anecdotes ==> ", anecdotes);

  if (isPending) {
    return <div>loading data...</div>
  }

  if (isError) {
    return <div>Anecdote service is not available due to problems in server</div>
  }

  const handleVote = (anecdote) => {
    vote(anecdote)
    notify(`voted for ${anecdote.content}`)
  }

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default App