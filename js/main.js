(()=>{
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const nav=$('.nav');
addEventListener('scroll',()=>{nav&&nav.classList.toggle('solid',scrollY>30);const m=$('.mcta');if(m)m.classList.toggle('show',scrollY>500&&!document.body.classList.contains('at-form'))},{passive:true});
// reveal
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.15});
$$('.rv').forEach((el,i)=>{el.style.setProperty('--d',(el.dataset.d||0)+'s');io.observe(el)});
// hide sticky cta when form visible
const fm=$('#lista');if(fm)new IntersectionObserver(e=>document.body.classList.toggle('at-form',e[0].isIntersecting),{threshold:.1}).observe(fm);
// rotating word
const sw=$('.swap');
if(sw){const words=JSON.parse(sw.dataset.words);let i=0;const s=document.createElement('span');s.textContent=words[0];sw.replaceChildren(s);
setInterval(()=>{s.className='out';setTimeout(()=>{i=(i+1)%words.length;s.textContent=words[i];s.className='in';requestAnimationFrame(()=>requestAnimationFrame(()=>s.className=''))},400)},2600)}
// flips (tap on touch)
$$('.flip').forEach(f=>f.addEventListener('click',()=>f.classList.toggle('on')));
// chips
const out=$('.chipout');
if(out){$$('.chip').forEach(c=>c.addEventListener('click',()=>{$$('.chip').forEach(x=>x.classList.remove('on'));c.classList.add('on');out.style.opacity=0;setTimeout(()=>{out.textContent=c.dataset.msg;out.style.opacity=1},180)}));$('.chip')?.click()}
})();
