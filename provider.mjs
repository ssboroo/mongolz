import { randomUUID, randomBytes } from 'node:crypto';
const endpoint='https://api.softaggregator.com/api/v1';
export function credentials(env=process.env){return Boolean(env.SOFTAGGREGATOR_API_LOGIN && env.SOFTAGGREGATOR_API_PASSWORD);}
export function normalizeGames(response){if(!Array.isArray(response))throw new Error('Invalid catalog');return response.filter(g=>g.play_for_fun_supported===true&&typeof g.id_hash==='string'&&typeof g.name==='string').map(g=>({id:g.id_hash,name:g.name.slice(0,150),provider:String(g.provider_name||g.provider||'Provider').slice(0,100),category:String(g.game_type||'other'),image:typeof g.image==='string'&&g.image.startsWith('https://')?g.image:null}));}
export function launchUrl(value){const url=new URL(value);if(url.protocol!=='https:'||url.username||url.password)throw new Error('Invalid launch URL');return url.href;}
export function createProvider({env=process.env,request=fetch}={}){
 let cache=null,expires=0;
 async function call(method,params={}){
  if(!credentials(env))throw Object.assign(new Error('Provider credentials not configured'),{status:503});
  const res=await request(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...params,method,api_login:env.SOFTAGGREGATOR_API_LOGIN,api_password:env.SOFTAGGREGATOR_API_PASSWORD}),signal:AbortSignal.timeout(15000),redirect:'error'});
  if(!res.ok)throw new Error('Provider request failed');const data=await res.json();if(data.error!==0)throw new Error('Provider refused request');return data.response;
 }
 async function catalog(){if(cache&&Date.now()<expires)return cache;const next=normalizeGames(await call('getGameList'));cache=next;expires=Date.now()+300000;return cache;}
 async function launch(id,device='desktop',homeurl){const list=await catalog();if(!list.some(g=>g.id===id))throw Object.assign(new Error('Demo game not available'),{status:404});
  const user_username='demo_'+randomUUID().replaceAll('-','');const user_password=randomBytes(24).toString('hex');
  const currency=env.SOFTAGGREGATOR_CURRENCY||'USD';
  await call('createPlayer',{user_username,user_password,currency});
  const response=await call('getGameDemo',{user_username,user_password,gameid:id,lang:'en',currency,device:device==='mobile'?'mobile':'desktop',homeurl,play_for_fun:true});
  return launchUrl(response);
 }
 return {catalog,launch};
}
