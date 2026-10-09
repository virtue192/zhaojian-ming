import test from 'node:test';
import assert from 'node:assert/strict';
import {once} from 'node:events';
import {readFile} from 'node:fs/promises';
import {createApp,endpointFor} from '../server.mjs';
import {analyze,validAnswers,reportText,restoreGame,serializeGame,blankAnswers} from '../public/engine.js';
import {events,people,axes,contentVersion,scoringVersion} from '../public/content.js';
import {callModel} from '../public/byok.js';
const config={baseUrl:'https://model.example/v1',model:'example-model',apiKey:'TEST-KEY-ONLY'};
const allA=()=>events.map(e=>e.options[0].id);
async function serve(fn,options={}){const server=createApp(options);server.listen(0,'127.0.0.1');await once(server,'listening');try{await fn(`http://127.0.0.1:${server.address().port}`);}finally{server.closeAllConnections();await new Promise(r=>server.close(r));}}
const post=(url,body,headers={})=>fetch(url,{method:'POST',headers:{'Content-Type':'application/json',...headers},body:JSON.stringify(body)});
const completion=content=>new Response(JSON.stringify({choices:[{message:{content}}]}));
test('24 documented profiles, eight women, stable IDs and complete editorial mappings',()=>{
  assert.equal(people.length,24);assert.equal(people.filter(p=>p.gender==='女').length,8);assert.equal(events.length,12);assert.equal(axes.length,8);
  assert.equal(new Set(people.map(p=>p.id)).size,24);assert.equal(new Set(events.map(e=>e.id)).size,12);
  for(const p of people){assert(p.facts.length>=2&&p.source.url.startsWith('https://'));assert(p.stage);assert.equal(p.anchors.length,3);for(const e of events)assert(e.options.some(o=>o.id===p.pattern[e.id]));assert.equal(analyze(events.map(e=>p.pattern[e.id])).person.id,p.id,`${p.name} is unreachable`);}
  for(const e of events){assert.equal(e.options.length,4);assert(e.fact&&e.source.url.startsWith('https://'));for(const o of e.options){assert(o.id.startsWith(e.id+'-'));assert.equal(o.vector.length,8);assert(o.vector.every(v=>Number.isFinite(v)&&v>=0&&v<=3));}}
});
test('32768 deterministic sampled answer paths produce finite explainable results',()=>{
  let seed=87361;const next=()=>{seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;return seed>>>0;};
  const reached=new Set();for(let n=0;n<32768;n++){const a=events.map(e=>e.options[next()%4].id),r=analyze(a);assert.equal(r.evidence.length,12);assert(r.ranking.every(p=>Number.isFinite(p.distance)));assert(r.aligned.every(e=>e.choice.id===r.person.pattern[e.event.id]));reached.add(r.person.id);}
  assert.equal(reached.size,24);
  assert(!validAnswers(new Array(12)));assert(!validAnswers([0,0,0,0,0,0]));assert(validAnswers(blankAnswers(),false));assert(!validAnswers(blankAnswers()));assert.throws(()=>analyze([]));
});
test('old six answers migrate to stable IDs, mismatched versions do not reinterpret saves',()=>{
  const migrated=restoreGame(null,{answers:[0,1,2,3,0,1],index:5});assert(migrated.migrated);assert.equal(migrated.answers[3],events[3].options[3].id);assert.equal(migrated.index,6);assert(migrated.answers.slice(6).every(a=>a===null));
  const saved=serializeGame(allA(),4);assert.deepEqual(restoreGame(saved).answers,allA());assert.equal(restoreGame(saved).index,4);
  assert(restoreGame({...saved,contentVersion:'other'}).answers.every(a=>a===null));assert(restoreGame({...saved,scoringVersion:'other'}).answers.every(a=>a===null));
});
test('one-choice experiments do not mutate original answers; reports include versions and sources',()=>{
  const original=allA(),draft=[...original];draft[9]=events[9].options[2].id;analyze(draft);assert.deepEqual(original,allA());
  const report=reportText(original);assert(report.includes(contentVersion)&&report.includes(scoringVersion));for(const e of events)assert(report.includes(e.source.url));assert(report.includes('作者设计'));assert(!report.includes(config.apiKey));
});
test('Pages HTML and dynamic assets use relative URLs',async()=>{
  const html=await readFile(new URL('../public/index.html',import.meta.url),'utf8'),app=await readFile(new URL('../public/app.js',import.meta.url),'utf8');assert(!/(?:src|href)="\//.test(html));assert(!/src="\//.test(app));
});
test('provider URL validation and endpoint composition',()=>{
  assert.equal(endpointFor(config),'https://model.example/v1/chat/completions');assert.equal(endpointFor({...config,baseUrl:'http://127.0.0.1:11434/v1/'}),'http://127.0.0.1:11434/v1/chat/completions');
  for(const baseUrl of ['http://external.example','https://user:password@example.com','file:///tmp/key','https://example.com?key=foo','bad'])assert.throws(()=>endpointFor({...config,baseUrl}));assert.throws(()=>endpointFor({...config,apiKey:'bad\r\nkey'}));
});
test('local service preserves source boundaries, origin checks and version checks',async()=>serve(async base=>{
  assert.equal((await fetch(base+'/')).status,200);assert.equal((await fetch(base+'/people.js')).status,200);assert.equal((await fetch(base+'/server.mjs')).status,404);assert.equal((await fetch(base+'/package.json')).status,404);
  assert.equal((await post(base+'/api/test',{config},{Origin:'https://unrelated.example'})).status,403);assert.equal((await post(base+'/api/analyze',{config,answers:[0]})).status,400);assert.equal((await fetch(base+'/api/analyze')).status,405);
  assert.equal((await post(base+'/api/analyze',{config,answers:allA(),contentVersion:'old'})).status,409);assert.equal((await (await fetch(base+'/api/health')).json()).version,'0.3.0');
}));
test('BYOK shared transport passes bearer key and actual twelve choices with validated output',async()=>{
  let sent;await serve(async base=>{const response=await post(base+'/api/analyze',{config,answers:allA(),contentVersion,scoringVersion});assert.equal(response.status,200);const data=await response.json();assert.equal(data.analysis.summary,'测试解读');assert(!JSON.stringify(data).includes(config.apiKey));assert.equal(sent.headers.Authorization,'Bearer TEST-KEY-ONLY');const body=JSON.parse(sent.body);const task=JSON.parse(body.messages[1].content);assert.equal(task.decisions.length,12);assert(body.messages[1].content.includes('立即动起来'));assert(!body.messages[1].content.includes(config.apiKey));},
  {fetchImpl:async(_,options)=>{sent=options;return completion(JSON.stringify({summary:'测试解读',strengths:['主动承担'],tradeoffs:['责任过多'],reflection:'如何分担责任？'}));}});
});
test('direct model helper uses same grounded prompt and small connection test',async()=>{
  const result=await callModel(config,null,{testing:true,fetchImpl:async(_,o)=>{assert.equal(JSON.parse(o.body).max_tokens,40);return completion('连接成功。');}});assert.equal(result.ok,true);
});
test('upstream errors and malformed output never reflect secret responses',async()=>{
  for(const [status,message] of [[401,'API Key'],[429,'余额']])await serve(async base=>{const response=await post(base+'/api/test',{config});assert.equal(response.status,502);const data=await response.json();assert(data.error.includes(message));assert(!data.error.includes(config.apiKey));},{fetchImpl:async()=>new Response(config.apiKey,{status})});
  await serve(async base=>{const response=await post(base+'/api/analyze',{config,answers:allA()});assert.equal(response.status,502);assert((await response.json()).error.includes('结构化'));},{fetchImpl:async()=>completion('not json')});
});
test('timeout is recoverable',async()=>serve(async base=>{const response=await post(base+'/api/test',{config});assert.equal(response.status,504);assert((await response.json()).error.includes('保留'));},{timeoutMs:15,fetchImpl:(_,o)=>new Promise((_,reject)=>o.signal.addEventListener('abort',()=>reject(new Error('aborted')),{once:true}))}));
