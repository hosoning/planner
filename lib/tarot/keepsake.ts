import type {Plan} from './planner';
export type Keepsake={locale:'en'|'zh';date:string;city:string;character:string;palette?:string;rows:{time:string;title:string;detail?:string}[]};
export function keepsakeLocale(city:string,timezone?:string):'en'|'zh'{return /Hong_Kong|Shanghai|Taipei|Macau|Chongqing|Singapore/.test(timezone||'')||/香港|澳门|台北|台中|高雄|上海|北京|广州|深圳|成都|杭州|南京|新加坡|Hong Kong|Taipei|Macau|Shanghai|Beijing|Shenzhen|Guangzhou|Singapore/i.test(city)?'zh':'en';}
export function makeKeepsake(plan:Plan):Keepsake{
 const locale=keepsakeLocale(plan.trip.city,plan.trip.timezone),en=locale==='en';
 const label=(m:number)=>`${m>=1440?(en?'Next day ':'次日 '):''}${String(Math.floor(m%1440/60)).padStart(2,'0')}:${String(m%60).padStart(2,'0')}`;
 const first=plan.stops[0];const rows:Keepsake['rows']=first?[{time:label(first.leavePrevious),title:en?"Let's Gooo~":'出门啦，Let’s go～'}]:[];
 plan.stops.forEach(s=>{let title:string;if(s.poi.meal)title=en?(s.arrival%1440>=1020?'Dinner date':s.arrival%1440>=660?'Lunch date':'Breakfast date'):(s.arrival%1440>=1020?'晚餐约会':s.arrival%1440>=660?'一起吃午餐':'早餐时间');else if(s.poi.tags.cinema)title=en?'Movie time~':'看电影～';else if(s.poi.venueId==='library'||s.poi.tags.study)title=en?'A little library date':'一起逛图书馆';else if(s.poi.tags.museum||s.poi.tags.exhibition)title=en?'Art & a little wandering':'逛展时间';else if(s.poi.tags.shopping)title=en?'Shopping together':'逛街去～';else if(s.poi.tags.beach)title=en?'By the sea':'去海边';else if(s.poi.tags.fitness)title=en?'Time to move':'运动时间';else title=en?'A little adventure':'一起走走';rows.push({time:label(s.arrival),title,detail:s.poi.name});});
 const last=plan.stops.at(-1);if(last)rows.push({time:label(last.departure),title:en?"That's a wrap!":'今天的约会结束啦'});
 return {locale,date:plan.trip.date,city:plan.trip.city,character:plan.trip.characterName||'',palette:plan.gift.palette,rows};
}
