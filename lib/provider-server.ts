import 'server-only';
import { createProvider } from '../provider.mjs';
export const provider=createProvider();
const quotas=new Map<string,{count:number;start:number}>();
export function rateLimit(request:Request){const now=Date.now();for(const [key,value]of quotas)if(now-value.start>60000)quotas.delete(key);const key=request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()||'local';const value=quotas.get(key)||{count:0,start:now};value.count++;quotas.set(key,value);return value.count<=30;}
