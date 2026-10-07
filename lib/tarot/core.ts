import {definitions,detailDecisions,cardCount,type Decision} from './spread';
import ontology from '../../data/ontology.json';
import questionData from '../../data/questions.json';
export const VERSION = 'arcana-4.0';
export type Tags = Record<string, number>;
export type Card = { id:number; name:string; orientation:'upright'|'reversed'; meaning:string; tags:Tags; role:string };
export type Trip = {city:string;date:string;start:number;end:number;budget:number;currency:string;mode:'demo'|'live';timezone?:string;characterName?:string;userName?:string;homeAddress?:string;origin?:{lat:number;lng:number;label:string}};
export type Snapshot = {version:string;trip:Trip;questionId:string;prediction:string;cards:Card[];decisions?:Decision[]};
export type Question = {id:string;text:string;category:string;options:{id:string;label:string;prototype:Tags}[];mapping:Record<string,{option:string;scores:number[]}>};
export const questions = questionData as unknown as Question[];
export const deck = ontology;
export const roles=['Calibration',...definitions.map(d=>d.question)];
export function randomInt(n:number, fill:(a:Uint32Array)=>Uint32Array=a=>crypto.getRandomValues(a)) {if(!Number.isInteger(n)||n<1||n>0x100000000)throw Error('Invalid random bound');const limit=Math.floor(0x100000000/n)*n;let v;do{v=fill(new Uint32Array(1))[0];}while(v>=limit);return v%n;}
export function draw(trip:Trip, rand:(n:number)=>number=randomInt):Snapshot { // One synchronous draw transaction; no await/provider calls.
 const q=questions[rand(questions.length)];
 const groups=[{role:'Calibration',count:3},...definitions.map(d=>({role:d.question,count:cardCount(d)}))];
 const cards=groups.flatMap(g=>{const ids=deck.map(x=>x.id);for(let i=ids.length-1;i>0;i--){const j=rand(i+1);[ids[i],ids[j]]=[ids[j],ids[i]];}
 return ids.slice(0,g.count).map(id=>{const orientation:Card['orientation']=rand(2)===0?'upright':'reversed';const c=deck[id];return {id,name:c.name,orientation,meaning:c[orientation].meaning,tags:c[orientation].tags as unknown as Tags,role:g.role};});});
 const scores=q.options.map((_,i)=>cards.slice(0,3).reduce((n,c)=>n+q.mapping[`${c.id}:${c.orientation}`].scores[i],0));
 const prediction=q.options[scores.indexOf(Math.max(...scores))].id;
 return {version:VERSION,trip,questionId:q.id,prediction,cards,decisions:detailDecisions(cards,trip)};
}
export async function commitment(snapshot:Snapshot,salt:string){const bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(JSON.stringify(snapshot)+'|'+salt));return Array.from(new Uint8Array(bytes),x=>x.toString(16).padStart(2,'0')).join('');}
export function validateTrip(v:unknown):Trip{const x=v as Record<string,unknown>;if(!x||typeof x!=='object')throw Error('请填写行程资料。');const city=String(x.city||'').trim();const date=String(x.date||'');const currency=String(x.currency||'');const start=Number(x.start),end=Number(x.end),budget=Number(x.budget);if(!city||city.length>80||!/^\d{4}-\d{2}-\d{2}$/.test(date)||new Date(date+'T12:00:00Z').toISOString().slice(0,10)!==date)throw Error('城市或日期无效。');if(!Number.isInteger(start)||!Number.isInteger(end)||start<0||start>=1440||end>2880||end-start<60||end-start>1440)throw Error('请选择 1–24 小时，可跨至翌日。');if(!Number.isSafeInteger(budget)||budget<0||budget>100000000||!['CAD','HKD','USD','EUR','GBP','JPY','TWD','AUD','SGD'].includes(currency))throw Error('预算或货币无效。');if(x.mode!=='demo'&&x.mode!=='live')throw Error('资料模式无效。');if(x.mode==='demo'&&(city!=='Vancouver'||currency!=='CAD'))throw Error('示范资料仅支援 Vancouver / CAD。');const timezone=String(x.timezone||'America/Vancouver');try{new Intl.DateTimeFormat('en',{timeZone:timezone}).format();}catch{throw Error('目的地时区无效。');}const names=Object.fromEntries(['characterName','userName','homeAddress'].filter(k=>x[k]!==undefined).map(k=>{const v=String(x[k]).trim();if(v.length>(k==='homeAddress'?240:50))throw Error('名字或地址太长。');return [k,v]}));let origin:Trip['origin'];if(x.origin){const o=x.origin as Record<string,unknown>;if(typeof o.lat!=='number'||typeof o.lng!=='number'||!Number.isFinite(o.lat)||!Number.isFinite(o.lng)||Math.abs(o.lat)>90||Math.abs(o.lng)>180)throw Error('出发位置无效。');origin={lat:o.lat,lng:o.lng,label:String(o.label||'出发位置').slice(0,120)};}return {city,date,currency,start,end,budget,mode:x.mode,timezone,...names,...(origin?{origin}:{})};}
export const tagScore=(tags:Tags,card:Card)=>Object.entries(tags).reduce((s,[k,v])=>s+v*(card.tags[k]||0),0);
export function publicRound(id:string,snapshot:Snapshot,hash:string,expires:number){const q=questions.find(q=>q.id===snapshot.questionId)!;return {id,question:{id:q.id,text:q.text,category:q.category,options:q.options.map(({id,label})=>({id,label}))},prediction:snapshot.prediction,predictionLabel:q.options.find(o=>o.id===snapshot.prediction)!.label,formalCount:snapshot.cards.length-3,calibration:snapshot.cards[0],calibrationCards:snapshot.cards.slice(0,3),commitment:hash,expires,trip:snapshot.trip};}
