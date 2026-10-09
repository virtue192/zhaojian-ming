// Original brush-nib cursor. Artwork and coordinates never intercept native input.
export function setupPointer(){
  const fine=matchMedia('(pointer:fine)'),reduce=matchMedia('(prefers-reduced-motion:reduce)');
  const layer=document.createElement('div');layer.className='zj-pointer-layer';layer.setAttribute('aria-hidden','true');
  const glow=document.createElement('span');glow.className='zj-pointer-glow';
  const glyph=document.createElement('span');glyph.className='zj-pointer-glyph';
  glyph.innerHTML='<svg viewBox="0 0 36 44" xmlns="http://www.w3.org/2000/svg"><path d="M3 3 28 14 21 20 17 36 13 28 3 3Z" fill="#52634a" stroke="#fff8e7" stroke-width="1.25" stroke-linejoin="round"/><path d="M3 3 17 24M17 24 21 20" fill="none" stroke="#d9cda7" stroke-width="1.1" stroke-linecap="round"/><path d="M3 3 10 7 7 12Z" fill="#a14b37"/><circle cx="17" cy="24" r="1.8" fill="#a14b37"/></svg>';
  const ring=document.createElement('span');ring.className='zj-pointer-ring';layer.append(glow,ring,glyph);document.body.append(layer);
  const effects=new Set();let active=false,frame=0,targetX=0,targetY=0,lightX=0,lightY=0,last=0,surface=null;
  const allowed=()=>fine.matches&&!reduce.matches&&!document.body.classList.contains('motion-off')&&!document.hidden;
  const nativeTarget=target=>!(target instanceof Element)||!!target.closest('input,textarea,select,option,dialog,button:disabled,[contenteditable="true"],[data-native-cursor]');
  function reset(){active=false;layer.classList.remove('active','interactive','pressed');if(document.body.classList.contains('zj-pointer-active'))document.body.classList.remove('zj-pointer-active');surface?.classList.remove('zj-pointer-lit');surface=null;cancelAnimationFrame(frame);frame=0;for(const effect of effects){effect.animation.cancel();effect.node.remove();}effects.clear();}
  function follow(now){if(!active)return;const dt=Math.min(now-last||16,48);last=now;const smoothing=1-Math.exp(-dt/80);lightX+=(targetX-lightX)*smoothing;lightY+=(targetY-lightY)*smoothing;glow.style.transform=`translate3d(${lightX}px,${lightY}px,0)`;if(Math.abs(targetX-lightX)+Math.abs(targetY-lightY)>.15)frame=requestAnimationFrame(follow);else frame=0;}
  function move(event){
    if(!allowed()||event.pointerType!=='mouse'||nativeTarget(event.target)){reset();return;}
    const first=!active;active=true;targetX=event.clientX;targetY=event.clientY;
    glyph.style.transform=`translate3d(${targetX-2}px,${targetY-2}px,0)`;ring.style.transform=`translate3d(${targetX}px,${targetY}px,0)`;
    const interactive=!!event.target.closest('a,button,summary,.option-card,[role="button"]');layer.classList.toggle('interactive',interactive);layer.classList.add('active');document.body.classList.add('zj-pointer-active');
    if(first){lightX=targetX;lightY=targetY;glow.style.transform=`translate3d(${lightX}px,${lightY}px,0)`;last=performance.now();}
    if(!frame)frame=requestAnimationFrame(follow);
    const next=event.target.closest('.event-card,.person-card,.option-card,.dossier,.result-portrait,.closing,.reason-card');
    if(surface!==next){surface?.classList.remove('zj-pointer-lit');surface=next;surface?.classList.add('zj-pointer-lit');}
    if(surface){const rect=surface.getBoundingClientRect();surface.style.setProperty('--px',`${targetX-rect.left}px`);surface.style.setProperty('--py',`${targetY-rect.top}px`);}
  }
  function pulse(event){
    move(event);if(!active||event.button!==0)return;layer.classList.add('pressed');
    const node=document.createElement('span');node.className='zj-ink-pulse';node.style.left=`${event.clientX}px`;node.style.top=`${event.clientY}px`;node.innerHTML='<i></i><i></i><i></i>';layer.append(node);
    const animation=node.animate([{opacity:.6,transform:'translate(-50%,-50%) scale(.3) rotate(-12deg)'},{opacity:.24,offset:.4,transform:'translate(-50%,-50%) scale(1) rotate(-5deg)'},{opacity:0,transform:'translate(-50%,-50%) scale(1.65) rotate(0deg)'}],{duration:520,easing:'cubic-bezier(.2,.7,.3,1)'});
    const effect={node,animation};effects.add(effect);animation.finished.catch(()=>{}).finally(()=>{node.remove();effects.delete(effect);});
    if(effects.size>8){const oldest=effects.values().next().value;oldest.animation.cancel();oldest.node.remove();effects.delete(oldest);}
  }
  document.addEventListener('pointermove',move,{passive:true});document.addEventListener('pointerdown',pulse,{passive:true});document.addEventListener('pointerup',()=>layer.classList.remove('pressed'),{passive:true});
  document.addEventListener('pointerleave',reset);document.addEventListener('pointercancel',reset);document.addEventListener('visibilitychange',()=>{if(document.hidden)reset();});
  document.addEventListener('keydown',event=>{if(event.key==='Tab'||event.key==='Escape')reset();});
  window.addEventListener('blur',reset);window.addEventListener('scroll',reset,{passive:true});window.addEventListener('resize',reset);window.addEventListener('pagehide',reset);
  fine.addEventListener('change',reset);reduce.addEventListener('change',reset);
  new MutationObserver(()=>{if(!allowed()||document.querySelector('dialog[open]'))reset();}).observe(document.body,{attributes:true,attributeFilter:['class'],subtree:false});
  document.querySelectorAll('dialog').forEach(d=>new MutationObserver(()=>{if(d.open)reset();}).observe(d,{attributes:true,attributeFilter:['open']}));
}
