import { create } from 'zustand'

const useFeedbackStore = create(set => ({
  good: 0,
  neutral: 0,
  bad: 0,
  actions: {
    incrementGood: () => set(state => ({ good: state.good + 1 })),
    incrementNeutral: () => set(state => ({ neutral: state.neutral + 1 })),
    incrementBad: () => set(state => ({ bad: state.bad + 1 })),
  }  
}))

// the hook functions that are used elsewhere in app
export const useFeedbackGood = () => useFeedbackStore(state => state.good)
export const useFeedbackNeutral = () => useFeedbackStore(state => state.neutral)
export const useFeedbackBad = () => useFeedbackStore(state => state.bad)
export const useFeedbackControls = () => useFeedbackStore(state => state.actions)