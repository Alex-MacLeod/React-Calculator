import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Button(props) {
    return (
        <button className="btn" onClick={() => props.onClick()}>
            {props.value}
        </button>
    );
}

function Clear(props) {
    return (
        <button className="clear" onClick={() => props.onClick()}>
            {props.value}
        </button>
    );
}

function Display(props) {
   return (
        <span className="display">
            {props.value}
        </span>
   );
}

class Calculator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            displayed: 0,   //value on display
            arguments: [null, null, null],    //number 1, number 2, operation
            reset: true,    //display resets/adds
        };
    }
  
  updateDisplay(output) {   //update display
    let str = output.toString();
    if (str.charAt(str.length-5)==="e") {
        output = "MATH ERROR";
    }
    this.setState({displayed: output,});
  }
  
  evaluate(args) {    //calculate solution to problem defined by args
    if (args[0] !== null && args[1] !== null && args[2] !== null) {
        let result = "";
        args[0] = args[0] * 1;  //ensure numeric, not string
        args[1] = args[1] * 1;  //ensure numeric, not string
        switch (this.state.arguments[2]) {
            case "+":                   //adding
              result = args[0] + args[1];
              break;
            case "-":                   //subtracting
              result = args[0] - args[1];
              break;
            case "x":                   //multiplying
              result = args[0] * args[1];
              break;
            case "/":                   //dividing
              result = args[0] / args[1];
              break;
            default:                    //ERROR
              result = "ERROR";
        }
      this.updateDisplay(result);
      args[0] = result;   //save answer to be used in subsequent calculation
      args[1] = null;
      args[2] = null;
      this.setState({arguments: args, reset: true,});  //return to default
    }   // if only args[0]...
  }
  
  handleNumber(i) {   //manages adding numbers to display
    if ( !(this.state.reset)) {
        let output = this.state.displayed.toString();
        output += i;
        if (output.length >= 21 || output.charAt(0)==="M") {
           output = "MATHS ERROR";    //if too long or already error, shows this
        }
        this.updateDisplay(output);   //add number to display
    } else {
        this.updateDisplay(i);        //replace display value with number
        if (this.state.displayed===0 && i === 0) {
          this.setState({reset: true,});
        } else {
          this.setState({reset: false,});
        }
    }
  }
  
  handleOperation(op) {   //manages operations
    let args = this.state.arguments.slice();
    if (op !== "=" && op !== "." && op !== "+/-") { //i.e. calculations
        this.setState({reset: true,});         //allow 2nd number to be entered
        if (args[0]!==this.state.displayed) {  //displayed value -> 1st arg
            args[0] = this.state.displayed;   //unless 1st already present
        }
        args[2] = op;                         //operation -> 3rd arg
        this.setState({arguments: args,});
    } else if (op === ".") {                  //add decimal point
        let value = this.state.displayed.toString();
        if (this.state.reset) {        //if writing new number, replace old
          value = 0;                    //with 0 to write 0.xxxxxx
        }
        value += op;
        this.updateDisplay(value);
        this.setState({reset: false,});   //enable adding digits to decimal
    } else if (op === "+/-") {              //switch sign
        let value = this.state.displayed.toString();
        if (value > 0 && !(this.state.reset)) {   
          value = "-" + value;            //change +ives to -ives
        } else if (value < 0 && !(this.state.reset)) {
          value = value.substring(1,value.length);  //change -ives to +ives
        } else {
          value = "-";                    //if writing new number
          this.setState({reset: false,});
        }
        this.updateDisplay(value);
    } else {                           //equals
        args[1] = this.state.displayed;   //displayed -> 2nd arg
        this.evaluate(args);
    }
  }
  
  clear() {                   //manages clear
    this.updateDisplay(0);      //clears display. returns to 0
    this.setState({reset: true,});    //allow writing new number
  }

  renderNumber(i) {       //number buttons
    return <Button value={i} onClick={() => this.handleNumber(i)}/>;
  }
  
  renderDisplay() {       //display
    return <Display value={this.state.displayed} />;
  }
  
  renderButton(op) {      //operation buttons
    return <Button value={op} onClick={() => this.handleOperation(op)}/>;
  }
  
  renderClear() {         //clear button
    return <Clear className="clear" value={"C"} onClick={() => this.clear()}/>;
  }

  render() {      //build calculator frame
    return (
      <div>
        <div>
          <div className="board-row">
            {this.renderDisplay()}
          </div>
        </div>
        <div className="invisible">`</div>
        <div>
          <div className="board-row">
            {this.renderClear()}
            {this.renderButton("/")}
          </div>
          <div className="board-row">
            {this.renderNumber(7)}
            {this.renderNumber(8)}
            {this.renderNumber(9)}
            {this.renderButton("x")}
          </div>
          <div className="board-row">
            {this.renderNumber(4)}
            {this.renderNumber(5)}
            {this.renderNumber(6)}
            {this.renderButton("+")}
          </div>
          <div className="board-row">
            {this.renderNumber(1)}
            {this.renderNumber(2)}
            {this.renderNumber(3)}
            {this.renderButton("-")}
          </div>
          <div className="board-row">
            {this.renderButton(".")}
            {this.renderNumber(0)}
            {this.renderButton("+/-")}
            {this.renderButton("=")}
          </div>
        </div>
      </div>
    );
  }
}

class App extends React.Component {
  render() {
    return (
        <div className="app">
          <Calculator className="calculator"/>
        </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <App />,
  document.getElementById('root')
);