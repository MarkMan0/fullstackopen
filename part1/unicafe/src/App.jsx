import { useState } from 'react'

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h2>give feedback</h2>
      <Button text={"good"} onClick={() => setGood(good+1)}/>
      <Button text={"neutral"} onClick={() => setNeutral(neutral+1)}/>
      <Button text={"bad"} onClick={() => setBad(bad+1)}/>
      <h2>statistics</h2>
      <Stats good={good} neutral={neutral} bad={bad}/>
    </div>
  )
}

const Button = ({text, onClick}) => {
  return (
    <button onClick={onClick}>{text}</button>
  )
}

const Stats = ({good, neutral, bad}) => {
  const count = good + neutral + bad;

  if (count === 0) {
    return <div>No feedback given</div>
  }

  const sum = good - bad;
  const mean = sum / count;
  const positiveRatio = (100*good/count) + "%";

  return (
    <table>
      <tbody>
      <StatLine text={"good"} value={good}/>
      <StatLine text={"neutral"} value={neutral}/>
      <StatLine text={"bad"} value={bad}/>
      <StatLine text={"all"} value={count}/>
      <StatLine text={"average"} value={mean}/>
      <StatLine text={"positive"} value={positiveRatio}/>
      </tbody>
    </table>
  )
}

const StatLine = ({text, value}) => (
  <tr>
    <td>{text}</td>
    <td>{value}</td>
  </tr>
)


export default App
