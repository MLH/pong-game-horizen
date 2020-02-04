(() => {
  const STATE = { game: null };

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
      document.getElementById("result").innerHTML = result;
    }

    function updateResultInstructions(html) {
      document.getElementById("result-instructions").innerHTML = html;
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
        updateResultInstructions("");
        displayElement("prize-form");
      },
      displayLoss() {
        updateResult("Sorry, you lost!");
        updateResultInstructions("");
        hideElement("prize-form");
      },
      displaySuccessPrize(txUrl) {
        updateResult(`Your prize has been sent!`);
        updateResultInstructions(
          `Check the transaction here: <a href="${txUrl}">${txUrl}</a>}`
        );
        hideElement("prize-form");
      },
      updatePaymentInstructions(wallet) {
        const paymentInstructionsEl = document.getElementById(
          "payment-instructions"
        );

        const highlight = text => `<span class="highlight">${text}</span>`;

        paymentInstructionsEl.innerHTML = `Please transfer
        ${highlight("0.005 ZEN")} to
        ${highlight(wallet)}
        and provide your wallet address:`;
      },
      startGameForm() {
        const startGameButton = document.getElementById("start-game-button");
        startGameButton.addEventListener("click", async event => {
          event.preventDefault();

          const registeredGame = await API.createGame();
          const { gameWallet } = registeredGame;
          STATE.game = registeredGame;

          UI.updatePaymentInstructions(gameWallet);
          UI.hideResultsContainer();
          UI.hideGameContainer();
          UI.hideGameForm();
          UI.displayPaymentContainer();
        });
      },

      startPaymentForm() {
        const paymentForm = document.getElementById(
          "payment-confirmation-form"
        );
        const playerWalletInput = document.getElementById(
          "player-wallet-input"
        );
        const checkPaymentButton = document.getElementById(
          "check-payment-button"
        );

        paymentForm.addEventListener("submit", async function(event) {
          event.preventDefault();

          if (!paymentForm.checkValidity()) {
            paymentForm.reportValidity();
            return;
          }

          const playerWalletInput = document.getElementById(
            "player-wallet-input"
          );
          const { value: playerWallet } = playerWalletInput;
          checkPaymentButton.disabled = true;

          await API.updateGamePlayerWallet(STATE.game.id, playerWallet);

          const watchForPayment = async (mocked = false) => {
            const transactions = await API.listTransactions(STATE.game.id);
            const hasPaid = !!transactions.length;

            if (hasPaid || mocked) {
              checkPaymentButton.textContent = "We will start the game soon.";

              setTimeout(() => {
                UI.displayGameContainer();
                UI.hidePaymentContainer();
                startGame();
              }, 1000);
              return hasPaid;
            } else {
              checkPaymentButton.textContent = "Waiting for payment...";
              setTimeout(() => watchForPayment(true), 5000);
            }
          };

          watchForPayment(playerWallet);
        });
      },

      startPrizeForm() {
        const prizeForm = document.getElementById("prize-form");
        const redeemPrizeButton = document.getElementById(
          "redeem-prize-button"
        );
        const playerWalletInput = document.getElementById("prize-wallet-input");

        function validateForm(event) {
          if (prizeForm.checkValidity()) {
            checkPaymentButton.disabled = false;
          }
        }

        redeemPrizeButton.addEventListener("click", async event => {
          event.preventDefault();

          if (!prizeForm.checkValidity()) {
            prizeForm.reportValidity();
            return;
          }

          const playerWallet = playerWalletInput.value;

          const response = await API.updateGamePlayerWallet(
            STATE.game.id,
            playerWallet
          );

          const url = `https://explorer.horizen.global/tx/${response.transaction.txid}`;
          UI.displaySuccessPrize(url);
        });
      },

      startForms() {
        UI.startGameForm();
        UI.startPaymentForm();
        UI.startPrizeForm();
      },

      start() {
        UI.startForms();
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

  async function startGame() {
    var size = document.getElementById("size");
    var sound = document.getElementById("sound");

    var pong = Game.start("game", Pong, {
      sound: sound && sound.checked,
      eventHandlers: {
        end: async (message, { winner }) => {
          const updatedGame = await API.updateGameResult(STATE.game.id, winner);

          STATE.game = updatedGame;

          finishGame();
        }
      }
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
