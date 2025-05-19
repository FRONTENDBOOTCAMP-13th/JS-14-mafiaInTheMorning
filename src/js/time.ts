import '../style.css';
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

// 타이머 실행 함수
function startTimer(): void {
    // 1초마다 실행 , setInterval 사용
    //  setInterval : 지정한 시간 간격마다 함수를 계속 반복 실행하는 JavaScript 내장 함수
    // setInterval(callback함수, 반복 간격(ms));
    timerInterval = setInterval(() => {
        time--; // 시간 감소
        timeRemaining.textContent = time.toString(); //타이머 숫자를 HTML 화면에 실시간으로 업데이트

        if (time <= 0) {
            clearInterval(timerInterval);

            // 낮이 끝나면 지목 - 최후 변론 - 찬반 투표 순으로 진행
            if (currentPhase === 'day') {
                startVoteSequence(); // 낮일 경우 투표 루트로 이동
            } else {
                switchPhase(); // 밤일 경우 바로 낮으로 전환
            }
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

// -15초 버튼 클릭 이벤트(낮에만 & 15초 이상)
decreaseBtn.addEventListener('click', () => {
    if (currentPhase === 'day' && time >= 15) {
        time -= 15;
        timeRemaining.textContent = time.toString();
    }
});

// 지목 투표 시작 (낮 끝난 뒤 15초)
function startVoteSequence(): void {
    console.log('지목 투표 시작 (15초)');
    time = 15;
    timeRemaining.textContent = time.toString();

    const voteInterval = setInterval(() => {
        time--;
        timeRemaining.textContent = time.toString();

        if (time <= 0) {
            clearInterval(voteInterval);
            startDefensePhase(); // 최후 변론으로
        }
    }, 1000);
}

// 최후 변론 (10초)
function startDefensePhase(): void {
    console.log('최후 변론 (10초)');
    time = 10;
    timeRemaining.textContent = time.toString();

    const defenseInterval = setInterval(() => {
        time--;
        timeRemaining.textContent = time.toString();

        if (time <= 0) {
            clearInterval(defenseInterval);
            finalVotePhase(); // 찬반 투표로
        }
    }, 1000);
}

// 찬반 투표 (15초)
function finalVotePhase(): void {
    console.log('최종 찬반 투표 시작 (15초)');
    time = 15;
    timeRemaining.textContent = time.toString();

    const finalVoteInterval = setInterval(() => {
        time--;
        timeRemaining.textContent = time.toString();

        if (time <= 0) {
            clearInterval(finalVoteInterval);
            switchPhase(); // 최종 투표 종료 후 밤 시작
        }
    }, 1000);
}

// 초기 실행 시 밤으로 시작
switchPhase(); // 밤 시작 후 낮 - 지목 - 변론 - 찬반 투표 - 밤 순환
