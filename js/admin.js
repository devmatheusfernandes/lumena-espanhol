const KEY='lumena_leads',SESS='lumena_admin';
const STATUS={novo:'Novo',contatado:'Contatado',experimental:'Aula experimental',matriculado:'Matriculado',arquivado:'Arquivado'};
const $=s=>document.querySelector(s);
const seed=()=>{const d=n=>new Date(Date.now()-n*36e5).toISOString();
const rows=[
['Mariana Duarte','Básico','Noite (18h–20h)','segundas e quartas','Viagem','@mari.duarte','Quero ir ao Chile em março.','novo',3],
['Rafael Oliveira','Intermediário','Manhã (8h–10h)','terças e quintas','Trabalho','(11) 98877-1020','Minha empresa tem filial em Bogotá.','novo',9],
['Camila Ferraz','Iniciante - Nenhuma base','Noite (20h–22h)','sábados','Desenvolvimento Pessoal','@camilaferraz','Sigo vocês há anos.','contatado',30],
['Lucas Pimentel','Intermediário - Avançado','Tarde (15h–18h)','sextas','Prova de Proficiência (SIELE, DELE, DUCLE)','@lucaspim','Prova do DELE B2 em maio.','experimental',55],
['Beatriz Nogueira','Básico','Noite (18h–20h)','terças','Estudo','(21) 99111-4040','','novo',70],
['Thiago Ramos','Iniciante - Nenhuma base','Manhã (10h–12h)','quartas','Viagem','@thiagoramos','','contatado',96],
['Ana Paula Lima','Intermediário','Tarde (12h–15h)','segundas','Trabalho','@anapaulalima','','matriculado',140],
['Gustavo Reis','Básico','Noite (20h–22h)','quintas','Desenvolvimento Pessoal','(31) 98800-2211','Amo as séries argentinas.','novo',150],
['Isabela Moura','Intermediário - Avançado','Manhã (8h–10h)','sextas','Prova de Proficiência (SIELE, DELE, DUCLE)','@isamoura','','arquivado',200],
['Pedro Henrique','Iniciante - Nenhuma base','Noite (18h–20h)','terças e quintas','Estudo','@pedrohsc','','novo',24]];
return rows.map((r,i)=>({id:'S'+i,createdAt:d(r[8]),nome:r[0],nivel:r[1],horario:r[2],dia:r[3],objetivo:r[4],contato:r[5],motivo:r[6],status:r[7],notas:''}))};
const load=()=>{let cur=[];try{cur=JSON.parse(localStorage.getItem(KEY)||'[]')}catch{}
 let seeded=false;try{seeded=localStorage.getItem('lumena_seeded')}catch{}
 if(!seeded){cur=cur.concat(seed());try{localStorage.setItem('lumena_seeded','1')}catch{}save(cur)}
 return cur.sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt))};
const save=l=>{try{localStorage.setItem(KEY,JSON.stringify(l))}catch{}};
let leads=[];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=iso=>{const m=(Date.now()-new Date(iso))/6e4;return m<60?`${Math.max(1,~~m)} min`:m<1440?`${~~(m/60)} h`:`${~~(m/1440)} d`};
const short=o=>o.startsWith('Prova')?'Prova (SIELE/DELE)':o;
function link(c){const t=c.trim();if(t.startsWith('@'))return`https://instagram.com/${t.slice(1)}`;const n=t.replace(/\D/g,'');return n.length>=8?`https://wa.me/55${n.replace(/^55/,'')}`:null}
function fill(sel,vals,first){const el=$(sel);vals.forEach(v=>el.insertAdjacentHTML('beforeend',`<option value="${esc(v[0])}">${esc(v[1])}</option>`))}
function render(){
 $('#s1').textContent=leads.length;$('#s2').textContent=leads.filter(l=>l.status==='novo').length;$('#s3').textContent=leads.filter(l=>l.status==='experimental').length;$('#s4').textContent=leads.filter(l=>l.status==='matriculado').length;
 const cnt={};leads.forEach(l=>cnt[l.objetivo]=(cnt[l.objetivo]||0)+1);const mx=Math.max(1,...Object.values(cnt));
 $('#dist').innerHTML=Object.entries(cnt).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`<div><span>${esc(short(k))}</span><i data-w="${v/mx*100}"></i><b>${v}</b></div>`).join('');
 requestAnimationFrame(()=>document.querySelectorAll('#dist i').forEach(i=>i.style.width=i.dataset.w+'%'));
 const q=$('#q').value.toLowerCase(),fs=$('#fs').value,fn=$('#fn').value,fo=$('#fo').value;
 const rows=leads.filter(l=>(!q||(l.nome+l.contato).toLowerCase().includes(q))&&(!fs||l.status===fs)&&(!fn||l.nivel===fn)&&(!fo||l.objetivo===fo));
 $('#tb').innerHTML=rows.map(l=>`<tr class="row" data-id="${esc(l.id)}"><td><b>${esc(l.nome)}</b><small>${esc(l.contato)}</small></td><td>${esc(l.nivel)}</td><td class="hm">${esc(short(l.objetivo))}</td><td class="hm">${esc(l.horario)}<small>${esc(l.dia)}</small></td><td><span class="pill s-${esc(l.status)}">${STATUS[l.status]||esc(l.status)}</span></td><td class="hm">${fmt(l.createdAt)}</td></tr>`).join('');
 $('#empty').hidden=rows.length>0;
}
function open(id){const l=leads.find(x=>x.id===id);if(!l)return;const u=link(l.contato);
 $('#dr').innerHTML=`<button class="btn sm ghost noarrow" id="x" style="float:right">Fechar</button><h2 style="font-size:2rem;margin:10px 0 6px">${esc(l.nome)}</h2><span class="pill s-${esc(l.status)}">${STATUS[l.status]}</span>
 <div class="kv"><b>Contato</b>${esc(l.contato)}</div><div class="kv"><b>Nível</b>${esc(l.nivel)}</div><div class="kv"><b>Objetivo</b>${esc(l.objetivo)}</div><div class="kv"><b>Disponibilidade</b>${esc(l.horario)} · ${esc(l.dia)}</div><div class="kv"><b>Por que escolheu o Lumena</b>${esc(l.motivo)||'<i style="color:var(--muted)">Não informado</i>'}</div>
 <div class="field" style="margin:18px 0"><label>Status</label><select id="st">${Object.entries(STATUS).map(([k,v])=>`<option value="${k}" ${k===l.status?'selected':''}>${v}</option>`).join('')}</select></div>
 <div class="field"><label>Anotações privadas</label><textarea id="nt">${esc(l.notas)}</textarea></div>
 <div style="display:flex;gap:10px;margin-top:20px;flex-wrap:wrap">${u?`<a class="btn sm" href="${u}" target="_blank" rel="noopener">Chamar</a>`:''}<button class="btn sm ghost noarrow" id="sv">Salvar</button><button class="btn sm ghost noarrow" id="dl" style="margin-left:auto;color:var(--terra-d)">Excluir</button></div>`;
 $('#dr').classList.add('open');$('#scrim').classList.add('on');
 $('#x').onclick=close;
 $('#sv').onclick=()=>{l.status=$('#st').value;l.notas=$('#nt').value;save(leads);render();close()};
 $('#dl').onclick=()=>{if(confirm('Excluir este contato?')){leads=leads.filter(x=>x!==l);save(leads);render();close()}};
}
function close(){$('#dr').classList.remove('open');$('#scrim').classList.remove('on')}
function csv(){const h=['Data','Nome','Contato','Nível','Horário','Dia','Objetivo','Motivo','Status','Notas'];
 const q=v=>`"${String(v??'').replace(/"/g,'""').replace(/^([=+\-@])/,"'$1")}"`;
 const b=[h.map(q).join(',')].concat(leads.map(l=>[l.createdAt,l.nome,l.contato,l.nivel,l.horario,l.dia,l.objetivo,l.motivo,STATUS[l.status],l.notas].map(q).join(','))).join('\n');
 const a=document.createElement('a');a.href=URL.createObjectURL(new Blob(['﻿'+b],{type:'text/csv'}));a.download='lista-de-espera-lumena.csv';a.click()}
function start(){$('#login').hidden=true;$('#app').hidden=false;leads=load();
 fill('#fs',Object.entries(STATUS));fill('#fn',['Iniciante - Nenhuma base','Básico','Intermediário','Intermediário - Avançado'].map(x=>[x,x]));fill('#fo',['Viagem','Trabalho','Estudo','Prova de Proficiência (SIELE, DELE, DUCLE)','Desenvolvimento Pessoal'].map(x=>[x,short(x)]));
 ['#q','#fs','#fn','#fo'].forEach(s=>$(s).addEventListener('input',render));render()}
$('#lf').onsubmit=e=>{e.preventDefault();if($('#pw').value==='lumena'){try{sessionStorage.setItem(SESS,'1')}catch{}start()}else $('#le').hidden=false};
$('#out').onclick=e=>{e.preventDefault();try{sessionStorage.removeItem(SESS)}catch{}location.reload()};
$('#tb').onclick=e=>{const r=e.target.closest('tr');if(r)open(r.dataset.id)};
$('#scrim').onclick=close;$('#csv').onclick=csv;addEventListener('keydown',e=>e.key==='Escape'&&close());
try{if(sessionStorage.getItem(SESS))start()}catch{}
