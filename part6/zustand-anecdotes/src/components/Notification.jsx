import { useNotification } from './Store'

const Notification = () => {
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 10
  }

  const notification = useNotification()

  return (notification) && <div style={style}>{notification}</div>
}

export default Notification