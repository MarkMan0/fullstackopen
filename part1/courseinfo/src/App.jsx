import { useState } from "react"

const App = () => {

  return (
    <div>
      <CoursesApp/>
      <CounterApp/>
      <LeftRightApp/>
    </div>
  )
}

const CoursesApp = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }


  return (
    <div>
      <Header course={course}/>
      <Content course={course}/>
      <Total course={course}/>
    </div>
  )
}

const Header = (props) => {
  return (
    <div>
      <h1>{props.course.name}</h1>
    </div>
  )
}

const Content = (props) => {
  const parts = props.course.parts;
  return (
    <div>
      <Part part={parts[0]}/>
      <Part part={parts[1]}/>
      <Part part={parts[2]}/>
    </div>
  )
}

const Part = (props) => {
  return (
    <div>
      <p>{props.part.name} {props.part.exercises}</p>
    </div>
  )
}

const Total = (props) => {
  const total = props.course.parts.reduce((cnt, part) => cnt + part.exercises, 0)
  return (
    <div>
      <p>Number of exercises {total}</p>
    </div>
  )
}

const CounterApp = () => {
  const [counter, setCounter] = useState(0);

  const increment = () => setCounter(counter + 1);
  const decrement = () => setCounter(counter - 1);
  const zero = () => setCounter(0);

  return (
    <div>
      <Display counter={counter}/>
      <Button text="plus" onClick={increment}/>
      <Button text="minus" onClick={decrement}/>
      <Button text="zero" onClick={zero}/>
    </div>
  )
}

const Display = ({counter}) => <div>{counter}</div>

const Button = ({text, onClick}) => <button onClick={onClick}>{text}</button>

const History = ({allClicks}) => {
  if (allClicks.length === 0) {
    return <div>the app is used by pressing the buttons</div>
  } else {
    return <div>Button press history: {allClicks.join(" ")}</div>
  }
}

const LeftRightApp = () => {
  const [left, setLeft] = useState(0);
  const [right, setRight] = useState(0);
  const [allClicks, setAllClicks] = useState([]);

  const handleLeft = () => {
    setLeft(left + 1)
    setAllClicks(allClicks.concat("L"))
  }
  const handleRight = () => {
    setRight(right + 1)
    setAllClicks(allClicks.concat("R"))
  }

  return (
    <div>
      {left}
      <Button onClick={handleLeft} text={"Left"}/>
      <Button onClick={handleRight} text={"Right"}/>
      {right}
      <History allClicks={allClicks}/>
    </div>
  )
}



export default App
