import assert from 'node:assert/strict';
import {draw} from '../lib/tarot/core';
import {optimize} from '../lib/tarot/planner';
import {openProvider} from '../lib/tarot/open-data';
import forecast from '../data/verified-weather.json';
const access={get:async()=>JSON.stringify(forecast),put:async()=>{},limit:async()=>{}};
let seed=18245;const rand=(n:number)=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed%n;};let fail=0;for(let i=0;i<30;i++){const s=draw({city:'Vancouver',currency:'CAD',date:'2026-10-08',start:540,end:1260,budget:18000,mode:'live'},rand);const p=await optimize(s,openProvider(access));if(!p.stops.length){fail++;console.log('FAILED',Object.fromEntries(s.decisions!.filter(d=>['duration','mealCount','mealTime','outboundTime','firstMeal'].includes(d.id)).map(d=>[d.id,d.selected])),p.diagnostics);}}
console.log({fail,total:30});

assert.equal(fail,0);
