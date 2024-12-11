const gameContainer = document.getElementById('gameContainer');
const bird = document.getElementById('bird');
const scoreElement = document.getElementById('score');
const gameOverScreen = document.getElementById('gameOver');
const finalScoreElement = document.getElementById('finalScore');
const restartButton = document.getElementById('restartButton');

let birdPosition = gameContainer.clientHeight / 2;
let birdVelocity = 0;
const gravity = 0.5;
const jumpStrength = -10;

// Ajustes para aumentar a distância entre os tubos
const pipeWidth = 60;
const pipeGap = 150;
const pipeIntervalTime = 3000; // Tempo entre os canos em ms
const pipeSpeed = 2; // Velocidade dos canos em pixels por frame
let pipeTimer;

let pipes = [];
let score = 0;
let gameRunning = false;

// Função para iniciar o jogo
function startGame() {
    console.log('Iniciando o jogo...');
    
    // Resetar variáveis
    birdPosition = gameContainer.clientHeight / 2;
    birdVelocity = 0;
    bird.style.top = `${birdPosition}px`;
    bird.style.left = '50px'; 

    // Remover todas as pipes existentes
    document.querySelectorAll('.pipe').forEach(pipe => pipe.remove());
    pipes = [];

    // Resetar pontuação
    score = 0;
    scoreElement.textContent = `Pontuação: ${score}`;

    // Ocultar Game Over usando style.display
    gameOverScreen.style.display = 'none';
    console.log('Tela de Game Over escondida.');

    // Iniciar geração de canos com o novo intervalo
    clearInterval(pipeTimer); // Assegura que nenhum intervalo anterior esteja ativo
    pipeTimer = setInterval(createPipe, pipeIntervalTime);
    console.log('Geração de pipes iniciada.');

    // Iniciar loop do jogo
    gameRunning = true;
    requestAnimationFrame(gameLoop);
}

// Função para criar canos
function createPipe() {
    const pipeHeight = Math.floor(Math.random() * (gameContainer.clientHeight - pipeGap - 100)) + 50;

    const pipeTop = document.createElement('div');
    pipeTop.classList.add('pipe', 'top');
    pipeTop.style.height = `${pipeHeight}px`;
    pipeTop.style.left = `${gameContainer.clientWidth}px`;

    const pipeBottom = document.createElement('div');
    pipeBottom.classList.add('pipe', 'bottom');
    pipeBottom.style.height = `${gameContainer.clientHeight - pipeHeight - pipeGap}px`;
    pipeBottom.style.left = `${gameContainer.clientWidth}px`;

    gameContainer.appendChild(pipeTop);
    gameContainer.appendChild(pipeBottom);

    pipes.push({ top: pipeTop, bottom: pipeBottom, passed: false });
}

// Função de "flap" do pássaro
function flap() {
    birdVelocity = jumpStrength;
    console.log('Pássaro bateu as asas!');
}

// Função de atualização do pássaro
function updateBird() {
    birdVelocity += gravity;
    birdPosition += birdVelocity;
    bird.style.top = `${birdPosition}px`;
}

// Função de atualização das pipes
function updatePipes() {
    pipes.forEach(pipe => {
        let pipeLeft = parseInt(pipe.top.style.left);
        pipeLeft -= pipeSpeed; // Usar pipeSpeed para ajustar a velocidade
        pipe.top.style.left = `${pipeLeft}px`;
        pipe.bottom.style.left = `${pipeLeft}px`;

        // Detectar colisão
        const birdRect = bird.getBoundingClientRect();
        const topRect = pipe.top.getBoundingClientRect();
        const bottomRect = pipe.bottom.getBoundingClientRect();

        if (
            (birdRect.left < topRect.right &&
            birdRect.right > topRect.left &&
            (birdRect.top < topRect.bottom || birdRect.bottom > bottomRect.top))
        ) {
            console.log('Colisão detectada!');
            endGame();
        }

        // Atualizar pontuação
        const computedStyle = getComputedStyle(bird);
        const birdLeft = parseInt(computedStyle.left);
        const birdWidth = bird.clientWidth;
        const birdRight = birdLeft + birdWidth; 

        console.log(`pipeLeft: ${pipeLeft}, pipeWidth: ${pipeWidth}, birdRight: ${birdRight}`);

        if (!pipe.passed && (pipeLeft + pipeWidth) < birdRight) {
            pipe.passed = true;
            score++;
            scoreElement.textContent = `Pontuação: ${score}`;
            console.log(`Pontuação atual: ${score}`);
        }
    });

    // Remover canos que saíram da tela
    pipes = pipes.filter(pipe => {
        if (parseInt(pipe.top.style.left) + pipeWidth < 0) {
            pipe.top.remove();
            pipe.bottom.remove();
            return false;
        }
        return true;
    });
}

// Função de detecção de colisão com o chão e teto
function checkCollision() {
    if (birdPosition + bird.clientHeight / 2 > gameContainer.clientHeight || birdPosition - bird.clientHeight / 2 < 0) {
        console.log('Colisão com o chão ou teto!');
        endGame();
    }
}

// Função de fim de jogo
function endGame() {
    gameRunning = false;
    clearInterval(pipeTimer);
    gameOverScreen.style.display = 'flex'; // Mostrar Game Over
    finalScoreElement.textContent = `Pontuação Final: ${score}`;
    console.log('Game Over exibido.');
}

// Loop principal do jogo
function gameLoop() {
    if (!gameRunning) return;

    updateBird();
    updatePipes();
    checkCollision();

    requestAnimationFrame(gameLoop);
}

// Eventos de controle
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        flap();
    }
});

document.addEventListener('click', () => {
    flap();
});

restartButton.addEventListener('click', () => {
    console.log('Botão de reiniciar clicado.');
    startGame();
});

// Iniciar o jogo ao carregar a página
window.onload = startGame;
