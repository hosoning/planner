import index from '../../data/discovery-city.json';
import {tagScore,type Snapshot} from './core';
import {byId,selected,activities} from './spread';
import type {POI} from './planner';
export type SearchCandidate={id:string;name:string;address:string;source:string;status:'confirmed'|'declined'|'unverified';reason:string;cardNames?:string[]};
export type SearchStage={stage:number;region:string;direction:string;keywords:string[];query:string;expanded:boolean;candidates:SearchCandidate[]};
export type SearchReport={source:string;checkedAt:string;indexed:number;coverage:string;stages:SearchStage[]};
const source=index.source;
const point={lat:49.2827,lng:-123.1207};
const areas:Record<string,string>={downtown:'Downtown / West End',north:'North Vancouver',coquitlam:'Coquitlam',richmond:'Richmond',kitsilano:'Kitsilano',other:'Vancouver 其他地区'};
const activityKeywords:Record<string,string>={walk:'park walk',beach:'beach waterfront',shopping:'shopping mall',photography:'viewpoint photography',exhibition:'exhibition gallery',museum:'museum',skyline:'viewpoint skyline',boat:'boat tour',mountain:'mountain trail',paragliding:'paragliding',fitness:'fitness sports',cinema:'cinema movie'};
const cuisineKeywords:Record<string,string>={korean:'korean',western:'western italian',chinese:'chinese',french:'french',fastfood:'fast food',dessert:'cafe bakery dessert',hotpot:'hotpot barbecue',other:'restaurant'};
function regionFor(area:string){if(/Downtown|West End/i.test(area))return 'downtown';if(/Kitsilano/i.test(area))return 'kitsilano';return 'other';}
function tagsFor(category:string,name:string){const text=(category+' '+name).toLowerCase(),tags:Record<string,number>={urban:2};if(/restaurant|food establishment|food market/.test(text))tags.food=3;if(/fitness|sports/.test(text)){tags.fitness=3;tags.active=2;}if(/theatre|cinema/.test(text)){tags.cinema=3;tags.culture=2;}if(/exhibition/.test(text)){tags.exhibition=3;tags.creative=2;}for(const [tag,re] of Object.entries({korean:/korea|korean|bibimbap/,chinese:/chinese|dim sum|dumpling/,western:/italian|pizza|pasta|bistro/,french:/french|brasserie/,fastfood:/burger|sandwich|subway|mcdonald/,dessert:/cafe|coffee|bakery|dessert|bubble tea/,hotpot:/hot ?pot|barbecue|bbq/}))if(re.test(text))tags[tag]=3;return tags;}
export function searchAndConfirm(s:Snapshot,pois:POI[],options:{center?:{lat:number;lng:number};coverage?:string;source?:string}={}):{pois:POI[];report:SearchReport}{
 const ds=s.decisions!,known=[...new Map(pois.map(p=>[p.venueId||p.id,p])).values()];
 const origin=options.center||point;
 const indexed=(options.center?[]:index.records.filter(r=>r.expires>=s.trip.date)).map(r=>({...r,region:regionFor(r.area||''),tags:tagsFor(r.category,r.name),meal:/Restaurant|Food Establishment|Food Market/.test(r.category),source,known:false,verified:false}));
 const merged=[...indexed,...known.map(p=>({id:p.venueId||p.id,name:p.name,address:p.address,area:p.area,lat:p.lat,lng:p.lng,region:p.region||'other',tags:p.tags,meal:p.meal,source:p.source,known:true,verified:p.verified}))];
 const stages:SearchStage[]=[],allowed=new Map<string,number[]>();
 for(let i=0;i<6;i++){
  const region=selected(ds,`region${i+1}`),direction=selected(ds,`direction${i+1}`),activity=byId(ds,`activity${i+1}`),cuisine=byId(ds,i===0?'cuisine':`meal${Math.min(4,i+1)}Cuisine`);
  const key=activity.ranking[selected(ds,`confirm${i+1}`)==='yes'?0:1];const keywords=[activityKeywords[key]||key,cuisineKeywords[cuisine.selected]||'restaurant'];
  const rank=(p:typeof merged[number])=>(p.region===region?80:0)+(bearingFrom(p.lat,p.lng,origin)===direction?24:0)+tagScore(p.tags,p.meal?cuisine.card:activity.card)+(p.meal?(p.tags[cuisine.selected]||0):(p.tags[key]||0))*12;
  const ranked=merged.filter(p=>(p.tags.food||p.tags[key]||p.tags.culture)).sort((a,b)=>rank(b)-rank(a)||a.id.localeCompare(b.id));
  // Public search is independent of executable-data coverage. Unknown facts are never inferred from the cards.
  const primary=ranked.filter(p=>(p.region===region||options.center)&&(direction==='any'||bearingFrom(p.lat,p.lng,origin)===direction)).slice(0,5);
  const primaryKnown=primary.filter(p=>p.known);const expanded=primaryKnown.length<2;
  const verified=(expanded?ranked.filter(p=>p.known):primaryKnown).slice(0,5);
  const candidates:SearchCandidate[]=[];
  const check=(p:typeof merged[number],j:number)=>{const decision=byId(ds,`shortlist${i+1}Candidate${j+1}`),yes=decision.selected==='yes';
   candidates.push({id:p.id,name:p.name,address:p.address,source:p.source,status:!yes?'declined':p.known&&p.verified?'confirmed':'unverified',
    reason:!yes?'确认牌未通过，此站不采用。':p.known&&p.verified?'确认牌通过，仍须通过营业时间、预算、天气与路线检查。':'确认牌通过，但公开地图资料不足以核实营业状态、当天营业时间、价格或预订条件，不进入正式行程。',
    cardNames:decision.cards.map(c=>`${c.name} ${c.orientation==='upright'?'正位':'逆位'}`)});
   if(yes&&p.known&&p.verified)allowed.set(p.id,[...(allowed.get(p.id)||[]),i]);
  };
  primary.forEach((p,j)=>check(p,j));
  if(expanded)verified.filter(p=>!primary.some(x=>x.id===p.id)).forEach((p,j)=>check(p,j+5));
  if(!options.center&&!candidates.some(c=>c.status==='unverified')){const unverified=ranked.find(p=>!p.known);if(unverified)check(unverified,5);}
  stages.push({stage:i+1,region:areas[region],direction:byId(ds,`direction${i+1}`).label,keywords,query:`${s.trip.city} ${areas[region]} ${keywords.join(' / ')}`,expanded,candidates});
 }
 return {pois:pois.filter(p=>allowed.has(p.venueId||p.id)).map(p=>({...p,eligibleStages:allowed.get(p.venueId||p.id)})),report:{source:options.source||source,checkedAt:new Date().toISOString(),indexed:options.center?known.length:indexed.length,coverage:options.coverage||'温哥华市公开营业地点索引；不等于全部商户，暂不覆盖 North Vancouver、Richmond 或 Coquitlam 的完整目录。',stages}};
}
function bearingFrom(lat:number,lng:number,center:{lat:number;lng:number}){const y=lat-center.lat,x=(lng-center.lng)*Math.cos(center.lat*Math.PI/180);if(Math.hypot(x,y)<.014)return 'central';return Math.abs(y)>Math.abs(x)?y>0?'north':'south':x>0?'east':'west';}
