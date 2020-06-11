import * as React from "react";
import styled from "styled-components";

import Panel from "./Panel";
import History from "./History";
import Display from "./Display";
import ButtonGroup from "./ButtonGroup";
import Button from "./Button";

const Container = styled.div`
  margin: 30px auto;
  text-align: center;
`;

// TODO: History 내에서 수식 표시할 때 사용
const Box = styled.div`
  display: inline-block;
  width: 270px;
  height: 65px;
  padding: 10px;
  border: 2px solid #000;
  border-radius: 5px;
  text-align: right;
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
  margin-bottom: 10px;
  cursor: pointer;
  h3 {
    margin: 0px;
  }
`;
let temp = true;
let index = 0;
const evalFunc = function(string) {
  // eslint-disable-next-line no-new-func
  
  //
  if(string.includes("√")) {
    if(string[2] == "√" && string[0] == "√"){
     //ex)histroy get= √(√(16)) => 2
      let firstCALC = string.substr(string.indexOf('(',string.indexOf('(') + 1)+1,
      string.indexOf(')') - (string.indexOf('(', string.indexOf('(') + 1) + 1));
  
      string = string.replace(/√/g,"");
      string = string.replace(/\(/g,"");
      string = string.replace(/\)/g,"");

      firstCALC = Math.sqrt(Number(firstCALC));
      return String(Math.sqrt(Number(firstCALC)));
    }

    string = string.replace(/√/g,"");
    if(string.includes("(")) {
      string = string.replace(/\(/g,"");
    }
    if(string.includes(")")) {
      string = string.replace(/\)/g,"");
    }
      let results = new Function("return (" + string + ")")();
      return String(Math.sqrt(Number(results)));
  }
  //

  if(string.includes("×")) {
  string = string.replace(/×/g,"*"); 
  }
  if(string.includes("÷")){
  string = string.replace(/÷/g,"/");
  }

  
  return new Function("return (" + string + ")")();
};


class Calculator extends React.Component {
  // TODO: history 추가
  state = {
    displayValue: "",
    history: [],
    formula: [],
    isSqrt: false
  };

  onClickHistory = (e,data) => {
    let { displayValue = "" } = this.state;
    displayValue = data;
    this.setState({displayValue});
    
    
  }
  
  onClickButton = key => {
    let { displayValue = "" } = this.state;
    let { history = [] } = this.state;
    let { formula = [] } = this.state;
    let { isSqrt = false } = this.state;
    displayValue = "" + displayValue;
    const lastChar = displayValue.substr(displayValue.length - 1);
    const operatorKeys = ["÷", "×", "-", "+"];
    const isDot = ".";
    const proc = {
      AC: () => {
        this.setState({ displayValue: "" });
      },
      BS: () => {
        if (displayValue.length > 0) {
          displayValue = displayValue.substr(0, displayValue.length - 1);
        }
        this.setState({ displayValue });
      },
      // TODO: 제곱근 구현
      "√": () => {
        isSqrt = true;
        this.setState({isSqrt});
        if(lastChar !== "" && !operatorKeys.includes(lastChar)){
          if(displayValue.includes(operatorKeys[0]) || displayValue.includes(operatorKeys[1]) ||
                displayValue.includes(operatorKeys[2]) || displayValue.includes(operatorKeys[3]) || displayValue.includes(isDot)){
                  formula.unshift("√(" + displayValue + ")");
                  displayValue = String(Math.sqrt(Number(evalFunc(displayValue))));
                 
                  history.unshift(displayValue);
                  this.setState( { formula });
                  this.setState( { history });
                  this.setState({ displayValue });
                  isSqrt = false;
          } 
          if(displayValue.includes("√") && displayValue[0] == "√"){
            formula.unshift("√(" + displayValue + ")");
            
            let FirstCalc = displayValue.substr(displayValue.indexOf('('), displayValue.indexOf(')') - 
            (displayValue.indexOf('(', displayValue.indexOf('(') + 1) + 1));
            
            FirstCalc = String(Math.sqrt(Number(evalFunc(FirstCalc))));
            
            displayValue = String(Math.sqrt(Number(evalFunc(FirstCalc))));
            

            history.unshift(displayValue);
            this.setState( { formula });
            this.setState( { history });
            this.setState({ displayValue });
            isSqrt = false;
            //√(√(Number)) 인 경우? , √...(√(√(Number))) 경우는 처리 X,
          }
          else {
            if(isSqrt == true){
            formula.unshift("√(" + displayValue + ")");
            displayValue = String(Math.sqrt(Number(displayValue)));
            
            history.unshift(displayValue);
            this.setState( { formula });
            this.setState( { history });
            this.setState({ displayValue });
            }

            
          }
        }
      },
      // TODO: 사칙연산 구현
      "÷": () => {
        temp = true;  
        if (lastChar !== "" && !operatorKeys.includes(lastChar)) {
          this.setState({ displayValue: displayValue + "÷" });
        }
      },
      "×": () => {
        temp = true;
        if (lastChar !== "" && !operatorKeys.includes(lastChar)) {
          this.setState({ displayValue: displayValue + "×" });
        }
      },
      "-": () => {
        temp = true;
        this.setState({temp});
        if (lastChar !== "" && !operatorKeys.includes(lastChar)) {
          this.setState({ displayValue: displayValue + "-" });
        }
      },
      "+": () => {
        // + 연산 참고하여 연산 구현
        temp = true;
        if (lastChar !== "" && !operatorKeys.includes(lastChar)) {
          this.setState({ displayValue: displayValue + "+" });
        }
      },
      "=": () => {
        if (lastChar !== "" && operatorKeys.includes(lastChar)) {
          displayValue = displayValue.substr(0, displayValue.length - 1);
        } else if (lastChar !== "") {
         isSqrt = false;
         this.setState({isSqrt}); 
         formula.unshift(displayValue);
         history.unshift(displayValue);
         displayValue = evalFunc(displayValue);
        }
        this.setState( { formula });
        this.setState( { history });
        this.setState({ displayValue });
      },
      ".": () => {   
        if(!displayValue.includes(".") && (lastChar !== "") && !operatorKeys.includes(lastChar)) {
          displayValue += ".";
          this.setState({ displayValue });
          } 
        else {
            if(lastChar !== "" && !isDot.includes(lastChar) && temp == true && !operatorKeys.includes(lastChar)){
            displayValue += ".";
            this.setState({ displayValue });
            }
          }
        temp = false;
        },
      "0": () => {
        if (Number(displayValue) !== 0) {
          displayValue += "0";
          this.setState({ displayValue });
        }
      }

    };



    if (proc[key]) {
      proc[key]();
    } else {
      // 여긴 숫자
      this.setState({ displayValue: displayValue + key });
    }
  };

  render() {
    
    return (
      <Container>
        <Panel>
          <Display displayValue={this.state.displayValue} />
          <ButtonGroup onClickButton={this.onClickButton}>
            <Button size={1} color="gray">
              AC
            </Button>
            <Button size={1} color="gray">
              BS
            </Button>
            <Button size={1} color="gray">
              √
            </Button>
            <Button size={1} color="gray">
              ÷
            </Button>

            <Button size={1}>7</Button>
            <Button size={1}>8</Button>
            <Button size={1}>9</Button>
            <Button size={1} color="gray">
              ×
            </Button>

            <Button size={1}>4</Button>
            <Button size={1}>5</Button>
            <Button size={1}>6</Button>
            <Button size={1} color="gray">
              -
            </Button>

            <Button size={1}>1</Button>
            <Button size={1}>2</Button>
            <Button size={1}>3</Button>
            <Button size={1} color="gray">
              +
            </Button>

            <Button size={2}>0</Button>
            <Button size={1}>.</Button>
            <Button size={1} color="gray">
              =
            </Button>
          </ButtonGroup>
        </Panel>
        <History history = {this.state.history}>
        {/* TODO: History componet를 이용해 map 함수와 Box styled div를 이용해 history 표시 */
        this.state.history.map((x,i) => {
          index = i; //history <-> formula
          return( 
            <Box value = {x.i} onClick={((e) => this.onClickHistory(e,this.state.formula[i]))}> 
              {this.state.formula[i]}          
              {"= " + evalFunc(x)}
            </Box>
          );
        })
        }
        </History>
        

      </Container>
    );
  }
}

export default Calculator;
