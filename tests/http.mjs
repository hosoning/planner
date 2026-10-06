import assert from 'node:assert/strict';
const base='http://127.0.0.1:8787';let cookie='';
async function post(body,c=cookie){const r=await fetch(base+'/api/round',{method:'POST',headers:{'Content-Type':'application/json',Origin:base,Cookie:c},body:JSON.stringify(body)});if(!cookie)cookie=r.headers.get('set-cookie')?.split(';')[0]||'';return {status:r.status,data:await r.json()};}
const trip={city:'Vancouver',date:'2026-10-06',start:540,end:1260,budget:18000,currency:'CAD',mode:'demo'};
const a=await post({action:'create',trip});assert.equal(a.status,200);assert(!a.data.round.cards);const r=a.data.round;
const unauthorized=await post({action:'answer',id:r.id,answer:r.prediction},'');assert.notEqual(unauthorized.status,200);
const wrong=r.question.options.find(o=>o.id!==r.prediction).id;const fail=await post({action:'answer',id:r.id,answer:wrong});assert.equal(fail.data.voided,true);assert.notEqual(fail.data.round.id,r.id);assert.notEqual(fail.data.round.commitment,r.commitment);
const old=await post({action:'answer',id:r.id,answer:r.prediction});assert.equal(old.status,409);
const rr=fail.data.round;const good=await post({action:'answer',id:rr.id,answer:rr.prediction});assert.equal(good.status,200);assert.equal(good.data.passed,true);assert.equal(good.data.cards.length,11);assert(good.data.plan.stops.length>=2,JSON.stringify(good.data.plan.diagnostics));
const again=await post({action:'answer',id:rr.id,answer:'0'});assert.equal(again.data.passed,true);assert.deepEqual(again.data.cards,good.data.cards);
const next=(await post({action:'create',trip})).data.round;const outcomes=await Promise.all([post({action:'answer',id:next.id,answer:next.prediction}),post({action:'answer',id:next.id,answer:next.question.options.find(o=>o.id!==next.prediction).id})]);assert(!(outcomes.some(x=>x.data.passed)&&outcomes.some(x=>x.data.voided)));
const skipRound=(await post({action:'create',trip})).data.round;const skipped=await post({action:'skip',id:skipRound.id});assert.equal(skipped.data.voided,true);assert.notEqual(skipped.data.round.id,skipRound.id);
console.log('HTTP checks passed: hidden formal cards, ownership, full redraw, replay, success, concurrent reveal, skip.');
