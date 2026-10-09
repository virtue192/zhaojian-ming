import test from 'node:test';
import assert from 'node:assert/strict';
import {once} from 'node:events';
import {readFile} from 'node:fs/promises';
import {people,events,contentVersion,scoringVersion} from '../public/content.js';
import {quotes,chapterQuotes} from '../public/quotes.js';
import {reportText} from '../public/engine.js';
import {createApp} from '../server.mjs';

test('every profile and chapter has an attributed extract, retained in exported reports',()=>{
  assert.equal(Object.keys(quotes).length,24);
  for(const p of people){const q=p.quote;assert(q.text&&q.author&&q.kind&&q.work&&q.context);assert.equal(new URL(q.url).protocol,'https:');const report=reportText(events.map(e=>p.pattern[e.id]));assert(report.includes(q.text)&&report.includes(q.author)&&report.includes(q.url));}
  for(const e of events)assert(people.some(p=>p.id===chapterQuotes[e.id]));
  assert.equal(quotes.qin.author,'朱由检（崇祯帝）');assert.equal(quotes.qin.kind,'他人赐诗');
  assert.equal(quotes.hongwu.author,'朱升');assert.equal(quotes.wenchu.author,'姜绍书');
  assert.equal(quotes.ye.author,'沈宜修');assert.equal(quotes.shen.author,'沈宜修');assert(quotes.shen.context.includes('张倩倩'));
  assert.equal(contentVersion,'ming-2');assert.equal(scoringVersion,'event-pattern-1');
});
test('local-only fonts and new modules are served with correct types; source boundaries remain closed',async()=>{
  const server=createApp();server.listen(0,'127.0.0.1');await once(server,'listening');const base=`http://127.0.0.1:${server.address().port}`;
  try{
    for(const filename of ['pointer.js','quotes.js','share-card.js','typography.css','atmosphere.css'])assert.equal((await fetch(`${base}/${filename}`)).status,200);
    for(const filename of ['wenkai','brush']){const response=await fetch(`${base}/fonts/${filename}.woff2`);assert.equal(response.headers.get('content-type'),'font/woff2');assert.equal(Buffer.from(await response.arrayBuffer()).subarray(0,4).toString(),'wOF2');}
    for(const filename of ['WenKai-OFL.txt','MaShanZheng-OFL.txt']){const text=await (await fetch(`${base}/fonts/${filename}`)).text();assert(text.includes('SIL OPEN FONT LICENSE'));}
    for(const filename of ['fonts/../../server.mjs','fonts/WenKai.ttf','fonts/no-such-file.woff2','引文校核.md'])assert.equal((await fetch(`${base}/${filename}`)).status,404);
    const html=await (await fetch(base)).text();assert(!/fonts\.googleapis|fonts\.gstatic/.test(html));
  }finally{server.closeAllConnections();await new Promise(r=>server.close(r));}
});
