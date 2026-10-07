import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const base='http://127.0.0.1:8787';let cookie='';
async function post(body,c=cookie){const r=await fetch(base+'/api/round',{method:'POST',headers:{'Content-Type':'application/json',Origin:base,Cookie:c},body:JSON.stringify(body)});if(!cookie)cookie=r.headers.get('set-cookie')?.split(';')[0]||'';return {status:r.status,data:await r.json()};}
const future=new Date(Date.now()+3*86400000).toISOString().slice(0,10);const trip={city:'Vancouver',date:future,start:540,end:1260,budget:30000,currency:'CAD',mode:'demo',timezone:'America/Vancouver'};
let a=await post({action:'create',trip});assert.equal(a.status,200);assert.equal(a.data.round.formalCount,40);assert(a.data.round.predictionLabel);assert(!a.data.round.cards);const r=a.data.round;
assert.notEqual((await post({action:'answer',id:r.id,answer:'yes'},'')).status,200);
assert.equal((await post({action:'answer',id:r.id,answer:'0'})).status,400);
const fail=await post({action:'answer',id:r.id,answer:'no'});assert.equal(fail.data.voided,true);assert.notEqual(fail.data.round.id,r.id);const proof=fail.data.voidAudit;assert.equal(createHash('sha256').update(JSON.stringify(proof.snapshot)+'|'+proof.salt).digest('hex'),r.commitment);
assert.equal((await post({action:'answer',id:r.id,answer:'yes'})).status,409);
let rr=fail.data.round,good=await post({action:'answer',id:rr.id,answer:'yes'});assert.equal(good.status,200);assert.equal(good.data.passed,true);
let full=good;if(good.data.surprise)full=await post({action:'revealAll',id:rr.id,confirmSpoilers:true});assert.equal(full.data.cards.length,40);assert(full.data.plan.stops.length>=1,JSON.stringify(full.data.plan.diagnostics));assert(full.data.plan.stops.every(s=>s.poi.name&&s.poi.address&&s.poi.booking));
const again=await post({action:'answer',id:rr.id,answer:'no'});assert.equal(again.data.passed,true);assert.deepEqual(again.data.plan,full.data.plan);
const resumed=await post({action:'resume'});assert.equal(resumed.data.round.id,rr.id);assert.deepEqual(resumed.data.plan,full.data.plan);
const stop=full.data.plan.stops.find(s=>s.poi.booking.required);if(stop){const update=await post({action:'booking',id:rr.id,stopId:stop.poi.id,status:'confirmed',paid:true,reference:'TEST-ONLY'});assert.equal(update.data.plan.stops.find(s=>s.poi.id===stop.poi.id).poi.booking.reference,'TEST-ONLY');}
const next=(await post({action:'create',trip})).data.round;const outcomes=await Promise.all([post({action:'answer',id:next.id,answer:'yes'}),post({action:'answer',id:next.id,answer:'no'})]);assert(!(outcomes.some(x=>x.data.passed)&&outcomes.some(x=>x.data.voided)));
let hidden;for(let i=0;i<12;i++){rr=(await post({action:'create',trip})).data.round;const result=await post({action:'answer',id:rr.id,answer:'yes'});if(result.data.surprise){hidden=result.data;break;}}
assert(hidden,'Expected a surprise fixture within 12 independently drawn test rounds');assert.equal(hidden.surprise.revealed.length,0);assert(!hidden.plan);assert(!hidden.cards);assert(!hidden.audit);
const forgedTime=await post({action:'view',id:rr.id,now:Date.now()+99999999999});assert.equal(forgedTime.data.surprise.revealed.length,0);
assert.equal((await post({action:'export',id:rr.id})).status,400);const packet=await post({action:'export',id:rr.id,confirmSpoilers:true});assert(packet.data.text.includes('地址'));assert(packet.data.text.includes('預訂頁'));assert(packet.data.text.includes('訂金'));
const calendar=await post({action:'calendar',id:rr.id});assert(calendar.data.text.includes('BEGIN:VALARM'));assert(!calendar.data.text.includes('Example Lane'));
assert((await post({action:'resume'})).data.surprise);assert.equal((await post({action:'revealAll',id:rr.id})).status,400);
const reveal=await post({action:'revealAll',id:rr.id,confirmSpoilers:true});assert(reveal.data.plan.stops.length);assert.equal(reveal.data.cards.length,40);
const skipRound=(await post({action:'create',trip})).data.round;const skipped=await post({action:'skip',id:skipRound.id});assert.equal(skipped.data.voided,true);assert.notEqual(skipped.data.round.id,skipRound.id);
console.log('HTTP v2 passed: boolean calibration, failed proof, 41-card lock, ownership, replay/race, resume, booking persistence, server-time surprise redaction, explicit executor export, ICS, spoiler opt-out and skip.');
