const state = {
  cottonGrams: 0,
  money: 0,
  health: 100,
  energy: 100
};

const $ = (id) => document.getElementById(id);

const menu = $("menu");
const game = $("game");
const modal = $("modal");
const modalTitle = $("modalTitle");
const modalText = $("modalText");
const modalActions = $("modalActions");

function updateUI() {
  $("cotton").textContent = state.cottonGrams;
  $("money").textContent = state.money;
  $("health").textContent = state.health;
  $("energy").textContent = state.energy;
}

function showModal(title, text, actions = null) {
  modalTitle.textContent = title;
  modalText.textContent = text;
  modalActions.innerHTML = "";

  const buttons = actions || [
    { text: "OK", className: "primary" }
  ];

  buttons.forEach(({ text, className, onClick }) => {
    const button = document.createElement("button");
    button.textContent = text;
    if (className) button.className = className;
    button.addEventListener("click", () => {
      modal.classList.add("hidden");
      if (onClick) onClick();
    });
    modalActions.appendChild(button);
  });

  modal.classList.remove("hidden");
}

function resetGame() {
  state.cottonGrams = 0;
  state.money = 0;
  state.health = 100;
  state.energy = 100;
  updateUI();
}

function checkDeath() {
  if (state.health <= 0) {
    showModal("Конец игры", "Ты здох!", [
      {
        text: "В меню",
        className: "primary",
        onClick: () => {
          game.classList.add("hidden");
          menu.classList.remove("hidden");
          resetGame();
        }
      }
    ]);
  }
}

$("startBtn").addEventListener("click", () => {
  resetGame();
  menu.classList.add("hidden");
  game.classList.remove("hidden");
});

$("fartBtn").addEventListener("click", () => {
  showModal("Пук", "ПУКНУЛ!");
});

$("donateBtn").addEventListener("click", () => {
  showModal("Поддержка", "Раздел поддержки пока не настроен.");
});

$("collectBtn").addEventListener("click", () => {
  if (state.energy <= 0) {
    showModal("Нет энергии", "Нет энергии!");
    return;
  }

  if (state.health <= 0) {
    showModal("Плохо", "Ты в присмерте!");
    return;
  }

  state.cottonGrams += 50;
  state.energy -= 5;
  state.health -= 1;

  state.energy = Math.max(0, state.energy);
  state.health = Math.max(0, state.health);

  updateUI();
  checkDeath();
});

$("sellBtn").addEventListener("click", () => {
  if (state.cottonGrams < 1000) {
    showModal("Продажа", "Нужно минимум 1000 г хлопка.");
    return;
  }

  const kgToSell = Math.floor(state.cottonGrams / 1000);
  const earnings = kgToSell * 5;

  state.cottonGrams -= kgToSell * 1000;
  state.money += earnings;

  updateUI();
  showModal("Продано", \`Продано \${kgToSell} кг! +\${earnings}$\`);
});

$("restBtn").addEventListener("click", () => {
  state.energy = Math.min(100, state.energy + 25);
  state.health = Math.min(100, state.health + 2);

  updateUI();
  showModal("Отдых", "Отдохнул! Иди работай!");
});

$("shopBtn").addEventListener("click", () => {
  showModal("Магазин", "На обнове!");
});

$("giveUpBtn").addEventListener("click", () => {
  showModal("Сдаться?", "Ты чё хочешь сдаться?", [
    {
      text: "Да",
      className: "danger",
      onClick: () => {
        showModal("Конец", "Ты здох, лошок", [
          {
            text: "В меню",
            className: "primary",
            onClick: () => {
              game.classList.add("hidden");
              menu.classList.remove("hidden");
              resetGame();
            }
          }
        ]);
      }
    },
    {
      text: "Нет"
    }
  ]);
});

$("backBtn").addEventListener("click", () => {
  game.classList.add("hidden");
  menu.classList.remove("hidden");
});

updateUI();
