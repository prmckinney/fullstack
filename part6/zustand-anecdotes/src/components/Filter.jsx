import { useAnecdoteControl } from './Store'

const Filter = () => {
  const { setFilter } = useAnecdoteControl()

  const handleChange = (event) => {
    // the value of the input field is in event.target.value
    setFilter(event.target.value)
  }
  const style = {
    marginBottom: 10
  }

  return (
    <div style={style}>
      filter <input onChange={handleChange} />
    </div>
  )
}

export default Filter