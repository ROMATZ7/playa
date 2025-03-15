document.getElementById("empezar").addEventListener("click", () => {
  document.getElementById("instrucciones").style.display = "none";
  document.getElementById("juego").style.display = "block";
  iniciarJuego();
});

const tamaño = 7;
let mapa = [];
let jugador = {};
let barco = {};
let enemigos = [];
let vidas = 3;

const pistaElem = document.getElementById("pista");
const resultadoElem = document.getElementById("resultado");
const celdaVisible = document.getElementById("celda-visible");
const reiniciarBtn = document.getElementById("reiniciar");
const vidasElem = document.getElementById("vidas");

function iniciarJuego() {
  mapa = [];
  enemigos = [];
  vidas = 3;

  for (let y = 0; y < tamaño; y++) {
    mapa[y] = [];
    for (let x = 0; x < tamaño; x++) {
      mapa[y][x] = "libre";
    }
  }

  jugador.x = Math.floor(Math.random() * tamaño);
  jugador.y = Math.floor(Math.random() * tamaño);

  do {
    barco.x = Math.floor(Math.random() * tamaño);
    barco.y = Math.floor(Math.random() * tamaño);
  } while (barco.x === jugador.x && barco.y === jugador.y);

  while (enemiesColocados() < 5) {
    let ex = Math.floor(Math.random() * tamaño);
    let ey = Math.floor(Math.random() * tamaño);
    let key = `${ex},${ey}`;
    if (
      key !== `${jugador.x},${jugador.y}` &&
      key !== `${barco.x},${barco.y}` &&
      !enemigos.includes(key)
    ) {
      enemigos.push(key);
    }
  }

  pistaElem.textContent = "";
  resultadoElem.textContent = "";
  reiniciarBtn.style.display = "none";
  actualizarVidas();
  celdaVisible.textContent = "👨";

  document.addEventListener("keydown", mover);
  mostrarPista();
  document.getElementById("controles").style.display = "block";
}

function enemiesColocados() {
  return enemigos.length;
}

function actualizarVidas() {
  const corazones = "❤️".repeat(vidas) + "🖤".repeat(3 - vidas);
  vidasElem.textContent = `Vidas: ${corazones}`;
}

function mostrarPista() {
  const dx = Math.abs(jugador.x - barco.x);
  const dy = Math.abs(jugador.y - barco.y);
  const distancia = dx + dy;

  if (distancia === 0) {
    pistaElem.textContent = "🌊 ¡Has llegado a tu barco!";
  } else if (distancia <= 2) {
    pistaElem.textContent = "🌬️ Escuchas olas muy cerca...";
  } else if (distancia <= 4) {
    pistaElem.textContent = "👣 Huellas frescas en la arena...";
  } else {
    pistaElem.textContent = "🌫️ Silencio total... solo bruma.";
  }
}

function perder() {
  celdaVisible.textContent = "💀";
  pistaElem.textContent = "";
  resultadoElem.textContent = "¡Has sido atrapado por los pulpos! 🐙";
  reiniciarBtn.style.display = "inline-block";
  document.removeEventListener("keydown", mover);
}

function ganar() {
  document.body.innerHTML = `<div id="estrellaVictoria">🌙</div>`;
  document.removeEventListener("keydown", mover);
}

function mover(e) {
  const dir = e.key;
  let nuevaX = jugador.x;
  let nuevaY = jugador.y;

  if (dir === "ArrowUp") nuevaY--;
  else if (dir === "ArrowDown") nuevaY++;
  else if (dir === "ArrowLeft") nuevaX--;
  else if (dir === "ArrowRight") nuevaX++;
  else return;

  if (nuevaX < 0 || nuevaX >= tamaño || nuevaY < 0 || nuevaY >= tamaño) {
    pistaElem.textContent = "🪨 No puedes ir más allá...";
    return;
  }

  jugador.x = nuevaX;
  jugador.y = nuevaY;

  const clave = `${jugador.x},${jugador.y}`;

  if (enemigos.includes(clave)) {
    vidas--;
    actualizarVidas();
    if (vidas <= 0) {
      perder();
    } else {
      pistaElem.textContent = `💥 Un pulpo te ha atacado 🐙 ¡Te quedan ${vidas} vida(s)!`;
    }
  } else if (jugador.x === barco.x && jugador.y === barco.y) {
    ganar();
  } else {
    celdaVisible.textContent = "👨";
    mostrarPista();
  }
}

function moverDireccion(direccion) {
  mover({ key: direccion });
}

reiniciarBtn.addEventListener("click", iniciarJuego);
