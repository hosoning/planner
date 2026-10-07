import type {Card,Trip} from './core';
export type Choice={id:string;label:string;tags:string[]};
export type Decision={id:string;question:string;card:Card;preferred:string;selected:string;label:string;ranking:string[];note?:string};
export type Definition={id:string;question:string;options:Choice[]};
const opts=(rows:string[])=>rows.map(row=>{const [id,label,tags]=row.split('|');return {id,label,tags:tags.split(' ')}});
const yesNo=opts(['yes|是|active social change','no|否|quiet caution rest']);
const areas=opts(['downtown|Downtown|urban shopping work','north|North Vancouver|mountain nature adventure','coquitlam|Coquitlam|nature slow family','richmond|Richmond|food group culture','kitsilano|Kitsilano|beach water calm','other|其他已核實地區|travel independent creative']);
export const activities=opts(['walk|散步與探索|walk slow outdoor','beach|海邊|beach water calm','shopping|購物逛街|shopping urban comfort','photography|拍照|photography bright creative','exhibition|展覽|exhibition creative culture','museum|博物館|museum study quiet','skyline|城市景觀|skyline urban bright','boat|搭船|boat water travel','mountain|上山|mountain nature adventure','paragliding|滑翔傘|paragliding adventure active','fitness|運動健身|fitness active focus']);
const cuisines=opts(['korean|韓式|warm group food','western|西餐|comfort urban food','chinese|中餐|chinese group culture','french|法餐|pair creative comfort','fastfood|快餐|fast movement active','dessert|奶茶、零食、甜點|bakery slow comfort','hotpot|火鍋、燒烤|warm social group','other|其他菜系|water nature independent']);
export const definitions:Definition[]=[
 {id:'duration',question:'今天是多久的行程？',options:opts(['short|低於 2 小時|fast focus','half|半天 · 4–6 小時|slow calm','full|一整天 · 6–8 小時以上|active travel','overnight|通宵|dark movement'])},
 {id:'mealStyle',question:'第一頓飯怎麼吃？',options:opts(['home|家裡做／翻熱|home rest','takeaway|自己買／外賣|movement fast','regular|普通餐廳|food social','premium|高級餐廳|comfort pair'])},
 {id:'mealTime',question:'第一頓飯的開始時間？',options:opts(['early|10:00 前|bright active','brunch|10:00–12:00|slow calm','lunch|12:00–14:00|food work','afternoon|14:00–17:00|creative rest','dinner|17:00–21:00|dark social'])},
 {id:'mealCount',question:'行程內一共吃幾餐？',options:opts(['1|1 餐|focus independent','2|2 餐|pair calm','3|3 餐|food social','4|4 餐或以上（MVP 排 4 餐）|group comfort'])},
 {id:'firstMeal',question:'第一個行程是吃飯嗎？',options:yesNo},
 ...Array.from({length:6},(_,i)=>({id:`region${i+1}`,question:`第 ${i+1} 站的地區？`,options:areas})),
 {id:'dish',question:'第一頓飯的菜色風格？',options:opts(['fresh|清爽、清新、偏輕盈|water nature','warm|溫暖、飽足、熟悉感|warm home','crafted|講究層次與擺盤|creative focus','sharing|適合分享、種類較多|group social'])},
 {id:'cuisine',question:'第一頓飯的菜系？',options:cuisines},
 ...Array.from({length:6},(_,i)=>({id:`activity${i+1}`,question:`第 ${i+1} 站做什麼？`,options:activities})),
 ...Array.from({length:6},(_,i)=>({id:`confirm${i+1}`,question:`確認第 ${i+1} 站的首選活動？`,options:yesNo})),
 {id:'surprise',question:'保留驚喜盲盒嗎？',options:yesNo},
 {id:'gift',question:'安排驚喜禮物嗎？',options:yesNo},
 {id:'giftStyle',question:'禮物的象徵方向？',options:opts(['memory|一張照片或手寫紀念|photography creative','treat|小份甜點或飲品|food comfort','nature|與自然有關的小物|nature calm','practical|實用的小物件|work order'])},
 {id:'pace',question:'這一天的節奏？',options:opts(['slow|悠閒|slow rest','balanced|平衡|calm order','active|充實|active fast'])},
 {id:'transport',question:'站間交通優先方式？',options:opts(['WALK|步行|walk nature','TRANSIT|公共交通|transport travel'])},
 {id:'rest',question:'站間保留多少休息餘裕？',options:opts(['10|10 分鐘|active fast','20|20 分鐘|calm slow','30|30 分鐘|rest tired'])},
 {id:'rainBackup',question:'雨天改以室內活動為主嗎？',options:yesNo},
 {id:'photo',question:'加入拍照時間嗎？',options:yesNo},
 {id:'shopping',question:'安排逛街但不強制購物嗎？',options:yesNo},
 {id:'meal2Cuisine',question:'第二餐的菜系？',options:cuisines},
 {id:'meal3Cuisine',question:'第三餐的菜系？',options:cuisines},
 {id:'meal4Cuisine',question:'第四餐的菜系？',options:cuisines},
 {id:'finish',question:'最後一站的收尾氣氛？',options:opts(['quiet|安靜放鬆|quiet rest','view|看景與散步|skyline walk','social|熱鬧相聚|group social'])},
 {id:'giftBudget',question:'禮物預留金額？',options:opts(['0|不用花錢的心意|creative quiet','5|總預算的 5%|calm order','10|總預算的 10%|comfort social'])},
 {id:'comfort',question:'優先舒適還是新體驗？',options:opts(['comfort|熟悉舒適|home comfort','explore|新鮮探索|adventure travel'])},
];
export const byId=(ds:Decision[],id:string)=>ds.find(d=>d.id===id)!;
export function detailDecisions(cards:Card[],trip:Trip):Decision[]{const result=definitions.map((d,i)=>{const card=cards[i+1];const ranking=[...d.options].sort((a,b)=>b.tags.reduce((n,t)=>n+(card.tags[t]||0),0)-a.tags.reduce((n,t)=>n+(card.tags[t]||0),0)||d.options.indexOf(a)-d.options.indexOf(b)).map(o=>o.id);const preferred=ranking[0];let eligible=ranking;const span=trip.end-trip.start;if(d.id==='duration')eligible=ranking.filter(id=>id==='short'?span>=60:id==='half'?span>=240:id==='full'?span>=360:trip.end>1440&&span>=360);if(d.id==='mealCount')eligible=ranking.filter(id=>(Number(id)-1)*150+45<=span);if(d.id==='mealTime')eligible=ranking.filter(id=>mealWindows(id,trip).some(([a,b])=>Math.max(a,trip.start)+30<=Math.min(b,trip.end)));const selected=eligible[0]||preferred;return {id:d.id,question:d.question,card,preferred,selected,label:d.options.find(o=>o.id===selected)!.label,ranking,...(preferred!==selected?{note:'依你提供的可用時間選用同張牌的下一個可行選項。'}:{})};});const duration=result.find(d=>d.id==='duration')!;const available=trip.end-trip.start;const span=duration.selected==='short'?Math.min(110,available):duration.selected==='half'?Math.min(360,available):available;const effective={...trip,end:trip.start+span};const constrain=(id:string,predicate:(value:string)=>boolean)=>{const d=result.find(x=>x.id===id)!;const value=d.ranking.find(predicate);if(value&&value!==d.selected){d.selected=value;d.label=definitions.find(x=>x.id===id)!.options.find(x=>x.id===value)!.label;d.note='依同轮已锁定的行程时长与餐距，使用此牌的下一个可行选项。';}};constrain('mealCount',v=>(Number(v)-1)*150+50<=span);const meals=Number(result.find(d=>d.id==='mealCount')!.selected);constrain('mealTime',v=>mealWindows(v,effective).some(([a,b])=>Math.max(a,effective.start)+50<=Math.min(b,effective.end-(meals-1)*150)));if(span<120)constrain('firstMeal',v=>v==='yes');if(!/vancouver/i.test(trip.city))for(const d of result.filter(d=>d.id.startsWith('region')))d.label=({downtown:'城市中心',north:'山區或近郊',coquitlam:'綠地或住宅區',richmond:'餐飲或文化區',kitsilano:'海濱或水邊',other:'其他已核實地區'} as Record<string,string>)[d.selected];return result;}
export function mealWindows(id:string,trip:Trip):[number,number][]{const base:Record<string,[number,number]>={early:[0,600],brunch:[600,720],lunch:[720,840],afternoon:[840,1020],dinner:[1020,1260]};const w=base[id]||[0,1440];return [w,[w[0]+1440,w[1]+1440]].filter(([a,b])=>b>trip.start&&a<trip.end) as [number,number][];}
export function selected(ds:Decision[],id:string){return byId(ds,id).selected;}
