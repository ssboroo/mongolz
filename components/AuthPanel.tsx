'use client';

import {useEffect,useState} from 'react';

export type DemoUser={id:string;username:string;email:string;createdAt:string};
type StoredUser=DemoUser&{passwordHash:string};

async function sha256(value:string){
  const data=new TextEncoder().encode(value);
  const hash=await crypto.subtle.digest('SHA-256',data);
  return Array.from(new Uint8Array(hash)).map(b=>b.toString(16).padStart(2,'0')).join('');
}
const USERS='mongolz-demo-users-v1',SESSION='mongolz-demo-session-v1';
function loadUsers():StoredUser[]{try{return JSON.parse(localStorage.getItem(USERS)||'[]')}catch{return []}}
export function loadSession():DemoUser|null{
  if(typeof window==='undefined')return null;
  try{return JSON.parse(localStorage.getItem(SESSION)||'null')}catch{return null}
}

export default function AuthPanel({lang,onClose,onSession}:{lang:'mn'|'en';onClose:()=>void;onSession:(u:DemoUser|null)=>void}){
 const [mode,setMode]=useState<'login'|'register'>('login');
 const [username,setUsername]=useState(''),[email,setEmail]=useState(''),[password,setPassword]=useState(''),[confirm,setConfirm]=useState('');
 const [error,setError]=useState(''),[busy,setBusy]=useState(false);
 const mn=lang==='mn';
 useEffect(()=>setError(''),[mode]);
 async function submit(e:React.FormEvent){
  e.preventDefault();setError('');
  const mail=email.trim().toLowerCase();
  if(!/^\S+@\S+\.\S+$/.test(mail)){setError(mn?'Имэйл хаяг буруу байна.':'Enter a valid email.');return}
  if(password.length<8){setError(mn?'Нууц үг хамгийн багадаа 8 тэмдэгт байна.':'Password must be at least 8 characters.');return}
  setBusy(true);
  try{
   const users=loadUsers();
   const hash=await sha256(password);
   if(mode==='register'){
    const name=username.trim();
    if(name.length<3){setError(mn?'Хэрэглэгчийн нэр 3-аас дээш тэмдэгт байна.':'Username must be at least 3 characters.');return}
    if(password!==confirm){setError(mn?'Нууц үг таарахгүй байна.':'Passwords do not match.');return}
    if(users.some(u=>u.email===mail)){setError(mn?'Энэ имэйлээр бүртгэл байна.':'An account with this email already exists.');return}
    if(users.some(u=>u.username.toLowerCase()===name.toLowerCase())){setError(mn?'Энэ хэрэглэгчийн нэр ашиглагдсан байна.':'This username is already taken.');return}
    const user:StoredUser={id:crypto.randomUUID(),username:name,email:mail,passwordHash:hash,createdAt:new Date().toISOString()};
    localStorage.setItem(USERS,JSON.stringify([...users,user]));
    const session:DemoUser={id:user.id,username:user.username,email:user.email,createdAt:user.createdAt};
    localStorage.setItem(SESSION,JSON.stringify(session));onSession(session);onClose();
   }else{
    const user=users.find(u=>u.email===mail&&u.passwordHash===hash);
    if(!user){setError(mn?'Имэйл эсвэл нууц үг буруу байна.':'Incorrect email or password.');return}
    const session:DemoUser={id:user.id,username:user.username,email:user.email,createdAt:user.createdAt};
    localStorage.setItem(SESSION,JSON.stringify(session));onSession(session);onClose();
   }
  }finally{setBusy(false)}
 }
 return <div className="authPanel2026">
   <div className="authHead2026"><div className="authMark2026">M</div><div><span>MONGOLZ ACCOUNT</span><h2>{mode==='login'?(mn?'Нэвтрэх':'Sign in'):(mn?'Бүртгэл үүсгэх':'Create account')}</h2></div></div>
   <div className="authTabs2026"><button className={mode==='login'?'active':''} onClick={()=>setMode('login')}>{mn?'Нэвтрэх':'Sign in'}</button><button className={mode==='register'?'active':''} onClick={()=>setMode('register')}>{mn?'Бүртгүүлэх':'Register'}</button></div>
   <form onSubmit={submit}>
     {mode==='register'&&<label>{mn?'Хэрэглэгчийн нэр':'Username'}<input value={username} onChange={e=>setUsername(e.target.value)} autoComplete="username" placeholder="mongolz_player"/></label>}
     <label>{mn?'Имэйл':'Email'}<input type="email" value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email" placeholder="you@example.com"/></label>
     <label>{mn?'Нууц үг':'Password'}<input type="password" value={password} onChange={e=>setPassword(e.target.value)} autoComplete={mode==='login'?'current-password':'new-password'} placeholder="••••••••"/></label>
     {mode==='register'&&<label>{mn?'Нууц үг давтах':'Confirm password'}<input type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} autoComplete="new-password" placeholder="••••••••"/></label>}
     {error&&<div className="authError2026">{error}</div>}
     <button className="authSubmit2026" disabled={busy}>{busy?'…':mode==='login'?(mn?'НЭВТРЭХ':'SIGN IN'):(mn?'БҮРТГЭЛ ҮҮСГЭХ':'CREATE ACCOUNT')}</button>
   </form>
   <div className="authSafety2026">🔒 {mn?'Demo account. Мэдээлэл зөвхөн энэ browser-д хадгалагдана. Production auth биш.':'Demo account. Data stays in this browser only. This is not production authentication.'}</div>
 </div>
}
