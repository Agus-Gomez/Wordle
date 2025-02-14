var height = 6; // number of guesses
var width = 5; // length of the word

var row = 0; // current guess (attempt)
var col = 0; //current letter for that attempt

var gameOver = false;

var wordList = [
  "lindo",
  "linda",
  "dulce",
  "novio",
  "teamo",
  "besos",
  "novia",
  "adoro",
  "vidas",
  "gusta",
  "cielo",
  "amado",
  "amada",
];
var guessList = [];
guessList = guessList.concat(wordList);

var word = wordList[Math.floor(Math.random() * wordList.length)].toUpperCase();

window.onload = function () {
  initialize();
};

function initialize() {
  // Create the game board
  for (let r = 0; r < height; r++) {
    for (let c = 0; c < width; c++) {
      // <span id="0-0" class="tile">P</span>
      let tile = document.createElement("span");
      tile.id = r.toString() + "-" + c.toString();
      tile.classList.add("tile");
      tile.innerText = "";
      document.getElementById("board").appendChild(tile);
    }
  }

  // Create the key board
  let keyboard = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L", " "],
    ["Enter", "Z", "X", "C", "V", "B", "N", "M", "⌫"],
  ];

  for (let i = 0; i < keyboard.length; i++) {
    let currRow = keyboard[i];
    let keyboardRow = document.createElement("div");
    keyboardRow.classList.add("keyboard-row");

    for (let j = 0; j < currRow.length; j++) {
      let keyTile = document.createElement("div");

      let key = currRow[j];
      keyTile.innerText = key;
      if (key == "Enter") {
        keyTile.id = "Enter";
      } else if (key == "⌫") {
        keyTile.id = "Backspace";
      } else if ("A" <= key && key <= "Z") {
        keyTile.id = "Key" + key; // "Key" + "A";
      }

      keyTile.addEventListener("click", processKey);

      if (key == "Enter") {
        keyTile.classList.add("enter-key-tile");
      } else {
        keyTile.classList.add("key-tile");
      }
      keyboardRow.appendChild(keyTile);
    }
    document.body.appendChild(keyboardRow);
  }

  // Listen for Key Press
  document.addEventListener("keyup", (e) => {
    processInput(e);
  });
}

function processKey() {
  e = { code: this.id };
  processInput(e);
}

function processInput(e) {
  if (gameOver) return;

  // alert(e.code);
  if ("KeyA" <= e.code && e.code <= "KeyZ") {
    if (col < width) {
      let currTile = document.getElementById(
        row.toString() + "-" + col.toString()
      );
      if (currTile.innerText == "") {
        currTile.innerText = e.code[3];
        col += 1;
      }
    }
  } else if (e.code == "Backspace") {
    if (0 < col && col <= width) {
      col -= 1;
    }
    let currTile = document.getElementById(
      row.toString() + "-" + col.toString()
    );
    currTile.innerText = "";
  } else if (e.code == "Enter") {
    update();
  }
  //the word was not guessed
  if (!gameOver && row == height) {
    gameOver = true;
    Swal.fire({
      title: "¡Lo siento! la palabra era " + "'" + word + "'",
      html: "Como premio consuelo una caja de chocolates estará llegando a tu casa. <br>pero como no acertaste tu castigo será enviarme un audio cantando.<br>¡Lo espero con ansias!💕",
      imageUrl: "/images/karaoke.png",
      imageAlt: "Custom image",
      padding: "3em",
      customClass: {
        image: "karaoke-image",
      },
    });
  }
}

function update() {
  let guess = "";
  document.getElementById("answer").innerText = "";

  //string up the guesses into the word
  for (let c = 0; c < width; c++) {
    let currTile = document.getElementById(row.toString() + "-" + c.toString());
    let letter = currTile.innerText;
    guess += letter;
  }

  guess = guess.toLowerCase(); //case sensitive

  if (!guessList.includes(guess)) {
    document.getElementById("answer").innerText = "No está en la lista";
    return;
  }

  //start processing guess
  let correct = 0;

  let letterCount = {}; //keep track of letter frequency, ex) KENNY -> {K:1, E:1, N:2, Y: 1}
  for (let i = 0; i < word.length; i++) {
    let letter = word[i];

    if (letterCount[letter]) {
      letterCount[letter] += 1;
    } else {
      letterCount[letter] = 1;
    }
  }

  //first iteration, check all the correct ones first
  for (let c = 0; c < width; c++) {
    let currTile = document.getElementById(row.toString() + "-" + c.toString());
    let letter = currTile.innerText;

    //Is it in the correct position?
    if (word[c] == letter) {
      currTile.classList.add("correct");

      let keyTile = document.getElementById("Key" + letter);
      keyTile.classList.remove("present");
      keyTile.classList.add("correct");

      correct += 1;
      letterCount[letter] -= 1; //deduct the letter count
    }

    if (correct == width) {
      gameOver = true;
      Swal.fire({
        title: "¡Felicidades, acertaste!",
        html: "Como premio una caja de chocolates estará llegando a tu casa.<br>a demás de tener una cita viendo la película que gustes💕",
        imageUrl: "/images/cinema.png",
        imageAlt: "Custom image",
        padding: "3em",
        backdrop: `
            url("https://i.gifer.com/2eSd.gif")
            center center
            fixed
          `,
        customClass: {
          image: "karaoke-image",
        },
      });
    }
  }

  //go again and mark which ones are present but in wrong position
  for (let c = 0; c < width; c++) {
    let currTile = document.getElementById(row.toString() + "-" + c.toString());
    let letter = currTile.innerText;

    // skip the letter if it has been marked correct
    if (!currTile.classList.contains("correct")) {
      //Is it in the word?         //make sure we don't double count
      if (word.includes(letter) && letterCount[letter] > 0) {
        currTile.classList.add("present");

        let keyTile = document.getElementById("Key" + letter);
        if (!keyTile.classList.contains("correct")) {
          keyTile.classList.add("present");
        }
        letterCount[letter] -= 1;
      } // Not in the word or (was in word but letters all used up to avoid overcount)
      else {
        currTile.classList.add("absent");
        let keyTile = document.getElementById("Key" + letter);
        keyTile.classList.add("absent");
      }
    }
  }

  row += 1; //start new row
  col = 0; //start at 0 for new row
}
