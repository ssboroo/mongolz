'use client';

import { useEffect, useMemo, useState } from 'react';
import { games, type GameId, type GameMeta } from '@/lib/games';
import DemoGame from './DemoGame';
import ProviderSection from './ProviderSection';

type Lang='mn'|'en';
type History={id:string; game:string; bet:number; result:number; at:string};
const T={
  mn:{casino:'Казино',originals:'MONGOLZ Originals',tables:'Ширээний тоглоом',slots:'Слот',search:'Тоглоом хайх...',balance:'Demo үлдэгдэл',deposit:'Цэнэглэх',heroTop:'MONGOLZ ORIGINAL • 2026 DROP',heroTitle:'Хөх Тэнгэр — шинэ үеийн тоглолт.',heroText:'Монгол хэв маяг, 2026 crypto-casino мэдрэмж, хурдан playable demo — бүгд нэг дор.',play:'Тоглох',featured:'Танд зориулсан сонголт',all:'Бүгд',history:'Түүх',responsible:'Хариуцлагатай тоглолт',demo:'DEMO MODE',cashier:'Demo Cashier',cashierText:'Visa/Mastercard болон crypto урсгалын UI demo. Бодит гүйлгээ хийхгүй.',close:'Хаах',reset:'Demo баланс сэргээх',notice:'Энэ хувилбар бодит мөнгө, бодит карт эсвэл crypto хөрөнгө ашиглахгүй.'},
  en:{casino:'Casino',originals:'MONGOLZ Originals',tables:'Table games',slots:'Slots',search:'Search games...',balance:'Demo balance',deposit:'Cashier',heroTop:'MONGOLZ ORIGINAL • 2026 DROP',heroTitle:'Blue Sky — a new era of play.',heroText:'Mongolian character meets a 2026 crypto-casino feel in a fast, fully playable demo.',play:'Play',featured:'Picked for you',all:'All',history:'History',responsible:'Responsible play',demo:'DEMO MODE',cashier:'Demo Cashier',cashierText:'Visa/Mastercard and crypto payment-flow UI demo. No real transactions.',close:'Close',reset:'Reset demo balance',notice:'This build never processes real money, cards or crypto assets.'}
} as const;

export default function CasinoApp(){
  const [lang,setLang]=useState<Lang>('mn');
  const [active,setActive]=useState<GameMeta|null>(null);
  const [category,setCategory]=useState('All');
  const [query,setQuery]=useState('');
  const [balance,setBalance]=useState(10000);
  const [history,setHistory]=useState<History[]>([]);
  const [hydrated,setHydrated]=useState(false);
  const [cashier,setCashier]=useState(false);
  const [historyOpen,setHistoryOpen]=useState(false);
  const [providerCategory,setProviderCategory]=useState('');
  const t=T[lang];

  useEffect(()=>{
    const raw=localStorage.getItem('mongolz-demo-state');
    if(raw){ try{ const s=JSON.parse(raw); if(Number.isFinite(s.balance)&&s.balance>=0)setBalance(s.balance); if(Array.isArray(s.history))setHistory(s.history); }catch{} }
    setHydrated(true);
  },[]);
  useEffect(()=>{ if(!hydrated)return;localStorage.setItem('mongolz-demo-state',JSON.stringify({balance,history})); },[balance,history,hydrated]);

  const visible=useMemo(()=>games.filter(g=>{
    if(category!=='All' && g.category!==category)return false;
    const q=query.trim().toLowerCase();
    return !q || `${g.mn} ${g.en} ${g.category}`.toLowerCase().includes(q);
  }),[category,query]);

  function settle(game:string,bet:number,result:number){
    setBalance(v=>Math.max(0, Math.round((v + result)*100)/100));
    setHistory(h=>[{id:crypto.randomUUID(),game,bet,result,at:new Date().toLocaleTimeString()},...h].slice(0,50));
  }
  function reset(){ setBalance(10000); setHistory([]); }
  function showProviders(mode=''){ setProviderCategory(mode); requestAnimationFrame(()=>document.getElementById('provider-catalog')?.scrollIntoView({behavior:'smooth',block:'start'})); }

  return <div className="appShell ui2026">
    <header className="topbar">
      <button className="brand" onClick={()=>setActive(null)}><span className="brandMark">M</span><span><b>MONGOLZ</b><small>CASINO / 2026</small></span></button>
      <div className="searchWrap"><span>⌕</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder={t.search}/></div>
      <div className="topActions"><span className="onlinePill"><i/>ONLINE</span>
        <div className="langSwitch"><button className={lang==='mn'?'on':''} onClick={()=>setLang('mn')}>MN</button><button className={lang==='en'?'on':''} onClick={()=>setLang('en')}>EN</button></div>
        <button className="balanceButton" onClick={()=>setCashier(true)}><span>{t.balance}</span><b>₮ {balance.toLocaleString()}</b></button>
        <button className="goldButton" onClick={()=>setCashier(true)}>{t.deposit}</button>
      </div>
    </header>

    <aside className="sidebar">
      <nav>
        <button className="providerNavLink" onClick={()=>showProviders('')}>◈ <span>{lang==='mn'?'Provider тоглоомууд':'Provider games'}</span></button>
        <button className="providerNavLink" onClick={()=>showProviders('live')}>◉ <span>{lang==='mn'?'Live казино':'Live casino'}</span></button>
        <button className="providerNavLink" onClick={()=>showProviders('slots')}>✦ <span>{lang==='mn'?'Provider слот':'Provider slots'}</span></button>
        <button onClick={()=>setCategory('All')} className={category==='All'?'active':''}>⌂ <span>{t.casino}</span></button>
        <button onClick={()=>setCategory('Originals')} className={category==='Originals'?'active':''}>◆ <span>{t.originals}</span></button>
        <button onClick={()=>setCategory('Table')} className={category==='Table'?'active':''}>♠ <span>{t.tables}</span></button>
        <button onClick={()=>setCategory('Slots')} className={category==='Slots'?'active':''}>▦ <span>{t.slots}</span></button>
      </nav>
      <div className="sideBottom">
        <button onClick={()=>setHistoryOpen(true)}>↺ <span>{t.history}</span></button>
        <div className="demoBadge"><i/> {t.demo}</div>
        <p>{t.responsible}<br/><small>18+ • Demo only</small></p>
      </div>
    </aside>

    <main className="content">
      <section className="heroMongolz">
        <div className="heroPattern"/>
        <div className="heroCopy"><span className="eyebrow">{t.heroTop}</span><h1>{t.heroTitle}</h1><p>{t.heroText}</p><div className="heroButtons"><button className="goldButton big" onClick={()=>setActive(games[7])}>▶ {lang==='mn'?'Одоо тоглох':'Play now'}</button><span className="noMoney"><i/> LIVE DEMO • 8 GAMES</span></div></div>
        <div className="heroVisual"><div className="coin c1">ᠮ</div><div className="coin c2">★</div><div className="mountain">M</div><div className="heroChip"><small>2026 / MONGOLZ ORIGINAL</small><b>ХӨХ ТЭНГЭР</b><strong>3.42×</strong><em>CRASH</em></div></div>
      </section>

      <section className="trustStrip"><span><i className="pulseDot"/> LIVE DEMO</span><span>◆ MONGOLZ ORIGINALS</span><span>◉ LOCAL WALLET</span><span>文 MN / EN</span><span>✓ NO REAL MONEY</span></section>

      <section className="gamesSection">
        <div className="sectionTitle"><div><span className="eyebrow">MONGOLZ COLLECTION</span><h2>{t.featured}</h2></div><div className="tabs">{['All','Originals','Table','Slots'].map(c=><button key={c} onClick={()=>setCategory(c)} className={category===c?'active':''}>{c==='All'?t.all:c==='Originals'?t.originals:c==='Table'?t.tables:t.slots}</button>)}</div></div>
        <div className="gameGrid">{visible.map((g,i)=><button className={`gameCard game-${i%8}`} key={g.id} onClick={()=>setActive(g)}><div className="gameArt"><span className="tag">{g.tag}</span><div className="gameIcon">{g.icon}</div><div className="ornament">◆ ◇ ◆</div><span className="playCircle">▶</span></div><div className="gameInfo"><b>{lang==='mn'?g.mn:g.en}</b><span>{lang==='mn'?g.blurbMn:g.blurbEn}</span></div></button>)}</div>
      </section>

      <ProviderSection lang={lang} balance={balance} settle={settle} initialCategory={providerCategory}/>

      <footer><div className="footerBrand">MONGOLZ</div><p>{t.notice}</p><span>Demo build • v1.0</span></footer>
    </main>

    <nav className="mobileNav"><button className="providerMobileLink" onClick={()=>showProviders('')}>◈<span>{lang==='mn'?'Provider':'Providers'}</span></button><button onClick={()=>{setCategory('All');window.scrollTo({top:0,behavior:'smooth'})}}>⌂<span>{t.casino}</span></button><button onClick={()=>setCashier(true)} className="mobileWallet">₮<span>{balance.toLocaleString()}</span></button><button onClick={()=>setHistoryOpen(true)}>↺<span>{t.history}</span></button><button onClick={()=>setLang(lang==='mn'?'en':'mn')}>文<span>{lang.toUpperCase()}</span></button></nav>

    {active&&<div className="modalBackdrop"><div className="gameModal"><button className="x" onClick={()=>setActive(null)}>×</button><DemoGame game={active} lang={lang} balance={balance} settle={settle}/></div></div>}
    {cashier&&<div className="modalBackdrop"><div className="sheet"><button className="x" onClick={()=>setCashier(false)}>×</button><span className="eyebrow">SANDBOX</span><h2>{t.cashier}</h2><p>{t.cashierText}</p><div className="paymentGrid"><div><b>VISA</b><span>Demo card</span></div><div><b>Mastercard</b><span>Demo card</span></div><div><b>USDT</b><span>TRC20 / ERC20 UI</span></div><div><b>USDC</b><span>Crypto UI</span></div><div><b>BTC</b><span>Bitcoin UI</span></div><div><b>ETH</b><span>Ethereum UI</span></div></div><div className="noticeBox">⚠ {t.notice}</div><button className="outlineButton" onClick={reset}>{t.reset}</button></div></div>}
    {historyOpen&&<div className="modalBackdrop"><div className="sheet"><button className="x" onClick={()=>setHistoryOpen(false)}>×</button><span className="eyebrow">LOCAL SESSION</span><h2>{t.history}</h2><div className="historyList">{history.length===0?<p className="muted">{lang==='mn'?'Одоогоор тоглолт алга.':'No plays yet.'}</p>:history.map(h=><div key={h.id}><span><b>{h.game}</b><small>{h.at} • bet {h.bet}</small></span><strong className={h.result>0?'win':'loss'}>{h.result>0?'+':''}{h.result.toFixed(2)}</strong></div>)}</div></div></div>}
  </div>
}
