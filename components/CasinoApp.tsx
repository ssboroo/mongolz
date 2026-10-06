'use client';

import { useEffect, useMemo, useState } from 'react';
import { games, type GameId, type GameMeta } from '@/lib/games';
import DemoGame from './DemoGame';
import ProviderSection from './ProviderSection';
import WinFeed from './WinFeed';
import ComplianceCenter from './ComplianceCenter';
import AuthPanel, {loadSession, type DemoUser} from './AuthPanel';

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
  const [user,setUser]=useState<DemoUser|null>(null);
  const [authOpen,setAuthOpen]=useState(false);
  const [profileOpen,setProfileOpen]=useState(false);
  const [supportOpen,setSupportOpen]=useState(false);
  const t=T[lang];

  useEffect(()=>{
    const raw=localStorage.getItem('mongolz-demo-state');
    if(raw){ try{ const s=JSON.parse(raw); if(Number.isFinite(s.balance)&&s.balance>=0)setBalance(s.balance); if(Array.isArray(s.history))setHistory(s.history); }catch{} }
    setUser(loadSession());
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
  function scrollTo(id:string){document.getElementById(id)?.scrollIntoView({behavior:'smooth',block:'start'});}
  function logout(){localStorage.removeItem('mongolz-demo-session-v1');setUser(null);setProfileOpen(false);}

  return <div className="appShell stakeInspired2026">
    <header className="topbar">
      <button className="brand" onClick={()=>{setActive(null);window.scrollTo({top:0,behavior:'smooth'})}}><span className="brandMark">M</span><span><b>MONGOLZ</b><small>CASINO DEMO</small></span></button>
      <div className="modeSwitch"><button className="active">♠ {lang==='mn'?'Казино':'Casino'}</button><button disabled>⚽ {lang==='mn'?'Спорт':'Sports'} <small>SOON</small></button></div>
      <div className="searchWrap"><span>⌕</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder={t.search}/></div>
      <div className="topActions"><span className="onlinePill"><i/>ONLINE</span>
        {!user?<div className="headerAuth2026"><button className="headerLogin2026" onClick={()=>setAuthOpen(true)}>{lang==='mn'?'Нэвтрэх':'Sign in'}</button><button className="headerRegister2026" onClick={()=>setAuthOpen(true)}>{lang==='mn'?'Бүртгүүлэх':'Register'}</button></div>:<button className="headerUser2026" onClick={()=>setProfileOpen(true)}><span>{user.username.slice(0,1).toUpperCase()}</span><b>{user.username}</b></button>}
        <div className="langSwitch"><button className={lang==='mn'?'on':''} onClick={()=>setLang('mn')}>MN</button><button className={lang==='en'?'on':''} onClick={()=>setLang('en')}>EN</button></div>
        <button className="balanceButton" onClick={()=>setCashier(true)}><span>{t.balance}</span><b>₮ {balance.toLocaleString()}</b></button>
        <button className="goldButton" onClick={()=>setCashier(true)}>{t.deposit}</button>
      </div>
    </header>

    <aside className="sidebar premiumSidebar2026">
      <div className="sideAccount2026">
        {user?<button className="sideUserCard2026" onClick={()=>setProfileOpen(true)}><span className="sideAvatar2026">{user.username.slice(0,1).toUpperCase()}</span><span><b>{user.username}</b><small>{lang==='mn'?'Demo хэрэглэгч':'Demo player'}</small></span><i>›</i></button>:<div className="sideGuest2026"><div><span className="sideAvatar2026 guest">＋</span><span><b>{lang==='mn'?'Тавтай морил':'Welcome'}</b><small>{lang==='mn'?'Тоглож эхлэхийн тулд нэвтэр':'Sign in to personalize'}</small></span></div><div className="sideGuestActions2026"><button onClick={()=>setAuthOpen(true)}>{lang==='mn'?'Нэвтрэх':'Sign in'}</button><button className="primary" onClick={()=>setAuthOpen(true)}>{lang==='mn'?'Бүртгүүлэх':'Register'}</button></div></div>}
      </div>

      <div className="sideSection2026"><span className="sideLabel2026">{lang==='mn'?'КАЗИНО':'CASINO'}</span><nav>
        <button onClick={()=>{setCategory('All');window.scrollTo({top:0,behavior:'smooth'})}} className={category==='All'?'active':''}><i>⌂</i><span>{t.casino}</span></button>
        <button onClick={()=>setCategory('Originals')} className={category==='Originals'?'active':''}><i>◆</i><span>{t.originals}</span></button>
        <button className="providerNavLink" onClick={()=>showProviders('live')}><i>◉</i><span>{lang==='mn'?'Live казино':'Live casino'}</span><em>LIVE</em></button>
        <button className="providerNavLink" onClick={()=>showProviders('slots')}><i>✦</i><span>{lang==='mn'?'Слот':'Slots'}</span></button>
        <button className="providerNavLink" onClick={()=>showProviders('table')}><i>♠</i><span>{lang==='mn'?'Ширээний тоглоом':'Table games'}</span></button>
        <button className="providerNavLink" onClick={()=>showProviders('')}><i>◈</i><span>{lang==='mn'?'Бүх provider':'All providers'}</span></button>
      </nav></div>

      <div className="sideSection2026"><span className="sideLabel2026">{lang==='mn'?'МИНИЙ ХЭСЭГ':'MY MONGOLZ'}</span><nav>
        <button onClick={()=>setHistoryOpen(true)}><i>↺</i><span>{lang==='mn'?'Сүүлд тоглосон':'Recently played'}</span></button>
        <button onClick={()=>scrollTo('max-wins')}><i>⚡</i><span>MAX WIN</span></button>
        <button onClick={()=>scrollTo('promotions')}><i>🎁</i><span>{lang==='mn'?'Урамшуулал':'Promotions'}</span><em>NEW</em></button>
        <button onClick={()=>setProfileOpen(true)}><i>★</i><span>{lang==='mn'?'VIP & Rewards':'VIP & Rewards'}</span></button>
      </nav></div>

      <div className="sideSection2026 sideUtilities2026"><span className="sideLabel2026">{lang==='mn'?'ТУСЛАМЖ':'SUPPORT'}</span><nav>
        <button onClick={()=>scrollTo('trust-compliance')}><i>✓</i><span>{lang==='mn'?'Trust Center':'Trust Center'}</span></button>
        <button onClick={()=>setSupportOpen(true)}><i>?</i><span>{lang==='mn'?'Тусламж':'Help & Support'}</span></button>
        <button onClick={()=>setLang(lang==='mn'?'en':'mn')}><i>文</i><span>{lang==='mn'?'English':'Монгол'}</span><small>{lang.toUpperCase()}</small></button>
      </nav></div>

      <div className="sideBottom sideBottom2026">
        <div className="demoBadge"><i/> {t.demo}</div>
        <div className="sideSafety2026"><b>18+</b><span>{t.responsible}</span><small>{lang==='mn'?'Бодит мөнгөгүй demo орчин':'No-real-money demo environment'}</small></div>
      </div>
    </aside>

    <main className="content">
      <section className="stakeWelcome">
        <div className="stakeWelcomeCopy">
          <span className="stakeKicker">MONGOLZ • DEMO CASINO</span>
          <h1>{lang==='mn'?'Тоглоомын шинэ танхимд тавтай морил.':'Welcome to the new MONGOLZ lobby.'}</h1>
          <p>{lang==='mn'?'Stake.com-ийн compact casino UX-ээс санаа авсан, гэхдээ MONGOLZ-ийн өөрийн Монгол өнгө төрхтэй playable demo платформ.':'A compact casino UX inspired by modern crypto-casino patterns, rebuilt with MONGOLZ identity and playable demos.'}</p>
          <div className="stakeWelcomeActions">
            <button className="stakePrimary" onClick={()=>setActive(games[7])}>▶ {lang==='mn'?'Тоглож эхлэх':'Start playing'}</button>
            <button className="stakeSecondary" onClick={()=>showProviders('')}>◈ {lang==='mn'?'Бүх тоглоом':'All games'}</button>
          </div>
        </div>
        <div className="stakeWelcomeArt">
          <div className="stakeOrb orbA">◆</div><div className="stakeOrb orbB">♠</div><div className="stakeOrb orbC">◉</div>
          <div className="stakeHeroBadge"><small>MONGOLZ ORIGINAL</small><b>BLUE SKY CRASH</b><strong>100×</strong><span>MAX DEMO</span></div>
        </div>
      </section>

      <section className="stakeQuickNav">
        <button onClick={()=>setCategory('All')}>⌂ {lang==='mn'?'Казино':'Casino'}</button>
        <button onClick={()=>setCategory('Originals')}>◆ Originals</button>
        <button onClick={()=>showProviders('slots')}>✦ {lang==='mn'?'Слот':'Slots'}</button>
        <button onClick={()=>showProviders('live')}>◉ {lang==='mn'?'Live казино':'Live Casino'}</button>
        <button onClick={()=>showProviders('table')}>♠ {lang==='mn'?'Ширээний':'Table Games'}</button>
        <button onClick={()=>document.getElementById('trust-compliance')?.scrollIntoView({behavior:'smooth'})}>✓ {lang==='mn'?'Шалгалт':'Trust'}</button>
      </section>

      <section className="stakeRailSection">
        <div className="stakeSectionHead"><div><span>🔥</span><h2>{lang==='mn'?'Тренд тоглоомууд':'Trending Games'}</h2></div><button onClick={()=>showProviders('')}>{lang==='mn'?'Бүгдийг үзэх':'View all'} →</button></div>
        <div className="stakeGameRail">{games.map((g,i)=><button key={g.id} onClick={()=>setActive(g)} className="stakeRailCard"><div className={`stakeRailArt rail-${i%8}`}><span>{g.icon}</span><i>▶</i></div><b>{lang==='mn'?g.mn:g.en}</b><small><em/> {12+i*7} demo sessions</small></button>)}</div>
      </section>

      <WinFeed lang={lang} history={history}/>

      <section id="promotions" className="stakePromoSection">
        <div className="stakeSectionHead"><div><span>🎁</span><h2>{lang==='mn'?'Онцлох хэсгүүд':'Promotions & Highlights'}</h2></div></div>
        <div className="stakePromos">
          <button onClick={()=>setActive(games[7])} className="promoCard promoBlue"><small>MONGOLZ ORIGINALS</small><b>Blue Sky Crash</b><span>{lang==='mn'?'100× хүртэл demo multiplier':'Demo multiplier up to 100×'}</span><strong>PLAY →</strong></button>
          <button onClick={()=>showProviders('live')} className="promoCard promoPurple"><small>LIVE COLLECTION</small><b>{lang==='mn'?'Live casino hub':'Live casino hub'}</b><span>{lang==='mn'?'Evolution / Pragmatic нэртэй simulation cards':'Provider-labelled simulation cards in one lobby'}</span><strong>EXPLORE →</strong></button>
          <button onClick={()=>document.getElementById('trust-compliance')?.scrollIntoView({behavior:'smooth'})} className="promoCard promoGold"><small>TRUST CENTER</small><b>{lang==='mn'?'Ил тод demo mode':'Transparent demo mode'}</b><span>{lang==='mn'?'Хуурамч лиценз, badge ашиглахгүй':'No fabricated licence badges or claims'}</span><strong>VIEW →</strong></button>
        </div>
      </section>

      <section className="gamesSection">
        <div className="sectionTitle"><div><span className="eyebrow">MONGOLZ COLLECTION</span><h2>{t.featured}</h2></div><div className="tabs">{['All','Originals','Table','Slots'].map(c=><button key={c} onClick={()=>setCategory(c)} className={category===c?'active':''}>{c==='All'?t.all:c==='Originals'?t.originals:c==='Table'?t.tables:t.slots}</button>)}</div></div>
        <div className="gameGrid">{visible.map((g,i)=><button className={`gameCard game-${i%8}`} key={g.id} onClick={()=>setActive(g)}><div className="gameArt"><span className="tag">{g.tag}</span><div className="gameIcon">{g.icon}</div><div className="ornament">◆ ◇ ◆</div><span className="playCircle">▶</span></div><div className="gameInfo"><b>{lang==='mn'?g.mn:g.en}</b><span>{lang==='mn'?g.blurbMn:g.blurbEn}</span></div></button>)}</div>
      </section>

      <ProviderSection lang={lang} balance={balance} settle={settle} initialCategory={providerCategory}/>

      <ComplianceCenter lang={lang}/>

      <footer className="stakeFooter"><div className="footerBrand">MONGOLZ</div><div className="footerCols"><div><b>CASINO</b><span>Originals</span><span>Slots</span><span>Live Casino</span><span>Table Games</span></div><div><b>SUPPORT</b><span>Demo Help</span><span>Fairness Info</span><span>Responsible Play</span><span>18+</span></div><div><b>ABOUT</b><span>Trust Center</span><span>MN / EN</span><span>Local Demo Wallet</span><span>No Real Money</span></div></div><p>{t.notice}</p><small>© 2026 MONGOLZ Demo Casino</small></footer>
    </main>

    <nav className="mobileNav"><button className="providerMobileLink" onClick={()=>showProviders('')}>◈<span>{lang==='mn'?'Games':'Games'}</span></button><button onClick={()=>{setCategory('All');window.scrollTo({top:0,behavior:'smooth'})}}>⌂<span>{t.casino}</span></button><button onClick={()=>setCashier(true)} className="mobileWallet">₮<span>{balance.toLocaleString()}</span></button><button onClick={()=>setHistoryOpen(true)}>↺<span>{t.history}</span></button><button onClick={()=>user?setProfileOpen(true):setAuthOpen(true)}>{user?'●':'♙'}<span>{user?user.username.slice(0,8):(lang==='mn'?'Account':'Account')}</span></button></nav>

    {authOpen&&<div className="modalBackdrop"><div className="sheet authSheet2026"><button className="x" onClick={()=>setAuthOpen(false)}>×</button><AuthPanel lang={lang} onClose={()=>setAuthOpen(false)} onSession={setUser}/></div></div>}
    {profileOpen&&<div className="modalBackdrop"><div className="sheet profileSheet2026"><button className="x" onClick={()=>setProfileOpen(false)}>×</button><span className="eyebrow">MONGOLZ PROFILE</span><div className="profileHero2026"><span>{user?.username?.slice(0,1).toUpperCase()||'G'}</span><div><h2>{user?.username||(lang==='mn'?'Зочин':'Guest')}</h2><p>{user?.email||(lang==='mn'?'Бүртгэл үүсгэж profile нээнэ үү.':'Create an account to unlock your profile.')}</p></div></div><div className="profileStats2026"><div><b>{history.length}</b><span>{lang==='mn'?'Тоглолт':'Plays'}</span></div><div><b>₮ {balance.toLocaleString()}</b><span>{lang==='mn'?'Demo баланс':'Demo balance'}</span></div><div><b>{history.filter(h=>h.result>0).length}</b><span>{lang==='mn'?'Хожил':'Wins'}</span></div></div><div className="profileActions2026"><button onClick={()=>{setProfileOpen(false);setHistoryOpen(true)}}>↺ {lang==='mn'?'Тоглолтын түүх':'Play history'}</button><button onClick={()=>{setProfileOpen(false);scrollTo('trust-compliance')}}>✓ Trust Center</button><button onClick={()=>setLang(lang==='mn'?'en':'mn')}>文 {lang==='mn'?'English':'Монгол'}</button>{user&&<button className="danger" onClick={logout}>↪ {lang==='mn'?'Гарах':'Sign out'}</button>}</div><div className="profileNote2026">★ VIP / Rewards — {lang==='mn'?'production loyalty system холбоход бэлэн UI.':'UI ready for a future production loyalty system.'}</div></div></div>}
    {supportOpen&&<div className="modalBackdrop"><div className="sheet supportSheet2026"><button className="x" onClick={()=>setSupportOpen(false)}>×</button><span className="eyebrow">HELP CENTER</span><h2>{lang==='mn'?'Тусламж & Аюулгүй байдал':'Help & Safety'}</h2><div className="supportCards2026"><button onClick={()=>{setSupportOpen(false);scrollTo('trust-compliance')}}><b>✓ Trust Center</b><span>{lang==='mn'?'Лиценз, RNG, KYC статус':'Licence, RNG and KYC status'}</span></button><button onClick={()=>setCashier(true)}><b>₮ Demo Wallet</b><span>{lang==='mn'?'Sandbox cashier':'Sandbox cashier'}</span></button><button onClick={()=>setHistoryOpen(true)}><b>↺ {lang==='mn'?'Түүх':'History'}</b><span>{lang==='mn'?'Local session history':'Local session history'}</span></button></div><div className="noticeBox">18+ • DEMO ONLY • {lang==='mn'?'Бодит мөнгө ашиглахгүй.':'No real money is processed.'}</div></div></div>}
    {active&&<div className="modalBackdrop"><div className="gameModal"><button className="x" onClick={()=>setActive(null)}>×</button><DemoGame game={active} lang={lang} balance={balance} settle={settle}/></div></div>}
    {cashier&&<div className="modalBackdrop"><div className="sheet"><button className="x" onClick={()=>setCashier(false)}>×</button><span className="eyebrow">SANDBOX</span><h2>{t.cashier}</h2><p>{t.cashierText}</p><div className="paymentGrid"><div><b>VISA</b><span>Demo card</span></div><div><b>Mastercard</b><span>Demo card</span></div><div><b>USDT</b><span>TRC20 / ERC20 UI</span></div><div><b>USDC</b><span>Crypto UI</span></div><div><b>BTC</b><span>Bitcoin UI</span></div><div><b>ETH</b><span>Ethereum UI</span></div></div><div className="noticeBox">⚠ {t.notice}</div><button className="outlineButton" onClick={reset}>{t.reset}</button></div></div>}
    {historyOpen&&<div className="modalBackdrop"><div className="sheet"><button className="x" onClick={()=>setHistoryOpen(false)}>×</button><span className="eyebrow">LOCAL SESSION</span><h2>{t.history}</h2><div className="historyList">{history.length===0?<p className="muted">{lang==='mn'?'Одоогоор тоглолт алга.':'No plays yet.'}</p>:history.map(h=><div key={h.id}><span><b>{h.game}</b><small>{h.at} • bet {h.bet}</small></span><strong className={h.result>0?'win':'loss'}>{h.result>0?'+':''}{h.result.toFixed(2)}</strong></div>)}</div></div></div>}
  </div>
}
