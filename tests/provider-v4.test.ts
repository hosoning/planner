import {it} from 'node:test';
import assert from 'node:assert/strict';
import {draw,commitment} from '../lib/tarot/core';
import {optimize} from '../lib/tarot/planner';
import {openProvider} from '../lib/tarot/open-data';
const access={get:async()=>null,put:async()=>{},limit:async()=>{}};
it('builds a real itinerary without origin even if live weather returns 503; never changes locked cards',async()=>{
 const s=draw({city:'Vancouver',currency:'CAD',date:'2026-10-08',start:540,end:1260,budget:18000,mode:'live'});let calls=0;
 const provider=openProvider(access,async()=>{calls++;return new Response('unavailable',{status:503});});
 const hash=await commitment(s,'salt');const p=await optimize(s,provider);assert(p.stops.length>0);assert.equal(calls,1);assert.equal(await commitment(s,'salt'),hash);assert(!p.trip.origin);assert(!p.returnRoute);
 assert([15,30,45,60,90,120].includes(p.stops[0].travelAllowance!.minutes));
 assert(p.stops[0].arrival-p.stops[0].leavePrevious>=p.stops[0].travelAllowance!.minutes);
 assert(p.stops.every((stop,i)=>!!stop.poi.address&&(i===0?!stop.route:!!stop.route?.source)));
 assert(p.stops.at(-1)!.departure<=p.trip.end);assert(p.total<=p.trip.budget);
});
