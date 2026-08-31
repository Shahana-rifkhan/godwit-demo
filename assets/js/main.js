/* ============================================================
   GODWIT HOLIDAYS — Site Scripts
   Shared behaviour for every page: nav, FAQ accordion, deal-card
   rendering, search/filter forms, scroll effects, reveal-on-scroll
   animations, and tilt effects.
   Deal DATA lives separately in assets/js/deals-data.js (loaded
   before this file on holidays.html only).
   ============================================================ */
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
$('.menu-btn')?.addEventListener('click',()=>$('.navlinks')?.classList.toggle('open'));
$$('.nav-search-btn').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();const wrap=b.closest('.nav-search');const open=wrap.classList.toggle('open');b.setAttribute('aria-expanded',open);if(open)wrap.querySelector('input')?.focus()}));
document.addEventListener('click',e=>{$$('.nav-search.open').forEach(w=>{if(!w.contains(e.target))w.classList.remove('open')})});
document.addEventListener('keydown',e=>{if(e.key==='Escape')$$('.nav-search.open').forEach(w=>w.classList.remove('open'))});
$$('.faq-q').forEach(b=>b.addEventListener('click',()=>b.closest('.faq-item').classList.toggle('open')));
function dealCard(d,prefix=''){return `<article class="deal-card"><a href="${prefix}holidays/deal-${String(d.id).padStart(2,'0')}.html"><div class="photo"><img loading="lazy" src="${d.image}" alt="${d.title}"><span class="tag">${d.category}</span></div><div class="body"><div class="deal-meta"><span>${d.nights} nights</span><span>Deal ${String(d.id).padStart(2,'0')}</span></div><h3>${d.title}</h3><p>${d.description}</p><div class="price">From ${d.price}*</div><span class="btn btn-secondary">View holiday →</span></div></a></article>`}
function renderDeals(){const grid=$('#dealsGrid');if(!grid||!window.GODWIT_DEALS)return;let arr=[...GODWIT_DEALS];const q=($('#dealSearch')?.value||'').toLowerCase(),cat=$('#catFilter')?.value||'',budget=parseInt($('#budgetFilter')?.value||'99999'),nights=$('#nightFilter')?.value||'';arr=arr.filter(d=>{const p=parseInt(d.price.replace(/[^0-9]/g,''));let nightOK=!nights||(nights==='short'?d.nights<=5:nights==='week'?d.nights>=6&&d.nights<=9:d.nights>=10);return (!q||(d.title+' '+d.description).toLowerCase().includes(q))&&(!cat||d.category===cat)&&p<=budget&&nightOK});grid.innerHTML=arr.map(d=>dealCard(d,'')).join('')||'<div class="empty">No holidays match those filters. Try changing your search.</div>';$('#resultCount')&&($('#resultCount').textContent=`${arr.length} holidays`)}
['dealSearch','catFilter','budgetFilter','nightFilter'].forEach(id=>$('#'+id)?.addEventListener('input',renderDeals));renderDeals();
const homeSearch=$('#homeSearch');homeSearch?.addEventListener('submit',e=>{e.preventDefault();const q=encodeURIComponent($('#homeDestination').value);const c=encodeURIComponent($('#homeType').value);location.href=`holidays.html?q=${q}&cat=${c}`});
if($('#dealsGrid')){const p=new URLSearchParams(location.search);if(p.get('q'))$('#dealSearch').value=p.get('q');if(p.get('cat'))$('#catFilter').value=p.get('cat');renderDeals()}
$$('form[data-mailto]').forEach(f=>f.addEventListener('submit',e=>{e.preventDefault();const data=new FormData(f), lines=[];for(const [k,v] of data.entries()) if(v) lines.push(`${k}: ${v}`);const subject=encodeURIComponent(data.get('subject')||'Godwit Holidays enquiry');const body=encodeURIComponent(lines.join('\n'));location.href=`mailto:noah@godwit.uk?subject=${subject}&body=${body}`}));

document.body.classList.add('page-enter');
const progress=document.createElement('div');progress.className='scroll-progress';document.body.appendChild(progress);
const backTop=document.createElement('button');backTop.className='back-top';backTop.setAttribute('aria-label','Back to top');backTop.innerHTML='↑';document.body.appendChild(backTop);

backTop.addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}));
const header=$('.header');
function onScroll(){
  const h=document.documentElement;const max=h.scrollHeight-h.clientHeight;progress.style.width=(max?scrollY/max*100:0)+'%';
  header?.classList.toggle('scrolled',scrollY>35);backTop.classList.toggle('show',scrollY>500);
}
addEventListener('scroll',onScroll,{passive:true});onScroll();

$$('.section-title,.intro,.section-head,.why-lead,.why-item,.newsletter-inner,.footer-grid,.safe,.content-card,.quote-card,.info-box,.cta-strip').forEach((el,i)=>{if(!el.hasAttribute('data-reveal')) el.setAttribute('data-reveal',i%3===0?'left':i%3===1?'right':'up')});
$$('.offer-carousel,.cards,.deals-under,.escape-grid,.trust-row,.feature-grid').forEach(el=>el.classList.add('stagger'));
const revealObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');revealObserver.unobserve(e.target)}}),{threshold:.08,rootMargin:'0px 0px -24px'});
$$('[data-reveal]').forEach(el=>revealObserver.observe(el));
const staggerObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');staggerObserver.unobserve(e.target)}}),{threshold:.01,rootMargin:'120px 0px 120px'});
$$('.stagger').forEach(el=>staggerObserver.observe(el));

if(matchMedia('(pointer:fine)').matches){
  $$('.offer-card,.deal-card,.compact-deal,.info-box').forEach(card=>{
    card.addEventListener('mousemove',e=>{const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.transform=`translateY(-6px) perspective(900px) rotateX(${(-y*2).toFixed(2)}deg) rotateY(${(x*2).toFixed(2)}deg)`});
    card.addEventListener('mouseleave',()=>card.style.transform='');
  });
  const glow=document.createElement('div');glow.className='pointer-glow';document.body.appendChild(glow);let gx=-300,gy=-300,tx=-300,ty=-300;
  addEventListener('mousemove',e=>{tx=e.clientX;ty=e.clientY},{passive:true});
  (function animateGlow(){gx+=(tx-gx)*.12;gy+=(ty-gy)*.12;glow.style.left=gx+'px';glow.style.top=gy+'px';requestAnimationFrame(animateGlow)})();
}

const hero=$('.hero,.page-hero,.deal-hero');
if(hero && matchMedia('(pointer:fine)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches){
  hero.addEventListener('mousemove',e=>{const r=hero.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;hero.style.backgroundPosition=`calc(50% + ${x*10}px) calc(50% + ${y*8}px)`});
  hero.addEventListener('mouseleave',()=>hero.style.backgroundPosition='center');
}

const priceObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.animate([{transform:'scale(.94)',opacity:.5},{transform:'scale(1.04)',opacity:1},{transform:'scale(1)',opacity:1}],{duration:520,easing:'cubic-bezier(.2,.8,.2,1)'});priceObserver.unobserve(e.target)}}),{threshold:.6});
$$('.price,.big-price').forEach(p=>priceObserver.observe(p));

/* ============================================================
   GODWIT HOLIDAYS — WhatsApp Chat Widget
   Self-contained: injects its own scoped styles + markup on every
   page that loads main.js. Does not touch any existing element,
   selector, class or ID used above. Safe to remove by deleting
   this block only.
   ============================================================ */
(function(){
  if(document.getElementById('gwWaFab')) return; // guard against double-init

  const WA_NUMBER = '442079460958';
  const WA_LINK = (msg)=> `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
  const QUICK_ITEMS = [
    {icon:'✈',label:'Holiday Packages',msg:'I would like to know about your holiday packages.'},
    {icon:'🌎',label:'Custom Trip Planning',msg:'I need help planning a custom holiday.'},
    {icon:'💰',label:'Request a Quote',msg:'I would like to request a holiday quotation.'},
    {icon:'🏨',label:'Flight & Hotel Enquiries',msg:'I need information about flights and hotels.'}
  ];
  const WELCOME_MSG = 'Hello 👋 Welcome to Godwit Holidays. How can we help you plan your next journey?';

  const style=document.createElement('style');
  style.id='gwWaStyles';
  style.textContent=`
.gw-wa-fab{position:fixed;right:26px;bottom:25px;z-index:400;width:62px;height:62px;border-radius:50%;border:0;cursor:pointer;display:flex;align-items:center;justify-content:center;background:linear-gradient(145deg,#28d365,#20bd5a);box-shadow:0 10px 28px rgba(18,140,72,.38),0 2px 8px rgba(0,0,0,.12);animation:gwWaFloat 3.2s ease-in-out infinite;transition:transform .25s ease,box-shadow .25s ease}
.gw-wa-fab:hover{animation-play-state:paused;transform:scale(1.08);box-shadow:0 14px 34px rgba(18,140,72,.46),0 4px 10px rgba(0,0,0,.14)}
.gw-wa-fab:before{content:"";position:absolute;inset:0;border-radius:50%;box-shadow:0 0 0 0 rgba(40,211,101,.55);animation:gwWaPulse 2.6s ease-out infinite}
.gw-wa-fab svg{width:30px;height:30px;position:relative;z-index:1}
.gw-wa-fab .gw-wa-close-ic{display:none}
.gw-wa-fab.gw-wa-open .gw-wa-chat-ic{display:none}
.gw-wa-fab.gw-wa-open .gw-wa-close-ic{display:block}
@keyframes gwWaFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
@keyframes gwWaPulse{0%{box-shadow:0 0 0 0 rgba(40,211,101,.5)}70%{box-shadow:0 0 0 16px rgba(40,211,101,0)}100%{box-shadow:0 0 0 0 rgba(40,211,101,0)}}
.gw-wa-popup{position:fixed;right:26px;bottom:95px;z-index:400;width:328px;max-width:calc(100vw - 32px);background:#fff;border-radius:16px;box-shadow:0 24px 60px rgba(11,61,120,.28),0 6px 18px rgba(11,61,120,.12);overflow:hidden;opacity:0;visibility:hidden;transform:translateY(16px) scale(.96);transform-origin:bottom right;transition:opacity .25s ease,transform .25s ease,visibility .25s}
.gw-wa-popup.gw-wa-open{opacity:1;visibility:visible;transform:translateY(0) scale(1)}
.gw-wa-popup-head{background:linear-gradient(120deg,#0b3d78,#159af0);padding:18px 18px 34px;position:relative;color:#fff}
.gw-wa-popup-close{position:absolute;top:12px;right:12px;width:26px;height:26px;border-radius:50%;border:0;background:rgba(255,255,255,.18);color:#fff;font-size:15px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .2s ease}
.gw-wa-popup-close:hover{background:rgba(255,255,255,.32)}
.gw-wa-popup-brand{display:flex;align-items:center;gap:12px}
.gw-wa-popup-avatar{width:42px;height:42px;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center;flex:none}
.gw-wa-popup-avatar svg{width:24px;height:24px}
.gw-wa-popup-title{font-family:var(--serif,Georgia,serif);font-weight:600;font-size:1.02rem;line-height:1.2;margin:0}
.gw-wa-popup-sub{display:flex;align-items:center;gap:6px;font-size:.76rem;color:#cfe4fb;margin-top:3px}
.gw-wa-popup-sub:before{content:"";width:7px;height:7px;border-radius:50%;background:#3ddc73;box-shadow:0 0 0 2px rgba(61,220,115,.35)}
.gw-wa-popup-body{padding:0 16px 16px;margin-top:-20px}
.gw-wa-popup-msg{background:#fff;border-radius:12px 12px 12px 2px;padding:12px 14px;font-size:.86rem;line-height:1.5;color:#28303d;box-shadow:0 6px 18px rgba(11,61,120,.14);margin:0 0 14px}
.gw-wa-quick{display:flex;flex-direction:column;gap:8px}
.gw-wa-quick-btn{display:flex;align-items:center;gap:10px;width:100%;text-align:left;padding:11px 13px;border-radius:10px;border:1px solid #e3ecf7;background:#f7f9fc;font-family:var(--sans,inherit);font-size:.83rem;font-weight:600;color:#0b3d78;cursor:pointer;transition:background .2s ease,border-color .2s ease,transform .2s ease}
.gw-wa-quick-btn:hover{background:#e6f2fc;border-color:#159af0;transform:translateX(2px)}
.gw-wa-quick-btn .gw-wa-em{font-size:1rem;flex:none}
.gw-wa-popup-foot{padding:12px 16px;border-top:1px solid #eef2f8;text-align:center;font-size:.72rem;color:#8aa0c4}
@media(max-width:600px){
  .gw-wa-fab{right:16px;bottom:20px;width:54px;height:54px}
  .gw-wa-fab svg{width:26px;height:26px}
  .gw-wa-popup{right:16px;bottom:85px;width:calc(100vw - 32px)}
}
@media(prefers-reduced-motion:reduce){.gw-wa-fab{animation:none}.gw-wa-fab:before{animation:none}}
`;
  document.head.appendChild(style);

  const chatIcon=`<svg class="gw-wa-chat-ic" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.02 4C9.4 4 4 9.37 4 15.98c0 2.12.56 4.14 1.6 5.93L4 28l6.27-1.55a12.02 12.02 0 0 0 5.75 1.46h.01c6.62 0 12.02-5.37 12.02-11.98C28.05 9.37 22.65 4 16.02 4Z" fill="#fff"/><path d="M22.06 19.02c-.32-.16-1.9-.94-2.2-1.05-.3-.11-.5-.16-.72.16-.21.32-.83 1.05-1.02 1.26-.19.21-.37.24-.69.08-.32-.16-1.34-.5-2.55-1.58-.94-.84-1.58-1.87-1.76-2.19-.18-.32-.02-.49.14-.65.14-.14.32-.37.48-.55.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.72-1.75-.99-2.39-.26-.63-.53-.54-.72-.55-.19-.01-.4-.01-.61-.01-.21 0-.56.08-.85.4-.29.32-1.12 1.1-1.12 2.67 0 1.57 1.15 3.09 1.31 3.3.16.21 2.26 3.47 5.48 4.86.77.33 1.36.53 1.83.68.77.25 1.47.21 2.02.13.62-.09 1.9-.78 2.17-1.53.27-.75.27-1.39.19-1.53-.08-.13-.29-.21-.61-.37Z" fill="#22c35e"/></svg><svg class="gw-wa-close-ic" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 6l12 12M18 6L6 18" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/></svg>`;
  const avatarIcon=`<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.02 4C9.4 4 4 9.37 4 15.98c0 2.12.56 4.14 1.6 5.93L4 28l6.27-1.55a12.02 12.02 0 0 0 5.75 1.46h.01c6.62 0 12.02-5.37 12.02-11.98C28.05 9.37 22.65 4 16.02 4Z" fill="#25D366"/><path d="M22.06 19.02c-.32-.16-1.9-.94-2.2-1.05-.3-.11-.5-.16-.72.16-.21.32-.83 1.05-1.02 1.26-.19.21-.37.24-.69.08-.32-.16-1.34-.5-2.55-1.58-.94-.84-1.58-1.87-1.76-2.19-.18-.32-.02-.49.14-.65.14-.14.32-.37.48-.55.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.72-1.75-.99-2.39-.26-.63-.53-.54-.72-.55-.19-.01-.4-.01-.61-.01-.21 0-.56.08-.85.4-.29.32-1.12 1.1-1.12 2.67 0 1.57 1.15 3.09 1.31 3.3.16.21 2.26 3.47 5.48 4.86.77.33 1.36.53 1.83.68.77.25 1.47.21 2.02.13.62-.09 1.9-.78 2.17-1.53.27-.75.27-1.39.19-1.53-.08-.13-.29-.21-.61-.37Z" fill="#fff"/></svg>`;

  const fab=document.createElement('button');
  fab.id='gwWaFab';
  fab.className='gw-wa-fab';
  fab.type='button';
  fab.setAttribute('aria-label','Chat with Godwit Holidays on WhatsApp');
  fab.setAttribute('aria-expanded','false');
  fab.innerHTML=chatIcon;

  const popup=document.createElement('div');
  popup.id='gwWaPopup';
  popup.className='gw-wa-popup';
  popup.setAttribute('role','dialog');
  popup.setAttribute('aria-label','Godwit Holidays WhatsApp chat');
  popup.innerHTML=`
    <div class="gw-wa-popup-head">
      <button type="button" class="gw-wa-popup-close" aria-label="Close chat popup">✕</button>
      <div class="gw-wa-popup-brand">
        <span class="gw-wa-popup-avatar">${avatarIcon}</span>
        <div>
          <p class="gw-wa-popup-title">Godwit Holidays</p>
          <p class="gw-wa-popup-sub">Travel Experts Online</p>
        </div>
      </div>
    </div>
    <div class="gw-wa-popup-body">
      <p class="gw-wa-popup-msg">${WELCOME_MSG}</p>
      <div class="gw-wa-quick"> 
        ${QUICK_ITEMS.map(q=>`<button type="button" class="gw-wa-quick-btn" data-msg="${q.msg.replace(/"/g,'&quot;')}"><span class="gw-wa-em">${q.icon}</span><span>${q.label}</span></button>`).join('')}
      </div>
    </div>
    <div class="gw-wa-popup-foot">We usually reply within a few minutes</div>
  `;

  /* ============================================================
   GODWIT HOLIDAYS — ATOL FLOATING LOGO
   Bottom Left Fixed Badge
   ============================================================ */

const atolLogo = document.createElement('div');

atolLogo.id = "gwAtolLogo";

atolLogo.className = "gw-atol-logo";


atolLogo.innerHTML = `
    <img src="assets/img/atol.png" alt="ATOL Protected">
`;



const atolStyle = document.createElement('style');

atolStyle.textContent = `


/* ==========================
   ATOL BUTTON
========================== */

.gw-atol-logo{

    position:fixed;

    left:26px;
    bottom:25px;

    width:62px;
    height:62px;


    background:#ffffff;

    border-radius:50%;


    display:flex;

    align-items:center;

    justify-content:center;


    padding:6px;


    z-index:2147483647;


    box-shadow:
    0 10px 28px rgba(11,61,120,.25),
    0 4px 12px rgba(0,0,0,.15);


    animation:gwAtolFloat 3.2s ease-in-out infinite;

}



/* ATOL IMAGE */

.gw-atol-logo img{

    width:100%;

    height:100%;


    object-fit:contain;


    border-radius:50%;

}





@keyframes gwAtolFloat{


    0%,100%{

        transform:translateY(0);

    }


    50%{

        transform:translateY(-7px);

    }


}





/* ==========================
   MOBILE
========================== */


@media(max-width:600px){


    .gw-atol-logo{


        left:16px;

        bottom:20px;


        width:54px;

        height:54px;


    }


}





`;


document.head.appendChild(atolStyle);




  /* ============================================================
   FLOATING BUTTON POSITIONING
   ATOL LEFT + WHATSAPP RIGHT
   ============================================================ */

document.documentElement.appendChild(atolLogo);
document.documentElement.appendChild(fab);
document.documentElement.appendChild(popup);

  function openPopup(){popup.classList.add('gw-wa-open');fab.classList.add('gw-wa-open');fab.setAttribute('aria-expanded','true')}
  function closePopup(){popup.classList.remove('gw-wa-open');fab.classList.remove('gw-wa-open');fab.setAttribute('aria-expanded','false')}

  fab.addEventListener('click',()=>{popup.classList.contains('gw-wa-open')?closePopup():openPopup()});
  popup.querySelector('.gw-wa-popup-close').addEventListener('click',closePopup);
  popup.querySelectorAll('.gw-wa-quick-btn').forEach(btn=>{
    btn.addEventListener('click',()=>{window.open(WA_LINK(btn.getAttribute('data-msg')),'_blank','noopener')});
  });
  document.addEventListener('click',e=>{
    if(popup.classList.contains('gw-wa-open') && !popup.contains(e.target) && !fab.contains(e.target)) closePopup();
  });
  document.addEventListener('keydown',e=>{if(e.key==='Escape') closePopup()});
})();
