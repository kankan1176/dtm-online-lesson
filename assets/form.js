(() => {
  'use strict';
  const config = window.SITE_CONFIG, courses = window.COURSES;
  const key = 'dtm-lesson-application-v1';
  const labels = {course:'希望コース',name:'お名前・活動名',email:'メールアドレス',discord:'Discordユーザー名',schedule:'希望の曜日・時間帯',purpose:'受講目的',experience:'DTM・録音の経験',experienceDetail:'現在できる作業・学習経験',difficulty:'困っていること',os:'PCのOS',daw:'DAW・バージョン',equipment:'使用機材',plugins:'使用プラグイン',connection:'接続の準備状況',notes:'その他'};
  let data = {};
  try { data = JSON.parse(sessionStorage.getItem(key) || '{}'); if(!data || typeof data !== 'object' || Array.isArray(data)) data={}; } catch { data={}; }
  const error = message => { const node=document.querySelector('#form-error'); if(node){node.textContent=message;node.focus();} };
  const save = values => { try { data={...data,...values}; sessionStorage.setItem(key,JSON.stringify(data)); return true; } catch { error('ページを移動するための一時保存が利用できません。ブラウザーの設定をご確認ください。'); return false; } };
  const bundles=config.bundles||[], plans=[...courses,...bundles];
  const displayCourse = id => {const b=bundles.find(x=>x.id===id);if(b)return `${b.name}（3コースまとめて）`;const x=courses.find(c=>c.id===id); return x ? `${x.pack==='vocal'?'歌ってみた':'サウンドエンジニア'}：${x.name}` : '';};
  const validEndpoint = (()=>{try{return new URL(config.formEndpoint).protocol==='https:';}catch{return false;}})();
  const ready = validEndpoint && courses.every(c=>Number.isFinite(config.prices[c.id]) && config.prices[c.id]>=0) && config.paymentMethods.length>0 && config.operatorName && config.contactEmail;
  if(ready) document.querySelectorAll('.reception-status').forEach(n=>n.textContent='内容確認画面で同意のうえ送信してください。送信時点では決済や日程の確定は行いません。');
  function hydrate(form){ for(const [k,v] of Object.entries(data)){ const input=form.elements.namedItem(k); if(input && typeof v==='string') input.value=v; } }
  function read(form){return Object.fromEntries([...new FormData(form)].map(([k,v])=>[k,String(v).trim()]));}
  const application=document.querySelector('#application-form');
  if(application){
    const select=application.elements.course;
    [...bundles,...courses].forEach(c=>{const option=document.createElement('option'); option.value=c.id;option.textContent=displayCourse(c.id);select.append(option);});
    hydrate(application);
    const requested=new URLSearchParams(location.search).get('course'); if(plans.some(c=>c.id===requested)) select.value=requested;
    const update=()=>{const bundle=bundles.find(x=>x.id===select.value),amount=bundle?bundle.price:config.prices[select.value],scope=bundle?'3コースまとめて（各コース90分×全5回）':'90分×全5回'; document.querySelector('#selected-price').textContent=!select.value?'コース・パックを選択してください。': Number.isFinite(amount)?`${scope}：${amount.toLocaleString('ja-JP')}円（${config.taxLabel}）。支払い方法：${config.paymentMethods.join('・')}`:`${scope}。料金は現在調整中です。`;};update();select.addEventListener('change',update);
    const confirm=application.elements.emailConfirm; confirm.addEventListener('input',()=>confirm.setCustomValidity(''));application.elements.email.addEventListener('input',()=>confirm.setCustomValidity(''));
    application.addEventListener('submit',e=>{e.preventDefault();const values=read(application);if(values.email.toLowerCase()!==values.emailConfirm.toLowerCase()){confirm.setCustomValidity('メールアドレスが一致しません。');confirm.reportValidity();return;}confirm.setCustomValidity('');if(!plans.some(c=>c.id===values.course)) return;delete values.emailConfirm;if(save(values))location.href='hearing.html';});
    if(data.email)confirm.value=data.email;
  }
  const hearing=document.querySelector('#hearing-form');
  if(hearing){hydrate(hearing);if(!data.name || !data.email || !displayCourse(data.course)){document.querySelector('#missing-application').hidden=false;hearing.querySelector('button[type="submit"]').disabled=true;}
    hearing.addEventListener('submit',e=>{e.preventDefault();if(save(read(hearing)))location.href='review.html';});
  }
  const review=document.querySelector('#review-content');
  if(review){
    const complete = data.name && data.email && displayCourse(data.course) && data.purpose && data.experience && data.difficulty && data.os && data.daw && data.equipment;
    if(!complete){const p=document.createElement('p');p.textContent='入力情報が揃っていません。受講申込からご入力ください。';review.append(p);const a=document.createElement('a');a.href='apply.html';a.textContent='受講申込へ';review.append(a);document.querySelector('#send-controls').hidden=true;return;}
    for(const [name,label] of Object.entries(labels)){const row=document.createElement('div'),dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=label;dd.textContent=name==='course'?displayCourse(data.course):typeof data[name]==='string'&&data[name]?data[name]:'未記入';row.append(dt,dd);review.append(row);}
    const text=()=>['KミュージックDTMスクール 受講申込・事前ヒアリング（未送信の控え）','',...Object.entries(labels).map(([k,label])=>`${label}\n${k==='course'?displayCourse(data.course):data[k]||'未記入'}\n`)].join('\n');
    document.querySelector('#download-draft').addEventListener('click',()=>{const blob=new Blob(['\uFEFF'+text()],{type:'text/plain;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='DTMレッスン_申込内容の控え.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
    document.querySelector('#clear-draft').addEventListener('click',()=>{sessionStorage.removeItem(key);data={};location.href='apply.html';});
    const send=document.querySelector('#send-application'),consent=document.querySelector('#consent');let sending=false;
    if(ready){send.textContent='この内容で申し込む';consent.addEventListener('change',()=>send.disabled=!consent.checked||sending);}
    send.addEventListener('click',async()=>{if(!ready||!consent.checked||sending)return;sending=true;send.disabled=true;send.textContent='送信中…';error('');try{
      const response=await fetch(config.formEndpoint,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify({...data,courseLabel:displayCourse(data.course),consent:true,submittedAt:new Date().toISOString()}),signal:AbortSignal.timeout(20000)});
      if(!response.ok)throw new Error('server');const result=await response.json();if(result.success!==true)throw new Error('unconfirmed');
      document.querySelector('#send-result').textContent='お申し込みを受け付けました。日程などのご案内をお待ちください。';document.querySelector('#send-result').className='success';send.textContent='送信済み';consent.disabled=true;sessionStorage.removeItem(key);
    }catch{sending=false;send.disabled=!consent.checked;send.textContent='この内容で申し込む';error('受付の完了を確認できませんでした。再送前に運営窓口へ受付状況をご確認ください。入力内容はこのタブに残っています。');}});
  }
  const operator=document.querySelector('#operator-information');if(operator&&config.operatorName&&config.contactEmail)operator.textContent=`運営：${config.operatorName} ／ お問い合わせ：${config.contactEmail}`;
})();
