import {searchAndConfirm,type SearchReport} from './discovery';
import routes from '../../data/verified-routes.json';
import forecast from '../../data/verified-weather.json';
import type {Trip,Snapshot} from './core';
import type {POI,Provider,Route,Weather} from './planner';
import {byId,blend} from './spread';
export const OPEN_DATA_UNTIL='2026-10-14';
const base={region:'downtown',area:'Downtown Vancouver',setting:'urban' as const,currency:'CAD',operational:true,verified:true,outdoor:false,meal:false};
const noBooking={required:false,status:'not_required' as const,depositKind:'none' as const,deposit:0,paid:true};
const foods=[{dish:'Two Egg Veg',price:1150,start:480,end:660,tags:{nature:3,comfort:2}},{dish:'Bacon Slab',price:1150,start:480,end:660,tags:{warm:3,food:2}},{dish:'Grilled Cheese',price:1200,start:660,end:1200,tags:{warm:3,comfort:3}},{dish:'Buffalo Chicken',price:1450,start:660,end:1200,tags:{active:3,food:3}}];
export const venues=[
 {id:'library',name:'Vancouver Public Library · Central',address:'350 West Georgia Street, Vancouver, BC V6B 6B1',lat:49.279659,lng:-123.115614,source:'https://www.vpl.ca/branches/central',meal:false,tags:{study:3,quiet:3,culture:3,exhibition:1,creative:1},duration:60,cost:0,hours:[[570,1230]] as [number,number][],guard:['350 west georgia','9:30 am','8:30 pm'],foods:[]},
 {id:'nook',name:'Nook · Coal Harbour',address:'1155 Melville Street, Vancouver, BC V6E 4C4',lat:49.2873809,lng:-123.1231616,source:'https://nookrestaurants.com/coal-harbour/',menuSource:'https://order.toasttab.com/online/nook-restaurant-the-stacks-new-1133-melville-street',bookingUrl:'https://order.toasttab.com/online/nook-restaurant-the-stacks-new-1133-melville-street',meal:true,mealStyle:'takeaway',cuisine:'意式',tags:{food:3,western:3,warm:3,pair:2,comfort:2},duration:60,hours:[[690,1320]] as [number,number][],guard:['1155 melville','11:30 am','10:30 pm'],foods:[{dish:'Margherita Pizza',price:2500,start:690,end:1320,tags:{comfort:3,nature:2}},{dish:'Spaghetti Bolognese',price:2800,start:690,end:1320,tags:{warm:3,food:3}}]},
 {id:'mb-robson',name:'Meat & Bread · Robson',address:'625 Robson Street, Vancouver, BC',lat:49.2810223,lng:-123.118995,source:'https://www.meatandbread.com/robson',bookingUrl:'https://order.toasttab.com/online/meat-bread-robson-625-robson-st',meal:true,mealStyle:'takeaway',cuisine:'三文治',tags:{food:3,fastfood:3,western:2,warm:2},duration:45,hours:[[480,1200]] as [number,number][],guard:['625 robson','8am','8pm'],foods},
 {id:'mb-cambie',name:'Meat & Bread · Cambie',address:'370 Cambie Street, Vancouver, BC',lat:49.282623,lng:-123.109344,source:'https://www.meatandbread.com/cambie',bookingUrl:'https://order.toasttab.com/online/meat-bread-cambie-370-cambie-st',meal:true,mealStyle:'takeaway',cuisine:'三文治',tags:{food:3,fastfood:3,western:2,urban:2},duration:45,hours:[[480,960]] as [number,number][],guard:['370 cambie','8am','4pm'],foods},
 {id:'miku',name:'Miku Vancouver',address:'70–200 Granville Street, Vancouver, BC V6C 1S4（Howe Street 入口）',lat:49.2870647,lng:-123.112828,source:'https://mikurestaurant.com/contact/',menuSource:'https://mikurestaurant.com/menu/',bookingUrl:'https://www.opentable.ca/r/miku-restaurant-vancouver',meal:true,mealStyle:'premium',cuisine:'日式',tags:{food:3,water:3,pair:2,creative:2},duration:75,hours:[[720,1320]] as [number,number][],guard:['200 granville','10 pm'],foods:[{dish:'Salmon Oshi Sushi',price:2300,start:720,end:1320,tags:{water:3,crafted:2}},{dish:'Miku Roll',price:2500,start:720,end:1320,tags:{food:3,creative:3}},{dish:'Tofu Salad',price:2100,start:720,end:1320,tags:{nature:3,calm:2}}]},
 {id:'vag',name:'Vancouver Art Gallery',address:'750 Hornby Street, Vancouver, BC V6Z 2H7',lat:49.2828495,lng:-123.1206248,source:'https://www.vanartgallery.bc.ca/visit/',bookingUrl:'https://tickets.vanartgallery.bc.ca/',meal:false,tags:{museum:3,exhibition:3,creative:3,culture:3},duration:90,cost:4000,hours:[[600,1020]] as [number,number][],guard:['750 hornby','closed on tuesdays','$35'],foods:[]},
 {id:'harbour-green',name:'Harbour Green Park',address:'1199 W Cordova Street, Vancouver, BC',lat:49.2901767,lng:-123.1218611,source:'https://covapp.vancouver.ca/ParkFinder/FindFacilityType.aspx?InFT=41',meal:false,outdoor:true,tags:{walk:3,photography:3,water:3,skyline:2,nature:2},duration:45,cost:0,hours:[[540,1080]] as [number,number][],guard:['harbour green','1199'],foods:[]},
];
export type DataAccess={get:(key:string)=>Promise<string|null>;put:(key:string,value:string,ttl:number)=>Promise<void>;limit:(service:string)=>Promise<void>};
export function openProvider(access:DataAccess,transport:typeof fetch=fetch):Provider {
 let weatherData:Weather[]|null=null;let search:SearchReport|undefined;let candidates:POI[]|undefined;
 return {walkingOnly:true,searchReport:()=>search,async candidates(s){if(candidates)return candidates;
  const t=s.trip;if(t.city.toLowerCase()!=='vancouver'||t.currency!=='CAD'){
   const key=`osm:${t.city.toLowerCase()}:v1`;let found:POI[]=[];let center:{lat:number;lng:number}|undefined;
   const cached=await access.get(key);if(cached){try{const saved=JSON.parse(cached) as {center:{lat:number;lng:number};pois:POI[]};center=saved.center;found=saved.pois;}catch{}}
   if(!center){
    await access.limit('geocoding-api.open-meteo.com');const geo=await transport(`https://geocoding-api.open-meteo.com/v1/search?${new URLSearchParams({name:t.city,count:'1',language:/[\u3400-\u9fff]/.test(t.city)?'zh':'en',format:'json'})}`,{signal:AbortSignal.timeout(7000)});
    if(!geo.ok)throw Error('城市搜索服务暂时不可用；请稍后重试。');const g=await geo.json() as {results?:{latitude:number;longitude:number;name:string;country:string;country_code:string}[]};const place=g.results?.[0];if(!place)throw Error('没有找到这个城市，请补充省份或国家／地区名称。');center={lat:place.latitude,lng:place.longitude};
    await access.limit('overpass-api.de');const query=`[out:json][timeout:20];(node(around:12000,${center.lat},${center.lng})[name][amenity~"^(restaurant|cafe|cinema|theatre|arts_centre|library|museum|marketplace|bar|pub)$"];way(around:12000,${center.lat},${center.lng})[name][amenity~"^(restaurant|cafe|cinema|theatre|arts_centre|library|museum|marketplace|bar|pub)$"];relation(around:12000,${center.lat},${center.lng})[name][amenity~"^(restaurant|cafe|cinema|theatre|arts_centre|library|museum|marketplace|bar|pub)$"];node(around:12000,${center.lat},${center.lng})[name][tourism~"^(museum|gallery|attraction|viewpoint)$"];way(around:12000,${center.lat},${center.lng})[name][tourism~"^(museum|gallery|attraction|viewpoint)$"];node(around:12000,${center.lat},${center.lng})[name][leisure~"^(park|garden|fitness_centre|sports_centre)$"];way(around:12000,${center.lat},${center.lng})[name][leisure~"^(park|garden|fitness_centre|sports_centre)$"];);out center tags 120;`;
    const response=await transport('https://overpass-api.de/api/interpreter',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'},body:new URLSearchParams({data:query}),signal:AbortSignal.timeout(25000)});if(!response.ok)throw Error('公开地点目录繁忙，请稍后重试。');const data=await response.json() as {elements?:{type:string;id:number;lat?:number;lon?:number;center?:{lat:number;lon:number};tags?:Record<string,string>}[]};
    const category=(tags:Record<string,string>)=>tags.amenity||tags.tourism||tags.leisure||tags.shop||'place';const classify=(tags:Record<string,string>)=>{const c=category(tags),name=tags.name||'',text=(c+' '+name).toLowerCase();const meal=/restaurant|cafe|bar|pub/.test(c);const tagsOut:Record<string,number>={urban:1};if(meal)tagsOut.food=3;if(/museum|gallery|theatre|arts_centre|cinema/.test(text)){tagsOut.culture=3;tagsOut.exhibition=2;}if(/park|garden|viewpoint|attraction/.test(text)){tagsOut.walk=2;tagsOut.nature=2;}if(/fitness|sports/.test(text)){tagsOut.fitness=3;tagsOut.active=2;}if(/cinema/.test(text))tagsOut.cinema=3;return {meal,tags:tagsOut};};
    found=(data.elements||[]).flatMap((el)=>{const tags=el.tags||{},name=tags.name;if(!name)return [];const lat=el.lat??el.center?.lat,lng=el.lon??el.center?.lon;if(!Number.isFinite(lat)||!Number.isFinite(lng))return [];const addr=[tags['addr:housenumber'],tags['addr:street'],tags['addr:district'],tags['addr:city']].filter(Boolean).join(' ');const {meal,tags:poiTags}=classify(tags);const id=`osm:${el.type}:${el.id}`;return [{id,venueId:id,name,address:addr||'地图未标注完整地址',area:tags['addr:district']||tags['addr:suburb']||place.name,region:'other',setting:'urban' as const,lat:lat!,lng:lng!,tags:poiTags,currency:t.currency,cost:0,duration:meal?60:75,hours:[],operational:false,verified:false,outdoor:/park|garden|viewpoint/.test(category(tags)),meal,source:`https://www.openstreetmap.org/${el.type}/${el.id}`,sourceNote:'公开地图候选；尚未核实商户营业状态、营业时间、实际价格或预订条件，不会排入可执行行程。',booking:{required:false,status:'not_required' as const,depositKind:'unknown' as const,deposit:0},attributions:[{provider:'OpenStreetMap contributors',providerUri:'https://www.openstreetmap.org/copyright'}]}];});await access.put(key,JSON.stringify({center,pois:found}),21600000);
   }
   if(!center)throw Error('无法定位城市中心。');const result=searchAndConfirm(s,found,{center,source:'https://www.openstreetmap.org/',coverage:`${t.city} 周边约 12 公里的 OpenStreetMap 公开地点候选（不代表全量商户）。地图标签未证明营业、价格或可预约；这些候选只用于牌面 shortlist，未能核实的项目不会进入行程。`});search=result.report;candidates=result.pois;return candidates;
  }
  if(t.date>OPEN_DATA_UNTIL)throw Error('请选择 10 月 14 日或以前；之后的营业资料尚未核实。');
  if(t.date==='2026-10-12')throw Error('10 月 12 日是假日，商户假日营业时间尚未确认，请换一天。');
  const out:POI[]=[];const dow=new Date(t.date+'T12:00:00Z').getUTCDay();
  for(const v of venues){if(['miku','harbour-green'].includes(v.id))continue;
   let hours=v.hours.map(x=>[...x] as [number,number]);
   if(v.id==='library'){if(dow===0)hours=[[660,1080]];else if(dow===6)hours=[[600,1080]];else if(dow===5)hours=[[570,1080]];}
   if(v.id==='vag'){if(dow===2)continue;if(dow===5)hours=[[600,1200]];}
   for(const dish of (v.meal?v.foods:[null])){
    const cost=dish?Math.ceil(dish.price*1.35/100)*100:v.cost||0;
    out.push({...base,...v,id:v.id+(dish?':'+dish.dish:''),venueId:v.id,
     sourceNote:'官方营业与菜单资料核实于 2026-10-07；适用至 10 月 14 日。临时变更及订位名额以商户为准。',
     tags:v.tags as unknown as Record<string,number>,hours:dish?hours.map(([a,b])=>[Math.max(a,dish.start),Math.min(b,dish.end)] as [number,number]):hours,cost,
     booking:{...noBooking,url:v.bookingUrl,...(v.id==='vag'?{required:true,status:'unbooked' as const,depositKind:'included' as const,deposit:cost,deadline:t.date+'（出发前）',terms:'请于官方售票页核对入场时段、实际票价与取消规则；付款由你处理。'}:{})},
     menu:dish?{dish:dish.dish,source:v.menuSource||v.source,validUntil:OPEN_DATA_UNTIL}:undefined,
     attributions:[{provider:'OpenStreetMap contributors',providerUri:'https://www.openstreetmap.org/copyright'}]});
   }
  }const result=searchAndConfirm(s,out);search=result.report;candidates=result.pois;return candidates;
 },
 async weather(_p,t){
  if(weatherData)return weatherData;
  let d:typeof forecast=forecast;
  const cached=await access.get('weather:vancouver:v4');
  if(cached){try{d=JSON.parse(cached);}catch{}}
  else try{await access.limit('api.open-meteo.com');const r=await transport(forecast.source,{signal:AbortSignal.timeout(3500)});if(!r.ok)throw Error('weather '+r.status);const fresh=await r.json() as typeof forecast;if(!fresh.hourly?.time?.length)throw Error('weather schema');d={...fresh,checkedAt:new Date().toISOString(),source:forecast.source};await access.put('weather:vancouver:v4',JSON.stringify(d),1800000);}catch{console.warn('weather_live_unavailable_using_dated_forecast');}
  // Forecast fallback expires after 24 hours; missing weather never passes a weather constraint.
  if(Date.now()-Date.parse(d.checkedAt)>86400000)throw Error('天气预报需要更新，暂时无法核实步行条件。已保留这轮牌。');
  weatherData=d.hourly.time.flatMap((date,i)=>{const day=(Date.parse(date.slice(0,10))-Date.parse(t.date))/86400000;if(day<0||day>1)return [];const start=day*1440+Number(date.slice(11,13))*60;const rain=d.hourly.precipitation_probability[i],wind=d.hourly.wind_speed_10m[i],code=d.hourly.weather_code[i];return Number.isFinite(rain)&&Number.isFinite(wind)&&Number.isFinite(code)?[{start,end:start+60,rain,wind,severe:code>=65,checkedAt:d.checkedAt}]:[];});return weatherData;
 },
 async route(a,b,_departure,t,mode):Promise<Route|null>{
  if(mode!=='WALK'||t.date>routes.validUntil)return null;
  const i=routes.ids.indexOf(a.venueId||a.id),j=routes.ids.indexOf(b.venueId||b.id);const seconds=routes.durations[i]?.[j];
  if(typeof seconds!=='number'||!Number.isFinite(seconds)||seconds<0)return null;
  return {minutes:Math.ceil(seconds/60),cost:0,currency:t.currency,mode:'WALK',source:'https://routing.openstreetmap.de/about.html',persistable:true,directionsUrl:`https://www.openstreetmap.org/directions?engine=fossgis_osrm_foot&route=${a.lat},${a.lng};${b.lat},${b.lng}`,instructions:'真实步行路网，2026-10-07 核实；出发前可打开地图复查。'};
 }};
}
