const preference=matchMedia('(prefers-reduced-motion: reduce)');
const ease='cubic-bezier(.16,1,.3,1)';
export function openMotionDialog(dialog){
 if(preference.matches)return;
 dialog.animate([{opacity:0,transform:'translateY(26px) scale(.96)',clipPath:'inset(5% 2% 5% 2% round 18px)'},{opacity:1,transform:'translateY(0) scale(1)',clipPath:'inset(0 round 0px)'}],{duration:480,easing:ease});
 const nodes=dialog.querySelectorAll('.detail-title,.detail-desc,.detail-meta,.detail-block,.detail-gallery,.detail-actions');
 nodes.forEach((node,i)=>node.animate([{opacity:0,transform:'translateY(16px)'},{opacity:1,transform:'translateY(0)'}],{duration:460,delay:Math.min(i*45,250)+70,easing:ease,fill:'backwards'}));
}
export async function closeMotionDialog(dialog){
 if(preference.matches)return;
 try{await dialog.animate([{opacity:1,transform:'translateY(0) scale(1)'},{opacity:0,transform:'translateY(15px) scale(.98)'}],{duration:180,easing:'ease-in'}).finished;}catch{}
}
export function initMotion(){
 const root=document.documentElement,bar=document.createElement('div');bar.className='reading-progress';bar.setAttribute('aria-hidden','true');document.body.append(bar);
 const hero=document.querySelector('.hero'),scene=document.querySelector('.hero-stage');let scrollFrame=0;
 const update=()=>{scrollFrame=0;const height=root.scrollHeight-innerHeight;bar.style.transform='scaleX('+(height>0?scrollY/height:0)+')';root.classList.toggle('has-scrolled',scrollY>24);
  if(!preference.matches&&hero.getBoundingClientRect().bottom>0)scene.style.setProperty('--portrait-y',Math.min(scrollY*.065,24)+'px');};
 addEventListener('scroll',()=>{if(!scrollFrame)scrollFrame=requestAnimationFrame(update);},{passive:true});addEventListener('resize',update,{passive:true});update();
 // Pointer effects are limited to precise pointers; touch scrolling remains native.
 const fine=matchMedia('(hover: hover) and (pointer: fine)');let current=null,frame=0,point=null;
 document.addEventListener('pointermove',event=>{
  if(!fine.matches||preference.matches)return;
  const target=event.target.closest('.cover,.shot,.hero-stage');
  if(current!==target){if(current)reset(current);current=target;}if(!target)return;
  point={x:event.clientX,y:event.clientY};if(!frame)frame=requestAnimationFrame(()=>{frame=0;if(!current||!point)return;const r=current.getBoundingClientRect(),x=(point.x-r.left)/r.width,y=(point.y-r.top)/r.height;
   current.style.setProperty('--tilt-x',(Math.max(-1,Math.min(1,.5-y))*5)+'deg');current.style.setProperty('--tilt-y',(Math.max(-1,Math.min(1,x-.5))*5)+'deg');current.style.setProperty('--light-x',x*100+'%');current.style.setProperty('--light-y',y*100+'%');current.classList.add('pointer-active');});
 },{passive:true});
 const reset=el=>{el.style.setProperty('--tilt-x','0deg');el.style.setProperty('--tilt-y','0deg');el.classList.remove('pointer-active');};
 document.addEventListener('pointerout',event=>{if(current&&!current.contains(event.relatedTarget)){reset(current);current=null;}});
 addEventListener('blur',()=>{if(current)reset(current);current=null;});
 preference.addEventListener('change',()=>{if(current)reset(current);scene.style.setProperty('--portrait-y','0px');});
 // Stop ambient illustration movement when it is out of view or the tab is hidden.
 let visible=true;const pause=()=>scene.classList.toggle('motion-paused',!visible||document.hidden);
 if('IntersectionObserver'in window)new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;pause();}).observe(scene);
 document.addEventListener('visibilitychange',pause);
}
