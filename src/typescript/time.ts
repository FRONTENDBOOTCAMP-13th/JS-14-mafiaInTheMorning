// 낮/밤을 타입을 정의
type Phase = 'day' | 'night';

const timeRemaining = document.getElementById('timer') as HTMLSpanElement;
const increaseBtn = document.getElementById('plusbtn') as HTMLButtonElement;
const decreaseBtn = document.getElementById('minusbtn') as HTMLButtonElement;

let currentPhase: Phase = 'day'; // 현재 시간 상태: 낮 or 밤
let time: number; // 남은 시간 (초)
let timerInterval: number;

// 낮/밤 전환 함수
function switchPhase(): void {
    // 이전 타이머 중단
    // setInterval()함수는 clearInterval() 함수를 호출하여 제거
    clearInterval(timerInterval);

    //밤/낮 , 시간 전환
    currentPhase = currentPhase === 'day' ? 'night' : 'day'; // 밤부터 시작
    time = currentPhase === 'day' ? 120 : 60; // 낮: 120초, 밤: 60초

    // 낮/밤 알림 업데이트
    if (currentPhase === 'day') {
        console.log('낮이 되었습니다☀️');
    } else {
        console.log('밤이 되었습니다🌙');
    }

    // 낮이면 버튼 활성화, 밤이면 비활성화
    if (currentPhase === 'day') {
        // HTMLButtonElement 속성 disabled 사용
        // 컨트롤이 비활성화되었는지 여부를 나타내는 부울 값, 클릭을 허용하지 않음.
        increaseBtn.disabled = false;
        decreaseBtn.disabled = false;
    } else {
        increaseBtn.disabled = true;
        decreaseBtn.disabled = true;
    }

    startTimer(); // 새로운 타이머 시작
}

//  타이머 실행 함수
function startTimer(): void {
    // 1초마다 실행 , setInterval 사용
    //  setInterval : 지정한 시간 간격마다 함수를 계속 반복 실행하는 JavaScript 내장 함수
    // setInterval(callback함수, 반복 간격(ms));
    timerInterval = setInterval(() => {
        time--; // 시간 감소
        timeRemaining.textContent = time.toString(); //타이머 숫자를 HTML 화면에 실시간으로 업데이트

        if (time <= 0) {
            switchPhase(); // 시간이 0이 되면 낮/밤 전환
        }
    }, 1000); // 1초마다
}

// +15초 버튼 클릭 이벤트(낮에만 발생)
increaseBtn.addEventListener('click', () => {
    if (currentPhase === 'day') {
        time += 15;
        timeRemaining.textContent = time.toString();
    }
});

//  -15초 버튼 클릭 이벤트(낮에만 & 15초 이상)
decreaseBtn.addEventListener('click', () => {
    if (currentPhase === 'day' && time >= 15) {
        time -= 15;
        timeRemaining.textContent = time.toString();
    }
});

//초기 실행 시 밤으로 시작
switchPhase();
