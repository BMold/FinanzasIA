"use strict";
const N=["Mercado","Tamaño","Valor","Momentum","Semiconductores"];
const dot=(u,v)=>u.reduce((s,a,i)=>s+a*v[i],0),nrm=v=>Math.sqrt(dot(v,v)),mv=(M,x)=>M.map(r=>dot(r,x)),clone=M=>M.map(r=>r.slice());
function eig(M){const a=clone(M),n=a.length;
for(let s=0;s<100;s++){let o=0;for(let i=0;i<n;i++)for(let j=i+1;j<n;j++)o+=a[i][j]**2;if(o<1e-26)break;
for(let p=0;p<n;p++)for(let q=p+1;q<n;q++){if(Math.abs(a[p][q])<1e-300)continue;
const th=(a[q][q]-a[p][p])/(2*a[p][q]),t=Math.sign(th||1)/(Math.abs(th)+Math.sqrt(th*th+1)),c=1/Math.sqrt(t*t+1),s2=t*c;
for(let k=0;k<n;k++){const x=a[k][p],y=a[k][q];a[k][p]=c*x-s2*y;a[k][q]=s2*x+c*y}
for(let k=0;k<n;k++){const x=a[p][k],y=a[q][k];a[p][k]=c*x-s2*y;a[q][k]=s2*x+c*y}}}
return a.map((r,i)=>r[i]).sort((x,y)=>x-y)}
function chol(M,y){const n=M.length,L=M.map(()=>Array(n).fill(0));
for(let i=0;i<n;i++)for(let j=0;j<=i;j++){let s=M[i][j];for(let k=0;k<j;k++)s-=L[i][k]*L[j][k];
if(i==j){if(s<=0)throw Error("A no es definida positiva");L[i][i]=Math.sqrt(s)}else L[i][j]=s/L[j][j]}
const z=[],x=Array(n);for(let i=0;i<n;i++){let s=y[i];for(let k=0;k<i;k++)s-=L[i][k]*z[k];z[i]=s/L[i][i]}
for(let i=n-1;i>=0;i--){let s=z[i];for(let k=i+1;k<n;k++)s-=L[k][i]*x[k];x[i]=s/L[i][i]}return x}
function validate(M){let d=0;M.forEach((r,i)=>r.forEach((v,j)=>{if(!isFinite(v))throw Error("Hay valores no numéricos en A");d=Math.max(d,Math.abs(v-M[j][i]))}));
if(d>1e-12)throw Error("A no es simétrica (máx |aij − aji| = "+d.toExponential(2)+")");
const e=eig(M);if(e[0]<=0)throw Error("A no es definida positiva (λmin = "+e[0].toExponential(2)+")");return{e,d}}
function cg(M,y,x0,tol,Nm,jac){const d=M.map((r,i)=>r[i]);let x=x0.slice(),Ax=mv(M,x),r=y.map((v,i)=>v-Ax[i]);
const P=v=>jac?v.map((a,i)=>a/d[i]):v.slice(),by=nrm(y)||1;let z=P(r),p=z.slice(),rz=dot(r,z),k=0,h=nrm(r)/by;const hist=[h];
while(h>=tol&&k<Nm){const Ap=mv(M,p),al=rz/dot(p,Ap);x=x.map((v,i)=>v+al*p[i]);r=r.map((v,i)=>v-al*Ap[i]);z=P(r);const r2=dot(r,z);p=z.map((v,i)=>v+r2/rz*p[i]);rz=r2;k++;h=nrm(r)/by;hist.push(h)}
const q=mv(M,x);return{x,it:k,res:nrm(y.map((v,i)=>v-q[i]))/by,conv:h<tol,hist}}
function run(M,y,o){const v=validate(M),e=v.e,n=M.length,ref=chol(M,y),x0=Array(n).fill(o.x0);
const gcp=cg(M,y,x0,o.tol,o.nm,o.pre),gc=cg(M,y,x0,o.tol,o.nm,false),kA=e[n-1]/e[0];
let kP=kA;if(o.pre){const S2=M.map((r,i)=>r.map((a,j)=>a/Math.sqrt(M[i][i]*M[j][j]))),g=eig(S2);kP=g[n-1]/g[0]}
return{e,sym:v.d,ref,gcp,gc,kA,kP}}
function rng(s){return()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function mk(sg,rho,be,sn,lam,seed,T=250){const u=rng(seed),g=()=>Math.sqrt(-2*Math.log(1-u()))*Math.cos(2*Math.PI*u()),X=[],y=[];
for(let t=0;t<T;t++){const m=g(),f=sg.map(s=>s*(Math.sqrt(rho)*m+Math.sqrt(1-rho)*g()));X.push(f);y.push(dot(be,f)+sn*g())}
const mx=sg.map((_,j)=>X.reduce((s,r)=>s+r[j],0)/T),my=y.reduce((s,v)=>s+v,0)/T;
return{A:sg.map((_,i)=>sg.map((_,j)=>X.reduce((s,r)=>s+(r[i]-mx[i])*(r[j]-mx[j]),0)/T+(i==j?lam:0))),b:sg.map((_,i)=>X.reduce((s,r,t)=>s+(r[i]-mx[i])*(y[t]-my),0)/T)}}
const BT=[1.2,.3,-.4,.5,.8];
const SC={
ideal:{...mk([1,.6,.5,.7,1.5],.2,BT,.8,.05,11),bt:BT,n:"Ideal",
 d:"Mercado en calma. Los cinco factores tienen volatilidad moderada (0,5 %–1,5 % diario) y correlación baja (ρ = 0,2), de modo que cada factor aporta información propia. Con λ = 0,05, A queda bien condicionada y todo método converge rápido.",
 m:"σ = (1; 0,6; 0,5; 0,7; 1,5) %, ρ = 0,2, ruido 0,8 %, λ = 0,05.",f:"Las β estimadas se acercan a las reales: el portafolio de IA tiene beta de mercado cercana a 1,2 y fuerte exposición a semiconductores."},
stress:{...mk([2,1.2,1,1.4,3],.6,[1.5,.3,-.4,.5,1.2],1.6,.05,22),bt:[1.5,.3,-.4,.5,1.2],n:"Bajo estrés",
 d:"Crisis de mercado (como marzo de 2020 o el desplome tecnológico de 2022). La volatilidad se duplica, la correlación entre factores sube a 0,6 porque todo cae junto, y el portafolio de IA se vuelve más sensible al mercado y a los chips. Cambian A (covarianzas) y b (relación factor–portafolio).",
 m:"σ ×2, ρ = 0,6, ruido 1,6 %, β de mercado 1,5 y de semiconductores 1,2.",f:"Las β de mercado y de chips suben: cambió el equilibrio, pero A sigue razonablemente condicionada."},
ill:{...mk([1,.05,.4,.02,2],.97,BT,.8,1e-6,33),bt:BT,n:"Mal condicionado",
 d:"Multicolinealidad extrema: los factores casi se solapan (ρ = 0,97) y están medidos en escalas muy distintas (σ de 0,02 % a 2 %, como mezclar puntos básicos y porcentajes), con λ casi nulo. Es el caso donde la regresión clásica se vuelve inestable.",
 m:"σ = (1; 0,05; 0,4; 0,02; 2) %, ρ = 0,97, ruido 0,8 %, λ = 10⁻⁶.",f:"Las β son inestables: factores casi redundantes no se separan bien; Jacobi y la regularización estabilizan el cálculo."}};
const S={cur:"ideal",A:null,b:null,err:null,o:{pre:true,x0:0,tol:1e-6,nm:1000}};
function load(k){S.cur=k;S.A=clone(SC[k].A);S.b=SC[k].b.slice()}
load("ideal");
