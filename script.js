// Регистрация Service Worker
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/service-worker.js").then(() => {
        console.log("Service Worker зарегистрирован");
    }).catch((error) => {
        console.error("Ошибка регистрации Service Worker:", error);
    });
}

// Логика для кнопки "Установить"
let deferredPrompt;

window.addEventListener("beforeinstallprompt", (event) => {
    // Предотвращаем автоматическое появление баннера
    event.preventDefault();
    // Сохраняем событие для последующего использования
    deferredPrompt = event;

    // Показываем пользовательскую кнопку
    const installButton = document.getElementById("install-button");
    installButton.style.display = "block"; // Делаем кнопку видимой
});

document.getElementById("install-button").addEventListener("click", () => {
    if (deferredPrompt) {
        // Показываем подсказку браузера
        deferredPrompt.prompt();

        // Ждём выбор пользователя
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === "accepted") {
                console.log("Пользователь установил приложение");
            } else {
                console.log("Пользователь отклонил установку");
            }
            deferredPrompt = null; // Очищаем сохранённое событие
        });
    }
});

// Логика игры
const players = [
    { name: "Макс", debuffs: [] },
    { name: "Димас", debuffs: [] },
    { name: "Серега", debuffs: [] },
    { name: "Вано", debuffs: [] }
];

const debuffList = [
    "Играть одной рукой",
    "Играть на перевернутом геймпаде",
    "Ни шагу назад",
    "Постоянно прыгать",
    "Умереть если умер сосед",
    "Без бонусов",
    "Пацифизм"
];

function getRandomDebuff(player) {
    let randomDebuff;
    do {
        randomDebuff = debuffList[Math.floor(Math.random() * debuffList.length)];
    } while (player.debuffs.includes(randomDebuff) && player.debuffs.length < debuffList.length);
    return randomDebuff;
}

function applyDebuffs(targetPlayer) {
    players.forEach(player => {
        if (player !== targetPlayer) {
            const newDebuff = getRandomDebuff(player);
            if (newDebuff && !player.debuffs.includes(newDebuff)) {
                player.debuffs.push(newDebuff);
            }
        }
    });
}

function resetPlayer(player) {
    player.debuffs = [];
    applyDebuffs(player);
    renderPlayers();
}

function resetAllPlayers() {
    players.forEach(player => {
        player.debuffs = [];
    });
    renderPlayers();
}

function renderPlayers() {
    const playersContainer = document.getElementById("players-container");
    playersContainer.innerHTML = "";
    players.forEach(player => {
        const playerDiv = document.createElement("div");
        playerDiv.className = "player";

        const playerName = document.createElement("h2");
        playerName.textContent = player.name;

        const debuffsContainer = document.createElement("div");
        debuffsContainer.className = "debuffs";
        player.debuffs.forEach(debuff => {
            const debuffSpan = document.createElement("span");
            debuffSpan.className = "debuff";
            debuffSpan.textContent = debuff;
            debuffsContainer.appendChild(debuffSpan);
        });

        const resetButton = document.createElement("button");
        resetButton.textContent = "Обнулить";
        resetButton.onclick = () => resetPlayer(player);

        playerDiv.appendChild(playerName);
        playerDiv.appendChild(debuffsContainer);
        playerDiv.appendChild(resetButton);

        playersContainer.appendChild(playerDiv);
    });
}

// Обработчик кнопки "Сбросить всех"
document.getElementById("reset-all").addEventListener("click", resetAllPlayers);

renderPlayers();