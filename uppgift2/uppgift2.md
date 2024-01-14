
# Uppgift 4.25

En stege med massan $m = 10$ kg och längden $L = 4.0$ m står lutad mot en vägg. Hur stor får vinkeln $\varphi$ högst vara för att jämvikt skall vara möjlig, om friktionskoefficienten är 0.35 såväl vid väggen som vid golvet?

~~~
<canvas id="myCanvas1"></canvas>
<input id="range_friction" type="range" step="0.01" min="0" max="0.5" value="0.25">
<script src="/uppgift2/uppgift2.js"></script>
~~~

Vi börjar (som vanligt) med att frilägga och ställa upp jämvitkssamband:

$$
\rightarrow: \quad N_v - F_g = 0
$$
$$
\uparrow: \quad F_v - mg + Ng = 0
$$

$$
\nearrow: \quad F_v L \sin(\varphi) + N_v L \cos(\varphi) - mg\frac{L}{2}\sin(\varphi) = 0
$$

Utöver jämviktssamband så har vi även friktionsamband mellan normalkrafterna och friktionskrafterna. Allmänt så kan dessa friktionssamband skrivas som:

\begin{equation*}
|F_g| \leq \mu |N_g|, \qquad |F_v| \leq \mu |N_v|
\end{equation*}

Vi kan göra två förenklingar av ovanstående samband.

1. I vår friläggning ovan så har vi ritat ut friktionskrafterna och normalkrafterna åt rätt håll. Därför vet vi att $F_g$, $N_g$, $F_v$ och $N_v$ kommer vara positiva, och vi kan ta bort absolut-bellops tecknen.
2. Frågan efterfågar vid vilken vinkel $\varphi$ som stegen börjar glida. Vi är därför intresserade av gränsfallet då stegen precis börjar glida. När detta sker så kommer vi ha fullt utvecklad friktion, alltså så kan vi byta ut $\leq$ mot $=$.

Med dessa två förenklingar så säger friktionssambanden:

$$
F_g = \mu N_g
$$

$$
F_g = \mu N_g
$$

Vi har nu 5 obekanta ($\varphi$, $F_g$, $N_g$, $F_v$ och $N_v$) och 5 ekvationer. Vi har därför tillräckligt med ekvationer för att lösa ut $\varphi$. Så nu är det "bara" att lösa ut $\varphi$.




