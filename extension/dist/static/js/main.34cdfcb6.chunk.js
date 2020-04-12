(this.webpackJsonpextension=this.webpackJsonpextension||[]).push([[0],{62:function(e,t,n){e.exports=n(75)},67:function(e,t,n){},72:function(e,t,n){},75:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),i=n(9),o=n.n(i),s=(n(67),n(47)),c=n(28),l=n(11),u=n.n(l),h=n(17),p=n(48),g=n(49),m=n(53),d=n(50),f=n(54),v=n(123),w=n(118),x=n(126),S=n(124),b=n(122),y=n(130),E=n(119),j=n(127),C=n(121),B=n(120);function T(e){var t=e.activeStep,n=e.stepContent,a=(e.appear,["Client: generate alpha","Device: return beta","Client: generate rwd"]);return r.a.createElement("div",null,r.a.createElement(y.a,{className:"stepper",activeStep:t,orientation:"vertical"},a.map((function(e,a){return r.a.createElement(E.a,{key:e,expanded:!0},r.a.createElement(j.a,null,e),r.a.createElement(C.a,null,n[a].split("\n").map((function(t,n){return r.a.createElement(B.a,{key:e+a+n,noWrap:!1,style:{maxWidth:"500px",overflowWrap:"break-word"}},"- "+t)})),t===a&&r.a.createElement("div",null,r.a.createElement(b.a,null))))}))),t===a.length&&r.a.createElement(w.a,{square:!0,elevation:0},r.a.createElement(B.a,null,"Done.")))}var I=n(128),L=n(129),k=n(125),M=n(52),O=n.n(M),H=(n(72),function(e){function t(e){var n;return Object(p.a)(this,t),(n=Object(m.a)(this,Object(d.a)(t).call(this,e))).baseState={username:"",password:"",domain:"",index:1,rwd:"Login to generate password",currStep:-1,stepContent:["","",""],buttonDisabled:!1},n.hexToInt=function(e){return BigInt(e.toString(16)).toString(10)},n.intToHex=function(e){return"0x"+BigInt(e).toString(16)},n.I2OSP=function(e){return new this.sjcl.codec.hex.toBits(this.intToHex(e))},n.OS2IP=function(e){var t="0x"+this.sjcl.codec.hex.fromBits(e);return this.hexToInt(t.toString(16))},n.HashToBase=function(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"label",a=(arguments.length>3&&void 0!==arguments[3]?arguments[3]:this.order,new this.sjcl.hash.sha256);a.update("hc2"),a.update(n),a.update(t.toString()),a.update(e);var r=a.finalize();return this.hexToInt("0x"+this.sjcl.codec.hex.fromBits(r))},n.map2curve_simple_swu=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1,n=arguments.length>2&&void 0!==arguments[2]&&arguments[2],a=arguments.length>3?arguments[3]:void 0;n&&this.MyLogging(a,'Simple SWU mapping - alpha="'.concat(e,'" to P256 curve.'));var r=new this.sjcl.bn.prime.p256(this.intToHex(-1)),i=new this.sjcl.bn.prime.p256(this.intToHex(1)),o=new this.sjcl.bn.prime.p256(this.intToHex(4)),s=new this.sjcl.bn.prime.p256(this.B),c=new this.sjcl.bn.prime.p256(this.A),l=new this.sjcl.bn.prime.p256(this.prime),u=this.HashToBase(e,t),h=new this.sjcl.bn.prime.p256(this.intToHex(u)),p=(e=(e=h.power(2)).mul(r)).power(2).add(e);p=(p=p.inverse()).add(1);var g=s.mul(r),m=(g=g.mul(c.inverse())).mul(p),d=e.mul(m),f=m.power(3),v=m.mul(c);v=v.add(s),f=f.add(v);var w=d.power(3),x=d.mul(c);x=x.add(s),w=w.add(x);var S=l.add(i);S=S.mul(o.inverse());var b=f.power(S),y=w.power(S);return n&&this.MyLogging(a,"Simple SWU mapping - Finished majority of calculations, checking if y1^2 == h2."),b.power(2).equals(f)?(n&&this.MyLogging(a,"Simple SWU mapping - Equal, result = (".concat(m.toString(),",").concat(b.toString(),")")),new this.sjcl.ecc.point(this.sjcl.ecc.curves.c256,new this.sjcl.bn.prime.p256(m.toString()),new this.sjcl.bn.prime.p256(b.toString()))):(n&&this.MyLogging(a,"Simple SWU mapping - Not Equal, result = (".concat(d.toString(),",").concat(y.toString(),")")),new this.sjcl.ecc.point(this.sjcl.ecc.curves.c256,new this.sjcl.bn.prime.p256(d.toString()),new this.sjcl.bn.prime.p256(y.toString())))},n.OPRF=function(e,t){var n=new this.sjcl.hash.sha256;return n.update(e),n.update(this.I2OSP(this.hexToInt(t.x))),n.update(this.I2OSP(this.hexToInt(t.y))),n.finalize()},n.genPassword=function(e){for(var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:16,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()",a=this.sjcl.codec.bytes.fromBits(e),r="",i=0,o=n.length;i<t;++i)r+=n.charAt(Math.floor(a[i]*o/256));return r},n.getSession=function(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1,a=e+t+n;chrome.storage.local.get([a],(function(e){if(e)return console.log("Login id is "+e.key),e.key;console.log("No existing login id.")}));var r=this.sjcl.hash.sha256.hash(a),i="0x"+this.sjcl.codec.hex.fromBits(r);return chrome.storage.local.set({string:i},(function(){console.log("Value is set to "+i)})),i},n.clientToPoint=function(){var e=Object(h.a)(u.a.mark((function e(t){var n,a,r,i,o,s,c,l,h,p=arguments;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=p.length>1&&void 0!==p[1]?p[1]:1,a=p.length>2&&void 0!==p[2]&&p[2],r=p.length>3&&void 0!==p[3]?p[3]:0,i=this.map2curve_simple_swu(t,n,a,r),o=new Uint32Array(1),s=window.crypto.getRandomValues(o),c=this.intToHex(s.toString()),l=new this.sjcl.bn(c),a&&this.MyLogging(r,'Generated random number rho = "'.concat(c,'".')),h=i.mult(l),a&&this.MyLogging(r,"Calculated alpha = hdashx * rho = (".concat(h.y.toString(),",").concat(h.x.toString(),")")),e.abrupt("return",{alpha:h,rho:c});case 12:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}(),n.deviceToClient=function(){var e=Object(h.a)(u.a.mark((function e(t,n,a,r){var i,o,s,c,l,h,p,g,m=arguments;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return i=m.length>4&&void 0!==m[4]&&m[4],o=m.length>5&&void 0!==m[5]?m[5]:1,s={method:"GET",headers:new Headers({content_type:"application/json"}),mode:"cors",cache:"no-cache"},c=this.getSession(n,a,r),l={hashid:c,x:this.hexToInt(t.x.toString()).toString(),y:this.hexToInt(t.y.toString()).toString()},this.MyLogging(o,"id is ".concat(c)),h=new URLSearchParams(Object.entries(l)),p="http://127.0.0.1:5000/?",i&&this.MyLogging(o,'Sending request: "'.concat(p+h,'".')),e.next=11,fetch(p+h,s).then((function(e){return e.json()}));case 11:return g=e.sent,i&&this.MyLogging(o,"Received request: beta=(".concat(g.x,", ").concat(g.y,").")),e.abrupt("return",g);case 14:case"end":return e.stop()}}),e,this)})));return function(t,n,a,r){return e.apply(this,arguments)}}(),n.clientToPassword=function(){var e=Object(h.a)(u.a.mark((function e(t,n,a){var r,i,o=this,s=arguments;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=s.length>3&&void 0!==s[3]&&s[3],i=s.length>4&&void 0!==s[4]?s[4]:2,e.abrupt("return",new Promise((function(e,s){try{var c=o.intToHex(n.x).toString(),l=o.intToHex(n.y).toString(),u=new o.sjcl.ecc.point(o.sjcl.ecc.curves.c256,new o.sjcl.bn.prime.p256(c),new o.sjcl.bn.prime.p256(l)),h=u.isValid();if(r&&o.MyLogging(i,'beta exists on curve? beta.isValid()="'.concat(h,'"')),!h)throw"Point (".concat(u.x.toString(),",").concat(u.y.toString(),") does not exist on curve.");var p=new o.sjcl.bn(o.intToHex(a)),g=new o.sjcl.bn(o.order),m=p.inverseMod(g);r&&o.MyLogging(i,'Calculated inverse of rho, rho^-1 = "'.concat(m.toString(),'"'));var d=u.mult(m);r&&o.MyLogging(i,"Calculated beta * rho^-1 = (".concat(d.x.toString(),",").concat(d.y.toString(),")"));var f=o.OPRF(t,d);r&&o.MyLogging(i,"OPRF: hashed x=".concat(t," with point to get rwdbytes=").concat(f)),e(o.genPassword(f))}catch(v){s(v)}})));case 3:case"end":return e.stop()}}),e)})));return function(t,n,a){return e.apply(this,arguments)}}(),n.demo=function(){var e=Object(h.a)(u.a.mark((function e(t){var n,a,r,i,o,s;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=performance.now(),a="masterpasswordwww.google.com",e.next=4,this.clientToPoint(a,t);case 4:return r=e.sent,e.next=7,this.deviceToClient(r.alpha,t);case 7:return i=e.sent,e.next=10,this.clientToPassword(a,i,r.rho,t);case 10:o=e.sent,console.log("I generated the password:",o),s=performance.now(),console.log("Demo took ".concat(s-n,"."));case 14:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}(),n.submitHandler=function(){var e=Object(h.a)(u.a.mark((function e(t){var a,r,i,o,s,c,l,p,g;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t.preventDefault(),n.setState({currStep:-1}),n.setState({buttonDisabled:!0}),console.log("called by",t),a=n.state.username,r=n.state.password,i=n.state.domain,o=n.state.index,s=[0,0,0],console.log(n.state),n.resetStateWithUpdates({stepContent:["","",""]}),console.log(n.state),n.myIncrementCurrStep(),c=performance.now(),l=r+i,n.MyLogging(0,"I'm appending ".concat(r," and domain ").concat(i,". x=").concat(l)),e.next=18,n.clientToPoint(l,o,!0).then(function(){var e=Object(h.a)(u.a.mark((function e(t){return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n.MyLogging(0,"result={alpha: (".concat(t.alpha.x.toString(),",").concat(t.alpha.y.toString(),"), rho=").concat(t.rho.toString(),"}")),s[0]=performance.now()-c,n.MyLogging(0,"time taken: ".concat(s[0],"ms")),e.abrupt("return",{alpha:t.alpha,rho:t.rho});case 4:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}());case 18:return p=e.sent,n.myIncrementCurrStep(),c=performance.now(),e.next=23,n.deviceToClient(p.alpha,a,i,o,!0,1).then(function(){var e=Object(h.a)(u.a.mark((function e(t){return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n.MyLogging(1,"Done. result={beta: (".concat(t.x.toString(),",").concat(t.y.toString(),")}")),s[1]=performance.now()-c,n.MyLogging(1,"time taken: ".concat(s[1],"ms")),e.abrupt("return",t);case 4:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}());case 23:return g=e.sent,n.myIncrementCurrStep(),c=performance.now(),n.MyLogging(2,"I am generated rwd now."),e.next=29,n.clientToPassword(l,g,p.rho,!0).then((function(e){return n.MyLogging(2,"rwd = ".concat(e)),s[2]=performance.now()-c,n.MyLogging(2,"time taken: ".concat(s[2],"ms")),n.setState({rwd:e}),e}));case 29:e.sent,n.myIncrementCurrStep(),n.setState({buttonDisabled:!1});case 32:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),n.changeHandler=function(e){var t=e.target.name,a=e.target.value;n.setState(Object(c.a)({},t,a)),console.log(t,a)},n.state=n.baseState,n.sjcl=window.sjcl,n.order="0xffffffff00000000ffffffffffffffffbce6faada7179e84f3b9cac2fc632551",n.prime="0x"+BigInt("115792089210356248762697446949407573530086143415290314195533631308867097853951").toString(16),n.R="0x"+BigInt("115792089210356248762697446949407573529996955224135760342422259061068512044369").toString(16),n.A="0x"+BigInt(-3).toString(16),n.B="0x5AC635D8AA3A93E7B3EBBD55769886BC651D06B0CC53B0F63BCE3C3E27D2604B",n.Gx="0x6B17D1F2E12C4247F8BCE6E563A440F277037D812DEB33A0F4A13945D898C296",n.Gy="0x4FE342E2FE1A7F9B8EE7EB4A7C0F9E162BCE33576B315ECECBB6406837BF51F5",n}return Object(f.a)(t,e),Object(g.a)(t,[{key:"resetStateWithUpdates",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};this.setState(Object(s.a)({},this.baseState,{},e))}},{key:"MyLogging",value:function(e,t){console.log(e+": "+t);var n=this.state.stepContent&&this.state.stepContent[e],a="";a=n?n+"\n"+t:t;var r=this.state.stepContent;r[e]=a,this.setState({stepContent:r})}},{key:"myIncrementCurrStep",value:function(){this.setState({currStep:this.state.currStep+1})}},{key:"render",value:function(){return r.a.createElement("div",{className:"App"},r.a.createElement("header",{className:"App-header"},r.a.createElement(w.a,{padding:"10"},r.a.createElement(v.a,{container:!0,direction:"column",spacing:1},r.a.createElement(v.a,{item:!0},r.a.createElement(B.a,{variant:"h3"},"sphinx.")),r.a.createElement(v.a,{item:!0},r.a.createElement("form",{onSubmit:this.submitHandler},r.a.createElement(v.a,{container:!0,spacing:3,justify:"center"},r.a.createElement(v.a,{item:!0,xs:5},r.a.createElement(x.a,{required:!0,id:"required",label:"username",name:"username",fullWidth:!0,margin:"normal",onChange:this.changeHandler,value:this.state.username})),r.a.createElement(v.a,{item:!0,xs:5},r.a.createElement(r.a.Fragment,null,r.a.createElement(x.a,{required:!0,id:"standard-password-required",label:"password",name:"password",type:"password",fullWidth:!0,margin:"normal",onChange:this.changeHandler,value:this.state.password}))),r.a.createElement(v.a,{item:!0,xs:10},r.a.createElement(r.a.Fragment,null,r.a.createElement(x.a,{required:!0,id:"required",label:"domain",name:"domain",fullWidth:!0,margin:"normal",onChange:this.changeHandler,value:this.state.domain})))),r.a.createElement(v.a,{style:{position:"relative"}},r.a.createElement(S.a,{variant:"contained",color:"primary",name:"submit",type:"submit",value:"Submit",disabled:this.state.buttonDisabled},"Login"),this.state.buttonDisabled&&r.a.createElement(b.a,{size:24,style:{position:"absolute",top:"50%",left:"50%",marginTop:-12,marginLeft:-12}}))),r.a.createElement(v.a,{container:!0,spacing:3,justify:"center"},r.a.createElement(v.a,{item:!0,xs:10},r.a.createElement(r.a.Fragment,null,r.a.createElement(x.a,{id:"required",label:"rwd",name:"rwd",fullWidth:!0,margin:"normal",variant:"outlined",InputProps:{readOnly:!0},onChange:this.changeHandler,value:this.state.rwd}))))),r.a.createElement(v.a,{item:!0},r.a.createElement(I.a,{elevation:0},r.a.createElement(L.a,{expandIcon:r.a.createElement(O.a,null),"aria-controls":"panel1a-content",id:"panel1a-header"},r.a.createElement(B.a,null,"Advanced")),r.a.createElement(k.a,{style:{maxWidth:"600px"}},r.a.createElement(T,{activeStep:this.state.currStep,stepContent:this.state.stepContent,appear:this.state.stepperAppear,style:{maxWidth:"600px"}}))))))))}}]),t}(r.a.Component));Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(r.a.createElement(H,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[62,1,2]]]);