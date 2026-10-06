'use client';

import {useEffect,useMemo,useState} from 'react';
import seed from '@/lib/public-catalog.json';
import DemoGame from './DemoGame';
import type {GameMeta,GameId} from '@/lib/games';

type Lang='mn'|'en';
type PublicGame={id:string;name:string;provider:string;category:string;kind?:string;icon?:string;art?:string};
type Props={lang:Lang;balance:number;settle:(game:string,bet:number,result:number)=>void;initialCategory?:string};

const engines:GameId[]=['slot','roulette','blackjack','baccarat','plinko','mines','dice','crash'];
const iconFor=(c:string)=>c==='live'?'◉':c==='table'?'♠':c==='instant'?'⚡':'✦';
const categoryFor=(c:string):GameMeta['category']=>c==='slots'?'Slots':c==='live'||c==='table'?'Table':'Originals';

function pickEngine(g:PublicGame,i:number):GameId{
  if(g.category==='slots') return 'slot';
  if(g.category==='live') return ['roulette','blackjack','baccarat'][i%3] as GameId;
  if(g.category==='table') return ['blackjack','baccarat','roulette'][i%3] as GameId;
  return ['plinko','mines','dice','crash'][i%4] as GameId;
}
function xml(v:string){return v.replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[m]||m))}
function legacyCover(g:PublicGame,i:number){
  const palettes=[
    ['#152645','#4d8dff','#07090e'],['#402030','#df6b86','#0a080d'],['#3d3418','#d8b45b','#090806'],
    ['#15352f','#4ed3a0','#07100e'],['#2f2144','#9f78ef','#09070e'],['#3b2717','#e18d47','#0b0805']
  ];
  const p=palettes[i%palettes.length];
  const name=xml(g.name.length>24?g.name.slice(0,24)+'…':g.name);
  const provider=xml(g.provider);
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="720" height="900" viewBox="0 0 720 900">
  <defs><radialGradient id="g" cx="70%" cy="18%"><stop stop-color="${p[1]}" stop-opacity=".92"/><stop offset=".42" stop-color="${p[0]}"/><stop offset="1" stop-color="${p[2]}"/></radialGradient><pattern id="p" width="56" height="56" patternUnits="userSpaceOnUse"><path d="M28 0 56 28 28 56 0 28Z" fill="none" stroke="white" stroke-opacity=".06"/></pattern></defs>
  <rect width="720" height="900" fill="url(#g)"/><rect width="720" height="900" fill="url(#p)"/>
  <circle cx="540" cy="255" r="150" fill="none" stroke="white" stroke-opacity=".15"/><circle cx="540" cy="255" r="105" fill="none" stroke="${p[1]}" stroke-opacity=".35"/>
  <text x="64" y="105" fill="#ffffff99" font-family="Arial" font-size="22" letter-spacing="6">MONGOLZ • DEMO</text>
  <text x="64" y="555" fill="white" font-family="Arial" font-weight="800" font-size="54">${name}</text>
  <text x="64" y="610" fill="#ffffffaa" font-family="Arial" font-size="26">${provider}</text>
  <rect x="64" y="680" width="170" height="52" rx="16" fill="#ffffff16" stroke="#ffffff30"/><text x="92" y="714" fill="white" font-family="Arial" font-size="20">PLAY DEMO</text>
  <text x="540" y="290" text-anchor="middle" fill="white" font-family="Arial" font-size="98">${iconFor(g.category)}</text>
  </svg>`;
  return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
}
function toMeta(g:PublicGame,i:number):GameMeta{
  return {id:pickEngine(g,i),icon:g.icon||iconFor(g.category),category:categoryFor(g.category),mn:g.name,en:g.name,blurbMn:`${g.provider} • simulation demo`,blurbEn:`${g.provider} • simulation demo`,tag:'DEMO'};
}

export default function ProviderSection({lang,balance,settle,initialCategory=''}:Props){
  const [category,setCategory]=useState(initialCategory);
  const [provider,setProvider]=useState('');
  const [query,setQuery]=useState('');
  const [selected,setSelected]=useState<{meta:GameMeta;source:PublicGame}|null>(null);
  useEffect(()=>{setCategory(initialCategory);},[initialCategory]);
  const games=seed.games as PublicGame[];
  const providers=useMemo(()=>[...new Set(games.map(g=>g.provider))].sort(),[games]);
  const visible=useMemo(()=>games.filter(g=>(!category||g.category===category)&&(!provider||g.provider===provider)&&(!query||`${g.name} ${g.provider}`.toLowerCase().includes(query.toLowerCase()))),[games,category,provider,query]);
  const label=(c:string)=>lang==='mn'?({live:'Live казино',slots:'Слот',table:'Ширээний',instant:'Instant'} as Record<string,string>)[c]||'Бүгд':({live:'Live casino',slots:'Slots',table:'Table games',instant:'Instant'} as Record<string,string>)[c]||'All';
  return <section id="provider-catalog" className="providerSection2026">
    <div className="providerHeader2026"><div><span className="eyebrow">MONGOLZ • ALL-IN-ONE LOBBY</span><h2>{lang==='mn'?'Бүх provider тоглоом нэг нүүрэнд':'Every provider game on one page'}</h2><p>{lang==='mn'?`${games.length} тоглоом • ${providers.length} provider • card бүр ажилладаг local simulation demo`:`${games.length} games • ${providers.length} providers • every card opens a playable local simulation demo`}</p></div><div className="providerCount2026"><b>{games.length}</b><span>GAMES</span></div></div>
    <div className="providerControls2026">
      <div className="providerCats2026">{['','live','slots','table','instant'].map(c=><button key={c||'all'} className={category===c?'active':''} onClick={()=>setCategory(c)}>{label(c)}</button>)}</div>
      <div className="providerSearch2026"><input value={query} onChange={e=>setQuery(e.target.value)} placeholder={lang==='mn'?'Тоглоом эсвэл provider хайх…':'Search game or provider…'}/><select value={provider} onChange={e=>setProvider(e.target.value)}><option value="">{lang==='mn'?'Бүх provider':'All providers'}</option>{providers.map(p=><option key={p}>{p}</option>)}</select></div>
    </div>
    <div className="providerLogoRail2026">{providers.map(p=><button key={p} className={provider===p?'active':''} onClick={()=>setProvider(provider===p?'':p)}><span className="providerLogoBox2026"><img src={'/api/provider-mark?provider='+encodeURIComponent(p)} alt="" loading="lazy"/></span><b>{p}</b><small>{games.filter(g=>g.provider===p).length} GAMES</small></button>)}</div>
    <div className="providerChips2026">{providers.map(p=><button key={p} className={provider===p?'active':''} onClick={()=>setProvider(provider===p?'':p)}><img src={'/api/provider-mark?provider='+encodeURIComponent(p)} alt="" loading="lazy"/>{p}</button>)}</div>
    <div className="providerGrid2026">{visible.map((g,i)=>{
      const meta=toMeta(g,i);
      return <article className="providerCard2026" key={g.id}>
        <button className="providerCover2026" onClick={()=>setSelected({meta,source:g})}><img src={'/api/catalog-cover?id='+encodeURIComponent(g.id)} alt={g.name} loading="lazy"/><span className="demoFlag2026"><i/> DEMO</span><span className="providerSourceFlag2026">OFFICIAL PREVIEW / FALLBACK</span><span className="providerPlay2026">▶</span></button>
        <div className="providerInfo2026"><div className="providerInfoBrand2026"><img src={'/api/provider-mark?provider='+encodeURIComponent(g.provider)} alt="" loading="lazy"/><span><b>{g.name}</b><small>{g.provider}</small></span></div><button onClick={()=>setSelected({meta,source:g})}>{lang==='mn'?'Demo тоглох':'Play demo'} ▶</button></div>
      </article>
    })}</div>
    {!visible.length&&<div className="providerEmpty2026">{lang==='mn'?'Тохирох тоглоом олдсонгүй.':'No matching games.'}</div>}
    <div className="simulationNote2026">ⓘ {lang==='mn'?'Эдгээр нь provider-ийн жинхэнэ licensed game биш, MONGOLZ-ийн local simulation demo. Official API access ормогц card бүрийн launch-г provider API-тай солино.':'These are MONGOLZ local simulation demos, not the providers’ licensed originals. When official API access is connected, each card can be switched to its provider launch.'}</div>
    {selected&&<div className="modalBackdrop"><div className="gameModal"><button className="x" onClick={()=>setSelected(null)}>×</button><div className="providerModalTitle2026"><img src={'/api/provider-mark?provider='+encodeURIComponent(selected.source.provider)} alt=""/><span><small>{selected.source.provider}</small><b>{selected.source.name}</b></span></div><DemoGame game={selected.meta} lang={lang} balance={balance} settle={settle}/></div></div>}
  </section>;
}
