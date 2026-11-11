"use strict";
const $=s=>document.querySelector(s),fx=(v,d=2)=>v.toExponential(d),vec=(v,f=4)=>"["+v.map(a=>a.toFixed(f)).join(", ")+"]";
const yn=c=>c?'<b class="ok">Sí</b>':'<b class="no">No</b>',LB={ideal:"Ideal",stress:"Bajo estrés",ill:"Mal condicionado"},KS=Object.keys(SC);
const pg=(n,t,l,b)=>`<section><p class="k">Módulo ${n} de 10</p><h1>${t}</h1><p class="lead">${l}</p>${b}</section>`;
const calc=()=>{S.err=null;try{return run(S.A,S.b,S.o)}catch(e){S.err=e.message;return null}};
const warn=()=>S.err?`<div class="warn">⚠ ${S.err}. Corrige A en el módulo 4.</div>`:"";
const tbl=(h,rows)=>`<div class="w"><table><tr>${h.map(x=>`<th>${x}</th>`).join("")}</tr>${rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join("")}</tr>`).join("")}</table></div>`;
const scBar=()=>`<p class="mu">Escenario activo: <b>${LB[S.cur]}</b> (cámbialo con los botones de arriba).</p>`;
const all3=()=>KS.map(k=>({k,r:run(SC[k].A,SC[k].b,S.o)}));
function cmp(R){const row=(l,f,c)=>`<tr><td>${l}</td>${R.map(x=>`<td class="${c||""}">${f(x.r,x.k)}</td>`).join("")}</tr>`;
return`<div class="w"><table><tr><th>Indicador</th><th>Ideal</th><th>Bajo estrés</th><th>Mal cond.</th></tr>`+
row("Solución de referencia",r=>vec(r.ref))+row("Solución GCP",r=>vec(r.gcp.x))+row("Error absoluto Ea",r=>"["+r.ref.map((v,i)=>fx(Math.abs(v-r.gcp.x[i]),1)).join(", ")+"]")+
row("Error porcentual Ep (%)",r=>"["+r.ref.map((v,i)=>v==0?"n/d":fx(100*Math.abs(v-r.gcp.x[i])/Math.abs(v),1)).join(", ")+"]")+
row("Iteraciones GC",r=>r.gc.it)+row("Iteraciones GCP",r=>r.gcp.it)+row("κ(A)",r=>fx(r.kA))+row("κ(M⁻¹A)",r=>fx(r.kP))+row("Residuo relativo final GCP",r=>fx(r.gcp.res))+
row("¿Convergió?",r=>yn(r.gcp.conv))+row("Interpretación financiera",(r,k)=>SC[k].f,"f")+"</table></div>"}
function qa(){const o=S.o,T=[],add=(a,b,c,d,ok)=>T.push([a,b,c,d,ok?'<b class="ok">Aprobada</b>':'<b class="no">Falla</b>']);
try{const r=all3();add("1. Carga de escenarios","Ideal, Estrés, Mal cond.","Los 3 se ejecutan y convergen","Iteraciones GCP: "+r.map(x=>x.r.gcp.it).join(" / ")+"; convergió: "+r.map(x=>x.r.gcp.conv?"sí":"no").join(" / "),r.every(x=>x.r.gcp.conv))}catch(e){add("1. Carga de escenarios","—","Ejecución correcta",e.message,false)}
const bad=(nm,f)=>{const M=clone(SC.ideal.A);f(M);let m;try{run(M,SC.ideal.b,o);m="Sin error (incorrecto)"}catch(e){m="Error capturado: "+e.message}add("2. Matriz no válida",nm,"El sistema notifica el error sin colapsar",m,m.startsWith("Error"))};
bad("no simétrica (a₁₂ + 0,05)",M=>M[0][1]+=.05);bad("no definida positiva (a₁₁ = −1)",M=>{M[0][0]=-1});
try{const M=clone(SC.ideal.A),a=run(M,SC.ideal.b,o);M[0][0]*=1.2;const c=run(M,SC.ideal.b,o);
add("3. Edición dinámica","a₁₁ × 1,2 en escenario Ideal","Referencia, GCP y errores se recalculan; residuo < tol","β₁: "+a.ref[0].toFixed(4)+" → "+c.ref[0].toFixed(4)+"; residuo "+fx(c.gcp.res,1),Math.abs(a.ref[0]-c.ref[0])>1e-9&&c.gcp.res<o.tol)}catch(e){add("3. Edición dinámica","a₁₁ × 1,2","Recálculo","Error: "+e.message,false)}
try{const c=run(SC.ill.A,SC.ill.b,{...o,pre:true});add("4. Precondicionamiento","Mal condicionado, Jacobi","Iteraciones GCP ≤ GC","GCP: "+c.gcp.it+" · GC: "+c.gc.it,c.gcp.it<=c.gc.it)}catch(e){add("4. Precondicionamiento","—","GCP ≤ GC",e.message,false)}
return tbl(["Prueba","Entrada","Resultado esperado","Resultado obtenido","Conclusión"],T)}

const V=[
["inicio","Inicio",()=>`<section class="hero"><p class="k">Universidad Mayor de San Andrés · Informática · Métodos Numéricos</p>
<h1>¿Qué mueve a las empresas de IA?<br><span class="gr">Factores de riesgo, ridge y Gradientes Conjugados</span></h1>
<p class="lead">Estimamos la sensibilidad de un portafolio de empresas de inteligencia artificial a cinco factores de riesgo de mercado. El problema se reduce a un sistema lineal simétrico definido positivo, que resolvemos con el Gradientes Conjugados Precondicionado (Suñagua, 2020) y comparamos con el método directo.</p>
<p><b>Ignacio Josue Zarate Camargo</b> · Mención: Inteligencia Artificial y Ciencia de Datos · Modalidad individual</p>
<a class="btn" href="#caso">Comenzar el recorrido →</a>
<div class="g4">${[[5,"factores de riesgo (n)"],[3,"escenarios"],[4,"pruebas de software"],[10,"módulos"]].map(a=>`<div class="card stat"><b data-n="${a[0]}">0</b>${a[1]}</div>`).join("")}</div></section>`],

["caso","Caso de estudio",()=>pg(2,"Un portafolio de IA bajo la lupa de los factores","Por qué las empresas de IA se mueven juntas y cómo medirlo.",`<div class="g2"><div class="card"><h2>Contexto financiero</h2>
<p>Las acciones de NVIDIA, Microsoft, Alphabet, Meta y AMD concentraron buena parte del auge bursátil ligado a la IA. Un inversionista que las compra no diversifica tanto como cree: comparten exposición al mercado, a las tecnológicas de gran tamaño, al estilo de crecimiento y a los semiconductores.</p>
<p>El modelo de factores de Fama y French (1993), ampliado por Carhart (1997), explica el rendimiento diario <i>y</i> del portafolio como y = β₁f₁ + … + β₅f₅ + ε. Las β miden cuánto reacciona el portafolio a cada factor, y sirven para gestionar riesgo y cubrir posiciones.</p></div>
<div class="card"><h2>Colinealidad entre factores</h2>${heat(S.A)}<p class="mu">Correlación entre factores en el escenario <b>${LB[S.cur]}</b>. Más color = factores más solapados.</p></div></div>
<div class="card"><h2>Justificación del modelo</h2><p>Se estima β con mínimos cuadrados regularizados (ridge; Hoerl y Kennard, 1970), técnica estándar de aprendizaje automático: min ‖y − Xβ‖² + λ‖β‖². Las ecuaciones normales dan (XᵀX/T + λI)β = Xᵀy/T, de la forma <b>Aβ = b</b> con A simétrica y definida positiva para λ &gt; 0. Cuando los factores son casi colineales, el sistema se mal condiciona, que es justamente el caso donde precondicionar mejora el método.</p>
<h2>Procedencia de los datos</h2><p>T = 250 días de rendimientos simulados con semilla fija (reproducibles) desde un modelo de factores con β reales conocidas, para poder verificar qué tan bien se recuperan. En una versión final pueden reemplazarse por rendimientos reales (Yahoo Finance y la biblioteca de factores de K. French).</p>
<p><b>Aporte IA/Ciencia de Datos:</b> estimación de covarianzas, regularización ridge y análisis de sensibilidad editando A y b en vivo.</p></div>`)],

["formulacion","Formulación",()=>{const R=calc();return pg(3,"De la regresión al sistema Aβ = b","Variables, ecuaciones y significado de cada coeficiente.",warn()+`<div class="card"><h2>Variables (n = 5)</h2>${tbl(["Incógnita","Significado financiero"],[["x₁ = β Mercado","Sensibilidad del portafolio al mercado accionario (riesgo sistemático)"],["x₂ = β Tamaño","Sensibilidad a empresas pequeñas frente a grandes (SMB)"],["x₃ = β Valor","Sensibilidad a acciones de valor frente a crecimiento (HML)"],["x₄ = β Momentum","Sensibilidad a las acciones ganadoras recientes (MOM)"],["x₅ = β Semiconductores","Sensibilidad al sector de chips, motor del auge de la IA"]])}</div>
<div class="card"><h2>Ecuaciones</h2><div class="eq">min<sub>β</sub> ‖y − Xβ‖² + λ‖β‖² &nbsp;⟹&nbsp; (XᵀX/T + λI) β = Xᵀy/T &nbsp;⟹&nbsp; <b>A β = b</b></div>
<p><b>aᵢᵢ</b>: varianza del factor i (más λ). <b>aᵢⱼ</b>: covarianza entre los factores i y j, es decir, su colinealidad. <b>bᵢ</b>: covarianza del factor i con el portafolio. Las incógnitas xᵢ del programa son las βᵢ.</p>
<p><b>Simetría:</b> aᵢⱼ = (1/T)Σₜ fₜᵢfₜⱼ = aⱼᵢ. <b>Definición positiva:</b> xᵀAx = ‖Xx‖²/T + λ‖x‖² ≥ λ‖x‖² &gt; 0 para x ≠ 0 (Sylvester o autovalores, verificado numéricamente en el módulo 6).</p></div>
<div class="card"><h2>Sistema del escenario ${LB[S.cur]}</h2><div class="w"><table><tr><th></th>${N.map(n=>`<th>${n}</th>`).join("")}<th>b</th></tr>${S.A.map((r,i)=>`<tr><th>${N[i]}</th>${r.map(v=>`<td>${v.toFixed(4)}</td>`).join("")}<td><b>${S.b[i].toFixed(4)}</b></td></tr>`).join("")}</table></div></div>`)}],

["entrada","Entrada de datos",()=>pg(4,"Edita el sistema y mira cómo responde","Cada cambio recalcula todo al instante.",`<div class="card"><div id="warn"></div><p class="mu">Puedes romper la simetría o la definición positiva a propósito: el sistema lo detecta y avisa sin colapsar.</p>
<div class="w g"><table id="tA"><tr><th></th>${N.map(n=>`<th>${n}</th>`).join("")}<th>b</th></tr>${S.A.map((r,i)=>`<tr><th>${N[i]}</th>${r.map((v,j)=>`<td><input type="number" step="any" data-i="${i}" data-j="${j}" value="${v}"></td>`).join("")}<td><input type="number" step="any" data-b="${i}" value="${S.b[i]}"></td></tr>`).join("")}</table></div>
<div class="row"><label>x₀ <input id="x0" type="number" step="any" value="${S.o.x0}" style="width:70px"></label><label>Tolerancia <input id="tol" type="number" step="any" value="${S.o.tol}" style="width:90px"></label><label>N máx <input id="nm" type="number" value="${S.o.nm}" style="width:80px"></label>
<label>Precondicionador <select id="pre"><option value="1" ${S.o.pre?"selected":""}>Jacobi (diagonal)</option><option value="0" ${S.o.pre?"":"selected"}>Ninguno</option></select></label></div></div>
<div class="card"><h2>Resultado en vivo</h2><div id="live"></div></div>`),el=>{
const live=()=>{const R=calc();$("#warn").innerHTML=warn();$("#live").innerHTML=R?`GCP: <b>${R.gcp.it}</b> iteraciones · GC simple: <b>${R.gc.it}</b> · κ(A) = ${fx(R.kA)} · κ(M⁻¹A) = ${fx(R.kP)}<br>β = ${vec(R.gcp.x)}<br>Residuo relativo: ${fx(R.gcp.res)}`:"Sin resultado: corrige los datos."};
el.addEventListener("input",e=>{const d=e.target.dataset,v=parseFloat(e.target.value);if(d.b!==undefined)S.b[+d.b]=v;else if(d.i!==undefined)S.A[+d.i][+d.j]=v;
else{S.o.x0=+$("#x0").value||0;S.o.tol=+$("#tol").value||1e-6;S.o.nm=+$("#nm").value||1000;S.o.pre=$("#pre").value=="1"}live()});live()}],

["escenarios","Tres escenarios",()=>{const R=all3();return pg(5,"Ideal, estrés y mal condicionado","Mismas variables, distinta realidad de mercado.",`<div class="g2">${KS.map(k=>`<div class="card"><h2>${LB[k]}</h2><p>${SC[k].d}</p><p class="mu"><b>Parámetros:</b> ${SC[k].m}</p><button data-sc="${k}">Cargar escenario</button></div>`).join("")}</div>
<div class="card"><h2>Condicionamiento: κ(A) frente a κ(M⁻¹A)</h2>${bars(["Ideal","Bajo estrés","Mal cond."],[{n:"κ(A)",v:R.map(x=>x.r.kA)},{n:"κ(M⁻¹A)",v:R.map(x=>x.r.kP)}],{log:1})}<p class="mu">Escala logarítmica. El precondicionador de Jacobi reduce el número de condición, sobre todo cuando el problema nace de un mal escalamiento.</p></div>
<div class="card"><h2>Tabla comparativa</h2>${cmp(R)}</div>`)}],

["referencia","Solución de referencia",()=>{const R=calc();return pg(6,"El método directo: factorización de Cholesky","La solución contra la que se mide todo lo demás.",warn()+(R?`<div class="card"><h2>¿Es A simétrica y definida positiva?</h2><p>Máxima asimetría |aᵢⱼ − aⱼᵢ| = <b>${fx(R.sym)}</b> → <b class="ok">simétrica</b>. Autovalores entre <b>${fx(R.e[0])}</b> y <b>${fx(R.e[4])}</b>, todos positivos → <b class="ok">definida positiva</b> (${LB[S.cur]}).</p>
<p>Como A es SPD, existe A = LLᵀ con L triangular inferior. Se resuelve Lz = b y Lᵀβ = z por sustitución; es la solución numérica de referencia (clasificable como solución exacta salvo redondeo).</p></div>
<div class="card"><h2>β de referencia frente a β real simulado</h2>${bars(N,[{n:"β referencia (Cholesky)",v:R.ref},{n:"β real simulado",v:SC[S.cur].bt}])}<p class="mu">Las diferencias se deben al ruido muestral y a la regularización λ, no al algoritmo numérico.</p>
${tbl(["Factor","β referencia","β real simulado"],N.map((n,i)=>[n,R.ref[i].toFixed(5),SC[S.cur].bt[i]]))}</div>`:""))}],

["gcp","GCP frente a GC",()=>{const R=calc();return pg(7,"Gradientes Conjugados Precondicionado","El algoritmo de Suñagua (2020) frente al GC sin precondicionar.",warn()+`<div class="card"><h2>El algoritmo</h2><ol><li>r₀ = b − Ax₀; resolver Mz₀ = r₀; p₀ = z₀.</li><li>αₖ = rₖᵀzₖ / pₖᵀApₖ; xₖ₊₁ = xₖ + αₖpₖ; rₖ₊₁ = rₖ − αₖApₖ.</li><li>Resolver Mzₖ₊₁ = rₖ₊₁; βₖ = rₖ₊₁ᵀzₖ₊₁ / rₖᵀzₖ; pₖ₊₁ = zₖ₊₁ + βₖpₖ.</li><li>Parar cuando ‖rₖ‖₂/‖b‖₂ &lt; tol.</li></ol><p>M = diag(A) (Jacobi) corrige el mal escalamiento entre factores. ${scBar()}</p></div>`+(R?`<div class="card"><h2>Convergencia del residuo</h2>${lines([{n:"GCP ("+(S.o.pre?"Jacobi":"sin M")+")",v:R.gcp.hist},{n:"GC simple",v:R.gc.hist}],{tol:S.o.tol})}</div>
<div class="card">${tbl(["Método","β aproximado","Iteraciones","Residuo relativo","¿Convergió?"],[["GCP",vec(R.gcp.x),R.gcp.it,fx(R.gcp.res),yn(R.gcp.conv)],["GC simple",vec(R.gc.x),R.gc.it,fx(R.gc.res),yn(R.gc.conv)]])}<p class="mu">En n = 5, el GC converge en pocos pasos por su propiedad de terminación finita; la ventaja del precondicionador crece con el tamaño del sistema y con el mal condicionamiento.</p></div>`:""))}],

["errores","Análisis de errores",()=>{const R=calc();return pg(8,"¿Qué tan cerca está el GCP de la solución directa?","Errores por factor, residuo global y condicionamiento.",warn()+(R?`<div class="card"><h2>Errores por componente</h2>${tbl(["Factor","Ea","Er","Ep (%)"],R.ref.map((v,i)=>{const ea=Math.abs(v-R.gcp.x[i]);return[N[i],fx(ea,3),v==0?"no definido":fx(ea/Math.abs(v),3),v==0?"no definido":fx(100*ea/Math.abs(v),3)]}))}
<h2>Error absoluto por factor</h2>${bars(N,[{n:"Ea",v:R.ref.map((v,i)=>Math.abs(v-R.gcp.x[i]))}],{log:1})}</div>
<div class="g2"><div class="card"><h2>Residuo relativo global</h2><p style="font-size:1.6rem"><b>${fx(R.gcp.res,3)}</b></p><p class="mu">‖b − Ax‖₂ / ‖b‖₂, menor que la tolerancia ${fx(S.o.tol,0)}.</p></div>
<div class="card"><h2>Condicionamiento</h2><p>κ(A) = <b>${fx(R.kA)}</b><br>κ(M⁻¹A) = <b>${fx(R.kP)}</b></p><p class="mu">Un κ grande amplifica el error de datos en la solución; un residuo pequeño no garantiza un error pequeño si κ es alto.</p></div></div>`:""))}],

["qa","Pruebas de software",()=>pg(9,"Módulo de pruebas (QA)","Casos de prueba ejecutados en vivo con el código de la página.",`<div class="card">${qa()}</div><p class="mu">Las pruebas usan la tolerancia y el precondicionador configurados en el módulo 4.</p>`)],

["conclusiones","Conclusiones y referencias",()=>{const R=calc();return pg(10,"Qué aprendimos","Interpretación técnica y financiera.",`<div class="card"><h2>Resultado del escenario activo (${LB[S.cur]})</h2>${R?`<p>GCP convergió en <b>${R.gcp.it}</b> iteraciones (GC simple: <b>${R.gc.it}</b>), con κ(A) = ${fx(R.kA)} y κ(M⁻¹A) = ${fx(R.kP)}. Residuo relativo: ${fx(R.gcp.res)}.</p>`:warn()}</div>
<div class="card"><ul><li>El GCP resuelve los tres escenarios con residuo relativo menor que 10⁻⁶ y coincide con la solución directa de Cholesky.</li>
<li><b>Estrés:</b> más volatilidad y más correlación entre factores desplazan las β estimadas, pero κ(A) sigue moderado: cambió el punto de equilibrio, no se dañó el cálculo. Financieramente, en crisis el portafolio de IA se vuelve más dependiente del mercado y de los chips.</li>
<li><b>Mal condicionado:</b> colinealidad alta y escalas distintas elevan κ(A); Jacobi corrige la escala y reduce κ(M⁻¹A). Estadísticamente, factores casi redundantes vuelven inestables las β, y la regularización λ lo controla.</li>
<li>Limitaciones: datos simulados, n = 5 y precondicionador de Jacobi; con datos reales y más factores el contraste con Cholesky incompleto o SSOR sería más informativo.</li></ul></div>
<div class="card"><h2>Referencias</h2><p class="mu">Suñagua S., P. (2020). Método de Gradientes Conjugados Precondicionado. <i>Revista Boliviana de Matemática – UMSA, 04</i>, 2–7.<br>Golub, G. H. &amp; Van Loan, C. F. (2013). <i>Matrix Computations</i> (4.ª ed.). Johns Hopkins University Press.<br>Saad, Y. (2003). <i>Iterative Methods for Sparse Linear Systems</i> (2.ª ed.). SIAM.<br>Fama, E. &amp; French, K. (1993). <i>Journal of Financial Economics</i>, 33.<br>Carhart, M. (1997). <i>Journal of Finance</i>, 52.<br>Hoerl, A. &amp; Kennard, R. (1970). <i>Technometrics</i>, 12.</p></div>`)}]];

function go(){const id=(location.hash||"#inicio").slice(1),i=Math.max(0,V.findIndex(v=>v[0]==id)),el=$("#app");
document.querySelectorAll("#nav a").forEach((a,j)=>a.classList.toggle("on",j==i));
document.querySelectorAll(".chip").forEach(c=>c.classList.toggle("on",c.dataset.sc==S.cur));
let h;try{h=V[i][2]()}catch(e){h='<div class="warn">Error: '+e.message+"</div>"}
el.innerHTML=h;el.classList.remove("rv");void el.offsetWidth;el.classList.add("rv");V[i][3]&&V[i][3](el);
el.querySelectorAll("[data-n]").forEach(c=>{const t=+c.dataset.n,t0=performance.now();(function f(n){const q=Math.min((n-t0)/1200,1);c.textContent=Math.round(t*(1-Math.pow(1-q,3)));q<1&&requestAnimationFrame(f)})(t0)});
$("#pn").innerHTML=(i?`<a href="#${V[i-1][0]}">← ${V[i-1][1]}</a>`:"<span></span>")+(i<9?`<a href="#${V[i+1][0]}">${V[i+1][1]} →</a>`:"<span></span>");window.scrollTo(0,0)}
document.addEventListener("click",e=>{const k=e.target.dataset&&e.target.dataset.sc;if(k){load(k);go()}});
$("#nav").innerHTML=V.map((v,i)=>`<a href="#${v[0]}">${i+1}. ${v[1]}</a>`).join("");
$("#chips").innerHTML=KS.map(k=>`<button class="chip" data-sc="${k}">${LB[k]}</button>`).join("");
window.addEventListener("hashchange",go);go();
