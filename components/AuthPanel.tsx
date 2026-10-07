'use client';

import {useEffect,useState} from 'react';
import {readStorage,writeStorage,isDemoUser} from '@/lib/browser-storage';

export type DemoUser={id:string;username:string;email:string;createdAt:string};
type StoredUser=DemoUser&{passwordHash:string};

async function sha256(value:string){
  const data=new TextEncoder().encode(value);
  const hash=await crypto.subtle.digest('SHA-256',data);
  return Array.from(new Uint8Array(hash)).map(b=>b.toString(16).padStart(2,'0')).join('');
}
const USERS='mongolz-demo-users-v1',SESSION='mongolz-demo-session-v1';
function loadUsers():StoredUser[]{try{const users:unknown=JSON.parse(readStorage(USERS)||'[]');return Array.isArray(users)?users.filter((u):u is StoredUser=>isDemoUser(u)&&typeof (u as StoredUser).passwordHash==='string'):[]}catch{return []}}
export function loadSession():DemoUser|null{
  if(typeof window==='undefined')return null;
  try{const user:unknown=JSON.parse(readStorage(SESSION)||'null');return isDemoUser(user)?user:null}catch{return null}
}

export default function AuthPanel({lang,initialMode='login',onClose,onSession}:{lang:'mn'|'en';initialMode?:'login'|'register';onClose:()=>void;onSession:(u:DemoUser|null)=>void}){
 const [mode,setMode]=useState<'login'|'register'>(initialMode);
 const [username,setUsername]=useState(''),[email,setEmail]=useState(''),[password,setPassword]=useState(''),[confirm,setConfirm]=useState('');
 const [error,setError]=useState(''),[busy,setBusy]=useState(false);
 const mn=lang==='mn';
 useEffect(()=>{setMode(initialMode);setError('')},[initialMode]);
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
    if(name.length<3||name.length>32){setError(mn?'Хэрэглэгчийн нэр 3–32 тэмдэгт байна.':'Username must contain 3–32 characters.');return}
    if(password!==confirm){setError(mn?'Нууц үг таарахгүй байна.':'Passwords do not match.');return}
    if(users.some(u=>u.email===mail)){setError(mn?'Энэ имэйлээр бүртгэл байна.':'An account with this email already exists.');return}
    if(users.some(u=>u.username.toLowerCase()===name.toLowerCase())){setError(mn?'Энэ хэрэглэгчийн нэр ашиглагдсан байна.':'This username is already taken.');return}
    const user:StoredUser={id:crypto.randomUUID(),username:name,email:mail,passwordHash:hash,createdAt:new Date().toISOString()};
    if(!writeStorage(USERS,JSON.stringify([...users,user])))throw Error('storage');
    const session:DemoUser={id:user.id,username:user.username,email:user.email,createdAt:user.createdAt};
    if(!writeStorage(SESSION,JSON.stringify(session)))throw Error('storage');onSession(session);onClose();
   }else{
    const user=users.find(u=>u.email===mail&&u.passwordHash===hash);
    if(!user){setError(mn?'Имэйл эсвэл нууц үг буруу байна.':'Incorrect email or password.');return}
    const session:DemoUser={id:user.id,username:user.username,email:user.email,createdAt:user.createdAt};
    if(!writeStorage(SESSION,JSON.stringify(session)))throw Error('storage');onSession(session);onClose();
   }
  }catch{setError(mn?'Бүртгэлийг хадгалж чадсангүй. Browser-ийн хадгалалтыг зөвшөөрөөд дахин оролдоорой.':'Unable to save this demo account. Allow browser storage and try again.')}finally{setBusy(false)}
 }
 return <div className="authPanel2026">
   <div className="authHead2026"><div className="authMark2026">M</div><div><span>MONGOLZ ACCOUNT</span><h2>{mode==='login'?(mn?'Нэвтрэх':'Sign in'):(mn?'Бүртгэл үүсгэх':'Create account')}</h2></div></div>
   <div className="authTabs2026"><button className={mode==='login'?'active':''} onClick={()=>setMode('login')}>{mn?'Нэвтрэх':'Sign in'}</button><button className={mode==='register'?'active':''} onClick={()=>setMode('register')}>{mn?'Бүртгүүлэх':'Register'}</button></div>
   <form onSubmit={submit}>
     {mode==='register'&&<label>{mn?'Хэрэглэгчийн нэр':'Username'}<input value={username} onChange={e=>setUsername(e.target.value)} maxLength={32} required autoComplete="username" placeholder="mongolz_player"/></label>}
     <label>{mn?'Имэйл':'Email'}<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required maxLength={254} autoComplete="email" placeholder="you@example.com"/></label>
     <label>{mn?'Нууц үг':'Password'}<input type="password" value={password} onChange={e=>setPassword(e.target.value)} autoComplete={mode==='login'?'current-password':'new-password'} placeholder="••••••••"/></label>
     {mode==='register'&&<label>{mn?'Нууц үг давтах':'Confirm password'}<input type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} autoComplete="new-password" placeholder="••••••••"/></label>}
     {error&&<div className="authError2026" role="alert">{error}</div>}
     <button className="authSubmit2026" disabled={busy}>{busy?'…':mode==='login'?(mn?'НЭВТРЭХ':'SIGN IN'):(mn?'БҮРТГЭЛ ҮҮСГЭХ':'CREATE ACCOUNT')}</button>
   </form>
   <div className="authSafety2026">🔒 {mn?'Demo account. Мэдээлэл зөвхөн энэ browser-д хадгалагдана. Production auth биш.':'Demo account. Data stays in this browser only. This is not production authentication.'}</div>
 </div>
}
