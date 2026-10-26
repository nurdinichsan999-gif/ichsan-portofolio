import {heroStats} from './stats.js?v=9';
import {initMotion,openMotionDialog,closeMotionDialog} from './motion.js?v=9';
import {language,setLanguage,localized,translatePage,tr} from './i18n.js?v=9';
import {
  defaultContent, copy, configured, connect, validateContent,
  safeUrl, parseImageEntry, isLegacyContent
} from '../../cms.js?v=portfolio-studio-v9';

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
const make = (tag, className, text) => {const el=document.createElement(tag);if(className)el.className=className;if(text!==undefined)el.textContent=tr(text);return el;};
const root=document.documentElement;
const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const MONTHS=['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];

/* Native Web Animations; no external animation runtime required. */
const transformString = ({ x = 0, y = 0, scale = 1 }) => `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
const setTransform = (el, to) => { el.style.transform = (to.x || to.y || (to.scale ?? 1) !== 1) ? transformString(to) : ''; };

async function animateTransform(el, from, to) {
  if (!el) return;
  if (reduceMotion) { setTransform(el, to); return; }
  try {
    const animation = el.animate(
      [{ transform: transformString(from) }, { transform: transformString(to) }],
      { duration: 360, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'both' }
    );
    await animation.finished;
    setTransform(el, to);
    animation.cancel();
  } catch { setTransform(el, to); }
}

async function animateOpacity(el, from, to, ms = 220) {
  if (!el) return;
  if (reduceMotion) { el.style.opacity = String(to); return; }
  try {
    const animation = el.animate([{ opacity: from }, { opacity: to }], { duration: ms, easing: 'ease-out', fill: 'both' });
    await animation.finished;
    el.style.opacity = String(to);
    animation.cancel();
  } catch { el.style.opacity = String(to); }
}

/* ==========================================================================
   Rendering
   ========================================================================== */
let lastSignature = '';
let activeContent = null;
let sourceContent = null;

function monthLabel(value) {
  const [year, month] = value.split('-');
  return (language==='en'?['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']:MONTHS)[Number(month) - 1] + ' ' + year;
}

function formatWhatsapp(digits) {
  if (/^62\d{9,12}$/.test(digits)) return '+62 ' + digits.slice(2, 5) + '-' + digits.slice(5, 9) + '-' + digits.slice(9);
  return '+' + digits;
}

function setExternal(link, url) {
  link.href = url;
  if (/^https:/i.test(url)) { link.target = '_blank'; link.rel = 'noopener noreferrer'; link.removeAttribute('download'); }
}

function splitName(name) {
  const words = name.trim().split(/\s+/);
  return words.length <= 3 ? words : [words[0], words.slice(1, -1).join(' '), words[words.length - 1]];
}

function renderStats(content) {
  const stats=heroStats(content,new Date(),language),list=$('#stats');
  list.hidden=!stats.length;
  list.replaceChildren(...stats.map(stat=>{
    const li=make('li'),num=make('strong','stat-num',stat.value);
    num.dataset.value=stat.value;
    if(stat.hint)num.title=stat.hint;
    li.append(num,make('span','stat-label',stat.label));return li;
  }));
}
setInterval(()=>{if(activeContent&&!document.hidden)renderStats(activeContent);},60*60*1000);
document.addEventListener('visibilitychange',()=>{if(activeContent&&!document.hidden)renderStats(activeContent);});

/* The giant background word is fitted to the available width with whatever
   font actually loaded, so it never overflows or leaves a gap. */
function fitWord() {
  const wrap = $('#hero-word'), inner = $('#hero-word-inner');
  if (!wrap || !inner) return;
  const available = wrap.clientWidth;
  if (!available) return;
  inner.style.fontSize = '100px';
  const natural = inner.getBoundingClientRect().width;
  if (!natural) return;
  inner.style.fontSize = Math.min(620, (100 * available / natural) * 0.995) + 'px';
}

function fitName() {
  const title = $('#hero-title');
  if (!title) return;
  title.style.fontSize = '';
  const box = title.clientWidth;
  if (!box) return;
  const range = document.createRange();
  let widest = 0;
  $$('.nl > span', title).forEach(span => { range.selectNodeContents(span); widest = Math.max(widest, range.getBoundingClientRect().width); });
  if (widest > box) title.style.fontSize = (parseFloat(getComputedStyle(title).fontSize) * box / widest * 0.97).toFixed(1) + 'px';
}

function fitHero() { fitWord(); fitName(); }

function renderWord(text) {
  const inner = $('#hero-word-inner');
  const word = String(text || '').toUpperCase();
  inner.replaceChildren(...Array.from(word).map((ch, i) => {
    const span = make('span', 'ch', ch === ' ' ? '\u00A0' : ch);
    span.style.setProperty('--i', String(i));
    return span;
  }));
  fitWord();
}

function renderHero(content) {
  const p = content.profile, k = content.contact;
  $('#hero-title').replaceChildren(...splitName(p.name).map((word, i) => {
    const line = make('span', 'nl'), inner = make('span', '', word);
    line.style.setProperty('--i', String(i)); line.append(inner);
    return line;
  }));
  $('#hero-title').setAttribute('aria-label', p.name);
  fitName();
  $('#brand-name').textContent = p.shortName;
  $('.brand').setAttribute('aria-label', p.name + ', kembali ke atas');
  $('#greeting').textContent = p.greeting; $('#greeting').hidden = !p.greeting;
  $('#hero-headline').textContent = p.headline;
  $('#hero-bio').textContent = p.bio;
  $('#bar-status').hidden = !p.status;
  $('#bar-status-text').textContent = p.status;
  $('#hero-status').hidden = !p.statusDetail;
  $('#status-detail').textContent = p.statusDetail;
  renderWord(p.heroWord);
  $('#hero-label').textContent=p.heroWord;$('#portrait-name').textContent=p.name.toUpperCase();$('#portrait-location').textContent=p.location+' ↗';
  $('#kontak .section-note').textContent=p.statusDetail;

  renderStats(content);

  const cv = $('#cta-cv'), cvUrl = safeUrl(k.cvUrl, false, true);
  cv.hidden = !cvUrl;
  if (cvUrl) { cv.href = cvUrl; if (/^https:/i.test(cvUrl)) { cv.target = '_blank'; cv.rel = 'noopener noreferrer'; cv.removeAttribute('download'); } else { cv.setAttribute('download', ''); cv.removeAttribute('target'); } }
  const wa = $('#cta-wa');
  wa.hidden = !k.whatsapp;
  if (k.whatsapp) setExternal(wa, 'https://wa.me/' + k.whatsapp + '?text=' + encodeURIComponent('Halo Ichsan, saya melihat portofolio Anda.'));

  const image = $('#portrait-img'), photo = safeUrl(p.photoUrl, false, true);
  image.alt = p.photoAlt || p.name;
  if (photo) {
    image.removeAttribute('srcset'); image.removeAttribute('sizes'); image.src = photo; image.classList.add('is-custom');
  } else if (image.classList.contains('is-custom')) {
    image.classList.remove('is-custom');
    image.src = 'assets/img/profile-900.webp';
    image.srcset = 'assets/img/profile-450.webp 450w, assets/img/profile-900.webp 900w';
    image.sizes = '(max-width: 1000px) 80vw, 640px';
  }
  $('#footer-copy').textContent = '© ' + new Date().getFullYear() + ' ' + p.name;
}

function renderMarquee(content) {
  const track = $('#marquee-track');
  const words = content.skills.map(skill => skill.title).filter(Boolean);
  const wrap = track.closest('.marquee');
  wrap.hidden = words.length === 0;
  if (!words.length) return;
  const sequence = [];
  while (sequence.length < 6) sequence.push(...words);
  const group = () => {
    const g = make('div', 'marquee-group');
    sequence.forEach(word => g.append(make('span', 'marquee-item', word), make('span', 'marquee-star', '✦')));
    return g;
  };
  track.replaceChildren(group(), group());
}

function renderAbout(content) {
  const p = content.profile;
  const paragraphs = p.about.split(/\n\s*\n/).map(t => t.trim()).filter(Boolean);
  $('#about-text').replaceChildren(...paragraphs.map(t => make('p', '', t)));
  $('#edu-degree').textContent = p.degree;
  $('#edu-school').textContent = p.university;
  $('#edu-period').textContent = p.educationPeriod;
  $('#edu-degree').closest('.fact').hidden = !p.degree && !p.university;
  const languages = p.languages.split(/\n/).map(t => t.trim()).filter(Boolean);
  $('#lang-list').replaceChildren(...languages.map(t => make('li', '', t)));
  $('#lang-list').closest('.fact').hidden = languages.length === 0;
  $('#loc-text').textContent = p.location;
  $('#loc-text').closest('.fact').hidden = !p.location;
}

function renderExperience(content) {
  const list = $('#timeline');
  const bar = make('span', 'tl-progress'); bar.setAttribute('aria-hidden', 'true');
  const items = content.experience.map(x => {
    const row = make('li', 'job reveal');
    const when = make('div', 'job-when');
    const start = make('time', '', monthLabel(x.start)); start.dateTime = x.start;
    when.append(start, document.createTextNode(' – '));
    if (x.end) { const end = make('time', '', monthLabel(x.end)); end.dateTime = x.end; when.append(end); }
    else when.append(document.createTextNode('Sekarang'));
    const main = make('div', 'job-main');
    main.append(make('h3', '', x.role), make('p', 'job-org', x.company + (x.detail ? ', ' + x.detail : '')));
    if (x.bullets.length) { const ul = make('ul'); x.bullets.forEach(b => ul.append(make('li', '', b))); main.append(ul); }
    row.append(when, main);
    return row;
  });
  list.replaceChildren(bar, ...items);
}

const detailDialog = $('#project-dialog');
let detailTrigger = null, projectFilter = 'Semua',detailClosing=false;
async function closeDetail(immediate=false){
  if(!detailDialog.open||detailClosing)return;
  detailClosing=true;
  if(immediate!==true)await closeMotionDialog(detailDialog);
  detailDialog.close();root.style.overflow='';detailClosing=false;
  detailTrigger?.focus({preventScroll:true});
}
$('#detail-close').addEventListener('click', closeDetail);
detailDialog.addEventListener('cancel', event => {event.preventDefault();closeDetail();});
detailDialog.addEventListener('click', event => {if(event.target===detailDialog){const r=detailDialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)closeDetail();}});
function openProject(project, trigger){
  detailTrigger=trigger;
  const wrap=$('#project-detail');
  const title=make('h2','detail-title',project.title);title.id='detail-title';
  const desc=make('p','detail-desc',project.description);
  const meta=make('div','detail-meta');meta.append(make('span','',project.category),make('span','',project.role||'Proyek pribadi'));
  wrap.replaceChildren(title,desc,meta);
  const block=(label,value,list=false)=>{
    if(!value?.length)return;
    const section=make('section','detail-block');section.append(make('h3','',label));
    if(list){const ul=make('ul');value.forEach(v=>ul.append(make('li','',v)));section.append(ul);}
    else section.append(make('p','',value));wrap.append(section);
  };
  block('Tujuan',project.goal);block('Pendekatan',project.approach);block('Fitur utama',project.features,true);block('Yang saya pelajari',project.learning);
  if(project.tags.length){const tags=make('ul','tags');project.tags.forEach(v=>tags.append(make('li','',v)));wrap.append(tags);}
  const images=project.images.map(parseImageEntry).filter(i=>i.url);
  if(images.length){
    const group=make('div','detail-gallery');
    images.forEach((item,index)=>{const b=make('button');b.type='button';b.setAttribute('aria-label',tr('Buka galeri')+' '+project.title+(language==='en'?', image ':', gambar ')+(index+1));const im=make('img');im.src=item.url;im.alt=item.caption||project.title+' — gambar '+(index+1);im.loading='lazy';b.append(im);b.addEventListener('click',()=>{closeDetail(true);openGallery(project,images,index,trigger);});group.append(b);});wrap.append(group);
  }
  const url=safeUrl(project.url,true), actions=make('div','detail-actions');
  if(url){const link=make('a','btn btn-primary','Kunjungi website ↗');setExternal(link,url);actions.append(link);}
  wrap.append(actions,make('p','detail-disclaimer','Proyek pribadi untuk pembelajaran dan eksplorasi. Tidak mewakili atau berafiliasi dengan perusahaan, pemberi kerja, maupun pihak lain.'));
  detailDialog.showModal();openMotionDialog(detailDialog);detailDialog.scrollTop=0;root.style.overflow='hidden';$('#detail-close').focus({preventScroll:true});
}
function projectMedia(project, items, index){
  const button=make('button',items.length?'shot':'cover');button.type='button';button.setAttribute('aria-haspopup','dialog');button.setAttribute('aria-label',tr('Lihat detail')+' '+project.title);
  button.dataset.palette=String(index%4);
  if(items.length){
    const image=make('img','shot-img');image.alt='';image.loading='lazy';image.decoding='async';image.referrerPolicy='no-referrer';image.src=items[0].url;
    image.addEventListener('error',()=>{image.hidden=true;button.append(make('span','cover-art',project.category));},{once:true});
    button.append(image,make('span','shot-open','Lihat detail ↗'));
  }else{
    const art=make('div','cover-art');art.append(make('small','','PROJECT / '+String(index+1).padStart(2,'0')),make('span','cover-mark',project.category));
    const geometry=make('div','cover-geometry');geometry.setAttribute('aria-hidden','true');geometry.append(make('i'),make('i'),make('i'));button.append(geometry);
    button.append(art,make('span','cover-arrow','↗'),make('span','cover-note','Eksplorasi pribadi'));
  }
  button.addEventListener('click',()=>openProject(project,button));return button;
}
function renderProjects(content){
  const categories=['Semua',...new Set(content.projects.map(p=>p.category))];
  if(!categories.includes(projectFilter))projectFilter='Semua';
  $('#project-filters').replaceChildren(...categories.map(category=>{
    const b=make('button','filter-btn',category==='Semua'?'Semua proyek':category);b.type='button';b.dataset.filter=category;b.setAttribute('aria-pressed',String(projectFilter===category));
    b.addEventListener('click',()=>{projectFilter=category;renderProjects(activeContent);observeReveals();$$('.filter-btn').find(el=>el.dataset.filter===category)?.focus({preventScroll:true});});return b;
  }));
  const projects=content.projects.filter(p=>projectFilter==='Semua'||p.category===projectFilter);
  $('#project-result').textContent=projects.length+(language==='en'?' projects shown':' proyek ditampilkan');
  $('#project-visible-count').textContent=String(projects.length).padStart(2,'0')+(language==='en'?' projects':' proyek');
  $('#projects').replaceChildren(...projects.map(project=>{
    const index=content.projects.indexOf(project),items=project.images.map(parseImageEntry).filter(i=>i.url),article=make('article','project reveal');
    const body=make('div','project-body'),meta=make('div','project-meta'),title=make('div','project-title');
    meta.append(make('span','num',String(index+1).padStart(2,'0')),make('span','project-category',project.category));
    title.append(make('h3','',project.title));
    body.append(meta,title,make('p','project-desc',project.description));
    if(project.tags.length){const tags=make('ul','tags');tags.setAttribute('aria-label',language==='en'?'Selected skills':'Keahlian terkait');project.tags.slice(0,4).forEach(v=>tags.append(make('li','',v)));if(project.tags.length>4){const remaining=make('li','tag-more','+'+(project.tags.length-4));remaining.setAttribute('aria-label',language==='en'?'More skills in project details':'Keahlian lain tersedia di detail proyek');tags.append(remaining);}body.append(tags);}
    const bottom=make('div','project-bottom'),links=make('div','project-links'),detail=make('button','btn btn-primary','Lihat detail ↗');detail.type='button';detail.setAttribute('aria-label',tr('Lihat detail')+' '+project.title);detail.setAttribute('aria-haspopup','dialog');detail.addEventListener('click',()=>openProject(project,detail));links.append(detail);
    const url=safeUrl(project.url,true);if(url){const link=make('a','btn project-visit','Kunjungi website ↗');setExternal(link,url);link.setAttribute('aria-label',tr('Kunjungi website ↗')+' — '+project.title);links.append(link);}
    bottom.append(links,make('p','project-role',project.role||'Proyek pribadi'));body.append(bottom);
    article.append(projectMedia(project,items,index),body);
    return article;
  }));
  $('#proyek').hidden=!content.projects.length;
}

function renderSkills(content) {
  $('#skills').replaceChildren(...content.skills.map((skill, index) => {
    const group = make('section', 'skill reveal');
    group.style.setProperty('--d', index * 110 + 'ms');
    group.append(make('h3', '', skill.title));
    if (skill.description) group.append(make('p', 'skill-desc', skill.description));
    const list = make('ul', 'plain'); skill.tags.forEach(t => list.append(make('li', '', t)));
    group.append(list);
    return group;
  }));
}

function renderContact(content) {
  const k = content.contact, rows = [];
  const add = (label, value, href, opts = {}) => {
    const li = make('li', 'reveal'), a = make('a');
    li.style.setProperty('--d', rows.length * 80 + 'ms');
    a.href = href;
    if (opts.external) { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
    if (opts.download) a.setAttribute('download', '');
    a.append(make('span', 'contact-label', label), make('span', 'contact-value', value));
    li.append(a); rows.push(li);
  };
  if (k.email) add('Email', k.email, 'mailto:' + k.email);
  if (k.whatsapp) add('WhatsApp', formatWhatsapp(k.whatsapp), 'https://wa.me/' + k.whatsapp + '?text=' + encodeURIComponent('Halo Ichsan, saya melihat portofolio Anda.'), { external: true });
  const linkedin = safeUrl(k.linkedin);
  if (linkedin) add('LinkedIn', linkedin.replace(/^https:\/\/(www\.)?/, '').replace(/\/$/, ''), linkedin, { external: true });
  const cv = safeUrl(k.cvUrl, false, true);
  if (cv) add('CV', 'Unduh CV (PDF)', cv, /^https:/i.test(cv) ? { external: true } : { download: true });
  $('#contact-list').replaceChildren(...rows);
}

function applyContent(raw) {
  sourceContent=raw;
  const content=localized(raw);
  const signature = language+JSON.stringify(content);
  if (signature === lastSignature) return;
  lastSignature = signature;
  activeContent = content;
  renderHero(content); renderMarquee(content); renderAbout(content); renderExperience(content);
  renderProjects(content); renderSkills(content); renderContact(content);
  translatePage();
  const disclaimer=tr('Seluruh proyek merupakan karya pribadi untuk pembelajaran dan eksplorasi. Tidak mewakili atau berafiliasi dengan perusahaan, pemberi kerja, maupun pihak lain.');
  $('.project-disclaimer').textContent='↳ '+disclaimer;
  observeReveals();
  if (lightbox.open) closeGallery();
  if (detailDialog.open) closeDetail(true);
}

/* ==========================================================================
   Scroll reveal
   ========================================================================== */
let revealObserver = null;
function observeReveals() {
  $$('.section-head').forEach(el=>el.classList.add('reveal'));
  const targets = $$('.reveal:not(.in), .rule:not(.in)');
  if (reduceMotion || !('IntersectionObserver' in window)) { targets.forEach(el => el.classList.add('in')); return; }
  if (!revealObserver) {
    revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
  }
  revealObserver.disconnect();
  targets.forEach(el => revealObserver.observe(el));
}

let fitQueued = false;
window.addEventListener('resize', () => {
  if (fitQueued) return;
  fitQueued = true;
  requestAnimationFrame(() => { fitQueued = false; fitHero(); });
});
if (document.fonts) {
  document.fonts.ready.then(fitHero);
  document.fonts.addEventListener && document.fonts.addEventListener('loadingdone', fitHero);
}

/* ==========================================================================
   Lightbox gallery
   ========================================================================== */
const lightbox = $('#lightbox');
const lb = { frame: $('#lb-frame'), stage: $('#lb-stage'), title: $('#lb-title'), caption: $('#lb-caption'), count: $('#lb-count'), thumbs: $('#lb-thumbs'), prev: $('#lb-prev'), next: $('#lb-next'), close: $('#lb-close') };
let gallery = null, galleryIndex = 0, galleryBusy = false, galleryTrigger = null, closing = false, navToken = 0;

function openGallery(project, items, startIndex, triggerEl) {
  if (!items.length) return;
  if (typeof lightbox.showModal !== 'function') { window.open(items[startIndex].url, '_blank', 'noopener'); return; }
  gallery = { title: project.title, items };
  galleryTrigger = triggerEl; closing = false;
  lb.title.textContent = project.title;
  lightbox.classList.toggle('lb-single', items.length < 2);
  lb.thumbs.replaceChildren(...items.map((item, i) => {
    const thumb = make('button', 'lb-thumb'); thumb.type = 'button';
    thumb.setAttribute('aria-label', 'Tampilkan gambar ' + (i + 1));
    const image = make('img'); image.alt = ''; image.loading = 'lazy'; image.referrerPolicy = 'no-referrer'; image.src = item.url;
    thumb.append(image);
    thumb.addEventListener('click', () => { if (i !== galleryIndex) go(i - galleryIndex, 0, i); });
    return thumb;
  }));
  lightbox.classList.remove('is-closing');
  lightbox.showModal();
  root.style.overflow = 'hidden';
  galleryIndex = startIndex;
  showImage(startIndex, 0, 0, triggerEl);
  lb.close.focus({ preventScroll: true });
}

function updateMeta() {
  const item = gallery.items[galleryIndex];
  lb.caption.textContent = item.caption;
  lb.count.textContent = (galleryIndex + 1) + (language==='en'?' of ':' dari ') + gallery.items.length;
  $$('.lb-thumb', lb.thumbs).forEach((thumb, i) => {
    if (i === galleryIndex) { thumb.setAttribute('aria-current', 'true'); thumb.scrollIntoView({ block: 'nearest', inline: 'center' }); }
    else thumb.removeAttribute('aria-current');
  });
}

async function showImage(target, direction, startX, fromEl) {
  const items = gallery.items;
  const next = (target + items.length) % items.length;
  const token = ++navToken;
  galleryBusy = true;
  const previous = $('.lb-img', lb.frame);
  const image = make('img', 'lb-img');
  const item = items[next];
  image.alt = gallery.title + ', gambar ' + (next + 1) + ' dari ' + items.length + (item.caption ? ': ' + item.caption : '');
  image.decoding = 'async'; image.referrerPolicy = 'no-referrer'; image.draggable = false;
  image.style.opacity = '0';
  const loaded = new Promise(resolve => { image.addEventListener('load', () => resolve(true), { once: true }); image.addEventListener('error', () => resolve(false), { once: true }); });
  image.src = item.url;
  galleryIndex = next;
  updateMeta();
  lb.frame.append(image);
  [items[(next + 1) % items.length], items[(next - 1 + items.length) % items.length]].forEach(neighbour => { const pre = new Image(); pre.referrerPolicy = 'no-referrer'; pre.src = neighbour.url; });
  try {
    const ok = await loaded;
    if (token !== navToken || !gallery) { image.remove(); return; }
    if (!ok) {
      image.remove();
      $$('.lb-error', lb.frame).forEach(e => e.remove());
      lb.frame.append(make('p', 'lb-error', 'Gambar ini tidak dapat dimuat. Coba gambar lain.'));
      if (previous) previous.remove();
      return;
    }
    $$('.lb-error', lb.frame).forEach(e => e.remove());
    if (direction === 0) {
      const frameRect = lb.frame.getBoundingClientRect();
      let from = { x: 0, y: 28, scale: 0.96 };
      if (fromEl && fromEl.isConnected) {
        const rect = fromEl.getBoundingClientRect();
        if (rect.width > 0 && frameRect.width > 0) {
          from = {
            x: rect.left + rect.width / 2 - (frameRect.left + frameRect.width / 2),
            y: rect.top + rect.height / 2 - (frameRect.top + frameRect.height / 2),
            scale: Math.max(0.15, Math.min(1, rect.width / frameRect.width))
          };
        }
      }
      if (previous) previous.remove();
      await Promise.all([animateTransform(image, from, {}), animateOpacity(image, 0, 1, 260)]);
    } else {
      const offset = direction * Math.min(140, lb.frame.clientWidth * 0.14);
      const jobs = [animateTransform(image, { x: offset }, {}), animateOpacity(image, 0, 1, 240)];
      if (previous) jobs.push(Promise.all([animateTransform(previous, { x: startX || 0 }, { x: -offset }), animateOpacity(previous, Number(previous.style.opacity || 1), 0, 200)]).then(() => previous.remove()));
      await Promise.all(jobs);
    }
    image.style.opacity = '1';
  } finally {
    if (token === navToken) { galleryBusy = false; $$('.lb-img', lb.frame).forEach(el => { if (el !== image) el.remove(); }); }
  }
}

function go(step, startX = 0, absolute = null) {
  if (!gallery || galleryBusy || gallery.items.length < 2) return;
  const target = absolute !== null ? absolute : galleryIndex + step;
  const direction = step === 0 ? 1 : Math.sign(step);
  showImage(target, direction, startX);
}

async function closeGallery() {
  if (!lightbox.open || closing) return;
  closing = true;
  lightbox.classList.add('is-closing');
  lightbox.close();
}

lb.close.addEventListener('click', closeGallery);
lb.prev.addEventListener('click', () => go(-1));
lb.next.addEventListener('click', () => go(1));
lightbox.addEventListener('cancel', event => { event.preventDefault(); closeGallery(); });
lightbox.addEventListener('close', () => {
  navToken++; galleryBusy = false;
  lb.frame.replaceChildren(); lb.thumbs.replaceChildren();
  root.style.overflow = '';
  lightbox.classList.remove('is-closing'); closing = false;
  const back = galleryTrigger; galleryTrigger = null; gallery = null;
  if (back && back.isConnected) back.focus({ preventScroll: true });
});
lightbox.addEventListener('keydown', event => {
  if (!gallery || event.altKey || event.ctrlKey || event.metaKey) return;
  if (event.key === 'ArrowRight') { event.preventDefault(); go(1); }
  else if (event.key === 'ArrowLeft') { event.preventDefault(); go(-1); }
  else if (event.key === 'Home') { event.preventDefault(); go(0 - galleryIndex, 0, 0); }
  else if (event.key === 'End') { event.preventDefault(); go(1, 0, gallery.items.length - 1); }
});
lightbox.addEventListener('click', event => { if (event.target === lightbox) closeGallery(); });

/* Swipe / drag between images */
let drag = null;
lb.stage.addEventListener('pointerdown', event => {
  if (!gallery || galleryBusy || gallery.items.length < 2 || event.button > 0 || event.target.closest('.lb-nav')) return;
  const image = $('.lb-img', lb.frame);
  if (!image) return;
  drag = { id: event.pointerId, x0: event.clientX, y0: event.clientY, dx: 0, image, t0: performance.now(), moved: false };
});
lb.stage.addEventListener('pointermove', event => {
  if (!drag || event.pointerId !== drag.id) return;
  const dx = event.clientX - drag.x0, dy = event.clientY - drag.y0;
  if (!drag.moved) {
    if (Math.abs(dx) < 8) return;
    if (Math.abs(dy) > Math.abs(dx)) { drag = null; return; }
    drag.moved = true;
    try { lb.stage.setPointerCapture(event.pointerId); } catch { /* ignore */ }
  }
  drag.dx = dx;
  drag.image.style.transform = 'translate3d(' + dx + 'px, 0, 0)';
  drag.image.style.opacity = String(1 - Math.min(0.5, Math.abs(dx) / (lb.frame.clientWidth * 1.2)));
});
function endDrag(event) {
  if (!drag || event.pointerId !== drag.id) return;
  const d = drag; drag = null;
  if (!d.moved) return;
  const velocity = Math.abs(d.dx) / Math.max(1, performance.now() - d.t0);
  if (Math.abs(d.dx) > 70 || velocity > 0.5) go(d.dx < 0 ? 1 : -1, d.dx);
  else { animateTransform(d.image, { x: d.dx }, {}); animateOpacity(d.image, Number(d.image.style.opacity || 1), 1, 160); }
}
lb.stage.addEventListener('pointerup', endDrag);
lb.stage.addEventListener('pointercancel', endDrag);

/* ==========================================================================
   Navigation + scroll spy
   ========================================================================== */
const nav = $('#site-nav'), menuButton = $('#menu-btn');
function setMenu(open, returnFocus = false) {
  nav.dataset.open = String(open);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', tr(open ? 'Tutup menu' : 'Buka menu'));
  if (!open && returnFocus) menuButton.focus();
}
menuButton.addEventListener('click', () => setMenu(nav.dataset.open !== 'true'));
nav.addEventListener('click', event => { if (event.target.closest('a')) setMenu(false); });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && nav.dataset.open === 'true') setMenu(false, true); });

if ('IntersectionObserver' in window) {
  const links = $$('.nav a');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      links.forEach(link => { if (link.hash === '#' + entry.target.id) link.setAttribute('aria-current', 'true'); else link.removeAttribute('aria-current'); });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  $$('main section[id]').forEach(section => observer.observe(section));
}

/* ==========================================================================
   Start
   ========================================================================== */
async function start() {
  $$('.prose, .facts').forEach(el => el.classList.add('reveal'));
  applyContent(validateContent(copy(defaultContent)));
  initMotion();


  fitHero();
  requestAnimationFrame(() => {
    root.classList.add('hero-ready');

  });

  if(new URLSearchParams(location.search).get('preview')==='1'){
    const banner=make('div','preview-banner','Pratinjau draft lokal — perubahan ini hanya terlihat di browser ini. ');const edit=make('a','','Kembali ke editor');edit.href='admin.html?preview=1';banner.append(edit);document.body.prepend(banner);
    const load=()=>{try{const draft=localStorage.getItem('portfolio-preview-v6');if(draft)applyContent(validateContent(JSON.parse(draft).content));}catch{banner.textContent='Draft lokal belum dapat dibaca. Kembali ke editor untuk memeriksanya.';}};load();window.addEventListener('storage',event=>{if(event.key==='portfolio-preview-v6')load();});return;
  }
  if(location.hostname==='terminal.local'||location.hostname.endsWith('.chatgpt.site'))return;
  if (!configured()) return;
  try {
    const backend = await connect({ auth: false });
    backend.fs.onSnapshot(backend.reference, snapshot => {
      if (!snapshot.exists()) return;
      try {
        const raw = snapshot.data().content;
        // Content saved by the V3 site lacks the newer fields; keep the new defaults until the owner publishes from the new admin.
        if (isLegacyContent(raw)) { const base=copy(defaultContent); applyContent(validateContent({...base,...raw,profile:{...base.profile,...(raw?.profile||{})},contact:{...base.contact,...(raw?.contact||{})}}));return; }
        applyContent(validateContent(raw));
      } catch (error) { console.warn('Konten online tidak valid; versi terakhir tetap ditampilkan.', error.message); }
    }, error => console.warn('Konten online belum dapat dimuat.', error.code || error.message));
  } catch (error) { console.warn('Firebase belum terhubung; konten bawaan ditampilkan.', error.message); }
}

$$('[data-lang]').forEach(button=>button.addEventListener('click',()=>{if(button.dataset.lang===language)return;setLanguage(button.dataset.lang);projectFilter='Semua';applyContent(sourceContent);$('#menu-btn').setAttribute('aria-label',tr('Buka menu'));}));

start().catch(error => {
  console.error('Portfolio gagal dimulai:', error);
  root.classList.add('hero-ready');
});
