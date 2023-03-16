const player = (sign) => {
  this.sign = sign;

  const getSign = () => {
    return sign;
  };
  return { getSign };
};

const gameBoard = (() => {
  const layout = ["", "", "", "", "", "", "", "", ""];

  const getBox = (index) => {
    if (index > layout.length) return;
    return layout[index];
  };

  const setBox = (index, sign) => {
    if (index > layout.length) return;
    layout[index] = sign;
  };

  const resetLayout = () => {
    for (let i = 0; i < layout.length; i++) {
      layout[i] = "";
    }
  };

  return { getBox, setBox, resetLayout };
})();

const displayController = (() => {
  const boxes = document.querySelectorAll(".game-box");
  const restart = document.querySelector(".restart");
  const Message = document.querySelector(".game-text");

  boxes.forEach((box) => {
    box.addEventListener("click", (e) => {
      if (gameController.getGameOver() || e.target.textContent !== "") return;
      gameController.playRound(parseInt(e.target.dataset.index));
      updateGameBoard();
      e.target.classList.remove("game-box");
    });
  });

  restart.addEventListener("click", (e) => {
    boxes.forEach((box) => {
      box.classList.add("game-box");
    });
    gameBoard.resetLayout();
    gameController.resetGame();
    updateGameBoard();
    displayMessage(`Player X's turn`);
  });
  const updateGameBoard = () => {
    for (let i = 0; i < boxes.length; i++) {
      boxes[i].textContent = gameBoard.getBox(i);
    }
  };

  const setFinalMessage = (player) => {
    if (player === "Tie") {
      displayMessage("It's a tie!");
    } else {
      displayMessage(`Player ${player} has won the game!`);
    }
  };

  const displayMessage = (message) => {
    Message.textContent = message;
  };

  return { setFinalMessage, displayMessage };
})();

const gameController = (() => {
  const player1 = player("X");
  const player2 = player("O");
  let round = 1;
  let gameOver = false;

  const playRound = (boxIndex) => {
    gameBoard.setBox(boxIndex, getPlayerSign());
    if (checkWinner(boxIndex)) {
      displayController.setFinalMessage(getPlayerSign());
      gameOver = true;
      return;
    }
    if (round === 9) {
      displayController.setFinalMessage("Tie");
      gameOver = true;
      return;
    }
    round++;
    displayController.displayMessage(`Player ${getPlayerSign()}'s turn`);
  };

  const getPlayerSign = () => {
    return round % 2 === 0 ? player2.getSign() : player1.getSign();
  };

  const checkWinner = (boxIndex) => {
    const winCriteria = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    return winCriteria
      .filter((combination) => combination.includes(boxIndex))
      .some((possibleCombination) =>
        possibleCombination.every(
          (index) => gameBoard.getBox(index) === getPlayerSign()
        )
      );
  };

  const getGameOver = () => {
    return gameOver;
  };

  const resetGame = () => {
    round = 1;
    gameOver = false;
  };

  return { playRound, getGameOver, resetGame };
})();
