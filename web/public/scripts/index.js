(() => {
  const STATE = { gameWallet: null, game: null };

  const UI = (() => {
    function hideElement(selector) {
      const el = document.getElementById(selector);
      el.classList.add("hidden");
    }

    function displayElement(selector) {
      const el = document.getElementById(selector);
      el.classList.remove("hidden");
    }

    function updateResult(result) {
      document.getElementById("result").textContent = result;
    }

    return {
      hideGameForm() {
        hideElement("game-form-container");
      },
      displayGameForm() {
        displayElement("game-form-container");
      },

      hideGameContainer() {
        hideElement("game-container");
      },
      displayGameContainer() {
        displayElement("game-container");
      },

      hidePaymentContainer() {
        hideElement("payment-container");
      },
      displayPaymentContainer() {
        displayElement("payment-container");
      },

      hideResultsContainer() {
        hideElement("results-container");
      },
      displayResultsContainer() {
        displayElement("results-container");
      },

      displayResultsContainer() {
        displayElement("results-container");
      },

      displayWin() {
        updateResult("Congratulations!!!");
        displayElement("prize-form");
      },
      displayLoss() {
        updateResult("Sorry, you lost!");
        hideElement("prize-form");
      },

      start() {
        const startGameButton = document.getElementById("start-game-button");
        const redeemPrizeButton = document.getElementById(
          "redeem-prize-button"
        );

        startGameButton.addEventListener("click", async event => {
          event.preventDefault();

          const gameWallet = await API.createWallet();
          const paymentInstructionsEl = document.getElementById(
            "payment-instructions"
          );
          const paymentStatusEl = document.getElementById("payment-status");

          UI.displayPaymentContainer();
          UI.hideResultsContainer();
          UI.hideGameContainer();
          UI.hideGameForm();

          paymentInstructionsEl.textContent = `Please transfer X Zens to ${gameWallet}`;

          const watchForPayment = async (gameWallet, mockPayment = false) => {
            const transactions = await API.listTransactions(gameWallet);
            const hasPaid = mockPayment; // TODO: implement logic to verify payment

            if (hasPaid) {
              paymentStatusEl.textContent = "We will start the game soon.";

              setTimeout(() => {
                UI.displayGameContainer();
                UI.hidePaymentContainer();
                startGame(gameWallet);
              }, 1000);
              return hasPaid;
            } else {
              paymentStatusEl.textContent = "Waiting for payment";
              setTimeout(() => watchForPayment(gameWallet, true), 1000);
            }
          };

          watchForPayment(gameWallet);
        });

        redeemPrizeButton.addEventListener("click", async event => {
          event.preventDefault();
          const playerWalletInputEl = document.getElementById(
            "player-wallet-input"
          );
          const playerWallet = playerWalletInputEl.value;

          API.updateGamePlayerWallet(STATE.game.id, playerWallet);
        });
      }
    };
  })();

  async function finishGame() {
    UI.hideGameContainer();

    const hasWon = STATE.game.result === 0;
    if (hasWon) {
      UI.displayWin();
    } else {
      UI.displayLoss();
    }

    UI.displayResultsContainer();
  }

  async function startGame(gameWallet) {
    const registeredGame = await API.createGame(gameWallet);
    STATE.game = registeredGame;

    var size = document.getElementById("size");
    var sound = document.getElementById("sound");

    var pong = Game.start("game", Pong, {
      sound: sound && sound.checked,
      eventHandlers: {
        end: async (message, { winner }) => {
          const updatedGame = await API.updateGameResult(
            registeredGame.id,
            gameWallet,
            winner
          );

          STATE.game = updatedGame;

          finishGame();
        }
      }
    });

    Game.addEvent(sound, "change", function() {
      pong.enableSound(sound.checked);
    });
  }

  function ready(fn) {
    if (document.readyState != "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  ready(() => {
    UI.start();
  });
})();
