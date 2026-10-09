import {events,people,axes,presets,groups,contentVersion,scoringVersion,appVersion} from './content.js';
import {analyze,validAnswers,reportText,blankAnswers,restoreGame,serializeGame} from './engine.js';
import {modelRequest,endpointFor} from './byok.js';
import {chapterQuotes} from './quotes.js';
import {setupPointer} from './pointer.js';
import {makePNG,makeSVG} from './share-card.js';
const $=s=>document.querySelector(s);
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const arrow='<span aria-hidden="true">↗</span>';
const fresh=blankAnswers;
const localMode=['127.0.0.1','localhost','[::1]'].includes(location.hostname)&&location.pathname==='/';
let peopleFilter='全部',peopleQuery='',experimentIndex=0,experimentChoice=null;
const read=(store,key,fallback)=>{try{return JSON.parse(store.getItem(key))??fallback;}catch{return fallback;}};
const write=(store,key,value)=>{try{store.setItem(key,JSON.stringify(value));}catch{/* Storage may be disabled; the game still works in memory. */}};
const restored=restoreGame(read(sessionStorage,'zhaojian-game-v2',null),read(sessionStorage,'zhaojian-game-v1',null));
let answers=restored.answers,index=restored.index;
let view='home',ai=null,aiError='',aiBusy=false,aiController=null,connectionController=null,toastTimer,observer;
const savedConfig=read(localStorage,'zhaojian-provider-v1',{});
let config={provider:savedConfig.provider in presets?savedConfig.provider:'deepseek',baseUrl:savedConfig.baseUrl||presets.deepseek.baseUrl,model:savedConfig.model||presets.deepseek.model,transport:localMode?(savedConfig.transport||'proxy'):'direct'};
let apiKey='';
const main=$('#main');
function persist(){write(sessionStorage,'zhaojian-game-v2',serializeGame(answers,index));}
function announce(message){clearTimeout(toastTimer);$('#toast').textContent=message;$('#toast').classList.add('visible');toastTimer=setTimeout(()=>$('#toast').classList.remove('visible'),3000);}
function updateConnection(){const active=!!apiKey;$('.connection-dot').classList.toggle('connected',active);$('#connection-label').textContent=active?'AI 已配置 · 设置':'自带密钥 · AI 解读';}
function quoteMarkup(p,variant='full'){
  const q=p.quote;
  if(variant==='compact')return `<div class="card-quote"><span>「${escape(q.text)}」</span><small>${escape(q.kind)} · ${escape(q.author)}</small></div>`;
  return `<figure class="life-quote ${variant==='chapter'?'chapter-quote':''}"><span class="quote-label">${variant==='chapter'?'此关题句 · '+p.name:'一生题句'} <span>／ ${escape(q.kind)}</span></span><blockquote>「${escape(q.text)}」</blockquote><figcaption><span>${escape(q.author)}</span><a href="${escape(q.url)}" target="_blank" rel="noopener noreferrer">${escape(q.work)} ↗</a></figcaption>${variant==='context'?`<p class="quote-context">${escape(q.context)}</p>`:''}</figure>`;
}
function chapterQuote(event){const p=people.find(p=>p.id===chapterQuotes[event.id]);return quoteMarkup(p,'chapter');}
function mountAnimations(){
  observer?.disconnect();
  if('IntersectionObserver' in window){observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:.07});main.querySelectorAll('.reveal').forEach(el=>observer.observe(el));}
  else main.querySelectorAll('.reveal').forEach(el=>el.classList.add('visible'));
  main.querySelectorAll('.event-card,.option-card').forEach(card=>card.addEventListener('pointermove',event=>{if(event.pointerType==='touch')return;const rect=card.getBoundingClientRect();card.style.setProperty('--x',`${event.clientX-rect.left}px`);card.style.setProperty('--y',`${event.clientY-rect.top}px`);}));
}
function finishRender(scroll=true){mountAnimations();if(scroll){window.scrollTo({top:0,behavior:'instant'});const heading=main.querySelector('h1');heading?.setAttribute('tabindex','-1');heading?.focus({preventScroll:true});}}
function home(scroll=true){
  view='home';
  const hasProgress=answers.some(a=>a!==null),complete=validAnswers(answers);
  main.innerHTML=`<div class="home page-enter">
    <section class="hero" aria-labelledby="hero-title">
      <div class="hero-top"><span class="edition">历史抉择实验 · 明朝篇</span><span class="volume">VOL. 001 / THE MING ERA</span></div>
      <div class="hero-grid"><div class="hero-copy">
        <h1 id="hero-title">大时代里，<br>你会如何<br><span class="accent">落子。</span></h1>
        <p class="hero-sub">走进十二个明朝历史与生活关口。<br>在担当、探索、创作与牵挂之间，做出选择。<br>看看你的抉择，会与谁遥相呼应。</p>
        <div class="hero-cta"><button class="button primary" data-action="start">${hasProgress?(complete?'查看我的档案':'继续我的选择'):'走进明朝'} ${arrow}</button><button class="text-button" data-action="sample">先看一份档案 →</button></div>
        <div class="hero-meta"><span>12 次抉择</span><span>约 5–8 分钟</span><span>24 位人物 · 男女皆可匹配</span></div>
      </div><div class="art-wrap"><img class="hero-art" src="./landscape.svg" width="720" height="780" alt="拱形画框里的山川与楼阁，轨道环绕，象征时代中的不同人生路径"><span class="art-note" aria-hidden="true">山河为局<br>人心为子</span><span class="art-label" aria-hidden="true">A MOMENT IN HISTORY.<br>A MIRROR OF YOU.</span></div></div>
      <div class="hero-bottom"><div class="chapter-mark"><span>第一卷 · 明</span><span>1368 — 1644</span></div><a href="#journey">每一个选择，都有它的代价 <span aria-hidden="true">↓</span></a></div>
    </section>
    <section class="section journey" id="journey"><div class="section-head reveal"><div><span class="eyebrow">01 / A JOURNEY OF CHOICES</span><h2>借一个时代，照见自己。</h2></div><p>不必记住谁赢了、谁输了。<br>只需想一想：身处其中，你愿意怎么做？</p></div>
      <div class="journey-grid">${[
        ['走进关口','每一幕取自真实历史。你只会拿到当时的困境，不必猜后来的结局。'],
        ['做出取舍','四条路，都有理由和代价。选择你愿意承担的那一种。'],
        ['打开档案','看见相近的人物、不同的侧面，以及支撑分析的历史记录。']
      ].map((item,i)=>`<article class="journey-step reveal" style="transition-delay:${i*70}ms"><span class="number">${String(i+1).padStart(2,'0')}</span><h3>${item[0]}</h3><p>${item[1]}</p></article>`).join('')}</div>
    </section>
    <section class="section" id="events"><div class="section-head reveal"><div><span class="eyebrow">02 / TWELVE HISTORICAL CROSSROADS</span><h2>十二次落子，多种人生。</h2></div><p>从京城存亡，到画笔、生计与远行。<br>我们关心的是，你怎样面对不容易的决定。</p></div>
      <div class="event-grid">${events.map((event,i)=>`<button class="event-card reveal" data-event="${i}" aria-label="预览历史关口：${event.short}" style="transition-delay:${i%3*60}ms"><span class="event-card-top"><span>${event.era}</span><span>${String(i+1).padStart(2,'0')}</span></span><span class="number">${event.year}</span><h3>${event.short}</h3><p>${event.intro}</p><span class="event-card-bottom"><span>${event.category}</span><span aria-hidden="true">↗</span></span><span class="event-card-symbol" aria-hidden="true">${event.symbol}</span></button>`).join('')}</div>
    </section>
    <section class="section people-section" id="people"><div class="section-head reveal"><div><span class="eyebrow">03 / PEOPLE, NOT LABELS</span><h2>你会与谁，遥相呼应？</h2></div><p>24 位人物，来自不同的人生道路。<br>相似的选择，也可以走向不同的人生。</p></div>
      <div class="people-tools"><div class="filter-row" role="group" aria-label="筛选人物">${['全部','女性','男性',...groups].map(f=>'<button data-filter="'+f+'" class="filter-button '+(peopleFilter===f?'active':'')+'" aria-pressed="'+String(peopleFilter===f)+'">'+f+'</button>').join('')}</div><label class="person-search"><span class="sr-only">搜索人物名字或主题</span><input id="person-search" placeholder="搜索名字或主题" value="${escape(peopleQuery)}"></label></div><div id="people-count" class="catalog-count" role="status">24 位人物 · 8 位女性 · 年龄与性别不限制匹配</div><div class="person-grid" id="person-grid">${people.map((person,i)=>`<button class="person-card reveal" data-person="${person.id}" style="--pcolor:${person.color};transition-delay:${i*45}ms" aria-label="查看${person.name}人物档案"><span class="person-monogram" aria-hidden="true">${person.seal}</span><h3>${person.name}</h3><p>${person.tag}</p><p class="years">${person.years}</p>${quoteMarkup(person,'compact')}</button>`).join('')}</div><p class="small-print"><span aria-hidden="true">※</span>人物称谓为游戏概括，未按性别或年龄限定匹配。年轻人物记录较少，画像仍可随着史料研究修订。</p>
    </section>
    <section class="closing reveal"><div><span class="eyebrow">YOUR CHAPTER BEGINS HERE</span><h2>历史已经写下。<br>这一次，由你选择。</h2><p>基础档案无需密钥 · 自带 API Key 可获得 AI 补充解读</p></div><button class="button" data-action="start">${hasProgress?'回到我的选择':'开始十二次抉择'} ${arrow}</button></section>
  </div>`;
  renderPeople();
  $('#person-search')?.addEventListener('input',event=>{peopleQuery=event.target.value;renderPeople();});
  if(restored.migrated&&!sessionStorage.getItem('zhaojian-migrated-v2')){announce('已保留旧版六关回答，继续完成新增关口即可。');write(sessionStorage,'zhaojian-migrated-v2',true);}
  finishRender(scroll);
}
function start(){
  if(validAnswers(answers)){result();return;}
  if(answers[index]!==null){const next=answers.findIndex(a=>a===null);if(next>=0)index=next;}
  quiz();
}
function quiz(scroll=true){
  view='quiz';const e=events[index],completed=answers.filter(a=>a!==null).length;
  main.innerHTML=`<div class="quiz-page page-enter"><div class="quiz-toolbar"><button class="text-button" data-action="home">← 返回首页</button><span class="progress-caption"><span>${completed} / ${events.length} 次选择已记录</span><span class="progress-track" role="progressbar" aria-label="答题进度" aria-valuenow="${completed}" aria-valuemin="0" aria-valuemax="${events.length}"><span style="width:${completed/events.length*100}%"></span></span></span></div>
    <div class="quiz-layout"><aside class="dossier" aria-label="历史关口背景"><span class="eyebrow">CHAPTER ${String(index+1).padStart(2,'0')} / THE MING ERA</span><div class="dossier-year">${e.year}</div><div class="dossier-era">${e.era}</div><h2>${e.short}</h2><p>${e.intro}</p>${chapterQuote(e)}<span class="dossier-symbol" aria-hidden="true">${e.symbol}</span><svg class="dossier-lineart" aria-hidden="true" viewBox="0 0 500 190" preserveAspectRatio="none"><g fill="none" stroke="#d6ddc4" stroke-width=".9"><path d="M-20 180l100-100 40 35 68-80 46 110 56-57 57 42 98-92 81 106M-20 188l125-80 36 48 68-94 40 93 62-41 58 58 79-105 90 121M-10 195l130-60 39 37 65-78 41 82 66-42 57 45 76-77 90 101"/><path d="M82 80l24 28 15 27m68-99 18 27 19 30m77-4 20 25 12 20m106-95 8 28 16 35"/></g></svg><div class="dossier-footer"><span>${e.location}</span><span>${e.category}</span></div><div class="dossier-note">事件有史实依据；角色与选项为游戏改编。<br>完成后可查看历史记录与来源。</div></aside>
    <section class="choices-panel"><span class="eyebrow">THE DECISION IS YOURS</span><h1>${e.title}</h1><p class="scene-text">${e.scene}</p><fieldset class="options"><legend class="sr-only">选择你愿意采取的行动</legend>${e.options.map((o,i)=>`<label class="option-card"><input class="sr-only" type="radio" name="decision" value="${o.id}" ${answers[index]===o.id?'checked':''}><span class="option-letter" aria-hidden="true">${'ABCD'[i]}</span><span><span class="option-title">${o.title}</span><span class="option-detail">${o.detail}</span></span><span class="option-check" aria-hidden="true"></span></label>`).join('')}</fieldset>
      <div class="choice-footer"><span class="choice-hint" id="choice-hint" role="status">${answers[index]===null?'选一条你愿意承担代价的路。':'已记录。你仍然可以改变选择。'}</span><div class="choice-actions">${index>0?'<button class="text-button" data-action="previous">← 上一关</button>':''}<button id="next-choice" class="button primary" data-action="next" ${answers[index]===null?'disabled':''}>${index===events.length-1?'打开我的档案':'下一关'} <span aria-hidden="true">→</span></button></div></div>
      <nav class="chapter-nav" aria-label="返回已完成的历史关口">${events.map((ev,i)=>`<button data-chapter="${i}" class="${answers[i]!==null?'done':''} ${index===i?'active':''}" ${i!==index&&answers[i]===null?'disabled':''} ${index===i?'aria-current="step"':''} aria-label="第${i+1}关，${ev.short}${answers[i]!==null?'，已完成':''}">${i+1}</button>`).join('')}</nav>
    </section></div></div>`;
  main.querySelectorAll('input[name="decision"]').forEach(input=>input.addEventListener('change',()=>{
    const val=input.value;if(answers[index]!==val){answers[index]=val;ai=null;aiError='';cancelAI(false);}
    persist();$('#next-choice').disabled=false;$('#choice-hint').textContent='已记录。你仍然可以改变选择。';
    const done=answers.filter(a=>a!==null).length;const bar=main.querySelector('[role="progressbar"]');bar.setAttribute('aria-valuenow',done);bar.querySelector('span').style.width=`${done/events.length*100}%`;bar.previousElementSibling.textContent=`${done} / ${events.length} 次选择已记录`;main.querySelector(`[data-chapter="${index}"]`).classList.add('done');
  }));
  persist();finishRender(scroll);
}
function result(scroll=true){
  if(!validAnswers(answers)){start();return;}
  view='result';const r=analyze(answers),p=r.person,second=r.ranking[1].person;
  main.innerHTML=`<div class="result-page page-enter"><div class="result-top"><span>YOUR HISTORICAL REFLECTION / 明朝篇</span><button class="text-button" data-action="review">回看我的选择 ↗</button></div>
    <section class="result-hero"><div class="result-portrait" style="--pcolor:${p.color}"><span class="portrait-seal" aria-hidden="true">${p.seal}</span><span class="portrait-name">${p.courtesy} · ${p.years}</span><span class="portrait-corner" aria-hidden="true">抉择档案</span></div><div class="result-copy"><span class="eyebrow">你的主要历史参照</span><h1>${p.name}</h1><p class="result-tag">${p.tag}</p>${quoteMarkup(p)}<p class="result-summary">${p.summary}</p><div class="result-pills">${r.dominant.slice(0,3).map(a=>`<span class="pill">${a.name}</span>`).join('')}<span class="pill">${p.stage}</span><span class="pill">12 次选择 · ${appVersion}</span></div>${r.close?'<p class="close-note">前两位人物参照接近，结果有共同倾向。</p>':''}</div></section>
    <div class="result-columns"><div><section class="result-section"><span class="eyebrow">01 / WHAT YOUR CHOICES SAY</span><h2>你的选择，透露了什么？</h2>${r.dominant.slice(0,2).map(a=>`<article class="insight"><h3>${a.name}</h3><p>${a.high}</p></article>`).join('')}<article class="insight risk-insight"><h3>值得留意的代价</h3><p>${r.dominant[0].cost}</p></article></section><section class="result-section"><h2>相似之外，还有不同。</h2><p class="muted" style="font-size:12px">${p.difference}</p></section></div>
    <aside><section class="result-section"><span class="eyebrow">YOUR DECISION PATTERN</span><h2>这次选择的侧面</h2>${axes.map((a,i)=>`<div class="axis-row"><span>${a.name}</span><span class="axis-track"><span style="width:${r.vector[i]/3*100}%"></span></span><strong>${r.vector[i]>=2.4?'偏高':r.vector[i]>=1.4?'适中':'偏低'}</strong></div>`).join('')}<p class="chart-note">条形呈现本游戏的选项编码；没有好坏高低，也不是心理量表或人物相似百分比。</p></section><section class="secondary-person" style="--pcolor:${second.color}"><span class="person-monogram" aria-hidden="true">${second.seal}</span><div><span class="eyebrow">另一种历史参照</span><h3>${second.name}</h3><p>${second.tag}</p><button data-person="${second.id}">查看历史依据 ↗</button></div></section></aside></div>
    <section class="result-section match-reasons"><span class="eyebrow">WHY THIS HISTORICAL REFLECTION</span><h2>哪些选择，与他或她相呼应？</h2><div class="reasons-grid">${r.aligned.length?r.aligned.map(e=>'<article class="reason-card"><span class="eyebrow">'+e.event.short+' · 游戏取舍</span><h3>'+e.choice.title+'</h3><p>'+e.choice.detail+'</p></article>').join(''):'<p class="muted">本次没有与画像完全一致的选项，整体距离给出了相近参照；建议同时查看第二位人物。</p>'}</div><div class="historical-pair"><span class="eyebrow">${p.name}的实际记录</span><p>${p.facts.join(' ')}</p><a class="source-link" href="${p.source.url}" target="_blank" rel="noopener noreferrer">${p.source.name} ↗</a><p class="chart-note">上面的联系是作者设计的行动方式类比，不表示人物曾回答这些情境题。</p></div>${r.divergence?'<article class="divergence"><h3>不同的一步 · '+r.divergence.event.short+'</h3><p>你选择了“'+r.divergence.choice.title+'”。作者为这位人物归纳的游戏画像更接近“'+r.divergence.analogy.title+'”。这项差异值得保留。</p></article>':''}<button class="button secondary" data-action="experiment">改一关试试，看看另一种可能 ↗</button></section>
    <section class="result-section evidence-section"><span class="eyebrow">02 / THE RECORD BEHIND YOUR CHOICES</span><h2>把选择，放回历史里。</h2>${r.evidence.map(e=>`<details class="evidence-card"><summary><span class="number">${String(e.index+1).padStart(2,'0')}</span><span><strong>${e.event.short}</strong><span>你的选择：${e.choice.title}</span></span></summary><div class="evidence-body"><span class="evidence-label">你的取舍 · 游戏改编</span><p>${e.choice.detail}</p><span class="evidence-label">实际历史记录</span><p>${e.event.fact}</p><a class="source-link" href="${e.event.source.url}" target="_blank" rel="noopener noreferrer">${e.event.source.name} ↗</a><p class="chart-note">这一选择用于比较行动方式；不表示所有候选人物都曾面对或回答过这道题。</p></div></details>`).join('')}</section>
    <section class="ai-panel" aria-labelledby="ai-title"><div class="ai-head"><div><span class="eyebrow">03 / A DEEPER REFLECTION</span><h2 id="ai-title">让这份档案，更像你。</h2></div><span class="ai-status"><i aria-hidden="true"></i>自带密钥 · 按需调用</span></div><p>模型会结合你的十二次取舍，补充优势、代价与一个值得追问的问题。</p><div id="ai-body"></div></section>
    <div class="result-actions"><button class="button secondary" data-action="download">保存完整档案 ↓</button><button class="button secondary" data-action="card">下载 PNG 分享卡片 ↓</button><button class="text-button" data-action="card-svg">SVG 源图 ↓</button><button class="text-button" data-action="restart">重新选择 ↗</button></div><p class="report-footnote">娱乐性历史情境比较。人物画像、选项编码与匹配规则由编写者设计，尚未经心理测量验证。<button class="text-button" data-action="method">查看方法与边界 ↗</button></p>
  </div>`;
  renderAI();finishRender(scroll);
}
function renderAI(){
  const container=$('#ai-body');if(!container)return;
  if(aiBusy){container.innerHTML='<div class="loading-line" role="status"><span class="spinner" aria-hidden="true"></span>正在阅读你的十二次取舍，最多等待 60 秒…</div><button class="button secondary" data-action="cancel-ai">取消生成</button>';return;}
  if(ai){container.innerHTML=`${aiError?`<p class="ai-error" role="alert">${escape(aiError)} 原有解读已保留。</p>`:''}<div class="ai-result"><p>${escape(ai.summary)}</p><div class="ai-grid"><div><h3>你可能的优势</h3><ul>${ai.strengths.map(s=>`<li>${escape(s)}</li>`).join('')}</ul></div><div><h3>需要承担的代价</h3><ul>${ai.tradeoffs.map(s=>`<li>${escape(s)}</li>`).join('')}</ul></div></div><p class="reflection">留给你的问题：${escape(ai.reflection)}</p><p class="chart-note" style="color:#abb69d">AI 补充解读 · ${escape(ai.model)} · 可能有误，历史事实请以来源为准。</p></div><button class="button secondary" data-action="generate-ai">重新生成 ↗</button>`;return;}
  container.innerHTML=`${aiError?`<p class="ai-error" role="alert">${escape(aiError)}</p>`:''}<button class="button" data-action="${apiKey?'generate-ai':'settings'}">${apiKey?(aiError?'重试 AI 解读':'生成 AI 补充解读'):'配置密钥，生成解读'} ${arrow}</button>${apiKey?'<button class="button secondary" data-action="settings">修改配置</button>':''}<p class="chart-note" style="color:#aebb9d">基础档案已完成。只有点击生成，才会将回答发送给你配置的模型服务。</p>`;
}
function cancelAI(showMessage=true){if(aiController){aiController.abort();aiController=null;}aiBusy=false;if(showMessage){aiError='已取消生成。你的选择和基础档案仍然保留。';renderAI();}}
async function generateAI(){
  if(!apiKey){openSettings();return;}if(aiBusy)return;
  const controller=new AbortController();aiController=controller;aiBusy=true;aiError='';renderAI();
  const timer=setTimeout(()=>controller.abort(),65000);
  try{
    const payload=await modelRequest('/api/analyze',{config:{baseUrl:config.baseUrl,model:config.model,apiKey,transport:config.transport},answers,contentVersion,scoringVersion},controller.signal);
    if(controller!==aiController)return;
    ai={...payload.analysis,model:payload.model};announce('AI 补充解读已生成。');
  }catch(error){if(controller!==aiController)return;aiError=error.name==='AbortError'?'等待超时或请求已取消。选择仍然保留，可以重试。':error.message||'本地服务连接失败，请检查服务是否仍在运行。';}
  finally{clearTimeout(timer);if(controller===aiController){aiController=null;aiBusy=false;renderAI();}}
}
function showInfo(html){$('#info-content').innerHTML=html;$('#info-dialog').showModal();}
function method(){showInfo(`<h2 id="info-title">24 位人物，十二种取舍。</h2><p class="info-intro">不限定性别、年龄和职业。<br>我们比较的是选择方式，也保留不同的一步。</p><ol class="info-list"><li><strong>史实与改编分开。</strong>事件和人物实际记录附来源；角色、选项、画像与匹配权重是作者设计。</li><li><strong>逐关比较。</strong>每个选项有稳定 ID。按人物的作者类比画像逐题比较；三个相关主题权重为 2，其余为 0.8。完全相同的游戏取舍距离为 0，其余结合选项编码计算距离。</li><li><strong>八个侧面用于解释。</strong>担当、审慎、原则、变通、求实、协作、自主与表达。条形是选项编码摘要，未作为心理量表。</li><li><strong>保留多种解释。</strong>前两位距离差小于 0.03 时提示接近。没有人物相似百分比，也不根据历史结局预测命运。</li><li><strong>年龄是观察阶段。</strong>匹配不检查玩家性别或年龄。人物卡注明选取的生平阶段；青年人物的记录范围较窄。</li><li><strong>题句有作者。</strong>人物题句节选自诗文、奏疏、题画与史料；赐诗、画史及亲属评语保留实际作者。关口题句是相关阅读，不是人物在该事件中的发言。简体字与标点作阅读整理，解说由本游戏撰写。</li><li><strong>AI 可选。</strong>不会修改基础匹配。仅在发起请求时，将选择与所提供的史实发送给你配置的模型服务。</li></ol><p class="info-divider muted">游戏画像不是人物对未经历事件的真实回答。24 人仍不能代表明朝的全部阶层和生活，特别是普通劳动者与儿童的记录还需要补充。</p><p class="chart-note">版本 ${appVersion} · 题库 ${contentVersion} · 规则 ${scoringVersion}</p><a class="source-link" href="https://vibe-design-labs.github.io/Vibe-UI-UX/" target="_blank" rel="noopener noreferrer">交互设计参考 · IntentKit / 意译 ↗</a>`);}
function personInfo(id){const p=people.find(p=>p.id===id);if(!p)return;showInfo(`<div class="info-person-title" style="--pcolor:${p.color}"><span class="person-monogram" aria-hidden="true">${p.seal}</span><div><h2 id="info-title">${p.name}</h2><p>${p.courtesy} · ${p.years}<br>${p.gender} · ${p.group} · ${p.stage}</p></div></div>${quoteMarkup(p,'context')}<p class="muted">${p.summary}</p><div class="info-fact"><span class="eyebrow">HISTORICAL RECORD</span><ul class="info-list">${p.facts.map(f=>`<li>${f}</li>`).join('')}</ul><a class="source-link" href="${p.source.url}" target="_blank" rel="noopener noreferrer">${p.source.name} ↗</a></div><p class="info-divider muted">${p.difference}</p>`);}
function eventInfo(i){const e=events[i];if(!e)return;showInfo(`<span class="eyebrow" style="color:var(--red)">${e.era} / ${e.location}</span><h2 id="info-title" style="margin-top:12px">${e.short}</h2><p class="info-intro">${e.title}</p><p>${e.scene}</p><p class="info-divider muted">这是历史情境预览。正式测试时，你将从四种各有代价的路径中选择；历史人物的实际行动会在完成后揭晓。</p><button class="button primary" data-action="start-from-dialog" style="margin-top:23px">${answers.some(a=>a!==null)?'回到我的选择':'开始十二次抉择'} ${arrow}</button>`);}
function sample(){showInfo(`<h2 id="info-title">你的档案，会长这样。</h2><span class="pill">示例内容 · 与你的回答无关</span><p class="info-intro" style="margin-top:20px">主要历史参照：于谦<br>危局中的担当者</p><p>“在危机里，你优先稳定关键局面，并愿意承担责任。但在新方法面前，你仍然留出了检验和调整的空间。”</p><div class="info-fact"><strong>你会得到</strong><ul class="info-list"><li>一位主要人物，以及另一种历史参照。</li><li>你这次选择的倾向、可能的优势与代价。</li><li>十二次回答回顾，与真实历史记录及来源。</li><li>可下载的档案与分享卡片；BYOK 补充解读可选。</li></ul></div><button class="button primary" data-action="start-from-dialog" style="margin-top:22px">做出我的选择 ${arrow}</button>`);}
function openSettings(){
  $('#transport').value=config.transport;updateTransportNote();
  $('#provider').value=config.provider in presets?config.provider:'custom';$('#base-url').value=config.baseUrl||'';$('#model').value=config.model||'';$('#api-key').value=apiKey;$('#api-key').type='password';$('#show-key').textContent='显示';$('#show-key').setAttribute('aria-label','显示 API Key');$('#show-key').setAttribute('aria-pressed','false');$('#settings-status').textContent='';$('#settings-status').classList.remove('error');$('#settings-dialog').showModal();
}
function formConfig(){return {provider:$('#provider').value,baseUrl:$('#base-url').value.trim(),model:$('#model').value.trim(),transport:$('#transport').value};}
function updateTransportNote(){const direct=$('#transport').value==='direct';$('#transport-note').textContent=direct?'浏览器直连：Key 与回答直接发送给填写的服务。服务需允许浏览器跨域请求。':'本机代理：Key 与回答经本机服务发往填写的模型服务。';}
$('#transport').addEventListener('change',updateTransportNote);
if(!localMode){$('#transport option[value=proxy]').disabled=true;}
$('#settings-form').addEventListener('submit',event=>{
  event.preventDefault();const nextConfig=formConfig(),nextKey=$('#api-key').value.trim();try{endpointFor({...nextConfig,apiKey:nextKey});}catch(error){$('#settings-status').textContent=error.message;$('#settings-status').classList.add('error');return;}config=nextConfig;apiKey=nextKey;
  write(localStorage,'zhaojian-provider-v1',config);$('#api-key').value='';$('#settings-dialog').close();updateConnection();if(view==='result')renderAI();announce('配置已应用。密钥只在本次页面内存中保留。');
});
$('#provider').addEventListener('change',()=>{const preset=presets[$('#provider').value];$('#base-url').value=preset.baseUrl;$('#model').value=preset.model;$('#settings-status').textContent='';});
$('#show-key').addEventListener('click',()=>{const showing=$('#api-key').type==='password';$('#api-key').type=showing?'text':'password';$('#show-key').textContent=showing?'隐藏':'显示';$('#show-key').setAttribute('aria-label',showing?'隐藏 API Key':'显示 API Key');$('#show-key').setAttribute('aria-pressed',String(showing));});
$('#test-connection').addEventListener('click',async()=>{
  if(!$('#settings-form').reportValidity())return;
  if(connectionController)return;
  const button=$('#test-connection'),status=$('#settings-status');const controller=new AbortController();connectionController=controller;
  button.disabled=true;button.textContent='正在连接…';status.classList.remove('error');status.textContent='将发送一次简短模型请求，用量由服务商计费。';
  const timer=setTimeout(()=>controller.abort(),65000);
  try{const payload=await modelRequest('/api/test',{config:{...formConfig(),apiKey:$('#api-key').value.trim()}},controller.signal);status.textContent=payload.message;}
  catch(error){status.textContent=error.name==='AbortError'?'连接测试已取消或超时。':error.message||'本地服务无法连接。';status.classList.add('error');}
  finally{clearTimeout(timer);if(controller===connectionController)connectionController=null;button.disabled=false;button.textContent='测试连接';}
});
$('#disconnect-key').addEventListener('click',()=>{cancelAI(false);apiKey='';$('#api-key').value='';$('#settings-status').textContent='密钥已清除。基础测试和已生成的档案仍可使用。';$('#settings-status').classList.remove('error');updateConnection();if(view==='result')renderAI();});
$('#settings-dialog').addEventListener('close',()=>{connectionController?.abort();$('#api-key').value='';$('#api-key').type='password';});
function downloadFile(content,type,filename){const blob=new Blob([content],{type});const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download=filename;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
async function card(format='png'){
  const r=analyze(answers),p=r.person,data={person:p,labels:r.dominant.slice(0,3).map(a=>a.name),version:appVersion};
  try{
    const content=format==='svg'?await makeSVG(data):await makePNG(data);
    downloadFile(content,format==='svg'?'image/svg+xml;charset=utf-8':'image/png',`照见-${p.name}-分享卡片.${format}`);
    announce(`${format.toUpperCase()} 分享卡片已下载，包含题句与作者。`);
  }catch{announce('分享卡片暂时无法生成，请刷新页面后重试。');}
}

document.addEventListener('click',event=>{
  const filter=event.target.closest('[data-filter]');if(filter){peopleFilter=filter.dataset.filter;document.querySelectorAll('[data-filter]').forEach(b=>{const on=b.dataset.filter===peopleFilter;b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on));});renderPeople();return;}
  const close=event.target.closest('[data-close]');if(close){document.getElementById(close.dataset.close).close();return;}
  const person=event.target.closest('[data-person]');if(person){personInfo(person.dataset.person);return;}
  const preview=event.target.closest('[data-event]');if(preview){eventInfo(Number(preview.dataset.event));return;}
  const chapter=event.target.closest('[data-chapter]');if(chapter&&!chapter.disabled){index=Number(chapter.dataset.chapter);quiz();return;}
  const nav=event.target.closest('[data-nav]');if(nav){if(view!=='home')home();document.getElementById(nav.dataset.nav)?.scrollIntoView({behavior:document.body.classList.contains('motion-off')?'instant':'smooth'});return;}
  const trigger=event.target.closest('[data-action]');if(!trigger || trigger.disabled)return;
  const actions={
    home:()=>home(),start,method,settings:openSettings,sample,experiment:openExperiment,
    'apply-experiment':()=>{if(experimentChoice===null)return;cancelAI(false);answers[experimentIndex]=experimentChoice;ai=null;aiError='';persist();$('#info-dialog').close();result();announce('已采用这一步，档案重新计算。');},
    'start-from-dialog':()=>{$('#info-dialog').close();start();},
    next:()=>{if(answers[index]===null)return;if(index<events.length-1){index++;quiz();}else if(validAnswers(answers)){result();}else{index=answers.findIndex(a=>a===null);quiz();announce('还有一关未完成，请补充选择。');}},
    previous:()=>{if(index>0){index--;quiz();}},review:()=>{index=0;quiz();},
    restart:()=>$('#restart-dialog').showModal(),
    'generate-ai':generateAI,'cancel-ai':()=>cancelAI(),
    download:()=>{const r=analyze(answers);downloadFile(reportText(answers,ai),'text/plain;charset=utf-8',`照见-${r.person.name}-抉择档案.txt`);announce('完整档案已下载。');},card:()=>card(),'card-svg':()=>card('svg')
  };
  actions[trigger.dataset.action]?.();
});
$('#home-link').addEventListener('click',event=>{event.preventDefault();home();});
$('#confirm-restart').addEventListener('click',()=>{cancelAI(false);answers=fresh();index=0;ai=null;aiError='';persist();$('#restart-dialog').close();quiz();});
document.querySelectorAll('dialog').forEach(dialog=>dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}));
const motionOff=read(localStorage,'zhaojian-motion-v1',false);document.body.classList.toggle('motion-off',motionOff);
function updateMotion(){const off=document.body.classList.contains('motion-off');$('#motion-button').setAttribute('aria-pressed',String(off));$('#motion-button').setAttribute('aria-label',off?'开启装饰动效':'暂停装饰动效');$('#motion-button').title=off?'开启装饰动效':'暂停装饰动效';$('#motion-button').textContent=off?'▷':'Ⅱ';}
$('#motion-button').addEventListener('click',()=>{const off=document.body.classList.toggle('motion-off');write(localStorage,'zhaojian-motion-v1',off);updateMotion();});
updateMotion();updateConnection();home(false);setupPointer();
function renderPeople(){
  const grid=$('#person-grid');if(!grid)return;
  const list=people.filter(p=>(peopleFilter==='全部'||peopleFilter==='女性'&&p.gender==='女'||peopleFilter==='男性'&&p.gender==='男'||p.group===peopleFilter)&&(!peopleQuery||[p.name,p.tag,p.stage,p.group].join(' ').includes(peopleQuery.trim())));
  grid.innerHTML=list.map(p=>`<button class="person-card" data-person="${p.id}" style="--pcolor:${p.color}" aria-label="查看${p.name}人物档案"><span class="person-monogram" aria-hidden="true">${p.seal}</span><h3>${p.name}</h3><p>${p.tag}</p><p class="person-stage">${p.gender} · ${p.stage}</p><p class="years">${p.years}</p>${quoteMarkup(p,'compact')}</button>`).join('')||'<p class="catalog-empty">没有匹配的人物，可以换一个名字或主题。</p>';
  $('#people-count').textContent=`显示 ${list.length} / ${people.length} 位人物 · 性别与年龄仅供档案浏览，不限制结果`;
}
function openExperiment(){
  experimentIndex=0;experimentChoice=answers[0];
  showInfo(`<h2 id="info-title">换一步，会走向谁？</h2><p class="muted">只改变一关，先看另一种可能。采用之前，你的原档案保持不变。</p><label for="experiment-event">选择一个关口</label><select id="experiment-event">${events.map((e,i)=>'<option value="'+i+'">'+(i+1)+' · '+e.short+'</option>').join('')}</select><div id="experiment-options"></div><div id="experiment-result" role="status"></div><div class="dialog-actions"><button class="button secondary" data-close="info-dialog">保留原档案</button><button class="button primary" data-action="apply-experiment">采用这一步 ↗</button></div>`);
  $('#experiment-event').addEventListener('change',event=>{experimentIndex=Number(event.target.value);experimentChoice=answers[experimentIndex];renderExperiment();});renderExperiment();
}
function renderExperiment(){
  const e=events[experimentIndex];$('#experiment-options').innerHTML=`<fieldset class="options experiment-options"><legend class="sr-only">试选另一条路</legend>${e.options.map(o=>'<label class="option-card"><input class="sr-only" type="radio" name="experiment" value="'+o.id+'" '+(experimentChoice===o.id?'checked':'')+'><span class="option-check" aria-hidden="true"></span><span><span class="option-title">'+o.title+'</span><span class="option-detail">'+o.detail+'</span></span></label>').join('')}</fieldset>`;
  document.querySelectorAll('[name="experiment"]').forEach(input=>input.addEventListener('change',()=>{experimentChoice=input.value;updateExperiment();}));updateExperiment();
}
function updateExperiment(){const draft=[...answers];draft[experimentIndex]=experimentChoice;const before=analyze(answers),after=analyze(draft);$('#experiment-result').innerHTML=`<div class="experiment-result"><span class="eyebrow">原档案 → 试选档案</span><p>${before.person.name} → ${after.person.name}</p><span class="muted">${after.person.id===before.person.id?'主要参照保持一致，具体取舍已经变化。':'另一种选择，改变了主要历史参照。'}${after.close?' 前两位参照接近，保留多种解释。':''}</span></div>`;}
