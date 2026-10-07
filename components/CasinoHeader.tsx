'use client';
import Icon from './Icon';
import type {DemoUser} from './AuthPanel';
type Props={lang:'mn'|'en';query:string;balance:number;user:DemoUser|null;menuOpen:boolean;onMenu:()=>void;onHome:()=>void;onQuery:(q:string)=>void;onLanguage:()=>void;onWallet:()=>void;onHelp:()=>void;onPromotions:()=>void;onAuth:(mode:'login'|'register')=>void;onProfile:()=>void};
export default function CasinoHeader(p:Props){
 const mn=p.lang==='mn';
 return <header className="topbar royalTopbar refinedHeader">
  <div className="headerIdentity"><button className="headerMenu" onClick={p.onMenu} aria-label={mn?'Үндсэн цэс':'Main menu'} aria-expanded={p.menuOpen} aria-controls="main-navigation"><Icon name={p.menuOpen?'close':'menu'}/></button><button className="brand" onClick={p.onHome} aria-label="MONGOLZ — Home"><span className="brandMark">M</span><span><b>MONGOLZ</b><small>CASINO DEMO</small></span></button></div>
  <form className="searchWrap royalSearch headerSearch" role="search" onSubmit={e=>{e.preventDefault();p.onQuery(p.query)}}><Icon name="search"/><input aria-label={mn?'Тоглоом хайх':'Search games'} value={p.query} onChange={e=>p.onQuery(e.target.value)} placeholder={mn?'Тоглоом, provider хайх…':'Search games and providers…'}/>{p.query&&<button type="button" className="clearSearch" onClick={()=>p.onQuery('')} aria-label={mn?'Хайлт цэвэрлэх':'Clear search'}><Icon name="close"/></button>}</form>
  <div className="topActions royalTopActions">
   <button className="royalMiniBtn headerPromo" onClick={p.onPromotions}><Icon name="gift"/><span>{mn?'Урамшуулал':'Promotions'}</span></button>
   <button className="royalIconBtn headerHelp" aria-label={mn?'Тусламж':'Help'} onClick={p.onHelp}><Icon name="help"/></button>
   <button className="royalLang" aria-label={mn?'Switch to English':'Монгол хэл рүү солих'} onClick={p.onLanguage}><Icon name="globe"/><b>{p.lang.toUpperCase()}</b><span>⌄</span></button>
   <button className="balanceButton royalBalance" aria-label={`${mn?'Demo үлдэгдэл':'Demo balance'}: ₮ ${p.balance.toLocaleString()}`} onClick={p.onWallet}><span className="walletCoin">₮</span><span className="walletAmount"><small>DEMO BALANCE</small><b>{p.balance.toLocaleString()}</b></span><span className="walletChevron">⌄</span></button>
   {p.user?<button className="headerUser2026" onClick={p.onProfile} aria-label={`${mn?'Профайл':'Profile'}: ${p.user.username}`}><span>{p.user.username.slice(0,1).toUpperCase()}</span><b>{p.user.username}</b><Icon name="chevron"/></button>:<><button className="headerLogin2026" onClick={()=>p.onAuth('login')}>{mn?'Нэвтрэх':'Sign in'}</button><button className="headerRegister2026" onClick={()=>p.onAuth('register')}><span>{mn?'Бүртгүүлэх':'Join now'}</span><Icon name="user"/></button></>}
  </div>
 </header>
}
