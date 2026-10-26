// Month-based durations follow the portfolio's Indonesian timezone.
export function currentMonth(now=new Date()) {
  const parts=new Intl.DateTimeFormat('en',{timeZone:'Asia/Jakarta',year:'numeric',month:'numeric'}).formatToParts(now);
  return Number(parts.find(p=>p.type==='year').value)*12+Number(parts.find(p=>p.type==='month').value)-1;
}
function month(value){
  if(!/^\d{4}-(0[1-9]|1[0-2])$/.test(value||''))return null;
  const [y,m]=value.split('-').map(Number);return y*12+m-1;
}
export function experienceGroup(job){
  const roles=[job.role,job.detail,job.roleEn,job.detailEn].filter(Boolean).join(' ');
  if(/\bfreelanc(?:e|er)\b|pekerja lepas/i.test(roles+' '+(job.company||'')))return 'freelance';
  if(/\boperations?\b|operasional|qc[\s-]*content|content[\s-]*agent|\bkyc\b/i.test(roles))return 'operations';
  return 'other';
}
export function experienceMonths(jobs,group,now=new Date()){
  const today=currentMonth(now);
  const ranges=(jobs||[]).filter(job=>experienceGroup(job)===group).map(job=>{
    const start=month(job.start),end=job.end?month(job.end):today;
    return start===null||end===null?null:[start,Math.min(end,today)];
  }).filter(r=>r&&r[1]>r[0]).sort((a,b)=>a[0]-b[0]);
  let total=0,last=null;
  for(const range of ranges){
    if(last&&range[0]<=last[1])last[1]=Math.max(last[1],range[1]);
    else{if(last)total+=last[1]-last[0];last=range.slice();}
  }
  return total+(last?last[1]-last[0]:0);
}
function duration(months,lang){
  const years=Math.floor(months/12),remaining=months%12,en=lang==='en';
  const parts=[];
  if(years)parts.push(years+(en?(years===1?' year':' years'):' tahun'));
  if(remaining||!years)parts.push(remaining+(en?(remaining===1?' month':' months'):' bulan'));
  return parts.join(', ');
}
export function heroStats(content,now=new Date(),lang='id'){
  return String(content.profile?.stats||'').split(/\n/).map(s=>s.trim()).filter(Boolean).slice(0,4).map(line=>{
    const at=line.indexOf('|');let value=(at<0?line:line.slice(0,at)).trim(),label=(at<0?'':line.slice(at+1)).trim(),hint='';
    let kind=null;
    if(value.includes('{projectCount}'))kind='projects';
    else if(value.includes('{operationsYears}'))kind='operations';
    else if(value.includes('{freelanceYears}'))kind='freelance';
    else if(/projects?|proyek/i.test(label))kind='projects';
    else if(/years?|tahun/i.test(label)&&/freelance/i.test(label))kind='freelance';
    else if(/years?|tahun/i.test(label)&&/operations?|operasional/i.test(label))kind='operations';
    if(kind==='projects')value=String((content.projects||[]).length);
    else if(kind){const months=experienceMonths(content.experience,kind,now);value=months>=12?Math.floor(months/12)+'+':months>0?'<1':'0';hint=duration(months,lang);}
    if(label==='Proyek web mandiri')label='Proyek pribadi';
    if(label==='Self-built web projects')label='Personal projects';
    if(label==='Tahun desain grafis freelance')label='Tahun pengalaman freelance';
    if(label==='Years of freelance graphic design')label='Years of freelance experience';
    return {value,label,hint};
  }).filter(stat=>stat.value);
}
