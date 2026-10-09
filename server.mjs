import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {callModel,endpointFor,ModelError} from './public/byok.js';
import {appVersion,contentVersion,scoringVersion} from './public/content.js';
export {endpointFor};
const publicDir=fileURLToPath(new URL('./public/',import.meta.url));
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.woff2':'font/woff2','.txt':'text/plain; charset=utf-8'};
const files=new Set(['index.html','app.js','content.js','events.js','people.js','engine.js','byok.js','styles.css','typography.css','atmosphere.css','pointer.js','quotes.js','share-card.js','fonts/wenkai.woff2','fonts/brush.woff2','fonts/WenKai-OFL.txt','fonts/MaShanZheng-OFL.txt','fonts/README.txt','landscape.svg','favicon.svg','.nojekyll']);
const json=(res,status,data)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(data));};
async function readBody(req){let size=0;const chunks=[];for await(const c of req){size+=c.length;if(size>24000)throw new ModelError('请求内容过大。',413);chunks.push(c);}try{return JSON.parse(Buffer.concat(chunks).toString('utf8'));}catch{throw new ModelError('请求格式错误。');}}
export function createApp({fetchImpl=fetch,timeoutMs=60000}={}){
  return http.createServer(async(req,res)=>{
    try{
      const host=req.headers.host||'';if(!/^(127\.0\.0\.1|localhost|\[::1\]):\d+$/.test(host))throw new ModelError('仅接受本机访问。',403);
      const url=new URL(req.url,`http://${host}`);
      if(url.pathname==='/api/health'&&req.method==='GET')return json(res,200,{ok:true,app:'zhaojian-ming',version:appVersion});
      if(url.pathname.startsWith('/api/')){
        if(!['/api/analyze','/api/test'].includes(url.pathname))return json(res,404,{error:'接口不存在。'});
        if(req.method!=='POST')return json(res,405,{error:'请使用 POST 请求。'});
        if(req.headers.origin&&req.headers.origin!==`http://${host}`)throw new ModelError('请从本地应用页面发起请求。',403);
        if(!(req.headers['content-type']||'').startsWith('application/json'))throw new ModelError('请使用 JSON 请求。',415);
        const body=await readBody(req);
        if(body.contentVersion&&body.contentVersion!==contentVersion||body.scoringVersion&&body.scoringVersion!==scoringVersion)throw new ModelError('页面与本机服务的题库版本不同，请刷新页面或重新启动服务。',409);
        const controller=new AbortController(),onClose=()=>{if(!res.writableEnded)controller.abort();};res.on('close',onClose);
        const timer=setTimeout(()=>controller.abort(),timeoutMs);
        try{return json(res,200,await callModel(body.config,body.answers,{testing:url.pathname==='/api/test',fetchImpl,signal:controller.signal}));}
        catch(error){if(error instanceof ModelError)throw error;if(controller.signal.aborted)throw new ModelError('请求已取消或等待超过 60 秒。你的选择仍然保留，可以重试。',504);throw new ModelError('无法连接模型服务，请检查地址、网络与模型名称。',502);}
        finally{clearTimeout(timer);res.off('close',onClose);}
      }
      if(!['GET','HEAD'].includes(req.method))return json(res,405,{error:'请求方法不支持。'});
      const filename=url.pathname==='/'?'index.html':url.pathname.slice(1);if(!files.has(filename))return json(res,404,{error:'页面不存在。'});
      const content=await readFile(path.join(publicDir,filename));
      res.writeHead(200,{'Content-Type':mime[path.extname(filename)]||'text/plain','Cache-Control':'no-cache','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer','Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self' https: http://127.0.0.1:* http://localhost:*; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'"});
      res.end(req.method==='HEAD'?undefined:content);
    }catch(error){if(!res.headersSent&&!res.destroyed)json(res,error.status||500,{error:error instanceof ModelError?error.message:'本地服务出现错误，请重试。'});}
  });
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const port=Number(process.env.PORT||4187);if(!Number.isInteger(port)||port<1||port>65535)throw new Error('PORT 必须是 1—65535 之间的端口。');
  const server=createApp();server.listen(port,'127.0.0.1',()=>console.log(`\n  照见 · 明朝抉择档案 ${appVersion}\n  Local: http://127.0.0.1:${port}\n  Ctrl+C 停止服务\n`));
  server.on('error',error=>{console.error(error.code==='EADDRINUSE'?`端口 ${port} 已占用，请设置其他 PORT 后启动。`:'服务启动失败。');process.exitCode=1;});
}
