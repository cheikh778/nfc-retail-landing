import { chromium } from '@playwright/test';
const b = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH || undefined, args:['--no-sandbox','--autoplay-policy=no-user-gesture-required'] });
const dir='/tmp/claude-1000/-home-cheikh-Dev-nfc-retail-landing/2974e14f-0884-48f2-b750-10abc2fbd7d1/scratchpad';
const v='file:///home/cheikh/.claude/uploads/2974e14f-0884-48f2-b750-10abc2fbd7d1/28930865-WhatsApp_Video_20260908_at_16.15.21.mp4';
const p = await b.newPage({ viewport:{width:900,height:900} });
await p.setContent(`<body style="margin:0;background:#111"><video id="v" src="${v}" style="width:100%"></video></body>`);
const dur = await p.evaluate(()=>new Promise(res=>{const v=document.getElementById('v');v.addEventListener('loadedmetadata',()=>res(v.duration));v.load();}));
console.log('duration', dur);
const n = Math.min(16, Math.max(4, Math.floor(dur)));
for (let i=0;i<n;i++){
  const t = (dur*i)/(n-1) - 0.05;
  await p.evaluate(tt=>new Promise(res=>{const v=document.getElementById('v');v.onseeked=()=>res();v.currentTime=Math.max(0,tt);}), t);
  await p.waitForTimeout(120);
  await p.locator('#v').screenshot({ path:`${dir}/vs_${String(i).padStart(2,'0')}.png` });
}
console.log('frames', n);
await b.close();
