import React, { setState } from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import MyStepper from './components/MyStepper.js';
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import './App.css';
import { Typography } from '@material-ui/core';

/* global BigInt */

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      domain: '',
      currStep: -1,
      stepContent: ['','',''],
      buttonDisabled: false,
    }
    this.sjcl = window.sjcl;

    // p256 curve parameters
    this.order = '0xffffffff00000000ffffffffffffffffbce6faada7179e84f3b9cac2fc632551'
    this.prime = "0x" + BigInt("115792089210356248762697446949407573530086143415290314195533631308867097853951").toString(16);
    this.R = "0x" + BigInt("115792089210356248762697446949407573529996955224135760342422259061068512044369").toString(16);
    this.A = "0x" + BigInt(-3).toString(16);
    this.B = '0x5AC635D8AA3A93E7B3EBBD55769886BC651D06B0CC53B0F63BCE3C3E27D2604B'
    this.Gx = '0x6B17D1F2E12C4247F8BCE6E563A440F277037D812DEB33A0F4A13945D898C296'
    this.Gy = '0x4FE342E2FE1A7F9B8EE7EB4A7C0F9E162BCE33576B315ECECBB6406837BF51F5'

    // hex <-> int conversions
    this.hexToInt = function(bnprimep256){
      // const hexed = bnprimep256.toString(16);
      return BigInt(bnprimep256.toString(16)).toString(10);
    }
    this.intToHex = function(num){
      return "0x" + BigInt(num).toString(16);
    }

    // bitArray(octet strings) <-> int primitives
    this.I2OSP = function(x, x_len=4) { //x : int, x_len: int, -> st
      const mybn = new this.sjcl.codec.hex.toBits(this.intToHex(x));
      console.log("I2OSPmybn = ", mybn)
      return mybn;
    }
    this.OS2IP = function(x) {
      const result = "0x" + this.sjcl.codec.hex.fromBits(x);
      console.log("OS2IPresult = ", result)
      const intresult = this.hexToInt(result.toString(16));
      console.log("OS2IPintresult = ", intresult)
      return intresult;
    }

    this.HashToBase = function(x, i, label="label", p=this.order) {
      const H = new this.sjcl.hash.sha256();
      H.update("hc2");
      H.update(label);
      // H.update(this.I2OSP(i,4));
      H.update(i.toString());
      H.update(x);
      const result = H.finalize();
      console.log("result = ", result)
      return this.hexToInt("0x" + this.sjcl.codec.hex.fromBits(result));
    }

    // https://tools.ietf.org/html/draft-irtf-cfrg-hash-to-curve-02#section-5.2.3
    // Implementation of H' which maps from bytearray -> g \in G
    this.map2curve_simple_swu = function(alpha, i=1) {
      const negone = new this.sjcl.bn.prime.p256(this.intToHex(-1));
      const one = new this.sjcl.bn.prime.p256(this.intToHex(1));
      const four = new this.sjcl.bn.prime.p256(this.intToHex(4));
      const B = new this.sjcl.bn.prime.p256(this.B);
      const A = new this.sjcl.bn.prime.p256(this.A);
      const prime = new this.sjcl.bn.prime.p256(this.prime);
      const hashedtobase = this.HashToBase(alpha,i);
      console.log({negone, B, A, prime, hashedtobase})

      const t =  new this.sjcl.bn.prime.p256(this.intToHex(hashedtobase));
      console.log("t: ", t.toString())
      var alpha = t.power(2)
      alpha = alpha.mul(negone)
      console.log("alpha: ", alpha.toString())
      var right = alpha.power(2).add(alpha)
      console.log("right: ", right.toString())
      right = right.inverse()
      console.log("right: ", right.toString())
      right = right.add(1)
      console.log("right: ", right.toString())
      var left = B.mul(negone)
      left = left.mul(A.inverse())
      console.log("left: ", left.toString())
      var x2 = left.mul(right)
      console.log("x2: ", x2.toString())
      var x3 = alpha.mul(x2)
      console.log("x3: ", x3.toString())
      var h2 = x2.power(3)
      var i2 = x2.mul(A)
      i2 = i2.add(B)
      h2 = h2.add(i2)
      console.log("i2: ", i2.toString())
      console.log("h2: ", h2.toString())
      var h3 = x3.power(3)
      var i3 = x3.mul(A)
      i3 = i3.add(B)
      h3 = h3.add(i3)
      console.log("i3: ", i3.toString())
      console.log("h3: ", h3.toString())
      var prime1on4 = prime.add(one)
      prime1on4 = prime1on4.mul(four.inverse())
      var y1 = h2.power(prime1on4)
      console.log("y1: ", y1.toString())
      var y2 = h3.power(prime1on4)
      console.log("y2: ", y2.toString())
      console.log(x2.toString(), y1.toString())
      if (y1.power(2).equals(h2)) {
        return new this.sjcl.ecc.point(
          this.sjcl.ecc.curves.c256, 
          new this.sjcl.bn.prime.p256(x2.toString()), 
          new this.sjcl.bn.prime.p256(y1.toString())
        );
      } else {
        return new this.sjcl.ecc.point(
          this.sjcl.ecc.curves.c256, 
          new this.sjcl.bn.prime.p256(x3.toString()), 
          new this.sjcl.bn.prime.p256(y2.toString())
        );
      }
    }

    this.OPRF = function(x, point) {
      var H = new this.sjcl.hash.sha256();
      console.log("OPRF", {x, point})
      H.update(x);
      H.update(this.I2OSP(this.hexToInt(point.x)));
      H.update(this.I2OSP(this.hexToInt(point.y)));
      return H.finalize();
    }

    this.genPassword = function(
      rwd, 
      length=32, 
      charset="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()"
      ) {
        const result = this.sjcl.codec.bytes.fromBits(rwd);
        console.log({rwd, result})
        var retVal = "";
        for (var i = 0, n = charset.length; i < length; ++i) {
          var ri = Math.floor(result[i]*n/256.0);
          console.log({retVal, ri})
          retVal += charset.charAt(Math.floor(result[i] * n / 256.0));
      }
      console.log({retVal})
      return retVal;
    }

    this.clientToPoint = function(pwddomain) {
      const hdashx = this.map2curve_simple_swu(pwddomain);
      const randomBuffer = new Uint32Array(1);
      const random = window.crypto.getRandomValues(randomBuffer);
      const rho = this.OS2IP(this.intToHex("0x" + random))
      const bnrho = new this.sjcl.bn(rho);
      const alpha = hdashx.mult(bnrho)
      return {"alpha": alpha, "rho": rho};
    }
    
    this.deviceToClient = function(alpha, index = 1) {
      if (!(alpha.isValid())) {
        throw "Point does not exist on curve."
      }
      // generate randombytes
      const d = this.HashToBase("some random way to produce this d key", index);
      const bnd = new this.sjcl.bn(this.intToHex(d));
      return alpha.mult(bnd)
    } 

    this.clientToPassword = function(x, beta, rho) {
      if (!(beta.isValid())) {
        throw "Point does not exist on curve."
      }
      console.log({ rho, beta, x})
      const bnrho = new this.sjcl.bn(this.intToHex(rho));
      const order = new this.sjcl.bn(this.order)
      console.log({bnrho, order})
      const invrho = bnrho.inverseMod(order);
      const final = beta.mult(invrho);
      console.log("finalzzzzzzzz: ", final.x.toString(), final.y.toString())
      const rwdbytes = this.OPRF(x, final);
      return this.genPassword(rwdbytes);
    }

    this.P = new this.sjcl.ecc.point(
      this.sjcl.ecc.curves.c256, 
      new this.sjcl.bn.prime.p256("0xc1a5c5221927ff971a98f29178adf0903ffc7e8ce7c3424a04a97f333f82a724"), 
      new this.sjcl.bn.prime.p256("0xa8423e5133e4bf4a1293432612f9bbd151602a60b415aff52ee219435e6752da")
    );
    console.log(this.P)
    console.log(this.P.isValid())

    this.D = this.P.mult(new this.sjcl.bn.prime.p256('0x6f4343a28497cff64617b1d80dd1d78a1cccb13af2fcd954b9c4dd16bd613a48'))
    console.log(this.D)

    console.log("hashtobase: ", this.HashToBase("1", 1));  
    console.log(this.I2OSP(100,4))
    console.log(this.OS2IP(this.I2OSP(100,4)));
    console.log(this.I2OSP(this.OS2IP(this.I2OSP(100,4))))

    console.log(this.intToHex(100))
    console.log(this.hexToInt( this.intToHex(100)))
    console.log(this.intToHex( this.hexToInt(this.intToHex(100))))

    const H = new this.sjcl.hash.sha256();
    H.update("hc2");
    H.update("label");
    H.update(this.I2OSP(100,4));
    console.log("hash of hc2: ",this.hexToInt("0x" + this.sjcl.codec.hex.fromBits(H.finalize())));


    console.log('prime - ', this.hexToInt(this.prime))

    const swu = this.map2curve_simple_swu("1");
    console.log(swu)
    console.log(swu.isValid())

    const res = this.clientToPoint("1");
    console.log(res);
    console.log(this.clientToPassword("1", new this.sjcl.ecc.point(
      this.sjcl.ecc.curves.c256, 
      new this.sjcl.bn.prime.p256("0x3abe7e036206fcc900961e20f30a0d8b5c94aade50bbecceea69ebc6d21b6cad"), 
      new this.sjcl.bn.prime.p256("0x9a2c014b7d1b47c6d6dd3d7d71eeed8269507a33b523fe8e904782d604bc09f3")
    ), res.rho));

    // test
    const x = "masterpasswordwww.google.com";
    const hdashx = this.map2curve_simple_swu(x);
    console.log("hdashx: ", hdashx.x.toString(), hdashx.y.toString())
    console.log("valid: ", hdashx.isValid())
    const rho = new this.sjcl.bn(23);    

    const myalpha = hdashx.mult(rho);
    
    
    console.log("myalpha: ", myalpha.x.toString(), myalpha.y.toString())
    console.log("valid: ", myalpha.isValid())


    const myd = this.HashToBase("some random way to produce this d key", 1);
    console.log("myd: ", myd)
    const bnd = new this.sjcl.bn(this.intToHex(myd));
    console.log("bnd: ", bnd.toString())

    const mybeta = myalpha.mult(bnd);
    console.log("mybeta: ", mybeta.x.toString(), mybeta.y.toString())
    console.log("valid: ", mybeta.isValid())

    const order = new this.sjcl.bn(this.order);
    const invrho = rho.inverseMod(order);
    const myfinal = mybeta.mult(invrho);
    console.log("myfinal: ", myfinal.x.toString(), myfinal.y.toString())

    // matches ipynb which I know to be correct

    // final api test

    // --------- Start Client --------- 
    const result = this.clientToPoint(x)
    console.log("ALPHAS: ", result.alpha.x.toString(), result.alpha.y.toString())
    // ---------  End Client  ---------

    // send alpha to Device

    // --------- Start Device ---------
    const beta = this.deviceToClient(result.alpha)
    // ---------  End Device  ---------

    // send beta to Client

    // --------- Start Client ---------
    const rwd = this.clientToPassword(x, beta, result.rho)
    console.log("CLIENT: my password is", rwd)
    // ---------  End Client  ---------


  
  }
  // const [currStep, setCurrStep] = useState(0);
  // const [stepContent, setStepContent] = useState(['step1','step2','step3']);

  MyLogging(stepIndex, lineToAdd) {
    // logging(stepIndex, lineToAdd, setStepContent);
    const currentContent = this.state.stepContent[stepIndex];
    let newCurrentContent = currentContent + '\n' + lineToAdd;
    const restContent = this.state.stepContent;
    restContent[stepIndex] = newCurrentContent;
    this.setState({stepContent: restContent});
  }

  MyTimer(stepIndex, functionToCall) {
    console.time(stepIndex);
    functionToCall();
    this.MyLogging(stepIndex, "Time taken: " + console.timeEnd(stepIndex));
  }

  myIncrementCurrStep() {
    this.setState({currStep: this.state.currStep + 1});
  }

  tether(resolveFunc, rejectFunc) {
    this.I2OSP(23, 4);
    setTimeout(() => resolveFunc("Now it's done!"), 500)
  }

  submitHandler =  async (event) =>  {
    event.preventDefault();
    // clear console
    this.setState({stepContent: ['','','']})
    // start logging
    this.setState({currStep: -1})
    // disable button during computation
    this.setState({buttonDisabled: true});
    
    console.log("called by", event);
    // call Encryption function
    const pwd = this.state.password;
    const dom = this.state.domain;

    let timeTaken = [0,0,0];

    // Step 1: Client to Alpha
    this.myIncrementCurrStep();
    let start = performance.now();
    console.log("I'm encrypting ", pwd, " and domain ", dom);
    let promise = new Promise(this.tether.bind(this));
    await promise.then(
      () => {
        this.MyLogging(0, `I'm encrypting ${pwd} and domain ${dom}`);
      }
    );
    timeTaken[0] = performance.now()-start;
    this.MyLogging(0, `time taken: ${timeTaken[0]}ms`);    

    // Step 2: Alpha to Beta
    this.myIncrementCurrStep();
    start = performance.now();
    promise = new Promise(this.tether.bind(this));
    await promise.then(
      () => {
        console.log("I'm sending API");
        this.MyLogging(1,"I am sending the API now");
      }
    );
    promise = new Promise(this.tether.bind(this));
    await promise.then(
      () => {
        console.log("I'm receiving API");
        this.MyLogging(1,"I am receiving the API now");
      }
    );
    timeTaken[1] = performance.now()-start;
    this.MyLogging(1, `time taken: ${timeTaken[1]}ms`);  
          
    // Step 3: Beta to rwd
    this.myIncrementCurrStep();
    start = performance.now();
    console.time("step3");
    console.log("I am generating rwd");
    promise = new Promise(this.tether.bind(this));
    await promise.then(
      () => {
        this.MyLogging(2,`rwd = ${pwd + dom}`);
      }
    );
    timeTaken[2] = performance.now() - start;
    this.MyLogging(2, `time taken: ${timeTaken[2]}ms`);  

    // Finish
    promise = new Promise(this.tether.bind(this));
    await promise.then(
      () => {
        this.myIncrementCurrStep();
      }
    );
    // this.MyLogging(3, "total time: " + timeTaken.reduce((acc, cur) => acc + cur));

    // reenable button
    this.setState({buttonDisabled: false});
  }

  // handleChange(event) {
  //   console.log(event)
  //   setState({[event.target.name]: event.target.value});
  // }

  changeHandler = event => {
      
    const name = event.target.name;
    const value = event.target.value;
  
    this.setState({
        // formControls: {
          [name]: value
        // }
    });
    console.log(name, value)
}

  render() {
    return (
      <div className="App">
        <header className="App-header" >
          <Paper padding="10">
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
                  <ExpansionPanelDetails>
                    <MyStepper activeStep={this.state.currStep} stepContent={this.state.stepContent} appear={this.state.stepperAppear}/>
                  </ExpansionPanelDetails>
                </ExpansionPanel>
              </Grid>
            </Grid>
          </Paper>
        </header>
      </div>
    );
  }
}

export default App;
