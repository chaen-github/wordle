const 정답 = "APPLE";

let attempts = 0; // 6번의 시도가 있으니 아래와 같은 의미 (몇번째 시도)
let index = 0; // 입력 후 다음 인덱스로 넘어가야하기 때문에 수정이 가능한 let으로 index = 0으로 함 (초기화 개념)
let timer;

function appStart() {
  // 키보드를 클릭했을 때 정답칸에 입력되는 이벤트
  const handleKeyboardClick = (event) => {
    console.log(event.target.dataset.key);
    const keyboardData = event.target.dataset.key;
    const thisBlock = document.querySelector(
      `.board-block[data-index='${attempts}${index}']` // 몇번째 시도, 몇번째 블럭(?)
    );

    if (keyboardData === "Backspace") {
      handleBackspace();
    } else if (keyboardData === "Enter") {
      index === 5 ? handleEnterKey() : null;
    } else if (index < 5) {
      thisBlock.innerText = keyboardData;
      index += 1;
    }
  };

  // 각 키보드에 이벤트 추가
  // for each 문으로 바꾸기
  const keyboardBlocks = document.querySelectorAll(`.keyboard-block`);
  console.log(keyboardBlocks);

  for (let i = 0; i < keyboardBlocks.length; i++) {
    keyboardBlocks[i].addEventListener("click", handleKeyboardClick);
  }

  const displayGameover = () => {
    const div = document.createElement("div");
    div.innerText = "게임이 종료됐습니다.";
    div.style =
      "display:flex; justify-content:center; align-items:center; position:absolute; top:35vh; left:50%; transform: translate(-50%, 0); background-color:white; opacity: 0.9; box-shadow: 0px 4px 13px -5px; font-size: 17px; width:200px; height:100px; border-radius: 10px;";
    document.body.appendChild(div);
  };
  const gameOver = () => {
    window.removeEventListener("keydown", handleKeydown);
    displayGameover();
    clearInterval(timer); // 게임이 끝났을 때 시간을 멈추는 초기화 해주는 이벤트
  };

  const nextLine = () => {
    if (attempts === 6) return gameOver();
    attempts += 1;
    index = 0;
  };

  // 정답을 확인하는 코드
  const handleEnterKey = async () => {
    let 맞은_갯수 = 0;

    // 서버에서 정답을 받아오는 코드
    //const 응답 = await fetch("/answer");
    // await=서버에서 서버로 요청을 보낸 다음 응답이 올때까지 기다리는 구문
    // 안넣으면 응답이 오지 않았는데 다음 코드가 실행됨 (에러남) / 응답을 선언한 것
    //const 정답 = await 응답.json();
    // 원하는 값만 추출하기 위해 json으로 바꾼 것 js에 맞는 포맷으로 바꿔준다

    for (let i = 0; i < 5; i++) {
      const block = document.querySelector(
        `.board-block[data-index='${attempts}${i}']`
      );

      const 입력한_글자 = block.innerText;
      const 정답_글자 = 정답[i];
      const keyblock = document.querySelector(
        `.keyboard-block[data-key='${입력한_글자}']`
      );

      if (입력한_글자 === 정답_글자) {
        맞은_갯수 += 1;
        block.style.background = "#6AAA64";
        keyblock.style.background = "#6AAA64";
      } else if (정답.includes(입력한_글자)) {
        block.style.background = "#C9B458";
        keyblock.style.background = "#C9B458";
      } else {
        block.style.background = "#787C7E";
        keyblock.style.background = "#787C7E";
      }
      block.style.color = "white";
      keyblock.style.color = "white";
    }
    if (맞은_갯수 === 5) gameOver();
    else nextLine();
  };

  // 백스페이스를 눌렀을 때 발생하는 이벤트
  const handleBackspace = () => {
    if (index > 0) {
      const preBlock = document.querySelector(
        `.board-block[data-index='${attempts}${index - 1}']`
      );
      preBlock.innerText = "";
    }
    if (index !== 0) index -= 1;
  };

  // 자판으로 키보드를 눌렀을 때 발생하는 이벤트
  const handleKeydown = (event) => {
    const key = event.key.toUpperCase(); // key안에 입력되는 값을 대문자로 변형해주는 것
    const keyCode = event.keyCode; // KeyCode안에 발생한 이벤트의 Keycode값을 넣어주는 것
    const thisBlock = document.querySelector(
      `.board-block[data-index='${attempts}${index}']` // 몇번째 시도, 몇번째 블럭(?)
    );

    if (event.key === "Backspace") handleBackspace();
    else if (index === 5) {
      if (event.key === "Enter") handleEnterKey();
      else return;
    } else if (65 <= keyCode && keyCode <= 90) {
      // a = 65 ~ z = 90이기 때문에 (알파벳 코드값이)
      thisBlock.innerText = key;
      index += 1; // 또는 index = index+1; , index++; 로 표현할 수 있다.
    }
  };

  const startTimer = () => {
    const 시작_시간 = new Date();

    function setTime() {
      const 현재_시간 = new Date();
      const 흐른_시간 = new Date(현재_시간 - 시작_시간);
      const 분 = 흐른_시간.getMinutes().toString().padStart(2, "0");
      const 초 = 흐른_시간.getSeconds().toString().padStart(2, "0");
      const gameTime = document.querySelector("#time");
      gameTime.innerText = `${분}:${초}`;
    }
    timer = setInterval(setTime, 1000);
  };

  startTimer();
  window.addEventListener("keydown", handleKeydown); // 키보드 자판을 눌렀을 때 발생하는 이벤트
}

appStart();
