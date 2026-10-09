import {events,people,axes,contentVersion,scoringVersion,appVersion} from './content.js';
export const blankAnswers=()=>Array(events.length).fill(null);
export function validAnswers(answers,complete=true){return Array.isArray(answers)&&answers.length===events.length&&Array.from(answers).every((a,i)=>(!complete&&a===null)||events[i].options.some(o=>o.id===a));}
const prepared=people.map(person=>({person,weights:events.map(e=>person.anchors.includes(e.id)?2:.8),costs:events.map(e=>{
  const target=e.options.find(o=>o.id===person.pattern[e.id]);if(!target)throw new Error(`Invalid profile: ${person.id}/${e.id}`);
  return Object.fromEntries(e.options.map(o=>[o.id,o.id===target.id?0:.45+.55*Math.sqrt(o.vector.reduce((s,v,j)=>s+((v-target.vector[j])/3)**2,0)/axes.length)]));
})}));
export function analyze(answers){
  if(!validAnswers(answers))throw new Error(`请完成 ${events.length} 次选择后再生成档案。`);
  const evidence=events.map((event,i)=>({event,choice:event.options.find(o=>o.id===answers[i]),index:i}));
  const vector=axes.map((_,j)=>evidence.reduce((s,e)=>s+e.choice.vector[j],0)/events.length);
  const ranking=prepared.map(p=>({person:p.person,distance:p.costs.reduce((s,c,i)=>s+c[answers[i]]*p.weights[i],0)/p.weights.reduce((a,b)=>a+b,0)})).sort((a,b)=>a.distance-b.distance||a.person.id.localeCompare(b.person.id));
  const dominant=axes.map((axis,i)=>({...axis,value:vector[i],index:i})).sort((a,b)=>b.value-a.value),person=ranking[0].person;
  const comparison=evidence.map(e=>({...e,analogy:e.event.options.find(o=>o.id===person.pattern[e.event.id]),aligned:e.choice.id===person.pattern[e.event.id],anchor:person.anchors.includes(e.event.id)}));
  const aligned=comparison.filter(e=>e.aligned).sort((a,b)=>Number(b.anchor)-Number(a.anchor)).slice(0,3);
  const divergence=comparison.find(e=>!e.aligned&&e.anchor)||comparison.find(e=>!e.aligned)||null;
  return {vector,ranking,dominant,evidence,comparison,aligned,divergence,close:ranking[1].distance-ranking[0].distance<.03,person};
}
export function serializeGame(answers,index){return {schemaVersion:2,contentVersion,scoringVersion,answers:Object.fromEntries(events.map((e,i)=>[e.id,answers[i]])),index};}
export function restoreGame(saved,legacy=null){
  if(saved?.schemaVersion===2&&saved.contentVersion===contentVersion&&saved.scoringVersion===scoringVersion){const answers=events.map(e=>saved.answers?.[e.id]??null);if(validAnswers(answers,false))return {answers,index:Number.isInteger(saved.index)&&saved.index>=0&&saved.index<events.length?saved.index:0,migrated:false};}
  if(!saved&&Array.isArray(legacy?.answers)&&legacy.answers.length===6&&legacy.answers.every(a=>a===null||Number.isInteger(a)&&a>=0&&a<4)){const answers=blankAnswers();legacy.answers.forEach((a,i)=>answers[i]=a===null?null:events[i].options[a].id);return {answers,index:answers.findIndex(a=>a===null)===-1?0:answers.findIndex(a=>a===null),migrated:answers.some(a=>a!==null)};}
  return {answers:blankAnswers(),index:0,migrated:false};
}
export function reportText(answers,ai=null){
  const r=analyze(answers);
  return ['照见 · 明朝抉择档案',`版本 ${appVersion} / 题库 ${contentVersion} / 规则 ${scoringVersion}`,`主要参照：${r.person.name} · ${r.person.tag}`,`另一侧面：${r.ranking[1].person.name}`,`观察阶段：${r.person.stage}`,r.close?'前两位参照接近，保留多种解释。':'',r.person.summary,`一生题句：${r.person.quote.text}\n${r.person.quote.kind} · ${r.person.quote.author} · ${r.person.quote.work}\n${r.person.quote.url}\n${r.person.quote.context}`,...r.dominant.slice(0,2).map(a=>a.high),`可能的代价：${r.dominant[0].cost}`,
    '与人物相呼应的取舍（作者游戏类比）',...r.aligned.map(e=>`${e.event.short}：${e.choice.title}`),r.divergence?`不同的一步：${r.divergence.event.short}\n你选择：${r.divergence.choice.title}\n作者画像的另一条路：${r.divergence.analogy.title}`:'本次与该游戏画像的取舍一致；不代表完整历史人格相同。',
    '人物实际历史记录',...r.person.facts,r.person.source.url,...r.evidence.map(e=>`${e.event.short}\n你的选择：${e.choice.title}\n${e.choice.detail}\n历史记录：${e.event.fact}\n来源：${e.event.source.url}`),
    ai?`AI 补充解读（非史实核验）\n${ai.summary}\n优势：${ai.strengths.join('；')}\n代价：${ai.tradeoffs.join('；')}\n建议：${ai.reflection}`:'',
    '说明：历史情境娱乐游戏。玩家角色、选项、人物取舍画像和权重是作者设计的类比，不是人物对未经历事件的真实回答，未经心理测量验证。匹配不按性别、年龄或职业分组。'].filter(Boolean).join('\n\n');
}
