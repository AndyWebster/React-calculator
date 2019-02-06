import React, { Component } from "react";
import "./App.css";
const math = require("mathjs");

const buttons = [
  { key: "1", id: "one", type: "number" },
  { key: "2", id: "two", type: "number" },
  { key: "3", id: "three", type: "number" },
  { key: "4", id: "four", type: "number" },
  { key: "5", id: "five", type: "number" },
  { key: "6", id: "six", type: "number" },
  { key: "7", id: "seven", type: "number" },
  { key: "8", id: "eight", type: "number" },
  { key: "9", id: "nine", type: "number" },
  { key: "0", id: "zero", type: "number" },
  { key: ".", id: "decimal", type: "decimal" },
  { key: "+", id: "add", type: "operator" },
  { key: "-", id: "subtract", type: "operator" },
  { key: "*", id: "multiply", type: "operator" },
  { key: "/", id: "divide", type: "operator" },
  { key: "=", id: "equals", type: "equals" },
  { key: "C", id: "clear", type: "clear" }
];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      display: "0",
      input: "",
      result: ""
    };
    this.keyHandler = this.keyHandler.bind(this);
  }

  keyHandler(e) {
    switch (e.type) {
      case "clear":
        this.clearHandler();
        break;
      case "operator":
        if (this.isValidOperator(e.key)) {
          if (!(this.state.result === "") && this.state.input === "") {
            console.log("Setting prev result: " + +" to input and operating");
            this.setState({ input: this.state.result }, () => this.appendKey(e.key));
          } else {
            this.appendKey(e.key);
          }
        }
        break;
      case "number":
        if (this.isValidNumber(e.key)) {
          this.appendKey(e.key);
        }
        break;
      case "decimal":
        if (this.isValidDecimal()) {
          this.appendKey(e.key);
        }
        break;
      case "equals":
        this.validate();
    }
  }

  validate(input = this.state.input) {
    console.log("validating input: " + input);
    let lastKey = input[input.length - 1];
    if ("+-/*.".includes(lastKey)) {
      console.log("found " + lastKey + " is operator");
      let newInput = input.slice(0, input.length - 1);
      console.log("removed " + lastKey + " to produce input: " + newInput);
      this.validate(newInput);
    } else {
      console.log("input valid, setting state: " + input);
      this.setState({ input: input }, this.resultHandler);
    }
  }

  appendKey(key) {
    console.log("appending:" + key);
    let newInput = this.state.input.concat(key);
    console.log("newInput: " + newInput);
    this.setState({
      input: newInput,
      display: newInput
    });
  }

  clearHandler() {
    console.log("Clearing state");
    this.setState({ display: "0", input: "", result: "" });
  }

  resultHandler() {
    let input = this.state.input;
    console.log("evaluating expression: " + input);
    if (input.length) {
      let evalInput = math.eval(input).toString();
      console.log("expression evaluated: " + evalInput);
      console.log(this.state);
      this.setState({ display: evalInput, input: "", result: evalInput }, () => console.log(this.state));
    }
  }

  isValidOperator(key) {
    let { input, result } = this.state;
    let lastKey = input[input.length - 1];

    // if hit none && !result is empty, return false
    // if hit operator, set state delete last operator, return true as callback
    // if hit dec, return false
    // if hit num, return true
    if (input === "" && result === "") {
      return false;
    } else if ("+-/*".includes(lastKey)) {
      let newInput = input.slice(0, input.length - 1);
      return this.setState({ input: newInput }, () => {
        //  TODO, remove append call and return bool
        this.appendKey(key);
      });
    } else if (lastKey === ".") {
      return false;
    } else {
      return true;
    }
  }
  isValidNumber(key) {
    // if zero, isValidZero()
    // else true
    if (key === "0") {
      return this.isValidZero();
    } else {
      return true;
    }
  }
  isValidZero(count = 0) {
    // recursively check back from end of string.

    // else true
    let input = this.state.input;
    let prevKey = input[input.length - (1 + count)];
    console.log("Prev: " + prevKey);

    if ("123456789".includes(prevKey)) {
      return true;
    } else if (prevKey === "0") {
      return this.isValidZero(count + 1);
    } else if (!(prevKey === 0) && !count) {
      return true;
    } else {
      return false;
    }
  }
  isValidDecimal(count = 0) {
    // recursively check back from end of string.
    // if hit dec, return false
    // else return true
    let input = this.state.input;
    let prevKey = input[input.length - (1 + count)];

    if (prevKey === ".") {
      return false;
    } else if ("123456789".includes(prevKey)) {
      return this.isValidDecimal(count + 1);
    } else {
      return true;
    }
  }

  render() {
    return (
      <div className="App bg-secondary h-100 container-fluid d-flex justify-content-center align-items-center">
        <div id="calculator" className="p-3 bg-dark card rounded d-flex justify-content-center align-items-center w-50">
          <h1 className="card-title text-light">Javascript Calculator</h1>
          <Display value={this.state.display} />
          <ButtonPad keyHandler={this.keyHandler} />
        </div>
      </div>
    );
  }
}

const ButtonPad = props => {
  let myButtons = buttons.map(x => (
    <button id={x.id} onClick={() => props.keyHandler(x)} className="btn btn-secondary grid-item">
      {x.key}
    </button>
  ));
  return (
    <div id="button-pad" className="grid-container">
      {myButtons}
    </div>
  );
};

const Display = props => {
  return (
    <div
      className="w-100 card m-2 bg-light d-flex justify-content-center align-items-center"
      style={{ height: "2.5rem" }}
    >
      <p className="text-primary m-0 text-center">
        <strong id="display">{props.value}</strong>
      </p>
    </div>
  );
};

export default App;
