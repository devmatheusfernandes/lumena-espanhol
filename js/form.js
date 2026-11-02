// Lista de espera (MOCK): salva no localStorage. Na versão real, enviaria para um backend/planilha.
const LEADS_KEY='lumena_leads';
const OPTS={
 nivel:['Iniciante - Nenhuma base','Básico','Intermediário','Intermediário - Avançado'],
 horario:['Manhã (8h–10h)','Manhã (10h–12h)','Tarde (12h–15h)','Tarde (15h–18h)','Noite (18h–20h)','Noite (20h–22h)'],
 objetivo:['Viagem','Trabalho','Estudo','Prova de Proficiência (SIELE, DELE, DUCLE)','Desenvolvimento Pessoal']
};
const radios=(n,l)=>l.map((v,i)=>`<label><input type="radio" name="${n}" value="${v}" ${i?'':'required'}><span>${v}</span></label>`).join('');
const TPL=()=>`
<div class="formcard">
 <div class="progress"><i></i></div>
 <form novalidate>
  <div class="fgrid">
   <div class="field full"><label>Nome completo</label><input type="text" name="nome" required autocomplete="name" placeholder="Como você se chama?"></div>
   <div class="field full"><span class="lbl">Seu nível de espanhol</span><div class="opts">${radios('nivel',OPTS.nivel)}</div></div>
   <div class="field full"><span class="lbl">Melhor horário para estudar</span><div class="opts">${radios('horario',OPTS.horario)}</div></div>
   <div class="field full"><label>Melhor dia para estudar</label><input type="text" name="dia" required placeholder="Ex.: terças e quintas"></div>
   <div class="field full"><span class="lbl">Seu objetivo principal</span><div class="opts">${radios('objetivo',OPTS.objetivo)}</div></div>
   <div class="field full"><label>Instagram ou WhatsApp para contato</label><input type="text" name="contato" required placeholder="@seuinstagram ou (11) 90000-0000"></div>
   <div class="field full"><label>Por que escolheu o Lumena? <small style="font-weight:400;color:var(--muted)">(opcional)</small></label><textarea name="motivo"></textarea></div>
  </div>
  <p class="err" role="alert" hidden style="margin-top:14px">Falta preencher alguns campos acima.</p>
  <div style="margin-top:26px;display:flex;gap:16px;align-items:center;flex-wrap:wrap"><button class="btn" type="submit">Garantir minha vaga</button><small style="color:var(--muted)">Leva menos de 1 minuto. Sem compromisso.</small></div>
 </form>
 <div class="ok"><svg width="64" height="64" viewBox="0 0 56 56" fill="none"><circle class="ring" cx="28" cy="28" r="26" stroke="#27402f" stroke-width="3"/><path class="tick" d="M16 29l8 8 16-17" stroke="#27402f" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
 <h3>¡Listo! Você está na lista.</h3><p style="color:var(--ink-2);margin-top:10px">A Lúmena vai entrar em contato pelo Instagram ou WhatsApp que você deixou.</p></div>
</div>`;
document.querySelectorAll('[data-lead-form]').forEach(host=>{
 host.innerHTML=TPL();
 const f=host.querySelector('form'),bar=host.querySelector('.progress i'),ok=host.querySelector('.ok'),err=host.querySelector('.err');
 const req=['nome','nivel','horario','dia','objetivo','contato'];
 const upd=()=>{const d=new FormData(f);bar.style.width=(req.filter(k=>(d.get(k)||'').trim()).length/req.length*100)+'%'};
 f.addEventListener('input',upd);f.addEventListener('change',upd);
 f.addEventListener('submit',e=>{e.preventDefault();const d=Object.fromEntries(new FormData(f));
  if(req.some(k=>!(d[k]||'').trim())){err.hidden=false;return}
  err.hidden=true;
  let all=[];try{all=JSON.parse(localStorage.getItem(LEADS_KEY)||'[]')}catch{}
  all.unshift({id:'L'+Date.now(),createdAt:new Date().toISOString(),status:'novo',notas:'',...d});
  try{localStorage.setItem(LEADS_KEY,JSON.stringify(all))}catch{}
  f.hidden=true;host.querySelector('.progress').hidden=true;ok.classList.add('show');
 });
});
