// Self-contained SVG embeds the licensed web subsets; PNG uses the same fonts.
const xml=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let embedded;
let licenseText;
async function fontLicenses(){
  return licenseText??=Promise.all(['WenKai-OFL.txt','MaShanZheng-OFL.txt'].map(async file=>{
    const response=await fetch(new URL(`./fonts/${file}`,import.meta.url));if(!response.ok)throw new Error('字体许可读取失败');return response.text();
  })).then(texts=>texts.join('\n\n')).catch(error=>{licenseText=null;throw error;});
}
function embeddedFonts(){
  return embedded??=(async()=>{
    const faces=await Promise.all([['Zhaojian WenKai','wenkai'],['Zhaojian Brush','brush']].map(async([family,file])=>{
      const response=await fetch(new URL(`./fonts/${file}.woff2`,import.meta.url));if(!response.ok)throw new Error('字库读取失败');
      const bytes=new Uint8Array(await response.arrayBuffer());let binary='';for(let i=0;i<bytes.length;i+=32768)binary+=String.fromCharCode(...bytes.subarray(i,i+32768));
      return `@font-face{font-family:'${family}';src:url(data:font/woff2;base64,${btoa(binary)}) format('woff2');font-weight:400}`;
    }));return faces.join('');
  })().catch(error=>{embedded=null;throw error;});
}
function layout({person:p,labels,version}){
  const q=p.quote;
  return [
    {text:'照见 · 明朝抉择档案',x:105,y:150,size:38,color:'#52634a',align:'left',brush:true},
    {text:'TWELVE CHOICES. MANY POSSIBLE LIVES.',x:105,y:208,size:19,color:'#78806f',align:'left'},
    {text:p.seal,x:540,y:620,size:310,color:p.color,brush:true},
    {text:'我的主要历史参照',x:540,y:827,size:24,color:'#727c67'},
    {text:p.name,x:540,y:945,size:100,color:'#303b31',brush:true},
    {text:p.tag,x:540,y:1015,size:34,color:'#52634a'},
    {text:`「${q.text}」`,x:540,y:1087,size:Math.min(32,Math.floor(880/(q.text.length+2))),color:'#303b31'},
    {text:`${q.kind} · ${q.author}`,x:540,y:1132,size:22,color:'#727769'},
    {text:q.work,x:540,y:1168,size:20,color:'#727769'},
    {text:labels.join(' · '),x:540,y:1223,size:23,color:'#a14b37'},
    {text:'十二个关口，二十四位人物，一次自己的选择。',x:540,y:1302,size:22,color:'#727769'},
    {text:`版本 ${version} · 历史情境游戏，非心理诊断`,x:540,y:1343,size:17,color:'#929889'},
  ];
}
export async function makeSVG(data){
  const [css,licenses]=await Promise.all([embeddedFonts(),fontLicenses()]);
  const elements=layout(data).map(t=>`<text x="${t.x}" y="${t.y}" text-anchor="${t.align==='left'?'start':'middle'}" fill="${t.color}" font-size="${t.size}" font-family="${t.brush?'Zhaojian Brush':'Zhaojian WenKai'},serif">${xml(t.text)}</text>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1440" viewBox="0 0 1080 1440"><title>${xml(data.person.name)} · 照见分享卡片</title><desc>${xml(data.person.quote.author+' '+data.person.quote.work)}</desc><metadata>${xml(JSON.stringify({quotation:data.person.quote,version:data.version}))}\n\n${xml(licenses)}</metadata><style>${css}</style><rect width="1080" height="1440" fill="#f3f0e7"/><rect x="55" y="55" width="970" height="1330" fill="none" stroke="#cbd0bf"/><path d="M235 750V492a305 305 0 01610 0v258Z" fill="#e1e6d6" stroke="#b7c1a5"/><circle cx="540" cy="492" r="245" fill="none" stroke="#bcc5ad"/><path d="M105 1260H975" stroke="#cbd0bf"/>${elements}</svg>`;
}
export async function makePNG(data){
  await Promise.all([document.fonts.load('32px "Zhaojian WenKai"',data.person.quote.text),document.fonts.load('100px "Zhaojian Brush"',data.person.name+data.person.seal)]);
  const canvas=document.createElement('canvas');canvas.width=1080;canvas.height=1440;const ctx=canvas.getContext('2d');if(!ctx)throw new Error('浏览器不支持 PNG 导出');
  ctx.fillStyle='#f3f0e7';ctx.fillRect(0,0,1080,1440);ctx.strokeStyle='#cbd0bf';ctx.strokeRect(55,55,970,1330);
  ctx.beginPath();ctx.moveTo(235,750);ctx.lineTo(235,492);ctx.arc(540,492,305,Math.PI,0);ctx.lineTo(845,750);ctx.closePath();ctx.fillStyle='#e1e6d6';ctx.fill();ctx.strokeStyle='#b7c1a5';ctx.stroke();
  ctx.beginPath();ctx.arc(540,492,245,0,Math.PI*2);ctx.strokeStyle='#bcc5ad';ctx.stroke();
  ctx.beginPath();ctx.moveTo(105,1260);ctx.lineTo(975,1260);ctx.strokeStyle='#cbd0bf';ctx.stroke();
  for(const t of layout(data)){ctx.fillStyle=t.color;ctx.textAlign=t.align||'center';ctx.font=`${t.size}px "${t.brush?'Zhaojian Brush':'Zhaojian WenKai'}",serif`;ctx.fillText(t.text,t.x,t.y,880);}
  return new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(new Error('PNG 生成失败')),'image/png'));
}
