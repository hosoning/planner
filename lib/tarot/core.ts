import ontology from '../../data/ontology.json';
import questionData from '../../data/questions.json';
export const VERSION = 'arcana-1.0';
export type Tags = Record<string, number>;
export type Card = { id:number; name:string; orientation:'upright'|'reversed'; meaning:string; tags:Tags; role:string };
export type Trip = {city:string;date:string;start:number;end:number;budget:number;currency:string;mode:'demo'|'live'};
export type Snapshot = {version:string;trip:Trip;questionId:string;prediction:string;cards:Card[]};
export type Question = {id:string;text:string;category:string;options:{id:string;label:string;prototype:Tags}[];mapping:Record<string,{option:string;scores:number[]}>};
export const questions = questionData as unknown as Question[];
export const deck = ontology;
export const roles=['Calibration','Region','Setting','Pace','Meals','Cuisine','Activity I','Activity II','Activity III','Activity IV','Sequence','Transport'];
export function randomInt(n:number, fill:(a:Uint32Array)=>Uint32Array=a=>crypto.getRandomValues(a)) {if(!Number.isInteger(n)||n<1||n>0x100000000)throw Error('Invalid random bound');const limit=Math.floor(0x100000000/n)*n;let v;do{v=fill(new Uint32Array(1))[0];}while(v>=limit);return v%n;}
export function draw(trip:Trip, rand:(n:number)=>number=randomInt):Snapshot { // One synchronous draw transaction; no await/provider calls.
 const q=questions[rand(questions.length)];const ids=deck.map(x=>x.id);for(let i=ids.length-1;i>0;i--){const j=rand(i+1);[ids[i],ids[j]]=[ids[j],ids[i]];}
 const cards=ids.slice(0,roles.length).map((id,i)=>{const orientation:Card['orientation']=rand(2)===0?'upright':'reversed';const c=deck[id];return {id,name:c.name,orientation,meaning:c[orientation].meaning,tags:c[orientation].tags as unknown as Tags,role:roles[i]};});
 return {version:VERSION,trip,questionId:q.id,prediction:q.mapping[`${cards[0].id}:${cards[0].orientation}`].option,cards};
}
export async function commitment(snapshot:Snapshot,salt:string){const bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(JSON.stringify(snapshot)+'|'+salt));return Array.from(new Uint8Array(bytes),x=>x.toString(16).padStart(2,'0')).join('');}
export function validateTrip(v:unknown):Trip{const x=v as Record<string,unknown>;if(!x||typeof x!=='object')throw Error('請填寫行程資料。');const city=String(x.city||'').trim();const date=String(x.date||'');const currency=String(x.currency||'');const start=Number(x.start),end=Number(x.end),budget=Number(x.budget);if(!city||city.length>80||!/^\d{4}-\d{2}-\d{2}$/.test(date)||new Date(date+'T12:00:00Z').toISOString().slice(0,10)!==date)throw Error('城市或日期無效。');if(!Number.isInteger(start)||!Number.isInteger(end)||start<0||end>1440||end-start<120||end-start>720)throw Error('請選擇同一天內 2–12 小時。');if(!Number.isSafeInteger(budget)||budget<0||budget>100000000||!['CAD','HKD','USD','EUR','GBP','JPY','TWD','AUD','SGD'].includes(currency))throw Error('預算或貨幣無效。');if(x.mode!=='demo'&&x.mode!=='live')throw Error('資料模式無效。');if(x.mode==='demo'&&(city!=='Vancouver'||currency!=='CAD'))throw Error('示範資料僅支援 Vancouver / CAD。');return {city,date,currency,start,end,budget,mode:x.mode};}
export const tagScore=(tags:Tags,card:Card)=>Object.entries(tags).reduce((s,[k,v])=>s+v*(card.tags[k]||0),0);
export function publicRound(id:string,snapshot:Snapshot,hash:string,expires:number){const q=questions.find(q=>q.id===snapshot.questionId)!;return {id,question:{id:q.id,text:q.text,category:q.category,options:q.options.map(({id,label})=>({id,label}))},prediction:snapshot.prediction,calibration:snapshot.cards[0],commitment:hash,expires,trip:snapshot.trip};}
