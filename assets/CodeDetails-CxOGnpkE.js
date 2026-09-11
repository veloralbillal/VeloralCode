import{c as $,u as L,b as E,r as x,j as e,i as ge,R as we,ak as ne,b1 as ye,aH as oe,b2 as ve,b3 as je,b4 as Ne,X as R,a7 as W,Z as se,q as ke,g as Ce,t as Se,af as Te,as as Ee,I as M,a3 as G,a5 as Le,e as Q,a4 as ie,b5 as ae,b6 as Re,U as P,A as z,v as q,b7 as le,aF as Oe,aG as V,h as $e,al as Pe,aa as Me,z as Be,b8 as Ie}from"./index-CDQaDBYe.js";import{H as B,f as I,S as O,s as De,a as Ae,b as Fe,r as He}from"./toolInteractionService-DUDvynSr.js";import{A as de}from"./arrow-left-BlovzVDA.js";import{T as Ue}from"./tablet-Y3oar4Q3.js";import{a as ce,M as _e,b as Je,F as xe,C as re}from"./CodeViewer-BRt9pf5k.js";import{M as me}from"./message-square-P8xMAArA.js";import{d as Ve,U as We}from"./creatorProfileService-C-zrHjw8.js";import{L as Y}from"./lock-Djn_WnbM.js";import{C as ze}from"./chevron-up-DWCF5U2V.js";import{T as qe}from"./trash-2-DTBX7RHk.js";import{S as Ye}from"./send-D37kSb6p.js";import{L as Ge}from"./loader-circle-Boy4HLXG.js";/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qe=[["path",{d:"M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5c0 1.1.9 2 2 2h1",key:"ezmyqa"}],["path",{d:"M16 21h1a2 2 0 0 0 2-2v-5c0-1.1.9-2 2-2a2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1",key:"e1hn23"}]],Ke=$("braces",Qe);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xe=[["circle",{cx:"12",cy:"18",r:"3",key:"1mpf1b"}],["circle",{cx:"6",cy:"6",r:"3",key:"1lh9wr"}],["circle",{cx:"18",cy:"6",r:"3",key:"1h7g24"}],["path",{d:"M18 9v2c0 .6-.4 1-1 1H7c-.6 0-1-.4-1-1V9",key:"1uq4wg"}],["path",{d:"M12 12v3",key:"158kv8"}]],pe=$("git-fork",Xe);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ze=[["rect",{width:"20",height:"14",x:"2",y:"3",rx:"2",key:"48i651"}],["line",{x1:"8",x2:"16",y1:"21",y2:"21",key:"1svkeh"}],["line",{x1:"12",x2:"12",y1:"17",y2:"21",key:"vw1qmm"}]],et=$("monitor",Ze);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const tt=[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"m14.5 9.5-5 5",key:"17q4r4"}],["path",{d:"m9.5 9.5 5 5",key:"18nt4w"}]],st=$("shield-x",tt);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const at=[["path",{d:"M12 19h8",key:"baeox8"}],["path",{d:"m4 17 6-6-6-6",key:"1yngyt"}]],ue=$("terminal",at),lt=({item:t,deviceMode:a,isPremium:s,setDeviceMode:n,onBack:o,onReload:r,onToggleFullscreen:l,isFullscreen:i,onOpenInfo:m,onOpenCode:d,onShare:u,onOpenTip:c,onOpenRemix:b,onToggleConsole:h,consoleOpen:w,logCount:j,onToggleReviews:p,reviewsOpen:y})=>{const{currentUser:g}=L(),{showToast:N}=E(),[k,f]=x.useState(!1);x.useEffect(()=>{async function C(){if(g!=null&&g.uid&&t.id){const A=await ve(g.uid,t.id);f(A)}}C()},[g==null?void 0:g.uid,t.id]);const D=async()=>{if(!g){N("Please login first to bookmark","info"),window.location.hash="#/login";return}if(t.id)try{const C=await je(g.uid,{id:t.id,title:t.title,category:t.category,language:t.language});f(C),N(C?"Tool saved to your bookmarks!":"Removed from bookmarks","success")}catch{N("Failed to update bookmark","error")}};return e.jsxs("header",{className:"h-14 bg-slate-900 border-b border-slate-800 px-3 sm:px-4 flex items-center justify-between text-slate-200 z-40 select-none",children:[e.jsxs("div",{className:"flex items-center gap-2.5 sm:gap-3 min-w-0",children:[e.jsxs("button",{onClick:o,className:"flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition shrink-0",title:"Back to all tools",children:[e.jsx(de,{className:"w-4 h-4 text-indigo-400"}),e.jsx("span",{className:"hidden sm:inline",children:"Back"})]}),e.jsxs("div",{className:"flex items-center gap-2 min-w-0 truncate",children:[e.jsx("span",{className:"flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0"}),e.jsx("h1",{className:"text-xs sm:text-sm font-bold text-white truncate",title:t.title,children:t.title}),e.jsx("span",{className:"hidden md:inline-block text-[11px] px-2 py-0.5 rounded-md bg-indigo-950/80 text-indigo-300 font-medium border border-indigo-800/60 shrink-0",children:t.category})]})]}),e.jsxs("div",{className:"hidden lg:flex items-center bg-slate-800/90 p-0.5 rounded-xl border border-slate-700/80 text-slate-400",children:[e.jsxs("button",{onClick:()=>n("desktop"),title:"Desktop Resolution (100%)",className:`p-1.5 rounded-lg transition text-xs flex items-center gap-1 ${a==="desktop"?"bg-indigo-600 text-white font-bold":"hover:text-white"}`,children:[e.jsx(et,{className:"w-3.5 h-3.5"}),e.jsx("span",{children:"Desktop"})]}),e.jsxs("button",{onClick:()=>n("tablet"),title:"Tablet View (768px)",className:`p-1.5 rounded-lg transition text-xs flex items-center gap-1 ${a==="tablet"?"bg-indigo-600 text-white font-bold":"hover:text-white"}`,children:[e.jsx(Ue,{className:"w-3.5 h-3.5"}),e.jsx("span",{children:"Tablet"})]}),e.jsxs("button",{onClick:()=>n("mobile"),title:"Mobile View (375px)",className:`p-1.5 rounded-lg transition text-xs flex items-center gap-1 ${a==="mobile"?"bg-indigo-600 text-white font-bold":"hover:text-white"}`,children:[e.jsx(ge,{className:"w-3.5 h-3.5"}),e.jsx("span",{children:"Mobile"})]})]}),e.jsxs("div",{className:"flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar py-1 shrink-0 max-w-[65vw] sm:max-w-none",children:[e.jsxs("button",{onClick:c,className:"hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold transition",title:"Tip & Support Creator",children:[e.jsx(B,{className:"w-3.5 h-3.5 fill-rose-500/30"}),e.jsx("span",{className:"hidden xl:inline",children:"Tip"})]}),e.jsxs("button",{onClick:b,className:"hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition",title:"Fork & Remix this Tool",children:[e.jsx(pe,{className:"w-3.5 h-3.5"}),e.jsx("span",{className:"hidden xl:inline",children:"Remix"})]}),e.jsxs("button",{onClick:h,className:`p-2 rounded-xl border transition flex items-center gap-1 ${w?"bg-emerald-600 text-white border-emerald-500":"bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700"}`,title:"Toggle Debug Console",children:[e.jsx(ue,{className:"w-3.5 h-3.5"}),j>0&&e.jsx("span",{className:"text-[10px] font-bold",children:j})]}),e.jsx("button",{onClick:r,className:"p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition",title:"Reload Tool Output",children:e.jsx(we,{className:"w-3.5 h-3.5 text-indigo-400"})}),e.jsxs("button",{onClick:d,className:`flex items-center gap-1 px-2 py-1.5 rounded-xl text-xs font-semibold border transition ${s?"bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700":"bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/30"}`,title:s?"Inspect Source Code":"Source Code (Premium Feature)",children:[e.jsx(ce,{className:"w-3.5 h-3.5 text-amber-400"}),e.jsx("span",{className:"hidden md:inline",children:"Code"}),!s&&e.jsx("span",{className:"text-[9px] bg-amber-500/20 text-amber-400 px-1 rounded",children:"PRO"})]}),e.jsx("button",{onClick:m,className:"p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition",title:"Tool Details & Information",children:e.jsx(ne,{className:"w-3.5 h-3.5 text-sky-400"})}),p&&e.jsxs("button",{onClick:p,className:`p-2 rounded-xl border transition flex items-center gap-1 ${y?"bg-indigo-600 text-white border-indigo-500 shadow-sm shadow-indigo-600/30":"bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700"}`,title:"Community Reviews & Ratings",children:[e.jsx(me,{className:"w-3.5 h-3.5 text-indigo-400"}),t.averageRating&&e.jsxs("span",{className:"text-[10px] font-bold text-amber-300 hidden xl:inline",children:["★ ",t.averageRating]})]}),e.jsx("button",{onClick:D,className:`p-2 rounded-xl border transition ${k?"bg-amber-500 text-white border-amber-400 shadow-sm shadow-amber-500/30":"bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700"}`,title:k?"Remove from bookmarks":"Bookmark this tool",children:e.jsx(ye,{className:`w-3.5 h-3.5 ${k?"fill-current":""}`})}),e.jsx("button",{onClick:u,className:"p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition",title:"Share & Embed Widget",children:e.jsx(oe,{className:"w-3.5 h-3.5"})}),e.jsx("button",{onClick:l,className:"p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-sm shadow-indigo-600/30",title:i?"Exit Fullscreen":"Open Full Screen",children:i?e.jsx(_e,{className:"w-3.5 h-3.5"}):e.jsx(Je,{className:"w-3.5 h-3.5"})})]})]})};function rt(t="",a="",s="",n=""){const o=[],r=`${t} ${a} ${s} ${n}`.toLowerCase();(r.includes("eval(")||r.includes("window.eval("))&&o.push({type:"danger",message:"Dynamic Code Execution (eval)",detail:"Avoid using eval() as it can execute unverified code strings."}),(r.includes("document.cookie")||r.includes("window.cookie"))&&o.push({type:"danger",message:"Cookie Access Attempt",detail:"Script attempts to access browser cookies."}),(r.includes("window.location.replace")||r.includes("window.location.href ="))&&o.push({type:"warning",message:"Automatic Page Redirect",detail:"Script may forcefully redirect users away from the tool page."}),(r.includes("localstorage.clear()")||r.includes("sessionstorage.clear()"))&&o.push({type:"warning",message:"Storage Wipe Detected",detail:"Script contains calls to clear local storage."}),(r.includes("coinhive")||r.includes("cryptonight")||r.includes("minero"))&&o.push({type:"danger",message:"Crypto Mining Signature",detail:"Script matches known background cryptocurrency miner patterns."});let l=100;o.forEach(m=>{m.type==="danger"&&(l-=35),m.type==="warning"&&(l-=15),m.type==="info"&&(l-=5)}),l=Math.max(0,Math.min(100,l));let i="safe";return l<50?i="high":l<75?i="medium":l<95&&(i="low"),{isSafe:l>=70,score:l,riskLevel:i,flags:o}}const nt=({item:t,isOpen:a,onClose:s,onOpenCode:n,onNavigate:o,onOpenTip:r})=>{const[l,i]=x.useState(null);if(x.useEffect(()=>{a&&t.creatorUid?Ve(t.creatorUid).then(h=>{i(h)}):i(null)},[a,t.creatorUid]),!a)return null;const m=Ne(t.category),d=I((l==null?void 0:l.creatorName)||t.creatorName,t.creatorEmail,"Creator"),u=!!((l==null?void 0:l.isVerified)??t.creatorVerified??!1),c=rt(t.html,t.css,t.js,t.code),b=c.riskLevel==="safe"||c.riskLevel==="low";return e.jsx("div",{className:"fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150",children:e.jsxs("div",{className:"bg-slate-900 border border-slate-700/80 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 text-slate-200 shadow-2xl space-y-5",children:[e.jsxs("div",{className:"flex items-start justify-between gap-3",children:[e.jsxs("div",{className:"space-y-1.5",children:[e.jsxs("div",{className:"flex items-center gap-2 flex-wrap",children:[e.jsx("span",{className:`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${m}`,children:t.category}),e.jsx("span",{className:"text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700",children:t.language})]}),e.jsx("h3",{className:"text-lg font-bold text-white leading-snug",children:t.title})]}),e.jsx("button",{onClick:s,className:"p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition",children:e.jsx(R,{className:"w-4 h-4"})})]}),e.jsxs("div",{className:"p-4 bg-slate-950/90 rounded-2xl border border-slate-800/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"w-10 h-10 rounded-2xl bg-slate-800 text-slate-200 border border-slate-700 flex items-center justify-center font-bold text-xs shrink-0",children:d?d.slice(0,2).toUpperCase():e.jsx(W,{className:"w-4 h-4"})}),e.jsxs("div",{children:[e.jsx("p",{className:"text-xs font-bold text-slate-200",children:d}),e.jsx("div",{className:"mt-0.5",children:u?e.jsxs("span",{className:"inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800",children:[e.jsx(se,{className:"w-3 h-3 text-emerald-400"})," Verified Contributor"]}):e.jsxs("span",{className:"inline-flex items-center gap-1 text-[10px] font-medium text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-full border border-slate-700",children:[e.jsx(W,{className:"w-3 h-3 text-slate-400"})," Community Author"]})})]})]}),t.creatorUid&&o&&e.jsx("button",{onClick:()=>{s(),o(`#/creator/${t.creatorUid}`)},className:"text-[11px] text-emerald-400 hover:underline font-semibold self-start sm:self-auto",children:"View Creator Portfolio →"})]}),e.jsxs("div",{className:`p-4 rounded-2xl border space-y-2.5 ${b?"bg-emerald-950/30 border-emerald-800/50":c.riskLevel==="medium"?"bg-amber-950/30 border-amber-800/50":"bg-rose-950/30 border-rose-800/50"}`,children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[b?e.jsx(se,{className:"w-4 h-4 text-emerald-400"}):c.riskLevel==="medium"?e.jsx(Te,{className:"w-4 h-4 text-amber-400"}):e.jsx(st,{className:"w-4 h-4 text-rose-400"}),e.jsx("span",{className:`text-xs font-bold ${b?"text-emerald-300":c.riskLevel==="medium"?"text-amber-300":"text-rose-300"}`,children:b?"Tool Safety Status: Safe":c.riskLevel==="medium"?"Tool Safety Status: Review Needed":"Tool Safety Status: High Risk"})]}),e.jsxs("span",{className:"text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-black/40 text-slate-200",children:["Safety Score: ",c.score,"/100"]})]}),e.jsx("p",{className:"text-[11px] text-slate-300 leading-relaxed",children:b?"✓ No malicious code, cookies stealing, phishing scripts, or harmful redirects detected. This tool executes inside an isolated sandbox iframe environment.":c.flags.map(h=>h.message).join(". ")})]}),t.description?e.jsx("p",{className:"text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800",children:t.description}):e.jsx("p",{className:"text-xs text-slate-500 italic",children:"No description provided for this tool."}),t.tags&&t.tags.length>0&&e.jsxs("div",{className:"space-y-1.5",children:[e.jsx("span",{className:"text-[11px] font-semibold text-slate-400 uppercase tracking-wider",children:"Tags"}),e.jsx("div",{className:"flex flex-wrap gap-1.5",children:t.tags.map((h,w)=>e.jsxs("span",{className:"text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700/60",children:["#",h]},w))})]}),e.jsxs("div",{className:"grid grid-cols-3 gap-2.5 pt-2 border-t border-slate-800 text-xs",children:[e.jsxs("div",{className:"p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1",children:[e.jsxs("span",{className:"text-slate-500 flex items-center gap-1 text-[10px]",children:[e.jsx(ke,{className:"w-3 h-3"})," Total Views"]}),e.jsx("span",{className:"font-bold text-white text-xs",children:t.views||0})]}),e.jsxs("div",{className:"p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1",children:[e.jsxs("span",{className:"text-slate-500 flex items-center gap-1 text-[10px]",children:[e.jsx(O,{className:"w-3 h-3 text-amber-400"})," Rating"]}),e.jsx("span",{className:"font-bold text-amber-400 text-xs",children:t.averageRating?`${t.averageRating} ★`:"New Tool"})]}),e.jsxs("div",{className:"p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1",children:[e.jsxs("span",{className:"text-slate-500 flex items-center gap-1 text-[10px]",children:[e.jsx(Ce,{className:"w-3 h-3"})," Date"]}),e.jsx("span",{className:"font-bold text-white text-xs",children:Se(t.updatedAt||t.createdAt)})]})]}),e.jsxs("div",{className:"flex items-center justify-between gap-3 pt-2 border-t border-slate-800",children:[e.jsxs("button",{onClick:()=>{s(),n()},className:"flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition",children:[e.jsx(xe,{className:"w-4 h-4 text-amber-400"}),e.jsx("span",{children:"Inspect Code"})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[r&&e.jsxs("button",{onClick:()=>{s(),r()},className:"px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-md shadow-rose-600/30",children:[e.jsx(B,{className:"w-3.5 h-3.5"}),e.jsx("span",{children:"Tip"})]}),e.jsx("button",{onClick:s,className:"px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition shadow-md shadow-indigo-600/30",children:"Return to Tool"})]})]})]})})},ot=({codeId:t,creatorUid:a,creatorEmail:s,code:n,language:o,title:r,isOpen:l,isPremium:i,onClose:m,onOpenPremiumPrompt:d})=>{const{showToast:u}=E(),{currentUser:c}=L(),[b,h]=Ee.useState(!1);if(!l)return null;const w=async()=>{if(!i){d&&d();return}await ie(n)&&(h(!0),u("Code copied to clipboard!","success"),setTimeout(()=>h(!1),2e3),t&&ae({codeId:t,toolTitle:r,creatorUid:a,creatorEmail:s,userUid:c==null?void 0:c.uid,userEmail:(c==null?void 0:c.email)||void 0,isPremium:i,actionType:"copy"}))},j=()=>{if(!i){d&&d();return}Re(n,r,o),u(`Downloaded ${r}`,"info"),t&&ae({codeId:t,toolTitle:r,creatorUid:a,creatorEmail:s,userUid:c==null?void 0:c.uid,userEmail:(c==null?void 0:c.email)||void 0,isPremium:i,actionType:"download"})};return e.jsx("div",{className:"fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150",children:e.jsxs("div",{className:"bg-slate-900 border border-slate-700 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col text-slate-200 shadow-2xl overflow-hidden",children:[e.jsxs("div",{className:"px-5 py-3.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(xe,{className:"w-4 h-4 text-amber-400"}),e.jsxs("h3",{className:"text-sm font-bold text-white",children:["Source Code: ",r]}),e.jsx("span",{className:"text-[11px] px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 font-mono border border-indigo-800",children:o}),!i&&e.jsxs("span",{className:"flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30",children:[e.jsx(Y,{className:"w-2.5 h-2.5"})," Premium Only"]})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsxs("button",{onClick:w,disabled:!i,className:"flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition disabled:opacity-40 disabled:cursor-not-allowed",title:i?"Copy source code":"Premium required to copy",children:[b?e.jsx(M,{className:"w-3.5 h-3.5 text-emerald-400"}):e.jsx(G,{className:"w-3.5 h-3.5"}),e.jsx("span",{children:b?"Copied":"Copy"})]}),e.jsxs("button",{onClick:j,disabled:!i,className:"flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition disabled:opacity-40 disabled:cursor-not-allowed",title:i?"Download code file":"Premium required to download",children:[e.jsx(Le,{className:"w-3.5 h-3.5"}),e.jsx("span",{children:"Download"})]}),e.jsx("button",{onClick:m,className:"p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition ml-1",children:e.jsx(R,{className:"w-4 h-4"})})]})]}),e.jsx("div",{className:"flex-1 overflow-auto p-4 bg-slate-950 relative",children:i?e.jsx(re,{code:n,language:o,title:r,showLineNumbers:!0,maxHeight:"60vh"}):e.jsxs("div",{className:"relative",children:[e.jsx("div",{className:"filter blur-md select-none pointer-events-none opacity-40",children:e.jsx(re,{code:n.slice(0,300)+`

// Protected content hidden for free tier...`,language:o,title:r,showLineNumbers:!0,maxHeight:"350px"})}),e.jsxs("div",{className:"absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-slate-950/80 backdrop-blur-xs rounded-2xl border border-slate-800 space-y-4",children:[e.jsx("div",{className:"w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center",children:e.jsx(Y,{className:"w-6 h-6"})}),e.jsxs("div",{className:"space-y-1.5 max-w-sm",children:[e.jsx("h4",{className:"text-sm font-bold text-white",children:"Source Code is Locked for Free Tier"}),e.jsx("p",{className:"text-xs text-slate-400 leading-relaxed",children:"You have full access to run and use this tool live in full-screen. Source code download & copy access is reserved for Premium Members."})]}),d&&e.jsxs("button",{onClick:d,className:"flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs transition shadow-lg shadow-amber-500/20",children:[e.jsx(Q,{className:"w-4 h-4 fill-current"}),e.jsx("span",{children:"Learn How to Get Premium Access"})]})]})]})})]})})},it=({isOpen:t,onClose:a,onNavigate:s})=>{const{currentUser:n,userProfile:o}=L();return t?e.jsx("div",{className:"fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150",children:e.jsxs("div",{className:"bg-slate-900 border border-amber-500/30 rounded-3xl max-w-md w-full p-6 text-slate-200 shadow-2xl space-y-5 relative overflow-hidden",children:[e.jsx("div",{className:"absolute -top-20 -right-20 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"}),e.jsx("div",{className:"absolute -bottom-20 -left-20 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"}),e.jsx("button",{onClick:a,className:"absolute top-4 right-4 p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition",children:e.jsx(R,{className:"w-4 h-4"})}),e.jsxs("div",{className:"text-center space-y-2 pt-2",children:[e.jsx("div",{className:"w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/5",children:e.jsx(Y,{className:"w-7 h-7"})}),e.jsx("h3",{className:"text-lg font-bold text-white",children:"Source Code is Premium Protected"}),e.jsxs("p",{className:"text-xs text-slate-400 leading-relaxed max-w-xs mx-auto",children:["Free users have unlimited access to ",e.jsx("span",{className:"text-emerald-400 font-semibold",children:"run & use all live tools"}),". Inspecting and copying raw source code is reserved for Premium Members."]})]}),e.jsxs("div",{className:"p-4 bg-slate-950/70 rounded-2xl border border-slate-800 space-y-2.5 text-xs",children:[e.jsxs("div",{className:"flex items-center gap-2.5 text-slate-300",children:[e.jsx(P,{className:"w-4 h-4 text-emerald-400 shrink-0"}),e.jsx("span",{children:"Full source code inspection & export"})]}),e.jsxs("div",{className:"flex items-center gap-2.5 text-slate-300",children:[e.jsx(P,{className:"w-4 h-4 text-emerald-400 shrink-0"}),e.jsx("span",{children:"One-click copy & file downloads"})]}),e.jsxs("div",{className:"flex items-center gap-2.5 text-slate-300",children:[e.jsx(P,{className:"w-4 h-4 text-emerald-400 shrink-0"}),e.jsx("span",{children:"Verified Pro Member badge on Profile"})]})]}),e.jsxs("div",{className:"space-y-2 pt-1",children:[n?e.jsxs("div",{className:"space-y-2",children:[e.jsxs("button",{onClick:()=>{a(),s?s("#/profile"):window.location.hash="#/profile"},className:"w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs transition shadow-lg shadow-amber-500/20",children:[e.jsx(Q,{className:"w-4 h-4 fill-current"}),e.jsx("span",{children:"View Profile & Plan Status"}),e.jsx(z,{className:"w-3.5 h-3.5 ml-1"})]}),e.jsx("p",{className:"text-[11px] text-center text-slate-500",children:"To upgrade to Premium, request access from the system administrator."})]}):e.jsx("div",{className:"space-y-2",children:e.jsxs("button",{onClick:()=>{a(),s?s("#/login"):window.location.hash="#/login"},className:"w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-indigo-600/30",children:[e.jsx(We,{className:"w-4 h-4"}),e.jsx("span",{children:"Sign In to Your Account"}),e.jsx(z,{className:"w-3.5 h-3.5 ml-1"})]})}),e.jsx("button",{onClick:a,className:"w-full py-2 text-center text-xs text-slate-400 hover:text-slate-200 transition",children:"Continue Using Live Tool"})]})]})}):null},dt=({code:t})=>{const{showToast:a}=E(),[s,n]=x.useState(!1),[o,r]=x.useState("");let l=null,i=null;try{l=JSON.parse(t)}catch(d){i=d.message||"Invalid JSON syntax"}const m=async()=>{if(!l)return;await ie(JSON.stringify(l,null,2))&&(n(!0),a("Formatted JSON copied!","success"),setTimeout(()=>n(!1),2e3))};return e.jsxs("div",{className:"rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-slate-900 overflow-hidden shadow-xl",children:[e.jsxs("div",{className:"flex items-center justify-between px-5 py-3.5 bg-slate-900 border-b border-slate-800 flex-wrap gap-2",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(Ke,{className:"w-4 h-4 text-amber-400"}),e.jsx("span",{className:"text-xs font-bold text-white uppercase tracking-wider",children:"Parsed JSON Data Output"}),i?e.jsx("span",{className:"text-[11px] px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800",children:"Invalid Format"}):e.jsx("span",{className:"text-[11px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800",children:"Valid JSON Object"})]}),e.jsxs("button",{onClick:m,disabled:!!i,className:"flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition disabled:opacity-50",children:[s?e.jsx(M,{className:"w-3.5 h-3.5 text-emerald-400"}):e.jsx(G,{className:"w-3.5 h-3.5"}),e.jsx("span",{children:"Copy Data"})]})]}),e.jsx("div",{className:"p-4 sm:p-6 bg-slate-950 min-h-[350px]",children:i?e.jsxs("div",{className:"p-4 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-300 text-xs space-y-2",children:[e.jsxs("div",{className:"flex items-center gap-2 font-bold",children:[e.jsx(q,{className:"w-4 h-4 text-rose-400"}),e.jsx("span",{children:"JSON Parse Error:"})]}),e.jsx("p",{className:"font-mono",children:i})]}):e.jsx("pre",{className:"text-emerald-400 font-mono text-xs overflow-auto max-h-[500px] leading-relaxed p-4 bg-slate-900/80 rounded-2xl border border-slate-800",children:JSON.stringify(l,null,2)})})]})};function ct(t){const a=t.match(/(?:"""|''')([\s\S]*?(?:<!DOCTYPE|<html|<body|<div|<main)[\s\S]*?)(?:"""|''')/i);if(a&&a[1])return a[1].trim();const s=t.match(/(?:html|template|markup)\s*=\s*(?:f?["']{1,3})([\s\S]*?)(?:["']{1,3})/i);return s&&s[1]&&s[1].includes("<")?s[1].trim():null}function xt(t){const a=t.split(`
`),s=[];for(const n of a){const o=n.trim();if(o.startsWith("print(")&&o.endsWith(")")){const r=o.slice(6,-1).trim();r.startsWith("'")&&r.endsWith("'")||r.startsWith('"')&&r.endsWith('"')?s.push(r.slice(1,-1)):s.push(r)}}return s}function mt(t){const a=t.split(`
`),s=new Set;for(const n of a){const o=n.trim(),r=o.match(/^import\s+([a-zA-Z0-9_, ]+)/),l=o.match(/^from\s+([a-zA-Z0-9_]+)\s+import/);r&&r[1]?r[1].split(",").forEach(i=>{const m=i.trim().split(" ")[0];m&&s.add(m)}):l&&l[1]&&s.add(l[1].trim())}return Array.from(s)}function pt(t){const a=t.matchAll(/input\(\s*(?:["'](.*?)["'])?\s*\)/g),s=[];for(const n of a)s.push(n[1]||"Enter value:");return s}function ut(t){return{extractedHtml:ct(t),prints:xt(t),imports:mt(t),hasInputs:/input\s*\(/.test(t),inputPrompts:pt(t)}}const bt=`
  body {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    color: #f1f5f9;
    background-color: #030712;
  }
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  ::-webkit-scrollbar-track {
    background: #0b0f19;
  }
  ::-webkit-scrollbar-thumb {
    background: #1e293b;
    border-radius: 9999px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #334155;
  }
  .glow-border {
    box-shadow: 0 0 15px -3px rgba(16, 185, 129, 0.15);
  }
`;function ht(t){return`
    let outputCount = 0;
    const initialLogs = ${JSON.stringify(t)};

    window.onload = function() {
      if (initialLogs && initialLogs.length > 0) {
        initialLogs.forEach(log => appendOutput(log, 'print'));
      } else {
        appendOutput('Python 3.12 Web Sandbox initialized and ready.', 'system');
      }

      // Enter key shortcut on parameter input
      const inputEl = document.getElementById('py-param-input');
      if (inputEl) {
        inputEl.addEventListener('keydown', function(e) {
          if (e.key === 'Enter') {
            executePythonTool();
          }
        });
      }
    };

    function appendOutput(text, type = 'print') {
      const container = document.getElementById('output-terminal');
      if (!container) return;

      outputCount++;
      const line = document.createElement('div');
      line.className = 'flex items-start gap-2.5 text-xs font-mono leading-relaxed py-0.5';

      let textClass = 'text-emerald-300';
      let icon = '&gt;';

      if (type === 'system') {
        textClass = 'text-slate-400 italic';
        icon = '#';
      } else if (type === 'error') {
        textClass = 'text-rose-400 font-semibold bg-rose-950/40 p-2 rounded-lg border border-rose-900/60 w-full';
        icon = '!';
      } else if (type === 'success') {
        textClass = 'text-emerald-400 font-bold';
        icon = '✓';
      } else if (type === 'input') {
        textClass = 'text-cyan-300 font-medium';
        icon = '➜';
      }

      line.innerHTML = '<span class="text-slate-600 select-none text-[11px] w-5 text-right shrink-0">' + outputCount + '</span>' +
                       '<span class="text-slate-500 select-none shrink-0">' + icon + '</span>' +
                       '<span class="' + textClass + ' break-words flex-1">' + escapeHtml(text) + '</span>';

      container.appendChild(line);
      container.scrollTop = container.scrollHeight;
    }

    function escapeHtml(str) {
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }

    function clearConsole() {
      const container = document.getElementById('output-terminal');
      if (container) {
        container.innerHTML = '';
        outputCount = 0;
        appendOutput('Console cleared. Ready for next execution.', 'system');
      }
    }

    function copyOutput() {
      const container = document.getElementById('output-terminal');
      if (!container) return;
      const text = container.innerText;
      navigator.clipboard.writeText(text).then(() => {
        const btn = document.getElementById('btn-copy');
        if (btn) {
          btn.innerHTML = '<i class="fa-solid fa-check text-emerald-400 mr-1"></i> Copied!';
          setTimeout(() => {
            btn.innerHTML = '<i class="fa-regular fa-copy mr-1"></i> Copy';
          }, 2000);
        }
      });
    }

    function executePythonTool() {
      const inputEl = document.getElementById('py-param-input');
      const paramVal = inputEl ? inputEl.value.trim() : '';
      const runBtn = document.getElementById('btn-run');
      const statusBadge = document.getElementById('status-badge');

      if (statusBadge) {
        statusBadge.textContent = 'RUNNING';
        statusBadge.className = 'px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-amber-950 text-amber-300 border border-amber-800';
      }

      if (runBtn) {
        runBtn.disabled = true;
        runBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-1.5"></i> Running...';
      }

      if (paramVal) {
        appendOutput('User Input: ' + paramVal, 'input');
      }

      setTimeout(() => {
        try {
          if (window.runPyLogic) {
            window.runPyLogic(paramVal);
          } else {
            appendOutput('Process finished with exit code 0.', 'success');
          }
        } catch (err) {
          appendOutput('Execution error: ' + err.message, 'error');
        }

        if (statusBadge) {
          statusBadge.textContent = 'READY';
          statusBadge.className = 'px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-emerald-950 text-emerald-300 border border-emerald-800';
        }

        if (runBtn) {
          runBtn.disabled = false;
          runBtn.innerHTML = '<i class="fa-solid fa-play text-xs mr-1.5"></i> Run Script';
        }
      }, 350);
    }
  `}function ft(t,a,s){if(s.extractedHtml&&(s.extractedHtml.includes("<html")||s.extractedHtml.includes("<!DOCTYPE")))return s.extractedHtml;const n=a||"Python Interactive Tool",o=s.imports.filter(m=>!["sys","os","math","time","json"].includes(m)),r=o.length>0?`pip install ${o.join(" ")}`:"pip install requests",l=s.inputPrompts[0]||"Enter test parameter, query, or arguments...",i=ht(s.prints);return`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${n} - Web Live Preview</title>
  <script src="https://cdn.tailwindcss.com"><\/script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <style>${bt}</style>
</head>
<body class="min-h-screen p-3 sm:p-4 flex flex-col bg-slate-950 text-slate-100">
  <div class="max-w-4xl w-full mx-auto flex-1 flex flex-col space-y-3">
    
    <!-- Top Header Bar -->
    <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 px-4 flex items-center justify-between shadow-lg backdrop-blur-md">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-lg shadow-inner">
          <i class="fa-brands fa-python"></i>
        </div>
        <div>
          <h1 class="text-sm font-bold text-slate-100 flex items-center gap-2 leading-none">
            <span>${n}</span>
            <span class="text-[10px] px-2 py-0.5 rounded-full bg-indigo-950 border border-indigo-800 text-indigo-300 font-medium hidden sm:inline">
              Web Preview UI
            </span>
          </h1>
          <p class="text-[11px] text-slate-400 mt-1">Python 3.12 Browser Execution Sandbox</p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <span id="status-badge" class="px-2.5 py-0.5 rounded text-[10px] font-bold font-mono bg-emerald-950 text-emerald-300 border border-emerald-800">
          READY
        </span>
      </div>
    </div>

    <!-- Interactive Controls Bar -->
    <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 shadow-md space-y-2.5">
      <div class="flex items-center gap-2">
        <div class="relative flex-1">
          <i class="fa-solid fa-terminal absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs"></i>
          <input
            id="py-param-input"
            type="text"
            placeholder="${l}"
            class="w-full pl-8 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-indigo-500 transition"
          />
        </div>
        <button
          id="btn-run"
          onclick="executePythonTool()"
          class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/30 transition flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <i class="fa-solid fa-play text-xs"></i>
          <span>Run Script</span>
        </button>
      </div>

      <!-- Quick Action Buttons -->
      <div class="flex items-center justify-between text-xs text-slate-400 pt-0.5 px-1">
        <span class="text-[11px] flex items-center gap-1.5 text-slate-500">
          <i class="fa-solid fa-bolt text-amber-400/80"></i>
          <span>Press Enter to execute</span>
        </span>
        <div class="flex items-center gap-2">
          <button
            id="btn-copy"
            onclick="copyOutput()"
            class="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-[11px] transition flex items-center gap-1 cursor-pointer"
          >
            <i class="fa-regular fa-copy"></i>
            <span>Copy</span>
          </button>
          <button
            onclick="clearConsole()"
            class="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-[11px] transition flex items-center gap-1 cursor-pointer"
          >
            <i class="fa-solid fa-rotate-right text-[10px]"></i>
            <span>Clear</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Output Terminal Screen -->
    <div class="flex-1 min-h-[220px] bg-slate-950 border border-slate-800/90 rounded-2xl p-3.5 shadow-inner flex flex-col">
      <div class="flex items-center justify-between pb-2 mb-2 border-b border-slate-900 text-[11px] text-slate-500 font-mono">
        <span class="flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Live Standard Output (stdout)
        </span>
        <span>UTF-8</span>
      </div>
      <div id="output-terminal" class="flex-1 overflow-y-auto max-h-[360px] space-y-1 select-text"></div>
    </div>

    <!-- Terminal & Termux CLI Guide -->
    <div class="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3 text-xs text-slate-300">
      <div class="flex items-center justify-between">
        <span class="font-bold flex items-center gap-1.5 text-slate-300 text-[11px]">
          <i class="fa-solid fa-laptop-code text-indigo-400"></i>
          <span>Run in PC / Termux CLI</span>
        </span>
        <span class="text-[10px] text-slate-500 font-mono">Terminal Instructions</span>
      </div>
      <div class="mt-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800 font-mono text-[11px] text-indigo-300 flex items-center justify-between gap-2 overflow-x-auto">
        <code>${r} &amp;&amp; python main.py</code>
        <button
          onclick="navigator.clipboard.writeText('${r} &amp;&amp; python main.py'); this.innerText='Copied!';"
          class="px-2 py-0.5 bg-indigo-950 text-indigo-300 border border-indigo-800 hover:bg-indigo-900 rounded text-[10px] font-sans font-semibold shrink-0 cursor-pointer"
        >
          Copy
        </button>
      </div>
    </div>

  </div>

  <script>${i}<\/script>
</body>
</html>`}function gt(t,a){const s=ut(t);return ft(t,a,s)}const wt=({code:t,title:a,reloadKey:s,deviceMode:n})=>{const o=x.useMemo(()=>gt(t,a),[t,a]),r=()=>n==="mobile"?"max-w-[420px] shadow-2xl border-x border-slate-800 my-auto rounded-3xl h-[92%] overflow-hidden":n==="tablet"?"max-w-3xl shadow-2xl border-x border-slate-800 my-auto rounded-3xl h-[94%] overflow-hidden":"w-full h-full";return e.jsx("div",{className:"w-full h-full bg-slate-950 flex items-center justify-center overflow-hidden",children:e.jsx("div",{className:`${r()} w-full bg-slate-900 transition-all duration-300 relative`,children:e.jsx("iframe",{srcDoc:o,title:`${a} - Python HTML Preview`,sandbox:"allow-scripts allow-modals allow-forms allow-popups allow-same-origin",className:"w-full h-full border-0 bg-slate-900"},`${s}-python-web`)})})};function yt(t){const a=t.match(/(?:html|template|markup|render)\s*=\s*[`"']([\s\S]*?(?:<!DOCTYPE|<html|<body|<div|<main|<section|<table|<h[1-6]|<form)[\s\S]*?)[`"']/i);if(a&&a[1]&&a[1].includes("<"))return a[1].trim();const s=t.match(/innerHTML\s*=\s*[`"']([\s\S]*?(?:<div|<main|<table|<section|<h[1-6]|<p|<button)[\s\S]*?)[`"']/i);return s&&s[1]?s[1].trim():null}function vt(t,a="JavaScript App"){if(t.includes("<html")||t.includes("<!DOCTYPE")||t.includes("<body")&&t.includes("</body>"))return t;const s=yt(t);if(s&&(s.includes("<!DOCTYPE")||s.includes("<html")))return s;const n=t.includes("React.")||t.includes("useState")||t.includes("useEffect")||t.includes("ReactDOM")||/<[A-Z][A-Za-z0-9]*[\s\/>]/.test(t),o=JSON.stringify(t);return`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${(a||"Interactive Web Application").replace(/"/g,"&quot;")} - HTML Preview UI</title>
  <!-- Tailwind CSS & FontAwesome for rich modern web UI -->
  <script src="https://cdn.tailwindcss.com"><\/script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  
  ${n?`
  <!-- Babel standalone for React / JSX transpilation -->
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"><\/script>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"><\/script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"><\/script>
  `:""}

  <style>
    body {
      font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      margin: 0;
      padding: 0;
      min-height: 100vh;
      background-color: #0b0f19;
      color: #f1f5f9;
    }
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-thumb { background: #334155; border-radius: 9999px; }
  </style>
</head>
<body class="p-3 sm:p-6 flex flex-col items-center">
  <div class="w-full h-full flex flex-col p-2 sm:p-4 space-y-3">
    <!-- Live DOM / Web Viewport Direct Mount -->
    <div id="web-viewport" class="w-full text-slate-100 flex-1">
      ${s||""}
      <div id="app"></div>
      <div id="root"></div>
    </div>

    <!-- Interactive Console & Output Logs Card -->
    <div class="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
      <div class="flex items-center justify-between border-b border-slate-800 pb-3">
        <div class="flex items-center gap-2 text-xs font-bold text-slate-200">
          <i class="fa-solid fa-terminal text-emerald-400"></i>
          <span>Console & Execution Output</span>
        </div>
        <div class="flex items-center gap-2">
          <span id="log-count-badge" class="text-[11px] text-slate-400 font-mono">0 logs</span>
          <button onclick="clearConsole()" class="text-xs text-slate-400 hover:text-slate-200 underline">Clear</button>
        </div>
      </div>

      <!-- Terminal Output Screen -->
      <div id="output-screen" class="bg-slate-950 border border-slate-800 rounded-2xl p-4 min-h-[160px] max-h-[360px] overflow-y-auto font-mono text-xs text-emerald-300 space-y-1">
        <div class="text-slate-500">// Script loaded. Executing automatically...</div>
      </div>

      <!-- Quick Interactive REPL Evaluator -->
      <div class="flex items-center gap-2 pt-1">
        <div class="relative flex-1">
          <span class="absolute left-3 top-2.5 text-slate-500 font-mono text-xs">&gt;</span>
          <input 
            id="repl-input" 
            type="text" 
            placeholder="Evaluate JavaScript expression (e.g. 2 + 2, typeof myVar, Math.PI)..." 
            onkeydown="if(event.key === 'Enter') evalRepl()"
            class="w-full pl-7 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 font-mono"
          />
        </div>
        <button onclick="evalRepl()" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs shadow-md transition active:scale-95">
          Eval
        </button>
      </div>
    </div>

  </div>

  <!-- Raw user code embedded safely as JSON -->
  <script id="user-code-storage" type="application/json">
    ${o}
  <\/script>

  <script>
    const screen = document.getElementById('output-screen');
    let totalLogs = 0;

    function updateLogCount() {
      const b = document.getElementById('log-count-badge');
      if (b) b.textContent = totalLogs + (totalLogs === 1 ? ' log' : ' logs');
    }

    function clearConsole() {
      screen.innerHTML = '<div class="text-slate-500">// Console cleared.</div>';
      totalLogs = 0;
      updateLogCount();
    }

    function formatVal(v) {
      if (v === null) return 'null';
      if (v === undefined) return 'undefined';
      if (typeof v === 'function') return v.toString();
      if (typeof v === 'object') {
        try {
          return JSON.stringify(v, null, 2);
        } catch(e) {
          return String(v);
        }
      }
      return String(v);
    }

    function appendLog(val, type = 'log', label) {
      totalLogs++;
      updateLogCount();

      const line = document.createElement('div');
      line.className = 'flex items-start gap-2 py-0.5 leading-relaxed';

      const chevron = document.createElement('span');
      chevron.className = 'text-slate-600 select-none font-mono';
      chevron.textContent = '>';

      const content = document.createElement('span');
      content.className = 'font-mono whitespace-pre-wrap break-all';

      if (type === 'error') {
        content.className += ' text-rose-400 bg-rose-950/40 px-2 py-0.5 rounded border border-rose-900/50';
      } else if (type === 'warn') {
        content.className += ' text-amber-300';
      } else if (type === 'return') {
        content.className += ' text-cyan-300 font-bold';
      } else if (type === 'info') {
        content.className += ' text-indigo-300';
      } else {
        content.className += ' text-emerald-300';
      }

      const text = (label ? label + ': ' : '') + formatVal(val);
      content.textContent = text;

      line.appendChild(chevron);
      line.appendChild(content);
      screen.appendChild(line);
      screen.scrollTop = screen.scrollHeight;
    }

    // Intercept standard console methods
    const _log = console.log;
    const _error = console.error;
    const _warn = console.warn;
    const _info = console.info;

    console.log = function(...args) {
      _log.apply(console, args);
      args.forEach(a => appendLog(a, 'log'));
    };
    console.error = function(...args) {
      _error.apply(console, args);
      args.forEach(a => appendLog(a, 'error'));
    };
    console.warn = function(...args) {
      _warn.apply(console, args);
      args.forEach(a => appendLog(a, 'warn'));
    };
    console.info = function(...args) {
      _info.apply(console, args);
      args.forEach(a => appendLog(a, 'info'));
    };

    window.onerror = function(msg, url, line) {
      appendLog(msg + (line ? ' (Line ' + line + ')' : ''), 'error', 'Uncaught Error');
      return false;
    };

    function evalRepl() {
      const inp = document.getElementById('repl-input');
      const val = inp.value.trim();
      if (!val) return;
      appendLog(val, 'info', 'Eval');
      try {
        const res = (0, eval)(val);
        appendLog(res, 'return', 'Result');
      } catch(err) {
        appendLog(err.message, 'error');
      }
      inp.value = '';
    }

    function runCode() {
      screen.innerHTML = '';
      totalLogs = 0;
      updateLogCount();

      const badge = document.getElementById('ui-badge');
      if (badge) {
        badge.textContent = 'Executing...';
        badge.className = 'px-2.5 py-0.5 rounded-full bg-amber-950 border border-amber-800 text-amber-400 text-[10px] font-mono font-bold';
      }

      try {
        const storageEl = document.getElementById('user-code-storage');
        if (!storageEl) return;
        let codeToRun = JSON.parse(storageEl.textContent || '""').trim();

        if (!codeToRun) {
          appendLog('No code provided to execute.', 'warn');
          return;
        }

        // Clean module exports if present (e.g. export default, export const)
        codeToRun = codeToRun
          .replace(/export\\s+default\\s+/g, 'const __default_export__ = ')
          .replace(/export\\s+(const|let|var|function|class)\\s+/g, '$1 ');

        // Check if Babel is available (for JSX / React / TypeScript)
        if (typeof Babel !== 'undefined') {
          try {
            codeToRun = Babel.transform(codeToRun, { presets: ['env', 'react'] }).code;
          } catch(transpileErr) {
            console.warn('Babel transpile notice:', transpileErr);
          }
        }

        let result;
        try {
          result = (0, eval)(codeToRun);
        } catch(directErr) {
          try {
            const fn = new Function(codeToRun);
            result = fn();
          } catch(fnErr) {
            throw directErr;
          }
        }

        if (totalLogs === 0) {
          if (result !== undefined) {
            appendLog(result, 'return', 'Return Value');
          } else {
            appendLog('JavaScript executed successfully with 0 errors.', 'log');
          }
        }

        if (badge) {
          badge.textContent = 'Active (Live)';
          badge.className = 'px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 text-[10px] font-mono font-bold';
        }
      } catch(err) {
        appendLog(err.message, 'error', 'Execution Error');
        if (badge) {
          badge.textContent = 'Failed';
          badge.className = 'px-2.5 py-0.5 rounded-full bg-rose-950 border border-rose-800 text-rose-400 text-[10px] font-mono font-bold';
        }
      }
    }

    // Automatically run on load
    window.addEventListener('DOMContentLoaded', () => {
      setTimeout(runCode, 50);
    });
  <\/script>
</body>
</html>`}function jt(t,a){const s=JSON.stringify(t);return`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${a} - SQL Result</title>
  <script src="https://cdn.tailwindcss.com"><\/script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
    body { font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: #0f172a; }
    ::-webkit-scrollbar-thumb { background: #334155; border-radius: 9999px; }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen p-3 sm:p-5 flex flex-col">
  <!-- Top Query Bar -->
  <div class="flex items-center justify-between flex-wrap gap-2 pb-3 mb-3 border-b border-slate-800">
    <div class="flex items-center gap-2 text-xs">
      <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
      <span class="font-bold text-slate-200">PostgreSQL Live Sandbox</span>
      <span class="text-slate-500">•</span>
      <span class="text-emerald-400 font-mono text-[11px]">Query Executed (0.012s)</span>
      <span class="text-slate-500">•</span>
      <span id="row-count-badge" class="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono">6 Rows</span>
    </div>

    <div class="flex items-center gap-2">
      <div class="relative">
        <i class="fa-solid fa-magnifying-glass absolute left-2.5 top-2.5 text-slate-500 text-xs"></i>
        <input 
          id="filter-input" 
          oninput="filterTable()" 
          type="text" 
          placeholder="Filter results..." 
          class="pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 placeholder-slate-500 w-36 sm:w-48"
        />
      </div>
      <button 
        onclick="exportCSV()" 
        class="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/80 text-xs font-semibold flex items-center gap-1.5 transition"
        title="Export CSV"
      >
        <i class="fa-solid fa-download text-indigo-400 text-xs"></i>
        <span class="hidden sm:inline">Export</span>
      </button>
    </div>
  </div>

  <!-- Table Container -->
  <div class="flex-1 bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col">
    <div class="overflow-x-auto flex-1">
      <table id="results-table" class="w-full text-left border-collapse text-xs">
        <thead class="bg-slate-950/80 text-slate-400 uppercase tracking-wider border-b border-slate-800 sticky top-0 backdrop-blur-sm">
          <tr>
            <th class="p-3 font-semibold text-slate-500 text-[11px] w-12 text-center">#</th>
            <th class="p-3 font-semibold">Order Month</th>
            <th class="p-3 font-semibold">Country</th>
            <th class="p-3 font-semibold text-right">Total Orders</th>
            <th class="p-3 font-semibold text-right">Gross Revenue</th>
            <th class="p-3 font-semibold text-right">Avg Order Value</th>
            <th class="p-3 font-semibold text-center">Rank</th>
          </tr>
        </thead>
        <tbody id="table-body" class="divide-y divide-slate-800/80 text-slate-300 font-mono">
          <!-- Populated by JS -->
        </tbody>
      </table>
    </div>

    <!-- Table Footer Status -->
    <div class="px-4 py-2.5 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between text-slate-400 text-[11px]">
      <div class="flex items-center gap-2">
        <i class="fa-solid fa-database text-amber-400"></i>
        <span>ecom_analytics_db • public.orders</span>
      </div>
      <div class="flex items-center gap-3">
        <span>Displaying all matching rows</span>
        <span class="text-emerald-400 font-bold">● Status: READY</span>
      </div>
    </div>
  </div>

  <script id="sql-query-data" type="application/json">
    ${s}
  <\/script>

  <script>
    const sampleRows = [
      { id: 1, month: '2026-08', country: 'United States', orders: '1,420', revenue: '$184,290.00', aov: '$129.78', rank: '1' },
      { id: 2, month: '2026-08', country: 'Germany', orders: '890', revenue: '$96,400.00', aov: '$108.31', rank: '2' },
      { id: 3, month: '2026-08', country: 'United Kingdom', orders: '740', revenue: '$82,150.00', aov: '$111.01', rank: '3' },
      { id: 4, month: '2026-07', country: 'United States', orders: '1,350', revenue: '$172,800.00', aov: '$128.00', rank: '1' },
      { id: 5, month: '2026-07', country: 'Germany', orders: '840', revenue: '$91,200.00', aov: '$108.57', rank: '2' },
      { id: 6, month: '2026-07', country: 'Canada', orders: '690', revenue: '$79,800.00', aov: '$115.65', rank: '3' },
    ];

    function renderRows(rows) {
      const tbody = document.getElementById('table-body');
      if (!rows.length) {
        tbody.innerHTML = '<tr><td colspan="7" class="p-8 text-center text-slate-500">No matching records found.</td></tr>';
        return;
      }

      tbody.innerHTML = rows.map((r, i) => \`
        <tr class="hover:bg-slate-800/60 transition-colors">
          <td class="p-3 text-slate-500 text-center font-sans">\${r.id}</td>
          <td class="p-3 text-slate-200 font-medium font-sans">\${r.month}</td>
          <td class="p-3 text-indigo-300 font-medium font-sans">
            <span class="inline-flex items-center gap-1.5">
              <i class="fa-solid fa-location-dot text-[10px] text-slate-500"></i>
              \${r.country}
            </span>
          </td>
          <td class="p-3 text-right text-slate-300">\${r.orders}</td>
          <td class="p-3 text-right text-emerald-400 font-bold">\${r.revenue}</td>
          <td class="p-3 text-right text-amber-300">\${r.aov}</td>
          <td class="p-3 text-center">
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold \${r.rank === '1' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-slate-800 text-slate-300'}">
              #\${r.rank}
            </span>
          </td>
        </tr>
      \`).join('');

      document.getElementById('row-count-badge').textContent = rows.length + ' Rows';
    }

    function filterTable() {
      const query = (document.getElementById('filter-input').value || '').toLowerCase();
      const filtered = sampleRows.filter(r => 
        r.country.toLowerCase().includes(query) ||
        r.month.toLowerCase().includes(query) ||
        r.revenue.toLowerCase().includes(query)
      );
      renderRows(filtered);
    }

    function exportCSV() {
      const headers = ['id', 'order_month', 'country', 'total_orders', 'gross_revenue', 'avg_order_value', 'revenue_rank'];
      const rows = sampleRows.map(r => [r.id, r.month, r.country, r.orders.replace(',', ''), r.revenue.replace(/[$',]/g, ''), r.aov.replace(/[$',]/g, ''), r.rank]);
      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', 'sql_analytics_export.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    renderRows(sampleRows);
  <\/script>
</body>
</html>`}function Nt(t,a){return`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${a} - CSS Preview</title>
  <script src="https://cdn.tailwindcss.com"><\/script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
    body { font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    ${t}
  </style>
</head>
<body class="p-4 sm:p-6 bg-slate-950 text-slate-100 min-h-screen flex flex-col items-center justify-center">
  <div class="w-full max-w-2xl space-y-6">
    <!-- Live Styled Component Sandbox -->
    <div class="p-8 sm:p-12 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl flex flex-col items-center justify-center text-center space-y-5">
      <div class="demo-box glass-card space-y-3 p-6 rounded-2xl">
        <h2 class="text-xl sm:text-2xl font-bold text-white tracking-tight">Active CSS Styled Component</h2>
        <p class="text-sm text-slate-300 max-w-md">Your CSS rules, animations, and class declarations are live and rendered below.</p>
        
        <div class="pt-2 flex flex-wrap items-center justify-center gap-3">
          <button class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg transition active:scale-95">
            Primary Action
          </button>
          <button class="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition">
            Secondary Button
          </button>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`}function kt(t,a){const s=JSON.stringify(t);return`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${a} - Markdown Preview</title>
  <script src="https://cdn.tailwindcss.com"><\/script>
  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"><\/script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.5.0/github-markdown-dark.min.css">
  <style>
    body { background-color: #0b0f19; }
    .markdown-body { background-color: transparent !important; color: #e2e8f0; font-family: ui-sans-serif, system-ui, sans-serif; }
    .markdown-body pre { background-color: #030712 !important; border: 1px solid #1f2937; border-radius: 12px; }
    .markdown-body table { border-collapse: collapse; }
    .markdown-body table th, .markdown-body table td { border: 1px solid #334155; }
    .markdown-body table tr { background-color: transparent !important; }
    .markdown-body table tr:nth-child(2n) { background-color: #0f172a !important; }
  </style>
</head>
<body class="p-4 sm:p-8 min-h-screen text-slate-100 flex justify-center">
  <div class="w-full max-w-4xl">
    <div id="content" class="markdown-body"></div>
  </div>

  <script id="raw-markdown" type="application/json">
    ${s}
  <\/script>

  <script>
    const md = JSON.parse(document.getElementById('raw-markdown').textContent || '""');
    document.getElementById('content').innerHTML = marked.parse(md);
  <\/script>
</body>
</html>`}function Ct(t,a,s){const n=JSON.stringify(t);return`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${s} - Output</title>
  <script src="https://cdn.tailwindcss.com"><\/script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
    body { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; }
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: #030712; }
    ::-webkit-scrollbar-thumb { background: #334155; border-radius: 9999px; }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen p-3 sm:p-5 flex flex-col">
  <!-- Top Terminal Header -->
  <div class="flex items-center justify-between px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-t-2xl text-xs">
    <div class="flex items-center gap-2">
      <span class="w-3 h-3 rounded-full bg-rose-500/80"></span>
      <span class="w-3 h-3 rounded-full bg-amber-500/80"></span>
      <span class="w-3 h-3 rounded-full bg-emerald-500/80"></span>
      <span class="ml-2 font-bold text-slate-300">${a} Console</span>
    </div>
    <div class="flex items-center gap-2 text-[11px] text-slate-400">
      <span class="text-emerald-400 font-semibold">● Process Completed (Exit 0)</span>
    </div>
  </div>

  <!-- Terminal Body -->
  <div id="terminal-screen" class="flex-1 bg-black/90 border-x border-b border-slate-800 rounded-b-2xl p-4 sm:p-5 overflow-auto text-xs sm:text-sm text-emerald-400 leading-relaxed space-y-1.5 font-mono">
    <!-- Populated by script -->
  </div>

  <script id="raw-code" type="application/json">
    ${n}
  <\/script>

  <script>
    const code = JSON.parse(document.getElementById('raw-code').textContent || '""');
    const lang = "${a}";
    const term = document.getElementById('terminal-screen');

    function log(line, color = 'text-emerald-300') {
      const el = document.createElement('div');
      el.className = 'flex items-start gap-2 ' + color;
      el.innerHTML = '<span class="text-slate-600 select-none">&gt;</span> <span>' + line + '</span>';
      term.appendChild(el);
    }

    if (lang === 'Bash') {
      log('$ ' + (code.split('\\n').find(l => l.trim().length > 0 && !l.startsWith('#')) || 'bash script.sh'), 'text-slate-400 font-bold');
      log('[1/4] Checking CPU Average Load... OK (Load: 0.12, 0.08, 0.05)');
      log('[2/4] Inspecting RAM Consumption... Used: 412MB / 2048MB (20.12%)');
      log('[3/4] Primary Filesystem Usage... 24% used (48GB free)');
      log('[4/4] Generating diagnostic archive snapshot... SUCCESS');
      log('✓ Backup archive saved: /var/backups/server_snapshot.tar.gz', 'text-emerald-400 font-bold');
    } else if (lang === 'PHP') {
      log('[PHP 8.2 CLI Engine Initialized]', 'text-indigo-400');
      log('Simulating REST endpoint call: GET /api/health');
      log('Response Status: 200 OK');
      log('{\\n  "status": "ok",\\n  "timestamp": ' + Date.now() + ',\\n  "server": "PHP 8.2 FPM",\\n  "memory_usage": "1.2MB"\\n}');
    } else if (lang === 'Java') {
      log('[OpenJDK 21.0.2 Sandbox]', 'text-red-400');
      log('javac CacheManager.java && java CacheManager');
      log('=== Java LRU Cache Simulation ===');
      log('Cache initialized with capacity: 3');
      log('Put [Session_A = 101], Put [Session_B = 102], Put [Session_C = 103]');
      log('Accessed Session_A (Updated hit count)');
      log('Evicted LRU item: Session_B');
      log('Active cache keys: [Session_C, Session_A, Session_D]');
    } else if (lang === 'C') {
      log('[GCC 12.2.0 Compiler: -Wall -O2]', 'text-sky-400');
      log('=== Dynamic Vector Allocator ===');
      log('Allocated initial block (Capacity: 8 items, 64 bytes)');
      log('Elements inserted: [10, 20, 30, 40, 50]');
      log('Vector memory safely freed. 0 bytes leaked.');
    } else if (lang === 'C++') {
      log('[G++ 13.1.0 ISO C++20 Standard]', 'text-blue-400');
      log('=== Modern C++ ThreadPool Execution ===');
      log('Worker #1 completed scheduled task async.');
      log('Worker #2 completed scheduled task async.');
      log('Worker #3 completed scheduled task async.');
      log('All tasks finished gracefully with zero contention.');
    } else if (lang === 'JSON' || lang === 'XML') {
      log('[' + lang + ' Document Parsed Successfully]', 'text-amber-400');
      log('Format validation: 0 syntax errors.');
      log('Total characters: ' + code.length);
    } else {
      log('[' + lang + ' Execution Engine Ready]', 'text-indigo-400');
      log('Process finished with exit code 0.');
    }
  <\/script>
</body>
</html>`}function St(t,a,s="Tool"){return t.includes("<html")||t.includes("<!DOCTYPE")||t.includes("<body")&&t.includes("</body>")?t:a==="CSS"?Nt(t,s):a==="SQL"?jt(t,s):a==="Markdown"?kt(t,s):Ct(t,a,s)}const Tt=({code:t,language:a,title:s,reloadKey:n,deviceMode:o})=>{const r=a==="JavaScript"||a==="TypeScript",l=a==="JSON",i=a==="Python",m=()=>o==="mobile"?"max-w-[420px] shadow-2xl border-x border-slate-800 my-auto rounded-3xl h-[92%] overflow-hidden":o==="tablet"?"max-w-3xl shadow-2xl border-x border-slate-800 my-auto rounded-3xl h-[94%] overflow-hidden":"w-full h-full";if(l)return e.jsx("div",{className:"w-full h-full p-4 overflow-auto bg-slate-950",children:e.jsx(dt,{code:t})});if(i)return e.jsx("div",{className:"w-full h-full overflow-hidden bg-slate-950",children:e.jsx(wt,{code:t,title:s,reloadKey:n,deviceMode:o})});const d=r?vt(t,s):St(t,a,s),c=a==="HTML"&&(t.includes("<html")||t.includes("<!DOCTYPE")||t.includes("<body"))?"bg-white":"bg-slate-950";return e.jsx("div",{className:"w-full h-full bg-slate-950 flex items-center justify-center overflow-hidden",children:e.jsx("div",{className:`${m()} w-full ${c} transition-all duration-300 relative`,children:e.jsx("iframe",{srcDoc:d,title:s,sandbox:"allow-scripts allow-modals allow-forms allow-popups allow-same-origin",className:`w-full h-full border-0 ${c}`},n)})})},Et=({codeId:t,toolTitle:a,creatorUid:s,creatorName:n,creatorEmail:o,isOpen:r,onClose:l,onSuccess:i})=>{const{currentUser:m}=L(),{showToast:d}=E(),u=I(n,o,"Creator"),[c,b]=x.useState(100),[h,w]=x.useState(""),[j,p]=x.useState(!1),[y,g]=x.useState(!1);if(!r)return null;const N=le(c),k=async()=>{if(!m){d("Please sign in to tip the creator","info");return}if(c<=0){d("Please choose a valid tip amount in BDT","warning");return}try{p(!0),await De({codeId:t,toolTitle:a,senderUid:m.uid,senderName:I(m.displayName,m.email,"Supporter"),senderEmail:m.email||"",creatorUid:s||"",creatorEmail:o||"",amountBDT:c,amountUSD:N,message:h}),g(!0),d(`Thank you! ৳${c} ($${N.toFixed(2)}) tip sent to ${u}!`,"success"),i&&i(),setTimeout(()=>{g(!1),l()},2e3)}catch(f){d(f.message||"Failed to send tip","error")}finally{p(!1)}};return e.jsx("div",{className:"fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150",children:e.jsxs("div",{className:"w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-white space-y-5",children:[e.jsxs("div",{className:"flex items-start justify-between",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"p-3 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30",children:e.jsx(B,{className:"w-6 h-6 fill-rose-500/30"})}),e.jsxs("div",{children:[e.jsx("h3",{className:"font-bold text-lg",children:"Tip & Support Creator"}),e.jsxs("p",{className:"text-xs text-slate-400",children:["Supporting ",e.jsx("span",{className:"text-rose-300 font-semibold",children:u})]})]})]}),e.jsx("button",{onClick:l,className:"p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition",children:e.jsx(R,{className:"w-4 h-4"})})]}),y?e.jsxs("div",{className:"py-8 text-center space-y-2.5",children:[e.jsx(P,{className:"w-14 h-14 text-emerald-400 mx-auto animate-bounce"}),e.jsx("p",{className:"font-bold text-base text-emerald-400",children:"Tip Sent Successfully!"}),e.jsxs("p",{className:"text-xs text-slate-300",children:["The creator received ",e.jsx("span",{className:"font-bold text-amber-300",children:Oe(c)})," (",V(N),") in their creator wallet!"]})]}):e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"space-y-2",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("label",{className:"text-xs font-semibold text-slate-300",children:"Select Tip Amount (BDT ৳)"}),e.jsxs("span",{className:"text-[11px] text-amber-400 font-semibold flex items-center gap-1",children:[e.jsx($e,{className:"w-3 h-3"})," Rate: 1 USD = 120 BDT"]})]}),e.jsx("div",{className:"grid grid-cols-5 gap-1.5",children:[50,100,200,500,1e3].map(f=>e.jsxs("button",{type:"button",onClick:()=>b(f),className:`py-2.5 px-1 rounded-xl font-bold text-xs transition border flex flex-col items-center justify-center ${c===f?"bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-600/30":"bg-slate-800/80 text-slate-300 border-slate-700 hover:border-slate-600 hover:text-white"}`,children:[e.jsxs("span",{children:["৳",f]}),e.jsxs("span",{className:"text-[9px] opacity-75 font-normal",children:["~$",le(f)]})]},f))})]}),e.jsxs("div",{className:"space-y-1",children:[e.jsx("label",{className:"text-xs font-semibold text-slate-300",children:"Custom Amount (৳ BDT)"}),e.jsxs("div",{className:"relative",children:[e.jsx("span",{className:"absolute left-3.5 top-1/2 -translate-y-1/2 text-rose-400 font-bold text-base",children:"৳"}),e.jsx("input",{type:"number",min:"10",step:"10",value:c||"",onChange:f=>b(Math.max(0,parseInt(f.target.value,10)||0)),placeholder:"Enter amount in Taka (e.g. 150)",className:"w-full pl-9 pr-24 py-2.5 text-sm rounded-xl bg-slate-950 border border-slate-800 text-white font-bold focus:outline-hidden focus:border-rose-500"}),e.jsxs("span",{className:"absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 bg-slate-900 px-2 py-1 rounded-md border border-slate-800",children:["≈ ",V(N)]})]})]}),e.jsxs("div",{className:"space-y-1",children:[e.jsx("label",{className:"text-xs font-semibold text-slate-300",children:"Encouragement Note (Optional)"}),e.jsx("input",{type:"text",value:h,onChange:f=>w(f.target.value),placeholder:"e.g. Amazing web tool! Keep building great things.",className:"w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-hidden focus:border-rose-500"})]}),e.jsxs("div",{className:"p-3 bg-slate-950/80 rounded-2xl border border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between",children:[e.jsxs("span",{children:["Tool: ",e.jsx("strong",{className:"text-slate-200",children:a})]}),e.jsx("span",{className:"text-emerald-400 font-semibold",children:"Instant Wallet Credit"})]}),e.jsxs("div",{className:"flex items-center justify-end gap-2 pt-1",children:[e.jsx("button",{onClick:l,className:"px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800 transition",children:"Cancel"}),e.jsxs("button",{disabled:j||c<=0,onClick:k,className:"px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-rose-600/30 transition disabled:opacity-50",children:[e.jsx(B,{className:"w-4 h-4 fill-white"}),e.jsx("span",{children:j?"Processing Tip...":`Send ৳${c} (${V(N)}) Tip`})]})]})]})]})})},Lt=({codeId:t,toolTitle:a,isOpen:s,onClose:n})=>{const{showToast:o}=E(),[r,l]=x.useState(!1),[i,m]=x.useState(!1);if(!s)return null;const u=`${window.location.origin}/#/code/${t}`,c=`<iframe 
  src="${u}" 
  width="100%" 
  height="600px" 
  frameborder="0" 
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
  allowfullscreen
></iframe>`,b=(h,w=!1)=>{navigator.clipboard.writeText(h),w?(m(!0),setTimeout(()=>m(!1),2e3)):(l(!0),setTimeout(()=>l(!1),2e3)),o("Copied to clipboard!","success")};return e.jsx("div",{className:"fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs",children:e.jsxs("div",{className:"w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-white space-y-5",children:[e.jsxs("div",{className:"flex items-start justify-between",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"p-3 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30",children:e.jsx(oe,{className:"w-6 h-6"})}),e.jsxs("div",{children:[e.jsx("h3",{className:"font-bold text-lg",children:"Share & Embed Tool"}),e.jsx("p",{className:"text-xs text-slate-400",children:a})]})]}),e.jsx("button",{onClick:n,className:"p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800",children:e.jsx(R,{className:"w-4 h-4"})})]}),e.jsxs("div",{className:"space-y-1.5",children:[e.jsx("label",{className:"text-xs font-semibold text-slate-300",children:"Direct Share Link"}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("input",{type:"text",readOnly:!0,value:u,className:"flex-1 px-3.5 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-mono"}),e.jsxs("button",{onClick:()=>b(u,!1),className:"px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition",children:[r?e.jsx(M,{className:"w-3.5 h-3.5"}):e.jsx(G,{className:"w-3.5 h-3.5"}),e.jsx("span",{children:r?"Copied":"Copy"})]})]})]}),e.jsxs("div",{className:"space-y-1.5",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("label",{className:"text-xs font-semibold text-slate-300",children:"Embed iFrame Widget"}),e.jsx("span",{className:"text-[10px] text-slate-500",children:"Insert into WordPress, Webflow, Notion or HTML"})]}),e.jsxs("div",{className:"relative",children:[e.jsx("pre",{className:"p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-mono text-[11px] overflow-x-auto",children:c}),e.jsxs("button",{onClick:()=>b(c,!0),className:"absolute right-2 top-2 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-semibold flex items-center gap-1 transition",children:[i?e.jsx(M,{className:"w-3 h-3 text-emerald-400"}):e.jsx(ce,{className:"w-3 h-3"}),e.jsx("span",{children:i?"Embed Code Copied":"Copy Code"})]})]})]}),e.jsx("div",{className:"flex items-center justify-end pt-2",children:e.jsx("button",{onClick:n,className:"px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold",children:"Done"})})]})})},Rt=({logs:t,onClear:a,isOpen:s,onToggle:n})=>{const[o,r]=x.useState("all"),l=t.filter(d=>o==="error"?d.type==="error":o==="warn"?d.type==="warn":!0),i=t.filter(d=>d.type==="error").length,m=t.filter(d=>d.type==="warn").length;return e.jsxs("div",{className:"border-t border-slate-800 bg-slate-950 flex flex-col transition-all",children:[e.jsxs("div",{className:"flex items-center justify-between px-4 py-2 border-b border-slate-800/80 bg-slate-900/60 text-xs",children:[e.jsxs("button",{onClick:n,className:"flex items-center gap-2 font-mono font-semibold text-slate-300 hover:text-white",children:[e.jsx(ue,{className:"w-3.5 h-3.5 text-emerald-400"}),e.jsx("span",{children:"Console"}),t.length>0&&e.jsx("span",{className:"px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px] text-slate-400 font-sans",children:t.length}),i>0&&e.jsxs("span",{className:"px-1.5 py-0.2 rounded-full bg-rose-950/80 text-[10px] text-rose-400 font-sans font-bold flex items-center gap-1",children:[e.jsx(q,{className:"w-2.5 h-2.5"})," ",i]}),s?e.jsx(Pe,{className:"w-3.5 h-3.5"}):e.jsx(ze,{className:"w-3.5 h-3.5"})]}),s&&e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsxs("div",{className:"flex items-center bg-slate-950 rounded-lg p-0.5 border border-slate-800 text-[10px]",children:[e.jsx("button",{onClick:()=>r("all"),className:`px-2 py-0.5 rounded-md ${o==="all"?"bg-slate-800 text-white":"text-slate-400"}`,children:"All"}),e.jsxs("button",{onClick:()=>r("error"),className:`px-2 py-0.5 rounded-md ${o==="error"?"bg-rose-900/60 text-rose-300":"text-slate-400"}`,children:["Errors (",i,")"]}),e.jsxs("button",{onClick:()=>r("warn"),className:`px-2 py-0.5 rounded-md ${o==="warn"?"bg-amber-900/60 text-amber-300":"text-slate-400"}`,children:["Warns (",m,")"]})]}),e.jsx("button",{onClick:a,className:"p-1 text-slate-400 hover:text-rose-400 rounded-md hover:bg-slate-800",title:"Clear Console",children:e.jsx(qe,{className:"w-3 h-3"})})]})]}),s&&e.jsx("div",{className:"h-44 overflow-y-auto p-3 font-mono text-[11px] space-y-1 bg-slate-950/90 select-text",children:l.length===0?e.jsx("p",{className:"text-slate-600 italic py-4 text-center",children:"No console output recorded yet..."}):l.map((d,u)=>e.jsxs("div",{className:`flex items-start gap-2 py-1 px-2 rounded-md ${d.type==="error"?"bg-rose-950/30 text-rose-300 border-l-2 border-rose-500":d.type==="warn"?"bg-amber-950/30 text-amber-300 border-l-2 border-amber-500":"text-slate-300 hover:bg-slate-900/50"}`,children:[e.jsx("span",{className:"text-slate-500 text-[9px] shrink-0 pt-0.5",children:new Date(d.timestamp).toLocaleTimeString()}),e.jsxs("span",{className:"shrink-0 pt-0.5",children:[d.type==="error"&&e.jsx(q,{className:"w-3 h-3 text-rose-400"}),d.type==="warn"&&e.jsx(Me,{className:"w-3 h-3 text-amber-400"}),d.type==="info"&&e.jsx(ne,{className:"w-3 h-3 text-sky-400"})]}),e.jsx("span",{className:"whitespace-pre-wrap break-all flex-1",children:d.message})]},u))})]})},Ot=({code:t,isOpen:a,onClose:s,onConfirmRemix:n})=>a?e.jsx("div",{className:"fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs",children:e.jsxs("div",{className:"w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-white space-y-5",children:[e.jsxs("div",{className:"flex items-start justify-between",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"p-3 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30",children:e.jsx(pe,{className:"w-6 h-6"})}),e.jsxs("div",{children:[e.jsx("h3",{className:"font-bold text-lg",children:"Fork & Remix Tool"}),e.jsx("p",{className:"text-xs text-slate-400",children:"Build on top of existing community code"})]})]}),e.jsx("button",{onClick:s,className:"p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800",children:e.jsx(R,{className:"w-4 h-4"})})]}),e.jsxs("div",{className:"p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-xs",children:[e.jsxs("div",{className:"flex items-center justify-between text-slate-400",children:[e.jsx("span",{children:"Base Tool:"}),e.jsx("span",{className:"font-bold text-slate-200",children:t.title})]}),e.jsxs("div",{className:"flex items-center justify-between text-slate-400",children:[e.jsx("span",{children:"Original Author:"}),e.jsx("span",{className:"font-semibold text-cyan-400",children:t.creatorName||t.creatorEmail||"CodeHub Community"})]}),e.jsx("div",{className:"text-[11px] text-slate-500 pt-2 border-t border-slate-800/80",children:"💡 Remixing clones the HTML, CSS, and JS into your Creator Studio so you can add features, customize styling, and publish your own version with automatic attribution!"})]}),e.jsxs("div",{className:"flex items-center justify-end gap-2 pt-2",children:[e.jsx("button",{onClick:s,className:"px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800",children:"Cancel"}),e.jsxs("button",{onClick:()=>n(t),className:"px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-cyan-600/30 transition",children:[e.jsx(Q,{className:"w-3.5 h-3.5"}),e.jsx("span",{children:"Open in Remix Editor"}),e.jsx(z,{className:"w-3.5 h-3.5"})]})]})]})}):null,$t=({codeId:t})=>{const{currentUser:a}=L(),{showToast:s}=E(),[n,o]=x.useState([]),[r,l]=x.useState(!0),[i,m]=x.useState(5),[d,u]=x.useState(""),[c,b]=x.useState(!1),h=async()=>{try{l(!0);const p=await Ae(t);o(p)}catch(p){console.error(p)}finally{l(!1)}};x.useEffect(()=>{t&&h()},[t]);const w=async p=>{if(p.preventDefault(),!a){s("Please sign in to leave a review","info");return}if(!d.trim()){s("Please write a short comment","warning");return}try{b(!0),await Fe(t,{uid:a.uid,name:I(a.displayName,a.email,"Developer"),email:a.email||""},i,d.trim()),s("Review submitted!","success"),u(""),h()}catch(y){s(y.message||"Failed to submit review","error")}finally{b(!1)}},j=n.length?(n.reduce((p,y)=>p+y.rating,0)/n.length).toFixed(1):"0.0";return e.jsxs("div",{className:"bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white space-y-6",children:[e.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20",children:e.jsx(me,{className:"w-6 h-6"})}),e.jsxs("div",{children:[e.jsx("h3",{className:"font-bold text-lg",children:"Reviews & Community Ratings"}),e.jsx("p",{className:"text-xs text-slate-400",children:"Feedback from developers using this tool"})]})]}),e.jsxs("div",{className:"flex items-center gap-3 bg-slate-950 px-4 py-2 rounded-2xl border border-slate-800",children:[e.jsx("div",{className:"flex items-center text-amber-400",children:[1,2,3,4,5].map(p=>e.jsx(O,{className:`w-4 h-4 ${p<=Math.round(Number(j))?"fill-amber-400 text-amber-400":"text-slate-700"}`},p))}),e.jsxs("div",{className:"text-right",children:[e.jsxs("p",{className:"text-sm font-black",children:[j," / 5.0"]}),e.jsxs("p",{className:"text-[10px] text-slate-500",children:[n.length," reviews"]})]})]})]}),e.jsxs("form",{onSubmit:w,className:"bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("span",{className:"text-xs font-semibold text-slate-300",children:"Rate this tool:"}),e.jsx("div",{className:"flex items-center gap-1",children:[1,2,3,4,5].map(p=>e.jsx("button",{type:"button",onClick:()=>m(p),className:"p-1 hover:scale-110 transition",children:e.jsx(O,{className:`w-5 h-5 ${p<=i?"fill-amber-400 text-amber-400":"text-slate-700 hover:text-amber-300"}`})},p))})]}),e.jsx("div",{className:"relative",children:e.jsx("textarea",{rows:2,value:d,onChange:p=>u(p.target.value),placeholder:a?"Write your thoughts, tips, or report bugs...":"Sign in to write a review...",disabled:!a,className:"w-full p-3 text-xs rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-hidden focus:border-indigo-500 disabled:opacity-50"})}),e.jsx("div",{className:"flex justify-end",children:e.jsxs("button",{type:"submit",disabled:c||!a||!d.trim(),className:"px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition disabled:opacity-50 shadow-md shadow-indigo-600/30",children:[e.jsx(Ye,{className:"w-3.5 h-3.5"}),e.jsx("span",{children:c?"Posting...":"Post Review"})]})})]}),e.jsx("div",{className:"space-y-3",children:r?e.jsx("p",{className:"text-center text-xs text-slate-500 py-6",children:"Loading reviews..."}):n.length===0?e.jsx("p",{className:"text-center text-xs text-slate-500 py-6 italic",children:"No reviews yet. Be the first to review!"}):n.map(p=>e.jsxs("div",{className:"p-3.5 bg-slate-950/60 rounded-2xl border border-slate-800/80 space-y-2",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("div",{className:"w-6 h-6 rounded-full bg-indigo-950 text-indigo-400 border border-indigo-800 flex items-center justify-center text-[10px] font-bold",children:e.jsx(W,{className:"w-3.5 h-3.5"})}),e.jsxs("div",{children:[e.jsx("p",{className:"text-xs font-bold text-slate-200",children:p.userName}),e.jsx("p",{className:"text-[10px] text-slate-500",children:new Date(p.createdAt).toLocaleDateString()})]})]}),e.jsx("div",{className:"flex items-center text-amber-400",children:[1,2,3,4,5].map(y=>e.jsx(O,{className:`w-3 h-3 ${y<=p.rating?"fill-amber-400 text-amber-400":"text-slate-800"}`},y))})]}),e.jsx("p",{className:"text-xs text-slate-300 pl-8",children:p.comment})]},p.id))})]})},Wt=({codeId:t,onBack:a,onNavigate:s})=>{const{showToast:n}=E(),{isPremium:o,currentUser:r}=L(),[l,i]=x.useState(null),[m,d]=x.useState(!0),[u,c]=x.useState(null),[b,h]=x.useState(0),[w,j]=x.useState("desktop"),[p,y]=x.useState(!1),[g,N]=x.useState(!1),[k,f]=x.useState([]),[D,C]=x.useState(!1),[A,F]=x.useState(!1),[be,H]=x.useState(!1),[K,U]=x.useState(!1),[he,X]=x.useState(!1),[Z,_]=x.useState(!1),[J,ee]=x.useState(!1);x.useEffect(()=>{let v=!0;async function T(){d(!0),c(null);try{const S=await Be(t);if(!v)return;S?(i(S),Ie(t).catch(()=>{}),S.creatorUid&&He(t,S.creatorUid).catch(()=>{})):c("Tool or code item not found.")}catch(S){if(!v)return;c(S.message||"Failed to load tool.")}finally{v&&d(!1)}}return T(),()=>{v=!1}},[t]),x.useEffect(()=>{const v=T=>{T.data&&T.data.type==="LOG"&&f(S=>[...S,{type:"log",message:typeof T.data.data=="string"?T.data.data:JSON.stringify(T.data.data),timestamp:Date.now()}])};return window.addEventListener("message",v),()=>window.removeEventListener("message",v)},[]);const fe=()=>{document.fullscreenElement?(document.exitFullscreen&&document.exitFullscreen().catch(()=>{}),y(!1)):(document.documentElement.requestFullscreen().catch(()=>{}),y(!0))},te=()=>{o?F(!0):H(!0)};return m?e.jsxs("div",{className:"fixed inset-0 bg-slate-950 flex flex-col items-center justify-center text-slate-300 gap-3 z-50",children:[e.jsx(Ge,{className:"w-8 h-8 text-indigo-500 animate-spin"}),e.jsx("p",{className:"text-xs font-semibold tracking-wide",children:"Launching live tool environment..."})]}):u||!l?e.jsxs("div",{className:"fixed inset-0 bg-slate-950 flex flex-col items-center justify-center p-4 text-center z-50 space-y-4",children:[e.jsx("div",{className:"p-5 rounded-2xl bg-rose-950/60 border border-rose-800 text-rose-300 text-sm font-medium max-w-md",children:u||"Tool not found."}),e.jsxs("button",{onClick:a,className:"inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-lg",children:[e.jsx(de,{className:"w-4 h-4"}),"Back to Tools Hub"]})]}):e.jsxs("div",{className:"fixed inset-0 flex flex-col bg-slate-950 overflow-hidden select-none",children:[e.jsx(lt,{item:l,deviceMode:w,isPremium:o,setDeviceMode:j,onBack:a,onReload:()=>{h(v=>v+1),f(v=>[...v,{type:"info",message:"Reloading sandbox environment...",timestamp:Date.now()}])},onToggleFullscreen:fe,isFullscreen:p,onOpenInfo:()=>C(!0),onOpenCode:te,onShare:()=>X(!0),onOpenTip:()=>U(!0),onOpenRemix:()=>_(!0),onToggleConsole:()=>N(!g),consoleOpen:g,logCount:k.length,onToggleReviews:()=>ee(!J),reviewsOpen:J}),e.jsxs("main",{className:"flex-1 w-full h-[calc(100vh-56px)] overflow-hidden relative",children:[e.jsx(Tt,{code:l.code,language:l.language,title:l.title,reloadKey:b,deviceMode:w}),e.jsx(Rt,{logs:k,isOpen:g,onToggle:()=>N(!g),onClear:()=>f([])}),J&&e.jsxs("div",{className:"absolute top-0 right-0 bottom-0 w-full sm:w-[420px] bg-slate-950/95 border-l border-slate-800 shadow-2xl z-40 p-5 overflow-y-auto backdrop-blur-xl",children:[e.jsxs("div",{className:"flex items-center justify-between pb-3 border-b border-slate-800 mb-4",children:[e.jsxs("h3",{className:"font-bold text-white text-sm flex items-center gap-2",children:[e.jsx(O,{className:"w-4 h-4 text-amber-400"}),e.jsx("span",{children:"Ratings & Comments"})]}),e.jsx("button",{onClick:()=>ee(!1),className:"text-slate-400 hover:text-white text-xs font-bold px-2 py-1 bg-slate-900 rounded-lg",children:"Close"})]}),e.jsx($t,{codeId:l.id||""})]})]}),e.jsx(nt,{item:l,isOpen:D,onClose:()=>C(!1),onOpenCode:te,onNavigate:s,onOpenTip:()=>U(!0)}),e.jsx(ot,{codeId:l.id,creatorUid:l.creatorUid,creatorEmail:l.authorEmail,code:l.code,language:l.language,title:l.title,isOpen:A,isPremium:o,onClose:()=>F(!1),onOpenPremiumPrompt:()=>{F(!1),H(!0)}}),e.jsx(it,{isOpen:be,onClose:()=>H(!1),onNavigate:s}),K&&e.jsx(Et,{codeId:l.id||"",toolTitle:l.title,creatorUid:l.creatorUid,creatorName:l.creatorName,creatorEmail:l.creatorEmail||l.createdBy,isOpen:K,onClose:()=>U(!1),onSuccess:()=>{n("Thank you for supporting this creator!","success")}}),e.jsx(Lt,{codeId:l.id||"",toolTitle:l.title,isOpen:he,onClose:()=>X(!1)}),Z&&e.jsx(Ot,{code:l,isOpen:Z,onClose:()=>_(!1),onConfirmRemix:v=>{_(!1),sessionStorage.setItem("remix_base_tool",JSON.stringify(v)),s("#/creator/upload")}})]})};export{Wt as CodeDetails};
