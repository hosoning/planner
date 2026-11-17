import ontology from '../../data/ontology.json';
import { randomInt, type Card, type Tags } from './core';

export type Destination = { id:string; en:string; zh:string; currency:'CNY'|'HKD'|'MOP'|'TWD'; timezone:string; tags:Tags; dataStatus:'provider_required' };
export const chinaDestinations:Destination[]=[
 {id:'beijing',en:'Beijing',zh:'北京',currency:'CNY',timezone:'Asia/Shanghai',tags:{history:4,culture:3,urban:2},dataStatus:'provider_required'},
 {id:'shanghai',en:'Shanghai',zh:'上海',currency:'CNY',timezone:'Asia/Shanghai',tags:{urban:4,food:3,creative:2},dataStatus:'provider_required'},
 {id:'shenzhen',en:'Shenzhen',zh:'深圳',currency:'CNY',timezone:'Asia/Shanghai',tags:{modern:4,creative:3,nature:2},dataStatus:'provider_required'},
 {id:'chengdu',en:'Chengdu',zh:'成都',currency:'CNY',timezone:'Asia/Shanghai',tags:{food:4,slow:3,culture:2},dataStatus:'provider_required'},
 {id:'hangzhou',en:'Hangzhou',zh:'杭州',currency:'CNY',timezone:'Asia/Shanghai',tags:{water:4,nature:3,calm:2},dataStatus:'provider_required'},
 {id:'guangzhou',en:'Guangzhou',zh:'广州',currency:'CNY',timezone:'Asia/Shanghai',tags:{food:4,urban:3,culture:2},dataStatus:'provider_required'},
 {id:'xian',en:"Xi'an",zh:'西安',currency:'CNY',timezone:'Asia/Shanghai',tags:{history:4,culture:4,adventure:1},dataStatus:'provider_required'},
 {id:'nanjing',en:'Nanjing',zh:'南京',currency:'CNY',timezone:'Asia/Shanghai',tags:{history:4,culture:3,quiet:2},dataStatus:'provider_required'},
 {id:'chongqing',en:'Chongqing',zh:'重庆',currency:'CNY',timezone:'Asia/Shanghai',tags:{mountain:3,urban:3,food:2},dataStatus:'provider_required'},
 {id:'suzhou',en:'Suzhou',zh:'苏州',currency:'CNY',timezone:'Asia/Shanghai',tags:{water:4,calm:3,culture:2},dataStatus:'provider_required'},
 {id:'wuhan',en:'Wuhan',zh:'武汉',currency:'CNY',timezone:'Asia/Shanghai',tags:{water:3,urban:3,food:2},dataStatus:'provider_required'},
 {id:'xiamen',en:'Xiamen',zh:'厦门',currency:'CNY',timezone:'Asia/Shanghai',tags:{water:4,calm:3,creative:2},dataStatus:'provider_required'},
 {id:'hong-kong',en:'Hong Kong',zh:'香港',currency:'HKD',timezone:'Asia/Hong_Kong',tags:{urban:3,food:3,water:2},dataStatus:'provider_required'},
 {id:'macau',en:'Macau',zh:'澳门',currency:'MOP',timezone:'Asia/Macau',tags:{culture:3,food:3,urban:2},dataStatus:'provider_required'},
 {id:'taipei',en:'Taipei',zh:'台北',currency:'TWD',timezone:'Asia/Taipei',tags:{food:3,creative:3,urban:2},dataStatus:'provider_required'},
];
export type CityDraw={cards:Card[];destination:Destination;rationale:string};
export function drawDestination(rand:typeof randomInt=randomInt):CityDraw {
 const deck=ontology as unknown as {id:number;name:string;upright:{meaning:string;tags:Tags};reversed:{meaning:string;tags:Tags}}[];
 const ids=deck.map(c=>c.id);for(let i=ids.length-1;i>0;i--){const j=rand(i+1);[ids[i],ids[j]]=[ids[j],ids[i]];}
 const cards=ids.slice(0,3).map(id=>{const c=deck[id],orientation=rand(2)===0?'upright':'reversed';return {id,name:c.name,orientation,meaning:c[orientation].meaning,tags:c[orientation].tags,role:'Destination'} as Card});
 const ranked=[...chinaDestinations].map(d=>({d,score:cards.reduce((s,c)=>s+Object.entries(d.tags).reduce((n,[k,v])=>n+v*(c.tags[k]||0),0),0)})).sort((a,b)=>b.score-a.score);
 const top=ranked[0];
 return {cards,destination:top.d,rationale:`${cards.map(c=>`${c.name} ${c.orientation==='upright'?'正位':'逆位'}：${c.meaning}`).join('；')}。抽牌后按预先定义的城市属性匹配，尚未查询或验证该城市的实时地点资料。`};
}
