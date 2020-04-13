import React, { setState } from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import MyStepper from './components/MyStepper.jsx';
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import './App.css';
import { Typography } from '@material-ui/core';

/* global BigInt */
/*global chrome*/

class App extends React.Component {

  baseState = {
    username: '',
    password: '',
    domain: '',
    index: 1,
    rwd: 'Login to generate password',
    currStep: -1,
    stepContent: ['','',''],
    buttonDisabled: false,
  }

  constructor(props) {
    super(props);
    this.state = this.baseState;
    // preserve initial state in new object
    this.sjcl = window.sjcl;

    // p256 curve parameters
    this.order = '0xffffffff00000000ffffffffffffffffbce6faada7179e84f3b9cac2fc632551'
    this.prime = "0x" + BigInt("115792089210356248762697446949407573530086143415290314195533631308867097853951").toString(16);
    this.R = "0x" + BigInt("115792089210356248762697446949407573529996955224135760342422259061068512044369").toString(16);
    this.A = "0x" + BigInt(-3).toString(16);
    this.B = '0x5AC635D8AA3A93E7B3EBBD55769886BC651D06B0CC53B0F63BCE3C3E27D2604B'
    this.Gx = '0x6B17D1F2E12C4247F8BCE6E563A440F277037D812DEB33A0F4A13945D898C296'
    this.Gy = '0x4FE342E2FE1A7F9B8EE7EB4A7C0F9E162BCE33576B315ECECBB6406837BF51F5'

  }

  getDomain() {
    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
      try {
        // use `url` here inside the callback because it's asynchronous!
        const url = tabs[0].url;
        const urlObject = new URL(url);
        this.setState({domain: urlObject.host});
        console.log(this.state.domain)
      } catch(e) {
        console.log(e)
      }
    });
  }

  componentDidMount() {
    this.getDomain();
  }

  resetStateWithUpdates(stateUpdates = {}) {
    // Rest operators ensure a new object with merged properties and values.
    // Requires the "transform-object-rest-spread" Babel plugin
    this.setState({ ...this.baseState, ...stateUpdates });
  }

  MyLogging(stepIndex, lineToAdd) {
    console.log(stepIndex + ": " + lineToAdd);
    const currentContent = this.state.stepContent && this.state.stepContent[stepIndex];
    let newCurrentContent = '';
    if (currentContent) {
      newCurrentContent = currentContent + '\n' + lineToAdd;
    } else {
      newCurrentContent = lineToAdd;
    }
    // let newCurrentContent = currentContent + '\n' + lineToAdd;
    const restContent = this.state.stepContent;
    restContent[stepIndex] = newCurrentContent;
    this.setState({stepContent: restContent});
  }

  // hex <-> int conversions
  hexToInt = function(bnprimep256) {
    // const hexed = bnprimep256.toString(16);
    return BigInt(bnprimep256.toString(16)).toString(10);
  }
  intToHex = function(num) {
    return "0x" + BigInt(num).toString(16);
  }

  // bitArray(octet strings) <-> int primitives
  I2OSP = function(x) { //x : int, x_len: int, -> st
    const mybn = new this.sjcl.codec.hex.toBits(this.intToHex(x));
    return mybn;
  }
  OS2IP = function(x) {
    const result = "0x" + this.sjcl.codec.hex.fromBits(x);
    const intresult = this.hexToInt(result.toString(16));
    return intresult;
  }

  HashToBase = function(x, i, label="label", p=this.order) {
    const H = new this.sjcl.hash.sha256();
    H.update("hc2");
    H.update(label);
    // H.update(this.I2OSP(i,4));
    H.update(i.toString());
    H.update(x);
    const result = H.finalize();
    return this.hexToInt("0x" + this.sjcl.codec.hex.fromBits(result));
  }

  // https://tools.ietf.org/html/draft-irtf-cfrg-hash-to-curve-02#section-5.2.3
  // Implementation of H' which maps from bytearray -> g \in G
  map2curve_simple_swu = function(alpha, i=1, verbose=false, step) {
    verbose && this.MyLogging(step, `Simple SWU mapping - alpha="${alpha}" to P256 curve.`);
    const negone = new this.sjcl.bn.prime.p256(this.intToHex(-1));
    const one = new this.sjcl.bn.prime.p256(this.intToHex(1));
    const four = new this.sjcl.bn.prime.p256(this.intToHex(4));
    const B = new this.sjcl.bn.prime.p256(this.B);
    const A = new this.sjcl.bn.prime.p256(this.A);
    const prime = new this.sjcl.bn.prime.p256(this.prime);
    const hashedtobase = this.HashToBase(alpha,i);
    
    const t = new this.sjcl.bn.prime.p256(this.intToHex(hashedtobase));
    var alpha = t.power(2)
    alpha = alpha.mul(negone)
    var right = alpha.power(2).add(alpha)
    right = right.inverse()
    right = right.add(1)
    var left = B.mul(negone)
    left = left.mul(A.inverse())
    var x2 = left.mul(right)
    var x3 = alpha.mul(x2)
    var h2 = x2.power(3)
    var i2 = x2.mul(A)
    i2 = i2.add(B)
    h2 = h2.add(i2)
    var h3 = x3.power(3)
    var i3 = x3.mul(A)
    i3 = i3.add(B)
    h3 = h3.add(i3)
    var prime1on4 = prime.add(one)
    prime1on4 = prime1on4.mul(four.inverse())
    var y1 = h2.power(prime1on4)
    var y2 = h3.power(prime1on4)

    verbose && this.MyLogging(step, `Simple SWU mapping - Finished majority of calculations, checking if y1^2 == h2.`);

    if (y1.power(2).equals(h2)) {
      verbose && this.MyLogging(step, `Simple SWU mapping - Equal, result = (${x2.toString()},${y1.toString()})`);
      return new this.sjcl.ecc.point(
        this.sjcl.ecc.curves.c256, 
        new this.sjcl.bn.prime.p256(x2.toString()), 
        new this.sjcl.bn.prime.p256(y1.toString())
      );
    } else {
      verbose && this.MyLogging(step, `Simple SWU mapping - Not Equal, result = (${x3.toString()},${y2.toString()})`);
      return new this.sjcl.ecc.point(
        this.sjcl.ecc.curves.c256, 
        new this.sjcl.bn.prime.p256(x3.toString()), 
        new this.sjcl.bn.prime.p256(y2.toString())
      );
    }
  }

  OPRF = function(x, point) {
    var H = new this.sjcl.hash.sha256();
    H.update(x);
    H.update(this.I2OSP(this.hexToInt(point.x)));
    H.update(this.I2OSP(this.hexToInt(point.y)));
    return H.finalize();
  }

  genPassword = function(
    rwd, 
    length=16, 
    charset="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()"
    ) {
      const result = this.sjcl.codec.bytes.fromBits(rwd);
      var retVal = "";
      for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(result[i] * n / 256.0));
    }
    return retVal;
  }

  getSession = function(user, domain, index=1) {
    // check if domain has been created before, else generates id for domain
    const string = user + domain + index
    chrome.storage.local.get([string], function(result) {
      if (result) {
        console.log('Login id is ' + result.key);
        return result.key;
      } else {
        console.log('No existing login id.')
      }
    });
    // create and store login id
    const hashedId = this.sjcl.hash.sha256.hash(string)
    const id = "0x" + this.sjcl.codec.hex.fromBits(hashedId);
    chrome.storage.local.set({string: id}, function() {
      console.log('Value is set to ' + id);
    });
    return id;
  }

  clientToPoint = async function(pwddomain, index=1, verbose=false, step=0) {
    const hdashx = this.map2curve_simple_swu(pwddomain, index, verbose, step);
    const randomBuffer = new Uint32Array(1);
    const random = window.crypto.getRandomValues(randomBuffer);
    const rho = this.intToHex(random.toString());
    const bnrho = new this.sjcl.bn(rho);
    verbose && this.MyLogging(step, `Generated random number rho = "${rho}".`)
    const alpha = hdashx.mult(bnrho)
    verbose && this.MyLogging(step, `Calculated alpha = hdashx * rho = (${alpha.x.toString()},${alpha.y.toString()})`)
    return {"alpha": alpha, "rho": rho};
  }
  
  // deviceToClient = function(alpha, index = 1) {
  //   // API should handle the following:
  //   // ----------------------------------------------------------------
  //   if (!(alpha.isValid())) {
  //     throw "Point does not exist on curve."
  //   }
  //   // generate randombytes
  //   // const d = this.HashToBase("some random way to produce this d key", index);
  //   // const bnd = new this.sjcl.bn(this.intToHex(d));
  //   const randomBuffer = new Uint32Array(1);
  //   const random = window.crypto.getRandomValues(randomBuffer);
  //   const d = this.I2OSP(random);
  //   const bnd = this.sjcl.bn.fromBits(d);
  //   return alpha.mult(bnd)
  //   // ----------------------------------------------------------------
  // } 

  deviceToClient = async function(alpha, pwd, domain, index, verbose=false, step=1) {
    const request = {method: "GET", headers: new Headers({"content_type":"application/json"}), mode: 'cors', cache: "no-cache"}
    const id = this.getSession(pwd, domain, index)
    const params = { hashid: id, x: this.hexToInt(alpha.x.toString()).toString(), y: this.hexToInt(alpha.y.toString()).toString()};
    this.MyLogging(step, `id is ${id}`);
    const urlParams = new URLSearchParams(Object.entries(params));
    const url = 'http://127.0.0.1:5000/?';
    verbose && this.MyLogging(step, `Sending request: "${url + urlParams}".`);
    let data = await fetch(url + urlParams, request).then(
      (response) => {
        const responseJson = response.json()
        return responseJson
      }
    )
    
    verbose && this.MyLogging(step, `Received request: beta=(${data.x}, ${data.y}).`);
    return data;
  }

  clientToPassword = async function(x, beta, rho, verbose=false, step=2) {
    return new Promise((resolve, reject) => {
      try {
        const betaHexX = this.intToHex(beta.x).toString();
        const betaHexY = this.intToHex(beta.y).toString();
        const betaPoint = new this.sjcl.ecc.point(
          this.sjcl.ecc.curves.c256, 
          new this.sjcl.bn.prime.p256(betaHexX),
          new this.sjcl.bn.prime.p256(betaHexY)
        )
        const betaValid = betaPoint.isValid();
        verbose && this.MyLogging(step, `beta exists on curve? beta.isValid()="${betaValid}"`);
        if (!betaValid) {
          throw `Point (${betaPoint.x.toString()},${betaPoint.y.toString()}) does not exist on curve.`
        }
        const bnrho = new this.sjcl.bn(this.intToHex(rho));
        const order = new this.sjcl.bn(this.order)
        const invrho = bnrho.inverseMod(order);
        verbose && this.MyLogging(step, `Calculated inverse of rho, rho^-1 = "${invrho.toString()}"`);
        const final = betaPoint.mult(invrho);
        verbose && this.MyLogging(step, `Calculated beta * rho^-1 = (${final.x.toString()},${final.y.toString()})`);
        const rwdbytes = this.OPRF(x, final);
        verbose && this.MyLogging(step, `OPRF: hashed x=${x} with point to get rwdbytes=${this.sjcl.codec.hex.fromBits(rwdbytes)}`);
        // return this.genPassword(rwdbytes);
        resolve(this.genPassword(rwdbytes))
      } catch(err) {
        reject(err)
      };
    })
  }

  demo = async function(verbose) {
    // final api test
    let start = performance.now();
    const x = 'masterpasswordwww.google.com';

    // --------- Start Client --------- 
     const result = await this.clientToPoint(x, verbose)
    // ---------  End Client  ---------

    // send alpha to Device

    // --------- Start Device ---------
    const beta = await this.deviceToClient(result.alpha, verbose)
    // ---------  End Device  ---------

    // send beta to Client

    // --------- Start Client ---------
    const rwd = await this.clientToPassword(x, beta, result.rho, verbose)
    console.log("I generated the password:", rwd);
    // ---------  End Client  ---------
    const end = performance.now();
    console.log(`Demo took ${end-start}.`)
  }

  myIncrementCurrStep() {
    this.setState({currStep: this.state.currStep + 1});
  }

  submitHandler =  async (event) =>  {
    event.preventDefault();
    // start logging
    this.setState({currStep: -1})
    // disable button during computation
    this.setState({buttonDisabled: true});
    
    console.log("called by", event);
    // call Encryption function
    const user = this.state.username;
    const pwd = this.state.password;
    const dom = this.state.domain;
    const index = this.state.index;

    let timeTaken = [0,0,0];

    // clear console
    // console.log(this.state)
    // this.resetStateWithUpdates({stepContent: ['','','']})
    // console.log(this.state)

    // Step 1: Client to Alpha
    this.myIncrementCurrStep();
    let start = performance.now();
    // let promise = new Promise(this.tether.bind(this));
    const x = pwd+dom;
    this.MyLogging(0, `I'm appending ${pwd} and domain ${dom}. x=${x}`);
    const result = await this.clientToPoint(x, index, true).then(
      async (result) => {
        // const result = this.clientToPoint(x);    
        // setTimeout(() => resolveFunc("Now it's done!"), 500)
        // this.MyLogging(0, `result={alpha: (${result.alpha.x.toString()},${result.alpha.y.toString()}), rho=${result.rho.toString()}}`)
        timeTaken[0] = performance.now()-start;
        this.MyLogging(0, `time taken: ${timeTaken[0]}ms`);  
        return {alpha: result.alpha, rho: result.rho};
      }
    );
  
    // Step 2: Alpha to Beta
    this.myIncrementCurrStep();
    start = performance.now();
    // promise = new Promise(this.tether.bind(this));
    const beta = await this.deviceToClient(result.alpha, user, dom, index, true, 1).then(
      async (beta) => {
        // this.MyLogging(1, `Done. result={beta: (${beta.x.toString()},${beta.y.toString()})}`)
        timeTaken[1] = performance.now()-start;
        this.MyLogging(1, `time taken: ${timeTaken[1]}ms`);  
        return beta;
      }
    );

    // Step 3: Beta to rwd
    this.myIncrementCurrStep();
    start = performance.now();
    // this.MyLogging(2, `I am generated rwd now.`);
    // promise = new Promise(this.tether.bind(this));
    const rwd = await this.clientToPassword(x, beta, result.rho, true).then(
      (rwd) => {
        this.MyLogging(2,`rwd = ${rwd}`);
        timeTaken[2] = performance.now() - start;
        this.MyLogging(2, `time taken: ${timeTaken[2]}ms`);  
        this.setState({rwd: rwd})
        return rwd;
      }
    );

    // Finish
    this.myIncrementCurrStep();

    // reenable button
    this.setState({buttonDisabled: false});
  }

  changeHandler = event => {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({ [name]: value });
    console.log(name, value)
}

  render() {
    return (
      <div className="App">
        <header className="App-header" >
          <Grid container direction="column" spacing={1}>
            <Grid item>
              <Typography variant="h3">
                sphinx.
              </Typography>
            </Grid>
            <Grid item>
            <form onSubmit={this.submitHandler}>
                  <Grid container spacing={3} justify="center">
                    <Grid item xs={5}>
                        <TextField 
                        required id='required' 
                        // ref = 'username' 
                        label='username' 
                        name='username' 
                        fullWidth 
                        margin="normal" 
                        onChange={this.changeHandler}
                        value={this.state.username}
                        />
                    </Grid>
                    <Grid item xs={5}>
                      <>
                        <TextField 
                        required 
                        id='standard-password-required' 
                        // ref='password' 
                        label='password' 
                        name='password' 
                        type='password' 
                        fullWidth 
                        margin="normal" 
                        onChange={this.changeHandler}
                        value={this.state.password}
                        />
                      </>
                    </Grid>
                    <Grid item xs={10}>
                      <>
                        <TextField 
                        required 
                        id='required' 
                        // ref='domain' 
                        label='domain' 
                        name='domain' 
                        fullWidth 
                        margin="normal" 
                        onChange={this.changeHandler} 
                        value={this.state.domain}
                        />
                      </>
                    </Grid>
                  </Grid>
              <Grid style={{position: 'relative'}}>
                <Button variant='contained' color='primary' name='submit' type='submit' value="Submit" disabled={this.state.buttonDisabled}>Login</Button>
                {this.state.buttonDisabled && <CircularProgress size={24} style={{position: 'absolute', top: '50%', left: '50%', marginTop: -12, marginLeft: -12 }}/>}
              </Grid>
              </form>
              <Grid container spacing={3} justify="center">
                <Grid item xs={10}>
                  <>
                    <TextField  
                    id='required' 
                    label='rwd' 
                    name='rwd' 
                    fullWidth 
                    margin="normal"
                    variant="outlined" 
                    InputProps={{
                      readOnly: true,
                    }}
                    onChange={this.changeHandler} 
                    value={this.state.rwd}
                    />
                  </>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <ExpansionPanel elevation={0}>
                <ExpansionPanelSummary 
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                >
                  <Typography>
                    Advanced
                  </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails style={{"maxWidth": "600px"}}>
                  <MyStepper activeStep={this.state.currStep} stepContent={this.state.stepContent} appear={this.state.stepperAppear} style={{"maxWidth": "600px"}}/>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            </Grid>
          </Grid>
        </header>
      </div>
    );
  }
}

export default App;
