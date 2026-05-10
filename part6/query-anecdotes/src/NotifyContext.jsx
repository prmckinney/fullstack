import { createContext, useState } from 'react'

const NotifyContext = createContext()

export default NotifyContext


export const NotifyContextProvider = (props) => {
  const [notification, setNotification] = useState(0)
  const notify = (message) => {
    setNotification(message)
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  return (
    <NotifyContext.Provider value={{ notification, notify }}>
      {props.children}
    </NotifyContext.Provider>
  )
}