'use client';

import {useEffect,useMemo,useState} from 'react';
import seed from '@/lib/public-catalog.json';
import {artworkFor} from '@/lib/artwork';
import ProviderLogo from './ProviderLogo';
import useModal from './useModal';
import DemoGame from './DemoGame';
import type {GameMeta,GameId} from '@/lib/games';

type Lang='mn'|'en';
type PublicGame={id:string;name:string;provider:string;category:string;kind?:string;icon?:string;art?:string};
type Props={lang:Lang;balance:number;settle:(game:string,bet:number,result:number)=>void;initialCategory?:string;initialProvider?:string;globalQuery?:string};

const iconFor=(c:string)=>c==='live'?'◉':c==='table'?'♠':c==='instant'?'⚡':'✦';
const categoryFor=(c:string):GameMeta['category']=>c==='slots'?'Slots':c==='live'||c==='table'?'Table':'Originals';

function pickEngine(g:PublicGame,i:number):GameId{
  if(g.category==='slots') return 'slot';
  if(g.category==='live') return ['roulette','blackjack','baccarat'][i%3] as GameId;
  if(g.category==='table') return ['blackjack','baccarat','roulette'][i%3] as GameId;
  return ['plinko','mines','dice','crash'][i%4] as GameId;
}
function toMeta(g:PublicGame,i:number):GameMeta{
  return {id:pickEngine(g,i),icon:g.icon||iconFor(g.category),category:categoryFor(g.category),mn:g.name,en:g.name,blurbMn:`${g.provider} • simulation demo`,blurbEn:`${g.provider} • simulation demo`,tag:'DEMO'};
}

export default function ProviderSection({lang,balance,settle,initialCategory='',initialProvider='',globalQuery=''}:Props){
  const [category,setCategory]=useState(initialCategory);
  const [provider,setProvider]=useState(initialProvider);
  const [page,setPage]=useState(0);
  const [query,setQuery]=useState('');
  const [selected,setSelected]=useState<{meta:GameMeta;source:PublicGame}|null>(null);
  useModal(Boolean(selected),()=>setSelected(null));
  useEffect(()=>{setCategory(initialCategory);},[initialCategory]);
  useEffect(()=>{setProvider(initialProvider)},[initialProvider]);
  useEffect(()=>{setPage(0)},[category,provider,query,globalQuery]);
  const games=seed.games as PublicGame[];
  const providers=useMemo(()=>[...new Set([...games.map(g=>g.provider),...(initialProvider?[initialProvider]:[])])].sort(),[games,initialProvider]);
  const visible=useMemo(()=>games.filter(g=>(!category||g.category===category)&&(!provider||g.provider===provider)&&(!(globalQuery||query)||`${g.name} ${g.provider}`.toLowerCase().includes((globalQuery||query).trim().toLowerCase()))),[games,category,provider,query,globalQuery]);
  const pages=Math.max(1,Math.ceil(visible.length/24));
  const safePage=Math.min(page,pages-1);
  const shown=visible.slice(safePage*24,(safePage+1)*24);
  const label=(c:string)=>lang==='mn'?({live:'Live казино',slots:'Слот',table:'Ширээний',instant:'Instant'} as Record<string,string>)[c]||'Бүгд':({live:'Live casino',slots:'Slots',table:'Table games',instant:'Instant'} as Record<string,string>)[c]||'All';
  return <section id="provider-catalog" className="providerSection2026">
    <div className="providerHeader2026"><div><span className="eyebrow">MONGOLZ • ALL-IN-ONE LOBBY</span><h2>{lang==='mn'?category==='live'?'Live казино':category==='slots'?'Слот тоглоомууд':'Тоглоомын сан':category==='live'?'Live casino':category==='slots'?'Slot games':'Game library'}</h2><p>{lang==='mn'?`${visible.length} тоглоом • ${providers.length} provider • Demo каталог`:`${visible.length} games • ${providers.length} providers • Demo catalog`}</p></div><div className="providerCount2026"><b>{visible.length}</b><span>GAMES</span></div></div>
    <div className="providerControls2026">
      <div className="providerCats2026">{['','live','slots','table','instant'].map(c=><button key={c||'all'} className={category===c?'active':''} onClick={()=>setCategory(c)}>{label(c)}</button>)}</div>
      <div className="providerSearch2026"><input aria-label={lang==='mn'?'Каталогоос хайх':'Search catalog'} value={query} onChange={e=>setQuery(e.target.value)} placeholder={lang==='mn'?'Тоглоом эсвэл provider хайх…':'Search game or provider…'}/><select aria-label="Provider" value={provider} onChange={e=>setProvider(e.target.value)}><option value="">{lang==='mn'?'Бүх provider':'All providers'}</option>{providers.map(p=><option key={p}>{p}</option>)}</select></div>
    </div>
    <div className="providerGrid2026">{shown.map((g,i)=>{
      const meta=toMeta(g,i);
      return <article className="providerCard2026" key={g.id}>
        <button className="providerCover2026" aria-label={g.name+' demo'} onClick={()=>setSelected({meta,source:g})}><img src={artworkFor(g)} alt={g.name} loading="lazy"/><span className="demoFlag2026"><i/> DEMO</span><span className="providerPlay2026">▶</span><span className="catalogArtTitle">{g.name}</span></button>
        <div className="providerInfo2026"><div className="providerInfoBrand2026"><span><b>{g.name}</b><small>{g.provider}</small></span></div><button onClick={()=>setSelected({meta,source:g})}>{lang==='mn'?'Demo тоглох':'Play demo'} ▶</button></div>
      </article>
    })}</div>
    {!visible.length&&<div className="providerEmpty2026">{lang==='mn'?provider&&!games.some(g=>g.provider===provider)?'Энэ provider-ийн demo каталог хараахан нэмэгдээгүй.':'Тохирох тоглоом олдсонгүй.':provider&&!games.some(g=>g.provider===provider)?'Demo titles for this provider are not available yet.':'No matching games.'}</div>}
    {pages>1&&<nav className="catalogPagination" aria-label="Pagination"><button disabled={safePage===0} onClick={()=>setPage(safePage-1)}>← {lang==='mn'?'Өмнөх':'Previous'}</button><span>{safePage+1} / {pages}</span><button disabled={safePage===pages-1} onClick={()=>setPage(safePage+1)}>{lang==='mn'?'Дараах':'Next'} →</button></nav>}
    <div className="simulationNote2026">ⓘ {lang==='mn'?'Demo каталог: тоглоомын дүрслэл нь танилцуулга, тоглолт нь MONGOLZ-ийн дотоод simulation. Бодит мөнгө ашиглахгүй.':'Demo catalog: artwork is illustrative and play uses MONGOLZ local simulations. No real money is processed.'}</div>
    {selected&&<div className="modalBackdrop" role="dialog" aria-modal="true" aria-label={selected.source.name}><div className="gameModal"><button className="x" aria-label={lang==='mn'?'Хаах':'Close'} onClick={()=>setSelected(null)}>×</button><div className="providerModalTitle2026"><ProviderLogo name={selected.source.provider}/><span><small>{selected.source.provider}</small><b>{selected.source.name}</b></span></div><DemoGame game={selected.meta} lang={lang} balance={balance} settle={settle}/></div></div>}
  </section>;
}
