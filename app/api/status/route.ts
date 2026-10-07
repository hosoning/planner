import {venues,OPEN_DATA_UNTIL} from '../../../lib/tarot/open-data';
export async function GET(){return Response.json({liveReady:true,provider:'open',validUntil:OPEN_DATA_UNTIL,venues:venues.map(v=>({name:v.name,address:v.address,source:v.source}))},{headers:{'Cache-Control':'no-store'}});}
