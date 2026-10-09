import {analyze,validAnswers} from './engine.js';
import {contentVersion,scoringVersion} from './content.js';
export class ModelError extends Error{constructor(message,status=400){super(message);this.status=status;}}
export function endpointFor(config){
  if(!config||typeof config.baseUrl!=='string'||typeof config.model!=='string'||!config.model.trim()||config.model.length>160||typeof config.apiKey!=='string'||!config.apiKey.trim()||config.apiKey.length>4096||/[\r\n]/.test(config.apiKey))throw new ModelError('请填写服务地址、模型名称和 API Key。');
  let url;try{url=new URL(config.baseUrl.trim());}catch{throw new ModelError('服务地址格式不正确。');}
  const local=['localhost','127.0.0.1','[::1]'].includes(url.hostname);
  if((url.protocol!=='https:'&&!(local&&url.protocol==='http:'))||url.username||url.password||url.search||url.hash)throw new ModelError('请使用 HTTPS 服务地址；本机模型可使用 localhost 或 127.0.0.1 的 HTTP 地址。');
  url.pathname=url.pathname.replace(/\/+$/,'');if(!url.pathname.endsWith('/chat/completions'))url.pathname+='/chat/completions';return url.href;
}
export function prompt(answers){
  const r=analyze(answers);
  return JSON.stringify({task:'根据用户取舍写中文反思分析。只使用给出的历史记录，不编造引语、经历、人物在未参与事件中的选择。不改变主要匹配，不预测命运，不把退让与谨慎视为道德缺陷，不按性别或年龄推断性格。人物画像是作者的游戏类比，不是史实或心理诊断。',contentVersion,scoringVersion,
    main:{name:r.person.name,stage:r.person.stage,scope:r.person.summary,facts:r.person.facts,quotation:r.person.quote},secondary:r.ranking[1].person.name,close:r.close,
    decisions:r.evidence.map(e=>({event:e.event.short,choice:e.choice.title,tradeoff:e.choice.detail,fact:e.event.fact})),aligned:r.aligned.map(e=>e.event.short),divergence:r.divergence?{event:r.divergence.event.short,user:r.divergence.choice.title,editorialAnalogy:r.divergence.analogy.title}:null,
    required:'返回 JSON 对象：summary（150字以内），strengths（2条，每条70字以内），tradeoffs（2条，每条70字以内），reflection（一个具体反思问题，80字以内）。不要 Markdown 围栏。'});
}
export function parseAnalysis(content){
  if(typeof content!=='string'||content.length>16000)throw new ModelError('模型没有返回可用解读。',502);
  let r;try{r=JSON.parse(content.trim().replace(/^```(?:json)?\s*/i,'').replace(/\s*```$/,''));}catch{throw new ModelError('模型未返回结构化解读，可以重试或更换模型。',502);}
  const str=v=>typeof v==='string'&&v.trim().length>0&&v.length<2000;const list=v=>Array.isArray(v)&&v.length>0&&v.length<=5&&v.every(str);
  if(!r||!str(r.summary)||!str(r.reflection)||!list(r.strengths)||!list(r.tradeoffs))throw new ModelError('模型返回的解读不完整，请重试。',502);
  return {summary:r.summary,strengths:r.strengths,tradeoffs:r.tradeoffs,reflection:r.reflection};
}
export async function callModel(config,answers,{testing=false,fetchImpl=fetch,signal}={}){
  const endpoint=endpointFor(config);if(!testing&&!validAnswers(answers))throw new ModelError('请完成所有选择后再生成解读。');
  const response=await fetchImpl(endpoint,{method:'POST',redirect:'error',signal,headers:{'Content-Type':'application/json','Authorization':`Bearer ${config.apiKey.trim()}`},
    body:JSON.stringify({model:config.model.trim(),stream:false,max_tokens:testing?40:1800,messages:[{role:'system',content:testing?'你是连接测试助手。只回复连接成功。':'你是谨慎的历史情境游戏解读者，严格根据材料回答，输出有效 JSON。'},{role:'user',content:testing?'请回复连接成功。':prompt(answers)}]})});
  if(!response.ok){const messages={401:'API Key 无效或已失效，请检查密钥。',403:'此密钥没有模型访问权限。',404:'服务地址或模型不存在，请检查配置。',429:'服务限流或余额不足，请稍后重试并检查账户。'};throw new ModelError(messages[response.status]||'模型服务暂时无法完成请求，请检查配置。',502);}
  let payload;try{payload=await response.json();}catch{throw new ModelError('模型服务返回格式异常。',502);}
  const content=payload.choices?.[0]?.message?.content;if(typeof content!=='string'||!content.trim())throw new ModelError('模型未返回文本，请尝试其他对话模型。',502);
  return testing?{ok:true,message:'连接成功，可以生成 AI 解读。'}:{analysis:parseAnalysis(content),model:config.model.trim()};
}
export async function modelRequest(route,body,signal){
  const testing=route.endsWith('/test');
  if(body.config.transport==='direct'){
    try{return await callModel(body.config,body.answers,{testing,signal});}catch(error){if(error instanceof ModelError||error.name==='AbortError')throw error;throw new ModelError('浏览器无法访问模型服务，可能是跨域限制或网络问题。可检查服务的浏览器支持，或下载本地版使用本机代理。',502);}
  }
  let response;try{response=await fetch(new URL(`.${route}`,import.meta.url),{method:'POST',headers:{'Content-Type':'application/json'},signal,body:JSON.stringify(body)});}catch(error){if(error.name==='AbortError')throw error;throw new ModelError('本机代理无法连接。静态网站请选择浏览器直连，或下载并启动本地版。',502);}
  let payload;try{payload=await response.json();}catch{throw new ModelError('当前站点没有可用的本机代理，请选择浏览器直连或本地运行。',502);}
  if(!response.ok)throw new ModelError(payload.error||'请求未完成，请重试。',response.status);return payload;
}
