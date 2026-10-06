import {env} from 'cloudflare:workers';
import {parseCatalog} from '../../../lib/tarot/google';
export async function GET(){return Response.json({liveReady:!!env.GOOGLE_MAPS_API_KEY&&parseCatalog(env.VERIFIED_POI_CATALOG).length>0,catalogCount:parseCatalog(env.VERIFIED_POI_CATALOG).length},{headers:{'Cache-Control':'no-store'}});}
