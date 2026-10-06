import {credentials} from '../../../../provider.mjs';
export const dynamic='force-dynamic';
export async function GET(){return Response.json({configured:credentials(),provider:'SoftAggregator',mode:'demo-only',signupUrl:'https://softaggregator.com/'},{headers:{'Cache-Control':'no-store'}});}
