import {it} from 'node:test';
import assert from 'node:assert/strict';
import {draw,commitment} from '../lib/tarot/core';
import {optimize} from '../lib/tarot/planner';
import {openProvider} from '../lib/tarot/open-data';
const access={get:async()=>null,put:async()=>{},limit:async()=>{}};
it('builds a real itinerary without origin even if live weather returns 503; never changes locked cards',async()=>{
 const s=draw({city:'Vancouver',currency:'CAD',date:'2026-10-08',start:540,end:1260,budget:18000,mode:'live'});for(const d of s.decisions!.filter(d=>d.id.startsWith('shortlist')))d.selected='yes';let calls=0;
 const provider=openProvider(access,async()=>{calls++;return new Response('unavailable',{status:503});});
 const hash=await commitment(s,'salt');const p=await optimize(s,provider);assert(p.stops.length>0);assert.equal(calls,1);assert.equal(await commitment(s,'salt'),hash);assert(!p.trip.origin);assert(!p.returnRoute);
 assert([15,30,45,60,90,120].includes(p.stops[0].travelAllowance!.minutes));
 assert(p.stops[0].arrival-p.stops[0].leavePrevious>=p.stops[0].travelAllowance!.minutes);
 assert(p.stops.every((stop,i)=>!!stop.poi.address&&(i===0?!stop.route:!!stop.route?.source)));
 assert(p.stops.at(-1)!.departure<=p.trip.end);assert(p.total<=p.trip.budget);
});
it('searches a non-Vancouver city without a vendor key and blocks unverified map candidates from the itinerary',async()=>{
 const s=draw({city:'上海',currency:'CNY',date:'2026-10-20',start:540,end:1260,budget:180000,mode:'live'});for(const d of s.decisions!.filter(d=>d.id.startsWith('shortlist')))d.selected='yes';let calls=0;
 const provider=openProvider(access,async(input)=>{calls++;const url=String(input);if(url.includes('geocoding-api.open-meteo.com'))return Response.json({results:[{latitude:31.23,longitude:121.47,name:'Shanghai',country:'China',country_code:'CN'}]});if(url.includes('overpass-api.de'))return Response.json({elements:[{type:'node',id:1,lat:31.25,lon:121.47,tags:{name:'测试餐厅',amenity:'restaurant','addr:housenumber':'1','addr:street':'测试路'}},{type:'node',id:2,lat:31.21,lon:121.47,tags:{name:'测试公园',leisure:'park'}},{type:'node',id:3,lat:31.23,lon:121.50,tags:{name:'测试影院',amenity:'cinema'}},{type:'node',id:4,lat:31.23,lon:121.44,tags:{name:'测试博物馆',tourism:'museum'}},{type:'node',id:5,lat:31.23,lon:121.47,tags:{name:'测试场馆',amenity:'arts_centre'}}]});throw Error('Unexpected source');});
 const plan=await optimize(s,provider);assert.equal(calls,2);assert.equal(plan.stops.length,0);assert.equal(plan.search?.coverage.includes('上海'),true);assert(plan.search?.stages.some(stage=>stage.candidates.some(c=>c.name==='测试餐厅'&&c.status==='unverified')));
});
