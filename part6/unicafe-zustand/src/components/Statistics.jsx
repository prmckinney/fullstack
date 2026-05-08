import { useFeedbackGood, useFeedbackNeutral, useFeedbackBad } from './store'

const Statistics = () => {
  const good = useFeedbackGood()
  const neutral = useFeedbackNeutral()
  const bad = useFeedbackBad()
  const all = good + neutral + bad

  if (all === 0) {
    return (
      <div>
        <h1>statistics</h1>
        <div>No feedback given</div>
      </div>
    )
  }
  const average = (good - bad)/all
  const positive = `${good * 100 / all} %`
  
  return (
    <div>
      <h2>statistics</h2>
      <table>
        <tbody>
          <tr><td>good</td><td>{good}</td></tr>
          <tr><td>neutral</td><td>{neutral}</td></tr>
          <tr><td>bad</td><td>{bad}</td></tr>
          <tr><td>all</td><td>{all}</td></tr>
          <tr><td>average</td><td>{average}</td></tr>
          <tr><td>positive</td><td>{positive}</td></tr>
        </tbody>
      </table>
    </div>
  )
}

export default Statistics
