import catalog from '@/lib/public-catalog.json';

export const runtime='nodejs';
const games=(catalog as any).games as Array<{id:string;name:string;provider:string;category:string;url?:string}>;

function esc(v:string){return v.replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[m]||m))}
function fallback(game:any){
 const palettes:Record<string,[string,string,string]>={
  live:['#173f5b','#2b8bc6','#07131c'],slots:['#41294f','#9861d0','#100c14'],table:['#45381d','#c49a43','#100d07'],instant:['#174638','#3cc98f','#07140f']
 };
 const p=palettes[game?.category]||['#183a52','#3988c5','#08131b'];
 const title=esc((game?.name||'MONGOLZ DEMO').slice(0,30));
 const provider=esc(game?.provider||'MONGOLZ');
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="720" height="900" viewBox="0 0 720 900">
 <defs><radialGradient id="g" cx="72%" cy="14%"><stop stop-color="${p[1]}"/><stop offset=".43" stop-color="${p[0]}"/><stop offset="1" stop-color="${p[2]}"/></radialGradient><pattern id="p" width="60" height="60" patternUnits="userSpaceOnUse"><path d="M30 0 60 30 30 60 0 30Z" fill="none" stroke="white" stroke-opacity=".055"/></pattern></defs>
 <rect width="720" height="900" fill="url(#g)"/><rect width="720" height="900" fill="url(#p)"/>
 <circle cx="535" cy="260" r="155" fill="none" stroke="white" stroke-opacity=".13"/><circle cx="535" cy="260" r="112" fill="none" stroke="white" stroke-opacity=".09"/>
 <text x="58" y="88" fill="#ffffffaa" font-family="Arial" font-size="20" letter-spacing="5">MONGOLZ • DEMO PREVIEW</text>
 <text x="58" y="590" fill="white" font-family="Arial" font-weight="800" font-size="48">${title}</text>
 <text x="58" y="642" fill="#ffffffaa" font-family="Arial" font-size="24">${provider}</text>
 <rect x="58" y="702" width="168" height="50" rx="14" fill="#ffffff16" stroke="#ffffff2a"/><text x="84" y="734" fill="white" font-family="Arial" font-weight="700" font-size="18">PLAY DEMO</text>
 </svg>`;
 return new Response(svg,{headers:{'content-type':'image/svg+xml; charset=utf-8','cache-control':'public, max-age=3600, s-maxage=86400'}});
}
function metaImage(html:string){
 const a=html.match(/<meta[^>]+(?:property|name)=["'](?:og:image|og:image:secure_url|twitter:image)["'][^>]+content=["']([^"']+)["'][^>]*>/i);
 if(a?.[1])return a[1];
 const b=html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["'](?:og:image|og:image:secure_url|twitter:image)["'][^>]*>/i);
 return b?.[1]||'';
}
export async function GET(req:Request){
 const id=new URL(req.url).searchParams.get('id')||'';
 const game=games.find(g=>g.id===id);
 if(!game)return fallback(null);
 if(!game.url)return fallback(game);
 try{
  const page=await fetch(game.url,{headers:{'user-agent':'Mozilla/5.0 (compatible; MONGOLZ-Demo/1.0; +https://github.com/ssboroo/mongolz)','accept':'text/html'},next:{revalidate:86400}});
  if(!page.ok)return fallback(game);
  const html=await page.text();
  let found=metaImage(html).replace(/&amp;/g,'&');
  if(!found)return fallback(game);
  const imageUrl=new URL(found,game.url);
  if(!/^https?:$/.test(imageUrl.protocol))return fallback(game);
  const img=await fetch(imageUrl,{headers:{'user-agent':'Mozilla/5.0','referer':new URL(game.url).origin+'/'},next:{revalidate:86400}});
  if(!img.ok)return fallback(game);
  const type=img.headers.get('content-type')||'';
  if(!type.startsWith('image/'))return fallback(game);
  const buf=await img.arrayBuffer();
  if(buf.byteLength>6_000_000)return fallback(game);
  return new Response(buf,{headers:{'content-type':type,'cache-control':'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800','x-mongolz-asset':'official-page-preview'}});
 }catch{return fallback(game)}
}
