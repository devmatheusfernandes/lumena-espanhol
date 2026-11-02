// Lista de espera em formato wizard (MOCK): salva no localStorage.
// Na versão real, enviaria para um backend/planilha.
const LEADS_KEY='lumena_leads';
const STEPS=[
 {k:'nome',t:'text',q:'Primeiro, como você se chama?',ph:'Nome completo',ac:'name'},
 {k:'nivel',t:'choice',q:'Qual é o seu nível de espanhol?',o:['Iniciante - Nenhuma base','Básico','Intermediário','Intermediário - Avançado']},
 {k:'objetivo',t:'choice',q:'Qual é o seu objetivo principal?',o:['Viagem','Trabalho','Estudo','Prova de Proficiência (SIELE, DELE, DUCLE)','Desenvolvimento Pessoal']},
 {k:'horario',t:'choice',q:'Qual o melhor horário para você estudar?',o:['Manhã (8h–10h)','Manhã (10h–12h)','Tarde (12h–15h)','Tarde (15h–18h)','Noite (18h–20h)','Noite (20h–22h)'],grid:true},
 {k:'dia',t:'text',q:'E o melhor dia da semana?',ph:'Ex.: terças e quintas'},
 {k:'contato',t:'text',q:'Como a Lúmena fala com você?',ph:'@seuinstagram ou (11) 90000-0000',hint:'Deixe seu Instagram ou WhatsApp.'},
 {k:'motivo',t:'area',q:'Por que escolheu o Lúmena?',ph:'Conte em poucas palavras (opcional)',opt:true}
];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
document.querySelectorAll('[data-lead-form]').forEach(host=>{
 const data={};let i=0,dir=1;
 host.innerHTML=`<div class="formcard wiz">
  <div class="wiz-top"><button type="button" class="wiz-back" aria-label="Voltar">←</button><div class="progress"><i></i></div><span class="wiz-count"></span></div>
  <div class="wiz-body" aria-live="polite"></div>
  <div class="wiz-foot"><p class="err" role="alert" hidden></p><button type="button" class="btn wiz-next">Continuar</button></div>
  <div class="ok"><svg width="64" height="64" viewBox="0 0 56 56" fill="none"><circle class="ring" cx="28" cy="28" r="26" stroke="#27402f" stroke-width="3"/><path class="tick" d="M16 29l8 8 16-17" stroke="#27402f" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
  <h3>¡Listo! Você está na lista.</h3><p style="color:var(--ink-2);margin-top:10px">A Lúmena vai entrar em contato pelo Instagram ou WhatsApp que você deixou.</p></div></div>`;
 const $=s=>host.querySelector(s),body=$('.wiz-body'),bar=$('.progress i'),cnt=$('.wiz-count'),back=$('.wiz-back'),next=$('.wiz-next'),err=$('.err');
 function show(){
  const s=STEPS[i];err.hidden=true;
  bar.style.width=(i/STEPS.length*100)+'%';cnt.textContent=`${i+1}/${STEPS.length}`;back.style.visibility=i?'visible':'hidden';
  next.textContent=i===STEPS.length-1?'Garantir minha vaga':(s.opt?'Pular ou continuar':'Continuar');
  next.style.display=s.t==='choice'?'none':'';
  let inner='';
  if(s.t==='choice')inner=`<div class="opts big ${s.grid?'two':''}">${s.o.map(v=>`<button type="button" class="opt${data[s.k]===v?' sel':''}" data-v="${esc(v)}">${esc(v)}</button>`).join('')}</div>`;
  else if(s.t==='area')inner=`<textarea placeholder="${esc(s.ph)}">${esc(data[s.k]||'')}</textarea>`;
  else inner=`<input type="text" placeholder="${esc(s.ph)}" value="${esc(data[s.k]||'')}" ${s.ac?`autocomplete="${s.ac}"`:''}>${s.hint?`<small class="hint">${esc(s.hint)}</small>`:''}`;
  body.innerHTML=`<div class="wiz-step ${dir>0?'fwd':'bwd'}"><h3>${esc(s.q)}</h3>${inner}</div>`;
  const f=body.querySelector('input,textarea');if(f&&(matchMedia('(min-width:700px)').matches||i>0))setTimeout(()=>f.focus({preventScroll:true}),350);
  if(f&&s.t==='text')f.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();go()}});
  body.querySelectorAll('.opt').forEach(b=>b.addEventListener('click',()=>{data[s.k]=b.dataset.v;body.querySelectorAll('.opt').forEach(x=>x.classList.toggle('sel',x===b));setTimeout(()=>{dir=1;advance()},260)}));
 }
 function advance(){i++;if(i>=STEPS.length)return finish();show()}
 function go(){
  const s=STEPS[i];const f=body.querySelector('input,textarea');
  if(f)data[s.k]=f.value.trim();
  if(!s.opt&&!data[s.k]){err.textContent='Preencha este campo para continuar.';err.hidden=false;f&&f.focus();return}
  dir=1;advance();
 }
 function finish(){
  let all=[];try{all=JSON.parse(localStorage.getItem(LEADS_KEY)||'[]')}catch{}
  all.unshift({id:'L'+Date.now(),createdAt:new Date().toISOString(),status:'novo',notas:'',...data});
  try{localStorage.setItem(LEADS_KEY,JSON.stringify(all))}catch{}
  bar.style.width='100%';body.hidden=true;next.hidden=true;back.style.visibility='hidden';cnt.textContent='';$('.ok').classList.add('show');
 }
 next.addEventListener('click',go);
 back.addEventListener('click',()=>{if(i>0){const s=STEPS[i],f=body.querySelector('input,textarea');if(f)data[s.k]=f.value.trim();dir=-1;i--;show()}});
 show();
});
