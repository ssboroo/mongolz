import catalog from '@/lib/public-catalog.json';
export const runtime='nodejs';

const providers=[...new Set((catalog as any).games.map((g:any)=>g.provider))] as string[];
const domains:Record<string,string>={
 'Pragmatic Play':'https://www.pragmaticplay.com/favicon.ico',
 'Pragmatic Play Live':'https://www.pragmaticplay.com/favicon.ico',
 'Evolution':'https://games.evolution.com/favicon.ico',
 'BGaming':'https://bgaming.com/favicon.ico',
 "Play’n GO":'https://www.playngo.com/favicon.ico',
 'NetEnt':'https://www.netent.com/favicon.ico',
 'Red Tiger':'https://www.redtiger.com/favicon.ico',
 'Nolimit City':'https://www.nolimitcity.com/favicon.ico',
 'Big Time Gaming':'https://www.bigtimegaming.com/favicon.ico'
};
function esc(v:string){return v.replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[m]||m))}
function initials(name:string){return name.split(/[\s·]+/).filter(Boolean).map(x=>x[0]).join('').slice(0,3).toUpperCase()}
function fallback(name:string){
 const label=esc(name||'Provider'), init=esc(initials(name||'P'));
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160"><defs><linearGradient id="g" x2="1" y2="1"><stop stop-color="#28485d"/><stop offset="1" stop-color="#102532"/></linearGradient></defs><rect width="160" height="160" rx="34" fill="url(#g)"/><rect x="1" y="1" width="158" height="158" rx="33" fill="none" stroke="#ffffff20"/><text x="80" y="92" text-anchor="middle" fill="white" font-family="Arial" font-size="45" font-weight="800">${init}</text><title>${label}</title></svg>`;
 return new Response(svg,{headers:{'content-type':'image/svg+xml; charset=utf-8','cache-control':'public, max-age=86400, s-maxage=604800'}});
}
export async function GET(req:Request){
 const provider=new URL(req.url).searchParams.get('provider')||'';
 if(!providers.includes(provider))return fallback(provider);
 const source=domains[provider];
 if(!source)return fallback(provider);
 try{
  const res=await fetch(source,{headers:{'user-agent':'Mozilla/5.0'},next:{revalidate:604800},redirect:'follow'});
  if(!res.ok)return fallback(provider);
  const type=res.headers.get('content-type')||'';
  const buf=await res.arrayBuffer();
  if(buf.byteLength>1_500_000)return fallback(provider);
  return new Response(buf,{headers:{'content-type':type.startsWith('image/')?type:'image/x-icon','cache-control':'public, max-age=86400, s-maxage=604800','x-mongolz-asset':'provider-mark'}});
 }catch{return fallback(provider)}
}
