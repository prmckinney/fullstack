import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'

vi.mock('../services/anecdotes', () => ({
  default: {
    getAll: vi.fn(),
    createNew: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  }
}))

import anecdoteService from '../services/anecdotes'
import useAnecdoteStore, { useAnecdotes, useAnecdoteControl } from './store'

beforeEach(() => {
  useAnecdoteStore.setState({ anecdotes: [], filter: '' })
  vi.clearAllMocks()
})

describe('useAnecdoteActions', () => {
  it('initialize loads anecdotes from service', async () => {
    const mockAnecdotes = [{ id: 1, content: 'Test', votes: 12 }]
    anecdoteService.getAll.mockResolvedValue(mockAnecdotes)

    const { result: controls } = renderHook(() => useAnecdoteControl())

    await act(async () => {
      await controls.current.initialize()
    })

    const { result: anecdotesResult } = renderHook(() => useAnecdotes())
    expect(anecdotesResult.current).toEqual(mockAnecdotes)
  })

  it('Returns in order of votes', async () => {
    const mockAnecdotes = [{ id: 1, content: 'Mid', votes: 12 }, { id: 2, content: 'Least', votes: 0 }, { id: 3, content: 'Most', votes: 19 }]
    anecdoteService.getAll.mockResolvedValue(mockAnecdotes)

    const { result: controls } = renderHook(() => useAnecdoteControl())

    await act(async () => {
      await controls.current.initialize()
    })

    const { result: anecdotesResult } = renderHook(() => useAnecdotes())
    expect(anecdotesResult.current[0]).toEqual(mockAnecdotes[2])
    expect(anecdotesResult.current[1]).toEqual(mockAnecdotes[0])
    expect(anecdotesResult.current[2]).toEqual(mockAnecdotes[1])
  })

  it('Can increase number of votes', async () => {
    const mockAnecdotes = [{ id: 1, content: 'Test', votes: 0 }]
    anecdoteService.getAll.mockResolvedValue(mockAnecdotes)

    const { result: controls } = renderHook(() => useAnecdoteControl())

    await act(async () => {
      await controls.current.initialize()
      await controls.current.vote(1)
      await controls.current.vote(1)
    })

    const { result: anecdotesResult } = renderHook(() => useAnecdotes())
    console.log("result ==> ", anecdotesResult);
    expect(anecdotesResult.current[0].votes).toEqual(2)
  })


  describe('Verify filter', () => {
    it('Filter matches both', async () => {
      const mockAnecdotes = [{ id: 1, content: 'Test', votes: 12 }, { id: 2, content: 'Best', votes: 10 }]
      anecdoteService.getAll.mockResolvedValue(mockAnecdotes)

      const { result: controls } = renderHook(() => useAnecdoteControl())

      await act(async () => {
        await controls.current.initialize()
        await useAnecdoteStore.setState({ filter: 'est' })
      })

      const { result: anecdotesResult } = renderHook(() => useAnecdotes())
      expect(anecdotesResult.current).toHaveLength(2)
    })

    it('Filter matches first one only', async () => {
      const mockAnecdotes = [{ id: 1, content: 'Test', votes: 12 }, { id: 2, content: 'Best', votes: 10 }]
      anecdoteService.getAll.mockResolvedValue(mockAnecdotes)

      const { result: controls } = renderHook(() => useAnecdoteControl())

      await act(async () => {
        await controls.current.initialize()
        await useAnecdoteStore.setState({ filter: 'Test' })
      })

      const { result: anecdotesResult } = renderHook(() => useAnecdotes())
      expect(anecdotesResult.current).toHaveLength(1)
      expect(anecdotesResult.current).toEqual([mockAnecdotes[0]])
    })
  })
})