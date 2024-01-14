
# Uppgift 4.25

En stång stöder mot cirkulär cylinder. Både stången och cylyndern har massan $m$. Friktionskoefficienterna är lika stora vid båda kontaktpunkterna (A och B). Hur stor måste friktionskoefficienten vara för att jämvikt för system ska gälla??

~~~
<canvas id="myCanvas1"></canvas>
<p> Friction: </p>
<input id="range1" name="range1" type="range" step="0.01" min="0" max="0.5" value="0.25">
<p> Angle: </p>
<input id="range_angle" type="range" step="1" min="8" max="17" value="12">
<script src="/uppgift1/mypixi8.js"></script>
~~~

---

Vi börjar med att göra en friläggning. I det här fallet behöver vi göra två friläggningar; en för stången och en för cylindern. Vi börjar med stången:

![image info](/assets/inkscape_raw3.svg)

Med en momentjämvikt kring infästningspunkten för stången, så kan vi fram ett uttryck för normalkraften $N_i$. 

\begin{equation*}
\rightarrow: \quad \frac{L}{2}mg \cos(\alpha) - NL = 0, \quad \Rightarrow \quad N = \frac{1}{2}mg \cos(\alpha)
\end{equation*}

~~~
<div class="card border-primary mb-3" style="max-width: 100%;">
  <div class="card-body text-primary">
    <h5 class="card-title">Observera</h5>
    <p class="card-text">Observera att det är "smart" att göra jämvikten kring denna punkten, för då kommer inte rekationskrafterna \(V_A\) och \(H_A\) in i momentekvationen. Vi skulle i dethär läget också kunna ställa upp vertikal och horisontel kraftjämvikt, men dessa kommer inte ge oss någon användbar information, då dessa kommer innehålla \(V_A\) och \(H_A\) (vilket vi i denna uppgift inte är intresserade av att räkna ut).</p>
  </div>
</div>
~~~

Vi går vidare till cylindern. Kraft och moment-jämvikt ger:

![image info](/assets/inkscape_raw.svg)

\begin{equation*}
\rightarrow: \quad N_g - N - mg\cos(\alpha) = 0
\end{equation*}
$$
\nearrow: \quad F_f + F_g - mg\sin(\alpha) = 0
$$
$$
\rightarrow: \quad F_f r - F_g r = 0
$$

Från momentekvationen kan vi se att friktionskrafterna måsta vara lika stora (för att jämvikt ska råda),

$$
F_f = F_g.
$$

Detta i sin tur gör att vi kan lösa ut en av friktionskrafterna från Ekvation:

$$
F_f + F_g - mg\sin(\alpha) = 0 \quad \Rightarrow \quad F_f = \frac{1}{2}mg\sin(\alpha) \quad (= F_g)
$$

Om vi stoppar in ekvation 7 i ekvation 4, så får vi att friktionskraften måste vara minst $\mu = \tan(\alpha)$ för att jämvikt ska råda. Med ett numeriskt värde på $\alpha=12^\circ$, så får vi att $\mu \approx 0.21$.

