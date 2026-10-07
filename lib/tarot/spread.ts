import type {Card,Trip} from './core';
export type Choice={id:string;label:string;tags:string[]};
export type Decision={id:string;question:string;card:Card;cards:Card[];mainCount:number;preferred:string;selected:string;label:string;ranking:string[];note?:string};
export type Definition={id:string;question:string;options:Choice[]};
const opts=(rows:string[])=>rows.map(row=>{const [id,label,tags]=row.split('|');return {id,label,tags:tags.split(' ')}});
const yesNo=opts(['yes|是|active social change','no|否|quiet caution rest']);
const areas=opts(['downtown|Downtown|urban shopping work','north|North Vancouver|mountain nature adventure','coquitlam|Coquitlam|nature slow family','richmond|Richmond|food group culture','kitsilano|Kitsilano|beach water calm','other|其他已核实地区|travel independent creative']);
export const activities=opts(['walk|散步与探索|walk slow outdoor','beach|海边|beach water calm','shopping|购物逛街|shopping urban comfort','photography|拍照|photography bright creative','exhibition|展览|exhibition creative culture','museum|博物馆|museum study quiet','skyline|城市景观|skyline urban bright','boat|搭船|boat water travel','mountain|上山|mountain nature adventure','paragliding|滑翔伞|paragliding adventure active','fitness|运动健身|fitness active focus']);
const cuisines=opts(['korean|韩式|warm group food','western|西餐|comfort urban food','chinese|中餐|chinese group culture','french|法餐|pair creative comfort','fastfood|快餐|fast movement active','dessert|奶茶、零食、甜点|bakery slow comfort','hotpot|火锅、烧烤|warm social group','other|其他菜系|water nature independent']);
export const definitions:Definition[]=[
 {id:'outboundTime',question:'出门到第一站预留多久？',options:opts(['15|15 分钟|near fast focus','30|15–30 分钟|urban active','45|30–45 分钟|calm order','60|45–60 分钟|travel movement','90|60–90 分钟|nature adventure','120|90–120 分钟|far independent'])},
 {id:'duration',question:'今天是多久的行程？',options:opts(['short|低于 2 小时|fast focus','half|半天 · 4–6 小时|slow calm','full|一整天 · 6–8 小时以上|active travel','overnight|通宵|dark movement'])},
 {id:'mealStyle',question:'第一顿饭怎么吃？',options:opts(['home|家里做／翻热|home rest','takeaway|自己买／外卖|movement fast','regular|普通餐厅|food social','premium|高级餐厅|comfort pair'])},
 {id:'mealTime',question:'第一顿饭的开始时间？',options:opts(['early|10:00 前|bright active','brunch|10:00–12:00|slow calm','lunch|12:00–14:00|food work','afternoon|14:00–17:00|creative rest','dinner|17:00–21:00|dark social'])},
 {id:'mealCount',question:'行程内一共吃几餐？',options:opts(['1|1 餐|focus independent','2|2 餐|pair calm','3|3 餐|food social','4|4 餐|group comfort'])},
 {id:'firstMeal',question:'第一个行程是吃饭吗？',options:yesNo},
 ...Array.from({length:6},(_,i)=>({id:`region${i+1}`,question:`第 ${i+1} 站的地区？`,options:areas})),
 {id:'dish',question:'第一顿饭的菜色风格？',options:opts(['fresh|清爽、清新、偏轻盈|water nature','warm|温暖、饱足、熟悉感|warm home','crafted|讲究层次与摆盘|creative focus','sharing|适合分享、种类较多|group social'])},
 {id:'cuisine',question:'第一顿饭的菜系？',options:cuisines},
 ...Array.from({length:6},(_,i)=>({id:`activity${i+1}`,question:`第 ${i+1} 站做什么？`,options:activities})),
 ...Array.from({length:6},(_,i)=>({id:`confirm${i+1}`,question:`确认第 ${i+1} 站的首选活动？`,options:yesNo})),
 {id:'surprise',question:'保留惊喜盲盒吗？',options:yesNo},
 {id:'gift',question:'安排惊喜礼物吗？',options:yesNo},
 {id:'giftStyle',question:'这次留给你的纪念卡？',options:opts(['memory|约会纪念票|photography creative','treat|甜点主题纪念卡|food comfort','nature|花与风景纪念卡|nature calm','practical|约会日期纪念卡|work order'])},
 {id:'pace',question:'这一天的节奏？',options:opts(['slow|悠闲|slow rest','balanced|平衡|calm order','active|充实|active fast'])},
 {id:'transport',question:'站间交通优先方式？',options:opts(['WALK|步行|walk nature','TRANSIT|公共交通|transport travel'])},
 {id:'rest',question:'站间保留多少休息余裕？',options:opts(['10|10 分钟|active fast','20|20 分钟|calm slow','30|30 分钟|rest tired'])},
 {id:'rainBackup',question:'雨天改以室内活动为主吗？',options:yesNo},
 {id:'photo',question:'加入拍照时间吗？',options:yesNo},
 {id:'shopping',question:'安排逛街但不强制购物吗？',options:yesNo},
 {id:'meal2Cuisine',question:'第二餐的菜系？',options:cuisines},
 {id:'meal3Cuisine',question:'第三餐的菜系？',options:cuisines},
 {id:'meal4Cuisine',question:'第四餐的菜系？',options:cuisines},
 {id:'finish',question:'最后一站的收尾气氛？',options:opts(['quiet|安静放松|quiet rest','view|看景与散步|skyline walk','social|热闹相聚|group social'])},
 {id:'giftBudget',question:'纪念卡配色？',options:opts(['0|夜色与金色|creative quiet','5|雾紫与银色|calm order','10|玫瑰与奶白|comfort social'])},
 {id:'comfort',question:'优先舒适还是新体验？',options:opts(['comfort|熟悉舒适|home comfort','explore|新鲜探索|adventure travel'])},
];
export function cardCount(d:Definition){return /^(dish|cuisine|giftStyle|activity|meal[234]Cuisine|shoppingItem)/.test(d.id)?6:3;}
export function blend(cards:Card[],mainCount=0):Card{const tags:Record<string,number>={};let weight=0;cards.forEach((c,i)=>{const w=i<mainCount?2:1;weight+=w;for(const [k,v] of Object.entries(c.tags))tags[k]=(tags[k]||0)+v*w;});for(const k of Object.keys(tags))tags[k]/=weight;return {...cards[0],name:cards.map(c=>c.name).join(' · '),meaning:cards.map(c=>c.meaning).join(' / '),tags};}
export const byId=(ds:Decision[],id:string)=>ds.find(d=>d.id===id)!;
export function detailDecisions(cards:Card[],trip:Trip):Decision[]{const result=definitions.map((d,i)=>{const group=cards.filter(c=>c.role===d.question);const mainCount=group.length>3?2:0;const card=blend(group,mainCount);const ranking=[...d.options].sort((a,b)=>b.tags.reduce((n,t)=>n+(card.tags[t]||0),0)-a.tags.reduce((n,t)=>n+(card.tags[t]||0),0)||d.options.indexOf(a)-d.options.indexOf(b)).map(o=>o.id);const preferred=ranking[0];let eligible=ranking;const span=trip.end-trip.start;if(d.id==='duration')eligible=ranking.filter(id=>id==='short'?span>=60:id==='half'?span>=240:id==='full'?span>=360:trip.end>1440&&span>=360);if(d.id==='mealCount')eligible=ranking.filter(id=>(Number(id)-1)*150+45<=span);if(d.id==='mealTime')eligible=ranking.filter(id=>mealWindows(id,trip).some(([a,b])=>Math.max(a,trip.start)+30<=Math.min(b,trip.end)));const selected=eligible[0]||preferred;return {id:d.id,question:d.question,card,cards:group,mainCount,preferred,selected,label:d.options.find(o=>o.id===selected)!.label,ranking,...(preferred!==selected?{note:'依你提供的可用时间选用同组牌的下一个可行选项。'}:{})};});const duration=result.find(d=>d.id==='duration')!;const available=trip.end-trip.start;const span=duration.selected==='short'?Math.min(110,available):duration.selected==='half'?Math.min(360,available):available;const effective={...trip,end:trip.start+span};const constrain=(id:string,predicate:(value:string)=>boolean)=>{const d=result.find(x=>x.id===id)!;const value=d.ranking.find(predicate);if(value&&value!==d.selected){d.selected=value;d.label=definitions.find(x=>x.id===id)!.options.find(x=>x.id===value)!.label;d.note='依同轮已锁定的行程时长与餐距，使用这组牌的下一个可行选项。';}};constrain('outboundTime',v=>Number(v)+45<=span);constrain('mealCount',v=>(Number(v)-1)*150+50<=span);const meals=Number(result.find(d=>d.id==='mealCount')!.selected);constrain('mealTime',v=>mealWindows(v,effective).some(([a,b])=>Math.max(a,effective.start)+50<=Math.min(b,effective.end-(meals-1)*150)));if(span<120)constrain('firstMeal',v=>v==='yes');if(!/vancouver/i.test(trip.city))for(const d of result.filter(d=>d.id.startsWith('region')))d.label=({downtown:'城市中心',north:'山区或近郊',coquitlam:'绿地或住宅区',richmond:'餐饮或文化区',kitsilano:'海滨或水边',other:'其他已核实地区'} as Record<string,string>)[d.selected];return result;}
export function mealWindows(id:string,trip:Trip):[number,number][]{const base:Record<string,[number,number]>={early:[0,600],brunch:[600,720],lunch:[720,840],afternoon:[840,1020],dinner:[1020,1260]};const w=base[id]||[0,1440];return [w,[w[0]+1440,w[1]+1440]].filter(([a,b])=>b>trip.start&&a<trip.end) as [number,number][];}
export function selected(ds:Decision[],id:string){return byId(ds,id).selected;}
