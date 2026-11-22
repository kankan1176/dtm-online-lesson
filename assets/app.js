(() => {
  const c = window.SITE_CONFIG, courses = window.COURSES;
  const pack = x => x.pack === 'vocal' ? '歌ってみたパック' : 'サウンドエンジニアパック';
  document.querySelector('#course-list').innerHTML = courses.map(x => `<article class="course" id="${x.id}" data-pack="${x.pack}"><div class="course-top"><span class="pack-name">${pack(x)}</span><span class="tag">${x.tag}</span></div><h3>${x.name}</h3><p class="course-intro">${x.intro}</p><p class="course-level"><b>こんな方に</b>${x.level}</p><div class="course-goal"><strong>修了時にできること</strong>${x.goal}</div><details><summary>本編3回の内容と達成基準を見る</summary>${x.lessons.map((l,i)=>`<div class="lesson"><span class="lesson-label">${i+2}回目 ／ レッスン${['①','②','③'][i]}</span><h4>${l[0]}</h4><p>${l[1]}</p><p class="outcome"><strong>この回の終了時：</strong>${l[2]}</p></div>`).join('')}<h4>習得度を確認するポイント</h4><ul class="criteria">${x.criteria.map(t=>`<li>${t}</li>`).join('')}</ul><p class="scope"><strong>提出物：</strong>${x.task}</p><p class="scope">${x.scope}</p></details><a class="button secondary" href="apply.html?course=${x.id}">このコースを選んで申込へ</a></article>`).join('');
  const yen = n => new Intl.NumberFormat('ja-JP', {style:'currency', currency:'JPY', maximumFractionDigits:0}).format(n);
  document.querySelector('#price-list').innerHTML = `<div class="bundle-grid">${(c.bundles||[]).map(b=>`<article class="bundle"><p class="eyebrow">3コースまとめて</p><h3>${b.name}</h3><p class="bundle-price">${yen(b.price)}</p><p>${b.courseIds.map(id=>courses.find(x=>x.id===id).name).join(' ／ ')}</p><a class="button" href="apply.html?course=${b.id}">このパックを選ぶ</a></article>`).join('')}</div><p class="muted">まとめて学ぶパックと、学びたい工程だけの単独コースから選べます。表示料金の${c.taxLabel}です。</p><h3>単独コース</h3>`+courses.map(x=>`<div class="price-row"><div><span>${pack(x)} ／ 90分×全5回</span><h3>${x.name}</h3></div><strong>${Number.isFinite(c.prices[x.id]) ? yen(c.prices[x.id]) : '料金調整中'}</strong></div>`).join('');
  if(c.paymentMethods.length) document.querySelector('#payment-methods').textContent = c.paymentMethods.join(' ／ ');
  if(c.paymentNote) document.querySelector('#payment-note').textContent = c.paymentNote;
  if(c.archivePeriod) document.querySelector('#archive-answer').textContent = c.archivePeriod;
  if(c.formEndpoint && courses.every(x=>Number.isFinite(c.prices[x.id])) && c.paymentMethods.length) document.querySelector('#reception-note').textContent = '申込内容・事前ヒアリングの送信後、日程などをご案内します。';
  let layoutFrame;
  function alignCards() {
    const selectors=['.course-top','h3','.course-intro','.course-level','.course-goal'];
    const cards=[...document.querySelectorAll('.course')];
    cards.forEach(card=>selectors.forEach(s=>card.querySelector(s).style.minHeight=''));
    const rows=new Map();
    cards.filter(card=>!card.hidden).forEach(card=>{const top=Math.round(card.offsetTop);if(!rows.has(top))rows.set(top,[]);rows.get(top).push(card);});
    rows.forEach(row=>{if(row.length<2)return;selectors.forEach(s=>{const height=Math.max(...row.map(card=>card.querySelector(s).getBoundingClientRect().height));row.forEach(card=>card.querySelector(s).style.minHeight=`${Math.ceil(height)}px`);});});
  }
  const scheduleLayout=()=>{cancelAnimationFrame(layoutFrame);layoutFrame=requestAnimationFrame(alignCards);};
  window.addEventListener('resize',scheduleLayout);
  document.fonts.ready.then(scheduleLayout);
  scheduleLayout();
  document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{
    document.querySelectorAll('[data-filter]').forEach(t=>t.setAttribute('aria-pressed',String(t===b)));
    document.querySelectorAll('.course').forEach(t=>t.hidden = b.dataset.filter !== 'all' && b.dataset.filter !== t.dataset.pack);
    scheduleLayout();
  }));
  document.querySelector('#interest').addEventListener('change',e=>{
    const x=courses.find(t=>t.id===e.target.value), box=document.querySelector('#recommendation');
    if(!x){box.innerHTML='<p>目標を選ぶと、おすすめのコースを表示します。</p>'; return;}
    box.innerHTML=`<p class="eyebrow">${pack(x)}</p><h3>${x.name}</h3><p>${x.goal}</p><a class="text-link" href="#${x.id}">このコースの詳細を見る</a>`;
    box.querySelector('a').addEventListener('click',()=>{document.querySelector('[data-filter="all"]').click();});
  });
})();
