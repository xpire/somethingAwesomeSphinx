import React from 'react';
import logo from './logo.svg';
import { useTrail, useTransition, animated } from 'react-spring';
import './App.css';

// a password Store that Perfectly Hides from Itself No eXaggeration
// const textShrink = ['a password ', 'tore that ', 'erfectly ', 'ides from ', 'tself ', 'o e', 'aggeration.'];
// const textConstant = [            'S',          'P',         'H',          'I',      'N',   'X'];


function App() {
  const textShrink = [ {text:'I'}, {text:'between'}, {text:'U '}, {text:'and'}, {text:'ME'}];
  const config = { mass: 5, tension: 2000, friction: 200};
  const [toggle, setToggle] = React.useState(true);
  const [items, set] = React.useState(textShrink);
  React.useEffect(() => void setInterval(() => set(), 2000), []);
  const transitions = useTransition(items, item => item.key,  {
    config, 
    from: {opacity: 0, transform: `scaleX(0)`},
    enter: { opacity: 1, transform: `scaleX(1)`},
    leave: {opacity: 0, transform: `scaleX(0)`}
  });
  console.log(transitions)
  return (
    <div className="App">
      <header className="App-header">
        <div className="trails-sphinx" onClick={() => setToggle(state => !state)}>
          <div style={{display: "flex"}} >
            {transitions.map(({item, key, props}) => 
              key%2===1 && toggle ? {} : <animated.span key={key} style={props}> {item.text} </animated.span>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
