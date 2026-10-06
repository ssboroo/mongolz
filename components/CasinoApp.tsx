'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Icon from './Icon';
import ProviderLogo from './ProviderLogo';
import useModal from './useModal';
import { games, type GameMeta } from '@/lib/games';
import catalog from '@/lib/public-catalog.json';
import DemoGame from './DemoGame';
import ProviderSection from './ProviderSection';
import ComplianceCenter from './ComplianceCenter';
import AuthPanel, {loadSession, type DemoUser} from './AuthPanel';

type Lang='mn'|'en';
type History={id:string; game:string; bet:number; result:number; at:string};
type PublicGame={id:string;name:string;provider:string;category:string;kind?:string;url?:string;icon?:string};

const PUBLIC=(catalog as {games:PublicGame[]}).games;

// Reference lobby tiles are illustrative artwork; launches remain local simulations.
const referenceGames=(names:string[],prefix:string):PublicGame[]=>names.map((name,i)=>({id:prefix+i,name,provider:'MONGOLZ Demo',category:'slots',kind:'local',url:'/royal/hd/'+prefix+i+'.webp'}));
const POPULAR=referenceGames(['Sweet Fantasy','Gates of Olympus','Big Bass Adventure',"Dragon’s Treasure",'Queen of the Nile','Lucky Paws','Sugar Rush 1000','Wild Buffalo','Book of Kings','Fruit Party'],'popular-');
const HERO=POPULAR.slice(0,6);
const NEW_GAMES=referenceGames(['Crystal Wolves','Temple of Fortuna','Panda Fortune','Golden Bull','Divine Queen','Wild West','Dragon Fire','Lucky Cat','Samurai Fortune','Mystic Sorceress'],'new-');
const PROVIDERS=['Pragmatic Play','PG Soft','Hacksaw Gaming','Play’n GO','Evolution','NetEnt','Relax Gaming','Nolimit City','Push Gaming','Quickspin'];

const T={
 mn:{casino:'Казино',originals:'MONGOLZ Originals',tables:'Ширээний тоглоом',slots:'Слот',search:'Тоглоом, provider эсвэл категориор хайх...',balance:'Demo үлдэгдэл',deposit:'Бүртгүүлэх',history:'Түүх',responsible:'Хариуцлагатай тоглолт',demo:'DEMO MODE',cashier:'Demo Cashier',cashierText:'Visa/Mastercard болон crypto урсгалын UI demo. Бодит гүйлгээ хийхгүй.',reset:'Demo баланс сэргээх',notice:'Энэ хувилбар бодит мөнгө, бодит карт эсвэл crypto хөрөнгө ашиглахгүй.'},
 en:{casino:'Casino',originals:'MONGOLZ Originals',tables:'Table games',slots:'Slots',search:'Search games, providers or categories...',balance:'Demo balance',deposit:'Register',history:'History',responsible:'Responsible play',demo:'DEMO MODE',cashier:'Demo Cashier',cashierText:'Visa/Mastercard and crypto payment-flow UI demo. No real transactions.',reset:'Reset demo balance',notice:'This build never processes real money, cards or crypto assets.'}
} as const;

function engineFor(g:PublicGame,i=0):GameMeta{
 const id=g.category==='slots'?'slot':g.category==='live'?(['roulette','blackjack','baccarat'] as const)[i%3]:g.category==='table'?'blackjack':(['plinko','mines','dice','crash'] as const)[i%4];
 const cat:GameMeta['category']=g.category==='slots'?'Slots':g.category==='live'||g.category==='table'?'Table':'Originals';
 return {id,icon:g.icon||'✦',category:cat,mn:g.name,en:g.name,blurbMn:`${g.provider} • Demo тоглоом`,blurbEn:`${g.provider} • Local simulation demo`,tag:'DEMO'};
}

export default function CasinoApp({initialView='lobby'}:{initialView?:'lobby'|'slots'|'live'|'providers'}){
 const router=useRouter();
 const [heroIndex,setHeroIndex]=useState(0);
 const [trustOpen,setTrustOpen]=useState(false);
 const [mobileSearch,setMobileSearch]=useState(false);
 const [lang,setLang]=useState<Lang>('mn');
 const [active,setActive]=useState<GameMeta|null>(null);
 const [category,setCategory]=useState('All');
 const [query,setQuery]=useState('');
 const [balance,setBalance]=useState(1250000);
 const [history,setHistory]=useState<History[]>([]);
 const [hydrated,setHydrated]=useState(false);
 const [cashier,setCashier]=useState(false);
 const [historyOpen,setHistoryOpen]=useState(false);
 const [providerCategory,setProviderCategory]=useState(initialView==='slots'?'slots':initialView==='live'?'live':'');
 const [providerFilter,setProviderFilter]=useState('');
 const [user,setUser]=useState<DemoUser|null>(null);
 const [authOpen,setAuthOpen]=useState(false);
 const [profileOpen,setProfileOpen]=useState(false);
 const [supportOpen,setSupportOpen]=useState(false);
 const [authMode,setAuthMode]=useState<'login'|'register'>('login');
 const t=T[lang];
 const heroGames=[...HERO.slice(heroIndex),...HERO.slice(0,heroIndex)];
 useEffect(()=>{setProviderCategory(initialView==='slots'?'slots':initialView==='live'?'live':'')},[initialView]);
 useEffect(()=>{const saved=localStorage.getItem('mongolz-lang');if(saved==='en'||saved==='mn')setLang(saved)},[]);
 useEffect(()=>{localStorage.setItem('mongolz-lang',lang);document.documentElement.lang=lang},[lang]);
 useModal(Boolean(active||cashier||historyOpen||authOpen||profileOpen||supportOpen||trustOpen),()=>{setActive(null);setCashier(false);setHistoryOpen(false);setAuthOpen(false);setProfileOpen(false);setSupportOpen(false);setTrustOpen(false)});

 useEffect(()=>{
  const raw=localStorage.getItem('mongolz-demo-state');
  if(raw){try{const s=JSON.parse(raw);if(Number.isFinite(s.balance)&&s.balance>=0)setBalance(s.balance);if(Array.isArray(s.history))setHistory(s.history)}catch{}}
  setUser(loadSession());setHydrated(true);
 },[]);
 useEffect(()=>{if(!hydrated)return;localStorage.setItem('mongolz-demo-state',JSON.stringify({balance,history}))},[balance,history,hydrated]);

 const visible=useMemo(()=>games.filter(g=>{
  if(category!=='All'&&g.category!==category)return false;
  const q=query.trim().toLowerCase();
  return !q||`${g.mn} ${g.en} ${g.category}`.toLowerCase().includes(q);
 }),[category,query]);

 function settle(game:string,bet:number,result:number){setBalance(v=>Math.max(0,Math.round((v+result)*100)/100));setHistory(h=>[{id:crypto.randomUUID(),game,bet,result,at:new Date().toLocaleTimeString()},...h].slice(0,50))}
 function reset(){setBalance(1250000);setHistory([])}
 function showProviders(mode='',studio=''){setProviderCategory(mode);setProviderFilter(studio);requestAnimationFrame(()=>document.getElementById('provider-catalog')?.scrollIntoView({behavior:'smooth',block:'start'}))}
 function scrollTo(id:string){if(id==='trust-compliance'){setTrustOpen(true);return;}document.getElementById(id)?.scrollIntoView({behavior:'smooth',block:'start'})}
 function logout(){localStorage.removeItem('mongolz-demo-session-v1');setUser(null);setProfileOpen(false)}
 function openAuth(mode:'login'|'register'='login'){setAuthMode(mode);setAuthOpen(true)}
 function openPublic(g:PublicGame,i=0){setActive(engineFor(g,i))}

 const demoWins=[
  {name:'BoldNomad',id:'gates-of-olympus',game:'Gates of Olympus',amount:'58,420,000'},
  {name:'LuckyGirl',id:'sugar-rush',game:'Sugar Rush 1000',amount:'32,180,000'},
  {name:'MGLPlayer',id:'popular-3',game:'Dragon’s Treasure',amount:'28,900,000'},
  {name:'CasinoKing',id:'big-bass-bonanza',game:'Big Bass Adventure',amount:'21,450,000'},
  {name:'Tenger777',id:'popular-8',game:'Book of Kings',amount:'18,760,000'}
 ];

 return <div className={"appShell royalCasino2026 referenceLobby view-"+initialView+" referenceLang-"+lang+(query?" isSearching":"")+(mobileSearch?" mobileSearchOpen":"")}>
  <header className="topbar royalTopbar">
   <button className="brand" onClick={()=>{if(initialView!=='lobby')router.push('/');else window.scrollTo({top:0,behavior:'smooth'})}}><span className="brandMark">M</span><span><b>MONGOLZ</b><small>CASINO DEMO</small></span></button>
   <div className="searchWrap royalSearch"><Icon name="search"/><input aria-label={t.search} value={query} onChange={e=>{setQuery(e.target.value);if(e.target.value)showProviders('')}} placeholder={t.search}/></div>
   <div className="topActions royalTopActions">
    <button className="mobileSearchToggle" aria-label={t.search} onClick={()=>setMobileSearch(v=>!v)}><Icon name="search"/></button>
    <button className="royalMiniBtn" onClick={()=>{if(initialView!=='lobby')router.push('/');else scrollTo('promotions')}}><Icon name="gift"/> <span>{lang==='mn'?'Урамшуулал':'Promos'}</span></button>
    <button className="royalIconBtn" aria-label={lang==='mn'?'Тусламж':'Help'} onClick={()=>setSupportOpen(true)}><Icon name="bell"/></button>
    <button className="royalLang" onClick={()=>setLang(lang==='mn'?'en':'mn')}>{lang==='mn'?'MN':'EN'}⌄</button>
    <button className="balanceButton royalBalance" onClick={()=>setCashier(true)}><span>◉</span><b>₮ {balance.toLocaleString()}</b><i>⌄</i></button>
    {!user?<><button className="headerLogin2026" onClick={()=>openAuth('login')}>{lang==='mn'?'Нэвтрэх':'Sign in'}</button><button className="headerRegister2026" onClick={()=>openAuth('register')}>{lang==='mn'?'Бүртгүүлэх':'Register'}</button></>:<button className="headerUser2026" onClick={()=>setProfileOpen(true)}><span>{user.username.slice(0,1).toUpperCase()}</span><b>{user.username}</b></button>}
   </div>
  </header>

  <aside className="sidebar royalSidebar">
   {user&&<button className="sideUserCard2026 royalSideUser" onClick={()=>setProfileOpen(true)}><span className="sideAvatar2026">{user.username.slice(0,1).toUpperCase()}</span><span><b>{user.username}</b><small>Demo player</small></span><i>›</i></button>}
   <nav className="royalSideNav">
    <button className={initialView==='lobby'?'active':''} onClick={()=>{if(initialView!=='lobby')router.push('/');else window.scrollTo({top:0,behavior:'smooth'})}}><i><Icon name="home"/></i><span>{t.casino}</span></button>
    <button onClick={()=>{if(initialView!=='lobby')router.push('/');else {setCategory('Originals');scrollTo('original-games')}}}><i><Icon name="diamond"/></i><span>MONGOLZ Originals</span></button>
    <button className={initialView==='live'?'active':''} onClick={()=>router.push('/live')}><i><Icon name="live"/></i><span>{lang==='mn'?'Live казино':'Live casino'}</span></button>
    <button className={initialView==='slots'?'active':''} onClick={()=>router.push('/slots')}><i><Icon name="grid"/></i><span>{t.slots}</span></button>
    <button onClick={()=>showProviders('table')}><i><Icon name="spade"/></i><span>{t.tables}</span></button>
    <button className={initialView==='providers'?'active':''} onClick={()=>router.push('/providers')}><i><Icon name="layers"/></i><span>{lang==='mn'?'Provider тоглоомууд':'Provider games'}</span></button>
    <button onClick={()=>{if(initialView!=='lobby')router.push('/');else scrollTo('promotions')}}><i><Icon name="gift"/></i><span>{lang==='mn'?'Урамшуулал':'Promotions'}</span></button>
    <button onClick={()=>user?setProfileOpen(true):openAuth('register')}><i><Icon name="crown"/></i><span>VIP</span></button>
   </nav>
   <div className="royalSideDivider"/>
   <nav className="royalSideNav secondary">
    <button onClick={()=>setHistoryOpen(true)}><i><Icon name="history"/></i><span>{t.history}</span></button>
    <button onClick={()=>scrollTo('trust-compliance')}><i><Icon name="shield"/></i><span>Trust Center</span></button>
   </nav>
   <button className="royalVipCard" onClick={()=>user?setProfileOpen(true):openAuth('register')}>
    <div className="vipCrown"><Icon name="crown"/></div><b>MONGOLZ VIP</b><span>{lang==='mn'?'Илүү их урамшуулал\nИлүү их боломж':'More rewards\nMore access'}</span><strong>{lang==='mn'?'Дэлгэрэнгүй':'Explore'} →</strong>
   </button>
  </aside>

  <main className="content royalContent">
   <section className="royalHero">
    <div className="royalHeroCopy">
     <div className="royalHeroBrand"><span className="brandMark small">M</span><b>MONGOLZ</b><small>CASINO DEMO</small></div>
     <span className="royalEyebrow">MOST PLAYED</span>
     <h1>POPULAR<br/><strong>SLOTS</strong></h1>
     <p>{lang==='mn'?'Хамгийн алдартай тоглоомын төрлүүдийг нэг дор! Өнгөлөг дүрслэл, хөгжилтэй demo тоглолттой MONGOLZ танхимаар зочлоорой.':'Your favorite game themes in one place. Explore colorful artwork and playable local demos in the MONGOLZ lobby.'}</p>
     <button className="royalPlay" onClick={()=>openPublic(heroGames[0])}>{lang==='mn'?'ОДОО ТОГЛОХ':'PLAY NOW'} <span>›</span></button>
     <div className="royalHeroPerks"><span><Icon name="bolt"/> {lang==='mn'?'DEMO ТОГЛОЛТ':'DEMO PLAY'}</span><span><Icon name="shield"/> {lang==='mn'?'ТҮҮХ ХАДГАЛНА':'PLAY HISTORY'}</span><span><Icon name="phone"/> MOBILE READY</span></div>
    </div>
    <div className="royalHeroCards referenceHeroArt">{heroGames.map((g,i)=><button key={g.id} className={'royalHeroGame rh'+i} onClick={()=>openPublic(g,i)}><img src={g.url?.startsWith('/royal/')?g.url:'/api/catalog-cover?id='+g.id} alt={g.name}/><span>{g.name}</span></button>)}</div>
    <div className="royalPager"><button aria-label="Previous games" onClick={()=>setHeroIndex(i=>(i+5)%6)}>‹</button><span>{heroIndex+1} / 6</span><button aria-label="Next games" onClick={()=>setHeroIndex(i=>(i+1)%6)}>›</button></div>
   </section>

   <section className="royalCategoryBar">
    {[
     ['♠',lang==='mn'?'Бүгд':'All',()=>showProviders('')],
     ['🔥',lang==='mn'?'Шинэ':'New',()=>scrollTo('new-games')],
     ['♨',lang==='mn'?'Алдартай':'Popular',()=>scrollTo('popular-games')],
     ['♢',lang==='mn'?'Эксклюзив':'Exclusive',()=>{setCategory('Originals');scrollTo('original-games')}],
     ['M','Megaways',()=>showProviders('slots')],
     ['🎁','Buy Bonus',()=>showProviders('slots')],
     ['♟',lang==='mn'?'Live казино':'Live casino',()=>showProviders('live')],
     ['♠',lang==='mn'?'Ширээний тоглоом':'Table games',()=>showProviders('table')],
     ['ϟ','Instant Win',()=>showProviders('instant')]
    ].map(([icon,label,fn],i)=><button key={i} className={i===0?'active':''} onClick={fn as ()=>void}><i><Icon name={icon as string}/></i><span>{label as string}</span></button>)}
   </section>

   <section id="popular-games" className="royalSection">
    <div className="royalSectionHead"><h2><Icon name="fire"/> {lang==='mn'?'Алдартай тоглоомууд':'Popular games'}</h2><button onClick={()=>showProviders('slots')}>{lang==='mn'?'Бүгдийг харах':'View all'} →</button></div>
    <div className="royalGameRow">{POPULAR.map((g,i)=><button className="royalGameCard" key={g.id} onClick={()=>openPublic(g,i)}><div className="royalGameImage"><img src={g.url?.startsWith('/royal/')?g.url:'/api/catalog-cover?id='+g.id} alt={g.name}/><span className="royalPlayDot">▶</span></div><b>{g.name}</b><small>{g.provider}</small><em>☆</em></button>)}</div>
   </section>

   <section id="promotions" className="royalPromoGrid">
    <button className="royalPromo promoA" onClick={()=>scrollTo('new-games')}><img src="/royal/hd/new-5.webp" alt=""/><div><small>{lang==='mn'?'ШИНЭ ТОГЛООМУУД':'FRESH RELEASES'}</small><b>{lang==='mn'?'7 ХОНОГ БҮР':'EVERY WEEK'}</b><span>{lang==='mn'?'Тогтмол шинэчлэгдэнэ':'Fresh releases weekly'}</span><strong>{lang==='mn'?'ОДОО ТОГЛОХ':'PLAY NOW'} →</strong></div></button>
    <button className="royalPromo promoB" onClick={()=>setCashier(true)}><div className="coinPile"><Icon name="gift"/></div><div><small>{lang==='mn'?'DEMO БОНУС':'DEMO BONUS'}</small><b>1,250,000 ₮</b><span>{lang==='mn'?'DEMO ҮЛДЭГДЛЭЭ СЭРГЭЭЖ\nШИНЭЭР ЭХЛЭЭРЭЙ':'RESET YOUR DEMO BALANCE\nAND START EXPLORING'}</span><strong>{lang==='mn'?'ДЭЛГЭРЭНГҮЙ':'DETAILS'} →</strong></div></button>
    <button className="royalPromo promoC" onClick={()=>user?setProfileOpen(true):openAuth('register')}><img src="/royal/hd/popular-1.webp" alt=""/><div><small>VIP CLUB</small><b>{lang==='mn'?'ИЛҮҮ ИХ БОНУС':'MORE REWARDS'}</b><span>{lang==='mn'?'ОНЦГОЙ ЭРХ':'EXCLUSIVE ACCESS'}</span><strong>{lang==='mn'?'VIP ГИШҮҮН БОЛОХ':'JOIN VIP'} →</strong></div></button>
   </section>

   <section className="royalProviderStrip">
    <div className="royalSectionHead"><h2>{lang==='mn'?'Топ Provider-ууд':'Top Providers'}</h2><button onClick={()=>showProviders('')}>{lang==='mn'?'Бүгдийг харах':'View all'} →</button></div>
    <div className="royalProviderRow">{PROVIDERS.map((p,i)=><button key={p} aria-label={p} onClick={()=>showProviders('',p)}><ProviderLogo name={p}/></button>)}</div>
   </section>

   <section id="max-wins" className="royalMaxWin">
    <div className="maxWinTitle"><span><Icon name="trophy"/></span><div><b>MAX WIN</b><small>{lang==='mn'?'ХАМГИЙН ТОМ ХОЖЛУУД • DEMO':'BIGGEST WINS • DEMO'}</small></div></div>
    <div className="maxWinItems">{demoWins.map((w,i)=><button key={w.name} onClick={()=>{const g=[...POPULAR,...PUBLIC].find(x=>x.id===w.id);if(g)openPublic(g,i)}}><img src={'/royal/hd/popular-'+[1,6,3,2,8][i]+'.webp'} alt=""/><span><small>{w.name}</small><b>₮ {w.amount}</b><em>{w.game}</em></span></button>)}</div>
    <button className="maxWinMore" onClick={()=>setHistoryOpen(true)}>{lang==='mn'?'Бүгдийг харах':'View all'} →</button>
   </section>

   <section id="new-games" className="royalSection newGamesSection">
    <div className="royalSectionHead"><h2><Icon name="fire"/> {lang==='mn'?'Шинэ тоглоомууд':'New games'}</h2><button onClick={()=>showProviders('')}>{lang==='mn'?'Бүгдийг харах':'View all'} →</button></div>
    <div className="royalGameRow">{NEW_GAMES.map((g,i)=><button className="royalGameCard" key={g.id} onClick={()=>openPublic(g,i)}><div className="royalGameImage"><img src={g.url?.startsWith('/royal/')?g.url:'/api/catalog-cover?id='+g.id} alt={g.name}/><span className="newPill">NEW</span><span className="royalPlayDot">▶</span></div><b>{g.name}</b><small>{g.provider}</small><em>☆</em></button>)}</div>
   </section>

   <section id="original-games" className="royalOriginals">
    <div className="royalSectionHead"><h2><Icon name="crown"/> MONGOLZ Originals</h2><div className="tabs">{['All','Originals','Table','Slots'].map(c=><button key={c} onClick={()=>setCategory(c)} className={category===c?'active':''}>{c}</button>)}</div></div>
    <div className="gameGrid royalOriginalGrid">{visible.map((g,i)=><button className={'gameCard game-'+(i%8)} key={g.id} onClick={()=>setActive(g)}><div className="gameArt"><span className="tag">{g.tag}</span><div className="gameIcon"><Icon name={g.id==='roulette'?'live':g.id==='slot'?'grid':g.id==='blackjack'||g.id==='baccarat'?'spade':g.id==='mines'?'diamond':g.id==='crash'?'bolt':g.id==='dice'?'grid':'layers'}/></div><span className="playCircle">▶</span></div><div className="gameInfo"><b>{lang==='mn'?g.mn:g.en}</b><span>{lang==='mn'?g.blurbMn:g.blurbEn}</span></div></button>)}</div>
   </section>

   <ProviderSection lang={lang} balance={balance} settle={settle} initialCategory={providerCategory} initialProvider={providerFilter} globalQuery={query}/>


   <footer className="stakeFooter royalFooter"><div className="footerBrand">MONGOLZ</div><div className="footerCols"><div><b>CASINO</b><span>Originals</span><span>Slots</span><span>Live Casino</span><span>Table Games</span></div><div><b>SUPPORT</b><span>Demo Help</span><span>Fairness Info</span><span>Responsible Play</span><span>18+</span></div><div><b>ABOUT</b><span>Trust Center</span><span>MN / EN</span><span>Local Demo Wallet</span><span>No Real Money</span></div></div><p>{t.notice}</p><small>© 2026 MONGOLZ Demo Casino</small></footer>
  </main>

  <nav className="mobileNav royalMobileNav"><button onClick={()=>showProviders('')}>▦<span>Games</span></button><button onClick={()=>{if(initialView!=='lobby')router.push('/');else window.scrollTo({top:0,behavior:'smooth'})}}>⌂<span>{t.casino}</span></button><button onClick={()=>setCashier(true)} className="mobileWallet">₮<span>{balance.toLocaleString()}</span></button><button onClick={()=>setHistoryOpen(true)}>◷<span>{t.history}</span></button><button onClick={()=>user?setProfileOpen(true):openAuth('login')}>♙<span>{user?user.username.slice(0,8):'Account'}</span></button></nav>

  {trustOpen&&<div className="modalBackdrop" role="dialog" aria-modal="true" aria-label="Trust Center"><div className="sheet trustSheet"><button className="x" aria-label="Close" onClick={()=>setTrustOpen(false)}>×</button><ComplianceCenter lang={lang}/></div></div>}
  {authOpen&&<div className="modalBackdrop" role="dialog" aria-modal="true" aria-label="MONGOLZ"><div className="sheet authSheet2026"><button className="x" aria-label={lang==='mn'?'Хаах':'Close'} onClick={()=>setAuthOpen(false)}>×</button><AuthPanel lang={lang} initialMode={authMode} onClose={()=>setAuthOpen(false)} onSession={setUser}/></div></div>}
  {profileOpen&&<div className="modalBackdrop" role="dialog" aria-modal="true" aria-label="MONGOLZ"><div className="sheet profileSheet2026"><button className="x" aria-label={lang==='mn'?'Хаах':'Close'} onClick={()=>setProfileOpen(false)}>×</button><span className="eyebrow">MONGOLZ PROFILE</span><div className="profileHero2026"><span>{user?.username?.slice(0,1).toUpperCase()||'G'}</span><div><h2>{user?.username||(lang==='mn'?'Зочин':'Guest')}</h2><p>{user?.email||(lang==='mn'?'Бүртгэл үүсгэж profile нээнэ үү.':'Create an account to unlock your profile.')}</p></div></div><div className="profileStats2026"><div><b>{history.length}</b><span>Plays</span></div><div><b>₮ {balance.toLocaleString()}</b><span>Demo balance</span></div><div><b>{history.filter(h=>h.result>0).length}</b><span>Wins</span></div></div><div className="profileActions2026"><button onClick={()=>{setProfileOpen(false);setHistoryOpen(true)}}>◷ {t.history}</button><button onClick={()=>{setProfileOpen(false);scrollTo('trust-compliance')}}>⬡ Trust Center</button><button onClick={()=>setLang(lang==='mn'?'en':'mn')}>文 {lang==='mn'?'English':'Монгол'}</button>{user&&<button className="danger" onClick={logout}>↪ {lang==='mn'?'Гарах':'Sign out'}</button>}</div></div></div>}
  {supportOpen&&<div className="modalBackdrop" role="dialog" aria-modal="true" aria-label="MONGOLZ"><div className="sheet supportSheet2026"><button className="x" aria-label={lang==='mn'?'Хаах':'Close'} onClick={()=>setSupportOpen(false)}>×</button><span className="eyebrow">HELP CENTER</span><h2>{lang==='mn'?'Тусламж & Аюулгүй байдал':'Help & Safety'}</h2><div className="supportCards2026"><button onClick={()=>{setSupportOpen(false);scrollTo('trust-compliance')}}><b>⬡ Trust Center</b><span>Licence, RNG and KYC status</span></button><button onClick={()=>setCashier(true)}><b>₮ Demo Wallet</b><span>Sandbox cashier</span></button><button onClick={()=>setHistoryOpen(true)}><b>◷ History</b><span>Local session history</span></button></div><div className="noticeBox">18+ • DEMO ONLY • {lang==='mn'?'Бодит мөнгө ашиглахгүй.':'No real money is processed.'}</div></div></div>}
  {active&&<div className="modalBackdrop" role="dialog" aria-modal="true" aria-label="MONGOLZ"><div className="gameModal"><button className="x" aria-label={lang==='mn'?'Хаах':'Close'} onClick={()=>setActive(null)}>×</button><DemoGame game={active} lang={lang} balance={balance} settle={settle}/></div></div>}
  {cashier&&<div className="modalBackdrop" role="dialog" aria-modal="true" aria-label="MONGOLZ"><div className="sheet"><button className="x" aria-label={lang==='mn'?'Хаах':'Close'} onClick={()=>setCashier(false)}>×</button><span className="eyebrow">SANDBOX</span><h2>{t.cashier}</h2><p>{t.cashierText}</p><div className="paymentGrid"><div><b>VISA</b><span>Demo card</span></div><div><b>Mastercard</b><span>Demo card</span></div><div><b>USDT</b><span>TRC20 / ERC20 UI</span></div><div><b>USDC</b><span>Crypto UI</span></div><div><b>BTC</b><span>Bitcoin UI</span></div><div><b>ETH</b><span>Ethereum UI</span></div></div><div className="noticeBox">⚠ {t.notice}</div><button className="outlineButton" onClick={reset}>{t.reset}</button></div></div>}
  {historyOpen&&<div className="modalBackdrop" role="dialog" aria-modal="true" aria-label="MONGOLZ"><div className="sheet"><button className="x" aria-label={lang==='mn'?'Хаах':'Close'} onClick={()=>setHistoryOpen(false)}>×</button><span className="eyebrow">LOCAL SESSION</span><h2>{t.history}</h2><div className="historyList">{history.length===0?<p className="muted">{lang==='mn'?'Одоогоор тоглолт алга.':'No plays yet.'}</p>:history.map(h=><div key={h.id}><span><b>{h.game}</b><small>{h.at} • bet {h.bet}</small></span><strong className={h.result>0?'win':'loss'}>{h.result>0?'+':''}{h.result.toFixed(2)}</strong></div>)}</div></div></div>}
 </div>
}
