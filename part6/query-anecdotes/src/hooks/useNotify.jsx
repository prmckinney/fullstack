import { useContext } from 'react'
import NotifyContext from '../NotifyContext'

const useNotify = () => useContext(NotifyContext)

export default useNotify