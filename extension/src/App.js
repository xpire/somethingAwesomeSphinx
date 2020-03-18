import React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import MyStepper from './components/MyStepper.js';
import './App.css';


function App() {
  return (
    <div className="App">
      <header className="App-header" >
        <Paper padding="10">
          <p>
            sphinx.
          </p>
          <form>
              <Grid container spacing={3} justify="center">
                <Grid item xs={5}>
                    <TextField required id='standard-required' label='username' fullWidth margin="normal"/>
                </Grid>
                <Grid item xs={5}>
                  <>
                    <TextField required id='standard-password-required' label='password' type='password' fullWidth margin="normal"/>
                  </>
                </Grid>
                <Grid item xs={10}>
                  <>
                    <TextField required id='standard-required' label='domain' fullWidth margin="normal" />
                  </>
                </Grid>
              </Grid>
            <Button variant='contained' color='primary'>Login</Button>
          </form>
          {/* <p>
            Edit <code>src/App.js</code> and save to reload.
          </p> */}
          <MyStepper/>
        </Paper>
      </header>
    </div>
  );
}

export default App;
