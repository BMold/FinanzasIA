"use strict";
const COL=["var(--ac)","var(--ac2)","#f59e0b"],SH=["Mer","Tam","Val","Mom","Sem"];
const svg=(h,b)=>`<svg viewBox="0 0 640 ${h}" class="ch" role="img">${b}</svg>`;
const legend=s=>s.map((q,k)=>`<rect x="${50+k*130}" y="6" width="12" height="12" rx="3" fill="${COL[k]}"/><text x="${68+k*130}" y="16">${q.n}</text>`).join("");
function bars(lab,ser,o={}){const W=640,H=280,p=44,L=o.log,tf=v=>L?Math.max(Math.log10(Math.abs(v)||1e-16),-16):v,all=ser.flatMap(s=>s.v.map(tf));
let lo=L?Math.floor(Math.min(...all)):Math.min(0,...all),hi=L?Math.ceil(Math.max(...all)):Math.max(0,...all);if(hi==lo)hi=lo+1;
const y=v=>H-p-(tf(v)-lo)/(hi-lo)*(H-2*p),base=L?H-p:y(0),gw=(W-2*p)/lab.length,bw=gw*.7/ser.length,fl=v=>L?"10^"+v:v.toFixed(1);
let s=legend(ser)+`<line class="ax" x1="${p}" x2="${W-10}" y1="${y(L?Math.pow(10,hi):hi)}" y2="${y(L?Math.pow(10,hi):hi)}"/><line class="ax" x1="${p}" x2="${W-10}" y1="${base}" y2="${base}"/><text x="4" y="${p+4}">${fl(hi)}</text><text x="4" y="${H-p+4}">${fl(L?lo:0)}</text>`;
ser.forEach((q,k)=>q.v.forEach((v,i)=>{const x=p+i*gw+gw*.15+k*bw,yy=y(v);
s+=`<rect class="bar" x="${x}" y="${Math.min(yy,base)}" width="${bw*.92}" height="${Math.max(Math.abs(base-yy),1)}" rx="4" fill="${COL[k]}" style="animation-delay:${i*90+k*60}ms;transform-origin:center ${yy<base?"bottom":"top"}"><title>${q.n}: ${(+v).toPrecision(4)}</title></rect>`}));
lab.forEach((t,i)=>s+=`<text x="${p+i*gw+gw/2}" y="${H-8}" text-anchor="middle">${t}</text>`);return svg(H,s)}
function lines(ser,o={}){const W=640,H=280,p=44,lg=v=>Math.log10(Math.max(v,1e-16)),all=ser.flatMap(s=>s.v.map(lg));if(o.tol)all.push(lg(o.tol));
const lo=Math.floor(Math.min(...all)),hi=Math.ceil(Math.max(...all)),mx=Math.max(...ser.map(s=>s.v.length-1),1),x=i=>p+i/mx*(W-2*p),y=v=>p+(hi-lg(v))/((hi-lo)||1)*(H-2*p);
let s=legend(ser)+`<line class="ax" x1="${p}" x2="${W-10}" y1="${H-p}" y2="${H-p}"/><text x="4" y="${p+4}">10^${hi}</text><text x="4" y="${H-p+4}">10^${lo}</text><text x="${p}" y="${H-12}">iteración 0</text><text x="${W-10}" y="${H-12}" text-anchor="end">iteración ${mx}</text>`;
if(o.tol)s+=`<line x1="${p}" x2="${W-10}" y1="${y(o.tol)}" y2="${y(o.tol)}" stroke="#f59e0b" stroke-dasharray="5 4"/><text x="${W-10}" y="${y(o.tol)-5}" text-anchor="end">tolerancia</text>`;
ser.forEach((q,k)=>{s+=`<path class="ln" pathLength="1" stroke="${COL[k]}" d="${q.v.map((v,i)=>(i?"L":"M")+x(i)+" "+y(v)).join(" ")}"/>`+q.v.map((v,i)=>`<circle class="cell" cx="${x(i)}" cy="${y(v)}" r="3.5" fill="${COL[k]}" style="animation-delay:${i*120}ms"><title>${q.n}, it ${i}: ${v.toExponential(2)}</title></circle>`).join("")});return svg(H,s)}
function heat(A){const n=A.length,c=60,o=44;let s="";
A.forEach((r,i)=>{s+=`<text x="${o-6}" y="${o+i*c+c/2+4}" text-anchor="end">${SH[i]}</text><text x="${o+i*c+c/2}" y="${o-10}" text-anchor="middle">${SH[i]}</text>`;
r.forEach((v,j)=>{const q=v/Math.sqrt(A[i][i]*A[j][j]);s+=`<rect class="cell" x="${o+j*c+1}" y="${o+i*c+1}" width="${c-2}" height="${c-2}" rx="8" fill="${q<0?"var(--bad)":"var(--ac)"}" fill-opacity="${Math.min(Math.abs(q),1)*.85+.05}" style="animation-delay:${(i+j)*70}ms"/><text x="${o+j*c+c/2}" y="${o+i*c+c/2+4}" text-anchor="middle" style="fill:var(--fg)">${q.toFixed(2)}</text>`})});
return`<svg viewBox="0 0 ${o+n*c+8} ${o+n*c+8}" class="ch" style="max-width:380px;display:block;margin:auto" role="img">${s}</svg>`}
