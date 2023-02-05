import "./App.css";
import { useReducer } from "react";
import { evaluate } from "mathjs";
import Button from "./components/Button";
import Screen from "./components/Screen";

//Calculator rows to map over and display the buttons
const BUTTONS = {
  "first-row": {
    "chars": ["7", "8", "9", "/"],
    "ids": ["seven", "eight", "nine", "divide"]
  },
  "second-row": {
    "chars": ["4", "5", "6", "*"],
    "ids": ["four", "five", "six", "multiply"]
  },
  "third-row": {
    "chars": ["1", "2", "3", "-"],
    "ids": ["one", "two", "three", "subtract"]
  },
  "fourth-row": {
    "chars": ["0", ".", "=", "+"],
    "ids": ["zero", "decimal", "equals", "add"]
  },
  "fifth-row": {
    "chars": ["Clear"],
    "ids": ["clear"]
  }
};

//Math operators
const OPERATORS = ["+", "-", "/", "*"];

function reducer(state, action) {
  //Unchanged state
  const originalState = {
    calculation: state.calculation,
    currentNum: state.currentNum,
    pressedBtn: state.pressedBtn
  }
  switch (action.type) {
    //When clear button is pressed
    case "clear":
      return {
        calculation: "0",
        currentNum: "0",
        pressedBtn: ""
      }
    //When equal button is pressed
    case "evaluate":
      //If last value is a number, operate and return
      if (/[0-9]+$/.test(state.calculation)) {
        const evalResult = evaluate(state.calculation).toString()
        return {
          calculation: evalResult,
          currentNum: "0",
          pressedBtn: action.payload
        }
      } else return originalState;
    //When decimal button is pressed
    case "decimal":
      //Split operation string by decimal
      const calcSplit = state.calculation.split(/[^0-9.]/g)
      //Get last operation part 
      const lastNum = calcSplit.slice(-1)[0]
      //Check if last part doesn't contain a decimal so a decimal can be added, otherwise return original state
      if (!lastNum.includes(".")) {
        return {
          calculation: state.calculation + action.payload,
          currentNum: state.calculation + action.payload,
          pressedBtn: action.payload
        }
      } else return originalState;
    //When any other button is pressed (numbers or operators)
    default:
      //Operation and current value state to be returned
      let result = undefined;
      //If an operator was pressed
      if (OPERATORS.includes(action.payload)) {
        //And if the last pressed button is in the operators array and it's not a minus (so that negative numbers are accepted)
        if (action.payload !== "-") {
          //Get the position of last numbers entered
          const lastNumIndex = state.calculation.split("").reverse().findIndex(char => char !== " " && /[0-9]+/.test(+char))
          //Return last numbers entered with new operator pressed
          result = state.calculation.slice(0, state.calculation.length - lastNumIndex) + action.payload;
        } else {
          //Check so that no more than two subsequent minus are added
          const lastOpIndex = state.calculation.length - 1
          if(state.calculation[lastOpIndex] !== state.calculation[lastOpIndex - 1] || 
              state.calculation[lastOpIndex] !== "-" || state.calculation[lastOpIndex - 1] !== "-"){
            result = state.calculation + action.payload
          } else {
            result = state.calculation
          }
        }
      } else {
        //If a number was pressed, return it (doesn't allow multiple zeros)
        result = state.currentNum === "0" ? action.payload : state.currentNum + action.payload
      }
      return {
        calculation: result,
        currentNum: result,
        pressedBtn: action.payload
      }
  }
}

function App() {
  const [input, dispatch] = useReducer(
    reducer,
    //Last button pressed - Operation - Current value
    { pressedBtn: "", calculation: "0", currentNum: "0" }
  );
  //Handles when buttons are clicked
  const handleClick = value => {
    switch (value) {
      case "Clear":
        return dispatch({ type: "clear", payload: value })
      case "=":
        return dispatch({ type: "evaluate", payload: value })
      case ".":
        return dispatch({ type: "decimal", payload: value })
      default:
        return dispatch({ type: "", payload: value })
    }
  };

  return (
    <div className="App">
      <div className="calculator-container">
        <Screen input={input.calculation}/>
        {/* Map over the object to create the calculator rows and buttons */}
        {Object.keys(BUTTONS).map((row) => {
          return (
            <div key={row} className="calc-row">
              {BUTTONS[row]["chars"].map((char, i) => {
                return (
                  <Button
                    key={BUTTONS[row]["ids"][i]}
                    id={BUTTONS[row]["ids"][i]}
                    handleClick={handleClick}>
                    {char}
                  </Button>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  );
}

export default App;
