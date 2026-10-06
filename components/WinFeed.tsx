'use client';

type Lang='mn'|'en';
type History={id:string;game:string;bet:number;result:number;at:string};
const demo=[
  {player:'DEMO #4821',game:'Blue Sky Crash',x:86.42,amount:86420},
  {player:'DEMO #7318',game:'Steppe Fortune',x:500,amount:250000},
  {player:'DEMO #2044',game:'Golden Roulette',x:36,amount:72000},
  {player:'DEMO #9501',game:'Gem Mines',x:42.8,amount:107000},
  {player:'DEMO #6183',game:'Sky Plinko',x:25,amount:37500},
  {player:'DEMO #3007',game:'Khan 21',x:2.5,amount:12500}
];
export default function WinFeed({lang,history}:{lang:Lang;history:History[]}){
  const local=history.filter(h=>h.result>0&&h.bet>0).map(h=>({player:lang==='mn'?'ТА':'YOU',game:h.game,x:+((h.result+h.bet)/h.bet).toFixed(2),amount:Math.round(h.result+h.bet)})).sort((a,b)=>b.x-a.x).slice(0,3);
  const feed=[...local,...demo].slice(0,8);
  const max=feed.reduce((a,b)=>b.x>a.x?b:a,feed[0]);
  return <section id="max-wins" className="winFeed2026">
    <div className="winHeadline2026">
      <div><span className="eyebrow">DEMO WIN FEED • SIMULATED</span><h2>{lang==='mn'?'MAX WIN & BIG WIN':'MAX WIN & BIG WIN'}</h2><p>{lang==='mn'?'Бодит тоглогчдын мэдээлэл биш. Local demo session + simulated UI feed.':'Not real player data. Local demo session + simulated UI feed.'}</p></div>
      <div className="maxSpotlight2026"><small>MAX WIN</small><b>{max.x.toFixed(2)}×</b><span>{max.game}</span></div>
    </div>
    <div className="winRail2026">{feed.map((w,i)=><article className={i===0?'topWin':''} key={w.player+w.game+i}><div className="winAvatar2026">{w.player==='YOU'||w.player==='ТА'?'★':'M'}</div><div><small>{w.player} · {w.player.startsWith('DEMO')?'SIMULATED':'LOCAL SESSION'}</small><b>{w.game}</b><span>₮ {w.amount.toLocaleString()} demo payout</span></div><strong>{w.x.toFixed(2)}×</strong></article>)}</div>
  </section>
}
