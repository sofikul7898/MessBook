import { useState, useEffect, useRef } from "react";

const LIGHT = {
  mode:"light",
  bg:"linear-gradient(135deg,#f0f4ff 0%,#fce4ff 50%,#e8f4ff 100%)",
  card:"rgba(255,255,255,0.88)", surface:"rgba(255,255,255,0.6)",
  input:"rgba(255,255,255,0.95)", inputBorder:"rgba(124,110,245,0.2)",
  header:"rgba(255,255,255,0.85)", sidebar:"rgba(255,255,255,0.95)",
  border:"rgba(180,170,255,0.22)", shadow:"0 8px 32px rgba(124,110,245,0.12)",
  text:"#1E1B4B", sub:"#374151", muted:"#6B7280", faint:"#9CA3AF",
  accent:"#7C6EF5", accentBg:"#EDE9FF",
  pink:"#F472B6", pinkBg:"#FDE8F4",
  teal:"#06B6D4", tealBg:"#E0F7FA",
  green:"#10B981", greenBg:"#D1FAE5",
  warn:"#F97316", warnBg:"#FEF3C7",
  red:"#EF4444", redBg:"#FEE2E2",
  gold:"#F59E0B",
};
const DARK = {
  mode:"dark",
  bg:"linear-gradient(135deg,#0f0e1a 0%,#1a0e2e 50%,#0e1a2e 100%)",
  card:"rgba(35,28,65,0.92)", surface:"rgba(25,20,50,0.8)",
  input:"rgba(20,16,42,0.9)", inputBorder:"rgba(124,110,245,0.3)",
  header:"rgba(12,10,30,0.92)", sidebar:"rgba(14,11,32,0.97)",
  border:"rgba(124,110,245,0.15)", shadow:"0 8px 32px rgba(0,0,0,0.4)",
  text:"#EDE9FF", sub:"#C4B5FD", muted:"#8B7BB8", faint:"#5A4F88",
  accent:"#9D8FF7", accentBg:"rgba(157,143,247,0.15)",
  pink:"#F9A8D4", pinkBg:"rgba(249,168,212,0.12)",
  teal:"#22D3EE", tealBg:"rgba(34,211,238,0.12)",
  green:"#34D399", greenBg:"rgba(52,211,153,0.12)",
  warn:"#FB923C", warnBg:"rgba(251,146,60,0.12)",
  red:"#F87171", redBg:"rgba(248,113,113,0.12)",
  gold:"#FCD34D",
};

async function dbGet(k){try{const r=await window.storage.get(k,true);return r?JSON.parse(r.value):null;}catch{return null;}}
async function dbSet(k,v){try{await window.storage.set(k,JSON.stringify(v),true);}catch{}}

const MN=["জানুয়ারি","ফেব্রুয়ারি","মার্চ","এপ্রিল","মে","জুন","জুলাই","আগস্ট","সেপ্টেম্বর","অক্টোবর","নভেম্বর","ডিসেম্বর"];
const dim=(m,y)=>new Date(y,m+1,0).getDate();
const mk=(m,y)=>`mess_${y}_${m}`;
const NOW=new Date();
const YEARS=[2024,2025,2026,2027];

function blank(members,m,y){
  const days=dim(m,y),mills={};
  members.forEach(x=>{mills[x]=Array(days).fill(0);});
  return{members:[...members],deposits:Object.fromEntries(members.map(x=>[x,0])),
    mills,expenses:Array(days).fill(0),expNotes:Array(days).fill(""),
    svc:{rent:0,elec:0,gas:0,dep:0},closed:false};
}

const IP={
  home:["M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z","M9 22V12h6v10"],
  utensils:["M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2","M7 2v20","M21 15V2l-4 4-4-4v13"],
  shop:["M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z","M3 6h18","M16 10a4 4 0 01-8 0"],
  chart:["M18 20V10","M12 20V4","M6 20v-6"],
  dashboard:["M3 3h7v7H3z","M14 3h7v7h-7z","M3 14h7v7H3z","M14 14h7v7h-7z"],
  wallet:["M21 12V7H5a2 2 0 010-4h14v4","M3 7v13a2 2 0 002 2h16v-5","M18 12a2 2 0 000 4h4v-4z"],
  clock:["M12 22C6.48 22 2 17.52 2 12S6.48 2 12 2s10 4.48 10 10-4.48 10-10 10z","M12 6v6l4 2"],
  phone:["M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"],
  user:["M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2","M12 11a4 4 0 100-8 4 4 0 000 8z"],
  users:["M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2","M23 21v-2a4 4 0 00-3-3.87","M16 3.13a4 4 0 010 7.75"],
  plus:["M12 5v14","M5 12h14"],
  x:["M18 6L6 18","M6 6l12 12"],
  edit:["M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7","M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"],
  trash:["M3 6h18","M19 6l-1 14H6L5 6","M8 6V4h8v2"],
  save:["M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z","M17 21v-8H7v8","M7 3v5h8"],
  back:["M19 12H5","M12 19l-7-7 7-7"],
  lock:["M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2z","M7 11V7a5 5 0 0110 0v4"],
  cam:["M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z","M12 17a4 4 0 100-8 4 4 0 000 8z"],
  star:["M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"],
  note:["M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z","M14 2v6h6","M16 13H8","M16 17H8","M10 9H8"],
  ok:["M20 6L9 17l-5-5"],
  warn:["M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z","M12 9v4","M12 17h.01"],
  mail:["M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z","M22 6l-10 7L2 6"],
  sun:["M12 2v2","M12 20v2","M4.93 4.93l1.41 1.41","M17.66 17.66l1.41 1.41","M2 12h2","M20 12h2","M6.34 17.66l-1.41 1.41","M19.07 4.93l-1.41 1.41","M12 17a5 5 0 100-10 5 5 0 000 10z"],
  moon:["M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"],
  trend:["M23 6l-9.5 9.5-5-5L1 18","M17 6h6v6"],
  down:["M23 18l-9.5-9.5-5 5L1 6","M17 18h6v-6"],
  menu:["M3 12h18","M3 6h18","M3 18h18"],
};
function Ico({n,s=20,c}){
  const d=IP[n]||IP.home;
  return(<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}>{d.map((p,i)=><path key={i} d={p}/>)}</svg>);
}

function GCard({children,style={},onClick,T}){
  return(<div onClick={onClick} style={{background:T.card,backdropFilter:"blur(20px)",borderRadius:20,border:`1px solid ${T.border}`,boxShadow:T.shadow,padding:18,...style}}>{children}</div>);
}
function Pill({ch,color}){
  return <span style={{background:color+"22",color,fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:20,border:`1px solid ${color}30`}}>{ch}</span>;
}
function Btn({ch,onClick,color,outline=false,full=false,sm=false,disabled=false}){
  return(<button onClick={onClick} disabled={disabled} style={{background:outline?"transparent":`linear-gradient(135deg,${color},${color}bb)`,color:outline?color:"#fff",border:`2px solid ${color}`,borderRadius:50,padding:sm?"6px 16px":"11px 22px",fontWeight:700,fontSize:sm?12:14,cursor:disabled?"not-allowed":"pointer",width:full?"100%":"auto",display:"inline-flex",alignItems:"center",gap:6,justifyContent:"center",boxShadow:outline?"none":`0 4px 14px ${color}35`,fontFamily:"'Segoe UI',sans-serif",opacity:disabled?0.5:1,transition:"transform .1s"}}>{ch}</button>);
}
function FIn({label,val,onChange,type="number",ph="",ac,T}){
  const [f,setF]=useState(false);
  return(<div style={{marginBottom:14}}>
    {label&&<div style={{fontSize:11,fontWeight:700,color:ac||T.accent,marginBottom:5}}>{label}</div>}
    <input type={type} value={val==null||val===0?"":val}
      onChange={e=>onChange(type==="number"?(e.target.value===""?"":+e.target.value):e.target.value)}
      placeholder={ph} onFocus={()=>setF(true)} onBlur={()=>setF(false)}
      style={{width:"100%",background:T.input,border:`1.5px solid ${f?(ac||T.accent):T.inputBorder}`,borderRadius:14,padding:"11px 16px",color:T.text,fontSize:14,outline:"none",boxSizing:"border-box",fontFamily:"'Segoe UI',sans-serif",transition:"border .2s"}}/>
  </div>);
}
function Toast({msg,type,T}){
  if(!msg)return null;
  const c=type==="ok"?T.green:T.red;
  return(<div style={{position:"fixed",bottom:30,left:"50%",transform:"translateX(-50%)",background:T.card,color:c,padding:"12px 22px",borderRadius:50,fontWeight:700,fontSize:13,zIndex:9999,whiteSpace:"nowrap",boxShadow:`0 4px 24px ${c}40`,border:`1.5px solid ${c}40`,display:"flex",alignItems:"center",gap:8,backdropFilter:"blur(20px)"}}><Ico n={type==="ok"?"ok":"warn"} s={16} c={c}/>{msg}</div>);
}
function IBox({n,color,bg,s=17}){
  return <div style={{width:34,height:34,borderRadius:10,background:bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Ico n={n} s={s} c={color}/></div>;
}
function Av({name,T,size=36}){
  return <div style={{width:size,height:size,borderRadius:"50%",background:`linear-gradient(135deg,${T.accent},${T.pink})`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{color:"#fff",fontWeight:800,fontSize:size*0.38}}>{name?.[0]||"?"}</span></div>;
}

// ── Month/Year Picker (animated) ──────────────────────────────────────────────
function DatePicker({month,year,setMonth,setYear,T}){
  const [open,setOpen]=useState(false);
  return(
    <div style={{position:"relative"}}>
      <button onClick={()=>setOpen(!open)} style={{background:T.accentBg,border:`1.5px solid ${T.accent}40`,borderRadius:14,padding:"8px 14px",color:T.accent,fontWeight:700,fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",gap:6,transition:"all .2s",fontFamily:"'Segoe UI',sans-serif"}}>
        📅 {MN[month].slice(0,3)} {year}
        <span style={{transform:open?"rotate(180deg)":"rotate(0)",transition:"transform .3s",display:"inline-block"}}>▾</span>
      </button>
      {open&&(
        <div style={{position:"absolute",top:"calc(100% + 8px)",right:0,background:T.card,backdropFilter:"blur(20px)",borderRadius:16,border:`1px solid ${T.border}`,boxShadow:T.shadow,zIndex:100,padding:16,minWidth:240,animation:"fadeIn .2s ease"}}>
          <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}`}</style>
          <div style={{fontSize:11,fontWeight:700,color:T.muted,marginBottom:8}}>বছর</div>
          <div style={{display:"flex",gap:6,marginBottom:12}}>
            {YEARS.map(y=>(
              <button key={y} onClick={()=>setYear(y)} style={{flex:1,padding:"6px 0",borderRadius:10,border:"none",background:year===y?`linear-gradient(135deg,${T.accent},${T.pink})`:T.surface,color:year===y?"#fff":T.muted,fontWeight:year===y?700:500,cursor:"pointer",fontSize:12,transition:"all .2s"}}>{y}</button>
            ))}
          </div>
          <div style={{fontSize:11,fontWeight:700,color:T.muted,marginBottom:8}}>মাস</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6}}>
            {MN.map((m,i)=>(
              <button key={i} onClick={()=>{setMonth(i);setOpen(false);}} style={{padding:"7px 0",borderRadius:10,border:"none",background:month===i?`linear-gradient(135deg,${T.accent},${T.pink})`:T.surface,color:month===i?"#fff":T.muted,fontWeight:month===i?700:500,cursor:"pointer",fontSize:12,transition:"all .2s"}}>{m.slice(0,3)}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const TABS=[
  {id:"home",      label:"হোম",           ico:"home",      c:(T)=>T.accent},
  {id:"dashboard", label:"ড্যাশবোর্ড",    ico:"dashboard", c:(T)=>T.pink},
  {id:"mill",      label:"মিল এন্ট্রি",   ico:"utensils",  c:(T)=>T.teal},
  {id:"expense",   label:"খরচ ও জমা",    ico:"shop",      c:(T)=>T.warn},
  {id:"summary",   label:"মাসের হিসাব",  ico:"chart",     c:(T)=>T.green},
  {id:"wallet",    label:"ওয়ালেট",        ico:"wallet",    c:(T)=>T.pink},
  {id:"history",   label:"ইতিহাস",        ico:"clock",     c:(T)=>T.accent},
  {id:"contact",   label:"যোগাযোগ",       ico:"phone",     c:(T)=>T.red},
  {id:"profile",   label:"প্রোফাইল",      ico:"user",      c:(T)=>T.accent},
];

// ── SIDEBAR (desktop: always visible glass; mobile: slide) ────────────────────
function Sidebar({open,onClose,tab,setTab,profile,T,dark,setDark,isMobile}){
  const sidebarContent=(
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      {/* profile */}
      <div style={{padding:isMobile?"52px 20px 18px":"24px 20px 18px",background:T.mode==="light"?"linear-gradient(135deg,#EDE9FF,#FDE8F4)":"linear-gradient(135deg,rgba(157,143,247,0.18),rgba(249,168,212,0.12))",borderBottom:`1px solid ${T.border}`}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:50,height:50,borderRadius:"50%",overflow:"hidden",background:`linear-gradient(135deg,${T.accent},${T.pink})`,display:"flex",alignItems:"center",justifyContent:"center",border:"3px solid rgba(255,255,255,0.25)",boxShadow:`0 4px 14px ${T.accent}40`,flexShrink:0}}>
            {profile?.photo?<img src={profile.photo} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<Ico n="user" s={26} c="#fff"/>}
          </div>
          <div style={{minWidth:0}}>
            <div style={{fontWeight:800,fontSize:14,color:T.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{profile?.messName||"মেস হিসাব"} 🍚</div>
            <div style={{fontSize:11,color:T.muted,marginTop:1}}>পরিচালক: <span style={{color:T.accent,fontWeight:600}}>{profile?.name||"—"}</span></div>
            {profile?.managerName&&<div style={{fontSize:10,color:T.pink,marginTop:2,display:"flex",alignItems:"center",gap:3}}><Ico n="star" s={10} c={T.pink}/>{profile.managerName}</div>}
          </div>
        </div>
        <div style={{marginTop:12,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <span style={{fontSize:11,color:T.muted,fontWeight:600}}>{dark?"🌙 ডার্ক":"☀️ লাইট"}</span>
          <button onClick={()=>setDark(!dark)} style={{width:48,height:26,borderRadius:13,background:dark?`linear-gradient(135deg,${T.accent},${T.pink})`:"rgba(0,0,0,0.1)",border:"none",cursor:"pointer",position:"relative",transition:"background .3s",flexShrink:0}}>
            <div style={{position:"absolute",top:3,width:20,height:20,borderRadius:"50%",background:"#fff",transition:"left .3s",left:dark?24:3,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 2px 6px rgba(0,0,0,0.2)"}}><Ico n={dark?"moon":"sun"} s={11} c={dark?T.accent:T.warn}/></div>
          </button>
        </div>
      </div>
      {/* nav */}
      <div style={{flex:1,overflowY:"auto",padding:"12px 10px"}}>
        {TABS.map(t=>{
          const active=tab===t.id,cc=t.c(T);
          return(<button key={t.id} onClick={()=>{setTab(t.id);if(isMobile)onClose();}} style={{width:"100%",display:"flex",alignItems:"center",gap:12,padding:"10px 12px",borderRadius:14,border:"none",background:active?`${cc}18`:"transparent",color:active?cc:T.muted,fontWeight:active?700:500,fontSize:13,cursor:"pointer",marginBottom:3,transition:"all .15s",borderLeft:active?`3px solid ${cc}`:"3px solid transparent",fontFamily:"'Segoe UI',sans-serif"}}>
            <div style={{width:34,height:34,borderRadius:10,background:active?`${cc}20`:T.mode==="light"?"rgba(0,0,0,0.04)":"rgba(255,255,255,0.05)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <Ico n={t.ico} s={17} c={active?cc:T.faint}/>
            </div>
            {t.label}
          </button>);
        })}
      </div>
      <div style={{padding:"10px 18px",borderTop:`1px solid ${T.border}`,fontSize:10,color:T.faint,textAlign:"center"}}>🍚 মেস হিসাব v3.0</div>
    </div>
  );

  if(!isMobile){
    return(
      <div style={{width:260,flexShrink:0,background:T.sidebar,backdropFilter:"blur(30px)",borderRight:`1.5px solid ${T.border}`,height:"100vh",position:"sticky",top:0,overflowY:"auto",boxShadow:`4px 0 24px ${T.accent}10`}}>
        {sidebarContent}
      </div>
    );
  }
  return(<>
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",backdropFilter:"blur(4px)",opacity:open?1:0,pointerEvents:open?"auto":"none",transition:"opacity .3s",zIndex:40}}/>
    <div style={{position:"fixed",top:0,left:0,bottom:0,width:270,background:T.sidebar,backdropFilter:"blur(30px)",zIndex:50,transform:open?"translateX(0)":"translateX(-100%)",transition:"transform .32s cubic-bezier(.4,0,.2,1)",boxShadow:"6px 0 40px rgba(0,0,0,0.2)",borderRight:`1px solid ${T.border}`}}>
      {sidebarContent}
    </div>
  </>);
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
export default function App(){
  const [tab,setTab]=useState("home");
  const [sideOpen,setSideOpen]=useState(false);
  const [dark,setDarkRaw]=useState(false);
  const T=dark?DARK:LIGHT;
  const [members,setMembers]=useState([]);
  const [month,setMonth]=useState(NOW.getMonth());
  const [year,setYear]=useState(NOW.getFullYear());
  const [data,setData]=useState(null);
  const [loading,setLoading]=useState(true);
  const [toast,setToast]=useState(null);
  const [memOpen,setMemOpen]=useState(false);
  const [profile,setProfile]=useState(null);
  const [isMobile,setIsMobile]=useState(window.innerWidth<768);

  useEffect(()=>{
    const fn=()=>setIsMobile(window.innerWidth<768);
    window.addEventListener("resize",fn);return()=>window.removeEventListener("resize",fn);
  },[]);

  const showToast=(msg,type="ok")=>{setToast({msg,type});setTimeout(()=>setToast(null),2400);};
  const setDark=async v=>{setDarkRaw(v);await dbSet("mess_dark",v);};

  useEffect(()=>{(async()=>{
    const m=await dbGet("mess_members");if(m)setMembers(m);
    const p=await dbGet("mess_profile");if(p)setProfile(p);
    const d=await dbGet("mess_dark");if(d!==null)setDarkRaw(d);
    setLoading(false);
  })();},[]);

  useEffect(()=>{
    if(!members.length){setData(null);return;}
    (async()=>{
      setLoading(true);
      let d=await dbGet(mk(month,year));
      if(!d)d=blank(members,month,year);
      if(!d.expNotes)d.expNotes=Array(dim(month,year)).fill("");
      if(!d.svc&&d.serviceCharge)d.svc={rent:d.serviceCharge.rent||0,elec:d.serviceCharge.electricity||0,gas:d.serviceCharge.gas||0,dep:d.serviceCharge.deposit||0};
      if(!d.svc)d.svc={rent:0,elec:0,gas:0,dep:0};
      members.forEach(m=>{if(!d.mills[m]){d.mills[m]=Array(dim(month,year)).fill(0);d.deposits[m]=0;}});
      setData(d);setLoading(false);
    })();
  },[month,year,members]);

  const persist=async u=>{setData(u);await dbSet(mk(month,year),u);};
  const saveMembers=async l=>{setMembers(l);await dbSet("mess_members",l);};
  const saveProfile=async p=>{setProfile(p);await dbSet("mess_profile",p);};

  const totExp=data?data.expenses.reduce((a,b)=>a+b,0):0;
  const totSvc=data?Object.values(data.svc).reduce((a,b)=>a+b,0):0;
  const totMills=data?data.members.reduce((s,m)=>s+(data.mills[m]?.reduce((a,b)=>a+b,0)||0),0):0;
  const rate=totMills>0?totExp/totMills:0;
  const summary=data?data.members.map(mem=>{
    const myM=data.mills[mem]?.reduce((a,b)=>a+b,0)||0;
    const food=myM*rate;
    const svc=data.members.length>0?totSvc/data.members.length:0;
    const cost=food+svc;
    const dep=data.deposits[mem]||0;
    const bal=dep-cost;
    // bal>0 => উদ্রিত (paid more), bal<0 => ঘাটতি (paid less)
    return{mem,myM,food,svc,cost,dep,bal,udrito:bal>0?bal:0,ghati:bal<0?Math.abs(bal):0};
  }):[];

  const curTab=TABS.find(t=>t.id===tab)||TABS[0];
  const tabC=curTab.c(T);

  if(loading)return(<div style={{background:T.bg,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:16}}><div style={{fontSize:52}}>🍚</div><div style={{fontWeight:800,fontSize:18,color:T.accent}}>লোড হচ্ছে...</div></div>);

  const noMemMsg=!members.length&&!["home","profile","contact"].includes(tab);
  const totDep=data?Object.values(data.deposits).reduce((a,b)=>a+b,0):0;

  return(
    <div style={{background:T.bg,minHeight:"100vh",display:"flex",fontFamily:"'Segoe UI',sans-serif",color:T.text,transition:"background .3s",maxWidth:isMobile?"100%":"none"}}>
      <Sidebar open={sideOpen} onClose={()=>setSideOpen(false)} tab={tab} setTab={setTab} profile={profile} T={T} dark={dark} setDark={setDark} isMobile={isMobile}/>

      <div style={{flex:1,display:"flex",flexDirection:"column",minWidth:0}}>
        {/* HEADER */}
        <div style={{background:T.header,backdropFilter:"blur(20px)",padding:"12px 16px",borderBottom:`1px solid ${T.border}`,position:"sticky",top:0,zIndex:30,display:"flex",alignItems:"center",gap:10,boxShadow:T.shadow,transition:"background .3s"}}>
          {isMobile&&(
            <button onClick={()=>setSideOpen(true)} style={{background:T.accentBg,border:"none",borderRadius:12,width:40,height:40,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:4.5,flexShrink:0}}>
              {[0,1,2].map(i=><div key={i} style={{width:18,height:2,background:T.accent,borderRadius:2}}/>)}
            </button>
          )}
          {!isMobile&&(
            <div style={{display:"flex",alignItems:"center",gap:8,flex:1}}>
              {/* Desktop: show tabs in header */}
              {TABS.map(t=>{
                const active=tab===t.id,cc=t.c(T);
                return(<button key={t.id} onClick={()=>setTab(t.id)} style={{display:"flex",alignItems:"center",gap:6,padding:"7px 12px",borderRadius:10,border:"none",background:active?`${cc}18`:"transparent",color:active?cc:T.muted,fontWeight:active?700:500,fontSize:12,cursor:"pointer",transition:"all .15s",fontFamily:"'Segoe UI',sans-serif",whiteSpace:"nowrap"}}>
                  <Ico n={t.ico} s={14} c={active?cc:T.faint}/>{t.label}
                </button>);
              })}
            </div>
          )}
          {isMobile&&(
            <div style={{flex:1}}>
              <div style={{fontSize:15,fontWeight:800,color:T.text,display:"flex",alignItems:"center",gap:7}}><Ico n={curTab.ico} s={16} c={tabC}/>{curTab.label}</div>
              <div style={{fontSize:10,color:T.faint,marginTop:1}}>{MN[month]} {year}</div>
            </div>
          )}
          <button onClick={()=>setDark(!dark)} style={{width:36,height:36,borderRadius:12,border:"none",background:T.accentBg,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"background .3s"}}>
            <Ico n={dark?"sun":"moon"} s={17} c={dark?T.warn:T.accent}/>
          </button>
          <DatePicker month={month} year={year} setMonth={setMonth} setYear={setYear} T={T}/>
        </div>

        {/* CONTENT */}
        <div style={{flex:1,padding:"16px 14px 40px",maxWidth:isMobile?"100%":860,margin:"0 auto",width:"100%",boxSizing:"border-box"}}>
          {noMemMsg&&<GCard T={T} style={{textAlign:"center",padding:40}}><div style={{fontSize:48,marginBottom:12}}>👥</div><div style={{color:T.muted,marginBottom:20,fontWeight:600}}>আগে হোম থেকে সদস্য যোগ করুন</div><Btn ch="হোমে যান" onClick={()=>setTab("home")} color={T.accent}/></GCard>}
          {tab==="home"&&<HomeTab members={members} data={data} totExp={totExp} totMills={totMills} rate={rate} totSvc={totSvc} month={month} year={year} onMem={()=>setMemOpen(true)} summary={summary} profile={profile} T={T}/>}
          {tab==="dashboard"&&<DashTab data={data} summary={summary} totExp={totExp} totMills={totMills} rate={rate} totSvc={totSvc} totDep={totDep} month={month} year={year} T={T}/>}
          {tab==="mill"&&members.length>0&&data&&<MillTab data={data} month={month} year={year} onSave={persist} toast={showToast} T={T}/>}
          {tab==="expense"&&members.length>0&&data&&<ExpTab data={data} month={month} year={year} onSave={persist} toast={showToast} T={T}/>}
          {tab==="summary"&&members.length>0&&data&&<SumTab summary={summary} totExp={totExp} totMills={totMills} rate={rate} totSvc={totSvc} data={data} onSave={persist} toast={showToast} T={T}/>}
          {tab==="wallet"&&members.length>0&&data&&<WalletTab summary={summary} totExp={totExp} totMills={totMills} rate={rate} totSvc={totSvc} month={month} year={year} data={data} T={T}/>}
          {tab==="history"&&<HistTab T={T}/>}
          {tab==="contact"&&<ContactTab toast={showToast} T={T}/>}
          {tab==="profile"&&<ProfileTab profile={profile} onSave={saveProfile} toast={showToast} T={T}/>}
        </div>
      </div>

      {memOpen&&<MemModal members={members} onSave={async l=>{await saveMembers(l);setMemOpen(false);showToast("সদস্য সেভ হয়েছে");}} onClose={()=>setMemOpen(false)} T={T}/>}
      {toast&&<Toast msg={toast.msg} type={toast.type} T={T}/>}
    </div>
  );
}

// ── HOME ──────────────────────────────────────────────────────────────────────
function HomeTab({members,data,totExp,totMills,rate,totSvc,month,year,onMem,summary,profile,T}){
  const today=NOW.getDate()-1;
  const todayE=data?.expenses[today]||0;
  const todayN=data?.expNotes?.[today]||"";
  const totDep=data?Object.values(data.deposits).reduce((a,b)=>a+b,0):0;
  return(<div style={{display:"flex",flexDirection:"column",gap:16}}>
    <GCard T={T} style={{background:`linear-gradient(135deg,${T.accent},${T.pink})`,border:"none",boxShadow:`0 8px 32px ${T.accent}40`,padding:22}}>
      <div style={{color:"rgba(255,255,255,0.7)",fontSize:12,marginBottom:2}}>স্বাগতম!</div>
      <div style={{color:"#fff",fontWeight:900,fontSize:22}}>{profile?.messName||"মেস হিসাব"} 🍚</div>
      {profile?.name&&<div style={{color:"rgba(255,255,255,0.85)",fontSize:13,marginTop:4,fontWeight:600}}>পরিচালক: {profile.name}</div>}
      {profile?.managerName&&<div style={{marginTop:10,background:"rgba(255,255,255,0.18)",borderRadius:12,padding:"7px 14px",display:"inline-flex",alignItems:"center",gap:6}}><Ico n="star" s={13} c="#FFD166"/><span style={{color:"#fff",fontSize:12,fontWeight:600}}>এই মাসের ম্যানেজার: {profile.managerName}</span></div>}
    </GCard>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
      {[{l:"মোট খরচ",v:`৳${totExp.toLocaleString()}`,c:T.warn,bg:T.warnBg,i:"shop"},{l:"মোট জমা",v:`৳${totDep.toLocaleString()}`,c:T.green,bg:T.greenBg,i:"wallet"},{l:"মোট মিল",v:`${totMills} টি`,c:T.teal,bg:T.tealBg,i:"utensils"},{l:"মিল রেইট",v:rate>0?`৳${rate.toFixed(1)}`:"—",c:T.accent,bg:T.accentBg,i:"chart"}].map(s=>(
        <GCard key={s.l} T={T} style={{padding:14}}><div style={{width:34,height:34,borderRadius:10,background:s.bg,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:10}}><Ico n={s.i} s={17} c={s.c}/></div><div style={{color:s.c,fontSize:19,fontWeight:800}}>{s.v}</div><div style={{color:T.muted,fontSize:11,marginTop:2,fontWeight:600}}>{s.l}</div></GCard>
      ))}
    </div>
    <GCard T={T}><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}><IBox n="shop" color={T.warn} bg={T.warnBg}/><div style={{fontWeight:700,fontSize:14}}>আজকের বাজার</div></div><div style={{fontSize:28,fontWeight:900,color:todayE>0?T.warn:T.faint}}>৳{todayE.toLocaleString()}</div>{todayN&&<div style={{marginTop:6,fontSize:12,color:T.muted,fontStyle:"italic"}}>📝 {todayN}</div>}<div style={{color:T.faint,fontSize:11,marginTop:4}}>{NOW.toLocaleDateString("bn-BD",{day:"numeric",month:"long"})}</div></GCard>
    <GCard T={T}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}><IBox n="users" color={T.accent} bg={T.accentBg}/><div style={{fontWeight:700,fontSize:14}}>সদস্যরা ({members.length})</div></div>
        <Btn sm ch={<><Ico n="edit" s={13} c="#fff"/>ম্যানেজ</>} onClick={onMem} color={T.accent}/>
      </div>
      {members.length===0?<div style={{color:T.muted,textAlign:"center",padding:"20px 0",fontSize:13}}>কোনো সদস্য নেই</div>
      :summary.map(({mem,myM,dep,bal,udrito,ghati})=>(
        <div key={mem} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 12px",background:T.surface,borderRadius:14,marginBottom:8,border:`1px solid ${bal>=0?T.green+"28":T.red+"28"}`}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}><Av name={mem} T={T}/><div><div style={{fontWeight:700,fontSize:13}}>{mem}</div><div style={{color:T.muted,fontSize:11}}>{myM} মিল</div></div></div>
          <div style={{textAlign:"right"}}><div style={{fontSize:11,color:T.muted}}>৳{dep.toLocaleString()}</div><Pill color={udrito>0?T.green:T.red} ch={udrito>0?`উদ্রিত ৳${udrito.toFixed(0)}`:`ঘাটতি ৳${ghati.toFixed(0)}`}/></div>
        </div>
      ))}
    </GCard>
  </div>);
}

// ── DASHBOARD ─────────────────────────────────────────────────────────────────
function DashTab({data,summary,totExp,totMills,rate,totSvc,totDep,month,year,T}){
  if(!data)return(<GCard T={T} style={{textAlign:"center",padding:40}}><div style={{fontSize:40,marginBottom:12}}>📊</div><div style={{color:T.muted}}>ডেটা নেই — আগে মিল ও খরচ এন্ট্রি করুন</div></GCard>);
  const totCost=summary.reduce((s,r)=>s+r.cost,0);
  const totalUdrito=summary.filter(r=>r.udrito>0).reduce((s,r)=>s+r.udrito,0);
  const totalGhati=summary.filter(r=>r.ghati>0).reduce((s,r)=>s+r.ghati,0);
  const balance=totDep-totCost;
  const expDays=data.expenses.filter(e=>e>0).length;
  const avgDaily=expDays>0?totExp/expDays:0;
  const maxMill=Math.max(...summary.map(r=>r.myM),1);
  const maxDep=Math.max(...summary.map(r=>r.dep),1);
  const svcPH=summary.length>0?totSvc/summary.length:0;

  // Bar chart data: expenses last 7 days with values
  const today=NOW.getDate()-1;
  const last7=Array.from({length:7},(_,i)=>{
    const idx=today-6+i;
    return{day:idx+1,val:idx>=0&&idx<data.expenses.length?data.expenses[idx]:0};
  });
  const maxBar=Math.max(...last7.map(d=>d.val),1);

  return(<div style={{display:"flex",flexDirection:"column",gap:16}}>
    <GCard T={T} style={{background:`linear-gradient(135deg,${T.pink},${T.accent})`,border:"none",padding:20}}>
      <div style={{color:"rgba(255,255,255,0.75)",fontSize:12,marginBottom:4}}>📊 ড্যাশবোর্ড</div>
      <div style={{color:"#fff",fontWeight:800,fontSize:18}}>{MN[month]} {year} — সামগ্রিক চিত্র</div>
    </GCard>

    {/* KPI Grid */}
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
      {[
        {l:"মোট মিল",v:totMills,c:T.teal,bg:T.tealBg,i:"utensils"},
        {l:"মিল রেইট",v:rate>0?`৳${rate.toFixed(1)}`:"—",c:T.accent,bg:T.accentBg,i:"chart"},
        {l:"গড় বাজার",v:avgDaily>0?`৳${avgDaily.toFixed(0)}`:"—",c:T.warn,bg:T.warnBg,i:"shop"},
        {l:"মোট জমা",v:`৳${totDep.toLocaleString()}`,c:T.green,bg:T.greenBg,i:"wallet"},
        {l:"মোট খরচ",v:`৳${totExp.toLocaleString()}`,c:T.warn,bg:T.warnBg,i:"shop"},
        {l:"সার্ভিস/জন",v:`৳${svcPH.toFixed(0)}`,c:T.red,bg:T.redBg,i:"home"},
      ].map(s=>(
        <GCard key={s.l} T={T} style={{padding:12,textAlign:"center"}}><div style={{width:30,height:30,borderRadius:8,background:s.bg,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 8px"}}><Ico n={s.i} s={15} c={s.c}/></div><div style={{color:s.c,fontSize:14,fontWeight:800}}>{typeof s.v==="number"?s.v.toLocaleString():s.v}</div><div style={{color:T.muted,fontSize:10,marginTop:2}}>{s.l}</div></GCard>
      ))}
    </div>

    {/* Balance Status */}
    <GCard T={T} style={{border:`1.5px solid ${balance>=0?T.green+"50":T.red+"50"}`}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}><IBox n={balance>=0?"trend":"down"} color={balance>=0?T.green:T.red} bg={balance>=0?T.greenBg:T.redBg}/><div style={{fontWeight:700,fontSize:15}}>মাসের ব্যালেন্স</div></div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
        {[{l:"মোট জমা",v:`৳${totDep.toLocaleString()}`,c:T.green},{l:"মোট খরচ",v:`৳${totCost.toFixed(0)}`,c:T.warn},{l:balance>=0?"উদ্রিত":"ঘাটতি",v:`৳${Math.abs(balance).toFixed(0)}`,c:balance>=0?T.green:T.red}].map(s=>(
          <div key={s.l} style={{background:T.surface,borderRadius:12,padding:"10px 8px",textAlign:"center"}}><div style={{fontWeight:800,fontSize:15,color:s.c}}>{s.v}</div><div style={{color:T.muted,fontSize:10,marginTop:2}}>{s.l}</div></div>
        ))}
      </div>
      <div style={{marginTop:12,display:"flex",alignItems:"center",gap:8,padding:"10px 14px",background:balance>=0?T.greenBg:T.redBg,borderRadius:12}}>
        <Ico n={balance>=0?"ok":"warn"} s={16} c={balance>=0?T.green:T.red}/>
        <span style={{fontSize:13,fontWeight:600,color:balance>=0?T.green:T.red}}>
          {balance>=0?`মোট ৳${totalUdrito.toFixed(0)} উদ্রিত আছে — ভালো অবস্থায় আছেন`:`মোট ৳${totalGhati.toFixed(0)} ঘাটতি আছে — আরো জমা দেওয়া প্রয়োজন`}
        </span>
      </div>
    </GCard>

    {/* Last 7 days bar chart */}
    <GCard T={T}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}><IBox n="chart" color={T.accent} bg={T.accentBg}/><div style={{fontWeight:700,fontSize:15}}>শেষ ৭ দিনের বাজার</div></div>
      <div style={{display:"flex",alignItems:"flex-end",gap:6,height:100}}>
        {last7.map(({day,val})=>(
          <div key={day} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
            <div style={{fontSize:10,color:T.warn,fontWeight:700}}>{val>0?`৳${val}`:"—"}</div>
            <div style={{width:"100%",background:`linear-gradient(180deg,${T.warn},${T.gold})`,borderRadius:"4px 4px 0 0",height:val>0?`${(val/maxBar)*70}px`:"2px",minHeight:2,transition:"height .5s",boxShadow:val>0?`0 2px 8px ${T.warn}40`:"none"}}/>
            <div style={{fontSize:10,color:T.muted}}>{day}</div>
          </div>
        ))}
      </div>
    </GCard>

    {/* Member comparison */}
    <GCard T={T}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}><IBox n="users" color={T.accent} bg={T.accentBg}/><div style={{fontWeight:700,fontSize:15}}>সদস্য তুলনা</div></div>
      {summary.map(({mem,myM,dep,udrito,ghati})=>(
        <div key={mem} style={{marginBottom:14}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}><Av name={mem} T={T} size={28}/><span style={{fontWeight:600,fontSize:13}}>{mem}</span></div>
            <div style={{display:"flex",gap:6,alignItems:"center"}}>
              <span style={{fontSize:11,color:T.muted}}>{myM} মিল</span>
              <Pill color={udrito>0?T.green:T.red} ch={udrito>0?`উদ্রিত ৳${udrito.toFixed(0)}`:`ঘাটতি ৳${ghati.toFixed(0)}`}/>
            </div>
          </div>
          <div style={{display:"flex",gap:4}}>
            <div style={{flex:1}}>
              <div style={{fontSize:9,color:T.muted,marginBottom:2}}>মিল</div>
              <div style={{height:6,background:T.surface,borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",width:`${(myM/maxMill)*100}%`,background:`linear-gradient(90deg,${T.teal},${T.accent})`,borderRadius:3,transition:"width .5s"}}/></div>
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:9,color:T.muted,marginBottom:2}}>জমা</div>
              <div style={{height:6,background:T.surface,borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",width:`${(dep/maxDep)*100}%`,background:`linear-gradient(90deg,${T.green},${T.teal})`,borderRadius:3,transition:"width .5s"}}/></div>
            </div>
          </div>
        </div>
      ))}
    </GCard>

    {/* Udrito / Ghati list */}
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
      <GCard T={T} style={{border:`1px solid ${T.green}30`}}>
        <div style={{fontWeight:700,fontSize:13,color:T.green,marginBottom:10,display:"flex",alignItems:"center",gap:6}}><Ico n="trend" s={15} c={T.green}/>উদ্রিত</div>
        {summary.filter(r=>r.udrito>0).length===0?<div style={{color:T.faint,fontSize:12}}>কেউ নেই</div>
        :summary.filter(r=>r.udrito>0).map(r=>(
          <div key={r.mem} style={{display:"flex",justifyContent:"space-between",marginBottom:6,fontSize:12}}><span style={{color:T.sub}}>{r.mem}</span><span style={{fontWeight:700,color:T.green}}>৳{r.udrito.toFixed(0)}</span></div>
        ))}
      </GCard>
      <GCard T={T} style={{border:`1px solid ${T.red}30`}}>
        <div style={{fontWeight:700,fontSize:13,color:T.red,marginBottom:10,display:"flex",alignItems:"center",gap:6}}><Ico n="down" s={15} c={T.red}/>ঘাটতি</div>
        {summary.filter(r=>r.ghati>0).length===0?<div style={{color:T.faint,fontSize:12}}>কেউ নেই</div>
        :summary.filter(r=>r.ghati>0).map(r=>(
          <div key={r.mem} style={{display:"flex",justifyContent:"space-between",marginBottom:6,fontSize:12}}><span style={{color:T.sub}}>{r.mem}</span><span style={{fontWeight:700,color:T.red}}>৳{r.ghati.toFixed(0)}</span></div>
        ))}
      </GCard>
    </div>
  </div>);
}

// ── MILL ──────────────────────────────────────────────────────────────────────
function MillTab({data,month,year,onSave,toast,T}){
  const days=dim(month,year);
  const [sel,setSel]=useState(Math.min(NOW.getDate(),days)-1);
  const [mills,setMills]=useState({});
  useEffect(()=>{const m={};data.members.forEach(x=>{m[x]=data.mills[x]?.[sel]||0;});setMills(m);},[sel,data]);
  const doSave=async()=>{const u={...data,mills:{...data.mills}};data.members.forEach(m=>{const a=[...(u.mills[m]||Array(days).fill(0))];a[sel]=mills[m]||0;u.mills[m]=a;});await onSave(u);toast("মিল সেভ হয়েছে ✓");};
  return(<div style={{display:"flex",flexDirection:"column",gap:16}}>
    <GCard T={T}><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}><IBox n="note" color={T.teal} bg={T.tealBg}/><div style={{fontWeight:700,fontSize:15}}>তারিখ বেছে নিন</div></div>
      <div style={{display:"flex",flexWrap:"wrap",gap:6}}>{Array.from({length:days},(_,i)=>{const has=data.members.some(m=>(data.mills[m]?.[i]||0)>0),act=sel===i;return(<button key={i} onClick={()=>setSel(i)} style={{width:36,height:36,borderRadius:10,border:"none",background:act?`linear-gradient(135deg,${T.teal},${T.accent})`:has?T.tealBg:T.surface,color:act?"#fff":has?T.teal:T.muted,fontWeight:act?800:500,cursor:"pointer",fontSize:13,boxShadow:act?`0 4px 12px ${T.teal}40`:"none"}}>{i+1}</button>);})}</div>
    </GCard>
    <GCard T={T}><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}><IBox n="utensils" color={T.teal} bg={T.tealBg}/><div style={{fontWeight:700,fontSize:15}}>{sel+1} তারিখের মিল</div></div>
      {data.members.map(mem=>(<div key={mem} style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10,background:T.surface,borderRadius:14,padding:"10px 14px"}}><div style={{display:"flex",alignItems:"center",gap:10}}><Av name={mem} T={T}/><span style={{fontWeight:600,fontSize:14}}>{mem}</span></div><div style={{display:"flex",alignItems:"center",gap:10}}><button onClick={()=>setMills(p=>({...p,[mem]:Math.max(0,(p[mem]||0)-0.5)}))} style={{width:34,height:34,borderRadius:"50%",background:T.redBg,border:"none",color:T.red,fontWeight:800,cursor:"pointer",fontSize:18}}>−</button><span style={{minWidth:32,textAlign:"center",fontWeight:800,fontSize:18,color:(mills[mem]||0)>0?T.teal:T.faint}}>{mills[mem]||0}</span><button onClick={()=>setMills(p=>({...p,[mem]:(p[mem]||0)+0.5}))} style={{width:34,height:34,borderRadius:"50%",background:T.tealBg,border:"none",color:T.teal,fontWeight:800,cursor:"pointer",fontSize:18}}>+</button></div></div>))}
      <Btn full ch={<><Ico n="save" s={16} c="#fff"/>সেভ করুন</>} onClick={doSave} color={T.teal}/>
    </GCard>
    <GCard T={T}><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}><IBox n="chart" color={T.accent} bg={T.accentBg}/><div style={{fontWeight:700,fontSize:15}}>মাসের মোট মিল</div></div>
      {data.members.map(mem=>{const tot=data.mills[mem]?.reduce((a,b)=>a+b,0)||0,mx=Math.max(...data.members.map(m=>data.mills[m]?.reduce((a,b)=>a+b,0)||0),1);return(<div key={mem} style={{marginBottom:12}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:13,fontWeight:600}}>{mem}</span><Pill color={T.teal} ch={`${tot} মিল`}/></div><div style={{height:6,background:T.surface,borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",width:`${(tot/mx)*100}%`,background:`linear-gradient(90deg,${T.teal},${T.accent})`,borderRadius:3,transition:"width .4s"}}/></div></div>);})}
    </GCard>
  </div>);
}

// ── EXPENSE ───────────────────────────────────────────────────────────────────
function ExpTab({data,month,year,onSave,toast,T}){
  const days=dim(month,year);
  const [sel,setSel]=useState(Math.min(NOW.getDate(),days)-1);
  const [amt,setAmt]=useState("");
  const [note,setNote]=useState("");
  const [svc,setSvc]=useState({...data.svc});
  useEffect(()=>{setAmt(data.expenses[sel]||"");setNote(data.expNotes?.[sel]||"");},[sel,data]);
  const saveExp=async()=>{const e=[...data.expenses];e[sel]=amt||0;const n=[...(data.expNotes||Array(days).fill(""))];n[sel]=note;await onSave({...data,expenses:e,expNotes:n});toast("খরচ সেভ হয়েছে ✓");};
  const saveDep=async()=>{await onSave({...data});toast("জমা সেভ হয়েছে ✓");};
  const saveSvc=async()=>{await onSave({...data,svc});toast("সার্ভিস চার্জ সেভ হয়েছে ✓");};
  const totE=data.expenses.reduce((a,b)=>a+b,0);
  const totS=Object.values(svc).reduce((a,b)=>a+b,0);
  return(<div style={{display:"flex",flexDirection:"column",gap:16}}>
    <GCard T={T}><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}><IBox n="shop" color={T.warn} bg={T.warnBg}/><div style={{fontWeight:700,fontSize:15}}>বাজার খরচ</div></div>
      <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:16}}>{Array.from({length:days},(_,i)=>{const has=(data.expenses[i]||0)>0,act=sel===i;return(<button key={i} onClick={()=>setSel(i)} style={{width:36,height:36,borderRadius:10,border:"none",background:act?`linear-gradient(135deg,${T.warn},#FBBF24)`:has?T.warnBg:T.surface,color:act?"#fff":has?T.warn:T.muted,fontWeight:act?800:500,cursor:"pointer",fontSize:13,boxShadow:act?`0 4px 12px ${T.warn}40`:"none"}}>{i+1}</button>);})}</div>
      <FIn T={T} ac={T.warn} label={`${sel+1} তারিখের বাজার খরচ (৳)`} val={amt} onChange={setAmt} ph="পরিমাণ লিখুন"/>
      <FIn T={T} ac={T.warn} label="বাজারের বিবরণ" val={note} onChange={setNote} type="text" ph="যেমন: মাছ, সবজি, চাল..."/>
      <Btn full ch={<><Ico n="save" s={16} c="#fff"/>সেভ করুন</>} onClick={saveExp} color={T.warn}/>
      <div style={{marginTop:10,textAlign:"right",fontSize:12,color:T.muted}}>মাসের মোট: <strong style={{color:T.warn,fontSize:14}}>৳{totE.toLocaleString()}</strong></div>
    </GCard>
    {data.expenses.some(e=>e>0)&&<GCard T={T}><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}><IBox n="note" color={T.warn} bg={T.warnBg}/><div style={{fontWeight:700,fontSize:15}}>বাজারের তালিকা</div></div>
      {data.expenses.map((e,i)=>e>0?(<div key={i} onClick={()=>setSel(i)} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 14px",background:sel===i?T.warnBg:T.surface,borderRadius:12,marginBottom:6,cursor:"pointer",border:`1px solid ${sel===i?T.warn+"50":T.border}`}}><div><div style={{fontWeight:700,fontSize:13}}>{i+1} তারিখ</div>{data.expNotes?.[i]&&<div style={{fontSize:11,color:T.muted,marginTop:2}}>{data.expNotes[i]}</div>}</div><Pill color={T.warn} ch={`৳${e.toLocaleString()}`}/></div>):null)}
    </GCard>}
    <GCard T={T}><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}><IBox n="wallet" color={T.green} bg={T.greenBg}/><div style={{fontWeight:700,fontSize:15}}>জমার টাকা</div></div>
      {data.members.map(mem=>(<div key={mem} style={{marginBottom:12}}><div style={{fontSize:12,fontWeight:700,color:T.green,marginBottom:5,display:"flex",alignItems:"center",gap:6}}><Av name={mem} T={T} size={24}/>{mem}</div><input type="number" value={data.deposits[mem]||""} placeholder="পরিমাণ লিখুন" onChange={e=>onSave({...data,deposits:{...data.deposits,[mem]:e.target.value===""?0:+e.target.value}})} style={{width:"100%",background:T.input,border:`1.5px solid ${T.green}35`,borderRadius:14,padding:"11px 16px",color:T.text,fontSize:14,outline:"none",boxSizing:"border-box",fontFamily:"'Segoe UI',sans-serif"}}/></div>))}
      <Btn full ch={<><Ico n="save" s={16} c="#fff"/>জমা সেভ করুন</>} onClick={saveDep} color={T.green}/>
    </GCard>
    <GCard T={T}><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}><IBox n="home" color={T.red} bg={T.redBg}/><div style={{fontWeight:700,fontSize:15}}>সার্ভিস চার্জ</div></div>
      {[["rent","🏠 খালা বিল"],["elec","⚡ বিদ্যুৎ বিল"],["gas","🔥 গ্যাস বিল"],["dep","💰 এয়ানত"]].map(([k,l])=>(<FIn key={k} T={T} ac={T.red} label={l} val={svc[k]||""} onChange={v=>setSvc(p=>({...p,[k]:v}))} ph="পরিমাণ লিখুন"/>))}
      <div style={{textAlign:"right",marginBottom:10,fontSize:13,color:T.muted}}>মোট: <strong style={{color:T.red,fontSize:15}}>৳{totS.toLocaleString()}</strong></div>
      <Btn full ch={<><Ico n="save" s={16} c="#fff"/>সার্ভিস চার্জ সেভ করুন</>} onClick={saveSvc} color={T.red}/>
    </GCard>
  </div>);
}

// ── SUMMARY ───────────────────────────────────────────────────────────────────
function SumTab({summary,totExp,totMills,rate,totSvc,data,onSave,toast,T}){
  const close=async()=>{await onSave({...data,closed:true});toast("মাস ক্লোজ হয়েছে ✓");};
  return(<div style={{display:"flex",flexDirection:"column",gap:16}}>
    {data?.closed&&<GCard T={T} style={{background:T.warnBg,border:`1.5px solid ${T.warn}`}}><div style={{display:"flex",alignItems:"center",gap:8}}><Ico n="lock" s={18} c={T.warn}/><span style={{color:T.warn,fontWeight:800}}>এই মাস ক্লোজড</span></div></GCard>}
    <GCard T={T}><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}><IBox n="chart" color={T.green} bg={T.greenBg}/><div style={{fontWeight:700,fontSize:15}}>মাসের সারাংশ</div></div>
      {[["মোট বাজার খরচ",`৳${totExp.toLocaleString()}`,T.warn],["সার্ভিস চার্জ",`৳${totSvc.toLocaleString()}`,T.red],["মোট মিল",`${totMills} টি`,T.teal],["মিল রেইট",rate>0?`৳${rate.toFixed(2)}/মিল`:"—",T.accent]].map(([k,v,c])=>(<div key={k} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:`1px solid ${T.border}`}}><span style={{color:T.muted,fontSize:13}}>{k}</span><span style={{fontWeight:700,color:c,fontSize:14}}>{v}</span></div>))}
    </GCard>
    {summary.map(({mem,myM,food,svc,cost,dep,udrito,ghati})=>(
      <GCard key={mem} T={T} style={{border:`1.5px solid ${udrito>0?T.green+"40":T.red+"40"}`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}><Av name={mem} T={T}/><div style={{fontWeight:800,fontSize:15}}>{mem}</div></div>
          <Pill color={udrito>0?T.green:T.red} ch={udrito>0?`উদ্রিত ৳${udrito.toFixed(0)}`:`ঘাটতি ৳${ghati.toFixed(0)}`}/>
        </div>
        <div style={{background:T.surface,borderRadius:12,padding:"10px 14px"}}>
          {[["মিল",`${myM} টি`],["খাবার খরচ",`৳${food.toFixed(0)}`],["সার্ভিস চার্জ",`৳${svc.toFixed(0)}`],["মোট খরচ",`৳${cost.toFixed(0)}`],["জমা",`৳${dep.toLocaleString()}`]].map(([k,v])=>(<div key={k} style={{display:"flex",justifyContent:"space-between",fontSize:13,padding:"4px 0"}}><span style={{color:T.muted}}>{k}</span><span style={{fontWeight:600}}>{v}</span></div>))}
        </div>
      </GCard>
    ))}
    {!data?.closed&&<Btn full ch={<><Ico n="lock" s={16} c="#fff"/>মাস ক্লোজ করুন</>} onClick={close} color={T.warn}/>}
  </div>);
}

// ── WALLET ────────────────────────────────────────────────────────────────────
function WalletTab({summary,totExp,totMills,rate,totSvc,month,year,data,T}){
  const totDep=Object.values(data.deposits).reduce((a,b)=>a+b,0);
  const svcPH=summary.length>0?totSvc/summary.length:0;
  const has=totMills>0;
  const totFood=summary.reduce((s,r)=>s+r.food,0);
  const totCost=summary.reduce((s,r)=>s+r.cost,0);
  const totU=summary.filter(r=>r.udrito>0).reduce((s,r)=>s+r.udrito,0);
  const totG=summary.filter(r=>r.ghati>0).reduce((s,r)=>s+r.ghati,0);
  const rA=T.mode==="dark"?"rgba(35,28,65,0.9)":"rgba(255,255,255,0.9)";
  const rB=T.mode==="dark"?"rgba(45,36,82,0.6)":"rgba(237,233,255,0.3)";
  const th=(c=T.text)=>({padding:"9px 7px",fontSize:11,fontWeight:700,color:c,background:T.surface,whiteSpace:"nowrap",textAlign:"center",borderBottom:`2px solid ${T.border}`,borderRight:`1px solid ${T.border}`});
  const td=(bg,c=T.text,b=false)=>({padding:"8px 7px",fontSize:11,color:c,fontWeight:b?700:400,textAlign:"center",background:bg,borderBottom:`1px solid ${T.border}`,borderRight:`1px solid ${T.border}`});
  return(<div style={{display:"flex",flexDirection:"column",gap:16}}>
    <GCard T={T} style={{background:`linear-gradient(135deg,${T.accentBg},${T.pinkBg})`,border:`1.5px solid ${T.accent}30`}}><div style={{display:"flex",alignItems:"center",gap:10}}><Ico n="wallet" s={22} c={T.accent}/><div><div style={{fontWeight:800,fontSize:16,color:T.text}}>Managing Wallet</div><div style={{color:T.muted,fontSize:12}}>{MN[month]} {year}</div></div></div></GCard>
    {!has&&<GCard T={T} style={{background:T.warnBg,border:`1.5px solid ${T.warn}`}}><div style={{display:"flex",gap:8,alignItems:"center"}}><Ico n="warn" s={18} c={T.warn}/><span style={{color:T.warn,fontWeight:600,fontSize:13}}>মিল এন্ট্রি করুন — উদ্রিত ও ঘাটতি বের হবে</span></div></GCard>}
    <div style={{overflowX:"auto",borderRadius:20,boxShadow:T.shadow}}>
      <table style={{borderCollapse:"collapse",minWidth:660,width:"100%"}}>
        <thead><tr>
          <th style={{...th(T.text),textAlign:"left",minWidth:100,position:"sticky",left:0,zIndex:2,borderLeft:`3px solid ${T.accent}`}}>নাম</th>
          <th style={th(T.green)}>জমা ৳</th><th style={th(T.teal)}>মিল</th><th style={th(T.teal)}>মোট</th>
          <th style={th(T.accent)}>রেইট</th><th style={th(T.warn)}>খাবার</th><th style={th(T.red)}>সা.চার্জ</th>
          <th style={th(T.red)}>মোট খরচ</th>
          <th style={th(T.green)}>উদ্রিত ✅</th>
          <th style={{...th(T.red),borderRight:"none"}}>ঘাটতি ❌</th>
        </tr></thead>
        <tbody>
          {summary.map(({mem,myM,food,svc,cost,dep,udrito,ghati},idx)=>{const bg=idx%2===0?rA:rB;return(<tr key={mem}>
            <td style={{...td(bg,T.text,true),textAlign:"left",position:"sticky",left:0,zIndex:1,borderLeft:`3px solid ${T.accent}30`}}>{mem}</td>
            <td style={td(bg,T.green,true)}>{dep.toLocaleString()}</td>
            <td style={td(bg,T.teal)}>{myM}</td><td style={td(bg,T.teal)}>{totMills}</td>
            <td style={td(bg,has?T.accent:T.faint)}>{has?rate.toFixed(2):"—"}</td>
            <td style={td(bg,has?T.warn:T.faint)}>{has?food.toFixed(0):"—"}</td>
            <td style={td(bg,T.red)}>{svc.toFixed(0)}</td>
            <td style={td(bg,has?T.red:T.faint,true)}>{has?cost.toFixed(0):"—"}</td>
            <td style={td(udrito>0?"rgba(52,211,153,0.18)":bg,T.green,true)}>{has&&udrito>0?`৳${udrito.toFixed(0)}`:"—"}</td>
            <td style={{...td(ghati>0?"rgba(248,113,113,0.18)":bg,T.red,true),borderRight:"none"}}>{has&&ghati>0?`৳${ghati.toFixed(0)}`:"—"}</td>
          </tr>);})}
          <tr>
            <td style={{...td(T.accentBg,T.text,true),textAlign:"left",position:"sticky",left:0,zIndex:1,borderLeft:`3px solid ${T.accent}`}}>মোট</td>
            <td style={td(T.accentBg,T.green,true)}>{totDep.toLocaleString()}</td>
            <td style={td(T.accentBg,T.teal,true)}>{totMills}</td><td style={td(T.accentBg,T.faint)}>—</td><td style={td(T.accentBg,T.faint)}>—</td>
            <td style={td(T.accentBg,T.warn,true)}>{has?totFood.toFixed(0):"—"}</td>
            <td style={td(T.accentBg,T.red,true)}>{(svcPH*summary.length).toFixed(0)}</td>
            <td style={td(T.accentBg,T.red,true)}>{has?totCost.toFixed(0):"—"}</td>
            <td style={td("rgba(52,211,153,0.18)",T.green,true)}>{has&&totU>0?`৳${totU.toFixed(0)}`:"—"}</td>
            <td style={{...td("rgba(248,113,113,0.18)",T.red,true),borderRight:"none"}}>{has&&totG>0?`৳${totG.toFixed(0)}`:"—"}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>);
}

// ── HISTORY ───────────────────────────────────────────────────────────────────
function HistTab({T}){
  const [hist,setHist]=useState([]);
  const [sel,setSel]=useState(null);
  useEffect(()=>{(async()=>{const r=[];for(let y=2024;y<=2027;y++)for(let m=0;m<12;m++){const d=await dbGet(mk(m,y));if(d){const tE=d.expenses.reduce((a,b)=>a+b,0),tM=d.members.reduce((s,x)=>s+(d.mills[x]?.reduce((a,b)=>a+b,0)||0),0),tS=Object.values(d.svc||d.serviceCharge||{}).reduce((a,b)=>a+b,0);r.push({m,y,data:d,tE,tM,tS,closed:d.closed});}}setHist(r.reverse());})();},[]);
  if(sel){
    const {data:d,tE,tM,tS}=sel,rt=tM>0?tE/tM:0;
    return(<div style={{display:"flex",flexDirection:"column",gap:14}}>
      <button onClick={()=>setSel(null)} style={{display:"flex",alignItems:"center",gap:8,background:"none",border:"none",color:T.accent,cursor:"pointer",fontWeight:700,fontSize:15,padding:0}}><Ico n="back" s={18} c={T.accent}/>ফিরে যান</button>
      <GCard T={T}><div style={{fontWeight:800,fontSize:17,marginBottom:14,display:"flex",alignItems:"center",gap:10}}>{MN[sel.m]} {sel.y}{sel.closed&&<Pill color={T.warn} ch="ক্লোজড"/>}</div>
        {d.members.map(mem=>{const myM=d.mills[mem]?.reduce((a,b)=>a+b,0)||0,sv=d.members.length>0?tS/d.members.length:0,cost=myM*rt+sv,dep=d.deposits[mem]||0,bal=dep-cost,ud=bal>0?bal:0,gh=bal<0?Math.abs(bal):0;return(
          <div key={mem} style={{background:T.surface,borderRadius:14,padding:14,marginBottom:10,border:`1px solid ${ud>0?T.green+"30":T.red+"30"}`}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><div style={{display:"flex",alignItems:"center",gap:8}}><Av name={mem} T={T} size={28}/><span style={{fontWeight:700}}>{mem}</span></div><Pill color={ud>0?T.green:T.red} ch={ud>0?`উদ্রিত ৳${ud.toFixed(0)}`:`ঘাটতি ৳${gh.toFixed(0)}`}/></div>
            <div style={{fontSize:12,color:T.muted}}>{myM} মিল · খরচ ৳{cost.toFixed(0)} · জমা ৳{dep}</div>
          </div>
        );})}
      </GCard>
    </div>);
  }
  return(<div style={{display:"flex",flexDirection:"column",gap:12}}>
    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}><Ico n="clock" s={20} c={T.accent}/><div style={{fontWeight:700,fontSize:16}}>বিগত মাসের হিসাব</div></div>
    {hist.length===0?<GCard T={T} style={{textAlign:"center",padding:40}}><div style={{fontSize:40,marginBottom:8}}>📭</div><div style={{color:T.muted}}>এখনো কোনো ডেটা নেই</div></GCard>
    :hist.map(h=>(<GCard key={`${h.m}-${h.y}`} T={T} style={{cursor:"pointer"}} onClick={()=>setSel(h)}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{display:"flex",alignItems:"center",gap:12}}><div style={{width:42,height:42,borderRadius:12,background:T.accentBg,display:"flex",alignItems:"center",justifyContent:"center"}}><Ico n="clock" s={20} c={T.accent}/></div><div><div style={{fontWeight:700,fontSize:14}}>{MN[h.m]} {h.y}</div><div style={{color:T.muted,fontSize:12}}>৳{h.tE.toLocaleString()} · {h.tM} মিল</div></div></div><div style={{display:"flex",alignItems:"center",gap:8}}>{h.closed&&<Pill color={T.warn} ch="ক্লোজড"/>}<Ico n="back" s={16} c={T.faint}/></div></div></GCard>))}
  </div>);
}

// ── CONTACT ───────────────────────────────────────────────────────────────────
function ContactTab({toast,T}){
  const [contacts,setContacts]=useState([]);
  const [form,setForm]=useState({name:"",phone:"",role:""});
  const [adding,setAdding]=useState(false);
  useEffect(()=>{(async()=>{const c=await dbGet("mess_contacts");if(c)setContacts(c);})();},[]);
  const save=async l=>{setContacts(l);await dbSet("mess_contacts",l);};
  const add=async()=>{if(!form.name||!form.phone)return;await save([...contacts,{...form,id:Date.now()}]);setForm({name:"",phone:"",role:""});setAdding(false);toast("যোগাযোগ যোগ হয়েছে ✓");};
  const del=async id=>{await save(contacts.filter(c=>c.id!==id));toast("মুছে গেছে");};
  const rc={ম্যানেজার:T.accent,মালিক:T.gold,ডাক্তার:T.green,পুলিশ:T.red,দোকান:T.teal,অন্যান্য:T.muted};
  return(<div style={{display:"flex",flexDirection:"column",gap:16}}>
    <GCard T={T} style={{background:T.redBg,border:`1.5px solid ${T.red}40`}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}><Ico n="warn" s={20} c={T.red}/><div style={{fontWeight:800,fontSize:15,color:T.red}}>জরুরি নম্বর</div></div>
      {[["🚑 অ্যাম্বুলেন্স","999"],["🚒 ফায়ার","199"],["🚓 পুলিশ","999"],["🏥 DGHS","16321"]].map(([n,num])=>(<a key={n} href={`tel:${num}`} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 14px",background:"rgba(255,255,255,0.15)",borderRadius:12,marginBottom:8,textDecoration:"none"}}><span style={{fontWeight:600,color:T.text,fontSize:13}}>{n}</span><div style={{display:"flex",alignItems:"center",gap:8}}><span style={{color:T.red,fontWeight:800}}>{num}</span><div style={{width:32,height:32,borderRadius:"50%",background:T.red,display:"flex",alignItems:"center",justifyContent:"center"}}><Ico n="phone" s={15} c="#fff"/></div></div></a>))}
    </GCard>
    <GCard T={T} style={{background:`linear-gradient(135deg,${T.accentBg},${T.pinkBg})`,border:`1.5px solid ${T.accent}40`}}>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
        <div style={{width:48,height:48,borderRadius:"50%",background:`linear-gradient(135deg,${T.accent},${T.pink})`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Ico n="star" s={22} c="#fff"/></div>
        <div><div style={{fontWeight:800,fontSize:15,color:T.text}}>Admin সাপোর্ট</div><div style={{fontSize:12,color:T.muted}}>অ্যাপে সমস্যা হলে যোগাযোগ করুন</div></div>
      </div>
      <div style={{background:"rgba(255,255,255,0.2)",borderRadius:14,padding:14}}>
        <div style={{fontSize:12,color:T.muted,marginBottom:8}}>📧 ডেভেলপার ইমেইল:</div>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}><div style={{width:40,height:40,borderRadius:10,background:T.accent,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Ico n="mail" s={18} c="#fff"/></div><div><div style={{fontWeight:700,fontSize:13,color:T.accent}}>si6097538@gmail.com</div><div style={{fontSize:11,color:T.muted,marginTop:2}}>সাধারণত ২৪ ঘণ্টায় উত্তর দেওয়া হয়</div></div></div>
        <a href="mailto:si6097538@gmail.com?subject=মেস অ্যাপ সমস্যা" style={{textDecoration:"none",display:"block"}}><Btn full ch={<><Ico n="mail" s={15} c="#fff"/>ইমেইল করুন</>} onClick={()=>{}} color={T.accent}/></a>
      </div>
    </GCard>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <div style={{display:"flex",alignItems:"center",gap:8}}><Ico n="users" s={20} c={T.accent}/><div style={{fontWeight:700,fontSize:15}}>মেসের যোগাযোগ</div></div>
      <Btn sm ch={<><Ico n={adding?"x":"plus"} s={14} c="#fff"/>{adding?"বাতিল":"নতুন"}</>} onClick={()=>setAdding(!adding)} color={T.accent}/>
    </div>
    {adding&&<GCard T={T}><FIn T={T} ac={T.accent} label="নাম" val={form.name} onChange={v=>setForm(p=>({...p,name:v}))} type="text" ph="নাম লিখুন"/><FIn T={T} ac={T.teal} label="ফোন নম্বর" val={form.phone} onChange={v=>setForm(p=>({...p,phone:v}))} type="text" ph="01XXXXXXXXX"/><div style={{marginBottom:14}}><div style={{fontSize:11,fontWeight:700,color:T.accent,marginBottom:6}}>ভূমিকা</div><div style={{display:"flex",flexWrap:"wrap",gap:8}}>{["ম্যানেজার","মালিক","ডাক্তার","পুলিশ","দোকান","অন্যান্য"].map(r=>(<button key={r} onClick={()=>setForm(p=>({...p,role:r}))} style={{padding:"6px 14px",borderRadius:20,border:`1.5px solid ${form.role===r?T.accent:T.border}`,background:form.role===r?T.accentBg:T.surface,color:form.role===r?T.accent:T.muted,fontWeight:form.role===r?700:500,fontSize:12,cursor:"pointer",fontFamily:"'Segoe UI',sans-serif"}}>{r}</button>))}</div></div><Btn full ch={<><Ico n="save" s={16} c="#fff"/>সেভ করুন</>} onClick={add} color={T.accent}/></GCard>}
    {contacts.map(c=>{const cc=rc[c.role]||T.muted;return(<GCard key={c.id} T={T}><div style={{display:"flex",alignItems:"center",gap:12}}><div style={{width:46,height:46,borderRadius:"50%",background:`linear-gradient(135deg,${cc},${cc}88)`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{color:"#fff",fontWeight:800,fontSize:18}}>{c.name[0]}</span></div><div style={{flex:1}}><div style={{fontWeight:700,fontSize:14}}>{c.name}</div><div style={{display:"flex",alignItems:"center",gap:6,marginTop:3}}>{c.role&&<Pill color={cc} ch={c.role}/>}<span style={{color:T.muted,fontSize:12}}>{c.phone}</span></div></div><div style={{display:"flex",gap:8}}><a href={`tel:${c.phone}`} style={{width:36,height:36,borderRadius:"50%",background:T.greenBg,display:"flex",alignItems:"center",justifyContent:"center",textDecoration:"none"}}><Ico n="phone" s={16} c={T.green}/></a><button onClick={()=>del(c.id)} style={{width:36,height:36,borderRadius:"50%",background:T.redBg,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><Ico n="trash" s={15} c={T.red}/></button></div></div></GCard>);})}
    {contacts.length===0&&!adding&&<GCard T={T} style={{textAlign:"center",padding:28}}><div style={{fontSize:36,marginBottom:8}}>📱</div><div style={{color:T.muted,fontSize:13}}>"নতুন" বাটন দিয়ে যোগাযোগ যোগ করুন</div></GCard>}
  </div>);
}

// ── PROFILE ───────────────────────────────────────────────────────────────────
function ProfileTab({profile,onSave,toast,T}){
  const [name,setName]=useState(profile?.name||"");
  const [messName,setMessName]=useState(profile?.messName||"");
  const [mgr,setMgr]=useState(profile?.managerName||"");
  const [photo,setPhoto]=useState(profile?.photo||null);
  const ref=useRef();
  const pick=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>setPhoto(r.result);r.readAsDataURL(f);};
  return(<div style={{display:"flex",flexDirection:"column",gap:16}}>
    <GCard T={T} style={{background:`linear-gradient(135deg,${T.accentBg},${T.pinkBg})`,display:"flex",flexDirection:"column",alignItems:"center",padding:32}}>
      <div style={{position:"relative",marginBottom:12}}>
        <div style={{width:88,height:88,borderRadius:"50%",overflow:"hidden",background:`linear-gradient(135deg,${T.accent},${T.pink})`,border:"4px solid rgba(255,255,255,0.3)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 8px 24px ${T.accent}40`}}>
          {photo?<img src={photo} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<Ico n="user" s={44} c="#fff"/>}
        </div>
        <button onClick={()=>ref.current.click()} style={{position:"absolute",bottom:0,right:0,width:30,height:30,borderRadius:"50%",background:T.accent,border:"3px solid white",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 2px 8px ${T.accent}60`}}><Ico n="cam" s={14} c="#fff"/></button>
        <input ref={ref} type="file" accept="image/*" onChange={pick} style={{display:"none"}}/>
      </div>
      <div style={{color:T.muted,fontSize:12,marginBottom:4}}>Set your profile picture</div>
      {photo&&<button onClick={()=>setPhoto(null)} style={{background:"none",border:"none",color:T.red,fontSize:12,cursor:"pointer",fontWeight:600,marginTop:4}}>ছবি সরান ✕</button>}
    </GCard>
    <GCard T={T}><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}><Ico n="user" s={18} c={T.accent}/><div style={{fontWeight:700,fontSize:15}}>আপনার তথ্য</div></div>
      <FIn T={T} ac={T.accent} label="পরিচালকের নাম" val={name} onChange={setName} type="text" ph="পরিচালকের নাম লিখুন"/>
      <FIn T={T} ac={T.teal} label="🍚 মেসের নাম" val={messName} onChange={setMessName} type="text" ph="যেমন: ভাই ভাই মেস"/>
      <FIn T={T} ac={T.pink} label="⭐ এই মাসের ম্যানেজার" val={mgr} onChange={setMgr} type="text" ph="ম্যানেজারের নাম"/>
      <div style={{fontSize:11,color:T.muted,marginBottom:16,marginTop:-8}}>* প্রতি মাসে পরিবর্তন করুন</div>
      <Btn full ch={<><Ico n="save" s={16} c="#fff"/>প্রোফাইল সেভ করুন</>} onClick={async()=>{await onSave({name,messName,managerName:mgr,photo});toast("প্রোফাইল সেভ হয়েছে ✓");}} color={T.accent}/>
    </GCard>
  </div>);
}

// ── MEMBERS MODAL ─────────────────────────────────────────────────────────────
function MemModal({members,onSave,onClose,T}){
  const [list,setList]=useState([...members]);
  const [nn,setNn]=useState("");
  const add=()=>{const n=nn.trim();if(n&&!list.includes(n)){setList(p=>[...p,n]);setNn("");}};
  return(<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",backdropFilter:"blur(8px)",zIndex:60,display:"flex",alignItems:"flex-end"}}>
    <div style={{background:T.sidebar,borderRadius:"24px 24px 0 0",width:"100%",maxWidth:480,margin:"0 auto",padding:24,maxHeight:"80vh",overflowY:"auto",backdropFilter:"blur(20px)"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}><Ico n="users" s={20} c={T.accent}/><div style={{fontWeight:800,fontSize:17,color:T.text}}>সদস্য ম্যানেজ করুন</div></div>
        <button onClick={onClose} style={{width:36,height:36,borderRadius:"50%",background:T.accentBg,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><Ico n="x" s={18} c={T.accent}/></button>
      </div>
      <div style={{display:"flex",gap:10,marginBottom:16}}>
        <input type="text" value={nn} onChange={e=>setNn(e.target.value)} onKeyDown={e=>e.key==="Enter"&&add()} placeholder="নতুন সদস্যের নাম" style={{flex:1,background:T.input,border:`1.5px solid ${T.accent}40`,borderRadius:14,padding:"11px 16px",color:T.text,fontSize:14,outline:"none",fontFamily:"'Segoe UI',sans-serif"}}/>
        <Btn ch={<Ico n="plus" s={16} c="#fff"/>} onClick={add} color={T.accent}/>
      </div>
      {list.map((m,i)=>(<div key={m} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 16px",background:T.surface,borderRadius:14,marginBottom:8,border:`1px solid ${T.border}`}}><div style={{display:"flex",alignItems:"center",gap:10}}><Av name={m} T={T}/><span style={{fontWeight:600,color:T.text}}>{m}</span></div><button onClick={()=>setList(p=>p.filter((_,j)=>j!==i))} style={{width:32,height:32,borderRadius:"50%",background:T.redBg,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><Ico n="trash" s={14} c={T.red}/></button></div>))}
      <div style={{marginTop:16}}><Btn full ch={<><Ico n="save" s={16} c="#fff"/>সেভ করুন</>} onClick={()=>onSave(list)} color={T.accent}/></div>
    </div>
  </div>);
}
