const banmen = document.getElementById("banmen");

//tableのクリックした場所を取得
for(let x = 0;x<3;x++){
    for(let y=0;y<3;y++){
        const Click = banmen.rows[x].cells[y];
        Click.onclick = function(){
            //ゲームの勝者が決まった後か確認する。
            if(!gameEnded) {
                Osita(this);
            }
        }
    }
}

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
    // 横方向の勝利チェック

    let horizontalWinner = null;
    let verticalWinner = null;

    for (let row = 0; row < 3; row++) {
        const cell1 = banmen.rows[row].cells[0];
        const cell2 = banmen.rows[row].cells[1];
        const cell3 = banmen.rows[row].cells[2];

        if (cell1.classList.contains('pressed') && cell2.classList.contains('pressed') && cell3.classList.contains('pressed')) {
            if (cell1.innerText === cell2.innerText && cell2.innerText === cell3.innerText) {
                horizontalWinner = cell1.innerText;
                for (let i = 0; i < 3; i++) {
                    banmen.rows[row].cells[i].classList.add('winning-cell');
                }
            }
        }
    }


    // 縦方向の勝利チェック
    for (let col = 0; col < 3; col++) {
        const cell1 = banmen.rows[0].cells[col];
        const cell2 = banmen.rows[1].cells[col];
        const cell3 = banmen.rows[2].cells[col];

        if (cell1.classList.contains('pressed') && cell2.classList.contains('pressed') && cell3.classList.contains('pressed')) {
            if (cell1.innerText === cell2.innerText && cell2.innerText === cell3.innerText) {
                verticalWinner = cell1.innerText;
                for (let i = 0; i < 3; i++) {
                    banmen.rows[i].cells[col].classList.add('winning-cell');
                }

            }
        }
    }
    //縦横同時勝利の時の判定
    if(horizontalWinner && verticalWinner){
        let winner = horizontalWinner || verticalWinner;
        setTimeout(displayVictoryMessage,1000,winner);

        gameEnded = true;
    }else if(horizontalWinner){         //横方向の勝利の時
        let winner = horizontalWinner
        setTimeout(displayVictoryMessage,1000,winner);

        gameEnded = true;
    }else if(verticalWinner){           //縦方向の勝利の時
        let winner = verticalWinner
        setTimeout(displayVictoryMessage,1000,winner);

        gameEnded = true;
    }

    // 斜め方向の勝利チェック
    const cell1 = banmen.rows[0].cells[0];
    const cell2 = banmen.rows[1].cells[1];
    const cell3 = banmen.rows[2].cells[2];
    const cell4 = banmen.rows[0].cells[2];
    const cell5 = banmen.rows[1].cells[1];
    const cell6 = banmen.rows[2].cells[0];

    //左上から右下の勝利判定
    const diagonal1Winner = cell1.classList.contains('pressed') && cell2.classList.contains('pressed') && cell3.classList.contains('pressed') &&
    cell1.innerText === cell2.innerText && cell2.innerText === cell3.innerText;

    // 右上から左下の勝利判定
    const diagonal2Winner = cell4.classList.contains('pressed') && cell5.classList.contains('pressed') && cell6.classList.contains('pressed') &&
    cell4.innerText === cell5.innerText && cell5.innerText === cell6.innerText;

    if(diagonal1Winner && diagonal2Winner){
        let winner = cell5.innerText;
        for(let i = 0; i < 3; i++){
            banmen.rows[i].cells[i].classList.add('winning-cell'); // 左上から右下
            banmen.rows[i].cells[2 - i].classList.add('winning-cell'); // 右上から左下
        }
        setTimeout(displayVictoryMessage,1000,winner);
        gameEnded = true;
        return;
    }

    if (diagonal1Winner) {
        let winner = cell1.innerText;
        for (let i = 0; i < 3; i++) {
            banmen.rows[i].cells[i].classList.add('winning-cell'); // 左上から右下
        }
        setTimeout(displayVictoryMessage,1000,winner);
        gameEnded = true;
        return;
    }

    if (diagonal2Winner) {
        let winner = cell4.innerText;
        for (let i = 0; i < 3; i++) {
            banmen.rows[i].cells[2 - i].classList.add('winning-cell'); // 右上から左下
        }
        setTimeout(displayVictoryMessage,1000,winner);
        gameEnded = true;
        return;
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
  
function init(){
    //最初に行う処理を書く
    //ゲーム開始時にテーブルを表示する
    banmen.style.display = "inline-block";
    Rb.style.display = "inline-block";
    insertCharacter(currentPlayer);
}


init();