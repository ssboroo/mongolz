import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { createProvider, credentials } from './provider.mjs';
const provider = createProvider();
const requests = new Map();
const root = path.dirname(fileURLToPath(import.meta.url));
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml' };
http.createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (pathname.startsWith('/api/')) {
      const send=(status,value)=>{res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(value));};
      if(pathname==='/api/providers/status' && req.method==='GET')return send(200,{configured:credentials(),mode:'demo-only'});
      if(!credentials())return send(503,{error:'Provider credentials not configured',code:'NOT_CONFIGURED'});
      const ip=req.socket.remoteAddress;const now=Date.now();
      for(const [key,val] of requests)if(now-val.start>60000)requests.delete(key);
      const quota=requests.get(ip)||{start:now,count:0};quota.count++;requests.set(ip,quota);
      if(quota.count>30)return send(429,{error:'Too many requests'});
      try {
        if(pathname==='/api/providers/games' && req.method==='GET')return send(200,{games:await provider.catalog()});
        if(pathname==='/api/providers/launch' && req.method==='POST') {
          const origin=req.headers.origin;
          if(origin && origin!==`http://${req.headers.host}` && origin!==process.env.PUBLIC_ORIGIN)return send(403,{error:'Invalid origin'});
          let body='';for await(const chunk of req){body+=chunk;if(body.length>4096)return send(413,{error:'Request too large'});}
          let data;try{data=JSON.parse(body);}catch{return send(400,{error:'Invalid JSON'});}
          if(typeof data.id!=='string'||data.id.length>300)return send(400,{error:'Invalid game'});
          const homeurl=process.env.PUBLIC_ORIGIN||'http://localhost:3000';
          return send(200,{url:await provider.launch(data.id,data.device,homeurl),mode:'demo'});
        }
        return send(404,{error:'Not found'});
      }catch(error){return send(error.status||502,{error:error.status===404?'Demo game not available':'Provider demo temporarily unavailable',code:'PROVIDER_ERROR'});}
    }
    const target = pathname === '/' ? '/index.html' : pathname;
    if (!['/index.html','/src/app.js','/src/engine.js','/src/style.css','/src/providers.js','/favicon.svg'].includes(target)) { res.writeHead(404); res.end('Not found'); return; }
    const data = await readFile(path.join(root, target));
    res.writeHead(200, {'Content-Type': types[path.extname(target)], 'X-Content-Type-Options': 'nosniff', 'Content-Security-Policy': "default-src 'self'; style-src 'self'; script-src 'self'; img-src 'self' data: https:; frame-src https:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'"});
    res.end(data);
  } catch { res.writeHead(404); res.end('Not found'); }
}).listen(Number(process.env.PORT || 3000), '0.0.0.0', () => console.log('Mongolz demo ready on port ' + (process.env.PORT || 3000)));
