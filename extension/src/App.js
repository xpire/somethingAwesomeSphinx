import React, { setState } from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import MyStepper from './components/MyStepper.js';
import './App.css';


class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      domain: '',
      currStep: 0,
      stepContent: ['step1','step2','step3']
    }
  }
  // const [currStep, setCurrStep] = useState(0);
  // const [stepContent, setStepContent] = useState(['step1','step2','step3']);
  
  MyLogging(stepIndex, lineToAdd) {
    // logging(stepIndex, lineToAdd, setStepContent);
    const currentContent = this.state.stepContent[stepIndex];
    const newCurrentContent = currentContent +
    lineToAdd;
    const restContent = this.state.stepContent;
    restContent[stepIndex] = newCurrentContent;
    setState({stepContent: restContent});
  }

  myIncrementCurrStep() {
    setState({currStep: this.state.currStep + 1});
  }

  handleSubmit(event) {
    event.preventDefault();
    event.target.disabled = true;
    console.log("called by", event);
    // call Encryption function
    const pwd = this.state.password;
    const dom = this.state.domain;

    var index = 0;
    console.log("I'm encrypting ", pwd, " and domain ", dom);
    this.MyLogging(index, `I'm encrypting ${pwd} and domain ${dom}`);
    this.myIncrementCurrStep();

    console.log("I'm sending API");
    this.MyLogging("I am sending the API now");
    console.log("I'm receiving API");
    this.MyLogging("I am receiving the API now");
    this.myIncrementCurrStep();
    
    console.log("I am generating rwd");
    this.MyLogging(`rwd = ${pwd + dom}`);
    this.myIncrementCurrStep();

    this.myIncrementCurrStep();
  }

  handleChange(event) {
    console.log(event)
    setState({[event.target.label]: event.target.value});
  }

  render() {
    return (
      <div className="App">
        <header className="App-header" >
          <Paper padding="10">
            <p>
              sphinx.
            </p>
            <form onSubmit={this.handleSubmit}>
                <Grid container spacing={3} justify="center">
                  <Grid item xs={5}>
                      <TextField required id='required' label='username' fullWidth margin="normal"/>
                  </Grid>
                  <Grid item xs={5}>
                    <>
                      <TextField required id='standard-password-required' label='password' type='password' fullWidth margin="normal"/>
                    </>
                  </Grid>
                  <Grid item xs={10}>
                    <>
                      <TextField required id='required' label='domain' fullWidth margin="normal" />
                    </>
                  </Grid>
                </Grid>
              <Button variant='contained' color='primary'>Login</Button>
            </form>
            <MyStepper activeStep={this.state.currStep} stepContent={this.state.stepContent}/>
          </Paper>
        </header>
      </div>
    );
  }
}

export default App;
