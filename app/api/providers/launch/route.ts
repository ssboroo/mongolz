import {credentials} from '../../../../provider.mjs';
import {provider,rateLimit} from '@/lib/provider-server';
export const dynamic='force-dynamic';export const runtime='nodejs';
export async function POST(request:Request){
 if(!credentials())return Response.json({code:'NOT_CONFIGURED'},{status:503});
 if(!rateLimit(request))return Response.json({code:'RATE_LIMIT'},{status:429});
 const origin=request.headers.get('origin');const expected=process.env.PUBLIC_ORIGIN||new URL(request.url).origin;
 if(!origin||origin!==expected)return Response.json({code:'INVALID_ORIGIN'},{status:403});
 try{const text=await request.text();if(text.length>4096)return Response.json({code:'TOO_LARGE'},{status:413});let body;try{body=JSON.parse(text);}catch{return Response.json({code:'INVALID_JSON'},{status:400});}if(typeof body.id!=='string'||body.id.length>300)return Response.json({code:'INVALID_GAME'},{status:400});const url=await provider.launch(body.id,body.device,expected);return Response.json({url,mode:'demo'},{headers:{'Cache-Control':'no-store'}});}catch(error){const status=error instanceof Error&&'status' in error&&error.status===404?404:502;return Response.json({code:status===404?'DEMO_UNAVAILABLE':'PROVIDER_ERROR'},{status});}
}
