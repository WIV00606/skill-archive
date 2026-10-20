const TITLES=()=>({ur:'UR Skills',plus:'UR+ Exclusive Passive',mr:'MR Revelation Skill',will:'IR Incarnation',relic:D().relicName});
const boostLabel={mr:'Revelation Skill Boost',will:"Creator's Will Enhancement"};
let char='scorpio',current='ur',jumped=null,query='';
const D=()=>CHARACTERS[char],SK=()=>D().skills;
const panel=document.querySelector('#skill-panel'),heading=document.querySelector('#panel-heading'),search=document.querySelector('#search');
const escape=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const STATUS_NAMES=new Set();(function collect(v){if(typeof v!=='string'){if(Array.isArray(v))v.forEach(collect);else if(v&&typeof v==='object')Object.values(v).forEach(collect);return;}const re=/\[([^\[\]]+?)\]/g;let m;while((m=re.exec(v))!==null)STATUS_NAMES.add(m[1].trim());})(CHARACTERS);
function format(s){return escape(s).replace(/\[([^\[\]]+?)\]/g,(m,n)=>{const t=escape(n.trim());return STATUS_NAMES.has(n.trim())?`<span class="status-word">${t}</span>`:`[${t}]`;}).replace(/\b\d+(?:\.\d+)?%/g,'<strong class="num">$&</strong>');}
const paras=v=>[].concat(v).map(p=>`<p>${format(p)}</p>`).join('');
function card(name,body,type,icon,tag='',extra='',sub=''){return `<article class="skill-card"><div class="skill-top"><div class="skill-icon" aria-hidden="true">${icon}</div><div class="skill-meta"><small>${type}</small><h3>${name}</h3>${sub?`<span class="skill-sub">${sub}</span>`:''}</div>${tag?`<span class="tag">${tag}</span>`:''}</div>${extra}<div class="skill-body">${body}</div></article>`;}
function advanced(key){const d=SK()[key],T=TITLES();
let body=paras(d.effect)
+`<div class="panel-heading level-head"><strong>Star-Up Effect</strong><span>${boostLabel[key]}</span></div><div class="level-list">`
+d.levels.map((l,i)=>`<div class="level-row" data-level="${i+1}"><span class="level">${l.level}</span><div><p><b>Attribute Bonus</b> ${format(l.attr)}</p><p><b>${boostLabel[key]}</b> ${format(l.boost)}</p></div></div>`).join('')
+`</div><div class="panel-heading level-head"><strong>${d.max.label}</strong><span>Full skill text</span></div><div class="max-block">`
+paras(d.max.effect)+d.max.passives.map(p=>`<p>${format(p)}</p>`).join('')+`</div>`;
return card(T[key],body,key==='mr'?'MR Revelation':'IR Incarnation',key==='mr'?'✧':'♜',d.tag,`<div class="resource-bar"><span>${d.resource}</span><span>${d.cost}</span></div>`,d.name);}
function content(key){const sk=SK();if(key==='ur'){return sk.ur.slice(0,2).map((s,i)=>card(s.name,`<p>${format(s.body)}</p>`,s.type,[D().zodiac,'☽'][i],s.tag)).join('')+'<div class="panel-heading"><strong>Attribute passives</strong><span>UR bonuses</span></div><div class="passive-grid">'+sk.ur.slice(2).map((s,i)=>card(s.name,format(s.body),'Passive',['◇','✦','⛨','♜'][i])).join('')+'</div>';}
if(key==='plus')return card(sk.plus.name,`<p>${format(sk.plus.body)}</p>`,'Exclusive passive',D().zodiac,'UR+');
if(key==='relic')return sk.relic.map((s,i)=>{let [level,body]=s.split(': ');return card(level,`<p>${format(body)}</p>`,D().relicName,['◇','✧','✦'][i],['Lv. 30','Lv. 60','Lv. 90'][i]);}).join('');return advanced(key);}
function render(){const q=query;const T=TITLES();document.querySelectorAll('[data-tab]').forEach(b=>{b.setAttribute('aria-selected',String(!q&&b.dataset.tab===current));b.tabIndex=(!q&&b.dataset.tab===current)?0:-1;});if(q){const keys=Object.keys(T).filter(key=>(T[key]+' '+JSON.stringify(SK()[key])).toLowerCase().includes(q));heading.innerHTML=`<strong>Search results</strong><span>${keys.length} matching categories</span>`;panel.innerHTML=keys.length?keys.map(key=>`<div class="panel-heading"><strong>${T[key]}</strong></div>${content(key)}`).join(''):'<div class="empty">No matching skills. Try “Venom”, “HP” or “HEAL”.</div>';return;}
heading.innerHTML=`<strong>${T[current]}</strong><span>${current==='ur'?'2 skills · 4 attribute passives':current==='relic'?'Exclusive relic · Awakening':current==='plus'?'Single passive':'Star-Up Effect · +1 → +5'}</span>`;panel.innerHTML=content(current);}
const JUMP_CATS=[['plus',/ur\+ passive|exclusive passive|ur\+|ur plus|\bpassive\b/],['ur',/ur skills?|ur skill|\bur\b/],['mr',/mr revelation|\bmr\d?\b|revelation/],['will',/ir incarnation|creator'?s will|creator will|\bir\b|incarnation|\bwill\b/],['relic',/golden scales|amethyst scorpion|\brelic\b|awakening|scales|scorpion/]];
function parseJump(v){const s=v.toLowerCase().replace(/[’']/g,"'").replace(/\s+/g,' ').trim();if(!s)return null;
let rest=s;
const c=Object.keys(CHARACTERS).find(k=>new RegExp('\\b'+k+'\\b').test(s));
if(c)rest=rest.replace(new RegExp('\\b'+c+'\\b'),' ');
let cat=null;for(const [key,re] of JUMP_CATS){const m=rest.match(re);if(m){cat=key;rest=rest.replace(m[0],' ');break;}}
let level=null;const lm=rest.match(/\bstar\s*\+?\s*([1-5])(?!\d)/)||rest.match(/\+\s*([1-5])(?!\d)/)||((cat==='mr'||cat==='will')?rest.match(/(?:^|\s)([1-5])(?:\s|$)/):null);
if(lm){level=Number(lm[1]);rest=rest.replace(lm[0],' ');}
rest=rest.replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
if(!c&&!cat&&!level)return null;
return {char:c,cat,level,rest};}
function flashLevel(n){const row=[...document.querySelectorAll('.level-row')].find(r=>r.dataset.level===String(n));if(!row)return;row.classList.remove('flash');void row.offsetWidth;row.classList.add('flash');row.scrollIntoView({behavior:'smooth',block:'center'});}
const pop=document.querySelector('#search-pop'),sugList=pop.querySelector('ul');
const TARGETS=(()=>{const out=[];for(const ch of Object.keys(CHARACTERS)){const cap=ch[0].toUpperCase()+ch.slice(1),cats=[['ur','UR Skills'],['plus','UR+ Passive'],['mr','MR Revelation'],['will','IR Incarnation'],['relic',CHARACTERS[ch].relicName]];for(const [cat,lbl] of cats){out.push({key:`${cap} ${lbl}`,alt:`${cap} ${cat.toUpperCase()}`,char:ch,cat,level:null});if(cat==='mr'||cat==='will'){for(let n=1;n<=5;n++)out.push({key:cat==='mr'?`${cap} MR+${n}`:`${cap} Incarnation Star +${n}`,alt:cat==='mr'?`${cap} MR +${n}`:`${cap} IR+${n}`,char:ch,cat,level:n});}}}return out;})();
const nkey=k=>k.replace(/\s*\+\s*/g,'+').replace(/\s+/g,' ').trim().toLowerCase();
const tKeys=t=>[t.key,t.alt];
let sugItems=[],sugIndex=0;
function markUp(label,q){if(!q)return escape(label);const i=label.toLowerCase().indexOf(q.toLowerCase());return i<0?escape(label):escape(label.slice(0,i))+`<mark>${escape(label.slice(i,i+q.length))}</mark>`+escape(label.slice(i+q.length));}
function closeSug(){pop.classList.remove('show');search.setAttribute('aria-expanded','false');sugItems=[];sugIndex=0;}
function openSug(){const raw=search.value.trim();if(!raw){closeSug();return;}
const q=raw.toLowerCase(),nq=nkey(raw),hits=TARGETS.filter(t=>tKeys(t).some(k=>nkey(k).includes(nq))).slice(0,10),exact=hits.findIndex(t=>tKeys(t).some(k=>nkey(k)===nq));
sugItems=exact<0?[{key:raw,free:true},...hits]:[hits[exact],...hits.filter((_,i)=>i!==exact)];sugIndex=0;
sugList.innerHTML=sugItems.map((t,i)=>`<li role="option" data-i="${i}"${i===0?' class="active" aria-selected="true"':''}><i>${t.free?'⌕':'→'}</i><span>${markUp(t.key,t.free?null:q)}</span></li>`).join('');
pop.classList.add('show');search.setAttribute('aria-expanded','true');}
function moveSug(d){const lis=[...sugList.querySelectorAll('li')];if(!lis.length)return;sugIndex=(sugIndex+d+lis.length)%lis.length;lis.forEach((li,i)=>{li.classList.toggle('active',i===sugIndex);if(i===sugIndex)li.setAttribute('aria-selected','true');else li.removeAttribute('aria-selected');});lis[sugIndex].scrollIntoView({block:'nearest'});}
function runSearch(){const v=search.value.trim();closeSug();if(!v){jumped=null;query='';search.value='';render();return;}
const t=parseJump(v);
if(t&&!t.rest){if(t.char)char=t.char;if(t.cat)current=t.cat;jumped=t;query='';renderChar();document.querySelector('#kit').scrollIntoView({behavior:'smooth',block:'start'});if(t.level&&(current==='mr'||current==='will'))flashLevel(t.level);return;}
jumped=null;query=(t&&t.rest?t.rest:v).toLowerCase();if(t&&t.char&&t.char!==char){char=t.char;renderChar();}else render();document.querySelector('#kit').scrollIntoView({behavior:'smooth',block:'start'});}
function pickSug(i){const t=sugItems[i===undefined?sugIndex:i];if(!t)return;search.value=t.key;runSearch();}
function renderChar(){const d=D();document.title=`${d.title} — Celestial Archive`;
document.querySelector('#hero-art').src=d.art;document.querySelector('#hero-art').alt=d.artAlt;
document.querySelector('#hero-title').textContent=d.title;
document.querySelector('#rarities').innerHTML=d.rarities.map((r,i)=>`<span${i>=2?' class="gold"':''}>${r}</span>`).join('');
document.querySelector('#hero-tagline').innerHTML=d.tagline;
document.querySelector('#hero-tags').innerHTML=d.tags.map(t=>`<span>${t}</span>`).join('<i>✦</i>');
const hero=document.querySelector('.hero');hero.style.setProperty('--art-zoom',d.artZoom);Object.entries(d.artPos).forEach(([k,v])=>hero.style.setProperty('--art-'+k,v));
document.querySelector('#page-label-name').textContent=`${d.title.toUpperCase()} / ${d.zodiac}`;
document.querySelector('#crumb-name').textContent=d.title;
document.querySelector('#overview-title').textContent=d.overview.title;
document.querySelector('#overview-text').textContent=d.overview.text;
document.querySelector('#mech-title').textContent=d.mechanics.title;
document.querySelector('#mech-note').innerHTML=d.mechanics.note;
document.querySelector('#footer-name').textContent=d.title.toUpperCase();
document.querySelector('#ur-count').textContent=String(SK().ur.length).padStart(2,'0');
document.querySelectorAll('[data-char]').forEach(b=>{const on=b.dataset.char===char;b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on));});
render();}
document.addEventListener('click',e=>{let b=e.target.closest('button');if(!b)return;if(b.dataset.char){char=b.dataset.char;current='ur';jumped=null;query='';search.value='';renderChar();window.scrollTo({top:0,behavior:'smooth'});return;}if(b.dataset.tab){current=b.dataset.tab;jumped=null;query='';search.value='';render();}});
document.querySelector('.tabs').addEventListener('keydown',e=>{if(!['ArrowRight','ArrowLeft','Home','End'].includes(e.key))return;e.preventDefault();let buttons=[...document.querySelectorAll('[data-tab]')],i=buttons.indexOf(document.activeElement);i=e.key==='Home'?0:e.key==='End'?buttons.length-1:(i+(e.key==='ArrowRight'?1:-1)+buttons.length)%buttons.length;current=buttons[i].dataset.tab;jumped=null;query='';search.value='';render();buttons[i].focus();});
search.addEventListener('input',openSug);
search.addEventListener('focus',openSug);
search.addEventListener('keydown',e=>{
if(e.key==='ArrowDown'){e.preventDefault();if(!pop.classList.contains('show'))openSug();moveSug(1);}
else if(e.key==='ArrowUp'){e.preventDefault();if(!pop.classList.contains('show'))openSug();moveSug(-1);}
else if(e.key==='Enter'){e.preventDefault();runSearch();}
else if(e.key==='Escape'){e.preventDefault();search.value='';closeSug();jumped=null;query='';render();search.blur();}});
pop.addEventListener('mousedown',e=>e.preventDefault());
pop.addEventListener('click',e=>{const li=e.target.closest('li');if(li)pickSug(Number(li.dataset.i));});
document.addEventListener('click',e=>{if(!e.target.closest('.search'))closeSug();});
renderChar();
