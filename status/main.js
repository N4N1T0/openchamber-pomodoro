(()=>{var p="openchamber.sdk",E=1;var Je=`
:root {
  /* Quiet at rest like the app's own thumbs; hover gives a clear grab target. */
  --oc-scrollbar-thumb: color-mix(in srgb, var(--oc-muted, currentColor) 18%, transparent);
  --oc-scrollbar-thumb-hover: color-mix(in srgb, var(--oc-muted, currentColor) 36%, transparent);
  scrollbar-gutter: stable;
}
* {
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
}
:hover, [data-oc-scrolling] {
  scrollbar-color: var(--oc-scrollbar-thumb) transparent;
}
/* Chromium's standard scrollbar properties otherwise override its pseudo-elements. */
@supports selector(::-webkit-scrollbar) {
  *, :hover, [data-oc-scrolling] { scrollbar-width: auto; scrollbar-color: auto; }
  ::-webkit-scrollbar { width: 6px; height: 6px; background: transparent; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb {
    background: transparent;
    border-radius: 999px;
    min-width: 24px;
    min-height: 24px;
  }
  :hover::-webkit-scrollbar-thumb, [data-oc-scrolling]::-webkit-scrollbar-thumb { background: var(--oc-scrollbar-thumb); }
  ::-webkit-scrollbar-thumb:hover { background: var(--oc-scrollbar-thumb-hover); }
  ::-webkit-scrollbar-corner { background: transparent; }
  ::-webkit-scrollbar-button { display: none; width: 0; height: 0; }
}
@media (forced-colors: active) {
  *, :hover, [data-oc-scrolling] { scrollbar-color: auto; }
  ::-webkit-scrollbar-thumb, ::-webkit-scrollbar-thumb:hover { background: CanvasText; }
}
`;function to(e){let n=e.documentElement;if(n.hasAttribute("data-oc-scrollbar-activity"))return;n.setAttribute("data-oc-scrollbar-activity","");let s=new WeakMap;e.addEventListener("scroll",(T)=>{let u=T.target===e?n:T.target;if(!(u instanceof Element))return;if(!u.hasAttribute("data-oc-scrolling"))u.setAttribute("data-oc-scrolling","");let A=s.get(u);if(A!==void 0)clearTimeout(A);s.set(u,setTimeout(()=>{s.delete(u),u.removeAttribute("data-oc-scrolling")},1000))},{capture:!0,passive:!0})}var cn=`(${to.toString()})(document);`;var Qe=128,Ze=65536;var Ie=128;var xe=65536;var qe=8000,et=192000,tt=120000;var oo=(e)=>{let n=[],s=0,T=0;return{push:(u)=>{n.push(u),T+=u.length;while(T-s>e&&n.length>1){let A=n.shift();T-=A?.length??0,s=0}},pull:(u)=>{let A=0;while(A<u.length&&n.length>0){let C=n[0],O=Math.min(u.length-A,C.length-s);if(u.set(C.subarray(s,s+O),A),A+=O,s+=O,s>=C.length)n.shift(),T-=C.length,s=0}u.fill(0,A)},clear:()=>{n.length=0,s=0,T=0},get size(){return T-s}}};var io=/^[a-z][a-z0-9-]{0,39}$/;var no=(e)=>Object(e)===e&&!Array.isArray(e),ot=(e,n)=>Object.keys(e).every((s)=>n.includes(s)),ro=(e)=>String(e)===e&&e.length>=1&&e.length<=60,so=(e)=>String(e)===e&&e.length>=1&&e.length<=80,ao=(e)=>{if(!Array.isArray(e)||e.length>4)return!1;let n=new Set;for(let s of e){if(!no(s)||!io.test(s.id)||!ro(s.label))return!1;if(s.disabled!==void 0&&s.disabled!==!0&&s.disabled!==!1)return!1;if(n.has(s.id))return!1;if(n.add(s.id),s.kind==="button"){if(!ot(s,["kind","id","label","disabled"]))return!1;continue}if(s.kind!=="select"||!ot(s,["kind","id","label","value","options","disabled"]))return!1;if(!so(s.value)||!Array.isArray(s.options)||s.options.length<1||s.options.length>16)return!1;let T=new Set;for(let u of s.options){if(!no(u)||!ot(u,["value","label"])||!so(u.value)||!ro(u.label)||T.has(u.value))return!1;T.add(u.value)}if(!T.has(s.value))return!1}return!0};var co=["{id}","{segment}","{segments+}"];var Bn=new Set(co);var lo=["turn-finished","turn-failed","permission-asked","question-asked","turn-started","session-created","session-archived","session-deleted"];var Wn=new Set(lo);var ge=20000000,be=256;var nt=(e)=>("bytes"in e)?e.bytes.byteLength:e.content.length,_o=(e,n)=>{if(e.path!==n.path||e.readOnly!==n.readOnly)return!1;if(e.encoding==="text"||n.encoding==="text")return e.encoding==="text"&&n.encoding==="text"&&e.content===n.content;if(e.bytes.byteLength!==n.bytes.byteLength)return!1;for(let s=0;s<e.bytes.byteLength;s+=1)if(e.bytes[s]!==n.bytes[s])return!1;return!0};var uo=/^[A-Za-z0-9_-]{1,80}$/;var po=["left","right","top","bottom"];var Eo=(e,n=0,s={remaining:16000})=>{if(--s.remaining<0||n>=32)return!1;if(e===null)return!0;let T=Array.isArray(e)?e:Object(e)===e?Object.values(e):[];for(let u of T)if(!Eo(u,n+1,s))return!1;return!0},rt=(e)=>{if(e===null||e===!0||e===!1)return!0;if(Array.isArray(e))return Object.keys(e).every((n)=>/^(0|[1-9]\d*)$/.test(n)&&Number(n)<e.length)&&e.every(rt);if(Object(e)===e){let n=Object.getPrototypeOf(e);return(n===null||n===Object.prototype)&&Object.values(e).every(rt)}return String(e)===e||Number.isFinite(e)},st=(e)=>{try{if(String(e.id)!==e.id||!uo.test(e.id)||!Number.isFinite(e.anchor.x)||Math.abs(e.anchor.x)>1e5||!Number.isFinite(e.anchor.y)||Math.abs(e.anchor.y)>1e5||!Number.isFinite(e.anchor.width)||!Number.isFinite(e.anchor.height)||e.anchor.width<=0||e.anchor.height<=0||e.anchor.width>1e5||e.anchor.height>1e5||!Number.isInteger(e.width)||e.width<160||e.width>640||!Number.isInteger(e.height)||e.height<48||e.height>480||e.side!==void 0&&!po.includes(e.side)||e.focus!==void 0&&e.focus!==!0&&e.focus!==!1||!Eo(e.data)||!rt(e.data))return!1;return JSON.stringify(e.data).length<=16000}catch{return!1}};var at=2000;var So=["file","directory","other","missing"],ct=(e)=>Boolean(e&&"sessionId"in e),dt=(e)=>Boolean(e&&"sent"in e&&!("sessionId"in e));var fo=/^[0-9a-f]{7,64}$/i,lt=(e)=>fo.test(e),Ce=500,Ue=32000,Ao=16000,Oo=128,Ro=200,ho=2000,mo=16000,Io=80,xo=200,go=16000;var bo=2000;var _t=20000,ke=1024,Me=2000000;var ye=64000,Ne=8000,ut=4000;var pt=960000;var Co=999,Uo=1e4,Te=500,ko=["HOST_UNAVAILABLE","HOST_TIMEOUT","HOST_REJECTED","DISCONNECTED","DISABLED","BAD_PATH","NO_INTEGRATION","NO_SERVICE","SERVICE_FAILED","REQUEST_FAILED","RESPONSE_TOO_LARGE","NO_SESSION","SESSION_BUSY","NOT_GRANTED","NO_DIRECTORY","NOT_FOUND","FILE_TOO_LARGE","DENIED","NO_MODEL","MODEL_FAILED","UNSUPPORTED"],Mo=["stopped","starting","ready","failed"],ln=new Set(ko),yo=(e)=>ln.has(e),No=(e)=>e&&yo(e)?e:"HOST_REJECTED",re=(e)=>{if(e===void 0)return!1;if(e===null||e===!0||e===!1)return!0;if(String(e)===e)return!0;if(Number(e)===e)return Number.isFinite(e);if(Array.isArray(e))return e.every(re);if(Object(e)===e)return Object.values(e).every(re);return!1},Lo=(e)=>re(e)&&JSON.stringify(e).length<=go,To=(e)=>e?.trim().slice(0,xo)??"",se=(e)=>{let n=e.id.trim().slice(0,Oo),s=e.title.trim().slice(0,Ro),T=e.url.trim().slice(0,ho),u=e.text?.trim().slice(0,mo),A=e.author?.trim().slice(0,Io),C=e.kind==="pull"?"pull":"issue",O={providerId:e.providerId.trim(),id:n,title:s||n,url:T,kind:C};if(u)O.text=u;if(A)O.author=A;if(C==="pull"){let M=To(e.branches?.head),D=To(e.branches?.base);if(M&&D)O.branches={head:M,base:D}}if(Lo(e.data))O.data=e.data;return O},Et=(e)=>{let n=se(e);if(e.projectId)n.projectId=e.projectId;if(e.navigation)n.navigation=e.navigation;if(e.worktree)n.worktree=e.worktree;return n},Tt=(e)=>{let n={text:e.text.trim().slice(0,Ao)};if(e.send)n.send=!0;return n},St=(e)=>{if(e===null||!Number.isFinite(e))return null;return Math.min(Co,Math.max(0,Math.round(e)))},ft=(e)=>{if(!Number.isFinite(e))return 0;return Math.min(Uo,Math.max(0,Math.ceil(e)))};var ie=(e)=>e.length>0&&e.length<=ke&&!e.includes("\x00")&&!e.includes("\\");var Le=(e)=>{if(!e.startsWith("/")||e.includes("\x00")||e.includes("\\")||e.includes("://"))return!1;if(e.length>bo)return!1;return!e.split("/").some((s)=>s==="."||s==="..")},_n=new Set(Mo),At=(e)=>Boolean(e&&"status"in e&&_n.has(String(e.status))&&!("body"in e)),Pe=(e)=>Boolean(e&&"status"in e&&"body"in e&&Number.isInteger(e.status)),Ot=(e)=>Boolean(e&&"content"in e&&String(e.content)===e.content),Rt=(e)=>Boolean(e&&"written"in e&&e.written===!0),ht=(e)=>Boolean(e&&"entries"in e&&Array.isArray(e.entries)),un=new Set(So),mt=(e)=>Boolean(e&&"kind"in e&&"size"in e&&un.has(String(e.kind))&&Number.isFinite(e.size)),It=(e)=>Boolean(e&&"text"in e&&String(e.text)===e.text&&!("status"in e)),pn=new Set(["workspace","shells","ready","directory","session","connection","settings","session-lifecycle","item","resolve","action","service-event","status-control-event","popover-closed","file-open","file-snapshot","file-saved","generate-late","microphone-audio","microphone-ended"]),En=(e)=>Object(e)===e?e:null,it=(e)=>String(e)===e&&e.length>0,Tn=(e)=>{if(!it(e.id))return null;if(e.ok===!0){let n={channel:p,v:E,type:"result",id:e.id,ok:!0};if(Object(e.payload)===e.payload)n.payload=e.payload;return n}if(e.ok===!1&&it(e.error))return{channel:p,v:E,type:"result",id:e.id,ok:!1,error:e.error,code:No(it(e.code)?e.code:void 0)};return null},xt=(e)=>{let n=En(e);if(!n||n.channel!==p||n.v!==E)return null;if(n.type==="result")return Tn(n);if(!pn.has(String(n.type))||Object(n.payload)!==n.payload)return null;return n};var Po=(e)=>("key"in e)&&("metaKey"in e)&&("ctrlKey"in e),Sn=(e)=>(e.metaKey||e.ctrlKey)&&!e.altKey&&!e.shiftKey&&e.key.toLowerCase()==="s";class c extends Error{code;constructor(e,n){super(n);this.name="HostRequestError",this.code=e}}var vo=()=>Promise.reject(new c("BAD_PATH",'Request path must start with "/" and stay on the declared origin.')),ve=()=>Promise.reject(new c("BAD_PATH",`File path must be 1 to ${ke} characters without NUL or backslash.`)),we=(e)=>{if(e===void 0)return;if(Object(e)!==e||Array.isArray(e)||e.scope!==void 0&&e.scope!=="instance"&&e.scope!=="device")throw new c("HOST_REJECTED",'Storage scope must be "instance" or "device".');return e.scope==="device"?"device":void 0},_=(e)=>(e.value+=1,`oc-${e.value}`),gt=(e={})=>{let n=e.target??("window"in globalThis?window:null);if(!n)throw new c("HOST_UNAVAILABLE","No window. connectHost runs in a browser frame.");let s=e.acceptSource??((t)=>t===n.parent),T=e.requestTimeoutMs??_t,u=new Set,A=new Set,C=new Set,O=new Set,M=new Set,D=new Set,F=new Set,B=new Set,K=new Set,Z=new Set,fe=new Set,q=new Set,Be=[],de=null,le=null,Ae=new Set,Oe=new Set,_e=null,ue=null,Ke=!1,ee=new Map,te=new Map,oe=new Map,X=!1,l={value:0},d=null,W=null,pe=!1,Ee=!1,Ft=null,v=null,Bt=(t)=>{if(!t)return null;return{sessionId:t.id,phase:t.busy?"started":"completed"}},y=(t)=>{n.parent.postMessage(t,"*")},Kt=()=>{if(X||n.parent===n||q.size===0||d?.features?.lateGenerateResults!==!0)return;y({channel:p,v:E,type:"generate-late-listen"})},R=(t,o)=>{for(let a of t)try{a(o)}catch(i){console.error(i)}},Wt=(t)=>{if(!(t instanceof MessageEvent))return;if(!s(t.source))return;let o=xt(t.data);if(!o)return;if(o.type==="workspace"){let i=te.get(o.payload.subscriptionId);if(i)R([i],o.payload.snapshot);return}if(o.type==="shells"){let i=oe.get(o.payload.subscriptionId);if(i)R([i],o.payload.snapshot);return}if(o.type==="microphone-audio"){v?.queue.push(o.payload.samples);return}if(o.type==="microphone-ended"){let i=v;if(!i)return;v=null,i.release(),R(i.endedListeners,o.payload.reason);return}if(o.type==="ready"){if(d=o.payload,W=Bt(o.payload.session),R(u,o.payload),R(A,o.payload.directory),R(C,o.payload.session),W)R(O,W);if(R(M,o.payload.connection),R(D,o.payload.settings),R(F,o.payload.item),o.payload.block)R(B,o.payload.block);Kt();return}if(o.type==="service-event"){R(K,o.payload);return}if(o.type==="generate-late"){if(q.size===0)Be.push(o.payload);else R(q,o.payload);return}if(o.type==="directory"){if(d)d={...d,directory:o.payload.directory};R(A,o.payload.directory);return}if(o.type==="session"){if(d)d={...d,session:o.payload.session};if(!o.payload.session)W=null;else if(W?.sessionId!==o.payload.session.id)W=Bt(o.payload.session);R(C,o.payload.session);return}if(o.type==="session-lifecycle"){W=o.payload,R(O,o.payload);return}if(o.type==="connection"){if(d)d={...d,connection:o.payload.connection};R(M,o.payload.connection);return}if(o.type==="settings"){if(d)d={...d,settings:o.payload.settings};R(D,o.payload.settings);return}if(o.type==="item"){if(d)d={...d,item:o.payload.item};R(F,o.payload.item);return}if(o.type==="status-control-event"){R(Z,o.payload);return}if(o.type==="popover-closed"){R(fe,o.payload);return}if(o.type==="action"){let i=(f)=>{if(!X)y({channel:p,v:E,type:"action-result",id:o.id,payload:f})},S=le;if(!S){i({ok:!1,error:"This extension does not handle background actions."});return}Promise.resolve().then(()=>S(o.payload)).then(()=>i({ok:!0}),(f)=>{let h=(f instanceof Error?f.message:String(f)).trim();i({ok:!1,error:(h||"Action failed.").slice(0,Te)})});return}if(o.type==="file-open"){let i=o.payload;if(ue&&_o(ue,i))return;ue=i,R(Ae,o.payload);return}if(o.type==="file-saved"){R(Oe,o.payload.version);return}if(o.type==="file-snapshot"){let i=(h)=>{if(!X)y({channel:p,v:E,type:"file-snapshot-result",id:o.id,payload:h})},S=(h)=>i({error:(h.trim()||"Could not read the edited file.").slice(0,Te)}),f=_e;if(!f){S("This extension does not edit files.");return}Promise.resolve().then(()=>f(o.payload.purpose)).then((h)=>{if(nt(h)>ge){S(`The file is over ${ge} ${"bytes"in h?"bytes":"characters"}.`);return}if(h.version.length>be){S(`The snapshot version is over ${be} characters.`);return}i({snapshot:"bytes"in h?{bytes:h.bytes,version:h.version}:{content:h.content,version:h.version}})},(h)=>S(h instanceof Error?h.message:String(h)));return}if(o.type==="resolve"){let i=(f)=>{y({channel:p,v:E,type:"resolve-result",id:o.id,payload:f})},S=de;if(!S){i({error:"This extension does not resolve commands."});return}Promise.resolve().then(()=>S(o.payload)).then((f)=>i({item:f?se(f):null}),(f)=>{let h=(f instanceof Error?f.message:String(f)).trim();i({error:(h||"Command failed.").slice(0,Te)})});return}let a=ee.get(o.id);if(!a)return;if(clearTimeout(a.timer),ee.delete(o.id),o.ok){a.resolve(o.payload);return}a.reject(new c(o.code,o.error))};n.addEventListener("message",Wt),y({channel:p,v:E,type:"hello"});let U=(t,o=T)=>{if(X||n.parent===n)return Promise.reject(new c("HOST_UNAVAILABLE","No host frame. This page is not in an iframe."));return new Promise((a,i)=>{let S=setTimeout(()=>{ee.delete(t.id),i(new c("HOST_TIMEOUT","Host did not answer in time."))},o);ee.set(t.id,{resolve:a,reject:i,timer:S}),y(t)})},b=(t)=>U(t).then(()=>{return}),I={channel:p,v:E},We=(t)=>{if(!X&&n.parent!==n)y(t)},jt=()=>We({...I,type:"file-save"}),je=()=>{if(!X&&n.parent!==n)y({...I,type:"microphone-close",id:_(l)})},sn=async()=>{if(v)throw new c("HOST_REJECTED","The microphone is already open in this frame.");if(d?.features?.microphone!==!0)throw new c("UNSUPPORTED","This OpenChamber cannot share the microphone with extensions.");let t=globalThis.AudioContext;if(typeof t!=="function")throw new c("UNSUPPORTED","This frame has no Web Audio.");let o=new t;if(o.sampleRate<qe||o.sampleRate>et)throw o.close().catch(()=>{return}),new c("UNSUPPORTED",`Audio at ${o.sampleRate} Hz is not supported.`);let a=o.state==="suspended"?o.resume().catch(()=>{return}):void 0,i=oo(Math.round(o.sampleRate/4)),S=o.createScriptProcessor(1024,1,1);S.onaudioprocess=(G)=>i.pull(G.outputBuffer.getChannelData(0));let f=o.createMediaStreamDestination();S.connect(f);let h=new Set,ne={queue:i,endedListeners:h,release:()=>{S.onaudioprocess=null,S.disconnect(),i.clear();for(let G of f.stream.getTracks())G.stop();o.close().catch(()=>{return})}};v=ne;try{let G=await U({...I,type:"microphone-open",id:_(l),payload:{sampleRate:o.sampleRate}},tt);if(!G||!("opened"in G)||G.opened!==!0)throw new c("HOST_REJECTED","Host did not open the microphone.");if(await a,v!==ne)throw new c("DISCONNECTED","The microphone closed while it was opening.")}catch(G){if(v===ne)v=null;throw ne.release(),je(),G}return{stream:f.stream,close:()=>{if(v!==ne)return;v=null,ne.release(),je()},onEnded:(G)=>(h.add(G),()=>{h.delete(G)})}},zt=(t)=>{if(!Po(t)||!Sn(t))return;t.preventDefault(),jt()},Yt=(t)=>{if(!Po(t)||t.key!=="Escape"||d?.surface!=="popover"||!d.popover)return;t.preventDefault(),qt(d.popover.id,"escape").catch(()=>{return})},Re=()=>{let t=d?.surface==="popover"?d.popover:void 0;if(!t)return;let o=pe||Ee;if(Ft===o)return;Ft=o,eo(t.id,o).catch(()=>{return})},he=()=>{if(d?.surface!=="popover"||pe)return;pe=!0,Re()},Jt=(t)=>{if(d?.surface!=="popover"||t.relatedTarget!==null||!pe)return;pe=!1,Re()},Qt=()=>{if(d?.surface!=="popover"||Ee)return;Ee=!0,Re()},Zt=()=>{if(d?.surface!=="popover"||!Ee)return;Ee=!1,Re()},H=(t,o=1024)=>{if(!t.trim()||t.length>o)throw new c("HOST_REJECTED",`Identity must contain 1 to ${o} characters.`)},ze=async(t)=>{if(t.kind!=="projects")H(t.projectId);let o=await U({...I,type:"workspace-read",id:_(l),payload:t});if(!o||!("kind"in o)||!("state"in o)||o.kind!==t.kind)throw new c("HOST_REJECTED","Host did not return workspace data.");return o},Ye=async(t,o)=>{if(t.kind!=="projects")H(t.projectId);let a=_(l);te.set(a,o);try{await b({...I,type:"workspace-subscribe",id:_(l),payload:{subscriptionId:a,query:t}})}catch(i){if(te.delete(a),!X)y({...I,type:"workspace-unsubscribe",id:_(l),payload:{subscriptionId:a}});throw i}return()=>{if(!te.delete(a)||X)return;y({...I,type:"workspace-unsubscribe",id:_(l),payload:{subscriptionId:a}})}},an=async(t,o)=>{if(t.kind==="session")H(t.sessionId);if(t.kind==="project")H(t.projectId);let a=_(l);oe.set(a,o);try{await b({...I,type:"shells-subscribe",id:_(l),payload:{subscriptionId:a,scope:t}})}catch(i){if(oe.delete(a),!X)y({...I,type:"shells-unsubscribe",id:_(l),payload:{subscriptionId:a}});throw i}return()=>{if(!oe.delete(a)||X)return;y({...I,type:"shells-unsubscribe",id:_(l),payload:{subscriptionId:a}})}},me=async(t)=>{if("key"in t&&(t.key.length===0||t.key.length>Qe))throw new c("HOST_REJECTED","Storage key must contain 1 to 128 characters.");if(t.op==="set"&&!re(t.value))throw new c("HOST_REJECTED","Storage values must be JSON.");if(t.op==="set"&&new TextEncoder().encode(JSON.stringify(t.value)).length>Ze)throw new c("HOST_REJECTED","Storage value exceeds 64 KiB.");if(t.scope==="device"&&d?.features?.deviceStorage!==!0)throw new c("UNSUPPORTED","This host does not support device storage.");let o=await U({...I,type:"storage",id:_(l),payload:t});if(!o||!("storage"in o)||o.op!==t.op)throw new c("HOST_REJECTED","Host did not return storage data.");return o},qt=(t,o)=>d?.features?.popovers!==!0&&!(d?.surface==="popover"&&d.popover?.id===t)?Promise.reject(new c("UNSUPPORTED","This host does not support popovers.")):b({...I,type:"popover-close",id:_(l),payload:o?{id:t,reason:o}:{id:t}}),eo=(t,o)=>d?.features?.popovers!==!0&&!(d?.surface==="popover"&&d.popover?.id===t)?Promise.reject(new c("UNSUPPORTED","This host does not support popovers.")):b({...I,type:"popover-anchor",id:_(l),payload:{id:t,active:o}});return n.addEventListener("keydown",Yt,!0),n.addEventListener("pointerover",he),n.addEventListener("pointermove",he),n.addEventListener("pointerout",Jt),n.addEventListener("focus",Qt),n.addEventListener("blur",Zt),{onAction:(t)=>(le=t,()=>{if(le===t)le=null}),listProjects:async()=>{let t=await ze({kind:"projects"});if(t.kind!=="projects")throw new c("HOST_REJECTED","Expected projects.");return t},listWorktrees:async(t)=>{let o=await ze({kind:"worktrees",projectId:t});if(o.kind!=="worktrees")throw new c("HOST_REJECTED","Expected worktrees.");return o},listSessions:async(t)=>{let o=await ze({kind:"sessions",projectId:t});if(o.kind!=="sessions")throw new c("HOST_REJECTED","Expected sessions.");return o},onProjects:(t)=>Ye({kind:"projects"},(o)=>{if(o.kind==="projects")t(o)}),onWorktrees:(t,o)=>Ye({kind:"worktrees",projectId:t},(a)=>{if(a.kind==="worktrees")o(a)}),onSessions:(t,o)=>Ye({kind:"sessions",projectId:t},(a)=>{if(a.kind==="sessions")o(a)}),onRunningShells:(t,o)=>an(t,o),readShellOutput:async(t,o)=>{H(t,Ie);let a=o?.cursor;if(a!==void 0&&(!Number.isInteger(a)||a<0))throw new c("HOST_REJECTED","Shell output cursor must be a non-negative integer.");let i=o?.tailBytes;if(i!==void 0&&(!Number.isInteger(i)||i<1||i>xe))throw new c("HOST_REJECTED",`Shell output tailBytes must be an integer between 1 and ${xe}.`);let f=await U({...I,type:"shell-output",id:_(l),payload:{shellId:t,cursor:a,tailBytes:i}});if(!f||typeof f.output!=="string"||!Number.isFinite(f.cursor))throw new c("HOST_REJECTED","Host did not return shell output.");return f},stopShell:async(t)=>{if(H(t,Ie),(await U({...I,type:"shell-stop",id:_(l),payload:{shellId:t}}))?.stopped!==!0)throw new c("HOST_REJECTED","Host did not stop the shell.");return{stopped:!0}},openSession:async(t)=>{H(t),await b({...I,type:"open-session",id:_(l),payload:{sessionId:t}})},storage:{get:async(t,o)=>{let a=we(o),i={op:"get",key:t};if(a)i.scope=a;let S=await me(i);return S.op==="get"&&S.found?S.value:void 0},set:async(t,o,a)=>{let i=we(a),S={op:"set",key:t,value:o};if(i)S.scope=i;await me(S)},delete:async(t,o)=>{let a=we(o),i={op:"delete",key:t};if(a)i.scope=a;await me(i)},keys:async(t)=>{let o=we(t),a={op:"keys"};if(o)a.scope=o;let i=await me(a);if(i.op!=="keys")throw new c("HOST_REJECTED","Expected storage keys.");return i.keys}},onReady:(t)=>{if(u.add(t),d)t(d);return()=>{u.delete(t)}},onDirectory:(t)=>{if(A.add(t),d)t(d.directory);return()=>{A.delete(t)}},onSession:(t)=>{if(C.add(t),d)t(d.session);return()=>{C.delete(t)}},onSessionLifecycle:(t)=>{if(O.add(t),W)t(W);return()=>{O.delete(t)}},onConnection:(t)=>{if(M.add(t),d)t(d.connection);return()=>{M.delete(t)}},onSettings:(t)=>{if(D.add(t),d)t(d.settings);return()=>{D.delete(t)}},onItem:(t)=>{if(F.add(t),d)t(d.item);return()=>{F.delete(t)}},onBlock:(t)=>{if(B.add(t),d?.block)t(d.block);return()=>{B.delete(t)}},onServiceEvent:(t)=>(K.add(t),()=>{K.delete(t)}),onStatusControl:(t)=>(Z.add(t),()=>{Z.delete(t)}),onPopoverClosed:(t)=>(fe.add(t),()=>{fe.delete(t)}),setStatusControls:(t)=>{if(d?.features?.statusControls!==!0)return Promise.reject(new c("UNSUPPORTED","This host does not support status controls."));if(!ao(t))return Promise.reject(new c("HOST_REJECTED","Status controls must have unique bounded ids and valid selected options."));return b({...I,type:"status-controls",id:_(l),payload:{controls:t}})},openPopover:(t)=>{if(d?.features?.popovers!==!0)return Promise.reject(new c("UNSUPPORTED","This host does not support popovers."));if(!st(t))return Promise.reject(new c("HOST_REJECTED","Popover requests need bounded geometry and JSON data."));return b({...I,type:"popover-open",id:_(l),payload:t})},closePopover:qt,setPopoverAnchorActive:eo,onResolve:(t)=>(de=t,()=>{if(de===t)de=null}),toast:(t)=>{let o=t.message.trim();if(!o||o.length>Ce)return Promise.reject(new c("HOST_REJECTED",`Toast message must contain 1 to ${Ce} characters.`));if(t.copy&&t.copy!==!0&&(!t.copy.text.length||t.copy.text.length>Ue))return Promise.reject(new c("HOST_REJECTED",`Toast copy text must contain 1 to ${Ue} characters.`));return b({channel:p,v:E,type:"toast",id:_(l),payload:{...t,message:o}})},openUrl:(t)=>b({channel:p,v:E,type:"open-url",id:_(l),payload:{url:t}}),openCommit:(t)=>lt(t)?b({channel:p,v:E,type:"open-commit",id:_(l),payload:{sha:t}}):Promise.reject(new c("HOST_REJECTED","Commit id must be 7 to 64 hex characters.")),answerBlock:(t)=>b({channel:p,v:E,type:"block-answer",id:_(l),payload:{text:t.trim().slice(0,at)}}),openSurface:(t)=>b({channel:p,v:E,type:"open-surface",id:_(l),payload:{surfaceId:t}}),writeClipboard:(t)=>b({channel:p,v:E,type:"clipboard-write",id:_(l),payload:{text:t}}),compose:(t)=>b({channel:p,v:E,type:"compose",id:_(l),payload:t}),attach:(t)=>b({channel:p,v:E,type:"attach",id:_(l),payload:se(t)}),startSession:async(t)=>{if(t.projectId!==void 0)H(t.projectId);let o=t.worktree;if(o&&o!==!0)if(o.kind==="existing")H(o.directory);else{if(o.name!==void 0)H(o.name,200);if(o.baseBranch!==void 0)H(o.baseBranch,200)}let a=await U({channel:p,v:E,type:"start-session",id:_(l),payload:Et(t)},e.requestTimeoutMs??180000);if(!ct(a))throw new c("HOST_REJECTED","Host did not return a session.");return a},prompt:(t)=>U({channel:p,v:E,type:"prompt",id:_(l),payload:Tt(t)}).then((o)=>{if(!dt(o))throw new c("HOST_REJECTED","Host did not return a prompt result.");return o}),sessionLink:(t)=>b({channel:p,v:E,type:"session-link",id:_(l),payload:se(t)}),close:()=>b({channel:p,v:E,type:"close",id:_(l)}),oauthStart:()=>b({channel:p,v:E,type:"oauth-start",id:_(l)}),oauthDisconnect:()=>b({channel:p,v:E,type:"oauth-disconnect",id:_(l)}),request:(t)=>(Le(t.path)?U({channel:p,v:E,type:"request",id:_(l),payload:t}):vo()).then((o)=>{if(!Pe(o))throw new c("HOST_REJECTED","Host request result was empty.");return o}),serviceRequest:(t)=>(Le(t.path)?U({channel:p,v:E,type:"service-request",id:_(l),payload:t}):vo()).then((o)=>{if(!Pe(o))throw new c("HOST_REJECTED","Host service request result was empty.");return o}),serviceStatus:()=>U({channel:p,v:E,type:"service-status",id:_(l)}).then((t)=>{if(!At(t))throw new c("HOST_REJECTED","Host did not return service status.");return t}),readFile:(t)=>(ie(t)?U({channel:p,v:E,type:"file-read",id:_(l),payload:{path:t}}):ve()).then((o)=>{if(!Ot(o))throw new c("HOST_REJECTED","Host did not return file content.");return o}),writeFile:(t,o)=>{if(!ie(t))return ve();if(o.length>Me)return Promise.reject(new c("FILE_TOO_LARGE",`Content is over ${Me} characters.`));return U({channel:p,v:E,type:"file-write",id:_(l),payload:{path:t,content:o}}).then((a)=>{if(!Rt(a))throw new c("HOST_REJECTED","Host did not confirm the write.");return a})},listDir:(t)=>(ie(t)?U({channel:p,v:E,type:"file-list",id:_(l),payload:{path:t}}):ve()).then((o)=>{if(!ht(o))throw new c("HOST_REJECTED","Host did not return directory entries.");return o}),stat:(t)=>(ie(t)?U({channel:p,v:E,type:"file-stat",id:_(l),payload:{path:t}}):ve()).then((o)=>{if(!mt(o))throw new c("HOST_REJECTED","Host did not return file status.");return o}),generate:(t)=>{let o=t.prompt.trim(),a=t.system?.trim();if(o.length===0||o.length>ye)return Promise.reject(new c("HOST_REJECTED",`Prompt must be 1 to ${ye} characters.`));if(a!==void 0&&(a.length===0||a.length>Ne))return Promise.reject(new c("HOST_REJECTED",`System prompt must be 1 to ${Ne} characters.`));let i=t.maxOutputTokens===void 0?void 0:Math.min(ut,Math.max(1,Math.floor(t.maxOutputTokens)));if(i!==void 0&&!Number.isFinite(i))return Promise.reject(new c("HOST_REJECTED","maxOutputTokens must be a number."));let S={prompt:o};if(a!==void 0)S.system=a;if(i!==void 0)S.maxOutputTokens=i;return U({channel:p,v:E,type:"generate",id:_(l),payload:S},e.requestTimeoutMs??pt).then((f)=>{if(!It(f))throw new c("HOST_REJECTED","Host did not return generated text.");return f})},onLateGenerateResult:(t)=>{q.add(t);for(let o of Be.splice(0))R([t],o);return Kt(),()=>{q.delete(t)}},openMicrophone:sn,setBadge:(t)=>b({channel:p,v:E,type:"badge",id:_(l),payload:{count:St(t)}}),setHeight:(t)=>b({channel:p,v:E,type:"resize",id:_(l),payload:{height:ft(t)}}),onFileOpen:(t)=>{if(Ae.add(t),!Ke)Ke=!0,n.addEventListener("keydown",zt,!0);if(ue)t(ue);return()=>{Ae.delete(t)}},onFileSnapshot:(t)=>(_e=t,()=>{if(_e===t)_e=null}),onFileSaved:(t)=>(Oe.add(t),()=>{Oe.delete(t)}),reportFileChange:(t)=>We({...I,type:"file-change",payload:{dirty:t.dirty,edited:t.edited}}),requestFileSave:jt,reportFileUnsupported:()=>We({...I,type:"file-unsupported"}),dispose:()=>{for(let t of te.keys())y({...I,type:"workspace-unsubscribe",id:_(l),payload:{subscriptionId:t}});te.clear();for(let t of oe.keys())y({...I,type:"shells-unsubscribe",id:_(l),payload:{subscriptionId:t}});if(oe.clear(),v)je(),v.release(),v=null;if(X=!0,de=null,le=null,_e=null,Ae.clear(),Oe.clear(),Ke)n.removeEventListener("keydown",zt,!0);n.removeEventListener("message",Wt),n.removeEventListener("keydown",Yt,!0),n.removeEventListener("pointerover",he),n.removeEventListener("pointermove",he),n.removeEventListener("pointerout",Jt),n.removeEventListener("focus",Qt),n.removeEventListener("blur",Zt);for(let t of ee.values())clearTimeout(t.timer),t.reject(new c("HOST_UNAVAILABLE","Host client was disposed."));ee.clear(),u.clear(),A.clear(),C.clear(),O.clear(),M.clear(),D.clear(),F.clear(),B.clear(),K.clear(),Z.clear(),fe.clear(),q.clear(),Be.length=0}}};var wo=["browser.open","browser.snapshot","browser.click","browser.type","browser.select","browser.scroll","browser.back","browser.forward","browser.inspect","browser.capture","browser.resize","browser.close"];var dr=new Set(wo);var Go=["none","agent","user"];var _r=new Set(Go);var fn=[["--oc-bg","background"],["--oc-elevated","elevated"],["--oc-fg","foreground"],["--oc-muted","muted"],["--oc-subtle","subtle"],["--oc-border","border"],["--oc-hover","hover"],["--oc-selection","selection"],["--oc-focus","focus"],["--oc-primary","primary"],["--oc-muted-surface","mutedSurface"],["--oc-elevated-fg","elevatedForeground"],["--oc-active","active"],["--oc-selection-fg","selectionForeground"],["--oc-primary-fg","primaryForeground"],["--oc-primary-text","primaryText"],["--oc-success-text","successText"],["--oc-warning-text","warningText"],["--oc-error-text","errorText"],["--oc-info-text","infoText"],["--oc-success","success"],["--oc-warning","warning"],["--oc-error","error"],["--oc-info","info"],["--oc-font","font"],["--oc-mono","mono"],["--oc-radius","radius"],["--surface-background","background"],["--surface-elevated","elevated"],["--surface-foreground","foreground"],["--surface-muted-foreground","muted"],["--surface-subtle","subtle"],["--interactive-border","border"],["--interactive-hover","hover"],["--interactive-selection","selection"],["--interactive-focus-ring","focus"],["--primary","primary"],["--surface-muted","mutedSurface"],["--surface-elevated-foreground","elevatedForeground"],["--interactive-active","active"],["--interactive-selection-foreground","selectionForeground"],["--primary-foreground","primaryForeground"],["--primary-text","primaryText"],["--success-text","successText"],["--warning-text","warningText"],["--error-text","errorText"],["--info-text","infoText"],["--status-success","success"],["--status-warning","warning"],["--status-error","error"],["--status-info","info"],["--font-sans","font"],["--font-mono","mono"],["--radius","radius"]],An=[["--oc-syntax-keyword","--syntax-keyword","syntaxKeyword"],["--oc-syntax-string","--syntax-string","syntaxString"],["--oc-syntax-number","--syntax-number","syntaxNumber"],["--oc-syntax-function","--syntax-function","syntaxFunction"],["--oc-syntax-type","--syntax-type","syntaxType"],["--oc-syntax-comment","--syntax-comment","syntaxComment"],["--oc-syntax-variable","--syntax-variable","syntaxVariable"],["--oc-syntax-operator","--syntax-operator","syntaxOperator"]],Do=(e,n)=>{n.style.colorScheme=e.mode;for(let[s,T]of fn)n.style.setProperty(s,e.tokens[T]);for(let[s,T,u]of An){let A=e.tokens[u]??"";n.style.setProperty(s,A),n.style.setProperty(T,A)}n.style.setProperty("font-family",e.tokens.font),n.style.setProperty("font-size",e.tokens.fontSize??"0.875rem"),n.style.setProperty("line-height","1.45"),n.style.setProperty("color",e.tokens.foreground)},bt=(e,n)=>{if(Do(e.theme,n),n.dataset)n.dataset.ocSurface=e.surface,n.dataset.ocTheme=e.theme.mode};var On={"surface-background":"bg","surface-elevated":"elevated","surface-elevated-foreground":"elevated-fg","surface-foreground":"fg","surface-muted-foreground":"muted","surface-muted":"muted-surface","surface-subtle":"subtle","interactive-border":"border","interactive-hover":"hover","interactive-active":"active","interactive-selection":"selection","interactive-selection-foreground":"selection-fg","interactive-focus-ring":"focus",primary:"primary","primary-foreground":"primary-fg","primary-text":"primary-text","success-text":"success-text","warning-text":"warning-text","error-text":"error-text","info-text":"info-text","status-success":"success","status-warning":"warning","status-error":"error","status-info":"info","font-sans":"font","font-mono":"mono",radius:"radius"},m=(e,n)=>`var(--${e}, var(--oc-${On[e]}, ${n}))`,z=m("surface-background","transparent"),De=m("surface-elevated","transparent"),ae=m("surface-elevated-foreground","inherit"),w=m("surface-foreground","inherit"),x=m("surface-muted-foreground","gray"),Rn=m("surface-muted","transparent"),J=m("interactive-border","currentColor"),N=m("interactive-hover","transparent"),Q=m("interactive-active","transparent"),Ct=m("interactive-selection","transparent"),Ut=m("interactive-selection-foreground","inherit"),j=m("primary","currentColor"),kt=m("primary-text","inherit"),Mt=m("error-text","inherit"),hn=m("font-sans","inherit"),yt=m("font-mono","monospace"),Vo=m("radius","9px"),Nt=`calc(${Vo} - 2px)`,Xo=`calc(${Vo} - 4px)`,g=(e,n,s="transparent")=>`color-mix(in srgb, ${e} ${n}%, ${s})`,Ho=`background-image: linear-gradient(${N}, ${N});`,Lt=(e,n="0.5px")=>`box-shadow: inset 0 0 0 ${n} ${e}, var(--oc-sdk-field-lift);`,Pt="border-color: var(--oc-sdk-edge); box-shadow: var(--oc-sdk-raised-lift);",$o="box-shadow: var(--oc-sdk-lit);",vt=`inset 0 0.5px 0 0 ${g(w,8)}, 0 1px 2px 0 rgb(0 0 0 / 0.4)`,mn=`
:root {
  --oc-sdk-edge: ${g(w,16)};
  --oc-sdk-field-bg: ${De};
  --oc-sdk-raised-bg: ${z};
  --oc-sdk-field-lift: inset 0 1px 2px 0 rgb(0 0 0 / 0.04);
  --oc-sdk-raised-lift: 0 1px 1.5px 0 rgb(0 0 0 / 0.08);
  --oc-sdk-lit: inset 0 1px 0 0 rgb(255 255 255 / 0.2), 0 1px 1.5px 0 rgb(0 0 0 / 0.1);
  --oc-sdk-float-edge: rgb(0 0 0 / 0.14);
  --oc-sdk-float: inset 0 1px 0 0 rgb(255 255 255 / 0.7), 0 1px 2px -0.5px rgb(0 0 0 / 0.06), 0 4px 8px -2px rgb(0 0 0 / 0.08), 0 12px 20px -4px rgb(0 0 0 / 0.06);
}
:root[data-oc-theme="dark"] {
  --oc-sdk-edge: ${g(w,14)};
  --oc-sdk-field-bg: ${g(z,50,De)};
  --oc-sdk-raised-bg: ${De};
  --oc-sdk-field-lift: ${vt};
  --oc-sdk-raised-lift: ${vt};
  --oc-sdk-lit: ${vt};
  --oc-sdk-float-edge: rgb(0 0 0 / 0.55);
  --oc-sdk-float: inset 0 1px 0 0 rgb(255 255 255 / 0.04), inset 0 0 0 0.5px rgb(255 255 255 / 0.08), 0 8px 16px 0 rgb(0 0 0 / 0.25), 0 4px 8px 0 rgb(0 0 0 / 0.25);
}`,Ge=(e)=>{let n=m(`status-${e}`,"currentColor");return`
.oc-sdk[data-tone="${e}"], .oc-sdk [data-tone="${e}"] { --oc-sdk-tone: ${n}; --oc-sdk-tone-text: ${m(`${e}-text`,"inherit")}; }`},r=(e)=>`calc(${e}rem / 14)`,In=`
.oc-sdk { box-sizing: border-box; font-size: 0.875rem; line-height: 1.45; }
.oc-sdk *, .oc-sdk *::before, .oc-sdk *::after { box-sizing: border-box; }
/* :where() keeps the reset at zero specificity so every primitive class below overrides it. */
:where(.oc-sdk) :where(button, input, textarea), :where(button.oc-sdk, input.oc-sdk, textarea.oc-sdk) { font: inherit; color: inherit; margin: 0; }
:where(.oc-sdk) :where(button), :where(button.oc-sdk) { cursor: pointer; background: none; border: 0; padding: 0; }
.oc-sdk button:disabled, button.oc-sdk:disabled, .oc-sdk[aria-disabled="true"], .oc-sdk [aria-disabled="true"] { opacity: .5; pointer-events: none; }

.oc-sdk-btn { display: inline-flex; align-items: center; justify-content: center; gap: ${r(8)}; height: ${r(32)}; padding: 0 ${r(12)}; border: 1px solid transparent; font-size: 0.875rem; font-weight: 500; line-height: 1; white-space: nowrap; }
.oc-sdk-btn[data-size="sm"] { gap: ${r(6)}; height: ${r(28)}; padding: 0 ${r(10)}; font-size: 0.8125rem; }
.oc-sdk-btn[data-size="xs"] { gap: ${r(4)}; height: ${r(24)}; padding: 0 ${r(8)}; font-size: 0.75rem; }
.oc-sdk-btn[data-loading="true"] { opacity: .5; pointer-events: none; }
.oc-sdk-btn > .oc-sdk-spinner-ring { width: ${r(14)}; height: ${r(14)}; }

.oc-sdk-field { display: flex; flex-direction: column; gap: ${r(4)}; min-width: 0; }
.oc-sdk-field-label { font-size: 0.8125rem; font-weight: 500; }
.oc-sdk-field-note { font-size: 0.75rem; }
.oc-sdk-input { display: block; width: 100%; min-width: 0; height: ${r(32)}; padding: 0 ${r(10)}; border: 0; font-size: 0.875rem; line-height: 1.45; appearance: none; }
textarea.oc-sdk-input { height: auto; padding: ${r(8)} ${r(10)}; resize: vertical; }

.oc-sdk-search { position: relative; min-width: 0; }
.oc-sdk-search .oc-sdk-input { padding-left: ${r(34)}; padding-right: ${r(34)}; }
.oc-sdk-search-icon { position: absolute; left: ${r(11)}; top: 50%; transform: translateY(-50%); pointer-events: none; }
.oc-sdk-search-clear { position: absolute; right: ${r(6)}; top: 50%; transform: translateY(-50%); display: none; align-items: center; justify-content: center; width: ${r(24)}; height: ${r(24)}; }
.oc-sdk-search[data-active="true"] .oc-sdk-search-clear { display: inline-flex; }

.oc-sdk-select { position: relative; display: flex; flex-direction: column; gap: ${r(4)}; min-width: 0; }
.oc-sdk-trigger { display: inline-flex; align-items: center; gap: ${r(6)}; align-self: flex-start; width: auto; max-width: 100%; min-width: 0; height: ${r(28)}; padding: 0 ${r(10)}; border: 1px solid transparent; font-size: 0.8125rem; text-align: left; }
.oc-sdk-trigger-value { flex: 1 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.oc-sdk-trigger-chevron { flex: 0 0 auto; }
.oc-sdk-popup { position: fixed; z-index: 50; display: flex; flex-direction: column; gap: ${r(2)}; min-width: ${r(160)}; max-width: calc(100vw - ${r(16)}); max-height: min(${r(320)}, calc(100vh - ${r(16)})); overflow: auto; padding: ${r(4)}; border: 1px solid transparent; }
.oc-sdk-popup-search { flex: 0 0 auto; padding: ${r(2)} ${r(2)} ${r(4)}; }
.oc-sdk-popup-search .oc-sdk-input { height: ${r(28)}; font-size: 0.8125rem; }
.oc-sdk-option { display: flex; align-items: center; gap: ${r(8)}; width: 100%; padding: ${r(6)} ${r(8)}; font-size: 0.8125rem; text-align: left; }
.oc-sdk-option-label { flex: 1 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.oc-sdk-option-hint { flex: 0 0 auto; font-size: 0.75rem; }
.oc-sdk-option-check { flex: 0 0 auto; display: inline-flex; width: ${r(14)}; visibility: hidden; }
.oc-sdk-option[aria-selected="true"] > .oc-sdk-option-check { visibility: visible; }
.oc-sdk-popup-empty { padding: ${r(8)}; font-size: 0.8125rem; }

.oc-sdk-check { display: inline-flex; align-items: flex-start; gap: ${r(8)}; width: 100%; text-align: left; }
.oc-sdk-check-box { flex: 0 0 auto; display: inline-flex; align-items: center; justify-content: center; width: ${r(14)}; height: ${r(14)}; margin-top: ${r(3)}; border: 1px solid transparent; }
.oc-sdk-check-box > svg { display: none; }
.oc-sdk-check[aria-checked="true"] .oc-sdk-check-box > svg { display: block; }
.oc-sdk-check-thumb { flex: 0 0 auto; position: relative; width: ${r(36)}; height: ${r(20)}; --oc-sdk-thumb-travel: ${r(16)}; }
.oc-sdk-check-thumb::after { content: ""; position: absolute; top: ${r(2)}; left: ${r(2)}; width: ${r(16)}; height: ${r(16)}; }
.oc-sdk-check-text { display: flex; flex-direction: column; min-width: 0; }
.oc-sdk-check-label { font-size: 0.875rem; }
.oc-sdk-check-desc { font-size: 0.75rem; }

.oc-sdk-tabs { display: inline-flex; gap: ${r(2)}; padding: ${r(2)}; max-width: 100%; overflow: auto; }
.oc-sdk-tab { display: inline-flex; align-items: center; gap: ${r(6)}; height: ${r(28)}; padding: 0 ${r(10)}; border: 1px solid transparent; font-size: 0.8125rem; font-weight: 500; white-space: nowrap; }
.oc-sdk-tab-count { font-size: 0.75rem; font-variant-numeric: tabular-nums; }

.oc-sdk-badge { display: inline-flex; align-items: center; padding: ${r(1)} ${r(6)}; font-size: ${r(11)}; font-weight: 500; line-height: ${r(16)}; white-space: nowrap; }

.oc-sdk-list { display: flex; flex-direction: column; gap: 1px; min-width: 0; }
.oc-sdk-row { display: flex; align-items: center; gap: ${r(8)}; width: 100%; padding: ${r(6)} ${r(8)}; text-align: left; }
.oc-sdk-row-lead { flex: 0 0 auto; width: ${r(64)}; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 0.75rem; }
.oc-sdk-row-main { flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; }
.oc-sdk-row-title { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.oc-sdk-row-sub { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 0.75rem; }
.oc-sdk-row-meta { flex: 0 0 auto; font-size: 0.75rem; font-variant-numeric: tabular-nums; }
.oc-sdk-list-empty { padding: ${r(16)} ${r(8)}; text-align: center; font-size: 0.8125rem; }

.oc-sdk-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: ${r(4)}; padding: ${r(40)} ${r(16)}; text-align: center; }
.oc-sdk-empty-title { margin: 0; font-size: 0.8125rem; font-weight: 600; }
.oc-sdk-empty-body { margin: 0; max-width: 32rem; font-size: 0.8125rem; }
.oc-sdk-empty-action { margin-top: ${r(12)}; }

@keyframes oc-sdk-spin { to { transform: rotate(360deg); } }
.oc-sdk-spinner { display: inline-flex; align-items: center; gap: ${r(8)}; font-size: 0.8125rem; }
.oc-sdk-spinner-ring { width: ${r(16)}; height: ${r(16)}; border: 2px solid transparent; animation: oc-sdk-spin .8s linear infinite; }
.oc-sdk-spinner[data-size="sm"] .oc-sdk-spinner-ring { width: ${r(12)}; height: ${r(12)}; }

.oc-sdk-banner { display: flex; align-items: flex-start; gap: ${r(12)}; padding: ${r(8)} ${r(12)}; border: 1px solid transparent; }
.oc-sdk-banner-text { flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: ${r(2)}; }
.oc-sdk-banner-title { font-size: 0.8125rem; font-weight: 500; }
.oc-sdk-banner-body { font-size: 0.8125rem; }
.oc-sdk-banner-action { flex: 0 0 auto; }

.oc-sdk-separator { display: flex; align-items: center; gap: ${r(8)}; width: 100%; margin: ${r(8)} 0; font-size: 0.75rem; }
.oc-sdk-separator::before, .oc-sdk-separator::after { content: ""; flex: 1 1 auto; height: 1px; }
.oc-sdk-separator[data-labeled="false"]::after { display: none; }
.oc-sdk-popup > .oc-sdk-separator { margin: ${r(4)} 0; }

.oc-sdk-progress { display: flex; flex-direction: column; gap: ${r(4)}; min-width: 0; }
.oc-sdk-progress-label { display: flex; justify-content: space-between; font-size: 0.75rem; font-variant-numeric: tabular-nums; }
.oc-sdk-progress-track { height: ${r(6)}; overflow: hidden; }
.oc-sdk-progress-fill { height: 100%; transform-origin: left; transition: transform 200ms ease-out; }
.oc-sdk-progress-value { display: inline-flex; align-items: center; gap: ${r(2)}; }
.oc-sdk-progress[data-done="true"] .oc-sdk-progress-value { font-weight: 600; }

.oc-sdk-menu { position: relative; display: inline-flex; }

.oc-sdk-text { white-space: pre-wrap; overflow-wrap: anywhere; }
.oc-sdk-text img { display: block; max-width: 100%; margin: ${r(8)} 0; }

/* Under a finger the controls reach the app's touch sizes: rows and options 44px like its sheets, every other
   control at least 36px. Inputs keep 16px text, below which iOS zooms the page on focus. */
@media (pointer: coarse) {
  .oc-sdk-btn, .oc-sdk-input { height: ${r(40)}; }
  .oc-sdk-btn[data-size="sm"], .oc-sdk-btn[data-size="xs"], .oc-sdk-trigger, .oc-sdk-tab, .oc-sdk-popup-search .oc-sdk-input { height: ${r(36)}; }
  .oc-sdk-input, .oc-sdk-popup-search .oc-sdk-input { font-size: max(16px, 0.875rem); }
  .oc-sdk-search-clear { width: ${r(36)}; height: ${r(36)}; right: 0; }
  .oc-sdk-row, .oc-sdk-option { min-height: ${r(44)}; }
  .oc-sdk-check { min-height: ${r(36)}; padding: ${r(8)} 0; }
}
`,Fo=`${mn}
.oc-sdk { color: ${w}; font-family: ${hn}; }
.oc-sdk :focus-visible, .oc-sdk:focus-visible { outline: none; }
.oc-sdk :where(button, a[href], [role="button"], [role="tab"], [role="option"]):focus-visible, button.oc-sdk:focus-visible { ${Ho} }
.oc-sdk-mono { font-family: ${yt}; }
.oc-sdk-muted { color: ${x}; }
${Ge("success")}${Ge("warning")}${Ge("error")}${Ge("info")}
.oc-sdk[data-tone="primary"], .oc-sdk [data-tone="primary"] { --oc-sdk-tone: ${j}; --oc-sdk-tone-text: ${kt}; }

.oc-sdk-btn { border-radius: ${Nt}; transition: background 150ms ease-out, color 150ms ease-out; }
.oc-sdk-btn[data-size="xs"] { border-radius: ${Xo}; }
.oc-sdk-btn[data-variant="default"] { color: ${kt}; background: ${g(j,10,z)}; border-color: ${g(j,12)}; ${$o} }
.oc-sdk-btn[data-variant="default"]:hover { background: ${g(j,16,z)}; }
.oc-sdk-btn[data-variant="default"]:active { background: ${g(j,22,z)}; box-shadow: none; }
.oc-sdk-btn[data-variant="secondary"] { background: ${Rn}; color: var(--oc-fg); }
.oc-sdk-btn[data-variant="secondary"]:hover { background-image: linear-gradient(${N}, ${N}); }
.oc-sdk-btn[data-variant="secondary"]:active { background-image: linear-gradient(${Q}, ${Q}); }
.oc-sdk-btn[data-variant="outline"] { background: var(--oc-sdk-raised-bg); color: ${ae}; ${Pt} }
.oc-sdk-btn[data-variant="outline"]:hover { background-image: linear-gradient(${N}, ${N}); }
.oc-sdk-btn[data-variant="outline"]:active { background-image: linear-gradient(${Q}, ${Q}); box-shadow: none; }
.oc-sdk-btn[data-variant="ghost"] { background: transparent; }
.oc-sdk-btn[data-variant="ghost"]:hover { background: ${N}; }
.oc-sdk-btn[data-variant="ghost"]:active { background: ${Q}; }
.oc-sdk-btn[data-variant="destructive"] { --oc-sdk-tone: ${m("status-error","red")}; color: ${Mt}; background: ${g("var(--oc-sdk-tone)",7,z)}; border-color: ${g("var(--oc-sdk-tone)",12)}; ${$o} }
.oc-sdk-btn[data-variant="destructive"]:hover { background: ${g("var(--oc-sdk-tone)",9,z)}; }
.oc-sdk-btn[data-variant="destructive"]:active { background: ${g("var(--oc-sdk-tone)",11,z)}; box-shadow: none; }

.oc-sdk-field-note { color: ${x}; }
.oc-sdk-field[data-invalid="true"] .oc-sdk-field-note { color: ${Mt}; }
.oc-sdk-input { border-radius: ${Nt}; background: var(--oc-sdk-field-bg); color: ${ae}; ${Lt("var(--oc-sdk-edge)")} transition: background 150ms ease-out; }
.oc-sdk-input::placeholder { color: ${x}; }
.oc-sdk-input:hover:not(:focus) { background-image: linear-gradient(${N}, ${N}); }
.oc-sdk-input:focus, .oc-sdk-input:focus-visible { ${Lt(g(w,26),"1px")} }
.oc-sdk-field[data-invalid="true"] .oc-sdk-input, .oc-sdk-field[data-invalid="true"] .oc-sdk-input:focus { ${Lt(m("status-error","red"),"1px")} }
.oc-sdk-input[data-mono="true"] { font-family: ${yt}; }

.oc-sdk-search-icon { color: ${x}; }
.oc-sdk-search[data-active="true"] .oc-sdk-search-icon { color: ${j}; }
.oc-sdk-search-clear { border-radius: ${Xo}; color: ${x}; }
.oc-sdk-search-clear:hover { background: ${N}; color: ${w}; }

.oc-sdk-trigger { border-radius: ${Nt}; background: var(--oc-sdk-raised-bg); color: ${ae}; ${Pt} transition: background 150ms ease-out; }
.oc-sdk-trigger:hover { background-image: linear-gradient(${N}, ${N}); }
.oc-sdk-trigger[aria-expanded="true"] { background-image: linear-gradient(${Q}, ${Q}); }
.oc-sdk-trigger-value[data-empty="true"] { color: ${x}; }
.oc-sdk-trigger-chevron { color: ${x}; }
/* The app's floating level: the glass edge (a hairline ring and a lit top line, dark outside and light inside in dark themes) over soft shadows. The outer ring is the border, over the page like the app's. */
.oc-sdk-popup { --surface-foreground: ${ae}; border-color: var(--oc-sdk-float-edge); border-radius: 12px; background: ${De}; background-clip: padding-box; color: ${ae}; box-shadow: var(--oc-sdk-float); }
.oc-sdk-option { border-radius: 8px; }
.oc-sdk-option[data-active="true"] { background: ${N}; }
/* A selected option shows a check mark in the text colour, like the app's own pickers. Options without the mark come
   from bundles built before it existed and keep the selection fill as their only sign of the choice. */
.oc-sdk-option[aria-selected="true"]:not([data-mark]) { background: ${Ct}; color: ${Ut}; }
.oc-sdk-option-check { color: ${w}; }
.oc-sdk-option[data-destructive="true"] { color: ${Mt}; }
.oc-sdk-option[data-destructive="true"][data-active="true"] { background: ${g(m("status-error","red"),10)}; }
.oc-sdk-option-hint { color: ${x}; }
.oc-sdk-popup-empty { color: ${x}; }

/* Checked stays neutral: the mark carries the state, and the primary colour stays with primary actions. */
.oc-sdk-check-box { border-color: ${J}; border-radius: 4px; color: ${w}; transition: border-color 150ms ease-out; }
.oc-sdk-check[aria-checked="true"] .oc-sdk-check-box { border-color: ${g(w,60,J)}; }
.oc-sdk-check-thumb { border-radius: 9999px; background: ${J}; transition: background 150ms ease-out; }
.oc-sdk-check-thumb::after { border-radius: 9999px; background: ${z}; transition: transform 150ms ease-out; }
.oc-sdk-check[aria-checked="true"] .oc-sdk-check-thumb { background: ${j}; }
.oc-sdk-check[aria-checked="true"] .oc-sdk-check-thumb::after { transform: translateX(var(--oc-sdk-thumb-travel, 16px)); }
.oc-sdk-check:focus-visible { box-shadow: none; }
.oc-sdk-check:focus-visible .oc-sdk-check-box, .oc-sdk-check:focus-visible .oc-sdk-check-thumb { ${Ho} }
.oc-sdk-check-desc { color: ${x}; }

.oc-sdk-tabs { border-radius: 10px; }
.oc-sdk-tabs[data-track="true"] { background: ${g(w,4)}; box-shadow: inset 0 1px 2px 0 rgb(0 0 0 / 0.16); }
.oc-sdk-tab { border-radius: 8px; color: ${x}; transition: color 150ms ease-out, background 150ms ease-out; }
.oc-sdk-tab:hover { color: ${w}; }
.oc-sdk-tab[aria-selected="true"] { color: ${Ut}; background: ${Ct}; border-color: ${J}; }
.oc-sdk-tabs[data-track="true"] .oc-sdk-tab[aria-selected="true"] { color: ${ae}; background: var(--oc-sdk-raised-bg); ${Pt} }
.oc-sdk-tab-count { color: ${x}; }

/* The app's neutral badge: a step of the text colour, the same in every theme. */
.oc-sdk-badge { border-radius: 9999px; background: ${g(w,6)}; color: ${x}; }
.oc-sdk-badge[data-tone] { color: var(--oc-sdk-tone-text, var(--oc-sdk-tone)); background: ${g("var(--oc-sdk-tone)",15)}; }

.oc-sdk-row { border-radius: 6px; transition: background 120ms ease-out; }
.oc-sdk-row:hover, .oc-sdk-row[data-active="true"] { background: ${N}; }
.oc-sdk-row[aria-selected="true"] { background: ${Ct}; color: ${Ut}; }
.oc-sdk-row-lead { font-family: ${yt}; color: ${x}; }
.oc-sdk-row-sub { color: ${x}; }
.oc-sdk-row-meta { color: ${x}; }
.oc-sdk-row[aria-selected="true"] .oc-sdk-row-lead, .oc-sdk-row[aria-selected="true"] .oc-sdk-row-sub, .oc-sdk-row[aria-selected="true"] .oc-sdk-row-meta { color: inherit; opacity: .75; }
.oc-sdk-list-empty { color: ${x}; }

.oc-sdk-empty-body { color: ${x}; }

.oc-sdk-spinner { color: ${x}; }
.oc-sdk-spinner-ring { border-color: ${J}; border-top-color: ${j}; border-radius: 9999px; }

/* Set apart by its tint alone, like the app's banners. */
.oc-sdk-banner { border-color: transparent; border-radius: 8px; background: ${g("var(--oc-sdk-tone)",10)}; }
.oc-sdk-banner-title { color: var(--oc-sdk-tone-text, var(--oc-sdk-tone)); }
.oc-sdk-banner-body { color: ${x}; }

.oc-sdk-separator { color: ${x}; }
.oc-sdk-separator::before, .oc-sdk-separator::after { background: ${g(J,40)}; }

.oc-sdk-progress-label { color: ${x}; }
/* The app's progress: a groove a step of the text colour, green once done. Older bundles mark done only through aria-valuenow. */
.oc-sdk-progress-track { border-radius: 9999px; background: ${g(w,6)}; }
.oc-sdk-progress-fill { border-radius: 9999px; background: var(--oc-sdk-tone, ${j}); }
.oc-sdk-progress-track[aria-valuenow="100"] > .oc-sdk-progress-fill:not([data-tone]) { background: ${m("status-success","currentColor")}; }
.oc-sdk-progress[data-done="true"] .oc-sdk-progress-value { color: ${m("success-text","inherit")}; }

.oc-sdk-text a { color: ${kt}; text-decoration: underline; text-underline-offset: 2px; }
.oc-sdk-text img { border-radius: 8px; border: 1px solid ${g(J,60)}; }
`,k=`
${Je}
${In}
${Fo}`;var Bo=(e)=>{let n=[];for(let s=1;s<=e.rounds;s+=1)if(n.push({phase:"work",round:s,ms:e.workMinutes*60000}),e.restMinutes>0&&s<e.rounds)n.push({phase:"rest",round:s,ms:e.restMinutes*60000});return n};var Gt=(e,n)=>{if(e.status!=="running")return{run:e,entered:[]};let s=Bo(e.preset),T=[],{index:u,endAt:A}=e;while(n>=A){let C=s[u+1];if(!C)return{run:{...e,index:u,status:"done",endAt:n,left:0},entered:T};u+=1,A+=C.ms,T.push(C)}return{run:{...e,index:u,endAt:A},entered:T}},Ko=(e,n)=>{if(e.status==="running")return Math.max(0,e.endAt-n);if(e.status==="paused")return e.left;return 0},Wo=(e,n)=>e.status==="running"?{...e,status:"paused",left:Math.max(0,e.endAt-n)}:e,jo=(e,n)=>e.status==="paused"?{...e,status:"running",endAt:n+e.left}:e;var zo=(e)=>Bo(e.preset)[e.index];var Yo=(e)=>{let n=Math.ceil(e/1000),s=Math.floor(n/60),T=n%60;return`${String(s).padStart(2,"0")}:${String(T).padStart(2,"0")}`};var Dt="run";var Un=["running","paused","done"],Qo=(e)=>typeof e==="object"&&e!==null&&!Array.isArray(e),kn=(e)=>Qo(e)&&typeof e.id==="string"&&typeof e.name==="string"&&typeof e.workMinutes==="number"&&typeof e.restMinutes==="number"&&typeof e.rounds==="number",Mn=(e)=>Qo(e)&&kn(e.preset)&&typeof e.index==="number"&&Un.some((n)=>n===e.status)&&typeof e.endAt==="number"&&typeof e.left==="number",yn=(e,n)=>JSON.stringify(e)===JSON.stringify(n);var Jo=async(e)=>{let n=await e.storage.get(Dt);return Mn(n)?n:null},Nn=(e,n)=>n?e.storage.set(Dt,n):e.storage.delete(Dt),Zo=(e)=>{let n=Promise.resolve(),s=!1,T=(O)=>{let M=n.then(O);return n=M.catch(()=>{return}),M},u=(O)=>T(async()=>{let M=Date.now(),D=await Jo(e),F=O(D,M),B=F?Gt(F,M):null,K=B?B.run:null;if(!yn(D,K))await Nn(e,K);let Z=Boolean(B&&F?.status!=="done"&&K?.status==="done");return{run:K,entered:B?.entered??[],finished:Z}});return{change:u,sync:()=>{if(s)return null;return s=!0,u((O)=>O).finally(()=>{s=!1})},peek:async()=>{let O=await Jo(e);return O?Gt(O,Date.now()).run:null}}};var Fe=gt(),tn=Zo(Fe),Xt=document.getElementById("clock"),Ht=document.getElementById("label"),V=null,qo=!1,on=!1,$t="",nn=()=>{if(!V){Xt.textContent="--:--",Ht.textContent="No session running";return}if(V.status==="done"){Xt.textContent="00:00",Ht.textContent="Session complete";return}let e=zo(V),n=e?.phase==="rest"?"Rest":"Work",s=V.status==="paused"?" · paused":"";Xt.textContent=Yo(Ko(V,Date.now())),Ht.textContent=`${n} ${e?.round??0}/${V.preset.rounds}${s}`},Ln=()=>{if(!on)return;let e=V&&V.status!=="done"?V.status:"none";if(e===$t)return;$t=e;let n=e==="none"?[]:[{kind:"button",id:"toggle",label:e==="paused"?"Resume":"Pause"}];Fe.setStatusControls(n).catch(()=>{$t=""})},rn=(e)=>{V=e,nn(),Ln()},Vt=!1,en=()=>{if(nn(),Vt)return;Vt=!0,tn.peek().then(rn,()=>{return}).finally(()=>{Vt=!1})};Fe.onStatusControl(({id:e})=>{if(e!=="toggle")return;tn.change((n,s)=>{if(!n)return n;return n.status==="running"?Wo(n,s):jo(n,s)}).then((n)=>rn(n.run),()=>{return})});Fe.onReady((e)=>{if(bt(e,document.documentElement),on=e.features?.statusControls===!0,qo)return;qo=!0,en(),setInterval(en,1000)});})();
