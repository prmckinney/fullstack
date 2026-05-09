import { create } from 'zustand'
import anecdoteService from '../services/anecdotes'

const useAnecdoteStore = create(set => ({
  anecdotes: [],
  filter: '',
  actions: {
    initialize: async () => {
      const anecdotes = await anecdoteService.getAll()
      set(() => ({ anecdotes }))
    },
    setFilter: content => set(() => ({ filter: content })),
    add: async content => {
      const newAnecdote = await anecdoteService.createNew(content)
      set(state => ({ anecdotes: [...state.anecdotes, newAnecdote] }))
    },
    remove: async id => {
      //const anecdote = useAnecdoteStore.getState().anecdotes.find(anecdote => anecdote.id === id)
      anecdoteService.remove(id)
      set(state => ({ anecdotes: state.anecdotes.filter(ancedote => ancedote.id !== id) }))
    },
    vote: async id => {
      const anecdote = useAnecdoteStore.getState().anecdotes.find(anecdote => anecdote.id === id)
      const updatedAncedote = { ...anecdote, votes: anecdote.votes + 1 }
      anecdoteService.update(updatedAncedote)
      set(state => ({ anecdotes: state.anecdotes.map(ancedote => ancedote.id === id ? updatedAncedote : ancedote) }))
    },
  }
}))

const useNotificationStore = create(set => ({
  notification: null,
  actions: {
    setNotification: notification => set(() => ({ notification: notification }))
  }
}))

// the hook functions that are used elsewhere in app
export const useAnecdotes = () => {
  const anecdotes = useAnecdoteStore((state) => state.anecdotes)
  const filter = useAnecdoteStore((state) => state.filter)
  return anecdotes.filter(anecdote => anecdote.content.includes(filter))
}

export const useAnecdoteControl = () => useAnecdoteStore(state => state.actions)

export const useNotification = () => useNotificationStore(state => state.notification)
export const useNotificationControl = () => useNotificationStore(state => state.actions)