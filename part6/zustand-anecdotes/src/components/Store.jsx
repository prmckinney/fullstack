import { create } from 'zustand'

const generateId = () => Number((Math.random() * 1000000).toFixed(0))

const useAnecdoteStore = create(set => ({
  anecdotes: [{id:0, content:"Anecdote One", votes:0}, {id:1, content:"Anecdote Two", votes:2}],
  filter: '',
  actions: {
    setFilter: content => set(() => ({ filter: content})),
    add: content => set(state => ({ anecdotes: [...state.anecdotes, {content: content, votes: 0, id: generateId()}] })),
    vote: id => set(state => ({ anecdotes: state.anecdotes.map(ancedote => ancedote.id === id ? {...ancedote, votes: ancedote.votes+1}: ancedote) })),
  }  
}))

// the hook functions that are used elsewhere in app
export const useAnecdotes = () => {
  const anecdotes = useAnecdoteStore((state) => state.anecdotes)
  const filter = useAnecdoteStore((state) => state.filter)
  return anecdotes.filter(anecdote => anecdote.content.includes(filter))
  //return anecdotes
}

export const useAnecdoteControl = () => useAnecdoteStore(state => state.actions)