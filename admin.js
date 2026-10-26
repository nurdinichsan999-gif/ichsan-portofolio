import { CMS_BUILD, OWNER_UID, storageEnabled, defaultContent, copy, configured, connect, storageClient, validateContent, safeUrl, normalizeCategory, parseImageEntry, isLegacyContent } from './cms.js?v=portfolio-studio-v9-20261026';

import {heroStats,experienceGroup} from './assets/js/stats.js?v=9';
// A visible build check prevents silently mixing a new editor with an old CMS file.
const EXPECTED_BUILD = 'portfolio-studio-v9-20261026';
if (CMS_BUILD !== EXPECTED_BUILD) throw new Error('Versi cms.js tidak cocok. Unggah admin.html, admin.js, cms.js, dan seluruh folder assets/ sebagai satu paket V9.');
document.documentElement.dataset.adminBootBuild = EXPECTED_BUILD;
const bootLabel = document.getElementById('build-status');
if (bootLabel) { bootLabel.className='notice status success'; bootLabel.textContent = 'Editor V9 berhasil dimuat. Masuk untuk mengelola portofolio.'; }

const previewMode=new URLSearchParams(location.search).get('preview')==='1'||location.hostname==='terminal.local'||location.hostname.endsWith('.chatgpt.site');
const $=(s,root=document)=>root.querySelector(s);
const $$=(s,root=document)=>Array.from(root.querySelectorAll(s));
const create=(tag,cls,text)=>{const el=document.createElement(tag);if(cls)el.className=cls;if(text!==undefined)el.textContent=text;return el;};
let englishFields={};
let backend=null, ready=false, dirty=false, busy=false, revision=0, session=0, uploadTask=null, deniedAccount=false;
const publish=$('#publish-content'), fields=$('#editor-fields'), form=$('#editor-form');
function status(text,type=''){const el=$('#app-status');el.hidden=!text;el.textContent=text;el.className='notice status '+type;}
function markDirty(){if(!ready)return;updateStatsPreview();dirty=true;$('#save-state').textContent='Perubahan belum diterbitkan.';}
function updateStatsPreview(){
  let box=$('#auto-stats-preview');
  if(!box){box=create('div','notice');box.id='auto-stats-preview';box.setAttribute('aria-live','polite');$('#profile-long-fields').append(box);}
  const experience=collectExperience(),stats=heroStats({profile:{stats:text('profile.stats')},experience,projects:collectProjects()});
  const summary=create('p','',stats.map(s=>s.value+' '+s.label+(s.hint?' ('+s.hint+')':'')).join(' · '));
  const note=create('p','','Jumlah proyek mengikuti seluruh daftar proyek. Pengalaman memakai tanggal mulai–selesai; selesai kosong berarti masih berjalan. Periode tumpang tindih dihitung satu kali.');
  const groups=create('p','',experience.filter(job=>experienceGroup(job)!=='other').map(job=>(experienceGroup(job)==='freelance'?'Freelance: ':'Operasional: ')+job.role+' — '+job.company).join(' · '));
  box.replaceChildren(create('strong','','Pratinjau angka otomatis'),summary,note,groups);
}
function setBusy(value){busy=value;fields.disabled=!ready||value;publish.disabled=!ready||value;$('#export-content').disabled=!ready||value;$('#import-content').disabled=!ready||value;$('#recommended-content').disabled=!ready||value;$('#reload-content').disabled=value||!backend?.auth.currentUser||backend.auth.currentUser.uid!==OWNER_UID;$('#logout').disabled=value;publish.textContent=value?'Memproses…':previewMode?'Simpan pratinjau lokal':'Terbitkan perubahan';}
function input(name){return form.elements.namedItem(name);}
function text(name){return String(input(name)?.value||'').trim();}
function lines(value){return value.split(/\r?\n/).map(s=>s.trim()).filter(Boolean);}
function field(name,label,value='',options={}){
  const wrap=create('div','field'), id='field-'+name.replace(/[^a-zA-Z0-9-]/g,'-');
  const labelEl=create('label','',label);labelEl.htmlFor=id;
  const el=create(options.rows?'textarea':'input');el.id=id;el.name=name;el.value=value;el.maxLength=options.max||2000;
  if(options.rows)el.rows=options.rows;else el.type=options.type||'text';
  if(options.required)el.required=true;
  wrap.append(labelEl,el);
  if(/^(profile|projects|experience|skills)\./.test(name)&&/\.(headline|bio|about|greeting|status|statusDetail|location|degree|languages|stats|photoAlt|title|role|detail|description|goal|approach|features|learning|tags|bullets)$/.test(name)){
   const details=create('details','english-field'),summary=create('summary','','English translation (optional)'),translation=create(options.rows?'textarea':'input'),translationLabel=create('label','','English — '+label);
   translation.name=name+'En';translation.id=id+'-en';translation.dataset.englishKey=name;translation.value=englishFields[name+'En']||'';translation.maxLength=options.max||2000;translationLabel.htmlFor=translation.id;
   if(options.rows)translation.rows=Math.min(4,options.rows);else translation.type='text';translation.placeholder='Kosongkan untuk memakai terjemahan bawaan / teks Indonesia';details.append(summary,translationLabel,translation);wrap.append(details);
  }return wrap;
}
const shortFields={name:['Nama lengkap',100,true],shortName:['Nama singkat di navigasi',60,true],headline:['Headline / fokus profesional',300,true],greeting:['Sapaan di hero',40],heroWord:['Label pembuka hero',14],status:['Status ketersediaan (kosongkan untuk menyembunyikan)',120],statusDetail:['Detail status',300],location:['Lokasi',120],degree:['Gelar / jurusan',150],university:['Universitas',200],educationPeriod:['Periode studi',60]};
function populate(c){
 englishFields={};const remember=(obj,prefix)=>Object.entries(obj).forEach(([k,v])=>{if(k.endsWith('En'))englishFields[prefix+k]=Array.isArray(v)?v.join('\n'):v;});remember(c.profile,'profile.');c.projects.forEach(x=>remember(x,'projects.'+x.id+'.'));c.experience.forEach((x,i)=>remember(x,'experience.'+i+'.'));c.skills.forEach((x,i)=>remember(x,'skills.'+i+'.'));

  $('#profile-fields').replaceChildren(...Object.entries(shortFields).map(([key,[label,max,required]])=>field('profile.'+key,label,c.profile[key],{max,required})));
  $('#profile-long-fields').replaceChildren(field('profile.bio','Sub-headline / perkenalan',c.profile.bio,{rows:4,max:2500,required:true}),field('profile.about','Tentang saya (pisahkan paragraf dengan baris kosong)',c.profile.about,{rows:7,max:10000}),field('profile.languages','Bahasa (satu per baris, contoh: English — Intermediate)',c.profile.languages,{rows:2,max:500}),field('profile.stats','Angka hero otomatis dari proyek, pengalaman operasional, dan freelance (format: angka | label; maks. 4 baris)',c.profile.stats,{rows:3,max:600}));
  input('profile.photoUrl').value=c.profile.photoUrl;input('profile.photoAlt').value=c.profile.photoAlt;$('#photo-file').value='';
  renderExperience(c.experience);renderProjects(c.projects);renderSkills(c.skills);
  $('#contact-fields').replaceChildren(field('contact.email','Email publik / penerima pesan',c.contact.email,{type:'email',max:254}),field('contact.linkedin','URL profil LinkedIn',c.contact.linkedin,{type:'url',max:2048}),field('contact.whatsapp','Nomor WhatsApp (digit saja dengan kode negara, tanpa +; contoh 6281234567890)',c.contact.whatsapp,{max:20}),field('contact.cvUrl','Tautan CV (HTTPS atau assets/…)',c.contact.cvUrl,{max:2048}));
  previewPhoto();updateStatsPreview();
}
function collectExperience(){return $$('.experience-item').map((row,index)=>({role:text('experience.'+index+'.role'),company:text('experience.'+index+'.company'),detail:text('experience.'+index+'.detail'),start:text('experience.'+index+'.start'),end:text('experience.'+index+'.end'),bullets:lines(text('experience.'+index+'.bullets')),roleEn:text('experience.'+index+'.roleEn'),detailEn:text('experience.'+index+'.detailEn'),bulletsEn:lines(text('experience.'+index+'.bulletsEn'))}));}
function renderExperience(rows,focusIndex=null){
 Object.keys(englishFields).filter(k=>k.startsWith('experience.')).forEach(k=>delete englishFields[k]);rows.forEach((row,i)=>Object.entries(row).forEach(([k,v])=>{if(k.endsWith('En'))englishFields['experience.'+i+'.'+k]=Array.isArray(v)?v.join('\n'):v;}));
  $('#experience-list').replaceChildren(...rows.map((row,index)=>{
    const article=create('article','item experience-item');const head=create('div','item-head');head.append(create('h3','','Pengalaman '+(index+1)));
    const actions=create('div','actions');
    [['Naik',-1],['Turun',1],['Hapus',0]].forEach(([label,delta])=>{
      const btn=create('button','btn'+(!delta?' danger':''),label);btn.type='button';btn.setAttribute('aria-label',label+' pengalaman '+(index+1));
      btn.disabled=(delta===-1&&index===0)||(delta===1&&index===rows.length-1);
      btn.addEventListener('click',()=>{
        const current=collectExperience();
        if(!delta){if(!window.confirm('Hapus pengalaman ini dari draft? Penghapusan baru tampil publik setelah diterbitkan.'))return;current.splice(index,1);}
        else [current[index],current[index+delta]]=[current[index+delta],current[index]];
        renderExperience(current,Math.min(current.length-1,Math.max(0,index+delta)));markDirty();
      });actions.append(btn);
    });head.append(actions);article.append(head);
    const prefix='experience.'+index+'.',grid=create('div','two');
    grid.append(field(prefix+'role','Jabatan',row.role,{max:200,required:true}),field(prefix+'company','Perusahaan',row.company,{max:200,required:true}),field(prefix+'detail','Tim / detail tambahan',row.detail,{max:200}),field(prefix+'start','Mulai',row.start,{type:'month',max:7,required:true}),field(prefix+'end','Selesai (kosongkan jika masih bekerja)',row.end,{type:'month',max:7}));
    article.append(grid,field(prefix+'bullets','Deskripsi pekerjaan (satu poin per baris)',row.bullets.join('\n'),{rows:4,max:18000}));return article;
  }));
  $('#add-experience').disabled=rows.length>=30;
  if(focusIndex!==null&&focusIndex>=0)input('experience.'+focusIndex+'.role')?.focus();
}
// Project form fields use stable IDs, so deleting a project never shifts another draft.
function mayEdit(){return ready && !busy && backend?.auth.currentUser?.uid===OWNER_UID;}
function projectPrefix(id){return 'projects.'+id+'.';}
function newId(){if(typeof crypto.randomUUID==='function')return crypto.randomUUID();return Array.from(crypto.getRandomValues(new Uint8Array(16)),v=>v.toString(16).padStart(2,'0')).join('');}
function newProject(){return {id:'project-'+newId(),title:'',role:'Proyek mandiri',description:'',goal:'',approach:'',features:[],learning:'',url:'',category:'Web Development',tags:[],images:[]};}
function collectProjects(){
  return $$('.project-item').map(row=>{
    const id=row.dataset.projectId,prefix=projectPrefix(id);
    return {id,title:text(prefix+'title'),role:text(prefix+'role'),description:text(prefix+'description'),goal:text(prefix+'goal'),approach:text(prefix+'approach'),features:lines(text(prefix+'features')),learning:text(prefix+'learning'),url:text(prefix+'url'),
      category:normalizeCategory(text(prefix+'category')),tags:lines(text(prefix+'tags')),images:lines(text(prefix+'images'))};
  });
}
function updateProjectLabels(){
  const rows=$$('.project-item');
  rows.forEach((row,i)=>{$('h3',row).textContent='Proyek '+(i+1);});
  $('#project-count').textContent=rows.length ? rows.length+' proyek dalam draft.' : 'Belum ada proyek. Klik Tambah Proyek Baru.';
}
function renderImagePreviews(row){
  const prefix=projectPrefix(row.dataset.projectId), urls=lines(text(prefix+'images'));
  const grid=$('.project-images-grid',row);grid.replaceChildren();
  urls.slice(0,8).forEach((url,i)=>{
    const figure=create('figure','project-image-item');
    const label=create('figcaption','',i===0?'1 · Sampul':String(i+1));
    const entry=parseImageEntry(url),valid=safeUrl(entry.url,false,true);
    if(valid){
      const img=create('img');img.src=valid;img.loading='lazy';img.decoding='async';img.referrerPolicy='no-referrer';img.alt='Pratinjau gambar '+(i+1);if(entry.caption)label.textContent+=' · '+entry.caption;
      img.addEventListener('error',()=>{img.hidden=true;label.textContent=(i+1)+' · Gambar tidak dapat dimuat';},{once:true});figure.append(img);
    }else{label.textContent=(i+1)+' · URL HTTPS atau path assets/ tidak valid';}
    const remove=create('button','btn danger','Hapus Foto');remove.type='button';
    remove.addEventListener('click',()=>{
      if(!mayEdit())return;
      const current=lines(text(prefix+'images'));current.splice(i,1);input(prefix+'images').value=current.join('\n');
      renderImagePreviews(row);markDirty();input(prefix+'images').focus();
    });
    figure.append(label,remove);grid.append(figure);
  });
  $('.project-image-count',row).textContent=urls.length+' URL gambar. Urutan mengikuti baris; maksimal 8 pratinjau ditampilkan di editor.';
}
function createProjectRow(project){
  const row=create('article','item project-item');row.dataset.projectId=project.id;
  const prefix=projectPrefix(project.id),head=create('div','item-head'),remove=create('button','btn danger','Hapus Proyek');remove.type='button';
  head.append(create('h3','','Proyek'),remove);row.append(head);
  remove.addEventListener('click',()=>{
    if(!mayEdit()||!confirm('Hapus proyek ini dari draft? Perubahan baru tampil publik setelah diterbitkan. File Storage tidak dihapus.'))return;
    const neighbor=row.nextElementSibling||row.previousElementSibling;
    row.remove();updateProjectLabels();markDirty();
    (neighbor?.querySelector('input')||$('#add-project')).focus();
  });
  row.append(field(prefix+'title','Judul proyek',project.title,{max:200,required:true}),field(prefix+'role','Peran / keterangan singkat',project.role,{max:150}),
    field(prefix+'description','Ringkasan proyek',project.description,{rows:3,max:3000}),
    field(prefix+'goal','Tujuan / masalah yang ingin dibantu',project.goal,{rows:3,max:3000}),
    field(prefix+'approach','Pendekatan pengerjaan',project.approach,{rows:3,max:3000}),
    field(prefix+'features','Fitur utama (satu per baris)',project.features.join('\n'),{rows:4,max:4500}),
    field(prefix+'learning','Pembelajaran dari proyek',project.learning,{rows:3,max:3000}),
    field(prefix+'url','Tautan HTTPS / anchor halaman (opsional)',project.url,{max:2048}));
  const category=field(prefix+'category','Kategori — pilih preset atau ketik sendiri',normalizeCategory(project.category),{max:100,required:true});
  category.querySelector('input').setAttribute('list','project-category-options');row.append(category);
  row.append(field(prefix+'tags','Tag (satu per baris, maksimal 15)',project.tags.join('\n'),{rows:3,max:1600}),
    field(prefix+'images','Gambar (satu per baris): URL HTTPS atau assets/…; caption opsional setelah " | ". Gambar pertama jadi sampul.',project.images.join('\n'),{rows:5,max:150000}));
  const count=create('p','file-note project-image-count'),grid=create('div','project-images-grid');row.append(count,grid);
  const uploadWrap=create('div','field'),label=create('label','','Atau pilih beberapa foto sekaligus'),file=create('input');
  file.id='project-files-'+project.id;label.htmlFor=file.id;file.type='file';file.multiple=true;file.accept='image/jpeg,image/png,image/webp';file.disabled=!storageEnabled;
  uploadWrap.append(label,file);row.append(uploadWrap);
  const upload=create('button','btn','Unggah Foto Terpilih');upload.type='button';upload.disabled=!storageEnabled;
  const progress=create('progress');progress.max=100;progress.value=0;progress.hidden=true;progress.setAttribute('aria-label','Progres unggahan foto proyek');
  const uploadStatus=create('p','project-upload-status');uploadStatus.setAttribute('role','status');uploadStatus.setAttribute('aria-live','polite');
  row.append(upload,progress,uploadStatus,create('p','file-note',storageEnabled?
    'JPG, PNG, WebP: maksimal 8 MB dan 24 megapiksel per file. Foto diperkecil hingga sisi panjang 2400 px tanpa dipotong; hasil WebP di bawah 1 MB. Unggahan tersimpan publik, lalu URL ditambahkan ke draft. Terbitkan untuk menampilkan perubahan.':
    'Unggah belum diaktifkan. Unggah gambar ke folder public_html/assets/projects/ lewat file manager hosting, lalu tulis path-nya di kolom di atas (contoh: assets/projects/sannur-tools/01.webp | Dashboard). Atau pakai URL HTTPS, atau aktifkan Firebase Storage (paket Blaze).'));
  upload.addEventListener('click',()=>uploadProjectFiles(row,file,progress,uploadStatus));
  row.querySelector('[name="'+prefix+'images"]').addEventListener('change',()=>renderImagePreviews(row));
  return row;
}
function renderProjects(projects){
  $('#project-list').replaceChildren(...projects.map(createProjectRow));
  $$('.project-item').forEach(renderImagePreviews);updateProjectLabels();
}
$('#add-project').addEventListener('click',()=>{
  if(!mayEdit())return;
  const project=newProject(),row=createProjectRow(project);$('#project-list').append(row);
  renderImagePreviews(row);updateProjectLabels();markDirty();input(projectPrefix(project.id)+'title').focus();
});
// Gallery uploads preserve the original aspect ratio; profile uploads still crop square.
async function prepareProjectImage(file){
  if(!file||!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>8*1024*1024)throw new Error('Pilih JPG, PNG, atau WebP maksimal 8 MB per file.');
  const bitmap=await createImageBitmap(file);
  try{
    if(!bitmap.width||!bitmap.height||bitmap.width*bitmap.height>24000000)throw new Error('Gunakan gambar beresolusi maksimal 24 megapiksel.');
    const scale=Math.min(1,2400/Math.max(bitmap.width,bitmap.height)),canvas=document.createElement('canvas');
    canvas.width=Math.max(1,Math.round(bitmap.width*scale));canvas.height=Math.max(1,Math.round(bitmap.height*scale));
    const context=canvas.getContext('2d');if(!context)throw new Error('Browser tidak mendukung pemrosesan gambar; gunakan URL HTTPS.');
    context.drawImage(bitmap,0,0,canvas.width,canvas.height);
    for(const quality of [.88,.8,.7,.6]){
      const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/webp',quality));
      if(blob?.type==='image/webp'&&blob.size<1048576)return blob;
    }
    throw new Error('Gambar belum dapat diperkecil ke WebP di bawah 1 MB. Pilih gambar lebih kecil atau gunakan URL.');
  }finally{bitmap.close();}
}
async function uploadProjectFiles(row,fileInput,progress,message){
  if(!mayEdit())return;
  const selected=Array.from(fileInput.files||[]);if(!selected.length){message.textContent='Pilih satu atau beberapa foto terlebih dahulu.';return;}
  if(selected.some(file=>!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>8*1024*1024)){
    message.textContent='Seluruh file harus JPG, PNG, atau WebP maksimal 8 MB per file.';return;
  }
  const token=session,prefix=projectPrefix(row.dataset.projectId);let completed=0,task=null;
  setBusy(true);progress.hidden=false;progress.value=0;message.textContent='Menyiapkan unggahan…';
  try{
    const {sdk,storage}=await storageClient(backend.app);
    if(token!==session)return;
    for(const [index,file] of selected.entries()){
      if(token!==session)return;
      message.textContent='Mengunggah '+(index+1)+' dari '+selected.length+': '+file.name;
      const blob=await prepareProjectImage(file);if(token!==session)return;
      const ref=sdk.ref(storage,'projects/'+row.dataset.projectId+'/'+newId()+'.webp');
      task=sdk.uploadBytesResumable(ref,blob,{contentType:'image/webp',cacheControl:'public,max-age=31536000,immutable'});uploadTask=task;
      await new Promise((resolve,reject)=>task.on('state_changed',snapshot=>{
        if(token===session)progress.value=((index+snapshot.bytesTransferred/snapshot.totalBytes)/selected.length)*100;
      },reject,resolve));
      if(token!==session)return;
      const url=await sdk.getDownloadURL(ref);if(token!==session)return;
      const urls=lines(text(prefix+'images'));urls.push(url);input(prefix+'images').value=urls.join('\n');
      completed++;renderImagePreviews(row);markDirty();
    }
    fileInput.value='';message.textContent=completed+' foto berhasil diunggah dan ditambahkan ke draft. Klik Terbitkan perubahan.';
    status('Foto proyek tersimpan. Terbitkan perubahan untuk menampilkannya di website.','success');
  }catch(error){
    if(token===session){
      if(completed)fileInput.value='';
      message.textContent='Unggahan terhenti. '+completed+' foto yang sudah berhasil tetap ada di draft. Pilih ulang hanya file yang belum berhasil. '+(error.message||'Periksa koneksi dan Storage Rules untuk folder projects/.');
      status(message.textContent,'error');
    }
  }finally{
    if(uploadTask===task)uploadTask=null;
    if(token===session){progress.hidden=true;setBusy(false);}
  }
}
function renderSkills(skills){$('#skill-list').replaceChildren(...skills.map((skill,index)=>{const article=create('article','item'),prefix='skills.'+index+'.';article.append(create('h3','','Kategori '+(index+1)),field(prefix+'title','Nama kategori',skill.title,{max:150,required:true}),field(prefix+'description','Deskripsi singkat',skill.description,{rows:2,max:1000}),field(prefix+'tags','Daftar keahlian (satu per baris)',skill.tags.join('\n'),{rows:5,max:3200}));return article;}));}
function collectBase(){const profile={};[...Object.keys(shortFields),'bio','about','languages','stats','photoUrl','photoAlt'].forEach(key=>profile[key]=text('profile.'+key));return {profile,contact:{email:text('contact.email'),whatsapp:text('contact.whatsapp'),linkedin:text('contact.linkedin'),cvUrl:text('contact.cvUrl'),portfolioUrl:'#proyek'},experience:collectExperience(),projects:collectProjects(),skills:[0,1,2].map(index=>({title:text('skills.'+index+'.title'),description:text('skills.'+index+'.description'),tags:lines(text('skills.'+index+'.tags'))}))};}
function collect(){const content=collectBase();form.querySelectorAll('[data-english-key]').forEach(el=>{
 const parts=el.dataset.englishKey.split('.'),group=parts[0],key=parts.at(-1);let target;
 if(group==='profile')target=content.profile;else if(group==='projects')target=content.projects.find(p=>p.id===parts[1]);else target=content[group]?.[Number(parts[1])];
 if(target&&el.value.trim())target[key+'En']=['tags','features','bullets'].includes(key)?lines(el.value):el.value.trim();
 });return content;}
function previewPhoto(){const img=$('#photo-preview'),url=safeUrl(input('profile.photoUrl')?.value,false,true);if(!url){img.hidden=false;img.src='assets/img/profile-900.webp';return;}img.hidden=false;img.referrerPolicy='no-referrer';img.alt=input('profile.photoAlt')?.value||'Pratinjau foto profil';img.src=url;}
$('#photo-preview').addEventListener('error',()=>{$('#photo-preview').hidden=true;status('Foto belum dapat dimuat. Periksa URL atau izin aksesnya.','error');});
input('profile.photoUrl').addEventListener('change',previewPhoto);input('profile.photoAlt').addEventListener('change',previewPhoto);
$('#remove-photo').addEventListener('click',()=>{input('profile.photoUrl').value='';$('#photo-file').value='';previewPhoto();markDirty();});
$('#add-experience').addEventListener('click',()=>{const rows=collectExperience();if(rows.length>=30)return;const date=new Date();rows.unshift({role:'',company:'',detail:'',start:date.getFullYear()+'-'+String(date.getMonth()+1).padStart(2,'0'),end:'',bullets:[]});renderExperience(rows,0);markDirty();});
form.addEventListener('input',markDirty);form.addEventListener('change',markDirty);
window.addEventListener('beforeunload',event=>{if(!dirty&&!busy)return;event.preventDefault();event.returnValue='';});
async function loadFromServer(){
  if(!backend?.auth.currentUser || backend.auth.currentUser.uid!==OWNER_UID)return;
  const token=session;setBusy(true);status('Memuat konten dari server…');
  try{
    const snapshot=await backend.fs.getDocFromServer(backend.reference);
    if(token!==session)return;
    const exists=snapshot.exists(),raw=exists?snapshot.data().content:null,legacy=exists&&isLegacyContent(raw);
    let c;
    if(!exists)c=copy(defaultContent);
    else if(legacy){
      const base=copy(defaultContent);
      c=validateContent({...base,...raw,profile:{...base.profile,...(raw?.profile||{})},contact:{...base.contact,...(raw?.contact||{})}});
    }else c=validateContent(copy(raw));
    revision=exists?snapshot.data().revision:0;
    populate(c);ready=true;dirty=legacy;
    $('#save-state').textContent=legacy?'Template baru dimuat. Belum diterbitkan.':(revision?'Versi terbit '+revision+'. Belum ada perubahan.':(previewMode?'Draft lokal awal dimuat.':'Konten awal dimuat. Belum diterbitkan ke Firebase.'));
    status(previewMode?'Draft lokal siap diedit. Simpan pratinjau lalu klik Lihat website; website publik tidak berubah.':legacy?'Konten versi lama terdeteksi. Data lama dimigrasikan ke draft dengan mempertahankan konten yang tersedia. Periksa semua bagian, lalu klik Terbitkan perubahan.':(revision?'Konten terbaru dimuat dari server.':'Database masih kosong. Periksa data awal, lalu terbitkan untuk mengaktifkan konten online.'));
  }catch(error){if(token!==session)return;status('Editor belum diaktifkan karena konten gagal dimuat. '+(error.code==='permission-denied'?'Akses Firestore ditolak. Periksa UID pemilik dan Firestore Rules. ':error.code==='unavailable'?'Server Firestore belum terjangkau. Periksa koneksi. ':'Periksa format konten dan konfigurasi Firebase. ')+(error.message||'')+' Kode: '+(error.code||'validasi konten'),'error');}
  finally{if(token===session)setBusy(false);}
}
$('#reload-content').addEventListener('click',()=>{if(dirty&&!confirm('Buang perubahan yang belum diterbitkan dan muat ulang dari server?'))return;loadFromServer();});
form.addEventListener('submit',async event=>{
  event.preventDefault();if(!ready||busy||!backend?.auth.currentUser || backend.auth.currentUser.uid!==OWNER_UID)return;
  if(!form.reportValidity())return;
  let content;try{content=validateContent(collect());}catch(error){status(error.message,'error');return;}
  if(!previewMode&&!confirm('Terbitkan perubahan ini? Konten akan tampil untuk semua pengunjung.'))return;
  const token=session,expected=revision;setBusy(true);status('Menerbitkan perubahan…');
  try{
    const next=await backend.fs.runTransaction(backend.db,async transaction=>{
      const snapshot=await transaction.get(backend.reference);
      const current=snapshot.exists()?snapshot.data().revision:0;
      if(current!==expected)throw new Error('Konten telah berubah di sesi lain. Salin perubahan Anda bila perlu, lalu muat ulang dari server agar tidak menimpa versi terbaru.');
      const nextRevision=current+1;
      transaction.set(backend.reference,{schemaVersion:1,content,revision:nextRevision,updatedAt:backend.fs.serverTimestamp(),updatedBy:backend.auth.currentUser.uid});return nextRevision;
    });
    if(token!==session)return;revision=next;dirty=false;$('#save-state').textContent=previewMode?'Pratinjau lokal tersimpan (versi '+next+').':'Versi '+next+' berhasil diterbitkan.';status(previewMode?'Draft pratinjau tersimpan di browser ini. Klik Lihat website untuk memeriksanya. Website publik tidak berubah.':'Perubahan berhasil diterbitkan ke server. Website publik akan menerima pembaruan saat terhubung.','success');
  }catch(error){if(token===session)status('Belum diterbitkan. '+(error.message||'Periksa koneksi dan izin akses.'),'error');}
  finally{if(token===session)setBusy(false);}
});
// Image conversion before upload: reject SVG, limit file size and dimensions,
// re-encode pixels to WebP rather than trusting the original MIME alone.
async function preparePhoto(file){
  if(!file||!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>8*1024*1024)throw new Error('Pilih JPG, PNG, atau WebP maksimal 8 MB.');
  const bitmap=await createImageBitmap(file);
  try{
    if(bitmap.width*bitmap.height>24000000)throw new Error('Resolusi foto terlalu besar. Gunakan gambar di bawah 24 megapiksel.');
    const canvas=document.createElement('canvas');const scale=Math.min(1,1200/Math.max(bitmap.width,bitmap.height));canvas.width=Math.round(bitmap.width*scale);canvas.height=Math.round(bitmap.height*scale);const context=canvas.getContext('2d');
    if(!context)throw new Error('Browser tidak mendukung pemrosesan foto. Gunakan URL HTTPS.');
    context.drawImage(bitmap,0,0,canvas.width,canvas.height);
    const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/webp',.86));
    if(!blob||blob.type!=='image/webp'||blob.size>=1048576)throw new Error('Foto tidak dapat diperkecil ke WebP. Coba file lain atau gunakan URL.');return blob;
  }finally{bitmap.close();}
}
$('#upload-photo').addEventListener('click',async()=>{
  if(!ready||busy||!backend?.auth.currentUser||backend.auth.currentUser.uid!==OWNER_UID)return;
  const token=session;setBusy(true);status('Menyiapkan foto…');
  try{
    const blob=await preparePhoto($('#photo-file').files[0]);if(token!==session)return;
    const {sdk,storage}=await storageClient(backend.app);if(token!==session)return;
    const path='profile/avatar-'+newId()+'.webp';
    const reference=sdk.ref(storage,path);uploadTask=sdk.uploadBytesResumable(reference,blob,{contentType:'image/webp',cacheControl:'public,max-age=31536000,immutable'});
    const progress=$('#upload-progress');progress.hidden=false;
    await new Promise((resolve,reject)=>uploadTask.on('state_changed',snapshot=>{progress.value=snapshot.bytesTransferred/snapshot.totalBytes*100;},reject,resolve));
    const url=await sdk.getDownloadURL(reference);if(token!==session)return;
    input('profile.photoUrl').value=url;previewPhoto();markDirty();status('Foto diunggah. Klik Terbitkan perubahan agar foto dipakai oleh website publik.','success');
  }catch(error){if(token===session)status('Foto belum diterapkan. '+(error.message||'Periksa Firebase Storage, paket Blaze, dan Storage Rules.'),'error');}
  finally{uploadTask=null;$('#upload-progress').hidden=true;if(token===session)setBusy(false);}
});
$('#export-content').addEventListener('click',()=>{
  try{const value=validateContent(collect()),blob=new Blob([JSON.stringify(value,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='portfolio-content.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}catch(error){status(error.message,'error');}
});
$('#import-content').addEventListener('change',async event=>{
  const file=event.target.files[0];if(!file)return;
  try{if(file.size>150000)throw new Error('File JSON maksimal 150 KB.');const value=validateContent(JSON.parse(await file.text()));if(!confirm('Ganti draft editor dengan isi file ini? Perubahan belum diterbitkan.'))return;populate(value);markDirty();status('Konten diimpor ke draft. Periksa sebelum menyimpan.');}catch(error){status('Impor gagal. '+error.message,'error');}finally{event.target.value='';}
});
$('#recommended-content').addEventListener('click',()=>{
  if(!mayEdit()||!confirm('Terapkan naskah profil dan foto bawaan V6 ke draft? Daftar pengalaman, proyek, kontak, dan keahlian dipertahankan. Detail proyek yang masih kosong dilengkapi bila cocok dengan proyek bawaan. Belum diterbitkan.'))return;
  try{
    const current=validateContent(collect()), d=defaultContent.profile;
    ['headline','bio','about','greeting','statusDetail','photoUrl','photoAlt'].forEach(key=>current.profile[key]=d[key]);
    current.projects=current.projects.map(project=>{
      const match=defaultContent.projects.find(item=>{
        try{return new URL(item.url).hostname===new URL(project.url).hostname;}catch{return item.id===project.id;}
      });
      const next={...project,role:'Proyek pribadi'};
      if(match){for(const key of ['goal','approach','learning','features'])if(!next[key]?.length)next[key]=copy(match[key]);
        if(/official|perusahaan resmi/i.test(next.title+' '+next.description)){next.title=match.title;next.description=match.description;}}
      return next;
    });
    populate(current);markDirty();status('Naskah dan foto V6 diterapkan ke draft. Data pengalaman, daftar proyek, kontak, serta keahlian dipertahankan. Periksa sebelum menyimpan.');
  }catch(error){status(error.message,'error');}
});
// Login uses session persistence. Never embed an admin password in source code.
$('#toggle-password').addEventListener('click',()=>{const field=$('#login-password'),show=field.type==='password';field.type=show?'text':'password';$('#toggle-password').setAttribute('aria-pressed',String(show));$('#toggle-password').textContent=show?'Sembunyikan sandi':'Tampilkan sandi';});
$('#login-form').addEventListener('submit',async event=>{
  event.preventDefault();if(!backend)return;
  $('#login-submit').disabled=true;status('Memeriksa akun…');
  try{await backend.authSDK.signInWithEmailAndPassword(backend.auth,$('#login-email').value.trim(),$('#login-password').value);$('#login-password').value='';}
  catch(error){
    const messages={
      'auth/invalid-credential':'Email atau kata sandi tidak cocok.',
      'auth/user-not-found':'Akun admin belum tersedia atau kredensial tidak cocok.',
      'auth/wrong-password':'Email atau kata sandi tidak cocok.',
      'auth/invalid-email':'Format email tidak valid.',
      'auth/too-many-requests':'Terlalu banyak percobaan. Tunggu sebelum mencoba lagi.',
      'auth/network-request-failed':'Koneksi ke Firebase Authentication terputus.',
      'auth/operation-not-allowed':'Aktifkan metode Email/Password di Firebase Authentication.',
      'auth/unauthorized-domain':'Domain website belum diizinkan pada konfigurasi Firebase Authentication.',
      'auth/invalid-api-key':'API key pada firebase-config.js tidak valid.'
    };
    status('Login gagal. '+(messages[error.code]||'Periksa konfigurasi Firebase dan koneksi.')+' Kode: '+(error.code||'tidak tersedia'),'error');
  }
  finally{$('#login-submit').disabled=false;}
});
$('#reset-password').addEventListener('click',async()=>{
  if(!backend)return;const email=$('#login-email');if(!email.reportValidity())return;
  $('#reset-password').disabled=true;
  try{await backend.authSDK.sendPasswordResetEmail(backend.auth,email.value.trim());status('Jika email terdaftar dan permintaan diterima, petunjuk pemulihan akan tersedia di inbox/spam Anda.');}
  catch{status('Jika akun tersedia, coba pemulihan kembali setelah memeriksa email dan koneksi.','error');}
  finally{$('#reset-password').disabled=false;}
});
$('#logout').addEventListener('click',async()=>{if(dirty&&!confirm('Keluar dan buang perubahan yang belum diterbitkan?'))return;try{await backend.authSDK.signOut(backend.auth);}catch{status('Belum dapat keluar. Coba lagi.','error');}});
if(!storageEnabled){$('#upload-photo').disabled=true;$('#photo-file').disabled=true;$('#storage-note').textContent='Unggah belum diaktifkan. Gunakan URL HTTPS, path assets/… (file diunggah lewat file manager), atau aktifkan Firebase Storage (paket Blaze).';}
if(previewMode){
  const key='portfolio-preview-v6';let record=null;try{record=JSON.parse(localStorage.getItem(key));if(record)validateContent(record.content);}catch{record=null;}
  const user={uid:OWNER_UID,email:'Pratinjau lokal · tanpa koneksi Firebase'};
  backend={auth:{currentUser:user},db:{},reference:{},fs:{
    getDocFromServer:async()=>({exists:()=>!!record,data:()=>record}),
    serverTimestamp:()=>new Date().toISOString(),
    runTransaction:async(_db,callback)=>{let next;const result=await callback({get:async()=>({exists:()=>!!record,data:()=>record}),set:(_ref,value)=>{next=value;}});localStorage.setItem(key,JSON.stringify(next));record=next;return result;}
  }};
  $('#login-view').hidden=true;$('#editor-view').hidden=false;$('#identity').hidden=false;$('#identity').textContent=user.email;
  $('#build-status').textContent='MODE PRATINJAU LOKAL — editor dapat dicoba tanpa login. Tidak membaca atau menulis Firebase.';
  document.querySelector('header a').href='index.html?preview=1';
  $('#upload-photo').disabled=true;$('#photo-file').disabled=true;$('#storage-note').textContent='Mode lokal: gunakan URL HTTPS atau path assets/. Unggahan Firebase dinonaktifkan.';
  await loadFromServer();$('#reload-content').textContent='Muat ulang draft lokal';
}else if(!configured())status('Setup belum selesai. Isi firebase-config.js, buat akun admin, dan terapkan aturan keamanan sesuai panduan.','error');
else{
  try{
    backend=await Promise.race([connect(),new Promise((_,reject)=>setTimeout(()=>reject(new Error('Koneksi melewati batas waktu.')),12000))]);$('#login-submit').disabled=false;await backend.authSDK.setPersistence(backend.auth,backend.authSDK.browserSessionPersistence);
    backend.authSDK.onAuthStateChanged(backend.auth,async user=>{
      session++;if(uploadTask)uploadTask.cancel();ready=false;dirty=false;setBusy(false);
      const allowed=!!user&&user.uid===OWNER_UID;
      $('#editor-view').hidden=!allowed;$('#login-view').hidden=allowed;$('#logout').hidden=!user;$('#identity').hidden=!allowed;
      if(allowed){$('#identity').textContent=user.email||'Admin';await loadFromServer();}
      else if(user){deniedAccount=true;status('Akun ini tidak memiliki akses admin.','error');try{await backend.authSDK.signOut(backend.auth);}catch{}}
      else{status(deniedAccount?'Akun tersebut tidak memiliki akses admin. Gunakan akun dengan UID yang sudah diizinkan.':'Masuk menggunakan akun admin yang sudah dibuat di Firebase Console.',deniedAccount?'error':'');deniedAccount=false;}
    });
  }catch{status('Firebase belum dapat terhubung. Periksa konfigurasi, jaringan, domain hosting, dan pengaturan Authentication.','error');}
}
