const banmen = document.getElementById("banmen");

//tableのクリックした場所を取得
document.querySelectorAll("#banmen td").forEach(function(ban){
    ban.addEventListener("click",function(){
        if(!gameEnded){
            Osita(this);
        }
    })
})

let gameEnded = false;
let currentPlayer = "O";

//クリック処理
function Osita(Cell){
    if(Cell.classList.contains('pressed'))return;

    Cell.innerText = currentPlayer;
    Cell.classList.add('pressed');
    currentPlayer = currentPlayer === "O" ? "X" : "O";
    insertCharacter(currentPlayer);

    setTimeout(function(){
        CheckWin();
        CheckDraw();
    },0);
}


//tableの文字を入れる
function insertCharacter(c){
    let ban_moji = document.querySelectorAll('.moji');
   
    ban_moji.forEach(function(moji){
        moji.innerText= c;
    });

}

//リセットボタンクリック時
let Rb = document.getElementById("ResetButton");
Rb.addEventListener("click",Reset);

function Reset(){
    const cells = document.querySelectorAll('.pressed');
    cells.forEach(function(cell) {
        //cell内の文字を消す
        cell.innerText = '';
        //class pressedの削除
        cell.classList.remove('pressed');
        cell.removeAttribute('class');
        //spanを追加し文字を透明に
        cell.insertAdjacentHTML('beforeend', '<span class="moji"></span>');
    });

    gameEnded = false;

    // プレイヤーを初期状態に戻す
    currentPlayer = "O";
    insertCharacter(currentPlayer);
} 

//NewGameボタンクリック時
let NB = document.getElementById("NewGame");
NB.addEventListener("click",NewGame);
let drawMessage = document.getElementById("draw-message");
let victoryMessage = document.getElementById("victory-message");

function NewGame(){
    drawMessage.style.display = "none";
    victoryMessage.style.display = "none";
    NB.style.display = "none";

    init();
    Reset();
}


//勝利判定
function CheckWin() {
    const winningCombinations = [
        // 横方向の勝利パターン
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        // 縦方向の勝利パターン
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        // 斜め方向の勝利パターン
        [0, 4, 8],
        [2, 4, 6]
    ];

    // 関数を使って、同時勝利を判定する
    function checkCombination(combination) {
        const [a, b, c] = combination;
        const cellA = banmen.rows[Math.floor(a / 3)].cells[a % 3];
        const cellB = banmen.rows[Math.floor(b / 3)].cells[b % 3];
        const cellC = banmen.rows[Math.floor(c / 3)].cells[c % 3];

        if (cellA.classList.contains('pressed') &&
            cellB.classList.contains('pressed') &&
            cellC.classList.contains('pressed') &&
            cellA.innerText === cellB.innerText &&
            cellB.innerText === cellC.innerText) {
        //勝者の処理
        for (const cellIndex of combination) {
            const row = Math.floor(cellIndex / 3);
            const col = cellIndex % 3;
            const winningCell = banmen.rows[row].cells[col];
            winningCell.classList.add('winning-cell');
        }

        delay(cellA.innerText);
        gameEnded = true;
    }
    return false;
        
    }

    let winner = null;
    for (const combination of winningCombinations) {
        const result = checkCombination(combination);
        if (result) {
            if (winner) {
                // 既に勝者がいる場合、同時勝利と判定
                delay(result);
                gameEnded = true;
                return;
            }
            winner = result;
        }
    }

    if (winner) {
        // 勝者が1人の場合
        delay(winner);
        gameEnded = true;
    }
}



function CheckDraw() {
    // ゲームボードが全てのセルで埋まっているか確認
    let isDraw = true;
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            if (!banmen.rows[row].cells[col].classList.contains('pressed')) {
                // 未選択のセルがある場合、引き分けではない
                isDraw = false;
                break;
            }
        }
        if (!isDraw) {
            break;
        }
    }

    if (isDraw && !gameEnded) {
        // ゲーム終了
        setTimeout(displayDrawMessage,1000);
        gameEnded = false;
    }
}

function displayVictoryMessage(winner) {
    const winnerMessage = document.getElementById("winner-message");
  
    winnerMessage.textContent = winner + " が勝者です！";
    victoryMessage.style.display = "block";
    NB.style.display = "block";
    banmen.style.display = "none";
    Rb.style.display = "none";
  }
  
  function displayDrawMessage() {
    drawMessage.style.display = "block";
    NB.style.display = "block";
    banmen.style.display = "none";
    Rb.style.display = "none";
  }

  function delay(winner){
    setTimeout(displayVictoryMessage,1000,winner);
  }
  
function init(){
    //最初に行う処理を書く
    //ゲーム開始時にテーブルを表示する
    banmen.style.display = "inline-block";
    Rb.style.display = "inline-block";
    insertCharacter(currentPlayer);
}


init();