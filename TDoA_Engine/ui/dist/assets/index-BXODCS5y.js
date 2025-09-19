(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function n(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(r){if(r.ep)return;r.ep=!0;const s=n(r);fetch(r.href,s)}})();function xv(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var gm={exports:{}},bl={},_m={exports:{}},qe={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Bo=Symbol.for("react.element"),yv=Symbol.for("react.portal"),Sv=Symbol.for("react.fragment"),Mv=Symbol.for("react.strict_mode"),Ev=Symbol.for("react.profiler"),Tv=Symbol.for("react.provider"),wv=Symbol.for("react.context"),Av=Symbol.for("react.forward_ref"),Rv=Symbol.for("react.suspense"),Cv=Symbol.for("react.memo"),bv=Symbol.for("react.lazy"),wd=Symbol.iterator;function Pv(t){return t===null||typeof t!="object"?null:(t=wd&&t[wd]||t["@@iterator"],typeof t=="function"?t:null)}var vm={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},xm=Object.assign,ym={};function Ds(t,e,n){this.props=t,this.context=e,this.refs=ym,this.updater=n||vm}Ds.prototype.isReactComponent={};Ds.prototype.setState=function(t,e){if(typeof t!="object"&&typeof t!="function"&&t!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,t,e,"setState")};Ds.prototype.forceUpdate=function(t){this.updater.enqueueForceUpdate(this,t,"forceUpdate")};function Sm(){}Sm.prototype=Ds.prototype;function pf(t,e,n){this.props=t,this.context=e,this.refs=ym,this.updater=n||vm}var mf=pf.prototype=new Sm;mf.constructor=pf;xm(mf,Ds.prototype);mf.isPureReactComponent=!0;var Ad=Array.isArray,Mm=Object.prototype.hasOwnProperty,gf={current:null},Em={key:!0,ref:!0,__self:!0,__source:!0};function Tm(t,e,n){var i,r={},s=null,o=null;if(e!=null)for(i in e.ref!==void 0&&(o=e.ref),e.key!==void 0&&(s=""+e.key),e)Mm.call(e,i)&&!Em.hasOwnProperty(i)&&(r[i]=e[i]);var a=arguments.length-2;if(a===1)r.children=n;else if(1<a){for(var l=Array(a),u=0;u<a;u++)l[u]=arguments[u+2];r.children=l}if(t&&t.defaultProps)for(i in a=t.defaultProps,a)r[i]===void 0&&(r[i]=a[i]);return{$$typeof:Bo,type:t,key:s,ref:o,props:r,_owner:gf.current}}function Lv(t,e){return{$$typeof:Bo,type:t.type,key:e,ref:t.ref,props:t.props,_owner:t._owner}}function _f(t){return typeof t=="object"&&t!==null&&t.$$typeof===Bo}function Dv(t){var e={"=":"=0",":":"=2"};return"$"+t.replace(/[=:]/g,function(n){return e[n]})}var Rd=/\/+/g;function eu(t,e){return typeof t=="object"&&t!==null&&t.key!=null?Dv(""+t.key):e.toString(36)}function za(t,e,n,i,r){var s=typeof t;(s==="undefined"||s==="boolean")&&(t=null);var o=!1;if(t===null)o=!0;else switch(s){case"string":case"number":o=!0;break;case"object":switch(t.$$typeof){case Bo:case yv:o=!0}}if(o)return o=t,r=r(o),t=i===""?"."+eu(o,0):i,Ad(r)?(n="",t!=null&&(n=t.replace(Rd,"$&/")+"/"),za(r,e,n,"",function(u){return u})):r!=null&&(_f(r)&&(r=Lv(r,n+(!r.key||o&&o.key===r.key?"":(""+r.key).replace(Rd,"$&/")+"/")+t)),e.push(r)),1;if(o=0,i=i===""?".":i+":",Ad(t))for(var a=0;a<t.length;a++){s=t[a];var l=i+eu(s,a);o+=za(s,e,n,l,r)}else if(l=Pv(t),typeof l=="function")for(t=l.call(t),a=0;!(s=t.next()).done;)s=s.value,l=i+eu(s,a++),o+=za(s,e,n,l,r);else if(s==="object")throw e=String(t),Error("Objects are not valid as a React child (found: "+(e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e)+"). If you meant to render a collection of children, use an array instead.");return o}function qo(t,e,n){if(t==null)return t;var i=[],r=0;return za(t,i,"","",function(s){return e.call(n,s,r++)}),i}function Uv(t){if(t._status===-1){var e=t._result;e=e(),e.then(function(n){(t._status===0||t._status===-1)&&(t._status=1,t._result=n)},function(n){(t._status===0||t._status===-1)&&(t._status=2,t._result=n)}),t._status===-1&&(t._status=0,t._result=e)}if(t._status===1)return t._result.default;throw t._result}var Jt={current:null},ka={transition:null},Nv={ReactCurrentDispatcher:Jt,ReactCurrentBatchConfig:ka,ReactCurrentOwner:gf};function wm(){throw Error("act(...) is not supported in production builds of React.")}qe.Children={map:qo,forEach:function(t,e,n){qo(t,function(){e.apply(this,arguments)},n)},count:function(t){var e=0;return qo(t,function(){e++}),e},toArray:function(t){return qo(t,function(e){return e})||[]},only:function(t){if(!_f(t))throw Error("React.Children.only expected to receive a single React element child.");return t}};qe.Component=Ds;qe.Fragment=Sv;qe.Profiler=Ev;qe.PureComponent=pf;qe.StrictMode=Mv;qe.Suspense=Rv;qe.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Nv;qe.act=wm;qe.cloneElement=function(t,e,n){if(t==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+t+".");var i=xm({},t.props),r=t.key,s=t.ref,o=t._owner;if(e!=null){if(e.ref!==void 0&&(s=e.ref,o=gf.current),e.key!==void 0&&(r=""+e.key),t.type&&t.type.defaultProps)var a=t.type.defaultProps;for(l in e)Mm.call(e,l)&&!Em.hasOwnProperty(l)&&(i[l]=e[l]===void 0&&a!==void 0?a[l]:e[l])}var l=arguments.length-2;if(l===1)i.children=n;else if(1<l){a=Array(l);for(var u=0;u<l;u++)a[u]=arguments[u+2];i.children=a}return{$$typeof:Bo,type:t.type,key:r,ref:s,props:i,_owner:o}};qe.createContext=function(t){return t={$$typeof:wv,_currentValue:t,_currentValue2:t,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},t.Provider={$$typeof:Tv,_context:t},t.Consumer=t};qe.createElement=Tm;qe.createFactory=function(t){var e=Tm.bind(null,t);return e.type=t,e};qe.createRef=function(){return{current:null}};qe.forwardRef=function(t){return{$$typeof:Av,render:t}};qe.isValidElement=_f;qe.lazy=function(t){return{$$typeof:bv,_payload:{_status:-1,_result:t},_init:Uv}};qe.memo=function(t,e){return{$$typeof:Cv,type:t,compare:e===void 0?null:e}};qe.startTransition=function(t){var e=ka.transition;ka.transition={};try{t()}finally{ka.transition=e}};qe.unstable_act=wm;qe.useCallback=function(t,e){return Jt.current.useCallback(t,e)};qe.useContext=function(t){return Jt.current.useContext(t)};qe.useDebugValue=function(){};qe.useDeferredValue=function(t){return Jt.current.useDeferredValue(t)};qe.useEffect=function(t,e){return Jt.current.useEffect(t,e)};qe.useId=function(){return Jt.current.useId()};qe.useImperativeHandle=function(t,e,n){return Jt.current.useImperativeHandle(t,e,n)};qe.useInsertionEffect=function(t,e){return Jt.current.useInsertionEffect(t,e)};qe.useLayoutEffect=function(t,e){return Jt.current.useLayoutEffect(t,e)};qe.useMemo=function(t,e){return Jt.current.useMemo(t,e)};qe.useReducer=function(t,e,n){return Jt.current.useReducer(t,e,n)};qe.useRef=function(t){return Jt.current.useRef(t)};qe.useState=function(t){return Jt.current.useState(t)};qe.useSyncExternalStore=function(t,e,n){return Jt.current.useSyncExternalStore(t,e,n)};qe.useTransition=function(){return Jt.current.useTransition()};qe.version="18.3.1";_m.exports=qe;var pe=_m.exports;const Iv=xv(pe);/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Fv=pe,Ov=Symbol.for("react.element"),zv=Symbol.for("react.fragment"),kv=Object.prototype.hasOwnProperty,Bv=Fv.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,Hv={key:!0,ref:!0,__self:!0,__source:!0};function Am(t,e,n){var i,r={},s=null,o=null;n!==void 0&&(s=""+n),e.key!==void 0&&(s=""+e.key),e.ref!==void 0&&(o=e.ref);for(i in e)kv.call(e,i)&&!Hv.hasOwnProperty(i)&&(r[i]=e[i]);if(t&&t.defaultProps)for(i in e=t.defaultProps,e)r[i]===void 0&&(r[i]=e[i]);return{$$typeof:Ov,type:t,key:s,ref:o,props:r,_owner:Bv.current}}bl.Fragment=zv;bl.jsx=Am;bl.jsxs=Am;gm.exports=bl;var ue=gm.exports,ac={},Rm={exports:{}},gn={},Cm={exports:{}},bm={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(t){function e(F,B){var k=F.length;F.push(B);e:for(;0<k;){var Q=k-1>>>1,ee=F[Q];if(0<r(ee,B))F[Q]=B,F[k]=ee,k=Q;else break e}}function n(F){return F.length===0?null:F[0]}function i(F){if(F.length===0)return null;var B=F[0],k=F.pop();if(k!==B){F[0]=k;e:for(var Q=0,ee=F.length,$=ee>>>1;Q<$;){var Z=2*(Q+1)-1,de=F[Z],ve=Z+1,ye=F[ve];if(0>r(de,k))ve<ee&&0>r(ye,de)?(F[Q]=ye,F[ve]=k,Q=ve):(F[Q]=de,F[Z]=k,Q=Z);else if(ve<ee&&0>r(ye,k))F[Q]=ye,F[ve]=k,Q=ve;else break e}}return B}function r(F,B){var k=F.sortIndex-B.sortIndex;return k!==0?k:F.id-B.id}if(typeof performance=="object"&&typeof performance.now=="function"){var s=performance;t.unstable_now=function(){return s.now()}}else{var o=Date,a=o.now();t.unstable_now=function(){return o.now()-a}}var l=[],u=[],f=1,h=null,d=3,m=!1,x=!1,v=!1,p=typeof setTimeout=="function"?setTimeout:null,c=typeof clearTimeout=="function"?clearTimeout:null,_=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function g(F){for(var B=n(u);B!==null;){if(B.callback===null)i(u);else if(B.startTime<=F)i(u),B.sortIndex=B.expirationTime,e(l,B);else break;B=n(u)}}function y(F){if(v=!1,g(F),!x)if(n(l)!==null)x=!0,z(M);else{var B=n(u);B!==null&&W(y,B.startTime-F)}}function M(F,B){x=!1,v&&(v=!1,c(b),b=-1),m=!0;var k=d;try{for(g(B),h=n(l);h!==null&&(!(h.expirationTime>B)||F&&!H());){var Q=h.callback;if(typeof Q=="function"){h.callback=null,d=h.priorityLevel;var ee=Q(h.expirationTime<=B);B=t.unstable_now(),typeof ee=="function"?h.callback=ee:h===n(l)&&i(l),g(B)}else i(l);h=n(l)}if(h!==null)var $=!0;else{var Z=n(u);Z!==null&&W(y,Z.startTime-B),$=!1}return $}finally{h=null,d=k,m=!1}}var A=!1,w=null,b=-1,S=5,R=-1;function H(){return!(t.unstable_now()-R<S)}function I(){if(w!==null){var F=t.unstable_now();R=F;var B=!0;try{B=w(!0,F)}finally{B?G():(A=!1,w=null)}}else A=!1}var G;if(typeof _=="function")G=function(){_(I)};else if(typeof MessageChannel<"u"){var L=new MessageChannel,D=L.port2;L.port1.onmessage=I,G=function(){D.postMessage(null)}}else G=function(){p(I,0)};function z(F){w=F,A||(A=!0,G())}function W(F,B){b=p(function(){F(t.unstable_now())},B)}t.unstable_IdlePriority=5,t.unstable_ImmediatePriority=1,t.unstable_LowPriority=4,t.unstable_NormalPriority=3,t.unstable_Profiling=null,t.unstable_UserBlockingPriority=2,t.unstable_cancelCallback=function(F){F.callback=null},t.unstable_continueExecution=function(){x||m||(x=!0,z(M))},t.unstable_forceFrameRate=function(F){0>F||125<F?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):S=0<F?Math.floor(1e3/F):5},t.unstable_getCurrentPriorityLevel=function(){return d},t.unstable_getFirstCallbackNode=function(){return n(l)},t.unstable_next=function(F){switch(d){case 1:case 2:case 3:var B=3;break;default:B=d}var k=d;d=B;try{return F()}finally{d=k}},t.unstable_pauseExecution=function(){},t.unstable_requestPaint=function(){},t.unstable_runWithPriority=function(F,B){switch(F){case 1:case 2:case 3:case 4:case 5:break;default:F=3}var k=d;d=F;try{return B()}finally{d=k}},t.unstable_scheduleCallback=function(F,B,k){var Q=t.unstable_now();switch(typeof k=="object"&&k!==null?(k=k.delay,k=typeof k=="number"&&0<k?Q+k:Q):k=Q,F){case 1:var ee=-1;break;case 2:ee=250;break;case 5:ee=1073741823;break;case 4:ee=1e4;break;default:ee=5e3}return ee=k+ee,F={id:f++,callback:B,priorityLevel:F,startTime:k,expirationTime:ee,sortIndex:-1},k>Q?(F.sortIndex=k,e(u,F),n(l)===null&&F===n(u)&&(v?(c(b),b=-1):v=!0,W(y,k-Q))):(F.sortIndex=ee,e(l,F),x||m||(x=!0,z(M))),F},t.unstable_shouldYield=H,t.unstable_wrapCallback=function(F){var B=d;return function(){var k=d;d=B;try{return F.apply(this,arguments)}finally{d=k}}}})(bm);Cm.exports=bm;var Gv=Cm.exports;/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Vv=pe,mn=Gv;function ie(t){for(var e="https://reactjs.org/docs/error-decoder.html?invariant="+t,n=1;n<arguments.length;n++)e+="&args[]="+encodeURIComponent(arguments[n]);return"Minified React error #"+t+"; visit "+e+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var Pm=new Set,yo={};function Ar(t,e){Ss(t,e),Ss(t+"Capture",e)}function Ss(t,e){for(yo[t]=e,t=0;t<e.length;t++)Pm.add(e[t])}var di=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),lc=Object.prototype.hasOwnProperty,Wv=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,Cd={},bd={};function Xv(t){return lc.call(bd,t)?!0:lc.call(Cd,t)?!1:Wv.test(t)?bd[t]=!0:(Cd[t]=!0,!1)}function jv(t,e,n,i){if(n!==null&&n.type===0)return!1;switch(typeof e){case"function":case"symbol":return!0;case"boolean":return i?!1:n!==null?!n.acceptsBooleans:(t=t.toLowerCase().slice(0,5),t!=="data-"&&t!=="aria-");default:return!1}}function Yv(t,e,n,i){if(e===null||typeof e>"u"||jv(t,e,n,i))return!0;if(i)return!1;if(n!==null)switch(n.type){case 3:return!e;case 4:return e===!1;case 5:return isNaN(e);case 6:return isNaN(e)||1>e}return!1}function en(t,e,n,i,r,s,o){this.acceptsBooleans=e===2||e===3||e===4,this.attributeName=i,this.attributeNamespace=r,this.mustUseProperty=n,this.propertyName=t,this.type=e,this.sanitizeURL=s,this.removeEmptyString=o}var Ot={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(t){Ot[t]=new en(t,0,!1,t,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(t){var e=t[0];Ot[e]=new en(e,1,!1,t[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(t){Ot[t]=new en(t,2,!1,t.toLowerCase(),null,!1,!1)});["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(t){Ot[t]=new en(t,2,!1,t,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(t){Ot[t]=new en(t,3,!1,t.toLowerCase(),null,!1,!1)});["checked","multiple","muted","selected"].forEach(function(t){Ot[t]=new en(t,3,!0,t,null,!1,!1)});["capture","download"].forEach(function(t){Ot[t]=new en(t,4,!1,t,null,!1,!1)});["cols","rows","size","span"].forEach(function(t){Ot[t]=new en(t,6,!1,t,null,!1,!1)});["rowSpan","start"].forEach(function(t){Ot[t]=new en(t,5,!1,t.toLowerCase(),null,!1,!1)});var vf=/[\-:]([a-z])/g;function xf(t){return t[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(t){var e=t.replace(vf,xf);Ot[e]=new en(e,1,!1,t,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(t){var e=t.replace(vf,xf);Ot[e]=new en(e,1,!1,t,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(t){var e=t.replace(vf,xf);Ot[e]=new en(e,1,!1,t,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(t){Ot[t]=new en(t,1,!1,t.toLowerCase(),null,!1,!1)});Ot.xlinkHref=new en("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(t){Ot[t]=new en(t,1,!1,t.toLowerCase(),null,!0,!0)});function yf(t,e,n,i){var r=Ot.hasOwnProperty(e)?Ot[e]:null;(r!==null?r.type!==0:i||!(2<e.length)||e[0]!=="o"&&e[0]!=="O"||e[1]!=="n"&&e[1]!=="N")&&(Yv(e,n,r,i)&&(n=null),i||r===null?Xv(e)&&(n===null?t.removeAttribute(e):t.setAttribute(e,""+n)):r.mustUseProperty?t[r.propertyName]=n===null?r.type===3?!1:"":n:(e=r.attributeName,i=r.attributeNamespace,n===null?t.removeAttribute(e):(r=r.type,n=r===3||r===4&&n===!0?"":""+n,i?t.setAttributeNS(i,e,n):t.setAttribute(e,n))))}var _i=Vv.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,$o=Symbol.for("react.element"),es=Symbol.for("react.portal"),ts=Symbol.for("react.fragment"),Sf=Symbol.for("react.strict_mode"),uc=Symbol.for("react.profiler"),Lm=Symbol.for("react.provider"),Dm=Symbol.for("react.context"),Mf=Symbol.for("react.forward_ref"),cc=Symbol.for("react.suspense"),fc=Symbol.for("react.suspense_list"),Ef=Symbol.for("react.memo"),Ai=Symbol.for("react.lazy"),Um=Symbol.for("react.offscreen"),Pd=Symbol.iterator;function Bs(t){return t===null||typeof t!="object"?null:(t=Pd&&t[Pd]||t["@@iterator"],typeof t=="function"?t:null)}var ct=Object.assign,tu;function io(t){if(tu===void 0)try{throw Error()}catch(n){var e=n.stack.trim().match(/\n( *(at )?)/);tu=e&&e[1]||""}return`
`+tu+t}var nu=!1;function iu(t,e){if(!t||nu)return"";nu=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(e)if(e=function(){throw Error()},Object.defineProperty(e.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(e,[])}catch(u){var i=u}Reflect.construct(t,[],e)}else{try{e.call()}catch(u){i=u}t.call(e.prototype)}else{try{throw Error()}catch(u){i=u}t()}}catch(u){if(u&&i&&typeof u.stack=="string"){for(var r=u.stack.split(`
`),s=i.stack.split(`
`),o=r.length-1,a=s.length-1;1<=o&&0<=a&&r[o]!==s[a];)a--;for(;1<=o&&0<=a;o--,a--)if(r[o]!==s[a]){if(o!==1||a!==1)do if(o--,a--,0>a||r[o]!==s[a]){var l=`
`+r[o].replace(" at new "," at ");return t.displayName&&l.includes("<anonymous>")&&(l=l.replace("<anonymous>",t.displayName)),l}while(1<=o&&0<=a);break}}}finally{nu=!1,Error.prepareStackTrace=n}return(t=t?t.displayName||t.name:"")?io(t):""}function qv(t){switch(t.tag){case 5:return io(t.type);case 16:return io("Lazy");case 13:return io("Suspense");case 19:return io("SuspenseList");case 0:case 2:case 15:return t=iu(t.type,!1),t;case 11:return t=iu(t.type.render,!1),t;case 1:return t=iu(t.type,!0),t;default:return""}}function dc(t){if(t==null)return null;if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t;switch(t){case ts:return"Fragment";case es:return"Portal";case uc:return"Profiler";case Sf:return"StrictMode";case cc:return"Suspense";case fc:return"SuspenseList"}if(typeof t=="object")switch(t.$$typeof){case Dm:return(t.displayName||"Context")+".Consumer";case Lm:return(t._context.displayName||"Context")+".Provider";case Mf:var e=t.render;return t=t.displayName,t||(t=e.displayName||e.name||"",t=t!==""?"ForwardRef("+t+")":"ForwardRef"),t;case Ef:return e=t.displayName||null,e!==null?e:dc(t.type)||"Memo";case Ai:e=t._payload,t=t._init;try{return dc(t(e))}catch{}}return null}function $v(t){var e=t.type;switch(t.tag){case 24:return"Cache";case 9:return(e.displayName||"Context")+".Consumer";case 10:return(e._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return t=e.render,t=t.displayName||t.name||"",e.displayName||(t!==""?"ForwardRef("+t+")":"ForwardRef");case 7:return"Fragment";case 5:return e;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return dc(e);case 8:return e===Sf?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e}return null}function qi(t){switch(typeof t){case"boolean":case"number":case"string":case"undefined":return t;case"object":return t;default:return""}}function Nm(t){var e=t.type;return(t=t.nodeName)&&t.toLowerCase()==="input"&&(e==="checkbox"||e==="radio")}function Kv(t){var e=Nm(t)?"checked":"value",n=Object.getOwnPropertyDescriptor(t.constructor.prototype,e),i=""+t[e];if(!t.hasOwnProperty(e)&&typeof n<"u"&&typeof n.get=="function"&&typeof n.set=="function"){var r=n.get,s=n.set;return Object.defineProperty(t,e,{configurable:!0,get:function(){return r.call(this)},set:function(o){i=""+o,s.call(this,o)}}),Object.defineProperty(t,e,{enumerable:n.enumerable}),{getValue:function(){return i},setValue:function(o){i=""+o},stopTracking:function(){t._valueTracker=null,delete t[e]}}}}function Ko(t){t._valueTracker||(t._valueTracker=Kv(t))}function Im(t){if(!t)return!1;var e=t._valueTracker;if(!e)return!0;var n=e.getValue(),i="";return t&&(i=Nm(t)?t.checked?"true":"false":t.value),t=i,t!==n?(e.setValue(t),!0):!1}function Qa(t){if(t=t||(typeof document<"u"?document:void 0),typeof t>"u")return null;try{return t.activeElement||t.body}catch{return t.body}}function hc(t,e){var n=e.checked;return ct({},e,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:n??t._wrapperState.initialChecked})}function Ld(t,e){var n=e.defaultValue==null?"":e.defaultValue,i=e.checked!=null?e.checked:e.defaultChecked;n=qi(e.value!=null?e.value:n),t._wrapperState={initialChecked:i,initialValue:n,controlled:e.type==="checkbox"||e.type==="radio"?e.checked!=null:e.value!=null}}function Fm(t,e){e=e.checked,e!=null&&yf(t,"checked",e,!1)}function pc(t,e){Fm(t,e);var n=qi(e.value),i=e.type;if(n!=null)i==="number"?(n===0&&t.value===""||t.value!=n)&&(t.value=""+n):t.value!==""+n&&(t.value=""+n);else if(i==="submit"||i==="reset"){t.removeAttribute("value");return}e.hasOwnProperty("value")?mc(t,e.type,n):e.hasOwnProperty("defaultValue")&&mc(t,e.type,qi(e.defaultValue)),e.checked==null&&e.defaultChecked!=null&&(t.defaultChecked=!!e.defaultChecked)}function Dd(t,e,n){if(e.hasOwnProperty("value")||e.hasOwnProperty("defaultValue")){var i=e.type;if(!(i!=="submit"&&i!=="reset"||e.value!==void 0&&e.value!==null))return;e=""+t._wrapperState.initialValue,n||e===t.value||(t.value=e),t.defaultValue=e}n=t.name,n!==""&&(t.name=""),t.defaultChecked=!!t._wrapperState.initialChecked,n!==""&&(t.name=n)}function mc(t,e,n){(e!=="number"||Qa(t.ownerDocument)!==t)&&(n==null?t.defaultValue=""+t._wrapperState.initialValue:t.defaultValue!==""+n&&(t.defaultValue=""+n))}var ro=Array.isArray;function hs(t,e,n,i){if(t=t.options,e){e={};for(var r=0;r<n.length;r++)e["$"+n[r]]=!0;for(n=0;n<t.length;n++)r=e.hasOwnProperty("$"+t[n].value),t[n].selected!==r&&(t[n].selected=r),r&&i&&(t[n].defaultSelected=!0)}else{for(n=""+qi(n),e=null,r=0;r<t.length;r++){if(t[r].value===n){t[r].selected=!0,i&&(t[r].defaultSelected=!0);return}e!==null||t[r].disabled||(e=t[r])}e!==null&&(e.selected=!0)}}function gc(t,e){if(e.dangerouslySetInnerHTML!=null)throw Error(ie(91));return ct({},e,{value:void 0,defaultValue:void 0,children:""+t._wrapperState.initialValue})}function Ud(t,e){var n=e.value;if(n==null){if(n=e.children,e=e.defaultValue,n!=null){if(e!=null)throw Error(ie(92));if(ro(n)){if(1<n.length)throw Error(ie(93));n=n[0]}e=n}e==null&&(e=""),n=e}t._wrapperState={initialValue:qi(n)}}function Om(t,e){var n=qi(e.value),i=qi(e.defaultValue);n!=null&&(n=""+n,n!==t.value&&(t.value=n),e.defaultValue==null&&t.defaultValue!==n&&(t.defaultValue=n)),i!=null&&(t.defaultValue=""+i)}function Nd(t){var e=t.textContent;e===t._wrapperState.initialValue&&e!==""&&e!==null&&(t.value=e)}function zm(t){switch(t){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function _c(t,e){return t==null||t==="http://www.w3.org/1999/xhtml"?zm(e):t==="http://www.w3.org/2000/svg"&&e==="foreignObject"?"http://www.w3.org/1999/xhtml":t}var Zo,km=function(t){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(e,n,i,r){MSApp.execUnsafeLocalFunction(function(){return t(e,n,i,r)})}:t}(function(t,e){if(t.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in t)t.innerHTML=e;else{for(Zo=Zo||document.createElement("div"),Zo.innerHTML="<svg>"+e.valueOf().toString()+"</svg>",e=Zo.firstChild;t.firstChild;)t.removeChild(t.firstChild);for(;e.firstChild;)t.appendChild(e.firstChild)}});function So(t,e){if(e){var n=t.firstChild;if(n&&n===t.lastChild&&n.nodeType===3){n.nodeValue=e;return}}t.textContent=e}var uo={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},Zv=["Webkit","ms","Moz","O"];Object.keys(uo).forEach(function(t){Zv.forEach(function(e){e=e+t.charAt(0).toUpperCase()+t.substring(1),uo[e]=uo[t]})});function Bm(t,e,n){return e==null||typeof e=="boolean"||e===""?"":n||typeof e!="number"||e===0||uo.hasOwnProperty(t)&&uo[t]?(""+e).trim():e+"px"}function Hm(t,e){t=t.style;for(var n in e)if(e.hasOwnProperty(n)){var i=n.indexOf("--")===0,r=Bm(n,e[n],i);n==="float"&&(n="cssFloat"),i?t.setProperty(n,r):t[n]=r}}var Qv=ct({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function vc(t,e){if(e){if(Qv[t]&&(e.children!=null||e.dangerouslySetInnerHTML!=null))throw Error(ie(137,t));if(e.dangerouslySetInnerHTML!=null){if(e.children!=null)throw Error(ie(60));if(typeof e.dangerouslySetInnerHTML!="object"||!("__html"in e.dangerouslySetInnerHTML))throw Error(ie(61))}if(e.style!=null&&typeof e.style!="object")throw Error(ie(62))}}function xc(t,e){if(t.indexOf("-")===-1)return typeof e.is=="string";switch(t){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var yc=null;function Tf(t){return t=t.target||t.srcElement||window,t.correspondingUseElement&&(t=t.correspondingUseElement),t.nodeType===3?t.parentNode:t}var Sc=null,ps=null,ms=null;function Id(t){if(t=Vo(t)){if(typeof Sc!="function")throw Error(ie(280));var e=t.stateNode;e&&(e=Nl(e),Sc(t.stateNode,t.type,e))}}function Gm(t){ps?ms?ms.push(t):ms=[t]:ps=t}function Vm(){if(ps){var t=ps,e=ms;if(ms=ps=null,Id(t),e)for(t=0;t<e.length;t++)Id(e[t])}}function Wm(t,e){return t(e)}function Xm(){}var ru=!1;function jm(t,e,n){if(ru)return t(e,n);ru=!0;try{return Wm(t,e,n)}finally{ru=!1,(ps!==null||ms!==null)&&(Xm(),Vm())}}function Mo(t,e){var n=t.stateNode;if(n===null)return null;var i=Nl(n);if(i===null)return null;n=i[e];e:switch(e){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(i=!i.disabled)||(t=t.type,i=!(t==="button"||t==="input"||t==="select"||t==="textarea")),t=!i;break e;default:t=!1}if(t)return null;if(n&&typeof n!="function")throw Error(ie(231,e,typeof n));return n}var Mc=!1;if(di)try{var Hs={};Object.defineProperty(Hs,"passive",{get:function(){Mc=!0}}),window.addEventListener("test",Hs,Hs),window.removeEventListener("test",Hs,Hs)}catch{Mc=!1}function Jv(t,e,n,i,r,s,o,a,l){var u=Array.prototype.slice.call(arguments,3);try{e.apply(n,u)}catch(f){this.onError(f)}}var co=!1,Ja=null,el=!1,Ec=null,e0={onError:function(t){co=!0,Ja=t}};function t0(t,e,n,i,r,s,o,a,l){co=!1,Ja=null,Jv.apply(e0,arguments)}function n0(t,e,n,i,r,s,o,a,l){if(t0.apply(this,arguments),co){if(co){var u=Ja;co=!1,Ja=null}else throw Error(ie(198));el||(el=!0,Ec=u)}}function Rr(t){var e=t,n=t;if(t.alternate)for(;e.return;)e=e.return;else{t=e;do e=t,e.flags&4098&&(n=e.return),t=e.return;while(t)}return e.tag===3?n:null}function Ym(t){if(t.tag===13){var e=t.memoizedState;if(e===null&&(t=t.alternate,t!==null&&(e=t.memoizedState)),e!==null)return e.dehydrated}return null}function Fd(t){if(Rr(t)!==t)throw Error(ie(188))}function i0(t){var e=t.alternate;if(!e){if(e=Rr(t),e===null)throw Error(ie(188));return e!==t?null:t}for(var n=t,i=e;;){var r=n.return;if(r===null)break;var s=r.alternate;if(s===null){if(i=r.return,i!==null){n=i;continue}break}if(r.child===s.child){for(s=r.child;s;){if(s===n)return Fd(r),t;if(s===i)return Fd(r),e;s=s.sibling}throw Error(ie(188))}if(n.return!==i.return)n=r,i=s;else{for(var o=!1,a=r.child;a;){if(a===n){o=!0,n=r,i=s;break}if(a===i){o=!0,i=r,n=s;break}a=a.sibling}if(!o){for(a=s.child;a;){if(a===n){o=!0,n=s,i=r;break}if(a===i){o=!0,i=s,n=r;break}a=a.sibling}if(!o)throw Error(ie(189))}}if(n.alternate!==i)throw Error(ie(190))}if(n.tag!==3)throw Error(ie(188));return n.stateNode.current===n?t:e}function qm(t){return t=i0(t),t!==null?$m(t):null}function $m(t){if(t.tag===5||t.tag===6)return t;for(t=t.child;t!==null;){var e=$m(t);if(e!==null)return e;t=t.sibling}return null}var Km=mn.unstable_scheduleCallback,Od=mn.unstable_cancelCallback,r0=mn.unstable_shouldYield,s0=mn.unstable_requestPaint,pt=mn.unstable_now,o0=mn.unstable_getCurrentPriorityLevel,wf=mn.unstable_ImmediatePriority,Zm=mn.unstable_UserBlockingPriority,tl=mn.unstable_NormalPriority,a0=mn.unstable_LowPriority,Qm=mn.unstable_IdlePriority,Pl=null,$n=null;function l0(t){if($n&&typeof $n.onCommitFiberRoot=="function")try{$n.onCommitFiberRoot(Pl,t,void 0,(t.current.flags&128)===128)}catch{}}var kn=Math.clz32?Math.clz32:f0,u0=Math.log,c0=Math.LN2;function f0(t){return t>>>=0,t===0?32:31-(u0(t)/c0|0)|0}var Qo=64,Jo=4194304;function so(t){switch(t&-t){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return t&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return t}}function nl(t,e){var n=t.pendingLanes;if(n===0)return 0;var i=0,r=t.suspendedLanes,s=t.pingedLanes,o=n&268435455;if(o!==0){var a=o&~r;a!==0?i=so(a):(s&=o,s!==0&&(i=so(s)))}else o=n&~r,o!==0?i=so(o):s!==0&&(i=so(s));if(i===0)return 0;if(e!==0&&e!==i&&!(e&r)&&(r=i&-i,s=e&-e,r>=s||r===16&&(s&4194240)!==0))return e;if(i&4&&(i|=n&16),e=t.entangledLanes,e!==0)for(t=t.entanglements,e&=i;0<e;)n=31-kn(e),r=1<<n,i|=t[n],e&=~r;return i}function d0(t,e){switch(t){case 1:case 2:case 4:return e+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function h0(t,e){for(var n=t.suspendedLanes,i=t.pingedLanes,r=t.expirationTimes,s=t.pendingLanes;0<s;){var o=31-kn(s),a=1<<o,l=r[o];l===-1?(!(a&n)||a&i)&&(r[o]=d0(a,e)):l<=e&&(t.expiredLanes|=a),s&=~a}}function Tc(t){return t=t.pendingLanes&-1073741825,t!==0?t:t&1073741824?1073741824:0}function Jm(){var t=Qo;return Qo<<=1,!(Qo&4194240)&&(Qo=64),t}function su(t){for(var e=[],n=0;31>n;n++)e.push(t);return e}function Ho(t,e,n){t.pendingLanes|=e,e!==536870912&&(t.suspendedLanes=0,t.pingedLanes=0),t=t.eventTimes,e=31-kn(e),t[e]=n}function p0(t,e){var n=t.pendingLanes&~e;t.pendingLanes=e,t.suspendedLanes=0,t.pingedLanes=0,t.expiredLanes&=e,t.mutableReadLanes&=e,t.entangledLanes&=e,e=t.entanglements;var i=t.eventTimes;for(t=t.expirationTimes;0<n;){var r=31-kn(n),s=1<<r;e[r]=0,i[r]=-1,t[r]=-1,n&=~s}}function Af(t,e){var n=t.entangledLanes|=e;for(t=t.entanglements;n;){var i=31-kn(n),r=1<<i;r&e|t[i]&e&&(t[i]|=e),n&=~r}}var Ze=0;function eg(t){return t&=-t,1<t?4<t?t&268435455?16:536870912:4:1}var tg,Rf,ng,ig,rg,wc=!1,ea=[],Ii=null,Fi=null,Oi=null,Eo=new Map,To=new Map,bi=[],m0="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function zd(t,e){switch(t){case"focusin":case"focusout":Ii=null;break;case"dragenter":case"dragleave":Fi=null;break;case"mouseover":case"mouseout":Oi=null;break;case"pointerover":case"pointerout":Eo.delete(e.pointerId);break;case"gotpointercapture":case"lostpointercapture":To.delete(e.pointerId)}}function Gs(t,e,n,i,r,s){return t===null||t.nativeEvent!==s?(t={blockedOn:e,domEventName:n,eventSystemFlags:i,nativeEvent:s,targetContainers:[r]},e!==null&&(e=Vo(e),e!==null&&Rf(e)),t):(t.eventSystemFlags|=i,e=t.targetContainers,r!==null&&e.indexOf(r)===-1&&e.push(r),t)}function g0(t,e,n,i,r){switch(e){case"focusin":return Ii=Gs(Ii,t,e,n,i,r),!0;case"dragenter":return Fi=Gs(Fi,t,e,n,i,r),!0;case"mouseover":return Oi=Gs(Oi,t,e,n,i,r),!0;case"pointerover":var s=r.pointerId;return Eo.set(s,Gs(Eo.get(s)||null,t,e,n,i,r)),!0;case"gotpointercapture":return s=r.pointerId,To.set(s,Gs(To.get(s)||null,t,e,n,i,r)),!0}return!1}function sg(t){var e=fr(t.target);if(e!==null){var n=Rr(e);if(n!==null){if(e=n.tag,e===13){if(e=Ym(n),e!==null){t.blockedOn=e,rg(t.priority,function(){ng(n)});return}}else if(e===3&&n.stateNode.current.memoizedState.isDehydrated){t.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}t.blockedOn=null}function Ba(t){if(t.blockedOn!==null)return!1;for(var e=t.targetContainers;0<e.length;){var n=Ac(t.domEventName,t.eventSystemFlags,e[0],t.nativeEvent);if(n===null){n=t.nativeEvent;var i=new n.constructor(n.type,n);yc=i,n.target.dispatchEvent(i),yc=null}else return e=Vo(n),e!==null&&Rf(e),t.blockedOn=n,!1;e.shift()}return!0}function kd(t,e,n){Ba(t)&&n.delete(e)}function _0(){wc=!1,Ii!==null&&Ba(Ii)&&(Ii=null),Fi!==null&&Ba(Fi)&&(Fi=null),Oi!==null&&Ba(Oi)&&(Oi=null),Eo.forEach(kd),To.forEach(kd)}function Vs(t,e){t.blockedOn===e&&(t.blockedOn=null,wc||(wc=!0,mn.unstable_scheduleCallback(mn.unstable_NormalPriority,_0)))}function wo(t){function e(r){return Vs(r,t)}if(0<ea.length){Vs(ea[0],t);for(var n=1;n<ea.length;n++){var i=ea[n];i.blockedOn===t&&(i.blockedOn=null)}}for(Ii!==null&&Vs(Ii,t),Fi!==null&&Vs(Fi,t),Oi!==null&&Vs(Oi,t),Eo.forEach(e),To.forEach(e),n=0;n<bi.length;n++)i=bi[n],i.blockedOn===t&&(i.blockedOn=null);for(;0<bi.length&&(n=bi[0],n.blockedOn===null);)sg(n),n.blockedOn===null&&bi.shift()}var gs=_i.ReactCurrentBatchConfig,il=!0;function v0(t,e,n,i){var r=Ze,s=gs.transition;gs.transition=null;try{Ze=1,Cf(t,e,n,i)}finally{Ze=r,gs.transition=s}}function x0(t,e,n,i){var r=Ze,s=gs.transition;gs.transition=null;try{Ze=4,Cf(t,e,n,i)}finally{Ze=r,gs.transition=s}}function Cf(t,e,n,i){if(il){var r=Ac(t,e,n,i);if(r===null)mu(t,e,i,rl,n),zd(t,i);else if(g0(r,t,e,n,i))i.stopPropagation();else if(zd(t,i),e&4&&-1<m0.indexOf(t)){for(;r!==null;){var s=Vo(r);if(s!==null&&tg(s),s=Ac(t,e,n,i),s===null&&mu(t,e,i,rl,n),s===r)break;r=s}r!==null&&i.stopPropagation()}else mu(t,e,i,null,n)}}var rl=null;function Ac(t,e,n,i){if(rl=null,t=Tf(i),t=fr(t),t!==null)if(e=Rr(t),e===null)t=null;else if(n=e.tag,n===13){if(t=Ym(e),t!==null)return t;t=null}else if(n===3){if(e.stateNode.current.memoizedState.isDehydrated)return e.tag===3?e.stateNode.containerInfo:null;t=null}else e!==t&&(t=null);return rl=t,null}function og(t){switch(t){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(o0()){case wf:return 1;case Zm:return 4;case tl:case a0:return 16;case Qm:return 536870912;default:return 16}default:return 16}}var Li=null,bf=null,Ha=null;function ag(){if(Ha)return Ha;var t,e=bf,n=e.length,i,r="value"in Li?Li.value:Li.textContent,s=r.length;for(t=0;t<n&&e[t]===r[t];t++);var o=n-t;for(i=1;i<=o&&e[n-i]===r[s-i];i++);return Ha=r.slice(t,1<i?1-i:void 0)}function Ga(t){var e=t.keyCode;return"charCode"in t?(t=t.charCode,t===0&&e===13&&(t=13)):t=e,t===10&&(t=13),32<=t||t===13?t:0}function ta(){return!0}function Bd(){return!1}function _n(t){function e(n,i,r,s,o){this._reactName=n,this._targetInst=r,this.type=i,this.nativeEvent=s,this.target=o,this.currentTarget=null;for(var a in t)t.hasOwnProperty(a)&&(n=t[a],this[a]=n?n(s):s[a]);return this.isDefaultPrevented=(s.defaultPrevented!=null?s.defaultPrevented:s.returnValue===!1)?ta:Bd,this.isPropagationStopped=Bd,this}return ct(e.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=ta)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=ta)},persist:function(){},isPersistent:ta}),e}var Us={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(t){return t.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Pf=_n(Us),Go=ct({},Us,{view:0,detail:0}),y0=_n(Go),ou,au,Ws,Ll=ct({},Go,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Lf,button:0,buttons:0,relatedTarget:function(t){return t.relatedTarget===void 0?t.fromElement===t.srcElement?t.toElement:t.fromElement:t.relatedTarget},movementX:function(t){return"movementX"in t?t.movementX:(t!==Ws&&(Ws&&t.type==="mousemove"?(ou=t.screenX-Ws.screenX,au=t.screenY-Ws.screenY):au=ou=0,Ws=t),ou)},movementY:function(t){return"movementY"in t?t.movementY:au}}),Hd=_n(Ll),S0=ct({},Ll,{dataTransfer:0}),M0=_n(S0),E0=ct({},Go,{relatedTarget:0}),lu=_n(E0),T0=ct({},Us,{animationName:0,elapsedTime:0,pseudoElement:0}),w0=_n(T0),A0=ct({},Us,{clipboardData:function(t){return"clipboardData"in t?t.clipboardData:window.clipboardData}}),R0=_n(A0),C0=ct({},Us,{data:0}),Gd=_n(C0),b0={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},P0={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},L0={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function D0(t){var e=this.nativeEvent;return e.getModifierState?e.getModifierState(t):(t=L0[t])?!!e[t]:!1}function Lf(){return D0}var U0=ct({},Go,{key:function(t){if(t.key){var e=b0[t.key]||t.key;if(e!=="Unidentified")return e}return t.type==="keypress"?(t=Ga(t),t===13?"Enter":String.fromCharCode(t)):t.type==="keydown"||t.type==="keyup"?P0[t.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Lf,charCode:function(t){return t.type==="keypress"?Ga(t):0},keyCode:function(t){return t.type==="keydown"||t.type==="keyup"?t.keyCode:0},which:function(t){return t.type==="keypress"?Ga(t):t.type==="keydown"||t.type==="keyup"?t.keyCode:0}}),N0=_n(U0),I0=ct({},Ll,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Vd=_n(I0),F0=ct({},Go,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Lf}),O0=_n(F0),z0=ct({},Us,{propertyName:0,elapsedTime:0,pseudoElement:0}),k0=_n(z0),B0=ct({},Ll,{deltaX:function(t){return"deltaX"in t?t.deltaX:"wheelDeltaX"in t?-t.wheelDeltaX:0},deltaY:function(t){return"deltaY"in t?t.deltaY:"wheelDeltaY"in t?-t.wheelDeltaY:"wheelDelta"in t?-t.wheelDelta:0},deltaZ:0,deltaMode:0}),H0=_n(B0),G0=[9,13,27,32],Df=di&&"CompositionEvent"in window,fo=null;di&&"documentMode"in document&&(fo=document.documentMode);var V0=di&&"TextEvent"in window&&!fo,lg=di&&(!Df||fo&&8<fo&&11>=fo),Wd=" ",Xd=!1;function ug(t,e){switch(t){case"keyup":return G0.indexOf(e.keyCode)!==-1;case"keydown":return e.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function cg(t){return t=t.detail,typeof t=="object"&&"data"in t?t.data:null}var ns=!1;function W0(t,e){switch(t){case"compositionend":return cg(e);case"keypress":return e.which!==32?null:(Xd=!0,Wd);case"textInput":return t=e.data,t===Wd&&Xd?null:t;default:return null}}function X0(t,e){if(ns)return t==="compositionend"||!Df&&ug(t,e)?(t=ag(),Ha=bf=Li=null,ns=!1,t):null;switch(t){case"paste":return null;case"keypress":if(!(e.ctrlKey||e.altKey||e.metaKey)||e.ctrlKey&&e.altKey){if(e.char&&1<e.char.length)return e.char;if(e.which)return String.fromCharCode(e.which)}return null;case"compositionend":return lg&&e.locale!=="ko"?null:e.data;default:return null}}var j0={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function jd(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e==="input"?!!j0[t.type]:e==="textarea"}function fg(t,e,n,i){Gm(i),e=sl(e,"onChange"),0<e.length&&(n=new Pf("onChange","change",null,n,i),t.push({event:n,listeners:e}))}var ho=null,Ao=null;function Y0(t){Mg(t,0)}function Dl(t){var e=ss(t);if(Im(e))return t}function q0(t,e){if(t==="change")return e}var dg=!1;if(di){var uu;if(di){var cu="oninput"in document;if(!cu){var Yd=document.createElement("div");Yd.setAttribute("oninput","return;"),cu=typeof Yd.oninput=="function"}uu=cu}else uu=!1;dg=uu&&(!document.documentMode||9<document.documentMode)}function qd(){ho&&(ho.detachEvent("onpropertychange",hg),Ao=ho=null)}function hg(t){if(t.propertyName==="value"&&Dl(Ao)){var e=[];fg(e,Ao,t,Tf(t)),jm(Y0,e)}}function $0(t,e,n){t==="focusin"?(qd(),ho=e,Ao=n,ho.attachEvent("onpropertychange",hg)):t==="focusout"&&qd()}function K0(t){if(t==="selectionchange"||t==="keyup"||t==="keydown")return Dl(Ao)}function Z0(t,e){if(t==="click")return Dl(e)}function Q0(t,e){if(t==="input"||t==="change")return Dl(e)}function J0(t,e){return t===e&&(t!==0||1/t===1/e)||t!==t&&e!==e}var Gn=typeof Object.is=="function"?Object.is:J0;function Ro(t,e){if(Gn(t,e))return!0;if(typeof t!="object"||t===null||typeof e!="object"||e===null)return!1;var n=Object.keys(t),i=Object.keys(e);if(n.length!==i.length)return!1;for(i=0;i<n.length;i++){var r=n[i];if(!lc.call(e,r)||!Gn(t[r],e[r]))return!1}return!0}function $d(t){for(;t&&t.firstChild;)t=t.firstChild;return t}function Kd(t,e){var n=$d(t);t=0;for(var i;n;){if(n.nodeType===3){if(i=t+n.textContent.length,t<=e&&i>=e)return{node:n,offset:e-t};t=i}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=$d(n)}}function pg(t,e){return t&&e?t===e?!0:t&&t.nodeType===3?!1:e&&e.nodeType===3?pg(t,e.parentNode):"contains"in t?t.contains(e):t.compareDocumentPosition?!!(t.compareDocumentPosition(e)&16):!1:!1}function mg(){for(var t=window,e=Qa();e instanceof t.HTMLIFrameElement;){try{var n=typeof e.contentWindow.location.href=="string"}catch{n=!1}if(n)t=e.contentWindow;else break;e=Qa(t.document)}return e}function Uf(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e&&(e==="input"&&(t.type==="text"||t.type==="search"||t.type==="tel"||t.type==="url"||t.type==="password")||e==="textarea"||t.contentEditable==="true")}function ex(t){var e=mg(),n=t.focusedElem,i=t.selectionRange;if(e!==n&&n&&n.ownerDocument&&pg(n.ownerDocument.documentElement,n)){if(i!==null&&Uf(n)){if(e=i.start,t=i.end,t===void 0&&(t=e),"selectionStart"in n)n.selectionStart=e,n.selectionEnd=Math.min(t,n.value.length);else if(t=(e=n.ownerDocument||document)&&e.defaultView||window,t.getSelection){t=t.getSelection();var r=n.textContent.length,s=Math.min(i.start,r);i=i.end===void 0?s:Math.min(i.end,r),!t.extend&&s>i&&(r=i,i=s,s=r),r=Kd(n,s);var o=Kd(n,i);r&&o&&(t.rangeCount!==1||t.anchorNode!==r.node||t.anchorOffset!==r.offset||t.focusNode!==o.node||t.focusOffset!==o.offset)&&(e=e.createRange(),e.setStart(r.node,r.offset),t.removeAllRanges(),s>i?(t.addRange(e),t.extend(o.node,o.offset)):(e.setEnd(o.node,o.offset),t.addRange(e)))}}for(e=[],t=n;t=t.parentNode;)t.nodeType===1&&e.push({element:t,left:t.scrollLeft,top:t.scrollTop});for(typeof n.focus=="function"&&n.focus(),n=0;n<e.length;n++)t=e[n],t.element.scrollLeft=t.left,t.element.scrollTop=t.top}}var tx=di&&"documentMode"in document&&11>=document.documentMode,is=null,Rc=null,po=null,Cc=!1;function Zd(t,e,n){var i=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;Cc||is==null||is!==Qa(i)||(i=is,"selectionStart"in i&&Uf(i)?i={start:i.selectionStart,end:i.selectionEnd}:(i=(i.ownerDocument&&i.ownerDocument.defaultView||window).getSelection(),i={anchorNode:i.anchorNode,anchorOffset:i.anchorOffset,focusNode:i.focusNode,focusOffset:i.focusOffset}),po&&Ro(po,i)||(po=i,i=sl(Rc,"onSelect"),0<i.length&&(e=new Pf("onSelect","select",null,e,n),t.push({event:e,listeners:i}),e.target=is)))}function na(t,e){var n={};return n[t.toLowerCase()]=e.toLowerCase(),n["Webkit"+t]="webkit"+e,n["Moz"+t]="moz"+e,n}var rs={animationend:na("Animation","AnimationEnd"),animationiteration:na("Animation","AnimationIteration"),animationstart:na("Animation","AnimationStart"),transitionend:na("Transition","TransitionEnd")},fu={},gg={};di&&(gg=document.createElement("div").style,"AnimationEvent"in window||(delete rs.animationend.animation,delete rs.animationiteration.animation,delete rs.animationstart.animation),"TransitionEvent"in window||delete rs.transitionend.transition);function Ul(t){if(fu[t])return fu[t];if(!rs[t])return t;var e=rs[t],n;for(n in e)if(e.hasOwnProperty(n)&&n in gg)return fu[t]=e[n];return t}var _g=Ul("animationend"),vg=Ul("animationiteration"),xg=Ul("animationstart"),yg=Ul("transitionend"),Sg=new Map,Qd="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function Zi(t,e){Sg.set(t,e),Ar(e,[t])}for(var du=0;du<Qd.length;du++){var hu=Qd[du],nx=hu.toLowerCase(),ix=hu[0].toUpperCase()+hu.slice(1);Zi(nx,"on"+ix)}Zi(_g,"onAnimationEnd");Zi(vg,"onAnimationIteration");Zi(xg,"onAnimationStart");Zi("dblclick","onDoubleClick");Zi("focusin","onFocus");Zi("focusout","onBlur");Zi(yg,"onTransitionEnd");Ss("onMouseEnter",["mouseout","mouseover"]);Ss("onMouseLeave",["mouseout","mouseover"]);Ss("onPointerEnter",["pointerout","pointerover"]);Ss("onPointerLeave",["pointerout","pointerover"]);Ar("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));Ar("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));Ar("onBeforeInput",["compositionend","keypress","textInput","paste"]);Ar("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));Ar("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));Ar("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var oo="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),rx=new Set("cancel close invalid load scroll toggle".split(" ").concat(oo));function Jd(t,e,n){var i=t.type||"unknown-event";t.currentTarget=n,n0(i,e,void 0,t),t.currentTarget=null}function Mg(t,e){e=(e&4)!==0;for(var n=0;n<t.length;n++){var i=t[n],r=i.event;i=i.listeners;e:{var s=void 0;if(e)for(var o=i.length-1;0<=o;o--){var a=i[o],l=a.instance,u=a.currentTarget;if(a=a.listener,l!==s&&r.isPropagationStopped())break e;Jd(r,a,u),s=l}else for(o=0;o<i.length;o++){if(a=i[o],l=a.instance,u=a.currentTarget,a=a.listener,l!==s&&r.isPropagationStopped())break e;Jd(r,a,u),s=l}}}if(el)throw t=Ec,el=!1,Ec=null,t}function it(t,e){var n=e[Uc];n===void 0&&(n=e[Uc]=new Set);var i=t+"__bubble";n.has(i)||(Eg(e,t,2,!1),n.add(i))}function pu(t,e,n){var i=0;e&&(i|=4),Eg(n,t,i,e)}var ia="_reactListening"+Math.random().toString(36).slice(2);function Co(t){if(!t[ia]){t[ia]=!0,Pm.forEach(function(n){n!=="selectionchange"&&(rx.has(n)||pu(n,!1,t),pu(n,!0,t))});var e=t.nodeType===9?t:t.ownerDocument;e===null||e[ia]||(e[ia]=!0,pu("selectionchange",!1,e))}}function Eg(t,e,n,i){switch(og(e)){case 1:var r=v0;break;case 4:r=x0;break;default:r=Cf}n=r.bind(null,e,n,t),r=void 0,!Mc||e!=="touchstart"&&e!=="touchmove"&&e!=="wheel"||(r=!0),i?r!==void 0?t.addEventListener(e,n,{capture:!0,passive:r}):t.addEventListener(e,n,!0):r!==void 0?t.addEventListener(e,n,{passive:r}):t.addEventListener(e,n,!1)}function mu(t,e,n,i,r){var s=i;if(!(e&1)&&!(e&2)&&i!==null)e:for(;;){if(i===null)return;var o=i.tag;if(o===3||o===4){var a=i.stateNode.containerInfo;if(a===r||a.nodeType===8&&a.parentNode===r)break;if(o===4)for(o=i.return;o!==null;){var l=o.tag;if((l===3||l===4)&&(l=o.stateNode.containerInfo,l===r||l.nodeType===8&&l.parentNode===r))return;o=o.return}for(;a!==null;){if(o=fr(a),o===null)return;if(l=o.tag,l===5||l===6){i=s=o;continue e}a=a.parentNode}}i=i.return}jm(function(){var u=s,f=Tf(n),h=[];e:{var d=Sg.get(t);if(d!==void 0){var m=Pf,x=t;switch(t){case"keypress":if(Ga(n)===0)break e;case"keydown":case"keyup":m=N0;break;case"focusin":x="focus",m=lu;break;case"focusout":x="blur",m=lu;break;case"beforeblur":case"afterblur":m=lu;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":m=Hd;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":m=M0;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":m=O0;break;case _g:case vg:case xg:m=w0;break;case yg:m=k0;break;case"scroll":m=y0;break;case"wheel":m=H0;break;case"copy":case"cut":case"paste":m=R0;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":m=Vd}var v=(e&4)!==0,p=!v&&t==="scroll",c=v?d!==null?d+"Capture":null:d;v=[];for(var _=u,g;_!==null;){g=_;var y=g.stateNode;if(g.tag===5&&y!==null&&(g=y,c!==null&&(y=Mo(_,c),y!=null&&v.push(bo(_,y,g)))),p)break;_=_.return}0<v.length&&(d=new m(d,x,null,n,f),h.push({event:d,listeners:v}))}}if(!(e&7)){e:{if(d=t==="mouseover"||t==="pointerover",m=t==="mouseout"||t==="pointerout",d&&n!==yc&&(x=n.relatedTarget||n.fromElement)&&(fr(x)||x[hi]))break e;if((m||d)&&(d=f.window===f?f:(d=f.ownerDocument)?d.defaultView||d.parentWindow:window,m?(x=n.relatedTarget||n.toElement,m=u,x=x?fr(x):null,x!==null&&(p=Rr(x),x!==p||x.tag!==5&&x.tag!==6)&&(x=null)):(m=null,x=u),m!==x)){if(v=Hd,y="onMouseLeave",c="onMouseEnter",_="mouse",(t==="pointerout"||t==="pointerover")&&(v=Vd,y="onPointerLeave",c="onPointerEnter",_="pointer"),p=m==null?d:ss(m),g=x==null?d:ss(x),d=new v(y,_+"leave",m,n,f),d.target=p,d.relatedTarget=g,y=null,fr(f)===u&&(v=new v(c,_+"enter",x,n,f),v.target=g,v.relatedTarget=p,y=v),p=y,m&&x)t:{for(v=m,c=x,_=0,g=v;g;g=Pr(g))_++;for(g=0,y=c;y;y=Pr(y))g++;for(;0<_-g;)v=Pr(v),_--;for(;0<g-_;)c=Pr(c),g--;for(;_--;){if(v===c||c!==null&&v===c.alternate)break t;v=Pr(v),c=Pr(c)}v=null}else v=null;m!==null&&eh(h,d,m,v,!1),x!==null&&p!==null&&eh(h,p,x,v,!0)}}e:{if(d=u?ss(u):window,m=d.nodeName&&d.nodeName.toLowerCase(),m==="select"||m==="input"&&d.type==="file")var M=q0;else if(jd(d))if(dg)M=Q0;else{M=K0;var A=$0}else(m=d.nodeName)&&m.toLowerCase()==="input"&&(d.type==="checkbox"||d.type==="radio")&&(M=Z0);if(M&&(M=M(t,u))){fg(h,M,n,f);break e}A&&A(t,d,u),t==="focusout"&&(A=d._wrapperState)&&A.controlled&&d.type==="number"&&mc(d,"number",d.value)}switch(A=u?ss(u):window,t){case"focusin":(jd(A)||A.contentEditable==="true")&&(is=A,Rc=u,po=null);break;case"focusout":po=Rc=is=null;break;case"mousedown":Cc=!0;break;case"contextmenu":case"mouseup":case"dragend":Cc=!1,Zd(h,n,f);break;case"selectionchange":if(tx)break;case"keydown":case"keyup":Zd(h,n,f)}var w;if(Df)e:{switch(t){case"compositionstart":var b="onCompositionStart";break e;case"compositionend":b="onCompositionEnd";break e;case"compositionupdate":b="onCompositionUpdate";break e}b=void 0}else ns?ug(t,n)&&(b="onCompositionEnd"):t==="keydown"&&n.keyCode===229&&(b="onCompositionStart");b&&(lg&&n.locale!=="ko"&&(ns||b!=="onCompositionStart"?b==="onCompositionEnd"&&ns&&(w=ag()):(Li=f,bf="value"in Li?Li.value:Li.textContent,ns=!0)),A=sl(u,b),0<A.length&&(b=new Gd(b,t,null,n,f),h.push({event:b,listeners:A}),w?b.data=w:(w=cg(n),w!==null&&(b.data=w)))),(w=V0?W0(t,n):X0(t,n))&&(u=sl(u,"onBeforeInput"),0<u.length&&(f=new Gd("onBeforeInput","beforeinput",null,n,f),h.push({event:f,listeners:u}),f.data=w))}Mg(h,e)})}function bo(t,e,n){return{instance:t,listener:e,currentTarget:n}}function sl(t,e){for(var n=e+"Capture",i=[];t!==null;){var r=t,s=r.stateNode;r.tag===5&&s!==null&&(r=s,s=Mo(t,n),s!=null&&i.unshift(bo(t,s,r)),s=Mo(t,e),s!=null&&i.push(bo(t,s,r))),t=t.return}return i}function Pr(t){if(t===null)return null;do t=t.return;while(t&&t.tag!==5);return t||null}function eh(t,e,n,i,r){for(var s=e._reactName,o=[];n!==null&&n!==i;){var a=n,l=a.alternate,u=a.stateNode;if(l!==null&&l===i)break;a.tag===5&&u!==null&&(a=u,r?(l=Mo(n,s),l!=null&&o.unshift(bo(n,l,a))):r||(l=Mo(n,s),l!=null&&o.push(bo(n,l,a)))),n=n.return}o.length!==0&&t.push({event:e,listeners:o})}var sx=/\r\n?/g,ox=/\u0000|\uFFFD/g;function th(t){return(typeof t=="string"?t:""+t).replace(sx,`
`).replace(ox,"")}function ra(t,e,n){if(e=th(e),th(t)!==e&&n)throw Error(ie(425))}function ol(){}var bc=null,Pc=null;function Lc(t,e){return t==="textarea"||t==="noscript"||typeof e.children=="string"||typeof e.children=="number"||typeof e.dangerouslySetInnerHTML=="object"&&e.dangerouslySetInnerHTML!==null&&e.dangerouslySetInnerHTML.__html!=null}var Dc=typeof setTimeout=="function"?setTimeout:void 0,ax=typeof clearTimeout=="function"?clearTimeout:void 0,nh=typeof Promise=="function"?Promise:void 0,lx=typeof queueMicrotask=="function"?queueMicrotask:typeof nh<"u"?function(t){return nh.resolve(null).then(t).catch(ux)}:Dc;function ux(t){setTimeout(function(){throw t})}function gu(t,e){var n=e,i=0;do{var r=n.nextSibling;if(t.removeChild(n),r&&r.nodeType===8)if(n=r.data,n==="/$"){if(i===0){t.removeChild(r),wo(e);return}i--}else n!=="$"&&n!=="$?"&&n!=="$!"||i++;n=r}while(n);wo(e)}function zi(t){for(;t!=null;t=t.nextSibling){var e=t.nodeType;if(e===1||e===3)break;if(e===8){if(e=t.data,e==="$"||e==="$!"||e==="$?")break;if(e==="/$")return null}}return t}function ih(t){t=t.previousSibling;for(var e=0;t;){if(t.nodeType===8){var n=t.data;if(n==="$"||n==="$!"||n==="$?"){if(e===0)return t;e--}else n==="/$"&&e++}t=t.previousSibling}return null}var Ns=Math.random().toString(36).slice(2),Yn="__reactFiber$"+Ns,Po="__reactProps$"+Ns,hi="__reactContainer$"+Ns,Uc="__reactEvents$"+Ns,cx="__reactListeners$"+Ns,fx="__reactHandles$"+Ns;function fr(t){var e=t[Yn];if(e)return e;for(var n=t.parentNode;n;){if(e=n[hi]||n[Yn]){if(n=e.alternate,e.child!==null||n!==null&&n.child!==null)for(t=ih(t);t!==null;){if(n=t[Yn])return n;t=ih(t)}return e}t=n,n=t.parentNode}return null}function Vo(t){return t=t[Yn]||t[hi],!t||t.tag!==5&&t.tag!==6&&t.tag!==13&&t.tag!==3?null:t}function ss(t){if(t.tag===5||t.tag===6)return t.stateNode;throw Error(ie(33))}function Nl(t){return t[Po]||null}var Nc=[],os=-1;function Qi(t){return{current:t}}function st(t){0>os||(t.current=Nc[os],Nc[os]=null,os--)}function tt(t,e){os++,Nc[os]=t.current,t.current=e}var $i={},Wt=Qi($i),rn=Qi(!1),vr=$i;function Ms(t,e){var n=t.type.contextTypes;if(!n)return $i;var i=t.stateNode;if(i&&i.__reactInternalMemoizedUnmaskedChildContext===e)return i.__reactInternalMemoizedMaskedChildContext;var r={},s;for(s in n)r[s]=e[s];return i&&(t=t.stateNode,t.__reactInternalMemoizedUnmaskedChildContext=e,t.__reactInternalMemoizedMaskedChildContext=r),r}function sn(t){return t=t.childContextTypes,t!=null}function al(){st(rn),st(Wt)}function rh(t,e,n){if(Wt.current!==$i)throw Error(ie(168));tt(Wt,e),tt(rn,n)}function Tg(t,e,n){var i=t.stateNode;if(e=e.childContextTypes,typeof i.getChildContext!="function")return n;i=i.getChildContext();for(var r in i)if(!(r in e))throw Error(ie(108,$v(t)||"Unknown",r));return ct({},n,i)}function ll(t){return t=(t=t.stateNode)&&t.__reactInternalMemoizedMergedChildContext||$i,vr=Wt.current,tt(Wt,t),tt(rn,rn.current),!0}function sh(t,e,n){var i=t.stateNode;if(!i)throw Error(ie(169));n?(t=Tg(t,e,vr),i.__reactInternalMemoizedMergedChildContext=t,st(rn),st(Wt),tt(Wt,t)):st(rn),tt(rn,n)}var si=null,Il=!1,_u=!1;function wg(t){si===null?si=[t]:si.push(t)}function dx(t){Il=!0,wg(t)}function Ji(){if(!_u&&si!==null){_u=!0;var t=0,e=Ze;try{var n=si;for(Ze=1;t<n.length;t++){var i=n[t];do i=i(!0);while(i!==null)}si=null,Il=!1}catch(r){throw si!==null&&(si=si.slice(t+1)),Km(wf,Ji),r}finally{Ze=e,_u=!1}}return null}var as=[],ls=0,ul=null,cl=0,yn=[],Sn=0,xr=null,li=1,ui="";function or(t,e){as[ls++]=cl,as[ls++]=ul,ul=t,cl=e}function Ag(t,e,n){yn[Sn++]=li,yn[Sn++]=ui,yn[Sn++]=xr,xr=t;var i=li;t=ui;var r=32-kn(i)-1;i&=~(1<<r),n+=1;var s=32-kn(e)+r;if(30<s){var o=r-r%5;s=(i&(1<<o)-1).toString(32),i>>=o,r-=o,li=1<<32-kn(e)+r|n<<r|i,ui=s+t}else li=1<<s|n<<r|i,ui=t}function Nf(t){t.return!==null&&(or(t,1),Ag(t,1,0))}function If(t){for(;t===ul;)ul=as[--ls],as[ls]=null,cl=as[--ls],as[ls]=null;for(;t===xr;)xr=yn[--Sn],yn[Sn]=null,ui=yn[--Sn],yn[Sn]=null,li=yn[--Sn],yn[Sn]=null}var pn=null,hn=null,ot=!1,Fn=null;function Rg(t,e){var n=An(5,null,null,0);n.elementType="DELETED",n.stateNode=e,n.return=t,e=t.deletions,e===null?(t.deletions=[n],t.flags|=16):e.push(n)}function oh(t,e){switch(t.tag){case 5:var n=t.type;return e=e.nodeType!==1||n.toLowerCase()!==e.nodeName.toLowerCase()?null:e,e!==null?(t.stateNode=e,pn=t,hn=zi(e.firstChild),!0):!1;case 6:return e=t.pendingProps===""||e.nodeType!==3?null:e,e!==null?(t.stateNode=e,pn=t,hn=null,!0):!1;case 13:return e=e.nodeType!==8?null:e,e!==null?(n=xr!==null?{id:li,overflow:ui}:null,t.memoizedState={dehydrated:e,treeContext:n,retryLane:1073741824},n=An(18,null,null,0),n.stateNode=e,n.return=t,t.child=n,pn=t,hn=null,!0):!1;default:return!1}}function Ic(t){return(t.mode&1)!==0&&(t.flags&128)===0}function Fc(t){if(ot){var e=hn;if(e){var n=e;if(!oh(t,e)){if(Ic(t))throw Error(ie(418));e=zi(n.nextSibling);var i=pn;e&&oh(t,e)?Rg(i,n):(t.flags=t.flags&-4097|2,ot=!1,pn=t)}}else{if(Ic(t))throw Error(ie(418));t.flags=t.flags&-4097|2,ot=!1,pn=t}}}function ah(t){for(t=t.return;t!==null&&t.tag!==5&&t.tag!==3&&t.tag!==13;)t=t.return;pn=t}function sa(t){if(t!==pn)return!1;if(!ot)return ah(t),ot=!0,!1;var e;if((e=t.tag!==3)&&!(e=t.tag!==5)&&(e=t.type,e=e!=="head"&&e!=="body"&&!Lc(t.type,t.memoizedProps)),e&&(e=hn)){if(Ic(t))throw Cg(),Error(ie(418));for(;e;)Rg(t,e),e=zi(e.nextSibling)}if(ah(t),t.tag===13){if(t=t.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(ie(317));e:{for(t=t.nextSibling,e=0;t;){if(t.nodeType===8){var n=t.data;if(n==="/$"){if(e===0){hn=zi(t.nextSibling);break e}e--}else n!=="$"&&n!=="$!"&&n!=="$?"||e++}t=t.nextSibling}hn=null}}else hn=pn?zi(t.stateNode.nextSibling):null;return!0}function Cg(){for(var t=hn;t;)t=zi(t.nextSibling)}function Es(){hn=pn=null,ot=!1}function Ff(t){Fn===null?Fn=[t]:Fn.push(t)}var hx=_i.ReactCurrentBatchConfig;function Xs(t,e,n){if(t=n.ref,t!==null&&typeof t!="function"&&typeof t!="object"){if(n._owner){if(n=n._owner,n){if(n.tag!==1)throw Error(ie(309));var i=n.stateNode}if(!i)throw Error(ie(147,t));var r=i,s=""+t;return e!==null&&e.ref!==null&&typeof e.ref=="function"&&e.ref._stringRef===s?e.ref:(e=function(o){var a=r.refs;o===null?delete a[s]:a[s]=o},e._stringRef=s,e)}if(typeof t!="string")throw Error(ie(284));if(!n._owner)throw Error(ie(290,t))}return t}function oa(t,e){throw t=Object.prototype.toString.call(e),Error(ie(31,t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t))}function lh(t){var e=t._init;return e(t._payload)}function bg(t){function e(c,_){if(t){var g=c.deletions;g===null?(c.deletions=[_],c.flags|=16):g.push(_)}}function n(c,_){if(!t)return null;for(;_!==null;)e(c,_),_=_.sibling;return null}function i(c,_){for(c=new Map;_!==null;)_.key!==null?c.set(_.key,_):c.set(_.index,_),_=_.sibling;return c}function r(c,_){return c=Gi(c,_),c.index=0,c.sibling=null,c}function s(c,_,g){return c.index=g,t?(g=c.alternate,g!==null?(g=g.index,g<_?(c.flags|=2,_):g):(c.flags|=2,_)):(c.flags|=1048576,_)}function o(c){return t&&c.alternate===null&&(c.flags|=2),c}function a(c,_,g,y){return _===null||_.tag!==6?(_=Tu(g,c.mode,y),_.return=c,_):(_=r(_,g),_.return=c,_)}function l(c,_,g,y){var M=g.type;return M===ts?f(c,_,g.props.children,y,g.key):_!==null&&(_.elementType===M||typeof M=="object"&&M!==null&&M.$$typeof===Ai&&lh(M)===_.type)?(y=r(_,g.props),y.ref=Xs(c,_,g),y.return=c,y):(y=$a(g.type,g.key,g.props,null,c.mode,y),y.ref=Xs(c,_,g),y.return=c,y)}function u(c,_,g,y){return _===null||_.tag!==4||_.stateNode.containerInfo!==g.containerInfo||_.stateNode.implementation!==g.implementation?(_=wu(g,c.mode,y),_.return=c,_):(_=r(_,g.children||[]),_.return=c,_)}function f(c,_,g,y,M){return _===null||_.tag!==7?(_=mr(g,c.mode,y,M),_.return=c,_):(_=r(_,g),_.return=c,_)}function h(c,_,g){if(typeof _=="string"&&_!==""||typeof _=="number")return _=Tu(""+_,c.mode,g),_.return=c,_;if(typeof _=="object"&&_!==null){switch(_.$$typeof){case $o:return g=$a(_.type,_.key,_.props,null,c.mode,g),g.ref=Xs(c,null,_),g.return=c,g;case es:return _=wu(_,c.mode,g),_.return=c,_;case Ai:var y=_._init;return h(c,y(_._payload),g)}if(ro(_)||Bs(_))return _=mr(_,c.mode,g,null),_.return=c,_;oa(c,_)}return null}function d(c,_,g,y){var M=_!==null?_.key:null;if(typeof g=="string"&&g!==""||typeof g=="number")return M!==null?null:a(c,_,""+g,y);if(typeof g=="object"&&g!==null){switch(g.$$typeof){case $o:return g.key===M?l(c,_,g,y):null;case es:return g.key===M?u(c,_,g,y):null;case Ai:return M=g._init,d(c,_,M(g._payload),y)}if(ro(g)||Bs(g))return M!==null?null:f(c,_,g,y,null);oa(c,g)}return null}function m(c,_,g,y,M){if(typeof y=="string"&&y!==""||typeof y=="number")return c=c.get(g)||null,a(_,c,""+y,M);if(typeof y=="object"&&y!==null){switch(y.$$typeof){case $o:return c=c.get(y.key===null?g:y.key)||null,l(_,c,y,M);case es:return c=c.get(y.key===null?g:y.key)||null,u(_,c,y,M);case Ai:var A=y._init;return m(c,_,g,A(y._payload),M)}if(ro(y)||Bs(y))return c=c.get(g)||null,f(_,c,y,M,null);oa(_,y)}return null}function x(c,_,g,y){for(var M=null,A=null,w=_,b=_=0,S=null;w!==null&&b<g.length;b++){w.index>b?(S=w,w=null):S=w.sibling;var R=d(c,w,g[b],y);if(R===null){w===null&&(w=S);break}t&&w&&R.alternate===null&&e(c,w),_=s(R,_,b),A===null?M=R:A.sibling=R,A=R,w=S}if(b===g.length)return n(c,w),ot&&or(c,b),M;if(w===null){for(;b<g.length;b++)w=h(c,g[b],y),w!==null&&(_=s(w,_,b),A===null?M=w:A.sibling=w,A=w);return ot&&or(c,b),M}for(w=i(c,w);b<g.length;b++)S=m(w,c,b,g[b],y),S!==null&&(t&&S.alternate!==null&&w.delete(S.key===null?b:S.key),_=s(S,_,b),A===null?M=S:A.sibling=S,A=S);return t&&w.forEach(function(H){return e(c,H)}),ot&&or(c,b),M}function v(c,_,g,y){var M=Bs(g);if(typeof M!="function")throw Error(ie(150));if(g=M.call(g),g==null)throw Error(ie(151));for(var A=M=null,w=_,b=_=0,S=null,R=g.next();w!==null&&!R.done;b++,R=g.next()){w.index>b?(S=w,w=null):S=w.sibling;var H=d(c,w,R.value,y);if(H===null){w===null&&(w=S);break}t&&w&&H.alternate===null&&e(c,w),_=s(H,_,b),A===null?M=H:A.sibling=H,A=H,w=S}if(R.done)return n(c,w),ot&&or(c,b),M;if(w===null){for(;!R.done;b++,R=g.next())R=h(c,R.value,y),R!==null&&(_=s(R,_,b),A===null?M=R:A.sibling=R,A=R);return ot&&or(c,b),M}for(w=i(c,w);!R.done;b++,R=g.next())R=m(w,c,b,R.value,y),R!==null&&(t&&R.alternate!==null&&w.delete(R.key===null?b:R.key),_=s(R,_,b),A===null?M=R:A.sibling=R,A=R);return t&&w.forEach(function(I){return e(c,I)}),ot&&or(c,b),M}function p(c,_,g,y){if(typeof g=="object"&&g!==null&&g.type===ts&&g.key===null&&(g=g.props.children),typeof g=="object"&&g!==null){switch(g.$$typeof){case $o:e:{for(var M=g.key,A=_;A!==null;){if(A.key===M){if(M=g.type,M===ts){if(A.tag===7){n(c,A.sibling),_=r(A,g.props.children),_.return=c,c=_;break e}}else if(A.elementType===M||typeof M=="object"&&M!==null&&M.$$typeof===Ai&&lh(M)===A.type){n(c,A.sibling),_=r(A,g.props),_.ref=Xs(c,A,g),_.return=c,c=_;break e}n(c,A);break}else e(c,A);A=A.sibling}g.type===ts?(_=mr(g.props.children,c.mode,y,g.key),_.return=c,c=_):(y=$a(g.type,g.key,g.props,null,c.mode,y),y.ref=Xs(c,_,g),y.return=c,c=y)}return o(c);case es:e:{for(A=g.key;_!==null;){if(_.key===A)if(_.tag===4&&_.stateNode.containerInfo===g.containerInfo&&_.stateNode.implementation===g.implementation){n(c,_.sibling),_=r(_,g.children||[]),_.return=c,c=_;break e}else{n(c,_);break}else e(c,_);_=_.sibling}_=wu(g,c.mode,y),_.return=c,c=_}return o(c);case Ai:return A=g._init,p(c,_,A(g._payload),y)}if(ro(g))return x(c,_,g,y);if(Bs(g))return v(c,_,g,y);oa(c,g)}return typeof g=="string"&&g!==""||typeof g=="number"?(g=""+g,_!==null&&_.tag===6?(n(c,_.sibling),_=r(_,g),_.return=c,c=_):(n(c,_),_=Tu(g,c.mode,y),_.return=c,c=_),o(c)):n(c,_)}return p}var Ts=bg(!0),Pg=bg(!1),fl=Qi(null),dl=null,us=null,Of=null;function zf(){Of=us=dl=null}function kf(t){var e=fl.current;st(fl),t._currentValue=e}function Oc(t,e,n){for(;t!==null;){var i=t.alternate;if((t.childLanes&e)!==e?(t.childLanes|=e,i!==null&&(i.childLanes|=e)):i!==null&&(i.childLanes&e)!==e&&(i.childLanes|=e),t===n)break;t=t.return}}function _s(t,e){dl=t,Of=us=null,t=t.dependencies,t!==null&&t.firstContext!==null&&(t.lanes&e&&(nn=!0),t.firstContext=null)}function Cn(t){var e=t._currentValue;if(Of!==t)if(t={context:t,memoizedValue:e,next:null},us===null){if(dl===null)throw Error(ie(308));us=t,dl.dependencies={lanes:0,firstContext:t}}else us=us.next=t;return e}var dr=null;function Bf(t){dr===null?dr=[t]:dr.push(t)}function Lg(t,e,n,i){var r=e.interleaved;return r===null?(n.next=n,Bf(e)):(n.next=r.next,r.next=n),e.interleaved=n,pi(t,i)}function pi(t,e){t.lanes|=e;var n=t.alternate;for(n!==null&&(n.lanes|=e),n=t,t=t.return;t!==null;)t.childLanes|=e,n=t.alternate,n!==null&&(n.childLanes|=e),n=t,t=t.return;return n.tag===3?n.stateNode:null}var Ri=!1;function Hf(t){t.updateQueue={baseState:t.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function Dg(t,e){t=t.updateQueue,e.updateQueue===t&&(e.updateQueue={baseState:t.baseState,firstBaseUpdate:t.firstBaseUpdate,lastBaseUpdate:t.lastBaseUpdate,shared:t.shared,effects:t.effects})}function fi(t,e){return{eventTime:t,lane:e,tag:0,payload:null,callback:null,next:null}}function ki(t,e,n){var i=t.updateQueue;if(i===null)return null;if(i=i.shared,Ke&2){var r=i.pending;return r===null?e.next=e:(e.next=r.next,r.next=e),i.pending=e,pi(t,n)}return r=i.interleaved,r===null?(e.next=e,Bf(i)):(e.next=r.next,r.next=e),i.interleaved=e,pi(t,n)}function Va(t,e,n){if(e=e.updateQueue,e!==null&&(e=e.shared,(n&4194240)!==0)){var i=e.lanes;i&=t.pendingLanes,n|=i,e.lanes=n,Af(t,n)}}function uh(t,e){var n=t.updateQueue,i=t.alternate;if(i!==null&&(i=i.updateQueue,n===i)){var r=null,s=null;if(n=n.firstBaseUpdate,n!==null){do{var o={eventTime:n.eventTime,lane:n.lane,tag:n.tag,payload:n.payload,callback:n.callback,next:null};s===null?r=s=o:s=s.next=o,n=n.next}while(n!==null);s===null?r=s=e:s=s.next=e}else r=s=e;n={baseState:i.baseState,firstBaseUpdate:r,lastBaseUpdate:s,shared:i.shared,effects:i.effects},t.updateQueue=n;return}t=n.lastBaseUpdate,t===null?n.firstBaseUpdate=e:t.next=e,n.lastBaseUpdate=e}function hl(t,e,n,i){var r=t.updateQueue;Ri=!1;var s=r.firstBaseUpdate,o=r.lastBaseUpdate,a=r.shared.pending;if(a!==null){r.shared.pending=null;var l=a,u=l.next;l.next=null,o===null?s=u:o.next=u,o=l;var f=t.alternate;f!==null&&(f=f.updateQueue,a=f.lastBaseUpdate,a!==o&&(a===null?f.firstBaseUpdate=u:a.next=u,f.lastBaseUpdate=l))}if(s!==null){var h=r.baseState;o=0,f=u=l=null,a=s;do{var d=a.lane,m=a.eventTime;if((i&d)===d){f!==null&&(f=f.next={eventTime:m,lane:0,tag:a.tag,payload:a.payload,callback:a.callback,next:null});e:{var x=t,v=a;switch(d=e,m=n,v.tag){case 1:if(x=v.payload,typeof x=="function"){h=x.call(m,h,d);break e}h=x;break e;case 3:x.flags=x.flags&-65537|128;case 0:if(x=v.payload,d=typeof x=="function"?x.call(m,h,d):x,d==null)break e;h=ct({},h,d);break e;case 2:Ri=!0}}a.callback!==null&&a.lane!==0&&(t.flags|=64,d=r.effects,d===null?r.effects=[a]:d.push(a))}else m={eventTime:m,lane:d,tag:a.tag,payload:a.payload,callback:a.callback,next:null},f===null?(u=f=m,l=h):f=f.next=m,o|=d;if(a=a.next,a===null){if(a=r.shared.pending,a===null)break;d=a,a=d.next,d.next=null,r.lastBaseUpdate=d,r.shared.pending=null}}while(!0);if(f===null&&(l=h),r.baseState=l,r.firstBaseUpdate=u,r.lastBaseUpdate=f,e=r.shared.interleaved,e!==null){r=e;do o|=r.lane,r=r.next;while(r!==e)}else s===null&&(r.shared.lanes=0);Sr|=o,t.lanes=o,t.memoizedState=h}}function ch(t,e,n){if(t=e.effects,e.effects=null,t!==null)for(e=0;e<t.length;e++){var i=t[e],r=i.callback;if(r!==null){if(i.callback=null,i=n,typeof r!="function")throw Error(ie(191,r));r.call(i)}}}var Wo={},Kn=Qi(Wo),Lo=Qi(Wo),Do=Qi(Wo);function hr(t){if(t===Wo)throw Error(ie(174));return t}function Gf(t,e){switch(tt(Do,e),tt(Lo,t),tt(Kn,Wo),t=e.nodeType,t){case 9:case 11:e=(e=e.documentElement)?e.namespaceURI:_c(null,"");break;default:t=t===8?e.parentNode:e,e=t.namespaceURI||null,t=t.tagName,e=_c(e,t)}st(Kn),tt(Kn,e)}function ws(){st(Kn),st(Lo),st(Do)}function Ug(t){hr(Do.current);var e=hr(Kn.current),n=_c(e,t.type);e!==n&&(tt(Lo,t),tt(Kn,n))}function Vf(t){Lo.current===t&&(st(Kn),st(Lo))}var lt=Qi(0);function pl(t){for(var e=t;e!==null;){if(e.tag===13){var n=e.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||n.data==="$?"||n.data==="$!"))return e}else if(e.tag===19&&e.memoizedProps.revealOrder!==void 0){if(e.flags&128)return e}else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return null;e=e.return}e.sibling.return=e.return,e=e.sibling}return null}var vu=[];function Wf(){for(var t=0;t<vu.length;t++)vu[t]._workInProgressVersionPrimary=null;vu.length=0}var Wa=_i.ReactCurrentDispatcher,xu=_i.ReactCurrentBatchConfig,yr=0,ut=null,yt=null,Pt=null,ml=!1,mo=!1,Uo=0,px=0;function kt(){throw Error(ie(321))}function Xf(t,e){if(e===null)return!1;for(var n=0;n<e.length&&n<t.length;n++)if(!Gn(t[n],e[n]))return!1;return!0}function jf(t,e,n,i,r,s){if(yr=s,ut=e,e.memoizedState=null,e.updateQueue=null,e.lanes=0,Wa.current=t===null||t.memoizedState===null?vx:xx,t=n(i,r),mo){s=0;do{if(mo=!1,Uo=0,25<=s)throw Error(ie(301));s+=1,Pt=yt=null,e.updateQueue=null,Wa.current=yx,t=n(i,r)}while(mo)}if(Wa.current=gl,e=yt!==null&&yt.next!==null,yr=0,Pt=yt=ut=null,ml=!1,e)throw Error(ie(300));return t}function Yf(){var t=Uo!==0;return Uo=0,t}function Xn(){var t={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Pt===null?ut.memoizedState=Pt=t:Pt=Pt.next=t,Pt}function bn(){if(yt===null){var t=ut.alternate;t=t!==null?t.memoizedState:null}else t=yt.next;var e=Pt===null?ut.memoizedState:Pt.next;if(e!==null)Pt=e,yt=t;else{if(t===null)throw Error(ie(310));yt=t,t={memoizedState:yt.memoizedState,baseState:yt.baseState,baseQueue:yt.baseQueue,queue:yt.queue,next:null},Pt===null?ut.memoizedState=Pt=t:Pt=Pt.next=t}return Pt}function No(t,e){return typeof e=="function"?e(t):e}function yu(t){var e=bn(),n=e.queue;if(n===null)throw Error(ie(311));n.lastRenderedReducer=t;var i=yt,r=i.baseQueue,s=n.pending;if(s!==null){if(r!==null){var o=r.next;r.next=s.next,s.next=o}i.baseQueue=r=s,n.pending=null}if(r!==null){s=r.next,i=i.baseState;var a=o=null,l=null,u=s;do{var f=u.lane;if((yr&f)===f)l!==null&&(l=l.next={lane:0,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null}),i=u.hasEagerState?u.eagerState:t(i,u.action);else{var h={lane:f,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null};l===null?(a=l=h,o=i):l=l.next=h,ut.lanes|=f,Sr|=f}u=u.next}while(u!==null&&u!==s);l===null?o=i:l.next=a,Gn(i,e.memoizedState)||(nn=!0),e.memoizedState=i,e.baseState=o,e.baseQueue=l,n.lastRenderedState=i}if(t=n.interleaved,t!==null){r=t;do s=r.lane,ut.lanes|=s,Sr|=s,r=r.next;while(r!==t)}else r===null&&(n.lanes=0);return[e.memoizedState,n.dispatch]}function Su(t){var e=bn(),n=e.queue;if(n===null)throw Error(ie(311));n.lastRenderedReducer=t;var i=n.dispatch,r=n.pending,s=e.memoizedState;if(r!==null){n.pending=null;var o=r=r.next;do s=t(s,o.action),o=o.next;while(o!==r);Gn(s,e.memoizedState)||(nn=!0),e.memoizedState=s,e.baseQueue===null&&(e.baseState=s),n.lastRenderedState=s}return[s,i]}function Ng(){}function Ig(t,e){var n=ut,i=bn(),r=e(),s=!Gn(i.memoizedState,r);if(s&&(i.memoizedState=r,nn=!0),i=i.queue,qf(zg.bind(null,n,i,t),[t]),i.getSnapshot!==e||s||Pt!==null&&Pt.memoizedState.tag&1){if(n.flags|=2048,Io(9,Og.bind(null,n,i,r,e),void 0,null),Dt===null)throw Error(ie(349));yr&30||Fg(n,e,r)}return r}function Fg(t,e,n){t.flags|=16384,t={getSnapshot:e,value:n},e=ut.updateQueue,e===null?(e={lastEffect:null,stores:null},ut.updateQueue=e,e.stores=[t]):(n=e.stores,n===null?e.stores=[t]:n.push(t))}function Og(t,e,n,i){e.value=n,e.getSnapshot=i,kg(e)&&Bg(t)}function zg(t,e,n){return n(function(){kg(e)&&Bg(t)})}function kg(t){var e=t.getSnapshot;t=t.value;try{var n=e();return!Gn(t,n)}catch{return!0}}function Bg(t){var e=pi(t,1);e!==null&&Bn(e,t,1,-1)}function fh(t){var e=Xn();return typeof t=="function"&&(t=t()),e.memoizedState=e.baseState=t,t={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:No,lastRenderedState:t},e.queue=t,t=t.dispatch=_x.bind(null,ut,t),[e.memoizedState,t]}function Io(t,e,n,i){return t={tag:t,create:e,destroy:n,deps:i,next:null},e=ut.updateQueue,e===null?(e={lastEffect:null,stores:null},ut.updateQueue=e,e.lastEffect=t.next=t):(n=e.lastEffect,n===null?e.lastEffect=t.next=t:(i=n.next,n.next=t,t.next=i,e.lastEffect=t)),t}function Hg(){return bn().memoizedState}function Xa(t,e,n,i){var r=Xn();ut.flags|=t,r.memoizedState=Io(1|e,n,void 0,i===void 0?null:i)}function Fl(t,e,n,i){var r=bn();i=i===void 0?null:i;var s=void 0;if(yt!==null){var o=yt.memoizedState;if(s=o.destroy,i!==null&&Xf(i,o.deps)){r.memoizedState=Io(e,n,s,i);return}}ut.flags|=t,r.memoizedState=Io(1|e,n,s,i)}function dh(t,e){return Xa(8390656,8,t,e)}function qf(t,e){return Fl(2048,8,t,e)}function Gg(t,e){return Fl(4,2,t,e)}function Vg(t,e){return Fl(4,4,t,e)}function Wg(t,e){if(typeof e=="function")return t=t(),e(t),function(){e(null)};if(e!=null)return t=t(),e.current=t,function(){e.current=null}}function Xg(t,e,n){return n=n!=null?n.concat([t]):null,Fl(4,4,Wg.bind(null,e,t),n)}function $f(){}function jg(t,e){var n=bn();e=e===void 0?null:e;var i=n.memoizedState;return i!==null&&e!==null&&Xf(e,i[1])?i[0]:(n.memoizedState=[t,e],t)}function Yg(t,e){var n=bn();e=e===void 0?null:e;var i=n.memoizedState;return i!==null&&e!==null&&Xf(e,i[1])?i[0]:(t=t(),n.memoizedState=[t,e],t)}function qg(t,e,n){return yr&21?(Gn(n,e)||(n=Jm(),ut.lanes|=n,Sr|=n,t.baseState=!0),e):(t.baseState&&(t.baseState=!1,nn=!0),t.memoizedState=n)}function mx(t,e){var n=Ze;Ze=n!==0&&4>n?n:4,t(!0);var i=xu.transition;xu.transition={};try{t(!1),e()}finally{Ze=n,xu.transition=i}}function $g(){return bn().memoizedState}function gx(t,e,n){var i=Hi(t);if(n={lane:i,action:n,hasEagerState:!1,eagerState:null,next:null},Kg(t))Zg(e,n);else if(n=Lg(t,e,n,i),n!==null){var r=Qt();Bn(n,t,i,r),Qg(n,e,i)}}function _x(t,e,n){var i=Hi(t),r={lane:i,action:n,hasEagerState:!1,eagerState:null,next:null};if(Kg(t))Zg(e,r);else{var s=t.alternate;if(t.lanes===0&&(s===null||s.lanes===0)&&(s=e.lastRenderedReducer,s!==null))try{var o=e.lastRenderedState,a=s(o,n);if(r.hasEagerState=!0,r.eagerState=a,Gn(a,o)){var l=e.interleaved;l===null?(r.next=r,Bf(e)):(r.next=l.next,l.next=r),e.interleaved=r;return}}catch{}finally{}n=Lg(t,e,r,i),n!==null&&(r=Qt(),Bn(n,t,i,r),Qg(n,e,i))}}function Kg(t){var e=t.alternate;return t===ut||e!==null&&e===ut}function Zg(t,e){mo=ml=!0;var n=t.pending;n===null?e.next=e:(e.next=n.next,n.next=e),t.pending=e}function Qg(t,e,n){if(n&4194240){var i=e.lanes;i&=t.pendingLanes,n|=i,e.lanes=n,Af(t,n)}}var gl={readContext:Cn,useCallback:kt,useContext:kt,useEffect:kt,useImperativeHandle:kt,useInsertionEffect:kt,useLayoutEffect:kt,useMemo:kt,useReducer:kt,useRef:kt,useState:kt,useDebugValue:kt,useDeferredValue:kt,useTransition:kt,useMutableSource:kt,useSyncExternalStore:kt,useId:kt,unstable_isNewReconciler:!1},vx={readContext:Cn,useCallback:function(t,e){return Xn().memoizedState=[t,e===void 0?null:e],t},useContext:Cn,useEffect:dh,useImperativeHandle:function(t,e,n){return n=n!=null?n.concat([t]):null,Xa(4194308,4,Wg.bind(null,e,t),n)},useLayoutEffect:function(t,e){return Xa(4194308,4,t,e)},useInsertionEffect:function(t,e){return Xa(4,2,t,e)},useMemo:function(t,e){var n=Xn();return e=e===void 0?null:e,t=t(),n.memoizedState=[t,e],t},useReducer:function(t,e,n){var i=Xn();return e=n!==void 0?n(e):e,i.memoizedState=i.baseState=e,t={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:t,lastRenderedState:e},i.queue=t,t=t.dispatch=gx.bind(null,ut,t),[i.memoizedState,t]},useRef:function(t){var e=Xn();return t={current:t},e.memoizedState=t},useState:fh,useDebugValue:$f,useDeferredValue:function(t){return Xn().memoizedState=t},useTransition:function(){var t=fh(!1),e=t[0];return t=mx.bind(null,t[1]),Xn().memoizedState=t,[e,t]},useMutableSource:function(){},useSyncExternalStore:function(t,e,n){var i=ut,r=Xn();if(ot){if(n===void 0)throw Error(ie(407));n=n()}else{if(n=e(),Dt===null)throw Error(ie(349));yr&30||Fg(i,e,n)}r.memoizedState=n;var s={value:n,getSnapshot:e};return r.queue=s,dh(zg.bind(null,i,s,t),[t]),i.flags|=2048,Io(9,Og.bind(null,i,s,n,e),void 0,null),n},useId:function(){var t=Xn(),e=Dt.identifierPrefix;if(ot){var n=ui,i=li;n=(i&~(1<<32-kn(i)-1)).toString(32)+n,e=":"+e+"R"+n,n=Uo++,0<n&&(e+="H"+n.toString(32)),e+=":"}else n=px++,e=":"+e+"r"+n.toString(32)+":";return t.memoizedState=e},unstable_isNewReconciler:!1},xx={readContext:Cn,useCallback:jg,useContext:Cn,useEffect:qf,useImperativeHandle:Xg,useInsertionEffect:Gg,useLayoutEffect:Vg,useMemo:Yg,useReducer:yu,useRef:Hg,useState:function(){return yu(No)},useDebugValue:$f,useDeferredValue:function(t){var e=bn();return qg(e,yt.memoizedState,t)},useTransition:function(){var t=yu(No)[0],e=bn().memoizedState;return[t,e]},useMutableSource:Ng,useSyncExternalStore:Ig,useId:$g,unstable_isNewReconciler:!1},yx={readContext:Cn,useCallback:jg,useContext:Cn,useEffect:qf,useImperativeHandle:Xg,useInsertionEffect:Gg,useLayoutEffect:Vg,useMemo:Yg,useReducer:Su,useRef:Hg,useState:function(){return Su(No)},useDebugValue:$f,useDeferredValue:function(t){var e=bn();return yt===null?e.memoizedState=t:qg(e,yt.memoizedState,t)},useTransition:function(){var t=Su(No)[0],e=bn().memoizedState;return[t,e]},useMutableSource:Ng,useSyncExternalStore:Ig,useId:$g,unstable_isNewReconciler:!1};function Nn(t,e){if(t&&t.defaultProps){e=ct({},e),t=t.defaultProps;for(var n in t)e[n]===void 0&&(e[n]=t[n]);return e}return e}function zc(t,e,n,i){e=t.memoizedState,n=n(i,e),n=n==null?e:ct({},e,n),t.memoizedState=n,t.lanes===0&&(t.updateQueue.baseState=n)}var Ol={isMounted:function(t){return(t=t._reactInternals)?Rr(t)===t:!1},enqueueSetState:function(t,e,n){t=t._reactInternals;var i=Qt(),r=Hi(t),s=fi(i,r);s.payload=e,n!=null&&(s.callback=n),e=ki(t,s,r),e!==null&&(Bn(e,t,r,i),Va(e,t,r))},enqueueReplaceState:function(t,e,n){t=t._reactInternals;var i=Qt(),r=Hi(t),s=fi(i,r);s.tag=1,s.payload=e,n!=null&&(s.callback=n),e=ki(t,s,r),e!==null&&(Bn(e,t,r,i),Va(e,t,r))},enqueueForceUpdate:function(t,e){t=t._reactInternals;var n=Qt(),i=Hi(t),r=fi(n,i);r.tag=2,e!=null&&(r.callback=e),e=ki(t,r,i),e!==null&&(Bn(e,t,i,n),Va(e,t,i))}};function hh(t,e,n,i,r,s,o){return t=t.stateNode,typeof t.shouldComponentUpdate=="function"?t.shouldComponentUpdate(i,s,o):e.prototype&&e.prototype.isPureReactComponent?!Ro(n,i)||!Ro(r,s):!0}function Jg(t,e,n){var i=!1,r=$i,s=e.contextType;return typeof s=="object"&&s!==null?s=Cn(s):(r=sn(e)?vr:Wt.current,i=e.contextTypes,s=(i=i!=null)?Ms(t,r):$i),e=new e(n,s),t.memoizedState=e.state!==null&&e.state!==void 0?e.state:null,e.updater=Ol,t.stateNode=e,e._reactInternals=t,i&&(t=t.stateNode,t.__reactInternalMemoizedUnmaskedChildContext=r,t.__reactInternalMemoizedMaskedChildContext=s),e}function ph(t,e,n,i){t=e.state,typeof e.componentWillReceiveProps=="function"&&e.componentWillReceiveProps(n,i),typeof e.UNSAFE_componentWillReceiveProps=="function"&&e.UNSAFE_componentWillReceiveProps(n,i),e.state!==t&&Ol.enqueueReplaceState(e,e.state,null)}function kc(t,e,n,i){var r=t.stateNode;r.props=n,r.state=t.memoizedState,r.refs={},Hf(t);var s=e.contextType;typeof s=="object"&&s!==null?r.context=Cn(s):(s=sn(e)?vr:Wt.current,r.context=Ms(t,s)),r.state=t.memoizedState,s=e.getDerivedStateFromProps,typeof s=="function"&&(zc(t,e,s,n),r.state=t.memoizedState),typeof e.getDerivedStateFromProps=="function"||typeof r.getSnapshotBeforeUpdate=="function"||typeof r.UNSAFE_componentWillMount!="function"&&typeof r.componentWillMount!="function"||(e=r.state,typeof r.componentWillMount=="function"&&r.componentWillMount(),typeof r.UNSAFE_componentWillMount=="function"&&r.UNSAFE_componentWillMount(),e!==r.state&&Ol.enqueueReplaceState(r,r.state,null),hl(t,n,r,i),r.state=t.memoizedState),typeof r.componentDidMount=="function"&&(t.flags|=4194308)}function As(t,e){try{var n="",i=e;do n+=qv(i),i=i.return;while(i);var r=n}catch(s){r=`
Error generating stack: `+s.message+`
`+s.stack}return{value:t,source:e,stack:r,digest:null}}function Mu(t,e,n){return{value:t,source:null,stack:n??null,digest:e??null}}function Bc(t,e){try{console.error(e.value)}catch(n){setTimeout(function(){throw n})}}var Sx=typeof WeakMap=="function"?WeakMap:Map;function e_(t,e,n){n=fi(-1,n),n.tag=3,n.payload={element:null};var i=e.value;return n.callback=function(){vl||(vl=!0,Kc=i),Bc(t,e)},n}function t_(t,e,n){n=fi(-1,n),n.tag=3;var i=t.type.getDerivedStateFromError;if(typeof i=="function"){var r=e.value;n.payload=function(){return i(r)},n.callback=function(){Bc(t,e)}}var s=t.stateNode;return s!==null&&typeof s.componentDidCatch=="function"&&(n.callback=function(){Bc(t,e),typeof i!="function"&&(Bi===null?Bi=new Set([this]):Bi.add(this));var o=e.stack;this.componentDidCatch(e.value,{componentStack:o!==null?o:""})}),n}function mh(t,e,n){var i=t.pingCache;if(i===null){i=t.pingCache=new Sx;var r=new Set;i.set(e,r)}else r=i.get(e),r===void 0&&(r=new Set,i.set(e,r));r.has(n)||(r.add(n),t=Ix.bind(null,t,e,n),e.then(t,t))}function gh(t){do{var e;if((e=t.tag===13)&&(e=t.memoizedState,e=e!==null?e.dehydrated!==null:!0),e)return t;t=t.return}while(t!==null);return null}function _h(t,e,n,i,r){return t.mode&1?(t.flags|=65536,t.lanes=r,t):(t===e?t.flags|=65536:(t.flags|=128,n.flags|=131072,n.flags&=-52805,n.tag===1&&(n.alternate===null?n.tag=17:(e=fi(-1,1),e.tag=2,ki(n,e,1))),n.lanes|=1),t)}var Mx=_i.ReactCurrentOwner,nn=!1;function $t(t,e,n,i){e.child=t===null?Pg(e,null,n,i):Ts(e,t.child,n,i)}function vh(t,e,n,i,r){n=n.render;var s=e.ref;return _s(e,r),i=jf(t,e,n,i,s,r),n=Yf(),t!==null&&!nn?(e.updateQueue=t.updateQueue,e.flags&=-2053,t.lanes&=~r,mi(t,e,r)):(ot&&n&&Nf(e),e.flags|=1,$t(t,e,i,r),e.child)}function xh(t,e,n,i,r){if(t===null){var s=n.type;return typeof s=="function"&&!id(s)&&s.defaultProps===void 0&&n.compare===null&&n.defaultProps===void 0?(e.tag=15,e.type=s,n_(t,e,s,i,r)):(t=$a(n.type,null,i,e,e.mode,r),t.ref=e.ref,t.return=e,e.child=t)}if(s=t.child,!(t.lanes&r)){var o=s.memoizedProps;if(n=n.compare,n=n!==null?n:Ro,n(o,i)&&t.ref===e.ref)return mi(t,e,r)}return e.flags|=1,t=Gi(s,i),t.ref=e.ref,t.return=e,e.child=t}function n_(t,e,n,i,r){if(t!==null){var s=t.memoizedProps;if(Ro(s,i)&&t.ref===e.ref)if(nn=!1,e.pendingProps=i=s,(t.lanes&r)!==0)t.flags&131072&&(nn=!0);else return e.lanes=t.lanes,mi(t,e,r)}return Hc(t,e,n,i,r)}function i_(t,e,n){var i=e.pendingProps,r=i.children,s=t!==null?t.memoizedState:null;if(i.mode==="hidden")if(!(e.mode&1))e.memoizedState={baseLanes:0,cachePool:null,transitions:null},tt(fs,dn),dn|=n;else{if(!(n&1073741824))return t=s!==null?s.baseLanes|n:n,e.lanes=e.childLanes=1073741824,e.memoizedState={baseLanes:t,cachePool:null,transitions:null},e.updateQueue=null,tt(fs,dn),dn|=t,null;e.memoizedState={baseLanes:0,cachePool:null,transitions:null},i=s!==null?s.baseLanes:n,tt(fs,dn),dn|=i}else s!==null?(i=s.baseLanes|n,e.memoizedState=null):i=n,tt(fs,dn),dn|=i;return $t(t,e,r,n),e.child}function r_(t,e){var n=e.ref;(t===null&&n!==null||t!==null&&t.ref!==n)&&(e.flags|=512,e.flags|=2097152)}function Hc(t,e,n,i,r){var s=sn(n)?vr:Wt.current;return s=Ms(e,s),_s(e,r),n=jf(t,e,n,i,s,r),i=Yf(),t!==null&&!nn?(e.updateQueue=t.updateQueue,e.flags&=-2053,t.lanes&=~r,mi(t,e,r)):(ot&&i&&Nf(e),e.flags|=1,$t(t,e,n,r),e.child)}function yh(t,e,n,i,r){if(sn(n)){var s=!0;ll(e)}else s=!1;if(_s(e,r),e.stateNode===null)ja(t,e),Jg(e,n,i),kc(e,n,i,r),i=!0;else if(t===null){var o=e.stateNode,a=e.memoizedProps;o.props=a;var l=o.context,u=n.contextType;typeof u=="object"&&u!==null?u=Cn(u):(u=sn(n)?vr:Wt.current,u=Ms(e,u));var f=n.getDerivedStateFromProps,h=typeof f=="function"||typeof o.getSnapshotBeforeUpdate=="function";h||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(a!==i||l!==u)&&ph(e,o,i,u),Ri=!1;var d=e.memoizedState;o.state=d,hl(e,i,o,r),l=e.memoizedState,a!==i||d!==l||rn.current||Ri?(typeof f=="function"&&(zc(e,n,f,i),l=e.memoizedState),(a=Ri||hh(e,n,a,i,d,l,u))?(h||typeof o.UNSAFE_componentWillMount!="function"&&typeof o.componentWillMount!="function"||(typeof o.componentWillMount=="function"&&o.componentWillMount(),typeof o.UNSAFE_componentWillMount=="function"&&o.UNSAFE_componentWillMount()),typeof o.componentDidMount=="function"&&(e.flags|=4194308)):(typeof o.componentDidMount=="function"&&(e.flags|=4194308),e.memoizedProps=i,e.memoizedState=l),o.props=i,o.state=l,o.context=u,i=a):(typeof o.componentDidMount=="function"&&(e.flags|=4194308),i=!1)}else{o=e.stateNode,Dg(t,e),a=e.memoizedProps,u=e.type===e.elementType?a:Nn(e.type,a),o.props=u,h=e.pendingProps,d=o.context,l=n.contextType,typeof l=="object"&&l!==null?l=Cn(l):(l=sn(n)?vr:Wt.current,l=Ms(e,l));var m=n.getDerivedStateFromProps;(f=typeof m=="function"||typeof o.getSnapshotBeforeUpdate=="function")||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(a!==h||d!==l)&&ph(e,o,i,l),Ri=!1,d=e.memoizedState,o.state=d,hl(e,i,o,r);var x=e.memoizedState;a!==h||d!==x||rn.current||Ri?(typeof m=="function"&&(zc(e,n,m,i),x=e.memoizedState),(u=Ri||hh(e,n,u,i,d,x,l)||!1)?(f||typeof o.UNSAFE_componentWillUpdate!="function"&&typeof o.componentWillUpdate!="function"||(typeof o.componentWillUpdate=="function"&&o.componentWillUpdate(i,x,l),typeof o.UNSAFE_componentWillUpdate=="function"&&o.UNSAFE_componentWillUpdate(i,x,l)),typeof o.componentDidUpdate=="function"&&(e.flags|=4),typeof o.getSnapshotBeforeUpdate=="function"&&(e.flags|=1024)):(typeof o.componentDidUpdate!="function"||a===t.memoizedProps&&d===t.memoizedState||(e.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||a===t.memoizedProps&&d===t.memoizedState||(e.flags|=1024),e.memoizedProps=i,e.memoizedState=x),o.props=i,o.state=x,o.context=l,i=u):(typeof o.componentDidUpdate!="function"||a===t.memoizedProps&&d===t.memoizedState||(e.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||a===t.memoizedProps&&d===t.memoizedState||(e.flags|=1024),i=!1)}return Gc(t,e,n,i,s,r)}function Gc(t,e,n,i,r,s){r_(t,e);var o=(e.flags&128)!==0;if(!i&&!o)return r&&sh(e,n,!1),mi(t,e,s);i=e.stateNode,Mx.current=e;var a=o&&typeof n.getDerivedStateFromError!="function"?null:i.render();return e.flags|=1,t!==null&&o?(e.child=Ts(e,t.child,null,s),e.child=Ts(e,null,a,s)):$t(t,e,a,s),e.memoizedState=i.state,r&&sh(e,n,!0),e.child}function s_(t){var e=t.stateNode;e.pendingContext?rh(t,e.pendingContext,e.pendingContext!==e.context):e.context&&rh(t,e.context,!1),Gf(t,e.containerInfo)}function Sh(t,e,n,i,r){return Es(),Ff(r),e.flags|=256,$t(t,e,n,i),e.child}var Vc={dehydrated:null,treeContext:null,retryLane:0};function Wc(t){return{baseLanes:t,cachePool:null,transitions:null}}function o_(t,e,n){var i=e.pendingProps,r=lt.current,s=!1,o=(e.flags&128)!==0,a;if((a=o)||(a=t!==null&&t.memoizedState===null?!1:(r&2)!==0),a?(s=!0,e.flags&=-129):(t===null||t.memoizedState!==null)&&(r|=1),tt(lt,r&1),t===null)return Fc(e),t=e.memoizedState,t!==null&&(t=t.dehydrated,t!==null)?(e.mode&1?t.data==="$!"?e.lanes=8:e.lanes=1073741824:e.lanes=1,null):(o=i.children,t=i.fallback,s?(i=e.mode,s=e.child,o={mode:"hidden",children:o},!(i&1)&&s!==null?(s.childLanes=0,s.pendingProps=o):s=Bl(o,i,0,null),t=mr(t,i,n,null),s.return=e,t.return=e,s.sibling=t,e.child=s,e.child.memoizedState=Wc(n),e.memoizedState=Vc,t):Kf(e,o));if(r=t.memoizedState,r!==null&&(a=r.dehydrated,a!==null))return Ex(t,e,o,i,a,r,n);if(s){s=i.fallback,o=e.mode,r=t.child,a=r.sibling;var l={mode:"hidden",children:i.children};return!(o&1)&&e.child!==r?(i=e.child,i.childLanes=0,i.pendingProps=l,e.deletions=null):(i=Gi(r,l),i.subtreeFlags=r.subtreeFlags&14680064),a!==null?s=Gi(a,s):(s=mr(s,o,n,null),s.flags|=2),s.return=e,i.return=e,i.sibling=s,e.child=i,i=s,s=e.child,o=t.child.memoizedState,o=o===null?Wc(n):{baseLanes:o.baseLanes|n,cachePool:null,transitions:o.transitions},s.memoizedState=o,s.childLanes=t.childLanes&~n,e.memoizedState=Vc,i}return s=t.child,t=s.sibling,i=Gi(s,{mode:"visible",children:i.children}),!(e.mode&1)&&(i.lanes=n),i.return=e,i.sibling=null,t!==null&&(n=e.deletions,n===null?(e.deletions=[t],e.flags|=16):n.push(t)),e.child=i,e.memoizedState=null,i}function Kf(t,e){return e=Bl({mode:"visible",children:e},t.mode,0,null),e.return=t,t.child=e}function aa(t,e,n,i){return i!==null&&Ff(i),Ts(e,t.child,null,n),t=Kf(e,e.pendingProps.children),t.flags|=2,e.memoizedState=null,t}function Ex(t,e,n,i,r,s,o){if(n)return e.flags&256?(e.flags&=-257,i=Mu(Error(ie(422))),aa(t,e,o,i)):e.memoizedState!==null?(e.child=t.child,e.flags|=128,null):(s=i.fallback,r=e.mode,i=Bl({mode:"visible",children:i.children},r,0,null),s=mr(s,r,o,null),s.flags|=2,i.return=e,s.return=e,i.sibling=s,e.child=i,e.mode&1&&Ts(e,t.child,null,o),e.child.memoizedState=Wc(o),e.memoizedState=Vc,s);if(!(e.mode&1))return aa(t,e,o,null);if(r.data==="$!"){if(i=r.nextSibling&&r.nextSibling.dataset,i)var a=i.dgst;return i=a,s=Error(ie(419)),i=Mu(s,i,void 0),aa(t,e,o,i)}if(a=(o&t.childLanes)!==0,nn||a){if(i=Dt,i!==null){switch(o&-o){case 4:r=2;break;case 16:r=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:r=32;break;case 536870912:r=268435456;break;default:r=0}r=r&(i.suspendedLanes|o)?0:r,r!==0&&r!==s.retryLane&&(s.retryLane=r,pi(t,r),Bn(i,t,r,-1))}return nd(),i=Mu(Error(ie(421))),aa(t,e,o,i)}return r.data==="$?"?(e.flags|=128,e.child=t.child,e=Fx.bind(null,t),r._reactRetry=e,null):(t=s.treeContext,hn=zi(r.nextSibling),pn=e,ot=!0,Fn=null,t!==null&&(yn[Sn++]=li,yn[Sn++]=ui,yn[Sn++]=xr,li=t.id,ui=t.overflow,xr=e),e=Kf(e,i.children),e.flags|=4096,e)}function Mh(t,e,n){t.lanes|=e;var i=t.alternate;i!==null&&(i.lanes|=e),Oc(t.return,e,n)}function Eu(t,e,n,i,r){var s=t.memoizedState;s===null?t.memoizedState={isBackwards:e,rendering:null,renderingStartTime:0,last:i,tail:n,tailMode:r}:(s.isBackwards=e,s.rendering=null,s.renderingStartTime=0,s.last=i,s.tail=n,s.tailMode=r)}function a_(t,e,n){var i=e.pendingProps,r=i.revealOrder,s=i.tail;if($t(t,e,i.children,n),i=lt.current,i&2)i=i&1|2,e.flags|=128;else{if(t!==null&&t.flags&128)e:for(t=e.child;t!==null;){if(t.tag===13)t.memoizedState!==null&&Mh(t,n,e);else if(t.tag===19)Mh(t,n,e);else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break e;for(;t.sibling===null;){if(t.return===null||t.return===e)break e;t=t.return}t.sibling.return=t.return,t=t.sibling}i&=1}if(tt(lt,i),!(e.mode&1))e.memoizedState=null;else switch(r){case"forwards":for(n=e.child,r=null;n!==null;)t=n.alternate,t!==null&&pl(t)===null&&(r=n),n=n.sibling;n=r,n===null?(r=e.child,e.child=null):(r=n.sibling,n.sibling=null),Eu(e,!1,r,n,s);break;case"backwards":for(n=null,r=e.child,e.child=null;r!==null;){if(t=r.alternate,t!==null&&pl(t)===null){e.child=r;break}t=r.sibling,r.sibling=n,n=r,r=t}Eu(e,!0,n,null,s);break;case"together":Eu(e,!1,null,null,void 0);break;default:e.memoizedState=null}return e.child}function ja(t,e){!(e.mode&1)&&t!==null&&(t.alternate=null,e.alternate=null,e.flags|=2)}function mi(t,e,n){if(t!==null&&(e.dependencies=t.dependencies),Sr|=e.lanes,!(n&e.childLanes))return null;if(t!==null&&e.child!==t.child)throw Error(ie(153));if(e.child!==null){for(t=e.child,n=Gi(t,t.pendingProps),e.child=n,n.return=e;t.sibling!==null;)t=t.sibling,n=n.sibling=Gi(t,t.pendingProps),n.return=e;n.sibling=null}return e.child}function Tx(t,e,n){switch(e.tag){case 3:s_(e),Es();break;case 5:Ug(e);break;case 1:sn(e.type)&&ll(e);break;case 4:Gf(e,e.stateNode.containerInfo);break;case 10:var i=e.type._context,r=e.memoizedProps.value;tt(fl,i._currentValue),i._currentValue=r;break;case 13:if(i=e.memoizedState,i!==null)return i.dehydrated!==null?(tt(lt,lt.current&1),e.flags|=128,null):n&e.child.childLanes?o_(t,e,n):(tt(lt,lt.current&1),t=mi(t,e,n),t!==null?t.sibling:null);tt(lt,lt.current&1);break;case 19:if(i=(n&e.childLanes)!==0,t.flags&128){if(i)return a_(t,e,n);e.flags|=128}if(r=e.memoizedState,r!==null&&(r.rendering=null,r.tail=null,r.lastEffect=null),tt(lt,lt.current),i)break;return null;case 22:case 23:return e.lanes=0,i_(t,e,n)}return mi(t,e,n)}var l_,Xc,u_,c_;l_=function(t,e){for(var n=e.child;n!==null;){if(n.tag===5||n.tag===6)t.appendChild(n.stateNode);else if(n.tag!==4&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===e)break;for(;n.sibling===null;){if(n.return===null||n.return===e)return;n=n.return}n.sibling.return=n.return,n=n.sibling}};Xc=function(){};u_=function(t,e,n,i){var r=t.memoizedProps;if(r!==i){t=e.stateNode,hr(Kn.current);var s=null;switch(n){case"input":r=hc(t,r),i=hc(t,i),s=[];break;case"select":r=ct({},r,{value:void 0}),i=ct({},i,{value:void 0}),s=[];break;case"textarea":r=gc(t,r),i=gc(t,i),s=[];break;default:typeof r.onClick!="function"&&typeof i.onClick=="function"&&(t.onclick=ol)}vc(n,i);var o;n=null;for(u in r)if(!i.hasOwnProperty(u)&&r.hasOwnProperty(u)&&r[u]!=null)if(u==="style"){var a=r[u];for(o in a)a.hasOwnProperty(o)&&(n||(n={}),n[o]="")}else u!=="dangerouslySetInnerHTML"&&u!=="children"&&u!=="suppressContentEditableWarning"&&u!=="suppressHydrationWarning"&&u!=="autoFocus"&&(yo.hasOwnProperty(u)?s||(s=[]):(s=s||[]).push(u,null));for(u in i){var l=i[u];if(a=r!=null?r[u]:void 0,i.hasOwnProperty(u)&&l!==a&&(l!=null||a!=null))if(u==="style")if(a){for(o in a)!a.hasOwnProperty(o)||l&&l.hasOwnProperty(o)||(n||(n={}),n[o]="");for(o in l)l.hasOwnProperty(o)&&a[o]!==l[o]&&(n||(n={}),n[o]=l[o])}else n||(s||(s=[]),s.push(u,n)),n=l;else u==="dangerouslySetInnerHTML"?(l=l?l.__html:void 0,a=a?a.__html:void 0,l!=null&&a!==l&&(s=s||[]).push(u,l)):u==="children"?typeof l!="string"&&typeof l!="number"||(s=s||[]).push(u,""+l):u!=="suppressContentEditableWarning"&&u!=="suppressHydrationWarning"&&(yo.hasOwnProperty(u)?(l!=null&&u==="onScroll"&&it("scroll",t),s||a===l||(s=[])):(s=s||[]).push(u,l))}n&&(s=s||[]).push("style",n);var u=s;(e.updateQueue=u)&&(e.flags|=4)}};c_=function(t,e,n,i){n!==i&&(e.flags|=4)};function js(t,e){if(!ot)switch(t.tailMode){case"hidden":e=t.tail;for(var n=null;e!==null;)e.alternate!==null&&(n=e),e=e.sibling;n===null?t.tail=null:n.sibling=null;break;case"collapsed":n=t.tail;for(var i=null;n!==null;)n.alternate!==null&&(i=n),n=n.sibling;i===null?e||t.tail===null?t.tail=null:t.tail.sibling=null:i.sibling=null}}function Bt(t){var e=t.alternate!==null&&t.alternate.child===t.child,n=0,i=0;if(e)for(var r=t.child;r!==null;)n|=r.lanes|r.childLanes,i|=r.subtreeFlags&14680064,i|=r.flags&14680064,r.return=t,r=r.sibling;else for(r=t.child;r!==null;)n|=r.lanes|r.childLanes,i|=r.subtreeFlags,i|=r.flags,r.return=t,r=r.sibling;return t.subtreeFlags|=i,t.childLanes=n,e}function wx(t,e,n){var i=e.pendingProps;switch(If(e),e.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Bt(e),null;case 1:return sn(e.type)&&al(),Bt(e),null;case 3:return i=e.stateNode,ws(),st(rn),st(Wt),Wf(),i.pendingContext&&(i.context=i.pendingContext,i.pendingContext=null),(t===null||t.child===null)&&(sa(e)?e.flags|=4:t===null||t.memoizedState.isDehydrated&&!(e.flags&256)||(e.flags|=1024,Fn!==null&&(Jc(Fn),Fn=null))),Xc(t,e),Bt(e),null;case 5:Vf(e);var r=hr(Do.current);if(n=e.type,t!==null&&e.stateNode!=null)u_(t,e,n,i,r),t.ref!==e.ref&&(e.flags|=512,e.flags|=2097152);else{if(!i){if(e.stateNode===null)throw Error(ie(166));return Bt(e),null}if(t=hr(Kn.current),sa(e)){i=e.stateNode,n=e.type;var s=e.memoizedProps;switch(i[Yn]=e,i[Po]=s,t=(e.mode&1)!==0,n){case"dialog":it("cancel",i),it("close",i);break;case"iframe":case"object":case"embed":it("load",i);break;case"video":case"audio":for(r=0;r<oo.length;r++)it(oo[r],i);break;case"source":it("error",i);break;case"img":case"image":case"link":it("error",i),it("load",i);break;case"details":it("toggle",i);break;case"input":Ld(i,s),it("invalid",i);break;case"select":i._wrapperState={wasMultiple:!!s.multiple},it("invalid",i);break;case"textarea":Ud(i,s),it("invalid",i)}vc(n,s),r=null;for(var o in s)if(s.hasOwnProperty(o)){var a=s[o];o==="children"?typeof a=="string"?i.textContent!==a&&(s.suppressHydrationWarning!==!0&&ra(i.textContent,a,t),r=["children",a]):typeof a=="number"&&i.textContent!==""+a&&(s.suppressHydrationWarning!==!0&&ra(i.textContent,a,t),r=["children",""+a]):yo.hasOwnProperty(o)&&a!=null&&o==="onScroll"&&it("scroll",i)}switch(n){case"input":Ko(i),Dd(i,s,!0);break;case"textarea":Ko(i),Nd(i);break;case"select":case"option":break;default:typeof s.onClick=="function"&&(i.onclick=ol)}i=r,e.updateQueue=i,i!==null&&(e.flags|=4)}else{o=r.nodeType===9?r:r.ownerDocument,t==="http://www.w3.org/1999/xhtml"&&(t=zm(n)),t==="http://www.w3.org/1999/xhtml"?n==="script"?(t=o.createElement("div"),t.innerHTML="<script><\/script>",t=t.removeChild(t.firstChild)):typeof i.is=="string"?t=o.createElement(n,{is:i.is}):(t=o.createElement(n),n==="select"&&(o=t,i.multiple?o.multiple=!0:i.size&&(o.size=i.size))):t=o.createElementNS(t,n),t[Yn]=e,t[Po]=i,l_(t,e,!1,!1),e.stateNode=t;e:{switch(o=xc(n,i),n){case"dialog":it("cancel",t),it("close",t),r=i;break;case"iframe":case"object":case"embed":it("load",t),r=i;break;case"video":case"audio":for(r=0;r<oo.length;r++)it(oo[r],t);r=i;break;case"source":it("error",t),r=i;break;case"img":case"image":case"link":it("error",t),it("load",t),r=i;break;case"details":it("toggle",t),r=i;break;case"input":Ld(t,i),r=hc(t,i),it("invalid",t);break;case"option":r=i;break;case"select":t._wrapperState={wasMultiple:!!i.multiple},r=ct({},i,{value:void 0}),it("invalid",t);break;case"textarea":Ud(t,i),r=gc(t,i),it("invalid",t);break;default:r=i}vc(n,r),a=r;for(s in a)if(a.hasOwnProperty(s)){var l=a[s];s==="style"?Hm(t,l):s==="dangerouslySetInnerHTML"?(l=l?l.__html:void 0,l!=null&&km(t,l)):s==="children"?typeof l=="string"?(n!=="textarea"||l!=="")&&So(t,l):typeof l=="number"&&So(t,""+l):s!=="suppressContentEditableWarning"&&s!=="suppressHydrationWarning"&&s!=="autoFocus"&&(yo.hasOwnProperty(s)?l!=null&&s==="onScroll"&&it("scroll",t):l!=null&&yf(t,s,l,o))}switch(n){case"input":Ko(t),Dd(t,i,!1);break;case"textarea":Ko(t),Nd(t);break;case"option":i.value!=null&&t.setAttribute("value",""+qi(i.value));break;case"select":t.multiple=!!i.multiple,s=i.value,s!=null?hs(t,!!i.multiple,s,!1):i.defaultValue!=null&&hs(t,!!i.multiple,i.defaultValue,!0);break;default:typeof r.onClick=="function"&&(t.onclick=ol)}switch(n){case"button":case"input":case"select":case"textarea":i=!!i.autoFocus;break e;case"img":i=!0;break e;default:i=!1}}i&&(e.flags|=4)}e.ref!==null&&(e.flags|=512,e.flags|=2097152)}return Bt(e),null;case 6:if(t&&e.stateNode!=null)c_(t,e,t.memoizedProps,i);else{if(typeof i!="string"&&e.stateNode===null)throw Error(ie(166));if(n=hr(Do.current),hr(Kn.current),sa(e)){if(i=e.stateNode,n=e.memoizedProps,i[Yn]=e,(s=i.nodeValue!==n)&&(t=pn,t!==null))switch(t.tag){case 3:ra(i.nodeValue,n,(t.mode&1)!==0);break;case 5:t.memoizedProps.suppressHydrationWarning!==!0&&ra(i.nodeValue,n,(t.mode&1)!==0)}s&&(e.flags|=4)}else i=(n.nodeType===9?n:n.ownerDocument).createTextNode(i),i[Yn]=e,e.stateNode=i}return Bt(e),null;case 13:if(st(lt),i=e.memoizedState,t===null||t.memoizedState!==null&&t.memoizedState.dehydrated!==null){if(ot&&hn!==null&&e.mode&1&&!(e.flags&128))Cg(),Es(),e.flags|=98560,s=!1;else if(s=sa(e),i!==null&&i.dehydrated!==null){if(t===null){if(!s)throw Error(ie(318));if(s=e.memoizedState,s=s!==null?s.dehydrated:null,!s)throw Error(ie(317));s[Yn]=e}else Es(),!(e.flags&128)&&(e.memoizedState=null),e.flags|=4;Bt(e),s=!1}else Fn!==null&&(Jc(Fn),Fn=null),s=!0;if(!s)return e.flags&65536?e:null}return e.flags&128?(e.lanes=n,e):(i=i!==null,i!==(t!==null&&t.memoizedState!==null)&&i&&(e.child.flags|=8192,e.mode&1&&(t===null||lt.current&1?St===0&&(St=3):nd())),e.updateQueue!==null&&(e.flags|=4),Bt(e),null);case 4:return ws(),Xc(t,e),t===null&&Co(e.stateNode.containerInfo),Bt(e),null;case 10:return kf(e.type._context),Bt(e),null;case 17:return sn(e.type)&&al(),Bt(e),null;case 19:if(st(lt),s=e.memoizedState,s===null)return Bt(e),null;if(i=(e.flags&128)!==0,o=s.rendering,o===null)if(i)js(s,!1);else{if(St!==0||t!==null&&t.flags&128)for(t=e.child;t!==null;){if(o=pl(t),o!==null){for(e.flags|=128,js(s,!1),i=o.updateQueue,i!==null&&(e.updateQueue=i,e.flags|=4),e.subtreeFlags=0,i=n,n=e.child;n!==null;)s=n,t=i,s.flags&=14680066,o=s.alternate,o===null?(s.childLanes=0,s.lanes=t,s.child=null,s.subtreeFlags=0,s.memoizedProps=null,s.memoizedState=null,s.updateQueue=null,s.dependencies=null,s.stateNode=null):(s.childLanes=o.childLanes,s.lanes=o.lanes,s.child=o.child,s.subtreeFlags=0,s.deletions=null,s.memoizedProps=o.memoizedProps,s.memoizedState=o.memoizedState,s.updateQueue=o.updateQueue,s.type=o.type,t=o.dependencies,s.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),n=n.sibling;return tt(lt,lt.current&1|2),e.child}t=t.sibling}s.tail!==null&&pt()>Rs&&(e.flags|=128,i=!0,js(s,!1),e.lanes=4194304)}else{if(!i)if(t=pl(o),t!==null){if(e.flags|=128,i=!0,n=t.updateQueue,n!==null&&(e.updateQueue=n,e.flags|=4),js(s,!0),s.tail===null&&s.tailMode==="hidden"&&!o.alternate&&!ot)return Bt(e),null}else 2*pt()-s.renderingStartTime>Rs&&n!==1073741824&&(e.flags|=128,i=!0,js(s,!1),e.lanes=4194304);s.isBackwards?(o.sibling=e.child,e.child=o):(n=s.last,n!==null?n.sibling=o:e.child=o,s.last=o)}return s.tail!==null?(e=s.tail,s.rendering=e,s.tail=e.sibling,s.renderingStartTime=pt(),e.sibling=null,n=lt.current,tt(lt,i?n&1|2:n&1),e):(Bt(e),null);case 22:case 23:return td(),i=e.memoizedState!==null,t!==null&&t.memoizedState!==null!==i&&(e.flags|=8192),i&&e.mode&1?dn&1073741824&&(Bt(e),e.subtreeFlags&6&&(e.flags|=8192)):Bt(e),null;case 24:return null;case 25:return null}throw Error(ie(156,e.tag))}function Ax(t,e){switch(If(e),e.tag){case 1:return sn(e.type)&&al(),t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 3:return ws(),st(rn),st(Wt),Wf(),t=e.flags,t&65536&&!(t&128)?(e.flags=t&-65537|128,e):null;case 5:return Vf(e),null;case 13:if(st(lt),t=e.memoizedState,t!==null&&t.dehydrated!==null){if(e.alternate===null)throw Error(ie(340));Es()}return t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 19:return st(lt),null;case 4:return ws(),null;case 10:return kf(e.type._context),null;case 22:case 23:return td(),null;case 24:return null;default:return null}}var la=!1,Vt=!1,Rx=typeof WeakSet=="function"?WeakSet:Set,ge=null;function cs(t,e){var n=t.ref;if(n!==null)if(typeof n=="function")try{n(null)}catch(i){dt(t,e,i)}else n.current=null}function jc(t,e,n){try{n()}catch(i){dt(t,e,i)}}var Eh=!1;function Cx(t,e){if(bc=il,t=mg(),Uf(t)){if("selectionStart"in t)var n={start:t.selectionStart,end:t.selectionEnd};else e:{n=(n=t.ownerDocument)&&n.defaultView||window;var i=n.getSelection&&n.getSelection();if(i&&i.rangeCount!==0){n=i.anchorNode;var r=i.anchorOffset,s=i.focusNode;i=i.focusOffset;try{n.nodeType,s.nodeType}catch{n=null;break e}var o=0,a=-1,l=-1,u=0,f=0,h=t,d=null;t:for(;;){for(var m;h!==n||r!==0&&h.nodeType!==3||(a=o+r),h!==s||i!==0&&h.nodeType!==3||(l=o+i),h.nodeType===3&&(o+=h.nodeValue.length),(m=h.firstChild)!==null;)d=h,h=m;for(;;){if(h===t)break t;if(d===n&&++u===r&&(a=o),d===s&&++f===i&&(l=o),(m=h.nextSibling)!==null)break;h=d,d=h.parentNode}h=m}n=a===-1||l===-1?null:{start:a,end:l}}else n=null}n=n||{start:0,end:0}}else n=null;for(Pc={focusedElem:t,selectionRange:n},il=!1,ge=e;ge!==null;)if(e=ge,t=e.child,(e.subtreeFlags&1028)!==0&&t!==null)t.return=e,ge=t;else for(;ge!==null;){e=ge;try{var x=e.alternate;if(e.flags&1024)switch(e.tag){case 0:case 11:case 15:break;case 1:if(x!==null){var v=x.memoizedProps,p=x.memoizedState,c=e.stateNode,_=c.getSnapshotBeforeUpdate(e.elementType===e.type?v:Nn(e.type,v),p);c.__reactInternalSnapshotBeforeUpdate=_}break;case 3:var g=e.stateNode.containerInfo;g.nodeType===1?g.textContent="":g.nodeType===9&&g.documentElement&&g.removeChild(g.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(ie(163))}}catch(y){dt(e,e.return,y)}if(t=e.sibling,t!==null){t.return=e.return,ge=t;break}ge=e.return}return x=Eh,Eh=!1,x}function go(t,e,n){var i=e.updateQueue;if(i=i!==null?i.lastEffect:null,i!==null){var r=i=i.next;do{if((r.tag&t)===t){var s=r.destroy;r.destroy=void 0,s!==void 0&&jc(e,n,s)}r=r.next}while(r!==i)}}function zl(t,e){if(e=e.updateQueue,e=e!==null?e.lastEffect:null,e!==null){var n=e=e.next;do{if((n.tag&t)===t){var i=n.create;n.destroy=i()}n=n.next}while(n!==e)}}function Yc(t){var e=t.ref;if(e!==null){var n=t.stateNode;switch(t.tag){case 5:t=n;break;default:t=n}typeof e=="function"?e(t):e.current=t}}function f_(t){var e=t.alternate;e!==null&&(t.alternate=null,f_(e)),t.child=null,t.deletions=null,t.sibling=null,t.tag===5&&(e=t.stateNode,e!==null&&(delete e[Yn],delete e[Po],delete e[Uc],delete e[cx],delete e[fx])),t.stateNode=null,t.return=null,t.dependencies=null,t.memoizedProps=null,t.memoizedState=null,t.pendingProps=null,t.stateNode=null,t.updateQueue=null}function d_(t){return t.tag===5||t.tag===3||t.tag===4}function Th(t){e:for(;;){for(;t.sibling===null;){if(t.return===null||d_(t.return))return null;t=t.return}for(t.sibling.return=t.return,t=t.sibling;t.tag!==5&&t.tag!==6&&t.tag!==18;){if(t.flags&2||t.child===null||t.tag===4)continue e;t.child.return=t,t=t.child}if(!(t.flags&2))return t.stateNode}}function qc(t,e,n){var i=t.tag;if(i===5||i===6)t=t.stateNode,e?n.nodeType===8?n.parentNode.insertBefore(t,e):n.insertBefore(t,e):(n.nodeType===8?(e=n.parentNode,e.insertBefore(t,n)):(e=n,e.appendChild(t)),n=n._reactRootContainer,n!=null||e.onclick!==null||(e.onclick=ol));else if(i!==4&&(t=t.child,t!==null))for(qc(t,e,n),t=t.sibling;t!==null;)qc(t,e,n),t=t.sibling}function $c(t,e,n){var i=t.tag;if(i===5||i===6)t=t.stateNode,e?n.insertBefore(t,e):n.appendChild(t);else if(i!==4&&(t=t.child,t!==null))for($c(t,e,n),t=t.sibling;t!==null;)$c(t,e,n),t=t.sibling}var Ut=null,In=!1;function vi(t,e,n){for(n=n.child;n!==null;)h_(t,e,n),n=n.sibling}function h_(t,e,n){if($n&&typeof $n.onCommitFiberUnmount=="function")try{$n.onCommitFiberUnmount(Pl,n)}catch{}switch(n.tag){case 5:Vt||cs(n,e);case 6:var i=Ut,r=In;Ut=null,vi(t,e,n),Ut=i,In=r,Ut!==null&&(In?(t=Ut,n=n.stateNode,t.nodeType===8?t.parentNode.removeChild(n):t.removeChild(n)):Ut.removeChild(n.stateNode));break;case 18:Ut!==null&&(In?(t=Ut,n=n.stateNode,t.nodeType===8?gu(t.parentNode,n):t.nodeType===1&&gu(t,n),wo(t)):gu(Ut,n.stateNode));break;case 4:i=Ut,r=In,Ut=n.stateNode.containerInfo,In=!0,vi(t,e,n),Ut=i,In=r;break;case 0:case 11:case 14:case 15:if(!Vt&&(i=n.updateQueue,i!==null&&(i=i.lastEffect,i!==null))){r=i=i.next;do{var s=r,o=s.destroy;s=s.tag,o!==void 0&&(s&2||s&4)&&jc(n,e,o),r=r.next}while(r!==i)}vi(t,e,n);break;case 1:if(!Vt&&(cs(n,e),i=n.stateNode,typeof i.componentWillUnmount=="function"))try{i.props=n.memoizedProps,i.state=n.memoizedState,i.componentWillUnmount()}catch(a){dt(n,e,a)}vi(t,e,n);break;case 21:vi(t,e,n);break;case 22:n.mode&1?(Vt=(i=Vt)||n.memoizedState!==null,vi(t,e,n),Vt=i):vi(t,e,n);break;default:vi(t,e,n)}}function wh(t){var e=t.updateQueue;if(e!==null){t.updateQueue=null;var n=t.stateNode;n===null&&(n=t.stateNode=new Rx),e.forEach(function(i){var r=Ox.bind(null,t,i);n.has(i)||(n.add(i),i.then(r,r))})}}function Pn(t,e){var n=e.deletions;if(n!==null)for(var i=0;i<n.length;i++){var r=n[i];try{var s=t,o=e,a=o;e:for(;a!==null;){switch(a.tag){case 5:Ut=a.stateNode,In=!1;break e;case 3:Ut=a.stateNode.containerInfo,In=!0;break e;case 4:Ut=a.stateNode.containerInfo,In=!0;break e}a=a.return}if(Ut===null)throw Error(ie(160));h_(s,o,r),Ut=null,In=!1;var l=r.alternate;l!==null&&(l.return=null),r.return=null}catch(u){dt(r,e,u)}}if(e.subtreeFlags&12854)for(e=e.child;e!==null;)p_(e,t),e=e.sibling}function p_(t,e){var n=t.alternate,i=t.flags;switch(t.tag){case 0:case 11:case 14:case 15:if(Pn(e,t),Wn(t),i&4){try{go(3,t,t.return),zl(3,t)}catch(v){dt(t,t.return,v)}try{go(5,t,t.return)}catch(v){dt(t,t.return,v)}}break;case 1:Pn(e,t),Wn(t),i&512&&n!==null&&cs(n,n.return);break;case 5:if(Pn(e,t),Wn(t),i&512&&n!==null&&cs(n,n.return),t.flags&32){var r=t.stateNode;try{So(r,"")}catch(v){dt(t,t.return,v)}}if(i&4&&(r=t.stateNode,r!=null)){var s=t.memoizedProps,o=n!==null?n.memoizedProps:s,a=t.type,l=t.updateQueue;if(t.updateQueue=null,l!==null)try{a==="input"&&s.type==="radio"&&s.name!=null&&Fm(r,s),xc(a,o);var u=xc(a,s);for(o=0;o<l.length;o+=2){var f=l[o],h=l[o+1];f==="style"?Hm(r,h):f==="dangerouslySetInnerHTML"?km(r,h):f==="children"?So(r,h):yf(r,f,h,u)}switch(a){case"input":pc(r,s);break;case"textarea":Om(r,s);break;case"select":var d=r._wrapperState.wasMultiple;r._wrapperState.wasMultiple=!!s.multiple;var m=s.value;m!=null?hs(r,!!s.multiple,m,!1):d!==!!s.multiple&&(s.defaultValue!=null?hs(r,!!s.multiple,s.defaultValue,!0):hs(r,!!s.multiple,s.multiple?[]:"",!1))}r[Po]=s}catch(v){dt(t,t.return,v)}}break;case 6:if(Pn(e,t),Wn(t),i&4){if(t.stateNode===null)throw Error(ie(162));r=t.stateNode,s=t.memoizedProps;try{r.nodeValue=s}catch(v){dt(t,t.return,v)}}break;case 3:if(Pn(e,t),Wn(t),i&4&&n!==null&&n.memoizedState.isDehydrated)try{wo(e.containerInfo)}catch(v){dt(t,t.return,v)}break;case 4:Pn(e,t),Wn(t);break;case 13:Pn(e,t),Wn(t),r=t.child,r.flags&8192&&(s=r.memoizedState!==null,r.stateNode.isHidden=s,!s||r.alternate!==null&&r.alternate.memoizedState!==null||(Jf=pt())),i&4&&wh(t);break;case 22:if(f=n!==null&&n.memoizedState!==null,t.mode&1?(Vt=(u=Vt)||f,Pn(e,t),Vt=u):Pn(e,t),Wn(t),i&8192){if(u=t.memoizedState!==null,(t.stateNode.isHidden=u)&&!f&&t.mode&1)for(ge=t,f=t.child;f!==null;){for(h=ge=f;ge!==null;){switch(d=ge,m=d.child,d.tag){case 0:case 11:case 14:case 15:go(4,d,d.return);break;case 1:cs(d,d.return);var x=d.stateNode;if(typeof x.componentWillUnmount=="function"){i=d,n=d.return;try{e=i,x.props=e.memoizedProps,x.state=e.memoizedState,x.componentWillUnmount()}catch(v){dt(i,n,v)}}break;case 5:cs(d,d.return);break;case 22:if(d.memoizedState!==null){Rh(h);continue}}m!==null?(m.return=d,ge=m):Rh(h)}f=f.sibling}e:for(f=null,h=t;;){if(h.tag===5){if(f===null){f=h;try{r=h.stateNode,u?(s=r.style,typeof s.setProperty=="function"?s.setProperty("display","none","important"):s.display="none"):(a=h.stateNode,l=h.memoizedProps.style,o=l!=null&&l.hasOwnProperty("display")?l.display:null,a.style.display=Bm("display",o))}catch(v){dt(t,t.return,v)}}}else if(h.tag===6){if(f===null)try{h.stateNode.nodeValue=u?"":h.memoizedProps}catch(v){dt(t,t.return,v)}}else if((h.tag!==22&&h.tag!==23||h.memoizedState===null||h===t)&&h.child!==null){h.child.return=h,h=h.child;continue}if(h===t)break e;for(;h.sibling===null;){if(h.return===null||h.return===t)break e;f===h&&(f=null),h=h.return}f===h&&(f=null),h.sibling.return=h.return,h=h.sibling}}break;case 19:Pn(e,t),Wn(t),i&4&&wh(t);break;case 21:break;default:Pn(e,t),Wn(t)}}function Wn(t){var e=t.flags;if(e&2){try{e:{for(var n=t.return;n!==null;){if(d_(n)){var i=n;break e}n=n.return}throw Error(ie(160))}switch(i.tag){case 5:var r=i.stateNode;i.flags&32&&(So(r,""),i.flags&=-33);var s=Th(t);$c(t,s,r);break;case 3:case 4:var o=i.stateNode.containerInfo,a=Th(t);qc(t,a,o);break;default:throw Error(ie(161))}}catch(l){dt(t,t.return,l)}t.flags&=-3}e&4096&&(t.flags&=-4097)}function bx(t,e,n){ge=t,m_(t)}function m_(t,e,n){for(var i=(t.mode&1)!==0;ge!==null;){var r=ge,s=r.child;if(r.tag===22&&i){var o=r.memoizedState!==null||la;if(!o){var a=r.alternate,l=a!==null&&a.memoizedState!==null||Vt;a=la;var u=Vt;if(la=o,(Vt=l)&&!u)for(ge=r;ge!==null;)o=ge,l=o.child,o.tag===22&&o.memoizedState!==null?Ch(r):l!==null?(l.return=o,ge=l):Ch(r);for(;s!==null;)ge=s,m_(s),s=s.sibling;ge=r,la=a,Vt=u}Ah(t)}else r.subtreeFlags&8772&&s!==null?(s.return=r,ge=s):Ah(t)}}function Ah(t){for(;ge!==null;){var e=ge;if(e.flags&8772){var n=e.alternate;try{if(e.flags&8772)switch(e.tag){case 0:case 11:case 15:Vt||zl(5,e);break;case 1:var i=e.stateNode;if(e.flags&4&&!Vt)if(n===null)i.componentDidMount();else{var r=e.elementType===e.type?n.memoizedProps:Nn(e.type,n.memoizedProps);i.componentDidUpdate(r,n.memoizedState,i.__reactInternalSnapshotBeforeUpdate)}var s=e.updateQueue;s!==null&&ch(e,s,i);break;case 3:var o=e.updateQueue;if(o!==null){if(n=null,e.child!==null)switch(e.child.tag){case 5:n=e.child.stateNode;break;case 1:n=e.child.stateNode}ch(e,o,n)}break;case 5:var a=e.stateNode;if(n===null&&e.flags&4){n=a;var l=e.memoizedProps;switch(e.type){case"button":case"input":case"select":case"textarea":l.autoFocus&&n.focus();break;case"img":l.src&&(n.src=l.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(e.memoizedState===null){var u=e.alternate;if(u!==null){var f=u.memoizedState;if(f!==null){var h=f.dehydrated;h!==null&&wo(h)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(ie(163))}Vt||e.flags&512&&Yc(e)}catch(d){dt(e,e.return,d)}}if(e===t){ge=null;break}if(n=e.sibling,n!==null){n.return=e.return,ge=n;break}ge=e.return}}function Rh(t){for(;ge!==null;){var e=ge;if(e===t){ge=null;break}var n=e.sibling;if(n!==null){n.return=e.return,ge=n;break}ge=e.return}}function Ch(t){for(;ge!==null;){var e=ge;try{switch(e.tag){case 0:case 11:case 15:var n=e.return;try{zl(4,e)}catch(l){dt(e,n,l)}break;case 1:var i=e.stateNode;if(typeof i.componentDidMount=="function"){var r=e.return;try{i.componentDidMount()}catch(l){dt(e,r,l)}}var s=e.return;try{Yc(e)}catch(l){dt(e,s,l)}break;case 5:var o=e.return;try{Yc(e)}catch(l){dt(e,o,l)}}}catch(l){dt(e,e.return,l)}if(e===t){ge=null;break}var a=e.sibling;if(a!==null){a.return=e.return,ge=a;break}ge=e.return}}var Px=Math.ceil,_l=_i.ReactCurrentDispatcher,Zf=_i.ReactCurrentOwner,Rn=_i.ReactCurrentBatchConfig,Ke=0,Dt=null,_t=null,Ft=0,dn=0,fs=Qi(0),St=0,Fo=null,Sr=0,kl=0,Qf=0,_o=null,tn=null,Jf=0,Rs=1/0,ri=null,vl=!1,Kc=null,Bi=null,ua=!1,Di=null,xl=0,vo=0,Zc=null,Ya=-1,qa=0;function Qt(){return Ke&6?pt():Ya!==-1?Ya:Ya=pt()}function Hi(t){return t.mode&1?Ke&2&&Ft!==0?Ft&-Ft:hx.transition!==null?(qa===0&&(qa=Jm()),qa):(t=Ze,t!==0||(t=window.event,t=t===void 0?16:og(t.type)),t):1}function Bn(t,e,n,i){if(50<vo)throw vo=0,Zc=null,Error(ie(185));Ho(t,n,i),(!(Ke&2)||t!==Dt)&&(t===Dt&&(!(Ke&2)&&(kl|=n),St===4&&Pi(t,Ft)),on(t,i),n===1&&Ke===0&&!(e.mode&1)&&(Rs=pt()+500,Il&&Ji()))}function on(t,e){var n=t.callbackNode;h0(t,e);var i=nl(t,t===Dt?Ft:0);if(i===0)n!==null&&Od(n),t.callbackNode=null,t.callbackPriority=0;else if(e=i&-i,t.callbackPriority!==e){if(n!=null&&Od(n),e===1)t.tag===0?dx(bh.bind(null,t)):wg(bh.bind(null,t)),lx(function(){!(Ke&6)&&Ji()}),n=null;else{switch(eg(i)){case 1:n=wf;break;case 4:n=Zm;break;case 16:n=tl;break;case 536870912:n=Qm;break;default:n=tl}n=E_(n,g_.bind(null,t))}t.callbackPriority=e,t.callbackNode=n}}function g_(t,e){if(Ya=-1,qa=0,Ke&6)throw Error(ie(327));var n=t.callbackNode;if(vs()&&t.callbackNode!==n)return null;var i=nl(t,t===Dt?Ft:0);if(i===0)return null;if(i&30||i&t.expiredLanes||e)e=yl(t,i);else{e=i;var r=Ke;Ke|=2;var s=v_();(Dt!==t||Ft!==e)&&(ri=null,Rs=pt()+500,pr(t,e));do try{Ux();break}catch(a){__(t,a)}while(!0);zf(),_l.current=s,Ke=r,_t!==null?e=0:(Dt=null,Ft=0,e=St)}if(e!==0){if(e===2&&(r=Tc(t),r!==0&&(i=r,e=Qc(t,r))),e===1)throw n=Fo,pr(t,0),Pi(t,i),on(t,pt()),n;if(e===6)Pi(t,i);else{if(r=t.current.alternate,!(i&30)&&!Lx(r)&&(e=yl(t,i),e===2&&(s=Tc(t),s!==0&&(i=s,e=Qc(t,s))),e===1))throw n=Fo,pr(t,0),Pi(t,i),on(t,pt()),n;switch(t.finishedWork=r,t.finishedLanes=i,e){case 0:case 1:throw Error(ie(345));case 2:ar(t,tn,ri);break;case 3:if(Pi(t,i),(i&130023424)===i&&(e=Jf+500-pt(),10<e)){if(nl(t,0)!==0)break;if(r=t.suspendedLanes,(r&i)!==i){Qt(),t.pingedLanes|=t.suspendedLanes&r;break}t.timeoutHandle=Dc(ar.bind(null,t,tn,ri),e);break}ar(t,tn,ri);break;case 4:if(Pi(t,i),(i&4194240)===i)break;for(e=t.eventTimes,r=-1;0<i;){var o=31-kn(i);s=1<<o,o=e[o],o>r&&(r=o),i&=~s}if(i=r,i=pt()-i,i=(120>i?120:480>i?480:1080>i?1080:1920>i?1920:3e3>i?3e3:4320>i?4320:1960*Px(i/1960))-i,10<i){t.timeoutHandle=Dc(ar.bind(null,t,tn,ri),i);break}ar(t,tn,ri);break;case 5:ar(t,tn,ri);break;default:throw Error(ie(329))}}}return on(t,pt()),t.callbackNode===n?g_.bind(null,t):null}function Qc(t,e){var n=_o;return t.current.memoizedState.isDehydrated&&(pr(t,e).flags|=256),t=yl(t,e),t!==2&&(e=tn,tn=n,e!==null&&Jc(e)),t}function Jc(t){tn===null?tn=t:tn.push.apply(tn,t)}function Lx(t){for(var e=t;;){if(e.flags&16384){var n=e.updateQueue;if(n!==null&&(n=n.stores,n!==null))for(var i=0;i<n.length;i++){var r=n[i],s=r.getSnapshot;r=r.value;try{if(!Gn(s(),r))return!1}catch{return!1}}}if(n=e.child,e.subtreeFlags&16384&&n!==null)n.return=e,e=n;else{if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return!0;e=e.return}e.sibling.return=e.return,e=e.sibling}}return!0}function Pi(t,e){for(e&=~Qf,e&=~kl,t.suspendedLanes|=e,t.pingedLanes&=~e,t=t.expirationTimes;0<e;){var n=31-kn(e),i=1<<n;t[n]=-1,e&=~i}}function bh(t){if(Ke&6)throw Error(ie(327));vs();var e=nl(t,0);if(!(e&1))return on(t,pt()),null;var n=yl(t,e);if(t.tag!==0&&n===2){var i=Tc(t);i!==0&&(e=i,n=Qc(t,i))}if(n===1)throw n=Fo,pr(t,0),Pi(t,e),on(t,pt()),n;if(n===6)throw Error(ie(345));return t.finishedWork=t.current.alternate,t.finishedLanes=e,ar(t,tn,ri),on(t,pt()),null}function ed(t,e){var n=Ke;Ke|=1;try{return t(e)}finally{Ke=n,Ke===0&&(Rs=pt()+500,Il&&Ji())}}function Mr(t){Di!==null&&Di.tag===0&&!(Ke&6)&&vs();var e=Ke;Ke|=1;var n=Rn.transition,i=Ze;try{if(Rn.transition=null,Ze=1,t)return t()}finally{Ze=i,Rn.transition=n,Ke=e,!(Ke&6)&&Ji()}}function td(){dn=fs.current,st(fs)}function pr(t,e){t.finishedWork=null,t.finishedLanes=0;var n=t.timeoutHandle;if(n!==-1&&(t.timeoutHandle=-1,ax(n)),_t!==null)for(n=_t.return;n!==null;){var i=n;switch(If(i),i.tag){case 1:i=i.type.childContextTypes,i!=null&&al();break;case 3:ws(),st(rn),st(Wt),Wf();break;case 5:Vf(i);break;case 4:ws();break;case 13:st(lt);break;case 19:st(lt);break;case 10:kf(i.type._context);break;case 22:case 23:td()}n=n.return}if(Dt=t,_t=t=Gi(t.current,null),Ft=dn=e,St=0,Fo=null,Qf=kl=Sr=0,tn=_o=null,dr!==null){for(e=0;e<dr.length;e++)if(n=dr[e],i=n.interleaved,i!==null){n.interleaved=null;var r=i.next,s=n.pending;if(s!==null){var o=s.next;s.next=r,i.next=o}n.pending=i}dr=null}return t}function __(t,e){do{var n=_t;try{if(zf(),Wa.current=gl,ml){for(var i=ut.memoizedState;i!==null;){var r=i.queue;r!==null&&(r.pending=null),i=i.next}ml=!1}if(yr=0,Pt=yt=ut=null,mo=!1,Uo=0,Zf.current=null,n===null||n.return===null){St=1,Fo=e,_t=null;break}e:{var s=t,o=n.return,a=n,l=e;if(e=Ft,a.flags|=32768,l!==null&&typeof l=="object"&&typeof l.then=="function"){var u=l,f=a,h=f.tag;if(!(f.mode&1)&&(h===0||h===11||h===15)){var d=f.alternate;d?(f.updateQueue=d.updateQueue,f.memoizedState=d.memoizedState,f.lanes=d.lanes):(f.updateQueue=null,f.memoizedState=null)}var m=gh(o);if(m!==null){m.flags&=-257,_h(m,o,a,s,e),m.mode&1&&mh(s,u,e),e=m,l=u;var x=e.updateQueue;if(x===null){var v=new Set;v.add(l),e.updateQueue=v}else x.add(l);break e}else{if(!(e&1)){mh(s,u,e),nd();break e}l=Error(ie(426))}}else if(ot&&a.mode&1){var p=gh(o);if(p!==null){!(p.flags&65536)&&(p.flags|=256),_h(p,o,a,s,e),Ff(As(l,a));break e}}s=l=As(l,a),St!==4&&(St=2),_o===null?_o=[s]:_o.push(s),s=o;do{switch(s.tag){case 3:s.flags|=65536,e&=-e,s.lanes|=e;var c=e_(s,l,e);uh(s,c);break e;case 1:a=l;var _=s.type,g=s.stateNode;if(!(s.flags&128)&&(typeof _.getDerivedStateFromError=="function"||g!==null&&typeof g.componentDidCatch=="function"&&(Bi===null||!Bi.has(g)))){s.flags|=65536,e&=-e,s.lanes|=e;var y=t_(s,a,e);uh(s,y);break e}}s=s.return}while(s!==null)}y_(n)}catch(M){e=M,_t===n&&n!==null&&(_t=n=n.return);continue}break}while(!0)}function v_(){var t=_l.current;return _l.current=gl,t===null?gl:t}function nd(){(St===0||St===3||St===2)&&(St=4),Dt===null||!(Sr&268435455)&&!(kl&268435455)||Pi(Dt,Ft)}function yl(t,e){var n=Ke;Ke|=2;var i=v_();(Dt!==t||Ft!==e)&&(ri=null,pr(t,e));do try{Dx();break}catch(r){__(t,r)}while(!0);if(zf(),Ke=n,_l.current=i,_t!==null)throw Error(ie(261));return Dt=null,Ft=0,St}function Dx(){for(;_t!==null;)x_(_t)}function Ux(){for(;_t!==null&&!r0();)x_(_t)}function x_(t){var e=M_(t.alternate,t,dn);t.memoizedProps=t.pendingProps,e===null?y_(t):_t=e,Zf.current=null}function y_(t){var e=t;do{var n=e.alternate;if(t=e.return,e.flags&32768){if(n=Ax(n,e),n!==null){n.flags&=32767,_t=n;return}if(t!==null)t.flags|=32768,t.subtreeFlags=0,t.deletions=null;else{St=6,_t=null;return}}else if(n=wx(n,e,dn),n!==null){_t=n;return}if(e=e.sibling,e!==null){_t=e;return}_t=e=t}while(e!==null);St===0&&(St=5)}function ar(t,e,n){var i=Ze,r=Rn.transition;try{Rn.transition=null,Ze=1,Nx(t,e,n,i)}finally{Rn.transition=r,Ze=i}return null}function Nx(t,e,n,i){do vs();while(Di!==null);if(Ke&6)throw Error(ie(327));n=t.finishedWork;var r=t.finishedLanes;if(n===null)return null;if(t.finishedWork=null,t.finishedLanes=0,n===t.current)throw Error(ie(177));t.callbackNode=null,t.callbackPriority=0;var s=n.lanes|n.childLanes;if(p0(t,s),t===Dt&&(_t=Dt=null,Ft=0),!(n.subtreeFlags&2064)&&!(n.flags&2064)||ua||(ua=!0,E_(tl,function(){return vs(),null})),s=(n.flags&15990)!==0,n.subtreeFlags&15990||s){s=Rn.transition,Rn.transition=null;var o=Ze;Ze=1;var a=Ke;Ke|=4,Zf.current=null,Cx(t,n),p_(n,t),ex(Pc),il=!!bc,Pc=bc=null,t.current=n,bx(n),s0(),Ke=a,Ze=o,Rn.transition=s}else t.current=n;if(ua&&(ua=!1,Di=t,xl=r),s=t.pendingLanes,s===0&&(Bi=null),l0(n.stateNode),on(t,pt()),e!==null)for(i=t.onRecoverableError,n=0;n<e.length;n++)r=e[n],i(r.value,{componentStack:r.stack,digest:r.digest});if(vl)throw vl=!1,t=Kc,Kc=null,t;return xl&1&&t.tag!==0&&vs(),s=t.pendingLanes,s&1?t===Zc?vo++:(vo=0,Zc=t):vo=0,Ji(),null}function vs(){if(Di!==null){var t=eg(xl),e=Rn.transition,n=Ze;try{if(Rn.transition=null,Ze=16>t?16:t,Di===null)var i=!1;else{if(t=Di,Di=null,xl=0,Ke&6)throw Error(ie(331));var r=Ke;for(Ke|=4,ge=t.current;ge!==null;){var s=ge,o=s.child;if(ge.flags&16){var a=s.deletions;if(a!==null){for(var l=0;l<a.length;l++){var u=a[l];for(ge=u;ge!==null;){var f=ge;switch(f.tag){case 0:case 11:case 15:go(8,f,s)}var h=f.child;if(h!==null)h.return=f,ge=h;else for(;ge!==null;){f=ge;var d=f.sibling,m=f.return;if(f_(f),f===u){ge=null;break}if(d!==null){d.return=m,ge=d;break}ge=m}}}var x=s.alternate;if(x!==null){var v=x.child;if(v!==null){x.child=null;do{var p=v.sibling;v.sibling=null,v=p}while(v!==null)}}ge=s}}if(s.subtreeFlags&2064&&o!==null)o.return=s,ge=o;else e:for(;ge!==null;){if(s=ge,s.flags&2048)switch(s.tag){case 0:case 11:case 15:go(9,s,s.return)}var c=s.sibling;if(c!==null){c.return=s.return,ge=c;break e}ge=s.return}}var _=t.current;for(ge=_;ge!==null;){o=ge;var g=o.child;if(o.subtreeFlags&2064&&g!==null)g.return=o,ge=g;else e:for(o=_;ge!==null;){if(a=ge,a.flags&2048)try{switch(a.tag){case 0:case 11:case 15:zl(9,a)}}catch(M){dt(a,a.return,M)}if(a===o){ge=null;break e}var y=a.sibling;if(y!==null){y.return=a.return,ge=y;break e}ge=a.return}}if(Ke=r,Ji(),$n&&typeof $n.onPostCommitFiberRoot=="function")try{$n.onPostCommitFiberRoot(Pl,t)}catch{}i=!0}return i}finally{Ze=n,Rn.transition=e}}return!1}function Ph(t,e,n){e=As(n,e),e=e_(t,e,1),t=ki(t,e,1),e=Qt(),t!==null&&(Ho(t,1,e),on(t,e))}function dt(t,e,n){if(t.tag===3)Ph(t,t,n);else for(;e!==null;){if(e.tag===3){Ph(e,t,n);break}else if(e.tag===1){var i=e.stateNode;if(typeof e.type.getDerivedStateFromError=="function"||typeof i.componentDidCatch=="function"&&(Bi===null||!Bi.has(i))){t=As(n,t),t=t_(e,t,1),e=ki(e,t,1),t=Qt(),e!==null&&(Ho(e,1,t),on(e,t));break}}e=e.return}}function Ix(t,e,n){var i=t.pingCache;i!==null&&i.delete(e),e=Qt(),t.pingedLanes|=t.suspendedLanes&n,Dt===t&&(Ft&n)===n&&(St===4||St===3&&(Ft&130023424)===Ft&&500>pt()-Jf?pr(t,0):Qf|=n),on(t,e)}function S_(t,e){e===0&&(t.mode&1?(e=Jo,Jo<<=1,!(Jo&130023424)&&(Jo=4194304)):e=1);var n=Qt();t=pi(t,e),t!==null&&(Ho(t,e,n),on(t,n))}function Fx(t){var e=t.memoizedState,n=0;e!==null&&(n=e.retryLane),S_(t,n)}function Ox(t,e){var n=0;switch(t.tag){case 13:var i=t.stateNode,r=t.memoizedState;r!==null&&(n=r.retryLane);break;case 19:i=t.stateNode;break;default:throw Error(ie(314))}i!==null&&i.delete(e),S_(t,n)}var M_;M_=function(t,e,n){if(t!==null)if(t.memoizedProps!==e.pendingProps||rn.current)nn=!0;else{if(!(t.lanes&n)&&!(e.flags&128))return nn=!1,Tx(t,e,n);nn=!!(t.flags&131072)}else nn=!1,ot&&e.flags&1048576&&Ag(e,cl,e.index);switch(e.lanes=0,e.tag){case 2:var i=e.type;ja(t,e),t=e.pendingProps;var r=Ms(e,Wt.current);_s(e,n),r=jf(null,e,i,t,r,n);var s=Yf();return e.flags|=1,typeof r=="object"&&r!==null&&typeof r.render=="function"&&r.$$typeof===void 0?(e.tag=1,e.memoizedState=null,e.updateQueue=null,sn(i)?(s=!0,ll(e)):s=!1,e.memoizedState=r.state!==null&&r.state!==void 0?r.state:null,Hf(e),r.updater=Ol,e.stateNode=r,r._reactInternals=e,kc(e,i,t,n),e=Gc(null,e,i,!0,s,n)):(e.tag=0,ot&&s&&Nf(e),$t(null,e,r,n),e=e.child),e;case 16:i=e.elementType;e:{switch(ja(t,e),t=e.pendingProps,r=i._init,i=r(i._payload),e.type=i,r=e.tag=kx(i),t=Nn(i,t),r){case 0:e=Hc(null,e,i,t,n);break e;case 1:e=yh(null,e,i,t,n);break e;case 11:e=vh(null,e,i,t,n);break e;case 14:e=xh(null,e,i,Nn(i.type,t),n);break e}throw Error(ie(306,i,""))}return e;case 0:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:Nn(i,r),Hc(t,e,i,r,n);case 1:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:Nn(i,r),yh(t,e,i,r,n);case 3:e:{if(s_(e),t===null)throw Error(ie(387));i=e.pendingProps,s=e.memoizedState,r=s.element,Dg(t,e),hl(e,i,null,n);var o=e.memoizedState;if(i=o.element,s.isDehydrated)if(s={element:i,isDehydrated:!1,cache:o.cache,pendingSuspenseBoundaries:o.pendingSuspenseBoundaries,transitions:o.transitions},e.updateQueue.baseState=s,e.memoizedState=s,e.flags&256){r=As(Error(ie(423)),e),e=Sh(t,e,i,n,r);break e}else if(i!==r){r=As(Error(ie(424)),e),e=Sh(t,e,i,n,r);break e}else for(hn=zi(e.stateNode.containerInfo.firstChild),pn=e,ot=!0,Fn=null,n=Pg(e,null,i,n),e.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(Es(),i===r){e=mi(t,e,n);break e}$t(t,e,i,n)}e=e.child}return e;case 5:return Ug(e),t===null&&Fc(e),i=e.type,r=e.pendingProps,s=t!==null?t.memoizedProps:null,o=r.children,Lc(i,r)?o=null:s!==null&&Lc(i,s)&&(e.flags|=32),r_(t,e),$t(t,e,o,n),e.child;case 6:return t===null&&Fc(e),null;case 13:return o_(t,e,n);case 4:return Gf(e,e.stateNode.containerInfo),i=e.pendingProps,t===null?e.child=Ts(e,null,i,n):$t(t,e,i,n),e.child;case 11:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:Nn(i,r),vh(t,e,i,r,n);case 7:return $t(t,e,e.pendingProps,n),e.child;case 8:return $t(t,e,e.pendingProps.children,n),e.child;case 12:return $t(t,e,e.pendingProps.children,n),e.child;case 10:e:{if(i=e.type._context,r=e.pendingProps,s=e.memoizedProps,o=r.value,tt(fl,i._currentValue),i._currentValue=o,s!==null)if(Gn(s.value,o)){if(s.children===r.children&&!rn.current){e=mi(t,e,n);break e}}else for(s=e.child,s!==null&&(s.return=e);s!==null;){var a=s.dependencies;if(a!==null){o=s.child;for(var l=a.firstContext;l!==null;){if(l.context===i){if(s.tag===1){l=fi(-1,n&-n),l.tag=2;var u=s.updateQueue;if(u!==null){u=u.shared;var f=u.pending;f===null?l.next=l:(l.next=f.next,f.next=l),u.pending=l}}s.lanes|=n,l=s.alternate,l!==null&&(l.lanes|=n),Oc(s.return,n,e),a.lanes|=n;break}l=l.next}}else if(s.tag===10)o=s.type===e.type?null:s.child;else if(s.tag===18){if(o=s.return,o===null)throw Error(ie(341));o.lanes|=n,a=o.alternate,a!==null&&(a.lanes|=n),Oc(o,n,e),o=s.sibling}else o=s.child;if(o!==null)o.return=s;else for(o=s;o!==null;){if(o===e){o=null;break}if(s=o.sibling,s!==null){s.return=o.return,o=s;break}o=o.return}s=o}$t(t,e,r.children,n),e=e.child}return e;case 9:return r=e.type,i=e.pendingProps.children,_s(e,n),r=Cn(r),i=i(r),e.flags|=1,$t(t,e,i,n),e.child;case 14:return i=e.type,r=Nn(i,e.pendingProps),r=Nn(i.type,r),xh(t,e,i,r,n);case 15:return n_(t,e,e.type,e.pendingProps,n);case 17:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:Nn(i,r),ja(t,e),e.tag=1,sn(i)?(t=!0,ll(e)):t=!1,_s(e,n),Jg(e,i,r),kc(e,i,r,n),Gc(null,e,i,!0,t,n);case 19:return a_(t,e,n);case 22:return i_(t,e,n)}throw Error(ie(156,e.tag))};function E_(t,e){return Km(t,e)}function zx(t,e,n,i){this.tag=t,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=e,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=i,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function An(t,e,n,i){return new zx(t,e,n,i)}function id(t){return t=t.prototype,!(!t||!t.isReactComponent)}function kx(t){if(typeof t=="function")return id(t)?1:0;if(t!=null){if(t=t.$$typeof,t===Mf)return 11;if(t===Ef)return 14}return 2}function Gi(t,e){var n=t.alternate;return n===null?(n=An(t.tag,e,t.key,t.mode),n.elementType=t.elementType,n.type=t.type,n.stateNode=t.stateNode,n.alternate=t,t.alternate=n):(n.pendingProps=e,n.type=t.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=t.flags&14680064,n.childLanes=t.childLanes,n.lanes=t.lanes,n.child=t.child,n.memoizedProps=t.memoizedProps,n.memoizedState=t.memoizedState,n.updateQueue=t.updateQueue,e=t.dependencies,n.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext},n.sibling=t.sibling,n.index=t.index,n.ref=t.ref,n}function $a(t,e,n,i,r,s){var o=2;if(i=t,typeof t=="function")id(t)&&(o=1);else if(typeof t=="string")o=5;else e:switch(t){case ts:return mr(n.children,r,s,e);case Sf:o=8,r|=8;break;case uc:return t=An(12,n,e,r|2),t.elementType=uc,t.lanes=s,t;case cc:return t=An(13,n,e,r),t.elementType=cc,t.lanes=s,t;case fc:return t=An(19,n,e,r),t.elementType=fc,t.lanes=s,t;case Um:return Bl(n,r,s,e);default:if(typeof t=="object"&&t!==null)switch(t.$$typeof){case Lm:o=10;break e;case Dm:o=9;break e;case Mf:o=11;break e;case Ef:o=14;break e;case Ai:o=16,i=null;break e}throw Error(ie(130,t==null?t:typeof t,""))}return e=An(o,n,e,r),e.elementType=t,e.type=i,e.lanes=s,e}function mr(t,e,n,i){return t=An(7,t,i,e),t.lanes=n,t}function Bl(t,e,n,i){return t=An(22,t,i,e),t.elementType=Um,t.lanes=n,t.stateNode={isHidden:!1},t}function Tu(t,e,n){return t=An(6,t,null,e),t.lanes=n,t}function wu(t,e,n){return e=An(4,t.children!==null?t.children:[],t.key,e),e.lanes=n,e.stateNode={containerInfo:t.containerInfo,pendingChildren:null,implementation:t.implementation},e}function Bx(t,e,n,i,r){this.tag=e,this.containerInfo=t,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=su(0),this.expirationTimes=su(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=su(0),this.identifierPrefix=i,this.onRecoverableError=r,this.mutableSourceEagerHydrationData=null}function rd(t,e,n,i,r,s,o,a,l){return t=new Bx(t,e,n,a,l),e===1?(e=1,s===!0&&(e|=8)):e=0,s=An(3,null,null,e),t.current=s,s.stateNode=t,s.memoizedState={element:i,isDehydrated:n,cache:null,transitions:null,pendingSuspenseBoundaries:null},Hf(s),t}function Hx(t,e,n){var i=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:es,key:i==null?null:""+i,children:t,containerInfo:e,implementation:n}}function T_(t){if(!t)return $i;t=t._reactInternals;e:{if(Rr(t)!==t||t.tag!==1)throw Error(ie(170));var e=t;do{switch(e.tag){case 3:e=e.stateNode.context;break e;case 1:if(sn(e.type)){e=e.stateNode.__reactInternalMemoizedMergedChildContext;break e}}e=e.return}while(e!==null);throw Error(ie(171))}if(t.tag===1){var n=t.type;if(sn(n))return Tg(t,n,e)}return e}function w_(t,e,n,i,r,s,o,a,l){return t=rd(n,i,!0,t,r,s,o,a,l),t.context=T_(null),n=t.current,i=Qt(),r=Hi(n),s=fi(i,r),s.callback=e??null,ki(n,s,r),t.current.lanes=r,Ho(t,r,i),on(t,i),t}function Hl(t,e,n,i){var r=e.current,s=Qt(),o=Hi(r);return n=T_(n),e.context===null?e.context=n:e.pendingContext=n,e=fi(s,o),e.payload={element:t},i=i===void 0?null:i,i!==null&&(e.callback=i),t=ki(r,e,o),t!==null&&(Bn(t,r,o,s),Va(t,r,o)),o}function Sl(t){if(t=t.current,!t.child)return null;switch(t.child.tag){case 5:return t.child.stateNode;default:return t.child.stateNode}}function Lh(t,e){if(t=t.memoizedState,t!==null&&t.dehydrated!==null){var n=t.retryLane;t.retryLane=n!==0&&n<e?n:e}}function sd(t,e){Lh(t,e),(t=t.alternate)&&Lh(t,e)}function Gx(){return null}var A_=typeof reportError=="function"?reportError:function(t){console.error(t)};function od(t){this._internalRoot=t}Gl.prototype.render=od.prototype.render=function(t){var e=this._internalRoot;if(e===null)throw Error(ie(409));Hl(t,e,null,null)};Gl.prototype.unmount=od.prototype.unmount=function(){var t=this._internalRoot;if(t!==null){this._internalRoot=null;var e=t.containerInfo;Mr(function(){Hl(null,t,null,null)}),e[hi]=null}};function Gl(t){this._internalRoot=t}Gl.prototype.unstable_scheduleHydration=function(t){if(t){var e=ig();t={blockedOn:null,target:t,priority:e};for(var n=0;n<bi.length&&e!==0&&e<bi[n].priority;n++);bi.splice(n,0,t),n===0&&sg(t)}};function ad(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)}function Vl(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11&&(t.nodeType!==8||t.nodeValue!==" react-mount-point-unstable "))}function Dh(){}function Vx(t,e,n,i,r){if(r){if(typeof i=="function"){var s=i;i=function(){var u=Sl(o);s.call(u)}}var o=w_(e,i,t,0,null,!1,!1,"",Dh);return t._reactRootContainer=o,t[hi]=o.current,Co(t.nodeType===8?t.parentNode:t),Mr(),o}for(;r=t.lastChild;)t.removeChild(r);if(typeof i=="function"){var a=i;i=function(){var u=Sl(l);a.call(u)}}var l=rd(t,0,!1,null,null,!1,!1,"",Dh);return t._reactRootContainer=l,t[hi]=l.current,Co(t.nodeType===8?t.parentNode:t),Mr(function(){Hl(e,l,n,i)}),l}function Wl(t,e,n,i,r){var s=n._reactRootContainer;if(s){var o=s;if(typeof r=="function"){var a=r;r=function(){var l=Sl(o);a.call(l)}}Hl(e,o,t,r)}else o=Vx(n,e,t,r,i);return Sl(o)}tg=function(t){switch(t.tag){case 3:var e=t.stateNode;if(e.current.memoizedState.isDehydrated){var n=so(e.pendingLanes);n!==0&&(Af(e,n|1),on(e,pt()),!(Ke&6)&&(Rs=pt()+500,Ji()))}break;case 13:Mr(function(){var i=pi(t,1);if(i!==null){var r=Qt();Bn(i,t,1,r)}}),sd(t,1)}};Rf=function(t){if(t.tag===13){var e=pi(t,134217728);if(e!==null){var n=Qt();Bn(e,t,134217728,n)}sd(t,134217728)}};ng=function(t){if(t.tag===13){var e=Hi(t),n=pi(t,e);if(n!==null){var i=Qt();Bn(n,t,e,i)}sd(t,e)}};ig=function(){return Ze};rg=function(t,e){var n=Ze;try{return Ze=t,e()}finally{Ze=n}};Sc=function(t,e,n){switch(e){case"input":if(pc(t,n),e=n.name,n.type==="radio"&&e!=null){for(n=t;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+e)+'][type="radio"]'),e=0;e<n.length;e++){var i=n[e];if(i!==t&&i.form===t.form){var r=Nl(i);if(!r)throw Error(ie(90));Im(i),pc(i,r)}}}break;case"textarea":Om(t,n);break;case"select":e=n.value,e!=null&&hs(t,!!n.multiple,e,!1)}};Wm=ed;Xm=Mr;var Wx={usingClientEntryPoint:!1,Events:[Vo,ss,Nl,Gm,Vm,ed]},Ys={findFiberByHostInstance:fr,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},Xx={bundleType:Ys.bundleType,version:Ys.version,rendererPackageName:Ys.rendererPackageName,rendererConfig:Ys.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:_i.ReactCurrentDispatcher,findHostInstanceByFiber:function(t){return t=qm(t),t===null?null:t.stateNode},findFiberByHostInstance:Ys.findFiberByHostInstance||Gx,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var ca=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!ca.isDisabled&&ca.supportsFiber)try{Pl=ca.inject(Xx),$n=ca}catch{}}gn.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Wx;gn.createPortal=function(t,e){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!ad(e))throw Error(ie(200));return Hx(t,e,null,n)};gn.createRoot=function(t,e){if(!ad(t))throw Error(ie(299));var n=!1,i="",r=A_;return e!=null&&(e.unstable_strictMode===!0&&(n=!0),e.identifierPrefix!==void 0&&(i=e.identifierPrefix),e.onRecoverableError!==void 0&&(r=e.onRecoverableError)),e=rd(t,1,!1,null,null,n,!1,i,r),t[hi]=e.current,Co(t.nodeType===8?t.parentNode:t),new od(e)};gn.findDOMNode=function(t){if(t==null)return null;if(t.nodeType===1)return t;var e=t._reactInternals;if(e===void 0)throw typeof t.render=="function"?Error(ie(188)):(t=Object.keys(t).join(","),Error(ie(268,t)));return t=qm(e),t=t===null?null:t.stateNode,t};gn.flushSync=function(t){return Mr(t)};gn.hydrate=function(t,e,n){if(!Vl(e))throw Error(ie(200));return Wl(null,t,e,!0,n)};gn.hydrateRoot=function(t,e,n){if(!ad(t))throw Error(ie(405));var i=n!=null&&n.hydratedSources||null,r=!1,s="",o=A_;if(n!=null&&(n.unstable_strictMode===!0&&(r=!0),n.identifierPrefix!==void 0&&(s=n.identifierPrefix),n.onRecoverableError!==void 0&&(o=n.onRecoverableError)),e=w_(e,null,t,1,n??null,r,!1,s,o),t[hi]=e.current,Co(t),i)for(t=0;t<i.length;t++)n=i[t],r=n._getVersion,r=r(n._source),e.mutableSourceEagerHydrationData==null?e.mutableSourceEagerHydrationData=[n,r]:e.mutableSourceEagerHydrationData.push(n,r);return new Gl(e)};gn.render=function(t,e,n){if(!Vl(e))throw Error(ie(200));return Wl(null,t,e,!1,n)};gn.unmountComponentAtNode=function(t){if(!Vl(t))throw Error(ie(40));return t._reactRootContainer?(Mr(function(){Wl(null,null,t,!1,function(){t._reactRootContainer=null,t[hi]=null})}),!0):!1};gn.unstable_batchedUpdates=ed;gn.unstable_renderSubtreeIntoContainer=function(t,e,n,i){if(!Vl(n))throw Error(ie(200));if(t==null||t._reactInternals===void 0)throw Error(ie(38));return Wl(t,e,n,!1,i)};gn.version="18.3.1-next-f1338f8080-20240426";function R_(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(R_)}catch(t){console.error(t)}}R_(),Rm.exports=gn;var jx=Rm.exports,Uh=jx;ac.createRoot=Uh.createRoot,ac.hydrateRoot=Uh.hydrateRoot;const Yx="http://127.0.0.1:8000";function ef(t){try{const e=new URL(t);return e.protocol=e.protocol==="https:"?"wss:":"ws:",e.pathname=e.pathname.replace(/\/$/,""),e.pathname+="/stream",e.search="",e.toString()}catch{return"ws://127.0.0.1:8000/stream"}}const C_=Yx,qx=ef(C_);function $x(t,e){const{autoConnect:n=!1,historySize:i=600}=e??{},[r,s]=pe.useState(!1),[o,a]=pe.useState(!1),[l,u]=pe.useState(null),[f,h]=pe.useState([]),[d,m]=pe.useState(0),[x,v]=pe.useState(0),[p,c]=pe.useState(null),_=pe.useRef(null),g=pe.useRef(!1),y=pe.useRef([]),M=pe.useRef(null),A=pe.useRef(null),w=pe.useCallback(I=>{try{if(typeof I.data!="string")return;const G=JSON.parse(I.data);if(!G||G.ok===!1||!G.pose)return;u(G),m(W=>W+1);const L=performance.now(),D=y.current;for(D.push(L);D.length&&L-D[0]>1e3;)D.shift();if(v(D.length),typeof G.t=="number"){const W=performance.now()/1e3;if(M.current==null||A.current==null)M.current=G.t,A.current=W,c(0);else{const F=A.current+(G.t-M.current),B=Math.max(0,W-F)*1e3;c(B)}}else c(null);const z={seq:G.tag_tx_seq??0,t:typeof G.t=="number"?G.t:Date.now()/1e3,x:G.pose.x??0,y:G.pose.y??0,z:G.pose.z??0};h(W=>{const F=[...W,z];return F.length>i&&F.splice(0,F.length-i),F})}catch(G){console.warn("Failed to parse pose payload",G)}},[i]),b=pe.useCallback(()=>{var L;if(!t)return;try{(L=_.current)==null||L.close()}catch{}let I=t;try{const D=new URL(t);D.pathname=D.pathname.replace(/\/+/g,"/"),I=D.toString()}catch{}const G=new WebSocket(I);_.current=G,a(!0),G.onopen=()=>{s(!0),a(!1)},G.onmessage=w,G.onclose=()=>{s(!1),a(!1),_.current=null,g.current&&setTimeout(()=>{g.current&&b()},1e3)},G.onerror=()=>{a(!1)}},[w,t]),S=pe.useCallback(()=>{t&&(g.current=!0,b())},[b,t]),R=pe.useCallback(()=>{var I;g.current=!1,a(!1);try{(I=_.current)==null||I.close()}catch{}_.current=null},[]),H=pe.useCallback(()=>{h([]),m(0),y.current=[],v(0),M.current=null,A.current=null,c(null),u(null)},[]);return pe.useEffect(()=>(n&&t&&S(),()=>{var I;g.current=!1;try{(I=_.current)==null||I.close()}catch{}_.current=null,M.current=null,A.current=null}),[n,S,t]),{connected:r,connecting:o,lastMessage:l,trail:f,messageCount:d,fps:x,latencyMs:p,connect:S,disconnect:R,clearTrail:H}}/**
 * @license
 * Copyright 2010-2023 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const ld="159",Lr={ROTATE:0,DOLLY:1,PAN:2},Dr={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Kx=0,Nh=1,Zx=2,b_=1,Qx=2,ii=3,Ki=0,an=1,oi=2,Vi=0,xs=1,Ih=2,Fh=3,Oh=4,Jx=5,ur=100,ey=101,ty=102,zh=103,kh=104,ny=200,iy=201,ry=202,sy=203,tf=204,nf=205,oy=206,ay=207,ly=208,uy=209,cy=210,fy=211,dy=212,hy=213,py=214,my=0,gy=1,_y=2,Ml=3,vy=4,xy=5,yy=6,Sy=7,P_=0,My=1,Ey=2,Wi=0,Ty=1,wy=2,Ay=3,Ry=4,Cy=5,L_=300,Cs=301,bs=302,rf=303,sf=304,Xl=306,of=1e3,On=1001,af=1002,Kt=1003,Bh=1004,Au=1005,Mn=1006,by=1007,Oo=1008,Xi=1009,Py=1010,Ly=1011,ud=1012,D_=1013,Ui=1014,Ni=1015,zo=1016,U_=1017,N_=1018,gr=1020,Dy=1021,zn=1023,Uy=1024,Ny=1025,_r=1026,Ps=1027,Iy=1028,I_=1029,Fy=1030,F_=1031,O_=1033,Ru=33776,Cu=33777,bu=33778,Pu=33779,Hh=35840,Gh=35841,Vh=35842,Wh=35843,z_=36196,Xh=37492,jh=37496,Yh=37808,qh=37809,$h=37810,Kh=37811,Zh=37812,Qh=37813,Jh=37814,ep=37815,tp=37816,np=37817,ip=37818,rp=37819,sp=37820,op=37821,Lu=36492,ap=36494,lp=36495,Oy=36283,up=36284,cp=36285,fp=36286,k_=3e3,ji=3001,zy=3200,ky=3201,B_=0,By=1,wn="",Nt="srgb",gi="srgb-linear",cd="display-p3",jl="display-p3-linear",El="linear",rt="srgb",Tl="rec709",wl="p3",Ur=7680,dp=519,Hy=512,Gy=513,Vy=514,H_=515,Wy=516,Xy=517,jy=518,Yy=519,lf=35044,hp="300 es",uf=1035,ci=2e3,Al=2001;class Cr{addEventListener(e,n){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(n)===-1&&i[e].push(n)}hasEventListener(e,n){if(this._listeners===void 0)return!1;const i=this._listeners;return i[e]!==void 0&&i[e].indexOf(n)!==-1}removeEventListener(e,n){if(this._listeners===void 0)return;const r=this._listeners[e];if(r!==void 0){const s=r.indexOf(n);s!==-1&&r.splice(s,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const i=this._listeners[e.type];if(i!==void 0){e.target=this;const r=i.slice(0);for(let s=0,o=r.length;s<o;s++)r[s].call(this,e);e.target=null}}}const Ht=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Ka=Math.PI/180,cf=180/Math.PI;function Yi(){const t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Ht[t&255]+Ht[t>>8&255]+Ht[t>>16&255]+Ht[t>>24&255]+"-"+Ht[e&255]+Ht[e>>8&255]+"-"+Ht[e>>16&15|64]+Ht[e>>24&255]+"-"+Ht[n&63|128]+Ht[n>>8&255]+"-"+Ht[n>>16&255]+Ht[n>>24&255]+Ht[i&255]+Ht[i>>8&255]+Ht[i>>16&255]+Ht[i>>24&255]).toLowerCase()}function Zt(t,e,n){return Math.max(e,Math.min(n,t))}function qy(t,e){return(t%e+e)%e}function Du(t,e,n){return(1-n)*t+n*e}function pp(t){return(t&t-1)===0&&t!==0}function ff(t){return Math.pow(2,Math.floor(Math.log(t)/Math.LN2))}function ai(t,e){switch(e.constructor){case Float32Array:return t;case Uint32Array:return t/4294967295;case Uint16Array:return t/65535;case Uint8Array:return t/255;case Int32Array:return Math.max(t/2147483647,-1);case Int16Array:return Math.max(t/32767,-1);case Int8Array:return Math.max(t/127,-1);default:throw new Error("Invalid component type.")}}function Je(t,e){switch(e.constructor){case Float32Array:return t;case Uint32Array:return Math.round(t*4294967295);case Uint16Array:return Math.round(t*65535);case Uint8Array:return Math.round(t*255);case Int32Array:return Math.round(t*2147483647);case Int16Array:return Math.round(t*32767);case Int8Array:return Math.round(t*127);default:throw new Error("Invalid component type.")}}const $y={DEG2RAD:Ka};class Re{constructor(e=0,n=0){Re.prototype.isVector2=!0,this.x=e,this.y=n}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,n){return this.x=e,this.y=n,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const n=this.x,i=this.y,r=e.elements;return this.x=r[0]*n+r[3]*i+r[6],this.y=r[1]*n+r[4]*i+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,n){return this.x=Math.max(e.x,Math.min(n.x,this.x)),this.y=Math.max(e.y,Math.min(n.y,this.y)),this}clampScalar(e,n){return this.x=Math.max(e,Math.min(n,this.x)),this.y=Math.max(e,Math.min(n,this.y)),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(n,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const n=Math.sqrt(this.lengthSq()*e.lengthSq());if(n===0)return Math.PI/2;const i=this.dot(e)/n;return Math.acos(Zt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const n=this.x-e.x,i=this.y-e.y;return n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this}rotateAround(e,n){const i=Math.cos(n),r=Math.sin(n),s=this.x-e.x,o=this.y-e.y;return this.x=s*i-o*r+e.x,this.y=s*r+o*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Ye{constructor(e,n,i,r,s,o,a,l,u){Ye.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,n,i,r,s,o,a,l,u)}set(e,n,i,r,s,o,a,l,u){const f=this.elements;return f[0]=e,f[1]=r,f[2]=a,f[3]=n,f[4]=s,f[5]=l,f[6]=i,f[7]=o,f[8]=u,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const n=this.elements,i=e.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],this}extractBasis(e,n,i){return e.setFromMatrix3Column(this,0),n.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const n=e.elements;return this.set(n[0],n[4],n[8],n[1],n[5],n[9],n[2],n[6],n[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,n){const i=e.elements,r=n.elements,s=this.elements,o=i[0],a=i[3],l=i[6],u=i[1],f=i[4],h=i[7],d=i[2],m=i[5],x=i[8],v=r[0],p=r[3],c=r[6],_=r[1],g=r[4],y=r[7],M=r[2],A=r[5],w=r[8];return s[0]=o*v+a*_+l*M,s[3]=o*p+a*g+l*A,s[6]=o*c+a*y+l*w,s[1]=u*v+f*_+h*M,s[4]=u*p+f*g+h*A,s[7]=u*c+f*y+h*w,s[2]=d*v+m*_+x*M,s[5]=d*p+m*g+x*A,s[8]=d*c+m*y+x*w,this}multiplyScalar(e){const n=this.elements;return n[0]*=e,n[3]*=e,n[6]*=e,n[1]*=e,n[4]*=e,n[7]*=e,n[2]*=e,n[5]*=e,n[8]*=e,this}determinant(){const e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],u=e[7],f=e[8];return n*o*f-n*a*u-i*s*f+i*a*l+r*s*u-r*o*l}invert(){const e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],u=e[7],f=e[8],h=f*o-a*u,d=a*l-f*s,m=u*s-o*l,x=n*h+i*d+r*m;if(x===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/x;return e[0]=h*v,e[1]=(r*u-f*i)*v,e[2]=(a*i-r*o)*v,e[3]=d*v,e[4]=(f*n-r*l)*v,e[5]=(r*s-a*n)*v,e[6]=m*v,e[7]=(i*l-u*n)*v,e[8]=(o*n-i*s)*v,this}transpose(){let e;const n=this.elements;return e=n[1],n[1]=n[3],n[3]=e,e=n[2],n[2]=n[6],n[6]=e,e=n[5],n[5]=n[7],n[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const n=this.elements;return e[0]=n[0],e[1]=n[3],e[2]=n[6],e[3]=n[1],e[4]=n[4],e[5]=n[7],e[6]=n[2],e[7]=n[5],e[8]=n[8],this}setUvTransform(e,n,i,r,s,o,a){const l=Math.cos(s),u=Math.sin(s);return this.set(i*l,i*u,-i*(l*o+u*a)+o+e,-r*u,r*l,-r*(-u*o+l*a)+a+n,0,0,1),this}scale(e,n){return this.premultiply(Uu.makeScale(e,n)),this}rotate(e){return this.premultiply(Uu.makeRotation(-e)),this}translate(e,n){return this.premultiply(Uu.makeTranslation(e,n)),this}makeTranslation(e,n){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,n,0,0,1),this}makeRotation(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,-i,0,i,n,0,0,0,1),this}makeScale(e,n){return this.set(e,0,0,0,n,0,0,0,1),this}equals(e){const n=this.elements,i=e.elements;for(let r=0;r<9;r++)if(n[r]!==i[r])return!1;return!0}fromArray(e,n=0){for(let i=0;i<9;i++)this.elements[i]=e[i+n];return this}toArray(e=[],n=0){const i=this.elements;return e[n]=i[0],e[n+1]=i[1],e[n+2]=i[2],e[n+3]=i[3],e[n+4]=i[4],e[n+5]=i[5],e[n+6]=i[6],e[n+7]=i[7],e[n+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Uu=new Ye;function G_(t){for(let e=t.length-1;e>=0;--e)if(t[e]>=65535)return!0;return!1}function Rl(t){return document.createElementNS("http://www.w3.org/1999/xhtml",t)}function Ky(){const t=Rl("canvas");return t.style.display="block",t}const mp={};function xo(t){t in mp||(mp[t]=!0,console.warn(t))}const gp=new Ye().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),_p=new Ye().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),fa={[gi]:{transfer:El,primaries:Tl,toReference:t=>t,fromReference:t=>t},[Nt]:{transfer:rt,primaries:Tl,toReference:t=>t.convertSRGBToLinear(),fromReference:t=>t.convertLinearToSRGB()},[jl]:{transfer:El,primaries:wl,toReference:t=>t.applyMatrix3(_p),fromReference:t=>t.applyMatrix3(gp)},[cd]:{transfer:rt,primaries:wl,toReference:t=>t.convertSRGBToLinear().applyMatrix3(_p),fromReference:t=>t.applyMatrix3(gp).convertLinearToSRGB()}},Zy=new Set([gi,jl]),Qe={enabled:!0,_workingColorSpace:gi,get legacyMode(){return console.warn("THREE.ColorManagement: .legacyMode=false renamed to .enabled=true in r150."),!this.enabled},set legacyMode(t){console.warn("THREE.ColorManagement: .legacyMode=false renamed to .enabled=true in r150."),this.enabled=!t},get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(t){if(!Zy.has(t))throw new Error(`Unsupported working color space, "${t}".`);this._workingColorSpace=t},convert:function(t,e,n){if(this.enabled===!1||e===n||!e||!n)return t;const i=fa[e].toReference,r=fa[n].fromReference;return r(i(t))},fromWorkingColorSpace:function(t,e){return this.convert(t,this._workingColorSpace,e)},toWorkingColorSpace:function(t,e){return this.convert(t,e,this._workingColorSpace)},getPrimaries:function(t){return fa[t].primaries},getTransfer:function(t){return t===wn?El:fa[t].transfer}};function ys(t){return t<.04045?t*.0773993808:Math.pow(t*.9478672986+.0521327014,2.4)}function Nu(t){return t<.0031308?t*12.92:1.055*Math.pow(t,.41666)-.055}let Nr;class V_{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Nr===void 0&&(Nr=Rl("canvas")),Nr.width=e.width,Nr.height=e.height;const i=Nr.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),n=Nr}return n.width>2048||n.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),n.toDataURL("image/jpeg",.6)):n.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const n=Rl("canvas");n.width=e.width,n.height=e.height;const i=n.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const r=i.getImageData(0,0,e.width,e.height),s=r.data;for(let o=0;o<s.length;o++)s[o]=ys(s[o]/255)*255;return i.putImageData(r,0,0),n}else if(e.data){const n=e.data.slice(0);for(let i=0;i<n.length;i++)n instanceof Uint8Array||n instanceof Uint8ClampedArray?n[i]=Math.floor(ys(n[i]/255)*255):n[i]=ys(n[i]);return{data:n,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Qy=0;class W_{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Qy++}),this.uuid=Yi(),this.data=e,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const n=e===void 0||typeof e=="string";if(!n&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let o=0,a=r.length;o<a;o++)r[o].isDataTexture?s.push(Iu(r[o].image)):s.push(Iu(r[o]))}else s=Iu(r);i.url=s}return n||(e.images[this.uuid]=i),i}}function Iu(t){return typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap?V_.getDataURL(t):t.data?{data:Array.from(t.data),width:t.width,height:t.height,type:t.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Jy=0;class ln extends Cr{constructor(e=ln.DEFAULT_IMAGE,n=ln.DEFAULT_MAPPING,i=On,r=On,s=Mn,o=Oo,a=zn,l=Xi,u=ln.DEFAULT_ANISOTROPY,f=wn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Jy++}),this.uuid=Yi(),this.name="",this.source=new W_(e),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=i,this.wrapT=r,this.magFilter=s,this.minFilter=o,this.anisotropy=u,this.format=a,this.internalFormat=null,this.type=l,this.offset=new Re(0,0),this.repeat=new Re(1,1),this.center=new Re(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ye,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof f=="string"?this.colorSpace=f:(xo("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=f===ji?Nt:wn),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const n=e===void 0||typeof e=="string";if(!n&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),n||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==L_)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case of:e.x=e.x-Math.floor(e.x);break;case On:e.x=e.x<0?0:1;break;case af:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case of:e.y=e.y-Math.floor(e.y);break;case On:e.y=e.y<0?0:1;break;case af:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return xo("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===Nt?ji:k_}set encoding(e){xo("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=e===ji?Nt:wn}}ln.DEFAULT_IMAGE=null;ln.DEFAULT_MAPPING=L_;ln.DEFAULT_ANISOTROPY=1;class Lt{constructor(e=0,n=0,i=0,r=1){Lt.prototype.isVector4=!0,this.x=e,this.y=n,this.z=i,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,n,i,r){return this.x=e,this.y=n,this.z=i,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;case 3:this.w=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this.z=e.z+n.z,this.w=e.w+n.w,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this.z+=e.z*n,this.w+=e.w*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this.z=e.z-n.z,this.w=e.w-n.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const n=this.x,i=this.y,r=this.z,s=this.w,o=e.elements;return this.x=o[0]*n+o[4]*i+o[8]*r+o[12]*s,this.y=o[1]*n+o[5]*i+o[9]*r+o[13]*s,this.z=o[2]*n+o[6]*i+o[10]*r+o[14]*s,this.w=o[3]*n+o[7]*i+o[11]*r+o[15]*s,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const n=Math.sqrt(1-e.w*e.w);return n<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/n,this.y=e.y/n,this.z=e.z/n),this}setAxisAngleFromRotationMatrix(e){let n,i,r,s;const l=e.elements,u=l[0],f=l[4],h=l[8],d=l[1],m=l[5],x=l[9],v=l[2],p=l[6],c=l[10];if(Math.abs(f-d)<.01&&Math.abs(h-v)<.01&&Math.abs(x-p)<.01){if(Math.abs(f+d)<.1&&Math.abs(h+v)<.1&&Math.abs(x+p)<.1&&Math.abs(u+m+c-3)<.1)return this.set(1,0,0,0),this;n=Math.PI;const g=(u+1)/2,y=(m+1)/2,M=(c+1)/2,A=(f+d)/4,w=(h+v)/4,b=(x+p)/4;return g>y&&g>M?g<.01?(i=0,r=.707106781,s=.707106781):(i=Math.sqrt(g),r=A/i,s=w/i):y>M?y<.01?(i=.707106781,r=0,s=.707106781):(r=Math.sqrt(y),i=A/r,s=b/r):M<.01?(i=.707106781,r=.707106781,s=0):(s=Math.sqrt(M),i=w/s,r=b/s),this.set(i,r,s,n),this}let _=Math.sqrt((p-x)*(p-x)+(h-v)*(h-v)+(d-f)*(d-f));return Math.abs(_)<.001&&(_=1),this.x=(p-x)/_,this.y=(h-v)/_,this.z=(d-f)/_,this.w=Math.acos((u+m+c-1)/2),this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,n){return this.x=Math.max(e.x,Math.min(n.x,this.x)),this.y=Math.max(e.y,Math.min(n.y,this.y)),this.z=Math.max(e.z,Math.min(n.z,this.z)),this.w=Math.max(e.w,Math.min(n.w,this.w)),this}clampScalar(e,n){return this.x=Math.max(e,Math.min(n,this.x)),this.y=Math.max(e,Math.min(n,this.y)),this.z=Math.max(e,Math.min(n,this.z)),this.w=Math.max(e,Math.min(n,this.w)),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(n,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this.z+=(e.z-this.z)*n,this.w+=(e.w-this.w)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this.z=e.z+(n.z-e.z)*i,this.w=e.w+(n.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this.z=e[n+2],this.w=e[n+3],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e[n+2]=this.z,e[n+3]=this.w,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this.z=e.getZ(n),this.w=e.getW(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class eS extends Cr{constructor(e=1,n=1,i={}){super(),this.isRenderTarget=!0,this.width=e,this.height=n,this.depth=1,this.scissor=new Lt(0,0,e,n),this.scissorTest=!1,this.viewport=new Lt(0,0,e,n);const r={width:e,height:n,depth:1};i.encoding!==void 0&&(xo("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),i.colorSpace=i.encoding===ji?Nt:wn),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Mn,depthBuffer:!0,stencilBuffer:!1,depthTexture:null,samples:0},i),this.texture=new ln(r,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=i.generateMipmaps,this.texture.internalFormat=i.internalFormat,this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}setSize(e,n,i=1){(this.width!==e||this.height!==n||this.depth!==i)&&(this.width=e,this.height=n,this.depth=i,this.texture.image.width=e,this.texture.image.height=n,this.texture.image.depth=i,this.dispose()),this.viewport.set(0,0,e,n),this.scissor.set(0,0,e,n)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.texture=e.texture.clone(),this.texture.isRenderTargetTexture=!0;const n=Object.assign({},e.texture.image);return this.texture.source=new W_(n),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Er extends eS{constructor(e=1,n=1,i={}){super(e,n,i),this.isWebGLRenderTarget=!0}}class X_ extends ln{constructor(e=null,n=1,i=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:n,height:i,depth:r},this.magFilter=Kt,this.minFilter=Kt,this.wrapR=On,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class tS extends ln{constructor(e=null,n=1,i=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:n,height:i,depth:r},this.magFilter=Kt,this.minFilter=Kt,this.wrapR=On,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Tr{constructor(e=0,n=0,i=0,r=1){this.isQuaternion=!0,this._x=e,this._y=n,this._z=i,this._w=r}static slerpFlat(e,n,i,r,s,o,a){let l=i[r+0],u=i[r+1],f=i[r+2],h=i[r+3];const d=s[o+0],m=s[o+1],x=s[o+2],v=s[o+3];if(a===0){e[n+0]=l,e[n+1]=u,e[n+2]=f,e[n+3]=h;return}if(a===1){e[n+0]=d,e[n+1]=m,e[n+2]=x,e[n+3]=v;return}if(h!==v||l!==d||u!==m||f!==x){let p=1-a;const c=l*d+u*m+f*x+h*v,_=c>=0?1:-1,g=1-c*c;if(g>Number.EPSILON){const M=Math.sqrt(g),A=Math.atan2(M,c*_);p=Math.sin(p*A)/M,a=Math.sin(a*A)/M}const y=a*_;if(l=l*p+d*y,u=u*p+m*y,f=f*p+x*y,h=h*p+v*y,p===1-a){const M=1/Math.sqrt(l*l+u*u+f*f+h*h);l*=M,u*=M,f*=M,h*=M}}e[n]=l,e[n+1]=u,e[n+2]=f,e[n+3]=h}static multiplyQuaternionsFlat(e,n,i,r,s,o){const a=i[r],l=i[r+1],u=i[r+2],f=i[r+3],h=s[o],d=s[o+1],m=s[o+2],x=s[o+3];return e[n]=a*x+f*h+l*m-u*d,e[n+1]=l*x+f*d+u*h-a*m,e[n+2]=u*x+f*m+a*d-l*h,e[n+3]=f*x-a*h-l*d-u*m,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,n,i,r){return this._x=e,this._y=n,this._z=i,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,n){const i=e._x,r=e._y,s=e._z,o=e._order,a=Math.cos,l=Math.sin,u=a(i/2),f=a(r/2),h=a(s/2),d=l(i/2),m=l(r/2),x=l(s/2);switch(o){case"XYZ":this._x=d*f*h+u*m*x,this._y=u*m*h-d*f*x,this._z=u*f*x+d*m*h,this._w=u*f*h-d*m*x;break;case"YXZ":this._x=d*f*h+u*m*x,this._y=u*m*h-d*f*x,this._z=u*f*x-d*m*h,this._w=u*f*h+d*m*x;break;case"ZXY":this._x=d*f*h-u*m*x,this._y=u*m*h+d*f*x,this._z=u*f*x+d*m*h,this._w=u*f*h-d*m*x;break;case"ZYX":this._x=d*f*h-u*m*x,this._y=u*m*h+d*f*x,this._z=u*f*x-d*m*h,this._w=u*f*h+d*m*x;break;case"YZX":this._x=d*f*h+u*m*x,this._y=u*m*h+d*f*x,this._z=u*f*x-d*m*h,this._w=u*f*h-d*m*x;break;case"XZY":this._x=d*f*h-u*m*x,this._y=u*m*h-d*f*x,this._z=u*f*x+d*m*h,this._w=u*f*h+d*m*x;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return n!==!1&&this._onChangeCallback(),this}setFromAxisAngle(e,n){const i=n/2,r=Math.sin(i);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const n=e.elements,i=n[0],r=n[4],s=n[8],o=n[1],a=n[5],l=n[9],u=n[2],f=n[6],h=n[10],d=i+a+h;if(d>0){const m=.5/Math.sqrt(d+1);this._w=.25/m,this._x=(f-l)*m,this._y=(s-u)*m,this._z=(o-r)*m}else if(i>a&&i>h){const m=2*Math.sqrt(1+i-a-h);this._w=(f-l)/m,this._x=.25*m,this._y=(r+o)/m,this._z=(s+u)/m}else if(a>h){const m=2*Math.sqrt(1+a-i-h);this._w=(s-u)/m,this._x=(r+o)/m,this._y=.25*m,this._z=(l+f)/m}else{const m=2*Math.sqrt(1+h-i-a);this._w=(o-r)/m,this._x=(s+u)/m,this._y=(l+f)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(e,n){let i=e.dot(n)+1;return i<Number.EPSILON?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*n.z-e.z*n.y,this._y=e.z*n.x-e.x*n.z,this._z=e.x*n.y-e.y*n.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Zt(this.dot(e),-1,1)))}rotateTowards(e,n){const i=this.angleTo(e);if(i===0)return this;const r=Math.min(1,n/i);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,n){const i=e._x,r=e._y,s=e._z,o=e._w,a=n._x,l=n._y,u=n._z,f=n._w;return this._x=i*f+o*a+r*u-s*l,this._y=r*f+o*l+s*a-i*u,this._z=s*f+o*u+i*l-r*a,this._w=o*f-i*a-r*l-s*u,this._onChangeCallback(),this}slerp(e,n){if(n===0)return this;if(n===1)return this.copy(e);const i=this._x,r=this._y,s=this._z,o=this._w;let a=o*e._w+i*e._x+r*e._y+s*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=i,this._y=r,this._z=s,this;const l=1-a*a;if(l<=Number.EPSILON){const m=1-n;return this._w=m*o+n*this._w,this._x=m*i+n*this._x,this._y=m*r+n*this._y,this._z=m*s+n*this._z,this.normalize(),this._onChangeCallback(),this}const u=Math.sqrt(l),f=Math.atan2(u,a),h=Math.sin((1-n)*f)/u,d=Math.sin(n*f)/u;return this._w=o*h+this._w*d,this._x=i*h+this._x*d,this._y=r*h+this._y*d,this._z=s*h+this._z*d,this._onChangeCallback(),this}slerpQuaternions(e,n,i){return this.copy(e).slerp(n,i)}random(){const e=Math.random(),n=Math.sqrt(1-e),i=Math.sqrt(e),r=2*Math.PI*Math.random(),s=2*Math.PI*Math.random();return this.set(n*Math.cos(r),i*Math.sin(s),i*Math.cos(s),n*Math.sin(r))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,n=0){return this._x=e[n],this._y=e[n+1],this._z=e[n+2],this._w=e[n+3],this._onChangeCallback(),this}toArray(e=[],n=0){return e[n]=this._x,e[n+1]=this._y,e[n+2]=this._z,e[n+3]=this._w,e}fromBufferAttribute(e,n){return this._x=e.getX(n),this._y=e.getY(n),this._z=e.getZ(n),this._w=e.getW(n),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class N{constructor(e=0,n=0,i=0){N.prototype.isVector3=!0,this.x=e,this.y=n,this.z=i}set(e,n,i){return i===void 0&&(i=this.z),this.x=e,this.y=n,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this.z=e.z+n.z,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this.z+=e.z*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this.z=e.z-n.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,n){return this.x=e.x*n.x,this.y=e.y*n.y,this.z=e.z*n.z,this}applyEuler(e){return this.applyQuaternion(vp.setFromEuler(e))}applyAxisAngle(e,n){return this.applyQuaternion(vp.setFromAxisAngle(e,n))}applyMatrix3(e){const n=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*n+s[3]*i+s[6]*r,this.y=s[1]*n+s[4]*i+s[7]*r,this.z=s[2]*n+s[5]*i+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const n=this.x,i=this.y,r=this.z,s=e.elements,o=1/(s[3]*n+s[7]*i+s[11]*r+s[15]);return this.x=(s[0]*n+s[4]*i+s[8]*r+s[12])*o,this.y=(s[1]*n+s[5]*i+s[9]*r+s[13])*o,this.z=(s[2]*n+s[6]*i+s[10]*r+s[14])*o,this}applyQuaternion(e){const n=this.x,i=this.y,r=this.z,s=e.x,o=e.y,a=e.z,l=e.w,u=2*(o*r-a*i),f=2*(a*n-s*r),h=2*(s*i-o*n);return this.x=n+l*u+o*h-a*f,this.y=i+l*f+a*u-s*h,this.z=r+l*h+s*f-o*u,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const n=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*n+s[4]*i+s[8]*r,this.y=s[1]*n+s[5]*i+s[9]*r,this.z=s[2]*n+s[6]*i+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,n){return this.x=Math.max(e.x,Math.min(n.x,this.x)),this.y=Math.max(e.y,Math.min(n.y,this.y)),this.z=Math.max(e.z,Math.min(n.z,this.z)),this}clampScalar(e,n){return this.x=Math.max(e,Math.min(n,this.x)),this.y=Math.max(e,Math.min(n,this.y)),this.z=Math.max(e,Math.min(n,this.z)),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(n,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this.z+=(e.z-this.z)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this.z=e.z+(n.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,n){const i=e.x,r=e.y,s=e.z,o=n.x,a=n.y,l=n.z;return this.x=r*l-s*a,this.y=s*o-i*l,this.z=i*a-r*o,this}projectOnVector(e){const n=e.lengthSq();if(n===0)return this.set(0,0,0);const i=e.dot(this)/n;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return Fu.copy(this).projectOnVector(e),this.sub(Fu)}reflect(e){return this.sub(Fu.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const n=Math.sqrt(this.lengthSq()*e.lengthSq());if(n===0)return Math.PI/2;const i=this.dot(e)/n;return Math.acos(Zt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const n=this.x-e.x,i=this.y-e.y,r=this.z-e.z;return n*n+i*i+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,n,i){const r=Math.sin(n)*e;return this.x=r*Math.sin(i),this.y=Math.cos(n)*e,this.z=r*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,n,i){return this.x=e*Math.sin(n),this.y=i,this.z=e*Math.cos(n),this}setFromMatrixPosition(e){const n=e.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this}setFromMatrixScale(e){const n=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=n,this.y=i,this.z=r,this}setFromMatrixColumn(e,n){return this.fromArray(e.elements,n*4)}setFromMatrix3Column(e,n){return this.fromArray(e.elements,n*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this.z=e[n+2],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e[n+2]=this.z,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this.z=e.getZ(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=(Math.random()-.5)*2,n=Math.random()*Math.PI*2,i=Math.sqrt(1-e**2);return this.x=i*Math.cos(n),this.y=i*Math.sin(n),this.z=e,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Fu=new N,vp=new Tr;class Is{constructor(e=new N(1/0,1/0,1/0),n=new N(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=n}set(e,n){return this.min.copy(e),this.max.copy(n),this}setFromArray(e){this.makeEmpty();for(let n=0,i=e.length;n<i;n+=3)this.expandByPoint(Ln.fromArray(e,n));return this}setFromBufferAttribute(e){this.makeEmpty();for(let n=0,i=e.count;n<i;n++)this.expandByPoint(Ln.fromBufferAttribute(e,n));return this}setFromPoints(e){this.makeEmpty();for(let n=0,i=e.length;n<i;n++)this.expandByPoint(e[n]);return this}setFromCenterAndSize(e,n){const i=Ln.copy(n).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,n=!1){return this.makeEmpty(),this.expandByObject(e,n)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,n=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const s=i.getAttribute("position");if(n===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=s.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,Ln):Ln.fromBufferAttribute(s,o),Ln.applyMatrix4(e.matrixWorld),this.expandByPoint(Ln);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),da.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),da.copy(i.boundingBox)),da.applyMatrix4(e.matrixWorld),this.union(da)}const r=e.children;for(let s=0,o=r.length;s<o;s++)this.expandByObject(r[s],n);return this}containsPoint(e){return!(e.x<this.min.x||e.x>this.max.x||e.y<this.min.y||e.y>this.max.y||e.z<this.min.z||e.z>this.max.z)}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,n){return n.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return!(e.max.x<this.min.x||e.min.x>this.max.x||e.max.y<this.min.y||e.min.y>this.max.y||e.max.z<this.min.z||e.min.z>this.max.z)}intersectsSphere(e){return this.clampPoint(e.center,Ln),Ln.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let n,i;return e.normal.x>0?(n=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(n=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(n+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(n+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(n+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(n+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),n<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(qs),ha.subVectors(this.max,qs),Ir.subVectors(e.a,qs),Fr.subVectors(e.b,qs),Or.subVectors(e.c,qs),xi.subVectors(Fr,Ir),yi.subVectors(Or,Fr),nr.subVectors(Ir,Or);let n=[0,-xi.z,xi.y,0,-yi.z,yi.y,0,-nr.z,nr.y,xi.z,0,-xi.x,yi.z,0,-yi.x,nr.z,0,-nr.x,-xi.y,xi.x,0,-yi.y,yi.x,0,-nr.y,nr.x,0];return!Ou(n,Ir,Fr,Or,ha)||(n=[1,0,0,0,1,0,0,0,1],!Ou(n,Ir,Fr,Or,ha))?!1:(pa.crossVectors(xi,yi),n=[pa.x,pa.y,pa.z],Ou(n,Ir,Fr,Or,ha))}clampPoint(e,n){return n.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Ln).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Ln).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Qn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Qn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Qn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Qn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Qn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Qn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Qn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Qn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Qn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const Qn=[new N,new N,new N,new N,new N,new N,new N,new N],Ln=new N,da=new Is,Ir=new N,Fr=new N,Or=new N,xi=new N,yi=new N,nr=new N,qs=new N,ha=new N,pa=new N,ir=new N;function Ou(t,e,n,i,r){for(let s=0,o=t.length-3;s<=o;s+=3){ir.fromArray(t,s);const a=r.x*Math.abs(ir.x)+r.y*Math.abs(ir.y)+r.z*Math.abs(ir.z),l=e.dot(ir),u=n.dot(ir),f=i.dot(ir);if(Math.max(-Math.max(l,u,f),Math.min(l,u,f))>a)return!1}return!0}const nS=new Is,$s=new N,zu=new N;class Yl{constructor(e=new N,n=-1){this.center=e,this.radius=n}set(e,n){return this.center.copy(e),this.radius=n,this}setFromPoints(e,n){const i=this.center;n!==void 0?i.copy(n):nS.setFromPoints(e).getCenter(i);let r=0;for(let s=0,o=e.length;s<o;s++)r=Math.max(r,i.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const n=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=n*n}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,n){const i=this.center.distanceToSquared(e);return n.copy(e),i>this.radius*this.radius&&(n.sub(this.center).normalize(),n.multiplyScalar(this.radius).add(this.center)),n}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;$s.subVectors(e,this.center);const n=$s.lengthSq();if(n>this.radius*this.radius){const i=Math.sqrt(n),r=(i-this.radius)*.5;this.center.addScaledVector($s,r/i),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(zu.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint($s.copy(e.center).add(zu)),this.expandByPoint($s.copy(e.center).sub(zu))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Jn=new N,ku=new N,ma=new N,Si=new N,Bu=new N,ga=new N,Hu=new N;class fd{constructor(e=new N,n=new N(0,0,-1)){this.origin=e,this.direction=n}set(e,n){return this.origin.copy(e),this.direction.copy(n),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,n){return n.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Jn)),this}closestPointToPoint(e,n){n.subVectors(e,this.origin);const i=n.dot(this.direction);return i<0?n.copy(this.origin):n.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const n=Jn.subVectors(e,this.origin).dot(this.direction);return n<0?this.origin.distanceToSquared(e):(Jn.copy(this.origin).addScaledVector(this.direction,n),Jn.distanceToSquared(e))}distanceSqToSegment(e,n,i,r){ku.copy(e).add(n).multiplyScalar(.5),ma.copy(n).sub(e).normalize(),Si.copy(this.origin).sub(ku);const s=e.distanceTo(n)*.5,o=-this.direction.dot(ma),a=Si.dot(this.direction),l=-Si.dot(ma),u=Si.lengthSq(),f=Math.abs(1-o*o);let h,d,m,x;if(f>0)if(h=o*l-a,d=o*a-l,x=s*f,h>=0)if(d>=-x)if(d<=x){const v=1/f;h*=v,d*=v,m=h*(h+o*d+2*a)+d*(o*h+d+2*l)+u}else d=s,h=Math.max(0,-(o*d+a)),m=-h*h+d*(d+2*l)+u;else d=-s,h=Math.max(0,-(o*d+a)),m=-h*h+d*(d+2*l)+u;else d<=-x?(h=Math.max(0,-(-o*s+a)),d=h>0?-s:Math.min(Math.max(-s,-l),s),m=-h*h+d*(d+2*l)+u):d<=x?(h=0,d=Math.min(Math.max(-s,-l),s),m=d*(d+2*l)+u):(h=Math.max(0,-(o*s+a)),d=h>0?s:Math.min(Math.max(-s,-l),s),m=-h*h+d*(d+2*l)+u);else d=o>0?-s:s,h=Math.max(0,-(o*d+a)),m=-h*h+d*(d+2*l)+u;return i&&i.copy(this.origin).addScaledVector(this.direction,h),r&&r.copy(ku).addScaledVector(ma,d),m}intersectSphere(e,n){Jn.subVectors(e.center,this.origin);const i=Jn.dot(this.direction),r=Jn.dot(Jn)-i*i,s=e.radius*e.radius;if(r>s)return null;const o=Math.sqrt(s-r),a=i-o,l=i+o;return l<0?null:a<0?this.at(l,n):this.at(a,n)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const n=e.normal.dot(this.direction);if(n===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/n;return i>=0?i:null}intersectPlane(e,n){const i=this.distanceToPlane(e);return i===null?null:this.at(i,n)}intersectsPlane(e){const n=e.distanceToPoint(this.origin);return n===0||e.normal.dot(this.direction)*n<0}intersectBox(e,n){let i,r,s,o,a,l;const u=1/this.direction.x,f=1/this.direction.y,h=1/this.direction.z,d=this.origin;return u>=0?(i=(e.min.x-d.x)*u,r=(e.max.x-d.x)*u):(i=(e.max.x-d.x)*u,r=(e.min.x-d.x)*u),f>=0?(s=(e.min.y-d.y)*f,o=(e.max.y-d.y)*f):(s=(e.max.y-d.y)*f,o=(e.min.y-d.y)*f),i>o||s>r||((s>i||isNaN(i))&&(i=s),(o<r||isNaN(r))&&(r=o),h>=0?(a=(e.min.z-d.z)*h,l=(e.max.z-d.z)*h):(a=(e.max.z-d.z)*h,l=(e.min.z-d.z)*h),i>l||a>r)||((a>i||i!==i)&&(i=a),(l<r||r!==r)&&(r=l),r<0)?null:this.at(i>=0?i:r,n)}intersectsBox(e){return this.intersectBox(e,Jn)!==null}intersectTriangle(e,n,i,r,s){Bu.subVectors(n,e),ga.subVectors(i,e),Hu.crossVectors(Bu,ga);let o=this.direction.dot(Hu),a;if(o>0){if(r)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Si.subVectors(this.origin,e);const l=a*this.direction.dot(ga.crossVectors(Si,ga));if(l<0)return null;const u=a*this.direction.dot(Bu.cross(Si));if(u<0||l+u>o)return null;const f=-a*Si.dot(Hu);return f<0?null:this.at(f/o,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class mt{constructor(e,n,i,r,s,o,a,l,u,f,h,d,m,x,v,p){mt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,n,i,r,s,o,a,l,u,f,h,d,m,x,v,p)}set(e,n,i,r,s,o,a,l,u,f,h,d,m,x,v,p){const c=this.elements;return c[0]=e,c[4]=n,c[8]=i,c[12]=r,c[1]=s,c[5]=o,c[9]=a,c[13]=l,c[2]=u,c[6]=f,c[10]=h,c[14]=d,c[3]=m,c[7]=x,c[11]=v,c[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new mt().fromArray(this.elements)}copy(e){const n=this.elements,i=e.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],n[9]=i[9],n[10]=i[10],n[11]=i[11],n[12]=i[12],n[13]=i[13],n[14]=i[14],n[15]=i[15],this}copyPosition(e){const n=this.elements,i=e.elements;return n[12]=i[12],n[13]=i[13],n[14]=i[14],this}setFromMatrix3(e){const n=e.elements;return this.set(n[0],n[3],n[6],0,n[1],n[4],n[7],0,n[2],n[5],n[8],0,0,0,0,1),this}extractBasis(e,n,i){return e.setFromMatrixColumn(this,0),n.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,n,i){return this.set(e.x,n.x,i.x,0,e.y,n.y,i.y,0,e.z,n.z,i.z,0,0,0,0,1),this}extractRotation(e){const n=this.elements,i=e.elements,r=1/zr.setFromMatrixColumn(e,0).length(),s=1/zr.setFromMatrixColumn(e,1).length(),o=1/zr.setFromMatrixColumn(e,2).length();return n[0]=i[0]*r,n[1]=i[1]*r,n[2]=i[2]*r,n[3]=0,n[4]=i[4]*s,n[5]=i[5]*s,n[6]=i[6]*s,n[7]=0,n[8]=i[8]*o,n[9]=i[9]*o,n[10]=i[10]*o,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromEuler(e){const n=this.elements,i=e.x,r=e.y,s=e.z,o=Math.cos(i),a=Math.sin(i),l=Math.cos(r),u=Math.sin(r),f=Math.cos(s),h=Math.sin(s);if(e.order==="XYZ"){const d=o*f,m=o*h,x=a*f,v=a*h;n[0]=l*f,n[4]=-l*h,n[8]=u,n[1]=m+x*u,n[5]=d-v*u,n[9]=-a*l,n[2]=v-d*u,n[6]=x+m*u,n[10]=o*l}else if(e.order==="YXZ"){const d=l*f,m=l*h,x=u*f,v=u*h;n[0]=d+v*a,n[4]=x*a-m,n[8]=o*u,n[1]=o*h,n[5]=o*f,n[9]=-a,n[2]=m*a-x,n[6]=v+d*a,n[10]=o*l}else if(e.order==="ZXY"){const d=l*f,m=l*h,x=u*f,v=u*h;n[0]=d-v*a,n[4]=-o*h,n[8]=x+m*a,n[1]=m+x*a,n[5]=o*f,n[9]=v-d*a,n[2]=-o*u,n[6]=a,n[10]=o*l}else if(e.order==="ZYX"){const d=o*f,m=o*h,x=a*f,v=a*h;n[0]=l*f,n[4]=x*u-m,n[8]=d*u+v,n[1]=l*h,n[5]=v*u+d,n[9]=m*u-x,n[2]=-u,n[6]=a*l,n[10]=o*l}else if(e.order==="YZX"){const d=o*l,m=o*u,x=a*l,v=a*u;n[0]=l*f,n[4]=v-d*h,n[8]=x*h+m,n[1]=h,n[5]=o*f,n[9]=-a*f,n[2]=-u*f,n[6]=m*h+x,n[10]=d-v*h}else if(e.order==="XZY"){const d=o*l,m=o*u,x=a*l,v=a*u;n[0]=l*f,n[4]=-h,n[8]=u*f,n[1]=d*h+v,n[5]=o*f,n[9]=m*h-x,n[2]=x*h-m,n[6]=a*f,n[10]=v*h+d}return n[3]=0,n[7]=0,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromQuaternion(e){return this.compose(iS,e,rS)}lookAt(e,n,i){const r=this.elements;return cn.subVectors(e,n),cn.lengthSq()===0&&(cn.z=1),cn.normalize(),Mi.crossVectors(i,cn),Mi.lengthSq()===0&&(Math.abs(i.z)===1?cn.x+=1e-4:cn.z+=1e-4,cn.normalize(),Mi.crossVectors(i,cn)),Mi.normalize(),_a.crossVectors(cn,Mi),r[0]=Mi.x,r[4]=_a.x,r[8]=cn.x,r[1]=Mi.y,r[5]=_a.y,r[9]=cn.y,r[2]=Mi.z,r[6]=_a.z,r[10]=cn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,n){const i=e.elements,r=n.elements,s=this.elements,o=i[0],a=i[4],l=i[8],u=i[12],f=i[1],h=i[5],d=i[9],m=i[13],x=i[2],v=i[6],p=i[10],c=i[14],_=i[3],g=i[7],y=i[11],M=i[15],A=r[0],w=r[4],b=r[8],S=r[12],R=r[1],H=r[5],I=r[9],G=r[13],L=r[2],D=r[6],z=r[10],W=r[14],F=r[3],B=r[7],k=r[11],Q=r[15];return s[0]=o*A+a*R+l*L+u*F,s[4]=o*w+a*H+l*D+u*B,s[8]=o*b+a*I+l*z+u*k,s[12]=o*S+a*G+l*W+u*Q,s[1]=f*A+h*R+d*L+m*F,s[5]=f*w+h*H+d*D+m*B,s[9]=f*b+h*I+d*z+m*k,s[13]=f*S+h*G+d*W+m*Q,s[2]=x*A+v*R+p*L+c*F,s[6]=x*w+v*H+p*D+c*B,s[10]=x*b+v*I+p*z+c*k,s[14]=x*S+v*G+p*W+c*Q,s[3]=_*A+g*R+y*L+M*F,s[7]=_*w+g*H+y*D+M*B,s[11]=_*b+g*I+y*z+M*k,s[15]=_*S+g*G+y*W+M*Q,this}multiplyScalar(e){const n=this.elements;return n[0]*=e,n[4]*=e,n[8]*=e,n[12]*=e,n[1]*=e,n[5]*=e,n[9]*=e,n[13]*=e,n[2]*=e,n[6]*=e,n[10]*=e,n[14]*=e,n[3]*=e,n[7]*=e,n[11]*=e,n[15]*=e,this}determinant(){const e=this.elements,n=e[0],i=e[4],r=e[8],s=e[12],o=e[1],a=e[5],l=e[9],u=e[13],f=e[2],h=e[6],d=e[10],m=e[14],x=e[3],v=e[7],p=e[11],c=e[15];return x*(+s*l*h-r*u*h-s*a*d+i*u*d+r*a*m-i*l*m)+v*(+n*l*m-n*u*d+s*o*d-r*o*m+r*u*f-s*l*f)+p*(+n*u*h-n*a*m-s*o*h+i*o*m+s*a*f-i*u*f)+c*(-r*a*f-n*l*h+n*a*d+r*o*h-i*o*d+i*l*f)}transpose(){const e=this.elements;let n;return n=e[1],e[1]=e[4],e[4]=n,n=e[2],e[2]=e[8],e[8]=n,n=e[6],e[6]=e[9],e[9]=n,n=e[3],e[3]=e[12],e[12]=n,n=e[7],e[7]=e[13],e[13]=n,n=e[11],e[11]=e[14],e[14]=n,this}setPosition(e,n,i){const r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=n,r[14]=i),this}invert(){const e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],u=e[7],f=e[8],h=e[9],d=e[10],m=e[11],x=e[12],v=e[13],p=e[14],c=e[15],_=h*p*u-v*d*u+v*l*m-a*p*m-h*l*c+a*d*c,g=x*d*u-f*p*u-x*l*m+o*p*m+f*l*c-o*d*c,y=f*v*u-x*h*u+x*a*m-o*v*m-f*a*c+o*h*c,M=x*h*l-f*v*l-x*a*d+o*v*d+f*a*p-o*h*p,A=n*_+i*g+r*y+s*M;if(A===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const w=1/A;return e[0]=_*w,e[1]=(v*d*s-h*p*s-v*r*m+i*p*m+h*r*c-i*d*c)*w,e[2]=(a*p*s-v*l*s+v*r*u-i*p*u-a*r*c+i*l*c)*w,e[3]=(h*l*s-a*d*s-h*r*u+i*d*u+a*r*m-i*l*m)*w,e[4]=g*w,e[5]=(f*p*s-x*d*s+x*r*m-n*p*m-f*r*c+n*d*c)*w,e[6]=(x*l*s-o*p*s-x*r*u+n*p*u+o*r*c-n*l*c)*w,e[7]=(o*d*s-f*l*s+f*r*u-n*d*u-o*r*m+n*l*m)*w,e[8]=y*w,e[9]=(x*h*s-f*v*s-x*i*m+n*v*m+f*i*c-n*h*c)*w,e[10]=(o*v*s-x*a*s+x*i*u-n*v*u-o*i*c+n*a*c)*w,e[11]=(f*a*s-o*h*s-f*i*u+n*h*u+o*i*m-n*a*m)*w,e[12]=M*w,e[13]=(f*v*r-x*h*r+x*i*d-n*v*d-f*i*p+n*h*p)*w,e[14]=(x*a*r-o*v*r-x*i*l+n*v*l+o*i*p-n*a*p)*w,e[15]=(o*h*r-f*a*r+f*i*l-n*h*l-o*i*d+n*a*d)*w,this}scale(e){const n=this.elements,i=e.x,r=e.y,s=e.z;return n[0]*=i,n[4]*=r,n[8]*=s,n[1]*=i,n[5]*=r,n[9]*=s,n[2]*=i,n[6]*=r,n[10]*=s,n[3]*=i,n[7]*=r,n[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,n=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(n,i,r))}makeTranslation(e,n,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,n,0,0,1,i,0,0,0,1),this}makeRotationX(e){const n=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,n,-i,0,0,i,n,0,0,0,0,1),this}makeRotationY(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,0,i,0,0,1,0,0,-i,0,n,0,0,0,0,1),this}makeRotationZ(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,-i,0,0,i,n,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,n){const i=Math.cos(n),r=Math.sin(n),s=1-i,o=e.x,a=e.y,l=e.z,u=s*o,f=s*a;return this.set(u*o+i,u*a-r*l,u*l+r*a,0,u*a+r*l,f*a+i,f*l-r*o,0,u*l-r*a,f*l+r*o,s*l*l+i,0,0,0,0,1),this}makeScale(e,n,i){return this.set(e,0,0,0,0,n,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,n,i,r,s,o){return this.set(1,i,s,0,e,1,o,0,n,r,1,0,0,0,0,1),this}compose(e,n,i){const r=this.elements,s=n._x,o=n._y,a=n._z,l=n._w,u=s+s,f=o+o,h=a+a,d=s*u,m=s*f,x=s*h,v=o*f,p=o*h,c=a*h,_=l*u,g=l*f,y=l*h,M=i.x,A=i.y,w=i.z;return r[0]=(1-(v+c))*M,r[1]=(m+y)*M,r[2]=(x-g)*M,r[3]=0,r[4]=(m-y)*A,r[5]=(1-(d+c))*A,r[6]=(p+_)*A,r[7]=0,r[8]=(x+g)*w,r[9]=(p-_)*w,r[10]=(1-(d+v))*w,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,n,i){const r=this.elements;let s=zr.set(r[0],r[1],r[2]).length();const o=zr.set(r[4],r[5],r[6]).length(),a=zr.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),e.x=r[12],e.y=r[13],e.z=r[14],Dn.copy(this);const u=1/s,f=1/o,h=1/a;return Dn.elements[0]*=u,Dn.elements[1]*=u,Dn.elements[2]*=u,Dn.elements[4]*=f,Dn.elements[5]*=f,Dn.elements[6]*=f,Dn.elements[8]*=h,Dn.elements[9]*=h,Dn.elements[10]*=h,n.setFromRotationMatrix(Dn),i.x=s,i.y=o,i.z=a,this}makePerspective(e,n,i,r,s,o,a=ci){const l=this.elements,u=2*s/(n-e),f=2*s/(i-r),h=(n+e)/(n-e),d=(i+r)/(i-r);let m,x;if(a===ci)m=-(o+s)/(o-s),x=-2*o*s/(o-s);else if(a===Al)m=-o/(o-s),x=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=u,l[4]=0,l[8]=h,l[12]=0,l[1]=0,l[5]=f,l[9]=d,l[13]=0,l[2]=0,l[6]=0,l[10]=m,l[14]=x,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,n,i,r,s,o,a=ci){const l=this.elements,u=1/(n-e),f=1/(i-r),h=1/(o-s),d=(n+e)*u,m=(i+r)*f;let x,v;if(a===ci)x=(o+s)*h,v=-2*h;else if(a===Al)x=s*h,v=-1*h;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=2*u,l[4]=0,l[8]=0,l[12]=-d,l[1]=0,l[5]=2*f,l[9]=0,l[13]=-m,l[2]=0,l[6]=0,l[10]=v,l[14]=-x,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const n=this.elements,i=e.elements;for(let r=0;r<16;r++)if(n[r]!==i[r])return!1;return!0}fromArray(e,n=0){for(let i=0;i<16;i++)this.elements[i]=e[i+n];return this}toArray(e=[],n=0){const i=this.elements;return e[n]=i[0],e[n+1]=i[1],e[n+2]=i[2],e[n+3]=i[3],e[n+4]=i[4],e[n+5]=i[5],e[n+6]=i[6],e[n+7]=i[7],e[n+8]=i[8],e[n+9]=i[9],e[n+10]=i[10],e[n+11]=i[11],e[n+12]=i[12],e[n+13]=i[13],e[n+14]=i[14],e[n+15]=i[15],e}}const zr=new N,Dn=new mt,iS=new N(0,0,0),rS=new N(1,1,1),Mi=new N,_a=new N,cn=new N,xp=new mt,yp=new Tr;class ql{constructor(e=0,n=0,i=0,r=ql.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=n,this._z=i,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,n,i,r=this._order){return this._x=e,this._y=n,this._z=i,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,n=this._order,i=!0){const r=e.elements,s=r[0],o=r[4],a=r[8],l=r[1],u=r[5],f=r[9],h=r[2],d=r[6],m=r[10];switch(n){case"XYZ":this._y=Math.asin(Zt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-f,m),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(d,u),this._z=0);break;case"YXZ":this._x=Math.asin(-Zt(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(a,m),this._z=Math.atan2(l,u)):(this._y=Math.atan2(-h,s),this._z=0);break;case"ZXY":this._x=Math.asin(Zt(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-h,m),this._z=Math.atan2(-o,u)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-Zt(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(d,m),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-o,u));break;case"YZX":this._z=Math.asin(Zt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-f,u),this._y=Math.atan2(-h,s)):(this._x=0,this._y=Math.atan2(a,m));break;case"XZY":this._z=Math.asin(-Zt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,u),this._y=Math.atan2(a,s)):(this._x=Math.atan2(-f,m),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+n)}return this._order=n,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,n,i){return xp.makeRotationFromQuaternion(e),this.setFromRotationMatrix(xp,n,i)}setFromVector3(e,n=this._order){return this.set(e.x,e.y,e.z,n)}reorder(e){return yp.setFromEuler(this),this.setFromQuaternion(yp,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],n=0){return e[n]=this._x,e[n+1]=this._y,e[n+2]=this._z,e[n+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}ql.DEFAULT_ORDER="XYZ";class j_{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let sS=0;const Sp=new N,kr=new Tr,ei=new mt,va=new N,Ks=new N,oS=new N,aS=new Tr,Mp=new N(1,0,0),Ep=new N(0,1,0),Tp=new N(0,0,1),lS={type:"added"},uS={type:"removed"};class Mt extends Cr{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:sS++}),this.uuid=Yi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Mt.DEFAULT_UP.clone();const e=new N,n=new ql,i=new Tr,r=new N(1,1,1);function s(){i.setFromEuler(n,!1)}function o(){n.setFromQuaternion(i,void 0,!1)}n._onChange(s),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new mt},normalMatrix:{value:new Ye}}),this.matrix=new mt,this.matrixWorld=new mt,this.matrixAutoUpdate=Mt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Mt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new j_,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,n){this.quaternion.setFromAxisAngle(e,n)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,n){return kr.setFromAxisAngle(e,n),this.quaternion.multiply(kr),this}rotateOnWorldAxis(e,n){return kr.setFromAxisAngle(e,n),this.quaternion.premultiply(kr),this}rotateX(e){return this.rotateOnAxis(Mp,e)}rotateY(e){return this.rotateOnAxis(Ep,e)}rotateZ(e){return this.rotateOnAxis(Tp,e)}translateOnAxis(e,n){return Sp.copy(e).applyQuaternion(this.quaternion),this.position.add(Sp.multiplyScalar(n)),this}translateX(e){return this.translateOnAxis(Mp,e)}translateY(e){return this.translateOnAxis(Ep,e)}translateZ(e){return this.translateOnAxis(Tp,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(ei.copy(this.matrixWorld).invert())}lookAt(e,n,i){e.isVector3?va.copy(e):va.set(e,n,i);const r=this.parent;this.updateWorldMatrix(!0,!1),Ks.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?ei.lookAt(Ks,va,this.up):ei.lookAt(va,Ks,this.up),this.quaternion.setFromRotationMatrix(ei),r&&(ei.extractRotation(r.matrixWorld),kr.setFromRotationMatrix(ei),this.quaternion.premultiply(kr.invert()))}add(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.add(arguments[n]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.parent!==null&&e.parent.remove(e),e.parent=this,this.children.push(e),e.dispatchEvent(lS)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const n=this.children.indexOf(e);return n!==-1&&(e.parent=null,this.children.splice(n,1),e.dispatchEvent(uS)),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),ei.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),ei.multiply(e.parent.matrixWorld)),e.applyMatrix4(ei),this.add(e),e.updateWorldMatrix(!1,!0),this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,n){if(this[e]===n)return this;for(let i=0,r=this.children.length;i<r;i++){const o=this.children[i].getObjectByProperty(e,n);if(o!==void 0)return o}}getObjectsByProperty(e,n,i=[]){this[e]===n&&i.push(this);const r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].getObjectsByProperty(e,n,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ks,e,oS),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ks,aS,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const n=this.matrixWorld.elements;return e.set(n[8],n[9],n[10]).normalize()}raycast(){}traverse(e){e(this);const n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].traverseVisible(e)}traverseAncestors(e){const n=this.parent;n!==null&&(e(n),n.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,e=!0);const n=this.children;for(let i=0,r=n.length;i<r;i++){const s=n[i];(s.matrixWorldAutoUpdate===!0||e===!0)&&s.updateMatrixWorld(e)}}updateWorldMatrix(e,n){const i=this.parent;if(e===!0&&i!==null&&i.matrixWorldAutoUpdate===!0&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),n===!0){const r=this.children;for(let s=0,o=r.length;s<o;s++){const a=r[s];a.matrixWorldAutoUpdate===!0&&a.updateWorldMatrix(!1,!0)}}}toJSON(e){const n=e===void 0||typeof e=="string",i={};n&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.visibility=this._visibility,r.active=this._active,r.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),r.maxGeometryCount=this._maxGeometryCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.geometryCount=this._geometryCount,r.matricesTexture=this._matricesTexture.toJSON(e),this.boundingSphere!==null&&(r.boundingSphere={center:r.boundingSphere.center.toArray(),radius:r.boundingSphere.radius}),this.boundingBox!==null&&(r.boundingBox={min:r.boundingBox.min.toArray(),max:r.boundingBox.max.toArray()}));function s(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let u=0,f=l.length;u<f;u++){const h=l[u];s(e.shapes,h)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,u=this.material.length;l<u;l++)a.push(s(e.materials,this.material[l]));r.material=a}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let a=0;a<this.children.length;a++)r.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];r.animations.push(s(e.animations,l))}}if(n){const a=o(e.geometries),l=o(e.materials),u=o(e.textures),f=o(e.images),h=o(e.shapes),d=o(e.skeletons),m=o(e.animations),x=o(e.nodes);a.length>0&&(i.geometries=a),l.length>0&&(i.materials=l),u.length>0&&(i.textures=u),f.length>0&&(i.images=f),h.length>0&&(i.shapes=h),d.length>0&&(i.skeletons=d),m.length>0&&(i.animations=m),x.length>0&&(i.nodes=x)}return i.object=r,i;function o(a){const l=[];for(const u in a){const f=a[u];delete f.metadata,l.push(f)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,n=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),n===!0)for(let i=0;i<e.children.length;i++){const r=e.children[i];this.add(r.clone())}return this}}Mt.DEFAULT_UP=new N(0,1,0);Mt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Mt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Un=new N,ti=new N,Gu=new N,ni=new N,Br=new N,Hr=new N,wp=new N,Vu=new N,Wu=new N,Xu=new N;let xa=!1;class En{constructor(e=new N,n=new N,i=new N){this.a=e,this.b=n,this.c=i}static getNormal(e,n,i,r){r.subVectors(i,n),Un.subVectors(e,n),r.cross(Un);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,n,i,r,s){Un.subVectors(r,n),ti.subVectors(i,n),Gu.subVectors(e,n);const o=Un.dot(Un),a=Un.dot(ti),l=Un.dot(Gu),u=ti.dot(ti),f=ti.dot(Gu),h=o*u-a*a;if(h===0)return s.set(-2,-1,-1);const d=1/h,m=(u*l-a*f)*d,x=(o*f-a*l)*d;return s.set(1-m-x,x,m)}static containsPoint(e,n,i,r){return this.getBarycoord(e,n,i,r,ni),ni.x>=0&&ni.y>=0&&ni.x+ni.y<=1}static getUV(e,n,i,r,s,o,a,l){return xa===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),xa=!0),this.getInterpolation(e,n,i,r,s,o,a,l)}static getInterpolation(e,n,i,r,s,o,a,l){return this.getBarycoord(e,n,i,r,ni),l.setScalar(0),l.addScaledVector(s,ni.x),l.addScaledVector(o,ni.y),l.addScaledVector(a,ni.z),l}static isFrontFacing(e,n,i,r){return Un.subVectors(i,n),ti.subVectors(e,n),Un.cross(ti).dot(r)<0}set(e,n,i){return this.a.copy(e),this.b.copy(n),this.c.copy(i),this}setFromPointsAndIndices(e,n,i,r){return this.a.copy(e[n]),this.b.copy(e[i]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,n,i,r){return this.a.fromBufferAttribute(e,n),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Un.subVectors(this.c,this.b),ti.subVectors(this.a,this.b),Un.cross(ti).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return En.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,n){return En.getBarycoord(e,this.a,this.b,this.c,n)}getUV(e,n,i,r,s){return xa===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),xa=!0),En.getInterpolation(e,this.a,this.b,this.c,n,i,r,s)}getInterpolation(e,n,i,r,s){return En.getInterpolation(e,this.a,this.b,this.c,n,i,r,s)}containsPoint(e){return En.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return En.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,n){const i=this.a,r=this.b,s=this.c;let o,a;Br.subVectors(r,i),Hr.subVectors(s,i),Vu.subVectors(e,i);const l=Br.dot(Vu),u=Hr.dot(Vu);if(l<=0&&u<=0)return n.copy(i);Wu.subVectors(e,r);const f=Br.dot(Wu),h=Hr.dot(Wu);if(f>=0&&h<=f)return n.copy(r);const d=l*h-f*u;if(d<=0&&l>=0&&f<=0)return o=l/(l-f),n.copy(i).addScaledVector(Br,o);Xu.subVectors(e,s);const m=Br.dot(Xu),x=Hr.dot(Xu);if(x>=0&&m<=x)return n.copy(s);const v=m*u-l*x;if(v<=0&&u>=0&&x<=0)return a=u/(u-x),n.copy(i).addScaledVector(Hr,a);const p=f*x-m*h;if(p<=0&&h-f>=0&&m-x>=0)return wp.subVectors(s,r),a=(h-f)/(h-f+(m-x)),n.copy(r).addScaledVector(wp,a);const c=1/(p+v+d);return o=v*c,a=d*c,n.copy(i).addScaledVector(Br,o).addScaledVector(Hr,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Y_={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Ei={h:0,s:0,l:0},ya={h:0,s:0,l:0};function ju(t,e,n){return n<0&&(n+=1),n>1&&(n-=1),n<1/6?t+(e-t)*6*n:n<1/2?e:n<2/3?t+(e-t)*6*(2/3-n):t}class Ve{constructor(e,n,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,n,i)}set(e,n,i){if(n===void 0&&i===void 0){const r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,n,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,n=Nt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Qe.toWorkingColorSpace(this,n),this}setRGB(e,n,i,r=Qe.workingColorSpace){return this.r=e,this.g=n,this.b=i,Qe.toWorkingColorSpace(this,r),this}setHSL(e,n,i,r=Qe.workingColorSpace){if(e=qy(e,1),n=Zt(n,0,1),i=Zt(i,0,1),n===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+n):i+n-i*n,o=2*i-s;this.r=ju(o,s,e+1/3),this.g=ju(o,s,e),this.b=ju(o,s,e-1/3)}return Qe.toWorkingColorSpace(this,r),this}setStyle(e,n=Nt){function i(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const o=r[1],a=r[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,n);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,n);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,n);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=r[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,n);if(o===6)return this.setHex(parseInt(s,16),n);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,n);return this}setColorName(e,n=Nt){const i=Y_[e.toLowerCase()];return i!==void 0?this.setHex(i,n):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=ys(e.r),this.g=ys(e.g),this.b=ys(e.b),this}copyLinearToSRGB(e){return this.r=Nu(e.r),this.g=Nu(e.g),this.b=Nu(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Nt){return Qe.fromWorkingColorSpace(Gt.copy(this),e),Math.round(Zt(Gt.r*255,0,255))*65536+Math.round(Zt(Gt.g*255,0,255))*256+Math.round(Zt(Gt.b*255,0,255))}getHexString(e=Nt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,n=Qe.workingColorSpace){Qe.fromWorkingColorSpace(Gt.copy(this),n);const i=Gt.r,r=Gt.g,s=Gt.b,o=Math.max(i,r,s),a=Math.min(i,r,s);let l,u;const f=(a+o)/2;if(a===o)l=0,u=0;else{const h=o-a;switch(u=f<=.5?h/(o+a):h/(2-o-a),o){case i:l=(r-s)/h+(r<s?6:0);break;case r:l=(s-i)/h+2;break;case s:l=(i-r)/h+4;break}l/=6}return e.h=l,e.s=u,e.l=f,e}getRGB(e,n=Qe.workingColorSpace){return Qe.fromWorkingColorSpace(Gt.copy(this),n),e.r=Gt.r,e.g=Gt.g,e.b=Gt.b,e}getStyle(e=Nt){Qe.fromWorkingColorSpace(Gt.copy(this),e);const n=Gt.r,i=Gt.g,r=Gt.b;return e!==Nt?`color(${e} ${n.toFixed(3)} ${i.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(n*255)},${Math.round(i*255)},${Math.round(r*255)})`}offsetHSL(e,n,i){return this.getHSL(Ei),this.setHSL(Ei.h+e,Ei.s+n,Ei.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,n){return this.r=e.r+n.r,this.g=e.g+n.g,this.b=e.b+n.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,n){return this.r+=(e.r-this.r)*n,this.g+=(e.g-this.g)*n,this.b+=(e.b-this.b)*n,this}lerpColors(e,n,i){return this.r=e.r+(n.r-e.r)*i,this.g=e.g+(n.g-e.g)*i,this.b=e.b+(n.b-e.b)*i,this}lerpHSL(e,n){this.getHSL(Ei),e.getHSL(ya);const i=Du(Ei.h,ya.h,n),r=Du(Ei.s,ya.s,n),s=Du(Ei.l,ya.l,n);return this.setHSL(i,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const n=this.r,i=this.g,r=this.b,s=e.elements;return this.r=s[0]*n+s[3]*i+s[6]*r,this.g=s[1]*n+s[4]*i+s[7]*r,this.b=s[2]*n+s[5]*i+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,n=0){return this.r=e[n],this.g=e[n+1],this.b=e[n+2],this}toArray(e=[],n=0){return e[n]=this.r,e[n+1]=this.g,e[n+2]=this.b,e}fromBufferAttribute(e,n){return this.r=e.getX(n),this.g=e.getY(n),this.b=e.getZ(n),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Gt=new Ve;Ve.NAMES=Y_;let cS=0;class br extends Cr{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:cS++}),this.uuid=Yi(),this.name="",this.type="Material",this.blending=xs,this.side=Ki,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=tf,this.blendDst=nf,this.blendEquation=ur,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ve(0,0,0),this.blendAlpha=0,this.depthFunc=Ml,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=dp,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ur,this.stencilZFail=Ur,this.stencilZPass=Ur,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const n in e){const i=e[n];if(i===void 0){console.warn(`THREE.Material: parameter '${n}' has value of undefined.`);continue}const r=this[n];if(r===void 0){console.warn(`THREE.Material: '${n}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(i):r&&r.isVector3&&i&&i.isVector3?r.copy(i):this[n]=i}}toJSON(e){const n=e===void 0||typeof e=="string";n&&(e={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==xs&&(i.blending=this.blending),this.side!==Ki&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==tf&&(i.blendSrc=this.blendSrc),this.blendDst!==nf&&(i.blendDst=this.blendDst),this.blendEquation!==ur&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Ml&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==dp&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Ur&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Ur&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Ur&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function r(s){const o=[];for(const a in s){const l=s[a];delete l.metadata,o.push(l)}return o}if(n){const s=r(e.textures),o=r(e.images);s.length>0&&(i.textures=s),o.length>0&&(i.images=o)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const n=e.clippingPlanes;let i=null;if(n!==null){const r=n.length;i=new Array(r);for(let s=0;s!==r;++s)i[s]=n[s].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class q_ extends br{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ve(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=P_,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const gt=new N,Sa=new Re;class Hn{constructor(e,n,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=n,this.count=e!==void 0?e.length/n:0,this.normalized=i,this.usage=lf,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=Ni,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}get updateRange(){return console.warn('THREE.BufferAttribute: "updateRange" is deprecated and removed in r169. Use "addUpdateRange()" instead.'),this._updateRange}setUsage(e){return this.usage=e,this}addUpdateRange(e,n){this.updateRanges.push({start:e,count:n})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,n,i){e*=this.itemSize,i*=n.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=n.array[i+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let n=0,i=this.count;n<i;n++)Sa.fromBufferAttribute(this,n),Sa.applyMatrix3(e),this.setXY(n,Sa.x,Sa.y);else if(this.itemSize===3)for(let n=0,i=this.count;n<i;n++)gt.fromBufferAttribute(this,n),gt.applyMatrix3(e),this.setXYZ(n,gt.x,gt.y,gt.z);return this}applyMatrix4(e){for(let n=0,i=this.count;n<i;n++)gt.fromBufferAttribute(this,n),gt.applyMatrix4(e),this.setXYZ(n,gt.x,gt.y,gt.z);return this}applyNormalMatrix(e){for(let n=0,i=this.count;n<i;n++)gt.fromBufferAttribute(this,n),gt.applyNormalMatrix(e),this.setXYZ(n,gt.x,gt.y,gt.z);return this}transformDirection(e){for(let n=0,i=this.count;n<i;n++)gt.fromBufferAttribute(this,n),gt.transformDirection(e),this.setXYZ(n,gt.x,gt.y,gt.z);return this}set(e,n=0){return this.array.set(e,n),this}getComponent(e,n){let i=this.array[e*this.itemSize+n];return this.normalized&&(i=ai(i,this.array)),i}setComponent(e,n,i){return this.normalized&&(i=Je(i,this.array)),this.array[e*this.itemSize+n]=i,this}getX(e){let n=this.array[e*this.itemSize];return this.normalized&&(n=ai(n,this.array)),n}setX(e,n){return this.normalized&&(n=Je(n,this.array)),this.array[e*this.itemSize]=n,this}getY(e){let n=this.array[e*this.itemSize+1];return this.normalized&&(n=ai(n,this.array)),n}setY(e,n){return this.normalized&&(n=Je(n,this.array)),this.array[e*this.itemSize+1]=n,this}getZ(e){let n=this.array[e*this.itemSize+2];return this.normalized&&(n=ai(n,this.array)),n}setZ(e,n){return this.normalized&&(n=Je(n,this.array)),this.array[e*this.itemSize+2]=n,this}getW(e){let n=this.array[e*this.itemSize+3];return this.normalized&&(n=ai(n,this.array)),n}setW(e,n){return this.normalized&&(n=Je(n,this.array)),this.array[e*this.itemSize+3]=n,this}setXY(e,n,i){return e*=this.itemSize,this.normalized&&(n=Je(n,this.array),i=Je(i,this.array)),this.array[e+0]=n,this.array[e+1]=i,this}setXYZ(e,n,i,r){return e*=this.itemSize,this.normalized&&(n=Je(n,this.array),i=Je(i,this.array),r=Je(r,this.array)),this.array[e+0]=n,this.array[e+1]=i,this.array[e+2]=r,this}setXYZW(e,n,i,r,s){return e*=this.itemSize,this.normalized&&(n=Je(n,this.array),i=Je(i,this.array),r=Je(r,this.array),s=Je(s,this.array)),this.array[e+0]=n,this.array[e+1]=i,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==lf&&(e.usage=this.usage),e}}class $_ extends Hn{constructor(e,n,i){super(new Uint16Array(e),n,i)}}class K_ extends Hn{constructor(e,n,i){super(new Uint32Array(e),n,i)}}class Et extends Hn{constructor(e,n,i){super(new Float32Array(e),n,i)}}let fS=0;const xn=new mt,Yu=new Mt,Gr=new N,fn=new Is,Zs=new Is,bt=new N;class It extends Cr{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:fS++}),this.uuid=Yi(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(G_(e)?K_:$_)(e,1):this.index=e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,n){return this.attributes[e]=n,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,n,i=0){this.groups.push({start:e,count:n,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,n){this.drawRange.start=e,this.drawRange.count=n}applyMatrix4(e){const n=this.attributes.position;n!==void 0&&(n.applyMatrix4(e),n.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new Ye().getNormalMatrix(e);i.applyNormalMatrix(s),i.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return xn.makeRotationFromQuaternion(e),this.applyMatrix4(xn),this}rotateX(e){return xn.makeRotationX(e),this.applyMatrix4(xn),this}rotateY(e){return xn.makeRotationY(e),this.applyMatrix4(xn),this}rotateZ(e){return xn.makeRotationZ(e),this.applyMatrix4(xn),this}translate(e,n,i){return xn.makeTranslation(e,n,i),this.applyMatrix4(xn),this}scale(e,n,i){return xn.makeScale(e,n,i),this.applyMatrix4(xn),this}lookAt(e){return Yu.lookAt(e),Yu.updateMatrix(),this.applyMatrix4(Yu.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Gr).negate(),this.translate(Gr.x,Gr.y,Gr.z),this}setFromPoints(e){const n=[];for(let i=0,r=e.length;i<r;i++){const s=e[i];n.push(s.x,s.y,s.z||0)}return this.setAttribute("position",new Et(n,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Is);const e=this.attributes.position,n=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new N(-1/0,-1/0,-1/0),new N(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),n)for(let i=0,r=n.length;i<r;i++){const s=n[i];fn.setFromBufferAttribute(s),this.morphTargetsRelative?(bt.addVectors(this.boundingBox.min,fn.min),this.boundingBox.expandByPoint(bt),bt.addVectors(this.boundingBox.max,fn.max),this.boundingBox.expandByPoint(bt)):(this.boundingBox.expandByPoint(fn.min),this.boundingBox.expandByPoint(fn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Yl);const e=this.attributes.position,n=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new N,1/0);return}if(e){const i=this.boundingSphere.center;if(fn.setFromBufferAttribute(e),n)for(let s=0,o=n.length;s<o;s++){const a=n[s];Zs.setFromBufferAttribute(a),this.morphTargetsRelative?(bt.addVectors(fn.min,Zs.min),fn.expandByPoint(bt),bt.addVectors(fn.max,Zs.max),fn.expandByPoint(bt)):(fn.expandByPoint(Zs.min),fn.expandByPoint(Zs.max))}fn.getCenter(i);let r=0;for(let s=0,o=e.count;s<o;s++)bt.fromBufferAttribute(e,s),r=Math.max(r,i.distanceToSquared(bt));if(n)for(let s=0,o=n.length;s<o;s++){const a=n[s],l=this.morphTargetsRelative;for(let u=0,f=a.count;u<f;u++)bt.fromBufferAttribute(a,u),l&&(Gr.fromBufferAttribute(e,u),bt.add(Gr)),r=Math.max(r,i.distanceToSquared(bt))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,n=this.attributes;if(e===null||n.position===void 0||n.normal===void 0||n.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=e.array,r=n.position.array,s=n.normal.array,o=n.uv.array,a=r.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Hn(new Float32Array(4*a),4));const l=this.getAttribute("tangent").array,u=[],f=[];for(let R=0;R<a;R++)u[R]=new N,f[R]=new N;const h=new N,d=new N,m=new N,x=new Re,v=new Re,p=new Re,c=new N,_=new N;function g(R,H,I){h.fromArray(r,R*3),d.fromArray(r,H*3),m.fromArray(r,I*3),x.fromArray(o,R*2),v.fromArray(o,H*2),p.fromArray(o,I*2),d.sub(h),m.sub(h),v.sub(x),p.sub(x);const G=1/(v.x*p.y-p.x*v.y);isFinite(G)&&(c.copy(d).multiplyScalar(p.y).addScaledVector(m,-v.y).multiplyScalar(G),_.copy(m).multiplyScalar(v.x).addScaledVector(d,-p.x).multiplyScalar(G),u[R].add(c),u[H].add(c),u[I].add(c),f[R].add(_),f[H].add(_),f[I].add(_))}let y=this.groups;y.length===0&&(y=[{start:0,count:i.length}]);for(let R=0,H=y.length;R<H;++R){const I=y[R],G=I.start,L=I.count;for(let D=G,z=G+L;D<z;D+=3)g(i[D+0],i[D+1],i[D+2])}const M=new N,A=new N,w=new N,b=new N;function S(R){w.fromArray(s,R*3),b.copy(w);const H=u[R];M.copy(H),M.sub(w.multiplyScalar(w.dot(H))).normalize(),A.crossVectors(b,H);const G=A.dot(f[R])<0?-1:1;l[R*4]=M.x,l[R*4+1]=M.y,l[R*4+2]=M.z,l[R*4+3]=G}for(let R=0,H=y.length;R<H;++R){const I=y[R],G=I.start,L=I.count;for(let D=G,z=G+L;D<z;D+=3)S(i[D+0]),S(i[D+1]),S(i[D+2])}}computeVertexNormals(){const e=this.index,n=this.getAttribute("position");if(n!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new Hn(new Float32Array(n.count*3),3),this.setAttribute("normal",i);else for(let d=0,m=i.count;d<m;d++)i.setXYZ(d,0,0,0);const r=new N,s=new N,o=new N,a=new N,l=new N,u=new N,f=new N,h=new N;if(e)for(let d=0,m=e.count;d<m;d+=3){const x=e.getX(d+0),v=e.getX(d+1),p=e.getX(d+2);r.fromBufferAttribute(n,x),s.fromBufferAttribute(n,v),o.fromBufferAttribute(n,p),f.subVectors(o,s),h.subVectors(r,s),f.cross(h),a.fromBufferAttribute(i,x),l.fromBufferAttribute(i,v),u.fromBufferAttribute(i,p),a.add(f),l.add(f),u.add(f),i.setXYZ(x,a.x,a.y,a.z),i.setXYZ(v,l.x,l.y,l.z),i.setXYZ(p,u.x,u.y,u.z)}else for(let d=0,m=n.count;d<m;d+=3)r.fromBufferAttribute(n,d+0),s.fromBufferAttribute(n,d+1),o.fromBufferAttribute(n,d+2),f.subVectors(o,s),h.subVectors(r,s),f.cross(h),i.setXYZ(d+0,f.x,f.y,f.z),i.setXYZ(d+1,f.x,f.y,f.z),i.setXYZ(d+2,f.x,f.y,f.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let n=0,i=e.count;n<i;n++)bt.fromBufferAttribute(e,n),bt.normalize(),e.setXYZ(n,bt.x,bt.y,bt.z)}toNonIndexed(){function e(a,l){const u=a.array,f=a.itemSize,h=a.normalized,d=new u.constructor(l.length*f);let m=0,x=0;for(let v=0,p=l.length;v<p;v++){a.isInterleavedBufferAttribute?m=l[v]*a.data.stride+a.offset:m=l[v]*f;for(let c=0;c<f;c++)d[x++]=u[m++]}return new Hn(d,f,h)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const n=new It,i=this.index.array,r=this.attributes;for(const a in r){const l=r[a],u=e(l,i);n.setAttribute(a,u)}const s=this.morphAttributes;for(const a in s){const l=[],u=s[a];for(let f=0,h=u.length;f<h;f++){const d=u[f],m=e(d,i);l.push(m)}n.morphAttributes[a]=l}n.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,l=o.length;a<l;a++){const u=o[a];n.addGroup(u.start,u.count,u.materialIndex)}return n}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const u in l)l[u]!==void 0&&(e[u]=l[u]);return e}e.data={attributes:{}};const n=this.index;n!==null&&(e.data.index={type:n.array.constructor.name,array:Array.prototype.slice.call(n.array)});const i=this.attributes;for(const l in i){const u=i[l];e.data.attributes[l]=u.toJSON(e.data)}const r={};let s=!1;for(const l in this.morphAttributes){const u=this.morphAttributes[l],f=[];for(let h=0,d=u.length;h<d;h++){const m=u[h];f.push(m.toJSON(e.data))}f.length>0&&(r[l]=f,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(e.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const n={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone(n));const r=e.attributes;for(const u in r){const f=r[u];this.setAttribute(u,f.clone(n))}const s=e.morphAttributes;for(const u in s){const f=[],h=s[u];for(let d=0,m=h.length;d<m;d++)f.push(h[d].clone(n));this.morphAttributes[u]=f}this.morphTargetsRelative=e.morphTargetsRelative;const o=e.groups;for(let u=0,f=o.length;u<f;u++){const h=o[u];this.addGroup(h.start,h.count,h.materialIndex)}const a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Ap=new mt,rr=new fd,Ma=new Yl,Rp=new N,Vr=new N,Wr=new N,Xr=new N,qu=new N,Ea=new N,Ta=new Re,wa=new Re,Aa=new Re,Cp=new N,bp=new N,Pp=new N,Ra=new N,Ca=new N;class qn extends Mt{constructor(e=new It,n=new q_){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=n,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){const r=n[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}getVertexPosition(e,n){const i=this.geometry,r=i.attributes.position,s=i.morphAttributes.position,o=i.morphTargetsRelative;n.fromBufferAttribute(r,e);const a=this.morphTargetInfluences;if(s&&a){Ea.set(0,0,0);for(let l=0,u=s.length;l<u;l++){const f=a[l],h=s[l];f!==0&&(qu.fromBufferAttribute(h,e),o?Ea.addScaledVector(qu,f):Ea.addScaledVector(qu.sub(n),f))}n.add(Ea)}return n}raycast(e,n){const i=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Ma.copy(i.boundingSphere),Ma.applyMatrix4(s),rr.copy(e.ray).recast(e.near),!(Ma.containsPoint(rr.origin)===!1&&(rr.intersectSphere(Ma,Rp)===null||rr.origin.distanceToSquared(Rp)>(e.far-e.near)**2))&&(Ap.copy(s).invert(),rr.copy(e.ray).applyMatrix4(Ap),!(i.boundingBox!==null&&rr.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,n,rr)))}_computeIntersections(e,n,i){let r;const s=this.geometry,o=this.material,a=s.index,l=s.attributes.position,u=s.attributes.uv,f=s.attributes.uv1,h=s.attributes.normal,d=s.groups,m=s.drawRange;if(a!==null)if(Array.isArray(o))for(let x=0,v=d.length;x<v;x++){const p=d[x],c=o[p.materialIndex],_=Math.max(p.start,m.start),g=Math.min(a.count,Math.min(p.start+p.count,m.start+m.count));for(let y=_,M=g;y<M;y+=3){const A=a.getX(y),w=a.getX(y+1),b=a.getX(y+2);r=ba(this,c,e,i,u,f,h,A,w,b),r&&(r.faceIndex=Math.floor(y/3),r.face.materialIndex=p.materialIndex,n.push(r))}}else{const x=Math.max(0,m.start),v=Math.min(a.count,m.start+m.count);for(let p=x,c=v;p<c;p+=3){const _=a.getX(p),g=a.getX(p+1),y=a.getX(p+2);r=ba(this,o,e,i,u,f,h,_,g,y),r&&(r.faceIndex=Math.floor(p/3),n.push(r))}}else if(l!==void 0)if(Array.isArray(o))for(let x=0,v=d.length;x<v;x++){const p=d[x],c=o[p.materialIndex],_=Math.max(p.start,m.start),g=Math.min(l.count,Math.min(p.start+p.count,m.start+m.count));for(let y=_,M=g;y<M;y+=3){const A=y,w=y+1,b=y+2;r=ba(this,c,e,i,u,f,h,A,w,b),r&&(r.faceIndex=Math.floor(y/3),r.face.materialIndex=p.materialIndex,n.push(r))}}else{const x=Math.max(0,m.start),v=Math.min(l.count,m.start+m.count);for(let p=x,c=v;p<c;p+=3){const _=p,g=p+1,y=p+2;r=ba(this,o,e,i,u,f,h,_,g,y),r&&(r.faceIndex=Math.floor(p/3),n.push(r))}}}}function dS(t,e,n,i,r,s,o,a){let l;if(e.side===an?l=i.intersectTriangle(o,s,r,!0,a):l=i.intersectTriangle(r,s,o,e.side===Ki,a),l===null)return null;Ca.copy(a),Ca.applyMatrix4(t.matrixWorld);const u=n.ray.origin.distanceTo(Ca);return u<n.near||u>n.far?null:{distance:u,point:Ca.clone(),object:t}}function ba(t,e,n,i,r,s,o,a,l,u){t.getVertexPosition(a,Vr),t.getVertexPosition(l,Wr),t.getVertexPosition(u,Xr);const f=dS(t,e,n,i,Vr,Wr,Xr,Ra);if(f){r&&(Ta.fromBufferAttribute(r,a),wa.fromBufferAttribute(r,l),Aa.fromBufferAttribute(r,u),f.uv=En.getInterpolation(Ra,Vr,Wr,Xr,Ta,wa,Aa,new Re)),s&&(Ta.fromBufferAttribute(s,a),wa.fromBufferAttribute(s,l),Aa.fromBufferAttribute(s,u),f.uv1=En.getInterpolation(Ra,Vr,Wr,Xr,Ta,wa,Aa,new Re),f.uv2=f.uv1),o&&(Cp.fromBufferAttribute(o,a),bp.fromBufferAttribute(o,l),Pp.fromBufferAttribute(o,u),f.normal=En.getInterpolation(Ra,Vr,Wr,Xr,Cp,bp,Pp,new N),f.normal.dot(i.direction)>0&&f.normal.multiplyScalar(-1));const h={a,b:l,c:u,normal:new N,materialIndex:0};En.getNormal(Vr,Wr,Xr,h.normal),f.face=h}return f}class Xo extends It{constructor(e=1,n=1,i=1,r=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:n,depth:i,widthSegments:r,heightSegments:s,depthSegments:o};const a=this;r=Math.floor(r),s=Math.floor(s),o=Math.floor(o);const l=[],u=[],f=[],h=[];let d=0,m=0;x("z","y","x",-1,-1,i,n,e,o,s,0),x("z","y","x",1,-1,i,n,-e,o,s,1),x("x","z","y",1,1,e,i,n,r,o,2),x("x","z","y",1,-1,e,i,-n,r,o,3),x("x","y","z",1,-1,e,n,i,r,s,4),x("x","y","z",-1,-1,e,n,-i,r,s,5),this.setIndex(l),this.setAttribute("position",new Et(u,3)),this.setAttribute("normal",new Et(f,3)),this.setAttribute("uv",new Et(h,2));function x(v,p,c,_,g,y,M,A,w,b,S){const R=y/w,H=M/b,I=y/2,G=M/2,L=A/2,D=w+1,z=b+1;let W=0,F=0;const B=new N;for(let k=0;k<z;k++){const Q=k*H-G;for(let ee=0;ee<D;ee++){const $=ee*R-I;B[v]=$*_,B[p]=Q*g,B[c]=L,u.push(B.x,B.y,B.z),B[v]=0,B[p]=0,B[c]=A>0?1:-1,f.push(B.x,B.y,B.z),h.push(ee/w),h.push(1-k/b),W+=1}}for(let k=0;k<b;k++)for(let Q=0;Q<w;Q++){const ee=d+Q+D*k,$=d+Q+D*(k+1),Z=d+(Q+1)+D*(k+1),de=d+(Q+1)+D*k;l.push(ee,$,de),l.push($,Z,de),F+=6}a.addGroup(m,F,S),m+=F,d+=W}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Xo(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Ls(t){const e={};for(const n in t){e[n]={};for(const i in t[n]){const r=t[n][i];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[n][i]=null):e[n][i]=r.clone():Array.isArray(r)?e[n][i]=r.slice():e[n][i]=r}}return e}function qt(t){const e={};for(let n=0;n<t.length;n++){const i=Ls(t[n]);for(const r in i)e[r]=i[r]}return e}function hS(t){const e=[];for(let n=0;n<t.length;n++)e.push(t[n].clone());return e}function Z_(t){return t.getRenderTarget()===null?t.outputColorSpace:Qe.workingColorSpace}const pS={clone:Ls,merge:qt};var mS=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,gS=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class wr extends br{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=mS,this.fragmentShader=gS,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Ls(e.uniforms),this.uniformsGroups=hS(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const n=super.toJSON(e);n.glslVersion=this.glslVersion,n.uniforms={};for(const r in this.uniforms){const o=this.uniforms[r].value;o&&o.isTexture?n.uniforms[r]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?n.uniforms[r]={type:"c",value:o.getHex()}:o&&o.isVector2?n.uniforms[r]={type:"v2",value:o.toArray()}:o&&o.isVector3?n.uniforms[r]={type:"v3",value:o.toArray()}:o&&o.isVector4?n.uniforms[r]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?n.uniforms[r]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?n.uniforms[r]={type:"m4",value:o.toArray()}:n.uniforms[r]={value:o}}Object.keys(this.defines).length>0&&(n.defines=this.defines),n.vertexShader=this.vertexShader,n.fragmentShader=this.fragmentShader,n.lights=this.lights,n.clipping=this.clipping;const i={};for(const r in this.extensions)this.extensions[r]===!0&&(i[r]=!0);return Object.keys(i).length>0&&(n.extensions=i),n}}class Q_ extends Mt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new mt,this.projectionMatrix=new mt,this.projectionMatrixInverse=new mt,this.coordinateSystem=ci}copy(e,n){return super.copy(e,n),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,n){super.updateWorldMatrix(e,n),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}class Tn extends Q_{constructor(e=50,n=1,i=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=r,this.focus=10,this.aspect=n,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,n){return super.copy(e,n),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const n=.5*this.getFilmHeight()/e;this.fov=cf*2*Math.atan(n),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Ka*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return cf*2*Math.atan(Math.tan(Ka*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(e,n,i,r,s,o){this.aspect=e/n,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let n=e*Math.tan(Ka*.5*this.fov)/this.zoom,i=2*n,r=this.aspect*i,s=-.5*r;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,u=o.fullHeight;s+=o.offsetX*r/l,n-=o.offsetY*i/u,r*=o.width/l,i*=o.height/u}const a=this.filmOffset;a!==0&&(s+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,n,n-i,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const n=super.toJSON(e);return n.object.fov=this.fov,n.object.zoom=this.zoom,n.object.near=this.near,n.object.far=this.far,n.object.focus=this.focus,n.object.aspect=this.aspect,this.view!==null&&(n.object.view=Object.assign({},this.view)),n.object.filmGauge=this.filmGauge,n.object.filmOffset=this.filmOffset,n}}const jr=-90,Yr=1;class _S extends Mt{constructor(e,n,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new Tn(jr,Yr,e,n);r.layers=this.layers,this.add(r);const s=new Tn(jr,Yr,e,n);s.layers=this.layers,this.add(s);const o=new Tn(jr,Yr,e,n);o.layers=this.layers,this.add(o);const a=new Tn(jr,Yr,e,n);a.layers=this.layers,this.add(a);const l=new Tn(jr,Yr,e,n);l.layers=this.layers,this.add(l);const u=new Tn(jr,Yr,e,n);u.layers=this.layers,this.add(u)}updateCoordinateSystem(){const e=this.coordinateSystem,n=this.children.concat(),[i,r,s,o,a,l]=n;for(const u of n)this.remove(u);if(e===ci)i.up.set(0,1,0),i.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Al)i.up.set(0,-1,0),i.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const u of n)this.add(u),u.updateMatrixWorld()}update(e,n){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[s,o,a,l,u,f]=this.children,h=e.getRenderTarget(),d=e.getActiveCubeFace(),m=e.getActiveMipmapLevel(),x=e.xr.enabled;e.xr.enabled=!1;const v=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,r),e.render(n,s),e.setRenderTarget(i,1,r),e.render(n,o),e.setRenderTarget(i,2,r),e.render(n,a),e.setRenderTarget(i,3,r),e.render(n,l),e.setRenderTarget(i,4,r),e.render(n,u),i.texture.generateMipmaps=v,e.setRenderTarget(i,5,r),e.render(n,f),e.setRenderTarget(h,d,m),e.xr.enabled=x,i.texture.needsPMREMUpdate=!0}}class J_ extends ln{constructor(e,n,i,r,s,o,a,l,u,f){e=e!==void 0?e:[],n=n!==void 0?n:Cs,super(e,n,i,r,s,o,a,l,u,f),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class vS extends Er{constructor(e=1,n={}){super(e,e,n),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},r=[i,i,i,i,i,i];n.encoding!==void 0&&(xo("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),n.colorSpace=n.encoding===ji?Nt:wn),this.texture=new J_(r,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=n.generateMipmaps!==void 0?n.generateMipmaps:!1,this.texture.minFilter=n.minFilter!==void 0?n.minFilter:Mn}fromEquirectangularTexture(e,n){this.texture.type=n.type,this.texture.colorSpace=n.colorSpace,this.texture.generateMipmaps=n.generateMipmaps,this.texture.minFilter=n.minFilter,this.texture.magFilter=n.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new Xo(5,5,5),s=new wr({name:"CubemapFromEquirect",uniforms:Ls(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:an,blending:Vi});s.uniforms.tEquirect.value=n;const o=new qn(r,s),a=n.minFilter;return n.minFilter===Oo&&(n.minFilter=Mn),new _S(1,10,this).update(e,o),n.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,n,i,r){const s=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(n,i,r);e.setRenderTarget(s)}}const $u=new N,xS=new N,yS=new Ye;class Ci{constructor(e=new N(1,0,0),n=0){this.isPlane=!0,this.normal=e,this.constant=n}set(e,n){return this.normal.copy(e),this.constant=n,this}setComponents(e,n,i,r){return this.normal.set(e,n,i),this.constant=r,this}setFromNormalAndCoplanarPoint(e,n){return this.normal.copy(e),this.constant=-n.dot(this.normal),this}setFromCoplanarPoints(e,n,i){const r=$u.subVectors(i,n).cross(xS.subVectors(e,n)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,n){return n.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,n){const i=e.delta($u),r=this.normal.dot(i);if(r===0)return this.distanceToPoint(e.start)===0?n.copy(e.start):null;const s=-(e.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:n.copy(e.start).addScaledVector(i,s)}intersectsLine(e){const n=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return n<0&&i>0||i<0&&n>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,n){const i=n||yS.getNormalMatrix(e),r=this.coplanarPoint($u).applyMatrix4(e),s=this.normal.applyMatrix3(i).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const sr=new Yl,Pa=new N;class dd{constructor(e=new Ci,n=new Ci,i=new Ci,r=new Ci,s=new Ci,o=new Ci){this.planes=[e,n,i,r,s,o]}set(e,n,i,r,s,o){const a=this.planes;return a[0].copy(e),a[1].copy(n),a[2].copy(i),a[3].copy(r),a[4].copy(s),a[5].copy(o),this}copy(e){const n=this.planes;for(let i=0;i<6;i++)n[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,n=ci){const i=this.planes,r=e.elements,s=r[0],o=r[1],a=r[2],l=r[3],u=r[4],f=r[5],h=r[6],d=r[7],m=r[8],x=r[9],v=r[10],p=r[11],c=r[12],_=r[13],g=r[14],y=r[15];if(i[0].setComponents(l-s,d-u,p-m,y-c).normalize(),i[1].setComponents(l+s,d+u,p+m,y+c).normalize(),i[2].setComponents(l+o,d+f,p+x,y+_).normalize(),i[3].setComponents(l-o,d-f,p-x,y-_).normalize(),i[4].setComponents(l-a,d-h,p-v,y-g).normalize(),n===ci)i[5].setComponents(l+a,d+h,p+v,y+g).normalize();else if(n===Al)i[5].setComponents(a,h,v,g).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+n);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),sr.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const n=e.geometry;n.boundingSphere===null&&n.computeBoundingSphere(),sr.copy(n.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(sr)}intersectsSprite(e){return sr.center.set(0,0,0),sr.radius=.7071067811865476,sr.applyMatrix4(e.matrixWorld),this.intersectsSphere(sr)}intersectsSphere(e){const n=this.planes,i=e.center,r=-e.radius;for(let s=0;s<6;s++)if(n[s].distanceToPoint(i)<r)return!1;return!0}intersectsBox(e){const n=this.planes;for(let i=0;i<6;i++){const r=n[i];if(Pa.x=r.normal.x>0?e.max.x:e.min.x,Pa.y=r.normal.y>0?e.max.y:e.min.y,Pa.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(Pa)<0)return!1}return!0}containsPoint(e){const n=this.planes;for(let i=0;i<6;i++)if(n[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function ev(){let t=null,e=!1,n=null,i=null;function r(s,o){n(s,o),i=t.requestAnimationFrame(r)}return{start:function(){e!==!0&&n!==null&&(i=t.requestAnimationFrame(r),e=!0)},stop:function(){t.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(s){n=s},setContext:function(s){t=s}}}function SS(t,e){const n=e.isWebGL2,i=new WeakMap;function r(u,f){const h=u.array,d=u.usage,m=h.byteLength,x=t.createBuffer();t.bindBuffer(f,x),t.bufferData(f,h,d),u.onUploadCallback();let v;if(h instanceof Float32Array)v=t.FLOAT;else if(h instanceof Uint16Array)if(u.isFloat16BufferAttribute)if(n)v=t.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else v=t.UNSIGNED_SHORT;else if(h instanceof Int16Array)v=t.SHORT;else if(h instanceof Uint32Array)v=t.UNSIGNED_INT;else if(h instanceof Int32Array)v=t.INT;else if(h instanceof Int8Array)v=t.BYTE;else if(h instanceof Uint8Array)v=t.UNSIGNED_BYTE;else if(h instanceof Uint8ClampedArray)v=t.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+h);return{buffer:x,type:v,bytesPerElement:h.BYTES_PER_ELEMENT,version:u.version,size:m}}function s(u,f,h){const d=f.array,m=f._updateRange,x=f.updateRanges;if(t.bindBuffer(h,u),m.count===-1&&x.length===0&&t.bufferSubData(h,0,d),x.length!==0){for(let v=0,p=x.length;v<p;v++){const c=x[v];n?t.bufferSubData(h,c.start*d.BYTES_PER_ELEMENT,d,c.start,c.count):t.bufferSubData(h,c.start*d.BYTES_PER_ELEMENT,d.subarray(c.start,c.start+c.count))}f.clearUpdateRanges()}m.count!==-1&&(n?t.bufferSubData(h,m.offset*d.BYTES_PER_ELEMENT,d,m.offset,m.count):t.bufferSubData(h,m.offset*d.BYTES_PER_ELEMENT,d.subarray(m.offset,m.offset+m.count)),m.count=-1),f.onUploadCallback()}function o(u){return u.isInterleavedBufferAttribute&&(u=u.data),i.get(u)}function a(u){u.isInterleavedBufferAttribute&&(u=u.data);const f=i.get(u);f&&(t.deleteBuffer(f.buffer),i.delete(u))}function l(u,f){if(u.isGLBufferAttribute){const d=i.get(u);(!d||d.version<u.version)&&i.set(u,{buffer:u.buffer,type:u.type,bytesPerElement:u.elementSize,version:u.version});return}u.isInterleavedBufferAttribute&&(u=u.data);const h=i.get(u);if(h===void 0)i.set(u,r(u,f));else if(h.version<u.version){if(h.size!==u.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");s(h.buffer,u,f),h.version=u.version}}return{get:o,remove:a,update:l}}class hd extends It{constructor(e=1,n=1,i=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:n,widthSegments:i,heightSegments:r};const s=e/2,o=n/2,a=Math.floor(i),l=Math.floor(r),u=a+1,f=l+1,h=e/a,d=n/l,m=[],x=[],v=[],p=[];for(let c=0;c<f;c++){const _=c*d-o;for(let g=0;g<u;g++){const y=g*h-s;x.push(y,-_,0),v.push(0,0,1),p.push(g/a),p.push(1-c/l)}}for(let c=0;c<l;c++)for(let _=0;_<a;_++){const g=_+u*c,y=_+u*(c+1),M=_+1+u*(c+1),A=_+1+u*c;m.push(g,y,A),m.push(y,M,A)}this.setIndex(m),this.setAttribute("position",new Et(x,3)),this.setAttribute("normal",new Et(v,3)),this.setAttribute("uv",new Et(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new hd(e.width,e.height,e.widthSegments,e.heightSegments)}}var MS=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,ES=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,TS=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,wS=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,AS=`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,RS=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,CS=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,bS=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,PS=`#ifdef USE_BATCHING
	attribute float batchId;
	uniform highp sampler2D batchingTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,LS=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,DS=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,US=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,NS=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,IS=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,FS=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,OS=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#pragma unroll_loop_start
	for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
		plane = clippingPlanes[ i ];
		if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
	}
	#pragma unroll_loop_end
	#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
		bool clipped = true;
		#pragma unroll_loop_start
		for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
		}
		#pragma unroll_loop_end
		if ( clipped ) discard;
	#endif
#endif`,zS=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,kS=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,BS=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,HS=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,GS=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,VS=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,WS=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,XS=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
float luminance( const in vec3 rgb ) {
	const vec3 weights = vec3( 0.2126729, 0.7151522, 0.0721750 );
	return dot( weights, rgb );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,jS=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_v0 0.339
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_v1 0.276
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_v4 0.046
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_v5 0.016
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_v6 0.0038
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,YS=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,qS=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,$S=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,KS=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,ZS=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,QS="gl_FragColor = linearToOutputTexel( gl_FragColor );",JS=`
const mat3 LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 = mat3(
	vec3( 0.8224621, 0.177538, 0.0 ),
	vec3( 0.0331941, 0.9668058, 0.0 ),
	vec3( 0.0170827, 0.0723974, 0.9105199 )
);
const mat3 LINEAR_DISPLAY_P3_TO_LINEAR_SRGB = mat3(
	vec3( 1.2249401, - 0.2249404, 0.0 ),
	vec3( - 0.0420569, 1.0420571, 0.0 ),
	vec3( - 0.0196376, - 0.0786361, 1.0982735 )
);
vec4 LinearSRGBToLinearDisplayP3( in vec4 value ) {
	return vec4( value.rgb * LINEAR_SRGB_TO_LINEAR_DISPLAY_P3, value.a );
}
vec4 LinearDisplayP3ToLinearSRGB( in vec4 value ) {
	return vec4( value.rgb * LINEAR_DISPLAY_P3_TO_LINEAR_SRGB, value.a );
}
vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}
vec4 LinearToLinear( in vec4 value ) {
	return value;
}
vec4 LinearTosRGB( in vec4 value ) {
	return sRGBTransferOETF( value );
}`,eM=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,tM=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,nM=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,iM=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,rM=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,sM=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,oM=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,aM=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,lM=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,uM=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,cM=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,fM=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,dM=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,hM=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,pM=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	#if defined ( LEGACY_LIGHTS )
		if ( cutoffDistance > 0.0 && decayExponent > 0.0 ) {
			return pow( saturate( - lightDistance / cutoffDistance + 1.0 ), decayExponent );
		}
		return 1.0;
	#else
		float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
		if ( cutoffDistance > 0.0 ) {
			distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
		}
		return distanceFalloff;
	#endif
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,mM=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,gM=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,_M=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,vM=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,xM=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,yM=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,SM=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,MM=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,EM=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,TM=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,wM=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,AM=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,RM=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,CM=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,bM=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,PM=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,LM=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,DM=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,UM=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,NM=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,IM=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,FM=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		objectNormal += morphNormal0 * morphTargetInfluences[ 0 ];
		objectNormal += morphNormal1 * morphTargetInfluences[ 1 ];
		objectNormal += morphNormal2 * morphTargetInfluences[ 2 ];
		objectNormal += morphNormal3 * morphTargetInfluences[ 3 ];
	#endif
#endif`,OM=`#ifdef USE_MORPHTARGETS
	uniform float morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
		uniform sampler2DArray morphTargetsTexture;
		uniform ivec2 morphTargetsTextureSize;
		vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
			int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
			int y = texelIndex / morphTargetsTextureSize.x;
			int x = texelIndex - y * morphTargetsTextureSize.x;
			ivec3 morphUV = ivec3( x, y, morphTargetIndex );
			return texelFetch( morphTargetsTexture, morphUV, 0 );
		}
	#else
		#ifndef USE_MORPHNORMALS
			uniform float morphTargetInfluences[ 8 ];
		#else
			uniform float morphTargetInfluences[ 4 ];
		#endif
	#endif
#endif`,zM=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		transformed += morphTarget0 * morphTargetInfluences[ 0 ];
		transformed += morphTarget1 * morphTargetInfluences[ 1 ];
		transformed += morphTarget2 * morphTargetInfluences[ 2 ];
		transformed += morphTarget3 * morphTargetInfluences[ 3 ];
		#ifndef USE_MORPHNORMALS
			transformed += morphTarget4 * morphTargetInfluences[ 4 ];
			transformed += morphTarget5 * morphTargetInfluences[ 5 ];
			transformed += morphTarget6 * morphTargetInfluences[ 6 ];
			transformed += morphTarget7 * morphTargetInfluences[ 7 ];
		#endif
	#endif
#endif`,kM=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,BM=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,HM=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,GM=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,VM=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,WM=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,XM=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,jM=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,YM=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,qM=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,$M=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,KM=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;
const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256., 256. );
const vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );
const float ShiftRight8 = 1. / 256.;
vec4 packDepthToRGBA( const in float v ) {
	vec4 r = vec4( fract( v * PackFactors ), v );
	r.yzw -= r.xyz * ShiftRight8;	return r * PackUpscale;
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors );
}
vec2 packDepthToRG( in highp float v ) {
	return packDepthToRGBA( v ).yx;
}
float unpackRGToDepth( const in highp vec2 v ) {
	return unpackRGBAToDepth( vec4( v.xy, 0.0, 0.0 ) );
}
vec4 pack2HalfToRGBA( vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,ZM=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,QM=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,JM=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,eE=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,tE=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,nE=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,iE=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return shadow;
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
		vec3 lightToPosition = shadowCoord.xyz;
		float dp = ( length( lightToPosition ) - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );		dp += shadowBias;
		vec3 bd3D = normalize( lightToPosition );
		#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
			vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
			return (
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
			) * ( 1.0 / 9.0 );
		#else
			return texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
		#endif
	}
#endif`,rE=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,sE=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,oE=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,aE=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,lE=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,uE=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,cE=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,fE=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,dE=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,hE=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,pE=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 OptimizedCineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,mE=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,gE=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
		vec3 refractedRayExit = position + transmissionRay;
		vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
		vec2 refractionCoords = ndcPos.xy / ndcPos.w;
		refractionCoords += 1.0;
		refractionCoords /= 2.0;
		vec4 transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
		vec3 transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,_E=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,vE=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,xE=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,yE=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const SE=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,ME=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,EE=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,TE=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,wE=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,AE=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,RE=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,CE=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#endif
}`,bE=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,PE=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,LE=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,DE=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,UE=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,NE=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,IE=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,FE=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,OE=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,zE=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,kE=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,BE=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,HE=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,GE=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), opacity );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,VE=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,WE=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,XE=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,jE=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,YE=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,qE=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,$E=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,KE=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,ZE=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,QE=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,JE=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
	vec2 scale;
	scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
	scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,eT=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,He={alphahash_fragment:MS,alphahash_pars_fragment:ES,alphamap_fragment:TS,alphamap_pars_fragment:wS,alphatest_fragment:AS,alphatest_pars_fragment:RS,aomap_fragment:CS,aomap_pars_fragment:bS,batching_pars_vertex:PS,batching_vertex:LS,begin_vertex:DS,beginnormal_vertex:US,bsdfs:NS,iridescence_fragment:IS,bumpmap_pars_fragment:FS,clipping_planes_fragment:OS,clipping_planes_pars_fragment:zS,clipping_planes_pars_vertex:kS,clipping_planes_vertex:BS,color_fragment:HS,color_pars_fragment:GS,color_pars_vertex:VS,color_vertex:WS,common:XS,cube_uv_reflection_fragment:jS,defaultnormal_vertex:YS,displacementmap_pars_vertex:qS,displacementmap_vertex:$S,emissivemap_fragment:KS,emissivemap_pars_fragment:ZS,colorspace_fragment:QS,colorspace_pars_fragment:JS,envmap_fragment:eM,envmap_common_pars_fragment:tM,envmap_pars_fragment:nM,envmap_pars_vertex:iM,envmap_physical_pars_fragment:mM,envmap_vertex:rM,fog_vertex:sM,fog_pars_vertex:oM,fog_fragment:aM,fog_pars_fragment:lM,gradientmap_pars_fragment:uM,lightmap_fragment:cM,lightmap_pars_fragment:fM,lights_lambert_fragment:dM,lights_lambert_pars_fragment:hM,lights_pars_begin:pM,lights_toon_fragment:gM,lights_toon_pars_fragment:_M,lights_phong_fragment:vM,lights_phong_pars_fragment:xM,lights_physical_fragment:yM,lights_physical_pars_fragment:SM,lights_fragment_begin:MM,lights_fragment_maps:EM,lights_fragment_end:TM,logdepthbuf_fragment:wM,logdepthbuf_pars_fragment:AM,logdepthbuf_pars_vertex:RM,logdepthbuf_vertex:CM,map_fragment:bM,map_pars_fragment:PM,map_particle_fragment:LM,map_particle_pars_fragment:DM,metalnessmap_fragment:UM,metalnessmap_pars_fragment:NM,morphcolor_vertex:IM,morphnormal_vertex:FM,morphtarget_pars_vertex:OM,morphtarget_vertex:zM,normal_fragment_begin:kM,normal_fragment_maps:BM,normal_pars_fragment:HM,normal_pars_vertex:GM,normal_vertex:VM,normalmap_pars_fragment:WM,clearcoat_normal_fragment_begin:XM,clearcoat_normal_fragment_maps:jM,clearcoat_pars_fragment:YM,iridescence_pars_fragment:qM,opaque_fragment:$M,packing:KM,premultiplied_alpha_fragment:ZM,project_vertex:QM,dithering_fragment:JM,dithering_pars_fragment:eE,roughnessmap_fragment:tE,roughnessmap_pars_fragment:nE,shadowmap_pars_fragment:iE,shadowmap_pars_vertex:rE,shadowmap_vertex:sE,shadowmask_pars_fragment:oE,skinbase_vertex:aE,skinning_pars_vertex:lE,skinning_vertex:uE,skinnormal_vertex:cE,specularmap_fragment:fE,specularmap_pars_fragment:dE,tonemapping_fragment:hE,tonemapping_pars_fragment:pE,transmission_fragment:mE,transmission_pars_fragment:gE,uv_pars_fragment:_E,uv_pars_vertex:vE,uv_vertex:xE,worldpos_vertex:yE,background_vert:SE,background_frag:ME,backgroundCube_vert:EE,backgroundCube_frag:TE,cube_vert:wE,cube_frag:AE,depth_vert:RE,depth_frag:CE,distanceRGBA_vert:bE,distanceRGBA_frag:PE,equirect_vert:LE,equirect_frag:DE,linedashed_vert:UE,linedashed_frag:NE,meshbasic_vert:IE,meshbasic_frag:FE,meshlambert_vert:OE,meshlambert_frag:zE,meshmatcap_vert:kE,meshmatcap_frag:BE,meshnormal_vert:HE,meshnormal_frag:GE,meshphong_vert:VE,meshphong_frag:WE,meshphysical_vert:XE,meshphysical_frag:jE,meshtoon_vert:YE,meshtoon_frag:qE,points_vert:$E,points_frag:KE,shadow_vert:ZE,shadow_frag:QE,sprite_vert:JE,sprite_frag:eT},fe={common:{diffuse:{value:new Ve(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ye},alphaMap:{value:null},alphaMapTransform:{value:new Ye},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ye}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ye}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ye}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ye},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ye},normalScale:{value:new Re(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ye},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ye}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ye}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ye}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ve(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Ve(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ye},alphaTest:{value:0},uvTransform:{value:new Ye}},sprite:{diffuse:{value:new Ve(16777215)},opacity:{value:1},center:{value:new Re(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ye},alphaMap:{value:null},alphaMapTransform:{value:new Ye},alphaTest:{value:0}}},jn={basic:{uniforms:qt([fe.common,fe.specularmap,fe.envmap,fe.aomap,fe.lightmap,fe.fog]),vertexShader:He.meshbasic_vert,fragmentShader:He.meshbasic_frag},lambert:{uniforms:qt([fe.common,fe.specularmap,fe.envmap,fe.aomap,fe.lightmap,fe.emissivemap,fe.bumpmap,fe.normalmap,fe.displacementmap,fe.fog,fe.lights,{emissive:{value:new Ve(0)}}]),vertexShader:He.meshlambert_vert,fragmentShader:He.meshlambert_frag},phong:{uniforms:qt([fe.common,fe.specularmap,fe.envmap,fe.aomap,fe.lightmap,fe.emissivemap,fe.bumpmap,fe.normalmap,fe.displacementmap,fe.fog,fe.lights,{emissive:{value:new Ve(0)},specular:{value:new Ve(1118481)},shininess:{value:30}}]),vertexShader:He.meshphong_vert,fragmentShader:He.meshphong_frag},standard:{uniforms:qt([fe.common,fe.envmap,fe.aomap,fe.lightmap,fe.emissivemap,fe.bumpmap,fe.normalmap,fe.displacementmap,fe.roughnessmap,fe.metalnessmap,fe.fog,fe.lights,{emissive:{value:new Ve(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:He.meshphysical_vert,fragmentShader:He.meshphysical_frag},toon:{uniforms:qt([fe.common,fe.aomap,fe.lightmap,fe.emissivemap,fe.bumpmap,fe.normalmap,fe.displacementmap,fe.gradientmap,fe.fog,fe.lights,{emissive:{value:new Ve(0)}}]),vertexShader:He.meshtoon_vert,fragmentShader:He.meshtoon_frag},matcap:{uniforms:qt([fe.common,fe.bumpmap,fe.normalmap,fe.displacementmap,fe.fog,{matcap:{value:null}}]),vertexShader:He.meshmatcap_vert,fragmentShader:He.meshmatcap_frag},points:{uniforms:qt([fe.points,fe.fog]),vertexShader:He.points_vert,fragmentShader:He.points_frag},dashed:{uniforms:qt([fe.common,fe.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:He.linedashed_vert,fragmentShader:He.linedashed_frag},depth:{uniforms:qt([fe.common,fe.displacementmap]),vertexShader:He.depth_vert,fragmentShader:He.depth_frag},normal:{uniforms:qt([fe.common,fe.bumpmap,fe.normalmap,fe.displacementmap,{opacity:{value:1}}]),vertexShader:He.meshnormal_vert,fragmentShader:He.meshnormal_frag},sprite:{uniforms:qt([fe.sprite,fe.fog]),vertexShader:He.sprite_vert,fragmentShader:He.sprite_frag},background:{uniforms:{uvTransform:{value:new Ye},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:He.background_vert,fragmentShader:He.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:He.backgroundCube_vert,fragmentShader:He.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:He.cube_vert,fragmentShader:He.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:He.equirect_vert,fragmentShader:He.equirect_frag},distanceRGBA:{uniforms:qt([fe.common,fe.displacementmap,{referencePosition:{value:new N},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:He.distanceRGBA_vert,fragmentShader:He.distanceRGBA_frag},shadow:{uniforms:qt([fe.lights,fe.fog,{color:{value:new Ve(0)},opacity:{value:1}}]),vertexShader:He.shadow_vert,fragmentShader:He.shadow_frag}};jn.physical={uniforms:qt([jn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ye},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ye},clearcoatNormalScale:{value:new Re(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ye},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ye},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ye},sheen:{value:0},sheenColor:{value:new Ve(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ye},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ye},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ye},transmissionSamplerSize:{value:new Re},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ye},attenuationDistance:{value:0},attenuationColor:{value:new Ve(0)},specularColor:{value:new Ve(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ye},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ye},anisotropyVector:{value:new Re},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ye}}]),vertexShader:He.meshphysical_vert,fragmentShader:He.meshphysical_frag};const La={r:0,b:0,g:0};function tT(t,e,n,i,r,s,o){const a=new Ve(0);let l=s===!0?0:1,u,f,h=null,d=0,m=null;function x(p,c){let _=!1,g=c.isScene===!0?c.background:null;g&&g.isTexture&&(g=(c.backgroundBlurriness>0?n:e).get(g)),g===null?v(a,l):g&&g.isColor&&(v(g,1),_=!0);const y=t.xr.getEnvironmentBlendMode();y==="additive"?i.buffers.color.setClear(0,0,0,1,o):y==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,o),(t.autoClear||_)&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),g&&(g.isCubeTexture||g.mapping===Xl)?(f===void 0&&(f=new qn(new Xo(1,1,1),new wr({name:"BackgroundCubeMaterial",uniforms:Ls(jn.backgroundCube.uniforms),vertexShader:jn.backgroundCube.vertexShader,fragmentShader:jn.backgroundCube.fragmentShader,side:an,depthTest:!1,depthWrite:!1,fog:!1})),f.geometry.deleteAttribute("normal"),f.geometry.deleteAttribute("uv"),f.onBeforeRender=function(M,A,w){this.matrixWorld.copyPosition(w.matrixWorld)},Object.defineProperty(f.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(f)),f.material.uniforms.envMap.value=g,f.material.uniforms.flipEnvMap.value=g.isCubeTexture&&g.isRenderTargetTexture===!1?-1:1,f.material.uniforms.backgroundBlurriness.value=c.backgroundBlurriness,f.material.uniforms.backgroundIntensity.value=c.backgroundIntensity,f.material.toneMapped=Qe.getTransfer(g.colorSpace)!==rt,(h!==g||d!==g.version||m!==t.toneMapping)&&(f.material.needsUpdate=!0,h=g,d=g.version,m=t.toneMapping),f.layers.enableAll(),p.unshift(f,f.geometry,f.material,0,0,null)):g&&g.isTexture&&(u===void 0&&(u=new qn(new hd(2,2),new wr({name:"BackgroundMaterial",uniforms:Ls(jn.background.uniforms),vertexShader:jn.background.vertexShader,fragmentShader:jn.background.fragmentShader,side:Ki,depthTest:!1,depthWrite:!1,fog:!1})),u.geometry.deleteAttribute("normal"),Object.defineProperty(u.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(u)),u.material.uniforms.t2D.value=g,u.material.uniforms.backgroundIntensity.value=c.backgroundIntensity,u.material.toneMapped=Qe.getTransfer(g.colorSpace)!==rt,g.matrixAutoUpdate===!0&&g.updateMatrix(),u.material.uniforms.uvTransform.value.copy(g.matrix),(h!==g||d!==g.version||m!==t.toneMapping)&&(u.material.needsUpdate=!0,h=g,d=g.version,m=t.toneMapping),u.layers.enableAll(),p.unshift(u,u.geometry,u.material,0,0,null))}function v(p,c){p.getRGB(La,Z_(t)),i.buffers.color.setClear(La.r,La.g,La.b,c,o)}return{getClearColor:function(){return a},setClearColor:function(p,c=1){a.set(p),l=c,v(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(p){l=p,v(a,l)},render:x}}function nT(t,e,n,i){const r=t.getParameter(t.MAX_VERTEX_ATTRIBS),s=i.isWebGL2?null:e.get("OES_vertex_array_object"),o=i.isWebGL2||s!==null,a={},l=p(null);let u=l,f=!1;function h(L,D,z,W,F){let B=!1;if(o){const k=v(W,z,D);u!==k&&(u=k,m(u.object)),B=c(L,W,z,F),B&&_(L,W,z,F)}else{const k=D.wireframe===!0;(u.geometry!==W.id||u.program!==z.id||u.wireframe!==k)&&(u.geometry=W.id,u.program=z.id,u.wireframe=k,B=!0)}F!==null&&n.update(F,t.ELEMENT_ARRAY_BUFFER),(B||f)&&(f=!1,b(L,D,z,W),F!==null&&t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,n.get(F).buffer))}function d(){return i.isWebGL2?t.createVertexArray():s.createVertexArrayOES()}function m(L){return i.isWebGL2?t.bindVertexArray(L):s.bindVertexArrayOES(L)}function x(L){return i.isWebGL2?t.deleteVertexArray(L):s.deleteVertexArrayOES(L)}function v(L,D,z){const W=z.wireframe===!0;let F=a[L.id];F===void 0&&(F={},a[L.id]=F);let B=F[D.id];B===void 0&&(B={},F[D.id]=B);let k=B[W];return k===void 0&&(k=p(d()),B[W]=k),k}function p(L){const D=[],z=[],W=[];for(let F=0;F<r;F++)D[F]=0,z[F]=0,W[F]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:D,enabledAttributes:z,attributeDivisors:W,object:L,attributes:{},index:null}}function c(L,D,z,W){const F=u.attributes,B=D.attributes;let k=0;const Q=z.getAttributes();for(const ee in Q)if(Q[ee].location>=0){const Z=F[ee];let de=B[ee];if(de===void 0&&(ee==="instanceMatrix"&&L.instanceMatrix&&(de=L.instanceMatrix),ee==="instanceColor"&&L.instanceColor&&(de=L.instanceColor)),Z===void 0||Z.attribute!==de||de&&Z.data!==de.data)return!0;k++}return u.attributesNum!==k||u.index!==W}function _(L,D,z,W){const F={},B=D.attributes;let k=0;const Q=z.getAttributes();for(const ee in Q)if(Q[ee].location>=0){let Z=B[ee];Z===void 0&&(ee==="instanceMatrix"&&L.instanceMatrix&&(Z=L.instanceMatrix),ee==="instanceColor"&&L.instanceColor&&(Z=L.instanceColor));const de={};de.attribute=Z,Z&&Z.data&&(de.data=Z.data),F[ee]=de,k++}u.attributes=F,u.attributesNum=k,u.index=W}function g(){const L=u.newAttributes;for(let D=0,z=L.length;D<z;D++)L[D]=0}function y(L){M(L,0)}function M(L,D){const z=u.newAttributes,W=u.enabledAttributes,F=u.attributeDivisors;z[L]=1,W[L]===0&&(t.enableVertexAttribArray(L),W[L]=1),F[L]!==D&&((i.isWebGL2?t:e.get("ANGLE_instanced_arrays"))[i.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](L,D),F[L]=D)}function A(){const L=u.newAttributes,D=u.enabledAttributes;for(let z=0,W=D.length;z<W;z++)D[z]!==L[z]&&(t.disableVertexAttribArray(z),D[z]=0)}function w(L,D,z,W,F,B,k){k===!0?t.vertexAttribIPointer(L,D,z,F,B):t.vertexAttribPointer(L,D,z,W,F,B)}function b(L,D,z,W){if(i.isWebGL2===!1&&(L.isInstancedMesh||W.isInstancedBufferGeometry)&&e.get("ANGLE_instanced_arrays")===null)return;g();const F=W.attributes,B=z.getAttributes(),k=D.defaultAttributeValues;for(const Q in B){const ee=B[Q];if(ee.location>=0){let $=F[Q];if($===void 0&&(Q==="instanceMatrix"&&L.instanceMatrix&&($=L.instanceMatrix),Q==="instanceColor"&&L.instanceColor&&($=L.instanceColor)),$!==void 0){const Z=$.normalized,de=$.itemSize,ve=n.get($);if(ve===void 0)continue;const ye=ve.buffer,Ie=ve.type,De=ve.bytesPerElement,Pe=i.isWebGL2===!0&&(Ie===t.INT||Ie===t.UNSIGNED_INT||$.gpuType===D_);if($.isInterleavedBufferAttribute){const Oe=$.data,V=Oe.stride,At=$.offset;if(Oe.isInstancedInterleavedBuffer){for(let Te=0;Te<ee.locationSize;Te++)M(ee.location+Te,Oe.meshPerAttribute);L.isInstancedMesh!==!0&&W._maxInstanceCount===void 0&&(W._maxInstanceCount=Oe.meshPerAttribute*Oe.count)}else for(let Te=0;Te<ee.locationSize;Te++)y(ee.location+Te);t.bindBuffer(t.ARRAY_BUFFER,ye);for(let Te=0;Te<ee.locationSize;Te++)w(ee.location+Te,de/ee.locationSize,Ie,Z,V*De,(At+de/ee.locationSize*Te)*De,Pe)}else{if($.isInstancedBufferAttribute){for(let Oe=0;Oe<ee.locationSize;Oe++)M(ee.location+Oe,$.meshPerAttribute);L.isInstancedMesh!==!0&&W._maxInstanceCount===void 0&&(W._maxInstanceCount=$.meshPerAttribute*$.count)}else for(let Oe=0;Oe<ee.locationSize;Oe++)y(ee.location+Oe);t.bindBuffer(t.ARRAY_BUFFER,ye);for(let Oe=0;Oe<ee.locationSize;Oe++)w(ee.location+Oe,de/ee.locationSize,Ie,Z,de*De,de/ee.locationSize*Oe*De,Pe)}}else if(k!==void 0){const Z=k[Q];if(Z!==void 0)switch(Z.length){case 2:t.vertexAttrib2fv(ee.location,Z);break;case 3:t.vertexAttrib3fv(ee.location,Z);break;case 4:t.vertexAttrib4fv(ee.location,Z);break;default:t.vertexAttrib1fv(ee.location,Z)}}}}A()}function S(){I();for(const L in a){const D=a[L];for(const z in D){const W=D[z];for(const F in W)x(W[F].object),delete W[F];delete D[z]}delete a[L]}}function R(L){if(a[L.id]===void 0)return;const D=a[L.id];for(const z in D){const W=D[z];for(const F in W)x(W[F].object),delete W[F];delete D[z]}delete a[L.id]}function H(L){for(const D in a){const z=a[D];if(z[L.id]===void 0)continue;const W=z[L.id];for(const F in W)x(W[F].object),delete W[F];delete z[L.id]}}function I(){G(),f=!0,u!==l&&(u=l,m(u.object))}function G(){l.geometry=null,l.program=null,l.wireframe=!1}return{setup:h,reset:I,resetDefaultState:G,dispose:S,releaseStatesOfGeometry:R,releaseStatesOfProgram:H,initAttributes:g,enableAttribute:y,disableUnusedAttributes:A}}function iT(t,e,n,i){const r=i.isWebGL2;let s;function o(f){s=f}function a(f,h){t.drawArrays(s,f,h),n.update(h,s,1)}function l(f,h,d){if(d===0)return;let m,x;if(r)m=t,x="drawArraysInstanced";else if(m=e.get("ANGLE_instanced_arrays"),x="drawArraysInstancedANGLE",m===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}m[x](s,f,h,d),n.update(h,s,d)}function u(f,h,d){if(d===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let x=0;x<d;x++)this.render(f[x],h[x]);else{m.multiDrawArraysWEBGL(s,f,0,h,0,d);let x=0;for(let v=0;v<d;v++)x+=h[v];n.update(x,s,1)}}this.setMode=o,this.render=a,this.renderInstances=l,this.renderMultiDraw=u}function rT(t,e,n){let i;function r(){if(i!==void 0)return i;if(e.has("EXT_texture_filter_anisotropic")===!0){const w=e.get("EXT_texture_filter_anisotropic");i=t.getParameter(w.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function s(w){if(w==="highp"){if(t.getShaderPrecisionFormat(t.VERTEX_SHADER,t.HIGH_FLOAT).precision>0&&t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.HIGH_FLOAT).precision>0)return"highp";w="mediump"}return w==="mediump"&&t.getShaderPrecisionFormat(t.VERTEX_SHADER,t.MEDIUM_FLOAT).precision>0&&t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}const o=typeof WebGL2RenderingContext<"u"&&t.constructor.name==="WebGL2RenderingContext";let a=n.precision!==void 0?n.precision:"highp";const l=s(a);l!==a&&(console.warn("THREE.WebGLRenderer:",a,"not supported, using",l,"instead."),a=l);const u=o||e.has("WEBGL_draw_buffers"),f=n.logarithmicDepthBuffer===!0,h=t.getParameter(t.MAX_TEXTURE_IMAGE_UNITS),d=t.getParameter(t.MAX_VERTEX_TEXTURE_IMAGE_UNITS),m=t.getParameter(t.MAX_TEXTURE_SIZE),x=t.getParameter(t.MAX_CUBE_MAP_TEXTURE_SIZE),v=t.getParameter(t.MAX_VERTEX_ATTRIBS),p=t.getParameter(t.MAX_VERTEX_UNIFORM_VECTORS),c=t.getParameter(t.MAX_VARYING_VECTORS),_=t.getParameter(t.MAX_FRAGMENT_UNIFORM_VECTORS),g=d>0,y=o||e.has("OES_texture_float"),M=g&&y,A=o?t.getParameter(t.MAX_SAMPLES):0;return{isWebGL2:o,drawBuffers:u,getMaxAnisotropy:r,getMaxPrecision:s,precision:a,logarithmicDepthBuffer:f,maxTextures:h,maxVertexTextures:d,maxTextureSize:m,maxCubemapSize:x,maxAttributes:v,maxVertexUniforms:p,maxVaryings:c,maxFragmentUniforms:_,vertexTextures:g,floatFragmentTextures:y,floatVertexTextures:M,maxSamples:A}}function sT(t){const e=this;let n=null,i=0,r=!1,s=!1;const o=new Ci,a=new Ye,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(h,d){const m=h.length!==0||d||i!==0||r;return r=d,i=h.length,m},this.beginShadows=function(){s=!0,f(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(h,d){n=f(h,d,0)},this.setState=function(h,d,m){const x=h.clippingPlanes,v=h.clipIntersection,p=h.clipShadows,c=t.get(h);if(!r||x===null||x.length===0||s&&!p)s?f(null):u();else{const _=s?0:i,g=_*4;let y=c.clippingState||null;l.value=y,y=f(x,d,g,m);for(let M=0;M!==g;++M)y[M]=n[M];c.clippingState=y,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=_}};function u(){l.value!==n&&(l.value=n,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function f(h,d,m,x){const v=h!==null?h.length:0;let p=null;if(v!==0){if(p=l.value,x!==!0||p===null){const c=m+v*4,_=d.matrixWorldInverse;a.getNormalMatrix(_),(p===null||p.length<c)&&(p=new Float32Array(c));for(let g=0,y=m;g!==v;++g,y+=4)o.copy(h[g]).applyMatrix4(_,a),o.normal.toArray(p,y),p[y+3]=o.constant}l.value=p,l.needsUpdate=!0}return e.numPlanes=v,e.numIntersection=0,p}}function oT(t){let e=new WeakMap;function n(o,a){return a===rf?o.mapping=Cs:a===sf&&(o.mapping=bs),o}function i(o){if(o&&o.isTexture){const a=o.mapping;if(a===rf||a===sf)if(e.has(o)){const l=e.get(o).texture;return n(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const u=new vS(l.height/2);return u.fromEquirectangularTexture(t,o),e.set(o,u),o.addEventListener("dispose",r),n(u.texture,o.mapping)}else return null}}return o}function r(o){const a=o.target;a.removeEventListener("dispose",r);const l=e.get(a);l!==void 0&&(e.delete(a),l.dispose())}function s(){e=new WeakMap}return{get:i,dispose:s}}class tv extends Q_{constructor(e=-1,n=1,i=1,r=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=n,this.top=i,this.bottom=r,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(e,n){return super.copy(e,n),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,n,i,r,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),n=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=i-e,o=i+e,a=r+n,l=r-n;if(this.view!==null&&this.view.enabled){const u=(this.right-this.left)/this.view.fullWidth/this.zoom,f=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=u*this.view.offsetX,o=s+u*this.view.width,a-=f*this.view.offsetY,l=a-f*this.view.height}this.projectionMatrix.makeOrthographic(s,o,a,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const n=super.toJSON(e);return n.object.zoom=this.zoom,n.object.left=this.left,n.object.right=this.right,n.object.top=this.top,n.object.bottom=this.bottom,n.object.near=this.near,n.object.far=this.far,this.view!==null&&(n.object.view=Object.assign({},this.view)),n}}const ds=4,Lp=[.125,.215,.35,.446,.526,.582],cr=20,Ku=new tv,Dp=new Ve;let Zu=null,Qu=0,Ju=0;const lr=(1+Math.sqrt(5))/2,qr=1/lr,Up=[new N(1,1,1),new N(-1,1,1),new N(1,1,-1),new N(-1,1,-1),new N(0,lr,qr),new N(0,lr,-qr),new N(qr,0,lr),new N(-qr,0,lr),new N(lr,qr,0),new N(-lr,qr,0)];class Np{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,n=0,i=.1,r=100){Zu=this._renderer.getRenderTarget(),Qu=this._renderer.getActiveCubeFace(),Ju=this._renderer.getActiveMipmapLevel(),this._setSize(256);const s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,i,r,s),n>0&&this._blur(s,0,0,n),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,n=null){return this._fromTexture(e,n)}fromCubemap(e,n=null){return this._fromTexture(e,n)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Op(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Fp(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Zu,Qu,Ju),e.scissorTest=!1,Da(e,0,0,e.width,e.height)}_fromTexture(e,n){e.mapping===Cs||e.mapping===bs?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Zu=this._renderer.getRenderTarget(),Qu=this._renderer.getActiveCubeFace(),Ju=this._renderer.getActiveMipmapLevel();const i=n||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),n=4*this._cubeSize,i={magFilter:Mn,minFilter:Mn,generateMipmaps:!1,type:zo,format:zn,colorSpace:gi,depthBuffer:!1},r=Ip(e,n,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==n){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Ip(e,n,i);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=aT(s)),this._blurMaterial=lT(s,e,n)}return r}_compileMaterial(e){const n=new qn(this._lodPlanes[0],e);this._renderer.compile(n,Ku)}_sceneToCubeUV(e,n,i,r){const a=new Tn(90,1,n,i),l=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],f=this._renderer,h=f.autoClear,d=f.toneMapping;f.getClearColor(Dp),f.toneMapping=Wi,f.autoClear=!1;const m=new q_({name:"PMREM.Background",side:an,depthWrite:!1,depthTest:!1}),x=new qn(new Xo,m);let v=!1;const p=e.background;p?p.isColor&&(m.color.copy(p),e.background=null,v=!0):(m.color.copy(Dp),v=!0);for(let c=0;c<6;c++){const _=c%3;_===0?(a.up.set(0,l[c],0),a.lookAt(u[c],0,0)):_===1?(a.up.set(0,0,l[c]),a.lookAt(0,u[c],0)):(a.up.set(0,l[c],0),a.lookAt(0,0,u[c]));const g=this._cubeSize;Da(r,_*g,c>2?g:0,g,g),f.setRenderTarget(r),v&&f.render(x,a),f.render(e,a)}x.geometry.dispose(),x.material.dispose(),f.toneMapping=d,f.autoClear=h,e.background=p}_textureToCubeUV(e,n){const i=this._renderer,r=e.mapping===Cs||e.mapping===bs;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Op()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Fp());const s=r?this._cubemapMaterial:this._equirectMaterial,o=new qn(this._lodPlanes[0],s),a=s.uniforms;a.envMap.value=e;const l=this._cubeSize;Da(n,0,0,3*l,2*l),i.setRenderTarget(n),i.render(o,Ku)}_applyPMREM(e){const n=this._renderer,i=n.autoClear;n.autoClear=!1;for(let r=1;r<this._lodPlanes.length;r++){const s=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),o=Up[(r-1)%Up.length];this._blur(e,r-1,r,s,o)}n.autoClear=i}_blur(e,n,i,r,s){const o=this._pingPongRenderTarget;this._halfBlur(e,o,n,i,r,"latitudinal",s),this._halfBlur(o,e,i,i,r,"longitudinal",s)}_halfBlur(e,n,i,r,s,o,a){const l=this._renderer,u=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const f=3,h=new qn(this._lodPlanes[r],u),d=u.uniforms,m=this._sizeLods[i]-1,x=isFinite(s)?Math.PI/(2*m):2*Math.PI/(2*cr-1),v=s/x,p=isFinite(s)?1+Math.floor(f*v):cr;p>cr&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${cr}`);const c=[];let _=0;for(let w=0;w<cr;++w){const b=w/v,S=Math.exp(-b*b/2);c.push(S),w===0?_+=S:w<p&&(_+=2*S)}for(let w=0;w<c.length;w++)c[w]=c[w]/_;d.envMap.value=e.texture,d.samples.value=p,d.weights.value=c,d.latitudinal.value=o==="latitudinal",a&&(d.poleAxis.value=a);const{_lodMax:g}=this;d.dTheta.value=x,d.mipInt.value=g-i;const y=this._sizeLods[r],M=3*y*(r>g-ds?r-g+ds:0),A=4*(this._cubeSize-y);Da(n,M,A,3*y,2*y),l.setRenderTarget(n),l.render(h,Ku)}}function aT(t){const e=[],n=[],i=[];let r=t;const s=t-ds+1+Lp.length;for(let o=0;o<s;o++){const a=Math.pow(2,r);n.push(a);let l=1/a;o>t-ds?l=Lp[o-t+ds-1]:o===0&&(l=0),i.push(l);const u=1/(a-2),f=-u,h=1+u,d=[f,f,h,f,h,h,f,f,h,h,f,h],m=6,x=6,v=3,p=2,c=1,_=new Float32Array(v*x*m),g=new Float32Array(p*x*m),y=new Float32Array(c*x*m);for(let A=0;A<m;A++){const w=A%3*2/3-1,b=A>2?0:-1,S=[w,b,0,w+2/3,b,0,w+2/3,b+1,0,w,b,0,w+2/3,b+1,0,w,b+1,0];_.set(S,v*x*A),g.set(d,p*x*A);const R=[A,A,A,A,A,A];y.set(R,c*x*A)}const M=new It;M.setAttribute("position",new Hn(_,v)),M.setAttribute("uv",new Hn(g,p)),M.setAttribute("faceIndex",new Hn(y,c)),e.push(M),r>ds&&r--}return{lodPlanes:e,sizeLods:n,sigmas:i}}function Ip(t,e,n){const i=new Er(t,e,n);return i.texture.mapping=Xl,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Da(t,e,n,i,r){t.viewport.set(e,n,i,r),t.scissor.set(e,n,i,r)}function lT(t,e,n){const i=new Float32Array(cr),r=new N(0,1,0);return new wr({name:"SphericalGaussianBlur",defines:{n:cr,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${t}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:pd(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Vi,depthTest:!1,depthWrite:!1})}function Fp(){return new wr({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:pd(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Vi,depthTest:!1,depthWrite:!1})}function Op(){return new wr({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:pd(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Vi,depthTest:!1,depthWrite:!1})}function pd(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function uT(t){let e=new WeakMap,n=null;function i(a){if(a&&a.isTexture){const l=a.mapping,u=l===rf||l===sf,f=l===Cs||l===bs;if(u||f)if(a.isRenderTargetTexture&&a.needsPMREMUpdate===!0){a.needsPMREMUpdate=!1;let h=e.get(a);return n===null&&(n=new Np(t)),h=u?n.fromEquirectangular(a,h):n.fromCubemap(a,h),e.set(a,h),h.texture}else{if(e.has(a))return e.get(a).texture;{const h=a.image;if(u&&h&&h.height>0||f&&h&&r(h)){n===null&&(n=new Np(t));const d=u?n.fromEquirectangular(a):n.fromCubemap(a);return e.set(a,d),a.addEventListener("dispose",s),d.texture}else return null}}}return a}function r(a){let l=0;const u=6;for(let f=0;f<u;f++)a[f]!==void 0&&l++;return l===u}function s(a){const l=a.target;l.removeEventListener("dispose",s);const u=e.get(l);u!==void 0&&(e.delete(l),u.dispose())}function o(){e=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:i,dispose:o}}function cT(t){const e={};function n(i){if(e[i]!==void 0)return e[i];let r;switch(i){case"WEBGL_depth_texture":r=t.getExtension("WEBGL_depth_texture")||t.getExtension("MOZ_WEBGL_depth_texture")||t.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=t.getExtension("EXT_texture_filter_anisotropic")||t.getExtension("MOZ_EXT_texture_filter_anisotropic")||t.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=t.getExtension("WEBGL_compressed_texture_s3tc")||t.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||t.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=t.getExtension("WEBGL_compressed_texture_pvrtc")||t.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=t.getExtension(i)}return e[i]=r,r}return{has:function(i){return n(i)!==null},init:function(i){i.isWebGL2?n("EXT_color_buffer_float"):(n("WEBGL_depth_texture"),n("OES_texture_float"),n("OES_texture_half_float"),n("OES_texture_half_float_linear"),n("OES_standard_derivatives"),n("OES_element_index_uint"),n("OES_vertex_array_object"),n("ANGLE_instanced_arrays")),n("OES_texture_float_linear"),n("EXT_color_buffer_half_float"),n("WEBGL_multisampled_render_to_texture")},get:function(i){const r=n(i);return r===null&&console.warn("THREE.WebGLRenderer: "+i+" extension not supported."),r}}}function fT(t,e,n,i){const r={},s=new WeakMap;function o(h){const d=h.target;d.index!==null&&e.remove(d.index);for(const x in d.attributes)e.remove(d.attributes[x]);for(const x in d.morphAttributes){const v=d.morphAttributes[x];for(let p=0,c=v.length;p<c;p++)e.remove(v[p])}d.removeEventListener("dispose",o),delete r[d.id];const m=s.get(d);m&&(e.remove(m),s.delete(d)),i.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,n.memory.geometries--}function a(h,d){return r[d.id]===!0||(d.addEventListener("dispose",o),r[d.id]=!0,n.memory.geometries++),d}function l(h){const d=h.attributes;for(const x in d)e.update(d[x],t.ARRAY_BUFFER);const m=h.morphAttributes;for(const x in m){const v=m[x];for(let p=0,c=v.length;p<c;p++)e.update(v[p],t.ARRAY_BUFFER)}}function u(h){const d=[],m=h.index,x=h.attributes.position;let v=0;if(m!==null){const _=m.array;v=m.version;for(let g=0,y=_.length;g<y;g+=3){const M=_[g+0],A=_[g+1],w=_[g+2];d.push(M,A,A,w,w,M)}}else if(x!==void 0){const _=x.array;v=x.version;for(let g=0,y=_.length/3-1;g<y;g+=3){const M=g+0,A=g+1,w=g+2;d.push(M,A,A,w,w,M)}}else return;const p=new(G_(d)?K_:$_)(d,1);p.version=v;const c=s.get(h);c&&e.remove(c),s.set(h,p)}function f(h){const d=s.get(h);if(d){const m=h.index;m!==null&&d.version<m.version&&u(h)}else u(h);return s.get(h)}return{get:a,update:l,getWireframeAttribute:f}}function dT(t,e,n,i){const r=i.isWebGL2;let s;function o(m){s=m}let a,l;function u(m){a=m.type,l=m.bytesPerElement}function f(m,x){t.drawElements(s,x,a,m*l),n.update(x,s,1)}function h(m,x,v){if(v===0)return;let p,c;if(r)p=t,c="drawElementsInstanced";else if(p=e.get("ANGLE_instanced_arrays"),c="drawElementsInstancedANGLE",p===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}p[c](s,x,a,m*l,v),n.update(x,s,v)}function d(m,x,v){if(v===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let c=0;c<v;c++)this.render(m[c]/l,x[c]);else{p.multiDrawElementsWEBGL(s,x,0,a,m,0,v);let c=0;for(let _=0;_<v;_++)c+=x[_];n.update(c,s,1)}}this.setMode=o,this.setIndex=u,this.render=f,this.renderInstances=h,this.renderMultiDraw=d}function hT(t){const e={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,o,a){switch(n.calls++,o){case t.TRIANGLES:n.triangles+=a*(s/3);break;case t.LINES:n.lines+=a*(s/2);break;case t.LINE_STRIP:n.lines+=a*(s-1);break;case t.LINE_LOOP:n.lines+=a*s;break;case t.POINTS:n.points+=a*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function r(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:e,render:n,programs:null,autoReset:!0,reset:r,update:i}}function pT(t,e){return t[0]-e[0]}function mT(t,e){return Math.abs(e[1])-Math.abs(t[1])}function gT(t,e,n){const i={},r=new Float32Array(8),s=new WeakMap,o=new Lt,a=[];for(let u=0;u<8;u++)a[u]=[u,0];function l(u,f,h){const d=u.morphTargetInfluences;if(e.isWebGL2===!0){const x=f.morphAttributes.position||f.morphAttributes.normal||f.morphAttributes.color,v=x!==void 0?x.length:0;let p=s.get(f);if(p===void 0||p.count!==v){let D=function(){G.dispose(),s.delete(f),f.removeEventListener("dispose",D)};var m=D;p!==void 0&&p.texture.dispose();const g=f.morphAttributes.position!==void 0,y=f.morphAttributes.normal!==void 0,M=f.morphAttributes.color!==void 0,A=f.morphAttributes.position||[],w=f.morphAttributes.normal||[],b=f.morphAttributes.color||[];let S=0;g===!0&&(S=1),y===!0&&(S=2),M===!0&&(S=3);let R=f.attributes.position.count*S,H=1;R>e.maxTextureSize&&(H=Math.ceil(R/e.maxTextureSize),R=e.maxTextureSize);const I=new Float32Array(R*H*4*v),G=new X_(I,R,H,v);G.type=Ni,G.needsUpdate=!0;const L=S*4;for(let z=0;z<v;z++){const W=A[z],F=w[z],B=b[z],k=R*H*4*z;for(let Q=0;Q<W.count;Q++){const ee=Q*L;g===!0&&(o.fromBufferAttribute(W,Q),I[k+ee+0]=o.x,I[k+ee+1]=o.y,I[k+ee+2]=o.z,I[k+ee+3]=0),y===!0&&(o.fromBufferAttribute(F,Q),I[k+ee+4]=o.x,I[k+ee+5]=o.y,I[k+ee+6]=o.z,I[k+ee+7]=0),M===!0&&(o.fromBufferAttribute(B,Q),I[k+ee+8]=o.x,I[k+ee+9]=o.y,I[k+ee+10]=o.z,I[k+ee+11]=B.itemSize===4?o.w:1)}}p={count:v,texture:G,size:new Re(R,H)},s.set(f,p),f.addEventListener("dispose",D)}let c=0;for(let g=0;g<d.length;g++)c+=d[g];const _=f.morphTargetsRelative?1:1-c;h.getUniforms().setValue(t,"morphTargetBaseInfluence",_),h.getUniforms().setValue(t,"morphTargetInfluences",d),h.getUniforms().setValue(t,"morphTargetsTexture",p.texture,n),h.getUniforms().setValue(t,"morphTargetsTextureSize",p.size)}else{const x=d===void 0?0:d.length;let v=i[f.id];if(v===void 0||v.length!==x){v=[];for(let y=0;y<x;y++)v[y]=[y,0];i[f.id]=v}for(let y=0;y<x;y++){const M=v[y];M[0]=y,M[1]=d[y]}v.sort(mT);for(let y=0;y<8;y++)y<x&&v[y][1]?(a[y][0]=v[y][0],a[y][1]=v[y][1]):(a[y][0]=Number.MAX_SAFE_INTEGER,a[y][1]=0);a.sort(pT);const p=f.morphAttributes.position,c=f.morphAttributes.normal;let _=0;for(let y=0;y<8;y++){const M=a[y],A=M[0],w=M[1];A!==Number.MAX_SAFE_INTEGER&&w?(p&&f.getAttribute("morphTarget"+y)!==p[A]&&f.setAttribute("morphTarget"+y,p[A]),c&&f.getAttribute("morphNormal"+y)!==c[A]&&f.setAttribute("morphNormal"+y,c[A]),r[y]=w,_+=w):(p&&f.hasAttribute("morphTarget"+y)===!0&&f.deleteAttribute("morphTarget"+y),c&&f.hasAttribute("morphNormal"+y)===!0&&f.deleteAttribute("morphNormal"+y),r[y]=0)}const g=f.morphTargetsRelative?1:1-_;h.getUniforms().setValue(t,"morphTargetBaseInfluence",g),h.getUniforms().setValue(t,"morphTargetInfluences",r)}}return{update:l}}function _T(t,e,n,i){let r=new WeakMap;function s(l){const u=i.render.frame,f=l.geometry,h=e.get(l,f);if(r.get(h)!==u&&(e.update(h),r.set(h,u)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),r.get(l)!==u&&(n.update(l.instanceMatrix,t.ARRAY_BUFFER),l.instanceColor!==null&&n.update(l.instanceColor,t.ARRAY_BUFFER),r.set(l,u))),l.isSkinnedMesh){const d=l.skeleton;r.get(d)!==u&&(d.update(),r.set(d,u))}return h}function o(){r=new WeakMap}function a(l){const u=l.target;u.removeEventListener("dispose",a),n.remove(u.instanceMatrix),u.instanceColor!==null&&n.remove(u.instanceColor)}return{update:s,dispose:o}}class nv extends ln{constructor(e,n,i,r,s,o,a,l,u,f){if(f=f!==void 0?f:_r,f!==_r&&f!==Ps)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&f===_r&&(i=Ui),i===void 0&&f===Ps&&(i=gr),super(null,r,s,o,a,l,f,i,u),this.isDepthTexture=!0,this.image={width:e,height:n},this.magFilter=a!==void 0?a:Kt,this.minFilter=l!==void 0?l:Kt,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const n=super.toJSON(e);return this.compareFunction!==null&&(n.compareFunction=this.compareFunction),n}}const iv=new ln,rv=new nv(1,1);rv.compareFunction=H_;const sv=new X_,ov=new tS,av=new J_,zp=[],kp=[],Bp=new Float32Array(16),Hp=new Float32Array(9),Gp=new Float32Array(4);function Fs(t,e,n){const i=t[0];if(i<=0||i>0)return t;const r=e*n;let s=zp[r];if(s===void 0&&(s=new Float32Array(r),zp[r]=s),e!==0){i.toArray(s,0);for(let o=1,a=0;o!==e;++o)a+=n,t[o].toArray(s,a)}return s}function Tt(t,e){if(t.length!==e.length)return!1;for(let n=0,i=t.length;n<i;n++)if(t[n]!==e[n])return!1;return!0}function wt(t,e){for(let n=0,i=e.length;n<i;n++)t[n]=e[n]}function $l(t,e){let n=kp[e];n===void 0&&(n=new Int32Array(e),kp[e]=n);for(let i=0;i!==e;++i)n[i]=t.allocateTextureUnit();return n}function vT(t,e){const n=this.cache;n[0]!==e&&(t.uniform1f(this.addr,e),n[0]=e)}function xT(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2f(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(Tt(n,e))return;t.uniform2fv(this.addr,e),wt(n,e)}}function yT(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3f(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else if(e.r!==void 0)(n[0]!==e.r||n[1]!==e.g||n[2]!==e.b)&&(t.uniform3f(this.addr,e.r,e.g,e.b),n[0]=e.r,n[1]=e.g,n[2]=e.b);else{if(Tt(n,e))return;t.uniform3fv(this.addr,e),wt(n,e)}}function ST(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4f(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(Tt(n,e))return;t.uniform4fv(this.addr,e),wt(n,e)}}function MT(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(Tt(n,e))return;t.uniformMatrix2fv(this.addr,!1,e),wt(n,e)}else{if(Tt(n,i))return;Gp.set(i),t.uniformMatrix2fv(this.addr,!1,Gp),wt(n,i)}}function ET(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(Tt(n,e))return;t.uniformMatrix3fv(this.addr,!1,e),wt(n,e)}else{if(Tt(n,i))return;Hp.set(i),t.uniformMatrix3fv(this.addr,!1,Hp),wt(n,i)}}function TT(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(Tt(n,e))return;t.uniformMatrix4fv(this.addr,!1,e),wt(n,e)}else{if(Tt(n,i))return;Bp.set(i),t.uniformMatrix4fv(this.addr,!1,Bp),wt(n,i)}}function wT(t,e){const n=this.cache;n[0]!==e&&(t.uniform1i(this.addr,e),n[0]=e)}function AT(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2i(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(Tt(n,e))return;t.uniform2iv(this.addr,e),wt(n,e)}}function RT(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3i(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else{if(Tt(n,e))return;t.uniform3iv(this.addr,e),wt(n,e)}}function CT(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4i(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(Tt(n,e))return;t.uniform4iv(this.addr,e),wt(n,e)}}function bT(t,e){const n=this.cache;n[0]!==e&&(t.uniform1ui(this.addr,e),n[0]=e)}function PT(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2ui(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(Tt(n,e))return;t.uniform2uiv(this.addr,e),wt(n,e)}}function LT(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3ui(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else{if(Tt(n,e))return;t.uniform3uiv(this.addr,e),wt(n,e)}}function DT(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4ui(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(Tt(n,e))return;t.uniform4uiv(this.addr,e),wt(n,e)}}function UT(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r);const s=this.type===t.SAMPLER_2D_SHADOW?rv:iv;n.setTexture2D(e||s,r)}function NT(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTexture3D(e||ov,r)}function IT(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTextureCube(e||av,r)}function FT(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTexture2DArray(e||sv,r)}function OT(t){switch(t){case 5126:return vT;case 35664:return xT;case 35665:return yT;case 35666:return ST;case 35674:return MT;case 35675:return ET;case 35676:return TT;case 5124:case 35670:return wT;case 35667:case 35671:return AT;case 35668:case 35672:return RT;case 35669:case 35673:return CT;case 5125:return bT;case 36294:return PT;case 36295:return LT;case 36296:return DT;case 35678:case 36198:case 36298:case 36306:case 35682:return UT;case 35679:case 36299:case 36307:return NT;case 35680:case 36300:case 36308:case 36293:return IT;case 36289:case 36303:case 36311:case 36292:return FT}}function zT(t,e){t.uniform1fv(this.addr,e)}function kT(t,e){const n=Fs(e,this.size,2);t.uniform2fv(this.addr,n)}function BT(t,e){const n=Fs(e,this.size,3);t.uniform3fv(this.addr,n)}function HT(t,e){const n=Fs(e,this.size,4);t.uniform4fv(this.addr,n)}function GT(t,e){const n=Fs(e,this.size,4);t.uniformMatrix2fv(this.addr,!1,n)}function VT(t,e){const n=Fs(e,this.size,9);t.uniformMatrix3fv(this.addr,!1,n)}function WT(t,e){const n=Fs(e,this.size,16);t.uniformMatrix4fv(this.addr,!1,n)}function XT(t,e){t.uniform1iv(this.addr,e)}function jT(t,e){t.uniform2iv(this.addr,e)}function YT(t,e){t.uniform3iv(this.addr,e)}function qT(t,e){t.uniform4iv(this.addr,e)}function $T(t,e){t.uniform1uiv(this.addr,e)}function KT(t,e){t.uniform2uiv(this.addr,e)}function ZT(t,e){t.uniform3uiv(this.addr,e)}function QT(t,e){t.uniform4uiv(this.addr,e)}function JT(t,e,n){const i=this.cache,r=e.length,s=$l(n,r);Tt(i,s)||(t.uniform1iv(this.addr,s),wt(i,s));for(let o=0;o!==r;++o)n.setTexture2D(e[o]||iv,s[o])}function e1(t,e,n){const i=this.cache,r=e.length,s=$l(n,r);Tt(i,s)||(t.uniform1iv(this.addr,s),wt(i,s));for(let o=0;o!==r;++o)n.setTexture3D(e[o]||ov,s[o])}function t1(t,e,n){const i=this.cache,r=e.length,s=$l(n,r);Tt(i,s)||(t.uniform1iv(this.addr,s),wt(i,s));for(let o=0;o!==r;++o)n.setTextureCube(e[o]||av,s[o])}function n1(t,e,n){const i=this.cache,r=e.length,s=$l(n,r);Tt(i,s)||(t.uniform1iv(this.addr,s),wt(i,s));for(let o=0;o!==r;++o)n.setTexture2DArray(e[o]||sv,s[o])}function i1(t){switch(t){case 5126:return zT;case 35664:return kT;case 35665:return BT;case 35666:return HT;case 35674:return GT;case 35675:return VT;case 35676:return WT;case 5124:case 35670:return XT;case 35667:case 35671:return jT;case 35668:case 35672:return YT;case 35669:case 35673:return qT;case 5125:return $T;case 36294:return KT;case 36295:return ZT;case 36296:return QT;case 35678:case 36198:case 36298:case 36306:case 35682:return JT;case 35679:case 36299:case 36307:return e1;case 35680:case 36300:case 36308:case 36293:return t1;case 36289:case 36303:case 36311:case 36292:return n1}}class r1{constructor(e,n,i){this.id=e,this.addr=i,this.cache=[],this.type=n.type,this.setValue=OT(n.type)}}class s1{constructor(e,n,i){this.id=e,this.addr=i,this.cache=[],this.type=n.type,this.size=n.size,this.setValue=i1(n.type)}}class o1{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,n,i){const r=this.seq;for(let s=0,o=r.length;s!==o;++s){const a=r[s];a.setValue(e,n[a.id],i)}}}const ec=/(\w+)(\])?(\[|\.)?/g;function Vp(t,e){t.seq.push(e),t.map[e.id]=e}function a1(t,e,n){const i=t.name,r=i.length;for(ec.lastIndex=0;;){const s=ec.exec(i),o=ec.lastIndex;let a=s[1];const l=s[2]==="]",u=s[3];if(l&&(a=a|0),u===void 0||u==="["&&o+2===r){Vp(n,u===void 0?new r1(a,t,e):new s1(a,t,e));break}else{let h=n.map[a];h===void 0&&(h=new o1(a),Vp(n,h)),n=h}}}class Za{constructor(e,n){this.seq=[],this.map={};const i=e.getProgramParameter(n,e.ACTIVE_UNIFORMS);for(let r=0;r<i;++r){const s=e.getActiveUniform(n,r),o=e.getUniformLocation(n,s.name);a1(s,o,this)}}setValue(e,n,i,r){const s=this.map[n];s!==void 0&&s.setValue(e,i,r)}setOptional(e,n,i){const r=n[i];r!==void 0&&this.setValue(e,i,r)}static upload(e,n,i,r){for(let s=0,o=n.length;s!==o;++s){const a=n[s],l=i[a.id];l.needsUpdate!==!1&&a.setValue(e,l.value,r)}}static seqWithValue(e,n){const i=[];for(let r=0,s=e.length;r!==s;++r){const o=e[r];o.id in n&&i.push(o)}return i}}function Wp(t,e,n){const i=t.createShader(e);return t.shaderSource(i,n),t.compileShader(i),i}const l1=37297;let u1=0;function c1(t,e){const n=t.split(`
`),i=[],r=Math.max(e-6,0),s=Math.min(e+6,n.length);for(let o=r;o<s;o++){const a=o+1;i.push(`${a===e?">":" "} ${a}: ${n[o]}`)}return i.join(`
`)}function f1(t){const e=Qe.getPrimaries(Qe.workingColorSpace),n=Qe.getPrimaries(t);let i;switch(e===n?i="":e===wl&&n===Tl?i="LinearDisplayP3ToLinearSRGB":e===Tl&&n===wl&&(i="LinearSRGBToLinearDisplayP3"),t){case gi:case jl:return[i,"LinearTransferOETF"];case Nt:case cd:return[i,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",t),[i,"LinearTransferOETF"]}}function Xp(t,e,n){const i=t.getShaderParameter(e,t.COMPILE_STATUS),r=t.getShaderInfoLog(e).trim();if(i&&r==="")return"";const s=/ERROR: 0:(\d+)/.exec(r);if(s){const o=parseInt(s[1]);return n.toUpperCase()+`

`+r+`

`+c1(t.getShaderSource(e),o)}else return r}function d1(t,e){const n=f1(e);return`vec4 ${t}( vec4 value ) { return ${n[0]}( ${n[1]}( value ) ); }`}function h1(t,e){let n;switch(e){case Ty:n="Linear";break;case wy:n="Reinhard";break;case Ay:n="OptimizedCineon";break;case Ry:n="ACESFilmic";break;case Cy:n="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),n="Linear"}return"vec3 "+t+"( vec3 color ) { return "+n+"ToneMapping( color ); }"}function p1(t){return[t.extensionDerivatives||t.envMapCubeUVHeight||t.bumpMap||t.normalMapTangentSpace||t.clearcoatNormalMap||t.flatShading||t.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(t.extensionFragDepth||t.logarithmicDepthBuffer)&&t.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",t.extensionDrawBuffers&&t.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(t.extensionShaderTextureLOD||t.envMap||t.transmission)&&t.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(ao).join(`
`)}function m1(t){const e=[];for(const n in t){const i=t[n];i!==!1&&e.push("#define "+n+" "+i)}return e.join(`
`)}function g1(t,e){const n={},i=t.getProgramParameter(e,t.ACTIVE_ATTRIBUTES);for(let r=0;r<i;r++){const s=t.getActiveAttrib(e,r),o=s.name;let a=1;s.type===t.FLOAT_MAT2&&(a=2),s.type===t.FLOAT_MAT3&&(a=3),s.type===t.FLOAT_MAT4&&(a=4),n[o]={type:s.type,location:t.getAttribLocation(e,o),locationSize:a}}return n}function ao(t){return t!==""}function jp(t,e){const n=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return t.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Yp(t,e){return t.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const _1=/^[ \t]*#include +<([\w\d./]+)>/gm;function df(t){return t.replace(_1,x1)}const v1=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function x1(t,e){let n=He[e];if(n===void 0){const i=v1.get(e);if(i!==void 0)n=He[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return df(n)}const y1=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function qp(t){return t.replace(y1,S1)}function S1(t,e,n,i){let r="";for(let s=parseInt(e);s<parseInt(n);s++)r+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function $p(t){let e="precision "+t.precision+` float;
precision `+t.precision+" int;";return t.precision==="highp"?e+=`
#define HIGH_PRECISION`:t.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:t.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function M1(t){let e="SHADOWMAP_TYPE_BASIC";return t.shadowMapType===b_?e="SHADOWMAP_TYPE_PCF":t.shadowMapType===Qx?e="SHADOWMAP_TYPE_PCF_SOFT":t.shadowMapType===ii&&(e="SHADOWMAP_TYPE_VSM"),e}function E1(t){let e="ENVMAP_TYPE_CUBE";if(t.envMap)switch(t.envMapMode){case Cs:case bs:e="ENVMAP_TYPE_CUBE";break;case Xl:e="ENVMAP_TYPE_CUBE_UV";break}return e}function T1(t){let e="ENVMAP_MODE_REFLECTION";if(t.envMap)switch(t.envMapMode){case bs:e="ENVMAP_MODE_REFRACTION";break}return e}function w1(t){let e="ENVMAP_BLENDING_NONE";if(t.envMap)switch(t.combine){case P_:e="ENVMAP_BLENDING_MULTIPLY";break;case My:e="ENVMAP_BLENDING_MIX";break;case Ey:e="ENVMAP_BLENDING_ADD";break}return e}function A1(t){const e=t.envMapCubeUVHeight;if(e===null)return null;const n=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,n),7*16)),texelHeight:i,maxMip:n}}function R1(t,e,n,i){const r=t.getContext(),s=n.defines;let o=n.vertexShader,a=n.fragmentShader;const l=M1(n),u=E1(n),f=T1(n),h=w1(n),d=A1(n),m=n.isWebGL2?"":p1(n),x=m1(s),v=r.createProgram();let p,c,_=n.glslVersion?"#version "+n.glslVersion+`
`:"";n.isRawShaderMaterial?(p=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,x].filter(ao).join(`
`),p.length>0&&(p+=`
`),c=[m,"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,x].filter(ao).join(`
`),c.length>0&&(c+=`
`)):(p=[$p(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,x,n.batching?"#define USE_BATCHING":"",n.instancing?"#define USE_INSTANCING":"",n.instancingColor?"#define USE_INSTANCING_COLOR":"",n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.map?"#define USE_MAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+f:"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.displacementMap?"#define USE_DISPLACEMENTMAP":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.mapUv?"#define MAP_UV "+n.mapUv:"",n.alphaMapUv?"#define ALPHAMAP_UV "+n.alphaMapUv:"",n.lightMapUv?"#define LIGHTMAP_UV "+n.lightMapUv:"",n.aoMapUv?"#define AOMAP_UV "+n.aoMapUv:"",n.emissiveMapUv?"#define EMISSIVEMAP_UV "+n.emissiveMapUv:"",n.bumpMapUv?"#define BUMPMAP_UV "+n.bumpMapUv:"",n.normalMapUv?"#define NORMALMAP_UV "+n.normalMapUv:"",n.displacementMapUv?"#define DISPLACEMENTMAP_UV "+n.displacementMapUv:"",n.metalnessMapUv?"#define METALNESSMAP_UV "+n.metalnessMapUv:"",n.roughnessMapUv?"#define ROUGHNESSMAP_UV "+n.roughnessMapUv:"",n.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+n.anisotropyMapUv:"",n.clearcoatMapUv?"#define CLEARCOATMAP_UV "+n.clearcoatMapUv:"",n.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+n.clearcoatNormalMapUv:"",n.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+n.clearcoatRoughnessMapUv:"",n.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+n.iridescenceMapUv:"",n.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+n.iridescenceThicknessMapUv:"",n.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+n.sheenColorMapUv:"",n.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+n.sheenRoughnessMapUv:"",n.specularMapUv?"#define SPECULARMAP_UV "+n.specularMapUv:"",n.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+n.specularColorMapUv:"",n.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+n.specularIntensityMapUv:"",n.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+n.transmissionMapUv:"",n.thicknessMapUv?"#define THICKNESSMAP_UV "+n.thicknessMapUv:"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.flatShading?"#define FLAT_SHADED":"",n.skinning?"#define USE_SKINNING":"",n.morphTargets?"#define USE_MORPHTARGETS":"",n.morphNormals&&n.flatShading===!1?"#define USE_MORPHNORMALS":"",n.morphColors&&n.isWebGL2?"#define USE_MORPHCOLORS":"",n.morphTargetsCount>0&&n.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",n.morphTargetsCount>0&&n.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+n.morphTextureStride:"",n.morphTargetsCount>0&&n.isWebGL2?"#define MORPHTARGETS_COUNT "+n.morphTargetsCount:"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+l:"",n.sizeAttenuation?"#define USE_SIZEATTENUATION":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.useLegacyLights?"#define LEGACY_LIGHTS":"",n.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",n.logarithmicDepthBuffer&&n.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(ao).join(`
`),c=[m,$p(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,x,n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.map?"#define USE_MAP":"",n.matcap?"#define USE_MATCAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+u:"",n.envMap?"#define "+f:"",n.envMap?"#define "+h:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoat?"#define USE_CLEARCOAT":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.iridescence?"#define USE_IRIDESCENCE":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaTest?"#define USE_ALPHATEST":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.sheen?"#define USE_SHEEN":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors||n.instancingColor?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.gradientMap?"#define USE_GRADIENTMAP":"",n.flatShading?"#define FLAT_SHADED":"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+l:"",n.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.useLegacyLights?"#define LEGACY_LIGHTS":"",n.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",n.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",n.logarithmicDepthBuffer&&n.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",n.toneMapping!==Wi?"#define TONE_MAPPING":"",n.toneMapping!==Wi?He.tonemapping_pars_fragment:"",n.toneMapping!==Wi?h1("toneMapping",n.toneMapping):"",n.dithering?"#define DITHERING":"",n.opaque?"#define OPAQUE":"",He.colorspace_pars_fragment,d1("linearToOutputTexel",n.outputColorSpace),n.useDepthPacking?"#define DEPTH_PACKING "+n.depthPacking:"",`
`].filter(ao).join(`
`)),o=df(o),o=jp(o,n),o=Yp(o,n),a=df(a),a=jp(a,n),a=Yp(a,n),o=qp(o),a=qp(a),n.isWebGL2&&n.isRawShaderMaterial!==!0&&(_=`#version 300 es
`,p=["precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,c=["precision mediump sampler2DArray;","#define varying in",n.glslVersion===hp?"":"layout(location = 0) out highp vec4 pc_fragColor;",n.glslVersion===hp?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+c);const g=_+p+o,y=_+c+a,M=Wp(r,r.VERTEX_SHADER,g),A=Wp(r,r.FRAGMENT_SHADER,y);r.attachShader(v,M),r.attachShader(v,A),n.index0AttributeName!==void 0?r.bindAttribLocation(v,0,n.index0AttributeName):n.morphTargets===!0&&r.bindAttribLocation(v,0,"position"),r.linkProgram(v);function w(H){if(t.debug.checkShaderErrors){const I=r.getProgramInfoLog(v).trim(),G=r.getShaderInfoLog(M).trim(),L=r.getShaderInfoLog(A).trim();let D=!0,z=!0;if(r.getProgramParameter(v,r.LINK_STATUS)===!1)if(D=!1,typeof t.debug.onShaderError=="function")t.debug.onShaderError(r,v,M,A);else{const W=Xp(r,M,"vertex"),F=Xp(r,A,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(v,r.VALIDATE_STATUS)+`

Program Info Log: `+I+`
`+W+`
`+F)}else I!==""?console.warn("THREE.WebGLProgram: Program Info Log:",I):(G===""||L==="")&&(z=!1);z&&(H.diagnostics={runnable:D,programLog:I,vertexShader:{log:G,prefix:p},fragmentShader:{log:L,prefix:c}})}r.deleteShader(M),r.deleteShader(A),b=new Za(r,v),S=g1(r,v)}let b;this.getUniforms=function(){return b===void 0&&w(this),b};let S;this.getAttributes=function(){return S===void 0&&w(this),S};let R=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return R===!1&&(R=r.getProgramParameter(v,l1)),R},this.destroy=function(){i.releaseStatesOfProgram(this),r.deleteProgram(v),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=u1++,this.cacheKey=e,this.usedTimes=1,this.program=v,this.vertexShader=M,this.fragmentShader=A,this}let C1=0;class b1{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const n=e.vertexShader,i=e.fragmentShader,r=this._getShaderStage(n),s=this._getShaderStage(i),o=this._getShaderCacheForMaterial(e);return o.has(r)===!1&&(o.add(r),r.usedTimes++),o.has(s)===!1&&(o.add(s),s.usedTimes++),this}remove(e){const n=this.materialCache.get(e);for(const i of n)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const n=this.materialCache;let i=n.get(e);return i===void 0&&(i=new Set,n.set(e,i)),i}_getShaderStage(e){const n=this.shaderCache;let i=n.get(e);return i===void 0&&(i=new P1(e),n.set(e,i)),i}}class P1{constructor(e){this.id=C1++,this.code=e,this.usedTimes=0}}function L1(t,e,n,i,r,s,o){const a=new j_,l=new b1,u=[],f=r.isWebGL2,h=r.logarithmicDepthBuffer,d=r.vertexTextures;let m=r.precision;const x={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(S){return S===0?"uv":`uv${S}`}function p(S,R,H,I,G){const L=I.fog,D=G.geometry,z=S.isMeshStandardMaterial?I.environment:null,W=(S.isMeshStandardMaterial?n:e).get(S.envMap||z),F=W&&W.mapping===Xl?W.image.height:null,B=x[S.type];S.precision!==null&&(m=r.getMaxPrecision(S.precision),m!==S.precision&&console.warn("THREE.WebGLProgram.getParameters:",S.precision,"not supported, using",m,"instead."));const k=D.morphAttributes.position||D.morphAttributes.normal||D.morphAttributes.color,Q=k!==void 0?k.length:0;let ee=0;D.morphAttributes.position!==void 0&&(ee=1),D.morphAttributes.normal!==void 0&&(ee=2),D.morphAttributes.color!==void 0&&(ee=3);let $,Z,de,ve;if(B){const Xt=jn[B];$=Xt.vertexShader,Z=Xt.fragmentShader}else $=S.vertexShader,Z=S.fragmentShader,l.update(S),de=l.getVertexShaderID(S),ve=l.getFragmentShaderID(S);const ye=t.getRenderTarget(),Ie=G.isInstancedMesh===!0,De=G.isBatchedMesh===!0,Pe=!!S.map,Oe=!!S.matcap,V=!!W,At=!!S.aoMap,Te=!!S.lightMap,Be=!!S.bumpMap,Le=!!S.normalMap,nt=!!S.displacementMap,ze=!!S.emissiveMap,Ue=!!S.metalnessMap,$e=!!S.roughnessMap,vt=S.anisotropy>0,xt=S.clearcoat>0,C=S.iridescence>0,E=S.sheen>0,X=S.transmission>0,re=vt&&!!S.anisotropyMap,ne=xt&&!!S.clearcoatMap,se=xt&&!!S.clearcoatNormalMap,Se=xt&&!!S.clearcoatRoughnessMap,le=C&&!!S.iridescenceMap,he=C&&!!S.iridescenceThicknessMap,P=E&&!!S.sheenColorMap,ae=E&&!!S.sheenRoughnessMap,J=!!S.specularMap,Ce=!!S.specularColorMap,Me=!!S.specularIntensityMap,Ae=X&&!!S.transmissionMap,xe=X&&!!S.thicknessMap,_e=!!S.gradientMap,We=!!S.alphaMap,U=S.alphaTest>0,ce=!!S.alphaHash,te=!!S.extensions,K=!!D.attributes.uv1,oe=!!D.attributes.uv2,we=!!D.attributes.uv3;let Xe=Wi;return S.toneMapped&&(ye===null||ye.isXRRenderTarget===!0)&&(Xe=t.toneMapping),{isWebGL2:f,shaderID:B,shaderType:S.type,shaderName:S.name,vertexShader:$,fragmentShader:Z,defines:S.defines,customVertexShaderID:de,customFragmentShaderID:ve,isRawShaderMaterial:S.isRawShaderMaterial===!0,glslVersion:S.glslVersion,precision:m,batching:De,instancing:Ie,instancingColor:Ie&&G.instanceColor!==null,supportsVertexTextures:d,outputColorSpace:ye===null?t.outputColorSpace:ye.isXRRenderTarget===!0?ye.texture.colorSpace:gi,map:Pe,matcap:Oe,envMap:V,envMapMode:V&&W.mapping,envMapCubeUVHeight:F,aoMap:At,lightMap:Te,bumpMap:Be,normalMap:Le,displacementMap:d&&nt,emissiveMap:ze,normalMapObjectSpace:Le&&S.normalMapType===By,normalMapTangentSpace:Le&&S.normalMapType===B_,metalnessMap:Ue,roughnessMap:$e,anisotropy:vt,anisotropyMap:re,clearcoat:xt,clearcoatMap:ne,clearcoatNormalMap:se,clearcoatRoughnessMap:Se,iridescence:C,iridescenceMap:le,iridescenceThicknessMap:he,sheen:E,sheenColorMap:P,sheenRoughnessMap:ae,specularMap:J,specularColorMap:Ce,specularIntensityMap:Me,transmission:X,transmissionMap:Ae,thicknessMap:xe,gradientMap:_e,opaque:S.transparent===!1&&S.blending===xs,alphaMap:We,alphaTest:U,alphaHash:ce,combine:S.combine,mapUv:Pe&&v(S.map.channel),aoMapUv:At&&v(S.aoMap.channel),lightMapUv:Te&&v(S.lightMap.channel),bumpMapUv:Be&&v(S.bumpMap.channel),normalMapUv:Le&&v(S.normalMap.channel),displacementMapUv:nt&&v(S.displacementMap.channel),emissiveMapUv:ze&&v(S.emissiveMap.channel),metalnessMapUv:Ue&&v(S.metalnessMap.channel),roughnessMapUv:$e&&v(S.roughnessMap.channel),anisotropyMapUv:re&&v(S.anisotropyMap.channel),clearcoatMapUv:ne&&v(S.clearcoatMap.channel),clearcoatNormalMapUv:se&&v(S.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Se&&v(S.clearcoatRoughnessMap.channel),iridescenceMapUv:le&&v(S.iridescenceMap.channel),iridescenceThicknessMapUv:he&&v(S.iridescenceThicknessMap.channel),sheenColorMapUv:P&&v(S.sheenColorMap.channel),sheenRoughnessMapUv:ae&&v(S.sheenRoughnessMap.channel),specularMapUv:J&&v(S.specularMap.channel),specularColorMapUv:Ce&&v(S.specularColorMap.channel),specularIntensityMapUv:Me&&v(S.specularIntensityMap.channel),transmissionMapUv:Ae&&v(S.transmissionMap.channel),thicknessMapUv:xe&&v(S.thicknessMap.channel),alphaMapUv:We&&v(S.alphaMap.channel),vertexTangents:!!D.attributes.tangent&&(Le||vt),vertexColors:S.vertexColors,vertexAlphas:S.vertexColors===!0&&!!D.attributes.color&&D.attributes.color.itemSize===4,vertexUv1s:K,vertexUv2s:oe,vertexUv3s:we,pointsUvs:G.isPoints===!0&&!!D.attributes.uv&&(Pe||We),fog:!!L,useFog:S.fog===!0,fogExp2:L&&L.isFogExp2,flatShading:S.flatShading===!0,sizeAttenuation:S.sizeAttenuation===!0,logarithmicDepthBuffer:h,skinning:G.isSkinnedMesh===!0,morphTargets:D.morphAttributes.position!==void 0,morphNormals:D.morphAttributes.normal!==void 0,morphColors:D.morphAttributes.color!==void 0,morphTargetsCount:Q,morphTextureStride:ee,numDirLights:R.directional.length,numPointLights:R.point.length,numSpotLights:R.spot.length,numSpotLightMaps:R.spotLightMap.length,numRectAreaLights:R.rectArea.length,numHemiLights:R.hemi.length,numDirLightShadows:R.directionalShadowMap.length,numPointLightShadows:R.pointShadowMap.length,numSpotLightShadows:R.spotShadowMap.length,numSpotLightShadowsWithMaps:R.numSpotLightShadowsWithMaps,numLightProbes:R.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:S.dithering,shadowMapEnabled:t.shadowMap.enabled&&H.length>0,shadowMapType:t.shadowMap.type,toneMapping:Xe,useLegacyLights:t._useLegacyLights,decodeVideoTexture:Pe&&S.map.isVideoTexture===!0&&Qe.getTransfer(S.map.colorSpace)===rt,premultipliedAlpha:S.premultipliedAlpha,doubleSided:S.side===oi,flipSided:S.side===an,useDepthPacking:S.depthPacking>=0,depthPacking:S.depthPacking||0,index0AttributeName:S.index0AttributeName,extensionDerivatives:te&&S.extensions.derivatives===!0,extensionFragDepth:te&&S.extensions.fragDepth===!0,extensionDrawBuffers:te&&S.extensions.drawBuffers===!0,extensionShaderTextureLOD:te&&S.extensions.shaderTextureLOD===!0,rendererExtensionFragDepth:f||i.has("EXT_frag_depth"),rendererExtensionDrawBuffers:f||i.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:f||i.has("EXT_shader_texture_lod"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:S.customProgramCacheKey()}}function c(S){const R=[];if(S.shaderID?R.push(S.shaderID):(R.push(S.customVertexShaderID),R.push(S.customFragmentShaderID)),S.defines!==void 0)for(const H in S.defines)R.push(H),R.push(S.defines[H]);return S.isRawShaderMaterial===!1&&(_(R,S),g(R,S),R.push(t.outputColorSpace)),R.push(S.customProgramCacheKey),R.join()}function _(S,R){S.push(R.precision),S.push(R.outputColorSpace),S.push(R.envMapMode),S.push(R.envMapCubeUVHeight),S.push(R.mapUv),S.push(R.alphaMapUv),S.push(R.lightMapUv),S.push(R.aoMapUv),S.push(R.bumpMapUv),S.push(R.normalMapUv),S.push(R.displacementMapUv),S.push(R.emissiveMapUv),S.push(R.metalnessMapUv),S.push(R.roughnessMapUv),S.push(R.anisotropyMapUv),S.push(R.clearcoatMapUv),S.push(R.clearcoatNormalMapUv),S.push(R.clearcoatRoughnessMapUv),S.push(R.iridescenceMapUv),S.push(R.iridescenceThicknessMapUv),S.push(R.sheenColorMapUv),S.push(R.sheenRoughnessMapUv),S.push(R.specularMapUv),S.push(R.specularColorMapUv),S.push(R.specularIntensityMapUv),S.push(R.transmissionMapUv),S.push(R.thicknessMapUv),S.push(R.combine),S.push(R.fogExp2),S.push(R.sizeAttenuation),S.push(R.morphTargetsCount),S.push(R.morphAttributeCount),S.push(R.numDirLights),S.push(R.numPointLights),S.push(R.numSpotLights),S.push(R.numSpotLightMaps),S.push(R.numHemiLights),S.push(R.numRectAreaLights),S.push(R.numDirLightShadows),S.push(R.numPointLightShadows),S.push(R.numSpotLightShadows),S.push(R.numSpotLightShadowsWithMaps),S.push(R.numLightProbes),S.push(R.shadowMapType),S.push(R.toneMapping),S.push(R.numClippingPlanes),S.push(R.numClipIntersection),S.push(R.depthPacking)}function g(S,R){a.disableAll(),R.isWebGL2&&a.enable(0),R.supportsVertexTextures&&a.enable(1),R.instancing&&a.enable(2),R.instancingColor&&a.enable(3),R.matcap&&a.enable(4),R.envMap&&a.enable(5),R.normalMapObjectSpace&&a.enable(6),R.normalMapTangentSpace&&a.enable(7),R.clearcoat&&a.enable(8),R.iridescence&&a.enable(9),R.alphaTest&&a.enable(10),R.vertexColors&&a.enable(11),R.vertexAlphas&&a.enable(12),R.vertexUv1s&&a.enable(13),R.vertexUv2s&&a.enable(14),R.vertexUv3s&&a.enable(15),R.vertexTangents&&a.enable(16),R.anisotropy&&a.enable(17),R.alphaHash&&a.enable(18),R.batching&&a.enable(19),S.push(a.mask),a.disableAll(),R.fog&&a.enable(0),R.useFog&&a.enable(1),R.flatShading&&a.enable(2),R.logarithmicDepthBuffer&&a.enable(3),R.skinning&&a.enable(4),R.morphTargets&&a.enable(5),R.morphNormals&&a.enable(6),R.morphColors&&a.enable(7),R.premultipliedAlpha&&a.enable(8),R.shadowMapEnabled&&a.enable(9),R.useLegacyLights&&a.enable(10),R.doubleSided&&a.enable(11),R.flipSided&&a.enable(12),R.useDepthPacking&&a.enable(13),R.dithering&&a.enable(14),R.transmission&&a.enable(15),R.sheen&&a.enable(16),R.opaque&&a.enable(17),R.pointsUvs&&a.enable(18),R.decodeVideoTexture&&a.enable(19),S.push(a.mask)}function y(S){const R=x[S.type];let H;if(R){const I=jn[R];H=pS.clone(I.uniforms)}else H=S.uniforms;return H}function M(S,R){let H;for(let I=0,G=u.length;I<G;I++){const L=u[I];if(L.cacheKey===R){H=L,++H.usedTimes;break}}return H===void 0&&(H=new R1(t,R,S,s),u.push(H)),H}function A(S){if(--S.usedTimes===0){const R=u.indexOf(S);u[R]=u[u.length-1],u.pop(),S.destroy()}}function w(S){l.remove(S)}function b(){l.dispose()}return{getParameters:p,getProgramCacheKey:c,getUniforms:y,acquireProgram:M,releaseProgram:A,releaseShaderCache:w,programs:u,dispose:b}}function D1(){let t=new WeakMap;function e(s){let o=t.get(s);return o===void 0&&(o={},t.set(s,o)),o}function n(s){t.delete(s)}function i(s,o,a){t.get(s)[o]=a}function r(){t=new WeakMap}return{get:e,remove:n,update:i,dispose:r}}function U1(t,e){return t.groupOrder!==e.groupOrder?t.groupOrder-e.groupOrder:t.renderOrder!==e.renderOrder?t.renderOrder-e.renderOrder:t.material.id!==e.material.id?t.material.id-e.material.id:t.z!==e.z?t.z-e.z:t.id-e.id}function Kp(t,e){return t.groupOrder!==e.groupOrder?t.groupOrder-e.groupOrder:t.renderOrder!==e.renderOrder?t.renderOrder-e.renderOrder:t.z!==e.z?e.z-t.z:t.id-e.id}function Zp(){const t=[];let e=0;const n=[],i=[],r=[];function s(){e=0,n.length=0,i.length=0,r.length=0}function o(h,d,m,x,v,p){let c=t[e];return c===void 0?(c={id:h.id,object:h,geometry:d,material:m,groupOrder:x,renderOrder:h.renderOrder,z:v,group:p},t[e]=c):(c.id=h.id,c.object=h,c.geometry=d,c.material=m,c.groupOrder=x,c.renderOrder=h.renderOrder,c.z=v,c.group=p),e++,c}function a(h,d,m,x,v,p){const c=o(h,d,m,x,v,p);m.transmission>0?i.push(c):m.transparent===!0?r.push(c):n.push(c)}function l(h,d,m,x,v,p){const c=o(h,d,m,x,v,p);m.transmission>0?i.unshift(c):m.transparent===!0?r.unshift(c):n.unshift(c)}function u(h,d){n.length>1&&n.sort(h||U1),i.length>1&&i.sort(d||Kp),r.length>1&&r.sort(d||Kp)}function f(){for(let h=e,d=t.length;h<d;h++){const m=t[h];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:n,transmissive:i,transparent:r,init:s,push:a,unshift:l,finish:f,sort:u}}function N1(){let t=new WeakMap;function e(i,r){const s=t.get(i);let o;return s===void 0?(o=new Zp,t.set(i,[o])):r>=s.length?(o=new Zp,s.push(o)):o=s[r],o}function n(){t=new WeakMap}return{get:e,dispose:n}}function I1(){const t={};return{get:function(e){if(t[e.id]!==void 0)return t[e.id];let n;switch(e.type){case"DirectionalLight":n={direction:new N,color:new Ve};break;case"SpotLight":n={position:new N,direction:new N,color:new Ve,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":n={position:new N,color:new Ve,distance:0,decay:0};break;case"HemisphereLight":n={direction:new N,skyColor:new Ve,groundColor:new Ve};break;case"RectAreaLight":n={color:new Ve,position:new N,halfWidth:new N,halfHeight:new N};break}return t[e.id]=n,n}}}function F1(){const t={};return{get:function(e){if(t[e.id]!==void 0)return t[e.id];let n;switch(e.type){case"DirectionalLight":n={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Re};break;case"SpotLight":n={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Re};break;case"PointLight":n={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Re,shadowCameraNear:1,shadowCameraFar:1e3};break}return t[e.id]=n,n}}}let O1=0;function z1(t,e){return(e.castShadow?2:0)-(t.castShadow?2:0)+(e.map?1:0)-(t.map?1:0)}function k1(t,e){const n=new I1,i=F1(),r={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let f=0;f<9;f++)r.probe.push(new N);const s=new N,o=new mt,a=new mt;function l(f,h){let d=0,m=0,x=0;for(let I=0;I<9;I++)r.probe[I].set(0,0,0);let v=0,p=0,c=0,_=0,g=0,y=0,M=0,A=0,w=0,b=0,S=0;f.sort(z1);const R=h===!0?Math.PI:1;for(let I=0,G=f.length;I<G;I++){const L=f[I],D=L.color,z=L.intensity,W=L.distance,F=L.shadow&&L.shadow.map?L.shadow.map.texture:null;if(L.isAmbientLight)d+=D.r*z*R,m+=D.g*z*R,x+=D.b*z*R;else if(L.isLightProbe){for(let B=0;B<9;B++)r.probe[B].addScaledVector(L.sh.coefficients[B],z);S++}else if(L.isDirectionalLight){const B=n.get(L);if(B.color.copy(L.color).multiplyScalar(L.intensity*R),L.castShadow){const k=L.shadow,Q=i.get(L);Q.shadowBias=k.bias,Q.shadowNormalBias=k.normalBias,Q.shadowRadius=k.radius,Q.shadowMapSize=k.mapSize,r.directionalShadow[v]=Q,r.directionalShadowMap[v]=F,r.directionalShadowMatrix[v]=L.shadow.matrix,y++}r.directional[v]=B,v++}else if(L.isSpotLight){const B=n.get(L);B.position.setFromMatrixPosition(L.matrixWorld),B.color.copy(D).multiplyScalar(z*R),B.distance=W,B.coneCos=Math.cos(L.angle),B.penumbraCos=Math.cos(L.angle*(1-L.penumbra)),B.decay=L.decay,r.spot[c]=B;const k=L.shadow;if(L.map&&(r.spotLightMap[w]=L.map,w++,k.updateMatrices(L),L.castShadow&&b++),r.spotLightMatrix[c]=k.matrix,L.castShadow){const Q=i.get(L);Q.shadowBias=k.bias,Q.shadowNormalBias=k.normalBias,Q.shadowRadius=k.radius,Q.shadowMapSize=k.mapSize,r.spotShadow[c]=Q,r.spotShadowMap[c]=F,A++}c++}else if(L.isRectAreaLight){const B=n.get(L);B.color.copy(D).multiplyScalar(z),B.halfWidth.set(L.width*.5,0,0),B.halfHeight.set(0,L.height*.5,0),r.rectArea[_]=B,_++}else if(L.isPointLight){const B=n.get(L);if(B.color.copy(L.color).multiplyScalar(L.intensity*R),B.distance=L.distance,B.decay=L.decay,L.castShadow){const k=L.shadow,Q=i.get(L);Q.shadowBias=k.bias,Q.shadowNormalBias=k.normalBias,Q.shadowRadius=k.radius,Q.shadowMapSize=k.mapSize,Q.shadowCameraNear=k.camera.near,Q.shadowCameraFar=k.camera.far,r.pointShadow[p]=Q,r.pointShadowMap[p]=F,r.pointShadowMatrix[p]=L.shadow.matrix,M++}r.point[p]=B,p++}else if(L.isHemisphereLight){const B=n.get(L);B.skyColor.copy(L.color).multiplyScalar(z*R),B.groundColor.copy(L.groundColor).multiplyScalar(z*R),r.hemi[g]=B,g++}}_>0&&(e.isWebGL2||t.has("OES_texture_float_linear")===!0?(r.rectAreaLTC1=fe.LTC_FLOAT_1,r.rectAreaLTC2=fe.LTC_FLOAT_2):t.has("OES_texture_half_float_linear")===!0?(r.rectAreaLTC1=fe.LTC_HALF_1,r.rectAreaLTC2=fe.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),r.ambient[0]=d,r.ambient[1]=m,r.ambient[2]=x;const H=r.hash;(H.directionalLength!==v||H.pointLength!==p||H.spotLength!==c||H.rectAreaLength!==_||H.hemiLength!==g||H.numDirectionalShadows!==y||H.numPointShadows!==M||H.numSpotShadows!==A||H.numSpotMaps!==w||H.numLightProbes!==S)&&(r.directional.length=v,r.spot.length=c,r.rectArea.length=_,r.point.length=p,r.hemi.length=g,r.directionalShadow.length=y,r.directionalShadowMap.length=y,r.pointShadow.length=M,r.pointShadowMap.length=M,r.spotShadow.length=A,r.spotShadowMap.length=A,r.directionalShadowMatrix.length=y,r.pointShadowMatrix.length=M,r.spotLightMatrix.length=A+w-b,r.spotLightMap.length=w,r.numSpotLightShadowsWithMaps=b,r.numLightProbes=S,H.directionalLength=v,H.pointLength=p,H.spotLength=c,H.rectAreaLength=_,H.hemiLength=g,H.numDirectionalShadows=y,H.numPointShadows=M,H.numSpotShadows=A,H.numSpotMaps=w,H.numLightProbes=S,r.version=O1++)}function u(f,h){let d=0,m=0,x=0,v=0,p=0;const c=h.matrixWorldInverse;for(let _=0,g=f.length;_<g;_++){const y=f[_];if(y.isDirectionalLight){const M=r.directional[d];M.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),M.direction.sub(s),M.direction.transformDirection(c),d++}else if(y.isSpotLight){const M=r.spot[x];M.position.setFromMatrixPosition(y.matrixWorld),M.position.applyMatrix4(c),M.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),M.direction.sub(s),M.direction.transformDirection(c),x++}else if(y.isRectAreaLight){const M=r.rectArea[v];M.position.setFromMatrixPosition(y.matrixWorld),M.position.applyMatrix4(c),a.identity(),o.copy(y.matrixWorld),o.premultiply(c),a.extractRotation(o),M.halfWidth.set(y.width*.5,0,0),M.halfHeight.set(0,y.height*.5,0),M.halfWidth.applyMatrix4(a),M.halfHeight.applyMatrix4(a),v++}else if(y.isPointLight){const M=r.point[m];M.position.setFromMatrixPosition(y.matrixWorld),M.position.applyMatrix4(c),m++}else if(y.isHemisphereLight){const M=r.hemi[p];M.direction.setFromMatrixPosition(y.matrixWorld),M.direction.transformDirection(c),p++}}}return{setup:l,setupView:u,state:r}}function Qp(t,e){const n=new k1(t,e),i=[],r=[];function s(){i.length=0,r.length=0}function o(h){i.push(h)}function a(h){r.push(h)}function l(h){n.setup(i,h)}function u(h){n.setupView(i,h)}return{init:s,state:{lightsArray:i,shadowsArray:r,lights:n},setupLights:l,setupLightsView:u,pushLight:o,pushShadow:a}}function B1(t,e){let n=new WeakMap;function i(s,o=0){const a=n.get(s);let l;return a===void 0?(l=new Qp(t,e),n.set(s,[l])):o>=a.length?(l=new Qp(t,e),a.push(l)):l=a[o],l}function r(){n=new WeakMap}return{get:i,dispose:r}}class H1 extends br{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=zy,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class G1 extends br{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const V1=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,W1=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function X1(t,e,n){let i=new dd;const r=new Re,s=new Re,o=new Lt,a=new H1({depthPacking:ky}),l=new G1,u={},f=n.maxTextureSize,h={[Ki]:an,[an]:Ki,[oi]:oi},d=new wr({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Re},radius:{value:4}},vertexShader:V1,fragmentShader:W1}),m=d.clone();m.defines.HORIZONTAL_PASS=1;const x=new It;x.setAttribute("position",new Hn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new qn(x,d),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=b_;let c=this.type;this.render=function(M,A,w){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||M.length===0)return;const b=t.getRenderTarget(),S=t.getActiveCubeFace(),R=t.getActiveMipmapLevel(),H=t.state;H.setBlending(Vi),H.buffers.color.setClear(1,1,1,1),H.buffers.depth.setTest(!0),H.setScissorTest(!1);const I=c!==ii&&this.type===ii,G=c===ii&&this.type!==ii;for(let L=0,D=M.length;L<D;L++){const z=M[L],W=z.shadow;if(W===void 0){console.warn("THREE.WebGLShadowMap:",z,"has no shadow.");continue}if(W.autoUpdate===!1&&W.needsUpdate===!1)continue;r.copy(W.mapSize);const F=W.getFrameExtents();if(r.multiply(F),s.copy(W.mapSize),(r.x>f||r.y>f)&&(r.x>f&&(s.x=Math.floor(f/F.x),r.x=s.x*F.x,W.mapSize.x=s.x),r.y>f&&(s.y=Math.floor(f/F.y),r.y=s.y*F.y,W.mapSize.y=s.y)),W.map===null||I===!0||G===!0){const k=this.type!==ii?{minFilter:Kt,magFilter:Kt}:{};W.map!==null&&W.map.dispose(),W.map=new Er(r.x,r.y,k),W.map.texture.name=z.name+".shadowMap",W.camera.updateProjectionMatrix()}t.setRenderTarget(W.map),t.clear();const B=W.getViewportCount();for(let k=0;k<B;k++){const Q=W.getViewport(k);o.set(s.x*Q.x,s.y*Q.y,s.x*Q.z,s.y*Q.w),H.viewport(o),W.updateMatrices(z,k),i=W.getFrustum(),y(A,w,W.camera,z,this.type)}W.isPointLightShadow!==!0&&this.type===ii&&_(W,w),W.needsUpdate=!1}c=this.type,p.needsUpdate=!1,t.setRenderTarget(b,S,R)};function _(M,A){const w=e.update(v);d.defines.VSM_SAMPLES!==M.blurSamples&&(d.defines.VSM_SAMPLES=M.blurSamples,m.defines.VSM_SAMPLES=M.blurSamples,d.needsUpdate=!0,m.needsUpdate=!0),M.mapPass===null&&(M.mapPass=new Er(r.x,r.y)),d.uniforms.shadow_pass.value=M.map.texture,d.uniforms.resolution.value=M.mapSize,d.uniforms.radius.value=M.radius,t.setRenderTarget(M.mapPass),t.clear(),t.renderBufferDirect(A,null,w,d,v,null),m.uniforms.shadow_pass.value=M.mapPass.texture,m.uniforms.resolution.value=M.mapSize,m.uniforms.radius.value=M.radius,t.setRenderTarget(M.map),t.clear(),t.renderBufferDirect(A,null,w,m,v,null)}function g(M,A,w,b){let S=null;const R=w.isPointLight===!0?M.customDistanceMaterial:M.customDepthMaterial;if(R!==void 0)S=R;else if(S=w.isPointLight===!0?l:a,t.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0){const H=S.uuid,I=A.uuid;let G=u[H];G===void 0&&(G={},u[H]=G);let L=G[I];L===void 0&&(L=S.clone(),G[I]=L),S=L}if(S.visible=A.visible,S.wireframe=A.wireframe,b===ii?S.side=A.shadowSide!==null?A.shadowSide:A.side:S.side=A.shadowSide!==null?A.shadowSide:h[A.side],S.alphaMap=A.alphaMap,S.alphaTest=A.alphaTest,S.map=A.map,S.clipShadows=A.clipShadows,S.clippingPlanes=A.clippingPlanes,S.clipIntersection=A.clipIntersection,S.displacementMap=A.displacementMap,S.displacementScale=A.displacementScale,S.displacementBias=A.displacementBias,S.wireframeLinewidth=A.wireframeLinewidth,S.linewidth=A.linewidth,w.isPointLight===!0&&S.isMeshDistanceMaterial===!0){const H=t.properties.get(S);H.light=w}return S}function y(M,A,w,b,S){if(M.visible===!1)return;if(M.layers.test(A.layers)&&(M.isMesh||M.isLine||M.isPoints)&&(M.castShadow||M.receiveShadow&&S===ii)&&(!M.frustumCulled||i.intersectsObject(M))){M.modelViewMatrix.multiplyMatrices(w.matrixWorldInverse,M.matrixWorld);const I=e.update(M),G=M.material;if(Array.isArray(G)){const L=I.groups;for(let D=0,z=L.length;D<z;D++){const W=L[D],F=G[W.materialIndex];if(F&&F.visible){const B=g(M,F,b,S);M.onBeforeShadow(t,M,A,w,I,B,W),t.renderBufferDirect(w,null,I,B,M,W),M.onAfterShadow(t,M,A,w,I,B,W)}}}else if(G.visible){const L=g(M,G,b,S);M.onBeforeShadow(t,M,A,w,I,L,null),t.renderBufferDirect(w,null,I,L,M,null),M.onAfterShadow(t,M,A,w,I,L,null)}}const H=M.children;for(let I=0,G=H.length;I<G;I++)y(H[I],A,w,b,S)}}function j1(t,e,n){const i=n.isWebGL2;function r(){let U=!1;const ce=new Lt;let te=null;const K=new Lt(0,0,0,0);return{setMask:function(oe){te!==oe&&!U&&(t.colorMask(oe,oe,oe,oe),te=oe)},setLocked:function(oe){U=oe},setClear:function(oe,we,Xe,Rt,Xt){Xt===!0&&(oe*=Rt,we*=Rt,Xe*=Rt),ce.set(oe,we,Xe,Rt),K.equals(ce)===!1&&(t.clearColor(oe,we,Xe,Rt),K.copy(ce))},reset:function(){U=!1,te=null,K.set(-1,0,0,0)}}}function s(){let U=!1,ce=null,te=null,K=null;return{setTest:function(oe){oe?De(t.DEPTH_TEST):Pe(t.DEPTH_TEST)},setMask:function(oe){ce!==oe&&!U&&(t.depthMask(oe),ce=oe)},setFunc:function(oe){if(te!==oe){switch(oe){case my:t.depthFunc(t.NEVER);break;case gy:t.depthFunc(t.ALWAYS);break;case _y:t.depthFunc(t.LESS);break;case Ml:t.depthFunc(t.LEQUAL);break;case vy:t.depthFunc(t.EQUAL);break;case xy:t.depthFunc(t.GEQUAL);break;case yy:t.depthFunc(t.GREATER);break;case Sy:t.depthFunc(t.NOTEQUAL);break;default:t.depthFunc(t.LEQUAL)}te=oe}},setLocked:function(oe){U=oe},setClear:function(oe){K!==oe&&(t.clearDepth(oe),K=oe)},reset:function(){U=!1,ce=null,te=null,K=null}}}function o(){let U=!1,ce=null,te=null,K=null,oe=null,we=null,Xe=null,Rt=null,Xt=null;return{setTest:function(et){U||(et?De(t.STENCIL_TEST):Pe(t.STENCIL_TEST))},setMask:function(et){ce!==et&&!U&&(t.stencilMask(et),ce=et)},setFunc:function(et,jt,Vn){(te!==et||K!==jt||oe!==Vn)&&(t.stencilFunc(et,jt,Vn),te=et,K=jt,oe=Vn)},setOp:function(et,jt,Vn){(we!==et||Xe!==jt||Rt!==Vn)&&(t.stencilOp(et,jt,Vn),we=et,Xe=jt,Rt=Vn)},setLocked:function(et){U=et},setClear:function(et){Xt!==et&&(t.clearStencil(et),Xt=et)},reset:function(){U=!1,ce=null,te=null,K=null,oe=null,we=null,Xe=null,Rt=null,Xt=null}}}const a=new r,l=new s,u=new o,f=new WeakMap,h=new WeakMap;let d={},m={},x=new WeakMap,v=[],p=null,c=!1,_=null,g=null,y=null,M=null,A=null,w=null,b=null,S=new Ve(0,0,0),R=0,H=!1,I=null,G=null,L=null,D=null,z=null;const W=t.getParameter(t.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let F=!1,B=0;const k=t.getParameter(t.VERSION);k.indexOf("WebGL")!==-1?(B=parseFloat(/^WebGL (\d)/.exec(k)[1]),F=B>=1):k.indexOf("OpenGL ES")!==-1&&(B=parseFloat(/^OpenGL ES (\d)/.exec(k)[1]),F=B>=2);let Q=null,ee={};const $=t.getParameter(t.SCISSOR_BOX),Z=t.getParameter(t.VIEWPORT),de=new Lt().fromArray($),ve=new Lt().fromArray(Z);function ye(U,ce,te,K){const oe=new Uint8Array(4),we=t.createTexture();t.bindTexture(U,we),t.texParameteri(U,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(U,t.TEXTURE_MAG_FILTER,t.NEAREST);for(let Xe=0;Xe<te;Xe++)i&&(U===t.TEXTURE_3D||U===t.TEXTURE_2D_ARRAY)?t.texImage3D(ce,0,t.RGBA,1,1,K,0,t.RGBA,t.UNSIGNED_BYTE,oe):t.texImage2D(ce+Xe,0,t.RGBA,1,1,0,t.RGBA,t.UNSIGNED_BYTE,oe);return we}const Ie={};Ie[t.TEXTURE_2D]=ye(t.TEXTURE_2D,t.TEXTURE_2D,1),Ie[t.TEXTURE_CUBE_MAP]=ye(t.TEXTURE_CUBE_MAP,t.TEXTURE_CUBE_MAP_POSITIVE_X,6),i&&(Ie[t.TEXTURE_2D_ARRAY]=ye(t.TEXTURE_2D_ARRAY,t.TEXTURE_2D_ARRAY,1,1),Ie[t.TEXTURE_3D]=ye(t.TEXTURE_3D,t.TEXTURE_3D,1,1)),a.setClear(0,0,0,1),l.setClear(1),u.setClear(0),De(t.DEPTH_TEST),l.setFunc(Ml),ze(!1),Ue(Nh),De(t.CULL_FACE),Le(Vi);function De(U){d[U]!==!0&&(t.enable(U),d[U]=!0)}function Pe(U){d[U]!==!1&&(t.disable(U),d[U]=!1)}function Oe(U,ce){return m[U]!==ce?(t.bindFramebuffer(U,ce),m[U]=ce,i&&(U===t.DRAW_FRAMEBUFFER&&(m[t.FRAMEBUFFER]=ce),U===t.FRAMEBUFFER&&(m[t.DRAW_FRAMEBUFFER]=ce)),!0):!1}function V(U,ce){let te=v,K=!1;if(U)if(te=x.get(ce),te===void 0&&(te=[],x.set(ce,te)),U.isWebGLMultipleRenderTargets){const oe=U.texture;if(te.length!==oe.length||te[0]!==t.COLOR_ATTACHMENT0){for(let we=0,Xe=oe.length;we<Xe;we++)te[we]=t.COLOR_ATTACHMENT0+we;te.length=oe.length,K=!0}}else te[0]!==t.COLOR_ATTACHMENT0&&(te[0]=t.COLOR_ATTACHMENT0,K=!0);else te[0]!==t.BACK&&(te[0]=t.BACK,K=!0);K&&(n.isWebGL2?t.drawBuffers(te):e.get("WEBGL_draw_buffers").drawBuffersWEBGL(te))}function At(U){return p!==U?(t.useProgram(U),p=U,!0):!1}const Te={[ur]:t.FUNC_ADD,[ey]:t.FUNC_SUBTRACT,[ty]:t.FUNC_REVERSE_SUBTRACT};if(i)Te[zh]=t.MIN,Te[kh]=t.MAX;else{const U=e.get("EXT_blend_minmax");U!==null&&(Te[zh]=U.MIN_EXT,Te[kh]=U.MAX_EXT)}const Be={[ny]:t.ZERO,[iy]:t.ONE,[ry]:t.SRC_COLOR,[tf]:t.SRC_ALPHA,[cy]:t.SRC_ALPHA_SATURATE,[ly]:t.DST_COLOR,[oy]:t.DST_ALPHA,[sy]:t.ONE_MINUS_SRC_COLOR,[nf]:t.ONE_MINUS_SRC_ALPHA,[uy]:t.ONE_MINUS_DST_COLOR,[ay]:t.ONE_MINUS_DST_ALPHA,[fy]:t.CONSTANT_COLOR,[dy]:t.ONE_MINUS_CONSTANT_COLOR,[hy]:t.CONSTANT_ALPHA,[py]:t.ONE_MINUS_CONSTANT_ALPHA};function Le(U,ce,te,K,oe,we,Xe,Rt,Xt,et){if(U===Vi){c===!0&&(Pe(t.BLEND),c=!1);return}if(c===!1&&(De(t.BLEND),c=!0),U!==Jx){if(U!==_||et!==H){if((g!==ur||A!==ur)&&(t.blendEquation(t.FUNC_ADD),g=ur,A=ur),et)switch(U){case xs:t.blendFuncSeparate(t.ONE,t.ONE_MINUS_SRC_ALPHA,t.ONE,t.ONE_MINUS_SRC_ALPHA);break;case Ih:t.blendFunc(t.ONE,t.ONE);break;case Fh:t.blendFuncSeparate(t.ZERO,t.ONE_MINUS_SRC_COLOR,t.ZERO,t.ONE);break;case Oh:t.blendFuncSeparate(t.ZERO,t.SRC_COLOR,t.ZERO,t.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}else switch(U){case xs:t.blendFuncSeparate(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA,t.ONE,t.ONE_MINUS_SRC_ALPHA);break;case Ih:t.blendFunc(t.SRC_ALPHA,t.ONE);break;case Fh:t.blendFuncSeparate(t.ZERO,t.ONE_MINUS_SRC_COLOR,t.ZERO,t.ONE);break;case Oh:t.blendFunc(t.ZERO,t.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}y=null,M=null,w=null,b=null,S.set(0,0,0),R=0,_=U,H=et}return}oe=oe||ce,we=we||te,Xe=Xe||K,(ce!==g||oe!==A)&&(t.blendEquationSeparate(Te[ce],Te[oe]),g=ce,A=oe),(te!==y||K!==M||we!==w||Xe!==b)&&(t.blendFuncSeparate(Be[te],Be[K],Be[we],Be[Xe]),y=te,M=K,w=we,b=Xe),(Rt.equals(S)===!1||Xt!==R)&&(t.blendColor(Rt.r,Rt.g,Rt.b,Xt),S.copy(Rt),R=Xt),_=U,H=!1}function nt(U,ce){U.side===oi?Pe(t.CULL_FACE):De(t.CULL_FACE);let te=U.side===an;ce&&(te=!te),ze(te),U.blending===xs&&U.transparent===!1?Le(Vi):Le(U.blending,U.blendEquation,U.blendSrc,U.blendDst,U.blendEquationAlpha,U.blendSrcAlpha,U.blendDstAlpha,U.blendColor,U.blendAlpha,U.premultipliedAlpha),l.setFunc(U.depthFunc),l.setTest(U.depthTest),l.setMask(U.depthWrite),a.setMask(U.colorWrite);const K=U.stencilWrite;u.setTest(K),K&&(u.setMask(U.stencilWriteMask),u.setFunc(U.stencilFunc,U.stencilRef,U.stencilFuncMask),u.setOp(U.stencilFail,U.stencilZFail,U.stencilZPass)),vt(U.polygonOffset,U.polygonOffsetFactor,U.polygonOffsetUnits),U.alphaToCoverage===!0?De(t.SAMPLE_ALPHA_TO_COVERAGE):Pe(t.SAMPLE_ALPHA_TO_COVERAGE)}function ze(U){I!==U&&(U?t.frontFace(t.CW):t.frontFace(t.CCW),I=U)}function Ue(U){U!==Kx?(De(t.CULL_FACE),U!==G&&(U===Nh?t.cullFace(t.BACK):U===Zx?t.cullFace(t.FRONT):t.cullFace(t.FRONT_AND_BACK))):Pe(t.CULL_FACE),G=U}function $e(U){U!==L&&(F&&t.lineWidth(U),L=U)}function vt(U,ce,te){U?(De(t.POLYGON_OFFSET_FILL),(D!==ce||z!==te)&&(t.polygonOffset(ce,te),D=ce,z=te)):Pe(t.POLYGON_OFFSET_FILL)}function xt(U){U?De(t.SCISSOR_TEST):Pe(t.SCISSOR_TEST)}function C(U){U===void 0&&(U=t.TEXTURE0+W-1),Q!==U&&(t.activeTexture(U),Q=U)}function E(U,ce,te){te===void 0&&(Q===null?te=t.TEXTURE0+W-1:te=Q);let K=ee[te];K===void 0&&(K={type:void 0,texture:void 0},ee[te]=K),(K.type!==U||K.texture!==ce)&&(Q!==te&&(t.activeTexture(te),Q=te),t.bindTexture(U,ce||Ie[U]),K.type=U,K.texture=ce)}function X(){const U=ee[Q];U!==void 0&&U.type!==void 0&&(t.bindTexture(U.type,null),U.type=void 0,U.texture=void 0)}function re(){try{t.compressedTexImage2D.apply(t,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function ne(){try{t.compressedTexImage3D.apply(t,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function se(){try{t.texSubImage2D.apply(t,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Se(){try{t.texSubImage3D.apply(t,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function le(){try{t.compressedTexSubImage2D.apply(t,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function he(){try{t.compressedTexSubImage3D.apply(t,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function P(){try{t.texStorage2D.apply(t,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function ae(){try{t.texStorage3D.apply(t,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function J(){try{t.texImage2D.apply(t,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Ce(){try{t.texImage3D.apply(t,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Me(U){de.equals(U)===!1&&(t.scissor(U.x,U.y,U.z,U.w),de.copy(U))}function Ae(U){ve.equals(U)===!1&&(t.viewport(U.x,U.y,U.z,U.w),ve.copy(U))}function xe(U,ce){let te=h.get(ce);te===void 0&&(te=new WeakMap,h.set(ce,te));let K=te.get(U);K===void 0&&(K=t.getUniformBlockIndex(ce,U.name),te.set(U,K))}function _e(U,ce){const K=h.get(ce).get(U);f.get(ce)!==K&&(t.uniformBlockBinding(ce,K,U.__bindingPointIndex),f.set(ce,K))}function We(){t.disable(t.BLEND),t.disable(t.CULL_FACE),t.disable(t.DEPTH_TEST),t.disable(t.POLYGON_OFFSET_FILL),t.disable(t.SCISSOR_TEST),t.disable(t.STENCIL_TEST),t.disable(t.SAMPLE_ALPHA_TO_COVERAGE),t.blendEquation(t.FUNC_ADD),t.blendFunc(t.ONE,t.ZERO),t.blendFuncSeparate(t.ONE,t.ZERO,t.ONE,t.ZERO),t.blendColor(0,0,0,0),t.colorMask(!0,!0,!0,!0),t.clearColor(0,0,0,0),t.depthMask(!0),t.depthFunc(t.LESS),t.clearDepth(1),t.stencilMask(4294967295),t.stencilFunc(t.ALWAYS,0,4294967295),t.stencilOp(t.KEEP,t.KEEP,t.KEEP),t.clearStencil(0),t.cullFace(t.BACK),t.frontFace(t.CCW),t.polygonOffset(0,0),t.activeTexture(t.TEXTURE0),t.bindFramebuffer(t.FRAMEBUFFER,null),i===!0&&(t.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),t.bindFramebuffer(t.READ_FRAMEBUFFER,null)),t.useProgram(null),t.lineWidth(1),t.scissor(0,0,t.canvas.width,t.canvas.height),t.viewport(0,0,t.canvas.width,t.canvas.height),d={},Q=null,ee={},m={},x=new WeakMap,v=[],p=null,c=!1,_=null,g=null,y=null,M=null,A=null,w=null,b=null,S=new Ve(0,0,0),R=0,H=!1,I=null,G=null,L=null,D=null,z=null,de.set(0,0,t.canvas.width,t.canvas.height),ve.set(0,0,t.canvas.width,t.canvas.height),a.reset(),l.reset(),u.reset()}return{buffers:{color:a,depth:l,stencil:u},enable:De,disable:Pe,bindFramebuffer:Oe,drawBuffers:V,useProgram:At,setBlending:Le,setMaterial:nt,setFlipSided:ze,setCullFace:Ue,setLineWidth:$e,setPolygonOffset:vt,setScissorTest:xt,activeTexture:C,bindTexture:E,unbindTexture:X,compressedTexImage2D:re,compressedTexImage3D:ne,texImage2D:J,texImage3D:Ce,updateUBOMapping:xe,uniformBlockBinding:_e,texStorage2D:P,texStorage3D:ae,texSubImage2D:se,texSubImage3D:Se,compressedTexSubImage2D:le,compressedTexSubImage3D:he,scissor:Me,viewport:Ae,reset:We}}function Y1(t,e,n,i,r,s,o){const a=r.isWebGL2,l=r.maxTextures,u=r.maxCubemapSize,f=r.maxTextureSize,h=r.maxSamples,d=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,m=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),x=new WeakMap;let v;const p=new WeakMap;let c=!1;try{c=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function _(C,E){return c?new OffscreenCanvas(C,E):Rl("canvas")}function g(C,E,X,re){let ne=1;if((C.width>re||C.height>re)&&(ne=re/Math.max(C.width,C.height)),ne<1||E===!0)if(typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&C instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&C instanceof ImageBitmap){const se=E?ff:Math.floor,Se=se(ne*C.width),le=se(ne*C.height);v===void 0&&(v=_(Se,le));const he=X?_(Se,le):v;return he.width=Se,he.height=le,he.getContext("2d").drawImage(C,0,0,Se,le),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+C.width+"x"+C.height+") to ("+Se+"x"+le+")."),he}else return"data"in C&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+C.width+"x"+C.height+")."),C;return C}function y(C){return pp(C.width)&&pp(C.height)}function M(C){return a?!1:C.wrapS!==On||C.wrapT!==On||C.minFilter!==Kt&&C.minFilter!==Mn}function A(C,E){return C.generateMipmaps&&E&&C.minFilter!==Kt&&C.minFilter!==Mn}function w(C){t.generateMipmap(C)}function b(C,E,X,re,ne=!1){if(a===!1)return E;if(C!==null){if(t[C]!==void 0)return t[C];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+C+"'")}let se=E;if(E===t.RED&&(X===t.FLOAT&&(se=t.R32F),X===t.HALF_FLOAT&&(se=t.R16F),X===t.UNSIGNED_BYTE&&(se=t.R8)),E===t.RED_INTEGER&&(X===t.UNSIGNED_BYTE&&(se=t.R8UI),X===t.UNSIGNED_SHORT&&(se=t.R16UI),X===t.UNSIGNED_INT&&(se=t.R32UI),X===t.BYTE&&(se=t.R8I),X===t.SHORT&&(se=t.R16I),X===t.INT&&(se=t.R32I)),E===t.RG&&(X===t.FLOAT&&(se=t.RG32F),X===t.HALF_FLOAT&&(se=t.RG16F),X===t.UNSIGNED_BYTE&&(se=t.RG8)),E===t.RGBA){const Se=ne?El:Qe.getTransfer(re);X===t.FLOAT&&(se=t.RGBA32F),X===t.HALF_FLOAT&&(se=t.RGBA16F),X===t.UNSIGNED_BYTE&&(se=Se===rt?t.SRGB8_ALPHA8:t.RGBA8),X===t.UNSIGNED_SHORT_4_4_4_4&&(se=t.RGBA4),X===t.UNSIGNED_SHORT_5_5_5_1&&(se=t.RGB5_A1)}return(se===t.R16F||se===t.R32F||se===t.RG16F||se===t.RG32F||se===t.RGBA16F||se===t.RGBA32F)&&e.get("EXT_color_buffer_float"),se}function S(C,E,X){return A(C,X)===!0||C.isFramebufferTexture&&C.minFilter!==Kt&&C.minFilter!==Mn?Math.log2(Math.max(E.width,E.height))+1:C.mipmaps!==void 0&&C.mipmaps.length>0?C.mipmaps.length:C.isCompressedTexture&&Array.isArray(C.image)?E.mipmaps.length:1}function R(C){return C===Kt||C===Bh||C===Au?t.NEAREST:t.LINEAR}function H(C){const E=C.target;E.removeEventListener("dispose",H),G(E),E.isVideoTexture&&x.delete(E)}function I(C){const E=C.target;E.removeEventListener("dispose",I),D(E)}function G(C){const E=i.get(C);if(E.__webglInit===void 0)return;const X=C.source,re=p.get(X);if(re){const ne=re[E.__cacheKey];ne.usedTimes--,ne.usedTimes===0&&L(C),Object.keys(re).length===0&&p.delete(X)}i.remove(C)}function L(C){const E=i.get(C);t.deleteTexture(E.__webglTexture);const X=C.source,re=p.get(X);delete re[E.__cacheKey],o.memory.textures--}function D(C){const E=C.texture,X=i.get(C),re=i.get(E);if(re.__webglTexture!==void 0&&(t.deleteTexture(re.__webglTexture),o.memory.textures--),C.depthTexture&&C.depthTexture.dispose(),C.isWebGLCubeRenderTarget)for(let ne=0;ne<6;ne++){if(Array.isArray(X.__webglFramebuffer[ne]))for(let se=0;se<X.__webglFramebuffer[ne].length;se++)t.deleteFramebuffer(X.__webglFramebuffer[ne][se]);else t.deleteFramebuffer(X.__webglFramebuffer[ne]);X.__webglDepthbuffer&&t.deleteRenderbuffer(X.__webglDepthbuffer[ne])}else{if(Array.isArray(X.__webglFramebuffer))for(let ne=0;ne<X.__webglFramebuffer.length;ne++)t.deleteFramebuffer(X.__webglFramebuffer[ne]);else t.deleteFramebuffer(X.__webglFramebuffer);if(X.__webglDepthbuffer&&t.deleteRenderbuffer(X.__webglDepthbuffer),X.__webglMultisampledFramebuffer&&t.deleteFramebuffer(X.__webglMultisampledFramebuffer),X.__webglColorRenderbuffer)for(let ne=0;ne<X.__webglColorRenderbuffer.length;ne++)X.__webglColorRenderbuffer[ne]&&t.deleteRenderbuffer(X.__webglColorRenderbuffer[ne]);X.__webglDepthRenderbuffer&&t.deleteRenderbuffer(X.__webglDepthRenderbuffer)}if(C.isWebGLMultipleRenderTargets)for(let ne=0,se=E.length;ne<se;ne++){const Se=i.get(E[ne]);Se.__webglTexture&&(t.deleteTexture(Se.__webglTexture),o.memory.textures--),i.remove(E[ne])}i.remove(E),i.remove(C)}let z=0;function W(){z=0}function F(){const C=z;return C>=l&&console.warn("THREE.WebGLTextures: Trying to use "+C+" texture units while this GPU supports only "+l),z+=1,C}function B(C){const E=[];return E.push(C.wrapS),E.push(C.wrapT),E.push(C.wrapR||0),E.push(C.magFilter),E.push(C.minFilter),E.push(C.anisotropy),E.push(C.internalFormat),E.push(C.format),E.push(C.type),E.push(C.generateMipmaps),E.push(C.premultiplyAlpha),E.push(C.flipY),E.push(C.unpackAlignment),E.push(C.colorSpace),E.join()}function k(C,E){const X=i.get(C);if(C.isVideoTexture&&vt(C),C.isRenderTargetTexture===!1&&C.version>0&&X.__version!==C.version){const re=C.image;if(re===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(re.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{De(X,C,E);return}}n.bindTexture(t.TEXTURE_2D,X.__webglTexture,t.TEXTURE0+E)}function Q(C,E){const X=i.get(C);if(C.version>0&&X.__version!==C.version){De(X,C,E);return}n.bindTexture(t.TEXTURE_2D_ARRAY,X.__webglTexture,t.TEXTURE0+E)}function ee(C,E){const X=i.get(C);if(C.version>0&&X.__version!==C.version){De(X,C,E);return}n.bindTexture(t.TEXTURE_3D,X.__webglTexture,t.TEXTURE0+E)}function $(C,E){const X=i.get(C);if(C.version>0&&X.__version!==C.version){Pe(X,C,E);return}n.bindTexture(t.TEXTURE_CUBE_MAP,X.__webglTexture,t.TEXTURE0+E)}const Z={[of]:t.REPEAT,[On]:t.CLAMP_TO_EDGE,[af]:t.MIRRORED_REPEAT},de={[Kt]:t.NEAREST,[Bh]:t.NEAREST_MIPMAP_NEAREST,[Au]:t.NEAREST_MIPMAP_LINEAR,[Mn]:t.LINEAR,[by]:t.LINEAR_MIPMAP_NEAREST,[Oo]:t.LINEAR_MIPMAP_LINEAR},ve={[Hy]:t.NEVER,[Yy]:t.ALWAYS,[Gy]:t.LESS,[H_]:t.LEQUAL,[Vy]:t.EQUAL,[jy]:t.GEQUAL,[Wy]:t.GREATER,[Xy]:t.NOTEQUAL};function ye(C,E,X){if(X?(t.texParameteri(C,t.TEXTURE_WRAP_S,Z[E.wrapS]),t.texParameteri(C,t.TEXTURE_WRAP_T,Z[E.wrapT]),(C===t.TEXTURE_3D||C===t.TEXTURE_2D_ARRAY)&&t.texParameteri(C,t.TEXTURE_WRAP_R,Z[E.wrapR]),t.texParameteri(C,t.TEXTURE_MAG_FILTER,de[E.magFilter]),t.texParameteri(C,t.TEXTURE_MIN_FILTER,de[E.minFilter])):(t.texParameteri(C,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(C,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),(C===t.TEXTURE_3D||C===t.TEXTURE_2D_ARRAY)&&t.texParameteri(C,t.TEXTURE_WRAP_R,t.CLAMP_TO_EDGE),(E.wrapS!==On||E.wrapT!==On)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),t.texParameteri(C,t.TEXTURE_MAG_FILTER,R(E.magFilter)),t.texParameteri(C,t.TEXTURE_MIN_FILTER,R(E.minFilter)),E.minFilter!==Kt&&E.minFilter!==Mn&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),E.compareFunction&&(t.texParameteri(C,t.TEXTURE_COMPARE_MODE,t.COMPARE_REF_TO_TEXTURE),t.texParameteri(C,t.TEXTURE_COMPARE_FUNC,ve[E.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){const re=e.get("EXT_texture_filter_anisotropic");if(E.magFilter===Kt||E.minFilter!==Au&&E.minFilter!==Oo||E.type===Ni&&e.has("OES_texture_float_linear")===!1||a===!1&&E.type===zo&&e.has("OES_texture_half_float_linear")===!1)return;(E.anisotropy>1||i.get(E).__currentAnisotropy)&&(t.texParameterf(C,re.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(E.anisotropy,r.getMaxAnisotropy())),i.get(E).__currentAnisotropy=E.anisotropy)}}function Ie(C,E){let X=!1;C.__webglInit===void 0&&(C.__webglInit=!0,E.addEventListener("dispose",H));const re=E.source;let ne=p.get(re);ne===void 0&&(ne={},p.set(re,ne));const se=B(E);if(se!==C.__cacheKey){ne[se]===void 0&&(ne[se]={texture:t.createTexture(),usedTimes:0},o.memory.textures++,X=!0),ne[se].usedTimes++;const Se=ne[C.__cacheKey];Se!==void 0&&(ne[C.__cacheKey].usedTimes--,Se.usedTimes===0&&L(E)),C.__cacheKey=se,C.__webglTexture=ne[se].texture}return X}function De(C,E,X){let re=t.TEXTURE_2D;(E.isDataArrayTexture||E.isCompressedArrayTexture)&&(re=t.TEXTURE_2D_ARRAY),E.isData3DTexture&&(re=t.TEXTURE_3D);const ne=Ie(C,E),se=E.source;n.bindTexture(re,C.__webglTexture,t.TEXTURE0+X);const Se=i.get(se);if(se.version!==Se.__version||ne===!0){n.activeTexture(t.TEXTURE0+X);const le=Qe.getPrimaries(Qe.workingColorSpace),he=E.colorSpace===wn?null:Qe.getPrimaries(E.colorSpace),P=E.colorSpace===wn||le===he?t.NONE:t.BROWSER_DEFAULT_WEBGL;t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,E.flipY),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),t.pixelStorei(t.UNPACK_ALIGNMENT,E.unpackAlignment),t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,P);const ae=M(E)&&y(E.image)===!1;let J=g(E.image,ae,!1,f);J=xt(E,J);const Ce=y(J)||a,Me=s.convert(E.format,E.colorSpace);let Ae=s.convert(E.type),xe=b(E.internalFormat,Me,Ae,E.colorSpace,E.isVideoTexture);ye(re,E,Ce);let _e;const We=E.mipmaps,U=a&&E.isVideoTexture!==!0&&xe!==z_,ce=Se.__version===void 0||ne===!0,te=S(E,J,Ce);if(E.isDepthTexture)xe=t.DEPTH_COMPONENT,a?E.type===Ni?xe=t.DEPTH_COMPONENT32F:E.type===Ui?xe=t.DEPTH_COMPONENT24:E.type===gr?xe=t.DEPTH24_STENCIL8:xe=t.DEPTH_COMPONENT16:E.type===Ni&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),E.format===_r&&xe===t.DEPTH_COMPONENT&&E.type!==ud&&E.type!==Ui&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),E.type=Ui,Ae=s.convert(E.type)),E.format===Ps&&xe===t.DEPTH_COMPONENT&&(xe=t.DEPTH_STENCIL,E.type!==gr&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),E.type=gr,Ae=s.convert(E.type))),ce&&(U?n.texStorage2D(t.TEXTURE_2D,1,xe,J.width,J.height):n.texImage2D(t.TEXTURE_2D,0,xe,J.width,J.height,0,Me,Ae,null));else if(E.isDataTexture)if(We.length>0&&Ce){U&&ce&&n.texStorage2D(t.TEXTURE_2D,te,xe,We[0].width,We[0].height);for(let K=0,oe=We.length;K<oe;K++)_e=We[K],U?n.texSubImage2D(t.TEXTURE_2D,K,0,0,_e.width,_e.height,Me,Ae,_e.data):n.texImage2D(t.TEXTURE_2D,K,xe,_e.width,_e.height,0,Me,Ae,_e.data);E.generateMipmaps=!1}else U?(ce&&n.texStorage2D(t.TEXTURE_2D,te,xe,J.width,J.height),n.texSubImage2D(t.TEXTURE_2D,0,0,0,J.width,J.height,Me,Ae,J.data)):n.texImage2D(t.TEXTURE_2D,0,xe,J.width,J.height,0,Me,Ae,J.data);else if(E.isCompressedTexture)if(E.isCompressedArrayTexture){U&&ce&&n.texStorage3D(t.TEXTURE_2D_ARRAY,te,xe,We[0].width,We[0].height,J.depth);for(let K=0,oe=We.length;K<oe;K++)_e=We[K],E.format!==zn?Me!==null?U?n.compressedTexSubImage3D(t.TEXTURE_2D_ARRAY,K,0,0,0,_e.width,_e.height,J.depth,Me,_e.data,0,0):n.compressedTexImage3D(t.TEXTURE_2D_ARRAY,K,xe,_e.width,_e.height,J.depth,0,_e.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):U?n.texSubImage3D(t.TEXTURE_2D_ARRAY,K,0,0,0,_e.width,_e.height,J.depth,Me,Ae,_e.data):n.texImage3D(t.TEXTURE_2D_ARRAY,K,xe,_e.width,_e.height,J.depth,0,Me,Ae,_e.data)}else{U&&ce&&n.texStorage2D(t.TEXTURE_2D,te,xe,We[0].width,We[0].height);for(let K=0,oe=We.length;K<oe;K++)_e=We[K],E.format!==zn?Me!==null?U?n.compressedTexSubImage2D(t.TEXTURE_2D,K,0,0,_e.width,_e.height,Me,_e.data):n.compressedTexImage2D(t.TEXTURE_2D,K,xe,_e.width,_e.height,0,_e.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):U?n.texSubImage2D(t.TEXTURE_2D,K,0,0,_e.width,_e.height,Me,Ae,_e.data):n.texImage2D(t.TEXTURE_2D,K,xe,_e.width,_e.height,0,Me,Ae,_e.data)}else if(E.isDataArrayTexture)U?(ce&&n.texStorage3D(t.TEXTURE_2D_ARRAY,te,xe,J.width,J.height,J.depth),n.texSubImage3D(t.TEXTURE_2D_ARRAY,0,0,0,0,J.width,J.height,J.depth,Me,Ae,J.data)):n.texImage3D(t.TEXTURE_2D_ARRAY,0,xe,J.width,J.height,J.depth,0,Me,Ae,J.data);else if(E.isData3DTexture)U?(ce&&n.texStorage3D(t.TEXTURE_3D,te,xe,J.width,J.height,J.depth),n.texSubImage3D(t.TEXTURE_3D,0,0,0,0,J.width,J.height,J.depth,Me,Ae,J.data)):n.texImage3D(t.TEXTURE_3D,0,xe,J.width,J.height,J.depth,0,Me,Ae,J.data);else if(E.isFramebufferTexture){if(ce)if(U)n.texStorage2D(t.TEXTURE_2D,te,xe,J.width,J.height);else{let K=J.width,oe=J.height;for(let we=0;we<te;we++)n.texImage2D(t.TEXTURE_2D,we,xe,K,oe,0,Me,Ae,null),K>>=1,oe>>=1}}else if(We.length>0&&Ce){U&&ce&&n.texStorage2D(t.TEXTURE_2D,te,xe,We[0].width,We[0].height);for(let K=0,oe=We.length;K<oe;K++)_e=We[K],U?n.texSubImage2D(t.TEXTURE_2D,K,0,0,Me,Ae,_e):n.texImage2D(t.TEXTURE_2D,K,xe,Me,Ae,_e);E.generateMipmaps=!1}else U?(ce&&n.texStorage2D(t.TEXTURE_2D,te,xe,J.width,J.height),n.texSubImage2D(t.TEXTURE_2D,0,0,0,Me,Ae,J)):n.texImage2D(t.TEXTURE_2D,0,xe,Me,Ae,J);A(E,Ce)&&w(re),Se.__version=se.version,E.onUpdate&&E.onUpdate(E)}C.__version=E.version}function Pe(C,E,X){if(E.image.length!==6)return;const re=Ie(C,E),ne=E.source;n.bindTexture(t.TEXTURE_CUBE_MAP,C.__webglTexture,t.TEXTURE0+X);const se=i.get(ne);if(ne.version!==se.__version||re===!0){n.activeTexture(t.TEXTURE0+X);const Se=Qe.getPrimaries(Qe.workingColorSpace),le=E.colorSpace===wn?null:Qe.getPrimaries(E.colorSpace),he=E.colorSpace===wn||Se===le?t.NONE:t.BROWSER_DEFAULT_WEBGL;t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,E.flipY),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),t.pixelStorei(t.UNPACK_ALIGNMENT,E.unpackAlignment),t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,he);const P=E.isCompressedTexture||E.image[0].isCompressedTexture,ae=E.image[0]&&E.image[0].isDataTexture,J=[];for(let K=0;K<6;K++)!P&&!ae?J[K]=g(E.image[K],!1,!0,u):J[K]=ae?E.image[K].image:E.image[K],J[K]=xt(E,J[K]);const Ce=J[0],Me=y(Ce)||a,Ae=s.convert(E.format,E.colorSpace),xe=s.convert(E.type),_e=b(E.internalFormat,Ae,xe,E.colorSpace),We=a&&E.isVideoTexture!==!0,U=se.__version===void 0||re===!0;let ce=S(E,Ce,Me);ye(t.TEXTURE_CUBE_MAP,E,Me);let te;if(P){We&&U&&n.texStorage2D(t.TEXTURE_CUBE_MAP,ce,_e,Ce.width,Ce.height);for(let K=0;K<6;K++){te=J[K].mipmaps;for(let oe=0;oe<te.length;oe++){const we=te[oe];E.format!==zn?Ae!==null?We?n.compressedTexSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+K,oe,0,0,we.width,we.height,Ae,we.data):n.compressedTexImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+K,oe,_e,we.width,we.height,0,we.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):We?n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+K,oe,0,0,we.width,we.height,Ae,xe,we.data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+K,oe,_e,we.width,we.height,0,Ae,xe,we.data)}}}else{te=E.mipmaps,We&&U&&(te.length>0&&ce++,n.texStorage2D(t.TEXTURE_CUBE_MAP,ce,_e,J[0].width,J[0].height));for(let K=0;K<6;K++)if(ae){We?n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,0,0,J[K].width,J[K].height,Ae,xe,J[K].data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,_e,J[K].width,J[K].height,0,Ae,xe,J[K].data);for(let oe=0;oe<te.length;oe++){const Xe=te[oe].image[K].image;We?n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+K,oe+1,0,0,Xe.width,Xe.height,Ae,xe,Xe.data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+K,oe+1,_e,Xe.width,Xe.height,0,Ae,xe,Xe.data)}}else{We?n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,0,0,Ae,xe,J[K]):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,_e,Ae,xe,J[K]);for(let oe=0;oe<te.length;oe++){const we=te[oe];We?n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+K,oe+1,0,0,Ae,xe,we.image[K]):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+K,oe+1,_e,Ae,xe,we.image[K])}}}A(E,Me)&&w(t.TEXTURE_CUBE_MAP),se.__version=ne.version,E.onUpdate&&E.onUpdate(E)}C.__version=E.version}function Oe(C,E,X,re,ne,se){const Se=s.convert(X.format,X.colorSpace),le=s.convert(X.type),he=b(X.internalFormat,Se,le,X.colorSpace);if(!i.get(E).__hasExternalTextures){const ae=Math.max(1,E.width>>se),J=Math.max(1,E.height>>se);ne===t.TEXTURE_3D||ne===t.TEXTURE_2D_ARRAY?n.texImage3D(ne,se,he,ae,J,E.depth,0,Se,le,null):n.texImage2D(ne,se,he,ae,J,0,Se,le,null)}n.bindFramebuffer(t.FRAMEBUFFER,C),$e(E)?d.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,re,ne,i.get(X).__webglTexture,0,Ue(E)):(ne===t.TEXTURE_2D||ne>=t.TEXTURE_CUBE_MAP_POSITIVE_X&&ne<=t.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&t.framebufferTexture2D(t.FRAMEBUFFER,re,ne,i.get(X).__webglTexture,se),n.bindFramebuffer(t.FRAMEBUFFER,null)}function V(C,E,X){if(t.bindRenderbuffer(t.RENDERBUFFER,C),E.depthBuffer&&!E.stencilBuffer){let re=a===!0?t.DEPTH_COMPONENT24:t.DEPTH_COMPONENT16;if(X||$e(E)){const ne=E.depthTexture;ne&&ne.isDepthTexture&&(ne.type===Ni?re=t.DEPTH_COMPONENT32F:ne.type===Ui&&(re=t.DEPTH_COMPONENT24));const se=Ue(E);$e(E)?d.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,se,re,E.width,E.height):t.renderbufferStorageMultisample(t.RENDERBUFFER,se,re,E.width,E.height)}else t.renderbufferStorage(t.RENDERBUFFER,re,E.width,E.height);t.framebufferRenderbuffer(t.FRAMEBUFFER,t.DEPTH_ATTACHMENT,t.RENDERBUFFER,C)}else if(E.depthBuffer&&E.stencilBuffer){const re=Ue(E);X&&$e(E)===!1?t.renderbufferStorageMultisample(t.RENDERBUFFER,re,t.DEPTH24_STENCIL8,E.width,E.height):$e(E)?d.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,re,t.DEPTH24_STENCIL8,E.width,E.height):t.renderbufferStorage(t.RENDERBUFFER,t.DEPTH_STENCIL,E.width,E.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.DEPTH_STENCIL_ATTACHMENT,t.RENDERBUFFER,C)}else{const re=E.isWebGLMultipleRenderTargets===!0?E.texture:[E.texture];for(let ne=0;ne<re.length;ne++){const se=re[ne],Se=s.convert(se.format,se.colorSpace),le=s.convert(se.type),he=b(se.internalFormat,Se,le,se.colorSpace),P=Ue(E);X&&$e(E)===!1?t.renderbufferStorageMultisample(t.RENDERBUFFER,P,he,E.width,E.height):$e(E)?d.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,P,he,E.width,E.height):t.renderbufferStorage(t.RENDERBUFFER,he,E.width,E.height)}}t.bindRenderbuffer(t.RENDERBUFFER,null)}function At(C,E){if(E&&E.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(n.bindFramebuffer(t.FRAMEBUFFER,C),!(E.depthTexture&&E.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!i.get(E.depthTexture).__webglTexture||E.depthTexture.image.width!==E.width||E.depthTexture.image.height!==E.height)&&(E.depthTexture.image.width=E.width,E.depthTexture.image.height=E.height,E.depthTexture.needsUpdate=!0),k(E.depthTexture,0);const re=i.get(E.depthTexture).__webglTexture,ne=Ue(E);if(E.depthTexture.format===_r)$e(E)?d.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,t.DEPTH_ATTACHMENT,t.TEXTURE_2D,re,0,ne):t.framebufferTexture2D(t.FRAMEBUFFER,t.DEPTH_ATTACHMENT,t.TEXTURE_2D,re,0);else if(E.depthTexture.format===Ps)$e(E)?d.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,t.DEPTH_STENCIL_ATTACHMENT,t.TEXTURE_2D,re,0,ne):t.framebufferTexture2D(t.FRAMEBUFFER,t.DEPTH_STENCIL_ATTACHMENT,t.TEXTURE_2D,re,0);else throw new Error("Unknown depthTexture format")}function Te(C){const E=i.get(C),X=C.isWebGLCubeRenderTarget===!0;if(C.depthTexture&&!E.__autoAllocateDepthBuffer){if(X)throw new Error("target.depthTexture not supported in Cube render targets");At(E.__webglFramebuffer,C)}else if(X){E.__webglDepthbuffer=[];for(let re=0;re<6;re++)n.bindFramebuffer(t.FRAMEBUFFER,E.__webglFramebuffer[re]),E.__webglDepthbuffer[re]=t.createRenderbuffer(),V(E.__webglDepthbuffer[re],C,!1)}else n.bindFramebuffer(t.FRAMEBUFFER,E.__webglFramebuffer),E.__webglDepthbuffer=t.createRenderbuffer(),V(E.__webglDepthbuffer,C,!1);n.bindFramebuffer(t.FRAMEBUFFER,null)}function Be(C,E,X){const re=i.get(C);E!==void 0&&Oe(re.__webglFramebuffer,C,C.texture,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,0),X!==void 0&&Te(C)}function Le(C){const E=C.texture,X=i.get(C),re=i.get(E);C.addEventListener("dispose",I),C.isWebGLMultipleRenderTargets!==!0&&(re.__webglTexture===void 0&&(re.__webglTexture=t.createTexture()),re.__version=E.version,o.memory.textures++);const ne=C.isWebGLCubeRenderTarget===!0,se=C.isWebGLMultipleRenderTargets===!0,Se=y(C)||a;if(ne){X.__webglFramebuffer=[];for(let le=0;le<6;le++)if(a&&E.mipmaps&&E.mipmaps.length>0){X.__webglFramebuffer[le]=[];for(let he=0;he<E.mipmaps.length;he++)X.__webglFramebuffer[le][he]=t.createFramebuffer()}else X.__webglFramebuffer[le]=t.createFramebuffer()}else{if(a&&E.mipmaps&&E.mipmaps.length>0){X.__webglFramebuffer=[];for(let le=0;le<E.mipmaps.length;le++)X.__webglFramebuffer[le]=t.createFramebuffer()}else X.__webglFramebuffer=t.createFramebuffer();if(se)if(r.drawBuffers){const le=C.texture;for(let he=0,P=le.length;he<P;he++){const ae=i.get(le[he]);ae.__webglTexture===void 0&&(ae.__webglTexture=t.createTexture(),o.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(a&&C.samples>0&&$e(C)===!1){const le=se?E:[E];X.__webglMultisampledFramebuffer=t.createFramebuffer(),X.__webglColorRenderbuffer=[],n.bindFramebuffer(t.FRAMEBUFFER,X.__webglMultisampledFramebuffer);for(let he=0;he<le.length;he++){const P=le[he];X.__webglColorRenderbuffer[he]=t.createRenderbuffer(),t.bindRenderbuffer(t.RENDERBUFFER,X.__webglColorRenderbuffer[he]);const ae=s.convert(P.format,P.colorSpace),J=s.convert(P.type),Ce=b(P.internalFormat,ae,J,P.colorSpace,C.isXRRenderTarget===!0),Me=Ue(C);t.renderbufferStorageMultisample(t.RENDERBUFFER,Me,Ce,C.width,C.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+he,t.RENDERBUFFER,X.__webglColorRenderbuffer[he])}t.bindRenderbuffer(t.RENDERBUFFER,null),C.depthBuffer&&(X.__webglDepthRenderbuffer=t.createRenderbuffer(),V(X.__webglDepthRenderbuffer,C,!0)),n.bindFramebuffer(t.FRAMEBUFFER,null)}}if(ne){n.bindTexture(t.TEXTURE_CUBE_MAP,re.__webglTexture),ye(t.TEXTURE_CUBE_MAP,E,Se);for(let le=0;le<6;le++)if(a&&E.mipmaps&&E.mipmaps.length>0)for(let he=0;he<E.mipmaps.length;he++)Oe(X.__webglFramebuffer[le][he],C,E,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+le,he);else Oe(X.__webglFramebuffer[le],C,E,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+le,0);A(E,Se)&&w(t.TEXTURE_CUBE_MAP),n.unbindTexture()}else if(se){const le=C.texture;for(let he=0,P=le.length;he<P;he++){const ae=le[he],J=i.get(ae);n.bindTexture(t.TEXTURE_2D,J.__webglTexture),ye(t.TEXTURE_2D,ae,Se),Oe(X.__webglFramebuffer,C,ae,t.COLOR_ATTACHMENT0+he,t.TEXTURE_2D,0),A(ae,Se)&&w(t.TEXTURE_2D)}n.unbindTexture()}else{let le=t.TEXTURE_2D;if((C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(a?le=C.isWebGL3DRenderTarget?t.TEXTURE_3D:t.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),n.bindTexture(le,re.__webglTexture),ye(le,E,Se),a&&E.mipmaps&&E.mipmaps.length>0)for(let he=0;he<E.mipmaps.length;he++)Oe(X.__webglFramebuffer[he],C,E,t.COLOR_ATTACHMENT0,le,he);else Oe(X.__webglFramebuffer,C,E,t.COLOR_ATTACHMENT0,le,0);A(E,Se)&&w(le),n.unbindTexture()}C.depthBuffer&&Te(C)}function nt(C){const E=y(C)||a,X=C.isWebGLMultipleRenderTargets===!0?C.texture:[C.texture];for(let re=0,ne=X.length;re<ne;re++){const se=X[re];if(A(se,E)){const Se=C.isWebGLCubeRenderTarget?t.TEXTURE_CUBE_MAP:t.TEXTURE_2D,le=i.get(se).__webglTexture;n.bindTexture(Se,le),w(Se),n.unbindTexture()}}}function ze(C){if(a&&C.samples>0&&$e(C)===!1){const E=C.isWebGLMultipleRenderTargets?C.texture:[C.texture],X=C.width,re=C.height;let ne=t.COLOR_BUFFER_BIT;const se=[],Se=C.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,le=i.get(C),he=C.isWebGLMultipleRenderTargets===!0;if(he)for(let P=0;P<E.length;P++)n.bindFramebuffer(t.FRAMEBUFFER,le.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+P,t.RENDERBUFFER,null),n.bindFramebuffer(t.FRAMEBUFFER,le.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+P,t.TEXTURE_2D,null,0);n.bindFramebuffer(t.READ_FRAMEBUFFER,le.__webglMultisampledFramebuffer),n.bindFramebuffer(t.DRAW_FRAMEBUFFER,le.__webglFramebuffer);for(let P=0;P<E.length;P++){se.push(t.COLOR_ATTACHMENT0+P),C.depthBuffer&&se.push(Se);const ae=le.__ignoreDepthValues!==void 0?le.__ignoreDepthValues:!1;if(ae===!1&&(C.depthBuffer&&(ne|=t.DEPTH_BUFFER_BIT),C.stencilBuffer&&(ne|=t.STENCIL_BUFFER_BIT)),he&&t.framebufferRenderbuffer(t.READ_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.RENDERBUFFER,le.__webglColorRenderbuffer[P]),ae===!0&&(t.invalidateFramebuffer(t.READ_FRAMEBUFFER,[Se]),t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER,[Se])),he){const J=i.get(E[P]).__webglTexture;t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,J,0)}t.blitFramebuffer(0,0,X,re,0,0,X,re,ne,t.NEAREST),m&&t.invalidateFramebuffer(t.READ_FRAMEBUFFER,se)}if(n.bindFramebuffer(t.READ_FRAMEBUFFER,null),n.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),he)for(let P=0;P<E.length;P++){n.bindFramebuffer(t.FRAMEBUFFER,le.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+P,t.RENDERBUFFER,le.__webglColorRenderbuffer[P]);const ae=i.get(E[P]).__webglTexture;n.bindFramebuffer(t.FRAMEBUFFER,le.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+P,t.TEXTURE_2D,ae,0)}n.bindFramebuffer(t.DRAW_FRAMEBUFFER,le.__webglMultisampledFramebuffer)}}function Ue(C){return Math.min(h,C.samples)}function $e(C){const E=i.get(C);return a&&C.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&E.__useRenderToTexture!==!1}function vt(C){const E=o.render.frame;x.get(C)!==E&&(x.set(C,E),C.update())}function xt(C,E){const X=C.colorSpace,re=C.format,ne=C.type;return C.isCompressedTexture===!0||C.isVideoTexture===!0||C.format===uf||X!==gi&&X!==wn&&(Qe.getTransfer(X)===rt?a===!1?e.has("EXT_sRGB")===!0&&re===zn?(C.format=uf,C.minFilter=Mn,C.generateMipmaps=!1):E=V_.sRGBToLinear(E):(re!==zn||ne!==Xi)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",X)),E}this.allocateTextureUnit=F,this.resetTextureUnits=W,this.setTexture2D=k,this.setTexture2DArray=Q,this.setTexture3D=ee,this.setTextureCube=$,this.rebindTextures=Be,this.setupRenderTarget=Le,this.updateRenderTargetMipmap=nt,this.updateMultisampleRenderTarget=ze,this.setupDepthRenderbuffer=Te,this.setupFrameBufferTexture=Oe,this.useMultisampledRTT=$e}function q1(t,e,n){const i=n.isWebGL2;function r(s,o=wn){let a;const l=Qe.getTransfer(o);if(s===Xi)return t.UNSIGNED_BYTE;if(s===U_)return t.UNSIGNED_SHORT_4_4_4_4;if(s===N_)return t.UNSIGNED_SHORT_5_5_5_1;if(s===Py)return t.BYTE;if(s===Ly)return t.SHORT;if(s===ud)return t.UNSIGNED_SHORT;if(s===D_)return t.INT;if(s===Ui)return t.UNSIGNED_INT;if(s===Ni)return t.FLOAT;if(s===zo)return i?t.HALF_FLOAT:(a=e.get("OES_texture_half_float"),a!==null?a.HALF_FLOAT_OES:null);if(s===Dy)return t.ALPHA;if(s===zn)return t.RGBA;if(s===Uy)return t.LUMINANCE;if(s===Ny)return t.LUMINANCE_ALPHA;if(s===_r)return t.DEPTH_COMPONENT;if(s===Ps)return t.DEPTH_STENCIL;if(s===uf)return a=e.get("EXT_sRGB"),a!==null?a.SRGB_ALPHA_EXT:null;if(s===Iy)return t.RED;if(s===I_)return t.RED_INTEGER;if(s===Fy)return t.RG;if(s===F_)return t.RG_INTEGER;if(s===O_)return t.RGBA_INTEGER;if(s===Ru||s===Cu||s===bu||s===Pu)if(l===rt)if(a=e.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(s===Ru)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(s===Cu)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(s===bu)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(s===Pu)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=e.get("WEBGL_compressed_texture_s3tc"),a!==null){if(s===Ru)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(s===Cu)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(s===bu)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(s===Pu)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(s===Hh||s===Gh||s===Vh||s===Wh)if(a=e.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(s===Hh)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(s===Gh)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(s===Vh)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(s===Wh)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(s===z_)return a=e.get("WEBGL_compressed_texture_etc1"),a!==null?a.COMPRESSED_RGB_ETC1_WEBGL:null;if(s===Xh||s===jh)if(a=e.get("WEBGL_compressed_texture_etc"),a!==null){if(s===Xh)return l===rt?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(s===jh)return l===rt?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(s===Yh||s===qh||s===$h||s===Kh||s===Zh||s===Qh||s===Jh||s===ep||s===tp||s===np||s===ip||s===rp||s===sp||s===op)if(a=e.get("WEBGL_compressed_texture_astc"),a!==null){if(s===Yh)return l===rt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(s===qh)return l===rt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(s===$h)return l===rt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(s===Kh)return l===rt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(s===Zh)return l===rt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(s===Qh)return l===rt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(s===Jh)return l===rt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(s===ep)return l===rt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(s===tp)return l===rt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(s===np)return l===rt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(s===ip)return l===rt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(s===rp)return l===rt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(s===sp)return l===rt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(s===op)return l===rt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(s===Lu||s===ap||s===lp)if(a=e.get("EXT_texture_compression_bptc"),a!==null){if(s===Lu)return l===rt?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(s===ap)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(s===lp)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(s===Oy||s===up||s===cp||s===fp)if(a=e.get("EXT_texture_compression_rgtc"),a!==null){if(s===Lu)return a.COMPRESSED_RED_RGTC1_EXT;if(s===up)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(s===cp)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(s===fp)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return s===gr?i?t.UNSIGNED_INT_24_8:(a=e.get("WEBGL_depth_texture"),a!==null?a.UNSIGNED_INT_24_8_WEBGL:null):t[s]!==void 0?t[s]:null}return{convert:r}}class $1 extends Tn{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class lo extends Mt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const K1={type:"move"};class tc{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new lo,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new lo,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new N,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new N),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new lo,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new N,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new N),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const n=this._hand;if(n)for(const i of e.hand.values())this._getHandJoint(n,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,n,i){let r=null,s=null,o=null;const a=this._targetRay,l=this._grip,u=this._hand;if(e&&n.session.visibilityState!=="visible-blurred"){if(u&&e.hand){o=!0;for(const v of e.hand.values()){const p=n.getJointPose(v,i),c=this._getHandJoint(u,v);p!==null&&(c.matrix.fromArray(p.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,c.jointRadius=p.radius),c.visible=p!==null}const f=u.joints["index-finger-tip"],h=u.joints["thumb-tip"],d=f.position.distanceTo(h.position),m=.02,x=.005;u.inputState.pinching&&d>m+x?(u.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!u.inputState.pinching&&d<=m-x&&(u.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=n.getPose(e.gripSpace,i),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(r=n.getPose(e.targetRaySpace,i),r===null&&s!==null&&(r=s),r!==null&&(a.matrix.fromArray(r.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,r.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(r.linearVelocity)):a.hasLinearVelocity=!1,r.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(r.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(K1)))}return a!==null&&(a.visible=r!==null),l!==null&&(l.visible=s!==null),u!==null&&(u.visible=o!==null),this}_getHandJoint(e,n){if(e.joints[n.jointName]===void 0){const i=new lo;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[n.jointName]=i,e.add(i)}return e.joints[n.jointName]}}class Z1 extends Cr{constructor(e,n){super();const i=this;let r=null,s=1,o=null,a="local-floor",l=1,u=null,f=null,h=null,d=null,m=null,x=null;const v=n.getContextAttributes();let p=null,c=null;const _=[],g=[],y=new Re;let M=null;const A=new Tn;A.layers.enable(1),A.viewport=new Lt;const w=new Tn;w.layers.enable(2),w.viewport=new Lt;const b=[A,w],S=new $1;S.layers.enable(1),S.layers.enable(2);let R=null,H=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function($){let Z=_[$];return Z===void 0&&(Z=new tc,_[$]=Z),Z.getTargetRaySpace()},this.getControllerGrip=function($){let Z=_[$];return Z===void 0&&(Z=new tc,_[$]=Z),Z.getGripSpace()},this.getHand=function($){let Z=_[$];return Z===void 0&&(Z=new tc,_[$]=Z),Z.getHandSpace()};function I($){const Z=g.indexOf($.inputSource);if(Z===-1)return;const de=_[Z];de!==void 0&&(de.update($.inputSource,$.frame,u||o),de.dispatchEvent({type:$.type,data:$.inputSource}))}function G(){r.removeEventListener("select",I),r.removeEventListener("selectstart",I),r.removeEventListener("selectend",I),r.removeEventListener("squeeze",I),r.removeEventListener("squeezestart",I),r.removeEventListener("squeezeend",I),r.removeEventListener("end",G),r.removeEventListener("inputsourceschange",L);for(let $=0;$<_.length;$++){const Z=g[$];Z!==null&&(g[$]=null,_[$].disconnect(Z))}R=null,H=null,e.setRenderTarget(p),m=null,d=null,h=null,r=null,c=null,ee.stop(),i.isPresenting=!1,e.setPixelRatio(M),e.setSize(y.width,y.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function($){s=$,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function($){a=$,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return u||o},this.setReferenceSpace=function($){u=$},this.getBaseLayer=function(){return d!==null?d:m},this.getBinding=function(){return h},this.getFrame=function(){return x},this.getSession=function(){return r},this.setSession=async function($){if(r=$,r!==null){if(p=e.getRenderTarget(),r.addEventListener("select",I),r.addEventListener("selectstart",I),r.addEventListener("selectend",I),r.addEventListener("squeeze",I),r.addEventListener("squeezestart",I),r.addEventListener("squeezeend",I),r.addEventListener("end",G),r.addEventListener("inputsourceschange",L),v.xrCompatible!==!0&&await n.makeXRCompatible(),M=e.getPixelRatio(),e.getSize(y),r.renderState.layers===void 0||e.capabilities.isWebGL2===!1){const Z={antialias:r.renderState.layers===void 0?v.antialias:!0,alpha:!0,depth:v.depth,stencil:v.stencil,framebufferScaleFactor:s};m=new XRWebGLLayer(r,n,Z),r.updateRenderState({baseLayer:m}),e.setPixelRatio(1),e.setSize(m.framebufferWidth,m.framebufferHeight,!1),c=new Er(m.framebufferWidth,m.framebufferHeight,{format:zn,type:Xi,colorSpace:e.outputColorSpace,stencilBuffer:v.stencil})}else{let Z=null,de=null,ve=null;v.depth&&(ve=v.stencil?n.DEPTH24_STENCIL8:n.DEPTH_COMPONENT24,Z=v.stencil?Ps:_r,de=v.stencil?gr:Ui);const ye={colorFormat:n.RGBA8,depthFormat:ve,scaleFactor:s};h=new XRWebGLBinding(r,n),d=h.createProjectionLayer(ye),r.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),c=new Er(d.textureWidth,d.textureHeight,{format:zn,type:Xi,depthTexture:new nv(d.textureWidth,d.textureHeight,de,void 0,void 0,void 0,void 0,void 0,void 0,Z),stencilBuffer:v.stencil,colorSpace:e.outputColorSpace,samples:v.antialias?4:0});const Ie=e.properties.get(c);Ie.__ignoreDepthValues=d.ignoreDepthValues}c.isXRRenderTarget=!0,this.setFoveation(l),u=null,o=await r.requestReferenceSpace(a),ee.setContext(r),ee.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode};function L($){for(let Z=0;Z<$.removed.length;Z++){const de=$.removed[Z],ve=g.indexOf(de);ve>=0&&(g[ve]=null,_[ve].disconnect(de))}for(let Z=0;Z<$.added.length;Z++){const de=$.added[Z];let ve=g.indexOf(de);if(ve===-1){for(let Ie=0;Ie<_.length;Ie++)if(Ie>=g.length){g.push(de),ve=Ie;break}else if(g[Ie]===null){g[Ie]=de,ve=Ie;break}if(ve===-1)break}const ye=_[ve];ye&&ye.connect(de)}}const D=new N,z=new N;function W($,Z,de){D.setFromMatrixPosition(Z.matrixWorld),z.setFromMatrixPosition(de.matrixWorld);const ve=D.distanceTo(z),ye=Z.projectionMatrix.elements,Ie=de.projectionMatrix.elements,De=ye[14]/(ye[10]-1),Pe=ye[14]/(ye[10]+1),Oe=(ye[9]+1)/ye[5],V=(ye[9]-1)/ye[5],At=(ye[8]-1)/ye[0],Te=(Ie[8]+1)/Ie[0],Be=De*At,Le=De*Te,nt=ve/(-At+Te),ze=nt*-At;Z.matrixWorld.decompose($.position,$.quaternion,$.scale),$.translateX(ze),$.translateZ(nt),$.matrixWorld.compose($.position,$.quaternion,$.scale),$.matrixWorldInverse.copy($.matrixWorld).invert();const Ue=De+nt,$e=Pe+nt,vt=Be-ze,xt=Le+(ve-ze),C=Oe*Pe/$e*Ue,E=V*Pe/$e*Ue;$.projectionMatrix.makePerspective(vt,xt,C,E,Ue,$e),$.projectionMatrixInverse.copy($.projectionMatrix).invert()}function F($,Z){Z===null?$.matrixWorld.copy($.matrix):$.matrixWorld.multiplyMatrices(Z.matrixWorld,$.matrix),$.matrixWorldInverse.copy($.matrixWorld).invert()}this.updateCamera=function($){if(r===null)return;S.near=w.near=A.near=$.near,S.far=w.far=A.far=$.far,(R!==S.near||H!==S.far)&&(r.updateRenderState({depthNear:S.near,depthFar:S.far}),R=S.near,H=S.far);const Z=$.parent,de=S.cameras;F(S,Z);for(let ve=0;ve<de.length;ve++)F(de[ve],Z);de.length===2?W(S,A,w):S.projectionMatrix.copy(A.projectionMatrix),B($,S,Z)};function B($,Z,de){de===null?$.matrix.copy(Z.matrixWorld):($.matrix.copy(de.matrixWorld),$.matrix.invert(),$.matrix.multiply(Z.matrixWorld)),$.matrix.decompose($.position,$.quaternion,$.scale),$.updateMatrixWorld(!0),$.projectionMatrix.copy(Z.projectionMatrix),$.projectionMatrixInverse.copy(Z.projectionMatrixInverse),$.isPerspectiveCamera&&($.fov=cf*2*Math.atan(1/$.projectionMatrix.elements[5]),$.zoom=1)}this.getCamera=function(){return S},this.getFoveation=function(){if(!(d===null&&m===null))return l},this.setFoveation=function($){l=$,d!==null&&(d.fixedFoveation=$),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=$)};let k=null;function Q($,Z){if(f=Z.getViewerPose(u||o),x=Z,f!==null){const de=f.views;m!==null&&(e.setRenderTargetFramebuffer(c,m.framebuffer),e.setRenderTarget(c));let ve=!1;de.length!==S.cameras.length&&(S.cameras.length=0,ve=!0);for(let ye=0;ye<de.length;ye++){const Ie=de[ye];let De=null;if(m!==null)De=m.getViewport(Ie);else{const Oe=h.getViewSubImage(d,Ie);De=Oe.viewport,ye===0&&(e.setRenderTargetTextures(c,Oe.colorTexture,d.ignoreDepthValues?void 0:Oe.depthStencilTexture),e.setRenderTarget(c))}let Pe=b[ye];Pe===void 0&&(Pe=new Tn,Pe.layers.enable(ye),Pe.viewport=new Lt,b[ye]=Pe),Pe.matrix.fromArray(Ie.transform.matrix),Pe.matrix.decompose(Pe.position,Pe.quaternion,Pe.scale),Pe.projectionMatrix.fromArray(Ie.projectionMatrix),Pe.projectionMatrixInverse.copy(Pe.projectionMatrix).invert(),Pe.viewport.set(De.x,De.y,De.width,De.height),ye===0&&(S.matrix.copy(Pe.matrix),S.matrix.decompose(S.position,S.quaternion,S.scale)),ve===!0&&S.cameras.push(Pe)}}for(let de=0;de<_.length;de++){const ve=g[de],ye=_[de];ve!==null&&ye!==void 0&&ye.update(ve,Z,u||o)}k&&k($,Z),Z.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:Z}),x=null}const ee=new ev;ee.setAnimationLoop(Q),this.setAnimationLoop=function($){k=$},this.dispose=function(){}}}function Q1(t,e){function n(p,c){p.matrixAutoUpdate===!0&&p.updateMatrix(),c.value.copy(p.matrix)}function i(p,c){c.color.getRGB(p.fogColor.value,Z_(t)),c.isFog?(p.fogNear.value=c.near,p.fogFar.value=c.far):c.isFogExp2&&(p.fogDensity.value=c.density)}function r(p,c,_,g,y){c.isMeshBasicMaterial||c.isMeshLambertMaterial?s(p,c):c.isMeshToonMaterial?(s(p,c),h(p,c)):c.isMeshPhongMaterial?(s(p,c),f(p,c)):c.isMeshStandardMaterial?(s(p,c),d(p,c),c.isMeshPhysicalMaterial&&m(p,c,y)):c.isMeshMatcapMaterial?(s(p,c),x(p,c)):c.isMeshDepthMaterial?s(p,c):c.isMeshDistanceMaterial?(s(p,c),v(p,c)):c.isMeshNormalMaterial?s(p,c):c.isLineBasicMaterial?(o(p,c),c.isLineDashedMaterial&&a(p,c)):c.isPointsMaterial?l(p,c,_,g):c.isSpriteMaterial?u(p,c):c.isShadowMaterial?(p.color.value.copy(c.color),p.opacity.value=c.opacity):c.isShaderMaterial&&(c.uniformsNeedUpdate=!1)}function s(p,c){p.opacity.value=c.opacity,c.color&&p.diffuse.value.copy(c.color),c.emissive&&p.emissive.value.copy(c.emissive).multiplyScalar(c.emissiveIntensity),c.map&&(p.map.value=c.map,n(c.map,p.mapTransform)),c.alphaMap&&(p.alphaMap.value=c.alphaMap,n(c.alphaMap,p.alphaMapTransform)),c.bumpMap&&(p.bumpMap.value=c.bumpMap,n(c.bumpMap,p.bumpMapTransform),p.bumpScale.value=c.bumpScale,c.side===an&&(p.bumpScale.value*=-1)),c.normalMap&&(p.normalMap.value=c.normalMap,n(c.normalMap,p.normalMapTransform),p.normalScale.value.copy(c.normalScale),c.side===an&&p.normalScale.value.negate()),c.displacementMap&&(p.displacementMap.value=c.displacementMap,n(c.displacementMap,p.displacementMapTransform),p.displacementScale.value=c.displacementScale,p.displacementBias.value=c.displacementBias),c.emissiveMap&&(p.emissiveMap.value=c.emissiveMap,n(c.emissiveMap,p.emissiveMapTransform)),c.specularMap&&(p.specularMap.value=c.specularMap,n(c.specularMap,p.specularMapTransform)),c.alphaTest>0&&(p.alphaTest.value=c.alphaTest);const _=e.get(c).envMap;if(_&&(p.envMap.value=_,p.flipEnvMap.value=_.isCubeTexture&&_.isRenderTargetTexture===!1?-1:1,p.reflectivity.value=c.reflectivity,p.ior.value=c.ior,p.refractionRatio.value=c.refractionRatio),c.lightMap){p.lightMap.value=c.lightMap;const g=t._useLegacyLights===!0?Math.PI:1;p.lightMapIntensity.value=c.lightMapIntensity*g,n(c.lightMap,p.lightMapTransform)}c.aoMap&&(p.aoMap.value=c.aoMap,p.aoMapIntensity.value=c.aoMapIntensity,n(c.aoMap,p.aoMapTransform))}function o(p,c){p.diffuse.value.copy(c.color),p.opacity.value=c.opacity,c.map&&(p.map.value=c.map,n(c.map,p.mapTransform))}function a(p,c){p.dashSize.value=c.dashSize,p.totalSize.value=c.dashSize+c.gapSize,p.scale.value=c.scale}function l(p,c,_,g){p.diffuse.value.copy(c.color),p.opacity.value=c.opacity,p.size.value=c.size*_,p.scale.value=g*.5,c.map&&(p.map.value=c.map,n(c.map,p.uvTransform)),c.alphaMap&&(p.alphaMap.value=c.alphaMap,n(c.alphaMap,p.alphaMapTransform)),c.alphaTest>0&&(p.alphaTest.value=c.alphaTest)}function u(p,c){p.diffuse.value.copy(c.color),p.opacity.value=c.opacity,p.rotation.value=c.rotation,c.map&&(p.map.value=c.map,n(c.map,p.mapTransform)),c.alphaMap&&(p.alphaMap.value=c.alphaMap,n(c.alphaMap,p.alphaMapTransform)),c.alphaTest>0&&(p.alphaTest.value=c.alphaTest)}function f(p,c){p.specular.value.copy(c.specular),p.shininess.value=Math.max(c.shininess,1e-4)}function h(p,c){c.gradientMap&&(p.gradientMap.value=c.gradientMap)}function d(p,c){p.metalness.value=c.metalness,c.metalnessMap&&(p.metalnessMap.value=c.metalnessMap,n(c.metalnessMap,p.metalnessMapTransform)),p.roughness.value=c.roughness,c.roughnessMap&&(p.roughnessMap.value=c.roughnessMap,n(c.roughnessMap,p.roughnessMapTransform)),e.get(c).envMap&&(p.envMapIntensity.value=c.envMapIntensity)}function m(p,c,_){p.ior.value=c.ior,c.sheen>0&&(p.sheenColor.value.copy(c.sheenColor).multiplyScalar(c.sheen),p.sheenRoughness.value=c.sheenRoughness,c.sheenColorMap&&(p.sheenColorMap.value=c.sheenColorMap,n(c.sheenColorMap,p.sheenColorMapTransform)),c.sheenRoughnessMap&&(p.sheenRoughnessMap.value=c.sheenRoughnessMap,n(c.sheenRoughnessMap,p.sheenRoughnessMapTransform))),c.clearcoat>0&&(p.clearcoat.value=c.clearcoat,p.clearcoatRoughness.value=c.clearcoatRoughness,c.clearcoatMap&&(p.clearcoatMap.value=c.clearcoatMap,n(c.clearcoatMap,p.clearcoatMapTransform)),c.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=c.clearcoatRoughnessMap,n(c.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),c.clearcoatNormalMap&&(p.clearcoatNormalMap.value=c.clearcoatNormalMap,n(c.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(c.clearcoatNormalScale),c.side===an&&p.clearcoatNormalScale.value.negate())),c.iridescence>0&&(p.iridescence.value=c.iridescence,p.iridescenceIOR.value=c.iridescenceIOR,p.iridescenceThicknessMinimum.value=c.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=c.iridescenceThicknessRange[1],c.iridescenceMap&&(p.iridescenceMap.value=c.iridescenceMap,n(c.iridescenceMap,p.iridescenceMapTransform)),c.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=c.iridescenceThicknessMap,n(c.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),c.transmission>0&&(p.transmission.value=c.transmission,p.transmissionSamplerMap.value=_.texture,p.transmissionSamplerSize.value.set(_.width,_.height),c.transmissionMap&&(p.transmissionMap.value=c.transmissionMap,n(c.transmissionMap,p.transmissionMapTransform)),p.thickness.value=c.thickness,c.thicknessMap&&(p.thicknessMap.value=c.thicknessMap,n(c.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=c.attenuationDistance,p.attenuationColor.value.copy(c.attenuationColor)),c.anisotropy>0&&(p.anisotropyVector.value.set(c.anisotropy*Math.cos(c.anisotropyRotation),c.anisotropy*Math.sin(c.anisotropyRotation)),c.anisotropyMap&&(p.anisotropyMap.value=c.anisotropyMap,n(c.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=c.specularIntensity,p.specularColor.value.copy(c.specularColor),c.specularColorMap&&(p.specularColorMap.value=c.specularColorMap,n(c.specularColorMap,p.specularColorMapTransform)),c.specularIntensityMap&&(p.specularIntensityMap.value=c.specularIntensityMap,n(c.specularIntensityMap,p.specularIntensityMapTransform))}function x(p,c){c.matcap&&(p.matcap.value=c.matcap)}function v(p,c){const _=e.get(c).light;p.referencePosition.value.setFromMatrixPosition(_.matrixWorld),p.nearDistance.value=_.shadow.camera.near,p.farDistance.value=_.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:r}}function J1(t,e,n,i){let r={},s={},o=[];const a=n.isWebGL2?t.getParameter(t.MAX_UNIFORM_BUFFER_BINDINGS):0;function l(_,g){const y=g.program;i.uniformBlockBinding(_,y)}function u(_,g){let y=r[_.id];y===void 0&&(x(_),y=f(_),r[_.id]=y,_.addEventListener("dispose",p));const M=g.program;i.updateUBOMapping(_,M);const A=e.render.frame;s[_.id]!==A&&(d(_),s[_.id]=A)}function f(_){const g=h();_.__bindingPointIndex=g;const y=t.createBuffer(),M=_.__size,A=_.usage;return t.bindBuffer(t.UNIFORM_BUFFER,y),t.bufferData(t.UNIFORM_BUFFER,M,A),t.bindBuffer(t.UNIFORM_BUFFER,null),t.bindBufferBase(t.UNIFORM_BUFFER,g,y),y}function h(){for(let _=0;_<a;_++)if(o.indexOf(_)===-1)return o.push(_),_;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(_){const g=r[_.id],y=_.uniforms,M=_.__cache;t.bindBuffer(t.UNIFORM_BUFFER,g);for(let A=0,w=y.length;A<w;A++){const b=y[A];if(m(b,A,M)===!0){const S=b.__offset,R=Array.isArray(b.value)?b.value:[b.value];let H=0;for(let I=0;I<R.length;I++){const G=R[I],L=v(G);typeof G=="number"?(b.__data[0]=G,t.bufferSubData(t.UNIFORM_BUFFER,S+H,b.__data)):G.isMatrix3?(b.__data[0]=G.elements[0],b.__data[1]=G.elements[1],b.__data[2]=G.elements[2],b.__data[3]=G.elements[0],b.__data[4]=G.elements[3],b.__data[5]=G.elements[4],b.__data[6]=G.elements[5],b.__data[7]=G.elements[0],b.__data[8]=G.elements[6],b.__data[9]=G.elements[7],b.__data[10]=G.elements[8],b.__data[11]=G.elements[0]):(G.toArray(b.__data,H),H+=L.storage/Float32Array.BYTES_PER_ELEMENT)}t.bufferSubData(t.UNIFORM_BUFFER,S,b.__data)}}t.bindBuffer(t.UNIFORM_BUFFER,null)}function m(_,g,y){const M=_.value;if(y[g]===void 0){if(typeof M=="number")y[g]=M;else{const A=Array.isArray(M)?M:[M],w=[];for(let b=0;b<A.length;b++)w.push(A[b].clone());y[g]=w}return!0}else if(typeof M=="number"){if(y[g]!==M)return y[g]=M,!0}else{const A=Array.isArray(y[g])?y[g]:[y[g]],w=Array.isArray(M)?M:[M];for(let b=0;b<A.length;b++){const S=A[b];if(S.equals(w[b])===!1)return S.copy(w[b]),!0}}return!1}function x(_){const g=_.uniforms;let y=0;const M=16;let A=0;for(let w=0,b=g.length;w<b;w++){const S=g[w],R={boundary:0,storage:0},H=Array.isArray(S.value)?S.value:[S.value];for(let I=0,G=H.length;I<G;I++){const L=H[I],D=v(L);R.boundary+=D.boundary,R.storage+=D.storage}if(S.__data=new Float32Array(R.storage/Float32Array.BYTES_PER_ELEMENT),S.__offset=y,w>0){A=y%M;const I=M-A;A!==0&&I-R.boundary<0&&(y+=M-A,S.__offset=y)}y+=R.storage}return A=y%M,A>0&&(y+=M-A),_.__size=y,_.__cache={},this}function v(_){const g={boundary:0,storage:0};return typeof _=="number"?(g.boundary=4,g.storage=4):_.isVector2?(g.boundary=8,g.storage=8):_.isVector3||_.isColor?(g.boundary=16,g.storage=12):_.isVector4?(g.boundary=16,g.storage=16):_.isMatrix3?(g.boundary=48,g.storage=48):_.isMatrix4?(g.boundary=64,g.storage=64):_.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",_),g}function p(_){const g=_.target;g.removeEventListener("dispose",p);const y=o.indexOf(g.__bindingPointIndex);o.splice(y,1),t.deleteBuffer(r[g.id]),delete r[g.id],delete s[g.id]}function c(){for(const _ in r)t.deleteBuffer(r[_]);o=[],r={},s={}}return{bind:l,update:u,dispose:c}}class lv{constructor(e={}){const{canvas:n=Ky(),context:i=null,depth:r=!0,stencil:s=!0,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:u=!1,powerPreference:f="default",failIfMajorPerformanceCaveat:h=!1}=e;this.isWebGLRenderer=!0;let d;i!==null?d=i.getContextAttributes().alpha:d=o;const m=new Uint32Array(4),x=new Int32Array(4);let v=null,p=null;const c=[],_=[];this.domElement=n,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Nt,this._useLegacyLights=!1,this.toneMapping=Wi,this.toneMappingExposure=1;const g=this;let y=!1,M=0,A=0,w=null,b=-1,S=null;const R=new Lt,H=new Lt;let I=null;const G=new Ve(0);let L=0,D=n.width,z=n.height,W=1,F=null,B=null;const k=new Lt(0,0,D,z),Q=new Lt(0,0,D,z);let ee=!1;const $=new dd;let Z=!1,de=!1,ve=null;const ye=new mt,Ie=new Re,De=new N,Pe={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function Oe(){return w===null?W:1}let V=i;function At(T,O){for(let Y=0;Y<T.length;Y++){const q=T[Y],j=n.getContext(q,O);if(j!==null)return j}return null}try{const T={alpha:!0,depth:r,stencil:s,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:u,powerPreference:f,failIfMajorPerformanceCaveat:h};if("setAttribute"in n&&n.setAttribute("data-engine",`three.js r${ld}`),n.addEventListener("webglcontextlost",We,!1),n.addEventListener("webglcontextrestored",U,!1),n.addEventListener("webglcontextcreationerror",ce,!1),V===null){const O=["webgl2","webgl","experimental-webgl"];if(g.isWebGL1Renderer===!0&&O.shift(),V=At(O,T),V===null)throw At(O)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&V instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),V.getShaderPrecisionFormat===void 0&&(V.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(T){throw console.error("THREE.WebGLRenderer: "+T.message),T}let Te,Be,Le,nt,ze,Ue,$e,vt,xt,C,E,X,re,ne,se,Se,le,he,P,ae,J,Ce,Me,Ae;function xe(){Te=new cT(V),Be=new rT(V,Te,e),Te.init(Be),Ce=new q1(V,Te,Be),Le=new j1(V,Te,Be),nt=new hT(V),ze=new D1,Ue=new Y1(V,Te,Le,ze,Be,Ce,nt),$e=new oT(g),vt=new uT(g),xt=new SS(V,Be),Me=new nT(V,Te,xt,Be),C=new fT(V,xt,nt,Me),E=new _T(V,C,xt,nt),P=new gT(V,Be,Ue),Se=new sT(ze),X=new L1(g,$e,vt,Te,Be,Me,Se),re=new Q1(g,ze),ne=new N1,se=new B1(Te,Be),he=new tT(g,$e,vt,Le,E,d,l),le=new X1(g,E,Be),Ae=new J1(V,nt,Be,Le),ae=new iT(V,Te,nt,Be),J=new dT(V,Te,nt,Be),nt.programs=X.programs,g.capabilities=Be,g.extensions=Te,g.properties=ze,g.renderLists=ne,g.shadowMap=le,g.state=Le,g.info=nt}xe();const _e=new Z1(g,V);this.xr=_e,this.getContext=function(){return V},this.getContextAttributes=function(){return V.getContextAttributes()},this.forceContextLoss=function(){const T=Te.get("WEBGL_lose_context");T&&T.loseContext()},this.forceContextRestore=function(){const T=Te.get("WEBGL_lose_context");T&&T.restoreContext()},this.getPixelRatio=function(){return W},this.setPixelRatio=function(T){T!==void 0&&(W=T,this.setSize(D,z,!1))},this.getSize=function(T){return T.set(D,z)},this.setSize=function(T,O,Y=!0){if(_e.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}D=T,z=O,n.width=Math.floor(T*W),n.height=Math.floor(O*W),Y===!0&&(n.style.width=T+"px",n.style.height=O+"px"),this.setViewport(0,0,T,O)},this.getDrawingBufferSize=function(T){return T.set(D*W,z*W).floor()},this.setDrawingBufferSize=function(T,O,Y){D=T,z=O,W=Y,n.width=Math.floor(T*Y),n.height=Math.floor(O*Y),this.setViewport(0,0,T,O)},this.getCurrentViewport=function(T){return T.copy(R)},this.getViewport=function(T){return T.copy(k)},this.setViewport=function(T,O,Y,q){T.isVector4?k.set(T.x,T.y,T.z,T.w):k.set(T,O,Y,q),Le.viewport(R.copy(k).multiplyScalar(W).floor())},this.getScissor=function(T){return T.copy(Q)},this.setScissor=function(T,O,Y,q){T.isVector4?Q.set(T.x,T.y,T.z,T.w):Q.set(T,O,Y,q),Le.scissor(H.copy(Q).multiplyScalar(W).floor())},this.getScissorTest=function(){return ee},this.setScissorTest=function(T){Le.setScissorTest(ee=T)},this.setOpaqueSort=function(T){F=T},this.setTransparentSort=function(T){B=T},this.getClearColor=function(T){return T.copy(he.getClearColor())},this.setClearColor=function(){he.setClearColor.apply(he,arguments)},this.getClearAlpha=function(){return he.getClearAlpha()},this.setClearAlpha=function(){he.setClearAlpha.apply(he,arguments)},this.clear=function(T=!0,O=!0,Y=!0){let q=0;if(T){let j=!1;if(w!==null){const me=w.texture.format;j=me===O_||me===F_||me===I_}if(j){const me=w.texture.type,Ee=me===Xi||me===Ui||me===ud||me===gr||me===U_||me===N_,be=he.getClearColor(),Ne=he.getClearAlpha(),Ge=be.r,Fe=be.g,ke=be.b;Ee?(m[0]=Ge,m[1]=Fe,m[2]=ke,m[3]=Ne,V.clearBufferuiv(V.COLOR,0,m)):(x[0]=Ge,x[1]=Fe,x[2]=ke,x[3]=Ne,V.clearBufferiv(V.COLOR,0,x))}else q|=V.COLOR_BUFFER_BIT}O&&(q|=V.DEPTH_BUFFER_BIT),Y&&(q|=V.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),V.clear(q)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){n.removeEventListener("webglcontextlost",We,!1),n.removeEventListener("webglcontextrestored",U,!1),n.removeEventListener("webglcontextcreationerror",ce,!1),ne.dispose(),se.dispose(),ze.dispose(),$e.dispose(),vt.dispose(),E.dispose(),Me.dispose(),Ae.dispose(),X.dispose(),_e.dispose(),_e.removeEventListener("sessionstart",Xt),_e.removeEventListener("sessionend",et),ve&&(ve.dispose(),ve=null),jt.stop()};function We(T){T.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),y=!0}function U(){console.log("THREE.WebGLRenderer: Context Restored."),y=!1;const T=nt.autoReset,O=le.enabled,Y=le.autoUpdate,q=le.needsUpdate,j=le.type;xe(),nt.autoReset=T,le.enabled=O,le.autoUpdate=Y,le.needsUpdate=q,le.type=j}function ce(T){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",T.statusMessage)}function te(T){const O=T.target;O.removeEventListener("dispose",te),K(O)}function K(T){oe(T),ze.remove(T)}function oe(T){const O=ze.get(T).programs;O!==void 0&&(O.forEach(function(Y){X.releaseProgram(Y)}),T.isShaderMaterial&&X.releaseShaderCache(T))}this.renderBufferDirect=function(T,O,Y,q,j,me){O===null&&(O=Pe);const Ee=j.isMesh&&j.matrixWorld.determinant()<0,be=mv(T,O,Y,q,j);Le.setMaterial(q,Ee);let Ne=Y.index,Ge=1;if(q.wireframe===!0){if(Ne=C.getWireframeAttribute(Y),Ne===void 0)return;Ge=2}const Fe=Y.drawRange,ke=Y.attributes.position;let ht=Fe.start*Ge,un=(Fe.start+Fe.count)*Ge;me!==null&&(ht=Math.max(ht,me.start*Ge),un=Math.min(un,(me.start+me.count)*Ge)),Ne!==null?(ht=Math.max(ht,0),un=Math.min(un,Ne.count)):ke!=null&&(ht=Math.max(ht,0),un=Math.min(un,ke.count));const Ct=un-ht;if(Ct<0||Ct===1/0)return;Me.setup(j,q,be,Y,Ne);let Zn,at=ae;if(Ne!==null&&(Zn=xt.get(Ne),at=J,at.setIndex(Zn)),j.isMesh)q.wireframe===!0?(Le.setLineWidth(q.wireframeLinewidth*Oe()),at.setMode(V.LINES)):at.setMode(V.TRIANGLES);else if(j.isLine){let je=q.linewidth;je===void 0&&(je=1),Le.setLineWidth(je*Oe()),j.isLineSegments?at.setMode(V.LINES):j.isLineLoop?at.setMode(V.LINE_LOOP):at.setMode(V.LINE_STRIP)}else j.isPoints?at.setMode(V.POINTS):j.isSprite&&at.setMode(V.TRIANGLES);if(j.isBatchedMesh)at.renderMultiDraw(j._multiDrawStarts,j._multiDrawCounts,j._multiDrawCount);else if(j.isInstancedMesh)at.renderInstances(ht,Ct,j.count);else if(Y.isInstancedBufferGeometry){const je=Y._maxInstanceCount!==void 0?Y._maxInstanceCount:1/0,Kl=Math.min(Y.instanceCount,je);at.renderInstances(ht,Ct,Kl)}else at.render(ht,Ct)};function we(T,O,Y){T.transparent===!0&&T.side===oi&&T.forceSinglePass===!1?(T.side=an,T.needsUpdate=!0,Yo(T,O,Y),T.side=Ki,T.needsUpdate=!0,Yo(T,O,Y),T.side=oi):Yo(T,O,Y)}this.compile=function(T,O,Y=null){Y===null&&(Y=T),p=se.get(Y),p.init(),_.push(p),Y.traverseVisible(function(j){j.isLight&&j.layers.test(O.layers)&&(p.pushLight(j),j.castShadow&&p.pushShadow(j))}),T!==Y&&T.traverseVisible(function(j){j.isLight&&j.layers.test(O.layers)&&(p.pushLight(j),j.castShadow&&p.pushShadow(j))}),p.setupLights(g._useLegacyLights);const q=new Set;return T.traverse(function(j){const me=j.material;if(me)if(Array.isArray(me))for(let Ee=0;Ee<me.length;Ee++){const be=me[Ee];we(be,Y,j),q.add(be)}else we(me,Y,j),q.add(me)}),_.pop(),p=null,q},this.compileAsync=function(T,O,Y=null){const q=this.compile(T,O,Y);return new Promise(j=>{function me(){if(q.forEach(function(Ee){ze.get(Ee).currentProgram.isReady()&&q.delete(Ee)}),q.size===0){j(T);return}setTimeout(me,10)}Te.get("KHR_parallel_shader_compile")!==null?me():setTimeout(me,10)})};let Xe=null;function Rt(T){Xe&&Xe(T)}function Xt(){jt.stop()}function et(){jt.start()}const jt=new ev;jt.setAnimationLoop(Rt),typeof self<"u"&&jt.setContext(self),this.setAnimationLoop=function(T){Xe=T,_e.setAnimationLoop(T),T===null?jt.stop():jt.start()},_e.addEventListener("sessionstart",Xt),_e.addEventListener("sessionend",et),this.render=function(T,O){if(O!==void 0&&O.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(y===!0)return;T.matrixWorldAutoUpdate===!0&&T.updateMatrixWorld(),O.parent===null&&O.matrixWorldAutoUpdate===!0&&O.updateMatrixWorld(),_e.enabled===!0&&_e.isPresenting===!0&&(_e.cameraAutoUpdate===!0&&_e.updateCamera(O),O=_e.getCamera()),T.isScene===!0&&T.onBeforeRender(g,T,O,w),p=se.get(T,_.length),p.init(),_.push(p),ye.multiplyMatrices(O.projectionMatrix,O.matrixWorldInverse),$.setFromProjectionMatrix(ye),de=this.localClippingEnabled,Z=Se.init(this.clippingPlanes,de),v=ne.get(T,c.length),v.init(),c.push(v),Vn(T,O,0,g.sortObjects),v.finish(),g.sortObjects===!0&&v.sort(F,B),this.info.render.frame++,Z===!0&&Se.beginShadows();const Y=p.state.shadowsArray;if(le.render(Y,T,O),Z===!0&&Se.endShadows(),this.info.autoReset===!0&&this.info.reset(),he.render(v,T),p.setupLights(g._useLegacyLights),O.isArrayCamera){const q=O.cameras;for(let j=0,me=q.length;j<me;j++){const Ee=q[j];xd(v,T,Ee,Ee.viewport)}}else xd(v,T,O);w!==null&&(Ue.updateMultisampleRenderTarget(w),Ue.updateRenderTargetMipmap(w)),T.isScene===!0&&T.onAfterRender(g,T,O),Me.resetDefaultState(),b=-1,S=null,_.pop(),_.length>0?p=_[_.length-1]:p=null,c.pop(),c.length>0?v=c[c.length-1]:v=null};function Vn(T,O,Y,q){if(T.visible===!1)return;if(T.layers.test(O.layers)){if(T.isGroup)Y=T.renderOrder;else if(T.isLOD)T.autoUpdate===!0&&T.update(O);else if(T.isLight)p.pushLight(T),T.castShadow&&p.pushShadow(T);else if(T.isSprite){if(!T.frustumCulled||$.intersectsSprite(T)){q&&De.setFromMatrixPosition(T.matrixWorld).applyMatrix4(ye);const Ee=E.update(T),be=T.material;be.visible&&v.push(T,Ee,be,Y,De.z,null)}}else if((T.isMesh||T.isLine||T.isPoints)&&(!T.frustumCulled||$.intersectsObject(T))){const Ee=E.update(T),be=T.material;if(q&&(T.boundingSphere!==void 0?(T.boundingSphere===null&&T.computeBoundingSphere(),De.copy(T.boundingSphere.center)):(Ee.boundingSphere===null&&Ee.computeBoundingSphere(),De.copy(Ee.boundingSphere.center)),De.applyMatrix4(T.matrixWorld).applyMatrix4(ye)),Array.isArray(be)){const Ne=Ee.groups;for(let Ge=0,Fe=Ne.length;Ge<Fe;Ge++){const ke=Ne[Ge],ht=be[ke.materialIndex];ht&&ht.visible&&v.push(T,Ee,ht,Y,De.z,ke)}}else be.visible&&v.push(T,Ee,be,Y,De.z,null)}}const me=T.children;for(let Ee=0,be=me.length;Ee<be;Ee++)Vn(me[Ee],O,Y,q)}function xd(T,O,Y,q){const j=T.opaque,me=T.transmissive,Ee=T.transparent;p.setupLightsView(Y),Z===!0&&Se.setGlobalState(g.clippingPlanes,Y),me.length>0&&pv(j,me,O,Y),q&&Le.viewport(R.copy(q)),j.length>0&&jo(j,O,Y),me.length>0&&jo(me,O,Y),Ee.length>0&&jo(Ee,O,Y),Le.buffers.depth.setTest(!0),Le.buffers.depth.setMask(!0),Le.buffers.color.setMask(!0),Le.setPolygonOffset(!1)}function pv(T,O,Y,q){if((Y.isScene===!0?Y.overrideMaterial:null)!==null)return;const me=Be.isWebGL2;ve===null&&(ve=new Er(1,1,{generateMipmaps:!0,type:Te.has("EXT_color_buffer_half_float")?zo:Xi,minFilter:Oo,samples:me?4:0})),g.getDrawingBufferSize(Ie),me?ve.setSize(Ie.x,Ie.y):ve.setSize(ff(Ie.x),ff(Ie.y));const Ee=g.getRenderTarget();g.setRenderTarget(ve),g.getClearColor(G),L=g.getClearAlpha(),L<1&&g.setClearColor(16777215,.5),g.clear();const be=g.toneMapping;g.toneMapping=Wi,jo(T,Y,q),Ue.updateMultisampleRenderTarget(ve),Ue.updateRenderTargetMipmap(ve);let Ne=!1;for(let Ge=0,Fe=O.length;Ge<Fe;Ge++){const ke=O[Ge],ht=ke.object,un=ke.geometry,Ct=ke.material,Zn=ke.group;if(Ct.side===oi&&ht.layers.test(q.layers)){const at=Ct.side;Ct.side=an,Ct.needsUpdate=!0,yd(ht,Y,q,un,Ct,Zn),Ct.side=at,Ct.needsUpdate=!0,Ne=!0}}Ne===!0&&(Ue.updateMultisampleRenderTarget(ve),Ue.updateRenderTargetMipmap(ve)),g.setRenderTarget(Ee),g.setClearColor(G,L),g.toneMapping=be}function jo(T,O,Y){const q=O.isScene===!0?O.overrideMaterial:null;for(let j=0,me=T.length;j<me;j++){const Ee=T[j],be=Ee.object,Ne=Ee.geometry,Ge=q===null?Ee.material:q,Fe=Ee.group;be.layers.test(Y.layers)&&yd(be,O,Y,Ne,Ge,Fe)}}function yd(T,O,Y,q,j,me){T.onBeforeRender(g,O,Y,q,j,me),T.modelViewMatrix.multiplyMatrices(Y.matrixWorldInverse,T.matrixWorld),T.normalMatrix.getNormalMatrix(T.modelViewMatrix),j.onBeforeRender(g,O,Y,q,T,me),j.transparent===!0&&j.side===oi&&j.forceSinglePass===!1?(j.side=an,j.needsUpdate=!0,g.renderBufferDirect(Y,O,q,j,T,me),j.side=Ki,j.needsUpdate=!0,g.renderBufferDirect(Y,O,q,j,T,me),j.side=oi):g.renderBufferDirect(Y,O,q,j,T,me),T.onAfterRender(g,O,Y,q,j,me)}function Yo(T,O,Y){O.isScene!==!0&&(O=Pe);const q=ze.get(T),j=p.state.lights,me=p.state.shadowsArray,Ee=j.state.version,be=X.getParameters(T,j.state,me,O,Y),Ne=X.getProgramCacheKey(be);let Ge=q.programs;q.environment=T.isMeshStandardMaterial?O.environment:null,q.fog=O.fog,q.envMap=(T.isMeshStandardMaterial?vt:$e).get(T.envMap||q.environment),Ge===void 0&&(T.addEventListener("dispose",te),Ge=new Map,q.programs=Ge);let Fe=Ge.get(Ne);if(Fe!==void 0){if(q.currentProgram===Fe&&q.lightsStateVersion===Ee)return Md(T,be),Fe}else be.uniforms=X.getUniforms(T),T.onBuild(Y,be,g),T.onBeforeCompile(be,g),Fe=X.acquireProgram(be,Ne),Ge.set(Ne,Fe),q.uniforms=be.uniforms;const ke=q.uniforms;return(!T.isShaderMaterial&&!T.isRawShaderMaterial||T.clipping===!0)&&(ke.clippingPlanes=Se.uniform),Md(T,be),q.needsLights=_v(T),q.lightsStateVersion=Ee,q.needsLights&&(ke.ambientLightColor.value=j.state.ambient,ke.lightProbe.value=j.state.probe,ke.directionalLights.value=j.state.directional,ke.directionalLightShadows.value=j.state.directionalShadow,ke.spotLights.value=j.state.spot,ke.spotLightShadows.value=j.state.spotShadow,ke.rectAreaLights.value=j.state.rectArea,ke.ltc_1.value=j.state.rectAreaLTC1,ke.ltc_2.value=j.state.rectAreaLTC2,ke.pointLights.value=j.state.point,ke.pointLightShadows.value=j.state.pointShadow,ke.hemisphereLights.value=j.state.hemi,ke.directionalShadowMap.value=j.state.directionalShadowMap,ke.directionalShadowMatrix.value=j.state.directionalShadowMatrix,ke.spotShadowMap.value=j.state.spotShadowMap,ke.spotLightMatrix.value=j.state.spotLightMatrix,ke.spotLightMap.value=j.state.spotLightMap,ke.pointShadowMap.value=j.state.pointShadowMap,ke.pointShadowMatrix.value=j.state.pointShadowMatrix),q.currentProgram=Fe,q.uniformsList=null,Fe}function Sd(T){if(T.uniformsList===null){const O=T.currentProgram.getUniforms();T.uniformsList=Za.seqWithValue(O.seq,T.uniforms)}return T.uniformsList}function Md(T,O){const Y=ze.get(T);Y.outputColorSpace=O.outputColorSpace,Y.batching=O.batching,Y.instancing=O.instancing,Y.instancingColor=O.instancingColor,Y.skinning=O.skinning,Y.morphTargets=O.morphTargets,Y.morphNormals=O.morphNormals,Y.morphColors=O.morphColors,Y.morphTargetsCount=O.morphTargetsCount,Y.numClippingPlanes=O.numClippingPlanes,Y.numIntersection=O.numClipIntersection,Y.vertexAlphas=O.vertexAlphas,Y.vertexTangents=O.vertexTangents,Y.toneMapping=O.toneMapping}function mv(T,O,Y,q,j){O.isScene!==!0&&(O=Pe),Ue.resetTextureUnits();const me=O.fog,Ee=q.isMeshStandardMaterial?O.environment:null,be=w===null?g.outputColorSpace:w.isXRRenderTarget===!0?w.texture.colorSpace:gi,Ne=(q.isMeshStandardMaterial?vt:$e).get(q.envMap||Ee),Ge=q.vertexColors===!0&&!!Y.attributes.color&&Y.attributes.color.itemSize===4,Fe=!!Y.attributes.tangent&&(!!q.normalMap||q.anisotropy>0),ke=!!Y.morphAttributes.position,ht=!!Y.morphAttributes.normal,un=!!Y.morphAttributes.color;let Ct=Wi;q.toneMapped&&(w===null||w.isXRRenderTarget===!0)&&(Ct=g.toneMapping);const Zn=Y.morphAttributes.position||Y.morphAttributes.normal||Y.morphAttributes.color,at=Zn!==void 0?Zn.length:0,je=ze.get(q),Kl=p.state.lights;if(Z===!0&&(de===!0||T!==S)){const vn=T===S&&q.id===b;Se.setState(q,T,vn)}let ft=!1;q.version===je.__version?(je.needsLights&&je.lightsStateVersion!==Kl.state.version||je.outputColorSpace!==be||j.isBatchedMesh&&je.batching===!1||!j.isBatchedMesh&&je.batching===!0||j.isInstancedMesh&&je.instancing===!1||!j.isInstancedMesh&&je.instancing===!0||j.isSkinnedMesh&&je.skinning===!1||!j.isSkinnedMesh&&je.skinning===!0||j.isInstancedMesh&&je.instancingColor===!0&&j.instanceColor===null||j.isInstancedMesh&&je.instancingColor===!1&&j.instanceColor!==null||je.envMap!==Ne||q.fog===!0&&je.fog!==me||je.numClippingPlanes!==void 0&&(je.numClippingPlanes!==Se.numPlanes||je.numIntersection!==Se.numIntersection)||je.vertexAlphas!==Ge||je.vertexTangents!==Fe||je.morphTargets!==ke||je.morphNormals!==ht||je.morphColors!==un||je.toneMapping!==Ct||Be.isWebGL2===!0&&je.morphTargetsCount!==at)&&(ft=!0):(ft=!0,je.__version=q.version);let er=je.currentProgram;ft===!0&&(er=Yo(q,O,j));let Ed=!1,ks=!1,Zl=!1;const zt=er.getUniforms(),tr=je.uniforms;if(Le.useProgram(er.program)&&(Ed=!0,ks=!0,Zl=!0),q.id!==b&&(b=q.id,ks=!0),Ed||S!==T){zt.setValue(V,"projectionMatrix",T.projectionMatrix),zt.setValue(V,"viewMatrix",T.matrixWorldInverse);const vn=zt.map.cameraPosition;vn!==void 0&&vn.setValue(V,De.setFromMatrixPosition(T.matrixWorld)),Be.logarithmicDepthBuffer&&zt.setValue(V,"logDepthBufFC",2/(Math.log(T.far+1)/Math.LN2)),(q.isMeshPhongMaterial||q.isMeshToonMaterial||q.isMeshLambertMaterial||q.isMeshBasicMaterial||q.isMeshStandardMaterial||q.isShaderMaterial)&&zt.setValue(V,"isOrthographic",T.isOrthographicCamera===!0),S!==T&&(S=T,ks=!0,Zl=!0)}if(j.isSkinnedMesh){zt.setOptional(V,j,"bindMatrix"),zt.setOptional(V,j,"bindMatrixInverse");const vn=j.skeleton;vn&&(Be.floatVertexTextures?(vn.boneTexture===null&&vn.computeBoneTexture(),zt.setValue(V,"boneTexture",vn.boneTexture,Ue)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}j.isBatchedMesh&&(zt.setOptional(V,j,"batchingTexture"),zt.setValue(V,"batchingTexture",j._matricesTexture,Ue));const Ql=Y.morphAttributes;if((Ql.position!==void 0||Ql.normal!==void 0||Ql.color!==void 0&&Be.isWebGL2===!0)&&P.update(j,Y,er),(ks||je.receiveShadow!==j.receiveShadow)&&(je.receiveShadow=j.receiveShadow,zt.setValue(V,"receiveShadow",j.receiveShadow)),q.isMeshGouraudMaterial&&q.envMap!==null&&(tr.envMap.value=Ne,tr.flipEnvMap.value=Ne.isCubeTexture&&Ne.isRenderTargetTexture===!1?-1:1),ks&&(zt.setValue(V,"toneMappingExposure",g.toneMappingExposure),je.needsLights&&gv(tr,Zl),me&&q.fog===!0&&re.refreshFogUniforms(tr,me),re.refreshMaterialUniforms(tr,q,W,z,ve),Za.upload(V,Sd(je),tr,Ue)),q.isShaderMaterial&&q.uniformsNeedUpdate===!0&&(Za.upload(V,Sd(je),tr,Ue),q.uniformsNeedUpdate=!1),q.isSpriteMaterial&&zt.setValue(V,"center",j.center),zt.setValue(V,"modelViewMatrix",j.modelViewMatrix),zt.setValue(V,"normalMatrix",j.normalMatrix),zt.setValue(V,"modelMatrix",j.matrixWorld),q.isShaderMaterial||q.isRawShaderMaterial){const vn=q.uniformsGroups;for(let Jl=0,vv=vn.length;Jl<vv;Jl++)if(Be.isWebGL2){const Td=vn[Jl];Ae.update(Td,er),Ae.bind(Td,er)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return er}function gv(T,O){T.ambientLightColor.needsUpdate=O,T.lightProbe.needsUpdate=O,T.directionalLights.needsUpdate=O,T.directionalLightShadows.needsUpdate=O,T.pointLights.needsUpdate=O,T.pointLightShadows.needsUpdate=O,T.spotLights.needsUpdate=O,T.spotLightShadows.needsUpdate=O,T.rectAreaLights.needsUpdate=O,T.hemisphereLights.needsUpdate=O}function _v(T){return T.isMeshLambertMaterial||T.isMeshToonMaterial||T.isMeshPhongMaterial||T.isMeshStandardMaterial||T.isShadowMaterial||T.isShaderMaterial&&T.lights===!0}this.getActiveCubeFace=function(){return M},this.getActiveMipmapLevel=function(){return A},this.getRenderTarget=function(){return w},this.setRenderTargetTextures=function(T,O,Y){ze.get(T.texture).__webglTexture=O,ze.get(T.depthTexture).__webglTexture=Y;const q=ze.get(T);q.__hasExternalTextures=!0,q.__hasExternalTextures&&(q.__autoAllocateDepthBuffer=Y===void 0,q.__autoAllocateDepthBuffer||Te.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),q.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(T,O){const Y=ze.get(T);Y.__webglFramebuffer=O,Y.__useDefaultFramebuffer=O===void 0},this.setRenderTarget=function(T,O=0,Y=0){w=T,M=O,A=Y;let q=!0,j=null,me=!1,Ee=!1;if(T){const Ne=ze.get(T);Ne.__useDefaultFramebuffer!==void 0?(Le.bindFramebuffer(V.FRAMEBUFFER,null),q=!1):Ne.__webglFramebuffer===void 0?Ue.setupRenderTarget(T):Ne.__hasExternalTextures&&Ue.rebindTextures(T,ze.get(T.texture).__webglTexture,ze.get(T.depthTexture).__webglTexture);const Ge=T.texture;(Ge.isData3DTexture||Ge.isDataArrayTexture||Ge.isCompressedArrayTexture)&&(Ee=!0);const Fe=ze.get(T).__webglFramebuffer;T.isWebGLCubeRenderTarget?(Array.isArray(Fe[O])?j=Fe[O][Y]:j=Fe[O],me=!0):Be.isWebGL2&&T.samples>0&&Ue.useMultisampledRTT(T)===!1?j=ze.get(T).__webglMultisampledFramebuffer:Array.isArray(Fe)?j=Fe[Y]:j=Fe,R.copy(T.viewport),H.copy(T.scissor),I=T.scissorTest}else R.copy(k).multiplyScalar(W).floor(),H.copy(Q).multiplyScalar(W).floor(),I=ee;if(Le.bindFramebuffer(V.FRAMEBUFFER,j)&&Be.drawBuffers&&q&&Le.drawBuffers(T,j),Le.viewport(R),Le.scissor(H),Le.setScissorTest(I),me){const Ne=ze.get(T.texture);V.framebufferTexture2D(V.FRAMEBUFFER,V.COLOR_ATTACHMENT0,V.TEXTURE_CUBE_MAP_POSITIVE_X+O,Ne.__webglTexture,Y)}else if(Ee){const Ne=ze.get(T.texture),Ge=O||0;V.framebufferTextureLayer(V.FRAMEBUFFER,V.COLOR_ATTACHMENT0,Ne.__webglTexture,Y||0,Ge)}b=-1},this.readRenderTargetPixels=function(T,O,Y,q,j,me,Ee){if(!(T&&T.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let be=ze.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&Ee!==void 0&&(be=be[Ee]),be){Le.bindFramebuffer(V.FRAMEBUFFER,be);try{const Ne=T.texture,Ge=Ne.format,Fe=Ne.type;if(Ge!==zn&&Ce.convert(Ge)!==V.getParameter(V.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}const ke=Fe===zo&&(Te.has("EXT_color_buffer_half_float")||Be.isWebGL2&&Te.has("EXT_color_buffer_float"));if(Fe!==Xi&&Ce.convert(Fe)!==V.getParameter(V.IMPLEMENTATION_COLOR_READ_TYPE)&&!(Fe===Ni&&(Be.isWebGL2||Te.has("OES_texture_float")||Te.has("WEBGL_color_buffer_float")))&&!ke){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}O>=0&&O<=T.width-q&&Y>=0&&Y<=T.height-j&&V.readPixels(O,Y,q,j,Ce.convert(Ge),Ce.convert(Fe),me)}finally{const Ne=w!==null?ze.get(w).__webglFramebuffer:null;Le.bindFramebuffer(V.FRAMEBUFFER,Ne)}}},this.copyFramebufferToTexture=function(T,O,Y=0){const q=Math.pow(2,-Y),j=Math.floor(O.image.width*q),me=Math.floor(O.image.height*q);Ue.setTexture2D(O,0),V.copyTexSubImage2D(V.TEXTURE_2D,Y,0,0,T.x,T.y,j,me),Le.unbindTexture()},this.copyTextureToTexture=function(T,O,Y,q=0){const j=O.image.width,me=O.image.height,Ee=Ce.convert(Y.format),be=Ce.convert(Y.type);Ue.setTexture2D(Y,0),V.pixelStorei(V.UNPACK_FLIP_Y_WEBGL,Y.flipY),V.pixelStorei(V.UNPACK_PREMULTIPLY_ALPHA_WEBGL,Y.premultiplyAlpha),V.pixelStorei(V.UNPACK_ALIGNMENT,Y.unpackAlignment),O.isDataTexture?V.texSubImage2D(V.TEXTURE_2D,q,T.x,T.y,j,me,Ee,be,O.image.data):O.isCompressedTexture?V.compressedTexSubImage2D(V.TEXTURE_2D,q,T.x,T.y,O.mipmaps[0].width,O.mipmaps[0].height,Ee,O.mipmaps[0].data):V.texSubImage2D(V.TEXTURE_2D,q,T.x,T.y,Ee,be,O.image),q===0&&Y.generateMipmaps&&V.generateMipmap(V.TEXTURE_2D),Le.unbindTexture()},this.copyTextureToTexture3D=function(T,O,Y,q,j=0){if(g.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}const me=T.max.x-T.min.x+1,Ee=T.max.y-T.min.y+1,be=T.max.z-T.min.z+1,Ne=Ce.convert(q.format),Ge=Ce.convert(q.type);let Fe;if(q.isData3DTexture)Ue.setTexture3D(q,0),Fe=V.TEXTURE_3D;else if(q.isDataArrayTexture)Ue.setTexture2DArray(q,0),Fe=V.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}V.pixelStorei(V.UNPACK_FLIP_Y_WEBGL,q.flipY),V.pixelStorei(V.UNPACK_PREMULTIPLY_ALPHA_WEBGL,q.premultiplyAlpha),V.pixelStorei(V.UNPACK_ALIGNMENT,q.unpackAlignment);const ke=V.getParameter(V.UNPACK_ROW_LENGTH),ht=V.getParameter(V.UNPACK_IMAGE_HEIGHT),un=V.getParameter(V.UNPACK_SKIP_PIXELS),Ct=V.getParameter(V.UNPACK_SKIP_ROWS),Zn=V.getParameter(V.UNPACK_SKIP_IMAGES),at=Y.isCompressedTexture?Y.mipmaps[0]:Y.image;V.pixelStorei(V.UNPACK_ROW_LENGTH,at.width),V.pixelStorei(V.UNPACK_IMAGE_HEIGHT,at.height),V.pixelStorei(V.UNPACK_SKIP_PIXELS,T.min.x),V.pixelStorei(V.UNPACK_SKIP_ROWS,T.min.y),V.pixelStorei(V.UNPACK_SKIP_IMAGES,T.min.z),Y.isDataTexture||Y.isData3DTexture?V.texSubImage3D(Fe,j,O.x,O.y,O.z,me,Ee,be,Ne,Ge,at.data):Y.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),V.compressedTexSubImage3D(Fe,j,O.x,O.y,O.z,me,Ee,be,Ne,at.data)):V.texSubImage3D(Fe,j,O.x,O.y,O.z,me,Ee,be,Ne,Ge,at),V.pixelStorei(V.UNPACK_ROW_LENGTH,ke),V.pixelStorei(V.UNPACK_IMAGE_HEIGHT,ht),V.pixelStorei(V.UNPACK_SKIP_PIXELS,un),V.pixelStorei(V.UNPACK_SKIP_ROWS,Ct),V.pixelStorei(V.UNPACK_SKIP_IMAGES,Zn),j===0&&q.generateMipmaps&&V.generateMipmap(Fe),Le.unbindTexture()},this.initTexture=function(T){T.isCubeTexture?Ue.setTextureCube(T,0):T.isData3DTexture?Ue.setTexture3D(T,0):T.isDataArrayTexture||T.isCompressedArrayTexture?Ue.setTexture2DArray(T,0):Ue.setTexture2D(T,0),Le.unbindTexture()},this.resetState=function(){M=0,A=0,w=null,Le.reset(),Me.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return ci}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const n=this.getContext();n.drawingBufferColorSpace=e===cd?"display-p3":"srgb",n.unpackColorSpace=Qe.workingColorSpace===jl?"display-p3":"srgb"}get physicallyCorrectLights(){return console.warn("THREE.WebGLRenderer: The property .physicallyCorrectLights has been removed. Set renderer.useLegacyLights instead."),!this.useLegacyLights}set physicallyCorrectLights(e){console.warn("THREE.WebGLRenderer: The property .physicallyCorrectLights has been removed. Set renderer.useLegacyLights instead."),this.useLegacyLights=!e}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===Nt?ji:k_}set outputEncoding(e){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=e===ji?Nt:gi}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(e){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=e}}class ew extends lv{}ew.prototype.isWebGL1Renderer=!0;class md{constructor(e,n=1,i=1e3){this.isFog=!0,this.name="",this.color=new Ve(e),this.near=n,this.far=i}clone(){return new md(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class tw extends Mt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,n){return super.copy(e,n),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const n=super.toJSON(e);return this.fog!==null&&(n.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(n.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(n.object.backgroundIntensity=this.backgroundIntensity),n}}class nw{constructor(e,n){this.isInterleavedBuffer=!0,this.array=e,this.stride=n,this.count=e!==void 0?e.length/n:0,this.usage=lf,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.version=0,this.uuid=Yi()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}get updateRange(){return console.warn('THREE.InterleavedBuffer: "updateRange" is deprecated and removed in r169. Use "addUpdateRange()" instead.'),this._updateRange}setUsage(e){return this.usage=e,this}addUpdateRange(e,n){this.updateRanges.push({start:e,count:n})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,n,i){e*=this.stride,i*=n.stride;for(let r=0,s=this.stride;r<s;r++)this.array[e+r]=n.array[i+r];return this}set(e,n=0){return this.array.set(e,n),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Yi()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const n=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(n,this.stride);return i.setUsage(this.usage),i}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Yi()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Yt=new N;class Cl{constructor(e,n,i,r=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=n,this.offset=i,this.normalized=r}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let n=0,i=this.data.count;n<i;n++)Yt.fromBufferAttribute(this,n),Yt.applyMatrix4(e),this.setXYZ(n,Yt.x,Yt.y,Yt.z);return this}applyNormalMatrix(e){for(let n=0,i=this.count;n<i;n++)Yt.fromBufferAttribute(this,n),Yt.applyNormalMatrix(e),this.setXYZ(n,Yt.x,Yt.y,Yt.z);return this}transformDirection(e){for(let n=0,i=this.count;n<i;n++)Yt.fromBufferAttribute(this,n),Yt.transformDirection(e),this.setXYZ(n,Yt.x,Yt.y,Yt.z);return this}setX(e,n){return this.normalized&&(n=Je(n,this.array)),this.data.array[e*this.data.stride+this.offset]=n,this}setY(e,n){return this.normalized&&(n=Je(n,this.array)),this.data.array[e*this.data.stride+this.offset+1]=n,this}setZ(e,n){return this.normalized&&(n=Je(n,this.array)),this.data.array[e*this.data.stride+this.offset+2]=n,this}setW(e,n){return this.normalized&&(n=Je(n,this.array)),this.data.array[e*this.data.stride+this.offset+3]=n,this}getX(e){let n=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(n=ai(n,this.array)),n}getY(e){let n=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(n=ai(n,this.array)),n}getZ(e){let n=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(n=ai(n,this.array)),n}getW(e){let n=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(n=ai(n,this.array)),n}setXY(e,n,i){return e=e*this.data.stride+this.offset,this.normalized&&(n=Je(n,this.array),i=Je(i,this.array)),this.data.array[e+0]=n,this.data.array[e+1]=i,this}setXYZ(e,n,i,r){return e=e*this.data.stride+this.offset,this.normalized&&(n=Je(n,this.array),i=Je(i,this.array),r=Je(r,this.array)),this.data.array[e+0]=n,this.data.array[e+1]=i,this.data.array[e+2]=r,this}setXYZW(e,n,i,r,s){return e=e*this.data.stride+this.offset,this.normalized&&(n=Je(n,this.array),i=Je(i,this.array),r=Je(r,this.array),s=Je(s,this.array)),this.data.array[e+0]=n,this.data.array[e+1]=i,this.data.array[e+2]=r,this.data.array[e+3]=s,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const n=[];for(let i=0;i<this.count;i++){const r=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)n.push(this.data.array[r+s])}return new Hn(new this.array.constructor(n),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new Cl(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const n=[];for(let i=0;i<this.count;i++){const r=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)n.push(this.data.array[r+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:n,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class uv extends br{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new Ve(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}let $r;const Qs=new N,Kr=new N,Zr=new N,Qr=new Re,Js=new Re,cv=new mt,Ua=new N,eo=new N,Na=new N,Jp=new Re,nc=new Re,em=new Re;class ic extends Mt{constructor(e=new uv){if(super(),this.isSprite=!0,this.type="Sprite",$r===void 0){$r=new It;const n=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),i=new nw(n,5);$r.setIndex([0,1,2,0,2,3]),$r.setAttribute("position",new Cl(i,3,0,!1)),$r.setAttribute("uv",new Cl(i,2,3,!1))}this.geometry=$r,this.material=e,this.center=new Re(.5,.5)}raycast(e,n){e.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Kr.setFromMatrixScale(this.matrixWorld),cv.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),Zr.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Kr.multiplyScalar(-Zr.z);const i=this.material.rotation;let r,s;i!==0&&(s=Math.cos(i),r=Math.sin(i));const o=this.center;Ia(Ua.set(-.5,-.5,0),Zr,o,Kr,r,s),Ia(eo.set(.5,-.5,0),Zr,o,Kr,r,s),Ia(Na.set(.5,.5,0),Zr,o,Kr,r,s),Jp.set(0,0),nc.set(1,0),em.set(1,1);let a=e.ray.intersectTriangle(Ua,eo,Na,!1,Qs);if(a===null&&(Ia(eo.set(-.5,.5,0),Zr,o,Kr,r,s),nc.set(0,1),a=e.ray.intersectTriangle(Ua,Na,eo,!1,Qs),a===null))return;const l=e.ray.origin.distanceTo(Qs);l<e.near||l>e.far||n.push({distance:l,point:Qs.clone(),uv:En.getInterpolation(Qs,Ua,eo,Na,Jp,nc,em,new Re),face:null,object:this})}copy(e,n){return super.copy(e,n),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}}function Ia(t,e,n,i,r,s){Qr.subVectors(t,n).addScalar(.5).multiply(i),r!==void 0?(Js.x=s*Qr.x-r*Qr.y,Js.y=r*Qr.x+s*Qr.y):Js.copy(Qr),t.copy(e),t.x+=Js.x,t.y+=Js.y,t.applyMatrix4(cv)}class ko extends br{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Ve(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const tm=new N,nm=new N,im=new mt,rc=new fd,Fa=new Yl;class hf extends Mt{constructor(e=new It,n=new ko){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=n,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const n=e.attributes.position,i=[0];for(let r=1,s=n.count;r<s;r++)tm.fromBufferAttribute(n,r-1),nm.fromBufferAttribute(n,r),i[r]=i[r-1],i[r]+=tm.distanceTo(nm);e.setAttribute("lineDistance",new Et(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,n){const i=this.geometry,r=this.matrixWorld,s=e.params.Line.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Fa.copy(i.boundingSphere),Fa.applyMatrix4(r),Fa.radius+=s,e.ray.intersectsSphere(Fa)===!1)return;im.copy(r).invert(),rc.copy(e.ray).applyMatrix4(im);const a=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,u=new N,f=new N,h=new N,d=new N,m=this.isLineSegments?2:1,x=i.index,p=i.attributes.position;if(x!==null){const c=Math.max(0,o.start),_=Math.min(x.count,o.start+o.count);for(let g=c,y=_-1;g<y;g+=m){const M=x.getX(g),A=x.getX(g+1);if(u.fromBufferAttribute(p,M),f.fromBufferAttribute(p,A),rc.distanceSqToSegment(u,f,d,h)>l)continue;d.applyMatrix4(this.matrixWorld);const b=e.ray.origin.distanceTo(d);b<e.near||b>e.far||n.push({distance:b,point:h.clone().applyMatrix4(this.matrixWorld),index:g,face:null,faceIndex:null,object:this})}}else{const c=Math.max(0,o.start),_=Math.min(p.count,o.start+o.count);for(let g=c,y=_-1;g<y;g+=m){if(u.fromBufferAttribute(p,g),f.fromBufferAttribute(p,g+1),rc.distanceSqToSegment(u,f,d,h)>l)continue;d.applyMatrix4(this.matrixWorld);const A=e.ray.origin.distanceTo(d);A<e.near||A>e.far||n.push({distance:A,point:h.clone().applyMatrix4(this.matrixWorld),index:g,face:null,faceIndex:null,object:this})}}}updateMorphTargets(){const n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){const r=n[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}}const rm=new N,sm=new N;class fv extends hf{constructor(e,n){super(e,n),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const n=e.attributes.position,i=[];for(let r=0,s=n.count;r<s;r+=2)rm.fromBufferAttribute(n,r),sm.fromBufferAttribute(n,r+1),i[r]=r===0?0:i[r-1],i[r+1]=i[r]+rm.distanceTo(sm);e.setAttribute("lineDistance",new Et(i,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class iw extends ln{constructor(e,n,i,r,s,o,a,l,u){super(e,n,i,r,s,o,a,l,u),this.isCanvasTexture=!0,this.needsUpdate=!0}}class gd extends It{constructor(e=1,n=1,i=1,r=32,s=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:n,height:i,radialSegments:r,heightSegments:s,openEnded:o,thetaStart:a,thetaLength:l};const u=this;r=Math.floor(r),s=Math.floor(s);const f=[],h=[],d=[],m=[];let x=0;const v=[],p=i/2;let c=0;_(),o===!1&&(e>0&&g(!0),n>0&&g(!1)),this.setIndex(f),this.setAttribute("position",new Et(h,3)),this.setAttribute("normal",new Et(d,3)),this.setAttribute("uv",new Et(m,2));function _(){const y=new N,M=new N;let A=0;const w=(n-e)/i;for(let b=0;b<=s;b++){const S=[],R=b/s,H=R*(n-e)+e;for(let I=0;I<=r;I++){const G=I/r,L=G*l+a,D=Math.sin(L),z=Math.cos(L);M.x=H*D,M.y=-R*i+p,M.z=H*z,h.push(M.x,M.y,M.z),y.set(D,w,z).normalize(),d.push(y.x,y.y,y.z),m.push(G,1-R),S.push(x++)}v.push(S)}for(let b=0;b<r;b++)for(let S=0;S<s;S++){const R=v[S][b],H=v[S+1][b],I=v[S+1][b+1],G=v[S][b+1];f.push(R,H,G),f.push(H,I,G),A+=6}u.addGroup(c,A,0),c+=A}function g(y){const M=x,A=new Re,w=new N;let b=0;const S=y===!0?e:n,R=y===!0?1:-1;for(let I=1;I<=r;I++)h.push(0,p*R,0),d.push(0,R,0),m.push(.5,.5),x++;const H=x;for(let I=0;I<=r;I++){const L=I/r*l+a,D=Math.cos(L),z=Math.sin(L);w.x=S*z,w.y=p*R,w.z=S*D,h.push(w.x,w.y,w.z),d.push(0,R,0),A.x=D*.5+.5,A.y=z*.5*R+.5,m.push(A.x,A.y),x++}for(let I=0;I<r;I++){const G=M+I,L=H+I;y===!0?f.push(L,L+1,G):f.push(L+1,L,G),b+=3}u.addGroup(c,b,y===!0?1:2),c+=b}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new gd(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class _d extends It{constructor(e=1,n=32,i=16,r=0,s=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:n,heightSegments:i,phiStart:r,phiLength:s,thetaStart:o,thetaLength:a},n=Math.max(3,Math.floor(n)),i=Math.max(2,Math.floor(i));const l=Math.min(o+a,Math.PI);let u=0;const f=[],h=new N,d=new N,m=[],x=[],v=[],p=[];for(let c=0;c<=i;c++){const _=[],g=c/i;let y=0;c===0&&o===0?y=.5/n:c===i&&l===Math.PI&&(y=-.5/n);for(let M=0;M<=n;M++){const A=M/n;h.x=-e*Math.cos(r+A*s)*Math.sin(o+g*a),h.y=e*Math.cos(o+g*a),h.z=e*Math.sin(r+A*s)*Math.sin(o+g*a),x.push(h.x,h.y,h.z),d.copy(h).normalize(),v.push(d.x,d.y,d.z),p.push(A+y,1-g),_.push(u++)}f.push(_)}for(let c=0;c<i;c++)for(let _=0;_<n;_++){const g=f[c][_+1],y=f[c][_],M=f[c+1][_],A=f[c+1][_+1];(c!==0||o>0)&&m.push(g,y,A),(c!==i-1||l<Math.PI)&&m.push(y,M,A)}this.setIndex(m),this.setAttribute("position",new Et(x,3)),this.setAttribute("normal",new Et(v,3)),this.setAttribute("uv",new Et(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new _d(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class om extends br{constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new Ve(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ve(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=B_,this.normalScale=new Re(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class vd extends Mt{constructor(e,n=1){super(),this.isLight=!0,this.type="Light",this.color=new Ve(e),this.intensity=n}dispose(){}copy(e,n){return super.copy(e,n),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const n=super.toJSON(e);return n.object.color=this.color.getHex(),n.object.intensity=this.intensity,this.groundColor!==void 0&&(n.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(n.object.distance=this.distance),this.angle!==void 0&&(n.object.angle=this.angle),this.decay!==void 0&&(n.object.decay=this.decay),this.penumbra!==void 0&&(n.object.penumbra=this.penumbra),this.shadow!==void 0&&(n.object.shadow=this.shadow.toJSON()),n}}class rw extends vd{constructor(e,n,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Mt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Ve(n)}copy(e,n){return super.copy(e,n),this.groundColor.copy(e.groundColor),this}}const sc=new mt,am=new N,lm=new N;class sw{constructor(e){this.camera=e,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Re(512,512),this.map=null,this.mapPass=null,this.matrix=new mt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new dd,this._frameExtents=new Re(1,1),this._viewportCount=1,this._viewports=[new Lt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const n=this.camera,i=this.matrix;am.setFromMatrixPosition(e.matrixWorld),n.position.copy(am),lm.setFromMatrixPosition(e.target.matrixWorld),n.lookAt(lm),n.updateMatrixWorld(),sc.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(sc),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(sc)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class ow extends sw{constructor(){super(new tv(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class aw extends vd{constructor(e,n){super(e,n),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Mt.DEFAULT_UP),this.updateMatrix(),this.target=new Mt,this.shadow=new ow}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class lw extends vd{constructor(e,n){super(e,n),this.isAmbientLight=!0,this.type="AmbientLight"}}class um{constructor(e=1,n=0,i=0){return this.radius=e,this.phi=n,this.theta=i,this}set(e,n,i){return this.radius=e,this.phi=n,this.theta=i,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,n,i){return this.radius=Math.sqrt(e*e+n*n+i*i),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,i),this.phi=Math.acos(Zt(n/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}class uw extends fv{constructor(e=10,n=10,i=4473924,r=8947848){i=new Ve(i),r=new Ve(r);const s=n/2,o=e/n,a=e/2,l=[],u=[];for(let d=0,m=0,x=-a;d<=n;d++,x+=o){l.push(-a,0,x,a,0,x),l.push(x,0,-a,x,0,a);const v=d===s?i:r;v.toArray(u,m),m+=3,v.toArray(u,m),m+=3,v.toArray(u,m),m+=3,v.toArray(u,m),m+=3}const f=new It;f.setAttribute("position",new Et(l,3)),f.setAttribute("color",new Et(u,3));const h=new ko({vertexColors:!0,toneMapped:!1});super(f,h),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}class cw extends fv{constructor(e=1){const n=[0,0,0,e,0,0,0,0,0,0,e,0,0,0,0,0,0,e],i=[1,0,0,1,.6,0,0,1,0,.6,1,0,0,0,1,0,.6,1],r=new It;r.setAttribute("position",new Et(n,3)),r.setAttribute("color",new Et(i,3));const s=new ko({vertexColors:!0,toneMapped:!1});super(r,s),this.type="AxesHelper"}setColors(e,n,i){const r=new Ve,s=this.geometry.attributes.color.array;return r.set(e),r.toArray(s,0),r.toArray(s,3),r.set(n),r.toArray(s,6),r.toArray(s,9),r.set(i),r.toArray(s,12),r.toArray(s,15),this.geometry.attributes.color.needsUpdate=!0,this}dispose(){this.geometry.dispose(),this.material.dispose()}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:ld}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=ld);const cm={type:"change"},oc={type:"start"},fm={type:"end"},Oa=new fd,dm=new Ci,fw=Math.cos(70*$y.DEG2RAD);class dw extends Cr{constructor(e,n){super(),this.object=e,this.domElement=n,this.domElement.style.touchAction="none",this.enabled=!0,this.target=new N,this.cursor=new N,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Lr.ROTATE,MIDDLE:Lr.DOLLY,RIGHT:Lr.PAN},this.touches={ONE:Dr.ROTATE,TWO:Dr.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this.getPolarAngle=function(){return a.phi},this.getAzimuthalAngle=function(){return a.theta},this.getDistance=function(){return this.object.position.distanceTo(this.target)},this.listenToKeyEvents=function(P){P.addEventListener("keydown",E),this._domElementKeyEvents=P},this.stopListenToKeyEvents=function(){this._domElementKeyEvents.removeEventListener("keydown",E),this._domElementKeyEvents=null},this.saveState=function(){i.target0.copy(i.target),i.position0.copy(i.object.position),i.zoom0=i.object.zoom},this.reset=function(){i.target.copy(i.target0),i.object.position.copy(i.position0),i.object.zoom=i.zoom0,i.object.updateProjectionMatrix(),i.dispatchEvent(cm),i.update(),s=r.NONE},this.update=function(){const P=new N,ae=new Tr().setFromUnitVectors(e.up,new N(0,1,0)),J=ae.clone().invert(),Ce=new N,Me=new Tr,Ae=new N,xe=2*Math.PI;return function(We=null){const U=i.object.position;P.copy(U).sub(i.target),P.applyQuaternion(ae),a.setFromVector3(P),i.autoRotate&&s===r.NONE&&H(S(We)),i.enableDamping?(a.theta+=l.theta*i.dampingFactor,a.phi+=l.phi*i.dampingFactor):(a.theta+=l.theta,a.phi+=l.phi);let ce=i.minAzimuthAngle,te=i.maxAzimuthAngle;isFinite(ce)&&isFinite(te)&&(ce<-Math.PI?ce+=xe:ce>Math.PI&&(ce-=xe),te<-Math.PI?te+=xe:te>Math.PI&&(te-=xe),ce<=te?a.theta=Math.max(ce,Math.min(te,a.theta)):a.theta=a.theta>(ce+te)/2?Math.max(ce,a.theta):Math.min(te,a.theta)),a.phi=Math.max(i.minPolarAngle,Math.min(i.maxPolarAngle,a.phi)),a.makeSafe(),i.enableDamping===!0?i.target.addScaledVector(f,i.dampingFactor):i.target.add(f),i.target.sub(i.cursor),i.target.clampLength(i.minTargetRadius,i.maxTargetRadius),i.target.add(i.cursor),i.zoomToCursor&&A||i.object.isOrthographicCamera?a.radius=B(a.radius):a.radius=B(a.radius*u),P.setFromSpherical(a),P.applyQuaternion(J),U.copy(i.target).add(P),i.object.lookAt(i.target),i.enableDamping===!0?(l.theta*=1-i.dampingFactor,l.phi*=1-i.dampingFactor,f.multiplyScalar(1-i.dampingFactor)):(l.set(0,0,0),f.set(0,0,0));let K=!1;if(i.zoomToCursor&&A){let oe=null;if(i.object.isPerspectiveCamera){const we=P.length();oe=B(we*u);const Xe=we-oe;i.object.position.addScaledVector(y,Xe),i.object.updateMatrixWorld()}else if(i.object.isOrthographicCamera){const we=new N(M.x,M.y,0);we.unproject(i.object),i.object.zoom=Math.max(i.minZoom,Math.min(i.maxZoom,i.object.zoom/u)),i.object.updateProjectionMatrix(),K=!0;const Xe=new N(M.x,M.y,0);Xe.unproject(i.object),i.object.position.sub(Xe).add(we),i.object.updateMatrixWorld(),oe=P.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),i.zoomToCursor=!1;oe!==null&&(this.screenSpacePanning?i.target.set(0,0,-1).transformDirection(i.object.matrix).multiplyScalar(oe).add(i.object.position):(Oa.origin.copy(i.object.position),Oa.direction.set(0,0,-1).transformDirection(i.object.matrix),Math.abs(i.object.up.dot(Oa.direction))<fw?e.lookAt(i.target):(dm.setFromNormalAndCoplanarPoint(i.object.up,i.target),Oa.intersectPlane(dm,i.target))))}else i.object.isOrthographicCamera&&(i.object.zoom=Math.max(i.minZoom,Math.min(i.maxZoom,i.object.zoom/u)),i.object.updateProjectionMatrix(),K=!0);return u=1,A=!1,K||Ce.distanceToSquared(i.object.position)>o||8*(1-Me.dot(i.object.quaternion))>o||Ae.distanceToSquared(i.target)>0?(i.dispatchEvent(cm),Ce.copy(i.object.position),Me.copy(i.object.quaternion),Ae.copy(i.target),!0):!1}}(),this.dispose=function(){i.domElement.removeEventListener("contextmenu",ne),i.domElement.removeEventListener("pointerdown",ze),i.domElement.removeEventListener("pointercancel",$e),i.domElement.removeEventListener("wheel",C),i.domElement.removeEventListener("pointermove",Ue),i.domElement.removeEventListener("pointerup",$e),i._domElementKeyEvents!==null&&(i._domElementKeyEvents.removeEventListener("keydown",E),i._domElementKeyEvents=null)};const i=this,r={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6};let s=r.NONE;const o=1e-6,a=new um,l=new um;let u=1;const f=new N,h=new Re,d=new Re,m=new Re,x=new Re,v=new Re,p=new Re,c=new Re,_=new Re,g=new Re,y=new N,M=new Re;let A=!1;const w=[],b={};function S(P){return P!==null?2*Math.PI/60*i.autoRotateSpeed*P:2*Math.PI/60/60*i.autoRotateSpeed}function R(){return Math.pow(.95,i.zoomSpeed)}function H(P){l.theta-=P}function I(P){l.phi-=P}const G=function(){const P=new N;return function(J,Ce){P.setFromMatrixColumn(Ce,0),P.multiplyScalar(-J),f.add(P)}}(),L=function(){const P=new N;return function(J,Ce){i.screenSpacePanning===!0?P.setFromMatrixColumn(Ce,1):(P.setFromMatrixColumn(Ce,0),P.crossVectors(i.object.up,P)),P.multiplyScalar(J),f.add(P)}}(),D=function(){const P=new N;return function(J,Ce){const Me=i.domElement;if(i.object.isPerspectiveCamera){const Ae=i.object.position;P.copy(Ae).sub(i.target);let xe=P.length();xe*=Math.tan(i.object.fov/2*Math.PI/180),G(2*J*xe/Me.clientHeight,i.object.matrix),L(2*Ce*xe/Me.clientHeight,i.object.matrix)}else i.object.isOrthographicCamera?(G(J*(i.object.right-i.object.left)/i.object.zoom/Me.clientWidth,i.object.matrix),L(Ce*(i.object.top-i.object.bottom)/i.object.zoom/Me.clientHeight,i.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),i.enablePan=!1)}}();function z(P){i.object.isPerspectiveCamera||i.object.isOrthographicCamera?u/=P:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),i.enableZoom=!1)}function W(P){i.object.isPerspectiveCamera||i.object.isOrthographicCamera?u*=P:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),i.enableZoom=!1)}function F(P){if(!i.zoomToCursor)return;A=!0;const ae=i.domElement.getBoundingClientRect(),J=P.clientX-ae.left,Ce=P.clientY-ae.top,Me=ae.width,Ae=ae.height;M.x=J/Me*2-1,M.y=-(Ce/Ae)*2+1,y.set(M.x,M.y,1).unproject(i.object).sub(i.object.position).normalize()}function B(P){return Math.max(i.minDistance,Math.min(i.maxDistance,P))}function k(P){h.set(P.clientX,P.clientY)}function Q(P){F(P),c.set(P.clientX,P.clientY)}function ee(P){x.set(P.clientX,P.clientY)}function $(P){d.set(P.clientX,P.clientY),m.subVectors(d,h).multiplyScalar(i.rotateSpeed);const ae=i.domElement;H(2*Math.PI*m.x/ae.clientHeight),I(2*Math.PI*m.y/ae.clientHeight),h.copy(d),i.update()}function Z(P){_.set(P.clientX,P.clientY),g.subVectors(_,c),g.y>0?z(R()):g.y<0&&W(R()),c.copy(_),i.update()}function de(P){v.set(P.clientX,P.clientY),p.subVectors(v,x).multiplyScalar(i.panSpeed),D(p.x,p.y),x.copy(v),i.update()}function ve(P){F(P),P.deltaY<0?W(R()):P.deltaY>0&&z(R()),i.update()}function ye(P){let ae=!1;switch(P.code){case i.keys.UP:P.ctrlKey||P.metaKey||P.shiftKey?I(2*Math.PI*i.rotateSpeed/i.domElement.clientHeight):D(0,i.keyPanSpeed),ae=!0;break;case i.keys.BOTTOM:P.ctrlKey||P.metaKey||P.shiftKey?I(-2*Math.PI*i.rotateSpeed/i.domElement.clientHeight):D(0,-i.keyPanSpeed),ae=!0;break;case i.keys.LEFT:P.ctrlKey||P.metaKey||P.shiftKey?H(2*Math.PI*i.rotateSpeed/i.domElement.clientHeight):D(i.keyPanSpeed,0),ae=!0;break;case i.keys.RIGHT:P.ctrlKey||P.metaKey||P.shiftKey?H(-2*Math.PI*i.rotateSpeed/i.domElement.clientHeight):D(-i.keyPanSpeed,0),ae=!0;break}ae&&(P.preventDefault(),i.update())}function Ie(){if(w.length===1)h.set(w[0].pageX,w[0].pageY);else{const P=.5*(w[0].pageX+w[1].pageX),ae=.5*(w[0].pageY+w[1].pageY);h.set(P,ae)}}function De(){if(w.length===1)x.set(w[0].pageX,w[0].pageY);else{const P=.5*(w[0].pageX+w[1].pageX),ae=.5*(w[0].pageY+w[1].pageY);x.set(P,ae)}}function Pe(){const P=w[0].pageX-w[1].pageX,ae=w[0].pageY-w[1].pageY,J=Math.sqrt(P*P+ae*ae);c.set(0,J)}function Oe(){i.enableZoom&&Pe(),i.enablePan&&De()}function V(){i.enableZoom&&Pe(),i.enableRotate&&Ie()}function At(P){if(w.length==1)d.set(P.pageX,P.pageY);else{const J=he(P),Ce=.5*(P.pageX+J.x),Me=.5*(P.pageY+J.y);d.set(Ce,Me)}m.subVectors(d,h).multiplyScalar(i.rotateSpeed);const ae=i.domElement;H(2*Math.PI*m.x/ae.clientHeight),I(2*Math.PI*m.y/ae.clientHeight),h.copy(d)}function Te(P){if(w.length===1)v.set(P.pageX,P.pageY);else{const ae=he(P),J=.5*(P.pageX+ae.x),Ce=.5*(P.pageY+ae.y);v.set(J,Ce)}p.subVectors(v,x).multiplyScalar(i.panSpeed),D(p.x,p.y),x.copy(v)}function Be(P){const ae=he(P),J=P.pageX-ae.x,Ce=P.pageY-ae.y,Me=Math.sqrt(J*J+Ce*Ce);_.set(0,Me),g.set(0,Math.pow(_.y/c.y,i.zoomSpeed)),z(g.y),c.copy(_)}function Le(P){i.enableZoom&&Be(P),i.enablePan&&Te(P)}function nt(P){i.enableZoom&&Be(P),i.enableRotate&&At(P)}function ze(P){i.enabled!==!1&&(w.length===0&&(i.domElement.setPointerCapture(P.pointerId),i.domElement.addEventListener("pointermove",Ue),i.domElement.addEventListener("pointerup",$e)),se(P),P.pointerType==="touch"?X(P):vt(P))}function Ue(P){i.enabled!==!1&&(P.pointerType==="touch"?re(P):xt(P))}function $e(P){Se(P),w.length===0&&(i.domElement.releasePointerCapture(P.pointerId),i.domElement.removeEventListener("pointermove",Ue),i.domElement.removeEventListener("pointerup",$e)),i.dispatchEvent(fm),s=r.NONE}function vt(P){let ae;switch(P.button){case 0:ae=i.mouseButtons.LEFT;break;case 1:ae=i.mouseButtons.MIDDLE;break;case 2:ae=i.mouseButtons.RIGHT;break;default:ae=-1}switch(ae){case Lr.DOLLY:if(i.enableZoom===!1)return;Q(P),s=r.DOLLY;break;case Lr.ROTATE:if(P.ctrlKey||P.metaKey||P.shiftKey){if(i.enablePan===!1)return;ee(P),s=r.PAN}else{if(i.enableRotate===!1)return;k(P),s=r.ROTATE}break;case Lr.PAN:if(P.ctrlKey||P.metaKey||P.shiftKey){if(i.enableRotate===!1)return;k(P),s=r.ROTATE}else{if(i.enablePan===!1)return;ee(P),s=r.PAN}break;default:s=r.NONE}s!==r.NONE&&i.dispatchEvent(oc)}function xt(P){switch(s){case r.ROTATE:if(i.enableRotate===!1)return;$(P);break;case r.DOLLY:if(i.enableZoom===!1)return;Z(P);break;case r.PAN:if(i.enablePan===!1)return;de(P);break}}function C(P){i.enabled===!1||i.enableZoom===!1||s!==r.NONE||(P.preventDefault(),i.dispatchEvent(oc),ve(P),i.dispatchEvent(fm))}function E(P){i.enabled===!1||i.enablePan===!1||ye(P)}function X(P){switch(le(P),w.length){case 1:switch(i.touches.ONE){case Dr.ROTATE:if(i.enableRotate===!1)return;Ie(),s=r.TOUCH_ROTATE;break;case Dr.PAN:if(i.enablePan===!1)return;De(),s=r.TOUCH_PAN;break;default:s=r.NONE}break;case 2:switch(i.touches.TWO){case Dr.DOLLY_PAN:if(i.enableZoom===!1&&i.enablePan===!1)return;Oe(),s=r.TOUCH_DOLLY_PAN;break;case Dr.DOLLY_ROTATE:if(i.enableZoom===!1&&i.enableRotate===!1)return;V(),s=r.TOUCH_DOLLY_ROTATE;break;default:s=r.NONE}break;default:s=r.NONE}s!==r.NONE&&i.dispatchEvent(oc)}function re(P){switch(le(P),s){case r.TOUCH_ROTATE:if(i.enableRotate===!1)return;At(P),i.update();break;case r.TOUCH_PAN:if(i.enablePan===!1)return;Te(P),i.update();break;case r.TOUCH_DOLLY_PAN:if(i.enableZoom===!1&&i.enablePan===!1)return;Le(P),i.update();break;case r.TOUCH_DOLLY_ROTATE:if(i.enableZoom===!1&&i.enableRotate===!1)return;nt(P),i.update();break;default:s=r.NONE}}function ne(P){i.enabled!==!1&&P.preventDefault()}function se(P){w.push(P)}function Se(P){delete b[P.pointerId];for(let ae=0;ae<w.length;ae++)if(w[ae].pointerId==P.pointerId){w.splice(ae,1);return}}function le(P){let ae=b[P.pointerId];ae===void 0&&(ae=new Re,b[P.pointerId]=ae),ae.set(P.pageX,P.pageY)}function he(P){const ae=P.pointerId===w[0].pointerId?w[1]:w[0];return b[ae.pointerId]}i.domElement.addEventListener("contextmenu",ne),i.domElement.addEventListener("pointerdown",ze),i.domElement.addEventListener("pointercancel",$e),i.domElement.addEventListener("wheel",C,{passive:!1}),this.update()}}const hm=12;function to(t,e,n){return new N(t,n,e)}function hw(t,e,n,i,r,s){const o=Math.max(0,Math.min(s,Math.min(i,r)/2));t.beginPath(),t.moveTo(e+o,n),t.lineTo(e+i-o,n),t.quadraticCurveTo(e+i,n,e+i,n+o),t.lineTo(e+i,n+r-o),t.quadraticCurveTo(e+i,n+r,e+i-o,n+r),t.lineTo(e+o,n+r),t.quadraticCurveTo(e,n+r,e,n+r-o),t.lineTo(e,n+o),t.quadraticCurveTo(e,n,e+o,n),t.closePath()}function dv(t){if(Array.isArray(t)){t.forEach(n=>dv(n));return}if(!t)return;const e=t;"map"in e&&e.map&&e.map.dispose(),t.dispose()}function Jr(t){t.traverse(e=>{const n=e;n.geometry&&n.geometry.dispose();const i=e;i.material&&dv(i.material)})}function pw(t){const e=Number.isFinite(t.pos.z)?t.pos.z:0,n=[t.id,`(${t.pos.x.toFixed(2)}, ${t.pos.y.toFixed(2)}, ${e.toFixed(2)})`],i=32,r=64,s=44,o=document.createElement("canvas"),a=o.getContext("2d");if(!a)return new ic;a.font=`600 ${r}px Inter, 'Segoe UI', sans-serif`;const l=a.measureText(n[0]).width;a.font=`400 ${s}px Inter, 'Segoe UI', sans-serif`;const u=a.measureText(n[1]).width,f=Math.ceil(Math.max(l,u)+i*2),h=Math.ceil(r+s+i*3);o.width=f,o.height=h;const d=o.getContext("2d");if(!d)return new ic;d.font=`600 ${r}px Inter, 'Segoe UI', sans-serif`,d.fillStyle="rgba(255,255,255,0.96)",d.strokeStyle="rgba(200,200,200,0.9)",d.lineWidth=6,hw(d,0,0,f,h,28),d.fill(),d.stroke(),d.textAlign="center",d.textBaseline="middle",d.fillStyle="#111111",d.font=`600 ${r}px Inter, 'Segoe UI', sans-serif`,d.fillText(n[0],f/2,i+r/2),d.font=`400 ${s}px Inter, 'Segoe UI', sans-serif`,d.fillStyle="#555555",d.fillText(n[1],f/2,i+r+s/2+8);const m=new iw(o);m.encoding=ji,m.needsUpdate=!0;const x=new uv({map:m,transparent:!0}),v=new ic(x),p=.01;return v.scale.set(f*p,h*p,1),v}function mw({anchors:t,trail:e,width:n=720,height:i=520}){const r=pe.useRef(null),s=pe.useRef(null),o=pe.useRef(null),a=pe.useRef(null),l=pe.useRef(null),u=pe.useRef(null),f=pe.useRef(null),h=pe.useRef(null),d=pe.useRef(null),m=pe.useRef(),x=pe.useMemo(()=>{const v=[];if(t.forEach(I=>{const{x:G,y:L}=I.pos,D=Number.isFinite(I.pos.z)?I.pos.z:0;Number.isFinite(G)&&Number.isFinite(L)&&v.push({x:G,y:L,z:D})}),e.forEach(I=>{const{x:G,y:L,z:D}=I;Number.isFinite(G)&&Number.isFinite(L)&&Number.isFinite(D)&&v.push({x:G,y:L,z:D})}),v.length===0)return{minX:0,maxX:6,minY:0,maxY:6,minZ:0,maxZ:2,spanX:6,spanY:6,spanZ:2,center:{x:3,y:3,z:1},hasPoints:!1};const p=v.map(I=>I.x),c=v.map(I=>I.y),_=v.map(I=>I.z),g=Math.min(...p),y=Math.max(...p),M=Math.min(...c),A=Math.max(...c),w=Math.min(..._),b=Math.max(..._),S=Math.max(y-g,1),R=Math.max(A-M,1),H=Math.max(b-w,.5);return{minX:g,maxX:y,minY:M,maxY:A,minZ:w,maxZ:b,spanX:S,spanY:R,spanZ:H,center:{x:(g+y)/2,y:(M+A)/2,z:(w+b)/2},hasPoints:!0}},[t,e]);return pe.useEffect(()=>{const v=r.current;if(!v)return;const p=new tw;p.background=new Ve(16250871),p.fog=new md(16250871,60,200),l.current=p;const c=new Tn(50,n/i,.1,2e3);c.position.set(12,8,12),o.current=c;const _=new lv({antialias:!0,alpha:!0});_.setSize(n,i),_.setPixelRatio(Math.min(window.devicePixelRatio,2)),_.setClearColor(0,0),_.shadowMap.enabled=!1,s.current=_;const g=_.domElement;g.style.display="block",g.style.width="100%",g.style.height="100%",g.style.outline="1px solid #d6d6d6",g.style.borderRadius="18px",v.appendChild(g);const y=new dw(c,g);y.enableDamping=!0,y.dampingFactor=.08,y.maxDistance=500,y.minDistance=1,y.maxPolarAngle=Math.PI*.49,a.current=y;const M=new lw(16777215,.7),A=new rw(16777215,15790320,.2),w=new aw(16777215,.5);w.position.set(18,24,12),w.castShadow=!1,p.add(M),p.add(A),p.add(w);const b=new uw(hm,20,11579568,9079434);(Array.isArray(b.material)?b.material:[b.material]).forEach(W=>{W.transparent=!0,W.opacity=.35}),d.current=b,p.add(b);const R=new cw(1.8);R.position.y=.01,p.add(R);const H=new lo;u.current=H,p.add(H);const I=new ko({color:4473924,transparent:!0,opacity:.85}),G=new hf(new It,I);G.visible=!1,f.current=G,p.add(G);const L=new om({color:6710886,emissive:2039583,metalness:.25,roughness:.4}),D=new qn(new _d(.32,32,32),L);D.visible=!1,h.current=D,p.add(D);const z=()=>{y.update(),_.render(p,c),m.current=requestAnimationFrame(z)};return z(),()=>{m.current&&cancelAnimationFrame(m.current),y.dispose(),Jr(H),Jr(G),Jr(D),Jr(b),Jr(R),_.dispose(),g.parentElement===v&&v.removeChild(g),s.current=null,o.current=null,a.current=null,l.current=null,u.current=null,f.current=null,h.current=null,d.current=null}},[i,n]),pe.useEffect(()=>{const v=s.current,p=o.current;!v||!p||(v.setSize(n,i),p.aspect=n/i,p.updateProjectionMatrix())},[i,n]),pe.useEffect(()=>{const v=u.current,p=f.current,c=h.current,_=a.current,g=o.current,y=d.current;if(!v||!p||!c||!_||!g)return;v.children.slice().forEach(z=>{v.remove(z),Jr(z)});const M=[];t.forEach(z=>{const{x:W,y:F}=z.pos,B=Number.isFinite(z.pos.z)?z.pos.z:0;if(!Number.isFinite(W)||!Number.isFinite(F))return;const k=to(W,F,B);M.push(k.clone());const Q=new qn(new gd(.2,.2,.45,20),new om({color:3355443,emissive:1118481,roughness:.45,metalness:.2}));Q.position.copy(k),Q.castShadow=!1,Q.receiveShadow=!1,v.add(Q);const ee=new It().setFromPoints([new N(k.x,0,k.z),new N(k.x,k.y,k.z)]),$=new ko({color:11184810,transparent:!0,opacity:.35}),Z=new hf(ee,$);v.add(Z);const de=pw(z);de.position.set(k.x,k.y+.7,k.z),v.add(de)});const A=e.map(z=>to(z.x,z.y,z.z));A.length>0&&M.push(...A);const w=p.geometry;if(A.length>1?(p.geometry=new It().setFromPoints(A),p.visible=!0):(p.geometry=new It,p.visible=!1),w.dispose(),e.length>0){const z=e[e.length-1],W=to(z.x,z.y,z.z);c.visible=!0,c.position.copy(W)}else c.visible=!1;const b=M.length>0?M:[to(x.center.x,x.center.y,x.center.z),to(x.center.x+x.spanX*.5,x.center.y,x.center.z+x.spanY*.5)],S=new Is().setFromPoints(b),R=S.getCenter(new N),H=S.getSize(new N),I=Math.max(H.x,H.y,H.z,6),G=Math.max(I*1.15,6);if(y){const z=hm,W=Math.max(H.x,4)/z,F=Math.max(H.z,4)/z;y.scale.set(W,1,F),y.position.set(R.x,0,R.z)}const L=g.position.clone().sub(_.target);L.lengthSq()<1e-6&&L.set(1,.6,1),L.setLength(G);const D=R.clone().add(L);g.position.lerp(D,.12),_.target.lerp(R,.12),_.update(),g.far=Math.max(G*5,200),g.updateProjectionMatrix()},[t,e,x]),ue.jsxs("div",{ref:r,style:{width:n,height:i,position:"relative",borderRadius:"18px",overflow:"hidden",boxShadow:"0 18px 40px rgba(0, 0, 0, 0.08)",background:"#f7f7f7",border:"1px solid #e1e1e1"},className:"map-view",children:[ue.jsxs("div",{style:{position:"absolute",top:12,left:16,padding:"10px 14px",borderRadius:12,background:"rgba(255,255,255,0.95)",border:"1px solid #d0d0d0",color:"#111111",fontSize:12,lineHeight:1.5,pointerEvents:"none",boxShadow:"0 6px 18px rgba(0, 0, 0, 0.08)"},children:[ue.jsx("div",{style:{fontSize:11,textTransform:"uppercase",letterSpacing:"0.08em",color:"#666666"},children:"Scene bounds"}),ue.jsxs("div",{children:["Span X ",x.spanX.toFixed(2)," m"]}),ue.jsxs("div",{children:["Span Y ",x.spanY.toFixed(2)," m"]}),ue.jsxs("div",{children:["Altitude ",x.minZ.toFixed(2)," – ",x.maxZ.toFixed(2)," m (",x.spanZ.toFixed(2)," m span)"]})]}),ue.jsxs("div",{style:{position:"absolute",bottom:12,left:16,padding:"8px 12px",borderRadius:10,background:"rgba(255,255,255,0.95)",border:"1px solid #d0d0d0",fontSize:11,color:"#111111",lineHeight:1.5,pointerEvents:"none",boxShadow:"0 4px 16px rgba(0, 0, 0, 0.08)"},children:[ue.jsx("div",{children:"Rotate: drag · Pan: right-drag · Zoom: scroll"}),ue.jsx("div",{children:"Axes → X (red), Y (green ↑ altitude), Z (blue)"})]})]})}function Ti(t,e=2){return t==null||Number.isNaN(t)?"-":Number(t).toFixed(e)}function gw({connected:t,connecting:e,fps:n,latencyMs:i,messageCount:r,lastMessage:s}){var u,f,h,d,m,x;const o=s==null?void 0:s.status,a=e?"connecting":t?"live":"offline",l=i!=null?`${i.toFixed(1)} ms`:"-";return ue.jsxs("div",{style:{position:"absolute",top:16,right:16,padding:"10px 14px",borderRadius:12,background:"rgba(255,255,255,0.95)",backdropFilter:"blur(12px)",border:"1px solid #d0d0d0",color:"#111111",fontSize:13,lineHeight:1.45,minWidth:180},children:[ue.jsxs("div",{style:{fontSize:11,textTransform:"uppercase",letterSpacing:"0.12em",color:"#666666",marginBottom:6},children:["Engine ",a]}),ue.jsxs("div",{children:["fps: ",n.toFixed(0)]}),ue.jsxs("div",{children:["latency: ",l]}),ue.jsxs("div",{children:["seq: ",(s==null?void 0:s.tag_tx_seq)??"-"]}),ue.jsxs("div",{children:["anchors used: ",(o==null?void 0:o.anchors_used)??"-"]}),ue.jsxs("div",{children:["gdop: ",Ti(o==null?void 0:o.gdop)]}),ue.jsxs("div",{children:["residual rms: ",Ti(o==null?void 0:o.residual_rms_ns,1)," ns"]}),ue.jsxs("div",{children:["outliers: ",(o==null?void 0:o.outliers)??"-"]}),ue.jsxs("div",{children:["position: ",Ti((u=s==null?void 0:s.pose)==null?void 0:u.x)," m, ",Ti((f=s==null?void 0:s.pose)==null?void 0:f.y)," m, ",Ti((h=s==null?void 0:s.pose)==null?void 0:h.z)," m"]}),ue.jsxs("div",{children:["velocity: ",Ti((d=s==null?void 0:s.vel)==null?void 0:d.x)," m/s, ",Ti((m=s==null?void 0:s.vel)==null?void 0:m.y)," m/s, ",Ti((x=s==null?void 0:s.vel)==null?void 0:x.z)," m/s"]}),ue.jsxs("div",{children:["messages: ",r]})]})}const pm={display:"flex",flexDirection:"column",gap:6},no={background:"#ffffff",border:"1px solid #c4c4c4",borderRadius:8,padding:"8px 10px",color:"#111111",font:"inherit"},wi={border:"1px solid #111111",borderRadius:10,background:"#111111",padding:"10px 14px",color:"#ffffff",fontSize:14,letterSpacing:"0.03em",cursor:"pointer",transition:"background 0.2s ease, color 0.2s ease"},_w={...wi,padding:"8px 10px",fontSize:12,letterSpacing:"0.08em",background:"#f5f5f5",borderColor:"#c4c4c4",color:"#111111"};function vw({engineHttpUrl:t,setEngineHttpUrl:e,wsUrl:n,setWsUrl:i,wsDirty:r,onSyncWs:s,connected:o,connecting:a,logging:l,replaying:u,onConnect:f,onDisconnect:h,onClearTrail:d,onStartLog:m,onStopLog:x,onReplay:v,onStopReplay:p}){const[c,_]=pe.useState(""),[g,y]=pe.useState(""),[M,A]=pe.useState("1.0"),w=async b=>{if(b.preventDefault(),!g)return;const S=Number.parseFloat(M)||1;await v(g,S)};return ue.jsxs("div",{style:{display:"grid",gap:16,gridTemplateColumns:"repeat(auto-fit, minmax(240px, 1fr))",background:"#f7f7f7",borderRadius:16,padding:20,border:"1px solid #d6d6d6"},children:[ue.jsxs("div",{style:pm,children:[ue.jsx("label",{htmlFor:"engine-url",style:{fontSize:12,color:"#666666",letterSpacing:"0.08em",textTransform:"uppercase"},children:"Engine HTTP URL"}),ue.jsx("input",{id:"engine-url",style:no,value:t,onChange:b=>e(b.target.value),placeholder:"http://127.0.0.1:8000"})]}),ue.jsxs("div",{style:pm,children:[ue.jsx("label",{htmlFor:"ws-url",style:{fontSize:12,color:"#666666",letterSpacing:"0.08em",textTransform:"uppercase"},children:"Stream WS URL"}),ue.jsxs("div",{style:{display:"flex",gap:8,alignItems:"center"},children:[ue.jsx("input",{id:"ws-url",style:{...no,flex:1},value:n,onChange:b=>i(b.target.value),placeholder:"ws://127.0.0.1:8000/stream"}),ue.jsx("button",{type:"button",style:_w,onClick:s,children:"Sync"})]}),r&&ue.jsx("div",{style:{fontSize:11,color:"#666666"},children:"manual override"})]}),ue.jsxs("div",{style:{display:"flex",gap:12,alignItems:"center",flexWrap:"wrap"},children:[ue.jsx("button",{style:{...wi,...a||o?{background:"#c9c9c9",borderColor:"#c9c9c9",color:"#555555"}:{}},onClick:f,disabled:a||o,children:a?"Connecting":o?"Connected":"Connect"}),ue.jsx("button",{style:{...wi,background:"#f5f5f5",borderColor:"#111111",color:"#111111",opacity:!o&&!a?.5:1},onClick:h,disabled:!o&&!a,children:"Disconnect"}),ue.jsx("button",{style:{...wi,background:"#f5f5f5",borderColor:"#c4c4c4",color:"#111111"},onClick:d,children:"Clear Trail"})]}),ue.jsxs("div",{style:{display:"flex",gap:12,alignItems:"center",flexWrap:"wrap"},children:[ue.jsx("input",{style:{...no,flex:1,minWidth:140},value:c,onChange:b=>_(b.target.value),placeholder:"Log label (optional)"}),ue.jsx("button",{style:{...wi,...l?{background:"#c9c9c9",borderColor:"#c9c9c9",color:"#555555"}:{}},onClick:()=>m(c||void 0),disabled:l,children:"Start Log"}),ue.jsx("button",{style:{...wi,background:"#f5f5f5",borderColor:"#111111",color:"#111111",opacity:l?1:.5},onClick:x,disabled:!l,children:"Stop Log"})]}),ue.jsxs("form",{onSubmit:w,style:{display:"flex",gap:12,flexWrap:"wrap",alignItems:"center"},children:[ue.jsx("input",{style:{...no,flex:1,minWidth:160},value:g,onChange:b=>y(b.target.value),placeholder:"logs/run.bin"}),ue.jsx("input",{style:{...no,width:80},value:M,onChange:b=>A(b.target.value),placeholder:"1.0"}),ue.jsx("button",{style:wi,type:"submit",disabled:!g,children:"Replay"}),ue.jsx("button",{type:"button",style:{...wi,background:"#f5f5f5",borderColor:"#111111",color:"#111111",opacity:u?1:.5},onClick:p,disabled:!u,children:"Stop Replay"})]})]})}const xw={width:"100%",minHeight:180,background:"#ffffff",border:"1px solid #c4c4c4",borderRadius:12,color:"#111111",padding:14,fontFamily:"'JetBrains Mono', 'Fira Code', monospace",fontSize:13,lineHeight:1.45,resize:"vertical"},yw={borderRadius:10,border:"1px solid #111111",padding:"10px 16px",background:"#111111",color:"#ffffff",cursor:"pointer",fontSize:14};function Sw({anchors:t,onSave:e}){const[n,i]=pe.useState(()=>JSON.stringify(t,null,2)),[r,s]=pe.useState(null),[o,a]=pe.useState(!1);pe.useEffect(()=>{i(JSON.stringify(t,null,2))},[t]);const l=async()=>{try{s(null),a(!0);const u=JSON.parse(n);if(!Array.isArray(u))throw new Error("Anchors JSON must be an array");await e(u)}catch(u){s(u instanceof Error?u.message:String(u))}finally{a(!1)}};return ue.jsxs("div",{style:{background:"#f7f7f7",borderRadius:16,padding:20,border:"1px solid #d9d9d9",display:"flex",flexDirection:"column",gap:12},children:[ue.jsx("div",{style:{fontSize:13,color:"#666666",letterSpacing:"0.08em",textTransform:"uppercase"},children:"Anchors JSON"}),ue.jsx("textarea",{style:xw,value:n,onChange:u=>i(u.target.value),spellCheck:!1}),r&&ue.jsx("div",{style:{display:"inline-flex",alignItems:"center",gap:6,fontSize:13,color:"#111111",background:"#f0f0f0",borderRadius:8,padding:"6px 10px"},children:r}),ue.jsx("div",{style:{display:"flex",justifyContent:"flex-end"},children:ue.jsx("button",{style:yw,onClick:l,disabled:o,children:o?"Saving…":"Push to Engine"})})]})}const Mw={width:"100%",minHeight:160,background:"#ffffff",border:"1px solid #c4c4c4",borderRadius:12,color:"#111111",padding:14,fontFamily:"'JetBrains Mono', 'Fira Code', monospace",fontSize:13,lineHeight:1.45,resize:"vertical"},Ew={borderRadius:10,border:"1px solid #111111",padding:"10px 16px",background:"#111111",color:"#ffffff",cursor:"pointer",fontSize:14};function Tw({clocks:t,onSave:e}){const[n,i]=pe.useState(()=>JSON.stringify(t,null,2)),[r,s]=pe.useState(null),[o,a]=pe.useState(!1);pe.useEffect(()=>{i(JSON.stringify(t,null,2))},[t]);const l=async()=>{try{s(null),a(!0);const u=JSON.parse(n);if(!Array.isArray(u))throw new Error("Anchor clocks JSON must be an array");await e(u)}catch(u){s(u instanceof Error?u.message:String(u))}finally{a(!1)}};return ue.jsxs("div",{style:{background:"#f7f7f7",borderRadius:16,padding:20,border:"1px solid #d9d9d9",display:"flex",flexDirection:"column",gap:12},children:[ue.jsx("div",{style:{fontSize:13,color:"#666666",letterSpacing:"0.08em",textTransform:"uppercase"},children:"Anchor Clock Calibration"}),ue.jsx("textarea",{style:Mw,value:n,onChange:u=>i(u.target.value),spellCheck:!1}),r&&ue.jsx("div",{style:{display:"inline-flex",alignItems:"center",gap:6,fontSize:13,color:"#111111",background:"#f0f0f0",borderRadius:8,padding:"6px 10px"},children:r}),ue.jsx("div",{style:{fontSize:12,color:"#666666"},children:"Provide per-anchor `offset_ns`, `drift_ppm`, and optional `valid` flags. Use the same anchor IDs as above."}),ue.jsx("div",{style:{display:"flex",justifyContent:"flex-end"},children:ue.jsx("button",{style:Ew,onClick:l,disabled:o,children:o?"Saving…":"Upload Clock Params"})})]})}async function Os(t,e){const n=await fetch(t,{...e,headers:{"Content-Type":"application/json",...e&&e.headers?e.headers:{}}});if(!n.ok){const i=await n.text();throw new Error(`Request failed (${n.status}): ${i}`)}return n.status===204?{}:await n.json()}function zs(t,e){return`${t.replace(/\/$/,"")}${e}`}async function ww(t){return Os(zs(t,"/anchors"))}async function mm(t,e,n=[]){const i={anchors:e,anchor_clocks:n};return Os(zs(t,"/set_anchors"),{method:"POST",body:JSON.stringify(i)})}async function Aw(t,e){const n=e?{label:e}:void 0;return Os(zs(t,"/start_log"),{method:"POST",body:n?JSON.stringify(n):void 0})}async function Rw(t){return Os(zs(t,"/stop_log"),{method:"POST"})}async function hv(t,e,n=1){const i=new URLSearchParams({file:e,speed:String(n)});return Os(zs(t,`/replay?${i.toString()}`),{method:"POST"})}async function Cw(t){return hv(t,"stop",1)}async function bw(t){return Os(zs(t,"/healthz"))}function Pw(){const[t,e]=pe.useState(C_),[n,i]=pe.useState(qx),[r,s]=pe.useState([]),[o,a]=pe.useState([]),[l,u]=pe.useState(!1),[f,h]=pe.useState(!1),[d,m]=pe.useState(!1),[x,v]=pe.useState(null),[p,c]=pe.useState(!1),_=$x(n,{autoConnect:!0,historySize:900}),{clearTrail:g}=_,y=pe.useMemo(()=>_.trail.length>0?_.trail[_.trail.length-1]:null,[_.trail]);pe.useEffect(()=>{if(!x)return;const D=window.setTimeout(()=>v(null),3600);return()=>window.clearTimeout(D)},[x]);const M=pe.useCallback((D,z="ok")=>{v({text:D,kind:z})},[]),A=pe.useCallback(async()=>{try{m(!0);const[D,z]=await Promise.all([ww(t),bw(t)]);s(D.anchors);const W=D.anchor_clocks&&D.anchor_clocks.length>0?D.anchor_clocks:Object.entries(z.clock||{}).map(([F,B])=>({id:F,offset_ns:Number(B.offset_ns??0),drift_ppm:Number(B.drift_ppm??0),valid:!!(B.valid??!0)}));a(W),u(!!z.logging),h(!!z.replay_running)}catch(D){M(D instanceof Error?D.message:String(D),"error")}finally{m(!1)}},[t,M]);pe.useEffect(()=>{A()},[A]),pe.useEffect(()=>{p||i(ef(t))},[t,p]);const w=pe.useCallback(D=>{c(!0),i(D)},[]),b=pe.useCallback(()=>{c(!1),i(ef(t))},[t]),S=pe.useCallback(async D=>{try{await mm(t,D,o),s(D),M("Anchors updated"),g()}catch(z){M(z instanceof Error?`Failed to set anchors: ${z.message}`:String(z),"error")}},[o,g,t,M]),R=pe.useCallback(async D=>{try{await mm(t,r,D),a(D),M("Clock parameters updated"),g()}catch(z){M(z instanceof Error?`Failed to set clocks: ${z.message}`:String(z),"error")}},[r,g,t,M]),H=pe.useCallback(async D=>{try{await Aw(t,D),u(!0),M("Log started")}catch(z){M(z instanceof Error?`Failed to start log: ${z.message}`:String(z),"error")}},[t,M]),I=pe.useCallback(async()=>{try{await Rw(t),u(!1),M("Log stopped")}catch(D){M(D instanceof Error?`Failed to stop log: ${D.message}`:String(D),"error")}},[t,M]),G=pe.useCallback(async(D,z)=>{try{await hv(t,D,z),h(!0),M(`Replaying ${D}`)}catch(W){M(W instanceof Error?`Replay failed: ${W.message}`:String(W),"error")}},[t,M]),L=pe.useCallback(async()=>{try{await Cw(t),h(!1),M("Replay stopped")}catch(D){M(D instanceof Error?`Stop replay failed: ${D.message}`:String(D),"error")}},[t,M]);return ue.jsxs("div",{className:"app-shell",children:[ue.jsxs("header",{className:"app-header",children:[ue.jsxs("div",{children:[ue.jsx("div",{className:"app-title",children:"TDoA Engine Console"}),ue.jsx("div",{className:"app-subtitle",children:"Monitor, replay, and calibrate the indoor localization engine."})]}),ue.jsxs("div",{className:"app-subtitle",children:["Anchors: ",r.length||"-"]})]}),ue.jsx(vw,{engineHttpUrl:t,setEngineHttpUrl:e,wsUrl:n,setWsUrl:w,wsDirty:p,onSyncWs:b,connected:_.connected,connecting:_.connecting,logging:l,replaying:f,onConnect:_.connect,onDisconnect:_.disconnect,onClearTrail:_.clearTrail,onStartLog:H,onStopLog:I,onReplay:G,onStopReplay:L}),ue.jsxs("main",{className:"app-main",children:[ue.jsxs("div",{style:{position:"relative"},children:[ue.jsx(mw,{anchors:r,trail:_.trail}),ue.jsx(gw,{connected:_.connected,connecting:_.connecting,fps:_.fps,latencyMs:_.latencyMs,messageCount:_.messageCount,lastMessage:_.lastMessage}),d&&ue.jsx("div",{style:{position:"absolute",top:12,left:16,padding:"6px 12px",borderRadius:12,background:"rgba(255,255,255,0.9)",border:"1px solid #d0d0d0",fontSize:12,color:"#111111"},children:"refreshing anchors…"})]}),ue.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:20},children:[ue.jsx(Sw,{anchors:r,onSave:S}),ue.jsx(Tw,{clocks:o,onSave:R}),y&&ue.jsxs("div",{style:{background:"#f5f5f5",borderRadius:16,padding:18,border:"1px solid #d9d9d9",color:"#111111",fontSize:14,lineHeight:1.5},children:[ue.jsx("div",{className:"section-title",children:"Latest pose"}),ue.jsxs("div",{children:["seq: ",y.seq]}),ue.jsxs("div",{children:["position: ",y.x.toFixed(3)," m, ",y.y.toFixed(3)," m, ",y.z.toFixed(3)," m"]}),ue.jsxs("div",{children:["timestamp: ",y.t.toFixed(3)," s"]})]})]})]}),x&&ue.jsx("div",{className:`toast${x.kind==="error"?" error":""}`,children:x.text})]})}ac.createRoot(document.getElementById("root")).render(ue.jsx(Iv.StrictMode,{children:ue.jsx(Pw,{})}));
