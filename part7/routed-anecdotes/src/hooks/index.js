import { useState, useEffect } from 'react'
import anecdoteService from '../services/anecdotes'

export const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}

export const useAnecdotes = () => {
  const [anecdotes, setAnecdotes] = useState([])

  useEffect(() => {
    anecdoteService.getAll().then(data => setAnecdotes(data))
  }, [])

  const addAnecdote = async (anecdote) => {
    const newAnecdote = await anecdoteService.createNew(anecdote)
    setAnecdotes([...anecdotes, newAnecdote])
  }

  const deleteAnecdote = async (id) => {
    await anecdoteService.deleteId(id)
    setAnecdotes(anecdotes.filter(ancedote => ancedote.id !== id))
  }

  return {
    anecdotes,
    setAnecdotes,
    addAnecdote,
    deleteAnecdote
  }
}

export default { useField, useAnecdotes }