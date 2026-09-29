// 构建 worker.js: const HTML = <index.html> + Worker 封装(含分享图 SVG 生成)
const fs = require('fs');
const path = require('path');
const dir = __dirname;
const html = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');

const WRAPPER = `
function esc(s){return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));}
function svg(d){
  var pct=Math.max(0,Math.min(100,parseFloat(d.pct)||0));
  var barW=(1040*pct/100).toFixed(1);
  var premColor=String(d.prem).charAt(0)==='-'?'#F87171':'#FFE08A';
  var isCNY=String(d.cur)==='CNY';
  var meta='续费 '+esc(d.amount)+' '+esc(d.cur)+' · '+esc(d.cycLabel)+(isCNY?'':' · 1 '+esc(d.cur)+' = '+esc(d.rate)+' CNY');
  return '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img">'
  +'<defs>'
  +'<linearGradient id="t-surface" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFFBF2"/><stop offset="1" stop-color="#FFF4E2"/></linearGradient>'
  +'<linearGradient id="t-hero" x1="0" y1="0" x2="1" y2=".7"><stop offset="0" stop-color="#FBBF24"/><stop offset="1" stop-color="#EA580C"/></linearGradient>'
  +'<linearGradient id="t-progress" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FBBF24"/><stop offset="1" stop-color="#EA580C"/></linearGradient>'
  +'<linearGradient id="t-orbit" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FDE68A" stop-opacity=".28"/><stop offset="1" stop-color="#FDE68A" stop-opacity="0"/></linearGradient>'
  +'<filter id="t-shadow" x="-10%" y="-10%" width="120%" height="130%" color-interpolation-filters="sRGB"><feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="#9A3412" flood-opacity=".08"/></filter>'
  +'<clipPath id="t-hero-clip"><rect x="56" y="126" width="728" height="282" rx="22"/></clipPath>'
  +'<clipPath id="t-progress-clip"><rect x="80" y="474" width="1040" height="10" rx="5"/></clipPath>'
  +'</defs>'
  +'<style>.t-type{font-family:\\'DM Sans\\',\\'Inter\\',\\'Helvetica Neue\\',Arial,\\'PingFang SC\\',\\'Hiragino Sans GB\\',\\'Microsoft YaHei\\',\\'Noto Sans SC\\',sans-serif;}.t-num{font-variant-numeric:tabular-nums lining-nums;}</style>'
  +'<rect width="1200" height="630" rx="32" fill="url(#t-surface)"/>'
  +'<rect x="28" y="26" width="1144" height="542" rx="30" fill="#FFFFFF" filter="url(#t-shadow)"/>'
  +'<rect x="28.5" y="26.5" width="1143" height="541" rx="29.5" fill="none" stroke="#F0DFC2"/>'
  +'<g aria-hidden="true">'
  +'<rect x="56" y="55" width="46" height="46" rx="14" fill="#EA580C"/>'
  +'<rect x="67" y="66" width="24" height="9" rx="3" fill="none" stroke="#FFFFFF" stroke-width="1.7"/>'
  +'<rect x="67" y="81" width="24" height="9" rx="3" fill="none" stroke="#FFFFFF" stroke-width="1.7"/>'
  +'<circle cx="72" cy="70.5" r="1.3" fill="#FFFFFF"/><circle cx="72" cy="85.5" r="1.3" fill="#FFFFFF"/>'
  +'<path d="M81 70.5h5 M81 85.5h5" stroke="#FFFFFF" stroke-width="1.7" stroke-linecap="round"/>'
  +'<path d="M1073 71h12 M1073 78h30 M1073 85h48" fill="none" stroke="#F5D9B8" stroke-width="3" stroke-linecap="round"/>'
  +'</g>'
  +'<g class="t-type">'
  +'<text x="118" y="88" fill="#C2410C"><tspan font-size="31" font-weight="700" letter-spacing="-1">tools.514517.xyz</tspan><tspan font-size="21" font-weight="400" fill="#8A6D4B"> · VPS 剩余价值计算器</tspan></text>'
  +'<rect x="56" y="126" width="728" height="282" rx="22" fill="url(#t-hero)"/>'
  +'<g clip-path="url(#t-hero-clip)" aria-hidden="true" fill="none" stroke="url(#t-orbit)"><circle cx="782" cy="153" r="66"/><circle cx="782" cy="153" r="100"/><circle cx="782" cy="153" r="134"/><circle cx="782" cy="153" r="168"/><circle cx="782" cy="153" r="202"/><path d="M665 273 830 108 M614 219 813 20" stroke-opacity=".5"/><circle cx="682" cy="153" r="4" fill="#FFFFFF" stroke="none" opacity=".7"/></g>'
  +'<text x="90" y="183" font-size="22" font-weight="400" fill="#FFF7E6">当前剩余价值 (CNY)</text>'
  +'<text x="87" y="294" class="t-num" font-weight="600" fill="#FFFFFF"><tspan font-size="55">¥</tspan><tspan font-size="101" letter-spacing="-3">'+esc(d.v)+'</tspan></text>'
  +'<path d="M90 329H750" stroke="#FFFFFF" stroke-opacity=".25"/>'
  +'<text x="90" y="358" class="t-num" font-size="20" font-weight="400" fill="#FFF7E6">'+meta+'</text>'
  +'<text x="90" y="392" class="t-num" font-size="19" font-weight="400" fill="#FFF7E6">实付卖家 <tspan font-weight="600" fill="#FFFFFF">¥ '+esc(d.pay)+'</tspan> · 卖家溢价 <tspan font-weight="600" fill="'+premColor+'">'+esc(d.prem)+'</tspan> · 买家总支出 <tspan font-weight="600" fill="#FFFFFF">¥ '+esc(d.buyer)+'</tspan></text>'
  +'<rect x="800" y="126" width="344" height="132" rx="22" fill="#FEF3E0"/>'
  +'<text x="830" y="167" font-size="20" fill="#96660F">剩余天数</text>'
  +'<text x="828" y="231" class="t-num" fill="#C2410C"><tspan font-size="59" font-weight="600" letter-spacing="-1.5">'+esc(d.days)+'</tspan><tspan font-size="23" font-weight="400" fill="#96660F"> 天</tspan></text>'
  +'<g transform="translate(1095 161)" aria-hidden="true" fill="none" stroke="#D97706" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle r="12"/><path d="M0-6v6l4.5 3"/></g>'
  +'<rect x="800.5" y="274.5" width="343" height="133" rx="21.5" fill="#FFFBF3" stroke="#F0DFC2"/>'
  +'<text x="830" y="316" font-size="20" fill="#8A6D4B">周期天数</text>'
  +'<text x="828" y="380" class="t-num" fill="#B45309"><tspan font-size="59" font-weight="600" letter-spacing="-1.5">'+esc(d.cyc)+'</tspan><tspan font-size="23" font-weight="400" fill="#8A6D4B"> 天</tspan></text>'
  +'<g transform="translate(1095 309)" aria-hidden="true" fill="none" stroke="#D9A05B" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="-11" y="-9" width="22" height="21" rx="4"/><path d="M-5-12v6 M5-12v6 M-11-2h22 M-5 4h3 M3 4h3"/></g>'
  +'<text x="80" y="453" font-size="20" font-weight="500" fill="#96660F">剩余周期</text>'
  +'<text x="1120" y="453" text-anchor="end" class="t-num" font-size="24" font-weight="600" fill="#C2410C">'+pct.toFixed(1)+'%</text>'
  +'<rect x="80" y="474" width="1040" height="10" rx="5" fill="#FBEEDB"/>'
  +'<rect x="80" y="474" width="'+barW+'" height="10" rx="5" fill="url(#t-progress)"/>'
  +'<g clip-path="url(#t-progress-clip)" aria-hidden="true"><path d="M-140 479h80" stroke="#FFFFFF" stroke-width="10" opacity=".25"><animateTransform attributeName="transform" type="translate" values="0 0;1320 0" dur="7s" repeatCount="indefinite"/></path></g>'
  +'<text x="80" y="527" class="t-num" font-size="19" fill="#8A6D4B">交易日 <tspan fill="#6B4E2E" font-weight="500">'+esc(d.buy)+'</tspan></text>'
  +'<text x="1120" y="527" text-anchor="end" class="t-num" font-size="19" fill="#8A6D4B">到期日 <tspan fill="#6B4E2E" font-weight="500">'+esc(d.exp)+'</tspan></text>'
  +'<text x="600" y="606" text-anchor="middle" font-size="17" fill="#8A6D4B">由 <tspan font-weight="700" fill="#C2410C">tools.514517.xyz</tspan> 提供计算服务</text>'
  +'<text x="1144" y="606" text-anchor="end" class="t-num" font-size="15" fill="#B39B7D">汇率 '+esc(d.rateDate)+'</text>'
  +'</g></svg>';
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/count') {
      const today = new Date().toISOString().slice(0, 10);
      const dKey = 'daily:' + today, tKey = 'total';
      if (request.method === 'POST') {
        const [d, t] = await Promise.all([
          env.CALC_KV.get(dKey).then(v => (parseInt(v || '0', 10) || 0) + 1),
          env.CALC_KV.get(tKey).then(v => (parseInt(v || '0', 10) || 0) + 1),
        ]);
        await Promise.all([
          env.CALC_KV.put(dKey, String(d), { expirationTtl: 86400 * 10 }),
          env.CALC_KV.put(tKey, String(t)),
        ]);
        return Response.json({ today: d, total: t });
      }
      const [d, t] = await Promise.all([env.CALC_KV.get(dKey), env.CALC_KV.get(tKey)]);
      return Response.json({ today: parseInt(d || '0', 10) || 0, total: parseInt(t || '0', 10) || 0 });
    }
    if (url.pathname === '/api/share' && request.method === 'POST') {
      try {
        const d = await request.json();
        const s = v => String(v == null ? '' : v).slice(0, 48);
        const clean = {
          v: s(d.v), days: s(d.days), cyc: s(d.cyc), pct: s(d.pct),
          amount: s(d.amount), cur: s(d.cur), cycLabel: s(d.cycLabel),
          rate: s(d.rate), pay: s(d.pay), prem: s(d.prem), buyer: s(d.buyer),
          buy: s(d.buy), exp: s(d.exp), rateDate: s(d.rateDate),
        };
        if (!clean.v) throw 0;
        const id = [...crypto.getRandomValues(new Uint8Array(6))].map(b => b.toString(16).padStart(2, '0')).join('');
        await env.CALC_KV.put('img:' + id, svg(clean), { expirationTtl: 86400 * 30 });
        return Response.json({ id });
      } catch (e) { return Response.json({ error: 1 }, { status: 400 }); }
    }
    if (url.pathname.startsWith('/s/')) {
      const id = url.pathname.slice(3).replace(/[^a-f0-9]/gi, '').slice(0, 16);
      const pic = id ? await env.CALC_KV.get('img:' + id) : null;
      if (!pic) return new Response('Not found', { status: 404 });
      return new Response(pic, { headers: { 'content-type': 'image/svg+xml; charset=utf-8', 'cache-control': 'public, max-age=86400' } });
    }
    return new Response(HTML, { headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-cache' } });
  }
};
`;

const out = 'const HTML = ' + JSON.stringify(html) + ';\n' + WRAPPER;
fs.writeFileSync(path.join(dir, 'worker.js'), out);
console.log('worker.js built:', out.length, 'bytes');
