import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { connect, Provider } from 'react-redux';
import { createStore } from 'redux';

const ADD_NUMBER = "ADD_NUMBER";
const ADD_OPER = "ADD_OPER";
const AC = "AC";
const ADD_DOT = "ADD_DOT";
const EQUAL = "EQUAL";

/**
 * 
 * @param {string} oper 
 */
const getLastOper = (oper) => {
  return  /-?\d+\.?\d*$/.exec(oper)[0];
}
/**
 * 
 * @param {string} oper 
 */
const addDot = (oper) => {
  if(/[+\-*/]$/.test(oper)||oper===""){
    return oper+'0.';
  }
  if(/\./.test(getLastOper(oper)))
    return oper
  return oper + '.'
}

/**
 * 
 * @param {string} oper 
 * @param {string} val 
 */
const addOper = (oper, val) => {
  if(oper==="")
    return val==="-"?val:oper;
  if(/\d/.test(oper[oper.length-1]))
    return oper + val;
  if(val==='-'){
    if(/[+\-*/]+$/.exec(oper)[0].length===1)
      return oper + val;
      return oper;
  }else{
    return oper.replace(/[+\-*/]+$/,val);
  }
}
/**
 * 
 * @param {string} oper 
 */
const validExprexion = (oper) => {
  return /^-?\d.*(\.|\d)/.exec(oper)[0]
}
/**
 * 
 * @param {string} oper 
 */
const result = (oper) => {
  if(oper==="-")
    return '0'
  const valid = validExprexion(oper);
  const operator = {
    "+":(a,b)=>a+b,
    "-":(a,b)=>a-b,
    "*":(a,b)=>a*b,
    "/":(a,b)=>a/b,
  }
  /**
   * 
   * @param {string} oper 
   * @param {RegExp} exp 
   */
  const refact = (oper, exp) => {
      const match = oper.match(exp);
      const res = operator[match[2]](parseFloat(match[1]),parseFloat(match[3]));
      return oper.replace(match[0],res.toString())
  }
  /**
   * 
   * @param {string} oper 
   */
  const calc = (oper) => {
    const md = /(-?\d+\.?\d*)([*/])(-?\d+\.?\d*)/
    const other = /(-?\d+\.?\d*)([+-])(-?\d+\.?\d*)/ 
    if(/^-?\d+\.?\d*$/.test(oper))
      return oper;
    if(md.test(oper)){
      return calc(refact(oper,md))
    }
    return calc(refact(oper,other))
  }
  return calc(valid);
}

const actionClear = () =>{
  return {
    type: AC
  }
}

const actionNumber = (number) => {
  return {
    type: ADD_NUMBER,
    val: number
  }
}

const actionDot = () => {
  return {
    type: ADD_DOT
  }
}

const actionOper = (oper) => {
  return {
    type: ADD_OPER,
    val: oper
  }
}

const actionEqual = () => {
  return {
    type: EQUAL
  }
}

/**
 * 
 * @param {{oper:string,result:string}} state 
 * @param {{type:string,val:string}} action
 * @returns {{oper:string,result:string}} 
 */
const reducerCalculator =  ( state= {oper: "",result: "0"}, action ) => {
    switch (action.type) {
      case AC:
        return {
          oper: '',
          result: '0'
        }
      case ADD_NUMBER:
        const lastOper = getLastOper(`${state.oper}${action.val}`).split("").filter(v=>v!=="-").join("");
        const reDo = /0*(\d+\.?\d*)/.exec(lastOper)[1];
        const oper = `${state.oper}${action.val}`.replace(lastOper,reDo) 
        return {
          oper: oper,
          result: reDo
        }
      case ADD_DOT:
        const doted = addDot(state.oper);
        return {
          oper: doted,
          result: getLastOper(doted)
        }
      case ADD_OPER:
        const opered = addOper(state.oper, action.val);
        return {
          oper: opered,
          result: opered[opered.length - 1]
        }
      case EQUAL:
        const res = result(state.oper);
        return {
          oper: res,
          result: res
        }
      default:
        return {
          ...state
        }
    }
}

const store = createStore(reducerCalculator);

const mapStateToProps = (state) => {
  return {
    ...state
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    clear: () => {
      dispatch(actionClear())
    },
    number: (number) => {
      dispatch(actionNumber(number))
    },
    dot: () => {
      dispatch(actionDot())
    },
    oper: (oper) => {
      dispatch(actionOper(oper))
    },
    equal: () => {
      dispatch(actionEqual())
    }
  }
}

let Display = ({oper, result}) => {
  return (
    <div >
      <p id="oper">{oper}</p>
      <h1 id="display">{result}</h1>
    </div>
  );
}
Display = connect(mapStateToProps,null)(Display);

let Equal = ({equal}) =>{
    return (
      <button
      className="but" 
      id="equals"
      onClick={equal}
      >
        =
      </button>
    )
}
Equal = connect(null,mapDispatchToProps)(Equal)

let Number = ({val,number,idN}) => {
  return (
    <button
      className="but"
      id={idN}
      onClick={()=>{number(val)}}
    >
      {val}
    </button>
  )
}
Number = connect(null,mapDispatchToProps)(Number);

let Oper = ({oper, operator, idO}) => {
  return (
    <button
      className="but"
      id={idO}
      onClick={()=>{oper(operator)}}
    >
      {operator}
    </button>
  );
}

Oper = connect(null,mapDispatchToProps)(Oper)

let Decimal = ({dot}) => {
  return (
    <button
      className="but"
      id="decimal"
      onClick={()=>{dot()}}
    >
      .
    </button>
  );
}

Decimal = connect(null, mapDispatchToProps)(Decimal);

let Clear = ({clear}) => {
  return (
    <button
      className="but"
      id="clear"
      onClick={()=>{clear()}}
    >
      AC
    </button>
  );
}

Clear = connect(null, mapDispatchToProps)(Clear);
let Buttons = () => {
  const numbers = [
    {id:"zero",val:'0'},
    {id:"one",val:'1'},
    {id:"two",val:'2'},
    {id:"three",val:'3'},
    {id:"four",val:'4'},
    {id:"five",val:'5'},
    {id:"six",val:'6'},
    {id:"seven",val:'7'},
    {id:"eight",val:'8'},
    {id:"nine",val:'9'},
  ]
  const opers = [
    {id:"add",val:"+"},
    {id:"subtract",val:"-"},
    {id:"multiply",val:"*"},
    {id:"divide",val:"/"}, 
  ]
  return (
    <ul className="Buttons">
      <li>
        <Equal/>
      </li>
        {numbers.map(v=>(
          <li>
            <Number val={v.val} idN={v.id}/>
          </li>
        ))}
        {opers.map(v=>(
          <li>
            <Oper operator={v.val} idO={v.id}/>
          </li>
        ))}
      <li>
        <Decimal/>
      </li>
      <li>
          <Clear/>
      </li>
    </ul>
  );
}


const App = () => {
  return (
    <div className="App">
      <Display/>
      <Buttons/>
    </div>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App/>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

export {getLastOper,addDot,addOper, validExprexion, result};
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA

