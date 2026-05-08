import { create } from 'zustand'

const generateId = () => Number((Math.random() * 1000000).toFixed(0))

const useAnecdoteStore = create(set => ({
  anecdotes: [{id:0, content:"One", votes:0}, {id:1, content:"Two", votes:2}],
  actions: {
    add: content => set(state => ({ anecdotes: [...state.anecdotes, {content: content, votes: 0, id: generateId()}] })),
    vote: id => set(state => ({ anecdotes: state.anecdotes.map(ancedote => ancedote.id === id ? {...ancedote, votes: ancedote.votes+1}: ancedote) })),
  }  
}))

// the hook functions that are used elsewhere in app
export const useAnecdotes = () => useAnecdoteStore(state => state.anecdotes)
export const useAnecdoteControl = () => useAnecdoteStore(state => state.actions)