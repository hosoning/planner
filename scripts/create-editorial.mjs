import fs from 'node:fs';
const rows = `The Fool|Beginnings and open exploration|outdoor adventure movement bright independent walk|Hesitation at an unfamiliar threshold|caution quiet indoor rest
The Magician|Skill and purposeful action|work focus active creative urban fitness|Scattered attention and unrealised skill|distracted stress work indoor
The High Priestess|Stillness and private observation|quiet solitary indoor dark reflect museum|Noise obscuring intuition|social noise distracted urban
The Empress|Comfort and sensory abundance|food nature comfort social garden|Depletion and neglected comfort|tired hunger rest solitary
The Emperor|Structure and responsibility|work order urban focus standing|Rigidity and pressure|stress order work tense
The Hierophant|Tradition and shared learning|culture museum group study indoor|Questioning convention|independent adventure outdoor creative
The Lovers|Connection and shared choices|pair social food calm|Disconnection and indecision|solitary tense distracted
The Chariot|Directed movement|movement transport fast active urban|Interrupted progress|stationary stress tired indoor
Strength|Calm physical confidence|active fitness calm nature warm|Low reserves and self-doubt|tired rest tense quiet
The Hermit|Private reflection|solitary quiet indoor study dark|Isolation becoming withdrawal|solitary tired dark rest
Wheel of Fortune|Changing circumstances|movement change social fast|Repeated interruption|stationary stress distracted
Justice|Balance and considered judgement|order focus work calm indoor|Imbalance and unresolved tension|tense stress distracted work
The Hanged Man|A pause and different perspective|stationary rest reflect quiet skyline|Restlessness in suspension|movement tense distracted
Death|An ending followed by renewal|change independent movement outdoor|Resistance to transition|stationary indoor tense
Temperance|Moderation and steady flow|calm water food slow pair|Excess and uneven pacing|fast stress food noise
The Devil|Attachment and intense appetite|shopping food indoor noise urban|Release from habitual patterns|independent outdoor calm walk
The Tower|Sudden disruption|noise fast stress urban change|Aftershock and shelter|indoor rest tense quiet
The Star|Restoration and open horizons|nature water outdoor bright calm photography|Fading energy seeking renewal|tired solitary rest dark
The Moon|Ambiguity and nocturnal reflection|dark water quiet reflect beach|Clarity after uncertainty|bright focus calm stationary
The Sun|Vitality and visible joy|bright warm outdoor active social beach|Muted vitality needing rest|tired indoor calm rest
Judgement|Review and a call to act|focus change culture group active|Delayed response and self-questioning|reflect quiet stationary tense
The World|Integration and broad exploration|travel movement culture social skyline|Unfinished journeys|stationary work reflect indoor
Ace of Wands|A spark of initiative|active creative outdoor warm adventure|A stalled beginning|tired stationary rest
Two of Wands|Surveying possible routes|skyline focus travel solitary|Narrow horizons|indoor caution stationary
Three of Wands|Expansion beyond the familiar|water boat travel outdoor|Waiting for progress|stationary reflect quiet
Four of Wands|A welcoming shared space|home group food social bright|Uneasy domestic rhythm|home tense quiet
Five of Wands|Lively competing energies|group noise active fitness tense|Conflict winding down|quiet rest calm pair
Six of Wands|Visible achievement|social bright urban active|Recognition withheld|solitary work tense
Seven of Wands|Holding one's ground|standing active tense independent|Overextended defence|tired stress rest
Eight of Wands|Rapid movement and messages|fast movement transport communication|Delays and crossed messages|stationary distracted tense
Nine of Wands|Alert persistence|tired standing caution work|Fatigue after sustained effort|rest tired solitary
Ten of Wands|Carrying a heavy load|stress work tired standing|Putting burdens down|rest calm home
Page of Wands|Curious exploration|adventure outdoor creative photography|Curiosity without direction|distracted indoor stationary
Knight of Wands|Fast adventurous action|fast adventure mountain paragliding active|Impulsive movement losing momentum|tense caution tired
Queen of Wands|Warm independent confidence|warm social creative active|Withdrawing from visibility|solitary quiet indoor
King of Wands|Purposeful leadership|work group focus active|Overbearing urgency|stress fast tense
Ace of Cups|Emotional replenishment|water food calm pair|A need for private replenishment|solitary rest quiet
Two of Cups|A close exchange|pair communication social calm|A strained exchange|pair tense quiet
Three of Cups|Shared celebration|group food social noise|Social fatigue|solitary tired rest
Four of Cups|Disengagement and pause|stationary distracted rest indoor|Renewed curiosity|active outdoor creative
Five of Cups|Disappointment and reflection|solitary dark tired reflect|Turning toward recovery|calm water rest
Six of Cups|Familiar comforts|home comfort food pair|Leaving familiar routines|travel change independent
Seven of Cups|Many competing possibilities|distracted shopping creative indoor|Choosing a clear direction|focus order work
Eight of Cups|Departure toward solitude|walk movement solitary outdoor|Hesitation before leaving|stationary home tense
Nine of Cups|Contentment and pleasure|food comfort calm indoor|Satisfaction wearing thin|hunger distracted tired
Ten of Cups|Domestic harmony|home group social calm|Domestic friction|home tense noise
Page of Cups|Gentle imaginative attention|creative water photography calm|Emotional distraction|distracted solitary quiet
Knight of Cups|A reflective approach|water slow pair walk|Drifting without arrival|stationary reflect distracted
Queen of Cups|Attentive quiet care|quiet water calm pair|Emotional overload|stress tired solitary
King of Cups|Composure amid activity|calm water focus social|Suppressed strain|tense quiet indoor
Ace of Swords|A clear mental start|focus study bright independent|Mental fog|distracted tired dark
Two of Swords|Paused decision|stationary quiet reflect solitary|Pressure to decide|tense stress movement
Three of Swords|Painful separation|tense solitary dark tired|Gradual recovery|rest calm quiet
Four of Swords|Deliberate rest|rest sleep quiet indoor|Restlessness after inactivity|active movement distracted
Five of Swords|Contentious interaction|tense communication noise group|Stepping away from conflict|solitary quiet walk
Six of Swords|A quiet crossing|boat water travel slow|A delayed crossing|stationary tense water
Seven of Swords|Private strategic action|solitary work focus independent|Disclosure and accountability|communication group order
Eight of Swords|Restriction and hesitation|stationary tense indoor stress|Regaining room to move|movement independent outdoor
Nine of Swords|Wakeful worry|dark stress sleep tired|Relief after worry|rest calm bright
Ten of Swords|Exhaustion and closure|tired rest dark stationary|A slow restart|slow calm change
Page of Swords|Alert observation|study focus communication photography|Information overload|distracted noise stress
Knight of Swords|Urgent direct action|fast movement work active|Rushing into obstacles|tense stress stationary
Queen of Swords|Independent discernment|solitary focus study museum|Sharp judgement under strain|tense work quiet
King of Swords|Structured reasoning|order focus work culture|Inflexible thinking|stress order tense
Ace of Pentacles|A tangible opportunity|food shopping nature work|An opportunity needing preparation|caution work stationary
Two of Pentacles|Managing changing demands|movement work fast distracted|Too many demands|stress tired distracted
Three of Pentacles|Practical collaboration|work group study indoor|Coordination breaking down|work tense noise
Four of Pentacles|Protecting resources|home stationary order quiet|Loosening control|shopping movement social
Five of Pentacles|Material discomfort|cold tired outdoor hunger|Shelter and assistance|indoor warm rest
Six of Pentacles|Giving and receiving|pair social food shopping|Uneven exchange|tense work solitary
Seven of Pentacles|Patient evaluation|nature slow stationary reflect|Impatience with progress|fast tense work
Eight of Pentacles|Focused practice|work study focus indoor|Repetitive fatigue|tired work distracted
Nine of Pentacles|Independent comfort|nature solitary shopping calm|Comfort requiring maintenance|work caution indoor
Ten of Pentacles|Established shared security|home group culture food|Unsettled shared routines|home stress change
Page of Pentacles|Practical learning|study nature focus museum|Difficulty sustaining attention|distracted stationary indoor
Knight of Pentacles|Steady physical progress|slow work walk nature|Routine becoming inertia|stationary tired home
Queen of Pentacles|Grounded care and comfort|food nature warm home|Care draining reserves|tired stress home
King of Pentacles|Material steadiness|order shopping food urban|Overattachment to comfort|indoor stationary caution`;
const weights=s=>Object.fromEntries(s.split(' ').map((t,i)=>[t,Math.max(1,5-i)]));
const cards=rows.split('\n').map((s,i)=>{let [name,u,ut,r,rt]=s.split('|');return {id:i,name,arcana:i<22?'major':'minor',suit:i<22?null:['Wands','Cups','Swords','Pentacles'][Math.floor((i-22)/14)],upright:{meaning:u,tags:weights(ut)},reversed:{meaning:r,tags:weights(rt)}}});
for(const c of cards)for(const o of ['upright','reversed']){const t=c[o].tags;for(const [cuisine,base] of Object.entries({seafood:'water',vegetarian:'nature',bakery:'comfort',japanese:'focus',chinese:'group',mediterranean:'calm'}))if(t[base])t[cuisine]=t[base];}
const qrows=`你現在主要在哪一類場所？|家中或私人住宿:home quiet|工作或學習場所:work study|室內公共場所:urban shopping indoor|戶外且不在交通工具內:outdoor nature|交通工具內:transport movement
你現在所在位置有屋頂遮蔽嗎？|室內完整遮蔽:indoor home|有頂的半戶外:stationary caution|露天:outdoor bright
你現在十米內可見多少其他人？|0 人:solitary quiet|1 人:pair communication|2–5 人:group social|6 人或以上:noise urban
此刻最明顯的環境聲是哪類？|近乎安靜:quiet solitary|人聲:communication group|音樂或節目聲:creative social|機械或交通聲:transport noise|自然聲:water nature
你現在是否正在位移？|停留同一位置:stationary rest|徒步移動:walk active|乘坐交通工具:transport travel
此刻主要照明來源是？|日光:bright outdoor|人工燈光:indoor work|螢幕或微弱光源:dark study|幾乎無光:dark sleep
你現在主要的身體姿勢是？|坐著:stationary work|站著:standing active|躺著:rest sleep|正在步行或運動:movement fitness
你所在房間的窗戶情況是？|看得見窗外:bright skyline|有窗但窗簾遮住:indoor quiet|沒有窗或看不見窗:dark indoor|我不在房間內:outdoor movement
你現在的溫度感受是？|偏冷:cold caution|舒適:calm comfort|偏熱:warm active
你現在是否聽到別人直接跟你說話？|正在跟我說話:communication pair|有人說話但不是對我:group noise|沒有人聲:quiet solitary
你現在的工作台面最接近？|沒有在使用台面:outdoor movement|大致空置:order quiet|放有食物飲品:food comfort|主要是工作學習用品:work study|主要是其他雜物:distracted shopping
你現在是否能看見植物？|近距離室內植物:home nature|戶外樹木或植物:nature outdoor|只能看見圖片中的植物:creative indoor|看不見植物:urban work
你現在是否能看見自然水面？|能，海或湖:water beach|能，河或溪:water walk|不能:indoor urban
你此刻附近是否有食物？|正拿著或吃著:food active|看得到但沒在吃:food stationary|看不到:hunger solitary
你此刻是否戴耳機？|戴著且播放內容:creative focus|戴著但沒播放:quiet independent|沒有戴:communication social
你目前的精神狀態最接近？|清醒有精神:active bright|平穩，能正常做事:calm focus|疲倦但不想睡:tired work|明顯想睡:sleep rest
你此刻最明顯的情緒是？|愉快或期待:bright social|平靜或普通:calm stationary|焦躁或緊張:tense stress|低落或失望:dark solitary
你現在身體的疲勞程度是？|沒有明顯疲勞:active fitness|輕微，不妨礙行動:slow work|明顯，想休息:tired rest
你剛才五分鐘的注意力是？|專注一件事:focus study|在幾件事之間切換:distracted work|發呆或休息:rest reflect
你此刻的飢餓感是？|明顯餓:hunger active|有點餓但不急:food slow|不餓也不飽:calm stationary|剛吃飽:food comfort
你此刻的口渴感是？|明顯口渴:warm active|輕微口渴:water slow|沒有口渴:calm comfort
你現在是否有待處理的緊急事情？|一小時內必須處理:fast stress|今天要處理但不緊急:work order|沒有:rest calm
你現在衣著最接近哪類？|睡衣或家居服:home rest|工作或學校制服:work order|運動服:fitness active|其他外出服:urban social
你此刻的雙腳狀態是？|赤腳:home comfort|襪子但沒有鞋:indoor rest|拖鞋:home slow|其他鞋類:walk movement
你此刻正在喝什麼？|水:water calm|咖啡或茶:focus work|其他飲品:food social|沒有在喝:hunger stationary
打開本頁前，最近的主要活動是？|工作或學習:work study|用餐:food comfort|休息或睡眠:rest sleep|外出移動:movement travel|娛樂或聊天:creative communication
你此刻是否同時在看另一個螢幕？|有，工作學習用途:work focus|有，娛樂用途:creative distracted|沒有:quiet independent
你現在是否正在等待某件事？|等人或回覆:pair communication|等交通或到達:transport travel|等工作或服務完成:work stationary|沒有在等:active independent
你現在手邊是否有紙本？|書籍或講義:study culture|筆記或工作文件:work order|收據包裝等其他紙本:shopping food|沒有:outdoor independent
你現在主要使用哪種裝置？|手機:movement communication|平板:creative study|電腦:work focus
最近一小時你有沒有離開建築物？|有，到過戶外:outdoor movement|沒有，一直在室內:indoor stationary|一直主要在戶外:outdoor nature
最近兩小時你有吃過一餐嗎？|有，完整一餐:food comfort|只有零食:food distracted|沒有:hunger focus
最近一小時你有喝水嗎？|有:water calm|沒有:work focus
最近兩小時你是否與人面對面交談超過五分鐘？|有，一對一:pair communication|有，多人交談:group social|沒有:solitary quiet
最近兩小時你是否搭過交通工具？|公共交通:transport group|汽車或的士:travel urban|單車或類似工具:fitness movement|沒有:stationary home
最近兩小時你是否付過款？|買食物或飲料:food shopping|交通費:transport travel|其他消費:shopping urban|沒有:quiet stationary
最近一小時你是否走路至少十分鐘？|有:walk active|沒有:stationary rest
最近三小時你是否工作或學習至少半小時？|有:work study|沒有:rest creative
最近三小時你是否睡過覺？|有，至少二十分鐘:sleep rest|只是短暫打盹:tired slow|沒有:active focus
最近一小時你是否聽過音樂？|有，主動播放:creative independent|有，環境背景音樂:noise social|沒有:quiet work
最近兩小時你是否拍過照片？|有，人物:pair photography|有，景物或物件:photography nature|沒有:stationary work
最近兩小時你是否運動到明顯喘氣？|有:fitness active|沒有:rest slow
最近一小時你是否接打過電話或語音通話？|有，工作相關:work communication|有，私人通話:pair social|沒有:quiet solitary
最近兩小時你是否看過影片超過十分鐘？|有，工作學習影片:study focus|有，娛樂影片:creative rest|沒有:active outdoor
最近三小時你主要在哪一處？|家中或住宿:home comfort|工作或學校:work study|其他室內場所:indoor social|戶外或交通途中:outdoor travel
最近兩小時你是否整理或清潔過物品？|有:order home|沒有:distracted creative
最近一小時你收到的主要訊息是哪類？|工作或學習:work communication|親友私人訊息:pair social|推廣或系統通知:shopping noise|沒有收到:quiet solitary
最近兩小時你是否換過衣服？|有，準備外出或運動:movement fitness|有，準備休息:home rest|沒有:stationary work
最近一小時你是否與動物互動？|有，寵物:home nature|有，其他動物:outdoor nature|沒有:urban work
最近兩小時你的行程有沒有臨時改變？|有，被迫改變:change stress|有，主動改變:change independent|沒有:order calm`;
const questions=qrows.split('\n').map((row,i)=>{const [text,...opts]=row.split('|');const options=opts.map((x,j)=>{const [label,tags]=x.split(':');return {id:String(j),label,prototype:weights(tags)}});const mapping={};for(const c of cards)for(const o of ['upright','reversed']){const scores=options.map(x=>Object.entries(x.prototype).reduce((s,[t,w])=>s+w*(c[o].tags[t]||0),0));const winner=scores.indexOf(Math.max(...scores));mapping[`${c.id}:${o}`]={option:String(winner),scores};}return {id:`q${String(i+1).padStart(2,'0')}`,text,category:i<15?'環境':i<25?'當下狀態':i<30?'當下活動':'近期事實',options,mapping};});
if(cards.length!==78||questions.length!==50)throw Error(`${cards.length}/${questions.length}`);
fs.mkdirSync('data',{recursive:true});fs.writeFileSync('data/ontology.json',JSON.stringify(cards,null,2));fs.writeFileSync('data/questions.json',JSON.stringify(questions,null,2));
fs.writeFileSync('EDITORIAL.md','# Editorial data audit\n\n78 cards, 156 independently authored meanings; 50 questions, 7,800 complete card/orientation mappings. Symbolic design, not validated predictions.\n\n'+questions.map(q=>`## ${q.id} ${q.text}\n\n${q.options.map(o=>`- ${o.id}: ${o.label} (${Object.keys(o.prototype).join(', ')})`).join('\n')}`).join('\n\n'));
console.log({cards:cards.length,questions:questions.length,mappings:questions.length*156});
