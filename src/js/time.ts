import '../style.css';
import { showText } from './chat/chatting';

// 낮/밤을 타입을 정의
export type Phase = 'day' | 'night';

const timeRemaining = document.getElementById('timer') as HTMLSpanElement;

export let currentPhase: Phase = 'day'; // 현재 시간 상태: 낮 or 밤
export let time: number; // 남은 시간 (초)
export let timerInterval: number;

// phase를 인자로 받아서 시작을 강제할 수 있게 수정
type StartPhase = 'day' | 'night';

// 낮/밤 전환 함수
export function switchPhase(startPhase?: StartPhase): void {
    // 이전 타이머 중단
    // setInterval()함수는 clearInterval() 함수를 호출하여 제거
    clearInterval(timerInterval);

    // 밤/낮 상태 전환
    if (startPhase) {
        // 서버에서 시작 phase가 지정되었을 경우 강제 설정
        currentPhase = startPhase;
    } else {
        currentPhase = currentPhase === 'day' ? 'night' : 'day';
    }

    time = currentPhase === 'day' ? 120 : 60; // 낮: 120초, 밤: 60초

    // 낮/밤 알림 업데이트
    let phaseMsg = '';
    if (currentPhase === 'day') {
        phaseMsg = '낮이 되었습니다☀️';
    } else if (currentPhase === 'night') {
        phaseMsg = '밤이 되었습니다🌙';
    }
    // 채팅창에 시스템 메시지 출력
    showText({
        action: 'chat',
        nickname: '사회자',
        msg: phaseMsg,
    });

    startTimer(); // 새로운 타이머 시작
}

// 타이머 실행 함수
export function startTimer(): void {
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

// 지목 투표 시작 (낮 끝난 뒤 15초)
export function startVoteSequence(): void {
    console.log('지목 투표 시작 (15초)');
    showText({
        action: 'chat',
        nickname: '사회자',
        msg: '지목 투표가 시작되었습니다. (15초)',
    });
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
export function startDefensePhase(): void {
    console.log('최후 변론 (10초)');
    showText({
        action: 'chat',
        nickname: '사회자',
        msg: '최후의 변론을 시작하세요. (10초)',
    });
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
export function finalVotePhase(): void {
    console.log('최종 찬반 투표 시작 (15초)');
    showText({
        action: 'chat',
        nickname: '사회자',
        msg: '최종 찬반 투표가 시작되었습니다. (15초)',
    });
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
