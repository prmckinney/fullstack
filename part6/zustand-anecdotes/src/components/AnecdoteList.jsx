import { useAnecdotes, useAnecdoteControl } from './Store'

const AnecdoteList = () => {
  const anecdotes = useAnecdotes()
  const { vote } = useAnecdoteControl()

  const sortedAnecdotes = anecdotes.toSorted((a, b) => b.votes - a.votes);
  console.log("anecdotes ==> ", anecdotes);
  console.log("sortedAnecdotes ==> ", sortedAnecdotes);

  return (
    <div>
      <h2>Anecdotes</h2>
      {sortedAnecdotes.map(anecdote => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList