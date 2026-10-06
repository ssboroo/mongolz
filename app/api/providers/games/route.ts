import {credentials} from '../../../../provider.mjs';
import {provider,rateLimit} from '@/lib/provider-server';
export const dynamic='force-dynamic';export const runtime='nodejs';
export async function GET(request:Request){if(!credentials())return Response.json({code:'NOT_CONFIGURED'},{status:503});if(!rateLimit(request))return Response.json({code:'RATE_LIMIT'},{status:429});try{return Response.json({games:await provider.catalog()},{headers:{'Cache-Control':'no-store'}});}catch{return Response.json({code:'PROVIDER_ERROR'},{status:502});}}
