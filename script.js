
const inputT = document.getElementById('inputT');
const inputV = document.getElementById('inputV');
const inputVText = document.getElementById('inputVText');
const consoleOutput = document.getElementById('consoleOutput');

const starField = document.getElementById('starField');
const engineFlame = document.getElementById('engineFlame');
const centerWarning = document.getElementById('centerWarning');

const earthHand = document.getElementById('earthHand');
const astroHand = document.getElementById('astroHand');
const earthDigital = document.getElementById('earthDigital');
const astroDigital = document.getElementById('astroDigital');
const astroCard = document.getElementById('astroCard');
const diffDisplay = document.getElementById('diffDisplay');

let t_pengamat = 0;
let t_astronot = 0;

function resetSimulasi() {
    t_pengamat = 0;
    t_astronot = 0;
    const v = parseFloat(inputV.value);
    updateClockUI(v);
}

inputV.addEventListener('input', () => {

    inputVText.value = parseFloat(inputV.value).toFixed(3);
    updateConsole();
});

inputVText.addEventListener('input', () => {
    let val = parseFloat(inputVText.value);
    if (val > 1.000) val = 1.000;
    if (val < 0) val = 0;
    if (!isNaN(val)) {
        inputV.value = val;
        updateConsole();
    }
});

function updateConsole() {
    const tAksen = parseFloat(inputT.value) || 0;
    const v = parseFloat(inputV.value);
    const c = 1.0;

    //Hitung Dilatasi Waktu
    //t = t' * sqrt(1 - v^2/c^2)
    let resultT = 0;
    let textOutput = "";
    let lorentz = 0;

    if (v > c) {
        textOutput = "Error: Kecepatan tidak boleh > c";
    } else {
        lorentz = Math.sqrt(1 - (v*v)/(c*c));
        resultT = tAksen * lorentz;
        textOutput = `
> v = ${v.toFixed(3)} c<br>
> t' (Jarak/Waktu Bumi) = ${tAksen} Tahun<br>
> -------------------------------------<br>
> <span style="color:${v >= 1.0 ? '#ff3333' : '#00ff41'}">t (Waktu Astronot) = ${resultT.toFixed(4)} Tahun</span>
        `;
    }

    consoleOutput.innerHTML = textOutput;
    return lorentz;
}

let lastTime = Date.now();
let starOffset = 0;

function animate() {
    const now = Date.now();
    const deltaTime = (now - lastTime) / 1000;
    lastTime = now;

    const v = parseFloat(inputV.value);
    let lorentz = Math.sqrt(Math.max(0, 1 - (v*v))); 
    t_pengamat += deltaTime;
    t_astronot += (deltaTime * lorentz);

    updateClockUI(v);

    const speedFactor = 1000 * v; 
    starOffset += (2 + speedFactor) * deltaTime;
    starField.style.backgroundPosition = `0 ${starOffset}px`;

    engineFlame.style.opacity = 0.3 + (v * 0.7);
    engineFlame.style.height = (40 + (v * 100)) + 'px';
    
    const shake = v > 0 ? Math.sin(now/100) * (v * 3) : 0;
    const container = document.querySelector('.ship-container');
    container.style.transform = `translate(calc(-50% + ${shake}px), -50%)`;

    requestAnimationFrame(animate);
}

function updateClockUI(v) {

    earthHand.style.transform = `translateX(-50%) rotate(${t_pengamat * 6}deg)`;
    astroHand.style.transform = `translateX(-50%) rotate(${t_astronot * 6}deg)`;

    earthDigital.innerText = formatTime(t_pengamat);

    if (v >= 1.0) {
        astroDigital.innerHTML = `
            <div class="warning-text">
                <i class="fas fa-exclamation-triangle warning-icon"></i>
                <span>PHYSICS<br>VIOLATION</span>
            </div>
        `;
        astroCard.classList.add('warning');
        centerWarning.classList.add('visible');
    } else {
        astroDigital.innerText = formatTime(t_astronot);
        astroCard.classList.remove('warning');
        centerWarning.classList.remove('visible');
    }

    const diff = Math.abs(t_pengamat - t_astronot);
    diffDisplay.innerText = formatTime(diff);
}

function formatTime(totalSeconds) {
    let m = Math.floor(totalSeconds / 60);
    let s = Math.floor(totalSeconds % 60);
    let ms = Math.floor((totalSeconds % 1) * 100); 
    
    return `${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}:${ms.toString().padStart(2,'0')}`;
}

inputT.addEventListener('input', updateConsole);

updateConsole();
animate();